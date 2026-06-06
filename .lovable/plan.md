## Goal
Replace the fixed "Buy 1.1 kWh" button in the sticky ControlBar with an inline custom-kWh purchase control that lets the user pick any amount via a slider + number input, then confirm the purchase.

## Changes

### 1. ControlBar — custom purchase input
- Remove the existing `Buy 1.1 kWh` outline button.
- Add an inline compact form in its place:
  - A small slider (`type="range"`) for kWh selection, range **0.1 – 10 kWh**, step **0.1 kWh**.
  - A number input (`type="number"`) showing the exact value, same min/max/step.
  - A "Buy" button that POSTs `{ kwh: <selected> }` to `/control/buy` on click.
  - Show the estimated cost next to the value (value × current producer price per kWh from snapshot).
- Wrap with the existing `run()` helper for loading + toast feedback.
- Use the same tabular font and existing ControlBar button / border styles to match the dashboard's quiet, precise tone.

### 2. No other file changes
- The `/control/buy` API endpoint already accepts a variable `kwh` number — no backend or API-layer changes needed.
- Other buttons (Plug in EV, Stop, Reset) remain exactly as-is.

## Design details
- Slider styled with the existing `accent-[var(--accent)]` and `bg-border` track to match PolicyPanel sliders.
- Number input uses the same `.tabular`, `w-20`, `rounded-md`, `border-border` style as PolicyPanel.
- The group wraps via `flex-wrap` on narrow viewports (already supported by the ControlBar).

## Out of scope
- No new backend endpoints or API types.
- No changes to EV auto-charge logic, ledger, charts, or event feed.
- No persistence beyond existing snapshot polling.