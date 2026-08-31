import { createClient } from "@/lib/supabase/client";

export interface UpdateProfileInput {
  displayName: string;
  username: string | null;
  bio: string | null;
}

// profiles has an RLS policy (profiles_update_own: id = auth.uid()) letting
// a user update their own row directly - no RPC needed for these fields.
export async function updateMyProfile(userId: string, input: UpdateProfileInput): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      display_name: input.displayName.trim(),
      username: input.username?.trim() || null,
      bio: input.bio?.trim() || null,
    })
    .eq("id", userId);

  if (error) throw error;
}

// Uploads a new avatar for the CURRENT (already-registered) user into the
// private "avatars" bucket under their own uid, then points profiles.avatar_url
// at the new storage path. Old file is left in place (harmless orphan) to
// keep this simple and avoid extra failure modes.
export async function updateMyAvatar(userId: string, file: File): Promise<string> {
  const supabase = createClient();
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${userId}/${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage.from("avatars").upload(path, file, {
    upsert: false,
    contentType: file.type,
  });
  if (uploadError) throw uploadError;

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ avatar_url: path })
    .eq("id", userId);
  if (updateError) throw updateError;

  return path;
}
