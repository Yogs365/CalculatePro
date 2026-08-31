import { createClient } from "@/lib/supabase/client";
import type { Message, MessageType } from "@/lib/supabase/types";

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


/**
 * Tandai semua pesan dalam chat sebagai sudah dibaca.
 * Status:
 * delivered -> read
 */
export async function markChatRead(chatId: string): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase.rpc("mark_chat_read", {
    p_chat_id: chatId,
  });

  if (error) throw error;
}


/**
 * BARU:
 * Tandai pesan masuk sebagai diterima.
 *
 * Alur:
 * sent
 * ↓
 * delivered
 * ↓
 * read
 */
export async function markMessageDelivered(messageId: string): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase
    .from("messages")
    .update({
      status: "delivered",
    })
    .eq("id", messageId)
    .neq("status", "read");

  if (error) throw error;
}


/**
 * Subscribe realtime pesan.
 */
export function subscribeToChatMessages(
  chatId: string,
  onInsert: (message: Message) => void,
): () => void {
  const supabase = createClient();

  const channel = supabase
    .channel(`messages:${chatId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `chat_id=eq.${chatId}`,
      },
      (payload) => {
        onInsert(payload.new as Message);
      },
    )
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "messages",
        filter: `chat_id=eq.${chatId}`,
      },
      (payload) => {
        onInsert(payload.new as Message);
      },
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
