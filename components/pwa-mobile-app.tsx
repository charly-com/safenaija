"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Shield,
  Zap,
  MapPin,
  Phone,
  MessageSquare,
  Navigation,
  Clock,
  AlertTriangle,
  Wifi,
  WifiOff,
  Battery,
  Signal,
} from "lucide-react";
import { useRealtime } from "@/hooks/use-realtime";
import { useOfflineSync } from "@/hooks/use-offline-sync";

export function PWAMobileApp() {
  const { toast } = useToast();
  const { addAlert, alerts } = useRealtime();
  const { addToOfflineQueue, syncStatus } = useOfflineSync();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [batteryLevel, setBatteryLevel] = useState(85);
  const [currentLocation, setCurrentLocation] = useState("Getting location...");
  const [sosActive, setSosActive] = useState(false);
  const [alertHistory, setAlertHistory] = useState<any[]>([]);

  useEffect(() => {
    // Monitor online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Simulate battery drain
    const batteryInterval = setInterval(() => {
      setBatteryLevel((prev) => Math.max(10, prev - Math.random() * 2));
    }, 30000);

    // Get location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation(
            `${position.coords.latitude.toFixed(
              4
            )}, ${position.coords.longitude.toFixed(4)}`
          );
        },
        () => {
          setCurrentLocation("Location unavailable");
        }
      );
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearInterval(batteryInterval);
    };
  }, []);

  const handleSOS = () => {
    setSosActive(true);

    const sosAlert = {
      type: "SOS" as "SOS",
      message: "EMERGENCY SOS - Immediate assistance required",
      location: currentLocation,
      priority: "high" as const,
      status: "active" as const,
      reportedBy: "PWA Mobile App",
      timestamp: Date.now(),
    };

    if (isOnline) {
      addAlert(sosAlert);
      toast({
        title: "SOS Alert Sent!",
        description: "Emergency services have been notified",
        variant: "destructive",
      });
    } else {
      addToOfflineQueue("alert", sosAlert, "high");
      toast({
        title: "SOS Queued",
        description: "Will send when connection restored",
        variant: "destructive",
      });
    }

    setAlertHistory((prev) => [sosAlert, ...prev]);

    // Auto-deactivate after 30 seconds
    setTimeout(() => setSosActive(false), 30000);
  };

  const sendUSSD = (code: string) => {
    toast({
      title: "USSD Code Sent",
      description: `Dialing ${code}...`,
    });

    // Simulate USSD response
    setTimeout(() => {
      toast({
        title: "USSD Response",
        description:
          "Emergency report initiated. Follow prompts on your phone.",
      });
    }, 2000);
  };

  const sendSMS = () => {
    const smsData = {
      type: "sms",
      message: `EMERGENCY: Need help at ${currentLocation}. This is an automated SafeNaija alert.`,
      location: currentLocation,
      timestamp: Date.now(),
    };

    if (isOnline) {
      toast({
        title: "SMS Sent",
        description: "Emergency SMS sent to authorities",
      });
    } else {
      addToOfflineQueue("alert", smsData, "high");
      toast({
        title: "SMS Queued",
        description: "Will send when connection restored",
      });
    }
  };

  const nearbyDangers = [
    {
      type: "Crime",
      location: "500m away",
      time: "2 min ago",
      severity: "high",
    },
    {
      type: "Accident",
      location: "1.2km away",
      time: "15 min ago",
      severity: "medium",
    },
    {
      type: "Suspicious",
      location: "800m away",
      time: "1 hour ago",
      severity: "low",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Mobile Container */}
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl">
        {/* Status Bar */}
        <div className="bg-slate-900 text-white px-4 py-2 flex justify-between items-center text-xs">
          <div className="flex items-center space-x-2">
            <span>SafeNaija PWA</span>
            {isOnline ? (
              <Wifi className="h-3 w-3" />
            ) : (
              <WifiOff className="h-3 w-3 text-red-400" />
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Signal className="h-3 w-3" />
            <Battery
              className={`h-3 w-3 ${batteryLevel < 20 ? "text-red-400" : ""}`}
            />
            <span>{batteryLevel}%</span>
          </div>
        </div>

        {/* Header */}
        <div className="bg-slate-800 text-white p-4">
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8 text-yellow-400" />
            <div>
              <h1 className="text-xl font-bold">SafeNaija PWA</h1>
              <p className="text-xs text-slate-400">Progressive Web App</p>
            </div>
          </div>
        </div>

        {/* Connection Status */}
        <div
          className={`p-3 ${
            isOnline ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          <div className="flex items-center space-x-2">
            {isOnline ? (
              <Wifi className="h-4 w-4" />
            ) : (
              <WifiOff className="h-4 w-4" />
            )}
            <span className="text-sm">
              {isOnline
                ? "Online - Real-time alerts active"
                : "Offline - Emergency features available"}
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-4 space-y-6">
          {/* Emergency SOS */}
          <Card className="border-red-200 bg-red-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-red-800 flex items-center">
                <Zap className="h-5 w-5 mr-2" />
                Emergency SOS
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-4">
                <Button
                  size="lg"
                  className={`w-32 h-32 rounded-full text-white font-bold text-xl transition-all ${
                    sosActive
                      ? "bg-red-600 animate-pulse shadow-lg shadow-red-500/50"
                      : "bg-red-500 hover:bg-red-600"
                  }`}
                  onClick={handleSOS}
                >
                  {sosActive ? (
                    <div className="flex flex-col items-center">
                      <AlertTriangle className="h-8 w-8 mb-1" />
                      <span className="text-sm">ACTIVE</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Zap className="h-8 w-8 mb-1" />
                      <span>SOS</span>
                    </div>
                  )}
                </Button>
              </div>
              <p className="text-sm text-red-700 text-center">
                {sosActive
                  ? "Emergency alert active! Help is coming."
                  : "Tap for immediate emergency assistance"}
              </p>
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                Current Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">{currentLocation}</p>
              <Button
                size="sm"
                variant="outline"
                className="mt-2 bg-transparent"
                onClick={() => {
                  navigator.clipboard.writeText(currentLocation);
                  toast({ title: "Location copied to clipboard" });
                }}
              >
                <Navigation className="h-4 w-4 mr-1" />
                Share Location
              </Button>
            </CardContent>
          </Card>

          {/* Offline Emergency Options */}
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-orange-800 text-sm">
                Offline Emergency Options
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-white"
                  onClick={() => sendUSSD("*234*911#")}
                >
                  <Phone className="h-4 w-4 mr-1" />
                  USSD *911#
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-white"
                  onClick={() => sendUSSD("*234*100#")}
                >
                  <Phone className="h-4 w-4 mr-1" />
                  USSD *100#
                </Button>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="w-full bg-white"
                onClick={sendSMS}
              >
                <MessageSquare className="h-4 w-4 mr-1" />
                Emergency SMS
              </Button>
              <p className="text-xs text-orange-700">
                These work without internet connection
              </p>
            </CardContent>
          </Card>

          {/* Nearby Dangers */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2 text-yellow-600" />
                Nearby Dangers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {nearbyDangers.map((danger, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-slate-50 rounded"
                  >
                    <div>
                      <p className="text-sm font-medium">{danger.type}</p>
                      <p className="text-xs text-slate-500">
                        {danger.location}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant="outline"
                        className={
                          danger.severity === "high"
                            ? "border-red-500 text-red-600"
                            : danger.severity === "medium"
                            ? "border-yellow-500 text-yellow-600"
                            : "border-green-500 text-green-600"
                        }
                      >
                        {danger.severity}
                      </Badge>
                      <p className="text-xs text-slate-500 mt-1">
                        {danger.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Alert History */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center">
                <Clock className="h-4 w-4 mr-2 text-purple-600" />
                Alert History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {alertHistory.length === 0 ? (
                <p className="text-sm text-slate-500">No alerts sent yet</p>
              ) : (
                <div className="space-y-2">
                  {alertHistory.slice(0, 3).map((alert, index) => (
                    <div key={index} className="p-2 bg-slate-50 rounded">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {alert.type}
                        </span>
                        <span className="text-xs text-slate-500">
                          {new Date(alert.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        {alert.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sync Status */}
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isOnline ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></div>
                  <span className="text-sm text-blue-800">
                    {syncStatus.pendingItems} items queued for sync
                  </span>
                </div>
                {syncStatus.syncInProgress && (
                  <div className="animate-spin h-4 w-4 border-2 border-blue-600"></div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
