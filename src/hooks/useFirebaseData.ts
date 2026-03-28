import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { ref, onValue, set } from "firebase/database";

export interface SensorData {
  pir: boolean;
  door: boolean;
  buzzer: boolean;
  systemOn: boolean;
  status: "SAFE" | "INTRUSION_DETECTED";
  lastUpdated: number;
}

export interface AlertEntry {
  id: string;
  type: "pir" | "door" | "system";
  message: string;
  timestamp: number;
  severity: "safe" | "warning" | "danger";
}

const defaultSensor: SensorData = {
  pir: false,
  door: false,
  buzzer: false,
  systemOn: true,
  status: "SAFE",
  lastUpdated: Date.now(),
};

const generateDemoAlerts = (): AlertEntry[] => {
  const now = Date.now();
  return [
    { id: "1", type: "pir", message: "Motion detected in living room", timestamp: now - 120000, severity: "danger" },
    { id: "2", type: "door", message: "Front door opened", timestamp: now - 300000, severity: "danger" },
    { id: "3", type: "system", message: "System armed successfully", timestamp: now - 600000, severity: "safe" },
    { id: "4", type: "pir", message: "Motion detected in hallway", timestamp: now - 1800000, severity: "warning" },
    { id: "5", type: "system", message: "System disarmed by user", timestamp: now - 3600000, severity: "safe" },
    { id: "6", type: "door", message: "Back door opened", timestamp: now - 5400000, severity: "danger" },
    { id: "7", type: "pir", message: "Motion detected in garage", timestamp: now - 7200000, severity: "warning" },
    { id: "8", type: "system", message: "System armed successfully", timestamp: now - 10800000, severity: "safe" },
  ];
};

export function useFirebaseData() {
  const [sensorData, setSensorData] = useState<SensorData>(defaultSensor);
  const [alerts, setAlerts] = useState<AlertEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);

  const loadFallbackData = () => {
    setSensorData({
      pir: false,
      door: false,
      buzzer: false,
      systemOn: true,
      status: "SAFE",
      lastUpdated: Date.now(),
    });
    setAlerts(generateDemoAlerts());
    setUsingFallback(true);
    setLoading(false);
  };

  useEffect(() => {
    try {
      const sensorRef = ref(db, "sensors");
      const alertsRef = ref(db, "alerts");

      let sensorLoaded = false;
      let alertsLoaded = false;
      let hasFailed = false;

      const fallbackTimer = setTimeout(() => {
        if (!sensorLoaded && !hasFailed) {
          loadFallbackData();
        }
      }, 5000);

      const unsubSensor = onValue(
        sensorRef,
        (snapshot) => {
          sensorLoaded = true;
          clearTimeout(fallbackTimer);
          const data = snapshot.val();
          if (data) {
            setSensorData({
              pir: data.pir ?? false,
              door: data.door ?? false,
              buzzer: data.buzzer ?? false,
              systemOn: data.systemOn ?? true,
              status: data.pir || data.door ? "INTRUSION_DETECTED" : "SAFE",
              lastUpdated: data.lastUpdated ?? Date.now(),
            });
            setUsingFallback(false);
          } else {
            loadFallbackData();
          }
          setLoading(false);
        },
        (err) => {
          hasFailed = true;
          clearTimeout(fallbackTimer);
          setError(err.message);
          loadFallbackData();
        }
      );

      const unsubAlerts = onValue(
        alertsRef,
        (snapshot) => {
          alertsLoaded = true;
          const data = snapshot.val();
          if (data) {
            const list: AlertEntry[] = Object.entries(data)
              .map(([id, val]: [string, any]) => ({
                id,
                type: val.type ?? "system",
                message: val.message ?? "",
                timestamp: val.timestamp ?? 0,
                severity: val.severity ?? "safe",
              }))
              .sort((a, b) => b.timestamp - a.timestamp);
            setAlerts(list);
          } else if (!usingFallback) {
            setAlerts(generateDemoAlerts());
          }
        },
        (err) => {
          setError(err.message);
          if (alerts.length === 0) {
            setAlerts(generateDemoAlerts());
          }
        }
      );

      return () => {
        clearTimeout(fallbackTimer);
        unsubSensor();
        unsubAlerts();
      };
    } catch (err: any) {
      setError(err.message);
      loadFallbackData();
    }
  }, []);

  const toggleSystem = async (on: boolean) => {
    if (usingFallback) {
      setSensorData(prev => ({ ...prev, systemOn: on }));
      return;
    }
    try {
      await set(ref(db, "sensors/systemOn"), on);
    } catch (err: any) {
      setError(err.message);
      setSensorData(prev => ({ ...prev, systemOn: on }));
    }
  };

  return { sensorData, alerts, loading, error, toggleSystem };
}
