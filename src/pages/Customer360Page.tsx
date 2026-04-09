import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import KPICard from "@/components/dashboard/KPICard";
import ChartCard from "@/components/dashboard/ChartCard";
import AppBarChart from "@/components/charts/AppBarChart";
import AppAreaChart from "@/components/charts/AppAreaChart";
import {
  sampleCustomer,
  accountFinancials,
  accountMonthlyRevenue,
  accountIncomeDebit,
  accountSalaryDetails,
  topTrnCodes,
} from "@/lib/mockData";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatCurrencyLYD, formatNumber } from "@/lib/formatters";
import { translateDataValue, translateMonthLabel } from "@/lib/i18n";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";

const ACCOUNTS_PER_PAGE = 3;
const MONTH_ORDER = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const SALARY_CONSISTENCY_MONTHS = MONTH_ORDER.slice(-6);
const EMPTY_SALARY_DETAILS = {
  receivesSalary: false,
  avgMonthlySalary: 0,
  consistency: [false, false, false, false, false, false],
};

function orderMonthlySeries<T extends { month: string }>(
  points: T[],
  createEmptyPoint: (month: string) => T,
) {
  const pointMap = new Map(points.map((point) => [point.month, point]));
  return MONTH_ORDER.map(
    (month) => pointMap.get(month) || createEmptyPoint(month),
  );
}

const Customer360Page = () => {
  const navigate = useNavigate();
  const { isRTL, locale, t } = useLanguage();
  const c = sampleCustomer;
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [accountPage, setAccountPage] = useState(0);
  const [topTrnMetric, setTopTrnMetric] = useState<"frequency" | "revenue">(
    "revenue",
  );
  const activeAcc = selectedAccount
    ? c.accounts.find((a) => a.id === selectedAccount)
    : null;

  const fin = selectedAccount
    ? accountFinancials[selectedAccount] || c.financials
    : c.financials;
  const monthlyRev = selectedAccount
    ? accountMonthlyRevenue[selectedAccount] || c.monthlyRevenue
    : c.monthlyRevenue;
  const customerIncomeDebit = useMemo(() => {
    const monthMap = new Map<
      string,
      { month: string; income: number; debit: number }
    >();

    c.accounts.forEach((account) => {
      (accountIncomeDebit[account.id] || []).forEach((point) => {
        const existing = monthMap.get(point.month);
        if (existing) {
          existing.income += point.income;
          existing.debit += point.debit;
          return;
        }
        monthMap.set(point.month, { ...point });
      });
    });

    return orderMonthlySeries(Array.from(monthMap.values()), (month) => ({
      month,
      income: 0,
      debit: 0,
    }));
  }, [c.accounts]);
  const incomeDebit = selectedAccount
    ? accountIncomeDebit[selectedAccount] || []
    : customerIncomeDebit;
  const salaryDetails = activeAcc
    ? accountSalaryDetails[activeAcc.id] || EMPTY_SALARY_DETAILS
    : null;

  const totalPages = Math.ceil(c.accounts.length / ACCOUNTS_PER_PAGE);
  const paginatedAccounts = c.accounts.slice(
    accountPage * ACCOUNTS_PER_PAGE,
    (accountPage + 1) * ACCOUNTS_PER_PAGE,
  );
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index);

  const trnByFreq = [...topTrnCodes].sort(
    (a, b) => b.frequency - a.frequency || b.revenue - a.revenue,
  );
  const trnByRev = [...topTrnCodes].sort(
    (a, b) => b.revenue - a.revenue || b.frequency - a.frequency,
  );
  const trnMetricData = topTrnMetric === "frequency" ? trnByFreq : trnByRev;
  const trnMetricMax = trnMetricData[0]?.[topTrnMetric] || 0;
  const orderedMonthlyRev = orderMonthlySeries(monthlyRev, (month) => ({
    month,
    revenue: 0,
    volume: 0,
  }));
  const orderedIncomeDebit = orderMonthlySeries(incomeDebit, (month) => ({
    month,
    income: 0,
    debit: 0,
  }));
  const localizedChannelData = [
    {
      name: t("data.channel.onepay"),
      volume: c.channels.onepay.volume,
      value: c.channels.onepay.value / 1000,
    },
    {
      name: t("data.channel.lypay"),
      volume: c.channels.lypay.volume,
      value: c.channels.lypay.value / 1000,
    },
    {
      name: t("data.channel.mobicash"),
      volume: c.channels.mobicash.volume,
      value: c.channels.mobicash.value / 1000,
    },
    { name: t("data.channel.sms"), volume: c.channels.sms.volume, value: 0 },
  ];
  const salaryConsistencyLabels = SALARY_CONSISTENCY_MONTHS.map((month) =>
    translateMonthLabel(t, month),
  );

  // Merged loans table
  const allLoans = [
    ...c.loans.active.map((l) => {
      const linkedAccount = c.accounts.find(
        (account) => account.id === l.accountId,
      );
      return {
        ...l,
        accountNo: linkedAccount?.number || "—",
        accountClass: linkedAccount?.class || "Other",
        loanStatus: "Active" as const,
        behavior: "—",
        paid: l.outstanding * 0.3,
        installment: Math.round(l.outstanding / 60),
        nextPayment: "2025-05-01",
      };
    }),
    ...c.loans.closed.map((l) => {
      const linkedAccount = c.accounts.find(
        (account) => account.id === l.accountId,
      );
      return {
        ...l,
        accountNo: linkedAccount?.number || "—",
        accountClass: linkedAccount?.class || "Other",
        outstanding: 0,
        rate: 0,
        maturity: "—",
        loanStatus: "Closed" as const,
        paid: l.amount,
        installment: 0,
        nextPayment: "—",
      };
    }),
  ];
  const visibleLoans = activeAcc
    ? allLoans.filter((loan) => loan.accountId === activeAcc.id)
    : allLoans;
  const loanTableColumns = activeAcc ? 7 : 9;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => navigate("/customer-360")}
        >
          <ArrowLeft className={`h-4 w-4 ${isRTL ? "rotate-180" : ""}`} />
        </Button>
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            {t("c360.title")}
          </h2>
          <p className="text-sm text-muted-foreground">{t("c360.subtitle")}</p>
        </div>
      </div>

      {/* 1. Customer Profile — no name shown */}
      <div className="rounded-lg border border-border bg-card p-5 animate-fade-in">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <User className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                className={`text-[10px] ${c.status === "Open" ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"}`}
              >
                {t("c360.customerStatus")}:{" "}
                {translateDataValue(t, "status", c.status)}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{c.id}</p>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
              {(
                [
                  [
                    t("label.segment"),
                    translateDataValue(t, "segment", c.segment),
                  ],
                  [t("label.branch"), c.primaryBranch],
                  [
                    t("label.type"),
                    translateDataValue(t, "customerType", c.customerType),
                  ],
                  [
                    t("label.accounts"),
                    formatNumber(c.accountCount, { locale }),
                  ],
                  [t("label.age"), formatNumber(c.age, { locale })],
                  [t("label.tenure"), c.tenure],
                  [t("label.kyc"), translateDataValue(t, "kyc", c.kyc)],
                  [
                    t("label.gender"),
                    translateDataValue(t, "gender", c.gender),
                  ],
                  [
                    t("label.nationality"),
                    translateDataValue(t, "nationality", c.nationality),
                  ],
                ] as [string, string | number][]
              ).map(([label, val]) => (
                <div
                  key={label}
                  className="rounded-md border border-border bg-muted/20 p-2"
                >
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    {label}
                  </p>
                  <p className="text-xs font-medium text-card-foreground">
                    {val}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Linked Accounts with pagination */}
      <ChartCard
        title={t("c360.linkedAccounts")}
        subtitle={t("c360.linkedAccounts.sub")}
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs">{t("c360.accountNo")}</TableHead>
              <TableHead className="text-xs">{t("c360.class")}</TableHead>
              <TableHead className="text-xs">{t("c360.status")}</TableHead>
              <TableHead className="text-xs text-right">
                {t("c360.balance")}
              </TableHead>
              <TableHead className="text-xs text-right">
                {t("c360.creditScore")}
              </TableHead>
              <TableHead className="text-xs text-right">
                {t("c360.riskScore")}
              </TableHead>
              <TableHead className="text-xs text-right">
                {t("c360.recency")}
              </TableHead>
              <TableHead className="text-xs">{t("c360.accountAge")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedAccounts.map((acc) => (
              <TableRow
                key={acc.id}
                onClick={() => setSelectedAccount(acc.id)}
                className={`cursor-pointer transition-colors ${acc.id === selectedAccount ? "bg-primary/10 ring-1 ring-primary/20" : "hover:bg-muted/50"}`}
              >
                <TableCell className="text-sm font-mono">
                  {acc.number}
                </TableCell>
                <TableCell className="text-sm">
                  {translateDataValue(t, "accountClass", acc.class)}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={acc.status === "Open" ? "default" : "secondary"}
                    className={`text-[10px] ${acc.status === "Open" ? "bg-success text-success-foreground" : ""}`}
                  >
                    {translateDataValue(t, "status", acc.status)}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-right font-medium">
                  {formatCurrencyLYD(acc.balance, { locale })}
                </TableCell>
                <TableCell className="text-sm text-right">
                  {formatNumber(acc.creditScore, { locale })}
                </TableCell>
                <TableCell className="text-sm text-right">
                  <span
                    className={
                      acc.riskScore > 60
                        ? "text-destructive font-medium"
                        : "text-success font-medium"
                    }
                  >
                    {formatNumber(acc.riskScore, { locale })}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-right">
                  {formatNumber(acc.recencyDays, { locale })}
                </TableCell>
                <TableCell className="text-sm">{acc.accountAge}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {totalPages > 1 && (
          <div className="mt-4 border-t border-border pt-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-muted-foreground">
                {t("c360.page")} {formatNumber(accountPage + 1, { locale })}{" "}
                {t("c360.of")} {formatNumber(totalPages, { locale })}
              </p>
              <Pagination className="mx-0 w-full justify-start sm:w-auto sm:justify-end">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      size="default"
                      className={
                        accountPage === 0
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                      onClick={(event) => {
                        event.preventDefault();
                        if (accountPage > 0) setAccountPage((page) => page - 1);
                      }}
                    >
                      <ChevronLeft
                        className={`h-4 w-4 ${isRTL ? "rotate-180" : ""}`}
                      />
                      <span>{t("c360.previous")}</span>
                    </PaginationLink>
                  </PaginationItem>
                  {pageNumbers.map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        isActive={accountPage === page}
                        onClick={(event) => {
                          event.preventDefault();
                          setAccountPage(page);
                        }}
                      >
                        {formatNumber(page + 1, { locale })}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      size="default"
                      className={
                        accountPage >= totalPages - 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                      onClick={(event) => {
                        event.preventDefault();
                        if (accountPage < totalPages - 1)
                          setAccountPage((page) => page + 1);
                      }}
                    >
                      <span>{t("c360.next")}</span>
                      <ChevronRight
                        className={`h-4 w-4 ${isRTL ? "rotate-180" : ""}`}
                      />
                    </PaginationLink>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        )}
      </ChartCard>

      {/* Selected account indicator */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <div
          className={`h-2 w-2 rounded-full ${activeAcc ? "bg-primary animate-pulse" : "bg-chart-2"}`}
        />
        {activeAcc ? (
          <>
            {t("c360.showingData", { account: activeAcc.number })}{" "}
            <span className="text-foreground">
              ({translateDataValue(t, "accountClass", activeAcc.class)})
            </span>
          </>
        ) : (
          <span>{t("c360.customerLevelData")}</span>
        )}
        {activeAcc && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-[11px]"
            onClick={() => setSelectedAccount(null)}
          >
            {t("c360.viewCustomerLevel")}
          </Button>
        )}
      </div>

      {/* 3. Financial KPIs — replaced Avg Daily TRN & Min Sub Revenue with ADB & Recency */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title={t("c360.totalRevenue")}
          value={formatCurrencyLYD(fin.totalRevenue, { locale })}
          subtitle={t("c360.commission")}
        />
        <KPICard
          title={t("c360.trnVolume")}
          value={formatNumber(fin.trnVolume, { locale })}
          subtitle={t("c360.totalTrn")}
        />
        <KPICard
          title={t("c360.adb")}
          value={formatCurrencyLYD(fin.adb || 0, { locale })}
          subtitle={t("c360.avgDailyBalance")}
        />
        <KPICard
          title={t("c360.recencyDays")}
          value={formatNumber(fin.recencyDays || 0, { locale })}
          subtitle={t("c360.daysSinceLastTrn")}
        />
      </div>

      {/* Trend charts */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <ChartCard title={t("c360.revenueTrend")}>
          <div className="h-64">
            <AppAreaChart
              data={orderedMonthlyRev}
              categoryKey="month"
              valueAxes={[
                {
                  id: "left",
                  width: 52,
                  format: {
                    kind: "currency",
                    compact: true,
                    maximumFractionDigits: 1,
                  },
                },
                {
                  id: "right",
                  orientation: "right",
                  width: 44,
                  format: {
                    kind: "number",
                  },
                },
              ]}
              tooltipValueFormatter={(value, seriesName) =>
                seriesName === t("c360.revenue")
                  ? formatCurrencyLYD(Number(value), {
                      locale,
                      compact: true,
                      maximumFractionDigits: 1,
                    })
                  : formatNumber(Number(value), { locale })
              }
              areas={[
                {
                  dataKey: "revenue",
                  label: t("c360.revenue"),
                  color: "hsl(var(--chart-1))",
                  yAxisId: "left",
                  strokeWidth: 2,
                },
                {
                  dataKey: "volume",
                  label: t("c360.frequency"),
                  color: "hsl(var(--chart-2))",
                  yAxisId: "right",
                  strokeWidth: 2,
                  fillOpacity: 0.18,
                  gradientOpacity: { from: 0.4, to: 0.04 },
                },
              ]}
            />
          </div>
        </ChartCard>

        <ChartCard title={t("c360.incomeDebit")}>
          <div className="h-64">
            <AppAreaChart
              data={orderedIncomeDebit}
              categoryKey="month"
              valueAxes={[
                {
                  width: 54,
                  format: {
                    kind: "currency",
                    compact: true,
                    maximumFractionDigits: 1,
                  },
                },
              ]}
              tooltipValueFormatter={(value) =>
                formatCurrencyLYD(Number(value), {
                  locale,
                  compact: true,
                  maximumFractionDigits: 1,
                })
              }
              areas={[
                {
                  dataKey: "income",
                  label: t("c360.income"),
                  color: "hsl(var(--chart-2))",
                  strokeWidth: 2,
                },
                {
                  dataKey: "debit",
                  label: t("c360.debit"),
                  color: "hsl(var(--chart-6))",
                  strokeWidth: 2,
                  fillOpacity: 0.2,
                  gradientOpacity: { from: 0.45, to: 0.05 },
                },
              ]}
            />
          </div>
        </ChartCard>
      </div>

      {/* Salary + Top TRN Codes */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <ChartCard title={t("c360.salaryInfo")} className="h-full">
          {activeAcc ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-md border border-border bg-muted/20 p-3">
                  <p className="text-xs text-muted-foreground">
                    {t("c360.receivesSalary")}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    {salaryDetails.receivesSalary ? (
                      <CheckCircle className="h-4 w-4 text-success" />
                    ) : (
                      <XCircle className="h-4 w-4 text-destructive" />
                    )}
                    <span className="text-sm font-medium text-card-foreground">
                      {salaryDetails.receivesSalary
                        ? t("label.yes")
                        : t("label.no")}
                    </span>
                  </div>
                </div>
                <div className="rounded-md border border-border bg-muted/20 p-3">
                  <p className="text-xs text-muted-foreground">
                    {t("c360.avgMonthlySalary")}
                  </p>
                  <p className="mt-2 text-lg font-semibold text-card-foreground">
                    {formatCurrencyLYD(salaryDetails.avgMonthlySalary, {
                      locale,
                    })}
                  </p>
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs text-muted-foreground">
                  {t("c360.consistency")}
                </p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6">
                  {salaryConsistencyLabels.map((label, index) => {
                    const isConsistent =
                      salaryDetails.consistency[index] || false;
                    return (
                      <div
                        key={label}
                        className="rounded-md border border-border bg-muted/20 p-2 text-center"
                      >
                        <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                          {label}
                        </p>
                        <p
                          className={`mt-1 text-sm font-semibold ${isConsistent ? "text-success" : "text-destructive"}`}
                        >
                          {isConsistent ? "✓" : "✗"}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-md border border-border bg-muted/20 p-4">
                <p className="text-xs text-muted-foreground">
                  {t("c360.accountsReceivingSalary")}
                </p>
                <p className="mt-2 text-2xl font-semibold text-card-foreground">
                  {formatNumber(c.salary.salaryReceivingAccounts, { locale })}
                  <span className="ml-2 text-sm font-medium text-muted-foreground">
                    / {formatNumber(c.accounts.length, { locale })}
                  </span>
                </p>
              </div>
              <div className="rounded-md border border-border bg-muted/20 p-4">
                <p className="text-xs text-muted-foreground">
                  {t("c360.avgAcrossAccounts")}
                </p>
                <p className="mt-2 text-2xl font-semibold text-card-foreground">
                  {formatCurrencyLYD(c.salary.averageAcrossAccounts, {
                    locale,
                  })}
                </p>
              </div>
            </div>
          )}
        </ChartCard>

        <ChartCard
          title={t("c360.topTrnCodes")}
          className="h-full"
          actions={
            <div className="inline-flex rounded-md border border-border bg-muted/30 p-1">
              <Button
                variant={topTrnMetric === "revenue" ? "secondary" : "ghost"}
                size="sm"
                className="h-7 px-3 text-xs"
                onClick={() => setTopTrnMetric("revenue")}
              >
                {t("c360.revenue")}
              </Button>
              <Button
                variant={topTrnMetric === "frequency" ? "secondary" : "ghost"}
                size="sm"
                className="h-7 px-3 text-xs"
                onClick={() => setTopTrnMetric("frequency")}
              >
                {t("c360.frequency")}
              </Button>
            </div>
          }
        >
          <div className="space-y-3">
            {trnMetricData.map((item) => (
              <div key={item.code} className="flex items-center gap-3">
                <span className="w-24 shrink-0 truncate font-mono text-xs text-foreground">
                  {item.code}
                </span>
                <Progress
                  value={
                    trnMetricMax > 0
                      ? (item[topTrnMetric] / trnMetricMax) * 100
                      : 0
                  }
                  className="h-2 flex-1"
                />
                <span className="w-16 shrink-0 text-right text-xs text-muted-foreground">
                  {topTrnMetric === "revenue"
                    ? formatCurrencyLYD(item.revenue, {
                        locale,
                        compact: true,
                        maximumFractionDigits: 1,
                      })
                    : formatNumber(item.frequency, { locale })}
                </span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Channel Utilization */}
      <ChartCard
        title={t("c360.channelUtil")}
        subtitle={t("c360.volValueChannel")}
      >
        <div className="h-48">
          <AppBarChart
            data={localizedChannelData}
            categoryKey="name"
            valueAxes={[
              {
                id: "left",
                width: 40,
                tickFormatter: (value) =>
                  formatNumber(value, {
                    locale,
                    compact: true,
                    maximumFractionDigits: 1,
                  }),
              },
              {
                id: "right",
                orientation: "right",
                width: 52,
                tickFormatter: (value) =>
                  formatCurrencyLYD(value * 1000, {
                    locale,
                    compact: true,
                    maximumFractionDigits: 1,
                  }),
              },
            ]}
            tooltipValueFormatter={(value, seriesName) =>
              seriesName === t("label.value")
                ? formatCurrencyLYD(Number(value) * 1000, {
                    locale,
                    compact: true,
                    maximumFractionDigits: 1,
                  })
                : formatNumber(Number(value), { locale })
            }
            bars={[
              {
                dataKey: "volume",
                label: t("label.volume"),
                color: "hsl(var(--chart-1))",
                yAxisId: "left",
              },
              {
                dataKey: "value",
                label: t("label.value"),
                color: "hsl(var(--chart-2))",
                yAxisId: "right",
              },
            ]}
          />
        </div>
      </ChartCard>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 xl:items-start">
        {/* Subscriptions & Card Management merged */}
        <ChartCard title={t("c360.subsAndCards")} className="h-full">
          <div className="max-h-[22rem] overflow-y-auto pr-1">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Subscriptions */}
              <div className="h-32 rounded-md border border-border p-3">
                <p className="text-xs font-medium text-muted-foreground">
                  {t("c360.mobileApp")}
                </p>
                <Badge
                  className={`mt-1 text-[10px] ${c.subscriptions.mobileApp.status === "Active" ? "bg-success text-success-foreground" : ""}`}
                >
                  {translateDataValue(
                    t,
                    "status",
                    c.subscriptions.mobileApp.status,
                  )}
                </Badge>
                <p className="mt-3 text-xs text-muted-foreground">
                  {t("c360.loginFreq")}:{" "}
                  {formatNumber(c.subscriptions.mobileApp.loginFreq, {
                    locale,
                  })}
                  /{t("global.perMonth")}
                </p>
              </div>
              <div className="h-32 rounded-md border border-border p-3">
                <p className="text-xs font-medium text-muted-foreground">
                  {t("c360.whatsapp")}
                </p>
                <Badge
                  className={`mt-1 text-[10px] ${c.subscriptions.whatsapp.optIn ? "bg-success text-success-foreground" : ""}`}
                >
                  {c.subscriptions.whatsapp.optIn
                    ? t("c360.optedIn")
                    : t("c360.notOpted")}
                </Badge>
                <p className="mt-3 text-xs text-muted-foreground">
                  {t("c360.interactions")}:{" "}
                  {formatNumber(c.subscriptions.whatsapp.interactions, {
                    locale,
                  })}
                </p>
              </div>
              <div className="h-32 rounded-md border border-border p-3">
                <p className="text-xs font-medium text-muted-foreground">
                  {t("c360.smsAlerts")}
                </p>
                <Badge variant="secondary" className="mt-1 text-[10px]">
                  {translateDataValue(
                    t,
                    "status",
                    c.subscriptions.smsAlerts.tier,
                  )}
                </Badge>
                <p className="mt-3 text-xs text-muted-foreground">
                  {formatCurrencyLYD(c.subscriptions.smsAlerts.price, {
                    locale,
                  })}
                  /{t("global.perMonth")}
                </p>
              </div>
              {/* Cards */}
              {c.cards.map((card) => (
                <div
                  key={card.type}
                  className="h-32 rounded-md border border-border p-3"
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="text-xs font-medium text-card-foreground">
                      {card.type}
                    </span>
                    <Badge
                      className={`text-[10px] ${card.status === "Active" ? "bg-success text-success-foreground" : ""}`}
                    >
                      {translateDataValue(t, "status", card.status)}
                    </Badge>
                  </div>
                  {card.limit > 0 && (
                    <>
                      <p className="text-[10px] text-muted-foreground">
                        {t("label.limit")}:{" "}
                        {formatCurrencyLYD(card.limit, {
                          locale,
                          compact: true,
                          maximumFractionDigits: 0,
                        })}
                      </p>
                      <div className="mt-2">
                        <div className="mb-1 flex justify-between text-[10px]">
                          <span className="text-muted-foreground">
                            {t("label.utilization")}
                          </span>
                          <span>
                            {formatNumber(card.utilization, { locale })}%
                          </span>
                        </div>
                        <Progress value={card.utilization} className="h-1.5" />
                      </div>
                    </>
                  )}
                  <div className="mt-2 flex items-center gap-1">
                    {new Date(card.expiry) < new Date("2026-01-01") && (
                      <AlertTriangle className="h-3 w-3 text-warning" />
                    )}
                    <p className="text-[10px] text-muted-foreground">
                      {t("label.expires")}: {card.expiry}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>

        {/* Behavioral Change */}
        <ChartCard
          title={t("c360.behavioralChange")}
          subtitle={t("c360.quarterlyRisk")}
          className="h-full"
        >
          <div className="h-[22rem]">
            <AppAreaChart
              data={c.risk.behaviorChange}
              categoryKey="period"
              valueAxes={[
                {
                  width: 42,
                  domain: [60, 80],
                },
              ]}
              tooltipValueFormatter={(value) =>
                formatNumber(Number(value), { locale })
              }
              areas={[
                {
                  dataKey: "score",
                  label: t("c360.behavioralChange"),
                  color: "hsl(var(--chart-3))",
                  strokeWidth: 2,
                  fillOpacity: 0.24,
                  gradientOpacity: { from: 0.55, to: 0.06 },
                },
              ]}
            />
          </div>
        </ChartCard>
      </div>

      {/* Loans Status — merged table */}
      <ChartCard title={t("c360.loansStatus")}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs">{t("c360.loanId")}</TableHead>
              {!activeAcc && (
                <TableHead className="text-xs">{t("c360.accountNo")}</TableHead>
              )}
              <TableHead className="text-xs">{t("c360.type")}</TableHead>
              {!activeAcc && (
                <TableHead className="text-xs">
                  {t("c360.loanStatus")}
                </TableHead>
              )}
              <TableHead className="text-xs">{t("c360.behavior")}</TableHead>
              <TableHead className="text-xs text-right">
                {t("c360.outstanding")}
              </TableHead>
              <TableHead className="text-xs text-right">
                {t("c360.paid")}
              </TableHead>
              <TableHead className="text-xs text-right">
                {t("c360.installment")}
              </TableHead>
              <TableHead className="text-xs">{t("c360.nextPayment")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleLoans.length > 0 ? (
              visibleLoans.map((l) => (
                <TableRow key={l.id}>
                  <TableCell className="text-sm font-mono">{l.id}</TableCell>
                  {!activeAcc && (
                    <TableCell>
                      <div className="text-sm font-mono">{l.accountNo}</div>
                      <div className="text-[10px] text-muted-foreground">
                        {translateDataValue(t, "accountClass", l.accountClass)}
                      </div>
                    </TableCell>
                  )}
                  <TableCell className="text-sm">
                    {translateDataValue(t, "loanType", l.type)}
                  </TableCell>
                  {!activeAcc && (
                    <TableCell>
                      <Badge
                        className={`text-[10px] ${l.loanStatus === "Active" ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"}`}
                      >
                        {l.loanStatus === "Active"
                          ? t("c360.active")
                          : t("c360.closed")}
                      </Badge>
                    </TableCell>
                  )}
                  <TableCell className="text-sm">
                    {l.loanStatus === "Closed" ? (
                      <span
                        className={
                          l.behavior.includes("Delayed")
                            ? "text-warning font-medium"
                            : "text-success font-medium"
                        }
                      >
                        {l.behavior.includes("Delayed")
                          ? t("c360.delayed")
                          : t("c360.onTime")}
                      </span>
                    ) : (
                      t("global.notAvailable")
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-right">
                    {l.outstanding > 0
                      ? formatCurrencyLYD(l.outstanding, {
                          locale,
                          compact: true,
                          maximumFractionDigits: 1,
                        })
                      : t("global.notAvailable")}
                  </TableCell>
                  <TableCell className="text-sm text-right">
                    {formatCurrencyLYD(l.paid, {
                      locale,
                      compact: true,
                      maximumFractionDigits: 1,
                    })}
                  </TableCell>
                  <TableCell className="text-sm text-right">
                    {l.installment > 0
                      ? formatCurrencyLYD(l.installment, { locale })
                      : t("global.notAvailable")}
                  </TableCell>
                  <TableCell className="text-sm">{l.nextPayment}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={loanTableColumns}
                  className="py-6 text-center text-sm text-muted-foreground"
                >
                  {t("c360.noLoansForSelection")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </ChartCard>
    </div>
  );
};

export default Customer360Page;
