//|------------------|
//|     Politics     |
//|------------------|

// A set of functions for calculating data in the Politics category.

function getCurrentPresidentialTerm(currentDateTime) {
    const epochYear = 1789;
    let januaryThisYear = createDateWithFixedYear(currentDateTime);
    januaryThisYear.setUTCMonth(0);
    januaryThisYear.setUTCDate(20);
    januaryThisYear.setUTCHours(16); // Noon in DC
    let january1789 = createDateWithFixedYear(1789, 0, 20, 16, 0, 0);
    let yearsSinceEpoch = currentDateTime.getFullYear()-epochYear;
    if (currentDateTime<januaryThisYear) {
        yearsSinceEpoch-=1;
    }
    let currentPresidentialTerm = differenceInDays(currentDateTime, january1789)/365.25/4;
    return currentPresidentialTerm;
}