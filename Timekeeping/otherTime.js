//|--------------------|
//|     Other Time     |
//|--------------------|

// A set of functions for calculating times in the Other Time category.

// Get the current Coordinated Mars Time
function getMTC(marsSolDay) {
    const MTCdecimal = ((marsSolDay % 1) + 1) % 1 * 24;
    const hours = Math.floor(MTCdecimal);
    const fractionMinutes = MTCdecimal - hours;
    const minutes = Math.floor(fractionMinutes * 60);
    const fractionSeconds = fractionMinutes * 60 - minutes;
    const seconds = Math.floor(fractionSeconds * 60);

    // Format each unit to have leading zeros if needed
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    return formattedHours + ':' + formattedMinutes + ':' + formattedSeconds;
}
