"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, FileText, BarChart3, Calendar } from "lucide-react"
import { useRealtime } from "@/hooks/use-realtime"

export function ExportData() {
  const { alerts, stats } = useRealtime()
  const [exportFormat, setExportFormat] = useState("csv")
  const [exportType, setExportType] = useState("alerts")

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return

    const headers = Object.keys(data[0])
    const csvContent = [
      headers.join(","),
      ...data.map((row) => headers.map((header) => `"${row[header] || ""}"`).join(",")),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `${filename}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const exportToJSON = (data: any, filename: string) => {
    const jsonContent = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonContent], { type: "application/json;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `${filename}.json`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleExport = () => {
    const timestamp = new Date().toISOString().split("T")[0]

    switch (exportType) {
      case "alerts":
        const alertsData = alerts.map((alert) => ({
          id: alert.id,
          type: alert.type,
          message: alert.message,
          location: alert.location,
          priority: alert.priority,
          status: alert.status,
          timestamp: new Date(alert.timestamp).toISOString(),
          reportedBy: alert.reportedBy,
        }))

        if (exportFormat === "csv") {
          exportToCSV(alertsData, `safenaija-alerts-${timestamp}`)
        } else {
          exportToJSON(alertsData, `safenaija-alerts-${timestamp}`)
        }
        break

      case "stats":
        const statsData = {
          exportDate: new Date().toISOString(),
          statistics: stats,
          summary: {
            totalAlerts: alerts.length,
            activeAlerts: alerts.filter((a) => a.status === "active").length,
            resolvedAlerts: alerts.filter((a) => a.status === "resolved").length,
            highPriorityAlerts: alerts.filter((a) => a.priority === "high").length,
          },
        }

        if (exportFormat === "csv") {
          const flatStats = [
            {
              metric: "Active Alerts",
              value: stats.activeAlerts,
            },
            {
              metric: "Resolved Today",
              value: stats.resolvedToday,
            },
            {
              metric: "Average Response Time",
              value: `${stats.averageResponseTime} minutes`,
            },
            {
              metric: "Online Officers",
              value: stats.onlineOfficers,
            },
          ]
          exportToCSV(flatStats, `safenaija-stats-${timestamp}`)
        } else {
          exportToJSON(statsData, `safenaija-stats-${timestamp}`)
        }
        break

      case "report":
        const reportData = {
          generatedAt: new Date().toISOString(),
          period: "Last 24 hours",
          summary: {
            totalIncidents: alerts.length,
            byType: alerts.reduce(
              (acc, alert) => {
                acc[alert.type] = (acc[alert.type] || 0) + 1
                return acc
              },
              {} as Record<string, number>,
            ),
            byPriority: alerts.reduce(
              (acc, alert) => {
                acc[alert.priority] = (acc[alert.priority] || 0) + 1
                return acc
              },
              {} as Record<string, number>,
            ),
            byStatus: alerts.reduce(
              (acc, alert) => {
                acc[alert.status] = (acc[alert.status] || 0) + 1
                return acc
              },
              {} as Record<string, number>,
            ),
          },
          alerts: alerts.slice(0, 50), // Last 50 alerts
        }

        exportToJSON(reportData, `safenaija-report-${timestamp}`)
        break
    }
  }

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Download className="h-5 w-5 mr-2 text-blue-400" />
          Export Data
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm text-slate-300 mb-2 block">Export Type</label>
          <Select value={exportType} onValueChange={setExportType}>
            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-700 border-slate-600">
              <SelectItem value="alerts">
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Alerts Data
                </div>
              </SelectItem>
              <SelectItem value="stats">
                <div className="flex items-center">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Statistics
                </div>
              </SelectItem>
              <SelectItem value="report">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Full Report
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm text-slate-300 mb-2 block">Format</label>
          <Select value={exportFormat} onValueChange={setExportFormat}>
            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-700 border-slate-600">
              <SelectItem value="csv">CSV (Excel Compatible)</SelectItem>
              <SelectItem value="json">JSON (Developer Format)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleExport} className="w-full bg-blue-600 hover:bg-blue-700">
          <Download className="h-4 w-4 mr-2" />
          Export {exportType.charAt(0).toUpperCase() + exportType.slice(1)}
        </Button>

        <div className="text-xs text-slate-400 space-y-1">
          <p>• Alerts: Individual incident records</p>
          <p>• Statistics: Performance metrics</p>
          <p>• Report: Comprehensive analysis</p>
        </div>
      </CardContent>
    </Card>
  )
}
