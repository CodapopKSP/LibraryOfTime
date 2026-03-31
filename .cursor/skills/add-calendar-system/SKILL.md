---
name: add-calendar-system
description: Step-by-step workflow for adding a new calendar or timekeeping system to the Library of Time, including creating the Docs entry, regenerating nodeData, wiring the main function into the CalendarAPI layer and nodeUpdate.js, and adding tests. Use when introducing a new calendar node to the site.
---

# Add Calendar / Time System Workflow

## When to use this skill

Use this skill whenever you want to:
- Add a **new calendar** (solar, lunar, lunisolar, other, proposed, etc.).
- Add a **new non-calendar timekeeping system** (e.g., clocks in `CalendarAPI/Timekeeping`).
- Ensure the new system appears as a node in the UI and has basic test coverage.

This workflow assumes you also follow:
- `calendar-math` – for deriving algorithms and conversions.
- `calendar-conventions` – for date/epoch/timezone conventions and `utilities.js` helpers.

---

## High-level pipeline

For each new system, follow this pipeline:

1. **Docs stub** → 2. **Regenerate `Content/nodeData.js`** → 3. **Implement main function** → 4. **Wire into `nodeUpdate.js`** → 5. **Add tests**.

Each step below is required unless explicitly skipped by the user.

---

## Step 1: Create the Docs stub

1. Choose the appropriate Docs section under `Docs/src/` that matches the system:
   - Solar calendar → `Docs/src/SolarCalendars/`
   - Lunar calendar → `Docs/src/LunarCalendars/`
   - Lunisolar calendar → `Docs/src/LunisolarCalendars/`
   - Solilunar calendar → `Docs/src/SolilunarCalendars/`
   - Proposed calendar → `Docs/src/ProposedCalendars/`
   - Other calendars / time systems → `Docs/src/OtherCalendars/`, `Docs/src/OtherTime/`, etc.
2. Create a **new markdown file** that follows the standard header layout used by existing entries in that section. For calendar/time-system nodes, this means including (in order):
   - **Title** (top-level heading with the system’s name).
   - **Epoch** (a short line; can be “To be determined.” for new systems).
   - **Confidence** (brief note on how confident we are; can be “To be determined.”).
   - **Overview** (stub section).
   - **Info** (stub section or reference tables — see below).
   - **Accuracy** (stub section).
   - **Source** (stub section).
   - Keep all sections present even if their bodies are just short placeholder sentences, and add **no detailed content** unless the user explicitly requested text (respect the project’s `Docs/` rule).
3. Ensure the new file is referenced in `Docs/src/SUMMARY.md` under the right section, so `buildNodeData.js` will include it.

### Reference tables in `#### Info` (months, weekdays, alignment)

When adding **month names**, **weekday names**, or similar reference material:

- Use **markdown tables** with a **header row** (required for mdBook and `buildNodeData.js` table conversion).
- **Months:** Include month order/number, **days per month** (or an explicit rule when lengths vary), and **names**. If names are given in a **non-Latin script**, include a **Latin transliteration** column (or Latin-letter names) beside the native script so readers can parse the table without the script.
- **Weekdays:** Include order (e.g. Sunday first) and names; state in the header if the week **starts on a different day** than Sunday.
- **Approximate Gregorian alignment:** Add a column, footnote row, or small separate table **only when** the calendar maps in a stable, documentable way to Gregorian months or seasons. When there is **no** meaningful fixed mapping (e.g. a **drifting** 365-day solar year, or a lunar/lunisolar calendar unrelated to Gregorian months), use a one-row table or single cell with **Not applicable** (or an em dash)—**do not** invent long explanatory prose unless the user explicitly asks for body copy.
- If the user asks for **tables only** (no narrative), keep **`#### Overview`**, **`#### Accuracy`**, and **`#### Source`** as `To be determined.` (or equivalent stubs) and put **only tables** under **`#### Info`**.

---

## Step 2: Regenerate `Content/nodeData.js`

1. Run the build pipeline to regenerate `Content/nodeData.js` and the mdBook output, typically via:
   - `bash build.sh`
   - or directly `node buildNodeData.js` if only `Content/nodeData.js` is needed.
2. **Do not edit** `Content/nodeData.js` by hand; it is generated.
3. After the build, locate the new node entry in `Content/nodeData.js`:
   - Search by the doc filename or title.
   - Note the node’s DOM id (e.g., `egyptian-civil-node`) that will be passed to `setTimeValue` in `nodeUpdate.js`.

---

## Step 3: Implement a stub main function in the Calendar API layer

1. Pick the correct file under `CalendarAPI/` based on category:
   - Solar calendars → `CalendarAPI/Calendars/solarCalendars.js`
   - Lunar calendars → `CalendarAPI/Calendars/lunarCalendars.js`
   - Lunisolar calendars → `CalendarAPI/Calendars/lunisolarCalendars.js`
   - Other calendars (Galilean, Darian, cycles, etc.) → `CalendarAPI/Calendars/otherCalendars.js`
   - Solilunar calendars → `CalendarAPI/Calendars/solilunarCalendars.js`
   - Proposed calendars → `CalendarAPI/Calendars/proposedCalendars.js`
   - Non-calendar timekeeping (clocks, fractional times, etc.) → `CalendarAPI/Timekeeping/*`
   - Supporting astronomical/political/pop-culture systems → `CalendarAPI/Other/*`
2. Implement a **stub main function** for the node, consistent with neighbors in the file. Typical patterns:
   - `getXxxDate(currentDateTime, timezoneOffset)`
   - `getXxxCalendar(currentDateTime)`
3. **Structure:** Keep all implementation logic inside this main function (or helpers it calls). Do not run `createAdjustedDateTime`, `getMoonPhase`, or other module APIs at top level — script load order may make them undefined. See **calendar-conventions** (Structure: main function and load-time safety).
4. For initial project setup, the stub **does not need to perform real calendar calculations**:
   - It may return a simple placeholder string such as `"Calendar Name"` or `"TODO: implement Xxx calendar"`.
   - It should still accept the same parameters as neighboring functions so it can be wired into `nodeUpdate.js` without further shape changes.
5. **Upgrading stubs later**:
   - When the user asks to “implement”, “fill out”, or otherwise replace a stubbed main function (for example, a Babylonian lunisolar calendar stub that currently returns `"TODO: implement …"`), treat that request as **explicit permission** to change the function’s behavior.
   - In that case, overwrite the stub in place, keeping the same public signature where possible, and apply `calendar-math` and `calendar-conventions` (anchor dates, timezone handling, helpers, etc.) for the real implementation.

---

## Step 4: Wire the node in `nodeUpdate.js`

1. Open `nodeUpdate.js` and identify the correct wrapper function:
   - Solar calendars → `updateSolarCalendars(currentDateTime, timezoneOffset)`
   - Lunisolar / lunar calendars → `updateLunisolarCalendars(currentDateTime)` or lunar-specific wrapper.
   - Other calendars (Galilean, Darian, cycles, etc.) → `updateOtherCalendars(currentDateTime)`
   - Proposed calendars → `updateProposedCalendars(currentDateTime, timezoneOffset)`
   - Pop culture calendars → `updatePopCultureCalendars(currentDateTime, timezoneOffset)`
   - Timekeeping / clocks / decimal time → `updateClocks_Fast` or `updateClocks_Slow` depending on update frequency.
2. Add a new `setTimeValue` call within the appropriate wrapper:
   - First argument: the node id from `Content/nodeData.js` (e.g., `'solar-hijri-node'`).
   - Second argument: the result of your main function (e.g., `getSolarHijriDate(currentDateTime, springEquinox)`).
3. Keep the style consistent:
   - Group the new line near similar systems.
   - Reuse shared-derived values (e.g., `springEquinox`) instead of recomputing.

---

## Step 4b: Wire Calendar View (required for per-day grid display)

The main grid and `nodeUpdate.js` are not enough for the **Calendar View** side panel: it maintains its own map of node id → getter. If you skip this step, selecting the new system in Calendar View shows **no per-day output** and **no month-based cell shading**, because `getNodeValueForDay` looks up `getters[nodeId]` and gets `undefined`.

1. Open `UserInterface/calendarView.js` and find `buildNodeValueGetters`.
2. Add a property whose **key** is the node’s **`id` from `Content/nodeData.js`** (e.g. `'mandaean'`, `'saka-samvat'`). This is the short id **without** the `-node` suffix used in `setTimeValue`.
3. Set the value to a function that calls your main API function with the `Date` passed in (same pattern as neighbors), for example:
   - `'mandaean': function (dt) { return typeof getMandaeanDate === 'function' ? getMandaeanDate(dt) : ''; }`
4. Match the **arity** your function expects: most solar entries use `(dt)` only; some use `(dt, offset)`—mirror an existing calendar in the same API file if unsure.
5. **Month shading:** `getNodeValueForDay` builds `monthKey` from `raw.month` and `raw.year` when the getter returns an object with `month != null`. If your calendar returns `month: null` for intercalary or special days, those cells may not get a tint (same as other systems).

---

## Step 5: Add tests and hook into the dev test runner

1. Choose the correct test file under `Tests/`:
   - Solar calendars → `Tests/solarCalendarTests.js`
   - Lunisolar calendars → `Tests/lunisolarCalendarTests.js`
   - Lunar calendars → `Tests/lunarCalendarTests.js`
   - Other calendars → `Tests/otherCalendarsTests.js`
   - Proposed calendars → `Tests/proposedCalendarTests.js`
   - Timekeeping / computing → `Tests/computingTimeTests.js`
2. Add a dedicated test function following existing patterns, for example:
   - `testXxxCalendar()` using helpers like `runSolarTests`, `runCalendarEquinoxTests`, or category-specific runners.
3. In `Tests/runCalendarDevTests.js`, add your new test function to the `testFunctions` array so it can be run in isolation via `runCalendarDevTests()`.
4. For initial project setup, write tests **against the intended final behavior**, even if the stub function only returns a placeholder:
   - Use known historical dates and expected formatted outputs you eventually want.
   - Include at least one edge case (epoch boundary, leap day/year, non-midnight day start, etc.) where relevant.
   - It is acceptable—and expected—for these tests to **fail at first** until the real implementation is written in a later step.
5. Register the new test function in the appropriate test runner (e.g., append to the `testFunctions` array in `runSolarCalendarTests`) once you are ready to make it part of the full suite.
6. Leave `runAllTests()` commented out in `Tests/runTests.js` unless the user explicitly wants to run tests continuously.

---

## Quick checklist for adding a new system

Before considering a new calendar/time system “hooked up”, confirm:

- [ ] A Docs stub exists in `Docs/src/...` with title/outline and is referenced from `Docs/src/SUMMARY.md`.
- [ ] `Content/nodeData.js` has been regenerated (via `build.sh` or `buildNodeData.js`), and the node id is known.
- [ ] A main implementation function exists in the correct `CalendarAPI/...` file, following existing patterns and conventions.
- [ ] `nodeUpdate.js` calls `setTimeValue` for this node id using the main function.
- [ ] **`calendarView.js`:** `buildNodeValueGetters` includes an entry for the node’s short `id` (so Calendar View cells and month shading work when that system is selected).
- [ ] Tests exist in the appropriate `Tests/*.js` file and are wired into that file’s runner.

