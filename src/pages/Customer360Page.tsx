import { useState } from "react";
import { Search, User, CreditCard, TrendingUp, TrendingDown, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import KPICard from "@/components/dashboard/KPICard";
import ChartCard from "@/components/dashboard/ChartCard";
import { sampleCustomer } from "@/lib/mockData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from "recharts";

const Customer360Page = () => {
  const c = sampleCustomer;
  const [selectedAccount, setSelectedAccount] = useState(c.accounts[0].id);
  const activeAcc = c.accounts.find((a) => a.id === selectedAccount) || c.accounts[0];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Customer 360° View</h2>
        <p className="text-sm text-muted-foreground">Individual customer profile and account details</p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search customer ID, name, or account..." className="pl-9 text-sm" defaultValue={c.id} />
      </div>

      {/* 1. Customer Profile */}
      <div className="rounded-lg border border-border bg-card p-5 animate-fade-in">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <User className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-card-foreground">{c.name}</h3>
              <Badge className="bg-success text-success-foreground text-[10px]">{c.status}</Badge>
            </div>
            <p className="text-xs text-muted-foreground">{c.id}</p>
            <div className="mt-3 grid grid-cols-2 gap-x-8 gap-y-2 sm:grid-cols-4 lg:grid-cols-6">
              {[
                ["Segment", c.segment],
                ["Branch", c.primaryBranch],
                ["Type", c.customerType],
                ["Accounts", c.accountCount],
                ["Age", c.age],
                ["Tenure", c.tenure],
                ["KYC", c.kyc],
                ["Gender", c.gender],
                ["Nationality", c.nationality],
              ].map(([label, val]) => (
                <div key={label as string}>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
                  <p className="text-xs font-medium text-card-foreground">{val}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Linked Accounts */}
      <ChartCard title="Linked Accounts" subtitle="Click an account to view details">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs">Account No.</TableHead>
              <TableHead className="text-xs">Class</TableHead>
              <TableHead className="text-xs">Status</TableHead>
              <TableHead className="text-xs text-right">Balance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {c.accounts.map((acc) => (
              <TableRow
                key={acc.id}
                onClick={() => setSelectedAccount(acc.id)}
                className={`cursor-pointer transition-colors ${acc.id === selectedAccount ? "bg-primary/5" : "hover:bg-muted/50"}`}
              >
                <TableCell className="text-sm font-mono">{acc.number}</TableCell>
                <TableCell className="text-sm">{acc.class}</TableCell>
                <TableCell>
                  <Badge variant={acc.status === "Open" ? "default" : "secondary"} className={`text-[10px] ${acc.status === "Open" ? "bg-success text-success-foreground" : ""}`}>
                    {acc.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-right font-medium">₹{acc.balance.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ChartCard>

      {/* 3. Financial Overview */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard title="Total Revenue" value={`₹${c.financials.totalRevenue.toLocaleString()}`} subtitle="Commission" />
        <KPICard title="TRN Volume" value={c.financials.trnVolume} subtitle="Total transactions" />
        <KPICard title="Avg Daily TRN" value={`₹${c.financials.avgDailyTrn.toLocaleString()}`} />
        <KPICard title="Min Sub Revenue" value={`₹${c.financials.minSubscriptionRevenue}`} subtitle="Monthly" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Salary */}
        <ChartCard title="Salary Information">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              {c.salary.receivesSalary ? <CheckCircle className="h-4 w-4 text-success" /> : <XCircle className="h-4 w-4 text-destructive" />}
              <span className="text-sm">Receives Salary: {c.salary.receivesSalary ? "Yes" : "No"}</span>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Avg Monthly Salary</p>
              <p className="text-lg font-semibold text-card-foreground">₹{c.salary.avgMonthlySalary.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Consistency (Last 6 months)</p>
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

        {/* Best/Worst Month */}
        <ChartCard title="Best & Worst Months">
          <div className="space-y-4">
            <div className="rounded-md border border-success/20 bg-success/5 p-3">
              <div className="flex items-center gap-1.5 text-success text-xs font-medium mb-1">
                <TrendingUp className="h-3 w-3" /> Best Month
              </div>
              <p className="text-sm font-semibold text-card-foreground">{c.financials.bestMonth.month}</p>
              <p className="text-xs text-muted-foreground">Revenue: ₹{c.financials.bestMonth.revenue.toLocaleString()} · {c.financials.bestMonth.volume} TRN</p>
            </div>
            <div className="rounded-md border border-destructive/20 bg-destructive/5 p-3">
              <div className="flex items-center gap-1.5 text-destructive text-xs font-medium mb-1">
                <TrendingDown className="h-3 w-3" /> Worst Month
              </div>
              <p className="text-sm font-semibold text-card-foreground">{c.financials.worstMonth.month}</p>
              <p className="text-xs text-muted-foreground">Revenue: ₹{c.financials.worstMonth.revenue.toLocaleString()} · {c.financials.worstMonth.volume} TRN</p>
            </div>
          </div>
        </ChartCard>

        {/* Revenue Trend */}
        <ChartCard title="Monthly Revenue Trend">
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={c.monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,91%)" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "hsl(220,10%,46%)" }} />
                <YAxis tick={{ fontSize: 10, fill: "hsl(220,10%,46%)" }} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                <Area type="monotone" dataKey="revenue" fill="hsl(217,71%,53%)" fillOpacity={0.1} stroke="hsl(217,71%,53%)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* 4. Product & Channel */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="Top Products" subtitle="By usage frequency">
          <div className="space-y-2">
            {c.topProducts.map((p) => (
              <div key={p.name} className="flex items-center gap-3">
                <span className="w-28 text-xs text-foreground truncate">{p.name}</span>
                <Progress value={p.usage} className="h-1.5 flex-1" />
                <span className="text-xs text-muted-foreground w-16 text-right">₹{(p.revenue / 1000).toFixed(1)}K</span>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Channel Utilization" subtitle="Volume & Value by channel">
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: "Onepay", volume: c.channels.onepay.volume, value: c.channels.onepay.value / 1000 },
                { name: "Lypay", volume: c.channels.lypay.volume, value: c.channels.lypay.value / 1000 },
                { name: "MobiCash", volume: c.channels.mobicash.volume, value: c.channels.mobicash.value / 1000 },
                { name: "SMS", volume: c.channels.sms.volume, value: 0 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,91%)" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(220,10%,46%)" }} />
                <YAxis yAxisId="left" tick={{ fontSize: 10, fill: "hsl(220,10%,46%)" }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: "hsl(220,10%,46%)" }} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                <Bar yAxisId="left" dataKey="volume" fill="hsl(217,71%,53%)" radius={[4, 4, 0, 0]} name="Volume" />
                <Bar yAxisId="right" dataKey="value" fill="hsl(142,71%,45%)" radius={[4, 4, 0, 0]} name="Value (K)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Subscriptions */}
      <ChartCard title="Subscriptions">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-md border border-border p-3">
            <p className="text-xs font-medium text-muted-foreground">Mobile App</p>
            <Badge className={`mt-1 text-[10px] ${c.subscriptions.mobileApp.status === "Active" ? "bg-success text-success-foreground" : ""}`}>{c.subscriptions.mobileApp.status}</Badge>
            <p className="mt-2 text-xs text-muted-foreground">Login freq: {c.subscriptions.mobileApp.loginFreq}/mo</p>
          </div>
          <div className="rounded-md border border-border p-3">
            <p className="text-xs font-medium text-muted-foreground">WhatsApp Banking</p>
            <Badge className={`mt-1 text-[10px] ${c.subscriptions.whatsapp.optIn ? "bg-success text-success-foreground" : ""}`}>{c.subscriptions.whatsapp.optIn ? "Opted In" : "Not Opted"}</Badge>
            <p className="mt-2 text-xs text-muted-foreground">Interactions: {c.subscriptions.whatsapp.interactions}</p>
          </div>
          <div className="rounded-md border border-border p-3">
            <p className="text-xs font-medium text-muted-foreground">SMS Alerts</p>
            <Badge variant="secondary" className="mt-1 text-[10px]">{c.subscriptions.smsAlerts.tier}</Badge>
            <p className="mt-2 text-xs text-muted-foreground">₹{c.subscriptions.smsAlerts.price}/mo</p>
          </div>
        </div>
      </ChartCard>

      {/* 5. Loans */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="Active Loans">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Type</TableHead>
                <TableHead className="text-xs text-right">Outstanding</TableHead>
                <TableHead className="text-xs text-right">Rate</TableHead>
                <TableHead className="text-xs">Maturity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {c.loans.active.map((l) => (
                <TableRow key={l.id}>
                  <TableCell className="text-sm">{l.type}</TableCell>
                  <TableCell className="text-sm text-right">₹{(l.outstanding / 1e5).toFixed(1)}L</TableCell>
                  <TableCell className="text-sm text-right">{l.rate}%</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{l.maturity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ChartCard>

        <ChartCard title="Closed Loans & Creditworthiness">
          <div className="space-y-3">
            {c.loans.closed.map((l) => (
              <div key={l.id} className="flex items-center justify-between text-sm">
                <span>{l.type} (₹{(l.amount / 1e5).toFixed(0)}L)</span>
                <Badge variant={l.behavior === "On-time" ? "default" : "secondary"} className={`text-[10px] ${l.behavior === "On-time" ? "bg-success text-success-foreground" : "bg-warning text-warning-foreground"}`}>
                  {l.behavior}
                </Badge>
              </div>
            ))}
            <div className="mt-4 border-t border-border pt-3 grid grid-cols-3 gap-3">
              <div><p className="text-[10px] text-muted-foreground">Credit Score</p><p className="text-lg font-semibold text-card-foreground">{c.loans.creditScore}</p></div>
              <div><p className="text-[10px] text-muted-foreground">Credibility</p><p className="text-sm font-medium text-success">{c.loans.credibility}</p></div>
              <div><p className="text-[10px] text-muted-foreground">DTI Ratio</p><p className="text-sm font-medium text-card-foreground">{c.loans.dti}%</p></div>
            </div>
          </div>
        </ChartCard>
      </div>

      {/* 6. Risk */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="Risk Metrics">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">Profitability Score</span><span className="font-medium">{c.risk.profitability}/100</span></div>
              <Progress value={c.risk.profitability} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">Spending Ratio</span><span className="font-medium">{(c.risk.spendingRatio * 100).toFixed(0)}%</span></div>
              <Progress value={c.risk.spendingRatio * 100} className="h-2" />
            </div>
          </div>
        </ChartCard>

        <ChartCard title="Behavioral Change" subtitle="Quarterly risk score">
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={c.risk.behaviorChange}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,91%)" />
                <XAxis dataKey="period" tick={{ fontSize: 10, fill: "hsl(220,10%,46%)" }} />
                <YAxis domain={[60, 80]} tick={{ fontSize: 10, fill: "hsl(220,10%,46%)" }} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                <Line type="monotone" dataKey="score" stroke="hsl(38,92%,50%)" strokeWidth={2} dot={{ fill: "hsl(38,92%,50%)", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* 7. Cards */}
      <ChartCard title="Card Management">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {c.cards.map((card) => (
            <div key={card.type} className="rounded-md border border-border p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-card-foreground">{card.type}</span>
                <Badge className={`text-[10px] ${card.status === "Active" ? "bg-success text-success-foreground" : ""}`}>{card.status}</Badge>
              </div>
              {card.limit > 0 && (
                <>
                  <p className="text-xs text-muted-foreground">Limit: ₹{(card.limit / 1000).toFixed(0)}K</p>
                  <div className="mt-2">
                    <div className="flex justify-between text-[10px] mb-1"><span className="text-muted-foreground">Utilization</span><span>{card.utilization}%</span></div>
                    <Progress value={card.utilization} className="h-1.5" />
                  </div>
                </>
              )}
              <div className="mt-2 flex items-center gap-1">
                {new Date(card.expiry) < new Date("2026-01-01") && <AlertTriangle className="h-3 w-3 text-warning" />}
                <p className="text-[10px] text-muted-foreground">Expires: {card.expiry}</p>
              </div>
            </div>
          ))}
        </div>
      </ChartCard>
    </div>
  );
};

export default Customer360Page;
