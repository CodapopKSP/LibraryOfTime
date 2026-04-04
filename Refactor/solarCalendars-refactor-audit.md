# solarCalendars.js Refactor Audit

Date: 2026-04-04
Source file: `CalendarAPI/Calendars/solarCalendars.js`

## Purpose

Capture concrete refactor opportunities in `solarCalendars.js` so they are not lost between sessions.

## Findings (Prioritized)

### 1) High: Egyptian day math has boundary/off-by-one risk

In `getEgyptianDate`, `currentDayOfYear` is 1-based, but `dayOfSeason` and `dayOfMonth` are computed using `%` directly. At boundaries this can yield `0` for day-of-month and can produce an invalid intercalary index.

Refactor direction:
- Use a zero-based intermediate (`dayIndex = currentDayOfYear - 1`).
- Derive season/month/day from `dayIndex`.
- Keep `day` strictly 1-based in output.

### 2) High: ISO week number uses `Math.round` on millisecond difference

`getISOWeekDate` currently computes week number using rounded millisecond delta. This is fragile if any time-of-day variance enters the calculation.

Refactor direction:
- Normalize both dates to start-of-day first.
- Use integer day math and `Math.floor`.

### 3) Medium: Logic depends on parsing display strings

`getAnnoLucisDate` and `getSocietyForCreativeAnachronismDate` split the formatted `getGregorianDateTime(...).date` string to recover components.

Refactor direction:
- Use structured fields directly (`day`, `month`, `year`, `dayOfWeek`) from `getGregorianDateTime`.
- Build output strings separately from date arithmetic.

### 4) Medium: Coptic and Ethiopian implementations are duplicated

`getCopticDate` and `getEthiopianDate` share near-identical core logic with different constants.

Refactor direction:
- Extract shared helper (for 13-month Alexandrian-style calculations).
- Parameterize epoch, month labels, weekday labels, and day-start weekday rule.

### 5) Medium: Florentine/Pisan/Venetian share repeated Julian conversion logic

All three perform similar "adjust date -> convert Gregorian to Julian -> apply year-rule -> AD/BC output formatting" logic.

Refactor direction:
- Extract shared helper for Julian-derived civil variants.
- Keep each calendar's start-of-day and year-boundary rule as parameters.

### 6) Medium: Inconsistent `month` return semantics

Across functions, `month` is variously 0-based index, 1-based number, or a string.

Refactor direction:
- Normalize return contract (for example: always return `month` as 0-based index and optional `other.monthName`).
- If API compatibility is required, stage migration with wrappers.

### 7) Low: Repeated inline equinox-adjustment helper patterns

Bahai and Solar Hijri each define nested helper functions that adjust equinox behavior around local sunset/noon.

Refactor direction:
- Move to shared top-level utility with parameters for timezone and pivot-time rule.

### 8) Low: Date utility consistency cleanup

Multiple raw `new Date(...)` constructions are used in calendar logic blocks.

Refactor direction:
- Prefer project date utilities (`createAdjustedDateTime`, `createFauxUTCDate`) where possible.
- Keep raw `Date` only where necessary for low-level timestamp operations.

## Suggested Implementation Order

1. Fix correctness-sensitive boundaries:
   - `getEgyptianDate`
   - `getISOWeekDate`
2. Remove format-string parsing in:
   - `getAnnoLucisDate`
   - `getSocietyForCreativeAnachronismDate`
3. Extract shared helpers for duplicated algorithm families:
   - Coptic/Ethiopian
   - Florentine/Pisan/Venetian
4. Normalize return-shape conventions (`month` semantics) with compatibility plan.

## Notes

- Prioritize behavior-preserving refactors first unless a bug fix is explicit.
- Add or update focused tests in `Tests/solarCalendarTests.js` while touching calendar math.
