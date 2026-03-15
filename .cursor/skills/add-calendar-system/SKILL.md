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

1. **Docs stub** → 2. **Regenerate `nodeData.js`** → 3. **Implement main function** → 4. **Wire into `nodeUpdate.js`** → 5. **Add tests**.

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
   - **Info** (stub section).
   - **Accuracy** (stub section).
   - **Source** (stub section).
   - Keep all sections present even if their bodies are just short placeholder sentences, and add **no detailed content** unless the user explicitly requested text (respect the project’s `Docs/` rule).
3. Ensure the new file is referenced in `Docs/src/SUMMARY.md` under the right section, so `buildNodeData.js` will include it.

---

## Step 2: Regenerate `nodeData.js`

1. Run the build pipeline to regenerate `nodeData.js` and the mdBook output, typically via:
   - `bash build.sh`
   - or directly `node buildNodeData.js` if only `nodeData.js` is needed.
2. **Do not edit** `nodeData.js` by hand; it is generated.
3. After the build, locate the new node entry in `nodeData.js`:
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
   - First argument: the node id from `nodeData.js` (e.g., `'solar-hijri-node'`).
   - Second argument: the result of your main function (e.g., `getSolarHijriDate(currentDateTime, springEquinox)`).
3. Keep the style consistent:
   - Group the new line near similar systems.
   - Reuse shared-derived values (e.g., `springEquinox`) instead of recomputing.

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
- [ ] `nodeData.js` has been regenerated (via `build.sh` or `buildNodeData.js`), and the node id is known.
- [ ] A main implementation function exists in the correct `CalendarAPI/...` file, following existing patterns and conventions.
- [ ] `nodeUpdate.js` calls `setTimeValue` for this node id using the main function.
- [ ] Tests exist in the appropriate `Tests/*.js` file and are wired into that file’s runner.

