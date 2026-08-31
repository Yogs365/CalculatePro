import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/supabase/types";

// Any authenticated user can SELECT from profiles (RLS: profiles_select_authenticated),
// so admin listing is a plain table query - no dedicated RPC needed. We sort
// admins first, then by name, so the dashboard reads predictably.
export async function listAllUsers(): Promise<Profile[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("role", { ascending: true })
    .order("display_name", { ascending: true });

  if (error) throw error;
  return (data as Profile[]) ?? [];
}

// Uploads an avatar for a not-yet-existing contact into a "pending/" prefix
// (the real user id doesn't exist until register-contact runs). Returns the
// storage path to pass through as avatar_url.
export async function uploadPendingAvatar(file: File): Promise<string> {
  const supabase = createClient();
  const ext = file.name.split(".").pop() || "jpg";
  const path = `pending/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from("avatars").upload(path, file, {
    upsert: false,
    contentType: file.type,
  });

  if (error) throw error;
  return path;
}

// Storage bucket "avatars" is private; generate a short-lived signed URL to
// actually display an image referenced by its stored path.
export async function getAvatarSignedUrl(path: string | null): Promise<string | null> {
  if (!path) return null;
  const supabase = createClient();
  const { data, error } = await supabase.storage.from("avatars").createSignedUrl(path, 3600);
  if (error) return null;
  return data.signedUrl;
}
