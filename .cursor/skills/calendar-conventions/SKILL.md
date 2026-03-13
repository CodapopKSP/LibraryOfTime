---
name: calendar-conventions
description: Encodes conventions and logic patterns for building calendars and timekeeping systems in the Library of Time project, including preferred use of utilities like createAdjustedDateTime, timezone handling, and epoch selection. Use when implementing or refactoring calendar logic so behavior matches existing systems.
---

# Calendar Conventions for Library of Time

## When to use this skill

Use this skill whenever you:
- Implement a new calendar or non-calendar timekeeping system in the **Calendar API layer** (`CalendarAPI/Calendars/*`, `CalendarAPI/Timekeeping/*`, `CalendarAPI/Other/*`).
- Refactor or extend existing calendar logic.
- Need to decide how to handle timezones, epochs, or day boundaries.

## Core date/time conventions

1. **Prefer `createAdjustedDateTime` over raw `Date` construction**
   - Use `createAdjustedDateTime` for any logic that depends on:
     - Specific years, months, days in historical ranges.
     - Non-UTC local timezones (e.g., Egyptian calendars in Egypt’s local time).
     - Hour enums like `MIDNIGHT`, `SUNRISE`, `NOON`, `SUNSET`.
   - Avoid `new Date(year, monthIndex, day, ...)` and `new Date(Date.UTC(...))` directly; they have pitfalls:
     - JavaScript treats years 1–99 as 1901–1999.
     - Months are 0–11 instead of 1–12.
     - Timezone handling is implicit and easy to get wrong.

2. **Always think in terms of an explicit epoch / anchor date**
   - For each system, define a clear **anchor Gregorian date in the appropriate local timezone** (not an abstract JDN by default).
   - Implement conversions as offsets from that anchor:
     - Calendar date → days/seconds offset from anchor → Gregorian in local time.
     - Gregorian in local time → offset from anchor → calendar date.
   - Keep epochs and anchor choices documented near the code that uses them.

3. **Timezone handling**
   - Use UTC-style offset strings like `UTC+02:00` and convert them with `convertUTCOffsetToMinutes`.
   - When you need a “local” view of a moment in a given timezone:
     - Start from a UTC-based `Date`.
     - Use `createAdjustedDateTime` or `createFauxUTCDate` with the appropriate offset.
   - Avoid relying on the host environment’s local timezone.

4. **Day-boundary logic**
   - When a calendar defines the “start of day” as something other than local midnight (e.g., sunrise or sunset):
     - Use `getWeekdayAtTime(currentDateTime, afterTime, timezone)` with hour enums (`SUNRISE`, `SUNSET`, etc.) to compute the **effective weekday index only** (0–6).
     - Compute the **day count and calendar date** separately using anchor dates and `differenceInDays`, as in the existing Coptic, Ethiopian, Baháʼí, Solar Hijri, Qadimi, and Hebrew implementations.
   - Do not reimplement custom weekday-boundary logic with raw `Date` arithmetic if `getWeekdayAtTime` already matches the intended behavior.

## Implementation patterns

1. **Conversion functions**
   - For each calendar or timekeeping system, prefer a small, explicit set of conversion functions such as:
     - `toGregorian(date, options)`
     - `fromGregorian(gregorianDate, options)`
   - Internally, these should:
     - Use the system’s anchor Gregorian date and local timezone.
     - Use `createAdjustedDateTime` and helpers like `addYear`, `addDay`, and `differenceInDays` for arithmetic.
    - For guidance on which high-level pattern to use (anchor-epoch, equinox-based, JDN-based, cycle-based, etc.) and examples of each, see the `calendar-patterns` skill.

2. **Mutability vs immutability**
   - `addYear` and `addDay` **mutate** the provided `Date` by default.
   - Use `createNew=true` or explicitly clone dates (e.g., `new Date(date)`) when you need pure functions that do not modify inputs.
   - Be consistent within a file: avoid mixing mutating and non-mutating styles for the same conceptual operation unless clearly documented.

3. **Weekday and label calculation**
   - Use `getWeekdayAtTime` for calendars whose weekday changes at a non-midnight boundary.
   - Use shared arrays like `weekNames` and `monthNames` where appropriate, instead of redefining or hardcoding labels.

4. **Leap seconds and specialized timescales**
   - For TAI/GPS/UTC-style computations, use the existing `TAIleapSeconds` and `GPSleapSeconds` arrays in `utilities.js` rather than duplicating leap-second data.
   - Any new timescale using leap seconds should clearly state:
     - Which base timescale it builds on.
     - How it uses existing leap-second tables.

## Checklist for new calendar/timekeeping logic

Before finalizing a new system, verify:

- [ ] Epoch/anchor is defined as a specific Gregorian date in a named local timezone.
- [ ] All core date construction uses `createAdjustedDateTime` (or higher-level helpers that rely on it), not raw `Date` constructors.
- [ ] Timezone offsets are handled via explicit `UTC±HH:MM` strings or numeric minute offsets, not implicit environment time.
- [ ] Day-boundary rules (if non-midnight) use `getWeekdayAtTime` (for weekdays) and anchor-based `differenceInDays` calculations (for day counts) or an equivalent helper, not ad-hoc comparisons.
- [ ] Date arithmetic (`+days`, `+years`) consistently uses `addDay` / `addYear` with a clear choice about mutation.
- [ ] Any use of leap seconds or specialized timescales relies on shared data structures in `utilities.js` where possible.

