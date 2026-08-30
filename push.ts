import { createClient } from "@/lib/supabase/client";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

export function isPushSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

// PushManager needs the VAPID public key as a Uint8Array, not the base64url
// string Supabase/web-push give us.
function urlBase64ToUint8Array(base64Url: string): Uint8Array {
  const padding = "=".repeat((4 - (base64Url.length % 4)) % 4);
  const base64 = (base64Url + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}

export function getNotificationPermission(): NotificationPermission | "unsupported" {
  if (typeof window === "undefined" || !("Notification" in window)) return "unsupported";
  return Notification.permission;
}

// Registers the service worker (idempotent - browsers no-op a duplicate
// register call for the same script/scope), asks for notification
// permission, subscribes via PushManager, and upserts the subscription for
// the current user so notify-new-message can reach this device.
export async function subscribeToPush(userId: string): Promise<{ success: boolean; error?: string }> {
  if (!isPushSupported()) return { success: false, error: "Push tidak didukung di perangkat ini" };
  if (!VAPID_PUBLIC_KEY) return { success: false, error: "VAPID key tidak dikonfigurasi" };

  try {
    const registration = await navigator.serviceWorker.register("/sw.js");
    await navigator.serviceWorker.ready;

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      return { success: false, error: "Izin notifikasi ditolak" };
    }

    let subscription = await registration.pushManager.getSubscription();
    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY) as BufferSource,
      });
    }

    const json = subscription.toJSON();
    const supabase = createClient();
    const { error } = await supabase.from("push_subscriptions").insert({
      user_id: userId,
      endpoint: json.endpoint!,
      p256dh: json.keys!.p256dh,
      auth: json.keys!.auth,
      device_label: navigator.userAgent.slice(0, 120),
    });

    // endpoint has a unique constraint - a conflict just means this exact
    // device/browser is already registered, which is fine.
    if (error && !error.message.includes("duplicate")) {
      return { success: false, error: "Gagal menyimpan langganan push" };
    }

    return { success: true };
  } catch {
    return { success: false, error: "Gagal mengaktifkan notifikasi" };
  }
}

// Unsubscribes the current device from push and removes its row so
// notify-new-message stops targeting it.
export async function unsubscribeFromPush(): Promise<void> {
  if (!isPushSupported()) return;

  const registration = await navigator.serviceWorker.getRegistration();
  const subscription = await registration?.pushManager.getSubscription();
  if (!subscription) return;

  const endpoint = subscription.endpoint;
  await subscription.unsubscribe();

  const supabase = createClient();
  await supabase.from("push_subscriptions").delete().eq("endpoint", endpoint);
}

// Whether THIS browser/device currently holds an active push subscription -
// used to render the correct toggle state in Profile settings.
export async function isSubscribedOnThisDevice(): Promise<boolean> {
  if (!isPushSupported()) return false;
  const registration = await navigator.serviceWorker.getRegistration();
  const subscription = await registration?.pushManager.getSubscription();
  return Boolean(subscription);
}
