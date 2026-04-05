# otherTime.js Refactor Audit

Date: 2026-04-05
Source file: `CalendarAPI/Timekeeping/otherTime.js`

## Purpose

Capture concrete refactor opportunities in `otherTime.js` so they are not lost between sessions.

## Findings (Prioritized)

### 1) High: Prime meridian functions are heavily duplicated across moons

`getIoPrimeMeridianTime`, `getEuropaPrimeMeridianTime`, `getGanymedePrimeMeridianTime`, `getCallistoPrimeMeridianTime`, and `getTitanPrimeMeridianTime` repeat the same algorithm with only constants changed.

Refactor direction:
- Extract a shared prime-meridian calculator that accepts `{ epoch, circadHours, cycleLength }`.
- Keep current exported function names as thin wrappers around that helper.

### 2) Medium: Time decomposition and formatting logic is repeated

Each function recomputes hour/minute/second decomposition and zero-padding manually.

Refactor direction:
- Reuse a shared fractional-day-to-`HH:MM:SS` helper for both MTC and prime meridian outputs.
- Keep per-system text labels (`"Circad X | ..."`) isolated in final formatting wrappers.

### 3) Medium: Epoch/frequency constants are fragmented and hard to compare

Each moon defines a separate block of mostly repeated constants (`*_HOURS_PER_DAY`, `*_MINUTES_PER_HOUR`, `*_PAD_LENGTH`, etc.).

Refactor direction:
- Consolidate shared constants at module scope and keep only body-specific parameters in per-body config objects.
- Build a single table-driven structure to reduce naming drift risk.

### 4) Medium: Return contract is presentation-only and not structured

Functions return formatted strings directly, which limits reuse for calculations or alternative UI formatting.

Refactor direction:
- Introduce an internal structured representation (`{ circad, hour, minute, second }`) and format only at the edge.
- Preserve existing external string output for backward compatibility.

### 5) Low: Fraction-normalization code pattern is repeated

The "fractional part with negative-value correction" snippet appears in every prime meridian function.

Refactor direction:
- Extract a single helper for normalized positive fractional parts.
- Reuse it across all cyclical-time calculations in this module.

### 6) Low: Naming and organization can better surface intent

The file mixes Mars MTC and multiple moon prime-meridian systems without a shared abstraction boundary.

Refactor direction:
- Group related logic by domain (`MTC`, `Jovian moons`, `Titan`) with common helper section.
- Add brief comments for constants whose units are non-obvious (Earth days vs body circad hours).

## Suggested Implementation Order

1. Extract a table-driven prime-meridian engine and migrate moon wrappers.
2. Deduplicate time decomposition/formatting helpers and fractional normalization.
3. Introduce internal structured outputs while preserving existing external strings.
4. Consolidate constants and reorganize module sections for readability.

## Notes

- This file is ideal for behavior-preserving deduplication because algorithms are already parameterized by constants in practice.
- Add/extend focused tests before and after migration to ensure exact string parity for representative timestamps.
