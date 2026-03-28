import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useFirebaseData } from "@/hooks/useFirebaseData";
import StatusBanner from "@/components/dashboard/StatusBanner";
import SensorCard from "@/components/dashboard/SensorCard";
import AlertHistory from "@/components/dashboard/AlertHistory";
import ActivityChart from "@/components/dashboard/ActivityChart";
import SystemToggle from "@/components/dashboard/SystemToggle";
import { Button } from "@/components/ui/button";
import { Shield, LogOut, Eye, DoorOpen, Volume2, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { sensorData, alerts, loading, error, toggleSystem } = useFirebaseData();

  // Browser notification on intrusion
  useEffect(() => {
    if (sensorData.status === "INTRUSION_DETECTED" && sensorData.systemOn) {
      if (Notification.permission === "granted") {
        new Notification("⚠ INTRUSION DETECTED", {
          body: "Security breach detected at your home!",
          icon: "/placeholder.svg",
        });
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission();
      }
    }
  }, [sensorData.status, sensorData.systemOn]);

  // Request notification permission on mount
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-muted-foreground font-mono text-sm">Connecting to sensors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-bold text-foreground text-lg leading-tight">HomeGuard</h1>
              <p className="text-xs text-muted-foreground font-mono">IoT Security Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground hidden sm:block">{user?.email}</span>
            <Button variant="ghost" size="sm" onClick={logout} className="text-muted-foreground hover:text-foreground">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-warning/10 border border-warning/30 rounded-lg p-4 text-warning text-sm"
          >
            Connection issue: {error}
          </motion.div>
        )}

        {/* Status Banner */}
        <StatusBanner status={sensorData.systemOn ? sensorData.status : "SAFE"} />

        {/* Sensor Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SensorCard
            title="PIR Motion Sensor"
            icon={Eye}
            active={sensorData.pir}
            activeLabel="MOTION DETECTED"
            inactiveLabel="No Motion"
            variant="danger"
          />
          <SensorCard
            title="Door Sensor"
            icon={DoorOpen}
            active={sensorData.door}
            activeLabel="DOOR OPEN"
            inactiveLabel="Door Closed"
            variant="danger"
          />
          <SensorCard
            title="Buzzer"
            icon={Volume2}
            active={sensorData.buzzer}
            activeLabel="SOUNDING"
            inactiveLabel="Silent"
            variant="warning"
          />
          <SystemToggle systemOn={sensorData.systemOn} onToggle={toggleSystem} />
        </div>

        {/* Charts & History */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ActivityChart alerts={alerts} />
          <AlertHistory alerts={alerts} />
        </div>

        {/* Footer info */}
        <div className="text-center text-xs text-muted-foreground py-4 font-mono">
          Last updated: {new Date(sensorData.lastUpdated).toLocaleString()} • Connected to Firebase RTDB
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
