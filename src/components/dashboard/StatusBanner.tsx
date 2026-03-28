import { motion } from "framer-motion";
import { ShieldCheck, ShieldAlert } from "lucide-react";

interface StatusBannerProps {
  status: "SAFE" | "INTRUSION_DETECTED";
}

const StatusBanner = ({ status }: StatusBannerProps) => {
  const isSafe = status === "SAFE";

  return (
    <motion.div
      key={status}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`relative overflow-hidden rounded-lg border p-6 ${
        isSafe
          ? "bg-safe/5 border-safe/30 glow-safe"
          : "bg-danger/5 border-danger/30 glow-danger"
      }`}
    >
      {/* Animated background pulse for danger */}
      {!isSafe && (
        <motion.div
          animate={{ opacity: [0.05, 0.15, 0.05] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute inset-0 bg-danger"
        />
      )}

      <div className="relative flex items-center gap-4">
        <motion.div
          animate={!isSafe ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 0.8, repeat: Infinity }}
          className={`w-14 h-14 rounded-full flex items-center justify-center ${
            isSafe ? "bg-safe/20" : "bg-danger/20"
          }`}
        >
          {isSafe ? (
            <ShieldCheck className="w-7 h-7 text-safe" />
          ) : (
            <ShieldAlert className="w-7 h-7 text-danger" />
          )}
        </motion.div>
        <div>
          <h2 className={`text-2xl font-bold font-mono ${isSafe ? "text-safe" : "text-danger"}`}>
            {isSafe ? "SYSTEM SAFE" : "⚠ INTRUSION DETECTED"}
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            {isSafe ? "All sensors nominal. No threats detected." : "Security breach detected! Immediate attention required."}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default StatusBanner;
