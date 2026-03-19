---
name: weekday-skip-days
description: Compute weekdays correctly for calendars where some days (intercalary/epagomenal) are excluded from the weekday cycle. Use when implementing or debugging weekday logic with “skipped days”, “epagomenal”, “intercalary”, or “non-weekday” days.
---

# Weekday Math With Skipped Days

## Instructions
When a calendar defines a weekday cycle but explicitly excludes certain days (for example: intercalary days, mid-year days, festival-only epagomenal days), compute weekdays using the count of *regular* days that participate in the cycle—not using the raw day index.

### 1. Classify days
Identify, for the calendar rules you’re implementing:
- Which days are **regular** (weekday participates).
- Which days are **skipped** (weekday does not advance; you may still display a special label, but weekday progression must not include them).

Record your “skipped day set” in terms of the calendar’s internal indexing (e.g., specific `dayIndex` values within a year, or rule-based offsets like “the extra leap intercalary day”).

### 2. Use an anchored weekday
Find the weekday anchor (examples):
- Weekday of `dayIndex = 0` (year start) is known.
- Weekday of a specific epoch date is known.

Let `anchorWeekdayIndex` be an integer in `[0..6]` for the weekday name order used by the calendar implementation.

### 3. Count only regular days
Compute how many days have elapsed since the anchor, but subtract any skipped days that occurred in that span:

`regularDaysElapsed = totalDaysElapsed - skippedDaysInSpan`

Then:

`weekdayIndex = (anchorWeekdayIndex + regularDaysElapsed) % 7`

### 4. Do not use `dayIndex % 7` on skipped days
Avoid patterns like:
- `weekdayNames[dayIndex % 7]`
- `weekdayNames[(dayIndex + k) % 7]`

These implicitly advance weekdays across skipped days and will be wrong whenever skipped days occur between the anchor and the target date.

### 5. Output handling for skipped days
Choose a consistent display strategy and keep it stable:
- Option A: Show weekday as “(skipped)” for excluded days.
- Option B: Omit the weekday line entirely for excluded days.
- Option C: Show a special weekday label if the calendar defines one.

Regardless of display choice: the next regular day must resume weekday progression as if the skipped day did not exist.

### 6. Validate boundary conditions (tests)
Add/ensure tests at minimum:
- The day immediately **before** the first skipped day.
- Each skipped day itself (and leap-added skipped days).
- The day immediately **after** the last skipped day.
- The **end of year** case where a skipped day occurs just before the final day (this is where off-by-one weekday bugs often show up).

Also test with at least one leap-year (if leap days change which days are skipped).

### 7. Timezone day-boundary correctness
If your UI supports timezone offsets, ensure that:
- The date-to-dayIndex mapping uses the same local-midnight rule as other calendar systems (e.g., using the project’s faux-UTC + `MIDNIGHT` adjustment).
- Weekday progression uses the same resulting `dayIndex` / day boundary.

### 8. Negative years / historical dates
If the project supports BCE/negative years, ensure your modulus logic works for negative `regularDaysElapsed` (normalize with `((n % 7) + 7) % 7` style normalization).

## Examples (patterns)
### Compute weekday index from regular-days count
```js
const weekdayIndex = ((anchorWeekdayIndex + regularDaysElapsed) % 7 + 7) % 7;
return weekdayNames[weekdayIndex];
```

### Mark skipped day display without advancing
```js
if (isSkippedDay) return `${specialDayLabel}\nWeekday: (skipped)`;
return `${specialDayLabel}\nWeekday: ${weekdayNames[weekdayIndex]}`;
```

