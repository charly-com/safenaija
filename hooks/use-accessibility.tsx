"use client"

import  { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type ColorBlindType = "none" | "protanopia" | "deuteranopia" | "tritanopia" | "achromatopsia"
type ContrastLevel = "normal" | "high" | "maximum"

interface AccessibilitySettings {
  colorBlindType: ColorBlindType
  contrastLevel: ContrastLevel
  usePatterns: boolean
  useShapes: boolean
  reducedMotion: boolean
  fontSize: "small" | "normal" | "large"
}

interface AccessibilityContextType {
  settings: AccessibilitySettings
  updateSettings: (settings: Partial<AccessibilitySettings>) => void
  getAlertColor: (priority: string, status?: string) => string
  getStatusPattern: (status: string) => string
  getShapeIndicator: (type: string) => string
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined)

export function useAccessibility() {
  const context = useContext(AccessibilityContext)
  if (context === undefined) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider")
  }
  return context
}

export function AccessibilityProvider({ children }: { children: ReactNode }):  React.ReactElement {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    colorBlindType: "none",
    contrastLevel: "normal",
    usePatterns: true,
    useShapes: true,
    reducedMotion: false,
    fontSize: "normal",
  })

  // Load settings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("safenaija-accessibility")
    if (saved) {
      try {
        setSettings(JSON.parse(saved))
      } catch (error) {
        console.error("Failed to load accessibility settings:", error)
      }
    }

    // Check for system preferences
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setSettings((prev) => ({ ...prev, reducedMotion: true }))
    }
  }, [])

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem("safenaija-accessibility", JSON.stringify(settings))
  }, [settings])

  const updateSettings = (newSettings: Partial<AccessibilitySettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }))
  }

  // Color-blind friendly color mapping
  const getAlertColor = (priority: string, status?: string) => {
    const baseColors = {
      high: {
        none: "bg-red-500 border-red-500 text-red-400",
        protanopia: "bg-blue-600 border-blue-600 text-blue-400",
        deuteranopia: "bg-blue-600 border-blue-600 text-blue-400",
        tritanopia: "bg-red-500 border-red-500 text-red-400",
        achromatopsia: "bg-gray-700 border-gray-700 text-gray-300",
      },
      medium: {
        none: "bg-yellow-500 border-yellow-500 text-yellow-400",
        protanopia: "bg-orange-500 border-orange-500 text-orange-400",
        deuteranopia: "bg-orange-500 border-orange-500 text-orange-400",
        tritanopia: "bg-pink-500 border-pink-500 text-pink-400",
        achromatopsia: "bg-gray-500 border-gray-500 text-gray-400",
      },
      low: {
        none: "bg-green-500 border-green-500 text-green-400",
        protanopia: "bg-teal-500 border-teal-500 text-teal-400",
        deuteranopia: "bg-teal-500 border-teal-500 text-teal-400",
        tritanopia: "bg-green-500 border-green-500 text-green-400",
        achromatopsia: "bg-gray-400 border-gray-400 text-gray-300",
      },
    }

    const statusColors = {
      active: {
        none: "border-red-500 text-red-400",
        protanopia: "border-blue-600 text-blue-400",
        deuteranopia: "border-blue-600 text-blue-400",
        tritanopia: "border-red-500 text-red-400",
        achromatopsia: "border-gray-600 text-gray-300",
      },
      investigating: {
        none: "border-yellow-500 text-yellow-400",
        protanopia: "border-orange-500 text-orange-400",
        deuteranopia: "border-orange-500 text-orange-400",
        tritanopia: "border-pink-500 text-pink-400",
        achromatopsia: "border-gray-500 text-gray-400",
      },
      resolved: {
        none: "border-green-500 text-green-400",
        protanopia: "border-teal-500 text-teal-400",
        deuteranopia: "border-teal-500 text-teal-400",
        tritanopia: "border-green-500 text-green-400",
        achromatopsia: "border-gray-400 text-gray-300",
      },
    }

    if (status && statusColors[status as keyof typeof statusColors]) {
      return statusColors[status as keyof typeof statusColors][settings.colorBlindType]
    }

    return baseColors[priority as keyof typeof baseColors]?.[settings.colorBlindType] || baseColors.medium.none
  }

  // Pattern indicators for different statuses
  const getStatusPattern = (status: string) => {
    if (!settings.usePatterns) return ""

    const patterns = {
      active: "bg-gradient-to-r from-transparent via-current to-transparent opacity-20",
      investigating:
        "bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,currentColor_2px,currentColor_4px)] opacity-20",
      resolved: "bg-[radial-gradient(circle_at_center,currentColor_1px,transparent_1px)] opacity-20",
      available: "bg-[linear-gradient(90deg,currentColor_50%,transparent_50%)] opacity-20",
      "on-patrol":
        "bg-[repeating-linear-gradient(90deg,transparent,transparent_4px,currentColor_4px,currentColor_8px)] opacity-20",
      responding: "bg-gradient-to-br from-current to-transparent opacity-30",
    }

    return patterns[status as keyof typeof patterns] || ""
  }

  // Shape indicators for different alert types
  const getShapeIndicator = (type: string) => {
    if (!settings.useShapes) return "●"

    const shapes = {
      SOS: "▲",
      Crime: "■",
      Suspicious: "◆",
      Emergency: "▲",
      Gunshots: "✦",
      "Scam Alert": "◯",
      Medical: "✚",
      Fire: "▲",
      Accident: "⬟",
    }

    return shapes[type as keyof typeof shapes] || "●"
  }

  return (
    <AccessibilityContext.Provider
      value={{
        settings,
        updateSettings,
        getAlertColor,
        getStatusPattern,
        getShapeIndicator,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  )
}
