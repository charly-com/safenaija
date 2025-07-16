"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

interface WebSocketContextType {
  isConnected: boolean
  sendMessage: (message: any) => void
  lastMessage: any
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined)

export function useWebSocket() {
  const context = useContext(WebSocketContext)
  if (context === undefined) {
    throw new Error("useWebSocket must be used within a WebSocketProvider")
  }
  return context
}

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [lastMessage, setLastMessage] = useState<any>(null)
  const [ws, setWs] = useState<WebSocket | null>(null)

  useEffect(() => {
    // Simulate WebSocket connection for demo
    const mockWs = {
      send: (data: string) => {
        console.log("Mock WebSocket sending:", data)
      },
      close: () => {
        setIsConnected(false)
      },
    }

    setWs(mockWs as any)
    setIsConnected(true)

    // Simulate incoming messages
    const interval = setInterval(() => {
      const mockMessage = {
        type: "alert",
        data: {
          id: `ws_${Date.now()}`,
          message: "WebSocket alert received",
          timestamp: Date.now(),
        },
      }
      setLastMessage(mockMessage)
    }, 15000) // Every 15 seconds

    return () => {
      clearInterval(interval)
      mockWs.close()
    }
  }, [])

  const sendMessage = (message: any) => {
    if (ws && isConnected) {
      ws.send(JSON.stringify(message))
    }
  }

  return (
    <WebSocketContext.Provider value={{ isConnected, sendMessage, lastMessage }}>{children}</WebSocketContext.Provider>
  )
}
