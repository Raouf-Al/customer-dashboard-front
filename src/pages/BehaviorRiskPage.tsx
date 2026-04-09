import ChartCard from "@/components/dashboard/ChartCard";
import { BarChart3, BrainCircuit, ShieldAlert, Radar, Activity, Fingerprint } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const placeholders = [
  { titleKey: "behaviorRisk.behavioralRiskModel.title", icon: BrainCircuit, descriptionKey: "behaviorRisk.behavioralRiskModel.description" },
  { titleKey: "behaviorRisk.anomalyDetection.title", icon: Radar, descriptionKey: "behaviorRisk.anomalyDetection.description" },
  { titleKey: "behaviorRisk.fraudFlagTracking.title", icon: ShieldAlert, descriptionKey: "behaviorRisk.fraudFlagTracking.description" },
  { titleKey: "behaviorRisk.spendingPatternAnalysis.title", icon: BarChart3, descriptionKey: "behaviorRisk.spendingPatternAnalysis.description" },
  { titleKey: "behaviorRisk.accountActivityHeatmap.title", icon: Activity, descriptionKey: "behaviorRisk.accountActivityHeatmap.description" },
  { titleKey: "behaviorRisk.identityVerification.title", icon: Fingerprint, descriptionKey: "behaviorRisk.identityVerification.description" },
];

const BehaviorRiskPage = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">{t("behaviorRisk.title")}</h2>
        <p className="text-sm text-muted-foreground">{t("behaviorRisk.subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {placeholders.map((p) => (
          <ChartCard key={p.titleKey} title={t(p.titleKey)}>
            <div className="flex flex-col items-center justify-center py-8">
              <div className="rounded-full bg-muted p-4 mb-3">
                <p.icon className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground text-center max-w-[200px]">{t(p.descriptionKey)}</p>
              <div className="mt-4 rounded-md border border-dashed border-border px-3 py-1.5">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{t("global.comingSoon")}</span>
              </div>
            </div>
          </ChartCard>
        ))}
      </div>
    </div>
  );
};

export default BehaviorRiskPage;
