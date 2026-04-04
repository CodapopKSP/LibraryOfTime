# otherCalendars.js Refactor Audit

Date: 2026-04-04
Source file: `CalendarAPI/Calendars/otherCalendars.js`

## Purpose

Capture concrete refactor opportunities in `otherCalendars.js` so they are not lost between sessions.

## Findings (Prioritized)

### 1) High: Negative-year correction in Darian Galilean path is body-specific bug risk

`getDarianGalileanDate` computes year lengths per body in the main loop, but in the negative-time correction branch it hardcodes Io leap logic:

- `daysSince = (isLeapYearIo(year) ? 784 : 776) - daysSince;`

Refactor direction:
- Use the selected body's leap/year-length rule in the correction step.
- Add regression tests for negative-date paths for `Eu`, `Gan`, and `Cal`, not only `Io`.

### 2) High: Unsupported `body` input has no explicit contract

`getGalileanDate` and `getDarianGalileanDate` index lookup tables directly (`GALILEAN_EPOCHS[body]`, `GALILEAN_CIRCAD_HOURS[body]`) and continue without explicit validation.

Refactor direction:
- Add early guard for unsupported body keys.
- Return a structured error/sentinel (or throw) consistently instead of allowing undefined access propagation.

### 3) Medium: Leap-year rule families are deeply duplicated and hard to verify

Both Galilean variants define four nested leap calculators each, with similar structure but separate copies.

Refactor direction:
- Extract body/rule-specific leap helpers to top-level named functions.
- Parameterize year-length and month-table selection through a shared resolver.

### 4) Medium: `getPawukonCalendarDate` uses raw `new Date(...)` stepping loop

Epoch back-stepping uses:

- `new Date(newEpoch.getTime() - stepMs)`

inside a loop.

Refactor direction:
- Replace with project date/time utilities where feasible.
- Isolate epoch-normalization into a reusable helper to avoid raw constructor use in calendar logic.

### 5) Medium: Type-shape ambiguity from string-initialized month arrays

Several functions initialize `daysInMonthsArray` as `''` then replace with arrays by branch.

Refactor direction:
- Initialize with `null`/array and enforce explicit validation before iteration.
- Improve branch contract so "no matched body" cannot reach month loop.

### 6) Low: Unused parameter in `getDarianTitanDate`

`getDarianTitanDate(currentDateTime, body)` does not use `body`.

Refactor direction:
- Remove unused parameter (or document reserved API intent if signature must remain stable).
- Add lint/test guard to catch future dead-parameter drift.

### 7) Low: Provenance comments indicate untracked domain assumptions

Multiple leap rules include comments like "original formula doesn't make sense to me, so I added my own."

Refactor direction:
- Replace with concise rationale and source note per rule set.
- Centralize assumptions in constants/helpers so future changes are auditable.

## Suggested Implementation Order

1. Fix correctness-sensitive behavior first:
   - Darian Galilean negative-year body handling
   - explicit unsupported-body guard
2. Extract/shared leap and year-length resolver helpers for Galilean families.
3. Normalize construction/iteration safety:
   - replace raw `new Date(...)` loop in Pawukon path
   - remove string-initialized array placeholders
4. Cleanup maintenance items:
   - unused `body` parameter in Titan
   - provenance/documentation improvements for leap formulas

## Notes

- Keep external output formatting stable while hardening internal contracts.
- Add focused tests in `Tests/otherCalendarTests.js` around negative-year and unsupported-body behavior before broader cleanup.
