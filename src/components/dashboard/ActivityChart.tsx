import { AlertEntry } from "@/hooks/useFirebaseData";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Activity } from "lucide-react";

interface ActivityChartProps {
  alerts: AlertEntry[];
}

const ActivityChart = ({ alerts }: ActivityChartProps) => {
  // Group alerts by hour for the last 24h
  const now = Date.now();
  const last24h = now - 24 * 60 * 60 * 1000;

  const hourlyData: { time: string; events: number; danger: number }[] = [];
  for (let i = 23; i >= 0; i--) {
    const hourStart = now - i * 60 * 60 * 1000;
    const hourEnd = hourStart + 60 * 60 * 1000;
    const hourAlerts = alerts.filter((a) => a.timestamp >= hourStart && a.timestamp < hourEnd);
    const h = new Date(hourStart).getHours();
    hourlyData.push({
      time: `${h.toString().padStart(2, "0")}:00`,
      events: hourAlerts.length,
      danger: hourAlerts.filter((a) => a.severity === "danger").length,
    });
  }

  return (
    <div className="bg-card border border-border rounded-lg p-5">
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <Activity className="w-5 h-5 text-primary" />
        Activity (24h)
      </h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={hourlyData}>
            <defs>
              <linearGradient id="eventGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(150, 80%, 45%)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(150, 80%, 45%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="dangerGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="time" stroke="hsl(215, 15%, 50%)" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="hsl(215, 15%, 50%)" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(220, 18%, 10%)",
                border: "1px solid hsl(220, 15%, 16%)",
                borderRadius: "8px",
                color: "hsl(210, 20%, 92%)",
                fontSize: 12,
              }}
            />
            <Area type="monotone" dataKey="events" stroke="hsl(150, 80%, 45%)" fill="url(#eventGrad)" strokeWidth={2} />
            <Area type="monotone" dataKey="danger" stroke="hsl(0, 72%, 51%)" fill="url(#dangerGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ActivityChart;
