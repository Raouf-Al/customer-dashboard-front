import { Crown, TrendingUp, Users, DollarSign } from "lucide-react";
import KPICard from "@/components/dashboard/KPICard";
import ChartCard from "@/components/dashboard/ChartCard";
import { vipCustomers } from "@/lib/mockData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatCurrencyLYD } from "@/lib/formatters";
import { useLanguage } from "@/contexts/LanguageContext";
import { translateDataValue } from "@/lib/i18n";

const VIPPage = () => {
  const { locale, t } = useLanguage();
  const totalAUM = vipCustomers.reduce((s, v) => s + v.aum, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">{t("vip.title")}</h2>
        <p className="text-sm text-muted-foreground">{t("vip.subtitle")}</p>
      </div>

      {/* Criteria */}
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
        <p className="text-xs font-medium text-primary mb-1">{t("vip.criteria.title")}</p>
        <p className="text-xs text-muted-foreground">{t("vip.criteria.description", { aum: formatCurrencyLYD(10_000_000, { locale, compact: true, maximumFractionDigits: 0 }) })}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard title={t("vip.totalAum")} value={formatCurrencyLYD(totalAUM, { locale, compact: true, maximumFractionDigits: 1 })} change={12.4} icon={<DollarSign className="h-4 w-4" />} />
        <KPICard title={t("vip.count")} value={vipCustomers.length} change={8} icon={<Crown className="h-4 w-4" />} />
        <KPICard title={t("vip.growth")} value="+8%" icon={<TrendingUp className="h-4 w-4" />} />
        <KPICard title={t("vip.premiumAdoption")} value="72%" icon={<Users className="h-4 w-4" />} subtitle={t("vip.premiumAdoptionSubtitle")} />
      </div>

      {/* Retention */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title={t("vip.churnRiskDistribution")}>
          <div className="space-y-3">
            {["Low", "Medium", "High"].map((risk) => {
              const count = vipCustomers.filter((v) => v.churnRisk === risk).length;
              const pct = Math.round((count / vipCustomers.length) * 100);
              return (
                <div key={risk} className="flex items-center gap-3">
                  <span className="w-16 text-xs text-foreground">{translateDataValue(t, "churnRisk", risk)}</span>
                  <Progress value={pct} className="h-2 flex-1" />
                  <span className="text-xs text-muted-foreground w-10 text-right">{pct}%</span>
                </div>
              );
            })}
          </div>
        </ChartCard>

        <ChartCard title={t("vip.premiumProductAdoption")}>
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <p className="text-4xl font-bold text-primary">72%</p>
              <p className="text-xs text-muted-foreground mt-1">{t("vip.premiumProductAdoptionSubtitle")}</p>
            </div>
          </div>
        </ChartCard>
      </div>

      {/* VIP Table */}
      <ChartCard title={t("vip.topCustomers")} subtitle={t("vip.topCustomersSubtitle")}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs w-8">{t("global.rank")}</TableHead>
                <TableHead className="text-xs">{t("global.name")}</TableHead>
                <TableHead className="text-xs text-right">{t("vip.table.aum")}</TableHead>
                <TableHead className="text-xs text-right">{t("vip.table.revenue")}</TableHead>
                <TableHead className="text-xs text-right">{t("vip.table.loanSize")}</TableHead>
                <TableHead className="text-xs text-right">{t("vip.table.cardSpend")}</TableHead>
                <TableHead className="text-xs">{t("vip.table.churnRisk")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vipCustomers.map((v) => (
                <TableRow key={v.rank}>
                  <TableCell className="text-sm text-muted-foreground">{v.rank}</TableCell>
                  <TableCell className="text-sm font-medium">{v.name}</TableCell>
                  <TableCell className="text-sm text-right">{formatCurrencyLYD(v.aum, { locale, compact: true, maximumFractionDigits: 1 })}</TableCell>
                  <TableCell className="text-sm text-right">{formatCurrencyLYD(v.revenue, { locale, compact: true, maximumFractionDigits: 1 })}</TableCell>
                  <TableCell className="text-sm text-right">{v.loanSize ? formatCurrencyLYD(v.loanSize, { locale, compact: true, maximumFractionDigits: 1 }) : t("global.notAvailable")}</TableCell>
                  <TableCell className="text-sm text-right">{formatCurrencyLYD(v.cardSpend, { locale, compact: true, maximumFractionDigits: 1 })}</TableCell>
                  <TableCell>
                    <Badge className={`text-[10px] ${
                      v.churnRisk === "Low" ? "bg-success text-success-foreground" :
                      v.churnRisk === "Medium" ? "bg-warning text-warning-foreground" :
                      "bg-destructive text-destructive-foreground"
                    }`}>{translateDataValue(t, "churnRisk", v.churnRisk)}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </ChartCard>
    </div>
  );
};

export default VIPPage;
