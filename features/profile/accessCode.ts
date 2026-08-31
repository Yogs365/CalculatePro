import { createClient } from "@/lib/supabase/client";

// Sets a custom personal login code (3-8 digits, validated server-side by
// set_my_access_code itself). Replaces whatever code the user had.
export async function setMyAccessCode(newCode: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();
  const { error } = await supabase.rpc("set_my_access_code", { new_code: newCode });
  if (error) return { success: false, error: error.message };
  return { success: true };
}

// Reverts to the code that was originally assigned at registration.
export async function resetMyAccessCode(): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();
  const { error } = await supabase.rpc("reset_my_access_code");
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function hasCustomAccessCode(): Promise<boolean> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("has_custom_access_code");
  if (error) return false;
  return Boolean(data);
}
