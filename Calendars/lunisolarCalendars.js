//|-----------------------------|
//|     Lunisolar Calendars     |
//|-----------------------------|

// A set of functions for calculating dates in the Lunisolar Calendars category.

import * as astronomicalData from '../Other/astronomicalData.js';
import * as utilities from '../utilities.js';

function isMetonicCycleLeapYear(year) {
    const metonicCycle = [0, 3, 6, 8, 11, 14, 17];
    return metonicCycle.includes(year);
}

export function getLocalMidnightInUTC(dateToFind, localMidnight) {
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
export function getChineseLunisolarCalendarDate(currentDateTime, country) {
    const gregorianYear = currentDateTime.getUTCFullYear();
    const gregorianMonth = currentDateTime.getUTCMonth();
    let year = gregorianYear;

    if (country==='china') {
        let lunisolarDate = getLunisolarCalendarDate(currentDateTime, 16);
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
        return `${year}年 ${monthString}月 ${lunisolarDate.day}日\nYear of the ${zodiacAnimals[earthlyBranchIndex]}`;
    }

    if (country==='vietnam') {
        let lunisolarDate = getLunisolarCalendarDate(currentDateTime, 17);
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
        return `${year} ${monthString} ${lunisolarDate.day}\nYear of the ${zodiacAnimals[earthlyBranchIndex]}`;
    }

    if (country==='korea') {
        let lunisolarDate = getLunisolarCalendarDate(currentDateTime, 15);
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
        return `${year}년 ${monthString}월 ${lunisolarDate.day}일`;
    }
}

// Returns a formatted Sexagenary year CST date based on the lunisolar calculation
export function getSexagenaryYear(currentDateTime) {
    let chineseDate = getChineseLunisolarCalendarDate(currentDateTime, 'china');
    let heavenlyStems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
    let earthlyBranches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

    let heavenlyStemsEnglish = ['Jia', 'Yi', 'Bing', 'Ding', 'Wu', 'Ji', 'Geng', 'Xin', 'Ren', 'Gui'];
    let earthlyBranchesEnglish = ['Zi', 'Chou', 'Yin', 'Mao', 'Chen', 'Si', 'Wu', 'Wei', 'Shen', 'You', 'Xu', 'Hai'];

    let chineseYear_ = chineseDate.split('年');
    let chineseYear = chineseYear_[0]-2;
    
    // Ensure year_ is positive before calculating indices
    let positiveYear = chineseYear < 0 ? 60 + (chineseYear % 60) : chineseYear;

    let heavenlyStemIndex = (positiveYear) % 10; // Adjusting for the start of the sexagenary cycle
    let earthlyBranchIndex = (positiveYear) % 12; // Adjusting for the start of the sexagenary cycle

    if (chineseYear[0] < 0) {
        heavenlyStemIndex++;
        earthlyBranchIndex++;
    }
    
    let heavenlyStem = heavenlyStems[heavenlyStemIndex];
    let earthlyBranch = earthlyBranches[earthlyBranchIndex];
    let heavenlyStemEnglish = heavenlyStemsEnglish[heavenlyStemIndex];
    let earthlyBrancheEnglish = earthlyBranchesEnglish[earthlyBranchIndex];
    
    return heavenlyStem + earthlyBranch + ' (' + heavenlyStemEnglish + earthlyBrancheEnglish + ')';
}



//|--------------------------|
//|     Chinese Calendar     |
//|--------------------------|


export function getLunisolarCalendarDate(currentDateTime, localMidnight) {
    let LastWinterSolstice = astronomicalData.getSolsticeEquinox(currentDateTime, 'winter', 0);
    let nextWinterSolstice = astronomicalData.getSolsticeEquinox(currentDateTime, 'winter', 1);

    let startofThisMonth = astronomicalData.getNewMoon(currentDateTime, 0);
    startofThisMonth = getLocalMidnightInUTC(startofThisMonth, localMidnight);

    // If on the day of the new moon but the new moon hasn't happened yet, then we need to take the next new moon
    let startOfNextMonth = astronomicalData.getNewMoon(currentDateTime, 1);
    startOfNextMonth = getLocalMidnightInUTC(startOfNextMonth, localMidnight);
    if (currentDateTime>=startOfNextMonth) {
        startofThisMonth = startOfNextMonth;
    }
    const startOfMonthElevenNextYear = getMonthEleven(nextWinterSolstice, localMidnight);
    const startOfMonthEleven = getMonthEleven(LastWinterSolstice, localMidnight);

    // Find out roughly how many months between solstices
    const daysBetweenEleventhMonths = utilities.differenceInDays(startOfMonthElevenNextYear, startOfMonthEleven);
    const lunationsBetweenEleventhMonths = Math.round(daysBetweenEleventhMonths / 29.53);
    let currentMonth = 0;
    const daysBetweenStartOfMonthAndMonthEleven = utilities.differenceInDays(startofThisMonth, startOfMonthEleven);
    
    // Get rough estimates of the current day/month,
    // likely to be wrong if close to the beginning or ending of a month
    currentMonth = Math.round(daysBetweenStartOfMonthAndMonthEleven / 29.53)-1;
    let currentDay = Math.floor(utilities.differenceInDays(currentDateTime, startofThisMonth))+1;

    // Leap Year
    let isLeapMonth = false;
    let leapMonth = 0;
    if (lunationsBetweenEleventhMonths===13) {

        // Ensure the currentMonth is within the range 1 to 12
        currentMonth = ((currentMonth - 1) % 13 + 13) % 13 + 1;

        // The leap month repeats the number of the last month, so subsequent months will be back by 1
        leapMonth = calculateFirstMonthWithoutMajorSolarTerm(startOfMonthEleven, localMidnight);
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
export function getSolarTermTypeThisMonth(startOfMonth_, localMidnight) {
    let startOfMonth = astronomicalData.getNewMoon(startOfMonth_, 1);
    let startOfNextMonth = astronomicalData.getNewMoon(startOfMonth_, 2);  // Get 2 lunations later, Lunation 1 is later in the same day
    startOfNextMonth = getLocalMidnightInUTC(startOfNextMonth, localMidnight);
    startOfNextMonth.setUTCDate(startOfNextMonth.getUTCDate() - 1);  // Go back 1 day to not count the first day of the next month
    
    const newMoonThisMonthLongitudeOfSun = astronomicalData.getLongitudeOfSun(startOfMonth);
    const newMoonNextMonthLongitudeOfSun = astronomicalData.getLongitudeOfSun(startOfNextMonth);

    const MajorSolarTerms = [
        0, 30, 60, 90,
        120, 150, 180,
        210, 240, 270,
        300, 330, 360
    ]

    // Sun passes 360/0 in this month and screws with the comparison logic below
    if (newMoonThisMonthLongitudeOfSun > newMoonNextMonthLongitudeOfSun) {
        return 'major';
    }

    for (const term of MajorSolarTerms) {
        // Check if the current term falls between the longitudes
        if (term > newMoonThisMonthLongitudeOfSun && term < newMoonNextMonthLongitudeOfSun) {
            return 'major';
        }
    }
    return 'minor';
}

// Possible errors here if the conjunction happens a few hours after the solstice but before midnight
// Returns an unformatted date object of the last New Moon before the Winter Solstice
export function getMonthEleven(winterSolstice, localMidnight, weirdShitAroundSolstice) {

    let currentMonth = 0;
    if (weirdShitAroundSolstice) {
        currentMonth = -1;
    }

    // Get the lunar conjunction closest to the winter solstice
    let closestConjunction = astronomicalData.getNewMoon(winterSolstice, currentMonth);
    closestConjunction = getLocalMidnightInUTC(closestConjunction, localMidnight);

    // Check if the closest conjunction is after the winter solstice
    if (closestConjunction > winterSolstice) {
        // Move to the previous month to find the start of the eleventh month
        closestConjunction = astronomicalData.getNewMoon(winterSolstice, currentMonth - 1);
        closestConjunction = getLocalMidnightInUTC(closestConjunction, localMidnight);
    }
    return closestConjunction;
}

// Returns the first month in the Chinese calendar that doesn't contain a major solar term
export function calculateFirstMonthWithoutMajorSolarTerm(midnightStartOfMonthElevenLastYear, localMidnight) {
    const costantStartingPoint = new Date(midnightStartOfMonthElevenLastYear);
    let dateToCheck = new Date(midnightStartOfMonthElevenLastYear);
    let lunations = 0;
    while (true) {
        let solarTermType = getSolarTermTypeThisMonth(dateToCheck, localMidnight);

        if (solarTermType !== 'major') {
            // Found the first month without a major solar term
            lunations--;
            if (lunations < 1) {
                lunations += 13;
            }
            return lunations;
        }
        
        // Move to the start of the next month
        lunations += 1;
        dateToCheck = astronomicalData.getNewMoon(costantStartingPoint, lunations+1);
        dateToCheck = getLocalMidnightInUTC(dateToCheck, localMidnight);
        if (lunations > 11) {
            return 0;
        }
    }
}



//|-------------------------|
//|     Hebrew Calendar     |
//|-------------------------|

// Returns a formatted Hebrew calendar IST date
export function calculateHebrewCalendar(currentDateTime) {

    // Number of days in each Hebrew month
    const Hebrew_monthDaysDeficient = [30, 29, 29, 29, 30, 30, 29, 30, 29, 30, 29, 30, 29]; // 353 or 383 days
    const Hebrew_monthDaysRegular = [30, 29, 30, 29, 30, 30, 29, 30, 29, 30, 29, 30, 29]; // 354 or 384 days
    const Hebrew_monthDaysComplete = [30, 30, 30, 29, 30, 30, 29, 30, 29, 30, 29, 30, 29]; // 355 or 385 days

    const HebrewMonths = [
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

    
    calculateMoladTishri(currentDateTime);
}

export function calculateMoladTishri(currentDateTime) {
    // I originally did this calculation by using a modified currentDateTime to account for sunset, and also adding time to the base molad because it doesn't actually happen at midnight UTC
    // However, none of that was necessary. The calculation just finds how many days since the start of the base molad day
    // This may be incorrect in rare cases, but I can't find any. If that happens it might be necessary to re-calculate based on timezone/sunset and molad time

    // Start with a known Molad
    // 5732, First Molad Tishri after Unix epoch, no dechiyot (modifications), year 13 in a metonic cycle, Monday
    const moladTishri5732 = new Date(Date.UTC(1971, 8, 20));

    // Determine how many months are between your starting year and the year you want
    // The starting year number can come from starting in December and counting solar years from 5732
    let decemberOfThisYear = new Date(currentDateTime);
    decemberOfThisYear.setUTCMonth(11);
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
    weekdayOfMolad = ((Math.floor(weekdayOfMolad) % 7) + 7) % 7;

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
    }

    // Subtract 1 because the start of the day is at sunset the day before
    let dayOfMoladTishri = new Date(moladTishri5732.getTime() + (Math.floor(daysSinceMolad5732-1)*24*60*60*1000));
    dayOfMoladTishri.setUTCHours(16);
    dayOfMoladTishri.setUTCMinutes(0);
    dayOfMoladTishri.setUTCSeconds(0);
    dayOfMoladTishri.setUTCMilliseconds(0);
    
    return dayOfMoladTishri;
}