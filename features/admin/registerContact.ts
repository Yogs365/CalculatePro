import { createClient } from "@/lib/supabase/client";

export interface RegisterContactInput {
  adminCode: string;
  name: string;
  accessCode: string;
  avatarUrl?: string | null;
}

export interface RegisterContactResult {
  success: boolean;
  error?: string;
  userId?: string;
}

// Calls the register-contact Edge Function (service role on the backend).
// The browser never touches auth.users directly. admin_code is the shared
// gate code (default "123", changeable via set_admin_code by an admin);
// access_code is the brand-new contact's own personal login code.
export async function registerContact(input: RegisterContactInput): Promise<RegisterContactResult> {
  const supabase = createClient();

  const { data, error } = await supabase.functions.invoke("register-contact", {
    body: {
      admin_code: input.adminCode,
      name: input.name,
      access_code: input.accessCode,
      avatar_url: input.avatarUrl ?? null,
    },
  });

  if (error) {
    const message = await extractFunctionErrorMessage(error);
    return { success: false, error: message ?? "Gagal mendaftarkan kontak" };
  }

  if (!data?.success) {
    return { success: false, error: data?.error ?? "Gagal mendaftarkan kontak" };
  }

  return { success: true, userId: data.user_id };
}

async function extractFunctionErrorMessage(error: unknown): Promise<string | null> {
  if (
    typeof error === "object" &&
    error !== null &&
    "context" in error &&
    error.context instanceof Response
  ) {
    try {
      const body = await error.context.clone().json();
      return body?.error ?? null;
    } catch {
      return null;
    }
  }
  return null;
}
