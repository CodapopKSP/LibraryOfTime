//|---------------------------|
//|     Astronomical Data     |
//|---------------------------|

// A set of functions for calculating data in the Astronomical Data category.

// The Earth orbits once every 365.2425 days, but this handpicked value better fits solstice predictions.
const daysInAYearforSummerSolstice = 365.24161;
const daysInAYearforWinterSolstice = 365.2425;
const daysInAYearforSpringEquinox = 365.2423;
const daysInAYearforAutumnEquinox = 365.24193;
const millisecondsInYearforSummerSolstice = daysInAYearforSummerSolstice * 24 * 60 * 60 * 1000;
const millisecondsInYearforWinterSolstice = daysInAYearforWinterSolstice * 24 * 60 * 60 * 1000;
const millisecondsInYearforSpringEquinox = daysInAYearforSpringEquinox * 24 * 60 * 60 * 1000;
const millisecondsInYearforAutumnEquinox = daysInAYearforAutumnEquinox * 24 * 60 * 60 * 1000;

function getLastSummerSolstice(currentDateTime) {
    const solstice2024 = new Date(Date.UTC(2024, 5, 20, 20, 51));
    const differenceInMillis = currentDateTime - solstice2024;
    const differenceInYears = differenceInMillis / millisecondsInYearforSummerSolstice;
    const wholeNumberYearsSince2024Solstice = Math.floor(differenceInYears);
    const lastSolstice = solstice2024.getTime() + (wholeNumberYearsSince2024Solstice*millisecondsInYearforSummerSolstice)
    const lastSolsticeDate = new Date(lastSolstice);
    return lastSolsticeDate;
}

function getNextSummerSolstice(lastSolsticeDate) {
    const nextSummerSolstice = lastSolsticeDate.getTime() + millisecondsInYearforSummerSolstice;
    const nextSummerSolsticeDate = new Date(nextSummerSolstice);
    return nextSummerSolsticeDate;
}

function getLastWinterSolstice(currentDateTime) {
    const solstice2024 = new Date(Date.UTC(2024, 11, 21, 9, 20));
    const differenceInMillis = currentDateTime - solstice2024;
    const differenceInYears = differenceInMillis / millisecondsInYearforWinterSolstice;
    const wholeNumberYearsSince2024Solstice = Math.floor(differenceInYears);
    const lastSolstice = solstice2024.getTime() + (wholeNumberYearsSince2024Solstice*millisecondsInYearforWinterSolstice)
    const lastSolsticeDate = new Date(lastSolstice);
    return lastSolsticeDate;
}

function getNextWinterSolstice(lastSolsticeDate) {
    const nextSummerSolstice = lastSolsticeDate.getTime() + millisecondsInYearforWinterSolstice;
    const nextSummerSolsticeDate = new Date(nextSummerSolstice);
    return nextSummerSolsticeDate;
}

function getLastSpringEquinox(currentDateTime) {
    const solstice2024 = new Date(Date.UTC(2024, 2, 20, 3, 7));
    const differenceInMillis = currentDateTime - solstice2024;
    const differenceInYears = differenceInMillis / millisecondsInYearforSpringEquinox;
    const wholeNumberYearsSince2024Solstice = Math.floor(differenceInYears);
    const lastSpringEquinox = solstice2024.getTime() + (wholeNumberYearsSince2024Solstice*millisecondsInYearforSpringEquinox)
    const lastSpringEquinoxDate = new Date(lastSpringEquinox);
    return lastSpringEquinoxDate;
}

function getNextSpringEquinox(lastSolsticeDate) {
    const nextSpringEquinox = lastSolsticeDate.getTime() + millisecondsInYearforSpringEquinox;
    const nextSpringEquinoxDate = new Date(nextSpringEquinox);
    return nextSpringEquinoxDate;
}

function getLastAutumnEquinox(currentDateTime) {
    const solstice2024 = new Date(Date.UTC(2024, 8, 22, 12, 44));
    const differenceInMillis = currentDateTime - solstice2024;
    const differenceInYears = differenceInMillis / millisecondsInYearforAutumnEquinox;
    const wholeNumberYearsSince2024Solstice = Math.floor(differenceInYears);
    const lastSolstice = solstice2024.getTime() + (wholeNumberYearsSince2024Solstice*millisecondsInYearforAutumnEquinox)
    const lastSolsticeDate = new Date(lastSolstice);
    return lastSolsticeDate;
}

function getNextAutumnEquinox(lastSolsticeDate) {
    const nextSummerSolstice = lastSolsticeDate.getTime() + millisecondsInYearforAutumnEquinox;
    const nextSummerSolsticeDate = new Date(nextSummerSolstice);
    return nextSummerSolsticeDate;
}