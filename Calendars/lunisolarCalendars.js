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
    let midnightInUTC = dateToFind;
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
export function getChineseLunisolarCalendarDate(currentDateTime, lunisolarDate, country) {
    const gregorianYear = currentDateTime.getUTCFullYear();
    const gregorianMonth = currentDateTime.getUTCMonth();
    let year = gregorianYear;
    if ((gregorianMonth < 4)&&(lunisolarDate.month>9)) {
        year -= 1;
    }

    if (country==='china') {
        year += 2698;
        let zodiacAnimals = ['Rat (鼠)', 'Ox (牛)', 'Tiger (虎)', 'Rabbit (兔)', 'Dragon (龍)', 'Snake (蛇)', 'Horse (馬)', 'Goat (羊)', 'Monkey (猴)', 'Rooster (雞)', 'Dog (狗)', 'Pig (豬)'];
        let positiveYear = year < 0 ? 60 + (year % 60) : year;
        let earthlyBranchIndex = (positiveYear-2) % 12;
        if (year < 0) {
            earthlyBranchIndex++;
        }
        return `${year}年 ${lunisolarDate.month}月 ${lunisolarDate.day}日\nYear of the ${zodiacAnimals[earthlyBranchIndex]}`;
    }

    if (country==='vietnam') {
        let zodiacAnimals = ['Rat (𤝞)', 'Water Buffalo (𤛠)', 'Tiger (𧲫)', 'Cat (猫)', 'Dragon (龍)', 'Snake (𧋻)', 'Horse (馭)', 'Goat (羝)', 'Monkey (𤠳)', 'Rooster (𪂮)', 'Dog (㹥)', 'Pig (㺧)'];
        let positiveYear = year < 0 ? 60 + (year % 60) : year;
        let earthlyBranchIndex = (positiveYear-4) % 12;
        if (year < 0) {
            earthlyBranchIndex++;
        }
        return `${year} ${lunisolarDate.month} ${lunisolarDate.day}\nYear of the ${zodiacAnimals[earthlyBranchIndex]}`;
    }

    if (country==='korea') {
        year += 2333;
        if ((gregorianMonth < 4)&&(lunisolarDate.month>9)) {
            year -= 1;
        }
        return `${year}년 ${lunisolarDate.month}월 ${lunisolarDate.day}일`;
    }
}

// Returns a formatted Sexagenary year CST date based on the lunisolar calculation
export function getSexagenaryYear(chineseDate) {
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


export function getLunisolarCalendarDate(currentDateTime, newMoonThisMonth, newMoonLastMonth, newMoonTwoMonthsAgo, winterSolstice, winterSolsticeLastYear, localMidnight) {

    let startofThisMonth = getLocalMidnightInUTC(newMoonThisMonth, localMidnight);
    let startofLastMonth = getLocalMidnightInUTC(newMoonLastMonth, localMidnight);
    const startOfTwoMonthsAgo = getLocalMidnightInUTC(newMoonTwoMonthsAgo, localMidnight);

    if (currentDateTime < startofThisMonth) {
        startofThisMonth = startofLastMonth;
        startofLastMonth = startOfTwoMonthsAgo;
    }

    const startOfMonthEleven = getMonthEleven(winterSolstice, localMidnight);
    const startOfMonthElevenLastYear = getMonthEleven(winterSolsticeLastYear, localMidnight);

    // Find out roughly how many months between solstices
    const daysBetweenEleventhMonths = utilities.differenceInDays(startOfMonthEleven, startOfMonthElevenLastYear);
    const lunationsBetweenEleventhMonths = Math.round(daysBetweenEleventhMonths / 29.53);
    let currentMonth = 0;
    const daysSinceMonthEleven = utilities.differenceInDays(currentDateTime, startOfMonthEleven);

    // Get rough estimates of the current day/month,
    // likely to be wrong if close to the beginning or ending of a month
    currentMonth = Math.round(daysSinceMonthEleven / 29.53);
    let currentDay = Math.floor(utilities.differenceInDays(currentDateTime, startofThisMonth))+1;

    // The calculation needs to be corrected by adding 11
    currentMonth += 11;

    // Leap Year
    if (lunationsBetweenEleventhMonths===13) {
        // The leap month repeats the number of the last month, so subsequent months will be back by 1
        const leapMonth = calculateFirstMonthWithoutMajorSolarTerm(startOfMonthElevenLastYear, localMidnight);
        if (leapMonth>currentMonth) {
            currentMonth+=1;
        }
    }

    // Ensure the currentMonth is within the range 1 to 12
    currentMonth = ((currentMonth - 1) % 12 + 12) % 12 + 1;


    return {
        month: currentMonth,
        day: currentDay,
    };
}

// Returns 'major' or 'minor' depending on the latitude of the sun calculation
export function getSolarTermTypeThisMonth(startOfMonth_, localMidnight) {
    let startOfMonth = startOfMonth_;
    let startOfNextMonth = astronomicalData.getNewMoon(startOfMonth_, 2);
    startOfNextMonth = getLocalMidnightInUTC(startOfNextMonth, localMidnight);

    // Sometimes the calculated new moon is too far in the future, so go back one if > 40 days away
    if (startOfNextMonth.getTime() > startOfMonth.getTime() + (60*60*24*40*1000)) {
        startOfNextMonth = getLocalMidnightInUTC(astronomicalData.getNewMoon(startOfMonth, 0), localMidnight);
    }
    startOfNextMonth.setUTCDate(startOfNextMonth.getUTCDate() - 1);
    
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
export function getMonthEleven(winterSolstice, localMidnight) {

    let currentMonth = 0;

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
        /*
        console.log(dateToCheck);
        console.log(lunations);
        console.log('-------------------------');*/
        
        if (solarTermType !== 'major') {
            // Found the first month without a major solar term
            lunations--;
            if (lunations < 1) {
                lunations += 13;
            }
            return lunations;
        }
        
        // Move to the start of the next month
        dateToCheck = astronomicalData.getNewMoon(costantStartingPoint, lunations);
        lunations += 1;
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

    const lastTishri = getStartOfTishri(currentDateTime);
    // Next year, but add a few months to make sure we are past that year's Tishri 1
    let nextYearPlusABit = new Date(lastTishri);
    nextYearPlusABit.setFullYear(lastTishri.getFullYear() + 1);
    nextYearPlusABit.setMonth(lastTishri.getMonth() + 3);
    const nextTishri = getStartOfTishri(nextYearPlusABit);
    const daysThisYear = utilities.differenceInDays(nextTishri, lastTishri);

    let remainingDays = Math.floor(utilities.differenceInDays(currentDateTime, lastTishri));

    // Check if it's a deficient, regular, or complete year
    const isDeficientYear = [353, 383].includes(daysThisYear);
    const isRegularYear = [354, 384].includes(daysThisYear);
    const isCompleteYear = [355, 385].includes(daysThisYear);

    // Determine which array of month days to use based on the year length
    const Hebrew_monthDays = isDeficientYear ? Hebrew_monthDaysDeficient :
                             isRegularYear ? Hebrew_monthDaysRegular :
                             Hebrew_monthDaysComplete;

    // Check if it's a leap year, remove Adar II if not
    if (daysThisYear < 380) {
        HebrewMonths.splice(5, 1); // Remove "Adar II"
        Hebrew_monthDays.splice(5, 1);
    }

    // Iterate through months and deduct days from remaining days
    let HebrewMonth = 1;
    while (remainingDays >= Hebrew_monthDays[HebrewMonth - 1]) {
        remainingDays -= Hebrew_monthDays[HebrewMonth - 1];
        HebrewMonth++;
    }

    // Calculate year, if late in Gregorian but early in Hebrew, it's past Hebrew New Year
    let year = currentDateTime.getUTCFullYear() + 3760;
    if ((currentDateTime.getMonth()>8) && (HebrewMonth<5)) {
        year += 1;
    }

    // Return the Hebrew date
    const hebrewDate = {
        year: year,
        month: HebrewMonth-1,
        day: remainingDays + 1 // Hebrew months start from 1
    };

    // Get the weekday based on sunset in Israel
    let startOfToday = new Date(currentDateTime);
    startOfToday.setUTCHours(currentDateTime.getUTCHours()-3); // 3 hours ahead + sunset of 18:00 = 21 hours yesterday
    const dayOfWeek = startOfToday.getDay();

    return hebrewDate.day + ' ' + HebrewMonths[hebrewDate.month] + ' ' + hebrewDate.year + ' AM\n' + hebrewDaysOfWeek[dayOfWeek];
}

// Returns the unformatted IST date of Tishri 1 of the current Hebrew year
export function getStartOfTishri(currentDateTime) {

    // Begin with a bae molad of 5732, with 0.32 fraction of a day past midnight
    let yearsInHebrew = 5732;
    const moladTishri5732 = new Date(Date.UTC(1971, 8, 20, 0, 0, 0)); // Sunset in Jerusalem (UTC+2)
    const startOfBaseMoladDays = 0.32;

    // Figure out how long since base molad, including Metonic cycles
    const millisecondsSince5732 = currentDateTime - moladTishri5732;
    const yearsSince5732 = (millisecondsSince5732)/1000/24/60/60/365.25;
    const metonicCyclesSince5732 = Math.floor(yearsSince5732/19);
    const yearsThisMetonicCycle = yearsSince5732 - (metonicCyclesSince5732*19);
    let monthsSince5732 = metonicCyclesSince5732 * 235;
    yearsInHebrew += (metonicCyclesSince5732*19);
    const currentYear = yearsSince5732 + 5732;

    // Figure out how many months and leap months since base molad
    for (let year = yearsInHebrew; year < currentYear-1; year++) {
        if (isMetonicCycleLeapYear(year%19)) {
            monthsSince5732 += 13;
        } else {
            monthsSince5732 += 12;
        }
        yearsInHebrew += 1;
    }

    // Figure out days since molad, then figure out day of week for Dechiyah calculations
    let daysFromMoladTishri5732 = ((monthsSince5732 * 29.53059) + startOfBaseMoladDays);
    let dayOfWeekOfTishri1 = (daysFromMoladTishri5732 + 2)%7;

    // Apply Dechiyah: Molad Zakein
    if ((dayOfWeekOfTishri1%1) > 0.5) {
        dayOfWeekOfTishri1 += 1;
        daysFromMoladTishri5732 += 1;

    // Apply Dechiyah: Gatarad
    } else if ((Math.trunc(dayOfWeekOfTishri1) === 3) && ((dayOfWeekOfTishri1%1) > 0.383) && !(isMetonicCycleLeapYear(Math.trunc(yearsThisMetonicCycle)))) {
        // Day of week == Tuesday, Time of day > 9h 204p past Sunset of the preceeding day, Current Year is not a leap year
        dayOfWeekOfTishri1 += 1;
        daysFromMoladTishri5732 += 1;

    // Apply Dechiyah: Betukafot
    } else if ((Math.trunc(dayOfWeekOfTishri1) === 2) && ((dayOfWeekOfTishri1%1) > 0.6478) && (isMetonicCycleLeapYear(Math.trunc(yearsThisMetonicCycle-1)))) {
        // Day of week == Monday, Time of day > 15h 589p past Sunset of the preceeding day, Previous Year was a leap year
        dayOfWeekOfTishri1 += 1;
        daysFromMoladTishri5732 += 1;
    }

    // Apply Dechiyah: Lo A"DU Rosh
    if (Math.trunc(dayOfWeekOfTishri1) === 1 || Math.trunc(dayOfWeekOfTishri1) === 4 || Math.trunc(dayOfWeekOfTishri1) === 6) {
        // Day of week is not Sunday, Wednesday, or Friday
        dayOfWeekOfTishri1 += 1;
        daysFromMoladTishri5732 += 1;
    }

    // Get the start of Tishri by going back one day (subtract 1)
    const millisecondsSinceMoladTishri5732 = (daysFromMoladTishri5732-1) * 24*60*60*1000;
    // Get sunset of Tishri 1
    let startOfTishri = new Date(moladTishri5732.getTime() + millisecondsSinceMoladTishri5732);
    startOfTishri.setUTCHours(21);
    startOfTishri.setMinutes(0);
    startOfTishri.setSeconds(0);
    startOfTishri.setMilliseconds(0);
    return startOfTishri;
}