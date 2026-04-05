//|-----------------------------|
//|     Lunisolar Calendars     |
//|-----------------------------|

// A set of functions for calculating dates in the Lunisolar Calendars category.

// --- Metonic cycle ---
const METONIC_LEAP_YEARS = [0, 3, 6, 8, 11, 14, 17];

function isMetonicCycleLeapYear(year) {
    return METONIC_LEAP_YEARS.includes(year);
}


//|--------------------------------------|
//|     Chinese Calendar Derivatives     |
//|--------------------------------------|


const CHINESE_ZODIAC_ANIMALS = ['Rat (鼠)', 'Ox (牛)', 'Tiger (虎)', 'Rabbit (兔)', 'Dragon (龍)', 'Snake (蛇)', 'Horse (馬)', 'Goat (羊)', 'Monkey (猴)', 'Rooster (雞)', 'Dog (狗)', 'Pig (豬)'];
const VIETNAMESE_ZODIAC_ANIMALS = ['Rat (𤝞)', 'Water Buffalo (𤛠)', 'Tiger (𧲫)', 'Cat (猫)', 'Dragon (龍)', 'Snake (𧋻)', 'Horse (馭)', 'Goat (羝)', 'Monkey (𤠳)', 'Rooster (𪂮)', 'Dog (㹥)', 'Pig (㺧)'];

function calculateLunisolarDisplayYear(gregorianYear, gregorianMonth, lunisolarMonth, yearOffset) {
    let year = gregorianYear + yearOffset;
    if (gregorianMonth < 4 && lunisolarMonth > 9) {
        year -= 1;
    }
    return year;
}

function getLunisolarEarthlyBranchIndex(year, earthlyBranchOffset) {
    let earthlyBranchIndex = ((year - earthlyBranchOffset) % 12 + 12) % 12;
    if (year < 0) {
        earthlyBranchIndex += 1;
    }
    return earthlyBranchIndex % 12;
}

function getLunisolarMonthString(month, leapMonth, leapMonthSuffix) {
    return leapMonth ? month + leapMonthSuffix : month;
}

// Returns a formatted Chinese calendar CST date based on the lunisolar calculation
function getChineseLunisolarCalendarDate(currentDateTime, country) {
    const gregorianYear = currentDateTime.getUTCFullYear();
    const gregorianMonth = currentDateTime.getUTCMonth();
    const COUNTRY_CONFIG = {
        CHINA: {
            timezone: 'UTC+08:00',
            yearOffset: 2698,
            leapMonthSuffix: '閏',
            earthlyBranchOffset: 2,
            zodiacAnimals: CHINESE_ZODIAC_ANIMALS
        },
        VIETNAM: {
            timezone: 'UTC+07:00',
            yearOffset: 0,
            leapMonthSuffix: 'Nhuận',
            earthlyBranchOffset: 4,
            zodiacAnimals: VIETNAMESE_ZODIAC_ANIMALS
        },
        KOREA: {
            timezone: 'UTC+09:00',
            yearOffset: 2333,
            leapMonthSuffix: '윤',
            earthlyBranchOffset: null,
            zodiacAnimals: null
        }
    };

    const config = COUNTRY_CONFIG[country];
    if (!config) {
        return;
    }

    const lunisolarDate = getLunisolarCalendarDate(currentDateTime, config.timezone);
    const year = calculateLunisolarDisplayYear(gregorianYear, gregorianMonth, lunisolarDate.month, config.yearOffset);
    const monthString = getLunisolarMonthString(lunisolarDate.month, lunisolarDate.leapMonth, config.leapMonthSuffix);

    if (country === 'CHINA') {
        const earthlyBranchIndex = getLunisolarEarthlyBranchIndex(year, config.earthlyBranchOffset);
        const zodiac = config.zodiacAnimals[earthlyBranchIndex];
        const output = `${year}年 ${monthString}月 ${lunisolarDate.day}日\nYear of the ${zodiac}`;
        return { output, day: lunisolarDate.day, month: lunisolarDate.month, year, dayOfWeek: undefined, other: { zodiac } };
    }

    if (country === 'VIETNAM') {
        const earthlyBranchIndex = getLunisolarEarthlyBranchIndex(year, config.earthlyBranchOffset);
        const zodiac = config.zodiacAnimals[earthlyBranchIndex];
        const output = `${year} ${monthString} ${lunisolarDate.day}\nYear of the ${zodiac}`;
        return { output, day: lunisolarDate.day, month: lunisolarDate.month, year, dayOfWeek: undefined, other: { zodiac } };
    }

    const output = `${year}년 ${monthString}월 ${lunisolarDate.day}일`;
    return { output, day: lunisolarDate.day, month: lunisolarDate.month, year };
}

const SEXAGENARY_HEAVENLY_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const SEXAGENARY_EARTHLY_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const SEXAGENARY_HEAVENLY_STEMS_ENGLISH = ['Jia', 'Yi', 'Bing', 'Ding', 'Wu', 'Ji', 'Geng', 'Xin', 'Ren', 'Gui'];
const SEXAGENARY_EARTHLY_BRANCHES_ENGLISH = ['Zi', 'Chou', 'Yin', 'Mao', 'Chen', 'Si', 'Wu', 'Wei', 'Shen', 'You', 'Xu', 'Hai'];
// Returns a formatted Sexagenary year CST date based on the lunisolar calculation
function getSexagenaryYear(currentDateTime) {
    const chineseDate = getChineseLunisolarCalendarDate(currentDateTime, 'CHINA');
    const chineseCalendarYear = chineseDate && typeof chineseDate.year === 'number' ? chineseDate.year : NaN;
    const chineseYear = chineseCalendarYear - 2;

    const positiveYear = chineseYear < 0 ? 60 + (chineseYear % 60) : chineseYear;
    const heavenlyStemIndex = positiveYear % 10;
    const earthlyBranchIndex = positiveYear % 12;

    const heavenlyStem = SEXAGENARY_HEAVENLY_STEMS[heavenlyStemIndex];
    const earthlyBranch = SEXAGENARY_EARTHLY_BRANCHES[earthlyBranchIndex];
    const heavenlyStemEnglish = SEXAGENARY_HEAVENLY_STEMS_ENGLISH[heavenlyStemIndex];
    const earthlyBranchEnglish = SEXAGENARY_EARTHLY_BRANCHES_ENGLISH[earthlyBranchIndex];

    const output = heavenlyStem + earthlyBranch + ' (' + heavenlyStemEnglish + earthlyBranchEnglish + ')';
    return { output, year: chineseYear, other: { heavenlyStem, earthlyBranch } };
}


//|--------------------------|
//|     Chinese Calendar     |
//|--------------------------|

function getLunisolarCalendarDate(currentDateTime, timezone) {
    const lastWinterSolstice = getSolsticeEquinox(currentDateTime, 'WINTER', 0);
    const nextWinterSolstice = getSolsticeEquinox(currentDateTime, 'WINTER', 1);

    let startOfThisMonth = getNewMoon(currentDateTime, 0);
    startOfThisMonth = createFauxUTCDate(startOfThisMonth, timezone);
    startOfThisMonth = createAdjustedDateTime({ currentDateTime: startOfThisMonth, timezone });

    let startOfNextMonth = getNewMoon(currentDateTime, 1);
    startOfNextMonth = createFauxUTCDate(startOfNextMonth, timezone);
    startOfNextMonth = createAdjustedDateTime({ currentDateTime: startOfNextMonth, timezone });
    if (currentDateTime >= startOfNextMonth) {
        startOfThisMonth = startOfNextMonth;
    }

    const startOfMonthElevenNextYear = getMonthEleven(nextWinterSolstice, timezone);
    const startOfMonthEleven = getMonthEleven(lastWinterSolstice, timezone);

    const daysBetweenEleventhMonths = differenceInDays(startOfMonthElevenNextYear, startOfMonthEleven);
    const lunationsBetweenEleventhMonths = Math.round(daysBetweenEleventhMonths / 29.53);
    const daysBetweenStartOfMonthAndMonthEleven = differenceInDays(startOfThisMonth, startOfMonthEleven);

    let currentMonth = Math.round(daysBetweenStartOfMonthAndMonthEleven / 29.53) - 1;
    const currentDay = Math.floor(differenceInDays(currentDateTime, startOfThisMonth)) + 1;

    let isLeapMonth = false;
    let leapMonth = 0;
    if (lunationsBetweenEleventhMonths === 13) {
        currentMonth = ((currentMonth - 1) % 13 + 13) % 13 + 1;

        leapMonth = calculateFirstMonthWithoutMajorSolarTerm(startOfMonthEleven, timezone);
        if (leapMonth === currentMonth) {
            isLeapMonth = true;
        }
        if (leapMonth <= currentMonth) {
            currentMonth -= 1;
        }
    }
    currentMonth = ((currentMonth - 1) % 12 + 12) % 12 + 1;

    return { month: currentMonth, day: currentDay, leapMonth: isLeapMonth };
}

const CHINESE_MAJOR_SOLAR_TERM_LONGITUDES = [
    0, 30, 60, 90, 120, 150, 180,
    210, 240, 270, 300, 330, 360
];

// Returns 'major' or 'minor' depending on the latitude of the sun calculation
function getSolarTermTypeThisMonth(startOfMonthRef, timezone) {
    const startOfMonth = getNewMoon(startOfMonthRef, 1);
    let startOfNextMonth = getNewMoon(startOfMonthRef, 2);
    startOfNextMonth = createAdjustedDateTime({ currentDateTime: startOfNextMonth, timezone });
    startOfNextMonth.setUTCDate(startOfNextMonth.getUTCDate() - 1);

    const longitudeAtNewMoon = getLongitudeOfSun(startOfMonth);
    const longitudeAtNextNewMoon = getLongitudeOfSun(startOfNextMonth);

    if (longitudeAtNewMoon > longitudeAtNextNewMoon) {
        return 'MAJOR';
    }

    for (const termLongitude of CHINESE_MAJOR_SOLAR_TERM_LONGITUDES) {
        if (termLongitude > longitudeAtNewMoon && termLongitude < longitudeAtNextNewMoon) {
            return 'MAJOR';
        }
    }
    return 'MINOR';
}

// Returns the local-start timestamp of month 11 (the new moon at or before winter solstice).
// `searchPreviousLunation` exists for the boundary case where solstice/new-moon ordering is
// ambiguous near local-day cutover; when true, seed one lunation earlier before final correction.
function getMonthEleven(winterSolstice, timezone, searchPreviousLunation = false) {
    let lunationOffset = searchPreviousLunation ? -1 : 0;

    let closestConjunction = getNewMoon(winterSolstice, lunationOffset);
    closestConjunction = createAdjustedDateTime({ currentDateTime: closestConjunction, timezone });

    if (closestConjunction > winterSolstice) {
        closestConjunction = getNewMoon(winterSolstice, lunationOffset - 1);
        closestConjunction = createAdjustedDateTime({ currentDateTime: closestConjunction, timezone });
    }
    return closestConjunction;
}

// Returns the first month in the Chinese calendar that doesn't contain a major solar term
function calculateFirstMonthWithoutMajorSolarTerm(midnightStartOfMonthElevenLastYear, timezone) {
    const constantStartingPoint = createAdjustedDateTime({ currentDateTime: midnightStartOfMonthElevenLastYear, nullHourMinute: false, nullSeconds: false });
    let dateToCheck = createAdjustedDateTime({ currentDateTime: midnightStartOfMonthElevenLastYear, nullHourMinute: false, nullSeconds: false });
    let lunations = 0;

    while (true) {
        const solarTermType = getSolarTermTypeThisMonth(dateToCheck, timezone);

        if (solarTermType !== 'MAJOR') {
            lunations--;
            if (lunations < 1) {
                lunations += 13;
            }
            return lunations;
        }

        lunations += 1;
        dateToCheck = getNewMoon(constantStartingPoint, lunations + 1);
        dateToCheck = createAdjustedDateTime({ currentDateTime: dateToCheck, timezone });
        if (lunations > 11) {
            return 0;
        }
    }
}

//|-------------------------------------------|
//|     Babylonian Lunisolar Calendar         |
//|-------------------------------------------|

// Babylonian calendar: anchor at sunset 15 April 385 BCE (UTC+3) = year -74 month 1 day 1
// (start of Metonic cycle). Leap years: cycle years 3, 6, 8, 11, 14, 17, 19 (1-based).
// Year 17: leap month after month 6 (𒌚𒋛𒀀𒆥); other leap years: after month 12 (𒌚𒋛𒀀𒊺).
// Day/month start at sunset (UTC+3). Month boundaries from new moon + sunset rule.

const BABYLON_TZ = 'UTC+03:00';
const BABYLON_ANCHOR_YEAR = -74;
const MEAN_SYNODIC_MS = 29.530588853 * 24 * 60 * 60 * 1000;
const MAX_YEAR_ITERATIONS = 500;

const BABYLON_MONTH_NAMES = [
    '𒌚𒁈', '𒌚𒄞', '𒌚𒋞', '𒌚𒋗', '𒌚𒉈', '𒌚𒆥',
    '𒌚𒇯', '𒌚𒀳', '𒌚𒃶', '𒌚𒀊', '𒌚𒍩', '𒌚𒊺'
];
const BABYLON_LEAP_MONTH_6 = '𒌚𒋛𒀀𒆥';
const BABYLON_LEAP_MONTH_12 = '𒌚𒋛𒀀𒊺';
const BABYLON_LEAP_YEARS_1_BASED = [3, 6, 8, 11, 14, 17, 19];

function getBabylonianOffering(day) {
    if (day === 7) {
        return 'Marduk and Ishtar';
    }
    if (day === 14) {
        return 'Ninlil and Nergal';
    }
    if (day === 21) {
        return 'Sin and Shamash';
    }
    if (day === 28) {
        return 'Enki and Mah';
    }
    return null;
}

function getBabylonianCycleYear1Based(babylonYear) {
    const r = ((babylonYear - BABYLON_ANCHOR_YEAR) % 19 + 19) % 19;
    return r + 1;
}

function isBabylonianLeapYear(babylonYear) {
    const cycleYear = getBabylonianCycleYear1Based(babylonYear);
    return BABYLON_LEAP_YEARS_1_BASED.indexOf(cycleYear) >= 0;
}

function isCycleYear17(babylonYear) {
    return getBabylonianCycleYear1Based(babylonYear) === 17;
}

function countLeapYearsFromAnchor(toYear) {
    let count = 0;
    for (let y = BABYLON_ANCHOR_YEAR; y < toYear; y++) {
        if (isBabylonianLeapYear(y)) count++;
    }
    return count;
}

// Leap years in [low, high) (for computing month offset when going backward from anchor).
function countLeapYearsInRange(low, high) {
    let count = 0;
    for (let y = low; y < high; y++) {
        if (isBabylonianLeapYear(y)) count++;
    }
    return count;
}

// Two-step rule: (1) choose candidate sunset; (2) require new moon ≥ 24 h before that sunset, else next sunset.

function getMonthStartFromNewMoon(newMoonUtc, timezone) {
    const localDate = createFauxUTCDate(newMoonUtc, timezone);
    const y = localDate.getUTCFullYear();
    const m = localDate.getUTCMonth() + 1;
    const d = localDate.getUTCDate();
    let candidateSunset = createAdjustedDateTime({ timezone: timezone, year: y, month: m, day: d, hour: 'SUNSET' });
    if (newMoonUtc.getTime() > candidateSunset.getTime()) {
        const nextDay = createAdjustedDateTime({ currentDateTime: candidateSunset, nullHourMinute: false, nullSeconds: false });
        addDay(nextDay, 1);
        candidateSunset = createAdjustedDateTime({ currentDateTime: nextDay, timezone: timezone, hour: 'SUNSET' });
    }
    const hoursBeforeCandidate = (candidateSunset.getTime() - newMoonUtc.getTime()) / (60 * 60 * 1000);
    if (hoursBeforeCandidate >= 24) {
        return candidateSunset;
    }
    const dayAfter = createAdjustedDateTime({ currentDateTime: candidateSunset, nullHourMinute: false, nullSeconds: false });
    addDay(dayAfter, 1);
    return createAdjustedDateTime({ currentDateTime: dayAfter, timezone: timezone, hour: 'SUNSET' });
}

function getBabylonianYearStart(babylonYear, timezone) {
    const epoch = createAdjustedDateTime({ timezone: BABYLON_TZ, year: -385, month: 4, day: 15, hour: 'SUNSET' });
    if (babylonYear === BABYLON_ANCHOR_YEAR) {
        return epoch;
    }
    const yearsFromAnchor = babylonYear - BABYLON_ANCHOR_YEAR;
    let totalMonths;
    if (babylonYear > BABYLON_ANCHOR_YEAR) {
        totalMonths = yearsFromAnchor * 12 + countLeapYearsFromAnchor(babylonYear);
    } else {
        // Years before anchor: go back (anchor - year) years; subtract leap months in [babylonYear, anchor)
        totalMonths = yearsFromAnchor * 12 - countLeapYearsInRange(babylonYear, BABYLON_ANCHOR_YEAR);
    }
    const approxMs = epoch.getTime() + totalMonths * MEAN_SYNODIC_MS;
    const approxDate = createAdjustedDateTime({ currentDateTime: epoch, nullHourMinute: false, nullSeconds: false });
    approxDate.setTime(approxMs);
    const newMoon = getMoonPhase(approxDate, 0);
    return getMonthStartFromNewMoon(newMoon, timezone);
}

function getBabylonianLunisolarCalendar(currentDateTime) {
    // Babylonian calendar is defined by sunset in Babylon; always use BABYLON_TZ for boundaries.
    // Passing a different timezone (e.g. UTC+00:00 in tests) would compute month starts at the
    // wrong local sunset, causing epoch-aligned instants like 15:00 UTC to fall before monthStarts[0].
    const tz = BABYLON_TZ;
    const epoch = createAdjustedDateTime({ timezone: BABYLON_TZ, year: -385, month: 4, day: 15, hour: 'SUNSET' });
    const approxYears = Math.floor((currentDateTime.getTime() - epoch.getTime()) / (MEAN_SYNODIC_MS * 12.368421053));
    let babylonYear = BABYLON_ANCHOR_YEAR + approxYears;

    let yearStart;
    let nextYearStart;
    let iter = 0;
    do {
        yearStart = getBabylonianYearStart(babylonYear, tz);
        nextYearStart = getBabylonianYearStart(babylonYear + 1, tz);
        if (currentDateTime.getTime() < yearStart.getTime()) {
            babylonYear--;
        } else if (currentDateTime.getTime() >= nextYearStart.getTime()) {
            babylonYear++;
        } else {
            break;
        }
        if (++iter >= MAX_YEAR_ITERATIONS) {
            return { output: "—" };
        }
    } while (true);

    const isLeap = isBabylonianLeapYear(babylonYear);
    const leapAfter6 = isCycleYear17(babylonYear);
    const monthStarts = [];
    // Use getNewMoon (binary search on actual new moon instants) instead of getMoonPhase(cursor, 1).
    // The k-based formula in getMoonPhase can misresolve lunations when cursor is near boundaries,
    // causing skipped or merged month boundaries and days > 30. getNewMoon finds new moons relative
    // to a reference, which avoids that. Ensure coverage by generating around yearStart.
    generateAllNewMoons(yearStart);
    let newMoonRef = getNewMoon(yearStart, 0);
    if (!newMoonRef) {
        newMoonRef = getMoonPhase(yearStart, 0);
    }
    const numMonths = isLeap ? 13 : 12;
    for (let i = 0; i < numMonths; i++) {
        const monthStart = getMonthStartFromNewMoon(newMoonRef, tz);
        monthStarts.push(createAdjustedDateTime({ currentDateTime: monthStart, nullHourMinute: false, nullSeconds: false }));
        const nextNewMoon = getNewMoon(newMoonRef, 1);
        newMoonRef = nextNewMoon || getMoonPhase(newMoonRef, 1);
    }

    let monthIndex = -1;
    let monthStart = null;
    for (let i = 0; i < monthStarts.length; i++) {
        if (currentDateTime.getTime() >= monthStarts[i].getTime() && (i + 1 === monthStarts.length || currentDateTime.getTime() < monthStarts[i + 1].getTime())) {
            monthIndex = i;
            monthStart = monthStarts[i];
            break;
        }
    }
    if (monthIndex < 0 || !monthStart) {
        return { output: "—" };
    }
    let day = Math.floor(differenceInDays(currentDateTime, monthStart)) + 1;
    if (day < 1) day = 1;

    let monthName;
    if (isLeap && leapAfter6 && monthIndex === 6) {
        monthName = BABYLON_LEAP_MONTH_6;
    } else if (isLeap && !leapAfter6 && monthIndex === 12) {
        monthName = BABYLON_LEAP_MONTH_12;
    } else {
        const nameIndex = leapAfter6 && monthIndex > 6 ? monthIndex - 1 : monthIndex;
        monthName = BABYLON_MONTH_NAMES[nameIndex];
    }
    const arsacidYear = babylonYear - 64;
    const baseString = day + " " + monthName + " " + babylonYear + " SE (" + arsacidYear + " AE)";
    const offering = getBabylonianOffering(day);
    var output = offering ? baseString + "\nOffering to " + offering : baseString;
    return { output: output, day: day, month: monthIndex, year: babylonYear, dayOfWeek: undefined, other: { arsacidYear: arsacidYear, offering: offering } };
}

//|-------------------------|
//|     Hebrew Calendar     |
//|-------------------------|

const JERUSALEM_TZ = 'UTC+02:00';

const HEBREW_MONTH_DAYS_DEFICIENT = [30, 29, 29, 29, 30, 30, 29, 30, 29, 30, 29, 30, 29];
const HEBREW_MONTH_DAYS_REGULAR = [30, 29, 30, 29, 30, 30, 29, 30, 29, 30, 29, 30, 29];
const HEBREW_MONTH_DAYS_COMPLETE = [30, 30, 30, 29, 30, 30, 29, 30, 29, 30, 29, 30, 29];

const HEBREW_MONTH_NAMES = [
    'Tishri', 'Heshvan', 'Kislev', 'Tevet',
    'Shevat', 'Adar', 'Adar II',
    'Nisan', 'Iyyar', 'Sivan', 'Tammuz',
    'Av', 'Elul'
];

const HEBREW_WEEKDAY_NAMES = [
    'Yom Rishon', 'Yom Sheni', 'Yom Shlishi', 'Yom Revi\'i',
    'Yom Chamishi', 'Yom Shishi', 'Shabbat'
];

// Returns a formatted Hebrew calendar IST date
function calculateHebrewCalendar(currentDateTime) {
    let startOfToday = createAdjustedDateTime({ currentDateTime, timezone: JERUSALEM_TZ, hour: 'SUNSET' });
    if (currentDateTime.getUTCHours() < 16) {
        addDay(startOfToday, -1);
    }

    const gregorianYear = currentDateTime.getUTCFullYear();
    let earlyTishri = calculateMoladTishri(gregorianYear - 1);
    let latterTishri = calculateMoladTishri(gregorianYear);
    if (startOfToday >= latterTishri[0]) {
        earlyTishri = latterTishri;
        latterTishri = calculateMoladTishri(gregorianYear + 1);
    }

    const daysThisYear = differenceInDays(latterTishri[0], earlyTishri[0]);
    let yearMonths = HEBREW_MONTH_DAYS_COMPLETE;
    if (daysThisYear === 353 || daysThisYear === 383) {
        yearMonths = HEBREW_MONTH_DAYS_DEFICIENT;
    }
    if (daysThisYear === 354 || daysThisYear === 384) {
        yearMonths = HEBREW_MONTH_DAYS_REGULAR;
    }

    let hebrewMonthNames = HEBREW_MONTH_NAMES.slice();
    if (daysThisYear < 380) {
        yearMonths = yearMonths.slice(0, 6).concat(yearMonths.slice(7));
        hebrewMonthNames = hebrewMonthNames.slice(0, 6).concat(hebrewMonthNames.slice(7));
    }

    let daysThisYearSoFar = differenceInDays(startOfToday, earlyTishri[0]);
    const weekday = (earlyTishri[2] + daysThisYearSoFar) % 7;

    let monthIndex = 0;
    for (; monthIndex < yearMonths.length; monthIndex++) {
        if (daysThisYearSoFar < yearMonths[monthIndex]) {
            break;
        }
        daysThisYearSoFar -= yearMonths[monthIndex];
    }

    const dayOfMonth = daysThisYearSoFar + 1;
    const output = dayOfMonth + ' ' + hebrewMonthNames[monthIndex] + ' ' + earlyTishri[1] + ' AM\n' + HEBREW_WEEKDAY_NAMES[weekday];
    return { output, day: daysThisYearSoFar, month: monthIndex, year: earlyTishri[1], dayOfWeek: weekday };
}

const HEBREW_MOLAD_REFERENCE_YEAR = 5732;
const HEBREW_MOLAD_REFERENCE_METONIC_YEAR = 13;
const HEBREW_MOLAD_LENGTH_DAYS = 29.530594136;
const HEBREW_MOLAD_5732_FRACTIONAL_DAY = 0.070335648;
const HEBREW_DECHIYAH_GATRAD_HOUR = 0.13287037;
const HEBREW_DECHIYAH_BETUKAFOT_HOUR = 0.397719907;

function calculateMoladTishri(currentYear) {
    const moladTishri5732 = createAdjustedDateTime({ timezone: JERUSALEM_TZ, year: 1971, month: 9, day: 20, hour: 2 });

    const decemberOfThisYear = createAdjustedDateTime({ timezone: JERUSALEM_TZ, year: currentYear, month: 12 });
    const yearsSince5732 = decemberOfThisYear.getUTCFullYear() - moladTishri5732.getUTCFullYear();

    const metonicCyclesSince5732 = Math.floor(yearsSince5732 / 19);
    const cycleMonthsSince5732 = metonicCyclesSince5732 * 235;

    const yearsThisMetonicCycle = yearsSince5732 - (metonicCyclesSince5732 * 19);
    let totalMonths = 0;

    for (let i = 0; i < yearsThisMetonicCycle; i++) {
        const currentMetonicYear = (HEBREW_MOLAD_REFERENCE_METONIC_YEAR + i) % 19;
        totalMonths += isMetonicCycleLeapYear(currentMetonicYear) ? 13 : 12;
    }
    totalMonths += cycleMonthsSince5732;

    let daysSinceMolad5732 = totalMonths * HEBREW_MOLAD_LENGTH_DAYS + HEBREW_MOLAD_5732_FRACTIONAL_DAY;

    let weekdayOfMolad = ((Math.floor((daysSinceMolad5732 + 1) % 7) % 7) + 7) % 7;

    if (daysSinceMolad5732 - Math.floor(daysSinceMolad5732) > 0.5) {
        daysSinceMolad5732++;
        weekdayOfMolad = (weekdayOfMolad + 1) % 7;
    }

    let fractionalDay = daysSinceMolad5732 - Math.floor(daysSinceMolad5732);
    if (Math.floor(weekdayOfMolad) === 2 && fractionalDay > HEBREW_DECHIYAH_GATRAD_HOUR && fractionalDay < 0.5 &&
        !isMetonicCycleLeapYear((yearsSince5732 + HEBREW_MOLAD_REFERENCE_YEAR) % 19)) {
        daysSinceMolad5732++;
        weekdayOfMolad = (weekdayOfMolad + 1) % 7;
    }

    fractionalDay = daysSinceMolad5732 - Math.floor(daysSinceMolad5732);
    if (Math.floor(weekdayOfMolad) === 1 && fractionalDay > HEBREW_DECHIYAH_BETUKAFOT_HOUR && fractionalDay < 0.5 &&
        isMetonicCycleLeapYear((yearsSince5732 + HEBREW_MOLAD_REFERENCE_YEAR - 1) % 19)) {
        daysSinceMolad5732++;
        weekdayOfMolad = (weekdayOfMolad + 1) % 7;
    }

    if (Math.floor(weekdayOfMolad) === 0 || Math.floor(weekdayOfMolad) === 3 || Math.floor(weekdayOfMolad) === 5) {
        daysSinceMolad5732++;
        weekdayOfMolad = (weekdayOfMolad + 1) % 7;
    }

    const daysSinceMolad5732Adjusted = Math.floor(daysSinceMolad5732 - 1);
    let dayOfMoladTishri = addDay(moladTishri5732, daysSinceMolad5732Adjusted, true);
    dayOfMoladTishri = createAdjustedDateTime({ currentDateTime: dayOfMoladTishri, timezone: JERUSALEM_TZ, hour: 'SUNSET' });

    return [dayOfMoladTishri, yearsSince5732 + HEBREW_MOLAD_REFERENCE_YEAR, weekdayOfMolad];
}

//|-------------------------|
//|     Epirote Calendar    |
//|-------------------------|

// Anchor: 20 August -204 at sunset in Greece (UTC+02:00)
// This is year 1, month 1, day 1, and the start of the Metonic cycle.

const EPIROTE_TZ = 'UTC+02:00';

// Metonic leap years within each 19-year cycle (1-based)
const EPIROTE_LEAP_YEARS = [1, 3, 6, 9, 11, 14, 17];

// Month names (non-leap year)
const EPIROTE_MONTHS_NON_LEAP = [
    'ΦΟΙΝΙΚΑΙΟΣ',
    'ΚΡΑΝΕΙΟΣ',
    'ΛΑΝΟΤΡΟΠΙΟΣ',
    'ΜΑΧΑΝΕΥΣ',
    'ΔΩΔΕΚΑΤΕΥΣ',
    'ΕΥΚΛΕΙΟΣ',
    'ΑΡΤΕΜΙΣΙΟΣ',
    'ΨΥΔΡΕΥΣ',
    'ΓΑΜΕΙΛΙΟΣ',
    'ΑΓΡΙΑΝΙΟΣ',
    'ΠΑΝΑΜΟΣ',
    'ΑΠΕΛΛΑΙΟΣ'
];

// Month names (leap year, with an extra ΜΑΧΑΝΕΥΣ month)
const EPIROTE_MONTHS_LEAP = [
    'ΦΟΙΝΙΚΑΙΟΣ',
    'ΚΡΑΝΕΙΟΣ',
    'ΛΑΝΟΤΡΟΠΙΟΣ',
    'ΜΑΧΑΝΕΥΣ',
    'ΜΑΧΑΝΕΥΣ (Leap Month)',
    'ΔΩΔΕΚΑΤΕΥΣ',
    'ΕΥΚΛΕΙΟΣ',
    'ΑΡΤΕΜΙΣΙΟΣ',
    'ΨΥΔΡΕΥΣ',
    'ΓΑΜΕΙΛΙΟΣ',
    'ΑΓΡΙΑΝΙΟΣ',
    'ΠΑΝΑΜΟΣ',
    'ΑΠΕΛΛΑΙΟΣ'
];

// For each hollow month in the pattern, record the skipped *day label* (1–30).
// For full months, the skip label is 0.
const EPIROTE_MONTH_PATTERN_SKIP = [
    //  1: Skip 1,  2: Full
    1, 0,
    //  3: Skip 5,  4: Full
    5, 0,
    //  5: Skip 9,  6: Full
    9, 0,
    //  7: Skip 13, 8: Full
    13, 0,
    //  9: Skip 17, 10: Full
    17, 0,
    // 11: Skip 21, 12: Full
    21, 0,
    // 13: Skip 26, 14: Full
    26, 0,
    // 15: Skip 30, 16: Full, 17: Full
    30, 0, 0,
    // 18: Skip 4,  19: Full
    4, 0,
    // 20: Skip 8,  21: Full
    8, 0,
    // 22: Skip 12, 23: Full
    12, 0,
    // 24: Skip 16, 25: Full
    16, 0,
    // 26: Skip 20, 27: Full
    20, 0,
    // 28: Skip 24, 29: Full
    24, 0,
    // 30: Skip 28, 31: Full, 32: Full
    28, 0, 0,
    // 33: Skip 2,  34: Full
    2, 0,
    // 35: Skip 6,  36: Full
    6, 0,
    // 37: Skip 11, 38: Full
    11, 0,
    // 39: Skip 15, 40: Full
    15, 0,
    // 41: Skip 19, 42: Full
    19, 0,
    // 43: Skip 23, 44: Full
    23, 0,
    // 45: Skip 27, 46: Full, 47: Full
    27, 0, 0
];

const EPIROTE_PATTERN_LENGTH = EPIROTE_MONTH_PATTERN_SKIP.length; // 47

// Precompute month lengths (29 or 30 days) and the total days in one 47‑month pattern and one 19‑year cycle.
const EPIROTE_MONTH_PATTERN_LENGTHS = [];
let EPIROTE_DAYS_PER_PATTERN = 0;
for (let i = 0; i < EPIROTE_PATTERN_LENGTH; i++) {
    const days = EPIROTE_MONTH_PATTERN_SKIP[i] === 0 ? 30 : 29;
    EPIROTE_MONTH_PATTERN_LENGTHS.push(days);
    EPIROTE_DAYS_PER_PATTERN += days;
}

const EPIROTE_DAYS_PER_CYCLE = EPIROTE_DAYS_PER_PATTERN * 5; // 47 * 5 = 235 months

function getEpiroteAnchorDate() {
    return createAdjustedDateTime({
        timezone: EPIROTE_TZ,
        year: -204,
        month: 8,
        day: 20,
        hour: 'SUNSET'
    });
}

function isEpiroteLeapYearInCycle(yearInCycle) {
    return EPIROTE_LEAP_YEARS.indexOf(yearInCycle) !== -1;
}

function getEpiroteYearMonthFromMonthIndex(monthIndexInCycle) {
    // monthIndexInCycle: 0..234 within the 19‑year Metonic cycle
    let remainingMonths = monthIndexInCycle;
    let yearInCycle = 1;

    while (yearInCycle <= 19) {
        const monthsThisYear = isEpiroteLeapYearInCycle(yearInCycle) ? 13 : 12;
        if (remainingMonths < monthsThisYear) {
            break;
        }
        remainingMonths -= monthsThisYear;
        yearInCycle++;
    }

    const monthIndexInYear = remainingMonths; // 0‑based within that year
    return { yearInCycle, monthIndexInYear };
}

function getEpiroteMonthName(yearInCycle, monthIndexInYear) {
    const isLeapYear = isEpiroteLeapYearInCycle(yearInCycle);
    const months = isLeapYear ? EPIROTE_MONTHS_LEAP : EPIROTE_MONTHS_NON_LEAP;
    return months[monthIndexInYear] || '';
}

// Returns a formatted Epirote calendar date string:
// "<day> <month name> <years since anchor>"
function getEpiroteCalendar(currentDateTime) {
    const anchor = getEpiroteAnchorDate();

    // Determine the start of the current Epirote civil day (days start at local sunset in EPIROTE_TZ)
    let startOfEpiroteDay = createAdjustedDateTime({
        currentDateTime: currentDateTime,
        timezone: EPIROTE_TZ,
        hour: 'SUNSET'
    });
    if (currentDateTime < startOfEpiroteDay) {
        addDay(startOfEpiroteDay, -1);
    }

    // Day index since anchor, with the anchor sunset as day 1 start.
    // This value may be negative for dates before the anchor; the cycle logic
    // below extends the calendar backwards as well as forwards.
    const dayIndex = Math.floor(differenceInDays(startOfEpiroteDay, anchor));

    // Locate position within the Metonic cycle.
    const cyclesCompleted = Math.floor(dayIndex / EPIROTE_DAYS_PER_CYCLE);
    let dayInCycle = dayIndex - cyclesCompleted * EPIROTE_DAYS_PER_CYCLE;

    // Find the month within the 235‑month Metonic cycle and the day within that month.
    let monthIndexInCycle = 0;        // 0..234
    let dayOfMonthIndex = 0;          // 0‑based index within that month (physical day count)
    let patternIndexForMonth = 0;     // index into the 47‑month pattern

    for (let m = 0; m < 235; m++) {
        const patternIndex = m % EPIROTE_PATTERN_LENGTH;
        const monthLength = EPIROTE_MONTH_PATTERN_LENGTHS[patternIndex];

        if (dayInCycle < monthLength) {
            monthIndexInCycle = m;
            dayOfMonthIndex = dayInCycle;
            patternIndexForMonth = patternIndex;
            break;
        }

        dayInCycle -= monthLength;
    }

    // Map month index in cycle to year‑in‑cycle and month‑in‑year.
    const { yearInCycle, monthIndexInYear } = getEpiroteYearMonthFromMonthIndex(monthIndexInCycle);

    // Years since the anchor year (year 1 at the epoch).
    const epiroteYear = cyclesCompleted * 19 + yearInCycle;

    // Day-of-month label counting from 1 with an internal skipped label for hollow months.
    const skipLabel = EPIROTE_MONTH_PATTERN_SKIP[patternIndexForMonth];
    const isFullMonth = skipLabel === 0;
    let dayOfMonth = dayOfMonthIndex + 1;
    if (!isFullMonth) {
        if (skipLabel > 0 && dayOfMonth >= skipLabel) {
            dayOfMonth += 1;
        }
    }

    const monthName = getEpiroteMonthName(yearInCycle, monthIndexInYear);

    var output = dayOfMonth + ' ' + monthName + ' (' + epiroteYear + ')';
    return { output: output, day: dayOfMonth, month: monthIndexInYear, year: epiroteYear };
}