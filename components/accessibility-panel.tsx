"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Eye, Palette, Type, Shapes, RotateCcw, CheckCircle, AlertTriangle } from "lucide-react"
import { useAccessibility } from "@/hooks/use-accessibility"

export function AccessibilityPanel() {
  const { settings, updateSettings, getAlertColor, getStatusPattern, getShapeIndicator } = useAccessibility()

  const colorBlindTypes = [
    { value: "none", label: "Normal Vision", description: "No color vision deficiency" },
    { value: "protanopia", label: "Protanopia", description: "Red-blind (1% of males)" },
    { value: "deuteranopia", label: "Deuteranopia", description: "Green-blind (1% of males)" },
    { value: "tritanopia", label: "Tritanopia", description: "Blue-blind (rare)" },
    { value: "achromatopsia", label: "Achromatopsia", description: "Complete color blindness (very rare)" },
  ]

  const contrastLevels = [
    { value: "normal", label: "Normal", description: "Standard contrast" },
    { value: "high", label: "High", description: "Enhanced contrast" },
    { value: "maximum", label: "Maximum", description: "Maximum contrast" },
  ]

  const fontSizes = [
    { value: "small", label: "Small", description: "Compact text" },
    { value: "normal", label: "Normal", description: "Standard text size" },
    { value: "large", label: "Large", description: "Larger text for better readability" },
  ]

  const resetSettings = () => {
    updateSettings({
      colorBlindType: "none",
      contrastLevel: "normal",
      usePatterns: true,
      useShapes: true,
      reducedMotion: false,
      fontSize: "normal",
    })
  }

  return (
    <div className="space-y-6">
      {/* Color Vision Settings */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Eye className="h-5 w-5 mr-2 text-blue-400" />
            Color Vision Support
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-slate-300 mb-2 block">Color Vision Type</Label>
            <Select
              value={settings.colorBlindType}
              onValueChange={(value) => updateSettings({ colorBlindType: value as any })}
            >
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                {colorBlindTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div>
                      <div className="font-medium">{type.label}</div>
                      <div className="text-xs text-slate-400">{type.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-slate-300 mb-2 block">Contrast Level</Label>
            <Select
              value={settings.contrastLevel}
              onValueChange={(value) => updateSettings({ contrastLevel: value as any })}
            >
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                {contrastLevels.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    <div>
                      <div className="font-medium">{level.label}</div>
                      <div className="text-xs text-slate-400">{level.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Visual Aids */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Shapes className="h-5 w-5 mr-2 text-green-400" />
            Visual Aids
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-slate-300">Use Patterns</Label>
              <p className="text-xs text-slate-400">Add background patterns to distinguish status</p>
            </div>
            <Switch
              checked={settings.usePatterns}
              onCheckedChange={(checked) => updateSettings({ usePatterns: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-slate-300">Use Shape Indicators</Label>
              <p className="text-xs text-slate-400">Add shapes to identify alert types</p>
            </div>
            <Switch
              checked={settings.useShapes}
              onCheckedChange={(checked) => updateSettings({ useShapes: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-slate-300">Reduced Motion</Label>
              <p className="text-xs text-slate-400">Minimize animations and transitions</p>
            </div>
            <Switch
              checked={settings.reducedMotion}
              onCheckedChange={(checked) => updateSettings({ reducedMotion: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Typography */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Type className="h-5 w-5 mr-2 text-purple-400" />
            Typography
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label className="text-slate-300 mb-2 block">Font Size</Label>
            <Select value={settings.fontSize} onValueChange={(value) => updateSettings({ fontSize: value as any })}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                {fontSizes.map((size) => (
                  <SelectItem key={size.value} value={size.value}>
                    <div>
                      <div className="font-medium">{size.label}</div>
                      <div className="text-xs text-slate-400">{size.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Palette className="h-5 w-5 mr-2 text-yellow-400" />
            Preview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Alert Priority Preview */}
          <div>
            <Label className="text-slate-300 mb-2 block">Alert Priorities</Label>
            <div className="flex flex-wrap gap-2">
              {["high", "medium", "low"].map((priority) => (
                <div key={priority} className="relative">
                  <Badge className={`${getAlertColor(priority)} relative overflow-hidden`}>
                    <div className={`absolute inset-0 ${getStatusPattern("active")}`}></div>
                    <span className="relative z-10 flex items-center space-x-1">
                      <span>
                        {getShapeIndicator(
                          priority === "high" ? "SOS" : priority === "medium" ? "Crime" : "Suspicious",
                        )}
                      </span>
                      <span className="capitalize">{priority} Priority</span>
                    </span>
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Status Preview */}
          <div>
            <Label className="text-slate-300 mb-2 block">Status Indicators</Label>
            <div className="flex flex-wrap gap-2">
              {["active", "investigating", "resolved"].map((status) => (
                <div key={status} className="relative">
                  <Badge variant="outline" className={`${getAlertColor("medium", status)} relative overflow-hidden`}>
                    <div className={`absolute inset-0 ${getStatusPattern(status)}`}></div>
                    <span className="relative z-10 flex items-center space-x-1">
                      <span>
                        {status === "active" && <AlertTriangle className="h-3 w-3" />}
                        {status === "investigating" && <Eye className="h-3 w-3" />}
                        {status === "resolved" && <CheckCircle className="h-3 w-3" />}
                      </span>
                      <span className="capitalize">{status}</span>
                    </span>
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Shape Indicators Preview */}
          <div>
            <Label className="text-slate-300 mb-2 block">Alert Type Shapes</Label>
            <div className="grid grid-cols-3 gap-2 text-sm">
              {["SOS", "Crime", "Suspicious", "Emergency", "Medical", "Fire"].map((type) => (
                <div key={type} className="flex items-center space-x-2 text-slate-300">
                  <span className="text-lg">{getShapeIndicator(type)}</span>
                  <span>{type}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reset Button */}
      <Button onClick={resetSettings} variant="outline" className="w-full bg-transparent border-slate-600">
        <RotateCcw className="h-4 w-4 mr-2" />
        Reset to Defaults
      </Button>
    </div>
  )
}
