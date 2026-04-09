import { useState } from "react";
import { CalendarDays, ChevronDown, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";

const GlobalHeader = () => {
  const [dateFrom, setDateFrom] = useState<Date>(new Date(2024, 0, 1));
  const [dateTo, setDateTo] = useState<Date>(new Date());
  const [currency, setCurrency] = useState<"local" | "usd">("local");
  const { lang, setLang, t } = useLanguage();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-card px-6 pl-2">
      <div className="flex items-center gap-2.5">
        <SidebarTrigger className="h-8 w-8 shrink-0" />
        <div className="h-5 w-px bg-border" />
        <Building2 className="h-4 w-4 text-primary" />
        <h1 className="text-sm font-semibold text-foreground">
          {t("app.title")}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Language Toggle */}
        <div className="flex h-8 items-center rounded-md border border-border bg-muted p-0.5">
          <button
            onClick={() => setLang("en")}
            className={cn(
              "rounded px-2.5 py-1 text-xs font-medium transition-colors",
              lang === "en"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground",
            )}
          >
            EN
          </button>
          <button
            onClick={() => setLang("ar")}
            className={cn(
              "rounded px-2.5 py-1 text-xs font-medium transition-colors",
              lang === "ar"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground",
            )}
          >
            AR
          </button>
        </div>

        {/* Date Range */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
              <CalendarDays className="h-3.5 w-3.5" />
              {format(dateFrom, "MMM yyyy")} – {format(dateTo, "MMM yyyy")}
              <ChevronDown className="h-3 w-3" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <div className="flex">
              <Calendar
                mode="single"
                selected={dateFrom}
                onSelect={(d) => d && setDateFrom(d)}
                className={cn("p-3 pointer-events-auto")}
              />
              <Calendar
                mode="single"
                selected={dateTo}
                onSelect={(d) => d && setDateTo(d)}
                className={cn("p-3 pointer-events-auto")}
              />
            </div>
          </PopoverContent>
        </Popover>

        {/* Branch/Region */}
        <Select defaultValue="all">
          <SelectTrigger className="h-8 w-[130px] text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("filter.allRegions")}</SelectItem>
            <SelectItem value="north">{t("filter.north")}</SelectItem>
            <SelectItem value="south">{t("filter.south")}</SelectItem>
            <SelectItem value="east">{t("filter.east")}</SelectItem>
            <SelectItem value="west">{t("filter.west")}</SelectItem>
            <SelectItem value="central">{t("filter.central")}</SelectItem>
          </SelectContent>
        </Select>

        {/* Account Type */}
        <Select defaultValue="all">
          <SelectTrigger className="h-8 w-[120px] text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("filter.allTypes")}</SelectItem>
            <SelectItem value="retail">{t("filter.retail")}</SelectItem>
            <SelectItem value="corporate">{t("filter.corporate")}</SelectItem>
          </SelectContent>
        </Select>

        {/* Currency Toggle */}
        <div className="flex h-8 items-center rounded-md border border-border bg-muted p-0.5">
          <button
            onClick={() => setCurrency("local")}
            className={cn(
              "rounded px-2.5 py-1 text-xs font-medium transition-colors",
              currency === "local"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground",
            )}
          >
            {t("currency.lcy")}
          </button>
          <button
            onClick={() => setCurrency("usd")}
            className={cn(
              "rounded px-2.5 py-1 text-xs font-medium transition-colors",
              currency === "usd"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground",
            )}
          >
            {t("currency.usd")}
          </button>
        </div>
      </div>
    </header>
  );
};

export default GlobalHeader;
