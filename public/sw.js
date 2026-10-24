/*
 * Offline support for the Kharis Foods product guide.
 *
 * Rules that matter:
 *  - HTML is never cached. Caching a document means users get an old build's
 *    HTML which points at asset hashes that no longer exist, and Next.js
 *    responds by reloading the page — repeatedly.
 *  - /_next/ is never cached (dev chunks change on every rebuild).
 *  - API and admin routes are never touched.
 *  - Navigations are network-first, so a new deploy is picked up immediately.
 */
const CACHE_NAME = "kharis-foods-static-v2";

const PRECACHE_URLS = [
  "/manifest.json",
  "/images/kharisfoods-removebg-preview.png",
  "/images/maize-flour.jpeg",
  "/images/maize-grits.jpg",
];

const IS_LOCAL_HOST = ["localhost", "127.0.0.1", "0.0.0.0", "[::1]"].includes(
  self.location.hostname,
);

/** Only static media is worth caching. */
function isCacheableAsset(url) {
  if (url.origin !== self.location.origin) return false;
  if (url.pathname.startsWith("/api/")) return false;
  if (url.pathname.startsWith("/admin")) return false;
  if (url.pathname.startsWith("/_next/")) return false;

  return (
    url.pathname.startsWith("/images/") ||
    url.pathname.startsWith("/icons/") ||
    url.pathname === "/manifest.json"
  );
}

async function cacheAsset(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  if (response && response.ok && response.type === "basic") {
    const cache = await caches.open(CACHE_NAME);
    await cache.put(request, response.clone());
  }
  return response;
}

if (IS_LOCAL_HOST) {
  // A worker installed on a local address only ever causes stale-cache loops.
  // Retire it: drop caches, unregister, and reload any open client once.
  self.addEventListener("install", () => {
    self.skipWaiting();
  });

  self.addEventListener("activate", (event) => {
    event.waitUntil(
      (async () => {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((name) => caches.delete(name)));
        await self.registration.unregister();

        const clients = await self.clients.matchAll({ type: "window" });
        for (const client of clients) {
          client.navigate(client.url).catch(() => {});
        }
      })(),
    );
  });
} else {
  self.addEventListener("install", (event) => {
    event.waitUntil(
      (async () => {
        const cache = await caches.open(CACHE_NAME);
        // Individual adds so one missing asset cannot fail the whole install.
        await Promise.all(
          PRECACHE_URLS.map((url) => cache.add(url).catch(() => {})),
        );
        await self.skipWaiting();
      })(),
    );
  });

  self.addEventListener("activate", (event) => {
    event.waitUntil(
      (async () => {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => caches.delete(name)),
        );
        await self.clients.claim();
      })(),
    );
  });

  self.addEventListener("fetch", (event) => {
    const { request } = event;

    if (request.method !== "GET") return;

    // Documents always come from the network. No HTML in the cache, ever.
    if (request.mode === "navigate") {
      event.respondWith(
        fetch(request).catch(async () => {
          // Offline: only static media can be served, so let the browser show
          // its own offline page rather than an outdated app shell.
          return Response.error();
        }),
      );
      return;
    }

    const url = new URL(request.url);
    if (!isCacheableAsset(url)) return;

    event.respondWith(cacheAsset(request));
  });
}
