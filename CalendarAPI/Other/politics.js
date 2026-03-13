//|------------------|
//|     Politics     |
//|------------------|

// A set of functions for calculating data in the Politics category.

function getCurrentPresidentialTerm(currentDateTime) {
    const epochYear = 1789;
    let januaryThisYear = createAdjustedDateTime({currentDateTime: currentDateTime, timezone: 'UTC-04:00', month: 1, day: 20, hour: 'NOON'});
    let january1789 = createAdjustedDateTime({timezone: 'UTC-04:00', year: 1789, month: 1, day: 20, hour: 'NOON'});
    let yearsSinceEpoch = currentDateTime.getFullYear()-epochYear;
    if (currentDateTime<januaryThisYear) {
        yearsSinceEpoch-=1;
    }
    let currentPresidentialTerm = differenceInDays(currentDateTime, january1789)/365.25/4;
    return currentPresidentialTerm;
}