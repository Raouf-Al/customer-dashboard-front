import { alerts } from "@/lib/mockData";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Bell, TrendingDown, TrendingUp, Users, CreditCard, Smartphone } from "lucide-react";

const severityStyles: Record<string, string> = {
  critical: "border-destructive/30 bg-destructive/5",
  high: "border-warning/30 bg-warning/5",
  medium: "border-info/30 bg-info/5",
  low: "border-border bg-card",
};

const severityBadge: Record<string, string> = {
  critical: "bg-destructive text-destructive-foreground",
  high: "bg-warning text-warning-foreground",
  medium: "bg-info text-info-foreground",
  low: "bg-muted text-muted-foreground",
};

const typeIcon: Record<string, React.ReactNode> = {
  segment: <Users className="h-4 w-4" />,
  branch: <TrendingDown className="h-4 w-4" />,
  transaction: <AlertTriangle className="h-4 w-4" />,
  subscription: <Smartphone className="h-4 w-4" />,
  inactive: <Bell className="h-4 w-4" />,
};

const AlertsPage = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-lg font-semibold text-foreground">Alerts</h2>
      <p className="text-sm text-muted-foreground">System notifications and triggered events</p>
    </div>

    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {["critical", "high", "medium", "low"].map((sev) => {
        const count = alerts.filter((a) => a.severity === sev).length;
        return (
          <div key={sev} className={`rounded-lg border p-4 ${severityStyles[sev]}`}>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">{sev}</p>
            <p className="text-2xl font-semibold text-card-foreground mt-1">{count}</p>
          </div>
        );
      })}
    </div>

    <div className="space-y-3">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`rounded-lg border p-4 animate-fade-in transition-colors ${severityStyles[alert.severity]}`}
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5 text-muted-foreground">{typeIcon[alert.type]}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-semibold text-card-foreground">{alert.title}</h3>
                <Badge className={`text-[10px] ${severityBadge[alert.severity]}`}>{alert.severity}</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{alert.description}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-lg font-semibold text-card-foreground">{alert.metric}</p>
              <p className="text-[10px] text-muted-foreground">{alert.time}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default AlertsPage;
