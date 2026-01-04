interface OfflineData {
  id: string
  data: unknown
  timestamp: number
}

class OfflineStorage {
  private dbName = "cleanpro-offline"
  private version = 1

  async openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        if (!db.objectStoreNames.contains("pendingOrders")) {
          db.createObjectStore("pendingOrders", { keyPath: "id" })
        }
        if (!db.objectStoreNames.contains("pendingPayments")) {
          db.createObjectStore("pendingPayments", { keyPath: "id" })
        }
        if (!db.objectStoreNames.contains("cachedOrders")) {
          db.createObjectStore("cachedOrders", { keyPath: "id" })
        }
        if (!db.objectStoreNames.contains("cachedCustomers")) {
          db.createObjectStore("cachedCustomers", { keyPath: "id" })
        }
      }
    })
  }

  async savePendingOrder(order: unknown): Promise<void> {
    const db = await this.openDB()
    const tx = db.transaction("pendingOrders", "readwrite")
    const store = tx.objectStore("pendingOrders")

    const data: OfflineData = {
      id: crypto.randomUUID(),
      data: order,
      timestamp: Date.now(),
    }

    return new Promise((resolve, reject) => {
      const request = store.add(data)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async savePendingPayment(payment: unknown): Promise<void> {
    const db = await this.openDB()
    const tx = db.transaction("pendingPayments", "readwrite")
    const store = tx.objectStore("pendingPayments")

    const data: OfflineData = {
      id: crypto.randomUUID(),
      data: payment,
      timestamp: Date.now(),
    }

    return new Promise((resolve, reject) => {
      const request = store.add(data)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async getPendingOrders(): Promise<OfflineData[]> {
    const db = await this.openDB()
    const tx = db.transaction("pendingOrders", "readonly")
    const store = tx.objectStore("pendingOrders")

    return new Promise((resolve, reject) => {
      const request = store.getAll()
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async getPendingPayments(): Promise<OfflineData[]> {
    const db = await this.openDB()
    const tx = db.transaction("pendingPayments", "readonly")
    const store = tx.objectStore("pendingPayments")

    return new Promise((resolve, reject) => {
      const request = store.getAll()
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async clearPendingOrder(id: string): Promise<void> {
    const db = await this.openDB()
    const tx = db.transaction("pendingOrders", "readwrite")
    const store = tx.objectStore("pendingOrders")

    return new Promise((resolve, reject) => {
      const request = store.delete(id)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async clearPendingPayment(id: string): Promise<void> {
    const db = await this.openDB()
    const tx = db.transaction("pendingPayments", "readwrite")
    const store = tx.objectStore("pendingPayments")

    return new Promise((resolve, reject) => {
      const request = store.delete(id)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async cacheOrders(orders: unknown[]): Promise<void> {
    const db = await this.openDB()
    const tx = db.transaction("cachedOrders", "readwrite")
    const store = tx.objectStore("cachedOrders")

    return new Promise((resolve, reject) => {
      store.clear()
      orders.forEach((order) => store.add(order))
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
  }

  async cacheCustomers(customers: unknown[]): Promise<void> {
    const db = await this.openDB()
    const tx = db.transaction("cachedCustomers", "readwrite")
    const store = tx.objectStore("cachedCustomers")

    return new Promise((resolve, reject) => {
      store.clear()
      customers.forEach((customer) => store.add(customer))
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
  }

  async getCachedOrders(): Promise<unknown[]> {
    const db = await this.openDB()
    const tx = db.transaction("cachedOrders", "readonly")
    const store = tx.objectStore("cachedOrders")

    return new Promise((resolve, reject) => {
      const request = store.getAll()
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async getCachedCustomers(): Promise<unknown[]> {
    const db = await this.openDB()
    const tx = db.transaction("cachedCustomers", "readonly")
    const store = tx.objectStore("cachedCustomers")

    return new Promise((resolve, reject) => {
      const request = store.getAll()
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }
}

export const offlineStorage = new OfflineStorage()
