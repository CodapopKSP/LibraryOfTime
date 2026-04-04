# solilunarCalendars.js Refactor Audit

Date: 2026-04-04
Source file: `CalendarAPI/Calendars/solilunarCalendars.js`

## Purpose

Capture concrete refactor opportunities in `solilunarCalendars.js` so they are not lost between sessions.

## Findings (Prioritized)



### 2) Medium: Month-start search can return `undefined` without contract

`getTogysStartOfMonth` searches back up to 35 days and returns only on match; no explicit fallback return contract is documented.

Refactor direction:
- Return explicit sentinel or throw on failure.
- Centralize failure handling so callers (`getTogysDate`, `getTogysNewYear`) do not proceed with undefined values.

### 3) Medium: Heavy recomputation and duplicate candidates in new-year scan

`getTogysNewYear` repeatedly calls `getTogysStartOfMonth` while stepping by ~25 days, which can generate duplicate month starts and repeated astronomy work.

Refactor direction:
- Deduplicate `togysMonthStarts` by timestamp before validation.
- Cache repeated expensive astronomical lookups within a single call.

### 4) Medium: Raw `new Date(...)` usage in date-construction paths

The file uses multiple raw `new Date(...)` constructions in month/day boundary functions.

Refactor direction:
- Prefer project utilities (`createAdjustedDateTime`, `createFauxUTCDate`) where possible.
- Keep raw `Date` only where low-level timestamp copying is required.

### 5) Low: Magic-number constants obscure domain assumptions

Core logic uses unlabelled numeric thresholds (`35`, `25`, `27.3`, `27.5`, `< 15`) directly in algorithms.

Refactor direction:
- Promote to named constants with rationale comments.
- Keep one place for tuning assumptions and historical source notes.

### 6) Low: Right-ascension crossing check has boundary ambiguity

`isTogysStartOfMonth` uses strict `<`/`>` threshold crossing; equality cases (exact match) or wrap-around semantics are not explicitly handled.

Refactor direction:
- Add explicit crossing helper with documented inclusive/exclusive behavior.
- Add tests for threshold-touch and near-wrap edge cases.

## Suggested Implementation Order

1. Stabilize correctness-sensitive failure handling:
   - `getTogysStartOfMonth` explicit return contract
   - `getTogysNewYear` empty-candidate guard
2. Reduce duplicate/expensive work in new-year detection.
3. Normalize date-construction utilities and replace magic numbers with named constants.
4. Tighten right-ascension crossing semantics with focused tests.

## Notes

- Keep external output format unchanged while hardening internals.
- Extend `Tests/solilunarCalendarTests.js` with failure-path and boundary-case coverage (candidate window miss, exact RA threshold, duplicate candidate handling).
