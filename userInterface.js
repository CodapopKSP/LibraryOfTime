/*
    |======================|
    |    User Interface    |
    |======================|

*/

if (typeof document !== 'undefined') {
    document.getElementById('change-date-button')?.addEventListener('click', () => changeDateTime());
}

if (typeof document !== 'undefined') {
    document.getElementById('reset-date-button')?.addEventListener('click', () => {
        document.getElementById('date-input').value = '';
        document.getElementById('timezone').value = "UTC+08:00";
        setDatePickerTimezone(getLocalTimezoneOffset());
        setDatePickerTime("");
        changeDateTime();
    });
}


// Manages the calendar that the user can choose to frame the calculator
let _calendarType = 'GREGORIAN';
function getCalendarType() {
    return _calendarType;
}
function setCalendarType(newCalendarType) {
    _calendarType = newCalendarType;
}

// Manages the update interval of the calculator
let _currentUpdateInterval = setInterval(updateAllNodes, updateMilliseconds);
function getCurrentUpdateInterval() {
    return _currentUpdateInterval;
}
function setCurrentUpdateInterval(newInterval) {
    _currentUpdateInterval = newInterval;
}

// Return a formatted dateTime based on the user's date from the input field
function parseInputDate(dateInput_, timezoneOffset) {
    let dateInput = dateInput_;

    if (dateInput==="") {
        dateInput = getDatePickerTime(); // If null, return current datetime
    }
    let [inputDate, inputTime] = dateInput.split(', ');
    let BCE = false;

    // Check if the year is BCE and remove the leading '-' if present
    if (inputDate.startsWith('-')) {
        BCE = true;
        inputDate = inputDate.substring(1); // Remove the '-' from the year part
    }

    // Parse date and time components
    let [inputYear, inputMonth, inputDay] = inputDate ? inputDate.split('-').map(Number) : [0, 1, 1];
    let [inputHour, inputMinute, inputSecond] = inputTime ? inputTime.split(':').map(Number) : [0, 0, 0];

    // Convert timezone offset string (e.g., "+08:00") to minutes
    const offsetInMinutes = convertUTCOffsetToMinutes(timezoneOffset);

    // Construct UTC time in milliseconds
    let utcMillis = createAdjustedDateTime({year: inputYear, month: inputMonth, day: inputDay, hour: inputHour, minute: inputMinute, second: inputSecond});

    // Apply BCE year handling
    let dateTime = new Date(utcMillis);
    if (BCE) {
        dateTime.setUTCFullYear(inputYear * -1);
    } else {
        dateTime.setUTCFullYear(inputYear);
    }

    // Subtract the timezone offset from the UTC date to get the raw UTC datetime
    dateTime = new Date(dateTime.getTime() - offsetInMinutes * 60 * 1000);

    return dateTime;
}

// Calculate display date for user's calendar choice
function adjustCalendarType(currentDateTime) {
    setGregJulianDifference(calculateGregorianJulianDifference(currentDateTime));
    const gregJulDifference = getGregJulianDifference();
    let calendarType = getCalendarType();
    switch (calendarType) {
        case 'JULIAN':
            currentDateTime = adjustForJulianLiturgical(currentDateTime, gregJulDifference);
            break;
        case 'ASTRONOMICAL':
            currentDateTime = adjustForAstronomical(currentDateTime, gregJulDifference);
            break;
    }
    return currentDateTime;
}

// Calculate display date if user chooses Julian (Liturtgical)
function adjustForJulianLiturgical(currentDateTime, gregJulDifference) {
    // No Year 0 exists, so add 1 to negative years
    if (currentDateTime.getFullYear() < 0) {
        addYear(currentDateTime, 1);
    
    // No Year 0 exists, so return current date as fallback
    } else if (currentDateTime.getFullYear()===0) {
        currentDateTime = new Date();
    }
    addDay(currentDateTime, gregJulDifference);
    return currentDateTime;
}

// Calculate display date if user chooses Astronomical
function adjustForAstronomical(currentDateTime, gregJulDifference) {
    const startOfGregorian = createAdjustedDateTime({year: 1582, month: 10, day: 15});
    if (currentDateTime < startOfGregorian) {
        addDay(currentDateTime, gregJulDifference);
    }
    return currentDateTime;
}

function updateAllNodes(dateInput, timezoneOffset_, firstPass) {

    // Set Timezone to local time if there is none specified
    let timezoneOffset = timezoneOffset_;
    let timezoneOffsetConverted = 0;
    if (timezoneOffset === undefined) {
        timezoneOffset = getLocalTimezoneOffset();
    }
    timezoneOffsetConverted = convertUTCOffsetToMinutes(timezoneOffset);

    // Get the current datetime, keeping in mind the timezone, calendar type, and Date() bullshit
    let currentDateTime = dateInput ? parseInputDate(dateInput, timezoneOffset) : new Date();

    // currentPass is used for updating nodes in a staggered fashion. It is equivalent to the current second.
    // 100 is used to update all nodes
    let currentPass = (firstPass || dateInput) ? 100 : currentDateTime.getSeconds();

    // Make adjustments based on calendar choice
    currentDateTime = adjustCalendarType(currentDateTime);

    // Generate a list of all New Moons that will be used in every calendar
    if (currentPass===100) {
        generateAllNewMoons(currentDateTime);
        generateAllSolsticesEquinoxes(currentDateTime);
    }

    // Check if in the middle of a second, and update in a staggered fashion
    if (((currentDateTime.getMilliseconds() > 500) && (currentDateTime.getMilliseconds() < 500 + updateMilliseconds))||(currentPass===100)) {
        switch (currentPass) {
            case 100: // Update all nodes
            case 1:
                updateLunisolarCalendars(currentDateTime);
            case 3:
                setTimeValue('hebrew-node', calculateHebrewCalendar(currentDateTime));
            case 4:
                setTimeValue('next-solar-eclipse-node', getNextSolarLunarEclipse(currentDateTime, 0));
                setTimeValue('next-lunar-eclipse-node', getNextSolarLunarEclipse(currentDateTime, 0.5));
            case 5:
                updateProposedCalendars(currentDateTime, timezoneOffsetConverted);
            case 6:
                setTimeValue('spring-equinox-node', getSolsticeOrEquinox(currentDateTime, 'SPRING').toUTCString());
                setTimeValue('summer-solstice-node', getSolsticeOrEquinox(currentDateTime, 'SUMMER').toUTCString());
                setTimeValue('autumn-equinox-node', getSolsticeOrEquinox(currentDateTime, 'AUTUMN').toUTCString());
            case 7:
                setTimeValue('winter-solstice-node', getSolsticeOrEquinox(currentDateTime, 'WINTER').toUTCString());
                setTimeValue('sun-longitude-node', getLongitudeOfSun(currentDateTime) + '°');
                setTimeValue('this-new-moon-node', getMoonPhase(currentDateTime, 0).toUTCString());
                setTimeValue('this-first-quarter-moon-node', getMoonPhase(currentDateTime, 0.25).toUTCString());
                setTimeValue('this-full-moon-node', getMoonPhase(currentDateTime, 0.5).toUTCString());
                setTimeValue('this-last-quarter-moon-node', getMoonPhase(currentDateTime, 0.75).toUTCString());
            case 8:
                updateSolarCalendars(currentDateTime, timezoneOffsetConverted);
            case 9:
                updateOtherCalendars(currentDateTime);
                updatePopCultureTimes(currentDateTime, timezoneOffsetConverted);
        }
    }

    // Update if at the beginning of a second
    if ((currentDateTime.getMilliseconds() < updateMilliseconds)||(currentPass===100)) {
        updateComputingTimes(currentDateTime, timezoneOffsetConverted);
        setTimeValue('local-time-node', getGregorianDateTime(currentDateTime, timezoneOffsetConverted).time);
        setTimeValue('utc-node', currentDateTime.toISOString().slice(0, -5));
    }
    
    // Update if at the end of a second
    if ((currentDateTime.getMilliseconds() > 1000-updateMilliseconds)||(currentPass===100)) {
        setTimeValue('millennium-node', calculateMillennium(currentDateTime, timezoneOffsetConverted).toFixed(decimals));
    }

    // Update everything that needs to change constantly
    setTimeValue('julian-day-number-node', getJulianDayNumber(currentDateTime));
    setTimeValue('delta-time-node', getDeltaT(currentDateTime));
    setTimeValue('iso8601-node', currentDateTime.toISOString());
    updateOtherAndDecimalTimes(currentDateTime, timezoneOffsetConverted);
    updateFractionalTimes(currentDateTime, dateInput, timezoneOffsetConverted);
    setTimeValue('minecraft-time-node', getMinecraftTime(currentDateTime, timezoneOffsetConverted));
    setTimeValue('inception-dream-time-node', getInceptionDreamTime(currentDateTime, timezoneOffsetConverted));
    setTimeValue('termina-time-node', getTerminaTime(currentDateTime, timezoneOffsetConverted));
    setTimeValue('stardate-node', getStardate(currentDateTime, timezoneOffsetConverted));
    setTimeValue('us-presidential-terms-node', getCurrentPresidentialTerm(currentDateTime).toFixed(10));
}

// Main function for populating a node
function setTimeValue(type, value) {
    // Update the original node
    const originalNode = document.getElementById(type);
    if (originalNode) {
        originalNode.textContent = value;
    }

    // Update cloned nodes, if any
    const clonedNodes = document.querySelectorAll(`.grid-item .${type}`);
    clonedNodes.forEach(clonedNode => {
        clonedNode.textContent = value;
    });
}

function formatDateTimeForURL(dateTimeString) {
    if (!dateTimeString) return null; // Return null if no string is provided
    // Split the string into the date and time parts (assuming they are separated by ", ")
    const [date, time] = dateTimeString.split(', ');
    // Replace colons in the time with dashes
    const formattedTime = time.replace(/:/g, '-');
    // Return the URL parameter format with an underscore between date and time
    return `${date}_${formattedTime}`;
}

function formatTimezoneForURL(timezone) {
    if (!timezone) return "UTC~00_00";
    // Convert '+' to '~' and ':' to '_'
    return timezone.replace('+', '~').replace(':', '_');
}

// Read the input box and set the date or restart the current time ticker
function changeDateTime(newDateString = '', timezonePassthrough = '') {
    clearInterval(getCurrentUpdateInterval());

    // If newDateString isn't provided, use the input box value
    if (newDateString === '') {
        newDateString = document.getElementById('date-input').value;
    }
    setCalendarType(document.getElementById('calendar-type').value);
    let timezoneChoice = getDatePickerTimezone();
    if (timezonePassthrough) {
        timezoneChoice = timezonePassthrough;
    }

    const currentUrl = new URL(window.location.href);
    // Date was input, add it as an argument
    if (newDateString!=='') {
        currentUrl.searchParams.set("datetime", formatDateTimeForURL(newDateString));
        currentUrl.searchParams.set("timezone", formatTimezoneForURL(timezoneChoice));
        currentUrl.searchParams.set("type", getCalendarType());
        window.history.replaceState(null, '', currentUrl);
        setDatePickerTime(newDateString);
        updateAllNodes(newDateString, timezoneChoice);
    
    // Date was cleared, restart without argument
    } else {
        currentUrl.search = ""; // Removes all query parameters

        // Update the browser's URL without reloading the page
        window.history.replaceState(null, "", currentUrl);
        updateAllNodes(0, getLocalTimezoneOffset(), true);
        // Start repeating update
        setTimeout(() => {
            setCurrentUpdateInterval(setInterval(updateAllNodes, updateMilliseconds));
        }, 1);
    }
}

// Get local timezone for dropdown menu default option
function getLocalTimezoneOffset() {
    const now = new Date();
    const timezoneOffset = now.getTimezoneOffset();
    const offsetHours = Math.floor(Math.abs(timezoneOffset) / 60);
    const offsetMinutes = Math.abs(timezoneOffset) % 60;
    const offsetSign = timezoneOffset > 0 ? "-" : "+";
    return `UTC${offsetSign}${String(offsetHours).padStart(2, '0')}:${String(offsetMinutes).padStart(2, '0')}`;
}