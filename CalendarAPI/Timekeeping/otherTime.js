//|--------------------|
//|     Other Time     |
//|--------------------|

// A set of functions for calculating times in the Other Time category.

const MTC_HOURS_PER_DAY = 24;
const MTC_MINUTES_PER_HOUR = 60;
const MTC_SECONDS_PER_MINUTE = 60;
const MTC_PAD_LENGTH = 2;

function getMTC(currentDateTime) {
    const marsSolDay = getMarsSolDate(currentDateTime);
    const MTCdecimal = ((marsSolDay % 1) + 1) % 1 * MTC_HOURS_PER_DAY;
    const hours = Math.floor(MTCdecimal);
    const fractionMinutes = MTCdecimal - hours;
    const minutes = Math.floor(fractionMinutes * MTC_MINUTES_PER_HOUR);
    const fractionSeconds = fractionMinutes * MTC_MINUTES_PER_HOUR - minutes;
    const seconds = Math.floor(fractionSeconds * MTC_SECONDS_PER_MINUTE);

    const formattedHours = String(hours).padStart(MTC_PAD_LENGTH, '0');
    const formattedMinutes = String(minutes).padStart(MTC_PAD_LENGTH, '0');
    const formattedSeconds = String(seconds).padStart(MTC_PAD_LENGTH, '0');

    return formattedHours + ':' + formattedMinutes + ':' + formattedSeconds;
}

const IO_EPOCH = { year: 2001, month: 12, day: 31, hour: 16, minute: 7, second: 45 };
const IO_CIRCAD_HOURS = 21.23833;
const IO_CIRCAD_MS_PER_HOUR = 60 * 60 * 1000;
const IO_CIRCAD_CYCLE = 2;
const IO_HOURS_PER_DAY = 24;
const IO_MINUTES_PER_HOUR = 60;
const IO_SECONDS_PER_MINUTE = 60;
const IO_PAD_LENGTH = 2;

function getIoPrimeMeridianTime(currentDateTime) {
    const epoch = createAdjustedDateTime(IO_EPOCH);
    const ioDayMilliseconds = IO_CIRCAD_HOURS * IO_CIRCAD_MS_PER_HOUR;
    const ioDaysSince = (currentDateTime - epoch) / ioDayMilliseconds;

    let currentDayFraction = ioDaysSince - Math.floor(ioDaysSince);
    if (currentDayFraction < 0) {
        currentDayFraction += 1;
    }

    const circad = ((Math.floor(ioDaysSince) % IO_CIRCAD_CYCLE) + IO_CIRCAD_CYCLE) % IO_CIRCAD_CYCLE + 1;

    const hourNum = currentDayFraction * IO_HOURS_PER_DAY;
    const minuteNum = (hourNum - Math.floor(hourNum)) * IO_MINUTES_PER_HOUR;
    const secondNum = (minuteNum - Math.floor(minuteNum)) * IO_SECONDS_PER_MINUTE;
    const hour = String(Math.floor(hourNum)).padStart(IO_PAD_LENGTH, '0');
    const minute = String(Math.floor(minuteNum)).padStart(IO_PAD_LENGTH, '0');
    const second = String(Math.floor(secondNum)).padStart(IO_PAD_LENGTH, '0');

    return 'Circad ' + circad + ' | ' + hour + ':' + minute + ':' + second;
}


const EUROPA_EPOCH = { year: 2002, month: 1, day: 2, hour: 17, minute: 12, second: 57 };
const EUROPA_CIRCAD_HOURS = 21.32456;
const EUROPA_CIRCAD_MS_PER_HOUR = 60 * 60 * 1000;
const EUROPA_CIRCAD_CYCLE = 4;
const EUROPA_HOURS_PER_DAY = 24;
const EUROPA_MINUTES_PER_HOUR = 60;
const EUROPA_SECONDS_PER_MINUTE = 60;
const EUROPA_PAD_LENGTH = 2;

function getEuropaPrimeMeridianTime(currentDateTime) {
    const epoch = createAdjustedDateTime(EUROPA_EPOCH);
    const europaDayMilliseconds = EUROPA_CIRCAD_HOURS * EUROPA_CIRCAD_MS_PER_HOUR;
    const europaDaysSince = (currentDateTime - epoch) / europaDayMilliseconds;
    let currentDayFraction = europaDaysSince - Math.floor(europaDaysSince);
    if (currentDayFraction < 0) {
        currentDayFraction += 1;
    }

    const circad = ((Math.floor(europaDaysSince) % EUROPA_CIRCAD_CYCLE) + EUROPA_CIRCAD_CYCLE) % EUROPA_CIRCAD_CYCLE + 1;

    const hourNum = currentDayFraction * EUROPA_HOURS_PER_DAY;
    const minuteNum = (hourNum - Math.floor(hourNum)) * EUROPA_MINUTES_PER_HOUR;
    const secondNum = (minuteNum - Math.floor(minuteNum)) * EUROPA_SECONDS_PER_MINUTE;
    const hour = String(Math.floor(hourNum)).padStart(EUROPA_PAD_LENGTH, '0');
    const minute = String(Math.floor(minuteNum)).padStart(EUROPA_PAD_LENGTH, '0');
    const second = String(Math.floor(secondNum)).padStart(EUROPA_PAD_LENGTH, '0');

    return 'Circad ' + circad + ' | ' + hour + ':' + minute + ':' + second;
}

const GANYMEDE_EPOCH = { year: 2002, month: 1, day: 1, hour: 11, minute: 8, second: 29 };
const GANYMEDE_CIRCAD_HOURS = 21.49916;
const GANYMEDE_CIRCAD_MS_PER_HOUR = 60 * 60 * 1000;
const GANYMEDE_CIRCAD_CYCLE = 8;
const GANYMEDE_HOURS_PER_DAY = 24;
const GANYMEDE_MINUTES_PER_HOUR = 60;
const GANYMEDE_SECONDS_PER_MINUTE = 60;
const GANYMEDE_PAD_LENGTH = 2;

function getGanymedePrimeMeridianTime(currentDateTime) {
    const epoch = createAdjustedDateTime(GANYMEDE_EPOCH);
    const ganymedeDayMilliseconds = GANYMEDE_CIRCAD_HOURS * GANYMEDE_CIRCAD_MS_PER_HOUR;
    const ganymedeDaysSince = (currentDateTime - epoch) / ganymedeDayMilliseconds;
    let currentDayFraction = ganymedeDaysSince - Math.floor(ganymedeDaysSince);
    if (currentDayFraction < 0) {
        currentDayFraction += 1;
    }

    const circad = ((Math.floor(ganymedeDaysSince) % GANYMEDE_CIRCAD_CYCLE) + GANYMEDE_CIRCAD_CYCLE) % GANYMEDE_CIRCAD_CYCLE + 1;

    const hourNum = currentDayFraction * GANYMEDE_HOURS_PER_DAY;
    const minuteNum = (hourNum - Math.floor(hourNum)) * GANYMEDE_MINUTES_PER_HOUR;
    const secondNum = (minuteNum - Math.floor(minuteNum)) * GANYMEDE_SECONDS_PER_MINUTE;
    const hour = String(Math.floor(hourNum)).padStart(GANYMEDE_PAD_LENGTH, '0');
    const minute = String(Math.floor(minuteNum)).padStart(GANYMEDE_PAD_LENGTH, '0');
    const second = String(Math.floor(secondNum)).padStart(GANYMEDE_PAD_LENGTH, '0');

    return 'Circad ' + circad + ' | ' + hour + ':' + minute + ':' + second;
}

const CALLISTO_EPOCH = { year: 2001, month: 12, day: 28, hour: 12, minute: 27, second: 23 };
const CALLISTO_CIRCAD_HOURS = 21.16238;
const CALLISTO_CIRCAD_MS_PER_HOUR = 60 * 60 * 1000;
const CALLISTO_CIRCAD_CYCLE = 19;
const CALLISTO_HOURS_PER_DAY = 24;
const CALLISTO_MINUTES_PER_HOUR = 60;
const CALLISTO_SECONDS_PER_MINUTE = 60;
const CALLISTO_PAD_LENGTH = 2;

function getCallistoPrimeMeridianTime(currentDateTime) {
    const epoch = createAdjustedDateTime(CALLISTO_EPOCH);
    const callistoDayMilliseconds = CALLISTO_CIRCAD_HOURS * CALLISTO_CIRCAD_MS_PER_HOUR;
    const callistoDaysSince = (currentDateTime - epoch) / callistoDayMilliseconds;
    let currentDayFraction = callistoDaysSince - Math.floor(callistoDaysSince);
    if (currentDayFraction < 0) {
        currentDayFraction += 1;
    }

    const circad = ((Math.floor(callistoDaysSince) % CALLISTO_CIRCAD_CYCLE) + CALLISTO_CIRCAD_CYCLE) % CALLISTO_CIRCAD_CYCLE + 1;

    const hourNum = currentDayFraction * CALLISTO_HOURS_PER_DAY;
    const minuteNum = (hourNum - Math.floor(hourNum)) * CALLISTO_MINUTES_PER_HOUR;
    const secondNum = (minuteNum - Math.floor(minuteNum)) * CALLISTO_SECONDS_PER_MINUTE;
    const hour = String(Math.floor(hourNum)).padStart(CALLISTO_PAD_LENGTH, '0');
    const minute = String(Math.floor(minuteNum)).padStart(CALLISTO_PAD_LENGTH, '0');
    const second = String(Math.floor(secondNum)).padStart(CALLISTO_PAD_LENGTH, '0');

    return 'Circad ' + circad + ' | ' + hour + ':' + minute + ':' + second;
}

const TITAN_EPOCH = { year: 1609, month: 3, day: 15, hour: 18, minute: 37, second: 32 };
const TITAN_CIRCAD_EARTH_DAYS = 0.998068439;
const TITAN_MS_PER_EARTH_DAY = 24 * 60 * 60 * 1000;
const TITAN_CIRCAD_CYCLE = 16;
const TITAN_HOURS_PER_DAY = 24;
const TITAN_MINUTES_PER_HOUR = 60;
const TITAN_SECONDS_PER_MINUTE = 60;
const TITAN_PAD_LENGTH = 2;

function getTitanPrimeMeridianTime(currentDateTime) {
    const epoch = createAdjustedDateTime(TITAN_EPOCH);
    const titanDayMilliseconds = TITAN_CIRCAD_EARTH_DAYS * TITAN_MS_PER_EARTH_DAY;
    const titanDaysSince = (currentDateTime - epoch) / titanDayMilliseconds;
    let currentDayFraction = titanDaysSince - Math.floor(titanDaysSince);
    if (currentDayFraction < 0) {
        currentDayFraction += 1;
    }

    const circad = ((Math.floor(titanDaysSince) % TITAN_CIRCAD_CYCLE) + TITAN_CIRCAD_CYCLE) % TITAN_CIRCAD_CYCLE + 1;

    const hourNum = currentDayFraction * TITAN_HOURS_PER_DAY;
    const minuteNum = (hourNum - Math.floor(hourNum)) * TITAN_MINUTES_PER_HOUR;
    const secondNum = (minuteNum - Math.floor(minuteNum)) * TITAN_SECONDS_PER_MINUTE;
    const hour = String(Math.floor(hourNum)).padStart(TITAN_PAD_LENGTH, '0');
    const minute = String(Math.floor(minuteNum)).padStart(TITAN_PAD_LENGTH, '0');
    const second = String(Math.floor(secondNum)).padStart(TITAN_PAD_LENGTH, '0');

    return 'Circad ' + circad + ' | ' + hour + ':' + minute + ':' + second;
}