import { createClient } from "@/lib/supabase/client";
import type { ContactRow } from "@/lib/supabase/types";

export async function getAllContacts(): Promise<ContactRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("get_all_contacts");
  if (error) throw error;
  return (data as ContactRow[]) ?? [];
}

export async function getContactSettings(
  contactId: string,
): Promise<{ is_muted: boolean; is_blocked: boolean }> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("get_contact_settings", { p_contact_id: contactId });
  if (error) throw error;
  const row = (data as { is_muted: boolean; is_blocked: boolean }[] | null)?.[0];
  return row ?? { is_muted: false, is_blocked: false };
}

export async function setContactMuted(contactId: string, muted: boolean): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.rpc("set_contact_muted", {
    p_contact_id: contactId,
    p_muted: muted,
  });
  if (error) throw error;
}

export async function setContactBlocked(contactId: string, blocked: boolean): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.rpc("set_contact_blocked", {
    p_contact_id: contactId,
    p_blocked: blocked,
  });
  if (error) throw error;
}
