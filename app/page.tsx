"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardView } from "@/components/dashboard-view";
import { MobileAppView } from "@/components/mobile-app-view";
import { AuthProvider } from "@/components/auth-provider";
import { AccessibilityProvider } from "@/hooks/use-accessibility";
import { WebSocketProvider } from "@/components/websocket-provider";
import { LoginForm } from "@/components/login-form";
import { DemoGuide } from "@/components/demo-guide";
import { AccessibilityPanel } from "@/components/accessibility-panel";
import { useAuth } from "@/components/auth-provider";
import { PatrolTracker } from "@/components/patrol-tracker";
import { PWAMobileApp } from "@/components/pwa-mobile-app";
import { Toaster } from "@/components/ui/toaster";

export default function SafeNaijaDashboard() {
  return (
    <AuthProvider>
      <AccessibilityProvider>
        <WebSocketProvider>
          <SafeNaijaApp />
        </WebSocketProvider>
      </AccessibilityProvider>
    </AuthProvider>
  );
}

function SafeNaijaApp() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Loading SafeNaija...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <LoginForm />
        <DemoGuide />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <DemoGuide />
      <Tabs defaultValue="dashboard" className="w-full">
        <div className="bg-slate-800 border-b border-slate-700 px-6 py-4">
          <TabsList className="bg-slate-700">
            <TabsTrigger
              value="dashboard"
              className="data-[state=active]:bg-slate-600"
            >
              Police Command Dashboard
            </TabsTrigger>
            <TabsTrigger
              value="patrol"
              className="data-[state=active]:bg-slate-600"
            >
              Patrol Tracker
            </TabsTrigger>
            <TabsTrigger
              value="mobile"
              className="data-[state=active]:bg-slate-600"
            >
              Citizen Mobile App
            </TabsTrigger>
            <TabsTrigger
              value="pwa"
              className="data-[state=active]:bg-slate-600"
            >
              PWA Mobile
            </TabsTrigger>
            <TabsTrigger
              value="accessibility"
              className="data-[state=active]:bg-slate-600"
            >
              Accessibility Settings
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="dashboard" className="m-0">
          <DashboardView />
        </TabsContent>
        <TabsContent value="mobile" className="p-6 bg-slate-100">
          <div className="max-w-5xl mx-auto">
            <MobileAppView />
          </div>
        </TabsContent>

        <TabsContent value="accessibility" className="m-0">
          <div className="p-6 max-w-4xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-white mb-2">
                Accessibility Settings
              </h1>
              <p className="text-slate-400">
                Customize the interface for better accessibility and color
                vision support
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <AccessibilityPanel />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="patrol" className="m-0">
          <PatrolTracker />
        </TabsContent>

        <TabsContent value="pwa" className="m-0">
          <PWAMobileApp />
        </TabsContent>
        <Toaster />
      </Tabs>
    </div>
  );
}
