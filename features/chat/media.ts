import { createClient } from "@/lib/supabase/client";

// chat-media RLS requires the object's first path segment to equal the
// chat_id the uploader is a participant of (see chat_media_insert_participant
// policy), so every path here MUST start with `${chatId}/`.
export async function uploadChatMedia(chatId: string, file: File): Promise<string> {
  const supabase = createClient();
  const ext = file.name.split(".").pop() || "bin";
  const path = `${chatId}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from("chat-media").upload(path, file, {
    upsert: false,
    contentType: file.type,
  });
  if (error) throw error;
  return path;
}

// Bucket is private - resolve a stored path to a short-lived signed URL for
// display. Cached per-call by the caller (MessageBubble) since messages
// rarely change media_url after creation.
export async function getChatMediaSignedUrl(path: string): Promise<string | null> {
  const supabase = createClient();
  const { data, error } = await supabase.storage.from("chat-media").createSignedUrl(path, 3600);
  if (error) return null;
  return data.signedUrl;
}
