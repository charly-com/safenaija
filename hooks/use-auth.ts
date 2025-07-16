"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
  role: "aig" | "cp" | "dpo" | "officer" | "admin"
  zone: string
  state: string
  rank: string
  badge: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Mock users for demo
  const mockUsers = [
    {
      id: "1",
      name: "AIG John Adebayo",
      email: "aig.adebayo@police.gov.ng",
      password: "demo123",
      role: "aig" as const,
      zone: "Zone 2",
      state: "Lagos",
      rank: "Assistant Inspector General",
      badge: "AIG/001",
    },
    {
      id: "2",
      name: "CP Sarah Okafor",
      email: "cp.okafor@police.gov.ng",
      password: "demo123",
      role: "cp" as const,
      zone: "Zone 2",
      state: "Lagos",
      rank: "Commissioner of Police",
      badge: "CP/LAG/001",
    },
    {
      id: "3",
      name: "DPO Michael Usman",
      email: "dpo.usman@police.gov.ng",
      password: "demo123",
      role: "dpo" as const,
      zone: "Zone 1",
      state: "Kaduna",
      rank: "Divisional Police Officer",
      badge: "DPO/KAD/012",
    },
  ]

  useEffect(() => {
    // Check for stored auth token
    const storedUser = localStorage.getItem("safenaija-user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        localStorage.removeItem("safenaija-user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const foundUser = mockUsers.find((u) => u.email === email && u.password === password)

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser
      setUser(userWithoutPassword)
      localStorage.setItem("safenaija-user", JSON.stringify(userWithoutPassword))
      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("safenaija-user")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}
