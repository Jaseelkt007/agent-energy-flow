import type { Snapshot } from "@/lib/energy-api";
import { MetricCard } from "./primitives";

export function MetricStrip({ s }: { s: Snapshot | null }) {
  const p = s?.producer;
  const a = s?.agent;
  const t = s?.totals;
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      <MetricCard label="Solar" value={p?.solar_kw ?? 0} unit="kW" decimals={2} />
      <MetricCard label="Battery" value={(p?.battery_pct ?? 0) * 100} unit="%" decimals={0} />
      <MetricCard label="Price" value={p?.price_per_kwh ?? 0} unit="$/kWh" decimals={3} />
      <MetricCard label="Budget" value={a?.budget_remaining_usdc ?? 0} unit="USDC" decimals={2} />
      <MetricCard label="Spent" value={t?.spent_usdc ?? 0} unit="USDC" decimals={2} />
      <MetricCard label="Transactions" value={t?.tx_count ?? 0} decimals={0} />
    </div>
  );
}
