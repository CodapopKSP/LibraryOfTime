//|----------------------|
//|     Decimal Time     |
//|----------------------|

// A set of functions for calculating times in the Decimal Time category.

function getRevolutionaryTime(dayFraction) {
    let decimalHour = Math.floor(dayFraction * 10);
    let decimalMinute = Math.floor(dayFraction*1000)-(decimalHour*100);
    let decimalSecond = Math.floor(dayFraction*100000)-(decimalHour*10000)-(decimalMinute*100);
    return decimalHour + ":" + decimalMinute + ":" + decimalSecond;
}

function convertToSwatchBeats(currentDateTime) {
    // Get UTC time
    let utcDateTime = new Date(currentDateTime.getTime() + currentDateTime.getTimezoneOffset() * 60000);
    // Get the day fraction and convert to BMT
    let dayFraction = ((utcDateTime.getHours()+1) * 3600 + utcDateTime.getMinutes() * 60 + utcDateTime.getSeconds()) / 86400;
    // Convert day fraction to milliseconds
    let milliseconds = dayFraction * 86400000; // 86400000 ms = 1 day
    // Calculate Swatch .beats
    let swatchBeats = (milliseconds % 86400000) * (1000 / 86400000); // 864000 ms = 1000 .beats
    return swatchBeats.toFixed(2);
}

function getHexadecimalTime(dayFraction) {
    // Convert the day fraction to hexadecimal format
    let hexadecimalFraction = Math.floor((dayFraction * 65536)).toString(16).toUpperCase();
    // Pad the hexadecimal fraction with leading zeros if necessary to ensure four digits
    while (hexadecimalFraction.length < 4) {
        hexadecimalFraction = "0" + hexadecimalFraction;
    }
    return "." + hexadecimalFraction;
}
