//|------------------------|
//|     Computing Time     |
//|------------------------|

// A set of functions for calculating times in the Computing Time category.

const UNIX_MS_PER_SECOND = 1000;

function getUnixTime(currentDateTime) {
    return Math.floor(currentDateTime.getTime() / UNIX_MS_PER_SECOND);
}

const FILETIME_EPOCH = { year: 1601, month: 1, day: 1 };
const FILETIME_MS_PER_SECOND = 1000;
const FILETIME_TICKS_PER_SECOND = 10000000;

function getCurrentFiletime(currentDateTime) {
    const jan1601 = createAdjustedDateTime(FILETIME_EPOCH);
    const filetime = Math.floor((currentDateTime.getTime() - jan1601.getTime()) / FILETIME_MS_PER_SECOND) * FILETIME_TICKS_PER_SECOND;
    return filetime;
}

const GPS_EPOCH = { year: 1980, month: 1, day: 6 };

function getGPSTime(currentDateTime) {
    const gpsEpoch = createAdjustedDateTime(GPS_EPOCH);

    let gpsTime = Math.floor((currentDateTime - gpsEpoch) / UNIX_MS_PER_SECOND);

    let leapSecondsCount = 0;
    GPSleapSeconds.forEach(leapSecond => {
        if (new Date(leapSecond).getTime() <= currentDateTime) {
            leapSecondsCount++;
        }
    });

    gpsTime += leapSecondsCount;

    return gpsTime;
}

const TAI_INITIAL_LEAP_SECONDS = 10;

function getTAI(currentDateTime) {
    const taiDateTime = new Date(currentDateTime);

    let leapSecondsCount = 0;
    TAIleapSeconds.forEach(leapSecond => {
        if (new Date(leapSecond).getTime() <= currentDateTime) {
            leapSecondsCount++;
        }
    });
    taiDateTime.setSeconds(taiDateTime.getSeconds() + (TAI_INITIAL_LEAP_SECONDS + leapSecondsCount));
    return taiDateTime;
}

function getTT(currentDateTime) {
    const TT = new Date(currentDateTime);
    TT.setSeconds(currentDateTime.getSeconds() + getDeltaT(currentDateTime));
    return TT;
}

const LORANC_OFFSET_FROM_TAI_SECONDS = 10;

function getLORANC(currentDateTime) {
    const taiDateTime = getTAI(currentDateTime);
    taiDateTime.setSeconds(taiDateTime.getSeconds() - LORANC_OFFSET_FROM_TAI_SECONDS);
    return taiDateTime;
}

const JDN_MONTH_THRESHOLD = 3;
const JDN_CENTURY_ADJUSTMENT = 100;
const JDN_CENTURY_QUADRENNIAL = 4;
const JDN_GREGORIAN_OFFSET = 2;
const JDN_JULIAN_YEAR_OFFSET = 4716;
const JDN_JULIAN_MONTH_FACTOR = 365.25;
const JDN_MONTH_FACTOR = 30.6001;
const JDN_DAY_OFFSET = 1524.5;
const JDN_MINUTES_PER_HOUR = 60;
const JDN_SECONDS_PER_HOUR = 3600;
const JDN_MS_PER_HOUR = 3600000;
const JDN_HOURS_PER_DAY = 24;
const JDN_DECIMAL_PLACES = 7;

function getJulianDayNumber(currentDateTime) {
    const day = currentDateTime.getUTCDate();
    let month = currentDateTime.getUTCMonth() + 1;
    let year = currentDateTime.getUTCFullYear();
    const hour = currentDateTime.getUTCHours();
    const minute = currentDateTime.getUTCMinutes();
    const second = currentDateTime.getUTCSeconds();
    const millisecond = currentDateTime.getUTCMilliseconds();
    if (month < JDN_MONTH_THRESHOLD) {
        year -= 1;
        month += 12;
    }

    const A = Math.floor(year / JDN_CENTURY_ADJUSTMENT);
    const B = Math.floor(A / JDN_CENTURY_QUADRENNIAL);
    const C = JDN_GREGORIAN_OFFSET - A + B;
    const E = Math.floor(JDN_JULIAN_MONTH_FACTOR * (year + JDN_JULIAN_YEAR_OFFSET));
    const F = Math.floor(JDN_MONTH_FACTOR * (month + 1));
    let JD = C + day + E + F - JDN_DAY_OFFSET;

    JD += (hour + (minute / JDN_MINUTES_PER_HOUR) + (second / JDN_SECONDS_PER_HOUR) + (millisecond / JDN_MS_PER_HOUR)) / JDN_HOURS_PER_DAY;
    JD = parseFloat(JD.toFixed(JDN_DECIMAL_PLACES));
    return JD;
}

function getJulianEphemerisDay(currentDateTime) {
    const deltaTime = getDeltaT(currentDateTime);
    const currentDateTime_TT = new Date(currentDateTime);
    currentDateTime_TT.setTime(currentDateTime_TT.getTime() - deltaTime);
    return getJulianDayNumber(currentDateTime_TT);
}

const RATA_DIE_EPOCH_OFFSET = 1721424.5;

function getRataDie(currentDateTime) {
    const JD = getJulianDayNumber(currentDateTime);
    const RD = Math.floor(JD - RATA_DIE_EPOCH_OFFSET);
    return RD;
}

const JP_NOON_OFFSET_HOURS = 12;
const JP_HOURS_TO_MS = 60 * 60 * 1000;
const JP_JULIAN_YEAR_OFFSET = 4713;
const JP_CYCLE_YEARS = 7980;
const JP_CYCLE_DISPLAY_OFFSET = 1;

function getJulianPeriod(currentDateTime_) {
    const currentDateTime = new Date(currentDateTime_.getTime() - JP_NOON_OFFSET_HOURS * JP_HOURS_TO_MS);
    const julianDate = getRealJulianDate(currentDateTime);
    const JP = julianDate.year + JP_JULIAN_YEAR_OFFSET;

    let yearInCycle = ((JP % JP_CYCLE_YEARS) + JP_CYCLE_YEARS) % JP_CYCLE_YEARS;
    yearInCycle = yearInCycle === 0 ? JP_CYCLE_YEARS : yearInCycle;

    const cycle = Math.floor((JP - JP_CYCLE_DISPLAY_OFFSET) / JP_CYCLE_YEARS) + JP_CYCLE_DISPLAY_OFFSET;

    return yearInCycle + " (Cycle: " + cycle + ")";
}

const DYNAMICAL_MS_PER_SECOND = 1000;

function getDynamicalTimeForward(currentDateTime) {
    const secondsAhead = getDeltaT(currentDateTime);
    const dynamicalTimestamp = currentDateTime.getTime() + (secondsAhead * DYNAMICAL_MS_PER_SECOND);
    const dynamicalDateTime = new Date(dynamicalTimestamp);
    return dynamicalDateTime.toISOString();
}

function getDynamicalTimeBackward(currentDateTime) {
    const secondsAhead = getDeltaT(currentDateTime);
    const dynamicalTimestamp = currentDateTime.getTime() - (secondsAhead * DYNAMICAL_MS_PER_SECOND);
    const dynamicalDateTime = new Date(dynamicalTimestamp);
    return dynamicalDateTime.toISOString();
}

const DELTAT_YEAR_BOUND_BEFORE_500 = -500;
const DELTAT_YEAR_BOUND_500 = 500;
const DELTAT_YEAR_BOUND_1600 = 1600;
const DELTAT_YEAR_BOUND_1700 = 1700;
const DELTAT_YEAR_BOUND_1800 = 1800;
const DELTAT_YEAR_BOUND_1860 = 1860;
const DELTAT_YEAR_BOUND_1900 = 1900;
const DELTAT_YEAR_BOUND_1920 = 1920;
const DELTAT_YEAR_BOUND_1941 = 1941;
const DELTAT_YEAR_BOUND_1961 = 1961;
const DELTAT_YEAR_BOUND_1986 = 1986;
const DELTAT_YEAR_BOUND_2005 = 2005;
const DELTAT_YEAR_BOUND_2050 = 2050;
const DELTAT_YEAR_BOUND_2150 = 2150;
const DELTAT_CENTURY_DIVISOR = 100;
const DELTAT_OLD_PARABOLIC_OFFSET = 1820;
const DELTAT_OLD_PARABOLIC_INTERCEPT = -20;
const DELTAT_OLD_PARABOLIC_COEFF = 32;

function getDeltaT(currentDateTime) {
    const year = currentDateTime.getUTCFullYear();
    if (year < DELTAT_YEAR_BOUND_BEFORE_500) {
        const year_factor = (year - DELTAT_OLD_PARABOLIC_OFFSET) / DELTAT_CENTURY_DIVISOR;
        return DELTAT_OLD_PARABOLIC_INTERCEPT + DELTAT_OLD_PARABOLIC_COEFF * year_factor**2;
    }
    if (year < DELTAT_YEAR_BOUND_500) {
        const year_factor = year / DELTAT_CENTURY_DIVISOR;
        return 10583.6 - 1014.41 * year_factor +
            33.78311 * year_factor**2 - 5.952053 * year_factor**3 -
            0.1798452 * year_factor**4 + 0.022174192 * year_factor**5 + 0.0090316521 * year_factor**6;
    }
    if (year < DELTAT_YEAR_BOUND_1600) {
        const year_factor = (year - 1000) / DELTAT_CENTURY_DIVISOR;
        return 1574.2 - 556.01 * year_factor + 71.23472 * year_factor**2 +
            0.319781 * year_factor**3 - 0.8503463 * year_factor**4 -
            0.005050998 * year_factor**5 + 0.0083572073 * year_factor**6;
    }
    if (year < DELTAT_YEAR_BOUND_1700) {
        const year_factor = year - DELTAT_YEAR_BOUND_1600;
        return 120 - 0.9808 * year_factor - 0.01532 * year_factor**2 + year_factor**3 / 7129;
    }
    if (year < DELTAT_YEAR_BOUND_1800) {
        const year_factor = year - DELTAT_YEAR_BOUND_1700;
        return 8.83 + 0.1603 * year_factor - 0.0059285 * year_factor**2 + 0.00013336 * year_factor**3 - year_factor**4 / 1174000;
    }
    if (year < DELTAT_YEAR_BOUND_1860) {
        const year_factor = year - DELTAT_YEAR_BOUND_1800;
        return 13.72 - 0.332447 * year_factor + 0.0068612 * year_factor**2 +
            0.0041116 * year_factor**3 - 0.00037436 * year_factor**4 +
            0.0000121272 * year_factor**5 - 0.0000001699 * year_factor**6 + 0.000000000875 * year_factor**7;
    }
    if (year < DELTAT_YEAR_BOUND_1900) {
        const year_factor = year - DELTAT_YEAR_BOUND_1860;
        return 7.62 + 0.5737 * year_factor - 0.251754 * year_factor**2 +
            0.01680668 * year_factor**3 - 0.0004473624 * year_factor**4 + year_factor**5 / 233174;
    }
    if (year < DELTAT_YEAR_BOUND_1920) {
        const year_factor = year - DELTAT_YEAR_BOUND_1900;
        return -2.79 + 1.494119 * year_factor - 0.0598939 * year_factor**2 +
            0.0061966 * year_factor**3 - 0.000197 * year_factor**4;
    }
    if (year < DELTAT_YEAR_BOUND_1941) {
        const year_factor = year - DELTAT_YEAR_BOUND_1920;
        return 21.20 + 0.84493 * year_factor -
            0.076100 * year_factor**2 + 0.0020936 * year_factor**3;
    }
    if (year < DELTAT_YEAR_BOUND_1961) {
        const year_factor = year - 1950;
        return 29.07 + 0.407 * year_factor - year_factor**2 / 233 + (year_factor**3) / 2547;
    }
    if (year < DELTAT_YEAR_BOUND_1986) {
        const year_factor = year - 1975;
        return 45.45 + 1.067 * year_factor - year_factor**2 / 260 - (year_factor**3) / 718;
    }
    if (year < DELTAT_YEAR_BOUND_2005) {
        const year_factor = year - 2000;
        return 63.86 + 0.3345 * year_factor - 0.060374 * year_factor**2 +
            0.0017275 * year_factor**3 + 0.000651814 * year_factor**4 + 0.00002373599 * year_factor**5;
    }
    if (year < DELTAT_YEAR_BOUND_2050) {
        const year_factor = year - 2000;
        return 62.92 + 0.32217 * year_factor + 0.005589 * year_factor**2;
    }
    if (year < DELTAT_YEAR_BOUND_2150) {
        return DELTAT_OLD_PARABOLIC_INTERCEPT + DELTAT_OLD_PARABOLIC_COEFF * (((year - DELTAT_OLD_PARABOLIC_OFFSET) / DELTAT_CENTURY_DIVISOR)**2) - 0.5628 * (DELTAT_YEAR_BOUND_2150 - year);
    }
    const year_factor = (year - DELTAT_OLD_PARABOLIC_OFFSET) / DELTAT_CENTURY_DIVISOR;
    return DELTAT_OLD_PARABOLIC_INTERCEPT + DELTAT_OLD_PARABOLIC_COEFF * year_factor**2;
}

const LILIAN_EPOCH_OFFSET = 2299159.5;

function getLilianDate(currentDateTime) {
    const JDN = getJulianDayNumber(currentDateTime);
    const lilianDate = Math.floor(JDN - LILIAN_EPOCH_OFFSET);
    return lilianDate;
}

const ORDINAL_YEAR_BASE = 2000;
const ORDINAL_YEAR_PAD = 2;
const ORDINAL_DAY_PAD = 3;

function getOrdinalDate(currentDateTime) {
    const year = currentDateTime.getUTCFullYear() - ORDINAL_YEAR_BASE;
    const yearStr = String(year).padStart(ORDINAL_YEAR_PAD, '0');

    const jan1st = createAdjustedDateTime({ currentDateTime: currentDateTime, month: 1, day: 1 });
    const days = Math.floor(differenceInDays(currentDateTime, jan1st)) + 1;
    const paddedDays = String(days).padStart(ORDINAL_DAY_PAD, '0');

    return yearStr + paddedDays;
}

const MARS_SOL_J2000_EPOCH = 2451549.5;
const MARS_SOL_DAYS_PER_SOL = 1.0274912517;
const MARS_SOL_EPOCH_OFFSET = 44796.0;
const MARS_SOL_CORRECTION = 0.0009626;
const MARS_SOL_SECONDS_PER_MINUTE = 60;
const MARS_SOL_MINUTES_PER_HOUR = 60;
const MARS_SOL_HOURS_PER_DAY = 24;

function getMarsSolDate(currentDateTime) {
    const deltaTDays = getDeltaT(currentDateTime) / (MARS_SOL_SECONDS_PER_MINUTE * MARS_SOL_MINUTES_PER_HOUR * MARS_SOL_HOURS_PER_DAY);
    const JDN = getJulianDayNumber(currentDateTime) + deltaTDays;
    return (JDN - MARS_SOL_J2000_EPOCH) / MARS_SOL_DAYS_PER_SOL + MARS_SOL_EPOCH_OFFSET - MARS_SOL_CORRECTION;
}

const JULIAN_SOL_OFFSET = 94129;

function getJulianSolDate(currentDateTime) {
    const marsSolDate = getMarsSolDate(currentDateTime);
    return marsSolDate + JULIAN_SOL_OFFSET;
}

const KALI_AHARGANA_EPOCH_KA = 1863635;
const KALI_AHARGANA_EPOCH = { timezone: 'UTC+05:30', year: 2001, month: 7, day: 10 };

function getKaliAhargana(currentDateTime) {
    const epochDate = createAdjustedDateTime(KALI_AHARGANA_EPOCH);
    return differenceInDays(currentDateTime, epochDate) + KALI_AHARGANA_EPOCH_KA;
}

const LUNATION_EPOCH = { year: 2000, month: 1, day: 6, hour: 18, minute: 14 };
const LUNATION_MS_PER_SECOND = 1000;
const LUNATION_SECONDS_PER_DAY = 60 * 60 * 24;
const LUNATION_SYNODIC_DAYS = 29.53058861;

function calculateLunationNumber(newMoon, estimate = false) {
    const firstNewMoon2000 = createAdjustedDateTime(LUNATION_EPOCH);
    const secondsSince2000 = (newMoon - firstNewMoon2000) / LUNATION_MS_PER_SECOND;
    const daysSince2000 = secondsSince2000 / LUNATION_SECONDS_PER_DAY;
    const lunationNumber = estimate ? Math.round(daysSince2000 / LUNATION_SYNODIC_DAYS) : Math.floor(daysSince2000 / LUNATION_SYNODIC_DAYS);
    return lunationNumber;
}

const BROWN_LUNATION_OFFSET = 953;
const GOLDSTINE_LUNATION_OFFSET = 37105;
const HEBREW_LUNATION_OFFSET = 71234;
const ISLAMIC_LUNATION_OFFSET = 17038;
const THAI_LUNATION_OFFSET = 16843;
const NABONASSAR_LUNATION_OFFSET = 33963;

function getBrownLunationNumber(lunationNumber) {
    return lunationNumber + BROWN_LUNATION_OFFSET;
}

function getGoldstineLunationNumber(lunationNumber) {
    return lunationNumber + GOLDSTINE_LUNATION_OFFSET;
}

function getHebrewLunationNumber(lunationNumber) {
    return lunationNumber + HEBREW_LUNATION_OFFSET;
}

function getIslamicLunationNumber(lunationNumber) {
    return lunationNumber + ISLAMIC_LUNATION_OFFSET;
}

function getThaiLunationNumber(lunationNumber) {
    return lunationNumber + THAI_LUNATION_OFFSET;
}

function getNabonassarLunationNumber(lunationNumber) {
    return lunationNumber + NABONASSAR_LUNATION_OFFSET;
}

const JULIAN_CIRCAD_EPOCH = { year: 1609, month: 3, day: 15, hour: 18, minute: 37, second: 32 };
const JULIAN_CIRCAD_TITAN_DAYS = 0.998068439;
const JULIAN_CIRCAD_MS_PER_DAY = 24 * 60 * 60 * 1000;

function getJulianCircadNumber(currentDateTime) {
    const epoch = createAdjustedDateTime(JULIAN_CIRCAD_EPOCH);
    const titanDayMilliseconds = JULIAN_CIRCAD_TITAN_DAYS * JULIAN_CIRCAD_MS_PER_DAY;
    return (currentDateTime - epoch) / titanDayMilliseconds;
}

const SPREADSHEET_EPOCH = { year: 1899, month: 12, day: 30 };
const SPREADSHEET_MS_PER_DAY = 1000 * 60 * 60 * 24;

function getSpreadsheetNowTime(currentDateTime_, timezoneOffset) {
    const currentDateTime = createFauxUTCDate(currentDateTime_, timezoneOffset);
    const baseDate = createAdjustedDateTime(SPREADSHEET_EPOCH);
    const timeDifference = currentDateTime.getTime() - baseDate.getTime();
    const daysDifference = timeDifference / SPREADSHEET_MS_PER_DAY;
    return Math.floor(daysDifference);
}