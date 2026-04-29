---
name: description-tooltip-interaction
description: Implement or refactor description panel tooltip triggers with exact desktop/mobile interaction parity. Use when editing `UserInterface/descriptionPanel.js` or related CSS for epoch/confidence tooltips, hover/tap behavior, hit areas, and trigger sizing.
---

# Description Tooltip Interaction

## Goal

Make tooltip triggers behave as a single control with correct hit area:
- Desktop: hover-driven open (no random wide hover zones)
- Mobile: tap/click-driven toggle
- Trigger surface: the real target element, not an overlay shim

## Required Pattern

1. Use one trigger element per control (`.clickable-*` on the actual cell/button).
2. Attach both desktop and mobile behavior to that same trigger element.
3. Do not create a second nested/overlay button just to emulate size.
4. Keep cursor pointer only on the trigger, never on the full container row.
5. Keep desktop hover selectors scoped to the trigger (or trigger + tooltip), not the whole section.

## Implementation Rules

- If the cell should be clickable, make that cell/button the literal trigger.
- Keep table/cell sizing native unless a change is strictly required.
- For mobile-only toggles:
  - gate with `window.matchMedia('(max-width: 1024px)').matches`
  - close on outside click, Escape, scroll, and layout change when needed
- For desktop hover:
  - allow moving from trigger into tooltip without immediate close
  - avoid `container:hover` rules that enlarge trigger area unexpectedly

## Anti-Patterns (Do Not Use)

- Wrapper `:hover` on `.nodeinfo-*` that opens tooltip for full-width regions.
- `display: contents`/overlay hacks to fake trigger dimensions.
- Separate desktop trigger element and mobile trigger element for the same control.

## Quick Validation Checklist

- Desktop:
  - Hover area matches only intended cell bounds.
  - Pointer cursor appears only over the intended cell.
  - Tooltip does not open when hovering unrelated empty width.
- Mobile:
  - Tooltip does not auto-open on panel open.
  - Tap on the cell toggles tooltip reliably.
  - Tap outside closes tooltip.
- Regression:
  - Epoch behavior remains unchanged when updating Confidence behavior.
