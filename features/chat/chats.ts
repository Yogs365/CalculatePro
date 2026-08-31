import { createClient } from "@/lib/supabase/client";
import type { ChatSummary } from "@/lib/supabase/types";

// Fetches the current user's chat list (one row per chat, already sorted by
// recency by the RPC) via get_my_chats(). Never query chats/messages tables
// directly - RLS makes it possible but the RPC does the participant + unread
// join work correctly in one round trip.
export async function getMyChats(): Promise<ChatSummary[]> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("get_my_chats");
  if (error) throw error;
  return (data as ChatSummary[]) ?? [];
}

// Resolves (or creates) the 1:1 chat with another user, via
// get_or_create_direct_chat(). Used when tapping a contact from /kontak.
export async function getOrCreateDirectChat(otherUserId: string): Promise<string> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("get_or_create_direct_chat", {
    p_other_user_id: otherUserId,
  });
  if (error) throw error;
  return data as string;
}
