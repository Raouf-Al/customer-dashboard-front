import { alerts } from "@/lib/mockData";
import { Badge } from "@/components/ui/badge";
import ChartCard from "@/components/dashboard/ChartCard";
import { AlertTriangle, Bell, TrendingDown, TrendingUp, Users, CreditCard, Smartphone } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, LineChart, Line, AreaChart, Area } from "recharts";
import { useLanguage } from "@/contexts/LanguageContext";
import { translateDataValue } from "@/lib/i18n";

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
const alertTrend = [
  { periodKey: "alerts.week1", critical: 1, high: 2, medium: 3, low: 1 },
  { periodKey: "alerts.week2", critical: 2, high: 1, medium: 2, low: 3 },
  { periodKey: "alerts.week3", critical: 0, high: 3, medium: 1, low: 2 },
  { periodKey: "alerts.week4", critical: 2, high: 2, medium: 2, low: 2 },
];

const SEV_COLORS = ["hsl(0, 72%, 51%)", "hsl(38, 92%, 50%)", "hsl(199, 89%, 48%)", "hsl(220, 13%, 69%)"];
const TYPE_COLORS = ["hsl(217, 71%, 53%)", "hsl(142, 71%, 45%)", "hsl(38, 92%, 50%)", "hsl(280, 65%, 60%)", "hsl(350, 70%, 55%)"];
const RES_COLORS = ["hsl(142, 71%, 45%)", "hsl(38, 92%, 50%)", "hsl(0, 72%, 51%)"];

const alertCopy = {
  1: { titleKey: "alerts.feed.1.title", descriptionKey: "alerts.feed.1.description", params: { count: "142", fromSegmentKey: "data.segment.retailStandard", toSegmentKey: "data.segment.retailPremium" } },
  2: { titleKey: "alerts.feed.2.title", descriptionKey: "alerts.feed.2.description", params: { branch: "Mumbai West", value: "28%" } },
  3: { titleKey: "alerts.feed.3.title", descriptionKey: "alerts.feed.3.description", params: { value: "30%", segmentKey: "data.segment.corporateSme" } },
  4: { titleKey: "alerts.feed.4.title", descriptionKey: "alerts.feed.4.description", params: { count: "1,200" } },
  5: { titleKey: "alerts.feed.5.title", descriptionKey: "alerts.feed.5.description", params: { value: "45%" } },
  6: { titleKey: "alerts.feed.6.title", descriptionKey: "alerts.feed.6.description", params: { count: "890" } },
  7: { titleKey: "alerts.feed.7.title", descriptionKey: "alerts.feed.7.description", params: { count: "12" } },
  8: { titleKey: "alerts.feed.8.title", descriptionKey: "alerts.feed.8.description", params: { value: "22%" } },
} as const;

const AlertsPage = () => {
  const { t } = useLanguage();
  const severityCounts = ["critical", "high", "medium", "low"].map((sev) => ({
    name: translateDataValue(t, "alertSeverity", sev),
    count: alerts.filter((a) => a.severity === sev).length,
  }));
  const typeCounts = Object.entries(
    alerts.reduce<Record<string, number>>((acc, a) => {
      acc[a.type] = (acc[a.type] || 0) + 1;
      return acc;
    }, {}),
  ).map(([name, value]) => ({
    name: translateDataValue(t, "alertType", name),
    value,
  }));
  const localizedAlertTrend = alertTrend.map((item) => ({
    ...item,
    period: t(item.periodKey),
  }));
  const resolutionData = [
    { name: translateDataValue(t, "resolution", "Resolved"), value: 62 },
    { name: translateDataValue(t, "resolution", "In Progress"), value: 25 },
    { name: translateDataValue(t, "resolution", "Unresolved"), value: 13 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">{t("alerts.title")}</h2>
        <p className="text-sm text-muted-foreground">{t("alerts.subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {["critical", "high", "medium", "low"].map((sev) => {
          const count = alerts.filter((a) => a.severity === sev).length;
          return (
            <div key={sev} className={`rounded-lg border p-4 ${severityStyles[sev]}`}>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">{translateDataValue(t, "alertSeverity", sev)}</p>
              <p className="text-2xl font-semibold text-card-foreground mt-1">{count}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard title={t("alerts.bySeverity.title")} subtitle={t("alerts.bySeverity.subtitle")}>
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

        <ChartCard title={t("alerts.byType.title")} subtitle={t("alerts.byType.subtitle")}>
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

        <ChartCard title={t("alerts.resolution.title")} subtitle={t("alerts.resolution.subtitle")}>
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

      <ChartCard title={t("alerts.trend.title")} subtitle={t("alerts.trend.subtitle")}>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={localizedAlertTrend}>
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

      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">{t("alerts.feed")}</h3>
        <div className="space-y-3">
          {alerts.map((alert) => {
            const copy = alertCopy[alert.id as keyof typeof alertCopy];
            const params = {
              ...copy.params,
              fromSegment: copy.params.fromSegmentKey ? t(copy.params.fromSegmentKey) : undefined,
              toSegment: copy.params.toSegmentKey ? t(copy.params.toSegmentKey) : undefined,
              segment: copy.params.segmentKey ? t(copy.params.segmentKey) : undefined,
            };

            return (
              <div
                key={alert.id}
                className={`rounded-lg border p-4 animate-fade-in transition-colors ${severityStyles[alert.severity]}`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 text-muted-foreground">{typeIcon[alert.type]}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-semibold text-card-foreground">{t(copy.titleKey)}</h3>
                      <Badge className={`text-[10px] ${severityBadge[alert.severity]}`}>{translateDataValue(t, "alertSeverity", alert.severity)}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{t(copy.descriptionKey, params)}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-lg font-semibold text-card-foreground">{alert.metric}</p>
                    <p className="text-[10px] text-muted-foreground">{alert.time}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AlertsPage;
