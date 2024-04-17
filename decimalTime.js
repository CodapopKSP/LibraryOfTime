//|----------------------|
//|     Decimal Time     |
//|----------------------|

// A set of functions for calculating times in the Decimal Time category.

function getRevolutionaryTime(dayFraction) {
    let decimalHour = Math.floor(dayFraction * 10);
    let decimalMinute = Math.floor((dayFraction % 1) * 1000);
    let decimalSecond = Math.floor(((dayFraction * 1000) % 1) * 100);
    return decimalHour + ":" + decimalMinute + ":" + decimalSecond;
}

function convertToSwatchBeats(currentDateTime) {
    // Get UTC time
    let utcDateTime = new Date(currentDateTime.getTime() + currentDateTime.getTimezoneOffset() * 60000); // Convert to UTC

    // Get the day fraction and convert to BMT
    let dayFraction = ((utcDateTime.getHours()+1) * 3600 + utcDateTime.getMinutes() * 60 + utcDateTime.getSeconds()) / 86400;

    // Convert day fraction to milliseconds
    let milliseconds = dayFraction * 86400000; // 86400000 ms = 1 day
    
    // Calculate Swatch .beats
    let swatchBeats = (milliseconds % 86400000) * (1000 / 86400000); // 864000 ms = 1000 .beats
    return swatchBeats.toFixed(2);
}


