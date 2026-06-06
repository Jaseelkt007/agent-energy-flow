
# Heevee-Style Redesign Plan

Restyle the existing dashboard to match the attached reference. Pure frontend/presentation — no API, data, or business logic changes. All existing functionality (snapshot polling, controls, ledger, events, history, online/offline) stays intact.

## Visual direction
- **Light theme as default** (clean white background, soft borders, subtle shadows). Keep existing dark theme toggle working.
- **Brand**: rename product surface to "Heevee" with tagline "Powering Smarter Communities". Keep current section titles ("P2P Agentic Energy Sharing" as page H1).
- **Accents**: green primary (charge/active), violet secondary (x402/agent), neutral grays for chrome.
- **Cards**: white with 1px border, ~12px radius, very soft shadow. Generous padding.
- **Typography**: keep current font stack; tighten sizes — page title ~24px semibold, metric values ~28px semibold, labels uppercase tracking-wide muted.

## Layout structure

```
┌────────────┬──────────────────────────────────────────────┐
│            │  Header: title + subtitle | health pills     │
│  Sidebar   ├──────────────────────────────────────────────┤
│            │  ControlBar (Plug / Buy slider / Stop/Reset) │
│  - Logo    ├────────────────────────┬─────────────────────┤
│  - Nav     │                        │  Metric grid 3x2    │
│            │   Hero visual          │  (Solar, Battery,   │
│            │   (EnergyFlow card)    │   Price, Budget,    │
│            │                        │   Spent, Tx)        │
│            │                        ├─────────────────────┤
│  ────────  │                        │ Agent State │Policy │
│  Your      │                        │             │       │
│  Heevee    ├────────────────────────┴─────────────────────┤
│  card      │  Live Payment Ledger (table / mobile cards)  │
│            ├──────────────────────────┬───────────────────┤
│            │  Event Feed              │  History Chart    │
└────────────┴──────────────────────────┴───────────────────┘
```

- **Sidebar (desktop ≥lg)**: fixed-width (240px) left rail with logo, nav items (Dashboard, Energy Flow, Marketplace, Transactions, Agents, Settings — visual only, all link to `/` for now), and a "Your Heevee" status card at bottom (Heevee ID, location, online dot, View Agent Profile button — purely presentational).
- **Mobile/tablet**: sidebar collapses to a top hamburger sheet (use existing `Sheet` ui component). Main column takes full width — preserves the responsive work already done.
- **Header**: simplified — title + subtitle on left, health pills (Online/Producer/x402/Agent) on right as small chips, theme toggle as icon button.
- **Hero visual**: enlarge `EnergyFlow` into a prominent card on the left of the upper grid; keep its current SVG/diagram content but with more breathing room and the surplus/charging/generating chip overlays already present.
- **Metric strip → 3x2 grid** on the right of the hero on desktop; collapses to 2-col on mobile (current behavior).
- **Agent State + Policy** sit side-by-side under the metrics on desktop; stacked on mobile.

## Per-file changes

- **`src/styles.css`**: switch default theme tokens to the light Heevee palette (white bg, slate text, green/violet accents, soft border/shadow tokens). Keep `.dark` overrides for the existing toggle.
- **New `src/components/dashboard/Sidebar.tsx`**: logo + nav list + bottom status card. Desktop fixed, mobile inside a Sheet triggered from Header.
- **`src/components/dashboard/Dashboard.tsx`**: wrap in 2-column flex (sidebar + main); restructure the upper grid into `[hero | metrics+panels]`; keep ledger / event feed / chart rows below.
- **`src/components/dashboard/Header.tsx`**: drop the long subtitle inline; convert health dots to pill chips; add mobile sidebar trigger button; keep offline indicator.
- **`src/components/dashboard/ControlBar.tsx`**: keep current 3-section layout but restyle as a single white card with rounded segments — primary green "Plug in EV & Charge", middle Buy group (BUY label · slider · number · kWh · green Buy button · est cost), right Stop (outline red) + Reset (outline neutral). Mobile stacking already handled.
- **`src/components/dashboard/MetricStrip.tsx`**: restyle cards (icon + uppercase label top row, large value, small unit, subtle status text). Switch to 3-col on desktop, 2-col on mobile.
- **`src/components/dashboard/primitives.tsx`**: update `Section`, `MetricCard`, `HealthDot` to the new card/pill styling.
- **`src/components/dashboard/EnergyFlow.tsx`**: enlarge container, ensure chip overlays render cleanly on the new card background.
- **`PaymentLedger`, `EventFeed`, `HistoryChart`, `PolicyPanel`, `AgentStepper`**: light-theme polish only (borders, muted text, spacing) — no structural rewrites.

## Out of scope
- New routes/pages for sidebar nav items (links are visual only).
- Changing API, polling, control endpoints, or any data shape.
- Replacing the EnergyFlow SVG with a 3D rendered house image (the reference uses a photo; we keep our existing SVG visualization styled to feel similarly prominent).
- Auth, persistence, or new features.

## Verification
- Switch preview to desktop, tablet, and mobile viewports; screenshot each; confirm no horizontal scroll, sidebar collapses on mobile, all existing controls still work, health/offline indicator still updates.
