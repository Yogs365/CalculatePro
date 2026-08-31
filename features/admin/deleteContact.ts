import { createClient } from "@/lib/supabase/client";

export interface DeleteContactResult {
  success: boolean;
  error?: string;
}

// Calls the delete-contact Edge Function. The function itself re-verifies
// the caller is an admin server-side (via their profiles.role), so this is
// safe even though the client already gates the button on isAdmin.
export async function deleteContact(targetUserId: string): Promise<DeleteContactResult> {
  const supabase = createClient();

  const { data, error } = await supabase.functions.invoke("delete-contact", {
    body: { target_user_id: targetUserId },
  });

  if (error) {
    const message = await extractFunctionErrorMessage(error);
    return { success: false, error: message ?? "Gagal menghapus kontak" };
  }

  if (!data?.success) {
    return { success: false, error: data?.error ?? "Gagal menghapus kontak" };
  }

  return { success: true };
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
