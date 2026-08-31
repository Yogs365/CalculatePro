"use client";

import { useEffect, useState } from "react";
import SettingsRow from "@/components/ui/SettingsRow";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

// Chrome/Edge/Android fire `beforeinstallprompt` when the app is eligible to
// be installed as a PWA; we stash it and trigger it from a normal settings
// row instead of the (blocked-by-default) browser mini-infobar. iOS Safari
// never fires this event - there's no programmatic install API there, so
// this row simply doesn't render on iOS (user installs via Share > Add to
// Home Screen instead).
export default function InstallPwaButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as { standalone?: boolean }).standalone === true;
    setInstalled(isStandalone);

    function handlePrompt(e: Event) {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    }
    function handleInstalled() {
      setInstalled(true);
      setDeferredPrompt(null);
    }

    window.addEventListener("beforeinstallprompt", handlePrompt);
    window.addEventListener("appinstalled", handleInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", handlePrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  if (installed || !deferredPrompt) return null;

  async function handleInstall() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  }

  return (
    <SettingsRow
      icon="⬇️"
      title="Pasang Calculator Pro"
      subtitle="Tambahkan ke layar utama untuk akses lebih cepat"
      onClick={handleInstall}
    />
  );
}
