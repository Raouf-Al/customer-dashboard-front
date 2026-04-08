import { Crown, TrendingUp, Users, DollarSign } from "lucide-react";
import KPICard from "@/components/dashboard/KPICard";
import ChartCard from "@/components/dashboard/ChartCard";
import { vipCustomers } from "@/lib/mockData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const VIPPage = () => {
  const totalAUM = vipCustomers.reduce((s, v) => s + v.aum, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">VIP Customers</h2>
        <p className="text-sm text-muted-foreground">High-net-worth individuals segment</p>
      </div>

      {/* Criteria */}
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
        <p className="text-xs font-medium text-primary mb-1">VIP Segment Criteria</p>
        <p className="text-xs text-muted-foreground">AUM &gt; ₹10M · Monthly TRN &gt; 50 · Tenure &gt; 3 years · Active products ≥ 3</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard title="Total AUM" value={`₹${(totalAUM / 1e7).toFixed(0)}Cr`} change={12.4} icon={<DollarSign className="h-4 w-4" />} />
        <KPICard title="VIP Count" value={vipCustomers.length} change={8} icon={<Crown className="h-4 w-4" />} />
        <KPICard title="MoM VIP Growth" value="+8%" icon={<TrendingUp className="h-4 w-4" />} />
        <KPICard title="Premium Adoption" value="72%" icon={<Users className="h-4 w-4" />} subtitle="3+ products" />
      </div>

      {/* Retention */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="Churn Risk Distribution">
          <div className="space-y-3">
            {["Low", "Medium", "High"].map((risk) => {
              const count = vipCustomers.filter((v) => v.churnRisk === risk).length;
              const pct = Math.round((count / vipCustomers.length) * 100);
              return (
                <div key={risk} className="flex items-center gap-3">
                  <span className="w-16 text-xs text-foreground">{risk}</span>
                  <Progress value={pct} className="h-2 flex-1" />
                  <span className="text-xs text-muted-foreground w-10 text-right">{pct}%</span>
                </div>
              );
            })}
          </div>
        </ChartCard>

        <ChartCard title="Premium Product Adoption">
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <p className="text-4xl font-bold text-primary">72%</p>
              <p className="text-xs text-muted-foreground mt-1">VIPs with 3+ active products</p>
            </div>
          </div>
        </ChartCard>
      </div>

      {/* VIP Table */}
      <ChartCard title="Top VIP Customers" subtitle="Ranked by AUM">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs w-8">#</TableHead>
                <TableHead className="text-xs">Name</TableHead>
                <TableHead className="text-xs text-right">AUM</TableHead>
                <TableHead className="text-xs text-right">Revenue</TableHead>
                <TableHead className="text-xs text-right">Loan Size</TableHead>
                <TableHead className="text-xs text-right">Card Spend</TableHead>
                <TableHead className="text-xs">Churn Risk</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vipCustomers.map((v) => (
                <TableRow key={v.rank}>
                  <TableCell className="text-sm text-muted-foreground">{v.rank}</TableCell>
                  <TableCell className="text-sm font-medium">{v.name}</TableCell>
                  <TableCell className="text-sm text-right">₹{(v.aum / 1e7).toFixed(1)}Cr</TableCell>
                  <TableCell className="text-sm text-right">₹{(v.revenue / 1e5).toFixed(1)}L</TableCell>
                  <TableCell className="text-sm text-right">{v.loanSize ? `₹${(v.loanSize / 1e7).toFixed(1)}Cr` : "—"}</TableCell>
                  <TableCell className="text-sm text-right">₹{(v.cardSpend / 1e5).toFixed(1)}L</TableCell>
                  <TableCell>
                    <Badge className={`text-[10px] ${
                      v.churnRisk === "Low" ? "bg-success text-success-foreground" :
                      v.churnRisk === "Medium" ? "bg-warning text-warning-foreground" :
                      "bg-destructive text-destructive-foreground"
                    }`}>{v.churnRisk}</Badge>
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
