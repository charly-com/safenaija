"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Keyboard, X } from "lucide-react"

export function KeyboardShortcuts() {
  const [showShortcuts, setShowShortcuts] = useState(false)

  const shortcuts = [
    { key: "Ctrl + /", action: "Show/Hide shortcuts" },
    { key: "Ctrl + R", action: "Refresh alerts" },
    { key: "Ctrl + E", action: "Export data" },
    { key: "Ctrl + N", action: "New incident" },
    { key: "Esc", action: "Close modals" },
    { key: "F5", action: "Refresh dashboard" },
    { key: "Ctrl + L", action: "Focus search" },
    { key: "Ctrl + S", action: "Save current view" },
  ]

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "/") {
        event.preventDefault()
        setShowShortcuts(!showShortcuts)
      }
      if (event.key === "Escape") {
        setShowShortcuts(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [showShortcuts])

  if (!showShortcuts) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowShortcuts(true)}
        className="fixed bottom-4 left-4 z-50 bg-slate-800 border border-slate-600 text-slate-300 hover:text-white"
      >
        <Keyboard className="h-4 w-4 mr-2" />
        Shortcuts
      </Button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="bg-slate-800 border-slate-700 w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center">
              <Keyboard className="h-5 w-5 mr-2" />
              Keyboard Shortcuts
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowShortcuts(false)}
              className="h-6 w-6 p-0 text-slate-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {shortcuts.map((shortcut, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-slate-300">{shortcut.action}</span>
                <Badge variant="outline" className="font-mono text-xs">
                  {shortcut.key}
                </Badge>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-slate-700">
            <p className="text-xs text-slate-400">Press Ctrl + / to toggle this panel</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
