"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Car, MapPin, Users, Clock, AlertTriangle, Zap, Settings } from "lucide-react"

interface PatrolUnit {
  id: string
  name: string
  location: string
  coordinates: { lat: number; lng: number }
  status: "available" | "on-patrol" | "responding" | "offline"
  officers: number
  lastUpdate: number
  currentIncident?: string
  route?: string[]
}

export function PatrolTracker() {
  const { toast } = useToast()
  const [units, setUnits] = useState<PatrolUnit[]>([])
  const [selectedUnit, setSelectedUnit] = useState<PatrolUnit | null>(null)
  const [filterStatus, setFilterStatus] = useState("all")

  useEffect(() => {
    const mockUnits: PatrolUnit[] = [
      {
        id: "UNIT-001",
        name: "Alpha Team",
        location: "Victoria Island, Lagos",
        coordinates: { lat: 6.4281, lng: 3.4219 },
        status: "on-patrol",
        officers: 4,
        lastUpdate: Date.now() - 120000,
        route: ["Victoria Island", "Ikoyi", "Lekki"],
      },
      {
        id: "UNIT-002",
        name: "Bravo Squad",
        location: "Ikeja, Lagos",
        coordinates: { lat: 6.6018, lng: 3.3515 },
        status: "available",
        officers: 3,
        lastUpdate: Date.now() - 300000,
      },
      {
        id: "UNIT-003",
        name: "Charlie Unit",
        location: "Surulere, Lagos",
        coordinates: { lat: 6.5027, lng: 3.3588 },
        status: "responding",
        officers: 5,
        lastUpdate: Date.now() - 60000,
        currentIncident: "Armed robbery at First Bank",
      },
      {
        id: "UNIT-004",
        name: "Delta Force",
        location: "Kaduna Central",
        coordinates: { lat: 10.5105, lng: 7.4165 },
        status: "available",
        officers: 4,
        lastUpdate: Date.now() - 180000,
      },
      {
        id: "UNIT-005",
        name: "Echo Team",
        location: "Abuja FCT",
        coordinates: { lat: 9.0579, lng: 7.4951 },
        status: "offline",
        officers: 2,
        lastUpdate: Date.now() - 1800000,
      },
    ]

    setUnits(mockUnits)

    // Simulate real-time updates
    const interval = setInterval(() => {
      setUnits((prev) =>
        prev.map((unit) => ({
          ...unit,
          lastUpdate: unit.status === "offline" ? unit.lastUpdate : Date.now() - Math.random() * 300000,
          coordinates: {
            lat: unit.coordinates.lat + (Math.random() - 0.5) * 0.01,
            lng: unit.coordinates.lng + (Math.random() - 0.5) * 0.01,
          },
        })),
      )
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const filteredUnits = units.filter((unit) => filterStatus === "all" || unit.status === filterStatus)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-500 text-white"
      case "on-patrol":
        return "bg-blue-500 text-white"
      case "responding":
        return "bg-red-500 text-white"
      case "offline":
        return "bg-gray-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const deployUnit = (unitId: string, incident: string) => {
    setUnits((prev) =>
      prev.map((unit) =>
        unit.id === unitId
          ? { ...unit, status: "responding" as const, currentIncident: incident, lastUpdate: Date.now() }
          : unit,
      ),
    )

    toast({
      title: "Unit Deployed",
      description: `${units.find((u) => u.id === unitId)?.name} dispatched to incident`,
    })
  }

  const formatLastUpdate = (timestamp: number) => {
    const diff = Date.now() - timestamp
    const minutes = Math.floor(diff / 60000)
    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    return `${hours}h ago`
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center">
              <Car className="h-8 w-8 mr-3 text-blue-400" />
              Patrol Tracker
            </h1>
            <p className="text-slate-400 mt-1">Real-time patrol unit monitoring and deployment</p>
          </div>
          <div className="flex items-center space-x-4">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48 bg-slate-700 border-slate-600">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Units</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="on-patrol">On Patrol</SelectItem>
                <SelectItem value="responding">Responding</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-120px)]">
        {/* Map Area */}
        <div className="flex-1 p-6">
          <Card className="h-full bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-red-400" />
                Live Map View
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[calc(100%-80px)]">
              <div className="h-full bg-slate-700 rounded-lg relative overflow-hidden">
                {/* Mock Map Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600"></div>

                {/* Unit Markers */}
                {filteredUnits.map((unit, index) => (
                  <div
                    key={unit.id}
                    className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: `${20 + index * 15}%`,
                      top: `${30 + index * 12}%`,
                    }}
                    onClick={() => setSelectedUnit(unit)}
                  >
                    <div className={`w-4 h-4 rounded-full ${getStatusColor(unit.status)} animate-pulse`}></div>
                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-white bg-black/70 px-2 py-1 rounded whitespace-nowrap">
                      {unit.name}
                    </div>
                  </div>
                ))}

                {/* Map Legend */}
                <div className="absolute bottom-4 left-4 bg-black/80 p-3 rounded-lg">
                  <h4 className="text-xs font-medium text-white mb-2">Unit Status</h4>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-white">Available</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-xs text-white">On Patrol</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-xs text-white">Responding</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                      <span className="text-xs text-white">Offline</span>
                    </div>
                  </div>
                </div>

                {/* Center text */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-16 w-16 text-slate-500 mx-auto mb-4" />
                    <p className="text-slate-400">Interactive Map View</p>
                    <p className="text-xs text-slate-500 mt-2">Click on unit markers for details</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Units Panel */}
        <div className="w-96 bg-slate-800 border-l border-slate-700 p-6 overflow-y-auto">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Active Units</h3>
              <Badge variant="outline" className="text-slate-300">
                {filteredUnits.length} units
              </Badge>
            </div>

            {filteredUnits.map((unit) => (
              <Card key={unit.id} className="bg-slate-700 border-slate-600">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-white">{unit.name}</h4>
                      <p className="text-sm text-slate-400">{unit.id}</p>
                    </div>
                    <Badge className={getStatusColor(unit.status)} variant="secondary">
                      {unit.status.replace("-", " ")}
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="flex items-center text-sm text-slate-300">
                      <MapPin className="h-4 w-4 mr-2" />
                      {unit.location}
                    </div>
                    <div className="flex items-center text-sm text-slate-300">
                      <Users className="h-4 w-4 mr-2" />
                      {unit.officers} officers
                    </div>
                    <div className="flex items-center text-sm text-slate-300">
                      <Clock className="h-4 w-4 mr-2" />
                      {formatLastUpdate(unit.lastUpdate)}
                    </div>
                  </div>

                  {unit.currentIncident && (
                    <div className="mb-3 p-2 bg-red-900/30 border border-red-700 rounded">
                      <div className="flex items-center text-sm text-red-400">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        {unit.currentIncident}
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                          <Settings className="h-4 w-4 mr-1" />
                          Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-slate-800 border-slate-700">
                        <DialogHeader>
                          <DialogTitle className="text-white">{unit.name} Details</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm text-slate-400">Unit ID</label>
                              <p className="text-white">{unit.id}</p>
                            </div>
                            <div>
                              <label className="text-sm text-slate-400">Status</label>
                              <Badge className={getStatusColor(unit.status)} variant="secondary">
                                {unit.status}
                              </Badge>
                            </div>
                          </div>
                          <div>
                            <label className="text-sm text-slate-400">Current Location</label>
                            <p className="text-white">{unit.location}</p>
                          </div>
                          <div>
                            <label className="text-sm text-slate-400">Coordinates</label>
                            <p className="text-white">
                              {unit.coordinates.lat.toFixed(4)}, {unit.coordinates.lng.toFixed(4)}
                            </p>
                          </div>
                          {unit.route && (
                            <div>
                              <label className="text-sm text-slate-400">Patrol Route</label>
                              <p className="text-white">{unit.route.join(" → ")}</p>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-transparent"
                      disabled={unit.status === "responding" || unit.status === "offline"}
                      onClick={() => deployUnit(unit.id, "Priority incident deployment")}
                    >
                      <Zap className="h-4 w-4 mr-1" />
                      Deploy
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
