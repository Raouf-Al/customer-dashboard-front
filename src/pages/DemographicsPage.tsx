import KPICard from "@/components/dashboard/KPICard";
import ChartCard from "@/components/dashboard/ChartCard";
import AppBarChart from "@/components/charts/AppBarChart";
import { ageDistribution, genderData, nationalityData, tenureData, kycData, segmentData } from "@/lib/mockData";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer, Tooltip } from "recharts";
import { Users, Building, CheckCircle, UserCheck } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatNumber } from "@/lib/formatters";
import { translateDataValue } from "@/lib/i18n";

const DONUT_COLORS = ["hsl(217,71%,53%)", "hsl(142,71%,45%)", "hsl(38,92%,50%)", "hsl(280,65%,60%)"];

const DemographicsPage = () => {
  const { locale, t } = useLanguage();
  const totalCustomers = segmentData.reduce((s, d) => s + d.customers, 0);
  const totalAccounts = segmentData.reduce((s, d) => s + d.accounts, 0);

  const accountStatus = [
    { name: "Open", value: 82 },
    { name: "Closed", value: 18 },
  ];
  const customerType = [
    { name: "Individual", value: 78 },
    { name: "Corporate", value: 22 },
  ];
  const translatedDonutCards = [
    { title: t("demographics.gender"), data: genderData.map((item) => ({ ...item, name: translateDataValue(t, "gender", item.name) })) },
    { title: t("demographics.nationality"), data: nationalityData.map((item) => ({ ...item, name: translateDataValue(t, "nationality", item.name) })) },
    { title: t("demographics.kycStatus"), data: kycData.map((item) => ({ ...item, name: translateDataValue(t, "kyc", item.name) })) },
    { title: t("demographics.customerType"), data: customerType.map((item) => ({ ...item, name: translateDataValue(t, "customerType", item.name) })) },
  ];
  const translatedAccountStatus = accountStatus.map((item) => ({
    ...item,
    name: translateDataValue(t, "status", item.name),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">{t("demographics.title")}</h2>
        <p className="text-sm text-muted-foreground">{t("demographics.subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard title={t("demographics.totalCustomers")} value={formatNumber(totalCustomers, { locale })} icon={<Users className="h-4 w-4" />} />
        <KPICard title={t("demographics.totalAccounts")} value={formatNumber(totalAccounts, { locale })} icon={<Building className="h-4 w-4" />} />
        <KPICard title={t("demographics.kycCompletion")} value="82.4%" icon={<CheckCircle className="h-4 w-4" />} subtitle={t("demographics.kycPending")} />
        <KPICard title={t("demographics.avgTenure")} value={t("demographics.avgTenureValue")} icon={<UserCheck className="h-4 w-4" />} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title={t("demographics.ageDistribution.title")} subtitle={t("demographics.ageDistribution.subtitle")}>
          <div className="h-56">
            <AppBarChart
              data={ageDistribution}
              categoryKey="range"
              bars={[
                {
                  dataKey: "count",
                  label: t("segments.tooltip.customers"),
                  color: "hsl(var(--chart-1))",
                },
              ]}
            />
          </div>
        </ChartCard>

        <ChartCard title={t("demographics.customerTenure.title")} subtitle={t("demographics.customerTenure.subtitle")}>
          <div className="h-56">
            <AppBarChart
              data={tenureData}
              categoryKey="years"
              bars={[
                {
                  dataKey: "count",
                  label: t("segments.tooltip.customers"),
                  color: "hsl(var(--chart-2))",
                },
              ]}
            />
          </div>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {translatedDonutCards.map(({ title, data }) => (
          <ChartCard key={title} title={title}>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={35} outerRadius={60} paddingAngle={3}>
                    {data.map((_, i) => (
                      <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} formatter={(v: number) => [`${v}%`, ""]} />
                  <Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title={t("demographics.accountStatus.title")} subtitle={t("demographics.accountStatus.subtitle")}>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={translatedAccountStatus} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={4}>
                  <Cell fill="hsl(142,71%,45%)" />
                  <Cell fill="hsl(0,72%,51%)" />
                </Pie>
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} formatter={(v: number) => [`${v}%`, ""]} />
                <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title={t("demographics.segmentationBreakdown.title")} subtitle={t("demographics.segmentationBreakdown.subtitle")}>
          <div className="space-y-2">
            {segmentData.map((seg, i) => {
              const pct = ((seg.customers / totalCustomers) * 100).toFixed(1);
              return (
                <div key={seg.segment} className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: DONUT_COLORS[i % DONUT_COLORS.length] }} />
                  <span className="flex-1 text-xs text-foreground">{translateDataValue(t, "segment", seg.segment)}</span>
                  <span className="text-xs font-medium text-foreground">{pct}%</span>
                  <div className="h-1.5 w-24 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: DONUT_COLORS[i % DONUT_COLORS.length] }} />
                  </div>
                </div>
              );
            })}
          </div>
        </ChartCard>
      </div>
    </div>
  );
};

export default DemographicsPage;
