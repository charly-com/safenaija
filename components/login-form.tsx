"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Shield, Eye, EyeOff, AlertCircle } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

export function LoginForm() {
  const { login, isLoading } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const success = await login(email, password)
    if (!success) {
      setError("Invalid credentials. Please check your email and password.")
    }
  }

  const demoAccounts = [
    { role: "AIG", email: "aig.adebayo@police.gov.ng", password: "demo123" },
    { role: "CP", email: "cp.okafor@police.gov.ng", password: "demo123" },
    { role: "DPO", email: "dpo.usman@police.gov.ng", password: "demo123" },
  ]

  const fillDemoCredentials = (email: string, password: string) => {
    setEmail(email)
    setPassword(password)
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="h-12 w-12 text-yellow-400" />
            <div>
              <h1 className="text-2xl font-bold text-white">SafeNaija AI</h1>
              <p className="text-sm text-slate-400">Command Dashboard</p>
            </div>
          </div>
          <p className="text-slate-300">Nigerian Police Force</p>
        </div>

        {/* Login Form */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-center">Officer Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm text-slate-300 mb-2 block">Email Address</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="officer@police.gov.ng"
                  className="bg-slate-700 border-slate-600 text-white"
                  required
                />
              </div>

              <div>
                <label className="text-sm text-slate-300 mb-2 block">Password</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="bg-slate-700 border-slate-600 text-white pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 text-slate-400 hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {error && (
                <div className="flex items-center space-x-2 text-red-400 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                {isLoading ? "Authenticating..." : "Login to Dashboard"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Demo Accounts */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-sm">Demo Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-xs text-slate-400 mb-3">Click to use demo credentials:</p>
              {demoAccounts.map((account, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="w-full justify-between bg-transparent border-slate-600 text-slate-300 hover:bg-slate-700"
                  onClick={() => fillDemoCredentials(account.email, account.password)}
                >
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      {account.role}
                    </Badge>
                    <span className="text-xs">{account.email}</span>
                  </div>
                  <span className="text-xs text-slate-500">demo123</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-slate-500">
          <p>Secure access for authorized personnel only</p>
          <p className="mt-1">© 2024 Nigerian Police Force - SafeNaija AI</p>
        </div>
      </div>
    </div>
  )
}
