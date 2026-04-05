# computingTime.js Refactor Audit

Date: 2026-04-05
Source file: `CalendarAPI/Timekeeping/computingTime.js`

## Purpose

Capture concrete refactor opportunities in `computingTime.js` so they are not lost between sessions.

## Findings (Prioritized)

### 1) High: `getJulianEphemerisDay` applies Delta T in the wrong direction

`getJulianEphemerisDay` currently subtracts `getDeltaT(...)` from the input timestamp before calling `getJulianDayNumber`.

Refactor direction:
- Align the transformation with the intended timescale conversion and centralize it in a small helper (`UT -> TT` and `TT -> UT`) used by `getTT`, `getJulianEphemerisDay`, and dynamical-time helpers.
- Add focused tests around this conversion path to prevent future sign regressions.

### 2) High: Date mutation/local-setter usage in `getTAI` and `getTT` is fragile

`getTAI` and `getTT` use `setSeconds(...)` on mutable `Date` objects, which couples behavior to local setter semantics and can be harder to reason about than direct UTC/timestamp arithmetic.

Refactor direction:
- Convert these functions to pure timestamp math (`getTime()` +/- seconds*1000) and return fresh `Date` objects.
- Keep leap-second offsets and Delta T application explicit in one place.

### 3) Medium: Leap-second counting logic is duplicated across GPS and TAI

`getGPSTime` and `getTAI` each repeat nearly the same loop over leap-second arrays.

Refactor direction:
- Extract a shared helper (`countElapsedLeapSeconds`) that accepts a leap-second table and target timestamp.
- Cache parsed leap-second timestamps to avoid repeated `new Date(...)` parsing per call.

### 4) Medium: Computing-time APIs have inconsistent return contracts

The file mixes numeric outputs, `Date` objects, ISO strings, and formatted strings depending on function.

Refactor direction:
- Define a clear return-shape policy for timekeeping functions (raw value vs formatted value vs structured object).
- Keep formatting concerns at the display layer where possible.

### 5) Low: Ordinal date format can become ambiguous over long ranges

`getOrdinalDate` hardcodes a year base (`2000`) with 2-digit padding, yielding a compact format that is less explicit about era/range.

Refactor direction:
- Document the compact format contract (`YYDDD`-style) in code comments/tests.
- Consider a fully explicit output mode in parallel if this value is consumed outside UI display.

### 6) Low: Several wrappers repeat near-identical offset arithmetic

Helpers such as `getDynamicalTimeForward`, `getDynamicalTimeBackward`, `getMarsSolDate`, and `getJulianSolDate` each implement similar "derive then offset" flows.

Refactor direction:
- Extract tiny internal helpers for "seconds-to-ms adjustment" and "derived date scalar offset".
- Keep public function names intact but reduce repeated arithmetic boilerplate.

## Suggested Implementation Order

1. Correct and test UT/TT/Delta-T conversion direction in `getJulianEphemerisDay`.
2. Replace mutable `setSeconds(...)` patterns with timestamp-based helpers.
3. Deduplicate leap-second counting and pre-parse leap-second tables.
4. Standardize return-shape expectations and clean up low-risk arithmetic duplication.

## Notes

- Prioritize behavior-preserving cleanup except where timescale-sign behavior is objectively incorrect.
- Extend `Tests/computingTimeTests.js` with dedicated assertions for TT/JED conversion boundaries before broader refactors.
