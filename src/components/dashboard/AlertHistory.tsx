import { AlertEntry } from "@/hooks/useFirebaseData";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, ShieldCheck, Info, Clock } from "lucide-react";

interface AlertHistoryProps {
  alerts: AlertEntry[];
}

const severityConfig = {
  safe: { icon: ShieldCheck, color: "text-safe", bg: "bg-safe/10" },
  warning: { icon: Info, color: "text-warning", bg: "bg-warning/10" },
  danger: { icon: AlertTriangle, color: "text-danger", bg: "bg-danger/10" },
};

const AlertHistory = ({ alerts }: AlertHistoryProps) => {
  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleString();
  };

  return (
    <div className="bg-card border border-border rounded-lg p-5">
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5 text-primary" />
        Alert History
      </h3>

      {alerts.length === 0 ? (
        <p className="text-muted-foreground text-sm text-center py-8">No alerts recorded yet.</p>
      ) : (
        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          <AnimatePresence>
            {alerts.slice(0, 50).map((alert, i) => {
              const config = severityConfig[alert.severity];
              const IconComp = config.icon;
              return (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex items-start gap-3 p-3 rounded-md bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  <div className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 ${config.bg}`}>
                    <IconComp className={`w-4 h-4 ${config.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">{alert.message}</p>
                    <p className="text-xs text-muted-foreground mt-1 font-mono">{formatTime(alert.timestamp)}</p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default AlertHistory;
