//|-------------------------|
//|     Other Calendars     |
//|-------------------------|

// A set of functions for calculating dates in the Other Calendars and Extraterrestrial Calendars grid sections (implementation file is shared).

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

// Sourced from otherTime.js (IO_EPOCH/EUROPA_EPOCH/GANYMEDE_EPOCH/CALLISTO_EPOCH and their
// circad hours) so the calendar and prime-meridian-time implementations can't drift apart.
const GALILEAN_EPOCHS = { Io: IO_EPOCH, Eu: EUROPA_EPOCH, Gan: GANYMEDE_EPOCH, Cal: CALLISTO_EPOCH };

const GALILEAN_CIRCAD_HOURS = { Io: IO_CIRCAD_HOURS, Eu: EUROPA_CIRCAD_HOURS, Gan: GANYMEDE_CIRCAD_HOURS, Cal: CALLISTO_CIRCAD_HOURS };

// The Darian-Galilean calendars are anchored at Gangale's 1609 telescopic epochs:
//   Io 1609-03-13 05:29:26, Eu 1609-03-12 01:19:41, Gan 1609-03-11 09:52:12, Cal 1609-03-17 20:57:24 (UTC).
// Gangale computed those and the 2001/2002 opposition epochs (the clock anchors above) independently
// from ephemeris data, so they are NOT a whole number of his rounded circads apart (Io 162123.98,
// Eu 161472.03, Gan 160159.99, Cal 162696.99 circads). The clock epoch is authoritative for the
// circad boundary, so the calendar counts circads from it plus these offsets (the epoch differences
// rounded to the nearest circad), keeping day rollovers exactly on prime-meridian midnight while
// preserving Gangale's 1609 dates ("1 <body> Sagittarius 0") to within half a circad.
const DARIAN_GALILEAN_CIRCAD_OFFSETS = { Io: 162124, Eu: 161472, Gan: 160160, Cal: 162697 };

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
        throw new Error(`Unsupported Galilean body: ${bodyName}`);
    }

    if (bodyName === 'Gan') {
        return isLeap ? GALILEAN_GANYMEDE_MONTH_DAYS_LEAP : GALILEAN_GANYMEDE_MONTH_DAYS_SHORT;
    }
    if (bodyName === 'Io' || bodyName === 'Eu' || bodyName === 'Cal') {
        return isLeap ? GALILEAN_IO_CALLISTO_MONTH_DAYS_LEAP : GALILEAN_IO_CALLISTO_MONTH_DAYS;
    }
    throw new Error(`Unsupported Galilean body: ${bodyName}`);
}

function getGalileanDate(currentDateTime, body) {
    const epochConfig = GALILEAN_EPOCHS[body];
    const epoch = createAdjustedDateTime(epochConfig);
    const circad = GALILEAN_CIRCAD_HOURS[body];
    const dayMilliseconds = circad * 60 * 60 * 1000;
    let daysSince = Math.floor((currentDateTime - epoch) / dayMilliseconds);

    // Resolve the year in either direction, leaving daysSince as the 0-based day index within it
    let year = 2002; // starting year at the epoch
    let daysInYear = getGalileanYearLength(body, year, false);
    while (daysSince < 0) {
        year--;
        daysInYear = getGalileanYearLength(body, year, false);
        daysSince += daysInYear;
    }
    while (daysSince >= daysInYear) {
        daysSince -= daysInYear;
        year++;
        daysInYear = getGalileanYearLength(body, year, false);
    }

    let remainingDays = daysSince;
    const daysInMonthsArray = getGalileanMonthDaysArray(body, year, false);

    let month = 0;
    while (remainingDays >= daysInMonthsArray[month]) {
        remainingDays -= daysInMonthsArray[month];
        month++;
    }

    const day = remainingDays + 1;
    // Every year length is a multiple of 8 circads, so the within-year index preserves the continuous week cycle
    const dayOfWeek = GALILEAN_WEEKDAY_NAMES[daysSince % 8];

    const output = day + ' ' + body + ' ' + GALILEAN_MONTH_NAMES[month] + ' ' + year + '\n' + body + ' ' + dayOfWeek;
    return { output, day, month, year, other: { body } };
}

function getDarianGalileanDate(currentDateTime, body) {
    const epoch = createAdjustedDateTime(GALILEAN_EPOCHS[body]);
    const circad = GALILEAN_CIRCAD_HOURS[body];
    const dayMilliseconds = circad * 60 * 60 * 1000;
    let daysSince = Math.floor((currentDateTime - epoch) / dayMilliseconds) + DARIAN_GALILEAN_CIRCAD_OFFSETS[body];

    // Resolve the year in either direction, leaving daysSince as the 0-based day index within it
    let year = 0;
    let daysInYear = getGalileanYearLength(body, year, true);
    while (daysSince < 0) {
        year--;
        daysInYear = getGalileanYearLength(body, year, true);
        daysSince += daysInYear;
    }
    while (daysSince >= daysInYear) {
        daysSince -= daysInYear;
        year++;
        daysInYear = getGalileanYearLength(body, year, true);
    }

    let remainingDays = daysSince;
    const daysInMonthsArray = getGalileanMonthDaysArray(body, year, true);

    let month = 0;
    while (remainingDays >= daysInMonthsArray[month]) {
        remainingDays -= daysInMonthsArray[month];
        month++;
    }

    const day = remainingDays + 1;
    // Every year length is a multiple of 8 circads, so the within-year index preserves the continuous week cycle
    const dayOfWeek = GALILEAN_WEEKDAY_NAMES[daysSince % 8];
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
    let titanDaysSince = Math.floor((currentDateTime - epoch) / titanDayMilliseconds);

    // Resolve the year in either direction, leaving titanDaysSince as the 0-based day index within it
    let year = 0;
    let daysInYear = isDarianTitanLeapYear(year) ? 696 : 688;
    while (titanDaysSince < 0) {
        year--;
        daysInYear = isDarianTitanLeapYear(year) ? 696 : 688;
        titanDaysSince += daysInYear;
    }
    while (titanDaysSince >= daysInYear) {
        titanDaysSince -= daysInYear;
        year++;
        daysInYear = isDarianTitanLeapYear(year) ? 696 : 688;
    }

    // Calculate the month and day
    let remainingDays = titanDaysSince;
    const daysInMonthsArray = isDarianTitanLeapYear(year) ? DARIAN_TITAN_MONTH_DAYS_LEAP : DARIAN_TITAN_MONTH_DAYS;
    let month = 0;

    while (remainingDays >= daysInMonthsArray[month]) {
        remainingDays -= daysInMonthsArray[month];
        month++;
    }

    const day = remainingDays + 1;
    // Every year length is a multiple of 8 circads, so the within-year index preserves the continuous week cycle
    const dayOfWeek = GALILEAN_WEEKDAY_NAMES[titanDaysSince % 8];

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

// Waras with a plain N-day cycle (Balinese Pawukon "weeks" of length N).
const PAWUKON_SIMPLE_WARAS = [
    { length: 3, table: PAWUKON_TRIWARA },
    { length: 5, table: PAWUKON_PANCAWARA },
    { length: 6, table: PAWUKON_SADWARA },
    { length: 7, table: PAWUKON_SAPTAWARA },
];

// Caturwara (4-day) and Astawara (8-day) share a day count that "freezes" for two
// days (71-72 of the 210-day cycle) and then catches up by 2
// in the traditional Pawukon rules, not an indexing bug.
const PAWUKON_4_8_ANOMALY_FREEZE_DAYS = [71, 72];
const PAWUKON_4_8_ANOMALY_FROZEN_VALUE = 70;
const PAWUKON_4_8_ANOMALY_CATCHUP_AFTER = 72;
const PAWUKON_4_8_WARAS = [
    { length: 4, table: PAWUKON_CATURWARA },
    { length: 8, table: PAWUKON_ASTAWARA },
];

function getPawukonAdjustedDayCount(daysSinceEpoch) {
    if (PAWUKON_4_8_ANOMALY_FREEZE_DAYS.includes(daysSinceEpoch)) {
        return PAWUKON_4_8_ANOMALY_FROZEN_VALUE;
    }
    if (daysSinceEpoch > PAWUKON_4_8_ANOMALY_CATCHUP_AFTER) {
        return daysSinceEpoch - 2;
    }
    return daysSinceEpoch;
}

// Returns a formatted Pawukon calendar (WITA) date
function getPawukonCalendarDate(currentDateTime) {
    const normalizedEpoch = normalizePawukonEpoch(currentDateTime);
    const daysSinceEpoch = Math.floor(differenceInDays(currentDateTime, normalizedEpoch));

    const [triwaraName, pancawaraName, sadwaraName, saptawaraName] =
        PAWUKON_SIMPLE_WARAS.map(({ length, table }) => table[daysSinceEpoch % length]);

    const daysSinceEpoch4_8 = getPawukonAdjustedDayCount(daysSinceEpoch);
    const [caturwaraName, astawaraName] =
        PAWUKON_4_8_WARAS.map(({ length, table }) => table[daysSinceEpoch4_8 % length]);

    const daysSinceEpoch9 = Math.max(0, daysSinceEpoch - 3);
    const sangawaraName = PAWUKON_SANGAWARA[daysSinceEpoch9 % 9];

    let urip = PAWUKON_URIP_5[daysSinceEpoch % 5] + PAWUKON_URIP_7[daysSinceEpoch % 7] + 1;
    if (urip > 10) {
        urip -= 10;
    }
    const dasawaraIndex = PAWUKON_URIP_10.indexOf(urip);
    const dasawaraName = dasawaraIndex === -1 ? '' : PAWUKON_DASAWARA[dasawaraIndex];

    const isEven = urip % 2 === 0;
    const ekawaraName = isEven ? PAWUKON_EKAWARA[0] : '';
    const dwiwaraName = PAWUKON_DWIWARA[isEven ? 1 : 0];

    const weekName = PAWUKON_WEEK_NAMES[(Math.floor(daysSinceEpoch / 7) % 30)];
    const output = `${ekawaraName}${dwiwaraName} ${triwaraName} ${caturwaraName} ${pancawaraName} ${sadwaraName} ${saptawaraName} ${astawaraName} ${sangawaraName} ${dasawaraName}\nWeek Name: ${weekName}`;
    return { output, other: { weekName } };
}

// --- Galactic Tick Day ---
function getGalacticTickDay(currentDateTime) {
    const tickEpoch = createAdjustedDateTime({ timezone: 'UTC+00:00', year: 1608, month: 10, day: 2 });
    const daysSinceEpoch = differenceInDays(currentDateTime, tickEpoch);
    const tickNumber = Math.floor(daysSinceEpoch / 634.114583293);
    const output = toOrdinalNumber(tickNumber);
    return { output, other: { tick: tickNumber } };
}

const JAPANESE_ERA_DATA = [
    { name: 'Taihō', japanese: '大宝', startYear: 701, startDate: '701-05-03' },
    { name: 'Keiun', japanese: '慶雲', startYear: 704, startDate: '704-06-16' },
    { name: 'Wadō', japanese: '和銅', startYear: 708, startDate: '708-02-07' },
    { name: 'Reiki', japanese: '霊亀', startYear: 715, startDate: '715-10-03' },
    { name: 'Yōrō', japanese: '養老', startYear: 717, startDate: '717-12-24' },
    { name: 'Jinki', japanese: '神亀', startYear: 724, startDate: '724-03-03' },
    { name: 'Tenpyō', japanese: '天平', startYear: 729, startDate: '729-09-02' },
    { name: 'Tenpyō-kanpō', japanese: '天平感宝', startYear: 749, startDate: '749-05-04' },
    { name: 'Tenpyō-shōhō', japanese: '天平勝宝', startYear: 749, startDate: '749-08-19' },
    { name: 'Tenpyō-hōji', japanese: '天平宝字', startYear: 757, startDate: '757-09-06' },
    { name: 'Tenpyō-jingo', japanese: '天平神護', startYear: 765, startDate: '765-02-01' },
    { name: 'Jingo-keiun', japanese: '神護景雲', startYear: 767, startDate: '767-09-13' },
    { name: 'Hōki', japanese: '宝亀', startYear: 770, startDate: '770-10-23' },
    { name: 'Ten\'ō', japanese: '天応', startYear: 781, startDate: '781-01-30' },
    { name: 'Enryaku', japanese: '延暦', startYear: 782, startDate: '782-09-30' },
    { name: 'Daidō', japanese: '大同', startYear: 806, startDate: '806-06-08' },
    { name: 'Kōnin', japanese: '弘仁', startYear: 810, startDate: '810-10-20' },
    { name: 'Tenchō', japanese: '天長', startYear: 824, startDate: '824-02-08' },
    { name: 'Jōwa', japanese: '承和', startYear: 834, startDate: '834-02-14' },
    { name: 'Kashō', japanese: '嘉祥', startYear: 848, startDate: '848-07-16' },
    { name: 'Ninju', japanese: '仁寿', startYear: 851, startDate: '851-06-01' },
    { name: 'Saikō', japanese: '斉衡', startYear: 854, startDate: '854-12-23' },
    { name: 'Ten\'an', japanese: '天安', startYear: 857, startDate: '857-03-20' },
    { name: 'Jōgan', japanese: '貞観', startYear: 859, startDate: '859-05-20' },
    { name: 'Gangyō', japanese: '元慶', startYear: 877, startDate: '877-06-01' },
    { name: 'Ninna', japanese: '仁和', startYear: 885, startDate: '885-03-11' },
    { name: 'Kanpyō', japanese: '寛平', startYear: 889, startDate: '889-05-30' },
    { name: 'Shōtai', japanese: '昌泰', startYear: 898, startDate: '898-05-20' },
    { name: 'Engi', japanese: '延喜', startYear: 901, startDate: '901-08-31' },
    { name: 'Enchō', japanese: '延長', startYear: 923, startDate: '923-05-29' },
    { name: 'Jōhei', japanese: '承平', startYear: 931, startDate: '931-05-16' },
    { name: 'Tengyō', japanese: '天慶', startYear: 938, startDate: '938-06-22' },
    { name: 'Tenryaku', japanese: '天暦', startYear: 947, startDate: '947-05-15' },
    { name: 'Tentoku', japanese: '天徳', startYear: 957, startDate: '957-11-21' },
    { name: 'Ōwa', japanese: '応和', startYear: 961, startDate: '961-03-05' },
    { name: 'Kōhō', japanese: '康保', startYear: 964, startDate: '964-08-19' },
    { name: 'Anna', japanese: '安和', startYear: 968, startDate: '968-09-08' },
    { name: 'Tenroku', japanese: '天禄', startYear: 970, startDate: '970-05-03' },
    { name: 'Ten\'en', japanese: '天延', startYear: 974, startDate: '974-01-16' },
    { name: 'Jōgen', japanese: '貞元', startYear: 976, startDate: '976-08-11' },
    { name: 'Tengen', japanese: '天元', startYear: 978, startDate: '978-12-31' },
    { name: 'Eikan', japanese: '永観', startYear: 983, startDate: '983-05-29' },
    { name: 'Kanna', japanese: '寛和', startYear: 985, startDate: '985-05-19' },
    { name: 'Eien', japanese: '永延', startYear: 987, startDate: '987-05-05' },
    { name: 'Eiso', japanese: '永祚', startYear: 989, startDate: '989-09-10' },
    { name: 'Shōryaku', japanese: '正暦', startYear: 990, startDate: '990-11-26' },
    { name: 'Chōtoku', japanese: '長徳', startYear: 995, startDate: '995-03-25' },
    { name: 'Chōhō', japanese: '長保', startYear: 999, startDate: '999-02-01' },
    { name: 'Kankō', japanese: '寛弘', startYear: 1004, startDate: '1004-08-08' },
    { name: 'Chōwa', japanese: '長和', startYear: 1012, startDate: '1012-01-01' },
    { name: 'Kannin', japanese: '寛仁', startYear: 1017, startDate: '1017-05-21' },
    { name: 'Jian', japanese: '治安', startYear: 1021, startDate: '1021-03-17' },
    { name: 'Manju', japanese: '万寿', startYear: 1024, startDate: '1024-08-19' },
    { name: 'Chōgen', japanese: '長元', startYear: 1028, startDate: '1028-08-18' },
    { name: 'Chōryaku', japanese: '長暦', startYear: 1037, startDate: '1037-05-09' },
    { name: 'Chōkyū', japanese: '長久', startYear: 1040, startDate: '1040-12-16' },
    { name: 'Kantoku', japanese: '寛徳', startYear: 1044, startDate: '1044-12-16' },
    { name: 'Eishō', japanese: '永承', startYear: 1046, startDate: '1046-05-22' },
    { name: 'Tengi', japanese: '天喜', startYear: 1053, startDate: '1053-02-02' },
    { name: 'Kōhei', japanese: '康平', startYear: 1058, startDate: '1058-09-19' },
    { name: 'Jiryaku', japanese: '治暦', startYear: 1065, startDate: '1065-09-04' },
    { name: 'Enkyū', japanese: '延久', startYear: 1069, startDate: '1069-05-06' },
    { name: 'Jōhō', japanese: '承保', startYear: 1074, startDate: '1074-09-16' },
    { name: 'Jōryaku', japanese: '承暦', startYear: 1077, startDate: '1077-12-05' },
    { name: 'Eihō', japanese: '永保', startYear: 1081, startDate: '1081-03-22' },
    { name: 'Ōtoku', japanese: '応徳', startYear: 1084, startDate: '1084-03-15' },
    { name: 'Kanji', japanese: '寛治', startYear: 1087, startDate: '1087-05-11' },
    { name: 'Kahō', japanese: '嘉保', startYear: 1094, startDate: '1095-01-23' },
    { name: 'Eichō', japanese: '永長', startYear: 1096, startDate: '1097-01-03' },
    { name: 'Jōtoku', japanese: '承徳', startYear: 1097, startDate: '1097-12-27' },
    { name: 'Kōwa', japanese: '康和', startYear: 1099, startDate: '1099-09-15' },
    { name: 'Chōji', japanese: '長治', startYear: 1104, startDate: '1104-03-08' },
    { name: 'Kajō', japanese: '嘉承', startYear: 1106, startDate: '1106-05-13' },
    { name: 'Tennin', japanese: '天仁', startYear: 1108, startDate: '1108-09-09' },
    { name: 'Ten\'ei', japanese: '天永', startYear: 1110, startDate: '1110-07-31' },
    { name: 'Eikyū', japanese: '永久', startYear: 1113, startDate: '1113-08-25' },
    { name: 'Gen\'ei', japanese: '元永', startYear: 1118, startDate: '1118-04-25' },
    { name: 'Hōan', japanese: '保安', startYear: 1120, startDate: '1120-05-09' },
    { name: 'Tenji', japanese: '天治', startYear: 1124, startDate: '1124-05-18' },
    { name: 'Daiji', japanese: '大治', startYear: 1126, startDate: '1126-02-15' },
    { name: 'Tenshō', japanese: '天承', startYear: 1131, startDate: '1131-02-28' },
    { name: 'Chōshō', japanese: '長承', startYear: 1132, startDate: '1132-09-21' },
    { name: 'Hōen', japanese: '保延', startYear: 1135, startDate: '1135-06-10' },
    { name: 'Eiji', japanese: '永治', startYear: 1141, startDate: '1141-08-13' },
    { name: 'Kōji', japanese: '康治', startYear: 1142, startDate: '1142-05-25' },
    { name: 'Ten\'yō', japanese: '天養', startYear: 1144, startDate: '1144-03-28' },
    { name: 'Kyūan', japanese: '久安', startYear: 1145, startDate: '1145-08-12' },
    { name: 'Ninpei', japanese: '仁平', startYear: 1151, startDate: '1151-02-14' },
    { name: 'Kyūju', japanese: '久寿', startYear: 1154, startDate: '1154-12-04' },
    { name: 'Hōgen', japanese: '保元', startYear: 1156, startDate: '1156-05-18' },
    { name: 'Heiji', japanese: '平治', startYear: 1159, startDate: '1159-05-09' },
    { name: 'Eiryaku', japanese: '永暦', startYear: 1160, startDate: '1160-02-18' },
    { name: 'Ōhō', japanese: '応保', startYear: 1161, startDate: '1161-09-24' },
    { name: 'Chōkan', japanese: '長寛', startYear: 1163, startDate: '1163-05-04' },
    { name: 'Eiman', japanese: '永万', startYear: 1165, startDate: '1165-07-14' },
    { name: 'Nin\'an', japanese: '仁安', startYear: 1166, startDate: '1166-09-23' },
    { name: 'Kaō', japanese: '嘉応', startYear: 1169, startDate: '1169-05-06' },
    { name: 'Jōan', japanese: '承安', startYear: 1171, startDate: '1171-05-27' },
    { name: 'Angen', japanese: '安元', startYear: 1175, startDate: '1175-08-16' },
    { name: 'Jishō', japanese: '治承', startYear: 1177, startDate: '1177-08-29' },
    { name: 'Yōwa', japanese: '養和', startYear: 1181, startDate: '1181-08-25' },
    { name: 'Juei', japanese: '寿永', startYear: 1182, startDate: '1182-06-29' },
    { name: 'Juei', japanese: '寿永', startYear: 1183, startDate: '1183-01-01' },
    { name: 'Genryaku', japanese: '元暦', startYear: 1184, startDate: '1184-05-27' },
    { name: 'Bunji', japanese: '文治', startYear: 1185, startDate: '1185-09-09' },
    { name: 'Kenkyū', japanese: '建久', startYear: 1190, startDate: '1190-05-16' },
    { name: 'Shōji', japanese: '正治', startYear: 1199, startDate: '1199-05-23' },
    { name: 'Kennin', japanese: '建仁', startYear: 1201, startDate: '1201-03-19' },
    { name: 'Genkyū', japanese: '元久', startYear: 1204, startDate: '1204-03-23' },
    { name: 'Ken\'ei', japanese: '建永', startYear: 1206, startDate: '1206-06-05' },
    { name: 'Jōgen', japanese: '承元', startYear: 1207, startDate: '1207-11-16' },
    { name: 'Kenryaku', japanese: '建暦', startYear: 1211, startDate: '1211-04-23' },
    { name: 'Kempo', japanese: '建保', startYear: 1213, startDate: '1214-01-18' },
    { name: 'Jōkyū', japanese: '承久', startYear: 1219, startDate: '1219-05-27' },
    { name: 'Jōō', japanese: '貞応', startYear: 1222, startDate: '1222-05-25' },
    { name: 'Gennin', japanese: '元仁', startYear: 1224, startDate: '1224-12-31' },
    { name: 'Karoku', japanese: '嘉禄', startYear: 1225, startDate: '1225-05-28' },
    { name: 'Antei', japanese: '安貞', startYear: 1227, startDate: '1228-01-18' },
    { name: 'Kangi', japanese: '寛喜', startYear: 1229, startDate: '1229-03-31' },
    { name: 'Jōei', japanese: '貞永', startYear: 1232, startDate: '1232-04-23' },
    { name: 'Tenpuku', japanese: '天福', startYear: 1233, startDate: '1233-05-25' },
    { name: 'Bunryaku', japanese: '文暦', startYear: 1234, startDate: '1234-11-27' },
    { name: 'Katei', japanese: '嘉禎', startYear: 1235, startDate: '1235-11-01' },
    { name: 'Ryakunin', japanese: '暦仁', startYear: 1238, startDate: '1238-12-30' },
    { name: 'En\'ō', japanese: '延応', startYear: 1239, startDate: '1239-03-13' },
    { name: 'Ninji', japanese: '仁治', startYear: 1240, startDate: '1240-08-05' },
    { name: 'Kangen', japanese: '寛元', startYear: 1243, startDate: '1243-03-18' },
    { name: 'Hōji', japanese: '宝治', startYear: 1247, startDate: '1247-04-05' },
    { name: 'Kenchō', japanese: '建長', startYear: 1249, startDate: '1249-05-02' },
    { name: 'Kōgen', japanese: '康元', startYear: 1256, startDate: '1256-10-24' },
    { name: 'Shōka', japanese: '正嘉', startYear: 1257, startDate: '1257-03-31' },
    { name: 'Shōgen', japanese: '正元', startYear: 1259, startDate: '1259-04-20' },
    { name: 'Bun\'ō', japanese: '文応', startYear: 1260, startDate: '1260-05-24' },
    { name: 'Kōchō', japanese: '弘長', startYear: 1261, startDate: '1261-03-22' },
    { name: 'Bun\'ei', japanese: '文永', startYear: 1264, startDate: '1264-03-27' },
    { name: 'Kenji', japanese: '建治', startYear: 1275, startDate: '1275-05-22' },
    { name: 'Kōan', japanese: '弘安', startYear: 1278, startDate: '1278-03-23' },
    { name: 'Shōō', japanese: '正応', startYear: 1288, startDate: '1288-05-29' },
    { name: 'Einin', japanese: '永仁', startYear: 1293, startDate: '1293-09-06' },
    { name: 'Shōan', japanese: '正安', startYear: 1299, startDate: '1299-05-25' },
    { name: 'Kengen', japanese: '乾元', startYear: 1302, startDate: '1302-12-10' },
    { name: 'Kagen', japanese: '嘉元', startYear: 1303, startDate: '1303-09-16' },
    { name: 'Tokuji', japanese: '徳治', startYear: 1306, startDate: '1307-01-18' },
    { name: 'Enkyō', japanese: '延慶', startYear: 1308, startDate: '1308-11-22' },
    { name: 'Ōchō', japanese: '応長', startYear: 1311, startDate: '1311-05-17' },
    { name: 'Shōwa', japanese: '正和', startYear: 1312, startDate: '1312-04-27' },
    { name: 'Bunpō', japanese: '文保', startYear: 1317, startDate: '1317-03-16' },
    { name: 'Gen\'ō', japanese: '元応', startYear: 1319, startDate: '1319-05-18' },
    { name: 'Genkō', japanese: '元亨', startYear: 1321, startDate: '1321-03-22' },
    { name: 'Shōchū', japanese: '正中', startYear: 1324, startDate: '1324-12-25' },
    { name: 'Karyaku', japanese: '嘉暦', startYear: 1326, startDate: '1326-05-28' },
    { name: 'Gentoku', japanese: '元徳', startYear: 1329, startDate: '1329-09-22' },
    { name: 'Genkō', japanese: '元弘', startYear: 1331, startDate: '1331-09-11' },
    { name: 'Shōkyō', japanese: '正慶', startYear: 1332, startDate: '1332-05-23' },
    { name: 'Kenmu', japanese: '建武', startYear: 1334, startDate: '1334-03-05' },
    { name: 'Engen', japanese: '延元', startYear: 1336, startDate: '1336-04-11' },
    { name: 'Kenmu', japanese: '建武', startYear: 1336, startDate: '1336-01-01' },
    { name: 'Ryakuō', japanese: '暦応', startYear: 1338, startDate: '1338-10-11' },
    { name: 'Kōkoku', japanese: '興国', startYear: 1340, startDate: '1340-05-25' },
    { name: 'Kōei', japanese: '康永', startYear: 1342, startDate: '1342-06-01' },
    { name: 'Jōwa', japanese: '貞和', startYear: 1345, startDate: '1345-11-15' },
    { name: 'Shōhei', japanese: '正平', startYear: 1347, startDate: '1347-01-20' },
    { name: 'Kannō', japanese: '観応', startYear: 1350, startDate: '1350-04-04' },
    { name: 'Bunna', japanese: '文和', startYear: 1352, startDate: '1352-11-04' },
    { name: 'Enbun', japanese: '延文', startYear: 1356, startDate: '1356-04-29' },
    { name: 'Kōan', japanese: '康安', startYear: 1361, startDate: '1361-05-04' },
    { name: 'Jōji', japanese: '貞治', startYear: 1362, startDate: '1362-10-11' },
    { name: 'Ōan', japanese: '応安', startYear: 1368, startDate: '1368-03-07' },
    { name: 'Kentoku', japanese: '建徳', startYear: 1370, startDate: '1370-08-16' },
    { name: 'Bunchū', japanese: '文中', startYear: 1372, startDate: '1372-05-04' },
    { name: 'Eiwa', japanese: '永和', startYear: 1375, startDate: '1375-03-29' },
    { name: 'Tenju', japanese: '天授', startYear: 1375, startDate: '1375-06-26' },
    { name: 'Kōryaku', japanese: '康暦', startYear: 1379, startDate: '1379-04-09' },
    { name: 'Eitoku', japanese: '永徳', startYear: 1381, startDate: '1381-03-20' },
    { name: 'Kōwa', japanese: '弘和', startYear: 1381, startDate: '1381-03-06' },
    { name: 'Genchū', japanese: '元中', startYear: 1384, startDate: '1384-05-18' },
    { name: 'Shitoku', japanese: '至徳', startYear: 1384, startDate: '1384-03-19' },
    { name: 'Kakei', japanese: '嘉慶', startYear: 1387, startDate: '1387-10-05' },
    { name: 'Kōō', japanese: '康応', startYear: 1389, startDate: '1389-03-07' },
    { name: 'Meitoku', japanese: '明徳', startYear: 1390, startDate: '1390-04-12' },
    { name: 'Ōei', japanese: '応永', startYear: 1394, startDate: '1394-08-02' },
    { name: 'Shōchō', japanese: '正長', startYear: 1428, startDate: '1428-06-10' },
    { name: 'Eikyō', japanese: '永享', startYear: 1429, startDate: '1429-10-03' },
    { name: 'Kakitsu', japanese: '嘉吉', startYear: 1441, startDate: '1441-03-10' },
    { name: 'Bun\'an', japanese: '文安', startYear: 1444, startDate: '1444-02-23' },
    { name: 'Hōtoku', japanese: '宝徳', startYear: 1449, startDate: '1449-08-16' },
    { name: 'Kyōtoku', japanese: '享徳', startYear: 1452, startDate: '1452-08-10' },
    { name: 'Kōshō', japanese: '康正', startYear: 1455, startDate: '1455-09-06' },
    { name: 'Chōroku', japanese: '長禄', startYear: 1457, startDate: '1457-10-16' },
    { name: 'Kanshō', japanese: '寛正', startYear: 1460, startDate: '1461-02-01' },
    { name: 'Bunshō', japanese: '文正', startYear: 1466, startDate: '1466-03-14' },
    { name: 'Ōnin', japanese: '応仁', startYear: 1467, startDate: '1467-04-09' },
    { name: 'Bunmei', japanese: '文明', startYear: 1469, startDate: '1469-06-08' },
    { name: 'Chōkyō', japanese: '長享', startYear: 1487, startDate: '1487-08-09' },
    { name: 'Entoku', japanese: '延徳', startYear: 1489, startDate: '1489-09-16' },
    { name: 'Meiō', japanese: '明応', startYear: 1492, startDate: '1492-08-12' },
    { name: 'Bunki', japanese: '文亀', startYear: 1501, startDate: '1501-03-18' },
    { name: 'Eishō', japanese: '永正', startYear: 1504, startDate: '1504-03-16' },
    { name: 'Daiei', japanese: '大永', startYear: 1521, startDate: '1521-09-23' },
    { name: 'Kyōroku', japanese: '享禄', startYear: 1528, startDate: '1528-09-03' },
    { name: 'Tenbun', japanese: '天文', startYear: 1532, startDate: '1532-08-29' },
    { name: 'Kōji', japanese: '弘治', startYear: 1555, startDate: '1555-11-07' },
    { name: 'Eiroku', japanese: '永禄', startYear: 1558, startDate: '1558-03-18' },
    { name: 'Genki', japanese: '元亀', startYear: 1570, startDate: '1570-05-27' },
    { name: 'Tenshō', japanese: '天正', startYear: 1573, startDate: '1573-08-25' },
    { name: 'Bunroku', japanese: '文禄', startYear: 1592, startDate: '1593-01-10' },
    { name: 'Keichō', japanese: '慶長', startYear: 1596, startDate: '1596-12-16' },
    { name: 'Genna', japanese: '元和', startYear: 1615, startDate: '1615-09-05' },
    { name: 'Kan\'ei', japanese: '寛永', startYear: 1624, startDate: '1624-04-17' },
    { name: 'Shōhō', japanese: '正保', startYear: 1645, startDate: '1645-01-13' },
    { name: 'Keian', japanese: '慶安', startYear: 1648, startDate: '1648-04-07' },
    { name: 'Jōō', japanese: '承応', startYear: 1652, startDate: '1652-10-20' },
    { name: 'Meireki', japanese: '明暦', startYear: 1655, startDate: '1655-05-18' },
    { name: 'Manji', japanese: '万治', startYear: 1658, startDate: '1658-08-21' },
    { name: 'Kanbun', japanese: '寛文', startYear: 1661, startDate: '1661-05-23' },
    { name: 'Enpō', japanese: '延宝', startYear: 1673, startDate: '1673-10-30' },
    { name: 'Tenna', japanese: '天和', startYear: 1681, startDate: '1681-11-09' },
    { name: 'Jōkyō', japanese: '貞享', startYear: 1684, startDate: '1684-04-05' },
    { name: 'Genroku', japanese: '元禄', startYear: 1688, startDate: '1688-10-23' },
    { name: 'Hōei', japanese: '宝永', startYear: 1704, startDate: '1704-04-16' },
    { name: 'Shōtoku', japanese: '正徳', startYear: 1711, startDate: '1711-06-11' },
    { name: 'Kyōhō', japanese: '享保', startYear: 1716, startDate: '1716-08-09' },
    { name: 'Genbun', japanese: '元文', startYear: 1736, startDate: '1736-06-07' },
    { name: 'Kanpō', japanese: '寛保', startYear: 1741, startDate: '1741-04-12' },
    { name: 'Enkyō', japanese: '延享', startYear: 1744, startDate: '1744-04-03' },
    { name: 'Kan\'en', japanese: '寛延', startYear: 1748, startDate: '1748-08-05' },
    { name: 'Hōreki', japanese: '宝暦', startYear: 1751, startDate: '1751-12-14' },
    { name: 'Meiwa', japanese: '明和', startYear: 1764, startDate: '1764-06-30' },
    { name: 'An\'ei', japanese: '安永', startYear: 1772, startDate: '1772-12-10' },
    { name: 'Tenmei', japanese: '天明', startYear: 1781, startDate: '1781-04-25' },
    { name: 'Kansei', japanese: '寛政', startYear: 1789, startDate: '1789-02-19' },
    { name: 'Kyōwa', japanese: '享和', startYear: 1801, startDate: '1801-03-19' },
    { name: 'Bunka', japanese: '文化', startYear: 1804, startDate: '1804-03-22' },
    { name: 'Bunsei', japanese: '文政', startYear: 1818, startDate: '1818-05-26' },
    { name: 'Tenpō', japanese: '天保', startYear: 1830, startDate: '1831-01-23' },
    { name: 'Kōka', japanese: '弘化', startYear: 1844, startDate: '1845-01-09' },
    { name: 'Kaei', japanese: '嘉永', startYear: 1848, startDate: '1848-04-01' },
    { name: 'Ansei', japanese: '安政', startYear: 1854, startDate: '1855-01-15' },
    { name: 'Man\'en', japanese: '万延', startYear: 1860, startDate: '1860-04-08' },
    { name: 'Bunkyū', japanese: '文久', startYear: 1861, startDate: '1861-03-29' },
    { name: 'Genji', japanese: '元治', startYear: 1864, startDate: '1864-03-27' },
    { name: 'Keiō', japanese: '慶応', startYear: 1865, startDate: '1865-05-01' },
    { name: 'Meiji', japanese: '明治', startYear: 1868, startDate: '1868-10-23' },
    { name: 'Taishō', japanese: '大正', startYear: 1912, startDate: '1912-07-30' },
    { name: 'Shōwa', japanese: '昭和', startYear: 1926, startDate: '1926-12-25' },
    { name: 'Heisei', japanese: '平成', startYear: 1989, startDate: '1989-01-08' },
    { name: 'Reiwa', japanese: '令和', startYear: 2019, startDate: '2019-05-01' },
];

function julianToGregorianYmd(year, month, day) {
    const a = Math.floor((14 - month) / 12);
    const y2 = year + 4800 - a;
    const m2 = month + 12 * a - 3;
    const julianDayNumber =
        day +
        Math.floor((153 * m2 + 2) / 5) +
        365 * y2 +
        Math.floor(y2 / 4) -
        32083;

    const b = julianDayNumber + 32044;
    const c = Math.floor((4 * b + 3) / 146097);
    const d = b - Math.floor((146097 * c) / 4);
    const e = Math.floor((4 * d + 3) / 1461);
    const f = d - Math.floor((1461 * e) / 4);
    const g = Math.floor((5 * f + 2) / 153);

    const gregorianDay = f - Math.floor((153 * g + 2) / 5) + 1;
    const gregorianMonth = g + 3 - 12 * Math.floor(g / 10);
    const gregorianYear = 100 * c + e - 4800 + Math.floor(g / 10);

    return { year: gregorianYear, month: gregorianMonth, day: gregorianDay };
}

function dateIsBeforeGregorianReform(year, month, day) {
    return (
        year < 1582 ||
        (year === 1582 && (month < 10 || (month === 10 && day < 15)))
    );
}

function formatYmd(year, month, day) {
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function convertJapaneseEraStartDateToGregorianDateString(startDate) {
    const [yearString, monthString, dayString] = startDate.split('-');
    let year = Number(yearString);
    let month = Number(monthString);
    let day = Number(dayString);

    if (dateIsBeforeGregorianReform(year, month, day)) {
        const gregorian = julianToGregorianYmd(year, month, day);
        year = gregorian.year;
        month = gregorian.month;
        day = gregorian.day;
    }
    return formatYmd(year, month, day);
}

const JAPANESE_ERA_DATA_GREGORIAN = JAPANESE_ERA_DATA.map((eraData) => ({
    ...eraData,
    gregorianStartDate: convertJapaneseEraStartDateToGregorianDateString(eraData.startDate)
}));

function getJapaneseEraForDate(currentDateTime) {
    let era = null;
    for (const eraData of JAPANESE_ERA_DATA_GREGORIAN) {
        const [yearString, monthString, dayString] = eraData.gregorianStartDate.split('-');
        const startDateTime = createAdjustedDateTime({
            timezone: 'UTC+09:00',
            year: Number(yearString),
            month: Number(monthString),
            day: Number(dayString),
            hour: 'MIDNIGHT'
        });

        if (currentDateTime >= startDateTime) {
            era = eraData;
        } else {
            break;
        }
    }

    if (!era) {
        return null;
    }

    const japaneseLocalDate = createFauxUTCDate(currentDateTime, 'UTC+09:00');
    const [startYearString] = era.gregorianStartDate.split('-');
    const eraGregorianStartYear = Number(startYearString);
    const eraYear = japaneseLocalDate.getUTCFullYear() - eraGregorianStartYear + 1;

    return {
        name: era.name,
        japanese: era.japanese,
        year: eraYear
    };
}

/** First year of a nengō is written 元年, not 1年. */
function formatJapaneseEraYearInOutput(era) {
    if (era.year === 1) {
        return `${era.japanese}元年`;
    }
    return `${era.japanese}${era.year}年`;
}

/**
 * Jimmu / Kōki year (神武紀元): 660 + the civil year that has begun for Japan.
 * Calibrated so lunar New Year in Gregorian 645 CE is year 1305 (see Meiji-era formula 西暦+660).
 * Before 1873-01-01 JST that base year follows the lunisolar year (via calculateLunisolarDisplayYear + 0 offset);
 * on and after the Gregorian reform it follows the Gregorian calendar year in JST.
 */
/** Sexagenary day (日干支) in JST civil days (midnight boundary). Anchored: 2019-01-27 JST = 甲子. */
function getJapaneseSexagenaryDayLabel(currentDateTime) {
    const tz = 'UTC+09:00';
    const anchor = createAdjustedDateTime({
        timezone: tz,
        year: 2019,
        month: 1,
        day: 27,
        hour: 'MIDNIGHT'
    });
    const jstWall = createFauxUTCDate(currentDateTime, tz);
    const dayStart = createAdjustedDateTime({
        timezone: tz,
        year: jstWall.getUTCFullYear(),
        month: jstWall.getUTCMonth() + 1,
        day: jstWall.getUTCDate(),
        hour: 'MIDNIGHT'
    });
    const delta = Math.round(differenceInDays(dayStart, anchor));
    const index = ((delta % 60) + 60) % 60;
    return SEXAGENARY_HEAVENLY_STEMS[index % 10] + SEXAGENARY_EARTHLY_BRANCHES[index % 12];
}

function formatJapaneseCalendarOutput(primaryLine, dayEto, jinmuYear, era) {
    if (!era) {
        return `${primaryLine}\n${dayEto}`;
    }
    return `${primaryLine}\n神武紀元${jinmuYear}年\n${dayEto}`;
}


//|-----------------------------------|
//|     Japanese Lunisolar (JST)      |
//|-----------------------------------|
// Uses the same lunisolar rules as the Chinese-style calendar in lunisolarCalendars.js
// (JST midnight boundaries), with nengō-era year labels in the output string.
// From 1873-01-01 (Japan civil date, JST) the state calendar is Gregorian; this function
// switches to Gregorian month/day on and after that date.

function japaneseJstCivilDateIsOnOrAfterGregorianReform(jstDate) {
    const y = jstDate.getUTCFullYear();
    const m = jstDate.getUTCMonth() + 1;
    const d = jstDate.getUTCDate();
    if (y > 1873) {
        return true;
    }
    if (y < 1873) {
        return false;
    }
    return m > 1 || d >= 1;
}

function getJapaneseLunisolarCalendarDate(currentDateTime) {
    const timezone = 'UTC+09:00';
    const jstDate = createFauxUTCDate(currentDateTime, timezone);
    const isGregorianPhase = japaneseJstCivilDateIsOnOrAfterGregorianReform(jstDate);
    const dayEto = getJapaneseSexagenaryDayLabel(currentDateTime);

    if (isGregorianPhase) {
        const gDay = jstDate.getUTCDate();
        const gMonth = jstDate.getUTCMonth() + 1;
        const gYear = jstDate.getUTCFullYear();
        const era = getJapaneseEraForDate(currentDateTime);
        const rest = `${gMonth}月${gDay}日`;
        const jinmuYear = gYear + 660;
        const primaryLine = era
            ? `${formatJapaneseEraYearInOutput(era)}${rest}`
            : `${jinmuYear}年${rest}`;
        const output = formatJapaneseCalendarOutput(primaryLine, dayEto, jinmuYear, era);
        return {
            output,
            day: gDay,
            month: gMonth,
            year: gYear,
            dayOfWeek: undefined,
            other: { era, jinmuYear, sexagenaryDay: dayEto }
        };
    }

    const yearOffset = 2698;
    const leapMonthSuffix = '閏';
    const gregorianYear = currentDateTime.getUTCFullYear();
    const gregorianMonth = currentDateTime.getUTCMonth();
    const lunisolarDate = getLunisolarCalendarDate(currentDateTime, timezone);
    const year = calculateLunisolarDisplayYear(gregorianYear, gregorianMonth, lunisolarDate.month, yearOffset);
    const monthString = getLunisolarMonthString(lunisolarDate.month, lunisolarDate.leapMonth, leapMonthSuffix);
    const era = getJapaneseEraForDate(currentDateTime);
    const rest = `${monthString}月${lunisolarDate.day}日`;
    const jstForJimmu = createFauxUTCDate(currentDateTime, timezone);
    const jinmuYear =
        calculateLunisolarDisplayYear(
            jstForJimmu.getUTCFullYear(),
            jstForJimmu.getUTCMonth(),
            lunisolarDate.month,
            0
        ) + 660;
    const primaryLine = era
        ? `${formatJapaneseEraYearInOutput(era)}${rest}`
        : `${jinmuYear}年${rest}`;
    const output = formatJapaneseCalendarOutput(primaryLine, dayEto, jinmuYear, era);
    return {
        output,
        day: lunisolarDate.day,
        month: lunisolarDate.month,
        year,
        dayOfWeek: undefined,
        other: { era, jinmuYear, sexagenaryDay: dayEto }
    };
}
