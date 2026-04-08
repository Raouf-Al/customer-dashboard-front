import { Wallet, XCircle, Snowflake, Activity } from "lucide-react";
import KPICard from "@/components/dashboard/KPICard";
import ChartCard from "@/components/dashboard/ChartCard";
import { accountStatusData, accountClassDistribution, salaryAccountData, adbRanges, subscriptionData, regionalData } from "@/lib/mockData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const COLORS = ["hsl(217,71%,53%)", "hsl(142,71%,45%)", "hsl(38,92%,50%)", "hsl(280,65%,60%)", "hsl(199,89%,48%)", "hsl(0,72%,51%)"];

const AccountsPage = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-lg font-semibold text-foreground">Accounts</h2>
      <p className="text-sm text-muted-foreground">Operational view of all bank accounts</p>
    </div>

    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <KPICard title="Active Accounts" value={accountStatusData.active.toLocaleString()} change={4.2} icon={<Activity className="h-4 w-4" />} />
      <KPICard title="Inactive Accounts" value={accountStatusData.inactive.toLocaleString()} change={-2.1} icon={<Wallet className="h-4 w-4" />} />
      <KPICard title="Closed Accounts" value={accountStatusData.closed.toLocaleString()} icon={<XCircle className="h-4 w-4" />} />
      <KPICard title="Frozen Accounts" value={accountStatusData.frozen.toLocaleString()} icon={<Snowflake className="h-4 w-4" />} />
    </div>

    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <ChartCard title="Account Class Distribution">
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={accountClassDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={2}>
                {accountClassDistribution.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} formatter={(v: number) => [`${v}%`, ""]} />
              <Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <ChartCard title="Regional Account Distribution">
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={regionalData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,91%)" />
              <XAxis dataKey="region" tick={{ fontSize: 11, fill: "hsl(220,10%,46%)" }} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(220,10%,46%)" }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Bar dataKey="customers" fill="hsl(217,71%,53%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
    </div>

    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <ChartCard title="Salary Accounts">
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={salaryAccountData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={35} outerRadius={55} paddingAngle={4}>
                <Cell fill="hsl(142,71%,45%)" />
                <Cell fill="hsl(220,13%,91%)" />
              </Pie>
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} formatter={(v: number) => [`${v}%`, ""]} />
              <Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <ChartCard title="Average Daily Balance Ranges" className="lg:col-span-2">
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={adbRanges}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,91%)" />
              <XAxis dataKey="range" tick={{ fontSize: 11, fill: "hsl(220,10%,46%)" }} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(220,10%,46%)" }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Bar dataKey="count" fill="hsl(38,92%,50%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
    </div>

    <ChartCard title="Subscription Breakdown" subtitle="Active subscriptions across channels">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs">Channel</TableHead>
              <TableHead className="text-xs text-right">Active</TableHead>
              <TableHead className="text-xs text-right">Inactive</TableHead>
              <TableHead className="text-xs">Adoption</TableHead>
              <TableHead className="text-xs text-right">Revenue</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscriptionData.map((sub) => {
              const total = sub.active + sub.inactive;
              const pct = Math.round((sub.active / total) * 100);
              return (
                <TableRow key={sub.name}>
                  <TableCell className="text-sm font-medium">{sub.name}</TableCell>
                  <TableCell className="text-sm text-right">{sub.active.toLocaleString()}</TableCell>
                  <TableCell className="text-sm text-right text-muted-foreground">{sub.inactive.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={pct} className="h-1.5 w-20" />
                      <span className="text-xs text-muted-foreground">{pct}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-right">${(sub.revenue / 1000).toFixed(0)}K</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </ChartCard>
  </div>
);

export default AccountsPage;
