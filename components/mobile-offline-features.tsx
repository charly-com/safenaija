"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Wifi, WifiOff, Phone, MessageSquare, Database, Upload, Battery } from "lucide-react"
import { useOfflineSync } from "@/hooks/use-offline-sync"

export function MobileOfflineFeatures() {
  const { syncStatus, addToOfflineQueue, offlineQueue } = useOfflineSync()
  const [batteryLevel, setBatteryLevel] = useState(85)
  const [signalStrength, setSignalStrength] = useState(2) // 0-4 bars

  // Simulate battery and signal changes
  useEffect(() => {
    const interval = setInterval(() => {
      setBatteryLevel((prev) => Math.max(20, prev - Math.random() * 2))
      setSignalStrength((prev) => Math.floor(Math.random() * 5))
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const handleOfflineReport = (type: string, data: any) => {
    addToOfflineQueue("report", { type, ...data }, "high")
  }

  const handleOfflineEmergency = () => {
    const emergencyData = {
      type: "emergency",
      location: "Current GPS coordinates",
      timestamp: Date.now(),
      batteryLevel,
      signalStrength,
    }
    addToOfflineQueue("alert", emergencyData, "high")
  }

  const getSignalBars = () => {
    return Array.from({ length: 4 }, (_, i) => (
      <div
        key={i}
        className={`w-1 bg-current ${i < signalStrength ? "opacity-100" : "opacity-30"}`}
        style={{ height: `${(i + 1) * 3 + 2}px` }}
      />
    ))
  }

  return (
    <div className="space-y-4">
      {/* Device Status */}
      <Card className="border-slate-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center justify-between">
            <span className="flex items-center">
              {syncStatus.isOnline ? (
                <Wifi className="h-4 w-4 mr-2 text-green-600" />
              ) : (
                <WifiOff className="h-4 w-4 mr-2 text-red-600" />
              )}
              Device Status
            </span>
            <div className="flex items-center space-x-2">
              <div className="flex items-end space-x-0.5">{getSignalBars()}</div>
              <Battery className={`h-4 w-4 ${batteryLevel > 20 ? "text-green-600" : "text-red-600"}`} />
              <span className="text-xs">{batteryLevel}%</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Connection</span>
              <Badge variant={syncStatus.isOnline ? "default" : "destructive"}>
                {syncStatus.isOnline ? "Online" : "Offline Mode"}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Pending Sync</span>
              <Badge variant="outline">{syncStatus.pendingItems} items</Badge>
            </div>

            {!syncStatus.isOnline && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs text-yellow-800">
                  <WifiOff className="h-3 w-3 inline mr-1" />
                  Offline mode active. Reports will sync when connection is restored.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Offline Emergency Actions */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-red-800">Emergency (Works Offline)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Button className="w-full bg-red-600 hover:bg-red-700 text-white" onClick={handleOfflineEmergency}>
              <Phone className="h-4 w-4 mr-2" />
              Emergency SOS
            </Button>

            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" onClick={() => handleOfflineReport("ussd", { code: "*234*911#" })}>
                <MessageSquare className="h-3 w-3 mr-1" />
                USSD Alert
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleOfflineReport("sms", { message: "Emergency help needed" })}
              >
                <MessageSquare className="h-3 w-3 mr-1" />
                SMS Backup
              </Button>
            </div>

            <div className="text-xs text-red-700 bg-red-100 p-2 rounded">
              <strong>USSD Codes (No Internet Required):</strong>
              <br />• *234*911# - Emergency
              <br />• *234*100# - Crime Report
              <br />• *234*199# - Safety Check
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Offline Queue Status */}
      {offlineQueue.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-blue-800 flex items-center">
              <Database className="h-4 w-4 mr-2" />
              Offline Queue ({offlineQueue.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {offlineQueue.slice(0, 3).map((item, index) => (
                <div key={item.id} className="flex items-center justify-between p-2 bg-white rounded border">
                  <div className="flex items-center space-x-2">
                    <Upload className="h-3 w-3 text-blue-600" />
                    <span className="text-xs capitalize">{item.type}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {item.priority}
                  </Badge>
                </div>
              ))}

              {offlineQueue.length > 3 && (
                <p className="text-xs text-blue-700 text-center">
                  +{offlineQueue.length - 3} more items waiting to sync
                </p>
              )}

              {syncStatus.syncInProgress && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-blue-700">Syncing...</span>
                    <span className="text-xs text-blue-700">65%</span>
                  </div>
                  <Progress value={65} className="h-1" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Offline Features Guide */}
      <Card className="border-slate-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Offline Features Available</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs">Emergency SOS (USSD/SMS)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs">Voice recordings saved locally</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs">GPS coordinates cached</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs">Reports queued for sync</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-xs">Auto-sync when online</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
