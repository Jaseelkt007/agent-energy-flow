
# Add Hero Image to Energy Flow Card

Use the uploaded house + solar + EV image as the hero visual inside the "Energy Flow" section, matching the reference layout.

## Approach

- Upload the image to Lovable Assets (CDN pointer JSON in `src/assets/`) so it isn't checked into the repo as a binary.
- Replace the current SVG line diagram in `EnergyFlow.tsx` with the photo, rendered inside a rounded container.
- Overlay **live data chips** on top of the image (instead of the baked-in numbers in the source image, which would go stale):
  - Top-left: ☀ Generating · `solar_kw` kW
  - Right-middle: 🔌 Charging EV · `ev_power_kw` kW (only when plugged in / charging)
  - Bottom: ⚡ Surplus · `max(0, solar_kw - ev_power_kw)` kW
- Keep the existing "kWh → / ← USDC" caption row below the image as a subtle flow indicator.
- The chips reuse the existing card styling (white pill with icon, soft shadow) so they sit on the photo cleanly in both light and dark mode.

## Files

- New `src/assets/heevee-hero.png.asset.json` (CDN pointer created via `lovable-assets`).
- Edit `src/components/dashboard/EnergyFlow.tsx` — swap SVG diagram for the image + absolute-positioned data chips. Maintain responsive height (taller on desktop, shorter on mobile).

## Out of scope
- No API/data changes. Chips read from the same `Snapshot` already passed in.
- No layout changes outside the Energy Flow card.

## Verification
- Desktop + mobile screenshots: image fills the card, chips don't overlap the house awkwardly, values update with snapshot polling.
