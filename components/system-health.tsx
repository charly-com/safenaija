"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, Server, Database, Wifi, AlertTriangle } from "lucide-react"

interface SystemMetrics {
  cpu: number
  memory: number
  database: "healthy" | "warning" | "error"
  api: "online" | "slow" | "offline"
  websocket: "connected" | "reconnecting" | "disconnected"
  uptime: number
}

export function SystemHealth() {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpu: 45,
    memory: 62,
    database: "healthy",
    api: "online",
    websocket: "connected",
    uptime: 99.8,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        ...prev,
        cpu: Math.max(20, Math.min(90, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(30, Math.min(85, prev.memory + (Math.random() - 0.5) * 8)),
        uptime: Math.max(95, Math.min(100, prev.uptime + (Math.random() - 0.5) * 0.1)),
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
      case "online":
      case "connected":
        return "text-green-400 border-green-500"
      case "warning":
      case "slow":
      case "reconnecting":
        return "text-yellow-400 border-yellow-500"
      case "error":
      case "offline":
      case "disconnected":
        return "text-red-400 border-red-500"
      default:
        return "text-slate-400 border-slate-500"
    }
  }

  const getProgressColor = (value: number, type: "cpu" | "memory") => {
    if (type === "cpu") {
      if (value > 80) return "bg-red-500"
      if (value > 60) return "bg-yellow-500"
      return "bg-green-500"
    } else {
      if (value > 85) return "bg-red-500"
      if (value > 70) return "bg-yellow-500"
      return "bg-green-500"
    }
  }

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Activity className="h-5 w-5 mr-2 text-green-400" />
          System Health
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Resource Usage */}
        <div className="space-y-3">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-slate-300">CPU Usage</span>
              <span className="text-sm text-slate-400">{metrics.cpu.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(metrics.cpu, "cpu")}`}
                style={{ width: `${metrics.cpu}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-slate-300">Memory Usage</span>
              <span className="text-sm text-slate-400">{metrics.memory.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(metrics.memory, "memory")}`}
                style={{ width: `${metrics.memory}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Service Status */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Database className="h-4 w-4 text-slate-400" />
              <span className="text-sm text-slate-300">Database</span>
            </div>
            <Badge variant="outline" className={`text-xs ${getStatusColor(metrics.database)}`}>
              {metrics.database}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Server className="h-4 w-4 text-slate-400" />
              <span className="text-sm text-slate-300">API Server</span>
            </div>
            <Badge variant="outline" className={`text-xs ${getStatusColor(metrics.api)}`}>
              {metrics.api}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Wifi className="h-4 w-4 text-slate-400" />
              <span className="text-sm text-slate-300">WebSocket</span>
            </div>
            <Badge variant="outline" className={`text-xs ${getStatusColor(metrics.websocket)}`}>
              {metrics.websocket}
            </Badge>
          </div>
        </div>

        {/* Uptime */}
        <div className="pt-2 border-t border-slate-700">
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-300">System Uptime</span>
            <span className="text-sm font-medium text-green-400">{metrics.uptime.toFixed(1)}%</span>
          </div>
        </div>

        {/* Alerts */}
        {(metrics.cpu > 80 || metrics.memory > 85) && (
          <div className="p-2 bg-yellow-900/30 border border-yellow-700 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-yellow-400" />
              <span className="text-xs text-yellow-300">High resource usage detected</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
