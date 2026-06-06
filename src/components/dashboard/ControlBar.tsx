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
    <div className="sticky top-0 z-20 -mx-4 mt-4 border-b border-border bg-background/85 px-4 py-3 backdrop-blur sm:-mx-6 sm:mt-6 sm:px-6">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
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
            "inline-flex h-11 w-full items-center justify-center gap-2 rounded-md px-4 text-sm font-medium transition-colors disabled:opacity-60 sm:h-10 sm:w-auto sm:justify-start",
            plugged
              ? "border border-border bg-transparent text-foreground hover:bg-surface"
              : "bg-accent text-white hover:opacity-90",
          )}
        >
          <Plug size={15} />
          {plugged ? "Unplug" : "Plug in EV & Charge"}
        </button>

        <div className="flex w-full flex-col gap-2 rounded-md border border-border bg-transparent p-3 sm:inline-flex sm:h-10 sm:w-auto sm:flex-row sm:items-center sm:gap-3 sm:p-0 sm:px-3">
          <div className="flex items-center justify-between gap-3 sm:contents">
            <span className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground sm:text-[12px]">
              Buy
            </span>
            <span className="tabular text-[12px] text-muted-foreground sm:order-3">
              ≈ {estCost.toFixed(3)} USDC
            </span>
          </div>
          <input
            type="range"
            min={0.1}
            max={10}
            step={0.1}
            value={clampedKwh}
            onChange={(e) => setKwh(Number(e.target.value))}
            className="h-1 w-full cursor-pointer appearance-none rounded-full bg-border accent-[var(--accent)] sm:w-28"
            aria-label="kWh to buy"
          />
          <div className="flex items-center gap-2 sm:contents">
            <input
              type="number"
              min={0.1}
              max={10}
              step={0.1}
              value={clampedKwh}
              onChange={(e) => setKwh(Number(e.target.value))}
              className="tabular w-20 rounded-md border border-border bg-background px-2 py-1.5 text-right text-[13px] text-foreground sm:w-16 sm:py-1"
              aria-label="kWh value"
            />
            <span className="text-[12px] text-muted-foreground">kWh</span>
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
              className="ml-auto inline-flex h-9 items-center gap-1.5 rounded-md bg-accent px-4 text-[13px] font-medium text-white transition-colors hover:opacity-90 disabled:opacity-60 sm:ml-0 sm:h-8 sm:px-3"
            >
              <Zap size={14} />
              Buy
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:ml-auto sm:flex sm:items-center">
          <button
            type="button"
            disabled={!!busy}
            onClick={() =>
              run("Stop", () => postControl("/control/stop", {}), "Agent stopped")
            }
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-[var(--danger)]/60 bg-transparent px-4 text-sm font-medium text-[var(--danger)] transition-colors hover:bg-[var(--danger)]/8 disabled:opacity-60 sm:h-10"
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
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border bg-transparent px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface hover:text-foreground disabled:opacity-60 sm:h-10"
          >
            <RotateCcw size={14} />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
