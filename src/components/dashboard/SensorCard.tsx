import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface SensorCardProps {
  title: string;
  icon: LucideIcon;
  active: boolean;
  activeLabel: string;
  inactiveLabel: string;
  variant: "safe" | "danger" | "warning";
}

const variantStyles = {
  safe: {
    active: "border-safe/40 bg-safe/5 glow-safe",
    dot: "bg-safe",
    text: "text-safe",
  },
  danger: {
    active: "border-danger/40 bg-danger/5 glow-danger",
    dot: "bg-danger",
    text: "text-danger",
  },
  warning: {
    active: "border-warning/40 bg-warning/5 glow-warning",
    dot: "bg-warning",
    text: "text-warning",
  },
};

const SensorCard = ({ title, icon: Icon, active, activeLabel, inactiveLabel, variant }: SensorCardProps) => {
  const styles = variantStyles[variant];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-lg border p-5 transition-all duration-300 ${
        active ? styles.active : "border-border bg-card"
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
          active ? `${styles.text} bg-current/10` : "bg-muted text-muted-foreground"
        }`}>
          <Icon className="w-5 h-5" style={active ? { color: `hsl(var(--${variant}))` } : {}} />
        </div>
        <div className="flex items-center gap-2">
          <motion.div
            animate={active ? { scale: [1, 1.3, 1] } : {}}
            transition={{ duration: 1, repeat: Infinity }}
            className={`w-2.5 h-2.5 rounded-full ${active ? styles.dot : "bg-muted-foreground/30"}`}
          />
        </div>
      </div>
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      <p className={`text-lg font-semibold font-mono mt-1 ${active ? styles.text : "text-foreground"}`}>
        {active ? activeLabel : inactiveLabel}
      </p>
    </motion.div>
  );
};

export default SensorCard;
