"use client";

import { useEffect } from "react";
import { sendHeartbeat } from "@/features/chat/heartbeat";

const INTERVAL_MS = 30_000;

// Renders nothing. Keeps profiles.last_seen_at fresh so is_online() reflects
// reality across the app (chat list, contact list, chat room header).
export default function HeartbeatClient() {
  useEffect(() => {
    sendHeartbeat();
    const id = setInterval(sendHeartbeat, INTERVAL_MS);

    function handleVisibility() {
      if (document.visibilityState === "visible") sendHeartbeat();
    }
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return null;
}
