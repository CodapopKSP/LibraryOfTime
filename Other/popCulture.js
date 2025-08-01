//|---------------------|
//|     Pop Culture     |
//|---------------------|

// A set of functions for calculating dates in the Pop Culture category.

function pad(num, size) {
    return ('000' + num).slice(-size);
}

function getMinecraftTime(currentDateTime_, timezoneOffset) {
    let currentDateTime = new Date(currentDateTime_.getTime() + (timezoneOffset*60*1000));
    let midnight = new Date(Date.UTC(currentDateTime.getUTCFullYear(), currentDateTime.getUTCMonth(), currentDateTime.getUTCDate(), 0, 0, 0));

    // Convert date to milliseconds since midnight
    const millisecondsSinceMidnight = currentDateTime - midnight;

    // Convert milliseconds to Minecraft time
    const minecraftTime = Math.floor(millisecondsSinceMidnight / 50); // 1 Minecraft hour = 50 milliseconds
    const hoursSinceMidnight = Math.floor(minecraftTime / 1000);
    let day = Math.floor(hoursSinceMidnight / 24)+1;
    let hours = hoursSinceMidnight % day;
    const minutes = Math.floor((minecraftTime % 1000) * 0.06);
    const seconds = Math.floor(((minecraftTime % 1000) * 0.06 - minutes) * 60);

    return  'Day: ' + day + ' | ' + pad(hours,2) + ':' + pad(minutes,2) + ':' + pad(seconds,2);
}

function getInceptionDreamTime(currentDateTime_, timezoneOffset) {
    let currentDateTime = new Date(currentDateTime_.getTime() + (timezoneOffset*60*1000));
    let midnight = new Date(Date.UTC(currentDateTime.getUTCFullYear(), currentDateTime.getUTCMonth(), currentDateTime.getUTCDate(), 0, 0, 0));
    // Convert date to milliseconds since midnight
    const millisecondsSinceMidnight = currentDateTime - midnight;

    // Convert milliseconds to Inception dream time
    const dreamTime = millisecondsSinceMidnight / (1000 * 60 * 60 * 24) * 20; // 1:20 conversion for the whole day
    const hours = Math.floor(dreamTime * 24);
    const minutes = Math.floor((dreamTime * 24 % 1) * 60);
    const seconds = Math.floor(((dreamTime * 24 % 1) * 60 % 1) * 60);

    return pad(hours, 2) + ':' + pad(minutes, 2) + ':' + pad(seconds, 2);
}

function getTerminaTime(currentDateTime_, timezoneOffset) {
    let currentDateTime = new Date(currentDateTime_.getTime() + (timezoneOffset*60*1000));
    // Days start at 6am
    let SixAMToday = new Date(Date.UTC(currentDateTime.getUTCFullYear(), currentDateTime.getUTCMonth(), currentDateTime.getUTCDate(), 6, 0, 0));
    if (currentDateTime<SixAMToday) {
        SixAMToday.setDate(currentDateTime.getDate()-1);
    }

    // Calculate current time
    const totalRealSecondsSinceEpoch = (currentDateTime-SixAMToday)/1000;
    const totalHoursSinceEpoch = totalRealSecondsSinceEpoch/150;
    const daysSinceEpoch = totalHoursSinceEpoch/24;
    const currentDay = Math.floor(daysSinceEpoch%3)+1;
    let currentHour = Math.floor(totalHoursSinceEpoch%24);
    const currentMinute = Math.floor(((totalHoursSinceEpoch%24) - (currentHour))*60);
    const currentSecond = Math.floor(((((totalHoursSinceEpoch%24) - (currentHour))*60)-currentMinute)*60);

    // Build Hours Remains message
    let remainingHours = 72 - ((currentHour) + ((currentDay-1)*24));
    let remainingHoursMessage = remainingHours + ' Hours Remain';
    if (remainingHours===1) {
        remainingHoursMessage = remainingHours + ' Hour Remains';
    }

    // Add 6 because days start at 6am
    currentHour += 6;

    // Build Day message
    let dayName = 'First Day';
    if (currentDay==2) {
        dayName = 'Second Day';
    }
    if (currentDay==3) {
        dayName = 'Third Day';
    }

    // If After 6pm (night)
    if (currentHour >= 18) {
        dayName = 'Night of the ' + dayName;
    } else {
        dayName = 'The ' + dayName;
    }

    // Fix hours to 12 hour format
    if (currentHour >= 24) {
        currentHour -= 24;
    }
    currentHour%=12;
    if (currentHour === 0) {
        currentHour = 12;
    }

    return pad(currentHour, 2) + ':' + pad(currentMinute, 2) + ':' + pad(currentSecond, 2) + '\n' + dayName + '\n' + remainingHoursMessage;
}