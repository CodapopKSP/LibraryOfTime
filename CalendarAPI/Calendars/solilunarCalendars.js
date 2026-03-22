//|-----------------------------|
//|     Solilunar Calendars     |
//|-----------------------------|

// A set of functions for calculating dates in the Solilunar Calendars category.

// --- Togys ---
const TOGYS_TZ = 'UTC+05:00';
const TOGYS_MONTH_NAMES = [
    '1 togys aiy', '25 togys aiy', '23 togys aiy', '21 togys aiy', '19 togys aiy',
    '17 togys aiy', '15 togys aiy', '13 togys aiy', '11 togys aiy', '9 togys aiy',
    '7 togys aiy', '5 togys aiy', '3 togys aiy'
];
const TOGYS_MONTH_NAMES_LEAP = [
    '1 togys aiy', '27 togys aiy', '25 togys aiy', '23 togys aiy', '21 togys aiy',
    '19 togys aiy', '17 togys aiy', '15 togys aiy', '13 togys aiy', '11 togys aiy',
    '9 togys aiy', '7 togys aiy', '5 togys aiy', '3 togys aiy'
];
const TOGYS_YEAR_NAMES = [
    'Mouse', 'Cow', 'Leopard', 'Hare', 'Wolf', 'Snake',
    'Horse', 'Sheep', 'Monkey', 'Hen', 'Dog', 'Boar'
];
const TOGYS_ALCYONE_RA = 56.8711541667;
const TOGYS_FIXED_YEAR_LENGTH = 365.2663;

function getTogysDate(currentDateTime) {
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
    const months = monthsBetweenStartOfTogysYearAndNextYear > 13 ? TOGYS_MONTH_NAMES_LEAP : TOGYS_MONTH_NAMES;

    // Get year name and current cycle number
    const mod = (n, m) => ((n % m) + m) % m;
    const startOfTogysYearCycle = getTogysNewYear(createAdjustedDateTime({ year: 2008, month: 7, day: 1 }));
    const yearsSinceStartOfTogysYearCycle = Math.round(differenceInDays(startOfTogysYear, startOfTogysYearCycle) / TOGYS_FIXED_YEAR_LENGTH);
    const yearName = TOGYS_YEAR_NAMES[mod(yearsSinceStartOfTogysYearCycle, 12)];
    const cyclesSinceStart = Math.floor(yearsSinceStartOfTogysYearCycle / 12);
    const currentCycle = 474 + cyclesSinceStart;

    // Get month and day
    const startOfTogysMonth = getTogysStartOfMonth(currentDateTime);
    const monthsSinceStartOfTogysYear = Math.round(differenceInDays(startOfTogysMonth, startOfTogysYear) / 27.5);
    const daysSinceStartOfTogysMonth = Math.floor(differenceInDays(currentDateTime, startOfTogysMonth)) + 1;

    const output = `Day ${daysSinceStartOfTogysMonth} of ${months[monthsSinceStartOfTogysYear]}\nYear of the ${yearName}\nof Cycle ${currentCycle}`;
    return { output, day: daysSinceStartOfTogysMonth, month: monthsSinceStartOfTogysYear, year: currentCycle, other: { yearName } };
}

function getTogysStartOfMonth(currentDateTime) {
    let startOfMonth = getTogysDayStart(new Date(currentDateTime));

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
    // Get the range for today
    const startOfToday = getTogysDayStart(currentDateTime);
    const startOfTomorrow = addDay(new Date(startOfToday), 1);
    
    // Get the range of lunar right ascensions for the period
    const [lunar_alpha_startOfToday] = getPositionOfTheMoon(startOfToday);
    const [lunar_alpha_startOfTomorrow] = getPositionOfTheMoon(startOfTomorrow);

    return lunar_alpha_startOfToday < TOGYS_ALCYONE_RA && lunar_alpha_startOfTomorrow > TOGYS_ALCYONE_RA;
}

function getTogysDayStart(dt) {
    // Get the date in UTC+05:00 timezone, then set to midnight
    // First, convert to UTC+05:00 to get the correct local date
    // We ADD the offset to convert UTC to local time representation
    const timezoneOffset = convertUTCOffsetToMinutes(TOGYS_TZ);
    const localTime = new Date(dt.getTime() + timezoneOffset * 60 * 1000);
    
    // Extract date components from the local time
    const year = localTime.getUTCFullYear();
    const month = localTime.getUTCMonth();
    const day = localTime.getUTCDate();
    
    // Create midnight in UTC+05:00 (which is 19:00 UTC the previous day)
    return createAdjustedDateTime({ year, month: month + 1, day, hour: 'MIDNIGHT', timezone: TOGYS_TZ });
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
            if (daysDifference >= 0 && daysDifference < 15 && getPositionOfTheMoon(newMoonBefore)[0] < TOGYS_ALCYONE_RA) {
                lastValidTogysMonth = togysMonthStart;
            }
        }
    }
    return lastValidTogysMonth;
}