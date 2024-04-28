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
    const currentShake = Math.floor((dayFraction/1000) / shake);
    return currentShake + ' Shakes';
}