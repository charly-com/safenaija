"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { HelpCircle, Play, CheckCircle, Users, Smartphone, Radio, Download, X } from "lucide-react"

export function DemoGuide() {
  const [showGuide, setShowGuide] = useState(false)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  const demoScenarios = [
    {
      id: 1,
      title: "Emergency Response Flow",
      icon: <Play className="h-4 w-4" />,
      steps: [
        "Login with any demo account",
        "Switch to 'Citizen Mobile App' tab",
        "Press the red SOS button",
        "Return to 'Police Command Dashboard'",
        "Watch new alert appear in Live Feed",
        "Click 'Investigate' then 'Resolve'",
      ],
    },
    {
      id: 2,
      title: "Real-Time Monitoring",
      icon: <Radio className="h-4 w-4" />,
      steps: [
        "Observe live alerts appearing every 5 seconds",
        "Check connection status (green dot = live)",
        "Use filters to sort by state/crime type",
        "Monitor threat level changes",
        "Watch system health metrics",
      ],
    },
    {
      id: 3,
      title: "Data Export & Analysis",
      icon: <Download className="h-4 w-4" />,
      steps: [
        "Scroll to 'Export Data' panel in sidebar",
        "Select 'Alerts Data' and 'CSV' format",
        "Click 'Export Alerts' button",
        "Check downloaded file",
        "Try different export types",
      ],
    },
    {
      id: 4,
      title: "Multi-User Testing",
      icon: <Users className="h-4 w-4" />,
      steps: [
        "Logout from current account",
        "Login with different role (AIG/CP/DPO)",
        "Compare dashboard access levels",
        "Test role-specific features",
        "Note permission differences",
      ],
    },
    {
      id: 5,
      title: "USSD & Offline Features",
      icon: <Smartphone className="h-4 w-4" />,
      steps: [
        "Scroll to USSD Integration panel",
        "Review active USSD sessions",
        "Check offline sync status",
        "Test keyboard shortcuts (Ctrl + /)",
        "Monitor system notifications",
      ],
    },
  ]

  const toggleStep = (scenarioId: number) => {
    if (completedSteps.includes(scenarioId)) {
      setCompletedSteps(completedSteps.filter((id) => id !== scenarioId))
    } else {
      setCompletedSteps([...completedSteps, scenarioId])
    }
  }

  if (!showGuide) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowGuide(true)}
        className="fixed bottom-4 right-4 z-50 bg-blue-600 hover:bg-blue-700 text-white"
      >
        <HelpCircle className="h-4 w-4 mr-2" />
        Demo Guide
      </Button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="bg-slate-800 border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center">
              <HelpCircle className="h-5 w-5 mr-2 text-blue-400" />
              SafeNaija Demo Guide
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowGuide(false)}
              className="h-6 w-6 p-0 text-slate-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Demo Credentials */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Demo Credentials</h3>
            <div className="grid grid-cols-1 gap-2">
              <div className="p-3 bg-slate-700 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <Badge variant="outline" className="text-xs mb-1">
                      AIG
                    </Badge>
                    <p className="text-sm text-white">aig.adebayo@police.gov.ng</p>
                  </div>
                  <span className="text-xs text-slate-400">demo123</span>
                </div>
              </div>
              <div className="p-3 bg-slate-700 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <Badge variant="outline" className="text-xs mb-1">
                      CP
                    </Badge>
                    <p className="text-sm text-white">cp.okafor@police.gov.ng</p>
                  </div>
                  <span className="text-xs text-slate-400">demo123</span>
                </div>
              </div>
              <div className="p-3 bg-slate-700 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <Badge variant="outline" className="text-xs mb-1">
                      DPO
                    </Badge>
                    <p className="text-sm text-white">dpo.usman@police.gov.ng</p>
                  </div>
                  <span className="text-xs text-slate-400">demo123</span>
                </div>
              </div>
            </div>
          </div>

          {/* Demo Scenarios */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Testing Scenarios</h3>
            <div className="space-y-4">
              {demoScenarios.map((scenario) => (
                <div key={scenario.id} className="border border-slate-600 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {scenario.icon}
                      <h4 className="font-medium text-white">{scenario.title}</h4>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleStep(scenario.id)}
                      className={`${
                        completedSteps.includes(scenario.id)
                          ? "text-green-400 hover:text-green-300"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  </div>
                  <ol className="space-y-1">
                    {scenario.steps.map((step, index) => (
                      <li key={index} className="text-sm text-slate-300 flex items-start">
                        <span className="text-blue-400 mr-2 mt-0.5">{index + 1}.</span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </div>

          {/* Progress */}
          <div className="pt-4 border-t border-slate-700">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">
                Progress: {completedSteps.length}/{demoScenarios.length} scenarios completed
              </span>
              <div className="w-32 bg-slate-700 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(completedSteps.length / demoScenarios.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Quick Tips */}
          <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-3">
            <h4 className="text-sm font-medium text-blue-400 mb-2">Quick Tips</h4>
            <ul className="text-xs text-blue-300 space-y-1">
              <li>• Press Ctrl + / for keyboard shortcuts</li>
              <li>• Watch for live alerts every 5 seconds</li>
              <li>• Green dot = live connection</li>
              <li>• High priority alerts trigger notifications</li>
              <li>• Use filters to sort alerts by location/type</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
