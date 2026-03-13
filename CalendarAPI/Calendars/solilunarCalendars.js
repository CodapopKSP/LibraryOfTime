//|-----------------------------|
//|     Solilunar Calendars     |
//|-----------------------------|

// A set of functions for calculating dates in the Solilunar Calendars category.

function getTogysDate(currentDateTime) {

    const TogysMonthNames = [
        '1 togys aiy',
        '25 togys aiy',
        '23 togys aiy',
        '21 togys aiy',
        '19 togys aiy',
        '17 togys aiy',
        '15 togys aiy',
        '13 togys aiy',
        '11 togys aiy',
        '9 togys aiy',
        '7 togys aiy',
        '5 togys aiy',
        '3 togys aiy',
    ];
    
    const TogysMonthNames_Leap = [
        '1 togys aiy',
        '27 togys aiy',
        '25 togys aiy',
        '23 togys aiy',
        '21 togys aiy',
        '19 togys aiy',
        '17 togys aiy',
        '15 togys aiy',
        '13 togys aiy',
        '11 togys aiy',
        '9 togys aiy',
        '7 togys aiy',
        '5 togys aiy',
        '3 togys aiy',
    ];

    const TogysYearNames = [
        'Mouse',
        'Cow',
        'Leopard',
        'Hare',
        'Wolf',
        'Snake',
        'Horse',
        'Sheep',
        'Monkey',
        'Hen',
        'Dog',
        'Boar',
    ];

    // Get start of Togys year
    let startOfTogysYear = getTogysNewYear(currentDateTime);
    if (startOfTogysYear > currentDateTime) {
        addYear(startOfTogysYear, -1);
        startOfTogysYear = getTogysNewYear(startOfTogysYear);
    }

    // Get leap year status
    let startOfTogysPlusOneYear = addYear(startOfTogysYear, 1, true);
    const startOfTogysNextYear = getTogysNewYear(startOfTogysPlusOneYear);
    const monthsBetweenStartOfTogysYearAndNextYear = Math.round(differenceInDays(startOfTogysNextYear, startOfTogysYear) / 27.3);
    let months = TogysMonthNames;
    if (monthsBetweenStartOfTogysYearAndNextYear > 13) {
        months = TogysMonthNames_Leap;
    }

    // Get year name and current cycle number
    const mod = (n, m) => ((n % m) + m) % m;
    const startOfTogysYearCycle = getTogysNewYear(createAdjustedDateTime({year: 2008, month: 7, day: 1})); // 2008 was the start of a cycle
    const fixedYearLength = 365.2663; // Weird number chosen because epoch accumulated errors, should start with Mouse in -3669. Probably a sidereal year/precession thing.
    const yearsSinceStartOfTogysYearCycle = Math.round(differenceInDays(startOfTogysYear, startOfTogysYearCycle) / fixedYearLength);
    const yearName = TogysYearNames[mod(yearsSinceStartOfTogysYearCycle, 12)];
    const cyclesSinceStart = Math.floor(yearsSinceStartOfTogysYearCycle / 12);
    const currentCycle = 474 + cyclesSinceStart;

    // Get month and day
    const startOfTogysMonth = getTogysStartOfMonth(currentDateTime);
    const monthsSinceStartOfTogysYear = Math.round(differenceInDays(startOfTogysMonth, startOfTogysYear) / 27.5);
    const daysSinceStartOfTogysMonth = Math.floor(differenceInDays(currentDateTime, startOfTogysMonth)) + 1;

    return 'Day ' + daysSinceStartOfTogysMonth + ' of ' + months[monthsSinceStartOfTogysYear] + '\nYear of the ' + yearName + '\nof Cycle ' + currentCycle;
}

function getTogysStartOfMonth(currentDateTime) {
    let startOfMonth = new Date(currentDateTime);
    startOfMonth = getTogysDayStart(startOfMonth);

    // Iterate through the last 35 days and find which one begins a month
    for (let i = 0; i < 35; i++) {
        if (isTogysStartOfMonth(startOfMonth)) {
          return startOfMonth;
        }
    
        // Step back exactly one Togys day (to the previous 19:00 UTC boundary)
        startOfMonth.setUTCDate(startOfMonth.getUTCDate() - 1);
    }
}

function isTogysStartOfMonth(currentDateTime) {

    // Star data for Alcyone, delta is unused
    const alcyone_alpha = 56.8711541667;
    //const alcyone_delta = 24.1051361111;
    
    // Get the range for today
    let startOfToday = getTogysDayStart(currentDateTime);
    let startOfTomorrow = addDay(new Date(startOfToday), 1);
    
    // Get the range of lunar right ascensions for the period
    const [lunar_alpha_startOfToday, lunar_delta_startOfToday] = getPositionOfTheMoon(startOfToday);
    const [lunar_alpha_startOfTomorrow, lunar_delta_startOfTomorrow] = getPositionOfTheMoon(startOfTomorrow);

    // See if the right ascension of the moon matched Alcyone during that time
    let todayIsStartOfMonth = false;
    if (lunar_alpha_startOfToday < alcyone_alpha && lunar_alpha_startOfTomorrow > alcyone_alpha) {
        todayIsStartOfMonth = true;
    }
    return todayIsStartOfMonth;
}

function getTogysDayStart(dt) {
    // Get the date in UTC+05:00 timezone, then set to midnight
    // First, convert to UTC+05:00 to get the correct local date
    // We ADD the offset to convert UTC to local time representation
    const timezoneOffset = convertUTCOffsetToMinutes('UTC+05:00');
    const localTime = new Date(dt.getTime() + timezoneOffset * 60 * 1000);
    
    // Extract date components from the local time
    const year = localTime.getUTCFullYear();
    const month = localTime.getUTCMonth();
    const day = localTime.getUTCDate();
    
    // Create midnight in UTC+05:00 (which is 19:00 UTC the previous day)
    return createAdjustedDateTime({year: year, month: month + 1, day: day, hour: 'MIDNIGHT', timezone: 'UTC+05:00'});
}

function getTogysNewYear(currentDateTime) { 
    const currentYear = currentDateTime.getUTCFullYear();
    
    // Define the search range: March 1 to June 30
    const marchStart = createAdjustedDateTime({year: currentYear, month: 3, day: 1});
    const juneEnd = createAdjustedDateTime({year: currentYear, month: 6, day: 30});
    
    // Find all Togys month starts between March and June
    const togysMonthStarts = [];
    let currentDate = new Date(marchStart);
    
    while (currentDate <= juneEnd) {
        const togysMonthStart = getTogysStartOfMonth(currentDate);
        if (togysMonthStart && togysMonthStart >= marchStart && togysMonthStart <= juneEnd) {
            togysMonthStarts.push(togysMonthStart);
        }

        // Move forward by about 25 days to find next potential month start, may result in duplicates but it's ok
        addDay(currentDate, 25);
    }
    
    // Find the last Togys month start that is less than 15 days after a new moon
    let lastValidTogysMonth = togysMonthStarts[0];
    for (const togysMonthStart of togysMonthStarts) {

        // Get the new moon before this Togys month start
        let newMoonBefore = new Date(getNewMoon(togysMonthStart, 0));
        
        if (newMoonBefore) {
            // Calculate days between new moon and Togys month start
            const daysDifference = Math.floor(differenceInDays(togysMonthStart, newMoonBefore));
            
            // Check if Togys month start is less than 15 days after the new moon and that the new moon happened first
            if ((daysDifference >= 0 && daysDifference < 15) && (getPositionOfTheMoon(newMoonBefore)[0] < 56.8711541667)) {
                lastValidTogysMonth = togysMonthStart;
            }
        }
    }
    return lastValidTogysMonth;
}