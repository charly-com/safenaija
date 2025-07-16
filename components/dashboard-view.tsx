"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import {
  Shield,
  MapPin,
  Users,
  Clock,
  TrendingUp,
  Radio,
  Car,
  Phone,
  Mic,
  Navigation,
  Activity,
  Zap,
  Target,
  Settings,
  FileText,
  Bell,
} from "lucide-react"

import { USSDIntegration } from "@/components/ussd-integration"
import { OfflineSyncStatus } from "@/components/offline-sync-status"
import { useRealtime } from "@/hooks/use-realtime"
import { useAuth } from "@/components/auth-provider"
import { RealtimeNotifications } from "@/components/realtime-notifications"
import { SoundNotifications } from "@/components/sound-notifications"
import  AIInsightsCard  from "@/components/AIInsights";
import { ExportData } from "@/components/export-data"
import { SystemHealth } from "@/components/system-health"
import { KeyboardShortcuts } from "@/components/keyboard-shortcuts"
import { useToast } from "@/hooks/use-toast"

const patrolUnits = [
  { id: "A", name: "Police Unit A", location: "Victoria Island", status: "available", officers: 4 },
  { id: "B", name: "Police Unit B", location: "Ikeja", status: "on-patrol", officers: 3 },
  { id: "C", name: "Police Unit C", location: "Surulere", status: "responding", officers: 5 },
  { id: "D", name: "Police Unit D", location: "Lekki", status: "available", officers: 4 },
]

export function DashboardView() {
  const { user, logout } = useAuth()
  const { alerts, stats, isConnected, updateAlertStatus, addAlert } = useRealtime()
  const { toast } = useToast()
  const [selectedState, setSelectedState] = useState("all")
  const [selectedCrimeType, setSelectedCrimeType] = useState("all")

  // Filter alerts based on selected filters
  const filteredAlerts = alerts.filter((alert) => {
    if (selectedState !== "all" && !alert.location.toLowerCase().includes(selectedState)) {
      return false
    }
    if (selectedCrimeType !== "all" && alert.type.toLowerCase() !== selectedCrimeType) {
      return false
    }
    return true
  })

  return (
    <div className="h-screen bg-slate-900 text-white flex flex-col overflow-hidden">
      {/* Add sound notifications */}
      <SoundNotifications />

      {/* Add keyboard shortcuts */}
      <KeyboardShortcuts />

      {/* Add notifications overlay */}
      <RealtimeNotifications />

      {/* Header - Fixed */}
      <div className="bg-slate-800 border-b border-slate-700 flex-shrink-0">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-yellow-400" />
              <div>
                <h1 className="text-xl font-bold text-white">SafeNaija AI Dashboard</h1>
                <p className="text-xs text-slate-400">Nigerian Police Force Command Center</p>
              </div>
            </div>

            {/* Real-time connection indicator */}
            <div className="flex items-center space-x-2">
              <div
                className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"}`}
              ></div>
              <span className="text-xs text-slate-400">{isConnected ? "Live" : "Disconnected"}</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <nav className="flex items-center space-x-6">
              <Button
                variant="ghost"
                className="text-yellow-400 hover:text-yellow-300"
                onClick={() => window.location.reload()}
              >
                Dashboard
              </Button>
              <Button
                variant="ghost"
                className="text-slate-300 hover:text-white"
                onClick={() => {
                  toast({
                    title: "Reports Module",
                    description: "Generating comprehensive crime reports...",
                  })
                }}
              >
                <FileText className="h-4 w-4 mr-2" />
                Reports
              </Button>
              <Button
                variant="ghost"
                className="text-slate-300 hover:text-white"
                onClick={() => {
                  toast({
                    title: "Patrol Tracker",
                    description: "Switch to Patrol Tracker tab for real-time unit tracking",
                  })
                }}
              >
                <Car className="h-4 w-4 mr-2" />
                Patrol Tracker
              </Button>
              <Button
                variant="ghost"
                className="text-slate-300 hover:text-white"
                onClick={() => document.querySelector("[data-alerts-section]")?.scrollIntoView({ behavior: "smooth" })}
              >
                <Bell className="h-4 w-4 mr-2" />
                Alerts
              </Button>
              <Button
                variant="ghost"
                className="text-slate-300 hover:text-white"
                onClick={() => {
                  toast({
                    title: "Settings",
                    description: "Dashboard configuration panel opening...",
                  })
                }}
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </nav>

            {/* User info and logout */}
            <div className="flex items-center space-x-3 border-l border-slate-600 pl-4">
              <div className="text-right">
                <p className="text-sm text-white">{user?.name}</p>
                <p className="text-xs text-slate-400">
                  {user?.rank} - {user?.state}
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={logout} className="text-slate-400 hover:text-white">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout - Flex container */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 bg-slate-800 border-r border-slate-700 p-6 overflow-y-auto flex-shrink-0">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-slate-300 mb-3">Filters</h3>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-slate-400 mb-2 block">Date Range</label>
                  <Input type="date" className="bg-slate-700 border-slate-600 text-white" />
                </div>

                <div>
                  <label className="text-xs text-slate-400 mb-2 block">Crime Type</label>
                  <Select value={selectedCrimeType} onValueChange={setSelectedCrimeType}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="all">All Crime Types</SelectItem>
                      <SelectItem value="kidnapping">Kidnapping</SelectItem>
                      <SelectItem value="robbery">Robbery</SelectItem>
                      <SelectItem value="assault">Assault</SelectItem>
                      <SelectItem value="cybercrime">Cybercrime</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 mb-2 block">State/LGA</label>
                  <Select value={selectedState} onValueChange={setSelectedState}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="all">All States</SelectItem>
                      <SelectItem value="lagos">Lagos State</SelectItem>
                      <SelectItem value="kaduna">Kaduna State</SelectItem>
                      <SelectItem value="zamfara">Zamfara State</SelectItem>
                      <SelectItem value="akwa-ibom">Akwa Ibom State</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-slate-300">Today's Overview</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                  <span className="text-sm text-slate-300">Incidents Today</span>
                  <Badge variant="destructive">{stats.activeAlerts}</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                  <span className="text-sm text-slate-300">Threat Level</span>
                  <Badge className="bg-yellow-600">
                    {stats.activeAlerts > 10 ? "High" : stats.activeAlerts > 5 ? "Medium" : "Low"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                  <span className="text-sm text-slate-300">Online Officers</span>
                  <Badge className="bg-green-600">{stats.onlineOfficers}</Badge>
                </div>
              </div>
            </div>

            {/* System Health */}
            <SystemHealth />

            {/* Export Data */}
            <ExportData />

            {/* Offline Sync Status */}
            <OfflineSyncStatus />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="grid grid-cols-12 gap-6 min-h-full">
            {/* Crime Heatmap */}
            <Card className="col-span-8 bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-red-400" />
                  Crime Hotspots - Nigeria
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96 bg-slate-700 rounded-lg flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-yellow-900/20 to-green-900/20"></div>
                  <div className="text-center z-10">
                    <MapPin className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-400">Interactive Nigeria Map</p>
                    <p className="text-xs text-slate-500 mt-2">Crime density visualization</p>
                  </div>

                  {/* Mock hotspot indicators */}
                  <div className="absolute top-1/4 left-1/3 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                  <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                  <div className="absolute bottom-1/3 right-1/3 w-5 h-5 bg-red-600 rounded-full animate-pulse"></div>
                </div>
              </CardContent>
            </Card>

            {/* AI Predictions */}
            <Card className="col-span-4 bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-yellow-400" />
                  AI Predictions
                </CardTitle>
               
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-red-900/30 border border-red-700 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Target className="h-4 w-4 text-red-400 mr-2" />
                      <span className="text-sm font-medium text-red-400">Next Risk Zone</span>
                    </div>
                    <p className="text-sm text-white">Mushin, Lagos</p>
                    <p className="text-xs text-slate-400">Robbery risk: 78% (Next 24h)</p>
                  </div>

                  <div className="p-4 bg-yellow-900/30 border border-yellow-700 rounded-lg">
                    <div className="flex items-center mb-2">
                      <TrendingUp className="h-4 w-4 text-yellow-400 mr-2" />
                      <span className="text-sm font-medium text-yellow-400">Trend Alert</span>
                    </div>
                    <p className="text-sm text-white">Kidnapping spike detected</p>
                    <p className="text-xs text-slate-400">Kaduna-Abuja highway</p>
                  </div>

                  <div className="p-4 bg-blue-900/30 border border-blue-700 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Activity className="h-4 w-4 text-blue-400 mr-2" />
                      <span className="text-sm font-medium text-blue-400">Pattern Analysis</span>
                    </div>
                    <p className="text-sm text-white">Cybercrime increase</p>
                    <p className="text-xs text-slate-400">Weekend activity +45%</p>
                  </div>
                </div>
                {/* <AIInsightsCard /> */}
              </CardContent>
            </Card>

            {/* Live Alerts Feed */}
            <Card className="col-span-6 bg-slate-800 border-slate-700" data-alerts-section>
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Radio className="h-5 w-5 mr-2 text-green-400" />
                  Live Alerts Feed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {filteredAlerts.slice(0, 10).map((alert) => (
                    <div key={alert.id} className="p-4 bg-slate-700 rounded-lg border-l-4 border-red-500">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Badge variant={alert.priority === "high" ? "destructive" : "secondary"} className="text-xs">
                            {alert.type}
                          </Badge>
                          <span className="text-xs text-slate-400">
                            {new Date(alert.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            alert.status === "active"
                              ? "border-red-500 text-red-400"
                              : alert.status === "investigating"
                                ? "border-yellow-500 text-yellow-400"
                                : "border-green-500 text-green-400"
                          }`}
                        >
                          {alert.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-white mb-2">{alert.message}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400 flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {alert.location}
                        </span>
                        <div className="flex space-x-1">
                          {alert.status === "active" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs bg-transparent"
                              onClick={() => updateAlertStatus(alert.id, "investigating")}
                            >
                              Investigate
                            </Button>
                          )}
                          {alert.status === "investigating" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs bg-transparent"
                              onClick={() => updateAlertStatus(alert.id, "resolved")}
                            >
                              Resolve
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Patrol Assignment */}
            <Card className="col-span-6 bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Car className="h-5 w-5 mr-2 text-blue-400" />
                  Patrol Units
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {patrolUnits.map((unit) => (
                    <div key={unit.id} className="p-3 bg-slate-700 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                            {unit.id}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{unit.name}</p>
                            <p className="text-xs text-slate-400">{unit.location}</p>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            unit.status === "available"
                              ? "border-green-500 text-green-400"
                              : unit.status === "on-patrol"
                                ? "border-blue-500 text-blue-400"
                                : "border-yellow-500 text-yellow-400"
                          }`}
                        >
                          {unit.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400 flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          {unit.officers} officers
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs bg-transparent hover:bg-slate-600"
                          disabled={unit.status === "responding"}
                          onClick={() => {
                            if (unit.status === "responding") return
                            alert(`Unit ${unit.id} deployed to nearest incident!\nETA: 8 minutes\nStatus: En route`)
                          }}
                        >
                          {unit.status === "responding" ? "Deployed" : "Deploy"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Response Metrics */}
            <Card className="col-span-6 bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-purple-400" />
                  Response Time Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-300">Average Response Time</span>
                    <span className="text-lg font-bold text-green-400">8.5 min</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: "75%" }}></div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="text-center p-3 bg-slate-700 rounded-lg">
                      <p className="text-2xl font-bold text-blue-400">23</p>
                      <p className="text-xs text-slate-400">Resolved Today</p>
                    </div>
                    <div className="text-center p-3 bg-slate-700 rounded-lg">
                      <p className="text-2xl font-bold text-yellow-400">12</p>
                      <p className="text-xs text-slate-400">In Progress</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Citizen App Preview */}
            <Card className="col-span-6 bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Phone className="h-5 w-5 mr-2 text-green-400" />
                  Citizen App Inputs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div
                    className="p-3 bg-slate-700 rounded-lg border border-red-500 cursor-pointer hover:bg-slate-600 transition-colors"
                    onClick={() => {
                      addAlert({
                        type: "SOS",
                        message: "Emergency SOS activated from citizen app",
                        location: "Lagos Island",
                        priority: "high",
                        status: "active",
                        reportedBy: "Citizen App User",
                      })
                      alert("SOS Alert sent to command center!")
                    }}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-red-400">SOS Alert</span>
                      <span className="text-xs text-slate-400 ml-auto">Click to simulate</span>
                    </div>
                    <p className="text-xs text-white">Emergency button pressed</p>
                    <p className="text-xs text-slate-400">GPS: 6.5244°N, 3.3792°E</p>
                  </div>

                  <div
                    className="p-3 bg-slate-700 rounded-lg border border-blue-500 cursor-pointer hover:bg-slate-600 transition-colors"
                    onClick={() => {
                      addAlert({
                        type: "Crime",
                        message: "Voice report: Armed robbery in progress at First Bank",
                        location: "Victoria Island, Lagos",
                        priority: "high",
                        status: "active",
                        reportedBy: "Voice Report",
                      })
                      alert("Voice report processed and alert created!")
                    }}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <Mic className="w-3 h-3 text-blue-400" />
                      <span className="text-sm font-medium text-blue-400">Voice Note</span>
                      <span className="text-xs text-slate-400 ml-auto">Click to simulate</span>
                    </div>
                    <p className="text-xs text-white">Audio report received</p>
                    <p className="text-xs text-slate-400">Duration: 0:45s</p>
                  </div>

                  <div
                    className="p-3 bg-slate-700 rounded-lg border border-green-500 cursor-pointer hover:bg-slate-600 transition-colors"
                    onClick={() => {
                      alert(
                        "GPS tracking activated! User location: Lagos Island\nFollow-me mode: ACTIVE\nEmergency contacts notified.",
                      )
                    }}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <Navigation className="w-3 h-3 text-green-400" />
                      <span className="text-sm font-medium text-green-400">GPS Tracking</span>
                      <span className="text-xs text-slate-400 ml-auto">Click to simulate</span>
                    </div>
                    <p className="text-xs text-white">Live location shared</p>
                    <p className="text-xs text-slate-400">Follow-me mode active</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* USSD Integration Panel */}
            <div className="col-span-12">
              <USSDIntegration />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
