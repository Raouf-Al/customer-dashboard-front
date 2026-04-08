import ChartCard from "@/components/dashboard/ChartCard";
import { BarChart3, BrainCircuit, ShieldAlert, Radar, Activity, Fingerprint } from "lucide-react";

const placeholders = [
  { title: "Behavioral Risk Model", icon: BrainCircuit, description: "ML-driven risk scoring based on transaction patterns and account behavior changes." },
  { title: "Anomaly Detection", icon: Radar, description: "Real-time detection of unusual activity across accounts, channels, and geographies." },
  { title: "Fraud Flag Tracking", icon: ShieldAlert, description: "Flagged transactions and suspicious activity monitoring dashboard." },
  { title: "Spending Pattern Analysis", icon: BarChart3, description: "Customer spending categorization and deviation tracking over time." },
  { title: "Account Activity Heatmap", icon: Activity, description: "Temporal heatmap of account activity showing peak usage and dormancy patterns." },
  { title: "Identity Verification", icon: Fingerprint, description: "KYC/AML verification status and biometric authentication tracking." },
];

const BehaviorRiskPage = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-lg font-semibold text-foreground">Customer Behavior & Risk</h2>
      <p className="text-sm text-muted-foreground">Behavioral analytics and risk models — coming soon</p>
    </div>

    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {placeholders.map((p) => (
        <ChartCard key={p.title} title={p.title}>
          <div className="flex flex-col items-center justify-center py-8">
            <div className="rounded-full bg-muted p-4 mb-3">
              <p.icon className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground text-center max-w-[200px]">{p.description}</p>
            <div className="mt-4 rounded-md border border-dashed border-border px-3 py-1.5">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Coming Soon</span>
            </div>
          </div>
        </ChartCard>
      ))}
    </div>
  </div>
);

export default BehaviorRiskPage;
