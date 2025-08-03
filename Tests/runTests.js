

function runAllTests() {
    runDateManagementTests();
    runAstronomicalDataTests();
    runSolarCalendarTests();
    runLunisolarCalendarTests();
    runLunarCalendarTests();
    runProposedCalendarTests();
    runComputingTimeTests();
    runOtherCalendarTests();
}

generateAllSolsticesEquinoxes(new Date());
runAllTests();

if (typeof process !== "undefined" && process.exit) {
    process.exit(0);
}