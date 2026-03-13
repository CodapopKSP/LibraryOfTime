//|---------------------|
//|     Pop Culture     |
//|---------------------|

// A set of functions for calculating dates in the Pop Culture category.

function pad(num, size) {
    return ('000' + num).slice(-size);
}

function getMinecraftTime(currentDateTime_, timezoneOffset) {
    let currentDateTime = createFauxUTCDate(currentDateTime_, timezoneOffset);
    let midnight = createAdjustedDateTime({currentDateTime: currentDateTime, hour: 'MIDNIGHT'});

    // Convert date to milliseconds since midnight
    const millisecondsSinceMidnight = currentDateTime - midnight;

    // Convert milliseconds to Minecraft time
    const minecraftTime = Math.floor(millisecondsSinceMidnight / 50); // 1 Minecraft hour = 50 milliseconds
    const hoursSinceMidnight = Math.floor(minecraftTime / 1000);
    let day = Math.floor(hoursSinceMidnight / 24)+1;
    let hours = hoursSinceMidnight % 24;
    const minutes = Math.floor((minecraftTime % 1000) * 0.06);
    const seconds = Math.floor(((minecraftTime % 1000) * 0.06 - minutes) * 60);

    return  'Day: ' + day + ' | ' + pad(hours,2) + ':' + pad(minutes,2) + ':' + pad(seconds,2);
}

function getInceptionDreamTime(currentDateTime_, timezoneOffset) {
    const currentDateTime = createFauxUTCDate(currentDateTime_, timezoneOffset);
    const midnight = createAdjustedDateTime({currentDateTime: currentDateTime, hour: 'MIDNIGHT'});
  
    const ms = currentDateTime - midnight;               // real ms since midnight
    const dreamDays = (ms / 86_400_000) * 20;            // 1 real day → 20 dream days
    const totalDreamHours = dreamDays * 24;              // 0..<480
    const totalDreamMinutes = totalDreamHours * 60;
    const totalDreamSeconds = totalDreamMinutes * 60;
  
    const day = Math.floor(totalDreamHours / 24) + 1;    // 1..20 (for that real day)
    const hours = Math.floor(totalDreamHours) % 24;      // 0..23
    const minutes = Math.floor(totalDreamMinutes) % 60;  // 0..59
    const seconds = Math.floor(totalDreamSeconds) % 60;  // 0..59
  
    return `Day: ${day} | ${pad(hours,2)}:${pad(minutes,2)}:${pad(seconds,2)}`;
  }
  

function getTerminaTime(currentDateTime_, timezoneOffset) {
    let currentDateTime = createFauxUTCDate(currentDateTime_, timezoneOffset);
    // Days start at 6am
    let SixAMToday = createAdjustedDateTime({currentDateTime: currentDateTime, hour: 'SUNRISE'});
    if (currentDateTime<SixAMToday) {
        addDay(SixAMToday, -1);
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

function getStardate(currentDateTime) {
    const stardate0 = createAdjustedDateTime({year: 2265, month: 4, day: 25});
    const stardatesPerDay = 7.21;
    const stardate = (currentDateTime - stardate0) / (1000 * 60 * 60 * 24) * stardatesPerDay;
    return stardate.toFixed(2);;
}

function getTamrielicDate(currentDateTime, timezoneOffset) {

    const tamrielicMonths = [
        "Morning Star",
        "Sun's Dawn",
        "First Seed",
        "Rain's Hand",
        "Second Seed",
        "Midyear",
        "Sun's Height",
        "Last Seed",
        "Hearthfire",
        "Frostfall",
        "Sun's Dusk",
        "Evening Star",
    ];

    const tamrielicWeek = [
        "Morndas",
        "Tirdas",   
        "Middas",
        "Turdas",
        "Fredas",
        "Loredas",
        "Sundas",
    ];

    // Get Gregorian date
    const gregorianDate = getGregorianDateTime(currentDateTime, timezoneOffset);
    const tamrielicDate = gregorianDate.date;
    const day = tamrielicDate.split(' ')[0];
    let month = tamrielicDate.split(' ')[1];
    let week = tamrielicDate.split('\n')[1];

    // Get month by comparing to Gregorian
    for (let i = 0; i < tamrielicMonths.length; i++) {
        if (month === monthNames[i]) {
            month = i;
            break;
        }
    }

    // Get week by comparing to Gregorian (adjusted to start at Monday)
    for (let i = 0; i < tamrielicWeek.length; i++) {
        if (week === weekNames[i]) {
            week = (i+6)%7;
            break;
        }
    }

    return day + ' ' + tamrielicMonths[month] + '\n' + tamrielicWeek[week];
}

function getImperialDatingSystem(currentDateTime, timezoneOffset) {
    const yearFraction = (calculateYear(currentDateTime, timezoneOffset).toFixed(3)*1000);
    
    // Get the actual year
    let adjustedDateTime = createFauxUTCDate(currentDateTime, timezoneOffset);
    const year = adjustedDateTime.getUTCFullYear() + 1000; // Millennium is 1-based counting rather than 0-based, so year 0 is Millennium 1
    
    // For digit extraction, use absolute value
    const absYear = Math.abs(year);
    const absYearString = absYear.toString();
    
    // Get last 3 digits for yearHundreds (pad with zeros if needed)
    const yearHundreds = absYearString.slice(-3).padStart(3, '0');
    
    // Calculate millennium - millenniums start at 001, so M3 starts at 2001, not 2000
    // After +1000 adjustment: year 2000 → 3000 should be M2, year 2001 → 3001 should be M3
    // Use Math.floor((year - 1) / 1000) to account for starting at 001
    const millenniumNum = Math.floor((year - 1) / 1000);
    const millennium = millenniumNum.toString();

    return '0 ' + yearFraction + ' ' + yearHundreds + '.M' + millennium;
}