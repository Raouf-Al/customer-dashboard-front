import { ReactNode } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  icon?: ReactNode;
  subtitle?: string;
}

const KPICard = ({ title, value, change, icon, subtitle }: KPICardProps) => (
  <div className="rounded-lg border border-border bg-card p-5 animate-fade-in">
    <div className="flex items-start justify-between">
      <div className="space-y-1">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{title}</p>
        <p className="text-2xl font-semibold text-card-foreground">{value}</p>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      {icon && <div className="rounded-md bg-primary/10 p-2 text-primary">{icon}</div>}
    </div>
    {change !== undefined && (
      <div className={`mt-3 flex items-center gap-1 text-xs font-medium ${change >= 0 ? "text-success" : "text-destructive"}`}>
        {change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
        <span>{change >= 0 ? "+" : ""}{change}%</span>
        <span className="text-muted-foreground font-normal">vs last period</span>
      </div>
    )}
  </div>
);

export default KPICard;
