import { Bar, BarChart as RechartsBarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";

import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

type ChartDatum = Record<string, string | number | null | undefined>;

type ValueAxisConfig = {
  id?: string;
  orientation?: "left" | "right";
  width?: number;
  allowDecimals?: boolean;
  tickFormatter?: (value: number) => string;
};

type BarSeriesConfig = {
  dataKey: string;
  label?: string;
  color: string;
  yAxisId?: string;
  radius?: number;
  cellColors?: string[];
};

interface AppBarChartProps {
  data: ChartDatum[];
  categoryKey: string;
  bars: BarSeriesConfig[];
  layout?: "horizontal" | "vertical";
  categoryAxisWidth?: number;
  categoryTickFormatter?: (value: string) => string;
  valueAxes?: ValueAxisConfig[];
  tooltipValueFormatter?: (value: number | string, seriesName: string) => string;
  className?: string;
}

const tickStyle = {
  fontSize: 11,
  fill: "hsl(var(--muted-foreground))",
};

const AppBarChart = ({
  data,
  categoryKey,
  bars,
  layout = "horizontal",
  categoryAxisWidth = 72,
  categoryTickFormatter,
  valueAxes,
  tooltipValueFormatter,
  className,
}: AppBarChartProps) => {
  const axes = valueAxes?.length ? valueAxes : [{ width: 42, allowDecimals: false }];

  const chartConfig = bars.reduce<ChartConfig>((config, bar) => {
    config[bar.dataKey] = {
      label: bar.label ?? bar.dataKey,
      color: bar.color,
    };

    return config;
  }, {});

  return (
    <ChartContainer config={chartConfig} className={className ?? "h-full w-full aspect-auto"}>
      <RechartsBarChart
        accessibilityLayer
        data={data}
        layout={layout}
        margin={{
          top: 8,
          right: layout === "vertical" ? 8 : 12,
          bottom: 4,
          left: layout === "vertical" ? 0 : -12,
        }}
        barCategoryGap="22%"
      >
        <CartesianGrid
          stroke="hsl(var(--border))"
          strokeOpacity={0.35}
          strokeDasharray="4 4"
          vertical={layout === "vertical"}
          horizontal={layout !== "vertical"}
        />

        {layout === "vertical" ? (
          <>
            <XAxis
              type="number"
              axisLine={false}
              tickLine={false}
              tickMargin={10}
              allowDecimals={axes[0]?.allowDecimals ?? false}
              tickFormatter={axes[0]?.tickFormatter}
              tick={tickStyle}
            />
            <YAxis
              type="category"
              dataKey={categoryKey}
              axisLine={false}
              tickLine={false}
              tickMargin={10}
              width={categoryAxisWidth}
              tickFormatter={categoryTickFormatter}
              tick={tickStyle}
            />
          </>
        ) : (
          <>
            <XAxis
              dataKey={categoryKey}
              axisLine={false}
              tickLine={false}
              tickMargin={10}
              minTickGap={16}
              tickFormatter={categoryTickFormatter}
              tick={tickStyle}
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
                tickFormatter={axis.tickFormatter}
                tick={tickStyle}
              />
            ))}
          </>
        )}

        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              formatter={(value, name) => {
                const seriesName = String(name);
                const formattedValue = tooltipValueFormatter
                  ? tooltipValueFormatter(value as number | string, seriesName)
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

        {bars.map((bar) => (
          <Bar
            key={bar.dataKey}
            dataKey={bar.dataKey}
            name={bar.label ?? bar.dataKey}
            yAxisId={bar.yAxisId}
            fill={`var(--color-${bar.dataKey})`}
            radius={bar.radius ?? 8}
          >
            {bar.cellColors?.map((color, index) => (
              <Cell key={`${bar.dataKey}-${index}`} fill={color} />
            ))}
          </Bar>
        ))}
      </RechartsBarChart>
    </ChartContainer>
  );
};

export default AppBarChart;
