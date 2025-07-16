"use client"

import { useState, useEffect, useCallback } from "react"

interface RealtimeAlert {
  id: string
  type: "SOS" | "Crime" | "Suspicious" | "Emergency"
  message: string
  location: string
  coordinates?: { lat: number; lng: number }
  timestamp: number
  priority: "high" | "medium" | "low"
  status: "active" | "investigating" | "resolved"
  reportedBy: string
  phoneNumber?: string
}

interface RealtimeStats {
  activeAlerts: number
  resolvedToday: number
  averageResponseTime: number
  onlineOfficers: number
}

export function useRealtime() {
  const [alerts, setAlerts] = useState<RealtimeAlert[]>([])
  const [stats, setStats] = useState<RealtimeStats>({
    activeAlerts: 0,
    resolvedToday: 0,
    averageResponseTime: 0,
    onlineOfficers: 0,
  })
  const [isConnected, setIsConnected] = useState(false)

  // Simulate real-time alerts
  const generateRandomAlert = useCallback((): RealtimeAlert => {
    const types: RealtimeAlert["type"][] = ["SOS", "Crime", "Suspicious", "Emergency"]
    const locations = [
      "Victoria Island, Lagos",
      "Ikeja, Lagos",
      "Surulere, Lagos",
      "Kaduna Central",
      "Abuja FCT",
      "Port Harcourt",
      "Kano State",
      "Ibadan, Oyo",
    ]

    const messages = {
      SOS: [
        "Emergency button pressed - immediate assistance needed",
        "Woman reported being followed by suspicious individuals",
        "Vehicle breakdown in unsafe area - requesting help",
      ],
      Crime: [
        "Armed robbery in progress at bank",
        "Kidnapping attempt reported by witness",
        "Burglary reported at residential area",
      ],
      Suspicious: [
        "Suspicious individuals spotted near school",
        "Unattended bag reported at bus station",
        "Strange vehicle circling neighborhood",
      ],
      Emergency: [
        "Medical emergency - unconscious person found",
        "Fire outbreak reported at market",
        "Road accident with injuries",
      ],
    }

    const type = types[Math.floor(Math.random() * types.length)]
    const location = locations[Math.floor(Math.random() * locations.length)]
    const messageList = messages[type]
    const message = messageList[Math.floor(Math.random() * messageList.length)]

    return {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      message,
      location,
      coordinates: {
        lat: 6.5244 + (Math.random() - 0.5) * 0.1,
        lng: 3.3792 + (Math.random() - 0.5) * 0.1,
      },
      timestamp: Date.now(),
      priority: type === "SOS" || type === "Emergency" ? "high" : Math.random() > 0.5 ? "medium" : "low",
      status: "active",
      reportedBy: `Citizen_${Math.random().toString(36).substr(2, 6)}`,
      phoneNumber: `+234${Math.floor(Math.random() * 9000000000) + 1000000000}`,
    }
  }, [])

  // Initialize with some alerts
  useEffect(() => {
    const initialAlerts = Array.from({ length: 5 }, () => generateRandomAlert())
    setAlerts(initialAlerts)
    setIsConnected(true)

    // Update stats
    setStats({
      activeAlerts: initialAlerts.filter((a) => a.status === "active").length,
      resolvedToday: 23,
      averageResponseTime: 8.5,
      onlineOfficers: 45,
    })
  }, [generateRandomAlert])

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Add new alert occasionally
      if (Math.random() < 0.3) {
        const newAlert = generateRandomAlert()
        setAlerts((prev) => [newAlert, ...prev.slice(0, 19)]) // Keep last 20 alerts

        // Update stats
        setStats((prev) => ({
          ...prev,
          activeAlerts: prev.activeAlerts + 1,
        }))
      }

      // Randomly update existing alert status
      setAlerts((prev) =>
        prev.map((alert) => {
          if (alert.status === "active" && Math.random() < 0.1) {
            const newStatus = Math.random() < 0.7 ? "investigating" : "resolved"
            return { ...alert, status: newStatus }
          }
          return alert
        }),
      )
    }, 5000) // Every 5 seconds

    return () => clearInterval(interval)
  }, [generateRandomAlert])

  // Update stats when alerts change
  useEffect(() => {
    const activeCount = alerts.filter((a) => a.status === "active").length
    setStats((prev) => ({
      ...prev,
      activeAlerts: activeCount,
    }))
  }, [alerts])

  const updateAlertStatus = useCallback((alertId: string, status: RealtimeAlert["status"]) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === alertId ? { ...alert, status } : alert)))
  }, [])

  const addAlert = useCallback((alert: Omit<RealtimeAlert, "id" | "timestamp">) => {
    const newAlert: RealtimeAlert = {
      ...alert,
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    }
    setAlerts((prev) => [newAlert, ...prev.slice(0, 19)])
  }, [])

  return {
    alerts,
    stats,
    isConnected,
    updateAlertStatus,
    addAlert,
  }
}
