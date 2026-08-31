// Calculator Pro service worker.
// Two jobs: (1) show a system notification whenever a push arrives, using
// the JSON payload sent by the notify-new-message Edge Function
// ({ title, body, data: { chat_id, message_id } }); (2) focus/open the
// relevant chat when the notification is tapped.

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  if (!event.data) return;

  let payload;
  try {
    payload = event.data.json();
  } catch {
    payload = { title: "Calculator Pro", body: event.data.text() };
  }

  const title = payload.title || "Pesan baru";
  const options = {
    body: payload.body || "",
    icon: "/icons/icon-192.png",
    badge: "/icons/icon-192.png",
    data: payload.data || {},
    tag: payload.data?.chat_id ? `chat-${payload.data.chat_id}` : undefined,
    renotify: true,
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const chatId = event.notification.data?.chat_id;
  const targetUrl = chatId ? `/pesan/${chatId}` : "/pesan";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if (client.url.includes(targetUrl) && "focus" in client) {
          return client.focus();
        }
      }
      for (const client of clients) {
        if ("focus" in client) {
          client.focus();
          if ("navigate" in client) client.navigate(targetUrl);
          return;
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    }),
  );
});
