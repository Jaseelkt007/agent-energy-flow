import { Home, Zap, Store, Receipt, Bot, Settings, ArrowRight } from "lucide-react";
import type { Snapshot } from "@/lib/energy-api";
import { cn } from "@/lib/utils";

type Item = { label: string; icon: React.ComponentType<{ size?: number; className?: string }> };
const NAV: Item[] = [
  { label: "Dashboard", icon: Home },
  { label: "Energy Flow", icon: Zap },
  { label: "Marketplace", icon: Store },
  { label: "Transactions", icon: Receipt },
  { label: "Agents", icon: Bot },
  { label: "Settings", icon: Settings },
];

export function Sidebar({
  snapshot,
  offline,
  onNavigate,
}: {
  snapshot: Snapshot | null;
  offline?: boolean;
  onNavigate?: () => void;
}) {
  const [active, setActive] = (typeof window !== "undefined"
    ? require("react").useState("Dashboard")
    : ["Dashboard", () => {}]) as [string, (s: string) => void];

  return (
    <aside className="flex h-full w-full flex-col gap-6 border-r border-border bg-surface p-5">
      {/* Brand */}
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/12 text-accent">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 11l9-8 9 8" />
            <path d="M5 10v10h14V10" />
          </svg>
        </div>
        <div className="leading-tight">
          <div className="text-[16px] font-semibold tracking-tight text-foreground">Heevee</div>
          <div className="text-[11px] text-muted-foreground">Powering Smarter Communities</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-1">
        {NAV.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.label;
          return (
            <button
              key={item.label}
              type="button"
              onClick={() => {
                setActive(item.label);
                onNavigate?.();
              }}
              className={cn(
                "inline-flex items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] font-medium transition-colors",
                isActive
                  ? "bg-accent/10 text-accent"
                  : "text-muted-foreground hover:bg-background hover:text-foreground",
              )}
            >
              <Icon size={17} className={isActive ? "text-accent" : ""} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Status card */}
      <div className="rounded-xl border border-border bg-background p-4">
        <div className="text-[12px] font-semibold text-foreground">Your Heevee</div>
        <div className="mt-3 flex h-24 items-center justify-center rounded-lg bg-gradient-to-br from-accent/10 via-surface to-[oklch(0.7_0.15_280)]/10">
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent">
            <path d="M3 11l9-8 9 8" />
            <path d="M5 10v10h14V10" />
            <rect x="9" y="13" width="6" height="7" />
          </svg>
        </div>
        <div className="mt-4 space-y-2 text-[12px]">
          <Row label="Status" value={
            <span className="inline-flex items-center gap-1.5 text-foreground">
              <span className={cn("h-1.5 w-1.5 rounded-full", offline ? "bg-[var(--danger)]" : "bg-accent")} />
              {offline ? "Offline" : "Online"}
            </span>
          } />
          <Row label="Heevee ID" value={<span className="font-mono text-foreground">X402-7F3A</span>} />
          <Row label="Location" value={<span className="text-foreground">San Francisco, CA</span>} />
        </div>
        <button
          type="button"
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-[13px] font-medium text-accent transition-colors hover:bg-accent/5"
        >
          View Agent Profile
          <ArrowRight size={13} />
        </button>
      </div>
    </aside>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      {value}
    </div>
  );
}
