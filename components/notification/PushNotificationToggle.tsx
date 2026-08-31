"use client";

import { useEffect, useState } from "react";
import {
  isPushSupported,
  getNotificationPermission,
  isSubscribedOnThisDevice,
  subscribeToPush,
  unsubscribeFromPush,
} from "@/features/notification/push";
import SettingsRow from "@/components/ui/SettingsRow";

interface PushNotificationToggleProps {
  userId: string;
}

export default function PushNotificationToggle({ userId }: PushNotificationToggleProps) {
  const [supported, setSupported] = useState(true);
  const [subscribed, setSubscribed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isPushSupported()) {
      setSupported(false);
      return;
    }
    isSubscribedOnThisDevice().then(setSubscribed);
  }, []);

  async function handleToggle() {
    if (busy) return;
    setBusy(true);
    setError(null);

    if (subscribed) {
      await unsubscribeFromPush();
      setSubscribed(false);
    } else {
      const result = await subscribeToPush(userId);
      if (result.success) {
        setSubscribed(true);
      } else {
        setError(result.error ?? "Gagal mengaktifkan notifikasi");
      }
    }
    setBusy(false);
  }

  if (!supported) {
    return (
      <SettingsRow
        icon="🔔"
        title="Notifikasi Push"
        subtitle="Tidak didukung di browser ini"
      />
    );
  }

  const permission = getNotificationPermission();
  const subtitle =
    permission === "denied"
      ? "Diblokir di pengaturan browser"
      : error ?? (subscribed ? "Aktif di perangkat ini" : "Nonaktif");

  return (
    <SettingsRow
      icon="🔔"
      title="Notifikasi Push"
      subtitle={subtitle}
      onClick={permission === "denied" ? undefined : handleToggle}
      trailing={
        <span
          className={`flex h-6 w-11 items-center rounded-full px-0.5 transition ${
            subscribed ? "justify-end bg-ocean-300" : "justify-start bg-ocean-800"
          } ${busy ? "opacity-50" : ""}`}
        >
          <span className="h-5 w-5 rounded-full bg-white" />
        </span>
      }
    />
  );
}
