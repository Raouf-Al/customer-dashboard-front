import { alerts } from "@/lib/mockData";
import { Badge } from "@/components/ui/badge";
import ChartCard from "@/components/dashboard/ChartCard";
import { AlertTriangle, Bell, TrendingDown, TrendingUp, Users, CreditCard, Smartphone } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, LineChart, Line, AreaChart, Area } from "recharts";

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

// Chart data derived from alerts
const severityCounts = ["critical", "high", "medium", "low"].map((sev) => ({
  name: sev.charAt(0).toUpperCase() + sev.slice(1),
  count: alerts.filter((a) => a.severity === sev).length,
}));

const typeCounts = Object.entries(
  alerts.reduce<Record<string, number>>((acc, a) => { acc[a.type] = (acc[a.type] || 0) + 1; return acc; }, {})
).map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }));

const alertTrend = [
  { period: "Week 1", critical: 1, high: 2, medium: 3, low: 1 },
  { period: "Week 2", critical: 2, high: 1, medium: 2, low: 3 },
  { period: "Week 3", critical: 0, high: 3, medium: 1, low: 2 },
  { period: "Week 4", critical: 2, high: 2, medium: 2, low: 2 },
];

const resolutionData = [
  { name: "Resolved", value: 62 },
  { name: "In Progress", value: 25 },
  { name: "Unresolved", value: 13 },
];

const SEV_COLORS = ["hsl(0, 72%, 51%)", "hsl(38, 92%, 50%)", "hsl(199, 89%, 48%)", "hsl(220, 13%, 69%)"];
const TYPE_COLORS = ["hsl(217, 71%, 53%)", "hsl(142, 71%, 45%)", "hsl(38, 92%, 50%)", "hsl(280, 65%, 60%)", "hsl(350, 70%, 55%)"];
const RES_COLORS = ["hsl(142, 71%, 45%)", "hsl(38, 92%, 50%)", "hsl(0, 72%, 51%)"];

const AlertsPage = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-lg font-semibold text-foreground">Alerts</h2>
      <p className="text-sm text-muted-foreground">System notifications, triggered events, and trend analysis</p>
    </div>

    {/* Summary cards */}
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

    {/* Charts row */}
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <ChartCard title="Alerts by Severity" subtitle="Distribution of current alerts">
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={severityCounts}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} allowDecimals={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {severityCounts.map((_, i) => (
                  <Cell key={i} fill={SEV_COLORS[i]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <ChartCard title="Alerts by Type" subtitle="Category breakdown">
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={typeCounts} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={4} dataKey="value" label={({ name, value }) => `${name} (${value})`}>
                {typeCounts.map((_, i) => (
                  <Cell key={i} fill={TYPE_COLORS[i % TYPE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <ChartCard title="Resolution Status" subtitle="Current alert resolution rates">
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={resolutionData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={4} dataKey="value" label={({ name, value }) => `${name} ${value}%`}>
                {resolutionData.map((_, i) => (
                  <Cell key={i} fill={RES_COLORS[i]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
    </div>

    {/* Trend chart */}
    <ChartCard title="Alert Trend (Last 4 Weeks)" subtitle="Weekly alert volume by severity">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={alertTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="period" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} allowDecimals={false} />
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
            <Area type="monotone" dataKey="critical" stackId="1" stroke="hsl(0, 72%, 51%)" fill="hsl(0, 72%, 51%)" fillOpacity={0.6} />
            <Area type="monotone" dataKey="high" stackId="1" stroke="hsl(38, 92%, 50%)" fill="hsl(38, 92%, 50%)" fillOpacity={0.6} />
            <Area type="monotone" dataKey="medium" stackId="1" stroke="hsl(199, 89%, 48%)" fill="hsl(199, 89%, 48%)" fillOpacity={0.6} />
            <Area type="monotone" dataKey="low" stackId="1" stroke="hsl(220, 13%, 69%)" fill="hsl(220, 13%, 69%)" fillOpacity={0.6} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>

    {/* Alert feed */}
    <div>
      <h3 className="text-sm font-semibold text-foreground mb-3">Alert Feed</h3>
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
  </div>
);

export default AlertsPage;
