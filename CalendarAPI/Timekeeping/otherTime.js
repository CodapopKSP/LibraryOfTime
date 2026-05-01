//|---------------------------|
//|  Extraterrestrial Time    |
//|---------------------------|

// A set of functions for calculating times in the Extraterrestrial Time grid section.

const OTHER_TIME_HOURS_PER_DAY = 24;
const OTHER_TIME_MINUTES_PER_HOUR = 60;
const OTHER_TIME_SECONDS_PER_MINUTE = 60;
const OTHER_TIME_PAD_LENGTH = 2;
const OTHER_TIME_MS_PER_HOUR = 60 * 60 * 1000;

function getMTC(currentDateTime) {
    const marsSolDay = getMarsSolDate(currentDateTime);
    const MTCdecimal = ((marsSolDay % 1) + 1) % 1 * OTHER_TIME_HOURS_PER_DAY;
    const hours = Math.floor(MTCdecimal);
    const fractionMinutes = MTCdecimal - hours;
    const minutes = Math.floor(fractionMinutes * OTHER_TIME_MINUTES_PER_HOUR);
    const fractionSeconds = fractionMinutes * OTHER_TIME_MINUTES_PER_HOUR - minutes;
    const seconds = Math.floor(fractionSeconds * OTHER_TIME_SECONDS_PER_MINUTE);

    const formattedHours = String(hours).padStart(OTHER_TIME_PAD_LENGTH, '0');
    const formattedMinutes = String(minutes).padStart(OTHER_TIME_PAD_LENGTH, '0');
    const formattedSeconds = String(seconds).padStart(OTHER_TIME_PAD_LENGTH, '0');

    return formattedHours + ':' + formattedMinutes + ':' + formattedSeconds;
}

function formatPrimeMeridianTime(currentDateTime, epochConfig, circadHours, circadCycle) {
    const epoch = createAdjustedDateTime(epochConfig);
    const dayMilliseconds = circadHours * OTHER_TIME_MS_PER_HOUR;
    const daysSince = (currentDateTime - epoch) / dayMilliseconds;

    let currentDayFraction = daysSince - Math.floor(daysSince);
    if (currentDayFraction < 0) {
        currentDayFraction += 1;
    }

    const circad = ((Math.floor(daysSince) % circadCycle) + circadCycle) % circadCycle + 1;
    const hourNum = currentDayFraction * OTHER_TIME_HOURS_PER_DAY;
    const minuteNum = (hourNum - Math.floor(hourNum)) * OTHER_TIME_MINUTES_PER_HOUR;
    const secondNum = (minuteNum - Math.floor(minuteNum)) * OTHER_TIME_SECONDS_PER_MINUTE;
    const hour = String(Math.floor(hourNum)).padStart(OTHER_TIME_PAD_LENGTH, '0');
    const minute = String(Math.floor(minuteNum)).padStart(OTHER_TIME_PAD_LENGTH, '0');
    const second = String(Math.floor(secondNum)).padStart(OTHER_TIME_PAD_LENGTH, '0');

    return 'Circad ' + circad + ' | ' + hour + ':' + minute + ':' + second;
}

const IO_EPOCH = { year: 2001, month: 12, day: 31, hour: 16, minute: 7, second: 45 };
const IO_CIRCAD_HOURS = 21.23833;
const IO_CIRCAD_CYCLE = 2;

function getIoPrimeMeridianTime(currentDateTime) {
    return formatPrimeMeridianTime(currentDateTime, IO_EPOCH, IO_CIRCAD_HOURS, IO_CIRCAD_CYCLE);
}


const EUROPA_EPOCH = { year: 2002, month: 1, day: 2, hour: 17, minute: 12, second: 57 };
const EUROPA_CIRCAD_HOURS = 21.32456;
const EUROPA_CIRCAD_CYCLE = 4;

function getEuropaPrimeMeridianTime(currentDateTime) {
    return formatPrimeMeridianTime(currentDateTime, EUROPA_EPOCH, EUROPA_CIRCAD_HOURS, EUROPA_CIRCAD_CYCLE);
}

const GANYMEDE_EPOCH = { year: 2002, month: 1, day: 1, hour: 11, minute: 8, second: 29 };
const GANYMEDE_CIRCAD_HOURS = 21.49916;
const GANYMEDE_CIRCAD_CYCLE = 8;

function getGanymedePrimeMeridianTime(currentDateTime) {
    return formatPrimeMeridianTime(currentDateTime, GANYMEDE_EPOCH, GANYMEDE_CIRCAD_HOURS, GANYMEDE_CIRCAD_CYCLE);
}

const CALLISTO_EPOCH = { year: 2001, month: 12, day: 28, hour: 12, minute: 27, second: 23 };
const CALLISTO_CIRCAD_HOURS = 21.16238;
const CALLISTO_CIRCAD_CYCLE = 19;

function getCallistoPrimeMeridianTime(currentDateTime) {
    return formatPrimeMeridianTime(currentDateTime, CALLISTO_EPOCH, CALLISTO_CIRCAD_HOURS, CALLISTO_CIRCAD_CYCLE);
}

// Same circad length and epoch as Darian Titan / Julian Circad Number (DARIAN_TITAN_EPOCH_CONFIG in otherCalendars.js) so meridian time matches calendar circad boundaries.
const TITAN_MERIDIAN_EPOCH = { year: 1609, month: 3, day: 15, hour: 18, minute: 37, second: 32 };
const TITAN_CIRCAD_EARTH_DAYS = 0.998068439;
const TITAN_CIRCAD_CYCLE = 16;

function getTitanPrimeMeridianTime(currentDateTime) {
    return formatPrimeMeridianTime(
        currentDateTime,
        TITAN_MERIDIAN_EPOCH,
        TITAN_CIRCAD_EARTH_DAYS * OTHER_TIME_HOURS_PER_DAY,
        TITAN_CIRCAD_CYCLE
    );
}