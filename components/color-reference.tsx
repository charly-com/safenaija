"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Palette } from "lucide-react"

export function ColorReference() {
  const colorScheme = {
    primary: {
      name: "Primary Background",
      colors: [
        { name: "slate-900", hex: "#0f172a", usage: "Main dashboard background" },
        { name: "slate-800", hex: "#1e293b", usage: "Header, sidebar, cards" },
        { name: "slate-700", hex: "#334155", usage: "Secondary elements, borders" },
      ],
    },
    accent: {
      name: "Accent Colors",
      colors: [
        { name: "yellow-400", hex: "#facc15", usage: "SafeNaija logo, primary brand" },
        { name: "blue-600", hex: "#2563eb", usage: "Buttons, links, info elements" },
        { name: "green-500", hex: "#22c55e", usage: "Success states, online indicators" },
      ],
    },
    alerts: {
      name: "Alert Colors",
      colors: [
        { name: "red-500", hex: "#ef4444", usage: "High priority alerts, SOS" },
        { name: "yellow-500", hex: "#eab308", usage: "Medium priority, warnings" },
        { name: "orange-500", hex: "#f97316", usage: "Suspicious activity" },
      ],
    },
    text: {
      name: "Text Colors",
      colors: [
        { name: "white", hex: "#ffffff", usage: "Primary text on dark backgrounds" },
        { name: "slate-300", hex: "#cbd5e1", usage: "Secondary text" },
        { name: "slate-400", hex: "#94a3b8", usage: "Muted text, timestamps" },
      ],
    },
  }

  return (
    <div className="p-6 bg-slate-900 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center space-x-2 mb-6">
          <Palette className="h-6 w-6 text-yellow-400" />
          <h1 className="text-2xl font-bold text-white">SafeNaija Color Scheme</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(colorScheme).map(([category, { name, colors }]) => (
            <Card key={category} className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">{name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {colors.map((color) => (
                    <div key={color.name} className="flex items-center space-x-3">
                      <div
                        className="w-12 h-12 rounded-lg border border-slate-600"
                        style={{ backgroundColor: color.hex }}
                      ></div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <Badge variant="outline" className="text-xs font-mono">
                            {color.name}
                          </Badge>
                          <span className="text-xs text-slate-400 font-mono">{color.hex}</span>
                        </div>
                        <p className="text-sm text-slate-300">{color.usage}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Usage Examples */}
        <Card className="mt-6 bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Color Usage Examples</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Alert Examples */}
              <div>
                <h3 className="text-sm font-medium text-slate-300 mb-2">Alert Priority Colors</h3>
                <div className="flex space-x-2">
                  <Badge className="bg-red-500 text-white">High Priority</Badge>
                  <Badge className="bg-yellow-500 text-black">Medium Priority</Badge>
                  <Badge className="bg-green-500 text-white">Low Priority</Badge>
                </div>
              </div>

              {/* Status Examples */}
              <div>
                <h3 className="text-sm font-medium text-slate-300 mb-2">Status Indicators</h3>
                <div className="flex space-x-2">
                  <Badge variant="outline" className="border-green-500 text-green-400">
                    Online
                  </Badge>
                  <Badge variant="outline" className="border-red-500 text-red-400">
                    Offline
                  </Badge>
                  <Badge variant="outline" className="border-yellow-500 text-yellow-400">
                    Investigating
                  </Badge>
                </div>
              </div>

              {/* Background Layers */}
              <div>
                <h3 className="text-sm font-medium text-slate-300 mb-2">Background Hierarchy</h3>
                <div className="space-y-2">
                  <div className="p-3 bg-slate-900 rounded border border-slate-700">
                    <span className="text-white text-sm">slate-900 - Main background</span>
                    <div className="mt-2 p-3 bg-slate-800 rounded">
                      <span className="text-white text-sm">slate-800 - Card/panel background</span>
                      <div className="mt-2 p-2 bg-slate-700 rounded">
                        <span className="text-white text-sm">slate-700 - Interactive elements</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
