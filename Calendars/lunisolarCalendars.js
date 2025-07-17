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
    console.log("=================================");

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

    // Get date of last Tishri 1
    const { lastTishri, nextTishri } = getSurroundingTishriDates(currentDateTime);
    const daysThisYear = utilities.differenceInDays(nextTishri, lastTishri);

    let remainingDays = Math.floor(utilities.differenceInDays(currentDateTime, lastTishri));

    // Check if it's a deficient, regular, or complete year
    const isDeficientYear = [353, 383].includes(daysThisYear);
    const isRegularYear = [354, 384].includes(daysThisYear);
    const isCompleteYear = [355, 385].includes(daysThisYear);  // Unused

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

    // Calculate year, if after Tishri this Gregorian year then increment up
    let year = currentDateTime.getUTCFullYear() + 3760;
    let lateThisYear = utilities.createDateWithFixedYear(currentDateTime.getUTCFullYear(), 11, 1);
    let tishriThisYear = getStartOfTishri(lateThisYear);
    if (currentDateTime >= tishriThisYear) {
        year++;
    }

    // Return the Hebrew date
    const hebrewDate = {
        year: year,
        month: HebrewMonth-1,
        day: remainingDays + 1 // Hebrew months start from 1
    };

    // Get the weekday based on sunset in Israel
    let startOfToday = new Date(currentDateTime);
    startOfToday.setUTCHours(currentDateTime.getUTCHours()+8); // 2 hours ahead - sunset of 18:00 = 16 hours yesterday
    const dayOfWeek = startOfToday.getUTCDay();

    return hebrewDate.day + ' ' + HebrewMonths[hebrewDate.month] + ' ' + hebrewDate.year + ' AM\n' + hebrewDaysOfWeek[dayOfWeek];
}

function getSurroundingTishriDates(currentDateTime) {
    const year = currentDateTime.getUTCFullYear();

    // Get candidate Tishri dates by probing around the current year
    const tishriPrev = getStartOfTishri(new Date(Date.UTC(year - 1, 10, 1))); // Oct 1, prev year
    const tishriThis = getStartOfTishri(new Date(Date.UTC(year, 10, 1)));     // Oct 1, this year
    const tishriNext = getStartOfTishri(new Date(Date.UTC(year + 1, 10, 1))); // Oct 1, next year

    let lastTishri, nextTishri;

    if (currentDateTime >= tishriNext) {
        lastTishri = tishriNext;
        nextTishri = getStartOfTishri(new Date(Date.UTC(year + 2, 10, 1)));
    } else if (currentDateTime >= tishriThis) {
        lastTishri = tishriThis;
        nextTishri = tishriNext;
    } else if (currentDateTime >= tishriPrev) {
        lastTishri = tishriPrev;
        nextTishri = tishriThis;
    } else {
        lastTishri = getStartOfTishri(new Date(Date.UTC(year - 2, 10, 1)));
        nextTishri = tishriPrev;
    }

    return { lastTishri, nextTishri };
}

// Returns the unformatted IST date of Tishri 1 of the current Hebrew year
export function getStartOfTishri(currentDateTime) {

    // Begin with a base molad of 5732
    let yearsInHebrew = 5732;
    const moladTishri5732 = new Date(Date.UTC(1971, 8, 20)); // Sunset in Jerusalem (UTC+2) + 7:41:17?


    





    const hebrewMonthDays_ = 29.53059;
    let daysSince5732_ = (currentDateTime - moladTishri5732)/1000/60/60/24;
    let monthsSince5732_ = Math.floor(daysSince5732_/hebrewMonthDays_);
    let metonicCyclesSince5732_ = Math.floor(monthsSince5732_/235);
    let partialCycle_ = (monthsSince5732_/235) - metonicCyclesSince5732_;
    let partialCycleMonths_ = Math.floor(partialCycle_*235);
    let hebrewYears = (metonicCyclesSince5732_ * 19)+5732;

    let buildUpMonths = 0;
    

    while (true) {
        const isLeap = isMetonicCycleLeapYear(hebrewYears%19);
        const monthsThisYear = isLeap ? 13 : 12;
        if (partialCycleMonths_>=monthsThisYear) {
            partialCycleMonths_ -= monthsThisYear;
            hebrewYears++;
            buildUpMonths+=monthsThisYear;
        } else {
            break;
        }
    }

    let monthsOfStartYear = (buildUpMonths) + (metonicCyclesSince5732_*235);
    let daysStartOfYear = monthsOfStartYear*hebrewMonthDays_;
    let dateOfNewMoladTishri = new Date(moladTishri5732.getTime() + (daysStartOfYear*1000*60*60*24) + (2*60*60*1000)); // Subtract 2 hours for UTC+2


    

    
    





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
    let daysFromMoladTishri5732 = (monthsSince5732 * 29.53059);
    let dayOfWeekOfTishri1 = (daysFromMoladTishri5732)%7;



    
    // Get the start of Tishri by going back one day (subtract 1)
    const millisecondsSinceMoladTishri57322 = (daysFromMoladTishri5732-1) * 24*60*60*1000;
    // Get sunset of Tishri 1
    let startOfTishri2 = new Date(moladTishri5732.getTime() + millisecondsSinceMoladTishri57322);
    console.log("-----");
    console.log(dateOfNewMoladTishri.toUTCString());
    console.log(startOfTishri2.toUTCString());

    console.log(dayOfWeekOfTishri1%1);

    // Need to calc day of week first, then do dechiya


    // Apply Dechiyah: Molad Zakein
    if ((dayOfWeekOfTishri1%1) > 0.5) {
        // Day is after noon
        dayOfWeekOfTishri1 += 1;
        daysFromMoladTishri5732 += 1;
        console.log("Zakein 1");
    /*
    // Apply Dechiyah: Gatarad
    } else if ((Math.floor(dayOfWeekOfTishri1) === 3) && ((dayOfWeekOfTishri1%1) > 0.383) && !(isMetonicCycleLeapYear(Math.floor(yearsThisMetonicCycle)))) {
        // Day of week == Tuesday, Time of day > 9h 204p past Sunset of the preceeding day, Current Year is not a leap year
        dayOfWeekOfTishri1 += 1;
        daysFromMoladTishri5732 += 1;
        console.log("Gatarad");

    // Apply Dechiyah: Betukafot
    } else if ((Math.floor(dayOfWeekOfTishri1) === 2)){ // && ((dayOfWeekOfTishri1%1) > 0.6478) && (isMetonicCycleLeapYear(Math.floor(yearsThisMetonicCycle-1)))) {
        // Day of week == Monday, Time of day > 15h 589p past Sunset of the preceeding day, Previous Year was a leap year
        dayOfWeekOfTishri1 += 1;
        daysFromMoladTishri5732 += 1;
        console.log("Betukafot");*/
    }

    // Apply Dechiyah: Lo A"DU Rosh
    if (Math.floor(dayOfWeekOfTishri1) === 1 || Math.floor(dayOfWeekOfTishri1) === 4 || Math.floor(dayOfWeekOfTishri1) === 6) {
        // Day of week is Sunday, Wednesday, or Friday
        dayOfWeekOfTishri1 += 1;
        daysFromMoladTishri5732 += 1;
        console.log("Lo ADU Rosh 1");
    }

    // Get the start of Tishri by going back one day (subtract 1)
    const millisecondsSinceMoladTishri5732 = (daysFromMoladTishri5732-1) * 24*60*60*1000;
    // Get sunset of Tishri 1
    let startOfTishri = new Date(moladTishri5732.getTime() + millisecondsSinceMoladTishri5732);

    console.log(dateOfNewMoladTishri.getUTCDay());
    if (dateOfNewMoladTishri.getUTCHours() > 11) {
        dateOfNewMoladTishri.setUTCDate(dateOfNewMoladTishri.getUTCDate() + 1)
        console.log("Zakein");
    }
    if (dateOfNewMoladTishri.getUTCDay() == 0 || dateOfNewMoladTishri.getUTCDay() == 3 || dateOfNewMoladTishri.getUTCDay() == 5) {
        dateOfNewMoladTishri.setUTCDate(dateOfNewMoladTishri.getUTCDate() + 1)
        console.log("Lo ADU Rosh");
    }



    console.log(dateOfNewMoladTishri.toUTCString());
    console.log(startOfTishri.toUTCString());
    console.log("-----");

    //startOfTishri.setUTCDate(startOfTishri.getUTCDate()-1);
    dateOfNewMoladTishri.setUTCHours(16);
    dateOfNewMoladTishri.setUTCMinutes(0);
    dateOfNewMoladTishri.setUTCSeconds(0);
    dateOfNewMoladTishri.setUTCMilliseconds(0);
    return dateOfNewMoladTishri;
}