//|-----------------------------|
//|      Input Calendars        |
//|-----------------------------|

// Registry and generic inverse engine that converts a date typed in a
// non-Gregorian calendar into the canonical UTC Date. Rather than per-calendar
// inverse math, it binary-searches each calendar's existing forward function
// over Gregorian civil days: calendar dates are monotonic in time, so the
// instant found always displays verbatim in the matching calendar node.

const INPUT_CALENDAR_DAY_MS = 86400000;
const INPUT_SEARCH_PAD_DAYS = 800;
const INPUT_SEARCH_MAX_EXPANSIONS = 6;
const INPUT_SEARCH_MAX_ESTIMATE_YEAR = 200000;
const INPUT_SEARCH_SOLSTICE_MARGIN_ENTRIES = 6; // 1.5 years of season entries

// The solstice/equinox cache only regenerates when a reference date falls
// fully outside it, but forward functions look up to a year past their input
// (e.g. next winter solstice), so a probe near the cache edge would run off
// the end. Re-center the cache whenever a probe gets within 1.5 years of
// either edge.
function _ensureSolsticeCacheNear(dateTime) {
    if (typeof generateAllSolsticesEquinoxes !== 'function' || typeof allSolsticesEquinoxes === 'undefined') {
        return;
    }
    const len = allSolsticesEquinoxes.length;
    if (len < INPUT_SEARCH_SOLSTICE_MARGIN_ENTRIES * 2 + 1
        || dateTime < allSolsticesEquinoxes[INPUT_SEARCH_SOLSTICE_MARGIN_ENTRIES].date
        || dateTime > allSolsticesEquinoxes[len - 1 - INPUT_SEARCH_SOLSTICE_MARGIN_ENTRIES].date) {
        generateAllSolsticesEquinoxes(dateTime);
    }
}

function _forwardInputCalendarAt(config, dayIndex, time, timezoneOffsetMinutes) {
    const candidate = _inputCalendarCandidate(dayIndex, time, timezoneOffsetMinutes);
    _ensureSolsticeCacheNear(candidate);
    return config.forward(candidate);
}

function _firstOutputLine(result) {
    return String(result && result.output ? result.output : '').split('\n')[0];
}

// Each entry adapts one forward calendar function to the normalized shape:
//   forward(dateTime) -> { year, month (1-based), day, leap, outputLine }
// Registry keys double as the <option value> in the calendar-type select and
// as the URL `type` parameter.
const INPUT_CALENDARS = {
    CHINESE: {
        label: 'Chinese',
        hasLeapMonths: true,
        monthsInYear: 12,
        estimateGregorianYear: (year) => year - 2698,
        inputHint: 'Input Date: yyyy-mm-dd (check Leap month for 閏 months)',
        forward: (dateTime) => {
            const r = getChineseLunisolarCalendarDate(dateTime, 'CHINA');
            return { year: r.year, month: r.month, day: r.day, leap: !!r.leapMonth, outputLine: _firstOutputLine(r) };
        }
    },
    HEBREW: {
        label: 'Hebrew',
        hasLeapMonths: true,
        monthsInYear: 12,
        estimateGregorianYear: (year) => year - 3760,
        inputHint: 'Input Date: yyyy-mm-dd (1=Tishri … 6=Adar … 12=Elul; Leap month = Adar II)',
        forward: (dateTime) => {
            const r = calculateHebrewCalendar(dateTime);
            // r.month indexes the year-shape-sliced month array. Normalize to
            // typed months 1..12 (Tishri=1 … Elul=12) with Adar II = 6 + leap.
            let month = r.month + 1;
            let leap = false;
            if (r.other && r.other.leapYear) {
                if (r.month === 6) {
                    month = 6;
                    leap = true;
                } else if (r.month > 6) {
                    month = r.month;
                }
            }
            return { year: r.year, month, day: r.day, leap, outputLine: _firstOutputLine(r) };
        }
    },
    UMM_AL_QURA: {
        label: 'Umm al-Qura',
        hasLeapMonths: false,
        monthsInYear: 12,
        // Display years skip 0 (1 BH is -1); lunar years are ~0.970224 solar years.
        estimateGregorianYear: (year) => Math.floor(622 + ((year < 0 ? year + 1 : year) - 1) * 0.970224),
        forward: (dateTime) => {
            const r = getUmmalQuraDate(dateTime);
            return { year: r.year, month: r.month + 1, day: r.day, leap: false, outputLine: _firstOutputLine(r) };
        }
    },
    SOLAR_HIJRI: {
        label: 'Solar Hijri',
        hasLeapMonths: false,
        monthsInYear: 12,
        estimateGregorianYear: (year) => (year < 0 ? year + 1 : year) + 621,
        forward: (dateTime) => {
            const springEquinox = getSolsticeEquinox(dateTime, 'SPRING');
            const r = getSolarHijriDate(dateTime, springEquinox);
            return { year: r.year, month: r.month + 1, day: r.day, leap: false, outputLine: _firstOutputLine(r) };
        }
    },
    ETHIOPIAN: {
        label: 'Ethiopian',
        hasLeapMonths: false,
        monthsInYear: 13,
        estimateGregorianYear: (year) => year + 8,
        forward: (dateTime) => {
            const r = getEthiopianDate(dateTime);
            return { year: r.year, month: r.month + 1, day: r.day, leap: false, outputLine: _firstOutputLine(r) };
        }
    },
    COPTIC: {
        label: 'Coptic',
        hasLeapMonths: false,
        monthsInYear: 13,
        estimateGregorianYear: (year) => year + 284,
        forward: (dateTime) => {
            const r = getCopticDate(dateTime);
            return { year: r.year, month: r.month + 1, day: r.day, leap: false, outputLine: _firstOutputLine(r) };
        }
    },
    THAI: {
        label: 'Thai Solar',
        hasLeapMonths: false,
        monthsInYear: 12,
        estimateGregorianYear: (year) => year - 543,
        forward: (dateTime) => {
            const r = getThaiSolar(dateTime);
            return { year: r.year, month: r.month + 1, day: r.day, leap: false, outputLine: _firstOutputLine(r) };
        }
    },
    MINGUO: {
        label: 'Minguo',
        hasLeapMonths: false,
        monthsInYear: 12,
        estimateGregorianYear: (year) => year + 1911,
        forward: (dateTime) => {
            const r = getMinguo(dateTime);
            return { year: r.year, month: r.month + 1, day: r.day, leap: false, outputLine: _firstOutputLine(r) };
        }
    },
    JUCHE: {
        label: 'Juche',
        hasLeapMonths: false,
        monthsInYear: 12,
        estimateGregorianYear: (year) => year + 1911,
        forward: (dateTime) => {
            const r = getJuche(dateTime);
            return { year: r.year, month: r.month + 1, day: r.day, leap: false, outputLine: _firstOutputLine(r) };
        }
    },
    BENGALI: {
        label: 'Bengali',
        hasLeapMonths: false,
        monthsInYear: 12,
        estimateGregorianYear: (year) => year + 593,
        forward: (dateTime) => {
            const r = getBengaliSolarDate(dateTime, 0);
            return { year: r.year, month: r.month + 1, day: r.day, leap: false, outputLine: _firstOutputLine(r) };
        }
    }
};

function getInputCalendarConfig(calendarType) {
    return Object.prototype.hasOwnProperty.call(INPUT_CALENDARS, calendarType)
        ? INPUT_CALENDARS[calendarType]
        : null;
}

// Build the candidate instant for Gregorian civil day `dayIndex` (days since
// the Unix epoch) at the user's typed time in the picker timezone. Pure
// millisecond arithmetic — no Date.UTC — so years 1–99 need no remap fix, and
// the result is identical to what parseInputDate produces for the same
// Gregorian civil fields.
function _inputCalendarCandidate(dayIndex, time, timezoneOffsetMinutes) {
    const millis = dayIndex * INPUT_CALENDAR_DAY_MS
        + time.hour * 3600000
        + time.minute * 60000
        + time.second * 1000
        - timezoneOffsetMinutes * 60000;
    return new Date(millis);
}

// Lexicographic (year, month+leap, day) comparison; the leap month sorts
// directly after its regular month, matching both Chinese leap months and the
// Hebrew Adar II encoding.
function _compareInputCalendarDates(actual, target) {
    if (actual.year !== target.year) {
        return actual.year < target.year ? -1 : 1;
    }
    const actualMonthKey = actual.month * 2 + (actual.leap ? 1 : 0);
    const targetMonthKey = target.month * 2 + (target.leap ? 1 : 0);
    if (actualMonthKey !== targetMonthKey) {
        return actualMonthKey < targetMonthKey ? -1 : 1;
    }
    if (actual.day !== target.day) {
        return actual.day < target.day ? -1 : 1;
    }
    return 0;
}

// Binary-search for the first civil day whose forward mapping is >= target.
// Returns { dayIndex, actual, exact } or null if bracketing fails.
function _resolveInputCalendarDate(config, target, time, timezoneOffsetMinutes) {
    const estimatedYear = config.estimateGregorianYear(target.year);
    if (!Number.isFinite(estimatedYear) || Math.abs(estimatedYear) > INPUT_SEARCH_MAX_ESTIMATE_YEAR) {
        return null;
    }

    const forwardAt = (dayIndex) => _forwardInputCalendarAt(config, dayIndex, time, timezoneOffsetMinutes);
    const compareAt = (dayIndex) => _compareInputCalendarDates(forwardAt(dayIndex), target);

    const seed = Math.round((estimatedYear - 1970) * 365.2425 + (target.month - 1) * 30);
    let lo = seed - INPUT_SEARCH_PAD_DAYS;
    let hi = seed + INPUT_SEARCH_PAD_DAYS;

    let span = INPUT_SEARCH_PAD_DAYS * 2;
    let expansions = 0;
    while (compareAt(lo) >= 0) {
        lo -= span;
        span *= 2;
        if (++expansions > INPUT_SEARCH_MAX_EXPANSIONS) {
            return null;
        }
    }
    span = INPUT_SEARCH_PAD_DAYS * 2;
    expansions = 0;
    while (compareAt(hi) < 0) {
        hi += span;
        span *= 2;
        if (++expansions > INPUT_SEARCH_MAX_EXPANSIONS) {
            return null;
        }
    }

    // Invariant: compareAt(lo) < 0 and compareAt(hi) >= 0
    while (hi - lo > 1) {
        const mid = Math.floor((lo + hi) / 2);
        if (compareAt(mid) < 0) {
            lo = mid;
        } else {
            hi = mid;
        }
    }

    const actual = forwardAt(hi);
    return { dayIndex: hi, actual, exact: _compareInputCalendarDates(actual, target) === 0 };
}

/**
 * Convert a date typed in a registered input calendar to the canonical UTC Date.
 * @param calendarType key of INPUT_CALENDARS
 * @param target_ { year (signed), month (1-based), day, leap }
 * @param time_ { hour, minute, second } as typed (interpreted in the picker timezone)
 * @param timezoneOffsetMinutes picker timezone offset in minutes
 * @returns { dateTime, clamped, message } or { error: 'OUT_OF_RANGE' | 'UNKNOWN_CALENDAR' }
 */
function convertInputCalendarDateToGregorian(calendarType, target_, time_, timezoneOffsetMinutes) {
    const config = getInputCalendarConfig(calendarType);
    if (!config) {
        return { error: 'UNKNOWN_CALENDAR' };
    }

    const time = {
        hour: Math.trunc(Number(time_ && time_.hour)) || 0,
        minute: Math.trunc(Number(time_ && time_.minute)) || 0,
        second: Math.trunc(Number(time_ && time_.second)) || 0
    };
    const tzMinutes = Number(timezoneOffsetMinutes) || 0;

    const year = Math.trunc(Number(target_ && target_.year));
    if (!Number.isFinite(year)) {
        return { error: 'OUT_OF_RANGE' };
    }
    const rawMonth = Math.trunc(Number(target_ && target_.month)) || 1;
    const rawDay = Math.trunc(Number(target_ && target_.day)) || 1;
    const target = {
        year,
        month: Math.min(Math.max(rawMonth, 1), config.monthsInYear),
        day: Math.min(Math.max(rawDay, 1), 31),
        leap: !!(target_ && target_.leap) && config.hasLeapMonths
    };
    const sanitized = target.month !== rawMonth || target.day !== rawDay;

    const success = (resolved, clamped, message) => ({
        dateTime: _inputCalendarCandidate(resolved.dayIndex, time, tzMinutes),
        clamped,
        message
    });

    let resolved = _resolveInputCalendarDate(config, target, time, tzMinutes);
    if (!resolved) {
        return { error: 'OUT_OF_RANGE' };
    }
    if (resolved.exact) {
        return success(resolved, sanitized, sanitized ? 'Adjusted to ' + resolved.actual.outputLine : null);
    }

    if (target.leap) {
        // Distinguish "leap month absent" from "day overflow inside an existing
        // leap month": day 1 exists for every month that exists at all.
        const leapMonthProbe = _resolveInputCalendarDate(config, { year: target.year, month: target.month, day: 1, leap: true }, time, tzMinutes);
        if (!(leapMonthProbe && leapMonthProbe.exact)) {
            const regularTarget = { year: target.year, month: target.month, day: target.day, leap: false };
            const regularResolved = _resolveInputCalendarDate(config, regularTarget, time, tzMinutes);
            if (regularResolved && regularResolved.exact) {
                return success(regularResolved, true, 'No leap month ' + target.month + ' that year — used ' + regularResolved.actual.outputLine);
            }
            if (regularResolved) {
                resolved = regularResolved;
            }
        }
    }

    // The target falls in a gap (e.g. day 30 of a 29-day month): clamp to the
    // last valid date before it, which is one civil day before the first date
    // that sorts >= target.
    const clampedIndex = resolved.dayIndex - 1;
    const clampedActual = _forwardInputCalendarAt(config, clampedIndex, time, tzMinutes);
    return {
        dateTime: _inputCalendarCandidate(clampedIndex, time, tzMinutes),
        clamped: true,
        message: 'Adjusted to ' + clampedActual.outputLine
    };
}
