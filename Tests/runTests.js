import { runDateManagementTests } from "../Tests/dateManagementTests.js";
import { runSolarCalendarTests } from "../Tests/solarCalendarTests.js";
import { runLunisolarCalendarTests } from "../Tests/lunisolarCalendarTests.js";
import { runLunarCalendarTests } from "../Tests/lunarCalendarTests.js";
import { runAstronomicalDataTests } from "../Tests/astronomicalDataTests.js";
import { runProposedCalendarTests } from "../Tests/proposedCalendarTests.js";

function runAllTests() {
    runDateManagementTests();
    runAstronomicalDataTests();
    runSolarCalendarTests();
    runLunisolarCalendarTests();
    runLunarCalendarTests();
    runProposedCalendarTests();
}

runAllTests();

if (typeof process !== "undefined" && process.exit) {
    process.exit(0);
}