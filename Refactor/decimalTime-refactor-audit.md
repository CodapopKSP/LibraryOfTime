# decimalTime.js Refactor Audit

Date: 2026-04-05
Source file: `CalendarAPI/Timekeeping/decimalTime.js`

## Purpose

Capture concrete refactor opportunities in `decimalTime.js` so they are not lost between sessions.

## Findings (Prioritized)

### 1) High: `convertToSwatchBeats` mixes faux-UTC conversion with local getters

`convertToSwatchBeats` applies `createFauxUTCDate(...)` and then reads values using `getHours()/getMinutes()/getSeconds()` instead of UTC getters, which can produce environment-dependent behavior.

Refactor direction:
- Use a single, explicit convention for timezone handling (`createFauxUTCDate` + `getUTC*` methods, or direct UTC arithmetic).
- Add regression tests for `.beat` output in non-UTC local environments.

### 2) Medium: Decimal, hexadecimal, and binary day-fraction conversions duplicate structure

`getRevolutionaryTime`, `getHexadecimalTime`, and `getBinaryTime` all follow the same "day fraction -> base conversion -> pad/format" flow with separate implementations.

Refactor direction:
- Extract a shared day-fraction conversion helper that accepts base/precision/padding settings.
- Keep output-specific wrappers minimal and declarative.

### 3) Medium: `getRevolutionaryTime` second computation is hard to reason about

The decimal-second subtraction chain encodes "seconds per hour" as `REVOLUTIONARY_MINUTES_PER_HOUR * REVOLUTIONARY_MINUTES_PER_HOUR`, which works numerically but obscures intent.

Refactor direction:
- Introduce explicit constants (e.g., `REVOLUTIONARY_SECONDS_PER_HOUR`) and compute residual components step-by-step.
- Add boundary tests at minute/hour rollovers (`xx:99:99` -> next unit).

### 4) Medium: Return contracts are inconsistent within the module

Some functions return prefixed strings (`".ABCD"`), some return plain strings (`"010101..."`), and others expose reusable raw converters.

Refactor direction:
- Document and enforce function-level return contracts (presentation string vs raw scalar).
- Keep internal conversion helpers separate from UI-format wrappers.

### 5) Low: Repeated cloning via `new Date(currentDateTime_.getTime())` adds noise

Multiple functions clone input dates even though no mutation follows.

Refactor direction:
- Remove unnecessary clones where functions are read-only.
- Keep cloning only where mutation safety is required.

### 6) Low: Base constants overlap without a shared naming pattern

`HEX_TIME_FRACTION_BASE` and `BINARY_TIME_FRACTION_BASE` are identical and conceptually represent the same scale.

Refactor direction:
- Consolidate shared constants for equivalent fraction scales.
- Keep per-format constants only for format-specific behavior (radix, width, prefix).

## Suggested Implementation Order

1. Fix timezone/getter consistency in `convertToSwatchBeats` and lock with tests.
2. Clarify revolutionary time decomposition with explicit constants and rollover tests.
3. Extract shared fraction-conversion helpers for decimal/hex/binary paths.
4. Normalize return-contract documentation and tidy low-risk constant/clone cleanup.

## Notes

- Preserve existing visible output text where possible while reducing environment-sensitive behavior.
- Add focused tests for day-boundary and format-boundary outputs before broad deduplication.
