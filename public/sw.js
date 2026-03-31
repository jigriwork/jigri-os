self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("jigri-os-static-v1").then((cache) => cache.addAll(["/", "/offline"])),
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).catch(async () => {
      const cached = await caches.match(event.request);
      return cached || caches.match("/offline");
    }),
  );
});
