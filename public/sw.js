const CACHE_NAME = "cleanpro-erp-v1"
const urlsToCache = ["/", "/auth/login", "/offline"]

// Install service worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache)
    }),
  )
  self.skipWaiting()
})

// Activate service worker
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
  self.clients.claim()
})

// Fetch event - network first, then cache
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone the response
        const responseToCache = response.clone()

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache)
        })

        return response
      })
      .catch(() => {
        return caches.match(event.request).then((response) => {
          if (response) {
            return response
          }
          // If no cache, return offline page
          return caches.match("/offline")
        })
      }),
  )
})

// Background sync for offline data
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-orders") {
    event.waitUntil(syncOrders())
  }
  if (event.tag === "sync-payments") {
    event.waitUntil(syncPayments())
  }
})

async function syncOrders() {
  // Get pending orders from IndexedDB
  const db = await openDB()
  const tx = db.transaction("pendingOrders", "readonly")
  const store = tx.objectStore("pendingOrders")
  const pendingOrders = await store.getAll()

  for (const order of pendingOrders) {
    try {
      // Sync to server
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      })

      // Remove from pending
      const deleteTx = db.transaction("pendingOrders", "readwrite")
      const deleteStore = deleteTx.objectStore("pendingOrders")
      await deleteStore.delete(order.id)
    } catch (error) {
      console.error("Failed to sync order:", error)
    }
  }
}

async function syncPayments() {
  const db = await openDB()
  const tx = db.transaction("pendingPayments", "readonly")
  const store = tx.objectStore("pendingPayments")
  const pendingPayments = await store.getAll()

  for (const payment of pendingPayments) {
    try {
      await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payment),
      })

      const deleteTx = db.transaction("pendingPayments", "readwrite")
      const deleteStore = deleteTx.objectStore("pendingPayments")
      await deleteStore.delete(payment.id)
    } catch (error) {
      console.error("Failed to sync payment:", error)
    }
  }
}

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("cleanpro-offline", 1)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)

    request.onupgradeneeded = (event) => {
      const db = event.target.result
      if (!db.objectStoreNames.contains("pendingOrders")) {
        db.createObjectStore("pendingOrders", { keyPath: "id" })
      }
      if (!db.objectStoreNames.contains("pendingPayments")) {
        db.createObjectStore("pendingPayments", { keyPath: "id" })
      }
    }
  })
}
