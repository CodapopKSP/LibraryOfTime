//|----------------------|
//|     Decimal Time     |
//|----------------------|

// A set of functions for calculating times in the Decimal Time category.

const REVOLUTIONARY_HOURS_PER_DAY = 10;
const REVOLUTIONARY_MINUTES_PER_HOUR = 100;
const REVOLUTIONARY_SECONDS_PER_MINUTE = 100;
const REVOLUTIONARY_SECONDS_PER_HOUR = REVOLUTIONARY_MINUTES_PER_HOUR * REVOLUTIONARY_SECONDS_PER_MINUTE;
const REVOLUTIONARY_SECONDS_PER_DAY = REVOLUTIONARY_HOURS_PER_DAY * REVOLUTIONARY_SECONDS_PER_HOUR;
const REVOLUTIONARY_PAD_LENGTH = 2;

function getRevolutionaryTime(currentDateTime_, timezoneOffset) {
    const dayFraction = calculateDay(currentDateTime_, timezoneOffset);
    const totalDecimalSeconds = Math.trunc(dayFraction * REVOLUTIONARY_SECONDS_PER_DAY);
    const decimalHour = Math.trunc(totalDecimalSeconds / REVOLUTIONARY_SECONDS_PER_HOUR);
    const remainingSecondsAfterHours = totalDecimalSeconds - (decimalHour * REVOLUTIONARY_SECONDS_PER_HOUR);
    const decimalMinute = Math.trunc(remainingSecondsAfterHours / REVOLUTIONARY_SECONDS_PER_MINUTE);
    const decimalSecond = remainingSecondsAfterHours - (decimalMinute * REVOLUTIONARY_SECONDS_PER_MINUTE);

    const hourStr = decimalHour.toString().padStart(REVOLUTIONARY_PAD_LENGTH, '0');
    const minuteStr = decimalMinute.toString().padStart(REVOLUTIONARY_PAD_LENGTH, '0');
    const secondStr = decimalSecond.toString().padStart(REVOLUTIONARY_PAD_LENGTH, '0');

    return hourStr + ":" + minuteStr + ":" + secondStr;
}

const SWATCH_SECONDS_PER_HOUR = 3600;
const SWATCH_SECONDS_PER_MINUTE = 60;
const SWATCH_SECONDS_PER_DAY = 86400;
const SWATCH_MS_PER_DAY = 86400000;
const SWATCH_BEATS_PER_DAY = 1000;
const SWATCH_DECIMAL_PLACES = 2;

function convertToSwatchBeats(currentDateTime) {
    const utcDateTime = createFauxUTCDate(currentDateTime, currentDateTime.getTimezoneOffset());
    const dayFraction = ((utcDateTime.getHours() + 1) * SWATCH_SECONDS_PER_HOUR + utcDateTime.getMinutes() * SWATCH_SECONDS_PER_MINUTE + utcDateTime.getSeconds()) / SWATCH_SECONDS_PER_DAY;
    const milliseconds = dayFraction * SWATCH_MS_PER_DAY;
    const swatchBeats = (milliseconds % SWATCH_MS_PER_DAY) * (SWATCH_BEATS_PER_DAY / SWATCH_MS_PER_DAY);
    return swatchBeats.toFixed(SWATCH_DECIMAL_PLACES);
}

const DAY_FRACTION_16_BIT_SCALE = 65536;
const HEX_TIME_DIGIT_COUNT = 4;
const HEX_RADIX = 16;

function getHexadecimalTime(currentDateTime_, timezoneOffset) {
    const dayFraction = calculateDay(currentDateTime_, timezoneOffset);
    const hexadecimalFraction = Math.trunc(dayFraction * DAY_FRACTION_16_BIT_SCALE).toString(HEX_RADIX).toUpperCase().padStart(HEX_TIME_DIGIT_COUNT, '0');
    return "." + hexadecimalFraction;
}

const BINARY_TIME_BIT_COUNT = 16;
const BINARY_RADIX = 2;

function getBinaryTime(currentDateTime_, timezoneOffset) {
    const dayFraction = calculateDay(currentDateTime_, timezoneOffset);
    const binaryCount = Math.trunc(dayFraction * DAY_FRACTION_16_BIT_SCALE).toString(BINARY_RADIX).padStart(BINARY_TIME_BIT_COUNT, '0');
    return binaryCount;
}

const HEX_6_FRACTION_BASE = 16777215;
const HEX_6_DIGIT_COUNT = 6;

function get6DigitHexadecimalTime(dayFraction) {
    const hexadecimalFraction = Math.trunc(dayFraction * HEX_6_FRACTION_BASE).toString(16).toUpperCase().padStart(HEX_6_DIGIT_COUNT, '0');
    return hexadecimalFraction;
}

const RGBA_HEX_RADIX = 16;
const RGBA_RED_SHIFT = 16;
const RGBA_GREEN_SHIFT = 8;
const RGBA_COMPONENT_MASK = 255;

function hexToRGBA(hex, alpha) {
    const bigint = parseInt(hex, RGBA_HEX_RADIX);
    const r = (bigint >> RGBA_RED_SHIFT) & RGBA_COMPONENT_MASK;
    const g = (bigint >> RGBA_GREEN_SHIFT) & RGBA_COMPONENT_MASK;
    const b = bigint & RGBA_COMPONENT_MASK;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}