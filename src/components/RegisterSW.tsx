"use client";

import { useEffect } from "react";

const LOCAL_HOSTNAMES = new Set(["localhost", "127.0.0.1", "0.0.0.0", "[::1]"]);

/**
 * Remove any service worker + caches this origin already has.
 *
 * Needed because earlier builds registered /sw.js in development, where it
 * cached HTML and Turbopack chunks. Once a dev server rebuild changes the
 * chunk graph, the stale cached document keeps loading chunks that no longer
 * exist and Next.js reloads the page — forever, several times a second.
 */
async function unregisterAndClearCaches() {
  if (!("serviceWorker" in navigator)) return;

  const registrations = await navigator.serviceWorker.getRegistrations();
  await Promise.all(registrations.map((registration) => registration.unregister()));

  if ("caches" in window) {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map((name) => caches.delete(name)));
  }

  if (registrations.length > 0) {
    console.info(
      `[sw] Removed ${registrations.length} service worker registration(s) on a local/dev origin. Reload once to finish.`,
    );
  }
}

export default function RegisterSW() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    const isLocalHost = LOCAL_HOSTNAMES.has(window.location.hostname);
    const isProduction = process.env.NODE_ENV === "production";

    // Never run a service worker against a dev server or on a local address.
    if (!isProduction || isLocalHost) {
      unregisterAndClearCaches().catch((error) => {
        console.error("[sw] Cleanup failed:", error);
      });
      return;
    }

    navigator.serviceWorker
      .register("/sw.js", { updateViaCache: "none" })
      .catch((error) => {
        console.error("Service Worker registration failed:", error);
      });
  }, []);

  return null;
}
