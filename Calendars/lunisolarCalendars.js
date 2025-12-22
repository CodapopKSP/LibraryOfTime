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
    if (country==='china') {
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
        return `${year}年 ${monthString}月 ${lunisolarDate.day}日\nYear of the ${zodiacAnimals[earthlyBranchIndex]}`;
    }

    // Format for Vietnamese calendar
    if (country==='vietnam') {
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
        return `${year} ${monthString} ${lunisolarDate.day}\nYear of the ${zodiacAnimals[earthlyBranchIndex]}`;
    }

    // Format for Korean calendar
    if (country==='korea') {
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
        return `${year}년 ${monthString}월 ${lunisolarDate.day}일`;
    }
}

// Returns a formatted Sexagenary year CST date based on the lunisolar calculation
function getSexagenaryYear(currentDateTime) {
    let heavenlyStems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
    let earthlyBranches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
    let heavenlyStemsEnglish = ['Jia', 'Yi', 'Bing', 'Ding', 'Wu', 'Ji', 'Geng', 'Xin', 'Ren', 'Gui'];
    let earthlyBranchesEnglish = ['Zi', 'Chou', 'Yin', 'Mao', 'Chen', 'Si', 'Wu', 'Wei', 'Shen', 'You', 'Xu', 'Hai'];

    // Get number of current Chinese year
    let chineseDate = getChineseLunisolarCalendarDate(currentDateTime, 'china');
    let chineseYear_ = chineseDate.split('年');
    let chineseYear = chineseYear_[0]-2;
    
    // Ensure year is positive before calculating indices
    let positiveYear = chineseYear < 0 ? 60 + (chineseYear % 60) : chineseYear;
    let heavenlyStemIndex = (positiveYear) % 10; // Adjusting for the start of the sexagenary cycle
    let earthlyBranchIndex = (positiveYear) % 12; // Adjusting for the start of the sexagenary cycle
    
    // Find all stems and branches
    let heavenlyStem = heavenlyStems[heavenlyStemIndex];
    let earthlyBranch = earthlyBranches[earthlyBranchIndex];
    let heavenlyStemEnglish = heavenlyStemsEnglish[heavenlyStemIndex];
    let earthlyBrancheEnglish = earthlyBranchesEnglish[earthlyBranchIndex];
    
    return heavenlyStem + earthlyBranch + ' (' + heavenlyStemEnglish + earthlyBrancheEnglish + ')';
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

    return (daysThisYearSoFar+1) + " " + HebrewMonths[monthIndex] + " " + earlyTishri[1] + " AM\n" + hebrewDaysOfWeek[weekday];
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