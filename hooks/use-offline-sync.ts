"use client"

import { useState, useEffect, useCallback } from "react"

interface OfflineData {
  id: string
  type: "alert" | "report" | "location" | "voice"
  data: any
  timestamp: number
  synced: boolean
  priority: "high" | "medium" | "low"
}

interface SyncStatus {
  isOnline: boolean
  lastSync: number | null
  pendingItems: number
  syncInProgress: boolean
}

export function useOfflineSync() {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isOnline: navigator.onLine,
    lastSync: null,
    pendingItems: 0,
    syncInProgress: false,
  })

  const [offlineQueue, setOfflineQueue] = useState<OfflineData[]>([])

  // Load offline data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem("safenaija-offline-queue")
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData)
        setOfflineQueue(parsed)
        setSyncStatus((prev) => ({ ...prev, pendingItems: parsed.length }))
      } catch (error) {
        console.error("Failed to load offline data:", error)
      }
    }

    const lastSync = localStorage.getItem("safenaija-last-sync")
    if (lastSync) {
      setSyncStatus((prev) => ({ ...prev, lastSync: Number.parseInt(lastSync) }))
    }
  }, [])

  // Save offline data to localStorage whenever queue changes
  useEffect(() => {
    localStorage.setItem("safenaija-offline-queue", JSON.stringify(offlineQueue))
    setSyncStatus((prev) => ({ ...prev, pendingItems: offlineQueue.length }))
  }, [offlineQueue])

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setSyncStatus((prev) => ({ ...prev, isOnline: true }))
      syncOfflineData()
    }

    const handleOffline = () => {
      setSyncStatus((prev) => ({ ...prev, isOnline: false }))
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  // Add data to offline queue
  const addToOfflineQueue = useCallback(
    (type: OfflineData["type"], data: any, priority: OfflineData["priority"] = "medium") => {
      const offlineItem: OfflineData = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type,
        data,
        timestamp: Date.now(),
        synced: false,
        priority,
      }

      setOfflineQueue((prev) => [...prev, offlineItem])

      // If online, try to sync immediately
      if (syncStatus.isOnline) {
        syncOfflineData()
      }
    },
    [syncStatus.isOnline],
  )

  // Sync offline data when connection is available
  const syncOfflineData = useCallback(async () => {
    if (!syncStatus.isOnline || syncStatus.syncInProgress || offlineQueue.length === 0) {
      return
    }

    setSyncStatus((prev) => ({ ...prev, syncInProgress: true }))

    try {
      // Sort by priority and timestamp
      const sortedQueue = [...offlineQueue].sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        }
        return a.timestamp - b.timestamp
      })

      const syncPromises = sortedQueue.map(async (item) => {
        try {
          // Simulate API call - replace with actual endpoint
          const response = await fetch("/api/sync-offline-data", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(item),
          })

          if (response.ok) {
            return item.id
          }
          throw new Error("Sync failed")
        } catch (error) {
          console.error(`Failed to sync item ${item.id}:`, error)
          return null
        }
      })

      const syncedIds = (await Promise.allSettled(syncPromises))
        .map((result, index) => (result.status === "fulfilled" ? result.value : null))
        .filter(Boolean) as string[]

      // Remove synced items from queue
      setOfflineQueue((prev) => prev.filter((item) => !syncedIds.includes(item.id)))

      setSyncStatus((prev) => ({
        ...prev,
        lastSync: Date.now(),
        syncInProgress: false,
      }))

      localStorage.setItem("safenaija-last-sync", Date.now().toString())
    } catch (error) {
      console.error("Sync process failed:", error)
      setSyncStatus((prev) => ({ ...prev, syncInProgress: false }))
    }
  }, [syncStatus.isOnline, syncStatus.syncInProgress, offlineQueue])

  // Manual sync trigger
  const forcSync = useCallback(() => {
    if (syncStatus.isOnline) {
      syncOfflineData()
    }
  }, [syncStatus.isOnline, syncOfflineData])

  return {
    syncStatus,
    offlineQueue,
    addToOfflineQueue,
    syncOfflineData: forcSync,
  }
}
