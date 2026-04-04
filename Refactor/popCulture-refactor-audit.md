# popCulture.js Refactor Audit

Date: 2026-04-04
Source file: `CalendarAPI/Other/popCulture.js`

## Purpose

Capture concrete refactor opportunities in `popCulture.js` so they are not lost between sessions.

## Findings (Prioritized)

### 1) High: `getShireDate` day-offset rounding can shift calendar day near boundaries

`getShireDate` computes:

- `Math.round((midnight.getTime() - shireEpochUTC.getTime()) / SHIRE_MS_PER_DAY)`

Rounding is fragile for boundary cases and can move dates by a day if upstream values drift off exact midnight.

Refactor direction:
- Use explicit day-difference helpers (or integer floor strategy tied to normalized midnight values).
- Add regression tests for dates immediately before/after Shire day boundaries.

### 2) Medium: `getTamrielicDate` parses a formatted Gregorian string for arithmetic

The function extracts day/month/weekday by splitting `getGregorianDateTime(...).date` display text.

Refactor direction:
- Use structured fields from `getGregorianDateTime` directly (`day`, `month`, `dayOfWeek`) instead of parsing localized output.
- Keep Elder Scrolls naming conversion purely as presentation mapping.

### 3) Medium: Return contracts are inconsistent across pop-culture functions

Some functions return strings (`getMinecraftTime`, `getTamrielicDate`, `getShireDate`, `getStardate`), while others also accept timezone offsets or return different shape conventions.

Refactor direction:
- Define a consistent contract for pop-culture APIs (formatted string only vs structured object + output).
- Document each function's expected call signature and output shape.

### 4) Medium: Fractional time conversion logic is duplicated

`getMinecraftTime`, `getInceptionDreamTime`, and `getTerminaTime` each re-implement similar elapsed-time decomposition (days/hours/minutes/seconds).

Refactor direction:
- Extract shared helper(s) for elapsed-time breakdown and zero-padding.
- Keep per-universe constants and day-start conventions in lightweight wrappers.

### 5) Low: `getStardate` omits timezone normalization unlike neighboring functions

Most file functions normalize with `createFauxUTCDate(..., timezoneOffset)`, but `getStardate` takes raw date input only.

Refactor direction:
- Either normalize inside `getStardate` or clearly document that caller must pass pre-normalized input.
- Add tests to lock intended timezone behavior.

### 6) Low: Imperial fraction formatting relies on implicit numeric coercion

`getImperialDatingSystem` multiplies `calculateYear(...).toFixed(3)` by `1000`, then concatenates without explicit zero-padding policy.

Refactor direction:
- Make fraction formatting explicit (rounding, padding width, integer conversion).
- Add output-format tests for boundary fractions (`.000`, `.999`, and year rollover).

## Suggested Implementation Order

1. Fix correctness-sensitive day-boundary behavior in `getShireDate`.
2. Remove display-string parsing dependency in `getTamrielicDate`.
3. Decide and codify pop-culture return/signature conventions.
4. Extract shared elapsed-time helpers and tighten Imperial/Stardate formatting contracts.

## Notes

- Preserve current visible output text where possible while improving internal stability.
- Add focused tests in `Tests/popCultureTests.js` for day-boundary and formatting edge cases before broad refactors.
