export type UserRole = "admin" | "member";

export interface Profile {
  id: string;
  display_name: string;
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  last_seen_at: string | null;
}

export interface ContactRow {
  user_id: string;
  display_name: string;
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
  is_online: boolean;
  last_seen_at: string | null;
  is_blocked_by_me: boolean;
  has_blocked_me: boolean;
}

export type MessageType = "text" | "image" | "video" | "audio" | "file" | "voice_note";
export type MessageStatus = "pending" | "sent" | "delivered" | "read" | "failed";

// Row shape returned by the get_my_chats() RPC - one row per chat the
// current user participates in, pre-joined with the other participant
// (for direct chats) and an unread count.
export interface ChatSummary {
  chat_id: string;
  is_group: boolean;
  chat_name: string | null;
  avatar_url: string | null;
  other_user_id: string | null;
  is_online: boolean;
  last_message_content: string | null;
  last_message_type: MessageType | null;
  last_message_at: string | null;
  unread_count: number;
}

// Matches the public.messages table (get_messages()/send_message() both
// return rows shaped exactly like this).
export interface Message {
  id: string;
  client_id: string;
  chat_id: string;
  sender_id: string;
  content: string | null;
  message_type: MessageType;
  media_url: string | null;
  reply_to_id: string | null;
  status: MessageStatus;
  created_at: string;
  edited_at: string | null;
  deleted_at: string | null;
}
