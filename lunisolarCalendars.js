//|-----------------------------|
//|     Lunisolar Calendars     |
//|-----------------------------|

// A set of functions for calculating dates in the Lunisolar Calendars category.

function isMetonicCycleLeapYear(year) {
    const metonicCycle = [0, 3, 6, 8, 11, 14, 17];
    return metonicCycle.includes(year);
}

function getChineseZodiacYear(year_) {
    let zodiacAnimals = ['鼠 (Rat)', '牛 (Ox)', '虎 (Tiger)', '兔 (Rabbit)', '龍 (Dragon)', '蛇 (Snake)', '馬 (Horse)', '羊 (Goat)', '猴 (Monkey)', '雞 (Rooster)', '狗 (Dog)', '豬 (Pig)'];
    // Adjusting for the start of the Chinese zodiac cycle, handling negative years
    let index = year_ >= 4 ? (year_ - 4) % 12 : ((Math.abs(year_) + 8) % 12 === 0 ? 0 : 12 - ((Math.abs(year_) + 8) % 12));
    if (year_ < 0) {
        index++;
    }
    return zodiacAnimals[index];
}

function getVietnameseZodiacYear(year_) {
    let zodiacAnimals = ['𤝞 (Rat)', '𤛠 (Water Buffalo)', '𧲫 (Tiger)', '猫 (Cat)', '龍 (Dragon)', '𧋻 (Snake)', '馭 (Horse)', '羝 (Goat)', '𤠳 (Monkey)', '𪂮 (Rooster)', '㹥 (Dog)', '㺧 (Pig)'];
    // Adjusting for the start of the Chinese zodiac cycle, handling negative years
    let index = year_ >= 4 ? (year_ - 4) % 12 : ((Math.abs(year_) + 8) % 12 === 0 ? 0 : 12 - ((Math.abs(year_) + 8) % 12));
    if (year_ < 0) {
        index++;
    }
    return zodiacAnimals[index];
}

function getSexagenaryYear(chineseDate) {
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

// Convert 
function getChineseLunisolarCalendarDate(currentDateTime, lunisolarDate) {
    const gregorianYyear = currentDateTime.getUTCFullYear();
    const gregorianMonth = currentDateTime.getUTCMonth();
    let year = gregorianYyear + 2698;
    if ((gregorianMonth < 4)&&(lunisolarDate.month>9)) {
        year -= 1;
    }
    let zodiacAnimals = ['Rat (鼠)', 'Ox (牛)', 'Tiger (虎)', 'Rabbit (兔)', 'Dragon (龍)', 'Snake (蛇)', 'Horse (馬)', 'Goat (羊)', 'Monkey (猴)', 'Rooster (雞)', 'Dog (狗)', 'Pig (豬)'];
    let positiveYear = year < 0 ? 60 + (year % 60) : year;
    let earthlyBranchIndex = (positiveYear-2) % 12;

    if (year < 0) {
        earthlyBranchIndex++;
    }

    return `${year}年 ${lunisolarDate.month}月 ${lunisolarDate.day}日\nYear of the ${zodiacAnimals[earthlyBranchIndex]}`;
}

function getDangunLunisolarCalendarDate(currentDateTime, lunisolarDate) {
    const gregorianYyear = currentDateTime.getUTCFullYear();
    const gregorianMonth = currentDateTime.getUTCMonth();
    let year = gregorianYyear;
    if ((gregorianMonth < 4)&&(lunisolarDate.month>9)) {
        year -= 1;
    }

    return `${year}년 ${lunisolarDate.month}월 ${lunisolarDate.day}일`;
}

function getVietnameseLunisolarCalendarDate(currentDateTime, lunisolarDate) {
    const gregorianYyear = currentDateTime.getUTCFullYear();
    const gregorianMonth = currentDateTime.getUTCMonth();
    let year = gregorianYyear;
    if ((gregorianMonth < 4)&&(lunisolarDate.month>9)) {
        year -= 1;
    }
    let zodiacAnimals = ['Rat (𤝞)', 'Water Buffalo (𤛠)', 'Tiger (𧲫)', 'Cat (猫)', 'Dragon (龍)', 'Snake (𧋻)', 'Horse (馭)', 'Goat (羝)', 'Monkey (𤠳)', 'Rooster (𪂮)', 'Dog (㹥)', 'Pig (㺧)'];
    let positiveYear = year < 0 ? 60 + (year % 60) : year;
    let earthlyBranchIndex = (positiveYear-4) % 12;

    if (year < 0) {
        earthlyBranchIndex++;
    }

    return `${year} ${lunisolarDate.month} ${lunisolarDate.day}\nYear of the ${zodiacAnimals[earthlyBranchIndex]}`;
}

function getLunisolarCalendarDate(currentDateTime, utcMidnight) {
    // Get Winter Solstice for this year. That is Month 11.
    const winterSolstice = getCurrentSolsticeOrEquinox(currentDateTime, 'winter');
    const startOfMonthEleven = getMonthEleven(winterSolstice);
    const midnightStartOfMonthEleven = getMidnightInUTC(startOfMonthEleven, utcMidnight);

    // Get Winter solsice of last year, that's Month 11 of last year
    let lastYear = new Date(currentDateTime);
    lastYear.setFullYear(currentDateTime.getFullYear()-1);
    const winterSolsticeLastYear = getCurrentSolsticeOrEquinox(lastYear, 'winter');
    const startOfMonthElevenLastYear = getMonthEleven(winterSolsticeLastYear);
    const midnightStartOfMonthElevenLastYear = getMidnightInUTC(startOfMonthElevenLastYear, utcMidnight);

    // Find out roughly how many months between solstices
    const daysBetweenEleventhMonths = Math.trunc((midnightStartOfMonthEleven - midnightStartOfMonthElevenLastYear)/1000/60/60/24);
    const lunationsBetweenEleventhMonths = Math.round(daysBetweenEleventhMonths / 29.53);
    let currentMonth = 0;

    // Not a leap year
    if (lunationsBetweenEleventhMonths===12) {
        const startofThisMonth = getNewMoonThisMonth(currentDateTime, 0);
        const midnightChinaStartOfMonth = getMidnightInUTC(startofThisMonth, utcMidnight);
        const startofLastMonth = getNewMoonThisMonth(currentDateTime, -1);
        const midnightChinaStartOfLastMonth = getMidnightInUTC(startofLastMonth, utcMidnight);
        const daysSinceMonthEleven = (currentDateTime - midnightStartOfMonthEleven)/1000/60/60/24;

        // Get rough estimates of the current day/month,
        // likely to be wrong if close to thebeginning or ending of a month
        currentMonth = Math.trunc(daysSinceMonthEleven / 29.53);
        currentDay = Math.trunc((currentDateTime-midnightChinaStartOfMonth)/1000/24/60/60)+1;

        // If the current day is less than 1, then it's the previous month
        if (currentDay<1) {
            currentDay = Math.trunc((currentDateTime-midnightChinaStartOfLastMonth)/1000/24/60/60)+1;
        }
        // Use round instead of trunc if the month is just starting to account for errors in the /29.53 math
        if (currentDay<3) {
            currentMonth = Math.round(daysSinceMonthEleven / 29.53);
        }
        // Add extra 'time' to the month to account for errors in the /29.53 math.
        // This makes sure it is below the next month when close to the 1st of the next month.
        if (currentDay>28) {
            currentMonth = Math.round((daysSinceMonthEleven / 29.53)-0.8);
        }

        // For some reason the calculation needs to be corrected by adding 11
        currentMonth += 11;
        if (currentMonth<1) {
            currentMonth+=12;
        }
    }

    if (lunationsBetweenEleventhMonths===13) {
        const startofThisMonth = getNewMoonThisMonth(currentDateTime, 0);
        const midnightChinaStartOfMonth = getMidnightInUTC(startofThisMonth, utcMidnight);
        const startofLastMonth = getNewMoonThisMonth(currentDateTime, -1);
        const midnightChinaStartOfLastMonth = getMidnightInUTC(startofLastMonth, utcMidnight);
        const daysSinceMonthEleven = (currentDateTime - midnightStartOfMonthEleven)/1000/60/60/24;
        const leapMonth = calculateFirstMonthWithoutMajorSolarTerm(midnightStartOfMonthElevenLastYear);

        // Get rough estimates of the current day/month,
        // likely to be wrong if close to thebeginning or ending of a month
        currentMonth = Math.trunc(daysSinceMonthEleven / 29.53);
        currentDay = Math.trunc((currentDateTime-midnightChinaStartOfMonth)/1000/24/60/60)+1;

        // If the current day is less than 1, then it's the previous month
        if (currentDay<1) {
            currentDay = Math.trunc((currentDateTime-midnightChinaStartOfLastMonth)/1000/24/60/60)+1;
        }
        // Use round instead of trunc if the month is just starting to account for errors in the /29.53 math
        if (currentDay<3) {
            currentMonth = Math.round(daysSinceMonthEleven / 29.53);
        }
        // Add extra 'time' to the month to account for errors in the /29.53 math.
        // This makes sure it is below the next month when close to the 1st of the next month.
        if (currentDay>28) {
            currentMonth = Math.round((daysSinceMonthEleven / 29.53)-0.8);
        }

        // For some reason the calculation needs to be corrected by adding 11
        currentMonth += 11;

        // The leap month repeats the number of the last month, so subsequent months will be back by 1
        if (leapMonth>currentMonth) {
            currentMonth+=1;
        }
        if (currentMonth<1) {
            currentMonth+=12;
        }
        if (currentMonth>12) {
            currentMonth-=12;
        }
    }

    return {
        month: currentMonth,
        day: currentDay,
    };
    
}

function getSolarTermTypeThisMonth(startOfMonth) {
    const newMoonThisMonth = startOfMonth;
    const millisecondsIn29_53Days = 29.53 * 24 * 60 * 60 * 1000; // THIS VALUE IS TECHNICALLY WRONG AND CAUSES PROBLEMS
    let newMoonNextMonth = new Date(newMoonThisMonth.getTime()+millisecondsIn29_53Days);
    
    const newMoonThisMonthLongitudeOfSun = getLongitudeOfSun(newMoonThisMonth);
    const newMoonNextMonthLongitudeOfSun = getLongitudeOfSun(newMoonNextMonth);

    const MajorSolarTerms = [
        0, 30, 60, 90,
        120, 150, 180,
        210, 240, 270,
        300, 330, 360
    ]

    for (const term of MajorSolarTerms) {
        // Check if the current term falls between the longitudes
        if (term > newMoonThisMonthLongitudeOfSun && term < newMoonNextMonthLongitudeOfSun) {
            return 'major';
        }
    }
    return 'minor';
}

// Possible errors here if the conjunction happens a few hours after the solstice but before midnight
function getMonthEleven(winterSolstice) {
    // Iterate through the lunar conjunctions to find the range containing the winter solstice
    let currentMonth = 0; // Start from the current month

    // Get the lunar conjunction closest to the winter solstice
    let closestConjunction = getNewMoonThisMonth(winterSolstice, currentMonth);

    // Check if the closest conjunction is after the winter solstice
    if (closestConjunction > winterSolstice) {
        // Move to the previous month to find the start of the eleventh month
        closestConjunction = getNewMoonThisMonth(winterSolstice, currentMonth - 1);
    }

    return closestConjunction;
}

function calculateFirstMonthWithoutMajorSolarTerm(midnightStartOfMonthElevenLastYear) {
    let dateToCheck = new Date(midnightStartOfMonthElevenLastYear);
    let lunations = 0;
    while (true) {
        const solarTermType = getSolarTermTypeThisMonth(dateToCheck);
        
        if (solarTermType !== 'major') {
            // Found the first month without a major solar term
            return lunations;
        }
        
        // Move to the start of the next month
        const millisecondsIn29_53Days = 29.53 * 24 * 60 * 60 * 1000;
        dateToCheck.setTime(dateToCheck.getTime() + millisecondsIn29_53Days);
        lunations += 1;
    }
}

function getStartOfTishri(currentDateTime) {
    let yearsInHebrew = 5732;
    const moladTishri5732 = new Date(Date.UTC(1971, 8, 20, 0, 0, 0)); // Sunset in Jerusalem (UTC+2)
    const startOfBaseMoladDays = 0.32;
    const millisecondsSince5732 = currentDateTime - moladTishri5732;
    const yearsSince5732 = (millisecondsSince5732)/1000/24/60/60/365.25;
    const metonicCyclesSince5732 = Math.floor(yearsSince5732/19);
    const yearsThisMetonicCycle = yearsSince5732 - (metonicCyclesSince5732*19);
    let monthsSince5732 = metonicCyclesSince5732 * 235;
    yearsInHebrew += (metonicCyclesSince5732*19);
    const currentYear = yearsSince5732 + 5732;

    for (let year = yearsInHebrew; year < currentYear-1; year++) {
        if (isMetonicCycleLeapYear(year%19)) {
            monthsSince5732 += 13;
        } else {
            monthsSince5732 += 12;
        }
        yearsInHebrew += 1;
    }

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
    startOfTishri.setUTCHours(20);
    startOfTishri.setMinutes(0);
    startOfTishri.setSeconds(0);
    startOfTishri.setMilliseconds(0);
    return startOfTishri;
}

function calculateHebrewCalendar(currentDateTime) {

    // Number of days in each Hebrew month
    const Hebrew_monthDaysDeficient = [30, 29, 29, 29, 30, 30, 29, 30, 29, 30, 29, 30, 29]; // 353 or 383 days
    const Hebrew_monthDaysRegular = [30, 29, 30, 29, 30, 30, 29, 30, 29, 30, 29, 30, 29]; // 354 or 384 days
    const Hebrew_monthDaysComplete = [30, 30, 30, 29, 30, 30, 29, 30, 29, 30, 29, 30, 29]; // 355 or 385 days

    const HebrewMonths = [
        "Tishri",
        "Heshvan",
        "Kislev",
        "Tevet",
        "Shevat",
        "Adar",
        "Adar II", // In leap years only
        "Nisan",
        "Iyyar",
        "Sivan",
        "Tammuz",
        "Av",
        "Elul"
    ];

    const lastTishri = getStartOfTishri(currentDateTime);
    // Next year, but add a few months to make sure we are past that year's Tishri 1
    let nextYearPlusABit = new Date(lastTishri);
    nextYearPlusABit.setFullYear(lastTishri.getFullYear() + 1);
    nextYearPlusABit.setMonth(lastTishri.getMonth() + 3);
    const nextTishri = getStartOfTishri(nextYearPlusABit);
    const daysThisYear = (nextTishri - lastTishri) / 1000 / 24 / 60 / 60;

    let remainingDays = Math.trunc((currentDateTime-lastTishri) / 1000 / 24 / 60 / 60);

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

    return hebrewDate.day + ' ' + HebrewMonths[hebrewDate.month] + ' ' + hebrewDate.year + ' AM';
}

