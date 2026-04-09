import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, CheckCircle, XCircle, AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import KPICard from "@/components/dashboard/KPICard";
import ChartCard from "@/components/dashboard/ChartCard";
import AppBarChart from "@/components/charts/AppBarChart";
import { sampleCustomer, accountFinancials, accountMonthlyRevenue, accountIncomeDebit, topTrnCodes } from "@/lib/mockData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis } from "recharts";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatCurrencyLYD, formatNumber } from "@/lib/formatters";
import { translateDataValue, translateMonthLabel } from "@/lib/i18n";

const ACCOUNTS_PER_PAGE = 4;

const Customer360Page = () => {
  const navigate = useNavigate();
  const { isRTL, locale, t } = useLanguage();
  const c = sampleCustomer;
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [accountPage, setAccountPage] = useState(0);
  const activeAcc = selectedAccount ? c.accounts.find((a) => a.id === selectedAccount) : null;

  const fin = selectedAccount ? accountFinancials[selectedAccount] || c.financials : c.financials;
  const monthlyRev = selectedAccount ? accountMonthlyRevenue[selectedAccount] || c.monthlyRevenue : c.monthlyRevenue;
  const customerIncomeDebit = useMemo(() => {
    const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthMap = new Map<string, { month: string; income: number; debit: number }>();

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

    return monthOrder.map((month) => monthMap.get(month) || { month, income: 0, debit: 0 });
  }, [c.accounts]);
  const incomeDebit = selectedAccount ? accountIncomeDebit[selectedAccount] || [] : customerIncomeDebit;
  const openAccounts = c.accounts.filter((acc) => acc.status === "Open").length;
  const closedAccounts = c.accounts.length - openAccounts;

  const totalPages = Math.ceil(c.accounts.length / ACCOUNTS_PER_PAGE);
  const paginatedAccounts = c.accounts.slice(accountPage * ACCOUNTS_PER_PAGE, (accountPage + 1) * ACCOUNTS_PER_PAGE);

  // Sort top products by frequency then revenue
  const productsByFreq = [...c.topProducts].sort((a, b) => b.usage - a.usage || b.revenue - a.revenue);
  const productsByRev = [...c.topProducts].sort((a, b) => b.revenue - a.revenue || b.usage - a.usage);
  const trnByFreq = [...topTrnCodes].sort((a, b) => b.frequency - a.frequency || b.revenue - a.revenue);
  const trnByRev = [...topTrnCodes].sort((a, b) => b.revenue - a.revenue || b.frequency - a.frequency);
  const localizedMonthlyRev = monthlyRev.map((point) => ({
    ...point,
    month: translateMonthLabel(t, point.month),
  }));
  const localizedIncomeDebit = incomeDebit.map((point) => ({
    ...point,
    month: translateMonthLabel(t, point.month),
  }));
  const localizedProductsByFreq = productsByFreq.map((item) => ({
    ...item,
    name: translateDataValue(t, "product", item.name),
  }));
  const localizedProductsByRev = productsByRev.map((item) => ({
    ...item,
    name: translateDataValue(t, "product", item.name),
  }));
  const localizedChannelData = [
    { name: t("data.channel.onepay"), volume: c.channels.onepay.volume, value: c.channels.onepay.value / 1000 },
    { name: t("data.channel.lypay"), volume: c.channels.lypay.volume, value: c.channels.lypay.value / 1000 },
    { name: t("data.channel.mobicash"), volume: c.channels.mobicash.volume, value: c.channels.mobicash.value / 1000 },
    { name: t("data.channel.sms"), volume: c.channels.sms.volume, value: 0 },
  ];

  // Merged loans table
  const allLoans = [
    ...c.loans.active.map((l, index) => {
      const linkedAccount = c.accounts[index % c.accounts.length];
      return {
        ...l,
        accountNo: linkedAccount.number,
        accountClass: linkedAccount.class,
        loanStatus: "Active" as const,
        behavior: "—",
        paid: l.outstanding * 0.3,
        installment: Math.round(l.outstanding / 60),
        nextPayment: "2025-05-01",
      };
    }),
    ...c.loans.closed.map((l, index) => {
      const linkedAccount = c.accounts[(index + c.loans.active.length) % c.accounts.length];
      return {
        id: l.id,
        type: l.type,
        accountNo: linkedAccount.number,
        accountClass: linkedAccount.class,
        outstanding: 0,
        rate: 0,
        maturity: "—",
        loanStatus: "Closed" as const,
        behavior: l.behavior,
        paid: l.amount,
        installment: 0,
        nextPayment: "—",
      };
    }),
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate("/customer-360")}>
          <ArrowLeft className={`h-4 w-4 ${isRTL ? "rotate-180" : ""}`} />
        </Button>
        <div>
          <h2 className="text-lg font-semibold text-foreground">{t("c360.title")}</h2>
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
              <Badge className="bg-success text-success-foreground text-[10px]">
                {t("c360.openAccounts", { count: formatNumber(openAccounts, { locale }) })}
              </Badge>
              <Badge variant="secondary" className="text-[10px]">
                {t("c360.closedAccounts", { count: formatNumber(closedAccounts, { locale }) })}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{c.id}</p>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
              {([
                [t("label.segment"), translateDataValue(t, "segment", c.segment)],
                [t("label.branch"), c.primaryBranch],
                [t("label.type"), translateDataValue(t, "customerType", c.customerType)],
                [t("label.accounts"), formatNumber(c.accountCount, { locale })],
                [t("label.age"), formatNumber(c.age, { locale })],
                [t("label.tenure"), c.tenure],
                [t("label.kyc"), translateDataValue(t, "kyc", c.kyc)],
                [t("label.gender"), translateDataValue(t, "gender", c.gender)],
                [t("label.nationality"), translateDataValue(t, "nationality", c.nationality)],
              ] as [string, string | number][]).map(([label, val]) => (
                <div key={label} className="rounded-md border border-border bg-muted/20 p-2">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
                  <p className="text-xs font-medium text-card-foreground">{val}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Linked Accounts with pagination */}
      <ChartCard title={t("c360.linkedAccounts")} subtitle={t("c360.linkedAccounts.sub")}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs">{t("c360.accountNo")}</TableHead>
              <TableHead className="text-xs">{t("c360.class")}</TableHead>
              <TableHead className="text-xs">{t("c360.status")}</TableHead>
              <TableHead className="text-xs text-right">{t("c360.balance")}</TableHead>
              <TableHead className="text-xs text-right">{t("c360.creditScore")}</TableHead>
              <TableHead className="text-xs text-right">{t("c360.riskScore")}</TableHead>
              <TableHead className="text-xs text-right">{t("c360.recency")}</TableHead>
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
                <TableCell className="text-sm font-mono">{acc.number}</TableCell>
                <TableCell className="text-sm">{translateDataValue(t, "accountClass", acc.class)}</TableCell>
                <TableCell>
                  <Badge variant={acc.status === "Open" ? "default" : "secondary"} className={`text-[10px] ${acc.status === "Open" ? "bg-success text-success-foreground" : ""}`}>
                    {translateDataValue(t, "status", acc.status)}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-right font-medium">{formatCurrencyLYD(acc.balance, { locale })}</TableCell>
                <TableCell className="text-sm text-right">{formatNumber(acc.creditScore, { locale })}</TableCell>
                <TableCell className="text-sm text-right">
                  <span className={acc.riskScore > 60 ? "text-destructive font-medium" : "text-success font-medium"}>{formatNumber(acc.riskScore, { locale })}</span>
                </TableCell>
                <TableCell className="text-sm text-right">{formatNumber(acc.recencyDays, { locale })}</TableCell>
                <TableCell className="text-sm">{acc.accountAge}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
            <p className="text-xs text-muted-foreground">{t("c360.page")} {formatNumber(accountPage + 1, { locale })} {t("c360.of")} {formatNumber(totalPages, { locale })}</p>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" className="h-7 text-xs" disabled={accountPage === 0} onClick={() => setAccountPage((p) => p - 1)}>
                <ChevronLeft className={`h-3 w-3 ${isRTL ? "ml-1 rotate-180" : "mr-1"}`} />{t("c360.previous")}
              </Button>
              <Button variant="outline" size="sm" className="h-7 text-xs" disabled={accountPage >= totalPages - 1} onClick={() => setAccountPage((p) => p + 1)}>
                {t("c360.next")}<ChevronRight className={`h-3 w-3 ${isRTL ? "mr-1 rotate-180" : "ml-1"}`} />
              </Button>
            </div>
          </div>
        )}
      </ChartCard>

      {/* Selected account indicator */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <div className={`h-2 w-2 rounded-full ${activeAcc ? "bg-primary animate-pulse" : "bg-chart-2"}`} />
        {activeAcc ? (
          <>
            {t("c360.showingData", { account: activeAcc.number })} <span className="text-foreground">({translateDataValue(t, "accountClass", activeAcc.class)})</span>
          </>
        ) : (
          <span>{t("c360.customerLevelData")}</span>
        )}
        {activeAcc && (
          <Button variant="ghost" size="sm" className="h-6 px-2 text-[11px]" onClick={() => setSelectedAccount(null)}>
            {t("c360.viewCustomerLevel")}
          </Button>
        )}
      </div>

      {/* 3. Financial KPIs — replaced Avg Daily TRN & Min Sub Revenue with ADB & Recency */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard title={t("c360.totalRevenue")} value={formatCurrencyLYD(fin.totalRevenue, { locale })} subtitle={t("c360.commission")} />
        <KPICard title={t("c360.trnVolume")} value={formatNumber(fin.trnVolume, { locale })} subtitle={t("c360.totalTrn")} />
        <KPICard title={t("c360.adb")} value={formatCurrencyLYD(fin.adb || 0, { locale })} subtitle={t("c360.avgDailyBalance")} />
        <KPICard title={t("c360.recencyDays")} value={formatNumber(fin.recencyDays || 0, { locale })} subtitle={t("c360.daysSinceLastTrn")} />
      </div>

      {/* Salary + Revenue/Frequency Trend + Income/Debit Trend */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard title={t("c360.salaryInfo")}>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              {c.salary.receivesSalary ? <CheckCircle className="h-4 w-4 text-success" /> : <XCircle className="h-4 w-4 text-destructive" />}
              <span className="text-sm">{t("c360.receivesSalary")}: {c.salary.receivesSalary ? t("label.yes") : t("label.no")}</span>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t("c360.avgMonthlySalary")}</p>
              <p className="text-lg font-semibold text-card-foreground">{formatCurrencyLYD(c.salary.avgMonthlySalary, { locale })}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">{t("c360.consistency")}</p>
              <div className="flex gap-1">
                {c.salary.consistency.map((ok, i) => (
                  <div key={i} className={`h-6 w-8 rounded text-[10px] flex items-center justify-center font-medium ${ok ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"}`}>
                    {ok ? "✓" : "✗"}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ChartCard>

        <ChartCard title={t("c360.revenueTrend")}>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={localizedMonthlyRev}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 10 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={{ r: 3 }} name={t("c360.revenue")} />
                <Line yAxisId="right" type="monotone" dataKey="volume" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={{ r: 3 }} name={t("c360.frequency")} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title={t("c360.incomeDebit")}>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={localizedIncomeDebit}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                <Line type="monotone" dataKey="income" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={{ r: 3 }} name={t("c360.income")} />
                <Line type="monotone" dataKey="debit" stroke="hsl(var(--chart-6))" strokeWidth={2} dot={{ r: 3 }} name={t("c360.debit")} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* 4. Top Products (freq + rev) & Top TRN Codes (freq + rev) */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title={t("c360.topProductsFreq")}>
          <div className="space-y-2">
            {localizedProductsByFreq.map((p) => (
              <div key={p.name} className="flex items-center gap-3">
                <span className="w-28 text-xs text-foreground truncate">{p.name}</span>
                <Progress value={p.usage} className="h-1.5 flex-1" />
                <span className="text-xs text-muted-foreground w-10 text-right">{formatNumber(p.usage, { locale })}</span>
              </div>
            ))}
          </div>
        </ChartCard>
        <ChartCard title={t("c360.topProductsRev")}>
          <div className="space-y-2">
            {localizedProductsByRev.map((p) => (
              <div key={p.name} className="flex items-center gap-3">
                <span className="w-28 text-xs text-foreground truncate">{p.name}</span>
                <Progress value={(p.revenue / localizedProductsByRev[0].revenue) * 100} className="h-1.5 flex-1" />
                <span className="text-xs text-muted-foreground w-16 text-right">{formatCurrencyLYD(p.revenue, { locale, compact: true, maximumFractionDigits: 1 })}</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title={t("c360.topTrnCodeFreq")}>
          <div className="space-y-2">
            {trnByFreq.map((t2) => (
              <div key={t2.code} className="flex items-center gap-3">
                <span className="w-28 text-xs text-foreground truncate font-mono">{t2.code}</span>
                <Progress value={(t2.frequency / trnByFreq[0].frequency) * 100} className="h-1.5 flex-1" />
                <span className="text-xs text-muted-foreground w-10 text-right">{formatNumber(t2.frequency, { locale })}</span>
              </div>
            ))}
          </div>
        </ChartCard>
        <ChartCard title={t("c360.topTrnCodeRev")}>
          <div className="space-y-2">
            {trnByRev.map((t2) => (
              <div key={t2.code} className="flex items-center gap-3">
                <span className="w-28 text-xs text-foreground truncate font-mono">{t2.code}</span>
                <Progress value={(t2.revenue / trnByRev[0].revenue) * 100} className="h-1.5 flex-1" />
                <span className="text-xs text-muted-foreground w-16 text-right">{formatCurrencyLYD(t2.revenue, { locale, compact: true, maximumFractionDigits: 1 })}</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Channel Utilization */}
      <ChartCard title={t("c360.channelUtil")} subtitle={t("c360.volValueChannel")}>
        <div className="h-48">
          <AppBarChart
            data={localizedChannelData}
            categoryKey="name"
            valueAxes={[
              {
                id: "left",
                width: 40,
                tickFormatter: (value) => formatNumber(value, { locale, compact: true, maximumFractionDigits: 1 }),
              },
              {
                id: "right",
                orientation: "right",
                width: 52,
                tickFormatter: (value) => formatCurrencyLYD(value * 1000, { locale, compact: true, maximumFractionDigits: 1 }),
              },
            ]}
            tooltipValueFormatter={(value, seriesName) =>
              seriesName === t("label.value")
                ? formatCurrencyLYD(Number(value) * 1000, { locale, compact: true, maximumFractionDigits: 1 })
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

      {/* Subscriptions & Card Management merged */}
      <ChartCard title={t("c360.subsAndCards")}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Subscriptions */}
          <div className="rounded-md border border-border p-3">
            <p className="text-xs font-medium text-muted-foreground">{t("c360.mobileApp")}</p>
            <Badge className={`mt-1 text-[10px] ${c.subscriptions.mobileApp.status === "Active" ? "bg-success text-success-foreground" : ""}`}>{translateDataValue(t, "status", c.subscriptions.mobileApp.status)}</Badge>
            <p className="mt-2 text-xs text-muted-foreground">{t("c360.loginFreq")}: {formatNumber(c.subscriptions.mobileApp.loginFreq, { locale })}/{t("global.perMonth")}</p>
          </div>
          <div className="rounded-md border border-border p-3">
            <p className="text-xs font-medium text-muted-foreground">{t("c360.whatsapp")}</p>
            <Badge className={`mt-1 text-[10px] ${c.subscriptions.whatsapp.optIn ? "bg-success text-success-foreground" : ""}`}>{c.subscriptions.whatsapp.optIn ? t("c360.optedIn") : t("c360.notOpted")}</Badge>
            <p className="mt-2 text-xs text-muted-foreground">{t("c360.interactions")}: {c.subscriptions.whatsapp.interactions}</p>
          </div>
          <div className="rounded-md border border-border p-3">
            <p className="text-xs font-medium text-muted-foreground">{t("c360.smsAlerts")}</p>
            <Badge variant="secondary" className="mt-1 text-[10px]">{translateDataValue(t, "status", c.subscriptions.smsAlerts.tier)}</Badge>
            <p className="mt-2 text-xs text-muted-foreground">{formatCurrencyLYD(c.subscriptions.smsAlerts.price, { locale })}/{t("global.perMonth")}</p>
          </div>
          {/* Cards */}
          {c.cards.map((card) => (
            <div key={card.type} className="rounded-md border border-border p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-card-foreground">{card.type}</span>
                <Badge className={`text-[10px] ${card.status === "Active" ? "bg-success text-success-foreground" : ""}`}>{translateDataValue(t, "status", card.status)}</Badge>
              </div>
              {card.limit > 0 && (
                <>
                  <p className="text-[10px] text-muted-foreground">{t("label.limit")}: {formatCurrencyLYD(card.limit, { locale, compact: true, maximumFractionDigits: 0 })}</p>
                  <div className="mt-1">
                    <div className="flex justify-between text-[10px] mb-0.5"><span className="text-muted-foreground">{t("label.utilization")}</span><span>{card.utilization}%</span></div>
                    <Progress value={card.utilization} className="h-1.5" />
                  </div>
                </>
              )}
              <div className="mt-1 flex items-center gap-1">
                {new Date(card.expiry) < new Date("2026-01-01") && <AlertTriangle className="h-3 w-3 text-warning" />}
                <p className="text-[10px] text-muted-foreground">{t("label.expires")}: {card.expiry}</p>
              </div>
            </div>
          ))}
        </div>
      </ChartCard>

      {/* Behavioral Change */}
      <ChartCard title={t("c360.behavioralChange")} subtitle={t("c360.quarterlyRisk")}>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={c.risk.behaviorChange}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="period" tick={{ fontSize: 10 }} />
              <YAxis domain={[60, 80]} tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
              <Line type="monotone" dataKey="score" stroke="hsl(var(--chart-3))" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Loans Status — merged table */}
      <ChartCard title={t("c360.loansStatus")}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs">{t("c360.loanId")}</TableHead>
              <TableHead className="text-xs">{t("c360.accountNo")}</TableHead>
              <TableHead className="text-xs">{t("c360.type")}</TableHead>
              <TableHead className="text-xs">{t("c360.loanStatus")}</TableHead>
              <TableHead className="text-xs">{t("c360.behavior")}</TableHead>
              <TableHead className="text-xs text-right">{t("c360.outstanding")}</TableHead>
              <TableHead className="text-xs text-right">{t("c360.paid")}</TableHead>
              <TableHead className="text-xs text-right">{t("c360.installment")}</TableHead>
              <TableHead className="text-xs">{t("c360.nextPayment")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allLoans.map((l) => (
              <TableRow key={l.id}>
                <TableCell className="text-sm font-mono">{l.id}</TableCell>
                <TableCell>
                  <div className="text-sm font-mono">{l.accountNo}</div>
                  <div className="text-[10px] text-muted-foreground">{translateDataValue(t, "accountClass", l.accountClass)}</div>
                </TableCell>
                <TableCell className="text-sm">{translateDataValue(t, "loanType", l.type)}</TableCell>
                <TableCell>
                  <Badge className={`text-[10px] ${l.loanStatus === "Active" ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"}`}>
                    {l.loanStatus === "Active" ? t("c360.active") : t("c360.closed")}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">
                  {l.loanStatus === "Closed" ? (
                    <span className={l.behavior.includes("Delayed") ? "text-warning font-medium" : "text-success font-medium"}>
                      {l.behavior.includes("Delayed") ? t("c360.delayed") : t("c360.onTime")}
                    </span>
                  ) : t("global.notAvailable")}
                </TableCell>
                <TableCell className="text-sm text-right">{l.outstanding > 0 ? formatCurrencyLYD(l.outstanding, { locale, compact: true, maximumFractionDigits: 1 }) : t("global.notAvailable")}</TableCell>
                <TableCell className="text-sm text-right">{formatCurrencyLYD(l.paid, { locale, compact: true, maximumFractionDigits: 1 })}</TableCell>
                <TableCell className="text-sm text-right">{l.installment > 0 ? formatCurrencyLYD(l.installment, { locale }) : t("global.notAvailable")}</TableCell>
                <TableCell className="text-sm">{l.nextPayment}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ChartCard>
    </div>
  );
};

export default Customer360Page;
