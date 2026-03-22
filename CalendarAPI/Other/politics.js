//|------------------|
//|     Politics     |
//|------------------|

// A set of functions for calculating data in the Politics category.

const PRESIDENTIAL_EPOCH_YEAR = 1789;
const PRESIDENTIAL_TERM_LENGTH_YEARS = 4;
const PRESIDENTIAL_DAYS_PER_YEAR = 365.25;
const PRESIDENTIAL_TZ = 'UTC-04:00';

function getCurrentPresidentialTerm(currentDateTime) {
    const januaryThisYear = createAdjustedDateTime({ currentDateTime, timezone: PRESIDENTIAL_TZ, month: 1, day: 20, hour: 'NOON' });
    const january1789 = createAdjustedDateTime({ timezone: PRESIDENTIAL_TZ, year: PRESIDENTIAL_EPOCH_YEAR, month: 1, day: 20, hour: 'NOON' });

    let yearsSinceEpoch = currentDateTime.getFullYear() - PRESIDENTIAL_EPOCH_YEAR;
    if (currentDateTime < januaryThisYear) {
        yearsSinceEpoch -= 1;
    }

    const currentPresidentialTerm = differenceInDays(currentDateTime, january1789) / PRESIDENTIAL_DAYS_PER_YEAR / PRESIDENTIAL_TERM_LENGTH_YEARS;
    return currentPresidentialTerm;
}