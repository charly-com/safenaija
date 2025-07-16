"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Car, MapPin } from "lucide-react"
import { useAccessibility } from "@/hooks/use-accessibility"

interface AccessiblePatrolUnitProps {
  unit: {
    id: string
    name: string
    location: string
    status: "available" | "on-patrol" | "responding"
    officers: number
  }
}

export function AccessiblePatrolUnit({ unit }: AccessiblePatrolUnitProps) {
  const { settings, getStatusPattern, getAlertColor } = useAccessibility()

  const getStatusColor = (status: string) => {
    const colors = {
      available: {
        none: "border-green-500 text-green-400 bg-green-500",
        protanopia: "border-teal-500 text-teal-400 bg-teal-500",
        deuteranopia: "border-teal-500 text-teal-400 bg-teal-500",
        tritanopia: "border-green-500 text-green-400 bg-green-500",
        achromatopsia: "border-gray-400 text-gray-300 bg-gray-400",
      },
      "on-patrol": {
        none: "border-blue-500 text-blue-400 bg-blue-500",
        protanopia: "border-blue-500 text-blue-400 bg-blue-500",
        deuteranopia: "border-blue-500 text-blue-400 bg-blue-500",
        tritanopia: "border-blue-500 text-blue-400 bg-blue-500",
        achromatopsia: "border-gray-500 text-gray-400 bg-gray-500",
      },
      responding: {
        none: "border-yellow-500 text-yellow-400 bg-yellow-500",
        protanopia: "border-orange-500 text-orange-400 bg-orange-500",
        deuteranopia: "border-orange-500 text-orange-400 bg-orange-500",
        tritanopia: "border-pink-500 text-pink-400 bg-pink-500",
        achromatopsia: "border-gray-600 text-gray-300 bg-gray-600",
      },
    }

    return colors[status as keyof typeof colors]?.[settings.colorBlindType] || colors.available.none
  }

  const getStatusShape = (status: string) => {
    if (!settings.useShapes) return ""

    const shapes = {
      available: "●",
      "on-patrol": "▶",
      responding: "⚡",
    }

    return shapes[status as keyof typeof shapes] || "●"
  }

  const fontSizeClass = {
    small: "text-xs",
    normal: "text-sm",
    large: "text-base",
  }[settings.fontSize]

  const getAriaLabel = () => {
    return `Police Unit ${unit.id}: ${unit.name}. Status: ${unit.status}. Location: ${unit.location}. ${unit.officers} officers assigned.`
  }

  return (
    <Card className="bg-slate-700 border-slate-600 relative overflow-hidden" role="article" aria-label={getAriaLabel()}>
      {/* Status pattern overlay */}
      {settings.usePatterns && (
        <div className={`absolute inset-0 ${getStatusPattern(unit.status)} pointer-events-none`} />
      )}

      <CardContent className="p-3 relative z-10">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            {/* Unit identifier with color coding */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${getStatusColor(unit.status)}`}
              aria-label={`Unit ${unit.id}`}
            >
              {unit.id}
            </div>

            <div>
              <p className={`font-medium text-white ${fontSizeClass}`}>{unit.name}</p>
              <p className={`text-slate-400 flex items-center ${fontSizeClass}`}>
                <MapPin className="h-3 w-3 mr-1" aria-hidden="true" />
                {unit.location}
              </p>
            </div>
          </div>

          {/* Status badge with shape indicator */}
          <Badge
            variant="outline"
            className={`${getStatusColor(unit.status)} ${fontSizeClass} flex items-center space-x-1`}
            aria-label={`Status: ${unit.status.replace("-", " ")}`}
          >
            {settings.useShapes && (
              <span aria-hidden="true" title={`${unit.status} indicator`}>
                {getStatusShape(unit.status)}
              </span>
            )}
            <span className="capitalize">{unit.status.replace("-", " ")}</span>
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          {/* Officer count */}
          <span
            className={`text-slate-400 flex items-center ${fontSizeClass}`}
            aria-label={`${unit.officers} officers assigned`}
          >
            <Users className="h-3 w-3 mr-1" aria-hidden="true" />
            {unit.officers} officers
          </span>

          {/* Deploy button */}
          <Button
            size="sm"
            variant="outline"
            className={`${fontSizeClass} bg-transparent hover:bg-slate-600 focus:ring-2 focus:ring-blue-500`}
            disabled={unit.status === "responding"}
            aria-label={unit.status === "responding" ? `Unit ${unit.id} is already deployed` : `Deploy Unit ${unit.id}`}
          >
            <Car className="h-3 w-3 mr-1" aria-hidden="true" />
            {unit.status === "responding" ? "Deployed" : "Deploy"}
          </Button>
        </div>

        {/* Screen reader only additional context */}
        <div className="sr-only">
          Unit status: {unit.status.replace("-", " ")}.
          {settings.usePatterns && `Visual pattern indicates ${unit.status} status.`}
          {settings.useShapes && `Shape indicator: ${getStatusShape(unit.status)} represents ${unit.status} status.`}
          {unit.status === "responding" && "This unit is currently responding to an incident and cannot be deployed."}
        </div>
      </CardContent>
    </Card>
  )
}
