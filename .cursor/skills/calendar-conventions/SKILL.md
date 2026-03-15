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

1. **Year numbering and BCE**
   - The project uses **Gregorian proleptic dates with a real year 0**.
   - That means:
     - `... 2 BCE, 1 BCE, 1 CE ...` becomes `... -2, -1, 1 ...` (year 0 sits between 1 BCE and 1 CE).
     - In general, **N BCE is written as year `-N`** in all code, tests, and examples.  
       - Example: “385 BCE” → `-385`, not `-384`.
   - When a user gives a BCE year in prose (e.g. “sunset on 15 April 385 BCE, UTC+3”), **use that numeric year directly with a leading minus** and do not shift it by ±1.

2. **Prefer `createAdjustedDateTime` over raw `Date` construction**
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

## Structure: main function and load-time safety

1. **Prefer logic inside the calendar’s main function**
   - Put the calendar’s behavior in the **main function** (the one called from `nodeUpdate.js`: e.g. `getXxxDate`, `getXxxCalendar`). Call helpers from there; avoid scattering logic at top level.
   - **Exceptions** (extract to helpers, still called from the main function or its callees):
     - A calculation is **reused** in several places within the same calendar.
     - A **long or complex** calculation affects only a small part of the result (e.g. one sub-step); extracting it keeps the main function readable.
   - When in doubt, keep logic inside the main function.

2. **Avoid load-time dependency on other scripts**
   - Scripts load in a fixed order in `index.html`. Calendar files (e.g. `lunisolarCalendars.js`) often load **before** `utilities.js`. Do **not** run code at top level that calls `createAdjustedDateTime`, `getMoonPhase`, `getNewMoon`, or any other API from another file — at load time those may be undefined and will throw.
   - **Safe at top level:** Pure data (month names, leap-year indices, timezone strings) and function definitions. No invocation of helpers from other modules. However, even data should still go in the main function.
   - **Unsafe at top level:** Epochs or caches built with `createAdjustedDateTime` or astronomical functions. Build those **inside** the main function (or a helper called from it), or use **lazy initialization** (e.g. a getter that creates the epoch on first use, when all scripts have loaded).

3. **Summary**
   - Main function = single entry point; logic lives there or in helpers it calls.
   - Top level = data and declarations only; no calls into `utilities.js` or `astronomicalData.js` at load time.

---

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

- [ ] Logic lives in the main function (or helpers called from it); no top-level calls to `createAdjustedDateTime`, `getMoonPhase`, or other modules (avoids load-order errors).
- [ ] Epoch/anchor is defined as a specific Gregorian date in a named local timezone.
- [ ] All core date construction uses `createAdjustedDateTime` (or higher-level helpers that rely on it), not raw `Date` constructors.
- [ ] Timezone offsets are handled via explicit `UTC±HH:MM` strings or numeric minute offsets, not implicit environment time.
- [ ] Day-boundary rules (if non-midnight) use `getWeekdayAtTime` (for weekdays) and anchor-based `differenceInDays` calculations (for day counts) or an equivalent helper, not ad-hoc comparisons.
- [ ] Date arithmetic (`+days`, `+years`) consistently uses `addDay` / `addYear` with a clear choice about mutation.
- [ ] Any use of leap seconds or specialized timescales relies on shared data structures in `utilities.js` where possible.

