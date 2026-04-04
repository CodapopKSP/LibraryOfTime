# proposedCalendars.js Refactor Audit

Date: 2026-04-04
Source file: `CalendarAPI/Calendars/proposedCalendars.js`

## Purpose

Capture concrete refactor opportunities in `proposedCalendars.js` so they are not lost between sessions.

## Findings (Prioritized)

### 1) High: Negative-year handling in `getSymmetry010Date` has off-by-one risk

The BCE path mutates `symmetryYear` and `daysSinceEpoch` with a custom loop that decrements year after adding year length, then conditionally re-adjusts again.

Refactor direction:
- Replace with a single normalized "resolve year + day index" helper used for both positive and negative ranges.
- Add boundary tests around epoch-adjacent dates and year transitions for BCE output.

### 2) Medium: Invariable and World calendar implementations are duplicated

`getInvariableCalendarDate` and `getWorldCalendarDate` share nearly identical logic for leap detection, day-of-year slicing, extra-day suppression, and output formatting.

Refactor direction:
- Extract a shared fixed-calendar helper parameterized by month/day tables and weekday offset rules.
- Keep only calendar-specific constants in each wrapper.

### 3) Medium: Return contract is inconsistent and stringly typed

Some functions return numeric `month`/`day`, while Invariable/World return values like `day: invariableDate` (string with trailing space) and `dayOfWeek: invariableWeek` (prefixed newline).

Refactor direction:
- Normalize structured return fields (`day`, `month`, `year`, `dayOfWeek`) to typed values.
- Build display-only formatting in `output`, not in structural fields.

### 4) Medium: Weekday derivation is split across different conventions without explicit shared policy

`getSymmetry454Date`, `getSymmetry010Date`, Invariable, and World each compute weekday differently (day index mod, Gregorian UTC day, and hand offsets).

Refactor direction:
- Introduce a small shared weekday policy helper per calendar family.
- Document weekday anchor assumptions next to constants to reduce regression risk.

### 5) Low: Positivist day-name indexing lacks explicit out-of-range guard

`POSITIVIST_DAYS_ARRAY[daysSinceThisYearEpoch]` assumes computed index always matches year-length expectations.

Refactor direction:
- Add explicit bounds checks for defensive correctness.
- Add focused tests for non-leap/leap year tail days (festival boundaries).

### 6) Low: Naming drift in World/Invariable local variables obscures intent

`getWorldCalendarDate` still uses `invariableMonth` / `invariableDate` variable names, increasing cognitive load.

Refactor direction:
- Rename shared local variables to neutral names (`calendarMonth`, `calendarDay`, etc.).
- Keep naming consistent with extracted shared helper.

## Suggested Implementation Order

1. Stabilize correctness-sensitive year-resolution logic:
   - `getSymmetry010Date` BCE/epoch boundary behavior
2. Extract shared fixed-calendar engine for Invariable/World.
3. Normalize return-shape contracts and keep formatting isolated in `output`.
4. Add defensive bounds checks and naming cleanup in Positivist/World wrappers.

## Notes

- Prioritize behavior-preserving refactors except where boundary output is objectively inconsistent.
- Extend `Tests/proposedCalendarTests.js` with BCE boundary and intercalary-day weekday assertions before broad deduplication.
