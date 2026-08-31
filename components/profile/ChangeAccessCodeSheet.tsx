import { createClient } from "@/lib/supabase/client";

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

// ⚠️ Sekarang lewat Edge Function, bukan RPC — supaya auth.users
// (kredensial login sesungguhnya) DAN user_access_codes (untuk
// verifyMyAccessCode/hasCustomAccessCode) selalu sinkron.
export async function setMyAccessCode(newCode: string): Promise<ActionResult> {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return { success: false, error: "Tidak ada sesi login" };

  const { data, error } = await supabase.functions.invoke("change-access-code", {
    body: { new_code: newCode },
  });
  if (error) return { success: false, error: error.message };
  if (data?.error) return { success: false, error: data.error };
  return { success: true };
}

export async function resetMyAccessCode(): Promise<ActionResult> {
  const supabase = createClient();
  const { error } = await supabase.rpc("reset_my_access_code");
  if (error) return { success: false, error: error.message };
  return { success: true };
}
