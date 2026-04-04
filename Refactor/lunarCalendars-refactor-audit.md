# lunarCalendars.js Refactor Audit

Date: 2026-04-04
Source file: `CalendarAPI/Calendars/lunarCalendars.js`

## Purpose

Capture concrete refactor opportunities in `lunarCalendars.js` so they are not lost between sessions.

## Findings (Prioritized)



### 2) Medium: Month return type is inconsistent with broader calendar API

`getUmmalQuraDate` returns `month` as a string (`monthName`), while many other calendar functions return numeric month indexes.

Refactor direction:
- Normalize return contract (for example: numeric `month` plus `other.monthName`).
- If compatibility is needed, stage migration with wrappers.

### 3) Medium: Sunset-after-new-moon fallback can silently return stale value

`timeOfSunsetAfterLastNewMoon` has a fixed `MAX_NEW_MOON_ATTEMPTS` and returns `lastSunset` even if no valid sunset boundary is found.

Refactor direction:
- Make fallback explicit (for example, return structured error state or guarded final recomputation).
- Add invariant checks that returned boundary is `<= currentDateTime`.

### 4) Low: Nested helper hides reusable day-boundary logic

`adjustToSunsetDate` is nested inside `timeOfSunsetAfterLastNewMoon`, but the same pattern (new-moon instant -> local sunset rule -> optional +1 day) appears in other lunar/lunisolar paths.

Refactor direction:
- Promote sunset-boundary conversion to a shared top-level helper with parameters.
- Keep file-level constants for local conventions (Mecca offset/cutoff).

### 5) Low: Constant naming ties behavior to UTC-hour assumption

`MECCA_UTC_HOUR_CUTOFF_FOR_NEXT_DAY` encodes a UTC threshold directly, while logic intent is local-day boundary behavior.

Refactor direction:
- Rename to reflect local convention intent.
- Derive threshold from timezone/boundary helper where possible to reduce magic constants.

## Suggested Implementation Order

1. Stabilize correctness-sensitive output behavior:
   - AH/BH display-year conversion helper
   - fallback validation in `timeOfSunsetAfterLastNewMoon`
2. Align return-shape conventions (`month` semantics) with compatibility plan.
3. Extract reusable sunset-boundary helper and fold constants into clearer naming.

## Notes

- Keep behavior-preserving refactors first; only change displayed output where year rendering is objectively invalid.
- Add focused cases in `Tests/lunarCalendarTests.js` for BH-year boundaries and fallback behavior near new-moon transition instants.
