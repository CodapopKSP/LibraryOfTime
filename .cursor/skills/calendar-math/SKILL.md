---
name: calendar-math
description: Designs and implements complete calendar and timekeeping calculation modules for the Library of Time project, including algorithms, date conversions, and tests. Use when working on calendar logic, adding a new calendar, or one-shotting an entire calendar implementation from a prompt. Treat `CalendarAPI/Calendars/*`, `CalendarAPI/Timekeeping/*`, and `CalendarAPI/Other/*` as a single Calendar API layer.
---

# Calendar Math for Library of Time

## When to use this skill

Use this skill whenever the user:
- Asks to **add a new calendar** or timekeeping system.
- Wants to **derive calendar formulas** for conversions or date calculations.
- Requests a **one-shot implementation** of a full calendar: algorithms, wiring into the site, and tests.

## Overall workflow

Follow this end-to-end workflow for each calendar or timekeeping feature:

1. **Understand the specification**
   - Carefully read any user-provided description and, if relevant, related pages under `Docs/src/`.
   - Identify:
     - Calendar type (solar, lunar, lunisolar, proposed, other, etc.).
     - Reference epochs or **anchor dates** (e.g. "date X = year Y month 1 day 1"), typically in **Gregorian + local timezone**. Use only these and the rules the user actually stated — do **not** add rules they did not give (e.g. do not add "year starts at first new moon after equinox" if the spec only gives anchor dates and a Metonic rule).
     - Cycle lengths (days per month, leap rules, eras, intercalations, etc.).
   - For lunisolar calendars defined by **explicit anchor dates and a fixed cycle** (e.g. Metonic), use the `anchor-based-lunisolar` skill.

2. **Design the data and API surface**
   - Treat the following as a single **Calendar API layer**:
     - `CalendarAPI/Calendars/*.js` for concrete calendar families.
     - `CalendarAPI/Timekeeping/*.js` for general time computations and shared utilities.
     - `CalendarAPI/Other/*.js` for related astronomical, political, and cultural time data.
   - Decide how this calendar will:
     - Represent dates internally (e.g., year/month/day, cycle indices).
     - Convert to and from a stable baseline such as an **anchor Gregorian date in the appropriate local timezone**, or other existing Library of Time primitives.
   - Keep the API consistent with existing patterns in this layer (e.g., functions like `toGregorian`, `fromGregorian`, `isLeapYear`).
   - When choosing an algorithmic pattern (e.g., anchor-epoch, equinox-based, JDN-based, or cycle-based), refer to the `calendar-patterns` skill for concrete examples from the existing codebase.

3. **Plan the algorithms**
   - Derive formulas for:
     - Converting from the calendar to the chosen baseline (typically an anchor Gregorian date in the relevant local timezone).
     - Converting from the baseline back to the calendar.
   - Make all assumptions explicit in comments near the formulas, especially for:
     - Historical vs. proleptic behavior.
     - Ambiguous or disputed rules.
   - For **lunar or lunisolar calendars**, do **not** approximate month boundaries purely with a mean synodic month length when correctness matters:
     - Use the project’s actual astronomical helpers (e.g. `generateAllNewMoons` + `getNewMoon`, or `getMoonPhase`, from `CalendarAPI/Other/astronomicalData.js`) to determine the real new-moon instants.
     - Apply the calendar’s day-boundary rule (e.g. local **sunset** vs. midnight) to those instants to decide when a new month begins.
     - It is acceptable to use the mean synodic month **only for indexing long cycles** (e.g. Metonic year/position) once month starts are already tied to real new moons.
   - For **anchor-based lunisolar** (year boundaries from a fixed epoch + month count): resolve which calendar year a date falls in by **iterating** until the date is in `[yearStart, nextYearStart)` (with a max-iteration guard). Never assume one decrement/increment is enough. Never display a negative day-of-month — fix the year resolution. See `anchor-based-lunisolar` skill.

4. **Place the implementation**
   - Put core logic in the appropriate part of the Calendar API layer:
     - `CalendarAPI/Calendars/*` for calendar systems and their primary date-conversion functions.
     - `CalendarAPI/Timekeeping/*` for non-calendar timekeeping systems (e.g., clocks, decimal time) that are still treated like first-class calendar APIs.
     - `CalendarAPI/Other/*` for additional time-related systems and data organized separately from the main calendar and clock modules but used in the same way.
   - Keep **all code in vanilla JS** with no external libraries.
   - Avoid changing public APIs of unrelated calendars unless the user explicitly requested a refactor.

5. **Integrate with the UI**
   - Wire the new calendar into the site using existing patterns:
     - **Do not edit** `nodeData.js` directly; it is procedurally generated from the mdBook in `Docs/`. Instead, update the relevant source docs when explicitly requested, and rely on the build process to regenerate `nodeData.js`.
     - When necessary, adjust rendering or interaction behavior in `nodeDraw.js` and `descriptionPanel.js` so that the new system appears correctly in the Library of Time UI without breaking existing calendars.

6. **Design and implement tests**
   - Add tests in the appropriate file under `Tests/` (for example, `Tests/otherCalendarsTests.js`, `Tests/lunisolarCalendarTests.js`, etc.).
   - Include:
     - Known historical dates with cross-checked sources where possible; use **fixed expected values** from the spec (e.g. anchor dates the user gave).
     - Edge cases: leap days, intercalary months, era boundaries, and long-cycle edges.
   - **Never** assert that the result equals the function’s own output (e.g. `expected: getCalendar(input)`); that is a tautology and does not validate correctness.
   - Follow the pattern of existing tests and keep `runAllTests()` commented out by default.

7. **Validate and iterate**
   - Double-check formulas by:
     - Comparing your results against known reference dates when available.
   - Prefer adjusting the algorithm rather than patching special cases, unless historically necessary and well-documented.

## One-shot calendar implementation checklist

When the user asks to one-shot an entire calendar implementation, ensure the plan and output cover:

- [ ] Clear written description of the calendar rules and assumptions.
- [ ] Defined mapping to/from a stable baseline (typically an anchor Gregorian date in the relevant local timezone, or existing primitives).
- [ ] Concrete function signatures and where they live in the codebase.
- [ ] Implementation of forward and inverse conversions.
- [ ] Tests added or updated under `Tests/` with round-trip checks and edge cases.
- [ ] UI data wiring so the calendar shows up and is navigable in the Library of Time.

