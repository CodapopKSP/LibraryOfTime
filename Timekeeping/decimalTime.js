//|----------------------|
//|     Decimal Time     |
//|----------------------|

// A set of functions for calculating times in the Decimal Time category.

function getRevolutionaryTime(dayFraction) {
    let decimalHour = Math.trunc(dayFraction * 10);
    let decimalMinute = Math.trunc(dayFraction * 1000) - (decimalHour * 100);
    let decimalSecond = Math.trunc(dayFraction * 100000) - (decimalHour * 10000) - (decimalMinute * 100);
    
    // Convert each part to strings and pad them with leading zeros if needed
    let hourStr = decimalHour.toString().padStart(2, '0');
    let minuteStr = decimalMinute.toString().padStart(2, '0');
    let secondStr = decimalSecond.toString().padStart(2, '0');

    return hourStr + ":" + minuteStr + ":" + secondStr;
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
    let hexadecimalFraction = Math.trunc((dayFraction * 65536)).toString(16).toUpperCase();
    // Pad the hexadecimal fraction with leading zeros if necessary to ensure four digits
    while (hexadecimalFraction.length < 4) {
        hexadecimalFraction = "0" + hexadecimalFraction;
    }
    return "." + hexadecimalFraction;
}

function getBinaryTime(dayFraction) {
    // Convert the day fraction to the equivalent binary count
    let binaryCount = Math.trunc(dayFraction * 65536).toString(2);
    
    // Pad the binary count with leading zeros if necessary to ensure it has 16 bits
    while (binaryCount.length < 16) {
        binaryCount = "0" + binaryCount;
    }
    
    // Return the binary time string
    return binaryCount;
}

function get6DigitHexadecimalTime(dayFraction) {
    // Convert the day fraction to hexadecimal format
    let hexadecimalFraction = Math.trunc((dayFraction * 16777215)).toString(16).toUpperCase();
    // Pad the hexadecimal fraction with leading zeros if necessary to ensure four digits
    while (hexadecimalFraction.length < 6) {
        hexadecimalFraction = "0" + hexadecimalFraction;
    }
    return hexadecimalFraction;
}

function hexToRGBA(hex, alpha) {
    // Convert hex color to RGB
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    // Return RGBA color string
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}