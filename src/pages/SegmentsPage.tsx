import {
  Users,
  CreditCard,
  DollarSign,
  Activity,
  BarChart3,
} from "lucide-react";
import KPICard from "@/components/dashboard/KPICard";
import ChartCard from "@/components/dashboard/ChartCard";
import AppBarChart from "@/components/charts/AppBarChart";
import { segmentData, regionalData } from "@/lib/mockData";
import { Tooltip, ResponsiveContainer, Cell, PieChart, Pie, LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatCurrencyLYD, formatNumber } from "@/lib/formatters";
import { translateDataValue, translateMonthLabel } from "@/lib/i18n";

const COLORS = [
  "hsl(217, 71%, 53%)",
  "hsl(142, 71%, 45%)",
  "hsl(38, 92%, 50%)",
  "hsl(280, 65%, 60%)",
  "hsl(199, 89%, 48%)",
  "hsl(350, 70%, 55%)",
];

const segmentDetails: Record<string, {
  description: string;
  avgBalance: number;
  avgTransactions: number;
  retentionRate: number;
  nps: number;
  digitalAdoption: number;
  monthlyTrend: { month: string; revenue: number; customers: number }[];
  productMix: { name: string; value: number }[];
  channelUsage: { channel: string; pct: number }[];
}> = {
  "Retail Premium": {
    description: "High-value individual customers with premium banking products and dedicated relationship managers.",
    avgBalance: 245000, avgTransactions: 42, retentionRate: 94.2, nps: 72, digitalAdoption: 88,
    monthlyTrend: [
      { month: "Jan", revenue: 320000, customers: 11800 }, { month: "Feb", revenue: 340000, customers: 11900 },
      { month: "Mar", revenue: 380000, customers: 12000 }, { month: "Apr", revenue: 360000, customers: 12100 },
      { month: "May", revenue: 395000, customers: 12200 }, { month: "Jun", revenue: 420000, customers: 12400 },
    ],
    productMix: [{ name: "Savings", value: 35 }, { name: "Fixed Deposit", value: 28 }, { name: "Current", value: 22 }, { name: "Investment", value: 15 }],
    channelUsage: [{ channel: "Mobile App", pct: 62 }, { channel: "Internet Banking", pct: 24 }, { channel: "Branch", pct: 10 }, { channel: "ATM", pct: 4 }],
  },
  "Retail Standard": {
    description: "Mass-market individual customers with standard banking products and services.",
    avgBalance: 42000, avgTransactions: 18, retentionRate: 82.1, nps: 54, digitalAdoption: 64,
    monthlyTrend: [
      { month: "Jan", revenue: 620000, customers: 43200 }, { month: "Feb", revenue: 640000, customers: 43800 },
      { month: "Mar", revenue: 680000, customers: 44100 }, { month: "Apr", revenue: 660000, customers: 44500 },
      { month: "May", revenue: 710000, customers: 44800 }, { month: "Jun", revenue: 810000, customers: 45200 },
    ],
    productMix: [{ name: "Savings", value: 52 }, { name: "Current", value: 25 }, { name: "Fixed Deposit", value: 13 }, { name: "Recurring", value: 10 }],
    channelUsage: [{ channel: "Mobile App", pct: 45 }, { channel: "Branch", pct: 28 }, { channel: "ATM", pct: 18 }, { channel: "Internet Banking", pct: 9 }],
  },
  "Corporate SME": {
    description: "Small and medium enterprises with business banking products, trade finance, and credit facilities.",
    avgBalance: 890000, avgTransactions: 128, retentionRate: 89.4, nps: 61, digitalAdoption: 72,
    monthlyTrend: [
      { month: "Jan", revenue: 520000, customers: 3050 }, { month: "Feb", revenue: 540000, customers: 3080 },
      { month: "Mar", revenue: 580000, customers: 3100 }, { month: "Apr", revenue: 560000, customers: 3120 },
      { month: "May", revenue: 620000, customers: 3160 }, { month: "Jun", revenue: 670000, customers: 3200 },
    ],
    productMix: [{ name: "Current", value: 42 }, { name: "Trade Finance", value: 28 }, { name: "Credit Line", value: 18 }, { name: "FX", value: 12 }],
    channelUsage: [{ channel: "Internet Banking", pct: 48 }, { channel: "Branch", pct: 25 }, { channel: "Mobile App", pct: 20 }, { channel: "Call Center", pct: 7 }],
  },
  "Corporate Enterprise": {
    description: "Large corporate entities with comprehensive banking relationships, treasury, and investment services.",
    avgBalance: 12400000, avgTransactions: 890, retentionRate: 97.1, nps: 78, digitalAdoption: 91,
    monthlyTrend: [
      { month: "Jan", revenue: 980000, customers: 860 }, { month: "Feb", revenue: 1020000, customers: 865 },
      { month: "Mar", revenue: 1080000, customers: 870 }, { month: "Apr", revenue: 1050000, customers: 875 },
      { month: "May", revenue: 1150000, customers: 882 }, { month: "Jun", revenue: 1230000, customers: 890 },
    ],
    productMix: [{ name: "Treasury", value: 35 }, { name: "Trade Finance", value: 25 }, { name: "Current", value: 22 }, { name: "Credit", value: 18 }],
    channelUsage: [{ channel: "API/Direct", pct: 52 }, { channel: "Internet Banking", pct: 28 }, { channel: "Relationship Mgr", pct: 15 }, { channel: "Branch", pct: 5 }],
  },
  "Private Banking": {
    description: "Ultra-high-net-worth individuals with personalized wealth management and advisory services.",
    avgBalance: 8900000, avgTransactions: 56, retentionRate: 96.8, nps: 82, digitalAdoption: 78,
    monthlyTrend: [
      { month: "Jan", revenue: 780000, customers: 1050 }, { month: "Feb", revenue: 800000, customers: 1060 },
      { month: "Mar", revenue: 840000, customers: 1065 }, { month: "Apr", revenue: 820000, customers: 1070 },
      { month: "May", revenue: 880000, customers: 1085 }, { month: "Jun", revenue: 980000, customers: 1100 },
    ],
    productMix: [{ name: "Investment", value: 40 }, { name: "Fixed Deposit", value: 25 }, { name: "Savings", value: 20 }, { name: "Insurance", value: 15 }],
    channelUsage: [{ channel: "Relationship Mgr", pct: 45 }, { channel: "Mobile App", pct: 30 }, { channel: "Internet Banking", pct: 18 }, { channel: "Branch", pct: 7 }],
  },
  "Digital Only": {
    description: "Tech-savvy customers who exclusively use digital channels for all banking services.",
    avgBalance: 18000, avgTransactions: 34, retentionRate: 71.3, nps: 68, digitalAdoption: 100,
    monthlyTrend: [
      { month: "Jan", revenue: 120000, customers: 22400 }, { month: "Feb", revenue: 140000, customers: 23800 },
      { month: "Mar", revenue: 160000, customers: 25100 }, { month: "Apr", revenue: 155000, customers: 26200 },
      { month: "May", revenue: 180000, customers: 27500 }, { month: "Jun", revenue: 210000, customers: 28900 },
    ],
    productMix: [{ name: "Savings", value: 48 }, { name: "Payments", value: 28 }, { name: "Investment", value: 15 }, { name: "Insurance", value: 9 }],
    channelUsage: [{ channel: "Mobile App", pct: 78 }, { channel: "Internet Banking", pct: 18 }, { channel: "Chatbot", pct: 4 }, { channel: "Call Center", pct: 0 }],
  },
};

const PIE_COLORS = ["hsl(217, 71%, 53%)", "hsl(142, 71%, 45%)", "hsl(38, 92%, 50%)", "hsl(280, 65%, 60%)"];

const segmentDescriptionKeys: Record<string, string> = {
  "Retail Premium": "segments.detail.description.retailPremium",
  "Retail Standard": "segments.detail.description.retailStandard",
  "Corporate SME": "segments.detail.description.corporateSme",
  "Corporate Enterprise": "segments.detail.description.corporateEnterprise",
  "Private Banking": "segments.detail.description.privateBanking",
  "Digital Only": "segments.detail.description.digitalOnly",
};

const SegmentDetailTab = ({ seg }: { seg: typeof segmentData[0] }) => {
  const { locale, t } = useLanguage();
  const details = segmentDetails[seg.segment];
  if (!details) return null;

  const revenueTrendData = details.monthlyTrend.map((point) => ({
    ...point,
    month: translateMonthLabel(t, point.month),
  }));
  const productMixData = details.productMix.map((item) => ({
    ...item,
    name: translateDataValue(t, "product", item.name),
  }));
  const channelUsageData = details.channelUsage.map((item) => ({
    ...item,
    channel: translateDataValue(t, "channel", item.channel),
  }));

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        {t(segmentDescriptionKeys[seg.segment] ?? details.description)}
      </p>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <KPICard title={t("segments.detail.customers")} value={formatNumber(seg.customers, { locale })} change={seg.growth} icon={<Users className="h-4 w-4" />} />
        <KPICard title={t("segments.detail.accounts")} value={formatNumber(seg.accounts, { locale })} change={seg.growth * 0.7} icon={<CreditCard className="h-4 w-4" />} />
        <KPICard title={t("segments.detail.revenue")} value={formatCurrencyLYD(seg.revenue, { locale, compact: true, maximumFractionDigits: 1 })} change={seg.growth * 1.2} icon={<DollarSign className="h-4 w-4" />} />
        <KPICard title={t("segments.detail.avgBalance")} value={formatCurrencyLYD(details.avgBalance, { locale, compact: true, maximumFractionDigits: 1 })} change={seg.growth * 0.5} icon={<BarChart3 className="h-4 w-4" />} />
        <KPICard title={t("segments.detail.retention")} value={`${formatNumber(details.retentionRate, { locale, maximumFractionDigits: 1 })}%`} change={1.2} icon={<Activity className="h-4 w-4" />} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-4 text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">{t("segments.detail.npsScore")}</p>
          <p className="text-3xl font-bold text-card-foreground mt-1">{details.nps}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {details.nps >= 70
              ? t("segments.detail.excellent")
              : details.nps >= 50
                ? t("segments.detail.good")
                : t("segments.detail.needsImprovement")}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4 text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">{t("segments.detail.avgTransactions")}</p>
          <p className="text-3xl font-bold text-card-foreground mt-1">{formatNumber(details.avgTransactions, { locale })}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4 text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">{t("segments.detail.digitalAdoption")}</p>
          <p className="text-3xl font-bold text-card-foreground mt-1">{formatNumber(details.digitalAdoption, { locale })}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title={t("segments.detail.revenueTrend.title")} subtitle={t("segments.detail.revenueTrend.subtitle")}>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis yAxisId="left" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => formatCurrencyLYD(v, { locale, compact: true, maximumFractionDigits: 1 })} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid hsl(var(--border))" }} formatter={(value: number, name: string) => [
                  name === t("segments.tooltip.revenue")
                    ? formatCurrencyLYD(value, { locale, compact: true, maximumFractionDigits: 1 })
                    : formatNumber(value, { locale }),
                  name,
                ]} />
                <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="hsl(217, 71%, 53%)" strokeWidth={2} dot={{ r: 3 }} name={t("segments.tooltip.revenue")} />
                <Line yAxisId="right" type="monotone" dataKey="customers" stroke="hsl(142, 71%, 45%)" strokeWidth={2} dot={{ r: 3 }} name={t("segments.tooltip.customers")} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title={t("segments.detail.productMix.title")} subtitle={t("segments.detail.productMix.subtitle")}>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={productMixData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value" label={({ name, value }) => `${name} ${value}%`}>
                  {productMixData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <ChartCard title={t("segments.detail.channelUsage.title")} subtitle={t("segments.detail.channelUsage.subtitle")}>
        <div className="h-56">
          <AppBarChart
            data={channelUsageData}
            categoryKey="channel"
            layout="vertical"
            categoryAxisWidth={120}
            valueAxes={[
              {
                tickFormatter: (value) => `${value}%`,
              },
            ]}
            tooltipValueFormatter={(value) => `${value}%`}
            bars={[
              {
                dataKey: "pct",
                label: t("segments.tooltip.usage"),
                color: "hsl(var(--chart-1))",
              },
            ]}
          />
        </div>
      </ChartCard>
    </div>
  );
};

const SegmentsPage = () => {
  const { locale, t } = useLanguage();
  const totalCustomers = segmentData.reduce((s, d) => s + d.customers, 0);
  const totalAccounts = segmentData.reduce((s, d) => s + d.accounts, 0);
  const totalRevenue = segmentData.reduce((s, d) => s + d.revenue, 0);
  const localizedRegionalData = regionalData.map((item) => ({
    ...item,
    region: translateDataValue(t, "region", item.region),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">{t("segments.title")}</h2>
        <p className="text-sm text-muted-foreground">{t("segments.subtitle")}</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabsTrigger value="overview">{t("segments.overview")}</TabsTrigger>
          {segmentData.map((seg) => (
            <TabsTrigger key={seg.segment} value={seg.segment}>
              {translateDataValue(t, "segment", seg.segment)}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview">
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <KPICard title={t("segments.totalCustomers")} value={formatNumber(totalCustomers, { locale })} change={8.4} icon={<Users className="h-4 w-4" />} />
              <KPICard title={t("segments.totalAccounts")} value={formatNumber(totalAccounts, { locale })} change={6.2} icon={<CreditCard className="h-4 w-4" />} />
              <KPICard title={t("segments.totalRevenue")} value={formatCurrencyLYD(totalRevenue, { locale, compact: true, maximumFractionDigits: 1 })} change={11.7} icon={<DollarSign className="h-4 w-4" />} />
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <ChartCard title={t("segments.regionalDistribution.title")} subtitle={t("segments.regionalDistribution.subtitle")}>
                <div className="h-64">
                  <AppBarChart
                    data={localizedRegionalData}
                    categoryKey="region"
                    bars={[
                      {
                        dataKey: "customers",
                        label: t("segments.tooltip.customers"),
                        color: COLORS[0],
                        cellColors: localizedRegionalData.map((_, i) => COLORS[i % COLORS.length]),
                      },
                    ]}
                  />
                </div>
              </ChartCard>

              <ChartCard title={t("segments.revenueByRegion.title")} subtitle={t("segments.revenueByRegion.subtitle")}>
                <div className="h-64">
                  <AppBarChart
                    data={localizedRegionalData}
                    categoryKey="region"
                    layout="vertical"
                    categoryAxisWidth={64}
                    valueAxes={[
                      {
                        tickFormatter: (value) => formatCurrencyLYD(value, { locale, compact: true, maximumFractionDigits: 1 }),
                      },
                    ]}
                    tooltipValueFormatter={(value) => formatCurrencyLYD(Number(value), { locale, compact: true, maximumFractionDigits: 1 })}
                    bars={[
                      {
                        dataKey: "revenue",
                        label: t("segments.tooltip.revenue"),
                        color: "hsl(var(--chart-1))",
                      },
                    ]}
                  />
                </div>
              </ChartCard>
            </div>

            <ChartCard title={t("segments.breakdown.title")} subtitle={t("segments.breakdown.subtitle")}>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">{t("segments.table.segment")}</TableHead>
                      <TableHead className="text-xs text-right">{t("segments.table.customers")}</TableHead>
                      <TableHead className="text-xs text-right">{t("segments.table.accounts")}</TableHead>
                      <TableHead className="text-xs text-right">{t("segments.table.revenue")}</TableHead>
                      <TableHead className="text-xs text-right">{t("segments.table.growth")}</TableHead>
                      <TableHead className="text-xs">{t("segments.table.region")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {segmentData.map((seg) => (
                      <TableRow key={seg.segment}>
                        <TableCell className="text-sm font-medium">{translateDataValue(t, "segment", seg.segment)}</TableCell>
                        <TableCell className="text-sm text-right">{formatNumber(seg.customers, { locale })}</TableCell>
                        <TableCell className="text-sm text-right">{formatNumber(seg.accounts, { locale })}</TableCell>
                        <TableCell className="text-sm text-right">{formatCurrencyLYD(seg.revenue, { locale, compact: true, maximumFractionDigits: 1 })}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant={seg.growth >= 10 ? "default" : "secondary"} className={`text-xs ${seg.growth >= 10 ? "bg-success text-success-foreground" : ""}`}>
                            +{formatNumber(seg.growth, { locale, maximumFractionDigits: 1 })}%
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{translateDataValue(t, "region", seg.region)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </ChartCard>
          </div>
        </TabsContent>

        {segmentData.map((seg) => (
          <TabsContent key={seg.segment} value={seg.segment}>
            <SegmentDetailTab seg={seg} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default SegmentsPage;
