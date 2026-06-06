import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { postControl, type Snapshot } from "@/lib/energy-api";
import { cn } from "@/lib/utils";

interface Values {
  price_per_kwh: number;
  max_price_per_kwh: number;
  budget_usd: number;
}

export function PolicyPanel({ snapshot }: { snapshot: Snapshot | null }) {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<Values | null>(null);
  const lastSyncedRef = useRef<string>("");

  // hydrate from snapshot until user touches it
  useEffect(() => {
    if (!snapshot) return;
    const key = `${snapshot.producer.price_per_kwh}|${snapshot.agent.max_price_per_kwh}|${snapshot.agent.budget_remaining_usdc}`;
    if (values === null) {
      setValues({
        price_per_kwh: snapshot.producer.price_per_kwh,
        max_price_per_kwh: snapshot.agent.max_price_per_kwh,
        budget_usd: snapshot.agent.budget_remaining_usdc,
      });
      lastSyncedRef.current = key;
    }
  }, [snapshot, values]);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const set = (patch: Partial<Values>) => {
    setValues((v) => (v ? { ...v, ...patch } : v));
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        await postControl("/control/config", patch);
      } catch (e) {
        toast.error("Config update failed", { description: (e as Error).message });
      }
    }, 300);
  };

  const v = values;

  return (
    <div className="rounded-lg border border-border bg-surface">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-5 py-3 text-left"
      >
        <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
          Agent Policy
        </span>
        <ChevronDown
          size={14}
          className={cn(
            "text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
        />
      </button>
      {open && (
        <div className="space-y-5 border-t border-border p-5">
          <Slider
            label="Price per kWh (producer)"
            unit="USDC"
            min={0}
            max={0.5}
            step={0.01}
            decimals={2}
            value={v?.price_per_kwh ?? 0}
            onChange={(n) => set({ price_per_kwh: n })}
          />
          <Slider
            label="Max price agent will pay"
            unit="USDC"
            min={0}
            max={0.5}
            step={0.01}
            decimals={2}
            value={v?.max_price_per_kwh ?? 0}
            onChange={(n) => set({ max_price_per_kwh: n })}
          />
          <Slider
            label="Budget"
            unit="USDC"
            min={0}
            max={10}
            step={0.5}
            decimals={1}
            value={v?.budget_usd ?? 0}
            onChange={(n) => set({ budget_usd: n })}
          />
          <p className="text-[12px] text-muted-foreground">
            The agent buys only while price ≤ max and budget remains.
          </p>
        </div>
      )}
    </div>
  );
}

function Slider({
  label,
  unit,
  min,
  max,
  step,
  decimals,
  value,
  onChange,
}: {
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  decimals: number;
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="text-[13px] text-foreground">{label}</label>
        <span className="tabular text-[13px] text-muted-foreground">
          {value.toFixed(decimals)} {unit}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-border accent-[var(--accent)]"
        />
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="tabular w-20 rounded-md border border-border bg-background px-2 py-1 text-right text-[13px] text-foreground"
        />
      </div>
    </div>
  );
}
