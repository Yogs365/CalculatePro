"use client";

import { useEffect } from "react";
import { sendHeartbeat } from "@/features/chat/heartbeat";

const INTERVAL_MS = 30_000;

// Renders nothing. Keeps profiles.last_seen_at fresh so is_online() reflects
// reality across the app (chat list, contact list, chat room header).
export default function HeartbeatClient() {
  useEffect(() => {
    function sendIfActive() {
      if (document.visibilityState === "visible" && navigator.onLine) {
        void sendHeartbeat();
      }
    }

    sendIfActive();
    const id = setInterval(sendIfActive, INTERVAL_MS);

    function handleVisibility() {
      if (document.visibilityState === "visible") sendIfActive();
    }
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("online", sendIfActive);

    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("online", sendIfActive);
    };
  }, []);

  return null;
}
