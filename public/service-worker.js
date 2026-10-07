const CACHE_NAME = "davingm-offline-v1";
const PRECACHE_URLS = __PRECACHE_URLS__;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((cacheName) => cacheName.startsWith("davingm-offline-") && cacheName !== CACHE_NAME)
            .map((cacheName) => caches.delete(cacheName)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

async function notifyClients(type) {
  const clients = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
  clients.forEach((client) => client.postMessage({ type }));
}

function getCachedPagePath(pathname) {
  const normalizedPath = pathname.replace(/\/+$/, "") || "/";
  return normalizedPath === "/" ? "/index.html" : `${normalizedPath}.html`;
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const requestUrl = new URL(request.url);

  if (request.method !== "GET" || requestUrl.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then(async (response) => {
          if (response.ok) {
            const cache = await caches.open(CACHE_NAME);
            await cache.put(request, response.clone());
            await notifyClients("online");
          }
          return response;
        })
        .catch(async () => {
          await notifyClients("offline");
          const cache = await caches.open(CACHE_NAME);
          const cachedPage =
            (await cache.match(request)) ||
            (await cache.match(getCachedPagePath(requestUrl.pathname))) ||
            (await cache.match("/index.html"));
          return cachedPage || Response.error();
        }),
    );
    return;
  }

  if (requestUrl.pathname.startsWith("/_next/static/") || requestUrl.pathname === "/off.gif") {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;
        return fetch(request).then(async (response) => {
          if (response.ok) {
            const cache = await caches.open(CACHE_NAME);
            await cache.put(request, response.clone());
          }
          return response;
        });
      }),
    );
  }
});
