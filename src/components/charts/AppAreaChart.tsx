import {
  Area,
  AreaChart as RechartsAreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatCurrencyLYD, formatNumber } from "@/lib/formatters";

type ChartDatum = Record<string, string | number | null | undefined>;

type AxisValueFormat = {
  kind: "number" | "currency";
  compact?: boolean;
  maximumFractionDigits?: number;
  minimumFractionDigits?: number;
  useEnglishCompactLocale?: boolean;
};

type ValueAxisConfig = {
  id?: string;
  orientation?: "left" | "right";
  width?: number;
  allowDecimals?: boolean;
  tickFormatter?: (value: number) => string;
  domain?: [
    number | "auto" | "dataMin" | "dataMax",
    number | "auto" | "dataMin" | "dataMax",
  ];
  format?: AxisValueFormat;
};

type AreaSeriesConfig = {
  dataKey: string;
  label?: string;
  color: string;
  yAxisId?: string;
  stackId?: string;
  strokeWidth?: number;
  fillOpacity?: number;
  gradientOpacity?: {
    from?: number;
    to?: number;
  };
  type?:
    | "basis"
    | "basisClosed"
    | "basisOpen"
    | "bumpX"
    | "bumpY"
    | "bump"
    | "linear"
    | "natural"
    | "monotoneX"
    | "monotoneY"
    | "monotone"
    | "step"
    | "stepBefore"
    | "stepAfter";
};

interface AppAreaChartProps {
  data: ChartDatum[];
  categoryKey: string;
  areas: AreaSeriesConfig[];
  valueAxes?: ValueAxisConfig[];
  tooltipValueFormatter?: (
    value: number | string,
    seriesName: string,
    item: unknown,
  ) => string;
  tooltipLabelFormatter?: (value: string) => string;
  categoryTickFormatter?: (value: string) => string;
  className?: string;
  gridVertical?: boolean;
}

const tickStyle = {
  fontSize: 11,
  fill: "hsl(var(--muted-foreground))",
};

const MONTH_INDEX: Record<string, number> = {
  Jan: 0,
  January: 0,
  Feb: 1,
  February: 1,
  Mar: 2,
  March: 2,
  Apr: 3,
  April: 3,
  May: 4,
  Jun: 5,
  June: 5,
  Jul: 6,
  July: 6,
  Aug: 7,
  August: 7,
  Sep: 8,
  September: 8,
  Oct: 9,
  October: 9,
  Nov: 10,
  November: 10,
  Dec: 11,
  December: 11,
};

const AppAreaChart = ({
  data,
  categoryKey,
  areas,
  valueAxes,
  tooltipValueFormatter,
  tooltipLabelFormatter,
  categoryTickFormatter,
  className,
  gridVertical = false,
}: AppAreaChartProps) => {
  const { locale } = useLanguage();
  const axes = valueAxes?.length
    ? valueAxes
    : [{ width: 42, allowDecimals: false }];
  const chartConfig = areas.reduce<ChartConfig>((config, area) => {
    config[area.dataKey] = {
      label: area.label ?? area.dataKey,
      color: area.color,
    };

    return config;
  }, {});

  const isArabic = locale.startsWith("ar");

  const formatMonthLabel = (value: string) => {
    const monthIndex = MONTH_INDEX[value];
    if (monthIndex === undefined) return value;
    if (!isArabic) return value;

    return new Intl.DateTimeFormat("ar-LY", { month: "long" }).format(
      new Date(Date.UTC(2024, monthIndex, 1)),
    );
  };

  const formatCategoryValue = (value: string) => {
    if (categoryTickFormatter) {
      return categoryTickFormatter(value);
    }

    return formatMonthLabel(value);
  };

  const formatAxisValue = (value: number, axis: ValueAxisConfig) => {
    if (axis.tickFormatter) {
      return axis.tickFormatter(value);
    }

    if (!axis.format) {
      return formatNumber(value, { locale });
    }

    const formatterLocale =
      axis.format.compact && (axis.format.useEnglishCompactLocale ?? true)
        ? "en-LY"
        : locale;

    if (axis.format.kind === "currency") {
      return formatCurrencyLYD(value, {
        locale: formatterLocale,
        compact: axis.format.compact,
        minimumFractionDigits: axis.format.minimumFractionDigits,
        maximumFractionDigits: axis.format.maximumFractionDigits,
      });
    }

    return formatNumber(value, {
      locale: formatterLocale,
      compact: axis.format.compact,
      minimumFractionDigits: axis.format.minimumFractionDigits,
      maximumFractionDigits: axis.format.maximumFractionDigits,
    });
  };

  return (
    <ChartContainer
      config={chartConfig}
      dir="ltr"
      className={className ?? "h-full w-full aspect-auto"}
    >
      <RechartsAreaChart
        accessibilityLayer
        data={data}
        margin={{
          top: 8,
          right: 8,
          bottom: 4,
          left: 20,
        }}
      >
        <defs>
          {areas.map((area) => (
            <linearGradient
              key={area.dataKey}
              id={`fill-${area.dataKey}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="5%"
                stopColor={`var(--color-${area.dataKey})`}
                stopOpacity={area.gradientOpacity?.from ?? 0.75}
              />
              <stop
                offset="95%"
                stopColor={`var(--color-${area.dataKey})`}
                stopOpacity={area.gradientOpacity?.to ?? 0.12}
              />
            </linearGradient>
          ))}
        </defs>

        <CartesianGrid
          vertical={gridVertical}
          stroke="hsl(var(--border))"
          strokeOpacity={0.35}
          strokeDasharray="4 6"
        />

        <XAxis
          dataKey={categoryKey}
          axisLine={false}
          tickLine={false}
          tickMargin={10}
          minTickGap={16}
          tickFormatter={formatCategoryValue}
          tick={tickStyle}
          padding={{ left: 12, right: 12 }}
        />

        {axes.map((axis, index) => (
          <YAxis
            key={axis.id ?? index}
            yAxisId={axis.id}
            orientation={axis.orientation}
            width={axis.width ?? 42}
            axisLine={false}
            tickLine={false}
            tickMargin={10}
            allowDecimals={axis.allowDecimals ?? false}
            tickFormatter={(value) => formatAxisValue(Number(value), axis)}
            domain={axis.domain}
            tick={tickStyle}
          />
        ))}

        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              labelFormatter={(value) =>
                typeof value === "string"
                  ? tooltipLabelFormatter
                    ? tooltipLabelFormatter(value)
                    : formatMonthLabel(value)
                  : value
              }
              formatter={(value, name, item) => {
                const seriesName = String(name);
                const formattedValue = tooltipValueFormatter
                  ? tooltipValueFormatter(
                      value as number | string,
                      seriesName,
                      item,
                    )
                  : typeof value === "number"
                    ? value.toLocaleString()
                    : String(value);

                return (
                  <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
                    <span className="text-muted-foreground">{seriesName}</span>
                    <span className="font-mono font-medium tabular-nums text-foreground">
                      {formattedValue}
                    </span>
                  </div>
                );
              }}
            />
          }
        />

        {areas.map((area) => (
          <Area
            key={area.dataKey}
            dataKey={area.dataKey}
            name={area.label ?? area.dataKey}
            yAxisId={area.yAxisId}
            type={area.type ?? "natural"}
            stackId={area.stackId}
            stroke={`var(--color-${area.dataKey})`}
            fill={`url(#fill-${area.dataKey})`}
            fillOpacity={area.fillOpacity ?? 0.35}
            strokeWidth={area.strokeWidth ?? 1}
            dot={false}
            activeDot={{ r: 5 }}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
      </RechartsAreaChart>
    </ChartContainer>
  );
};

export default AppAreaChart;
