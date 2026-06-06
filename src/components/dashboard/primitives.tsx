import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Section({
  title,
  right,
  children,
  className,
}: {
  title?: string;
  right?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-lg border border-border bg-surface", className)}>
      {(title || right) && (
        <header className="flex items-center justify-between px-5 py-3 border-b border-border">
          {title && (
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
              {title}
            </h2>
          )}
          {right}
        </header>
      )}
      <div className="p-5">{children}</div>
    </section>
  );
}

export function HealthDot({
  label,
  state,
}: {
  label: string;
  state: "ok" | "stale" | "down";
}) {
  const color =
    state === "ok"
      ? "bg-accent"
      : state === "stale"
        ? "bg-[var(--warning)]"
        : "bg-[var(--danger)]";
  return (
    <span className="inline-flex items-center gap-2 text-[13px] text-muted-foreground">
      <span className={cn("h-2 w-2 rounded-full", color)} />
      <span>{label}</span>
    </span>
  );
}

export function AnimatedNumber({
  value,
  decimals = 2,
  className,
}: {
  value: number;
  decimals?: number;
  className?: string;
}) {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    fromRef.current = display;
    startRef.current = null;
    const duration = 180;
    let raf = 0;
    const step = (t: number) => {
      if (startRef.current === null) startRef.current = t;
      const p = Math.min(1, (t - startRef.current) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(fromRef.current + (value - fromRef.current) * eased);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const formatted = Number.isFinite(display)
    ? display.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })
    : "—";
  return <span className={cn("tabular", className)}>{formatted}</span>;
}

export function MetricCard({
  label,
  value,
  unit,
  decimals = 2,
}: {
  label: string;
  value: number;
  unit?: string;
  decimals?: number;
}) {
  return (
    <div className="rounded-lg border border-border bg-surface p-5">
      <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-2 flex items-baseline gap-1.5">
        <span className="text-[28px] font-semibold leading-none tabular text-foreground">
          <AnimatedNumber value={value} decimals={decimals} />
        </span>
        {unit && <span className="text-xs text-muted-foreground">{unit}</span>}
      </div>
    </div>
  );
}
