// Service Worker minimal — placeholder untuk offline cache & push notification.
// Akan dikembangkan lebih lanjut di Phase 2 (offline-first) & Phase 4 (push notification).

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  if (!event.data) return;
  const payload = event.data.json();
  event.waitUntil(
    self.registration.showNotification(payload.title || "Pesan baru", {
      body: payload.body,
      data: payload.data,
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const chatId = event.notification.data?.chat_id;
  event.waitUntil(
    self.clients.openWindow(chatId ? `/chat/${chatId}` : "/"),
  );
});
