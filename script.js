
//https://www.fourmilab.ch/documents/calendar/

const decimals = 10;
document.getElementById('gregorian-tooltip').textContent = window.gregorian.description;
document.getElementById('julian-tooltip').textContent = window.julian.description;
document.getElementById('unix-tooltip').textContent = window.unix.description;
document.getElementById('filetime-tooltip').textContent = window.filetime.description;
document.getElementById('iso8601-tooltip').textContent = window.iso8601.description;
document.getElementById('gps-tooltip').textContent = window.gps.description;

function updateDateAndTime() {
    let currentDateTime = new Date();
    //let currentDateTime = new Date(inputDate);
    //currentDateTime.setFullYear(-1)

    // Get basic info about the date and time
    day = currentDateTime.getDate();
    month = currentDateTime.getMonth();
    year = currentDateTime.getFullYear();
    hour = currentDateTime.getHours();
    minute = currentDateTime.getMinutes();
    second = currentDateTime.getSeconds();
    let dateDisplayString = year + '-' + (month+1) + '-' + day;
    let timeDisplayString = hour + ':' + minute + ':' + second;

    // All fractional times
    let secondFraction = calculateSecond(currentDateTime);
    let minuteFraction = calculateMinute(currentDateTime);
    let hourFraction = calculateHour(currentDateTime);
    let dayFraction = calculateDay(currentDateTime);
    let monthFraction = calculateMonth(currentDateTime);
    let yearFraction = calculateYear(currentDateTime);
    let decadeFraction = calculateDecade(currentDateTime);
    let centuryFraction = calculateCentury(currentDateTime);
    let millenniumFraction = calculateMillennium(currentDateTime);

    // Computing Times
    let currentUnixDateTime = getUnixTime(currentDateTime);
    let filetimeValue = getCurrentFiletime(currentDateTime);
    let iso8601Value = currentDateTime.toISOString();
    let gpsValue = getGPSTime(currentDateTime);
    let julianDay = getJulianDayNumber(currentDateTime)
    let rataDie = getRataDie(currentDateTime);

    // Calendars
    let humanEraCalendar = new Date(Date.UTC(year + 10000, month, day));
    let humanEra = formatDateWithoutLeadingZeros(humanEraCalendar);

    let julianCalendar = getJulianDate(currentDateTime);
    let gregorianCalendar = dateDisplayString;

    let mingguoYear = year - 1911;
    if (mingguoYear <= 0 && year > 0) {
        mingguoYear--;
    }
    
    let minguoCalendar = new Date(Date.UTC(1911, month, day));
    minguoCalendar.setFullYear(mingguoYear);
    let minguoJuche = formatDateWithoutLeadingZeros(minguoCalendar);

    let thaiSolarYear = year + 544
    if (thaiSolarYear <= 0 && year >= -544) {
        thaiSolarYear--;
    }
    let thaiSolarCalendar = new Date(Date.UTC(543, month, day));
    thaiSolarCalendar.setFullYear(thaiSolarYear);
    let thaiSolar = formatDateWithoutLeadingZeros(thaiSolarCalendar);

    let chineseZodiacYear = getChineseZodiacYear(year);
    let vietnameseZodiacYear = getVietnameseZodiacYear(year);

    let eraFascistaCalendar = new Date(Date.UTC(year - 1922, month, day));
    let eraFascista = formatDateWithoutLeadingZeros(eraFascistaCalendar);
    let romanYear = toRomanNumerals(eraFascista.split('-')[0]);
    let eraFascistaWithRomanYear = eraFascista.replace(eraFascista.split('-')[0], 'Anno ' + romanYear);

    let decimalHour = dayFraction * 10;
    let decimalMinute = (decimalHour % 1) * 100;
    let decimalSecond = (decimalMinute % 1) * 100;
    let decimalTime = decimalHour.toFixed(0) + ":" + decimalMinute.toFixed(0) + ":" + decimalSecond.toFixed(0);

    let republicanCalendar = getRepublicanCalendar(currentDateTime);
    let republicanCalendarString = toRomanNumerals(republicanCalendar.year) + "-" + republicanCalendar.month + "-" + republicanCalendar.day;
    
    setTimeValue('time-box', timeDisplayString)
    setTimeValue('utc-box', currentDateTime)
    setTimeValue('day-box', dayFraction.toFixed(decimals));
    setTimeValue('month-box', monthFraction.toFixed(decimals));
    setTimeValue('year-box', yearFraction.toFixed(decimals));
    setTimeValue('hour-box', hourFraction.toFixed(decimals));
    setTimeValue('minute-box', minuteFraction.toFixed(decimals));
    setTimeValue('second-box', secondFraction.toFixed(decimals));
    setTimeValue('decade-box', decadeFraction.toFixed(decimals));
    setTimeValue('century-box', centuryFraction.toFixed(decimals));
    setTimeValue('millennium-box', millenniumFraction.toFixed(decimals));

    setTimeValue('unix-box', currentUnixDateTime);
    setTimeValue('filetime-box', filetimeValue);
    setTimeValue('iso8601-box', iso8601Value);
    setTimeValue('gps-box', gpsValue);
    setTimeValue('julian-day-number-box', julianDay);
    setTimeValue('rata-die-box', rataDie);

    setTimeValue('revolutionary-time-box', decimalTime);
    setTimeValue('beat-time-box', convertToSwatchBeats(dayFraction));

    setTimeValue('gregorian-box', gregorianCalendar);
    setTimeValue('human-era-box', humanEra);
    setTimeValue('julian-box', julianCalendar);
    setTimeValue('french-republican-box', republicanCalendarString);
    setTimeValue('era-fascista-box', eraFascistaWithRomanYear);
    setTimeValue('minguo-box', minguoJuche);
    setTimeValue('thai-solar-box', thaiSolar);
    setTimeValue('juche-box', minguoJuche);

    setTimeValue('sexagenary-year-box', getSexagenaryYear(year));
    setTimeValue('chinese-zodiac-box', chineseZodiacYear);
    setTimeValue('vietnamese-zodiac-box', vietnameseZodiacYear);
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
    let year = date.getFullYear().toString(); // Get the year as a string
    let month = (date.getMonth() + 1).toString().padStart(2, '0'); // Add 1 to month since it's zero-indexed
    let day = date.getDate().toString().padStart(2, '0'); // Get the day as a string

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

function convertAstronomicalYear(year) {
    if (year > 0) {
        return year;
    }
    if (year <= 0) {
        return year + 1;
    }
}

function reverseConvertAstronomicalYear(year) {
    if (year > 0) {
        return year - 1;
    }
    if (year <= 0) {
        return year;
    }
}

function convertToSwatchBeats(dayFraction_) {
    // Convert day fraction to milliseconds
    let milliseconds = dayFraction_ * 864; // 86400000 ms = 1 day
    // Convert GMT time to BMT by adding 1 hour (3600000 ms)
    milliseconds += 36;
    // Calculate Swatch .beats
    let swatchBeats = (milliseconds % 864) * (1000 / 864); // 86400000 ms = 1000 .beats
    return Math.floor(swatchBeats);
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

function getSexagenaryYear(year_) {
    let heavenlyStems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
    let earthlyBranches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

    let heavenlyStemsEnglish = ['Jia', 'Yi', 'Bing', 'Ding', 'Wu', 'Ji', 'Geng', 'Xin', 'Ren', 'Gui'];
    let earthlyBranchesEnglish = ['Zi', 'Chou', 'Yin', 'Mao', 'Chen', 'Si', 'Wu', 'Wei', 'Shen', 'You', 'Xu', 'Hai'];
    
    // Ensure year_ is positive before calculating indices
    let positiveYear = year_ < 0 ? 60 + (year_ % 60) : year_;

    let heavenlyStemIndex = (positiveYear - 4) % 10; // Adjusting for the start of the sexagenary cycle
    let earthlyBranchIndex = (positiveYear - 4) % 12; // Adjusting for the start of the sexagenary cycle

    if (year_ < 0) {
        heavenlyStemIndex++;
        earthlyBranchIndex++;
    }
    
    let heavenlyStem = heavenlyStems[heavenlyStemIndex];
    let earthlyBranch = earthlyBranches[earthlyBranchIndex];
    let heavenlyStemEnglish = heavenlyStemsEnglish[heavenlyStemIndex];
    let earthlyBrancheEnglish = earthlyBranchesEnglish[earthlyBranchIndex];
    
    return heavenlyStem + earthlyBranch + ' (' + heavenlyStemEnglish + earthlyBrancheEnglish + ')';
}

function getCurrentDayOfYear(currentDateTime) {
    let startOfYear = new Date(Date.UTC(currentDateTime.getUTCFullYear(), 0, 0)); // January 0th (yes, 0-based) is the last day of the previous year
    let diff = currentDateTime - startOfYear;
    let oneDay = 1000 * 60 * 60 * 24; // Number of milliseconds in a day
    let dayOfYear = Math.floor(diff / oneDay);
    return dayOfYear;
}

function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function getRepublicanCalendar(currentDateTime) {
    // Date of September 22nd of the current year
    let september22 = new Date(currentDateTime.getFullYear(), 8, 22); // Note: Month is 8 for September (0-indexed)
    // If the current date is before September 22nd, subtract 1 year
    if (currentDateTime < september22) {
        september22.setFullYear(september22.getFullYear() - 1);
    }
    // Calculate the number of years since 1792
    let yearsSince1792 = (september22.getFullYear() - 1792) + 1;
    if (yearsSince1792 <= 0 && currentDateTime.getFullYear() > 0) {
        yearsSince1792--;
    }
    // Calculate the total number of days since the most recent September 22nd
    let daysSinceSeptember22 = Math.floor((currentDateTime - september22) / (1000 * 60 * 60 * 24));
    let month = Math.floor(daysSinceSeptember22 / 30)+1;
    if ((month > 12) || (month == 0)) {
        month = 'Sansculottides';
    }
    let day = Math.floor(daysSinceSeptember22 % 30)+1;
    return {year: yearsSince1792, month: month, day: day};
}

function getJulianDate(currentDateTime) {
    let year = currentDateTime.getFullYear();
    let daysAhead = Math.floor(convertAstronomicalYear(year) / 100) - Math.floor(convertAstronomicalYear(year) / 400) - 2;
    let julianDate = new Date(currentDateTime);
    julianDate.setUTCDate(julianDate.getUTCDate() - daysAhead);
    
    // Convert the Date object to a string in ISO 8601 format and extract only the date part
    let dateString = julianDate.toISOString().split('T')[0];
    
    // Remove leading zeros from the year part
    if (dateString.startsWith('-')) {
        dateString = '-' + dateString.substring(1).replace(/^0+/, '');
    } else {
        dateString = dateString.replace(/^0+/, '');
    }
    
    return dateString;
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