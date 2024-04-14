const decimals = 10;

function updateDateAndTime() {
    var inputDate = new Date(100, 8, 31, 23, 59, 59, 999)
    var currentDateTime = new Date(inputDate);

    // Get UTC time for display.
    var day = currentDateTime.getUTCDate();
    var month = currentDateTime.getUTCMonth() + 1;
    var year = currentDateTime.getUTCFullYear();
    var hour = currentDateTime.getUTCHours();
    var minute = currentDateTime.getUTCMinutes();
    var second = currentDateTime.getUTCSeconds();

    var dateDisplayString = year + '-' + month + '-' + day;
    var timeDisplayString = hour + ':' + minute + ':' + second + ' UTC';

    // Change back to regular time.
    day = currentDateTime.getDate();
    month = currentDateTime.getMonth();
    year = currentDateTime.getFullYear();
    hour = currentDateTime.getHours();
    minute = currentDateTime.getMinutes();
    second = currentDateTime.getSeconds();

    var dayStart = new Date(year, month, day);
    var nextDayStart = new Date(year, month, day + 1);
    var dayFraction = (currentDateTime - dayStart) / (nextDayStart - dayStart);

    var monthStart = new Date(year, month, 1);
    var nextMonthStart = new Date(year, month + 1, 1);
    var monthFraction = (currentDateTime - monthStart) / (nextMonthStart - monthStart);

    var yearStart = new Date(year, 0, 1);
    var nextYearStart = new Date(year + 1, 0, 1);
    var yearFraction = (currentDateTime - yearStart) / (nextYearStart - yearStart);

    var hourStart = new Date(year, month, day, hour);
    var nextHourStart = new Date(year, month, day, hour + 1);
    var hourFraction = (currentDateTime - hourStart) / (nextHourStart - hourStart);

    var minuteStart = new Date(year, month, day, hour, minute);
    var nextMinuteStart = new Date(year, month, day, hour, minute + 1);
    var minuteFraction = (currentDateTime - minuteStart) / (nextMinuteStart - minuteStart);

    var secondStart = new Date(year, month, day, hour, minute, second);
    var nextSecondStart = new Date(year, month, day, hour, minute, second + 1);
    var secondFraction = (currentDateTime - secondStart) / (nextSecondStart - secondStart);

    var decadeStart = new Date(Math.floor(year / 10) * 10, 0, 1);
    var nextDecadeStart = new Date(Math.floor(year / 10) * 10 + 10, 0, 1);
    var decadeFraction = (currentDateTime - decadeStart) / (nextDecadeStart - decadeStart);  // use unix dammit

    var centuryStart = new Date(Math.floor(year / 100) * 100, 0, 1);
    var nextCenturyStart = new Date(Math.floor(year / 100) * 100 + 100, 0, 1);
    var centuryFraction = (currentDateTime - centuryStart) / (nextCenturyStart - centuryStart);  // use unix dammit

    var millenniumStart = new Date(Math.floor(year / 1000) * 1000, 0, 1);
    var nextMillenniumStart = new Date(Math.floor(year / 1000) * 1000 + 1000, 0, 1);
    var millenniumFraction = (currentDateTime - millenniumStart) / (nextMillenniumStart - millenniumStart);  // use unix dammit

    var unix64Value = Math.floor(currentDateTime / 1000);  // use unix dammit
    var filetimeValue = getCurrentFiletime(currentDateTime);
    var iso8601Value = currentDateTime.toISOString();
    var gpsValue = Math.floor((currentDateTime - new Date("1980-01-06T00:00:00Z").getTime()) / 1000);

    var humanEraCalendar = new Date(Date.UTC(year + 10000, month, day));
    var humanEra = formatDateWithoutLeadingZeros(humanEraCalendar);

    var julianCalendar = getJulianDate(currentDateTime);
    var startOfGregorianCalendar = new Date('1582-10-15');
    if (currentDateTime < startOfGregorianCalendar) {
        // Use the Julian calendar
        gregorianCalendar = julianCalendar;
    } else {
        // Use the Gregorian calendar
        var gregorianCalendar = dateDisplayString;
    }

    var mingguoYear = year - 1911;
    if (mingguoYear <= 0 && year > 0) {
        mingguoYear--;
    }
    
    var minguoCalendar = new Date(Date.UTC(1911, month, day));
    minguoCalendar.setFullYear(mingguoYear);
    var minguoJuche = formatDateWithoutLeadingZeros(minguoCalendar);

    var thaiSolarYear = year + 544
    if (thaiSolarYear <= 0 && year >= -544) {
        thaiSolarYear--;
    }
    var thaiSolarCalendar = new Date(Date.UTC(543, month, day));
    thaiSolarCalendar.setFullYear(thaiSolarYear);
    var thaiSolar = formatDateWithoutLeadingZeros(thaiSolarCalendar);

    var chineseZodiacYear = getChineseZodiacYear(year);
    var vietnameseZodiacYear = getVietnameseZodiacYear(year);

    var eraFascistaCalendar = new Date(Date.UTC(year - 1922, month, day));
    var eraFascista = formatDateWithoutLeadingZeros(eraFascistaCalendar);
    var romanYear = toRomanNumerals(eraFascista.split('-')[0]);
    var eraFascistaWithRomanYear = eraFascista.replace(eraFascista.split('-')[0], 'Anno ' + romanYear);

    var decimalHour = dayFraction * 10;
    var decimalMinute = (decimalHour % 1) * 100;
    var decimalSecond = (decimalMinute % 1) * 100;
    var decimalTime = decimalHour.toFixed(0) + ":" + decimalMinute.toFixed(0) + ":" + decimalSecond.toFixed(0);

    var republicanCalendar = getRepublicanCalendar(currentDateTime);
    var republicanCalendarString = toRomanNumerals(republicanCalendar.year) + "-" + republicanCalendar.month + "-" + republicanCalendar.day;

    setTimeValue('gregorian-box', gregorianCalendar);
    setTimeValue('time-box', timeDisplayString)
    setTimeValue('day-box', dayFraction.toFixed(decimals));
    setTimeValue('month-box', monthFraction.toFixed(decimals));
    setTimeValue('year-box', yearFraction.toFixed(decimals));
    setTimeValue('hour-box', hourFraction.toFixed(decimals));
    setTimeValue('minute-box', minuteFraction.toFixed(decimals));
    setTimeValue('second-box', secondFraction.toFixed(decimals));
    setTimeValue('decade-box', decadeFraction.toFixed(decimals));
    setTimeValue('century-box', centuryFraction.toFixed(decimals));
    setTimeValue('millennium-box', millenniumFraction.toFixed(decimals));

    setTimeValue('unix-box', unix64Value);
    setTimeValue('filetime-box', filetimeValue);
    setTimeValue('iso8601-box', iso8601Value);
    setTimeValue('gps-box', gpsValue);

    setTimeValue('human-era-box', humanEra);
    setTimeValue('julian-box', julianCalendar);
    setTimeValue('sexagenary-year-box', getSexagenaryYear(year));
    setTimeValue('chinese-zodiac-box', chineseZodiacYear);
    setTimeValue('vietnamese-zodiac-box', vietnameseZodiacYear);
    setTimeValue('french-republican-box', republicanCalendarString);
    setTimeValue('era-fascista-box', eraFascistaWithRomanYear);
    setTimeValue('minguo-box', minguoJuche);
    setTimeValue('thai-solar-box', thaiSolar);
    setTimeValue('juche-box', minguoJuche);

    setTimeValue('revolutionary-time-box', decimalTime);
    setTimeValue('beat-time-box', convertToSwatchBeats(dayFraction));
}

// Update the date and time every second
setInterval(updateDateAndTime, 1);

// Initial update
updateDateAndTime();

function setTimeValue(type, value) {
    document.getElementById(type).textContent = value;
}

function formatDateWithoutLeadingZeros(date) {
    // Get individual components of the date
    var year = date.getFullYear().toString(); // Get the year as a string
    var month = (date.getMonth() + 1).toString().padStart(2, '0'); // Add 1 to month since it's zero-indexed
    var day = date.getDate().toString().padStart(2, '0'); // Get the day as a string

    // Remove leading zeros if the number is not a single digit
    if (year[0] === '-') {
        // If the year is negative, preserve the negative sign and remove leading zeros
        year = '-' + year.slice(1).replace(/^0+/, '');
    } else if (year.length > 1) {
        // If the year is positive and has leading zeros, remove them
        year = year.replace(/^0+/, '');
    }

    // Construct the formatted date string
    return year + '-' + month + '-' + day;
}




function getCurrentFiletime(currentDateTime) {
    var jan1601 = new Date(Date.UTC(1601, 0, 1));
    var filetime = currentDateTime.getTime() * 10000 + jan1601.getTime();
    return filetime;
}

function convertToSwatchBeats(dayFraction_) {
    // Convert day fraction to milliseconds
    var milliseconds = dayFraction_ * 864; // 86400000 ms = 1 day
    // Convert GMT time to BMT by adding 1 hour (3600000 ms)
    milliseconds += 36;
    // Calculate Swatch .beats
    var swatchBeats = (milliseconds % 864) * (1000 / 864); // 86400000 ms = 1000 .beats
    return Math.floor(swatchBeats);
}

function getChineseZodiacYear(year_) {
    var zodiacAnimals = ['鼠 (Rat)', '牛 (Ox)', '虎 (Tiger)', '兔 (Rabbit)', '龍 (Dragon)', '蛇 (Snake)', '馬 (Horse)', '羊 (Goat)', '猴 (Monkey)', '雞 (Rooster)', '狗 (Dog)', '豬 (Pig)'];
    // Adjusting for the start of the Chinese zodiac cycle, handling negative years
    var index = year_ >= 4 ? (year_ - 4) % 12 : ((Math.abs(year_) + 8) % 12 === 0 ? 0 : 12 - ((Math.abs(year_) + 8) % 12));
    if (year_ < 0) {
        index++;
    }
    return zodiacAnimals[index];
}

function getVietnameseZodiacYear(year_) {
    var zodiacAnimals = ['𤝞 (Rat)', '𤛠 (Water Buffalo)', '𧲫 (Tiger)', '猫 (Cat)', '龍 (Dragon)', '𧋻 (Snake)', '馭 (Horse)', '羝 (Goat)', '𤠳 (Monkey)', '𪂮 (Rooster)', '㹥 (Dog)', '㺧 (Pig)'];
    // Adjusting for the start of the Chinese zodiac cycle, handling negative years
    var index = year_ >= 4 ? (year_ - 4) % 12 : ((Math.abs(year_) + 8) % 12 === 0 ? 0 : 12 - ((Math.abs(year_) + 8) % 12));
    if (year_ < 0) {
        index++;
    }
    return zodiacAnimals[index];
}

function getSexagenaryYear(year_) {
    var heavenlyStems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
    var earthlyBranches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

    var heavenlyStemsEnglish = ['Jia', 'Yi', 'Bing', 'Ding', 'Wu', 'Ji', 'Geng', 'Xin', 'Ren', 'Gui'];
    var earthlyBranchesEnglish = ['Zi', 'Chou', 'Yin', 'Mao', 'Chen', 'Si', 'Wu', 'Wei', 'Shen', 'You', 'Xu', 'Hai'];
    
    // Ensure year_ is positive before calculating indices
    var positiveYear = year_ < 0 ? 60 + (year_ % 60) : year_;

    var heavenlyStemIndex = (positiveYear - 4) % 10; // Adjusting for the start of the sexagenary cycle
    var earthlyBranchIndex = (positiveYear - 4) % 12; // Adjusting for the start of the sexagenary cycle

    if (year_ < 0) {
        heavenlyStemIndex++;
        earthlyBranchIndex++;
    }
    
    var heavenlyStem = heavenlyStems[heavenlyStemIndex];
    var earthlyBranch = earthlyBranches[earthlyBranchIndex];
    var heavenlyStemEnglish = heavenlyStemsEnglish[heavenlyStemIndex];
    var earthlyBrancheEnglish = earthlyBranchesEnglish[earthlyBranchIndex];
    
    return heavenlyStem + earthlyBranch + ' (' + heavenlyStemEnglish + earthlyBrancheEnglish + ')';
}

function getCurrentDayOfYear(currentDateTime) {
    var startOfYear = new Date(Date.UTC(currentDateTime.getUTCFullYear(), 0, 0)); // January 0th (yes, 0-based) is the last day of the previous year
    var diff = currentDateTime - startOfYear;
    var oneDay = 1000 * 60 * 60 * 24; // Number of milliseconds in a day
    var dayOfYear = Math.floor(diff / oneDay);
    return dayOfYear;
}

function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function getRepublicanCalendar(currentDateTime) {
    // Date of September 22nd of the current year
    var september22 = new Date(currentDateTime.getFullYear(), 8, 22, currentDateTime.getHours() + 1); // Note: Month is 8 for September (0-indexed)
    // If the current date is before September 22nd, subtract 1 year
    if (currentDateTime < september22) {
        september22.setFullYear(september22.getFullYear() - 1);
    }
    // Calculate the number of years since 1792
    var yearsSince1792 = (september22.getFullYear() - 1792) + 1;
    if (yearsSince1792 <= 0 && currentDateTime.getFullYear() > 0) {
        yearsSince1792--;
    }
    // Calculate the total number of days since the most recent September 22nd
    var daysSinceSeptember22 = Math.floor((currentDateTime - september22) / (1000 * 60 * 60 * 24));
    var month = Math.floor(daysSinceSeptember22 / 30) + 1;
    if (month > 12) {
        month = 'Sansculottides';
    }
    var day = Math.floor(daysSinceSeptember22 % 30)+1;
    console.log(yearsSince1792);
    return {year: yearsSince1792, month: month, day: day};
}

function getJulianDate(currentDateTime) {
    const startYear = 1582;
    let skippedJulianLeapYears = 0;
    let skippedGregorianLeapYears = 0;
    for (let year = startYear; year <= currentDateTime.getFullYear(); year++) {
        // Check if the year is a leap year in the Julian calendar
        if (year % 4 === 0) {
            skippedJulianLeapYears++;
        }
        // Check if the year is a leap year in the Gregorian calendar
        if (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) {
            skippedGregorianLeapYears++;
        }
    }
    // Calculate the difference between the number of skipped leap years in the two calendars
    var difference = skippedJulianLeapYears - skippedGregorianLeapYears;
    difference += 10; // Gregorian Calendar skipped 10 days at inception.
    const julianDate = new Date(currentDateTime);
    julianDate.setDate(currentDateTime.getDate() - difference);
    
    // Format the date string without leading zeros for negative years
    var yearString = julianDate.getFullYear().toString();
    if (yearString[0] === '-') {
        yearString = '-' + yearString.slice(1).replace(/^0+/, '');
    }
    
    return yearString + '-' + (julianDate.getMonth() + 1).toString().padStart(2, '0') + '-' + julianDate.getDate().toString().padStart(2, '0');
}

function toRomanNumerals(num) {
    if (num < 0) {
        return '-' + toRomanNumerals(-num);
    }

    const romanNumerals = [
        { value: 1000, symbol: 'M' },
        { value: 900, symbol: 'CM' },
        { value: 500, symbol: 'D' },
        { value: 400, symbol: 'CD' },
        { value: 100, symbol: 'C' },
        { value: 90, symbol: 'XC' },
        { value: 50, symbol: 'L' },
        { value: 40, symbol: 'XL' },
        { value: 10, symbol: 'X' },
        { value: 9, symbol: 'IX' },
        { value: 5, symbol: 'V' },
        { value: 4, symbol: 'IV' },
        { value: 1, symbol: 'I' }
    ];

    let result = '';
    for (let i = 0; i < romanNumerals.length; i++) {
        while (num >= romanNumerals[i].value) {
            result += romanNumerals[i].symbol;
            num -= romanNumerals[i].value;
        }
    }
    return result;
}
