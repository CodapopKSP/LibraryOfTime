//|-------------------------|
//|     Other Calendars     |
//|-------------------------|

// A set of functions for calculating dates in the Other Calendars category.

// --- Maya calendar constants ---
const MAYAN_TZ = 'UTC-06:00';
const MAYAN_EPOCH_CONFIG = { timezone: MAYAN_TZ, year: -3113, month: 8, day: 11 };

function getMayanEpoch() {
    return createAdjustedDateTime(MAYAN_EPOCH_CONFIG);
}
const MS_PER_DAY = 86400000;
const MAYAN_DAYS_PER_BAKTUN = 144000;
const MAYAN_DAYS_PER_KATUN = 7200;
const MAYAN_DAYS_PER_TUN = 360;
const MAYAN_DAYS_PER_UINAL = 20;

function mayaDivmod(n, d) {
    const q = Math.floor(n / d);
    const r = n % d;
    return [q, r < 0 ? r + d : r];
}

function getCurrentMayaLongCount(currentDateTime) {
    const totalDays = Math.floor((currentDateTime - getMayanEpoch()) / MS_PER_DAY);
    let days = totalDays;

    const [baktuns, daysAfterBaktun] = mayaDivmod(days, MAYAN_DAYS_PER_BAKTUN);
    const [katuns, daysAfterKatun] = mayaDivmod(daysAfterBaktun, MAYAN_DAYS_PER_KATUN);
    const [tuns, daysAfterTun] = mayaDivmod(daysAfterKatun, MAYAN_DAYS_PER_TUN);
    const [uinals, kins] = mayaDivmod(daysAfterTun, MAYAN_DAYS_PER_UINAL);

    const output = `${baktuns}.${katuns}.${tuns}.${uinals}.${kins}`;
    return { output, other: { baktun: baktuns, katun: katuns, tun: tuns, uinal: uinals, kin: kins } };
}


// --- Darian (Mars) calendar constants ---
const DARIAN_MONTH_NAMES = [
    'Sagittarius', 'Dhanus', 'Capricornus', 'Makara', 'Aquarius', 'Khumba',
    'Pisces', 'Mina', 'Aries', 'Mesha', 'Taurus', 'Rishabha',
    'Gemini', 'Mithuna', 'Cancer', 'Karka', 'Leo', 'Simha',
    'Virgo', 'Kanya', 'Libra', 'Tula', 'Scorpius', 'Vrishika'
];

const DARIAN_MARS_WEEKDAY_NAMES = ['Solis', 'Lunae', 'Martis', 'Mercurii', 'Jovis', 'Veneris', 'Saturni'];

function getDarianMarsDaysInMonth(month, isLeapYear) {
    if (month === 5 || month === 11 || month === 17) {
        return 27;
    }
    if (month === 23 && !isLeapYear) {
        return 27;
    }
    return 28;
}

function getDarianMarsDate(julianSolNumber) {

    // Odd years except if divisible by 10, but not 100 except for 500
    function isLeapYear(year) {
        if (year <= 2000) {
            if (year%1000 == 0) {
                return true;
            }
            if (year%100 == 0) {
                return false;
            }
        }

        if ((year > 2000) && (year <= 4800)) {
            if (year%150 == 0) {
                return false;
            }
        }

        if ((year > 4800) && (year <= 6800)) {
            if (year%200 == 0) {
                return false;
            }
        }

        if ((year > 6800) && (year <= 8400)) {
            if (year%300 == 0) {
                return false;
            }
        }

        if ((year > 8400) && (year <= 10000)) {
            if (year%600 == 0) {
                return false;
            }
        }

        if (year%10 === 0) {
            return true;
        }
        if ((year-1)%2 === 0) {
            return true;
        }
        
        return false;
    }

    function getDaysInYear(year) {
        return isLeapYear(year) ? 669 : 668;
    }

    // Handle negative Julian Sol Numbers
    let remainingDays = julianSolNumber;
    let year = 0;

    if (remainingDays >= 0) {
        // Positive years
        while (remainingDays >= getDaysInYear(year)) {
            remainingDays -= getDaysInYear(year);
            year++;
        }
    } else {
        // Negative years
        while (remainingDays < 0) {
            year--;
            remainingDays += getDaysInYear(year);
        }
    }

    const isLeap = isLeapYear(year);
    let month = 0;
    while (true) {
        const monthLength = getDarianMarsDaysInMonth(month, isLeap);
        if (remainingDays < monthLength) {
            break;
        }
        remainingDays -= monthLength;
        month++;
    }
    const day = Math.trunc(remainingDays) + 1;
    const dayOfWeek = (day - 1) % 7;

    const output = day + ' ' + DARIAN_MONTH_NAMES[month] + ' ' + year + '\nSol ' + DARIAN_MARS_WEEKDAY_NAMES[dayOfWeek];
    return { output, day, month, year, dayOfWeek };
}

// --- Galilean (Jovian moons) calendar constants ---
const GALILEAN_MONTH_NAMES = [
    'Januarius', 'Februarius', 'Mercedonius', 'Martius', 'Aprilis', 'Maius',
    'Junius', 'Julius', 'Augustus', 'September', 'October', 'November', 'December'
];

const GALILEAN_WEEKDAY_NAMES = ['Solis', 'Lunae', 'Terrae', 'Martis', 'Mercurii', 'Jovis', 'Veneris', 'Saturni'];

const GALILEAN_IO_CALLISTO_MONTH_DAYS = [...Array(12).fill(32), 24];
const GALILEAN_IO_CALLISTO_MONTH_DAYS_LEAP = Array(13).fill(32);
const GALILEAN_GANYMEDE_MONTH_DAYS_SHORT = [...Array(6).fill(32), 24, ...Array(5).fill(32), 24];
const GALILEAN_GANYMEDE_MONTH_DAYS_LEAP = [...Array(6).fill(32), 24, ...Array(6).fill(32)];

const GALILEAN_EPOCHS = {
    Io: { year: 2001, month: 12, day: 31, hour: 16, minute: 7, second: 45 },
    Eu: { year: 2002, month: 1, day: 2, hour: 17, minute: 12, second: 57 },
    Gan: { year: 2002, month: 1, day: 1, hour: 11, minute: 8, second: 29 },
    Cal: { year: 2001, month: 12, day: 28, hour: 12, minute: 27, second: 23 }
};

const GALILEAN_CIRCAD_HOURS = { Io: 21.238325, Eu: 21.32456, Gan: 21.49916, Cal: 21.16238 };

const DARIAN_GALILEAN_EPOCHS = {
    Io: { year: 1609, month: 3, day: 13, hour: 5, minute: 29, second: 26 },
    Eu: { year: 1609, month: 3, day: 12, hour: 1, minute: 19, second: 41 },
    Gan: { year: 1609, month: 3, day: 11, hour: 9, minute: 52, second: 12 },
    Cal: { year: 1609, month: 3, day: 17, hour: 20, minute: 57, second: 24 }
};

const DARIAN_GALILEAN_IO_CALLISTO_MONTH_DAYS = [...Array(11).fill(32), 40, ...Array(12).fill(32)];
const DARIAN_GALILEAN_IO_CALLISTO_MONTH_DAYS_LEAP = [...Array(11).fill(32), 40, ...Array(11).fill(32), 40];
const DARIAN_GALILEAN_EUROPA_MONTH_DAYS = Array(24).fill(32);
const DARIAN_GALILEAN_EUROPA_MONTH_DAYS_LEAP = [...Array(23).fill(32), 40];
const DARIAN_GALILEAN_GANYMEDE_MONTH_DAYS = [...Array(23).fill(32), 24];
const DARIAN_GALILEAN_GANYMEDE_MONTH_DAYS_LEAP = Array(24).fill(32);

function isGalileanLeapYearIo(Y) {
    if (Y === 0) {
        return true;
    }
    if (Y % 1000 === 0) {
        return true;
    }
    if (Y % 400 === 0) {
        return false;
    }
    if (Y % 200 === 0) {
        return true;
    }
    if (Y % 100 === 0) {
        return false;
    }
    if (Y % 50 === 0) {
        return true;
    }
    if ((Y % 10 === 2) || (Y % 10 === 4) || (Y % 10 === 7) || (Y % 10 === 9)) {
        return false;
    }
    return true;
}

function isGalileanLeapYearEuropa(Y) {
    if (Y === 0) {
        return true;
    }
    if (Y % 1000 === 0) {
        return false;
    }
    if (Y % 800 === 0) {
        return true;
    }
    if (Y % 400 === 0) {
        return false;
    }
    if (Y % 200 === 0) {
        return true;
    }
    if (Y % 50 === 0) {
        return false;
    }
    if ((Y % 5 === 0) || ((Y - 2) % 5 === 0)) {
        return true;
    }
    return false;
}

function isGalileanLeapYearGanymede(Y) {
    if (Y % 40 === 0) {
        return false;
    }
    if (Y % 60 === 0) {
        return false;
    }
    return true;
}

function isGalileanLeapYearCallisto(Y) {
    if (Y % 400 === 0) {
        return true;
    }
    if (Y % 40 === 0) {
        return false;
    }
    if ((Y - 7) % 10 === 0) {
        return false;
    }
    if ((Y - 2) % 10 === 0) {
        return false;
    }
    return true;
}

function isDarianGalileanLeapYearIo(Y) {
    if (Y <= 3200) {
        if (Y % 80 === 0) {
            return true;
        }
        if (Y % 40 === 0) {
            return false;
        }
    } else if (Y <= 9600) {
        if (Y % 1600 === 0) {
            return true;
        }
        if (Y % 80 === 0) {
            return false;
        }
    } else if (Y > 9600) {
        if (Y % 800 === 0) {
            return true;
        }
        if (Y % 80 === 0) {
            return false;
        }
    }
    if (Y % 20 === 0) {
        return true;
    }
    return false;
}

function isDarianGalileanLeapYearEuropa(Y) {
    if (Y === 0) {
        return false;
    }
    if (Y > 8000) {
        if (Y % 800 === 0) {
            return true;
        }
    } else if (Y > 3200) {
        if (Y % 1600 === 0) {
            return true;
        }
    }
    if (Y % 200 === 0) {
        return false;
    }
    if (Y % 20 === 0) {
        return true;
    }
    if (Y % 5 === 0) {
        return false;
    }
    if ((Y - 3) % 5 === 0) {
        return false;
    }
    return true;
}

function isDarianGalileanLeapYearGanymede(Y) {
    if (Y > 8400) {
        if (Y % 800 === 0) {
            return true;
        }
    } else if (Y > 3200) {
        if (Y % 1200 === 0) {
            return true;
        }
    }
    if (Y % 400 === 0) {
        return false;
    }
    if (Y % 80 === 0) {
        return true;
    }
    if (Y % 20 === 0) {
        return false;
    }
    if ((Y - 5) % 10 === 0) {
        return false;
    }
    return true;
}

function isDarianGalileanLeapYearCallisto(Y) {
    if (Y % 1200 === 0) {
        return true;
    }
    if (Y % 400 === 0) {
        return false;
    }
    if (Y % 80 === 0) {
        return true;
    }
    if (Y % 40 === 0) {
        return false;
    }
    if ((Y - 2) % 5 === 0) {
        return true;
    }
    if (Y % 5 === 0) {
        return true;
    }
    return false;
}

function getGalileanLeapYearResolver(bodyName, useDarianRules) {
    if (useDarianRules) {
        if (bodyName === 'Io') return isDarianGalileanLeapYearIo;
        if (bodyName === 'Eu') return isDarianGalileanLeapYearEuropa;
        if (bodyName === 'Gan') return isDarianGalileanLeapYearGanymede;
        if (bodyName === 'Cal') return isDarianGalileanLeapYearCallisto;
        return null;
    }

    if (bodyName === 'Io') return isGalileanLeapYearIo;
    if (bodyName === 'Eu') return isGalileanLeapYearEuropa;
    if (bodyName === 'Gan') return isGalileanLeapYearGanymede;
    if (bodyName === 'Cal') return isGalileanLeapYearCallisto;
    return null;
}

function getGalileanYearLength(bodyName, year, useDarianRules) {
    const leapYearResolver = getGalileanLeapYearResolver(bodyName, useDarianRules);
    if (!leapYearResolver) {
        return 0;
    }

    const isLeap = leapYearResolver(year);
    if (useDarianRules) {
        if (bodyName === 'Io' || bodyName === 'Cal') return isLeap ? 784 : 776;
        if (bodyName === 'Eu') return isLeap ? 776 : 768;
        if (bodyName === 'Gan') return isLeap ? 768 : 760;
        return 0;
    }

    if (bodyName === 'Gan') return isLeap ? 408 : 400;
    return isLeap ? 416 : 408;
}

function getGalileanMonthDaysArray(bodyName, year, useDarianRules) {
    const leapYearResolver = getGalileanLeapYearResolver(bodyName, useDarianRules);
    const isLeap = leapYearResolver ? leapYearResolver(year) : false;

    if (useDarianRules) {
        if (bodyName === 'Io' || bodyName === 'Cal') {
            return isLeap ? DARIAN_GALILEAN_IO_CALLISTO_MONTH_DAYS_LEAP : DARIAN_GALILEAN_IO_CALLISTO_MONTH_DAYS;
        }
        if (bodyName === 'Eu') {
            return isLeap ? DARIAN_GALILEAN_EUROPA_MONTH_DAYS_LEAP : DARIAN_GALILEAN_EUROPA_MONTH_DAYS;
        }
        if (bodyName === 'Gan') {
            return isLeap ? DARIAN_GALILEAN_GANYMEDE_MONTH_DAYS_LEAP : DARIAN_GALILEAN_GANYMEDE_MONTH_DAYS;
        }
        return '';
    }

    if (bodyName === 'Gan') {
        return isLeap ? GALILEAN_GANYMEDE_MONTH_DAYS_LEAP : GALILEAN_GANYMEDE_MONTH_DAYS_SHORT;
    }
    if (bodyName === 'Io' || bodyName === 'Eu' || bodyName === 'Cal') {
        return isLeap ? GALILEAN_IO_CALLISTO_MONTH_DAYS_LEAP : GALILEAN_IO_CALLISTO_MONTH_DAYS;
    }
    return '';
}

function getGalileanDate(currentDateTime, body) {
    const epochConfig = GALILEAN_EPOCHS[body];
    const epoch = createAdjustedDateTime(epochConfig);
    const circad = GALILEAN_CIRCAD_HOURS[body];
    const dayMilliseconds = circad * 60 * 60 * 1000;
    let daysSince = Math.floor((currentDateTime - epoch) / dayMilliseconds);
    const isNegative = daysSince < 0;
    daysSince = Math.abs(daysSince);

    let year = 2002; // starting year after the epoch
    let daysInYear = 0;
    while (true) {
        daysInYear = getGalileanYearLength(body, year, false);
        if (daysSince < daysInYear) {
            break;
        }
        daysSince -= daysInYear;
        year += isNegative ? -1 : 1;
    }

    if (isNegative) {
        daysSince = daysInYear - daysSince;
    }

    let remainingDays = daysSince;
    const daysInMonthsArray = getGalileanMonthDaysArray(body, year, false);

    let month = 0;
    while (remainingDays >= daysInMonthsArray[month]) {
        remainingDays -= daysInMonthsArray[month];
        month++;
    }

    const day = remainingDays + 1;
    const adjustedDays = isNegative ? -daysSince : daysSince;
    const dayOfWeek = GALILEAN_WEEKDAY_NAMES[(adjustedDays % 8 + 8) % 8];

    const output = day + ' ' + body + ' ' + GALILEAN_MONTH_NAMES[month] + ' ' + year + '\n' + body + ' ' + dayOfWeek;
    return { output, day, month, year, other: { body } };
}

function getDarianGalileanDate(currentDateTime, body) {
    const epoch = createAdjustedDateTime(DARIAN_GALILEAN_EPOCHS[body]);
    const circad = GALILEAN_CIRCAD_HOURS[body];
    const dayMilliseconds = circad * 60 * 60 * 1000;
    let daysSince = (currentDateTime - epoch) / dayMilliseconds;
    const isNegative = daysSince < 0;
    daysSince = Math.abs(daysSince);

    const dayOfWeek = GALILEAN_WEEKDAY_NAMES[Math.floor(daysSince % 8)];
    let year = 0;
    
    // Calculate the year and day remaining within the year
    while (true) {
        const daysInYear = getGalileanYearLength(body, year, true);
        
        // Adjust for negative years and decrement properly
        if (daysSince < daysInYear) {
            break;
        }
        daysSince -= daysInYear;
        year += isNegative ? -1 : 1;
    }

    if (isNegative) {
        year--;  // Properly decrement the year if going backwards
        daysSince = getGalileanYearLength(body, year, true) - daysSince;
    }

    let remainingDays = daysSince;
    const daysInMonthsArray = getGalileanMonthDaysArray(body, year, true);

    let month = 0;
    while (remainingDays >= daysInMonthsArray[month]) {
        remainingDays -= daysInMonthsArray[month];
        month++;
    }

    const day = Math.trunc(remainingDays) + 1;
    const output = `${day} ${body} ${DARIAN_MONTH_NAMES[month]} ${year}\n${body} ${dayOfWeek}`;
    return { output, day, month, year, other: { body } };
}


// --- Darian Titan calendar constants ---
const DARIAN_TITAN_EPOCH_CONFIG = { year: 1609, month: 3, day: 15, hour: 18, minute: 37, second: 32 };
const DARIAN_TITAN_CIRCAD_DAYS = 0.998068439;

function createDarianTitanMonthDays(isLeapYear) {
    const monthDays = Array(24).fill(28);
    monthDays[2] = 32;
    monthDays[8] = 32;
    monthDays[14] = 32;
    monthDays[20] = 32;
    if (isLeapYear) {
        monthDays[11] = 32;
        monthDays[23] = 32;
    }
    return monthDays;
}

const DARIAN_TITAN_MONTH_DAYS = createDarianTitanMonthDays(false);
const DARIAN_TITAN_MONTH_DAYS_LEAP = createDarianTitanMonthDays(true);

function getDarianTitanDate(currentDateTime, body) {
    function isDarianTitanLeapYear(Y) {
        if (Y % 400 === 0) {
            return false;
        }
        if (Y % 25 === 0) {
            return true;
        }
        return false;
    }

    const epoch = createAdjustedDateTime(DARIAN_TITAN_EPOCH_CONFIG);
    const titanDayMilliseconds = DARIAN_TITAN_CIRCAD_DAYS * 24 * 60 * 60 * 1000;
    let titanDaysSince = (currentDateTime - epoch) / titanDayMilliseconds;
    const isNegative = titanDaysSince < 0;
    titanDaysSince = Math.abs(titanDaysSince);

    const dayOfWeek = GALILEAN_WEEKDAY_NAMES[Math.floor(titanDaysSince % 8)];
    let year = 0;
    
    // Calculate the year and remaining days within the year
    while (true) {
        let daysInYear = isDarianTitanLeapYear(year) ? 696 : 688;
        
        if (titanDaysSince < daysInYear) {
            break;
        }

        titanDaysSince -= daysInYear;
        year += isNegative ? -1 : 1;
    }
    
    // Handle negative years and reverse time correctly
    if (isNegative) {
        year -= 1;  // Adjust for a full reverse year
        titanDaysSince = (isDarianTitanLeapYear(year) ? 696 : 688) - titanDaysSince;
    }

    // Calculate the month and day
    let remainingDays = titanDaysSince;
    const daysInMonthsArray = isDarianTitanLeapYear(year) ? DARIAN_TITAN_MONTH_DAYS_LEAP : DARIAN_TITAN_MONTH_DAYS;
    let month = 0;

    while (remainingDays >= daysInMonthsArray[month]) {
        remainingDays -= daysInMonthsArray[month];
        month++;
    }

    const day = Math.floor(remainingDays) + 1;

    const output = day + ' Ti ' + DARIAN_MONTH_NAMES[month] + ' ' + year + '\nTi ' + dayOfWeek;
    return { output, day, month, year, dayOfWeek };
}

// --- Yuga Cycle ---
const YUGA_DVAPARA_SANDHYAMSA = 'Dvapara Yuga: Sandhyamsa';
const YUGA_KALI_SANDHYA = 'Kali Yuga: Sandhya';

function getYugaCycle(currentDateTime) {
    const kaliAhargana = getKaliAhargana(currentDateTime);
    const output = kaliAhargana < 1 ? YUGA_DVAPARA_SANDHYAMSA : YUGA_KALI_SANDHYA;
    return { output };
}

// --- Sothic Cycle ---
const SOTHIC_ANCHOR_CONFIG = { year: 139, month: 7, day: 19 };

function getSothicCycle(currentDateTime) {
    const anchor = createAdjustedDateTime(SOTHIC_ANCHOR_CONFIG);
    const daysSinceStart = differenceInDays(currentDateTime, anchor);
    const totalYears = Math.floor(daysSinceStart / 365.25);

    const currentCycle = Math.floor(totalYears / 1460) + 3;
    let yearsInCurrentCycle = totalYears % 1460;
    if (yearsInCurrentCycle < 0) {
        yearsInCurrentCycle += 1460;
    }

    const output = 'Cycle: ' + currentCycle + ' | Year: ' + (yearsInCurrentCycle + 1);
    return { output, year: yearsInCurrentCycle, other: { cycle: currentCycle } };
}

// --- Olympiad ---
const OLYMPIAD_1_START_CONFIG = { year: -775, month: 7, day: 24 };

function getOlympiad(currentDateTime) {
    const julianDate = getApproxJulianDate(currentDateTime);
    const olympiad1 = getApproxJulianDate(createAdjustedDateTime(OLYMPIAD_1_START_CONFIG));

    const daysSinceOlympiad1 = differenceInDays(julianDate, olympiad1);
    const yearsSinceOlympiad1 = daysSinceOlympiad1 / 365.2425;

    let olympiad, yearInOlympiad;

    if (yearsSinceOlympiad1 >= 0) {
        olympiad = Math.floor(yearsSinceOlympiad1 / 4) + 1;
        yearInOlympiad = Math.floor(yearsSinceOlympiad1 % 4) + 1;
    } else {
        const olympiadOffset = Math.ceil(Math.abs(yearsSinceOlympiad1) / 4);
        olympiad = 1 - olympiadOffset;
        const yearOffset = (4 - Math.floor(Math.abs(yearsSinceOlympiad1) % 4)) % 4;
        yearInOlympiad = yearOffset === 0 ? 4 : yearOffset;
    }

    const output = olympiad + ' | Year: ' + yearInOlympiad;
    return { output, year: yearInOlympiad, other: { olympiad } };
}


// --- Tzolk'in ---
const TZOLKIN_DAY_NAMES = [
    "Imix", "Ik'", "Ak'b'al", "K'an", "Chikchan",
    "Kimi", "Manik'", "Lamat", "Muluk", "Ok",
    "Chuwen", "Eb'", "B'en", "Ix", "Men",
    "K'ib'", "Kab'an", "Etz'nab'", "Kawak", "Ajaw"
];
function getTzolkinDate(currentDateTime) {
    const totalDays = Math.floor(differenceInDays(currentDateTime, getMayanEpoch()));
    const adjustedDays = (totalDays % 260 + 260) % 260;
    const dayNumber = (4 + adjustedDays) % 13 || 13;
    const monthIndex = (19 + adjustedDays) % 20;

    const output = `${dayNumber} ${TZOLKIN_DAY_NAMES[monthIndex]}`;
    return { output, day: dayNumber, month: monthIndex };
}

// --- Lord of the Night ---
const LORD_OF_NIGHT_EPOCH_CONFIG = { timezone: MAYAN_TZ, year: 2012, month: 12, day: 21 };

function getLordOfTheNight(currentDateTime) {
    const epoch = createAdjustedDateTime(LORD_OF_NIGHT_EPOCH_CONFIG);
    const daysSince = differenceInDays(currentDateTime, epoch);
    let lord = Math.floor(((daysSince % 9) + 9) % 9);
    if (lord === 0) {
        lord = 9;
    }
    let Y = Math.floor(((daysSince % 7) + 7) % 7);
    if (Y === 0) {
        Y = 7;
    }
    var output = 'G' + lord + ' | Y' + Y;
    return { output: output, other: { lord: lord, Y: Y } };
}

// --- Pawukon calendar constants ---
const PAWUKON_TZ = 'UTC+08:00';
const PAWUKON_RECENT_EPOCH_CONFIG = { timezone: PAWUKON_TZ, year: 2020, month: 7, day: 5 };

const PAWUKON_DASAWARA = ['Sri', 'Pati', 'Raja', 'Manuh', 'Duka', 'Manusa', 'Raksasa', 'Suka', 'Dewa', 'Pandita'];
const PAWUKON_SANGAWARA = ['Dangu', 'Jangur', 'Gigis', 'Nohan', 'Ogan', 'Erangan', 'Urungan', 'Tulus', 'Dadi'];
const PAWUKON_ASTAWARA = ['Sri', 'Indra', 'Guru', 'Yama', 'Ludra', 'Brahma', 'Kala', 'Uma'];
const PAWUKON_SAPTAWARA = ['Redite', 'Soma', 'Anggara', 'Buda', 'Wraspati', 'Sukra', 'Saniscara'];
const PAWUKON_SADWARA = ['Tungleh', 'Aryang', 'Urukung', 'Paniron', 'Was', 'Maulu'];
const PAWUKON_PANCAWARA = ['Paing', 'Pon', 'Wage', 'Keliwon', 'Umanis'];
const PAWUKON_CATURWARA = ['Sri', 'Laba', 'Jaya', 'Menala'];
const PAWUKON_TRIWARA = ['Pasah', 'Beteng', 'Kajeng'];
const PAWUKON_DWIWARA = ['Menga', 'Pepet'];
const PAWUKON_EKAWARA = ['Luang '];
const PAWUKON_WEEK_NAMES = [
    'Sinta', 'Landep', 'Ukir', 'Kulantir', 'Taulu', 'Gumbreg', 'Wariga', 'Warigadian', 'Julungwangi', 'Sungsang',
    'Dunggulan', 'Kuningan', 'Langkir', 'Medangsia', 'Pujut', 'Pahang', 'Krulut', 'Merakih', 'Tambir', 'Medangkungan',
    'Matal', 'Uye', 'Menail', 'Parangbakat', 'Bala', 'Ugu', 'Wayang', 'Kelawu', 'Dukut', 'Watugunung'
];

const PAWUKON_URIP_5 = [9, 7, 4, 8, 5];
const PAWUKON_URIP_7 = [5, 4, 3, 7, 8, 6, 9];
const PAWUKON_URIP_10 = [5, 2, 8, 6, 4, 7, 10, 3, 9, 1];

function normalizePawukonEpoch(currentDateTime) {
    const baseEpoch = createAdjustedDateTime(PAWUKON_RECENT_EPOCH_CONFIG);
    if (baseEpoch.getTime() <= currentDateTime.getTime()) {
        return baseEpoch;
    }

    const stepMilliseconds = 210 * 24 * 60 * 60 * 1000;
    const millisecondsBehind = baseEpoch.getTime() - currentDateTime.getTime();
    const cyclesToStepBack = Math.ceil(millisecondsBehind / stepMilliseconds);
    const normalizedEpoch = createAdjustedDateTime({
        currentDateTime: baseEpoch,
        nullHourMinute: false,
        nullSeconds: false,
    });
    addDay(normalizedEpoch, -(cyclesToStepBack * 210));
    return normalizedEpoch;
}

// Returns a formatted Pawukon calendar (WITA) date
function getPawukonCalendarDate(currentDateTime) {
    const normalizedEpoch = normalizePawukonEpoch(currentDateTime);

    let dayOfWeek1 = '';
    let dayOfWeek2 = '';
    let dayOfWeek3 = '';
    let dayOfWeek4 = '';
    let dayOfWeek5 = '';
    let dayOfWeek6 = '';
    let dayOfWeek7 = '';
    let dayOfWeek8 = '';
    let dayOfWeek9 = '';
    let dayOfWeek10 = '';

    const daysSinceEpoch = Math.floor(differenceInDays(currentDateTime, normalizedEpoch));
    let daysSinceEpoch4_8 = daysSinceEpoch;
    let daysSinceEpoch9 = daysSinceEpoch-3;

    dayOfWeek3 = PAWUKON_TRIWARA[daysSinceEpoch % 3];
    dayOfWeek5 = PAWUKON_PANCAWARA[daysSinceEpoch % 5];
    dayOfWeek6 = PAWUKON_SADWARA[daysSinceEpoch % 6];
    dayOfWeek7 = PAWUKON_SAPTAWARA[daysSinceEpoch % 7];

    if ((daysSinceEpoch===71) || (daysSinceEpoch===72)) {
        daysSinceEpoch4_8 = 70;
    }
    if (daysSinceEpoch4_8>72) {
        daysSinceEpoch4_8 -= 2;
    }
    dayOfWeek4 = PAWUKON_CATURWARA[daysSinceEpoch4_8 % 4];
    dayOfWeek8 = PAWUKON_ASTAWARA[daysSinceEpoch4_8 % 8];

    if (daysSinceEpoch9<0) {
        daysSinceEpoch9 = 0;
    }
    dayOfWeek9 = PAWUKON_SANGAWARA[daysSinceEpoch9 % 9];

    let urip = PAWUKON_URIP_5[daysSinceEpoch % 5] + PAWUKON_URIP_7[daysSinceEpoch % 7] + 1;
    if (urip > 10) {
        urip -= 10;
    }

    for (let i = 0; i < PAWUKON_URIP_10.length; i++) {
        if (PAWUKON_URIP_10[i] === urip) {
            dayOfWeek10 = PAWUKON_DASAWARA[i];
            break;
        }
    }

    if (urip % 2 === 0) {
        dayOfWeek1 = PAWUKON_EKAWARA[0];
        dayOfWeek2 = PAWUKON_DWIWARA[1];
    } else {
        dayOfWeek1 = '';
        dayOfWeek2 = PAWUKON_DWIWARA[0];
    }

    const weekName = PAWUKON_WEEK_NAMES[(Math.floor(daysSinceEpoch / 7) % 30)];

    const output = `${dayOfWeek1}${dayOfWeek2} ${dayOfWeek3} ${dayOfWeek4} ${dayOfWeek5} ${dayOfWeek6} ${dayOfWeek7} ${dayOfWeek8} ${dayOfWeek9} ${dayOfWeek10}\nWeek Name: ${weekName}`;
    return { output, other: { weekName } };
}