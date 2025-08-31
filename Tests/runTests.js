

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
}

//runAllTests();

if (typeof process !== "undefined" && process.exit) {
    process.exit(0);
}