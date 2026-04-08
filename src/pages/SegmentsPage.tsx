import { Users, CreditCard, DollarSign, TrendingUp, Activity, BarChart3 } from "lucide-react";
import KPICard from "@/components/dashboard/KPICard";
import ChartCard from "@/components/dashboard/ChartCard";
import { segmentData, regionalData } from "@/lib/mockData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

const SegmentDetailTab = ({ seg }: { seg: typeof segmentData[0] }) => {
  const details = segmentDetails[seg.segment];
  if (!details) return null;

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">{details.description}</p>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <KPICard title="Customers" value={seg.customers.toLocaleString()} change={seg.growth} icon={<Users className="h-4 w-4" />} />
        <KPICard title="Accounts" value={seg.accounts.toLocaleString()} change={seg.growth * 0.7} icon={<CreditCard className="h-4 w-4" />} />
        <KPICard title="Revenue" value={`$${(seg.revenue / 1e6).toFixed(1)}M`} change={seg.growth * 1.2} icon={<DollarSign className="h-4 w-4" />} />
        <KPICard title="Avg Balance" value={`$${details.avgBalance >= 1e6 ? (details.avgBalance / 1e6).toFixed(1) + "M" : (details.avgBalance / 1e3).toFixed(0) + "K"}`} change={seg.growth * 0.5} icon={<BarChart3 className="h-4 w-4" />} />
        <KPICard title="Retention" value={`${details.retentionRate}%`} change={1.2} icon={<Activity className="h-4 w-4" />} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-4 text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">NPS Score</p>
          <p className="text-3xl font-bold text-card-foreground mt-1">{details.nps}</p>
          <p className="text-xs text-muted-foreground mt-1">{details.nps >= 70 ? "Excellent" : details.nps >= 50 ? "Good" : "Needs Improvement"}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4 text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Avg Transactions / Mo</p>
          <p className="text-3xl font-bold text-card-foreground mt-1">{details.avgTransactions}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4 text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Digital Adoption</p>
          <p className="text-3xl font-bold text-card-foreground mt-1">{details.digitalAdoption}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="Revenue & Customer Trend" subtitle="6-month trend">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={details.monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis yAxisId="left" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => `$${(v / 1e6).toFixed(1)}M`} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid hsl(var(--border))" }} />
                <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="hsl(217, 71%, 53%)" strokeWidth={2} dot={{ r: 3 }} name="Revenue" />
                <Line yAxisId="right" type="monotone" dataKey="customers" stroke="hsl(142, 71%, 45%)" strokeWidth={2} dot={{ r: 3 }} name="Customers" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Product Mix" subtitle="Distribution by product type">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={details.productMix} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value" label={({ name, value }) => `${name} ${value}%`}>
                  {details.productMix.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <ChartCard title="Channel Usage" subtitle="Percentage of transactions by channel">
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={details.channelUsage} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => `${v}%`} />
              <YAxis dataKey="channel" type="category" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} width={120} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} formatter={(v: number) => [`${v}%`, "Usage"]} />
              <Bar dataKey="pct" fill="hsl(217, 71%, 53%)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
    </div>
  );
};

const SegmentsPage = () => {
  const totalCustomers = segmentData.reduce((s, d) => s + d.customers, 0);
  const totalAccounts = segmentData.reduce((s, d) => s + d.accounts, 0);
  const totalRevenue = segmentData.reduce((s, d) => s + d.revenue, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Segments</h2>
        <p className="text-sm text-muted-foreground">Explore segment performance and drill into individual segments</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          {segmentData.map((seg) => (
            <TabsTrigger key={seg.segment} value={seg.segment}>{seg.segment}</TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview">
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <KPICard title="Total Customers" value={totalCustomers.toLocaleString()} change={8.4} icon={<Users className="h-4 w-4" />} />
              <KPICard title="Total Accounts" value={totalAccounts.toLocaleString()} change={6.2} icon={<CreditCard className="h-4 w-4" />} />
              <KPICard title="Total Revenue" value={`$${(totalRevenue / 1e6).toFixed(1)}M`} change={11.7} icon={<DollarSign className="h-4 w-4" />} />
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <ChartCard title="Regional Distribution" subtitle="Customer count by region">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={regionalData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="region" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                      <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                      <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid hsl(var(--border))" }} />
                      <Bar dataKey="customers" radius={[4, 4, 0, 0]}>
                        {regionalData.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>

              <ChartCard title="Revenue by Region" subtitle="Total revenue per region">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={regionalData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis type="number" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => `$${(v / 1e6).toFixed(1)}M`} />
                      <YAxis dataKey="region" type="category" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} width={60} />
                      <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} formatter={(v: number) => [`$${(v / 1e6).toFixed(2)}M`, "Revenue"]} />
                      <Bar dataKey="revenue" fill="hsl(217, 71%, 53%)" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>
            </div>

            <ChartCard title="Segment Performance Breakdown" subtitle="Detailed metrics per segment">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Segment</TableHead>
                      <TableHead className="text-xs text-right">Customers</TableHead>
                      <TableHead className="text-xs text-right">Accounts</TableHead>
                      <TableHead className="text-xs text-right">Revenue</TableHead>
                      <TableHead className="text-xs text-right">Growth</TableHead>
                      <TableHead className="text-xs">Region</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {segmentData.map((seg) => (
                      <TableRow key={seg.segment}>
                        <TableCell className="text-sm font-medium">{seg.segment}</TableCell>
                        <TableCell className="text-sm text-right">{seg.customers.toLocaleString()}</TableCell>
                        <TableCell className="text-sm text-right">{seg.accounts.toLocaleString()}</TableCell>
                        <TableCell className="text-sm text-right">${(seg.revenue / 1e6).toFixed(1)}M</TableCell>
                        <TableCell className="text-right">
                          <Badge variant={seg.growth >= 10 ? "default" : "secondary"} className={`text-xs ${seg.growth >= 10 ? "bg-success text-success-foreground" : ""}`}>
                            +{seg.growth}%
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{seg.region}</TableCell>
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
