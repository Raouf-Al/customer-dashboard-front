import { Wallet, XCircle, Snowflake, Activity } from "lucide-react";
import KPICard from "@/components/dashboard/KPICard";
import ChartCard from "@/components/dashboard/ChartCard";
import { accountStatusData, accountClassDistribution, salaryAccountData, adbRanges, subscriptionData, regionalData } from "@/lib/mockData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatCurrencyLYD, formatNumber } from "@/lib/formatters";
import { translateDataValue } from "@/lib/i18n";

const COLORS = ["hsl(217,71%,53%)", "hsl(142,71%,45%)", "hsl(38,92%,50%)", "hsl(280,65%,60%)", "hsl(199,89%,48%)", "hsl(0,72%,51%)"];

const AccountsPage = () => {
  const { locale, t } = useLanguage();
  const translatedAccountClassDistribution = accountClassDistribution.map((item) => ({
    ...item,
    name: translateDataValue(t, "accountClass", item.name),
  }));
  const translatedRegionalData = regionalData.map((item) => ({
    ...item,
    region: translateDataValue(t, "region", item.region),
  }));
  const translatedSalaryAccountData = salaryAccountData.map((item) => ({
    ...item,
    name: translateDataValue(t, "salaryStatus", item.name),
  }));
  const translatedSubscriptionData = subscriptionData.map((item) => ({
    ...item,
    name: translateDataValue(t, "channel", item.name),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">{t("accounts.title")}</h2>
        <p className="text-sm text-muted-foreground">{t("accounts.subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard title={t("accounts.activeAccounts")} value={formatNumber(accountStatusData.active, { locale })} change={4.2} icon={<Activity className="h-4 w-4" />} />
        <KPICard title={t("accounts.inactiveAccounts")} value={formatNumber(accountStatusData.inactive, { locale })} change={-2.1} icon={<Wallet className="h-4 w-4" />} />
        <KPICard title={t("accounts.closedAccounts")} value={formatNumber(accountStatusData.closed, { locale })} icon={<XCircle className="h-4 w-4" />} />
        <KPICard title={t("accounts.frozenAccounts")} value={formatNumber(accountStatusData.frozen, { locale })} icon={<Snowflake className="h-4 w-4" />} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title={t("accounts.accountClassDistribution")}>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={translatedAccountClassDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={2}>
                  {translatedAccountClassDistribution.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} formatter={(v: number) => [`${v}%`, ""]} />
                <Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title={t("accounts.regionalDistribution")}>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={translatedRegionalData}>
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
        <ChartCard title={t("accounts.salaryAccounts")}>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={translatedSalaryAccountData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={35} outerRadius={55} paddingAngle={4}>
                  <Cell fill="hsl(142,71%,45%)" />
                  <Cell fill="hsl(220,13%,91%)" />
                </Pie>
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} formatter={(v: number) => [`${v}%`, ""]} />
                <Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title={t("accounts.adbRanges")} className="lg:col-span-2">
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

      <ChartCard title={t("accounts.subscriptionBreakdown.title")} subtitle={t("accounts.subscriptionBreakdown.subtitle")}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">{t("accounts.table.channel")}</TableHead>
                <TableHead className="text-xs text-right">{t("accounts.table.active")}</TableHead>
                <TableHead className="text-xs text-right">{t("accounts.table.inactive")}</TableHead>
                <TableHead className="text-xs">{t("accounts.table.adoption")}</TableHead>
                <TableHead className="text-xs text-right">{t("accounts.table.revenue")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {translatedSubscriptionData.map((sub) => {
                const total = sub.active + sub.inactive;
                const pct = Math.round((sub.active / total) * 100);
                return (
                  <TableRow key={sub.name}>
                    <TableCell className="text-sm font-medium">{sub.name}</TableCell>
                    <TableCell className="text-sm text-right">{formatNumber(sub.active, { locale })}</TableCell>
                    <TableCell className="text-sm text-right text-muted-foreground">{formatNumber(sub.inactive, { locale })}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={pct} className="h-1.5 w-20" />
                        <span className="text-xs text-muted-foreground">{pct}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-right">
                      {formatCurrencyLYD(sub.revenue, { locale, compact: true, maximumFractionDigits: 0 })}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </ChartCard>
    </div>
  );
};

export default AccountsPage;
