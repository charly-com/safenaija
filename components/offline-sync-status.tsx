"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Wifi, WifiOff, RefreshCw, CheckCircle, AlertTriangle, Database, Upload } from "lucide-react"
import { useOfflineSync } from "@/hooks/use-offline-sync"

export function OfflineSyncStatus() {
  const { syncStatus, offlineQueue, syncOfflineData } = useOfflineSync()

  const formatLastSync = (timestamp: number | null) => {
    if (!timestamp) return "Never"
    const diff = Date.now() - timestamp
    const minutes = Math.floor(diff / 60000)
    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-400 border-red-500"
      case "medium":
        return "text-yellow-400 border-yellow-500"
      case "low":
        return "text-green-400 border-green-500"
      default:
        return "text-slate-400 border-slate-500"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "alert":
        return <AlertTriangle className="h-3 w-3" />
      case "report":
        return <Database className="h-3 w-3" />
      case "location":
        return <Upload className="h-3 w-3" />
      case "voice":
        return <Upload className="h-3 w-3" />
      default:
        return <Database className="h-3 w-3" />
    }
  }

  return (
    <div className="space-y-4">
      {/* Connection Status */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-white flex items-center text-sm">
            {syncStatus.isOnline ? (
              <Wifi className="h-4 w-4 mr-2 text-green-400" />
            ) : (
              <WifiOff className="h-4 w-4 mr-2 text-red-400" />
            )}
            Connection Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">Network</span>
              <Badge
                variant="outline"
                className={syncStatus.isOnline ? "border-green-500 text-green-400" : "border-red-500 text-red-400"}
              >
                {syncStatus.isOnline ? "Online" : "Offline"}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">Last Sync</span>
              <span className="text-sm text-slate-400">{formatLastSync(syncStatus.lastSync)}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">Pending Items</span>
              <Badge variant="outline" className="border-yellow-500 text-yellow-400">
                {syncStatus.pendingItems}
              </Badge>
            </div>

            {syncStatus.syncInProgress && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <RefreshCw className="h-3 w-3 text-blue-400 animate-spin" />
                  <span className="text-xs text-blue-400">Syncing...</span>
                </div>
                <Progress value={65} className="h-1" />
              </div>
            )}

            <Button
              size="sm"
              variant="outline"
              onClick={syncOfflineData}
              disabled={!syncStatus.isOnline || syncStatus.syncInProgress}
              className="w-full bg-transparent"
            >
              <RefreshCw className={`h-3 w-3 mr-2 ${syncStatus.syncInProgress ? "animate-spin" : ""}`} />
              {syncStatus.syncInProgress ? "Syncing..." : "Force Sync"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Offline Queue */}
      {offlineQueue.length > 0 && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center text-sm">
              <Database className="h-4 w-4 mr-2 text-blue-400" />
              Offline Queue ({offlineQueue.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {offlineQueue.slice(0, 10).map((item) => (
                <div key={item.id} className="p-2 bg-slate-700 rounded border-l-2 border-slate-600">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(item.type)}
                      <span className="text-xs text-white capitalize">{item.type}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className={`text-xs ${getPriorityColor(item.priority)}`}>
                        {item.priority}
                      </Badge>
                      <span className="text-xs text-slate-400">{formatLastSync(item.timestamp)}</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 truncate">
                    {typeof item.data === "string" ? item.data : JSON.stringify(item.data).substring(0, 50)}...
                  </p>
                </div>
              ))}

              {offlineQueue.length > 10 && (
                <div className="text-center py-2">
                  <span className="text-xs text-slate-400">+{offlineQueue.length - 10} more items</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sync Statistics */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-white flex items-center text-sm">
            <CheckCircle className="h-4 w-4 mr-2 text-green-400" />
            Sync Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-slate-700 rounded">
              <p className="text-lg font-bold text-green-400">156</p>
              <p className="text-xs text-slate-400">Items Synced Today</p>
            </div>
            <div className="text-center p-3 bg-slate-700 rounded">
              <p className="text-lg font-bold text-blue-400">98.5%</p>
              <p className="text-xs text-slate-400">Success Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
