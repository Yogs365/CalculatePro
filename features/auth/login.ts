import { createClient } from "@/lib/supabase/client";

interface LoginWithCodeResult {
  success: boolean;
  error?: string;
}

// Logs a user in using only their 3-8 digit personal access code, via the
// login-with-code Edge Function (verify_jwt=false: this IS the entry point
// before any session exists). On success, sets a real Supabase Auth session
// in the browser client so it can be read by server components too.
export async function loginWithCode(accessCode: string): Promise<LoginWithCodeResult> {
  const supabase = createClient();

  // functions.invoke() normally reports fetch failures via `error`, not by
  // throwing, but a fully offline device can still throw before that (e.g.
  // no network stack at all) - wrap defensively so the login screen always
  // gets a real error message instead of an unhandled rejection.
  try {
    const { data, error } = await supabase.functions.invoke("login-with-code", {
      body: { access_code: accessCode },
    });

    if (error) {
      const message = await extractFunctionErrorMessage(error);
      return { success: false, error: message ?? "Kode akses tidak dikenali" };
    }

    if (!data?.success || !data?.access_token || !data?.refresh_token) {
      return { success: false, error: data?.error ?? "Kode akses tidak dikenali" };
    }

    const { error: setSessionError } = await supabase.auth.setSession({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
    });

    if (setSessionError) {
      return { success: false, error: "Gagal membuat sesi. Coba lagi." };
    }

    return { success: true };
  } catch {
    return { success: false, error: "Tidak ada koneksi internet. Periksa jaringan kamu." };
  }
}

// supabase-js throws a generic FunctionsHttpError; the real message is in
// the response body.
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
