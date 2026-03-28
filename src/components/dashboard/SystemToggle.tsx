import { Switch } from "@/components/ui/switch";
import { Power } from "lucide-react";

interface SystemToggleProps {
  systemOn: boolean;
  onToggle: (on: boolean) => void;
}

const SystemToggle = ({ systemOn, onToggle }: SystemToggleProps) => {
  return (
    <div className={`rounded-lg border p-5 transition-all duration-300 ${
      systemOn ? "bg-safe/5 border-safe/20" : "bg-card border-border"
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            systemOn ? "bg-safe/20" : "bg-muted"
          }`}>
            <Power className={`w-5 h-5 ${systemOn ? "text-safe" : "text-muted-foreground"}`} />
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">System Power</h3>
            <p className={`font-semibold font-mono ${systemOn ? "text-safe" : "text-muted-foreground"}`}>
              {systemOn ? "ARMED" : "DISARMED"}
            </p>
          </div>
        </div>
        <Switch checked={systemOn} onCheckedChange={onToggle} />
      </div>
    </div>
  );
};

export default SystemToggle;
