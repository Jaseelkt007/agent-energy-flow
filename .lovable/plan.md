# P2P Agentic Energy Sharing — Dashboard Plan

A single-page, real-time dashboard for the hackathon demo. Minimalistic, near-monochrome, Linear/Vercel/Stripe vibe with a single emerald accent. Polls the local API every 2s and lets the operator drive the autonomous EV agent.

## Stack & setup
- Existing TanStack Start + React + TS + Tailwind v4 project.
- Add deps: `lucide-react`, `recharts`, `framer-motion`, `sonner` (already present), `clsx` via existing `cn` util.
- Add Inter via `<link>` in `__root.tsx` head; register `--font-sans: Inter` in `@theme` (styles.css). Keep tabular-nums via a utility class.
- Add light/dark tokens in `src/styles.css` matching the spec hex values (converted to oklch). Single `--accent: emerald`, `--warning: amber`, `--danger: red`. Override existing shadcn tokens so cards/buttons inherit the calm palette.
- Dark mode: `class="dark"` toggled on `<html>` via a small `useTheme` hook persisting to `localStorage`.

## File layout
```
src/routes/index.tsx                # mounts <Dashboard />
src/components/dashboard/
  Dashboard.tsx                     # composes the page, owns polling
  Header.tsx                        # title, tagline, health pills, theme toggle, SIM badge
  ControlBar.tsx                    # sticky: Plug/Unplug, Buy 1.1, Stop, Reset
  MetricStrip.tsx                   # 6 metric cards
  AgentStepper.tsx                  # IDLE → EVALUATING → PAYING → CHARGING (+ WAITING/ERROR)
  EnergyFlow.tsx                    # schematic SVG with moving dots + reverse USDC dot
  PolicyPanel.tsx                   # collapsible sliders (price, max price, budget)
  PaymentLedger.tsx                 # table from /api/payments
  EventFeed.tsx                     # list from /api/events
  HistoryChart.tsx                  # recharts line: solar_kw + price_per_kwh
  MetricCard.tsx, HealthDot.tsx, Section.tsx, AnimatedNumber.tsx  # primitives
src/lib/energy-api.ts               # typed fetch helpers + zod-free narrow types
src/hooks/usePolling.ts             # generic 2s poll w/ visibility pause + abort
src/hooks/useTheme.ts
```

All data fetching is client-side (the API is `localhost:4021` during the demo), no server functions needed. Route loader stays empty.

## Data & polling
- `usePolling(fn, 2000)` runs while tab visible, pauses on hidden, dedupes in-flight, exposes `{data, error, lastUpdated}`.
- Four parallel pollers in `Dashboard.tsx`: snapshot, payments, events (limit=100), history (minutes=10).
- All response shapes typed defensively (optional fields, fallbacks). History reads `solar_kw`, `price_per_kwh`, and a `ts`/`timestamp` field; renders empty axes if missing.
- Control calls are plain `fetch` POSTs wrapped in `postControl(path, body)`; optimistic UI for the plug toggle and policy sliders; `sonner` toast on success/failure.
- Sliders debounce 300ms before POST `/control/config`.

## Layout (max-w 1200, 12-col, 24px gaps)
1. **Header** — title left, tagline under it; right side: 3 `HealthDot` items (Producer/x402/Agent), SIM badge when `producer.stale`, theme toggle.
2. **ControlBar** — sticky `top-0`, border-bottom, white/charcoal surface. Primary emerald "Plug in EV & Charge" / outline "Unplug" reflecting `producer.ev_plugged`; outline "Buy 1.1 kWh"; outline-red "Stop"; ghost "Reset" with `confirm()`.
3. **MetricStrip** — 6 flat bordered cards: Solar kW, Battery %, Price $/kWh, Budget USDC, Spent USDC, Tx count. `AnimatedNumber` tweens with 150ms ease, tabular-nums.
4. **AgentStepper + EnergyFlow** — two-column row. Stepper: 4 dots + hairline connectors, active dot emerald + subtle opacity pulse (respects `prefers-reduced-motion`); caption = `decision_reason`. WAITING shows amber dot inline; ERROR shows red dot + message. EnergyFlow: schematic SVG (Sun → House → EV), thin lines, small dots animating left→right when CHARGING (emerald), USDC dot right→left when PAYING.
5. **PolicyPanel** — collapsible `<details>`-style; 3 number+range pairs with units; helper text explaining the `price ≤ max && budget > 0` rule.
6. **PaymentLedger** — dense table, hairline dividers, columns: Time (relative via small `timeAgo`), kWh, USDC, Tx (truncated mono) + "View ↗" → `lora_url ?? https://lora.algokit.io/testnet/tx/{tx_id}`. New rows fade in 200ms (framer-motion `AnimatePresence`, opacity only). Footer row shows running totals.
7. **EventFeed** — vertical list, icon by type (💸/🤔/⚠️/·), muted timestamp, monospace tx id when present.
8. **HistoryChart** — recharts `LineChart`, two series, no grid fill, hairline axes, emerald + muted stroke, no dots, tooltip with tabular numbers.

## Design tokens (styles.css additions)
- Light: `--background #FFFFFF`, `--surface #FAFAFA`, `--border #EAEAEA`, `--foreground #111111`, `--muted-foreground #6B7280`.
- Dark: `--background #0A0A0A`, `--surface #141414`, `--border #232323`, `--foreground #FAFAFA`, `--muted-foreground #9CA3AF`.
- `--accent #10B981`, `--warning #F59E0B`, `--danger #EF4444`.
- Map into existing `@theme inline` block so shadcn primitives inherit.
- Add `.tabular` → `font-variant-numeric: tabular-nums`.

## Motion rules
- All transitions 150–200ms `ease-out`.
- One looping animation only: 1.6s opacity pulse on the active stepper dot, gated by `prefers-reduced-motion: no-preference`.
- Energy-flow dots use CSS `@keyframes` translate, paused when state not in PAYING/CHARGING.

## Out of scope
- No auth, no persistence beyond `localStorage` theme.
- No backend changes; everything talks to `VITE_API_BASE_URL` (default `http://localhost:4021`).
- No SSR concerns — component is client-only (fetches in `useEffect`).

## Verification
- After build: load `/`, confirm empty/loading states render without API; with API up, confirm 2s polling, plug toggle round-trip, slider debounce POST, ledger row animation, chart renders, dark toggle, reduced-motion path.
