"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Zap, Target, TrendingUp, Activity } from "lucide-react"

const predictions = [
  {
    id: 1,
    icon: <Target className="h-4 w-4 text-red-400 mr-2" />,
    title: "Next Risk Zone",
    color: "red",
    location: "Mushin, Lagos",
    info: "Robbery risk: 78% (Next 24h)",
  },
  {
    id: 2,
    icon: <TrendingUp className="h-4 w-4 text-yellow-400 mr-2" />,
    title: "Trend Alert",
    color: "yellow",
    location: "Kaduna-Abuja highway",
    info: "Kidnapping spike detected",
  },
  {
    id: 3,
    icon: <Activity className="h-4 w-4 text-blue-400 mr-2" />,
    title: "Pattern Analysis",
    color: "blue",
    location: "Weekend activity +45%",
    info: "Cybercrime increase",
  },
  {
    id: 4,
    icon: <Zap className="h-4 w-4 text-purple-400 mr-2" />,
    title: "Emerging Threat",
    color: "purple",
    location: "Onitsha Market",
    info: "Fake goods & scam syndicates",
  },
]

export default function AIInsightsCard() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % predictions.length)
    }, 6000) // every 6 seconds
    return () => clearInterval(interval)
  }, [])

  const active = predictions[current]
  const bgColor = {
    red: "bg-red-900/30 border-red-700",
    yellow: "bg-yellow-900/30 border-yellow-700",
    blue: "bg-blue-900/30 border-blue-700",
    purple: "bg-purple-900/30 border-purple-700",
  }[active.color]

  return (
    <Card className="col-span-4 bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Zap className="h-5 w-5 mr-2 text-yellow-400" />
          AI Predictions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`p-4 rounded-lg border ${bgColor}`}>
          <div className="flex items-center mb-2">
            {active.icon}
            <span className={`text-sm font-medium text-${active.color}-400`}>
              {active.title}
            </span>
          </div>
          <p className="text-sm text-white">{active.location}</p>
          <p className="text-xs text-slate-400">{active.info}</p>
        </div>
      </CardContent>
    </Card>
  )
}
