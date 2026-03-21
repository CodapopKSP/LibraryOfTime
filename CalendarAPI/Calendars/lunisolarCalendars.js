//|-----------------------------|
//|     Lunisolar Calendars     |
//|-----------------------------|

// A set of functions for calculating dates in the Lunisolar Calendars category.

function isMetonicCycleLeapYear(year) {
    const metonicCycle = [0, 3, 6, 8, 11, 14, 17];
    return metonicCycle.includes(year);
}

function getLocalMidnightInUTC(dateToFind, localMidnight) {
    let midnightInUTC = new Date(dateToFind);
    if (midnightInUTC.getUTCHours() < localMidnight) {
        midnightInUTC.setUTCDate(midnightInUTC.getUTCDate() - 1);
    }
    midnightInUTC.setUTCHours(localMidnight);
    midnightInUTC.setUTCMinutes(0);
    midnightInUTC.setUTCSeconds(0);
    midnightInUTC.setUTCMilliseconds(0);
    return midnightInUTC;
}


//|--------------------------------------|
//|     Chinese Calendar Derivatives     |
//|--------------------------------------|

// Returns a formatted Chinese calendar CST date based on the lunisolar calculation
function getChineseLunisolarCalendarDate(currentDateTime, country) {
    const gregorianYear = currentDateTime.getUTCFullYear();
    const gregorianMonth = currentDateTime.getUTCMonth();
    let year = gregorianYear;

    // Format for Chinese calendar
    if (country==='CHINA') {
        let lunisolarDate = getLunisolarCalendarDate(currentDateTime, 'UTC+08:00');
        if ((gregorianMonth < 4)&&(lunisolarDate.month>9)) {
            year -= 1;
        }
        year += 2698;
        let zodiacAnimals = ['Rat (鼠)', 'Ox (牛)', 'Tiger (虎)', 'Rabbit (兔)', 'Dragon (龍)', 'Snake (蛇)', 'Horse (馬)', 'Goat (羊)', 'Monkey (猴)', 'Rooster (雞)', 'Dog (狗)', 'Pig (豬)'];
        let earthlyBranchIndex = ((year - 2) % 12 + 12) % 12;
        if (year < 0) {
            earthlyBranchIndex++;
        }

        let monthString = lunisolarDate.month;
        if (lunisolarDate.leapMonth) {
            monthString = monthString + "閏";
        }
        var output = `${year}年 ${monthString}月 ${lunisolarDate.day}日\nYear of the ${zodiacAnimals[earthlyBranchIndex]}`;
        return { output: output, day: lunisolarDate.day, month: lunisolarDate.month, year: year, dayOfWeek: undefined, other: { zodiac: zodiacAnimals[earthlyBranchIndex] } };
    }

    // Format for Vietnamese calendar
    if (country==='VIETNAM') {
        let lunisolarDate = getLunisolarCalendarDate(currentDateTime, 'UTC+07:00');
        if ((gregorianMonth < 4)&&(lunisolarDate.month>9)) {
            year -= 1;
        }
        let zodiacAnimals = ['Rat (𤝞)', 'Water Buffalo (𤛠)', 'Tiger (𧲫)', 'Cat (猫)', 'Dragon (龍)', 'Snake (𧋻)', 'Horse (馭)', 'Goat (羝)', 'Monkey (𤠳)', 'Rooster (𪂮)', 'Dog (㹥)', 'Pig (㺧)'];
        let earthlyBranchIndex = ((year - 4) % 12 + 12) % 12;
        if (year < 0) {
            earthlyBranchIndex++;
        }
        let monthString = lunisolarDate.month;
        if (lunisolarDate.leapMonth) {
            monthString = monthString + "Nhuận";
        }
        var output = `${year} ${monthString} ${lunisolarDate.day}\nYear of the ${zodiacAnimals[earthlyBranchIndex]}`;
        return { output: output, day: lunisolarDate.day, month: lunisolarDate.month, year: year, dayOfWeek: undefined, other: { zodiac: zodiacAnimals[earthlyBranchIndex] } };
    }

    // Format for Korean calendar
    if (country==='KOREA') {
        let lunisolarDate = getLunisolarCalendarDate(currentDateTime, 'UTC+09:00');
        if ((gregorianMonth < 4)&&(lunisolarDate.month>9)) {
            year -= 1;
        }
        year += 2333;
        if ((gregorianMonth < 4)&&(lunisolarDate.month>9)) {
            year -= 1;
        }
        let monthString = lunisolarDate.month;
        if (lunisolarDate.leapMonth) {
            monthString = monthString + "윤";
        }
        var output = `${year}년 ${monthString}월 ${lunisolarDate.day}일`;
        return { output: output, day: lunisolarDate.day, month: lunisolarDate.month, year: year };
    }
}

// Returns a formatted Sexagenary year CST date based on the lunisolar calculation
function getSexagenaryYear(currentDateTime) {
    let heavenlyStems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
    let earthlyBranches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
    let heavenlyStemsEnglish = ['Jia', 'Yi', 'Bing', 'Ding', 'Wu', 'Ji', 'Geng', 'Xin', 'Ren', 'Gui'];
    let earthlyBranchesEnglish = ['Zi', 'Chou', 'Yin', 'Mao', 'Chen', 'Si', 'Wu', 'Wei', 'Shen', 'You', 'Xu', 'Hai'];

    let chineseDate = getChineseLunisolarCalendarDate(currentDateTime, 'CHINA');
    let chineseStr = (chineseDate && chineseDate.output != null) ? chineseDate.output : chineseDate;
    let chineseYear_ = String(chineseStr).split('年');
    let chineseYear = chineseYear_[0] - 2;
    
    // Ensure year is positive before calculating indices
    let positiveYear = chineseYear < 0 ? 60 + (chineseYear % 60) : chineseYear;
    let heavenlyStemIndex = (positiveYear) % 10; // Adjusting for the start of the sexagenary cycle
    let earthlyBranchIndex = (positiveYear) % 12; // Adjusting for the start of the sexagenary cycle
    
    // Find all stems and branches
    let heavenlyStem = heavenlyStems[heavenlyStemIndex];
    let earthlyBranch = earthlyBranches[earthlyBranchIndex];
    let heavenlyStemEnglish = heavenlyStemsEnglish[heavenlyStemIndex];
    let earthlyBrancheEnglish = earthlyBranchesEnglish[earthlyBranchIndex];
    
    var output = heavenlyStem + earthlyBranch + ' (' + heavenlyStemEnglish + earthlyBrancheEnglish + ')';
    return { output: output, year: chineseYear, other: { heavenlyStem: heavenlyStem, earthlyBranch: earthlyBranch } };
}


//|--------------------------|
//|     Chinese Calendar     |
//|--------------------------|

function getLunisolarCalendarDate(currentDateTime, timezone) {
    let LastWinterSolstice = getSolsticeEquinox(currentDateTime, 'WINTER', 0);
    let nextWinterSolstice = getSolsticeEquinox(currentDateTime, 'WINTER', 1);

    let startofThisMonth = getNewMoon(currentDateTime, 0);
    startofThisMonth = createFauxUTCDate(startofThisMonth, timezone);
    startofThisMonth = createAdjustedDateTime({currentDateTime: startofThisMonth, timezone: timezone});

    // If on the day of the new moon but the new moon hasn't happened yet, then we need to take the next new moon
    let startOfNextMonth = getNewMoon(currentDateTime, 1);
    startOfNextMonth = createFauxUTCDate(startOfNextMonth, timezone);
    startOfNextMonth = createAdjustedDateTime({currentDateTime: startOfNextMonth, timezone: timezone});
    if (currentDateTime>=startOfNextMonth) {
        startofThisMonth = startOfNextMonth;
    }
    const startOfMonthElevenNextYear = getMonthEleven(nextWinterSolstice, timezone);
    const startOfMonthEleven = getMonthEleven(LastWinterSolstice, timezone);

    // Find out roughly how many months between solstices
    const daysBetweenEleventhMonths = differenceInDays(startOfMonthElevenNextYear, startOfMonthEleven);
    const lunationsBetweenEleventhMonths = Math.round(daysBetweenEleventhMonths / 29.53);
    let currentMonth = 0;
    const daysBetweenStartOfMonthAndMonthEleven = differenceInDays(startofThisMonth, startOfMonthEleven);
    
    // Get rough estimates of the current day/month,
    // likely to be wrong if close to the beginning or ending of a month
    currentMonth = Math.round(daysBetweenStartOfMonthAndMonthEleven / 29.53)-1;
    let currentDay = Math.floor(differenceInDays(currentDateTime, startofThisMonth))+1;

    // Leap Year
    let isLeapMonth = false;
    let leapMonth = 0;
    if (lunationsBetweenEleventhMonths===13) {

        // Ensure the currentMonth is within the range 1 to 12
        currentMonth = ((currentMonth - 1) % 13 + 13) % 13 + 1;

        // The leap month repeats the number of the last month, so subsequent months will be back by 1
        leapMonth = calculateFirstMonthWithoutMajorSolarTerm(startOfMonthEleven, timezone);
        if (leapMonth===currentMonth) {
            isLeapMonth = true;
        }

        if (leapMonth<=currentMonth) {
            currentMonth-=1;
        }

    }
    // Ensure the currentMonth is within the range 1 to 12
    currentMonth = ((currentMonth - 1) % 12 + 12) % 12 + 1;

    return {
        month: currentMonth,
        day: currentDay,
        leapMonth: isLeapMonth,
    };
}

// Returns 'major' or 'minor' depending on the latitude of the sun calculation
function getSolarTermTypeThisMonth(startOfMonth_, timezone) {
    let startOfMonth = getNewMoon(startOfMonth_, 1);
    let startOfNextMonth = getNewMoon(startOfMonth_, 2);  // Get 2 lunations later, Lunation 1 is later in the same day
    startOfNextMonth = createAdjustedDateTime({currentDateTime: startOfNextMonth, timezone: timezone});
    startOfNextMonth.setUTCDate(startOfNextMonth.getUTCDate() - 1);  // Go back 1 day to not count the first day of the next month
    
    const newMoonThisMonthLongitudeOfSun = getLongitudeOfSun(startOfMonth);
    const newMoonNextMonthLongitudeOfSun = getLongitudeOfSun(startOfNextMonth);

    const MajorSolarTerms = [
        0, 30, 60, 90,
        120, 150, 180,
        210, 240, 270,
        300, 330, 360
    ]

    // Sun passes 360/0 in this month and screws with the comparison logic below
    if (newMoonThisMonthLongitudeOfSun > newMoonNextMonthLongitudeOfSun) {
        return 'MAJOR';
    }

    for (const term of MajorSolarTerms) {
        // Check if the current term falls between the longitudes
        if (term > newMoonThisMonthLongitudeOfSun && term < newMoonNextMonthLongitudeOfSun) {
            return 'MAJOR';
        }
    }
    return 'MINOR';
}

// Possible errors here if the conjunction happens a few hours after the solstice but before midnight
// Returns an unformatted date object of the last New Moon before the Winter Solstice
function getMonthEleven(winterSolstice, timezone, weirdShitAroundSolstice) {

    let currentMonth = 0;
    if (weirdShitAroundSolstice) {
        currentMonth = -1;
    }

    // Get the lunar conjunction closest to the winter solstice
    let closestConjunction = getNewMoon(winterSolstice, currentMonth);
    closestConjunction = createAdjustedDateTime({currentDateTime: closestConjunction, timezone: timezone});

    // Check if the closest conjunction is after the winter solstice
    if (closestConjunction > winterSolstice) {
        // Move to the previous month to find the start of the eleventh month
        closestConjunction = getNewMoon(winterSolstice, currentMonth - 1);
        closestConjunction = createAdjustedDateTime({currentDateTime: closestConjunction, timezone: timezone});
    }
    return closestConjunction;
}

// Returns the first month in the Chinese calendar that doesn't contain a major solar term
function calculateFirstMonthWithoutMajorSolarTerm(midnightStartOfMonthElevenLastYear, timezone) {
    const costantStartingPoint = new Date(midnightStartOfMonthElevenLastYear);
    let dateToCheck = new Date(midnightStartOfMonthElevenLastYear);
    let lunations = 0;
    while (true) {
        let solarTermType = getSolarTermTypeThisMonth(dateToCheck, timezone);

        if (solarTermType !== 'MAJOR') {
            // Found the first month without a major solar term
            lunations--;
            if (lunations < 1) {
                lunations += 13;
            }
            return lunations;
        }
        
        // Move to the start of the next month
        lunations += 1;
        dateToCheck = getNewMoon(costantStartingPoint, lunations+1);
        dateToCheck = createAdjustedDateTime({currentDateTime: dateToCheck, timezone: timezone});
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
const MEAN_SYNODIC_DAY = 29.530588853;
const MEAN_SYNODIC_MS = MEAN_SYNODIC_DAY * 24 * 60 * 60 * 1000;
const MAX_YEAR_ITERATIONS = 500;

const BABYLON_MONTH_NAMES = [
    '𒌚𒁈', '𒌚𒄞', '𒌚𒋞', '𒌚𒋗', '𒌚𒉈', '𒌚𒆥',
    '𒌚𒇯', '𒌚𒀳', '𒌚𒃶', '𒌚𒀊', '𒌚𒍩', '𒌚𒊺'
];
const BABYLON_LEAP_MONTH_6 = '𒌚𒋛𒀀𒆥';
const BABYLON_LEAP_MONTH_12 = '𒌚𒋛𒀀𒊺';

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
    return [3, 6, 8, 11, 14, 17, 19].indexOf(cycleYear) >= 0;
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
const BABYLON_VISIBILITY_HOURS = 24;

function getMonthStartFromNewMoon(newMoonUtc, timezone) {
    const offsetMs = convertUTCOffsetToMinutes(timezone) * 60 * 1000;
    const localDate = new Date(newMoonUtc.getTime() + offsetMs);
    const y = localDate.getUTCFullYear();
    const m = localDate.getUTCMonth() + 1;
    const d = localDate.getUTCDate();
    let candidateSunset = createAdjustedDateTime({ timezone: timezone, year: y, month: m, day: d, hour: 'SUNSET' });
    if (newMoonUtc.getTime() > candidateSunset.getTime()) {
        const nextDay = new Date(candidateSunset.getTime());
        addDay(nextDay, 1);
        candidateSunset = createAdjustedDateTime({ currentDateTime: nextDay, timezone: timezone, hour: 'SUNSET' });
    }
    const hoursBeforeCandidate = (candidateSunset.getTime() - newMoonUtc.getTime()) / (60 * 60 * 1000);
    if (hoursBeforeCandidate >= BABYLON_VISIBILITY_HOURS) {
        return candidateSunset;
    }
    const dayAfter = new Date(candidateSunset.getTime());
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
    const approxDate = new Date(approxMs);
    const newMoon = getMoonPhase(approxDate, 0);
    return getMonthStartFromNewMoon(newMoon, timezone);
}

function getBabylonianLunisolarCalendar(currentDateTime, timezone) {
    const tz = timezone || BABYLON_TZ;
    const epoch = createAdjustedDateTime({ timezone: BABYLON_TZ, year: -385, month: 4, day: 15, hour: 'SUNSET' });
    const approxYears = Math.floor((currentDateTime.getTime() - epoch.getTime()) / (MEAN_SYNODIC_MS * 12.5));
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
    let cursor = new Date(yearStart.getTime());
    const numMonths = isLeap ? 13 : 12;
    for (let i = 0; i < numMonths; i++) {
        monthStarts.push(new Date(cursor.getTime()));
        const nextNewMoon = getMoonPhase(cursor, 1);
        cursor = getMonthStartFromNewMoon(nextNewMoon, tz);
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

// Returns a formatted Hebrew calendar IST date
function calculateHebrewCalendar(currentDateTime) {

    // Number of days in each Hebrew month
    const Hebrew_monthDaysDeficient = [30, 29, 29, 29, 30, 30, 29, 30, 29, 30, 29, 30, 29]; // 353 or 383 days
    const Hebrew_monthDaysRegular = [30, 29, 30, 29, 30, 30, 29, 30, 29, 30, 29, 30, 29]; // 354 or 384 days
    const Hebrew_monthDaysComplete = [30, 30, 30, 29, 30, 30, 29, 30, 29, 30, 29, 30, 29]; // 355 or 385 days

    let HebrewMonths = [
        "Tishri","Heshvan","Kislev","Tevet",
        "Shevat","Adar","Adar II", // In leap years only
        "Nisan","Iyyar","Sivan","Tammuz",
        "Av","Elul"
    ];

    const hebrewDaysOfWeek = [
        "Yom Rishon",    // Sunday
        "Yom Sheni",     // Monday
        "Yom Shlishi",   // Tuesday
        "Yom Revi'i",    // Wednesday
        "Yom Chamishi",  // Thursday
        "Yom Shishi",    // Friday
        "Shabbat"        // Saturday
    ];

    // Get the start of today. If before sunset in Jerusalem (UTC+2, 6pm) then go back one day.
    let startOfToday = createAdjustedDateTime({currentDateTime: currentDateTime, timezone: 'UTC+02:00', hour: 'SUNSET'});
    if (currentDateTime.getUTCHours() < 16) {
        addDay(startOfToday, -1);
    }

    // Figure out the starting and ending Tishri
    let earlyTishri = calculateMoladTishri(currentDateTime.getUTCFullYear()-1);
    let latterTishri = calculateMoladTishri(currentDateTime.getUTCFullYear());
    if (startOfToday >= latterTishri[0]) {
        earlyTishri = latterTishri;
        latterTishri = calculateMoladTishri(currentDateTime.getUTCFullYear()+1);
    }

    // Calculate number of days this year and use that to determine the year type
    const daysThisYear = differenceInDays(latterTishri[0], earlyTishri[0]);
    let yearMonths = Hebrew_monthDaysComplete;
    if (daysThisYear === 353 || daysThisYear === 383) {
        yearMonths = Hebrew_monthDaysDeficient;
    }
    if (daysThisYear === 354 || daysThisYear === 384) {
        yearMonths = Hebrew_monthDaysRegular;
    }

    // If not a leap year, remove Adar II
    if (daysThisYear < 380) {
        yearMonths.splice(6, 1);
        HebrewMonths.splice(6, 1);
    }

    // Get current day of the year
    let daysThisYearSoFar = differenceInDays(startOfToday, earlyTishri[0]);

    // Figure out weekday
    let weekday = (earlyTishri[2] + daysThisYearSoFar) % 7;

    // Iterate through months until we run out of days
    let monthIndex = 0;
    for (monthIndex; monthIndex < yearMonths.length; monthIndex++) {
        if (daysThisYearSoFar < yearMonths[monthIndex]) {
            break;
        }
        daysThisYearSoFar -= yearMonths[monthIndex];
    }

    var output = (daysThisYearSoFar+1) + " " + HebrewMonths[monthIndex] + " " + earlyTishri[1] + " AM\n" + hebrewDaysOfWeek[weekday];
    return { output: output, day: daysThisYearSoFar, month: monthIndex, year: earlyTishri[1], dayOfWeek: weekday };
}

function calculateMoladTishri(currentYear) {
    // I originally did this calculation by using a modified currentDateTime to account for sunset, and also adding time to the base molad because it doesn't actually happen at midnight UTC
    // However, none of that was necessary. The calculation just finds how many days since the start of the base molad day for a given year.
    // This may be incorrect in rare cases, but I can't find any. If that happens it might be necessary to re-calculate based on timezone/sunset and molad time

    // Start with a known Molad
    // 5732, First Molad Tishri after Unix epoch, no dechiyot (modifications), year 13 in a metonic cycle, Monday
    const moladTishri5732 = createAdjustedDateTime({timezone: 'UTC+02:00', year: 1971, month: 9, day: 20, hour: 2});

    // Determine how many months are between your starting year and the year you want
    // The starting year number can come from starting in December and counting solar years from 5732
    let decemberOfThisYear = createAdjustedDateTime({timezone: 'UTC+02:00', year: currentYear, month: 12});
    const yearsSince5732 = decemberOfThisYear.getUTCFullYear() - moladTishri5732.getUTCFullYear();

    // Full Metonic cycles have 235 months
    let metonicCyclesSince5732 = Math.floor(yearsSince5732/19);
    let cycleMonthsSince5732 = metonicCyclesSince5732 * 235;

    // Metonic leap years have 13 months. Other years have 12.
    let yearsThisMetonicCycle = yearsSince5732 - (metonicCyclesSince5732*19);
    let totalMonths = 0;
    let baseMetonicYear = 13; // 5732 is year 13 of Metonic cycle

    // Iterate over all years starting from the baseMetonicYear and moving forward
    for (let i = 0; i < yearsThisMetonicCycle; i++) {
    let currentMetonicYear = (baseMetonicYear + i) % 19;
    if (isMetonicCycleLeapYear(currentMetonicYear)) {
        totalMonths += 13;
    } else {
        totalMonths += 12;
    }
    }
    totalMonths += cycleMonthsSince5732;

    // Multiply months by the length of the molad
    const moladLength = 29.530594136;
    let daysSinceMolad5732 = totalMonths * moladLength;
    // Add the fraction of the day from Molad 5732 (0.070335648). Not really sure but there are a ton of wrong results if I do the full 7h 41m but it's fine if I take 6 hours off of that...
    daysSinceMolad5732+=0.070335648;

    // Get the number of days since Molad Tishri 5732, add 1 (starting Molad is on Monday), and modulo by 7 to get the week day
    let weekdayOfMolad = (daysSinceMolad5732 + 1) % 7;
    weekdayOfMolad = ((Math.floor(weekdayOfMolad) % 7) + 7) % 7; // Fix negative dates

    // Apply the Dechiyot
    // Molad Zakein: (if past noon, add one day)
    if (daysSinceMolad5732 - Math.floor(daysSinceMolad5732) > 0.5) {
        daysSinceMolad5732++;
        weekdayOfMolad++;
        weekdayOfMolad = weekdayOfMolad%7;
    }

    // Gatarad: Non-leap year, Tuesday between 3:11:20 and 12:00:00, (Occurred in 1984, Next is 2035)
    // 3:11:20 = 0.13287037
    if ((Math.floor(weekdayOfMolad)===2) && 
        ((daysSinceMolad5732 - Math.floor(daysSinceMolad5732)) > 0.13287037) && 
        ((daysSinceMolad5732 - Math.floor(daysSinceMolad5732)) < 0.5) &&
        (!isMetonicCycleLeapYear(yearsSince5732 + 5732))) {
        daysSinceMolad5732++;
        weekdayOfMolad++;
        weekdayOfMolad = weekdayOfMolad%7;
    }

    // Betukafot: After a leap year, Monday between 9:32:43 and 12:00:00, (Occurred in 2005, Next is 2116)
    // 9:32:43 = 0.397719907
    if ((Math.floor(weekdayOfMolad)===1) && 
        ((daysSinceMolad5732 - Math.floor(daysSinceMolad5732)) > 0.397719907) && 
        ((daysSinceMolad5732 - Math.floor(daysSinceMolad5732)) < 0.5) &&
        (isMetonicCycleLeapYear((yearsSince5732 + 5731)%19))) {
        daysSinceMolad5732++;
        weekdayOfMolad++;
        weekdayOfMolad = weekdayOfMolad%7;
    }

    // Lo A"DU Rosh: (if Sunday, Wednesday, Friday, add one day)
    if (Math.floor(weekdayOfMolad)===0 || Math.floor(weekdayOfMolad)===3 || Math.floor(weekdayOfMolad)===5) {
        daysSinceMolad5732++;
        weekdayOfMolad++;
        weekdayOfMolad = weekdayOfMolad%7;
    }

    // Subtract 1 because the start of the day is at sunset the day before
    let daysSinceMolad5732Adjusted = Math.floor(daysSinceMolad5732-1);
    let dayOfMoladTishri = addDay(moladTishri5732, daysSinceMolad5732Adjusted, true);
    dayOfMoladTishri = createAdjustedDateTime({currentDateTime: dayOfMoladTishri, timezone: 'UTC+02:00', hour: 'SUNSET'});
    
    return [dayOfMoladTishri, yearsSince5732 + 5732, weekdayOfMolad];
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

// Full / hollow month pattern over 47 months, repeating 5 times per Metonic cycle (47 * 5 = 235 months)
// "true"  = full (30 days)
// "false" = hollow (29 days) with a skipped *label* inside the month according to EPIROTE_MONTH_PATTERN_SKIP.
const EPIROTE_MONTH_PATTERN_FULL = [
    //  1: Skip 1,  2: Full
    false, true,
    //  3: Skip 5,  4: Full
    false, true,
    //  5: Skip 9,  6: Full
    false, true,
    //  7: Skip 13, 8: Full
    false, true,
    //  9: Skip 17, 10: Full
    false, true,
    // 11: Skip 21, 12: Full
    false, true,
    // 13: Skip 26, 14: Full
    false, true,
    // 15: Skip 30, 16: Full, 17: Full
    false, true, true,
    // 18: Skip 4,  19: Full
    false, true,
    // 20: Skip 8,  21: Full
    false, true,
    // 22: Skip 12, 23: Full
    false, true,
    // 24: Skip 16, 25: Full
    false, true,
    // 26: Skip 20, 27: Full
    false, true,
    // 28: Skip 24, 29: Full
    false, true,
    // 30: Skip 28, 31: Full, 32: Full
    false, true, true,
    // 33: Skip 2,  34: Full
    false, true,
    // 35: Skip 6,  36: Full
    false, true,
    // 37: Skip 11, 38: Full
    false, true,
    // 39: Skip 15, 40: Full
    false, true,
    // 41: Skip 19, 42: Full
    false, true,
    // 43: Skip 23, 44: Full
    false, true,
    // 45: Skip 27, 46: Full, 47: Full
    false, true, true
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

const EPIROTE_PATTERN_LENGTH = EPIROTE_MONTH_PATTERN_FULL.length; // 47

// Precompute month lengths (29 or 30 days) and the total days in one 47‑month pattern and one 19‑year cycle.
const EPIROTE_MONTH_PATTERN_LENGTHS = [];
let EPIROTE_DAYS_PER_PATTERN = 0;
for (let i = 0; i < EPIROTE_PATTERN_LENGTH; i++) {
    const days = EPIROTE_MONTH_PATTERN_FULL[i] ? 30 : 29;
    EPIROTE_MONTH_PATTERN_LENGTHS.push(days);
    EPIROTE_DAYS_PER_PATTERN += days;
}

const EPIROTE_MONTHS_PER_CYCLE = 235; // 19-year Metonic: 12*19 + 7 leap months
const EPIROTE_DAYS_PER_CYCLE = EPIROTE_DAYS_PER_PATTERN * 5; // 47 * 5 = 235 months

function getEpiroteAnchorDate() {
    return createAdjustedDateTime({
        timezone: 'UTC+02:00',
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

    for (let m = 0; m < EPIROTE_MONTHS_PER_CYCLE; m++) {
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
    const isFullMonth = EPIROTE_MONTH_PATTERN_FULL[patternIndexForMonth];
    let dayOfMonth = dayOfMonthIndex + 1;
    if (!isFullMonth) {
        const skipLabel = EPIROTE_MONTH_PATTERN_SKIP[patternIndexForMonth];
        if (skipLabel > 0 && dayOfMonth >= skipLabel) {
            dayOfMonth += 1;
        }
    }

    const monthName = getEpiroteMonthName(yearInCycle, monthIndexInYear);

    var output = dayOfMonth + ' ' + monthName + ' (' + epiroteYear + ')';
    return { output: output, day: dayOfMonth, month: monthIndexInYear, year: epiroteYear };
}