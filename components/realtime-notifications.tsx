"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, AlertTriangle, Clock } from "lucide-react"
import { useRealtime } from "@/hooks/use-realtime"

interface Notification {
  id: string
  title: string
  message: string
  type: "alert" | "info" | "warning"
  timestamp: number
  read: boolean
}

export function RealtimeNotifications() {
  const { alerts } = useRealtime()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showNotifications, setShowNotifications] = useState(false)

  // Convert new alerts to notifications
  useEffect(() => {
    const latestAlert = alerts[0]
    if (latestAlert && latestAlert.status === "active") {
      const notification: Notification = {
        id: latestAlert.id,
        title: `New ${latestAlert.type} Alert`,
        message: `${latestAlert.message} - ${latestAlert.location}`,
        type: latestAlert.priority === "high" ? "alert" : "warning",
        timestamp: latestAlert.timestamp,
        read: false,
      }

      setNotifications((prev) => {
        // Avoid duplicates
        if (prev.some((n) => n.id === notification.id)) return prev
        return [notification, ...prev.slice(0, 9)] // Keep last 10
      })

      // Auto-show notifications for high priority
      if (latestAlert.priority === "high") {
        setShowNotifications(true)

        // Auto-hide after 10 seconds
        setTimeout(() => setShowNotifications(false), 10000)
      }
    }
  }, [alerts])

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  if (!showNotifications && unreadCount === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 w-96">
      {/* Notification Toggle */}
      <div className="flex justify-end mb-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowNotifications(!showNotifications)}
          className="bg-slate-800 border-slate-600 text-white"
        >
          Notifications{" "}
          {unreadCount > 0 && (
            <Badge variant="destructive" className="ml-2 text-xs">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Notifications Panel */}
      {showNotifications && (
        <Card className="bg-slate-800 border-slate-700 max-h-96 overflow-hidden">
          <CardContent className="p-0">
            <div className="p-3 border-b border-slate-700 flex items-center justify-between">
              <h3 className="text-sm font-medium text-white">Live Notifications</h3>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowNotifications(false)}
                className="h-6 w-6 p-0 text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-slate-400 text-sm">No new notifications</div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 border-b border-slate-700 hover:bg-slate-700 cursor-pointer ${
                      !notification.read ? "bg-slate-750" : ""
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle
                          className={`h-4 w-4 ${notification.type === "alert" ? "text-red-400" : "text-yellow-400"}`}
                        />
                        <span className="text-sm font-medium text-white">{notification.title}</span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation()
                          removeNotification(notification.id)
                        }}
                        className="h-4 w-4 p-0 text-slate-400 hover:text-white"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>

                    <p className="text-xs text-slate-300 mb-2">{notification.message}</p>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {new Date(notification.timestamp).toLocaleTimeString()}
                      </span>
                      {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
