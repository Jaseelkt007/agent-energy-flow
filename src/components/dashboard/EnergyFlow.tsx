import { Sun, Plug, Zap } from "lucide-react";
import type { Snapshot } from "@/lib/energy-api";
import heroAsset from "@/assets/heevee-hero.png.asset.json";

export function EnergyFlow({ s }: { s: Snapshot | null }) {
  const solar = s?.producer.solar_kw ?? 0;
  const evKw = s?.totals.ev_power_kw ?? 0;
  const plugged = s?.producer.ev_plugged ?? false;
  const surplus = Math.max(0, solar - evKw);

  return (
    <div className="space-y-2">
      <div className="relative overflow-hidden rounded-xl border border-border bg-muted/30">
        <img
          src={heroAsset.url}
          alt="Home with solar panels charging an EV"
          className="h-[200px] w-full object-cover sm:h-[280px] lg:h-[320px]"
        />

        {/* Generating chip — top left */}
        <Chip className="left-3 top-3" icon={<Sun size={14} className="text-emerald-500" />} label="Generating" value={`${solar.toFixed(2)} kW`} />

        {/* Charging EV chip — right middle (only when plugged in) */}
        {plugged && (
          <Chip
            className="right-3 top-1/2 -translate-y-1/2"
            icon={<Plug size={14} className="text-violet-500" />}
            label="Charging EV"
            value={`${evKw.toFixed(2)} kW`}
          />
        )}

        {/* Surplus chip — bottom center */}
        <Chip
          className="bottom-3 left-1/2 -translate-x-1/2"
          icon={<Zap size={14} className="text-emerald-500" />}
          label="Surplus"
          value={`${surplus.toFixed(2)} kW`}
        />
      </div>

      <div className="flex justify-between text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
        <span>kWh →</span>
        <span>← USDC</span>
      </div>
    </div>
  );
}

function Chip({
  className = "",
  icon,
  label,
  value,
}: {
  className?: string;
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div
      className={`absolute flex items-center gap-2 rounded-lg bg-background/95 px-2.5 py-1.5 shadow-[0_4px_12px_rgba(15,23,42,0.12)] ring-1 ring-border backdrop-blur-sm ${className}`}
    >
      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-muted">{icon}</span>
      <div className="leading-tight">
        <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div>
        <div className="text-sm font-semibold tabular-nums text-foreground">{value}</div>
      </div>
    </div>
  );
}
