//|---------------------|
//|     Pop Culture     |
//|---------------------|

// A set of functions for calculating dates in the Pop Culture category.

function pad(num, size) {
    return ('000' + num).slice(-size);
}

function decomposeElapsedHours(totalHours, hoursPerDay, minutesPerHour, secondsPerMinute) {
    const hoursWithinDay = totalHours % hoursPerDay;
    const day = Math.floor(totalHours / hoursPerDay) + 1;
    const hour = Math.floor(hoursWithinDay);
    const minutesWithinHour = (hoursWithinDay - hour) * minutesPerHour;
    const minute = Math.floor(minutesWithinHour);
    const second = Math.floor((minutesWithinHour - minute) * secondsPerMinute);
    return { day, hour, minute, second };
}

function formatClockTime(hours, minutes, seconds) {
    return pad(hours, 2) + ':' + pad(minutes, 2) + ':' + pad(seconds, 2);
}

const MC_MS_PER_TICK = 50;
const MC_TICKS_PER_HOUR = 1000;
const MC_HOURS_PER_DAY = 24;
const MC_MINUTES_PER_TICK = 0.06;
const MC_SECONDS_PER_MINUTE = 60;

function getMinecraftTime(currentDateTime_, timezoneOffset) {
    const currentDateTime = createFauxUTCDate(currentDateTime_, timezoneOffset);
    const midnight = createAdjustedDateTime({ currentDateTime, hour: 'MIDNIGHT' });

    const millisecondsSinceMidnight = currentDateTime - midnight;
    const minecraftTime = Math.floor(millisecondsSinceMidnight / MC_MS_PER_TICK);
    const minecraftHours = minecraftTime / MC_TICKS_PER_HOUR;
    const decomposed = decomposeElapsedHours(minecraftHours, MC_HOURS_PER_DAY, MC_SECONDS_PER_MINUTE, MC_SECONDS_PER_MINUTE);
    return 'Day: ' + decomposed.day + ' | ' + formatClockTime(decomposed.hour, decomposed.minute, decomposed.second);
}

const INCEPTION_MS_PER_DAY = 86400000;
const INCEPTION_DREAM_DAYS_PER_REAL_DAY = 20;
const INCEPTION_HOURS_PER_DAY = 24;
const INCEPTION_MINUTES_PER_HOUR = 60;
const INCEPTION_SECONDS_PER_MINUTE = 60;

function getInceptionDreamTime(currentDateTime_, timezoneOffset) {
    const currentDateTime = createFauxUTCDate(currentDateTime_, timezoneOffset);
    const midnight = createAdjustedDateTime({ currentDateTime, hour: 'MIDNIGHT' });

    const ms = currentDateTime - midnight;
    const dreamDays = (ms / INCEPTION_MS_PER_DAY) * INCEPTION_DREAM_DAYS_PER_REAL_DAY;
    const totalDreamHours = dreamDays * INCEPTION_HOURS_PER_DAY;
    const decomposed = decomposeElapsedHours(totalDreamHours, INCEPTION_HOURS_PER_DAY, INCEPTION_MINUTES_PER_HOUR, INCEPTION_SECONDS_PER_MINUTE);
    return `Day: ${decomposed.day} | ${formatClockTime(decomposed.hour, decomposed.minute, decomposed.second)}`;
}

const TERMINA_REAL_SECONDS_PER_HOUR = 150;
const TERMINA_HOURS_PER_DAY = 24;
const TERMINA_MINUTES_PER_HOUR = 60;
const TERMINA_DAYS_PER_CYCLE = 3;
const TERMINA_HOURS_PER_CYCLE = 72;
const TERMINA_DAY_START_HOUR = 6;
const TERMINA_NIGHT_START_HOUR = 18;
const TERMINA_HOURS_IN_12_FORMAT = 12;

function getTerminaTime(currentDateTime_, timezoneOffset) {
    const currentDateTime = createFauxUTCDate(currentDateTime_, timezoneOffset);
    const sixAMToday = createAdjustedDateTime({ currentDateTime, hour: 'SUNRISE' });
    if (currentDateTime < sixAMToday) {
        addDay(sixAMToday, -1);
    }

    const totalRealSecondsSinceEpoch = (currentDateTime - sixAMToday) / 1000;
    const totalHoursSinceEpoch = totalRealSecondsSinceEpoch / TERMINA_REAL_SECONDS_PER_HOUR;
    const decomposed = decomposeElapsedHours(totalHoursSinceEpoch, TERMINA_HOURS_PER_DAY, TERMINA_MINUTES_PER_HOUR, 60);
    const currentDay = ((decomposed.day - 1) % TERMINA_DAYS_PER_CYCLE) + 1;
    let currentHour = decomposed.hour;
    const currentMinute = decomposed.minute;
    const currentSecond = decomposed.second;

    const remainingHours = TERMINA_HOURS_PER_CYCLE - (currentHour + (currentDay - 1) * TERMINA_HOURS_PER_DAY);
    const remainingHoursMessage = remainingHours === 1 ? remainingHours + ' Hour Remains' : remainingHours + ' Hours Remain';

    currentHour += TERMINA_DAY_START_HOUR;

    let dayName = currentDay === 2 ? 'Second Day' : currentDay === 3 ? 'Third Day' : 'First Day';
    dayName = currentHour >= TERMINA_NIGHT_START_HOUR ? 'Night of the ' + dayName : 'The ' + dayName;

    if (currentHour >= TERMINA_HOURS_PER_DAY) {
        currentHour -= TERMINA_HOURS_PER_DAY;
    }
    currentHour %= TERMINA_HOURS_IN_12_FORMAT;
    if (currentHour === 0) {
        currentHour = TERMINA_HOURS_IN_12_FORMAT;
    }

    return formatClockTime(currentHour, currentMinute, currentSecond) + '\n' + dayName + '\n' + remainingHoursMessage;
}

const STAR_DATE_EPOCH_YEAR = 2265;
const STAR_DATE_EPOCH_MONTH = 4;
const STAR_DATE_EPOCH_DAY = 25;
const STAR_DATES_PER_DAY = 7.21;
const STAR_DATE_MS_PER_DAY = 86400000;

function getStardate(currentDateTime) {
    const stardate0 = createAdjustedDateTime({ year: STAR_DATE_EPOCH_YEAR, month: STAR_DATE_EPOCH_MONTH, day: STAR_DATE_EPOCH_DAY });
    const stardate = (currentDateTime - stardate0) / STAR_DATE_MS_PER_DAY * STAR_DATES_PER_DAY;
    return stardate.toFixed(2);
}

const TAMRIELIC_MONTHS = [
    "Morning Star",
    "Sun's Dawn",
    "First Seed",
    "Rain's Hand",
    "Second Seed",
    "Midyear",
    "Sun's Height",
    "Last Seed",
    "Hearthfire",
    "Frostfall",
    "Sun's Dusk",
    "Evening Star",
];

const TAMRIELIC_WEEK = [
    "Morndas",
    "Tirdas",
    "Middas",
    "Turdas",
    "Fredas",
    "Loredas",
    "Sundas",
];

function getTamrielicDate(currentDateTime, timezoneOffset) {
    const gregorianDate = getGregorianDateTime(currentDateTime, timezoneOffset);
    const day = gregorianDate.day;
    const month = gregorianDate.month;
    const week = (gregorianDate.dayOfWeek + 6) % 7;
    return day + ' ' + TAMRIELIC_MONTHS[month] + '\n' + TAMRIELIC_WEEK[week];
}

const IMPERIAL_MILLENNIUM_YEAR_OFFSET = 1000;
const IMPERIAL_FRACTION_MULTIPLIER = 1000;
const IMPERIAL_YEARS_PER_MILLENNIUM = 1000;

function getImperialDatingSystem(currentDateTime, timezoneOffset) {
    const yearFraction = (calculateYear(currentDateTime, timezoneOffset).toFixed(3) * IMPERIAL_FRACTION_MULTIPLIER);

    const adjustedDateTime = createFauxUTCDate(currentDateTime, timezoneOffset);
    const year = adjustedDateTime.getUTCFullYear() + IMPERIAL_MILLENNIUM_YEAR_OFFSET;

    const absYear = Math.abs(year);
    const absYearString = absYear.toString();
    
    // Get last 3 digits for yearHundreds (pad with zeros if needed)
    const yearHundreds = absYearString.slice(-3).padStart(3, '0');

    const millenniumNum = Math.floor((year - 1) / IMPERIAL_YEARS_PER_MILLENNIUM);
    const millennium = millenniumNum.toString();

    return '0 ' + yearFraction + ' ' + yearHundreds + '.M' + millennium;
}

const SHIRE_EPOCH_YEAR = 1419;
const SHIRE_EPOCH_GREGORIAN_YEAR = 1941;
const SHIRE_EPOCH_GREGORIAN_MONTH = 12;
const SHIRE_EPOCH_GREGORIAN_DAY = 25;
const SHIRE_MS_PER_DAY = 86400000;
const SHIRE_DAYS_PER_MONTH = 30;
const SHIRE_DAYS_IN_HALF_YEAR = 180;
const SHIRE_MID_YEARS_DAY_INDEX = 182;
const SHIRE_OVERLITHE_DAY_INDEX = 183;
const SHIRE_DAYS_PER_WEEK = 7;

const SHIRE_FIRST_MONTHS = ['Afteryule', 'Solmath', 'Rethe', 'Astron', 'Thrimidge', 'Forelithe'];
const SHIRE_SECOND_MONTHS = ['Afterlithe', 'Wedmath', 'Halimath', 'Winterfilth', 'Blotmath', 'Foreyule'];
const SHIRE_WEEKDAYS = ['Sterday', 'Sunday', 'Monday', 'Trewsday', 'Hevensday', 'Mersday', 'Highday'];

function getShireDate(currentDateTime, timezoneOffset) {
    function isShireLeapYear(shireYear) {
        // Leap years every 4 years; no Gregorian-style 400-year century correction.
        // Works for negative years too.
        return (((shireYear % 4) + 4) % 4) === 0;
    }

    function yearLength(shireYear) {
        return isShireLeapYear(shireYear) ? 366 : 365;
    }

    function labelForDay(shireYear, dayIndex) {
        // dayIndex: 0..yearLength-1 where 0 is "2 Yule".
        const leap = isShireLeapYear(shireYear);

        if (dayIndex === 0) return '2 Yule';

        let idx = dayIndex - 1; // 0-based after "2 Yule"

        if (idx < SHIRE_DAYS_IN_HALF_YEAR) {
            const monthIndex = Math.floor(idx / SHIRE_DAYS_PER_MONTH);
            const dayInMonth = (idx % SHIRE_DAYS_PER_MONTH) + 1;
            return `${dayInMonth} ${SHIRE_FIRST_MONTHS[monthIndex]}`;
        }
        idx -= SHIRE_DAYS_IN_HALF_YEAR;

        // Intercalary block
        // Non-leap: 1 Lithe, Mid-year's Day, 2 Lithe
        // Leap: 1 Lithe, Mid-year's Day, Overlithe, 2 Lithe
        const interLen = leap ? 4 : 3;
        if (idx < interLen) {
            if (!leap) {
                if (idx === 0) return '1 Lithe';
                if (idx === 1) return "Mid-year's Day";
                return '2 Lithe';
            }
            if (idx === 0) return '1 Lithe';
            if (idx === 1) return "Mid-year's Day";
            if (idx === 2) return 'Overlithe';
            return '2 Lithe';
        }
        idx -= interLen;

        if (idx < SHIRE_DAYS_IN_HALF_YEAR) {
            const monthIndex = Math.floor(idx / SHIRE_DAYS_PER_MONTH);
            const dayInMonth = (idx % SHIRE_DAYS_PER_MONTH) + 1;
            return `${dayInMonth} ${SHIRE_SECOND_MONTHS[monthIndex]}`;
        }

        // Final day of the year.
        return '1 Yule';
    }

    function weekdayForDay(shireYear, dayIndex) {
        const leap = isShireLeapYear(shireYear);

        const isMidYearDay = dayIndex === SHIRE_MID_YEARS_DAY_INDEX;
        const isOverlitheDay = leap && dayIndex === SHIRE_OVERLITHE_DAY_INDEX;
        if (isMidYearDay || isOverlitheDay) return null;

        let skippedBefore = 0;
        if (dayIndex > SHIRE_MID_YEARS_DAY_INDEX) skippedBefore += 1;
        if (leap && dayIndex > SHIRE_OVERLITHE_DAY_INDEX) skippedBefore += 1;

        const regularDaysElapsed = dayIndex - skippedBefore;
        const weekdayIndex = ((regularDaysElapsed % SHIRE_DAYS_PER_WEEK) + SHIRE_DAYS_PER_WEEK) % SHIRE_DAYS_PER_WEEK;
        return SHIRE_WEEKDAYS[weekdayIndex];
    }

    const midnight = createAdjustedDateTime({ currentDateTime, hour: 'MIDNIGHT' });
    const shireEpochUTC = createAdjustedDateTime({ year: SHIRE_EPOCH_GREGORIAN_YEAR, month: SHIRE_EPOCH_GREGORIAN_MONTH, day: SHIRE_EPOCH_GREGORIAN_DAY });

    const dayOffset = Math.round((midnight.getTime() - shireEpochUTC.getTime()) / SHIRE_MS_PER_DAY);

    let shireYear = SHIRE_EPOCH_YEAR;
    let dayIndex = dayOffset;

    if (dayIndex >= 0) {
        while (dayIndex >= yearLength(shireYear)) {
            dayIndex -= yearLength(shireYear);
            shireYear += 1;
        }
    } else {
        while (dayIndex < 0) {
            shireYear -= 1;
            dayIndex += yearLength(shireYear);
        }
    }

    const dayLabel = labelForDay(shireYear, dayIndex);
    const base = `${dayLabel} S.R. ${shireYear}`;
    const weekday = weekdayForDay(shireYear, dayIndex);
    return weekday ? `${base}\n${weekday}` : base;
}