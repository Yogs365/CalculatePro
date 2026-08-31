"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const INSTALL_PROMPT_SEEN_KEY = "circlex-install-prompt-seen";

function isIosDevice() {
  return (
    /iphone|ipad|ipod/i.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as { standalone?: boolean }).standalone === true
  );
}

export default function InstallAppPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [iosInstall, setIosInstall] = useState(false);

  useEffect(() => {
    if (isStandalone()) return;

    let alreadySeen = false;
    try {
      alreadySeen = window.localStorage.getItem(INSTALL_PROMPT_SEEN_KEY) === "true";
    } catch {
      // Storage can be unavailable in private browsing; the prompt can still
      // work for this visit.
    }
    if (alreadySeen) return;

    const markAsSeen = () => {
      try {
        window.localStorage.setItem(INSTALL_PROMPT_SEEN_KEY, "true");
      } catch {
        // The prompt remains usable even when persistent storage is blocked.
      }
    };

    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      setShowPrompt(true);
    }

    function handleInstalled() {
      markAsSeen();
      setDeferredPrompt(null);
      setShowPrompt(false);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);

    if ("serviceWorker" in navigator) {
      void navigator.serviceWorker.register("/sw.js").catch(() => undefined);
    }

    let iosTimer: ReturnType<typeof setTimeout> | undefined;
    if (isIosDevice()) {
      iosTimer = setTimeout(() => {
        setIosInstall(true);
        setShowPrompt(true);
      }, 700);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleInstalled);
      if (iosTimer) clearTimeout(iosTimer);
    };
  }, []);

  function dismissPrompt() {
    try {
      window.localStorage.setItem(INSTALL_PROMPT_SEEN_KEY, "true");
    } catch {
      // Dismissal still applies for the current render.
    }
    setShowPrompt(false);
  }

  async function installApp() {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    dismissPrompt();
    setDeferredPrompt(null);
  }

  if (!showPrompt) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ocean-50/20 px-4 pb-5 pt-6 backdrop-blur-[2px] sm:items-center"
      role="presentation"
      onClick={dismissPrompt}
    >
      <div
        className="w-full max-w-sm animate-fade-in rounded-[1.75rem] border border-black/[0.08] bg-ocean-950 p-5 shadow-premium"
        role="dialog"
        aria-modal="true"
        aria-labelledby="install-app-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          <Image
            src="/icons/icon-192.png"
            alt=""
            width={52}
            height={52}
            className="h-[3.25rem] w-[3.25rem] rounded-2xl"
          />
          <div className="min-w-0 flex-1">
            <h2 id="install-app-title" className="font-display text-lg text-ocean-50">
              Install CircleX
            </h2>
            <p className="mt-1 text-sm leading-5 text-ocean-400">
              Tambahkan aplikasi ke layar utama untuk akses yang lebih cepat.
            </p>
          </div>
        </div>

        {iosInstall && (
          <p className="mt-4 rounded-xl bg-ocean-900 px-3.5 py-3 text-sm leading-5 text-ocean-200">
            Ketuk tombol Bagikan di browser, lalu pilih <strong>Tambahkan ke Layar Utama</strong>.
          </p>
        )}

        <div className="mt-5 flex gap-2.5">
          <button
            type="button"
            onClick={dismissPrompt}
            className="flex-1 rounded-xl border border-black/[0.08] bg-white px-4 py-3 text-sm font-medium text-ocean-50 transition active:scale-[0.98]"
          >
            Nanti
          </button>
          {!iosInstall && (
            <button
              type="button"
              onClick={installApp}
              className="premium-cta glossy-btn flex-1 rounded-xl px-4 py-3 text-sm font-semibold text-ocean-950 transition active:scale-[0.98]"
            >
              Install
            </button>
          )}
        </div>
      </div>
    </div>
  );
}