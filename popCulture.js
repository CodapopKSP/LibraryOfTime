//|---------------------|
//|     Pop Culture     |
//|---------------------|

// A set of functions for calculating dates in the Pop Culture category.

function getCurrentShakeOfALambsTail(currentDateTime) {
    let midnight = new Date(currentDateTime);
    midnight.setHours(0);
    midnight.setMinutes(0);
    midnight.setMilliseconds(0);
    const dayFraction = currentDateTime - midnight;
    const twoShakes = 70; // Seconds between movie moments
    const shake = twoShakes / 2;
    const currentShake = Math.trunc((dayFraction/1000) / shake);
    return currentShake + ' Shakes';
}

function getMinecraftTime(date) {
    // Convert date to milliseconds since midnight
    const millisecondsSinceMidnight = date - new Date(date.getFullYear(), date.getMonth(), date.getDate());

    // Convert milliseconds to Minecraft time
    const minecraftTime = Math.floor(millisecondsSinceMidnight / 50); // 1 Minecraft hour = 50 milliseconds
    const hoursSinceMidnight = Math.floor(minecraftTime / 1000);
    let day = Math.trunc(hoursSinceMidnight / 24);
    let hours = hoursSinceMidnight % day;
    const minutes = Math.floor((minecraftTime % 1000) * 0.06);
    const seconds = Math.floor(((minecraftTime % 1000) * 0.06 - minutes) * 60);

    return  'Day: ' + day + ' | ' + pad(hours,2) + ':' + pad(minutes,2) + ':' + pad(seconds,2);
}

function pad(num, size) {
    return ('000' + num).slice(-size);
}