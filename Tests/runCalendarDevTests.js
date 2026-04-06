//|------------------------------|
//|  Calendar Dev Test Runner    |
//|------------------------------|
//
// Helper for running a focused set of calendar/timekeeping tests
// while developing a new system. To use it:
// - Add your calendar's test function (e.g. testEgyptianCivilCalendar)
//   to the `testFunctions` array below.
// - Call `runCalendarDevTests()` from the browser console.

function runCalendarDevTests() {
    const testFunctions = [
        // Add calendar-specific test functions here, for example:
        // testEgyptianCivilCalendar,
        // testSolarHijriCalendar,
        // testUmmAlQuraCalendar,
        //testShireCalendar,
        //testMandaeanCalendar,
        //testIgboCalendar,
    ];

    const failedCount = testFunctions.reduce((sum, fn) => sum + fn(), 0);

    if (failedCount === 0 && testFunctions.length > 0) {
        console.log('Calendar Dev Tests: All selected tests passed.');
    } else if (testFunctions.length === 0) {
        console.warn('Calendar Dev Tests: No test functions configured in testFunctions array.');
    } else {
        console.warn(`Calendar Dev Tests: ${failedCount} assertions failed across ${testFunctions.length} test function(s).`);
    }
}