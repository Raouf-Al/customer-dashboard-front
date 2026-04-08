import { Users, CreditCard, DollarSign } from "lucide-react";
import KPICard from "@/components/dashboard/KPICard";
import ChartCard from "@/components/dashboard/ChartCard";
import { segmentData, regionalData } from "@/lib/mockData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const COLORS = [
  "hsl(217, 71%, 53%)",
  "hsl(142, 71%, 45%)",
  "hsl(38, 92%, 50%)",
  "hsl(280, 65%, 60%)",
  "hsl(199, 89%, 48%)",
];

const SegmentsPage = () => {
  const totalCustomers = segmentData.reduce((s, d) => s + d.customers, 0);
  const totalAccounts = segmentData.reduce((s, d) => s + d.accounts, 0);
  const totalRevenue = segmentData.reduce((s, d) => s + d.revenue, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Segments Overview</h2>
        <p className="text-sm text-muted-foreground">High-level view comparing customer segments</p>
      </div>

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
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
                <XAxis dataKey="region" tick={{ fontSize: 11, fill: "hsl(220, 10%, 46%)" }} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(220, 10%, 46%)" }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid hsl(220, 13%, 91%)" }} />
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
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
                <XAxis type="number" tick={{ fontSize: 11, fill: "hsl(220, 10%, 46%)" }} tickFormatter={(v) => `$${(v / 1e6).toFixed(1)}M`} />
                <YAxis dataKey="region" type="category" tick={{ fontSize: 11, fill: "hsl(220, 10%, 46%)" }} width={60} />
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
  );
};

export default SegmentsPage;
