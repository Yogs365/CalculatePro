"use client";

import { useEffect, useState } from "react";

// Tracks navigator.onLine so screens can show an offline banner / disable
// actions that would just fail against Supabase. Not perfectly reliable
// (a captive portal can report "online" with no real connectivity), but
// good enough to catch the common case: airplane mode / no signal.
export function useOnlineStatus(): boolean {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    setOnline(navigator.onLine);

    function handleOnline() {
      setOnline(true);
    }
    function handleOffline() {
      setOnline(false);
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return online;
}
