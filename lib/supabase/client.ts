"use client";

import { createBrowserClient } from "@supabase/ssr";

// Single browser-side Supabase client. Uses the public anon/publishable key
// only — safe to ship to the client. Session is persisted via cookies so the
// server layout (lib/supabase/server.ts) can read the same session.
let browserClient: ReturnType<typeof createBrowserClient> | undefined;

export function createClient() {
  if (!browserClient) {
    browserClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
  }

  return browserClient;
}
