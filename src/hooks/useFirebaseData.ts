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

export function useFirebaseData() {
  const [sensorData, setSensorData] = useState<SensorData>(defaultSensor);
  const [alerts, setAlerts] = useState<AlertEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const sensorRef = ref(db, "sensors");
      const alertsRef = ref(db, "alerts");

      const unsubSensor = onValue(
        sensorRef,
        (snapshot) => {
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
          }
          setLoading(false);
        },
        (err) => {
          setError(err.message);
          setLoading(false);
        }
      );

      const unsubAlerts = onValue(
        alertsRef,
        (snapshot) => {
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
          }
        },
        (err) => {
          setError(err.message);
        }
      );

      return () => {
        unsubSensor();
        unsubAlerts();
      };
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }, []);

  const toggleSystem = async (on: boolean) => {
    try {
      await set(ref(db, "sensors/systemOn"), on);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return { sensorData, alerts, loading, error, toggleSystem };
}
