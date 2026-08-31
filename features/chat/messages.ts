import { createClient } from "@/lib/supabase/client";
import type { Message, MessageType } from "@/lib/supabase/types";

// Loads a page of messages for a chat room, oldest-first for rendering.
// get_messages() returns newest-first (for "load older" pagination), so we
// reverse before handing back to the UI.
export async function getMessages(chatId: string, before?: string): Promise<Message[]> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("get_messages", {
    p_chat_id: chatId,
    p_before: before ?? null,
    p_limit: 30,
  });
  if (error) throw error;
  return ((data as Message[]) ?? []).slice().reverse();
}

// Sends a message via send_message(). p_client_id lets the UI reconcile its
// optimistic bubble with the realtime INSERT echo (same message, two
// deliveries: the RPC response here, and the realtime event on other
// devices/tabs).
export async function sendMessage(params: {
  clientId: string;
  chatId: string;
  content: string;
  messageType?: MessageType;
  mediaUrl?: string | null;
  replyToId?: string | null;
}): Promise<Message> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("send_message", {
    p_client_id: params.clientId,
    p_chat_id: params.chatId,
    p_content: params.content,
    p_message_type: params.messageType ?? "text",
    p_media_url: params.mediaUrl ?? null,
    p_reply_to_id: params.replyToId ?? null,
  });
  if (error) throw error;
  return data as Message;
}

// Marks a chat as read up to now (clears unread badge, flips ✓✓ to blue for
// the other participant via message_events).
export async function markChatRead(chatId: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.rpc("mark_chat_read", { p_chat_id: chatId });
  if (error) throw error;
}

// Subscribes to new messages inserted into a chat. Returns an unsubscribe
// function. Realtime replication must be enabled on public.messages for this
// to fire (Database > Replication in the Supabase dashboard).
export function subscribeToChatMessages(
  chatId: string,
  onInsert: (message: Message) => void,
): () => void {
  const supabase = createClient();
  const channel = supabase
    .channel(`messages:${chatId}`)
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "messages", filter: `chat_id=eq.${chatId}` },
      (payload) => onInsert(payload.new as Message),
    )
    .on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "messages", filter: `chat_id=eq.${chatId}` },
      (payload) => onInsert(payload.new as Message),
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
