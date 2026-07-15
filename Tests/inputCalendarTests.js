//|--------------------------------|
//|     Input Calendar Tests       |
//|--------------------------------|

// Tests for the input-calendar registry and the generic inverse search engine
// (convertInputCalendarDateToGregorian).

function _inputTestTimeParts(inputDate) {
    const timePart = inputDate.split(', ')[1] || '00:00:00';
    const [hour, minute, second] = timePart.split(':').map(Number);
    return { hour, minute, second };
}

// Round trips: forward(t) fed back through the inverse engine must land on the
// exact same instant with no clamping.
function runInputCalendarRoundTripTests(testCases) {
    let failedTestCount = 0;
    let testCount = 0;

    for (const [calendarType, inputDate, timezone] of testCases) {
        testCount++;

        const config = getInputCalendarConfig(calendarType);
        const dateTime = parseInputDate(inputDate, timezone);
        const forwardParts = config.forward(dateTime);
        const result = convertInputCalendarDateToGregorian(
            calendarType, forwardParts, _inputTestTimeParts(inputDate), convertUTCOffsetToMinutes(timezone));

        if (result.error || result.clamped !== false || result.dateTime.getTime() !== dateTime.getTime()) {
            console.error(`Input calendar round trip (${calendarType}): Test ${testCount} failed.`);
            console.error('Input:', inputDate, timezone, 'forward parts:', JSON.stringify(forwardParts));
            console.error('Expected:', dateTime.toUTCString());
            console.error('Received:', result.error ? 'error ' + result.error
                : result.dateTime.toUTCString() + (result.clamped ? ' (clamped: ' + result.message + ')' : ''));
            failedTestCount++;
        }
    }

    return failedTestCount;
}

// Known values: typed calendar components must resolve to an externally known
// Gregorian instant, exactly and without clamping.
function runInputCalendarKnownValueTests(testCases) {
    let failedTestCount = 0;
    let testCount = 0;

    for (const [calendarType, target, time, timezone, expectedUTCString] of testCases) {
        testCount++;

        const result = convertInputCalendarDateToGregorian(
            calendarType, target, time, convertUTCOffsetToMinutes(timezone));
        const actual = result.error ? 'error ' + result.error
            : result.dateTime.toUTCString() + (result.clamped ? ' (clamped)' : '');

        if (actual !== expectedUTCString) {
            console.error(`Input calendar known value (${calendarType}): Test ${testCount} failed.`);
            console.error('Target:', JSON.stringify(target));
            console.error('Expected:', expectedUTCString);
            console.error('Received:', actual);
            failedTestCount++;
        }
    }

    return failedTestCount;
}

// Clamping: nonexistent dates must resolve to the nearest valid date, flagged
// as clamped with a non-empty message.
function runInputCalendarClampTests(testCases) {
    let failedTestCount = 0;
    let testCount = 0;

    for (const [calendarType, target, time, timezone, expectedParts] of testCases) {
        testCount++;

        const config = getInputCalendarConfig(calendarType);
        const result = convertInputCalendarDateToGregorian(
            calendarType, target, time, convertUTCOffsetToMinutes(timezone));

        let failure = null;
        if (result.error) {
            failure = 'error ' + result.error;
        } else if (result.clamped !== true || !result.message) {
            failure = 'not flagged as clamped (message: ' + result.message + ')';
        } else {
            const landed = config.forward(result.dateTime);
            if (landed.year !== expectedParts.year || landed.month !== expectedParts.month
                || landed.day !== expectedParts.day || !!landed.leap !== !!expectedParts.leap) {
                failure = 'landed on ' + JSON.stringify(landed);
            }
        }

        if (failure) {
            console.error(`Input calendar clamp (${calendarType}): Test ${testCount} failed.`);
            console.error('Target:', JSON.stringify(target));
            console.error('Expected:', JSON.stringify(expectedParts));
            console.error('Received:', failure);
            failedTestCount++;
        }
    }

    return failedTestCount;
}

function testInputCalendarRoundTrips() {
    return runInputCalendarRoundTripTests([
        // Chinese: leap 6th month 2025, New Year 2024, leap 11th month 2033,
        // last day of year 4722, an early-era date, and a mismatched picker timezone
        ['CHINESE', '2025-8-1, 12:00:00', 'UTC+08:00'],
        ['CHINESE', '2024-2-10, 00:00:00', 'UTC+08:00'],
        ['CHINESE', '2033-12-25, 23:45:00', 'UTC+08:00'],
        ['CHINESE', '2025-1-28, 18:00:00', 'UTC+08:00'],
        ['CHINESE', '601-5-20, 06:00:00', 'UTC+08:00'],
        ['CHINESE', '2025-8-1, 12:00:00', 'UTC-05:00'],
        // Hebrew: Adar II and Adar I 5784, Rosh Hashanah 5786, evening rollover
        ['HEBREW', '2024-3-12, 12:00:00', 'UTC+02:00'],
        ['HEBREW', '2024-2-25, 09:00:00', 'UTC+02:00'],
        ['HEBREW', '2025-9-23, 12:00:00', 'UTC+02:00'],
        ['HEBREW', '2025-9-22, 20:00:00', 'UTC+02:00'],
        ['HEBREW', '1999-12-31, 23:59:59', 'UTC+00:00'],
        // Umm al-Qura: month boundary at sunset, mid-month, far date
        ['UMM_AL_QURA', '2024-7-6, 18:00:00', 'UTC+03:00'],
        ['UMM_AL_QURA', '2024-6-14, 10:00:00', 'UTC+03:00'],
        ['UMM_AL_QURA', '2035-10-16, 15:00:00', 'UTC+03:00'],
        // Solar Hijri: Nowruz, day before Nowruz, ordinary date
        ['SOLAR_HIJRI', '2025-3-20, 12:00:00', 'UTC+03:30'],
        ['SOLAR_HIJRI', '2025-3-19, 12:00:00', 'UTC+03:30'],
        ['SOLAR_HIJRI', '2000-6-1, 00:00:00', 'UTC+03:30'],
        // Ethiopian: Ṗagume 6 (leap), New Year
        ['ETHIOPIAN', '2023-9-11, 12:00:00', 'UTC+03:00'],
        ['ETHIOPIAN', '2024-9-11, 09:00:00', 'UTC+03:00'],
        // Coptic: Nayrouz, ordinary date
        ['COPTIC', '2024-9-11, 12:00:00', 'UTC+02:00'],
        ['COPTIC', '2023-9-6, 00:00:00', 'UTC+02:00'],
        // Thai Solar
        ['THAI', '2024-1-1, 07:30:00', 'UTC+07:00'],
        ['THAI', '1900-4-1, 00:00:00', 'UTC+07:00'],
        // Minguo
        ['MINGUO', '2024-10-10, 08:00:00', 'UTC+08:00'],
        ['MINGUO', '1950-1-1, 00:00:00', 'UTC+08:00'],
        // Juche
        ['JUCHE', '2024-4-15, 09:00:00', 'UTC+09:00'],
        // Bengali: Pohela Boishakh 1431 (post-reform), pre-reform date
        ['BENGALI', '2024-4-14, 12:00:00', 'UTC+06:00'],
        ['BENGALI', '2018-10-5, 06:00:00', 'UTC+06:00'],
    ]);
}

function testInputCalendarKnownValues() {
    return runInputCalendarKnownValueTests([
        // Chinese leap 6th month 4723 began 25 Jul 2025 (00:00 CST = 16:00 UTC prev day)
        ['CHINESE', { year: 4723, month: 6, day: 1, leap: true }, { hour: 0, minute: 0, second: 0 }, 'UTC+08:00', 'Thu, 24 Jul 2025 16:00:00 GMT'],
        // 1 Tishri 5786 (Rosh Hashanah daytime) = 23 Sep 2025
        ['HEBREW', { year: 5786, month: 1, day: 1, leap: false }, { hour: 12, minute: 0, second: 0 }, 'UTC+02:00', 'Tue, 23 Sep 2025 10:00:00 GMT'],
        // 1 Adar II 5784 = 11 Mar 2024
        ['HEBREW', { year: 5784, month: 6, day: 1, leap: true }, { hour: 12, minute: 0, second: 0 }, 'UTC+02:00', 'Mon, 11 Mar 2024 10:00:00 GMT'],
        // 1 al-Muḥarram 1446 evening = 6 Jul 2024 18:00 AST (inverts lunarCalendarTests known pair)
        ['UMM_AL_QURA', { year: 1446, month: 1, day: 1, leap: false }, { hour: 18, minute: 0, second: 0 }, 'UTC+03:00', 'Sat, 06 Jul 2024 15:00:00 GMT'],
        // Nowruz 1403 = 20 Mar 2024
        ['SOLAR_HIJRI', { year: 1403, month: 1, day: 1, leap: false }, { hour: 12, minute: 0, second: 0 }, 'UTC+03:30', 'Wed, 20 Mar 2024 08:30:00 GMT'],
        // Minguo 113-10-10 (ROC National Day 2024, 00:00 CST)
        ['MINGUO', { year: 113, month: 10, day: 10, leap: false }, { hour: 0, minute: 0, second: 0 }, 'UTC+08:00', 'Wed, 09 Oct 2024 16:00:00 GMT'],
    ]);
}

function testInputCalendarClamping() {
    return runInputCalendarClampTests([
        // No leap 6th month in 4722 (2024) -> regular month 6
        ['CHINESE', { year: 4722, month: 6, day: 1, leap: true }, { hour: 12, minute: 0, second: 0 }, 'UTC+08:00',
            { year: 4722, month: 6, day: 1, leap: false }],
        // 5785 is a common year -> leap Adar request falls back to regular Adar
        ['HEBREW', { year: 5785, month: 6, day: 10, leap: true }, { hour: 12, minute: 0, second: 0 }, 'UTC+02:00',
            { year: 5785, month: 6, day: 10, leap: false }],
        // Tevet (month 4) always has 29 days -> day 30 clamps to 29
        ['HEBREW', { year: 5786, month: 4, day: 30, leap: false }, { hour: 12, minute: 0, second: 0 }, 'UTC+02:00',
            { year: 5786, month: 4, day: 29, leap: false }],
        // Ethiopian Ṗagume has 5 days in non-leap 2016 EC -> day 6 clamps to 5
        ['ETHIOPIAN', { year: 2016, month: 13, day: 6, leap: false }, { hour: 12, minute: 0, second: 0 }, 'UTC+03:00',
            { year: 2016, month: 13, day: 5, leap: false }],
        // Solar Hijri 1402 is a common year -> 30 Esfand clamps to 29
        ['SOLAR_HIJRI', { year: 1402, month: 12, day: 30, leap: false }, { hour: 12, minute: 0, second: 0 }, 'UTC+03:30',
            { year: 1402, month: 12, day: 29, leap: false }],
        // Month beyond range sanitizes down (14 -> 12)
        ['THAI', { year: 2567, month: 14, day: 10, leap: false }, { hour: 0, minute: 0, second: 0 }, 'UTC+07:00',
            { year: 2567, month: 12, day: 10, leap: false }],
    ]);
}

// Run all tests.
function runInputCalendarTests() {
    const testFunctions = [
        testInputCalendarRoundTrips,
        testInputCalendarKnownValues,
        testInputCalendarClamping,
    ];

    const allTests = testFunctions.reduce((sum, fn) => sum + fn(), 0);
    if (allTests === 0) {
        console.log('Input Calendars: All Tests Passed.');
    }
}
