import { Menu, Moon, Sun } from "lucide-react";
import { useState } from "react";
import type { Snapshot } from "@/lib/energy-api";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./Sidebar";

type Health = "ok" | "stale" | "down";

function Pill({
  label,
  state,
  icon,
}: {
  label: string;
  state: Health;
  icon?: React.ReactNode;
}) {
  const dot =
    state === "ok"
      ? "bg-accent"
      : state === "stale"
        ? "bg-[var(--warning)]"
        : "bg-[var(--danger)]";
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1 text-[12px] text-muted-foreground">
      {icon ?? <span className={cn("h-1.5 w-1.5 rounded-full", dot)} />}
      <span className="text-foreground">{label}</span>
    </span>
  );
}

export function Header({ snapshot, offline }: { snapshot: Snapshot | null; offline?: boolean }) {
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const health = snapshot?.health ?? { producer: "down", x402: "down", agent: "down" };
  const stale = snapshot?.producer.stale;

  return (
    <header className="flex flex-col gap-3 pb-4 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
      <div className="flex items-start gap-3">
        {/* Mobile menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              aria-label="Open menu"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-surface text-muted-foreground lg:hidden"
            >
              <Menu size={16} />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] p-0">
            <Sidebar offline={offline} snapshot={snapshot} onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-[18px] font-semibold leading-tight tracking-tight text-foreground sm:text-[22px]">
              P2P Agentic Energy Sharing
            </h1>
            {stale && (
              <span className="inline-flex items-center gap-1.5 rounded-md border border-border px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.08em] text-[var(--warning)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--warning)]" />
                Sim
              </span>
            )}
          </div>
          <p className="mt-1 hidden max-w-2xl text-[13px] text-muted-foreground sm:block">
            Your Heevee autonomously buys cheap solar from neighbors and pays instantly via x402 on Algorand.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:justify-end">
        <Pill label={offline ? "Offline" : "Online"} state={offline ? "down" : "ok"} />
        <Pill label="Producer" state={health.producer} />
        <Pill
          label="x402"
          state={health.x402}
          icon={<span className="text-[11px] font-semibold text-[oklch(0.55_0.2_280)]">X</span>}
        />
        <Pill
          label="Agent"
          state={health.agent}
          icon={<span className="text-[11px] font-semibold text-[oklch(0.55_0.2_280)]">⚛</span>}
        />
        <button
          type="button"
          onClick={toggle}
          aria-label="Toggle theme"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-surface text-muted-foreground transition-colors hover:text-foreground"
        >
          {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
        </button>
      </div>
    </header>
  );
}
