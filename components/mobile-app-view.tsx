"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Shield,
  Phone,
  Mic,
  MapPin,
  Users,
  AlertTriangle,
  Navigation,
  Camera,
  MessageSquare,
  User,
  Globe,
  Zap,
  Clock,
  CheckCircle,
  Volume2,
} from "lucide-react"
import { MobileOfflineFeatures } from "@/components/mobile-offline-features"
import { useRealtime } from "@/hooks/use-realtime"
import { useOfflineSync } from "@/hooks/use-offline-sync"

export function MobileAppView() {
  const { addAlert } = useRealtime()
  const { addToOfflineQueue } = useOfflineSync()
  const [activeTab, setActiveTab] = useState("emergency")
  const [isRecording, setIsRecording] = useState(false)
  const [sosActive, setSosActive] = useState(false)

  const handleEmergencySOS = () => {
    setSosActive(true)

    // Add to real-time alerts
    addAlert({
      type: "SOS",
      message: "Emergency SOS activated from mobile app",
      location: "Current GPS Location",
      priority: "high",
      status: "active",
      reportedBy: "Mobile App User",
      phoneNumber: "+2348123456789",
    })

    // Also add to offline queue as backup
    addToOfflineQueue(
      "alert",
      {
        type: "emergency",
        location: "Current GPS coordinates",
        timestamp: Date.now(),
      },
      "high",
    )

    // Auto-deactivate after 30 seconds for demo
    setTimeout(() => setSosActive(false), 30000)
  }

  const handleCrimeReport = (crimeType: string, description: string) => {
    addAlert({
      type: "Crime",
      message: `${crimeType}: ${description}`,
      location: "User's Current Location",
      priority: "medium",
      status: "active",
      reportedBy: "Mobile App User",
    })
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Phone Frame */}
      <div className="bg-black rounded-3xl p-2 shadow-2xl">
        <div className="bg-white rounded-2xl overflow-hidden h-[700px] flex flex-col">
          {/* Status Bar */}
          <div className="bg-slate-900 text-white px-4 py-2 flex justify-between items-center text-xs">
            <span>9:41 AM</span>
            <div className="flex items-center space-x-1">
              <div className="w-4 h-2 border border-white rounded-sm">
                <div className="w-3 h-1 bg-green-500 rounded-sm"></div>
              </div>
            </div>
          </div>

          {/* Header */}
          <div className="bg-slate-900 text-white px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Shield className="h-6 w-6 text-yellow-400" />
                <div>
                  <h1 className="font-bold text-lg">SafeNaija</h1>
                  <p className="text-xs text-slate-400">Your Safety Companion</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs">Online</span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-slate-100 px-4 py-2">
            <div className="flex space-x-1">
              <Button
                size="sm"
                variant={activeTab === "emergency" ? "default" : "ghost"}
                onClick={() => setActiveTab("emergency")}
                className="flex-1 text-xs"
              >
                Emergency
              </Button>
              <Button
                size="sm"
                variant={activeTab === "report" ? "default" : "ghost"}
                onClick={() => setActiveTab("report")}
                className="flex-1 text-xs"
              >
                Report
              </Button>
              <Button
                size="sm"
                variant={activeTab === "safety" ? "default" : "ghost"}
                onClick={() => setActiveTab("safety")}
                className="flex-1 text-xs"
              >
                Safety
              </Button>
              <Button
                size="sm"
                variant={activeTab === "offline" ? "default" : "ghost"}
                onClick={() => setActiveTab("offline")}
                className="flex-1 text-xs"
              >
                Offline
              </Button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto">
            {/* Emergency Tab */}
            {activeTab === "emergency" && (
              <div className="p-4 space-y-4">
                {/* SOS Button */}
                <Card className="border-red-200 bg-red-50">
                  <CardContent className="p-6 text-center">
                    <Button
                      size="lg"
                      className={`w-32 h-32 rounded-full text-white font-bold text-xl transition-all duration-300 ${
                        sosActive
                          ? "bg-red-600 animate-pulse shadow-lg shadow-red-500/50"
                          : "bg-red-500 hover:bg-red-600 hover:shadow-lg hover:shadow-red-500/30"
                      }`}
                      onClick={handleEmergencySOS}
                    >
                      {sosActive ? (
                        <div className="flex flex-col items-center">
                          <Zap className="h-8 w-8 mb-1" />
                          <span className="text-sm">SENT!</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <AlertTriangle className="h-8 w-8 mb-1" />
                          <span>SOS</span>
                        </div>
                      )}
                    </Button>
                    <p className="text-sm text-red-700 mt-3">
                      {sosActive
                        ? "Emergency alert sent! Help is on the way."
                        : "Tap for immediate emergency assistance"}
                    </p>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center space-y-1 bg-transparent hover:bg-slate-100 transition-colors"
                    onClick={() => {
                      setIsRecording(!isRecording)
                      if (!isRecording) {
                        setTimeout(() => {
                          setIsRecording(false)
                          alert("Voice note recorded and saved offline!")
                        }, 3000)
                      }
                    }}
                  >
                    <Mic className={`h-6 w-6 ${isRecording ? "text-red-500 animate-pulse" : "text-slate-600"}`} />
                    <span className="text-xs">{isRecording ? "Recording..." : "Voice Note"}</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center space-y-1 bg-transparent hover:bg-slate-100 transition-colors"
                    onClick={() => alert("Camera opened! Photo evidence captured and saved.")}
                  >
                    <Camera className="h-6 w-6 text-slate-600" />
                    <span className="text-xs">Photo Evidence</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center space-y-1 bg-transparent hover:bg-slate-100 transition-colors"
                    onClick={() => alert("Location shared with emergency contacts!\nGPS: 6.5244°N, 3.3792°E")}
                  >
                    <Navigation className="h-6 w-6 text-blue-600" />
                    <span className="text-xs">Share Location</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center space-y-1 bg-transparent hover:bg-slate-100 transition-colors"
                    onClick={() => alert("Calling Nigerian Police Emergency Line...\n📞 199")}
                  >
                    <Phone className="h-6 w-6 text-green-600" />
                    <span className="text-xs">Call Police</span>
                  </Button>
                </div>

                {/* Emergency Contacts */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      Emergency Contacts
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">John Doe</p>
                          <p className="text-xs text-slate-500">Brother</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => alert("Calling John Doe...\n📞 +234 803 123 4567\nEmergency alert sent!")}
                      >
                        <Phone className="h-3 w-3" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Mary Johnson</p>
                          <p className="text-xs text-slate-500">Friend</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <Phone className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Report Tab */}
            {activeTab === "report" && (
              <div className="p-4 space-y-4">
                {/* Quick Report Types */}
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="h-16 flex flex-col items-center space-y-1 bg-transparent">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    <span className="text-xs">Crime</span>
                  </Button>

                  <Button variant="outline" className="h-16 flex flex-col items-center space-y-1 bg-transparent">
                    <Users className="h-5 w-5 text-orange-500" />
                    <span className="text-xs">Suspicious Activity</span>
                  </Button>

                  <Button variant="outline" className="h-16 flex flex-col items-center space-y-1 bg-transparent">
                    <Globe className="h-5 w-5 text-blue-500" />
                    <span className="text-xs">Cybercrime</span>
                  </Button>

                  <Button variant="outline" className="h-16 flex flex-col items-center space-y-1 bg-transparent">
                    <MessageSquare className="h-5 w-5 text-purple-500" />
                    <span className="text-xs">Other</span>
                  </Button>
                </div>

                {/* Report Form */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Submit Report</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label className="text-xs text-slate-600 mb-1 block">What happened?</label>
                      <Textarea placeholder="Describe the incident in detail..." className="text-sm" rows={3} />
                    </div>

                    <div>
                      <label className="text-xs text-slate-600 mb-1 block">Location</label>
                      <div className="flex space-x-2">
                        <Input placeholder="Enter location" className="text-sm" />
                        <Button size="sm" variant="outline">
                          <MapPin className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                        <Camera className="h-4 w-4 mr-1" />
                        Add Photo
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                        <Mic className="h-4 w-4 mr-1" />
                        Voice Note
                      </Button>
                    </div>

                    <Button className="w-full bg-blue-600 hover:bg-blue-700">Submit Report</Button>
                  </CardContent>
                </Card>

                {/* Language Support */}
                <Card>
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Volume2 className="h-4 w-4 text-slate-600" />
                        <span className="text-sm">Voice in local language</span>
                      </div>
                      <div className="flex space-x-1">
                        <Badge variant="outline" className="text-xs">
                          Hausa
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Yoruba
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Igbo
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Safety Tab */}
            {activeTab === "safety" && (
              <div className="p-4 space-y-4">
                {/* Follow Me Feature */}
                <Card className="border-green-200 bg-green-50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center text-green-700">
                      <Navigation className="h-4 w-4 mr-2" />
                      Follow Me Safety
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-green-700 mb-3">
                      Share your live location with trusted contacts during travel
                    </p>
                    <Button className="w-full bg-green-600 hover:bg-green-700">Start Follow Me</Button>
                  </CardContent>
                </Card>

                {/* Safety Tips */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Safety Tips</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-blue-900">Travel Safety</p>
                          <p className="text-xs text-blue-700">Always inform someone of your travel plans</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-yellow-900">Online Safety</p>
                          <p className="text-xs text-yellow-700">Never share personal information with strangers</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-purple-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-purple-900">Emergency Preparedness</p>
                          <p className="text-xs text-purple-700">Keep emergency numbers saved and accessible</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs">Report submitted</span>
                      </div>
                      <span className="text-xs text-slate-500">2h ago</span>
                    </div>

                    <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-xs">Location shared</span>
                      </div>
                      <span className="text-xs text-slate-500">1d ago</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Offline Tab */}
            {activeTab === "offline" && (
              <div className="p-4">
                <MobileOfflineFeatures />
              </div>
            )}
          </div>

          {/* Bottom Navigation */}
          <div className="bg-slate-100 px-4 py-2 border-t">
            <div className="flex justify-center items-center space-x-4">
              <div className="flex items-center space-x-1 text-xs text-slate-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Connected to SafeNaija Command</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
