self.addEventListener("push", (event) => {
  const data = event.data?.json() ?? {};
  event.waitUntil(
    self.registration.showNotification(data.title ?? "G & N Wedding", {
      body: data.body ?? "",
      icon: "/images/leaf.png",
      badge: "/images/leaf.png",
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow("https://gnwedding2026.com"));
});
