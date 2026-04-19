//|------------------------|
//|     Computing Time     |
//|------------------------|

// A set of functions for calculating times in the Computing Time category.

const COMPUTING_MS_PER_SECOND = 1000;
const COMPUTING_SECONDS_PER_MINUTE = 60;
const COMPUTING_MINUTES_PER_HOUR = 60;
const COMPUTING_HOURS_PER_DAY = 24;
const COMPUTING_SECONDS_PER_HOUR = COMPUTING_SECONDS_PER_MINUTE * COMPUTING_MINUTES_PER_HOUR;
const COMPUTING_MS_PER_HOUR = COMPUTING_MS_PER_SECOND * COMPUTING_SECONDS_PER_HOUR;
const COMPUTING_SECONDS_PER_DAY = COMPUTING_SECONDS_PER_HOUR * COMPUTING_HOURS_PER_DAY;
const COMPUTING_MS_PER_DAY = COMPUTING_MS_PER_SECOND * COMPUTING_SECONDS_PER_DAY;

function getUnixTime(currentDateTime) {
    return Math.floor(currentDateTime.getTime() / COMPUTING_MS_PER_SECOND);
}

const FILETIME_EPOCH = { year: 1601, month: 1, day: 1 };
const FILETIME_TICKS_PER_SECOND = 10000000;

function getCurrentFiletime(currentDateTime) {
    const jan1601 = createAdjustedDateTime(FILETIME_EPOCH);
    const msSinceEpoch = currentDateTime.getTime() - jan1601.getTime();
    const wholeSeconds = Math.floor(msSinceEpoch / COMPUTING_MS_PER_SECOND);
    const remainderMs = msSinceEpoch - wholeSeconds * COMPUTING_MS_PER_SECOND;
    return wholeSeconds * FILETIME_TICKS_PER_SECOND
        + Math.floor((remainderMs * FILETIME_TICKS_PER_SECOND) / COMPUTING_MS_PER_SECOND);
}

const DOTNET_TICKS_EPOCH = { year: 1, month: 1, day: 1 };

function getDotNetDateTimeTicks(currentDateTime) {
    const epoch = createAdjustedDateTime(DOTNET_TICKS_EPOCH);
    const msSinceEpoch = currentDateTime.getTime() - epoch.getTime();
    const wholeSeconds = Math.floor(msSinceEpoch / COMPUTING_MS_PER_SECOND);
    const remainderMs = msSinceEpoch - wholeSeconds * COMPUTING_MS_PER_SECOND;
    return wholeSeconds * FILETIME_TICKS_PER_SECOND
        + Math.floor((remainderMs * FILETIME_TICKS_PER_SECOND) / COMPUTING_MS_PER_SECOND);
}

const CHROME_MICROSECONDS_PER_SECOND = 1000000;

function getChromeTimestampMicroseconds(currentDateTime) {
    const jan1601 = createAdjustedDateTime(FILETIME_EPOCH);
    const msSinceEpoch = currentDateTime.getTime() - jan1601.getTime();
    const wholeSeconds = Math.floor(msSinceEpoch / COMPUTING_MS_PER_SECOND);
    const remainderMs = msSinceEpoch - wholeSeconds * COMPUTING_MS_PER_SECOND;
    return wholeSeconds * CHROME_MICROSECONDS_PER_SECOND
        + Math.floor((remainderMs * CHROME_MICROSECONDS_PER_SECOND) / COMPUTING_MS_PER_SECOND);
}

function getUnixTimeHex(currentDateTime) {
    const unix = getUnixTime(currentDateTime);
    if (unix < 0) {
        return '-' + (-unix).toString(16).toUpperCase();
    }
    return unix.toString(16).toUpperCase();
}

const COCOA_NS_DATE_EPOCH = { year: 2001, month: 1, day: 1 };

function getCocoaCoreDataSeconds(currentDateTime) {
    const epoch = createAdjustedDateTime(COCOA_NS_DATE_EPOCH);
    return Math.floor((currentDateTime.getTime() - epoch.getTime()) / COMPUTING_MS_PER_SECOND);
}

const MAC_HFS_PLUS_EPOCH = { year: 1904, month: 1, day: 1 };

/** Unsigned 32-bit seconds since 1904-01-01; values above 4294967295 wrap to 0. */
function macHfsPlusSecondsRollover(secondsSinceEpoch) {
    return secondsSinceEpoch >>> 0;
}

function getMacHfsPlusSeconds(currentDateTime) {
    const epoch = createAdjustedDateTime(MAC_HFS_PLUS_EPOCH);
    const seconds = Math.floor((currentDateTime.getTime() - epoch.getTime()) / COMPUTING_MS_PER_SECOND);
    return macHfsPlusSecondsRollover(seconds);
}

const NTP_TIMESTAMP_EPOCH = { year: 1900, month: 1, day: 1 };

/** Unsigned 32-bit seconds since 1900-01-01; values above 4294967295 wrap to 0. */
function ntpTimestampSecondsRollover(secondsSinceEpoch) {
    return secondsSinceEpoch >>> 0;
}

function getNtpTimestampSeconds(currentDateTime) {
    const epoch = createAdjustedDateTime(NTP_TIMESTAMP_EPOCH);
    const seconds = Math.floor((currentDateTime.getTime() - epoch.getTime()) / COMPUTING_MS_PER_SECOND);
    const rolled = ntpTimestampSecondsRollover(seconds);
    const hex = rolled.toString(16).toUpperCase();
    return rolled + '\n' + hex;
}

const DOS_FAT_YEAR_BIAS = 1980;
const DOS_FAT_SECOND_MAX = 58;
const DOS_FAT_HEX_WIDTH = 8;

function dosFatPackedToHexLittleBigEndian(packed) {
    const u = packed >>> 0;
    const bigEndianAsUint32 = ((u & 0xFF) << 24) | ((u & 0xFF00) << 8) | ((u >>> 8) & 0xFF00) | ((u >>> 24) & 0xFF);
    const hexLe = '0x' + u.toString(16).toUpperCase().padStart(DOS_FAT_HEX_WIDTH, '0');
    const hexBe = '0x' + (bigEndianAsUint32 >>> 0).toString(16).toUpperCase().padStart(DOS_FAT_HEX_WIDTH, '0');
    return hexLe + '\n' + hexBe;
}

function getDosFatTimestamp(currentDateTime, timezoneOffsetMinutes) {
    const local = createFauxUTCDate(currentDateTime, timezoneOffsetMinutes);
    const y = local.getUTCFullYear();
    const m = local.getUTCMonth() + 1;
    const d = local.getUTCDate();
    const hour = local.getUTCHours();
    const minute = local.getUTCMinutes();
    const second = Math.min(local.getUTCSeconds(), DOS_FAT_SECOND_MAX);
    const dateWord = ((y - DOS_FAT_YEAR_BIAS) << 9) | (m << 5) | d;
    const timeWord = (hour << 11) | (minute << 5) | Math.floor(second / 2);
    const packed = ((dateWord & 0xFFFF) << 16) | (timeWord & 0xFFFF);
    return dosFatPackedToHexLittleBigEndian(packed);
}

const SAS_4GL_EPOCH = { year: 1960, month: 1, day: 1 };

function getSas4glDatetime(currentDateTime) {
    const epoch = createAdjustedDateTime(SAS_4GL_EPOCH);
    const seconds = Math.floor((currentDateTime.getTime() - epoch.getTime()) / COMPUTING_MS_PER_SECOND);
    const days = Math.floor(seconds / COMPUTING_SECONDS_PER_DAY);
    return String(seconds) + '\n' + days;
}

const GPS_EPOCH = { year: 1980, month: 1, day: 6 };
let gpsLeapSecondTimestampsCache = null;
let taiLeapSecondTimestampsCache = null;

function initializeLeapSecondTimestampCaches() {
    if (gpsLeapSecondTimestampsCache === null) {
        gpsLeapSecondTimestampsCache = GPSleapSeconds.map((leapSecond) => Date.parse(leapSecond));
    }
    if (taiLeapSecondTimestampsCache === null) {
        taiLeapSecondTimestampsCache = TAIleapSeconds.map((leapSecond) => Date.parse(leapSecond));
    }
}

function getGPSTime(currentDateTime) {
    initializeLeapSecondTimestampCaches();
    const gpsEpoch = createAdjustedDateTime(GPS_EPOCH);
    const currentTimestamp = currentDateTime.getTime();

    let gpsTime = Math.floor((currentDateTime - gpsEpoch) / COMPUTING_MS_PER_SECOND);
    gpsTime += countElapsedLeapSeconds(currentTimestamp, gpsLeapSecondTimestampsCache);

    return gpsTime;
}

const GPS_SECONDS_PER_WEEK = 7 * COMPUTING_SECONDS_PER_DAY;

function getGpsWeekNumberAndSecondsOfWeek(currentDateTime) {
    const gpsSeconds = getGPSTime(currentDateTime);
    const week = Math.floor(gpsSeconds / GPS_SECONDS_PER_WEEK);
    const secondsInWeek = gpsSeconds % GPS_SECONDS_PER_WEEK;
    return week + ' ' + secondsInWeek;
}

const TAI_INITIAL_LEAP_SECONDS = 10;

function countElapsedLeapSeconds(targetTimestamp, leapSecondTimestamps) {
    let leapSecondsCount = 0;
    leapSecondTimestamps.forEach((leapSecondTimestamp) => {
        if (leapSecondTimestamp <= targetTimestamp) {
            leapSecondsCount++;
        }
    });
    return leapSecondsCount;
}

function getTAIOffsetSeconds(currentDateTime) {
    initializeLeapSecondTimestampCaches();
    return TAI_INITIAL_LEAP_SECONDS + countElapsedLeapSeconds(currentDateTime.getTime(), taiLeapSecondTimestampsCache);
}

function getTAI(currentDateTime) {
    const taiOffsetSeconds = getTAIOffsetSeconds(currentDateTime);
    const taiTimestamp = currentDateTime.getTime() + (taiOffsetSeconds * COMPUTING_MS_PER_SECOND);
    return new Date(taiTimestamp);
}

function shiftDateByDeltaT(currentDateTime, directionSign) {
    const deltaT = getDeltaT(currentDateTime);
    const shiftedTimestamp = currentDateTime.getTime() + (directionSign * deltaT * COMPUTING_MS_PER_SECOND);
    return new Date(shiftedTimestamp);
}

function convertUTToTT(currentDateTime) {
    return shiftDateByDeltaT(currentDateTime, 1);
}

function convertTTToUT(currentDateTime) {
    return shiftDateByDeltaT(currentDateTime, -1);
}

function getTT(currentDateTime) {
    return convertUTToTT(currentDateTime);
}

const LORANC_OFFSET_FROM_TAI_SECONDS = 10;

function getLORANC(currentDateTime) {
    const taiDateTime = getTAI(currentDateTime);
    return new Date(taiDateTime.getTime() - (LORANC_OFFSET_FROM_TAI_SECONDS * COMPUTING_MS_PER_SECOND));
}

const JDN_MONTH_THRESHOLD = 3;
const JDN_CENTURY_ADJUSTMENT = 100;
const JDN_CENTURY_QUADRENNIAL = 4;
const JDN_GREGORIAN_OFFSET = 2;
const JDN_JULIAN_YEAR_OFFSET = 4716;
const JDN_JULIAN_MONTH_FACTOR = 365.25;
const JDN_MONTH_FACTOR = 30.6001;
const JDN_DAY_OFFSET = 1524.5;
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

    JD += (hour + (minute / COMPUTING_MINUTES_PER_HOUR) + (second / COMPUTING_SECONDS_PER_HOUR) + (millisecond / COMPUTING_MS_PER_HOUR)) / COMPUTING_HOURS_PER_DAY;
    JD = parseFloat(JD.toFixed(JDN_DECIMAL_PLACES));
    return JD;
}

function getJulianEphemerisDay(currentDateTime) {
    const currentDateTimeTT = convertUTToTT(currentDateTime);
    return getJulianDayNumber(currentDateTimeTT);
}

const RATA_DIE_EPOCH_OFFSET = 1721424.5;

function getRataDie(currentDateTime) {
    const JD = getJulianDayNumber(currentDateTime);
    const RD = Math.floor(JD - RATA_DIE_EPOCH_OFFSET);
    return RD;
}

const JP_NOON_OFFSET_HOURS = 12;
const JP_JULIAN_YEAR_OFFSET = 4713;
const JP_CYCLE_YEARS = 7980;
const JP_CYCLE_DISPLAY_OFFSET = 1;

function getJulianPeriod(currentDateTime_) {
    const currentDateTime = new Date(currentDateTime_.getTime() - JP_NOON_OFFSET_HOURS * COMPUTING_MS_PER_HOUR);
    const julianDate = getRealJulianDate(currentDateTime);
    const JP = julianDate.year + JP_JULIAN_YEAR_OFFSET;

    let yearInCycle = ((JP % JP_CYCLE_YEARS) + JP_CYCLE_YEARS) % JP_CYCLE_YEARS;
    yearInCycle = yearInCycle === 0 ? JP_CYCLE_YEARS : yearInCycle;

    const cycle = Math.floor((JP - JP_CYCLE_DISPLAY_OFFSET) / JP_CYCLE_YEARS) + JP_CYCLE_DISPLAY_OFFSET;

    return yearInCycle + " (Cycle: " + cycle + ")";
}

function getDynamicalTimeForward(currentDateTime) {
    return convertUTToTT(currentDateTime).toISOString();
}

function getDynamicalTimeBackward(currentDateTime) {
    return convertTTToUT(currentDateTime).toISOString();
}

function getDeltaT(currentDateTime) {
    const year = currentDateTime.getUTCFullYear();
    if (year < -500) {
        const year_factor = (year - 1820) / 100;
        return -20 + 32 * year_factor**2;
    }
    if (year < 500) {
        const year_factor = year / 100;
        return 10583.6 - 1014.41 * year_factor +
            33.78311 * year_factor**2 - 5.952053 * year_factor**3 -
            0.1798452 * year_factor**4 + 0.022174192 * year_factor**5 + 0.0090316521 * year_factor**6;
    }
    if (year < 1600) {
        const year_factor = (year - 1000) / 100;
        return 1574.2 - 556.01 * year_factor + 71.23472 * year_factor**2 +
            0.319781 * year_factor**3 - 0.8503463 * year_factor**4 -
            0.005050998 * year_factor**5 + 0.0083572073 * year_factor**6;
    }
    if (year < 1700) {
        const year_factor = year - 1600;
        return 120 - 0.9808 * year_factor - 0.01532 * year_factor**2 + year_factor**3 / 7129;
    }
    if (year < 1800) {
        const year_factor = year - 1700;
        return 8.83 + 0.1603 * year_factor - 0.0059285 * year_factor**2 + 0.00013336 * year_factor**3 - year_factor**4 / 1174000;
    }
    if (year < 1860) {
        const year_factor = year - 1800;
        return 13.72 - 0.332447 * year_factor + 0.0068612 * year_factor**2 +
            0.0041116 * year_factor**3 - 0.00037436 * year_factor**4 +
            0.0000121272 * year_factor**5 - 0.0000001699 * year_factor**6 + 0.000000000875 * year_factor**7;
    }
    if (year < 1900) {
        const year_factor = year - 1860;
        return 7.62 + 0.5737 * year_factor - 0.251754 * year_factor**2 +
            0.01680668 * year_factor**3 - 0.0004473624 * year_factor**4 + year_factor**5 / 233174;
    }
    if (year < 1920) {
        const year_factor = year - 1900;
        return -2.79 + 1.494119 * year_factor - 0.0598939 * year_factor**2 +
            0.0061966 * year_factor**3 - 0.000197 * year_factor**4;
    }
    if (year < 1941) {
        const year_factor = year - 1920;
        return 21.20 + 0.84493 * year_factor -
            0.076100 * year_factor**2 + 0.0020936 * year_factor**3;
    }
    if (year < 1961) {
        const year_factor = year - 1950;
        return 29.07 + 0.407 * year_factor - year_factor**2 / 233 + (year_factor**3) / 2547;
    }
    if (year < 1986) {
        const year_factor = year - 1975;
        return 45.45 + 1.067 * year_factor - year_factor**2 / 260 - (year_factor**3) / 718;
    }
    if (year < 2005) {
        const year_factor = year - 2000;
        return 63.86 + 0.3345 * year_factor - 0.060374 * year_factor**2 +
            0.0017275 * year_factor**3 + 0.000651814 * year_factor**4 + 0.00002373599 * year_factor**5;
    }
    if (year < 2050) {
        const year_factor = year - 2000;
        return 62.92 + 0.32217 * year_factor + 0.005589 * year_factor**2;
    }
    if (year < 2150) {
        return -20 + 32 * (((year - 1820) / 100)**2) - 0.5628 * (2150 - year);
    }
    const year_factor = (year - 1820) / 100;
    return -20 + 32 * year_factor**2;
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

function getMarsSolDate(currentDateTime) {
    const deltaTDays = getDeltaT(currentDateTime) / COMPUTING_SECONDS_PER_DAY;
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
const LUNATION_SYNODIC_DAYS = 29.53058861;

function calculateLunationNumber(newMoon, estimate = false) {
    const firstNewMoon2000 = createAdjustedDateTime(LUNATION_EPOCH);
    const secondsSince2000 = (newMoon - firstNewMoon2000) / COMPUTING_MS_PER_SECOND;
    const daysSince2000 = secondsSince2000 / COMPUTING_SECONDS_PER_DAY;
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

function getJulianCircadNumber(currentDateTime) {
    const epoch = createAdjustedDateTime(JULIAN_CIRCAD_EPOCH);
    const titanDayMilliseconds = JULIAN_CIRCAD_TITAN_DAYS * COMPUTING_MS_PER_DAY;
    return (currentDateTime - epoch) / titanDayMilliseconds;
}

const SPREADSHEET_EPOCH = { year: 1899, month: 12, day: 30 };

function getSpreadsheetNowTime(currentDateTime_, timezoneOffset) {
    const currentDateTime = createFauxUTCDate(currentDateTime_, timezoneOffset);
    const baseDate = createAdjustedDateTime(SPREADSHEET_EPOCH);
    const timeDifference = currentDateTime.getTime() - baseDate.getTime();
    const daysDifference = timeDifference / COMPUTING_MS_PER_DAY;
    return Math.floor(daysDifference);
}