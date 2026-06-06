import { useState } from "react";
import { Plug, Square, RotateCcw, Zap } from "lucide-react";
import { toast } from "sonner";
import { postControl, type Snapshot } from "@/lib/energy-api";
import { cn } from "@/lib/utils";

export function ControlBar({ snapshot }: { snapshot: Snapshot | null }) {
  const plugged = snapshot?.producer.ev_plugged ?? false;
  const price = snapshot?.producer.price_per_kwh ?? 0;
  const [busy, setBusy] = useState<string | null>(null);
  const [kwh, setKwh] = useState<number>(1.1);

  const run = async (label: string, fn: () => Promise<void>, ok: string) => {
    setBusy(label);
    try {
      await fn();
      toast.success(ok);
    } catch (e) {
      toast.error(`${label} failed`, { description: (e as Error).message });
    } finally {
      setBusy(null);
    }
  };

  const clampedKwh = Math.min(10, Math.max(0.1, Number.isFinite(kwh) ? kwh : 0.1));
  const estCost = clampedKwh * price;

  return (
    <div className="sticky top-0 z-20 -mx-4 mt-6 border-b border-border bg-background/85 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={!!busy}
          onClick={() =>
            run(
              plugged ? "Unplug" : "Plug in",
              () => postControl("/control/ev", { plugged: !plugged }),
              plugged ? "EV unplugged" : "EV plugged in — agent active",
            )
          }
          className={cn(
            "inline-flex h-10 items-center gap-2 rounded-md px-4 text-sm font-medium transition-colors disabled:opacity-60",
            plugged
              ? "border border-border bg-transparent text-foreground hover:bg-surface"
              : "bg-accent text-white hover:opacity-90",
          )}
        >
          <Plug size={15} />
          {plugged ? "Unplug" : "Plug in EV & Charge"}
        </button>

        <div className="inline-flex h-10 items-center gap-3 rounded-md border border-border bg-transparent px-3">
          <span className="text-[12px] uppercase tracking-[0.08em] text-muted-foreground">
            Buy
          </span>
          <input
            type="range"
            min={0.1}
            max={10}
            step={0.1}
            value={clampedKwh}
            onChange={(e) => setKwh(Number(e.target.value))}
            className="h-1 w-28 cursor-pointer appearance-none rounded-full bg-border accent-[var(--accent)]"
            aria-label="kWh to buy"
          />
          <input
            type="number"
            min={0.1}
            max={10}
            step={0.1}
            value={clampedKwh}
            onChange={(e) => setKwh(Number(e.target.value))}
            className="tabular w-16 rounded-md border border-border bg-background px-2 py-1 text-right text-[13px] text-foreground"
            aria-label="kWh value"
          />
          <span className="text-[12px] text-muted-foreground">kWh</span>
          <span className="tabular hidden text-[12px] text-muted-foreground sm:inline">
            ≈ {estCost.toFixed(3)} USDC
          </span>
          <button
            type="button"
            disabled={!!busy || clampedKwh <= 0}
            onClick={() =>
              run(
                "Buy",
                () => postControl("/control/buy", { kwh: clampedKwh }),
                `Purchase submitted — ${clampedKwh.toFixed(1)} kWh`,
              )
            }
            className="inline-flex h-8 items-center gap-1.5 rounded-md bg-accent px-3 text-[13px] font-medium text-white transition-colors hover:opacity-90 disabled:opacity-60"
          >
            <Zap size={14} />
            Buy
          </button>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            disabled={!!busy}
            onClick={() =>
              run("Stop", () => postControl("/control/stop", {}), "Agent stopped")
            }
            className="inline-flex h-10 items-center gap-2 rounded-md border border-[var(--danger)]/60 bg-transparent px-4 text-sm font-medium text-[var(--danger)] transition-colors hover:bg-[var(--danger)]/8 disabled:opacity-60"
          >
            <Square size={14} />
            Stop
          </button>
          <button
            type="button"
            disabled={!!busy}
            onClick={() => {
              if (!confirm("Reset ledger and restore budget?")) return;
              run("Reset", () => postControl("/control/reset", {}), "State reset");
            }}
            className="inline-flex h-10 items-center gap-2 rounded-md border border-border bg-transparent px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface hover:text-foreground disabled:opacity-60"
          >
            <RotateCcw size={14} />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
