"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Phone, MessageSquare, CheckCircle, Clock, Smartphone, Radio } from "lucide-react"

interface USSDSession {
  id: string
  phoneNumber: string
  sessionId: string
  currentStep: number
  data: Record<string, any>
  timestamp: number
  completed: boolean
}

interface USSDMessage {
  id: string
  phoneNumber: string
  message: string
  timestamp: number
  type: "incoming" | "outgoing"
  processed: boolean
}

export function USSDIntegration() {
  const [activeSessions, setActiveSessions] = useState<USSDSession[]>([])
  const [recentMessages, setRecentMessages] = useState<USSDMessage[]>([])
  const [ussdStats, setUssdStats] = useState({
    totalSessions: 0,
    activeSessions: 0,
    completedToday: 0,
    averageCompletionTime: 0,
  })

  // Mock USSD sessions for demonstration
  useEffect(() => {
    const mockSessions: USSDSession[] = [
      {
        id: "1",
        phoneNumber: "+2348123456789",
        sessionId: "USSD_001",
        currentStep: 2,
        data: { reportType: "emergency", location: "Lagos" },
        timestamp: Date.now() - 300000,
        completed: false,
      },
      {
        id: "2",
        phoneNumber: "+2347098765432",
        sessionId: "USSD_002",
        currentStep: 4,
        data: { reportType: "suspicious", location: "Kaduna", description: "Armed men spotted" },
        timestamp: Date.now() - 600000,
        completed: false,
      },
    ]

    const mockMessages: USSDMessage[] = [
      {
        id: "1",
        phoneNumber: "+2348123456789",
        message: "Emergency at Mile 2 Bridge, Lagos. Need immediate help.",
        timestamp: Date.now() - 180000,
        type: "incoming",
        processed: true,
      },
      {
        id: "2",
        phoneNumber: "+2347098765432",
        message: "Suspicious activity reported. Officers dispatched.",
        timestamp: Date.now() - 240000,
        type: "outgoing",
        processed: true,
      },
      {
        id: "3",
        phoneNumber: "+2349087654321",
        message: "Kidnappers spotted on Abuja-Kaduna road. 3 vehicles.",
        timestamp: Date.now() - 420000,
        type: "incoming",
        processed: false,
      },
    ]

    setActiveSessions(mockSessions)
    setRecentMessages(mockMessages)
    setUssdStats({
      totalSessions: 156,
      activeSessions: mockSessions.length,
      completedToday: 23,
      averageCompletionTime: 4.2,
    })
  }, [])

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp
    const minutes = Math.floor(diff / 60000)
    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    return `${hours}h ago`
  }

  const getStepDescription = (step: number) => {
    const steps = [
      "Welcome message",
      "Report type selection",
      "Location input",
      "Description input",
      "Confirmation",
      "Completed",
    ]
    return steps[step] || "Unknown step"
  }

  return (
    <div className="space-y-6">
      {/* USSD Stats Overview */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-white">{ussdStats.totalSessions}</p>
                <p className="text-xs text-slate-400">Total Sessions</p>
              </div>
              <Phone className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-400">{ussdStats.activeSessions}</p>
                <p className="text-xs text-slate-400">Active Now</p>
              </div>
              <Radio className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-yellow-400">{ussdStats.completedToday}</p>
                <p className="text-xs text-slate-400">Completed Today</p>
              </div>
              <CheckCircle className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-purple-400">{ussdStats.averageCompletionTime}m</p>
                <p className="text-xs text-slate-400">Avg. Time</p>
              </div>
              <Clock className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Active USSD Sessions */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Phone className="h-5 w-5 mr-2 text-green-400" />
              Active USSD Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {activeSessions.map((session) => (
                <div key={session.id} className="p-3 bg-slate-700 rounded-lg border-l-4 border-green-500">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm font-medium text-white">{session.phoneNumber}</p>
                      <p className="text-xs text-slate-400">Session: {session.sessionId}</p>
                    </div>
                    <Badge variant="outline" className="text-xs border-green-500 text-green-400">
                      Step {session.currentStep}/5
                    </Badge>
                  </div>

                  <div className="mb-2">
                    <p className="text-xs text-slate-300">{getStepDescription(session.currentStep)}</p>
                    <div className="w-full bg-slate-600 rounded-full h-1 mt-1">
                      <div
                        className="bg-green-500 h-1 rounded-full transition-all duration-300"
                        style={{ width: `${(session.currentStep / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">{formatTime(session.timestamp)}</span>
                    <div className="flex space-x-1">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs bg-transparent hover:bg-slate-600"
                        onClick={() =>
                          alert(
                            `USSD Session Details:\nPhone: ${session.phoneNumber}\nStep: ${session.currentStep}/5\nData: ${JSON.stringify(session.data, null, 2)}`,
                          )
                        }
                      >
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs bg-transparent hover:bg-slate-600"
                        onClick={() =>
                          alert(`Operator assistance initiated for ${session.phoneNumber}\nConnecting to help desk...`)
                        }
                      >
                        Assist
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent USSD Messages */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <MessageSquare className="h-5 w-5 mr-2 text-blue-400" />
              Recent USSD Messages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {recentMessages.map((message) => (
                <div
                  key={message.id}
                  className={`p-3 rounded-lg border-l-4 ${
                    message.type === "incoming" ? "bg-blue-900/30 border-blue-500" : "bg-green-900/30 border-green-500"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          message.type === "incoming"
                            ? "border-blue-500 text-blue-400"
                            : "border-green-500 text-green-400"
                        }`}
                      >
                        {message.type === "incoming" ? "IN" : "OUT"}
                      </Badge>
                      <span className="text-xs text-slate-400">{message.phoneNumber}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {message.processed ? (
                        <CheckCircle className="h-3 w-3 text-green-400" />
                      ) : (
                        <Clock className="h-3 w-3 text-yellow-400" />
                      )}
                      <span className="text-xs text-slate-400">{formatTime(message.timestamp)}</span>
                    </div>
                  </div>

                  <p className="text-sm text-white mb-2">{message.message}</p>

                  {!message.processed && (
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs bg-transparent hover:bg-slate-600"
                        onClick={() =>
                          alert(
                            `Processing message from ${message.phoneNumber}:\n"${message.message}"\n\nStatus: Processed ✓`,
                          )
                        }
                      >
                        Process
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs bg-transparent hover:bg-slate-600"
                        onClick={() =>
                          alert(
                            `Reply sent to ${message.phoneNumber}:\n"Thank you for your report. We are investigating."`,
                          )
                        }
                      >
                        Reply
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* USSD Command Reference */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Smartphone className="h-5 w-5 mr-2 text-purple-400" />
            USSD Command Reference
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-slate-700 rounded-lg">
              <h4 className="text-sm font-medium text-white mb-2">Emergency Report</h4>
              <code className="text-xs text-green-400 bg-slate-800 px-2 py-1 rounded">*234*911#</code>
              <p className="text-xs text-slate-400 mt-2">Quick emergency alert with location</p>
            </div>

            <div className="p-4 bg-slate-700 rounded-lg">
              <h4 className="text-sm font-medium text-white mb-2">Crime Report</h4>
              <code className="text-xs text-blue-400 bg-slate-800 px-2 py-1 rounded">*234*100#</code>
              <p className="text-xs text-slate-400 mt-2">Report crimes and suspicious activities</p>
            </div>

            <div className="p-4 bg-slate-700 rounded-lg">
              <h4 className="text-sm font-medium text-white mb-2">Safety Check</h4>
              <code className="text-xs text-yellow-400 bg-slate-800 px-2 py-1 rounded">*234*199#</code>
              <p className="text-xs text-slate-400 mt-2">Check safety status and get tips</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
