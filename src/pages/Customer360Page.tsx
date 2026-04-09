import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, CheckCircle, XCircle, AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import KPICard from "@/components/dashboard/KPICard";
import ChartCard from "@/components/dashboard/ChartCard";
import { sampleCustomer, accountFinancials, accountMonthlyRevenue, accountIncomeDebit, topTrnCodes } from "@/lib/mockData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { useLanguage } from "@/contexts/LanguageContext";

const ACCOUNTS_PER_PAGE = 4;

const Customer360Page = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const c = sampleCustomer;
  const [selectedAccount, setSelectedAccount] = useState(c.accounts[0].id);
  const [accountPage, setAccountPage] = useState(0);
  const activeAcc = c.accounts.find((a) => a.id === selectedAccount) || c.accounts[0];

  const fin = accountFinancials[selectedAccount] || c.financials;
  const monthlyRev = accountMonthlyRevenue[selectedAccount] || c.monthlyRevenue;
  const incomeDebit = accountIncomeDebit[selectedAccount] || [];

  const totalPages = Math.ceil(c.accounts.length / ACCOUNTS_PER_PAGE);
  const paginatedAccounts = c.accounts.slice(accountPage * ACCOUNTS_PER_PAGE, (accountPage + 1) * ACCOUNTS_PER_PAGE);

  // Sort top products by frequency then revenue
  const productsByFreq = [...c.topProducts].sort((a, b) => b.usage - a.usage || b.revenue - a.revenue);
  const productsByRev = [...c.topProducts].sort((a, b) => b.revenue - a.revenue || b.usage - a.usage);
  const trnByFreq = [...topTrnCodes].sort((a, b) => b.frequency - a.frequency || b.revenue - a.revenue);
  const trnByRev = [...topTrnCodes].sort((a, b) => b.revenue - a.revenue || b.frequency - a.frequency);

  // Merged loans table
  const allLoans = [
    ...c.loans.active.map((l) => ({
      ...l,
      loanStatus: "Active" as const,
      behavior: "—",
      paid: l.outstanding * 0.3,
      installment: Math.round(l.outstanding / 60),
      nextPayment: "2025-05-01",
    })),
    ...c.loans.closed.map((l) => ({
      id: l.id,
      type: l.type,
      outstanding: 0,
      rate: 0,
      maturity: "—",
      loanStatus: "Closed" as const,
      behavior: l.behavior,
      paid: l.amount,
      installment: 0,
      nextPayment: "—",
    })),
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate("/customer-360")}>
          <ArrowLeft className="h-4 w-4" />
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
            <div className="flex items-center gap-2">
              <Badge className="bg-success text-success-foreground text-[10px]">{c.status}</Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{c.id}</p>
            <div className="mt-3 grid grid-cols-2 gap-x-8 gap-y-2 sm:grid-cols-4 lg:grid-cols-6">
              {([
                [t("label.segment"), c.segment], [t("label.branch"), c.primaryBranch], [t("label.type"), c.customerType],
                [t("label.accounts"), c.accountCount], [t("label.age"), c.age], [t("label.tenure"), c.tenure],
                [t("label.kyc"), c.kyc], [t("label.gender"), c.gender], [t("label.nationality"), c.nationality],
              ] as [string, string | number][]).map(([label, val]) => (
                <div key={label}>
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
                <TableCell className="text-sm">{acc.class}</TableCell>
                <TableCell>
                  <Badge variant={acc.status === "Open" ? "default" : "secondary"} className={`text-[10px] ${acc.status === "Open" ? "bg-success text-success-foreground" : ""}`}>
                    {acc.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-right font-medium">₹{acc.balance.toLocaleString()}</TableCell>
                <TableCell className="text-sm text-right">{acc.creditScore}</TableCell>
                <TableCell className="text-sm text-right">
                  <span className={acc.riskScore > 60 ? "text-destructive font-medium" : "text-success font-medium"}>{acc.riskScore}</span>
                </TableCell>
                <TableCell className="text-sm text-right">{acc.recencyDays}</TableCell>
                <TableCell className="text-sm">{acc.accountAge}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
            <p className="text-xs text-muted-foreground">{t("c360.page")} {accountPage + 1} {t("c360.of")} {totalPages}</p>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" className="h-7 text-xs" disabled={accountPage === 0} onClick={() => setAccountPage((p) => p - 1)}>
                <ChevronLeft className="h-3 w-3 mr-1" />{t("c360.previous")}
              </Button>
              <Button variant="outline" size="sm" className="h-7 text-xs" disabled={accountPage >= totalPages - 1} onClick={() => setAccountPage((p) => p + 1)}>
                {t("c360.next")}<ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </ChartCard>

      {/* Selected account indicator */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
        {t("c360.showingData")} <span className="font-mono font-medium text-foreground">{activeAcc.number}</span> ({activeAcc.class})
      </div>

      {/* 3. Financial KPIs — replaced Avg Daily TRN & Min Sub Revenue with ADB & Recency */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard title={t("c360.totalRevenue")} value={`₹${fin.totalRevenue.toLocaleString()}`} subtitle={t("c360.commission")} />
        <KPICard title={t("c360.trnVolume")} value={fin.trnVolume} subtitle={t("c360.totalTrn")} />
        <KPICard title={t("c360.adb")} value={`₹${(fin.adb || 0).toLocaleString()}`} subtitle={t("c360.avgDailyBalance")} />
        <KPICard title={t("c360.recencyDays")} value={`${fin.recencyDays || 0}`} subtitle={t("c360.daysSinceLastTrn")} />
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
              <p className="text-lg font-semibold text-card-foreground">₹{c.salary.avgMonthlySalary.toLocaleString()}</p>
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
              <LineChart data={monthlyRev}>
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
              <LineChart data={incomeDebit}>
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
            {productsByFreq.map((p) => (
              <div key={p.name} className="flex items-center gap-3">
                <span className="w-28 text-xs text-foreground truncate">{p.name}</span>
                <Progress value={p.usage} className="h-1.5 flex-1" />
                <span className="text-xs text-muted-foreground w-10 text-right">{p.usage}</span>
              </div>
            ))}
          </div>
        </ChartCard>
        <ChartCard title={t("c360.topProductsRev")}>
          <div className="space-y-2">
            {productsByRev.map((p) => (
              <div key={p.name} className="flex items-center gap-3">
                <span className="w-28 text-xs text-foreground truncate">{p.name}</span>
                <Progress value={(p.revenue / productsByRev[0].revenue) * 100} className="h-1.5 flex-1" />
                <span className="text-xs text-muted-foreground w-16 text-right">₹{(p.revenue / 1000).toFixed(1)}K</span>
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
                <span className="text-xs text-muted-foreground w-10 text-right">{t2.frequency}</span>
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
                <span className="text-xs text-muted-foreground w-16 text-right">₹{(t2.revenue / 1000).toFixed(1)}K</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Channel Utilization */}
      <ChartCard title={t("c360.channelUtil")} subtitle={t("c360.volValueChannel")}>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[
              { name: "Onepay", volume: c.channels.onepay.volume, value: c.channels.onepay.value / 1000 },
              { name: "Lypay", volume: c.channels.lypay.volume, value: c.channels.lypay.value / 1000 },
              { name: "MobiCash", volume: c.channels.mobicash.volume, value: c.channels.mobicash.value / 1000 },
              { name: "SMS", volume: c.channels.sms.volume, value: 0 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis yAxisId="left" tick={{ fontSize: 10 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
              <Bar yAxisId="left" dataKey="volume" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} name={t("label.volume")} />
              <Bar yAxisId="right" dataKey="value" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} name={t("label.value")} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Subscriptions & Card Management merged */}
      <ChartCard title={t("c360.subsAndCards")}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Subscriptions */}
          <div className="rounded-md border border-border p-3">
            <p className="text-xs font-medium text-muted-foreground">{t("c360.mobileApp")}</p>
            <Badge className={`mt-1 text-[10px] ${c.subscriptions.mobileApp.status === "Active" ? "bg-success text-success-foreground" : ""}`}>{c.subscriptions.mobileApp.status}</Badge>
            <p className="mt-2 text-xs text-muted-foreground">{t("c360.loginFreq")}: {c.subscriptions.mobileApp.loginFreq}/mo</p>
          </div>
          <div className="rounded-md border border-border p-3">
            <p className="text-xs font-medium text-muted-foreground">{t("c360.whatsapp")}</p>
            <Badge className={`mt-1 text-[10px] ${c.subscriptions.whatsapp.optIn ? "bg-success text-success-foreground" : ""}`}>{c.subscriptions.whatsapp.optIn ? t("c360.optedIn") : t("c360.notOpted")}</Badge>
            <p className="mt-2 text-xs text-muted-foreground">{t("c360.interactions")}: {c.subscriptions.whatsapp.interactions}</p>
          </div>
          <div className="rounded-md border border-border p-3">
            <p className="text-xs font-medium text-muted-foreground">{t("c360.smsAlerts")}</p>
            <Badge variant="secondary" className="mt-1 text-[10px]">{c.subscriptions.smsAlerts.tier}</Badge>
            <p className="mt-2 text-xs text-muted-foreground">₹{c.subscriptions.smsAlerts.price}/mo</p>
          </div>
          {/* Cards */}
          {c.cards.map((card) => (
            <div key={card.type} className="rounded-md border border-border p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-card-foreground">{card.type}</span>
                <Badge className={`text-[10px] ${card.status === "Active" ? "bg-success text-success-foreground" : ""}`}>{card.status}</Badge>
              </div>
              {card.limit > 0 && (
                <>
                  <p className="text-[10px] text-muted-foreground">{t("label.limit")}: ₹{(card.limit / 1000).toFixed(0)}K</p>
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
                <TableCell className="text-sm">{l.type}</TableCell>
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
                  ) : "—"}
                </TableCell>
                <TableCell className="text-sm text-right">{l.outstanding > 0 ? `₹${(l.outstanding / 1e5).toFixed(1)}L` : "—"}</TableCell>
                <TableCell className="text-sm text-right">₹{(l.paid / 1e5).toFixed(1)}L</TableCell>
                <TableCell className="text-sm text-right">{l.installment > 0 ? `₹${l.installment.toLocaleString()}` : "—"}</TableCell>
                <TableCell className="text-sm">{l.nextPayment}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {/* Creditworthiness summary */}
        <div className="mt-4 border-t border-border pt-3 grid grid-cols-3 gap-3">
          <div><p className="text-[10px] text-muted-foreground">{t("c360.creditScore")}</p><p className="text-lg font-semibold text-card-foreground">{c.loans.creditScore}</p></div>
          <div><p className="text-[10px] text-muted-foreground">{t("c360.credibility")}</p><p className="text-sm font-medium text-success">{c.loans.credibility}</p></div>
          <div><p className="text-[10px] text-muted-foreground">{t("c360.dtiRatio")}</p><p className="text-sm font-medium text-card-foreground">{c.loans.dti}%</p></div>
        </div>
      </ChartCard>
    </div>
  );
};

export default Customer360Page;
