"use client"

import { useEffect, useRef } from "react"
import { useRealtime } from "@/hooks/use-realtime"

export function SoundNotifications() {
  const { alerts } = useRealtime()
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const lastAlertRef = useRef<string | null>(null)

  useEffect(() => {
    // Create audio context for notifications
    if (typeof window !== "undefined") {
      audioRef.current = new Audio()
    }
  }, [])

  useEffect(() => {
    const latestAlert = alerts[0]
    if (latestAlert && latestAlert.id !== lastAlertRef.current && latestAlert.priority === "high") {
      playNotificationSound()
      lastAlertRef.current = latestAlert.id
    }
  }, [alerts])

  const playNotificationSound = () => {
    // Create a simple beep sound using Web Audio API
    if (typeof window !== "undefined" && window.AudioContext) {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.value = 800
      oscillator.type = "sine"

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.5)
    }
  }

  return null // This component doesn't render anything
}
