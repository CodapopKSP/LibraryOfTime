---
name: anchor-based-lunisolar
description: Rules and pitfalls for implementing lunisolar (or similar) calendars that are defined by explicit anchor dates and a fixed cycle (e.g. Metonic), not by astronomical events like equinox or "first new moon after X". Use when implementing or fixing such calendars (e.g. Babylonian, or any spec that gives "date X = year Y month 1 day 1").
---

# Anchor-Based Lunisolar Calendars

## When to use this skill

Use this skill when:
- Implementing a lunisolar calendar whose spec gives **explicit anchor dates** (e.g. "sunset 15 April 384 BCE = year -74 month 1 day 1").
- The calendar’s year boundaries and leap rules are defined by a **fixed cycle** (e.g. 19-year Metonic with 12 or 13 months per year), not by "first new moon after equinox" or similar.
- Debugging wrong year, wrong day, or negative day-of-month in such a calendar.

---

## 1. Use only what the spec says

- **Do not introduce rules the user did not give.** If the user provides anchor dates and a Metonic rule, do **not** add "year starts at the first new moon after the spring equinox" or any other astronomical year-start rule unless they explicitly say so.
- **Build year boundaries from the anchor.** Define the epoch as the exact instant given (e.g. sunset on anchor date in the specified timezone). For any other year, compute its start by **counting months** from the epoch: sum 12 or 13 months per year according to the cycle (e.g. Metonic leap years), then advance from the epoch by that many **lunar month boundaries** (each boundary = next new moon + calendar day-start rule, e.g. sunset).
- **Month boundaries** use real new moons (e.g. `getMoonPhase` in `astronomicalData.js`) and the calendar’s day-start rule (e.g. if new moon before local sunset, month starts at that sunset; else at the next sunset). Do not use mean synodic month for placing month boundaries when correctness matters. It can be used to estimate the current month, but the specific start of the month should come from the actual moon phase.

### 1a. Visibility rule (“N hours before sunset”): use two steps

When the spec says the new moon must be **at least N hours before sunset** for the month to start at that sunset (e.g. “moon not visible if less than 15 hours old”):

- **Do not** implement it as a single check: “hours from new moon to same-day sunset; if &lt; N, use next sunset.” That is wrong when the new moon is **after** that sunset: then “hours before sunset” is negative, so you always take “next sunset,” but that next sunset might still be less than N hours after the new moon, and you must push **again** to the following sunset.
- **Do** use two steps in order:
  1. **After-sunset step:** Decide the **candidate** sunset. If the new moon is on or before the sunset of its local day → candidate = that sunset. If the new moon is after that sunset → candidate = the **next** day’s sunset.
  2. **Visibility step:** Compute “hours from new moon to **candidate** sunset.” If that is ≥ N, the month starts at the candidate. If it is &lt; N, the month starts at the **sunset after** the candidate (one more day).

So: first resolve “which sunset are we considering?” then “is the new moon at least N hours before that sunset?” and only then possibly push one more day.

---

## 2. Resolve the calendar year by iterating until in range

- **Do not assume one adjustment is enough.** Given a target date, you will have an approximate calendar year (e.g. from Gregorian year). Compute `yearStart` and `nextYearStart` for that year. If the target date is **before** `yearStart`, decrement the year and recompute; if it is **on or after** `nextYearStart`, increment the year and recompute.
- **Loop until the date lies in `[yearStart, nextYearStart)`.** Otherwise you can remain in a wrong year (e.g. a year whose start is in the future), which leads to no month interval containing the date and then to a **negative day-of-month** when you use `yearStart` as the "current" month start.
- **Guard against infinite loops.** If year boundaries are ever wrong (e.g. bug in epoch or month count), the decrement/increment loops could oscillate or run forever. Cap iterations (e.g. max 500) and document the limit.

---

## 2a. Performance: do not iterate totalMonths from the epoch

- **Never** compute year start by stepping month-by-month from the epoch in a loop of `totalMonths` iterations. For dates far from the anchor (e.g. today), `totalMonths` can be tens of thousands; that will hang the page or block the main thread.
- **Do** compute year start in O(1) per year: form an approximate instant `approxInstant = epoch + totalMonths * meanSynodicMonth` (e.g. ~29.53 days), then get the new moon near that instant with `getMoonPhase(approxInstant, 0)` and apply the calendar’s day-boundary rule (e.g. sunset). Use that as the candidate year start. The year-resolution loop (section 2) will correct if the approximation is off by a year.
- Building month boundaries **within** the chosen year (12 or 13 steps) is acceptable; only the “advance from epoch to year start” must be O(1).

### 2b. Years before the anchor: use a different totalMonths formula

When the calendar year is **before** the anchor year, you are counting months **backward** from the epoch. Do **not** reuse the same formula as for years after the anchor.

- **Years after anchor:** `totalMonths = (year - anchorYear) * 12 + countLeapYears(anchorYear, year)`. (Count leap years in the range that lies between anchor and year; that's the extra months you add.)
- **Years before anchor:** `totalMonths = (year - anchorYear) * 12 - countLeapYears(year, anchorYear)`. You must **subtract** the number of leap years in the range `[year, anchorYear)` (years from the target year up to but not including the anchor). Each of those years has 12 or 13 months; going backward, the leap years in that interval are the ones that add an extra month you must step back through.

**Why:** A single "count leap years from anchor" helper that only counts forward (e.g. `for (y = anchorYear; y < year; y++)`) returns 0 when `year < anchorYear`, so reusing it for past years gives `totalMonths = (year - anchorYear) * 12 + 0` and you step back too few months. The year immediately before the anchor (e.g. cycle year 19 in a Metonic calendar) is often a leap year; if you only step back 12 months instead of 13, the "leap month" of that year is wrongly attributed to the next calendar year and appears as a non-leap month 12.

**Implementation:** Add a separate helper for the backward case, e.g. `countLeapYearsInRange(low, high)` for the half-open interval `[low, high)`, and use it only when `year < anchorYear` to compute the count to subtract.

---

## 3. Never display a negative day

- Day-of-month is typically `floor(days between date and start of current month) + 1`. If the date is **before** the start of the month you chose (e.g. because no month interval contained the date), this becomes negative.
- **Always handle negative day-of-month:** If the computed day is &lt; 1, then the calculation is wrong.

---

## 4. Tests: fixed expected values, standard pattern

- **Use fixed expected values from the spec.** For each anchor date the user gave (e.g. "sunset 15 April 384 BCE = year -74 month 1 day 1"), add a test with that input (date + timezone) and the **exact** expected output string.
- **Use the project’s standard test pattern:** an array of `[inputDate, timezone, expectedOutput]` where `expectedOutput` is the exact string the calendar function returns. Use the shared runner (e.g. `runSingleParameterTests`); do not add a custom loop that checks object fields (e.g. `result.year`, `result.month`) or a different expected format.
- **Never test by comparing the function’s output to itself** (e.g. `expected: getBabylonianLunisolarCalendar(parseInputDate(...))`). That always passes and does not validate correctness.
- Add at least one test that would fail if the calendar were one year off or if the day were wrong (e.g. another anchor like "next year start = …").

---

## 4a. Return value: match other calendars

- **Return a single formatted string** for display (like `calculateHebrewCalendar`, `getChineseLunisolarCalendarDate`). The caller (e.g. `nodeUpdate.js`) should pass the return value directly to `setTimeValue(..., getCalendar(currentDateTime))`.
- **Do not** return an object with a `.formatted` property and then have the caller do `result.formatted`; that is inconsistent with the rest of the project and adds unnecessary branching.

---

## 5. Cycle numbering and leap placement

- **Match the spec’s wording exactly.** If the spec says "in the year that was number 17 in the cycle" (Metonic), confirm whether they mean 1-based (17th year) or 0-based (index 16). Your `getMetonicIndex(year)` and leap-year list (e.g. `[0, 3, 6, 8, 11, 14, 17]`) must match.
- **Leap month placement:** If the spec says one position in the cycle gets a leap month in a different place (e.g. "year 17: insert leap after month 6; other leap years: Addaru II at end"), implement that exactly; do not unify to a single rule unless the spec does.

### 5a. Mapping remainder to 1-based cycle year (avoid the 0→19 trap)

When the **anchor is the start of year 1** of the cycle (e.g. "year -74 month 1 day 1 = start of Metonic cycle"), the civil year that contains the anchor is **cycle year 1**, not cycle year 19.

- You will compute a remainder `r = (civilYear - anchorYear) % 19` (or equivalent), with `r` in **0..18** (e.g. 0 for the anchor year, 1 for the next, …, 18 for the 19th year of the cycle).
- **Correct** 1-based cycle year: `cycleYear1Based = r + 1`. So: 0→1, 1→2, …, 18→19. The first year of the cycle is 1; the last is 19.
- **Wrong** (common bug): `r === 0 ? 19 : r`. That maps the **first** year of the cycle (remainder 0) to 19, so the anchor year is treated as a **leap** year and gets a 13th month; the next year then shows as "month 1" only after an erroneous "leap month" for the previous year.
- **Sanity check:** If the spec says "the first leap month appears at the end of the third year of the cycle", then cycle years 1 and 2 must be non-leap (12 months each); only cycle year 3 and the other listed years should be leap. If the first year is leap in your code, fix the remainder→cycle-year mapping to use `r + 1`, not `r === 0 ? 19 : r`.

---

## 6. Timezone and day boundary

- Use the timezone the user specified (e.g. UTC+3 for Babylon). Day and month start are defined in that local time (e.g. sunset = start of civil day). Use `createAdjustedDateTime` with that timezone and the correct hour (e.g. `hour: 'SUNSET'`) and avoid hardcoding UTC hours for "before sunset" checks if you have a sunset helper.

---

## Quick checklist for anchor-based lunisolar

- [ ] If the spec has an “N hours before sunset” visibility rule: **two steps** — (1) choose candidate sunset using “new moon before/after same-day sunset”; (2) then require new moon ≥ N hours before that candidate, else push to next sunset.
- [ ] Year boundaries are computed **only** from the anchor + number of lunar months (12 or 13 per year by the stated cycle). No equinox/solstice or "first new moon after X" unless the spec says so.
- [ ] Year start uses a **constant** number of new-moon/boundary steps (approximate instant + `getMoonPhase` + day-boundary rule), not a loop of `totalMonths` iterations from the epoch.
- [ ] For years **before** the anchor, `totalMonths` uses a **different** formula: subtract leap years in `[year, anchorYear)`, do not reuse the forward "count from anchor" helper (it returns 0 and undercounts months).
- [ ] For a given date, the calendar year is found by **iterating** until `yearStart <= date < nextYearStart`, with a max-iteration guard.
- [ ] Negative day-of-month is always handled.
- [ ] The calendar function **returns a single formatted string**; the caller does not use `.formatted` or object fields.
- [ ] Tests use the **standard** `[input, timezone, expectedOutput]` array and the shared runner; expected output is the exact display string.
- [ ] Tests use **fixed** expected values from the spec; no test asserts equality with the function’s own return value.
- [ ] Cycle index and leap-year list match the spec (1-based vs 0-based; which years are leap; where the leap month goes in the special case).
- [ ] When anchor = start of "year 1" of the cycle, remainder 0 maps to **cycle year 1** (`r + 1`), not 19 (`r === 0 ? 19 : r`); first year of cycle must not be leap unless the spec says so.
