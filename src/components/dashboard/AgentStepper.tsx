import type { AgentState, Snapshot } from "@/lib/energy-api";
import { cn } from "@/lib/utils";

const STEPS: AgentState[] = ["IDLE", "EVALUATING", "PAYING", "CHARGING"];

export function AgentStepper({ s }: { s: Snapshot | null }) {
  const state = s?.agent.state ?? "IDLE";
  const reason = s?.agent.decision_reason;
  const isSide = state === "WAITING" || state === "ERROR";
  const activeIdx = isSide ? -1 : STEPS.indexOf(state);

  return (
    <div>
      <div className="flex items-center gap-2">
        {STEPS.map((step, i) => {
          const isActive = i === activeIdx;
          const isPast = i < activeIdx;
          return (
            <div key={step} className="flex flex-1 items-center gap-2">
              <span
                className={cn(
                  "h-2 w-2 rounded-full transition-colors",
                  isActive
                    ? "bg-accent dot-pulse"
                    : isPast
                      ? "bg-accent/60"
                      : "bg-border",
                )}
              />
              <span
                className={cn(
                  "text-[11px] font-medium uppercase tracking-[0.08em]",
                  isActive ? "text-foreground" : "text-muted-foreground",
                )}
                style={{ fontWeight: isActive ? 600 : 500 }}
              >
                {step}
              </span>
              {i < STEPS.length - 1 && (
                <span
                  className={cn(
                    "h-px flex-1 transition-colors",
                    i < activeIdx ? "bg-accent/60" : "bg-border",
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      {isSide && (
        <div className="mt-3 inline-flex items-center gap-2 text-[12px]">
          <span
            className={cn(
              "h-2 w-2 rounded-full",
              state === "ERROR" ? "bg-[var(--danger)]" : "bg-[var(--warning)]",
            )}
          />
          <span
            className={
              state === "ERROR" ? "text-[var(--danger)]" : "text-[var(--warning)]"
            }
          >
            {state}
          </span>
        </div>
      )}

      <p className="mt-3 min-h-[20px] text-[13px] text-muted-foreground">
        {reason ?? "Awaiting telemetry…"}
      </p>
    </div>
  );
}
