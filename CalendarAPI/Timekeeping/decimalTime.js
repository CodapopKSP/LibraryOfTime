//|----------------------|
//|   Alternative Time   |
//|----------------------|

// A set of functions for calculating times in the Alternative Time grid section.

function getRevolutionaryTime(currentDateTime_, timezoneOffset) {
    const dayFraction = calculateDay(currentDateTime_, timezoneOffset);
    const totalDecimalSeconds = Math.trunc(dayFraction * 100000);
    const decimalHour = Math.trunc(totalDecimalSeconds / 10000);
    const remainingSecondsAfterHours = totalDecimalSeconds - (decimalHour * 10000);
    const decimalMinute = Math.trunc(remainingSecondsAfterHours / 100);
    const decimalSecond = remainingSecondsAfterHours - (decimalMinute * 100);

    const hourStr = decimalHour.toString().padStart(2, '0');
    const minuteStr = decimalMinute.toString().padStart(2, '0');
    const secondStr = decimalSecond.toString().padStart(2, '0');

    return hourStr + ":" + minuteStr + ":" + secondStr;
}

function convertToSwatchBeats(currentDateTime) {
    const utcDateTime = createFauxUTCDate(currentDateTime, currentDateTime.getTimezoneOffset());
    const dayFraction = ((utcDateTime.getHours() + 1) * 3600 + utcDateTime.getMinutes() * 60 + utcDateTime.getSeconds()) / 86400;
    const milliseconds = dayFraction * 86400000;
    const swatchBeats = (milliseconds % 86400000) * (1000 / 86400000);
    return swatchBeats.toFixed(2);
}

function getHexadecimalTime(currentDateTime_, timezoneOffset) {
    const dayFraction = calculateDay(currentDateTime_, timezoneOffset);
    const hexadecimalFraction = Math.trunc(dayFraction * 65536).toString(16).toUpperCase().padStart(4, '0');
    return "." + hexadecimalFraction;
}

function getBinaryTime(currentDateTime_, timezoneOffset) {
    const dayFraction = calculateDay(currentDateTime_, timezoneOffset);
    const binaryCount = Math.trunc(dayFraction * 65536).toString(2).padStart(16, '0');
    return binaryCount;
}

function getBabylonianTime(currentDateTime_, timezoneOffset) {
    const ROLLOVER_EPSILON = 1e-10;
    const dayFraction = calculateDay(currentDateTime_, timezoneOffset);
    const sunriseOffset = 0.25; // 06:00 local fraction of day
    const sunriseDayFraction = (dayFraction - sunriseOffset + 1) % 1;
    const totalGesPerDay = 12 * 30;
    const totalGes = Math.floor((sunriseDayFraction * totalGesPerDay) + ROLLOVER_EPSILON) % totalGesPerDay;
    const watch = Math.floor(totalGes / 30);
    const ges = totalGes % 30;

    return 'Watch: ' + watch + ' | Geš: ' + ges;
}

function getHelek(currentDateTime_, timezoneOffset) {
    const hourFraction = calculateHour(currentDateTime_, timezoneOffset);
    return Math.floor(hourFraction * 1080).toString();
}

function get6DigitHexadecimalTime(dayFraction) {
    const hexadecimalFraction = Math.trunc(dayFraction * 16777215).toString(16).toUpperCase().padStart(6, '0');
    return hexadecimalFraction;
}

function hexToRGBA(hex, alpha) {
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}