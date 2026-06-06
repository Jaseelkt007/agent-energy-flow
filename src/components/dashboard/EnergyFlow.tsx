import type { Snapshot } from "@/lib/energy-api";

export function EnergyFlow({ s }: { s: Snapshot | null }) {
  const state = s?.agent.state ?? "IDLE";
  const charging = state === "CHARGING";
  const paying = state === "PAYING";

  return (
    <div className="relative h-[120px] sm:h-[140px]">
      <svg viewBox="0 0 320 140" preserveAspectRatio="xMidYMid meet" className="h-full w-full" aria-hidden>
        {/* nodes */}
        <Node x={20} y={70} label="Solar" />
        <Node x={160} y={70} label="x402" />
        <Node x={300} y={70} label="EV" />

        {/* energy line */}
        <line
          x1={42}
          y1={62}
          x2={278}
          y2={62}
          stroke="var(--color-border)"
          strokeWidth={1}
        />
        {/* money line */}
        <line
          x1={42}
          y1={78}
          x2={278}
          y2={78}
          stroke="var(--color-border)"
          strokeWidth={1}
          strokeDasharray="3 3"
        />

        {/* energy dots → */}
        {charging &&
          [0, 0.4, 0.8].map((d, i) => (
            <circle
              key={`e${i}`}
              cx={48}
              cy={62}
              r={3}
              fill="var(--color-accent)"
              className="flow-dot-right"
              style={{ animationDelay: `${d}s` }}
            />
          ))}
        {/* money dots ← */}
        {paying &&
          [0, 0.5].map((d, i) => (
            <circle
              key={`m${i}`}
              cx={272}
              cy={78}
              r={3}
              fill="var(--color-foreground)"
              className="flow-dot-left"
              style={{ animationDelay: `${d}s` }}
            />
          ))}
      </svg>

      <div className="mt-1 flex justify-between text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
        <span>kWh →</span>
        <span>← USDC</span>
      </div>
    </div>
  );
}

function Node({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <g>
      <circle
        cx={x}
        cy={y}
        r={14}
        fill="var(--color-surface)"
        stroke="var(--color-border)"
        strokeWidth={1}
      />
      <text
        x={x}
        y={y + 32}
        textAnchor="middle"
        fontSize={10}
        fill="var(--color-muted-foreground)"
        style={{ letterSpacing: "0.08em", textTransform: "uppercase" }}
      >
        {label}
      </text>
    </g>
  );
}
