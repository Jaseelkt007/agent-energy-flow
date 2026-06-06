import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { HistoryPoint } from "@/lib/energy-api";

export function HistoryChart({ data }: { data: HistoryPoint[] | null }) {
  const rows = (data ?? []).slice().sort((a, b) => a.ts - b.ts);
  const formatted = rows.map((r) => ({
    ...r,
    label: r.ts ? new Date(r.ts * 1000).toLocaleTimeString() : "",
  }));

  return (
    <div className="h-[200px] w-full sm:h-[260px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={formatted} margin={{ top: 8, right: 16, bottom: 8, left: 8 }}>
          <CartesianGrid stroke="var(--color-border)" strokeDasharray="2 4" vertical={false} />
          <XAxis
            dataKey="label"
            stroke="var(--color-muted-foreground)"
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: "var(--color-border)" }}
            minTickGap={40}
          />
          <YAxis
            yAxisId="left"
            stroke="var(--color-muted-foreground)"
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: "var(--color-border)" }}
            width={36}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="var(--color-muted-foreground)"
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: "var(--color-border)" }}
            width={48}
          />
          <Tooltip
            contentStyle={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              borderRadius: 6,
              fontSize: 12,
            }}
            labelStyle={{ color: "var(--color-muted-foreground)" }}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="solar_kw"
            name="Solar (kW)"
            stroke="var(--color-accent)"
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="price_per_kwh"
            name="Price ($/kWh)"
            stroke="var(--color-muted-foreground)"
            strokeWidth={1.5}
            strokeDasharray="4 4"
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
