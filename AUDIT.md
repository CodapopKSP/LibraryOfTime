# Library of Time — Code Audit

Audited June 2026. Every CalendarAPI, Timekeeping, and Other file read in full; UI layer reviewed; the full test suite was run in a Node harness (passes, 0 failures); all accuracy claims below were verified numerically against Meeus, USNO, and official calendar authorities.

Ordered by your stated priorities: accuracy first, then readability, then performance.

---

## 1. Accuracy

### 1.1 Hebrew calendar is one day late for ~6 months of every common year — **highest-impact verified bug**

`lunisolarCalendars.js` (`calculateHebrewCalendar`, ~line 450) gives the final Adar **30 days in common years**. Adar must have 29 days in common years (30/29 only as Adar I/II in leap years). Result: every date from 1 Nisan through 29 Elul is displayed one day late in 12 of every 19 years.

Verified reproductions:
- 2026-04-01 renders **14 Nisan 5786**; correct is 15 Nisan (Pesach I).
- 2025-09-22 renders **28 Elul 5785**; correct is 29 Elul (erev Rosh Hashanah).
- Leap years (e.g. 5784) render correctly — which is why the existing tests pass: both Elul test cases (5784, 5733) happen to be leap years.

Root cause: the month-length logic is driven by float molad arithmetic (`HEBREW_MOLAD_LENGTH_DAYS = 29.530594136`) rather than the classical integer chalakim reckoning (1 day = 25,920 chalakim; molad interval = 29d 12h 793ch). Recommend rewriting molad + dechiyot in integer chalakim — this eliminates both the bug and all float-drift risk for distant years. Add common-year test cases for Nisan and Elul.

### 1.2 `getPositionOfTheMoon` expects Dynamical Time; Togys feeds it UT

`solilunarCalendars.js` passes civil time directly into the Meeus ch. 47 lunar position routine, which is defined in TD. Verified: passing the instant as-is matches reference to sub-arcsecond; the missing ΔT (~70 s in 2026) shifts the computed lunar longitude ~0.01°, enough to flip a Togys month boundary near new moon. Apply ΔT before calling, or make the function accept UT and convert internally (and document which timescale each astronomical function expects — currently none do).

### 1.3 Obliquity polynomial sign error

`getObliquity` (astronomicalData.js) has a sign flipped in the Laskar series (Meeus 22.3). Verified error: ≤0.004″ for 2000–2100 (harmless), **−3.95″ at year 3000, +32.1″ at year 0**. For a project that renders ancient and far-future dates, fix the sign — it's a one-character change.

### 1.4 ΔT extrapolation overshoot

`computingTime.js` `getDeltaT` uses the Espenak–Meeus polynomials, whose post-2015 segment extrapolates badly: it returns **75.07 s for 2026 vs. ~69 s actual**, and the error grows each year. Two fixes: (a) splice in a modern segment (e.g. fit to IERS data through 2025, linear beyond), and (b) pass the decimal year — the function currently truncates to integer year, adding a ±0.5-year quantization on top.

### 1.5 `getLongitudeOfSun` rounds to 0.01°

It returns `Number(x.toFixed(2))` — 0.01° of solar longitude is ~14.6 minutes of time. This feeds Chinese solar-term (jieqi) detection. The Chinese calendar results I spot-checked (CNY 2026, leap month 6 in 2025) are currently correct, but the rounding leaves only luck as margin for terms that fall near midnight. Return full precision; round only at display time. The function also takes UT where the underlying theory is TD (same class of issue as 1.2).

### 1.6 Stellar aberration function has a formula typo (currently dead code)

`getApparentStellarCoordinates` (astronomicalData.js ~1080): `Math.cos(radians(ε)) * + Math.sin(radians(α))` — the unary `+` silently turns Meeus 23.3's sum `cosα·cosλ·cosε + sinα·sinλ` into a 4-factor product. Verified: 18.86″ RA error. No callers today, so no user-visible impact, but it's a landmine; it also omits precession and proper motion. Fix or delete.

### 1.7 First-edition Meeus lunar-phase constants

`getMoonPhase` / `getMoonPhaseByLunationNumber` use 1991 1st-edition coefficients, duplicated in both functions. Verified impact is small (~1 s vs. reference for the Feb 1977 and Jan 2026 new moons), but update to 2nd-edition (1998) values and de-duplicate into one constant table. Solstices/equinoxes verified good: all four 2026 events within 10–60 s of USNO.

### 1.8 "Umm al-Qura" is not Umm al-Qura

`lunarCalendars.js` maps mean lunations with a fixed offset (`HIJRI_LUNATION_OFFSET = 9`); the real Umm al-Qura criterion is geocentric conjunction before sunset + moonset after sunset at Mecca. It currently happens to match (verified 1 Muharram 1448 = 16 Jun 2026 ✓), but mean-lunation drift guarantees future divergence. Either implement the real criterion (you already have conjunction and lunar-position machinery) or rename the label to "Tabular/mean Hijri" for honesty.

### 1.9 Smaller verified items

- `HOUR_ENUM` SUNRISE=6 / SUNSET=18 (utilities.js): fixed approximations feeding "day changes at sunset" calendars (Hebrew weekday, etc.) — wrong by up to ~2 h seasonally. At minimum document the error bound; ideally compute real sunrise/sunset (you have the solar machinery).
- `getCurrentPresidentialTerm` (politics.js): uses 365.25-day mean years instead of actual Jan 20 boundaries; `PRESIDENTIAL_TZ = 'UTC-04:00'` but January in DC is EST (−05:00); ignores pre-1937 March 4 inaugurations; computes `yearsSinceEpoch` and never uses it.
- `calculateDateFromJDE` carries the comment "I think this is how to add Dynamical Time but I'm not sure" — it's load-bearing for every astronomical date shown. Resolve the uncertainty and document it.
- `getOlympiad` uses 365.2425 mean years rather than calendar boundaries.

---

## 2. Correctness traps & silent failures

- **`addDay(date, 3rd-arg)` misuse — 5 live call sites.** `addYear(date, n, createNew)` supports a `createNew` flag; `addDay(date, days)` does not, but is called with a third argument at solarCalendars.js:83, 520, 957, 964 and lunisolarCalendars.js:549 — the flag is silently ignored and the date is mutated. Whether each site survives by accident, audit them; then give the two functions the same signature (better: make both pure and return new Dates everywhere — mutation-by-default is the project's biggest source of aliasing risk).
- **`getSolsticeOrEquinox` with an invalid season string** silently computes JDE=0 and returns a garbage date in −4713. Throw on invalid input. (Found this the honest way: my own first test triggered it.)
- **`getChineseLunisolarCalendarDate(date, country)`** returns `undefined` for an unknown country instead of throwing.
- **`convertUTCOffsetToMinutes`** (utilities.js:24) doesn't check `match` for null — malformed input throws an opaque TypeError.
- **`getGalileanMonthDaysArray`** returns `''` (a string) as its fallback instead of throwing; `getDarianGalileanDate` and `getGalileanDate` handle negative years differently.
- **`getTogysStartOfMonth`** can fall out of its 35-iteration loop and return `undefined`; Alcyone RA comparison breaks at the 360°→0° wrap.
- **Float equality**: solarCalendars.js tests `=== 366` on a float day count for leap detection; Bahai year loop mutates its loop variable mid-iteration.
- **`getImperialDatingSystem`** relies on `toFixed(3) * 1000` string→number coercion.

---

## 3. Architecture & readability

- **CalendarAPI depends on a UI file.** `calculateDateFromJDE` calls `setGregJulianDifference`/`getGregJulianDifference`, which are defined in `UserInterface/nodeDraw.js`. The calculation layer cannot run headless (my test harness had to stub it). Move that state into CalendarAPI, and stop mutating a global as a side effect of a date conversion — return the value instead.
- **No modules.** Everything is implicit globals wired by `index.html` script order. Adopting ES modules would make dependencies explicit, catch the cross-layer leak above at import time, enable headless testing without a vm harness, and allow tree-shaking. This is the single highest-leverage structural change.
- **Duplicated constants/data**: lunar-phase tables duplicated within astronomicalData.js; Galilean epochs duplicated between otherCalendars.js and otherTime.js with *near*-identical values (`IO_CIRCAD_HOURS = 21.23833` vs `21.238325`) — near-duplicates are worse than duplicates because they hide which is authoritative.
- **Pawukon** (otherCalendars.js): magic 71/72 special-casing on `daysSinceEpoch4_8` and ten separate `dayOfWeekN` string variables — table-drive it.
- **Good patterns worth spreading**: proposedCalendars.js's shared `getFixedCalendarDate` config object (Human Era / Invariable / World) and otherCalendars.js's clean divmod Maya Long Count are the model the older calendar files should converge on. `parseDateFromUTCStringLine` and `julianToGregorianYmd` are careful and well-commented.
- Document timescale (UT vs TD) and valid year range in the JSDoc of every astronomical function. Most current comments describe *what*, none describe *valid domain*.

---

## 4. Performance

Performance is broadly fine — verified Chinese calendar at ~0.1 ms/call thanks to the `allNewMoons`/`allSolsticesEquinoxes` caches. Items worth attention:

- **50 Hz update loop** (`updateMilliseconds = 20`): almost nothing on screen changes 50×/second. Tier the updates — fast tick for second-level nodes, 1 s for everything else — or drive from `requestAnimationFrame` with per-node dirty-checking. This is the dominant CPU cost.
- Per-tick DOM queries in nodeUpdate.js (`querySelectorAll` inside the loop): cache node references once at startup.
- The global mutable caches work but are invisible: wrap them in an explicit memoization helper so cache invalidation rules are stated rather than implied.

---

## 5. Tests

The suite (11 files, run via `runAllTests()`) passes, but:

- **Coverage gap that hid bug 1.1**: both Hebrew Elul cases are leap years. Add common-year Nisan/Elul cases (e.g. 2026-04-01 → 15 Nisan 5786, 2025-09-22 → 29 Elul 5785), and generally pick test dates that straddle the structural branches (leap/common, before/after the boundary the code computes).
- Tests are browser-global like the app; with ES modules they'd run under plain `node --test` in CI on every commit.
- `convertToSwatchBeats` (decimalTime.js:23) is host-timezone dependent: it feeds `currentDateTime.getTimezoneOffset()` (whose sign is inverted relative to the UTC-offset convention) into `createFauxUTCDate`, then reads `.getHours()` (local). Swatch beats are fixed UTC+1. The bug only shows on machines outside UTC+1 — exactly what a CI matrix would catch.
- UI: descriptionPanel.js adds 36 event listeners but removes 8 — leak risk on repeated panel open/close. Audit the pairs or use `AbortController` signals.

---

## Suggested order of work

1. Hebrew calendar chalakim rewrite + common-year tests (user-visible wrong dates today).
2. Swatch beats timezone fix; ΔT modern segment + decimal year; remove `getLongitudeOfSun` rounding.
3. Obliquity sign; aberration typo (or delete); 2nd-edition lunar constants, de-duplicated.
4. Make `addDay`/`addYear` pure and consistent; fix the 5 misuse sites; add throws for the silent-failure paths in §2.
5. ES modules + move `gregJulianDifference` out of the UI layer; then run tests headless in CI.
6. Tiered update loop.
7. Real Umm al-Qura criterion (or rename); real sunrise/sunset for HOUR_ENUM consumers.
