import { createClient } from "@/lib/supabase/client"; // sesuaikan dengan path client Supabase kamu

type ActionResult = { success: true } | { success: false; error: string };

export async function hasCustomAccessCode(): Promise<boolean> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("has_custom_access_code");
  if (error) return false;
  return Boolean(data);
}

export async function verifyMyAccessCode(inputCode: string): Promise<boolean> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("verify_my_access_code", {
    input_code: inputCode,
  });
  if (error) return false;
  return Boolean(data);
}

export async function setMyAccessCode(newCode: string): Promise<ActionResult> {
  const supabase = createClient();
  const { error } = await supabase.rpc("set_my_access_code", { new_code: newCode });
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function resetMyAccessCode(): Promise<ActionResult> {
  const supabase = createClient();
  const { error } = await supabase.rpc("reset_my_access_code");
  if (error) return { success: false, error: error.message };
  return { success: true };
}
