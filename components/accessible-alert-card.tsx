"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, AlertTriangle, Eye, CheckCircle } from "lucide-react"
import { useAccessibility } from "@/hooks/use-accessibility"

interface AccessibleAlertCardProps {
  alert: {
    id: string
    type: string
    message: string
    location: string
    timestamp: number
    priority: "high" | "medium" | "low"
    status: "active" | "investigating" | "resolved"
  }
  onStatusChange: (id: string, status: "active" | "investigating" | "resolved") => void
}

export function AccessibleAlertCard({ alert, onStatusChange }: AccessibleAlertCardProps) {
  const { settings, getAlertColor, getStatusPattern, getShapeIndicator } = useAccessibility()

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <AlertTriangle className="h-3 w-3" />
      case "investigating":
        return <Eye className="h-3 w-3" />
      case "resolved":
        return <CheckCircle className="h-3 w-3" />
      default:
        return null
    }
  }

  const getAriaLabel = () => {
    return `${alert.priority} priority ${alert.type} alert: ${alert.message}. Status: ${alert.status}. Location: ${alert.location}. Time: ${new Date(alert.timestamp).toLocaleTimeString()}`
  }

  const fontSizeClass = {
    small: "text-xs",
    normal: "text-sm",
    large: "text-base",
  }[settings.fontSize]

  return (
    <Card className="bg-slate-700 border-slate-600 relative overflow-hidden" role="article" aria-label={getAriaLabel()}>
      {/* Priority indicator bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${getAlertColor(alert.priority)}`} />

      {/* Status pattern overlay */}
      {settings.usePatterns && (
        <div className={`absolute inset-0 ${getStatusPattern(alert.status)} pointer-events-none`} />
      )}

      <CardContent className="p-4 relative z-10">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center space-x-2">
            {/* Shape indicator */}
            {settings.useShapes && (
              <span
                className={`text-lg ${getAlertColor(alert.priority)} font-bold`}
                aria-hidden="true"
                title={`${alert.type} alert`}
              >
                {getShapeIndicator(alert.type)}
              </span>
            )}

            {/* Alert type badge */}
            <Badge
              className={`${getAlertColor(alert.priority)} ${fontSizeClass} relative`}
              aria-label={`${alert.priority} priority ${alert.type} alert`}
            >
              {alert.type}
            </Badge>

            {/* Timestamp */}
            <span
              className={`text-slate-400 ${fontSizeClass}`}
              aria-label={`Reported at ${new Date(alert.timestamp).toLocaleTimeString()}`}
            >
              {new Date(alert.timestamp).toLocaleTimeString()}
            </span>
          </div>

          {/* Status badge */}
          <Badge
            variant="outline"
            className={`${getAlertColor(alert.priority, alert.status)} ${fontSizeClass} flex items-center space-x-1`}
            aria-label={`Status: ${alert.status}`}
          >
            {getStatusIcon(alert.status)}
            <span className="capitalize">{alert.status}</span>
          </Badge>
        </div>

        {/* Alert message */}
        <p className={`text-white mb-2 ${fontSizeClass}`} role="main">
          {alert.message}
        </p>

        {/* Location and actions */}
        <div className="flex items-center justify-between">
          <span
            className={`text-slate-400 flex items-center ${fontSizeClass}`}
            aria-label={`Location: ${alert.location}`}
          >
            <MapPin className="h-3 w-3 mr-1" aria-hidden="true" />
            {alert.location}
          </span>

          {/* Action buttons */}
          <div className="flex space-x-1">
            {alert.status === "active" && (
              <Button
                size="sm"
                variant="outline"
                className={`${fontSizeClass} bg-transparent hover:bg-slate-600 focus:ring-2 focus:ring-blue-500`}
                onClick={() => onStatusChange(alert.id, "investigating")}
                aria-label={`Mark ${alert.type} alert as investigating`}
              >
                Investigate
              </Button>
            )}
            {alert.status === "investigating" && (
              <Button
                size="sm"
                variant="outline"
                className={`${fontSizeClass} bg-transparent hover:bg-slate-600 focus:ring-2 focus:ring-green-500`}
                onClick={() => onStatusChange(alert.id, "resolved")}
                aria-label={`Mark ${alert.type} alert as resolved`}
              >
                Resolve
              </Button>
            )}
          </div>
        </div>

        {/* Screen reader only additional context */}
        <div className="sr-only">
          Priority level: {alert.priority}.{settings.usePatterns && `Visual pattern indicates ${alert.status} status.`}
          {settings.useShapes &&
            `Shape indicator: ${getShapeIndicator(alert.type)} represents ${alert.type} alert type.`}
        </div>
      </CardContent>
    </Card>
  )
}
