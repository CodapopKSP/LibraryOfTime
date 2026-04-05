# timeFractions.js Refactor Audit

Date: 2026-04-05
Source file: `CalendarAPI/Timekeeping/timeFractions.js`

## Purpose

Capture concrete refactor opportunities in `timeFractions.js` so they are not lost between sessions.

## Findings (Prioritized)

### 1) High: `calculateSecond` appends synthetic digits that are not real precision

After formatting to hundredths, `calculateSecond` generates extra digits by incrementing the hundredths digit in a loop, which can be misleading if callers interpret the full string as measured precision.

Refactor direction:
- Separate "display embellishment" from "true computed precision" in function naming/contracts.
- Add tests that define whether this function is aesthetic output or numeric fraction output.

### 2) Medium: Decade/century/millennium functions are structurally duplicated

`calculateDecade`, `calculateCentury`, and `calculateMillennium` share nearly identical logic with only unit span differences.

Refactor direction:
- Extract a generic `calculateEraFraction(spanYears)` helper.
- Keep wrappers for readability and backward compatibility.

### 3) Medium: `calculateMonth` uses an implicit "day 0" pattern that obscures intent

Month boundary computation relies on `createAdjustedDateTime({ ..., day: 0 })` for both this and next month, which works but is harder to understand quickly.

Refactor direction:
- Replace with explicit start-of-month and start-of-next-month date creation.
- Document month-length derivation assumptions in a short inline comment.

### 4) Medium: Timezone policy is implicit and inconsistent by unit

Some functions always use UTC components (`calculateMinute`), while others require explicit timezone offsets (`calculateHour` and larger units).

Refactor direction:
- Document intended timezone semantics per unit (absolute vs local-observer fraction).
- Optionally standardize signatures so offset handling is explicit across the module.

### 5) Low: Repeated denominator constants can be centralized

Several unit converters repeat equivalent literal relationships (`60`, `3600`, `86400`, etc.) under separate constant groups.

Refactor direction:
- Consolidate shared time-unit constants at module scope.
- Keep unit-specific names only where they improve readability.

### 6) Low: Fraction range guarantees are not explicitly tested/documented

Most functions imply output in `[0, 1)`, but this constraint is not codified in tests.

Refactor direction:
- Add boundary tests at exact unit rollovers to enforce range behavior.
- Document whether exact endpoint inputs should yield `0` or `1` semantics.

## Suggested Implementation Order

1. Clarify and lock `calculateSecond` contract (true precision vs display pattern).
2. Extract and adopt a generic era-fraction helper for decade/century/millennium.
3. Make month-boundary calculations explicit and document timezone semantics.
4. Consolidate constants and add boundary-range tests.

## Notes

- Preserve current visible behavior unless precision semantics are explicitly redefined.
- Add targeted tests around boundary transitions (second/minute/day/month/year/era) before broad refactors.
