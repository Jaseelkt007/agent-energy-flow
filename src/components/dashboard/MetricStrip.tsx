import { Sun, BatteryFull, Tag, Wallet, TrendingUp, Receipt } from "lucide-react";
import type { Snapshot } from "@/lib/energy-api";
import { AnimatedNumber } from "./primitives";

type Tone = "accent" | "violet" | "neutral";

function Card({
  icon,
  label,
  value,
  unit,
  decimals = 2,
  status,
  tone = "neutral",
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  unit?: string;
  decimals?: number;
  status?: { text: string; tone?: "ok" | "muted" };
  tone?: Tone;
}) {
  const iconBg =
    tone === "accent"
      ? "bg-accent/10 text-accent"
      : tone === "violet"
        ? "bg-[oklch(0.55_0.2_280)]/10 text-[oklch(0.55_0.2_280)]"
        : "bg-surface text-muted-foreground";
  return (
    <div className="rounded-xl border border-border bg-surface p-3.5">
      <div className="flex items-center gap-2">
        <span className={`inline-flex h-6 w-6 items-center justify-center rounded-md ${iconBg}`}>
          {icon}
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
          {label}
        </span>
      </div>
      <div className="mt-2.5 flex items-baseline gap-1.5">
        <span className="text-[22px] font-semibold leading-none tabular text-foreground">
          <AnimatedNumber value={value} decimals={decimals} />
        </span>
        {unit && <span className="text-[11px] text-muted-foreground">{unit}</span>}
      </div>
      {status && (
        <div
          className={`mt-1.5 text-[11px] ${status.tone === "ok" ? "text-accent" : "text-muted-foreground"}`}
        >
          {status.text}
        </div>
      )}
    </div>
  );
}

export function MetricStrip({ s }: { s: Snapshot | null }) {
  const p = s?.producer;
  const a = s?.agent;
  const t = s?.totals;
  const solar = p?.solar_kw ?? 0;
  const battery = (p?.battery_pct ?? 0) * 100;

  return (
    <div className="grid grid-cols-2 gap-3">
      <Card
        icon={<Sun size={13} />}
        label="Solar"
        value={solar}
        unit="kW"
        decimals={2}
        tone="accent"
        status={{ text: solar > 0 ? "Generating" : "Idle", tone: solar > 0 ? "ok" : "muted" }}
      />
      <Card
        icon={<BatteryFull size={13} />}
        label="Battery"
        value={battery}
        unit="%"
        decimals={0}
        tone="accent"
        status={{ text: battery > 60 ? "Ready" : "Charging", tone: "ok" }}
      />
      <Card
        icon={<Tag size={13} />}
        label="Price"
        value={p?.price_per_kwh ?? 0}
        unit="$/kWh"
        decimals={3}
        tone="violet"
        status={{ text: "Market" }}
      />
      <Card
        icon={<Wallet size={13} />}
        label="Budget"
        value={a?.budget_remaining_usdc ?? 0}
        unit="USDC"
        decimals={2}
        tone="violet"
        status={{ text: "Available" }}
      />
      <Card
        icon={<TrendingUp size={13} />}
        label="Spent"
        value={t?.spent_usdc ?? 0}
        unit="USDC"
        decimals={2}
        tone="violet"
        status={{ text: "This week" }}
      />
      <Card
        icon={<Receipt size={13} />}
        label="Transactions"
        value={t?.tx_count ?? 0}
        decimals={0}
        tone="neutral"
        status={{ text: "Total" }}
      />
    </div>
  );
}
