---
name: calendar-patterns
description: Catalogs common implementation patterns used by existing calendars and timekeeping systems in the Library of Time, with examples and guidance on when to use each pattern. Use when choosing how to structure a new calendar’s algorithm.
---

# Calendar & Timekeeping Patterns in Library of Time

## When to use this skill

Use this skill when:
- Designing a **new calendar/time system** and deciding how to model its year/month/day logic.
- Trying to **mirror an existing style** (e.g., Egyptian vs Baháʼí vs Discordian).
- Comparing trade-offs between anchor-based, equinox-based, JDN-based, or cycle-based approaches.

This skill complements:
- `calendar-math` – overall workflow and placement.
- `calendar-conventions` – epochs, timezones, and helpers like `createAdjustedDateTime`.

---

## Summary of main patterns

| Pattern | Core idea | Typical use |
| --- | --- | --- |
| **Anchor-epoch + day count** | Fixed epoch in local time; use `differenceInDays` to derive years/months/days. | Straightforward civil calendars with fixed-length months/cycles. |
| **Equinox/solstice-anchored year** | Year boundaries defined by solstice/equinox events (often with sunset/noon rules). | Calendars whose year starts on solar events (Baháʼí, Solar Hijri, French Republican). |
| **Shifted day-boundary** | Day changes at sunset/sunrise or other local time, weekday computed separately. | Religious or historical calendars where day starts before/after midnight. |
| **Timezone-localized Gregorian** | Use `createFauxUTCDate` and format directly. | Localized Gregorian derivatives (Minguo, Juche, Thai, ISO week, SCA). |
| **JDN-based conversions** | Convert Gregorian ↔ Julian (or similar) via JDN. | Calendars that are essentially Julian-based or need robust pre‑1582 behavior. |
| **Cycle-based / exotic year models** | Years with variable length and custom month-day tables. | Planetary calendars (Darian, Galilean, Titan), complex cycles. |

---

## Pattern 1: Anchor-epoch + day count

**Core idea**

- Choose an epoch date in the relevant local timezone using `createAdjustedDateTime`.
- Compute `daysSinceEpoch = floor(differenceInDays(currentDateTime, epoch))`.
- Derive year/month/day by dividing `daysSinceEpoch` against arrays of month lengths and leap-year rules.

**Examples**

- Coptic: `getCopticDate` (solarCalendars.js)
- Ethiopian (Ge'ez): `getEthiopianDate` (solarCalendars.js)
- Egyptian Civil: `getEgyptianDate` (solarCalendars.js)
- Maya Long Count, Haab, Tzolk'in, Lord of the Night: `getCurrentMayaLongCount`, `getHaabDate`, `getTzolkinDate`, `getLordOfTheNight` (otherCalendars.js)
- Sothic Cycle, Olympiad, Yuga Cycle (otherCalendars.js)

**When to use**

- The calendar has:
  - A clear epoch in local time.
  - Fixed or piecewise-fixed month lengths.
  - Simple leap rules expressible as "extra days in certain years".
- You want maximum transparency: arithmetic on days is easy to reason about and test.

**Key ingredients**

- `createAdjustedDateTime({ timezone: 'UTC±HH:MM', year, month, day })`
- `differenceInDays(currentDateTime, epoch)`
- Arrays of month lengths and/or functions `isLeapYear(year)`.

---

## Pattern 2: Equinox/solstice-anchored year

**Core idea**

- Year boundaries come from **astronomical events**: solstices/equinoxes from `getSolsticeEquinox`.
- Adjust those instants to local civil rules (sunset/noon) using `createAdjustedDateTime` + `addDay`.
- Use `differenceInDays(currentDateTime, startOfYear)` to locate the day-of-year, then map into months/days.

**Examples**

- Baháʼí: `getBahaiCalendar` (solarCalendars.js)
- Solar Hijri: `getSolarHijriDate` (solarCalendars.js)
- French Republican: `getRepublicanCalendar` (solarCalendars.js)

**When to use**

- The calendar:
  - Starts its year at a specific solstice/equinox in a particular city/timezone.
  - Has variable year length depending on actual solar year.
  - May have intercalary days or months inserted relative to those events.

**Key ingredients**

- `getSolsticeEquinox(currentDateTime, 'SPRING' | 'AUTUMN' | ...)`.
- Local adjustment helpers:
  - Example: in Solar Hijri, noon in Tehran; in Baháʼí, sunset in Tehran.
- Month-length arrays derived from `differenceInDays(endingEquinox, startingEquinox)`.

---

## Pattern 3: Shifted day-boundary / weekday logic

**Core idea**

- The **calendar date** (year-month-day) is computed via anchor/day-count logic.
- The **weekday** uses a custom day boundary (sunrise, sunset, specific hour) via `getWeekdayAtTime`.
- These two are intentionally decoupled.

**Examples**

- Coptic: `getCopticDate` uses day count from epoch + `getWeekdayAtTime(..., { hour: 22 })`.
- Ethiopian: `getEthiopianDate` uses epoch + `getWeekdayAtTime(..., { hour: 21 })`.
- Baháʼí: weekday from `getWeekdayAtTime(..., { hour: 'SUNSET' }, 'UTC+03:30')`.
- Solar Hijri: weekday from `getWeekdayAtTime(..., { hour: 20, minute: 30 })`.
- Qadimi: weekday from `getWeekdayAtTime(..., { hour: 'SUNRISE' }, 'UTC+03:30')`.
- Hebrew: sunset-based day start (see `calculateHebrewCalendar` in lunisolarCalendars.js).

**When to use**

- The calendar defines “when the day starts” differently from local midnight.
- You want weekday names to honor that rule while keeping year/month/day arithmetic simple.
- The calendar has 7-day weeks that map to Gregorian week days.

**Key ingredients**

- `getWeekdayAtTime(currentDateTime, { hour, minute | 'SUNSET' | 'SUNRISE' }, timezone?)`
- Separate `differenceInDays` logic for day counts.

---

## Pattern 4: Timezone-localized Gregorian derivatives

**Core idea**

- Start from a UTC-backed `Date`.
- Use `createFauxUTCDate(currentDateTime, timezoneOffset)` to get a “local” view.
- Apply simple arithmetic and string formatting around the adjusted date.

**Examples**

- Minguo, Juche, Thai Solar: `getMinguo`, `getJuche`, `getThaiSolar` (solarCalendars.js).
- Gregorian date/time display: `getGregorianDateTime` (solarCalendars.js).
- Anno Lucis: `getAnnoLucisDate` (solarCalendars.js).
- Discordian, Pataphysical, ISO Week: `getDiscordianDate`, `getPataphysicalDate`, `getISOWeekDate` (solarCalendars.js).
- SCA: `getSocietyForCreativeAnachronismDate` (solarCalendars.js).

**When to use**

- The calendar is a **relabeling/offset** of Gregorian:
  - Year is offset (e.g., +4000 years).
  - Weekdays follow local civil time.
  - Months/days are reused or simply remapped.

**Key ingredients**

- `createFauxUTCDate(currentDateTime, 'UTC±HH:MM' or numeric offset)`
- `getGregorianDateTime` as a base for many derivatives.

---

## Pattern 5: JDN-based conversions

**Core idea**

- Convert Gregorian to **Julian Day Number** (`gregorianToJDN`).
- Convert JDN to target calendar date (`JDNToJulianDate` or similar).
- Adjust for fractional days and civil year starts as needed.

**Examples**

- Julian calendar: `getJulianCalendar` (solarCalendars.js).
- Astronomical date: `getAstronomicalDate` (solarCalendars.js) for pre‑1582.
- Byzantine, Florentine, Pisan, Venetian: use mix of JDN + custom year rules.

**When to use**

- You need:
  - Robust treatment of proleptic Julian/Gregorian dates.
  - Clean conversion between calendars tied via JDN.

**Key ingredients**

- `gregorianToJDN(currentDateTime)`
- `JDNToJulianDate(JDN)`
- Local rules layered on top (year offsets, BC/AD / AM notation).

---

## Pattern 6: Cycle-based / exotic year models

**Core idea**

- Years have variable length and custom month tables; some may depend on complex rules or long cycles.
- Implementation is usually:
  - `daysSince` from an epoch, or use Julian Sol Number.
  - Determine year via looping with `getDaysInYear(year)`.
  - Then pick month/day via arrays of month lengths, sometimes different for leap vs non-leap.

**Examples**

- Darian Mars calendar: `getDarianMarsDate(julianSolNumber)` (otherCalendars.js).
- Galilean calendars: `getGalileanDate`, `getDarianGalileanDate` (otherCalendars.js).
- Darian Titan: `getDarianTitanDate` (otherCalendars.js).
- Icelandic calendar: `getIcelandicDate` (solarCalendars.js).
- Pawukon: `getPawukonCalendarDate` (otherCalendars.js).

**When to use**

- Planetary calendars (Mars, Jovian moons, Titan).
- Calendars with intricate leap rules that aren’t simple “+1 day in certain years”.
- Complex week cycles (e.g., Pawukon’s nested week systems).

**Key ingredients**

- Epoch: `createAdjustedDateTime({ ... })` or a precomputed sol number.
- `differenceInDays` / custom “day” size (for non-Earth days).
- `isLeapYear` variations and arrays of month lengths per body/system.

---

## Choosing a pattern

Use this table as a quick guide:

| System characteristics | Recommended pattern(s) |
| --- | --- |
| Simple civil calendar with fixed months and known epoch | Anchor-epoch + day count |
| Year begins at solstice/equinox; length varies year to year | Equinox/solstice-anchored year (+ possibly shifted day-boundary) |
| Day starts at sunrise/sunset; weekday must respect that | Shifted day-boundary / weekday logic (Pattern 3) layered on top of 1 or 2 |
| Gregorian-derived with new era or labels | Timezone-localized Gregorian derivatives (Pattern 4) |
| Calendar historically tied to Julian/Gregorian math | JDN-based conversions (Pattern 5) |
| Non-Earth or very unusual leap rules | Cycle-based / exotic year models (Pattern 6) |

When in doubt:
- **Start with Pattern 1 (anchor + day count)**; it is the simplest to test and extend.
- Layer Pattern 3 on top if the day boundary is not midnight.
- Only move to Patterns 2, 5, or 6 when the real system demands those complexities.

