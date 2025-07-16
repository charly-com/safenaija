const CACHE_NAME = "safenaija-v1"
const urlsToCache = ["/", "/manifest.json", "/icon-192.png", "/icon-512.png"]

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)))
})

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response
      }
      return fetch(event.request)
    }),
  )
})

// Background sync for offline alerts
self.addEventListener("sync", (event) => {
  if (event.tag === "background-sync") {
    event.waitUntil(syncOfflineData())
  }
})

async function syncOfflineData() {
  // Sync offline alerts when connection restored
  console.log("Syncing offline data...")
}
