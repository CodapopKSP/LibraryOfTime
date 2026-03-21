//|-------------------|
//|     Run Tests     |
//|-------------------|

// Run all tests

function runAllTests() {
    runDateManagementTests();
    runAstronomicalDataTests();
    runSolarCalendarTests();
    runLunisolarCalendarTests();
    runLunarCalendarTests();
    runSolilunarCalendarTests();
    runProposedCalendarTests();
    runComputingTimeTests();
    runOtherCalendarTests();
    runPopCultureCalendarTests();
}

// Run a multi-day span for a given calendar function.
//
// Supports two calling styles:
// 1) Date object (or value convertible to Date)
//    multidaySpanTest(getEpiroteCalendar, new Date(), 100);
//
// 2) Test-style strings, matching the test helpers:
//    multidaySpanTest(
//        getEpiroteCalendar,
//        "2026-3-18, 00:00:00",
//        "UTC+08:00",
//        100
//    );
//
// In both cases:
// - calendarFn: function(currentDateTime[, timezoneOrOffset]) => formatted output
// - days: number of days to print (default 100)
function multidaySpanTest(calendarFn, arg2, arg3, arg4) {
    if (typeof calendarFn !== 'function') {
        console.warn('multidaySpanTest: first argument must be a function (e.g. getEpiroteCalendar).');
        return;
    }

    let timezone = null;
    let days = 100;

    const isStringCall = (typeof arg2 === 'string' && typeof arg3 === 'string');
    if (typeof (isStringCall ? arg4 : arg3) === 'number' && (isStringCall ? arg4 : arg3) > 0) {
        days = Math.floor(isStringCall ? arg4 : arg3);
    }

    let startDate = isStringCall
        ? parseInputDate(arg2, arg3)
        : (arg2 instanceof Date ? new Date(arg2.getTime()) : new Date(arg2));

    if (isStringCall) {
        timezone = arg3;
    }

    function pad2(n) {
        return n < 10 && n > -10 ? '0' + Math.abs(n) : String(n);
    }

    function formatInputStyleDate(date) {
        const year = date.getUTCFullYear();
        const month = date.getUTCMonth() + 1;
        const day = date.getUTCDate();
        const hours = pad2(date.getUTCHours());
        const minutes = pad2(date.getUTCMinutes());
        const seconds = pad2(date.getUTCSeconds());
        return year + '-' + month + '-' + day + ', ' + hours + ':' + minutes + ':' + seconds;
    }

    console.log('--- multidaySpanTest ---');
    console.log('Calendar function:', calendarFn.name || '<anonymous>');
    console.log('Days to print:', days);

    let current = new Date(startDate.getTime());
    for (let i = 0; i < days; i++) {
        let output;
        try {
            // If the calendar function expects a second parameter, pass the timezone string through.
            if (timezone !== null && calendarFn.length >= 2) {
                output = calendarFn(current, timezone);
            } else {
                output = calendarFn(current);
            }
        } catch (e) {
            console.error('multidaySpanTest: error calling calendarFn on day index', i, 'date', formatInputStyleDate(current), e);
            break;
        }

        console.log(
            `[${i + 1}/${days}]`,
            formatInputStyleDate(current),
            '\n',
            output
        );

        // Advance one civil day in UTC; underlying calendar logic can apply its own local rules.
        current.setUTCDate(current.getUTCDate() + 1);
    }
}

//runAllTests();

//multidaySpanTest(getEpiroteCalendar, "85-3-18, 00:00:00", "UTC+02:00", 100);