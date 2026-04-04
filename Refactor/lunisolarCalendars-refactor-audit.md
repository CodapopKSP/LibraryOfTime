# lunisolarCalendars.js Refactor Audit

Date: 2026-04-04
Source file: `CalendarAPI/Calendars/lunisolarCalendars.js`

## Purpose

Capture concrete refactor opportunities in `lunisolarCalendars.js` so they are not lost between sessions.

## Findings (Prioritized)

### 1) High: Hebrew return object reports incorrect day field

`calculateHebrewCalendar` computes `dayOfMonth`, but returns `day: daysThisYearSoFar` (0-based residual counter) instead of `dayOfMonth`.

Refactor direction:
- Return `day: dayOfMonth`.
- Add regression tests asserting returned object fields, not only formatted output.

### 2) High: Sexagenary year depends on parsing formatted display text

`getSexagenaryYear` derives year via `String(chineseStr).split('年')[0]`, which couples logic to localized output format.

Refactor direction:
- Use structured year value from `getChineseLunisolarCalendarDate` return object.
- Keep display formatting isolated from arithmetic logic.

### 3) Medium: Country branches duplicate logic and Korea path has repeated year adjustment

`getChineseLunisolarCalendarDate` repeats near-identical branch code for China/Vietnam/Korea. The Korea branch decrements year before and after `KOREA_YEAR_OFFSET`, increasing drift risk.

Refactor direction:
- Extract a shared helper parameterized by timezone/year offset/leap suffix/zodiac set.
- Consolidate year-boundary correction to a single calculation point per branch.

### 4) Medium: Raw `new Date(...)` use in calendar math paths

The file uses raw `new Date(...)` in several correctness-sensitive functions (`calculateFirstMonthWithoutMajorSolarTerm`, `getMonthStartFromNewMoon`, `getBabylonianYearStart`, etc.).

Refactor direction:
- Prefer project utilities (`createAdjustedDateTime`, `createFauxUTCDate`) for construction and timezone interpretation.
- Keep raw `Date` only where required for low-level timestamp operations.

### 5) Medium: Lunation index uses rounded mean synodic approximation

`getLunisolarCalendarDate` infers month index with `Math.round(... / 29.53)` style calculations. Near conjunction boundaries this can misclassify month index or leap-month placement.

Refactor direction:
- Prefer boundary-based lunation counting from computed month starts over floating approximation.
- If approximation remains, guard with explicit correction checks against neighboring new moons.

### 6) Low: Unclear parameter naming and dead-style flags

`getMonthEleven(..., weirdShitAroundSolstice)` uses unclear naming and optional behavior that is hard to reason about.

Refactor direction:
- Replace with explicit option naming (for example `searchPreviousLunation`).
- Document the exact boundary case the flag is intended to resolve.

### 7) Low: Country fallback behavior is implicit

`getChineseLunisolarCalendarDate` has no explicit default branch return for unsupported country values.

Refactor direction:
- Add explicit fallback (`throw`/sentinel/structured error) to avoid undefined propagation.

## Suggested Implementation Order

1. Fix correctness-sensitive data-path issues:
   - Hebrew `day` return field
   - Sexagenary structured-year extraction
2. De-duplicate Chinese/Vietnam/Korea branch logic and normalize year-boundary handling.
3. Replace raw `new Date(...)` in high-risk date math paths where project utilities apply.
4. Improve naming and fallback contracts for long-term maintainability.

## Notes

- Prioritize behavior-preserving refactors except where return-field correctness is objectively wrong.
- Extend `Tests/lunisolarCalendarTests.js` with object-field assertions (not only `out(...)` string checks), especially for Hebrew/Babylonian/sexagenary helpers.
