//|--------------------|
//|     Other Time     |
//|--------------------|

// A set of functions for calculating times in the Other Time category.

// Get the current Coordinated Mars Time
export function getMTC(marsSolDay) {
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

export function getIoPrimeMeridianTime(currentDateTime) {
    const epoch = new Date(Date.UTC(2001, 11, 31, 16, 7, 45));
    const ioCircad = 21.23833;
    const ioDayMilliseconds = ioCircad * 60 * 60 * 1000;
    const ioDaysSince = (currentDateTime - epoch) / ioDayMilliseconds;

    // Handle negative dates correctly
    let currentDayFraction = ioDaysSince - Math.floor(ioDaysSince);
    if (currentDayFraction < 0) {
        currentDayFraction += 1;
    }

    const circad = (Math.floor(ioDaysSince) % 2 + 2) % 2 + 1;

    let hour = currentDayFraction * 24;
    let minute = (hour - Math.floor(hour)) * 60;
    let second = (minute - Math.floor(minute)) * 60;

    hour = String(Math.floor(hour)).padStart(2, '0');
    minute = String(Math.floor(minute)).padStart(2, '0');
    second = String(Math.floor(second)).padStart(2, '0');

    return 'Circad ' + circad + ' | ' + hour + ':' + minute + ':' + second;
}


export function getEuropaPrimeMeridianTime(currentDateTime) {
    const epoch = new Date(Date.UTC(2002, 0, 2, 17, 12, 57));
    const europaCircad = 21.32456;
    const europaDayMilliseconds = europaCircad * 60 * 60 * 1000;
    const europaDaysSince = (currentDateTime-epoch)/europaDayMilliseconds;
    let currentDayFraction = europaDaysSince - Math.floor(europaDaysSince);
    if (currentDayFraction < 0) {
        currentDayFraction += 1;
    }

    const circad = ((Math.floor(europaDaysSince) % 4) + 4) % 4 + 1;

    let hour = currentDayFraction * 24;
    let minute = (hour - Math.floor(hour))*60;
    let second = (minute - Math.floor(minute))*60;

    hour = String(Math.floor(hour)).padStart(2, '0');
    minute = String(Math.floor(minute)).padStart(2, '0');
    second = String(Math.floor(second)).padStart(2, '0');

    return 'Circad ' + circad + ' | ' + hour + ':'+  minute + ':' + second;
}

export function getGanymedePrimeMeridianTime(currentDateTime) {
    const epoch = new Date(Date.UTC(2002, 0, 1, 11, 8, 29));
    const ganymedeCircad = 21.49916;
    const ganymedeDayMilliseconds = ganymedeCircad * 60 * 60 * 1000;
    const ganymedeDaysSince = (currentDateTime-epoch)/ganymedeDayMilliseconds;
    let currentDayFraction = ganymedeDaysSince - Math.floor(ganymedeDaysSince);
    if (currentDayFraction < 0) {
        currentDayFraction += 1;
    }

    const circad = ((Math.floor(ganymedeDaysSince) % 8) + 8) % 8 + 1;

    let hour = currentDayFraction * 24;
    let minute = (hour - Math.floor(hour))*60;
    let second = (minute - Math.floor(minute))*60;

    hour = String(Math.floor(hour)).padStart(2, '0');
    minute = String(Math.floor(minute)).padStart(2, '0');
    second = String(Math.floor(second)).padStart(2, '0');

    return 'Circad ' + circad + ' | ' + hour + ':'+  minute + ':' + second;
}

export function getCallistoPrimeMeridianTime(currentDateTime) {
    const epoch = new Date(Date.UTC(2001, 11, 28, 12, 27, 23));
    const callistoCircad = 21.16238;
    const callistoDayMilliseconds = callistoCircad * 60 * 60 * 1000;
    const callistoDaysSince = (currentDateTime-epoch)/callistoDayMilliseconds;
    let currentDayFraction = callistoDaysSince - Math.floor(callistoDaysSince);
    if (currentDayFraction < 0) {
        currentDayFraction += 1;
    }

    const circad = ((Math.floor(callistoDaysSince) % 19) + 19) % 19 + 1;

    let hour = currentDayFraction * 24;
    let minute = (hour - Math.floor(hour))*60;
    let second = (minute - Math.floor(minute))*60;

    hour = String(Math.floor(hour)).padStart(2, '0');
    minute = String(Math.floor(minute)).padStart(2, '0');
    second = String(Math.floor(second)).padStart(2, '0');

    return 'Circad ' + circad + ' | ' + hour + ':'+  minute + ':' + second;
}

export function getTitanPrimeMeridianTime(currentDateTime) {
    const epoch = new Date(Date.UTC(1609, 2, 15, 18, 37, 32));
    const titanCircad = 0.998068439;
    const titanDayMilliseconds = titanCircad * 24 * 60 * 60 * 1000;
    const titanDaysSince = (currentDateTime-epoch)/titanDayMilliseconds;
    let currentDayFraction = titanDaysSince - Math.floor(titanDaysSince);
    if (currentDayFraction < 0) {
        currentDayFraction += 1;
    }

    const circad = ((Math.floor(titanDaysSince) % 16) + 16) % 16 + 1;

    let hour = currentDayFraction * 24;
    let minute = (hour - Math.floor(hour))*60;
    let second = (minute - Math.floor(minute))*60;

    hour = String(Math.floor(hour)).padStart(2, '0');
    minute = String(Math.floor(minute)).padStart(2, '0');
    second = String(Math.floor(second)).padStart(2, '0');

    return 'Circad ' + circad + ' | ' + hour + ':'+  minute + ':' + second;
}