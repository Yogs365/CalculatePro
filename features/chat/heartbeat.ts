import { createClient } from "@/lib/supabase/client";

// Calls the heartbeat() RPC, which stamps profiles.last_seen_at = now().
// is_online() in the backend treats anyone seen in the last 60s as online,
// so this should be called roughly every 30-45s while the app is open.
export async function sendHeartbeat(): Promise<void> {
  const supabase = createClient();
  await supabase.rpc("heartbeat");
}
