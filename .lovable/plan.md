
# Mobile UI Optimization Plan

Goal: Make the dashboard feel native on phones (≤640px) while keeping the existing desktop layout unchanged. No business-logic changes — frontend/presentation only.

## Approach
Tailwind responsive classes (`sm:`, `lg:`) — mobile-first defaults, desktop styles preserved. Same components, restructured layouts at small breakpoints.

## Per-component changes

### Header (`Header.tsx`)
- Stack vertically on mobile; reduce title to `text-lg` (currently 22px).
- Health dots: wrap into a horizontal scroll-free row using `flex-wrap gap-3`; shrink dot labels to `text-[10px]`.
- Theme toggle moves to top-right corner alongside title (not below).
- Hide the long subtitle on mobile (`hidden sm:block`) or truncate to one line.

### ControlBar (`ControlBar.tsx`)
- Currently a single sticky row with `flex-wrap` — on mobile it wraps awkwardly. Restructure to:
  - Row 1: "Plug in EV" full-width primary button.
  - Row 2: Buy control as its own full-width card — slider on top, number input + Buy button below, estimated cost visible (currently `hidden sm:inline`).
  - Row 3: Stop + Reset as two equal-width buttons (no `ml-auto`).
- Keep sticky behavior; increase tap targets to `h-11`.

### MetricStrip (`MetricStrip.tsx`)
- Already `grid-cols-2 sm:grid-cols-3 lg:grid-cols-6` — keep, but tighten card padding on mobile and reduce metric value font size so 2 fit cleanly side-by-side.

### Dashboard grid (`Dashboard.tsx`)
- Already stacks via `lg:grid-cols-*` defaults — verify Agent State / Policy / Event Feed / Chart stack to single column on mobile (they do). Reduce vertical `space-y-6` → `space-y-4` on mobile.
- Reduce outer padding `pt-8` → `pt-4` and `pb-16` → `pb-10` on mobile.

### PaymentLedger (`PaymentLedger.tsx`)
- Table doesn't fit on mobile. Render a **card list** on mobile (`sm:hidden`) and keep the table on `sm:` and up (`hidden sm:block`):
  - Each card: time + truncated tx id on top row; kWh, USDC, "View" link on second row. Tabular figures preserved.
- Summary chips already wrap fine.

### EnergyFlow (`EnergyFlow.tsx`)
- Likely a horizontal SVG/flow diagram — verify it scales; add `overflow-x-auto` wrapper or scale down via `text-xs` on mobile if it overflows.

### HistoryChart (`HistoryChart.tsx`)
- Ensure responsive container (`width="100%"`); shrink chart height on mobile (`h-40 sm:h-56`).

### PolicyPanel, AgentStepper, EventFeed
- Verify reasonable spacing/wrapping; minor padding/font reductions only if needed.

### Section primitive (`primitives.tsx`)
- Reduce `p-*` and title size on mobile if it currently uses fixed desktop padding.

## Out of scope
- API/data changes, new features, color/theme changes, animations.
- No new routes or PWA setup.

## Verification
- Use `preview_ui--set_preview_device_viewport` mobile after implementation, screenshot, verify no horizontal scroll and tap targets ≥40px.
