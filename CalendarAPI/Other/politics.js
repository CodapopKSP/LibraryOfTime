//|------------------|
//|     Politics     |
//|------------------|

// A set of functions for calculating data in the Politics category.

const PRESIDENTIAL_EPOCH_YEAR = 1789;
const PRESIDENTIAL_TERM_LENGTH_YEARS = 4;
const PRESIDENTIAL_TZ = 'UTC-04:00';

function getCurrentPresidentialTerm(currentDateTime) {
    const januaryThisYear = createAdjustedDateTime({ currentDateTime, timezone: PRESIDENTIAL_TZ, month: 1, day: 20, hour: 'NOON' });

    let yearsSinceEpoch = currentDateTime.getFullYear() - PRESIDENTIAL_EPOCH_YEAR;
    if (currentDateTime < januaryThisYear) {
        yearsSinceEpoch -= 1;
    }

    const termsSinceEpoch = Math.floor(yearsSinceEpoch / PRESIDENTIAL_TERM_LENGTH_YEARS);
    const currentTermStartYear = PRESIDENTIAL_EPOCH_YEAR + termsSinceEpoch * PRESIDENTIAL_TERM_LENGTH_YEARS;
    const nextTermStartYear = currentTermStartYear + PRESIDENTIAL_TERM_LENGTH_YEARS;

    const currentTermStart = createAdjustedDateTime({ timezone: PRESIDENTIAL_TZ, year: currentTermStartYear, month: 1, day: 20, hour: 'NOON' });
    const nextTermStart = createAdjustedDateTime({ timezone: PRESIDENTIAL_TZ, year: nextTermStartYear, month: 1, day: 20, hour: 'NOON' });

    const currentPresidentialTerm = termsSinceEpoch + differenceInDays(currentDateTime, currentTermStart) / differenceInDays(nextTermStart, currentTermStart);
    return currentPresidentialTerm;
}