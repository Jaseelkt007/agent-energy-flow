import { Moon, Sun } from "lucide-react";
import type { Snapshot } from "@/lib/energy-api";
import { HealthDot } from "./primitives";
import { useTheme } from "@/hooks/useTheme";

export function Header({ snapshot, offline }: { snapshot: Snapshot | null; offline?: boolean }) {
  const { theme, toggle } = useTheme();
  const health = snapshot?.health ?? { producer: "down", x402: "down", agent: "down" };
  const stale = snapshot?.producer.stale;

  return (
    <header className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-[22px] font-semibold tracking-tight text-foreground">
            P2P Agentic Energy Sharing
          </h1>
          {stale && (
            <span className="inline-flex items-center gap-1.5 rounded-md border border-border px-2 py-0.5 text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--warning)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--warning)]" />
              Simulation
            </span>
          )}
        </div>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Your EV autonomously buys cheap solar from your neighbor and pays
          instantly via x402 on Algorand.
        </p>
      </div>
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-4">
          <HealthDot label={offline ? "Offline" : "Online"} state={offline ? "down" : "ok"} />
          <HealthDot label="Producer" state={health.producer} />
          <HealthDot label="x402" state={health.x402} />
          <HealthDot label="Agent" state={health.agent} />
        </div>
        <button
          type="button"
          onClick={toggle}
          aria-label="Toggle theme"
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-surface text-muted-foreground transition-colors hover:text-foreground"
        >
          {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
        </button>
      </div>
    </header>
  );
}
