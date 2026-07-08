# Library of Time — Code Audit

## 1. Accuracy

### 1.4 ΔT extrapolation overshoot

`computingTime.js` `getDeltaT` uses the Espenak–Meeus polynomials, whose post-2015 segment extrapolates badly: it returns **75.07 s for 2026 vs. ~69 s actual**, and the error grows each year. Two fixes: (a) splice in a modern segment (e.g. fit to IERS data through 2025, linear beyond), and (b) pass the decimal year — the function currently truncates to integer year, adding a ±0.5-year quantization on top.

### 1.7 First-edition Meeus lunar-phase constants

`getMoonPhase` / `getMoonPhaseByLunationNumber` use 1991 1st-edition coefficients, duplicated in both functions. Verified impact is small (~1 s vs. reference for the Feb 1977 and Jan 2026 new moons), but update to 2nd-edition (1998) values and de-duplicate into one constant table. Solstices/equinoxes verified good: all four 2026 events within 10–60 s of USNO.

### 1.9 Smaller verified items

- `HOUR_ENUM` SUNRISE=6 / SUNSET=18 (utilities.js): fixed approximations feeding "day changes at sunset" calendars (Hebrew weekday, etc.) — wrong by up to ~2 h seasonally. At minimum document the error bound; ideally compute real sunrise/sunset (you have the solar machinery).

---

## 2. Correctness traps & silent failures
- **Float equality**: solarCalendars.js tests `=== 366` on a float day count for leap detection; Bahai year loop mutates its loop variable mid-iteration.

---

## 3. Architecture & readability

- **Duplicated constants/data**: lunar-phase tables duplicated within astronomicalData.js; Galilean epochs duplicated between otherCalendars.js and otherTime.js with *near*-identical values (`IO_CIRCAD_HOURS = 21.23833` vs `21.238325`) — near-duplicates are worse than duplicates because they hide which is authoritative.
- **Pawukon** (otherCalendars.js): magic 71/72 special-casing on `daysSinceEpoch4_8` and ten separate `dayOfWeekN` string variables — table-drive it.

- Document timescale (UT vs TD) and valid year range in the JSDoc of every astronomical function. Most current comments describe *what*, none describe *valid domain*.

---

## 4. Performance

- Per-tick DOM queries in nodeUpdate.js (`querySelectorAll` inside the loop): cache node references once at startup.
- The global mutable caches work but are invisible: wrap them in an explicit memoization helper so cache invalidation rules are stated rather than implied.

---

## 5. Tests

The suite (11 files, run via `runAllTests()`) passes, but:

- **Coverage gap that hid bug 1.1**: both Hebrew Elul cases are leap years. Add common-year Nisan/Elul cases (e.g. 2026-04-01 → 15 Nisan 5786, 2025-09-22 → 29 Elul 5785), and generally pick test dates that straddle the structural branches (leap/common, before/after the boundary the code computes).

- UI: descriptionPanel.js adds 36 event listeners but removes 8 — leak risk on repeated panel open/close. Audit the pairs or use `AbortController` signals.
