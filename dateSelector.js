/*
    |=======================|
    |    Date Selector      |
    |=======================|

*/

// Keeps track of date picker timezone selection
let _datePickerTimezone = '';
function getDatePickerTimezone() {
    // If null, return current datetime
    if (_datePickerTimezone == "") {
        return `UTC+00:00`;
    }
    return _datePickerTimezone;
}
function setDatePickerTimezone(newTimezone) {
    document.getElementById('timezone').value = newTimezone;
    _datePickerTimezone = newTimezone;
}

// Keeps track of date picker time selection
let _datePickerTime = '';
function getDatePickerTime() {
    // If null, return current datetime
    if (_datePickerTime == "") {
        const now = new Date();
        const pad = n => n.toString().padStart(2, '0');
        return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}, ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    }
    return _datePickerTime;
}

function setDatePickerTime(newTime) {
    document.getElementById('date-input').value = newTime;
    _datePickerTime = newTime;
}

// Add event listeners to the date selector buttons
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

// Adjust the date picker value by a given unit and step, then apply it
function adjustDatePickerField(unit, step) {
    const inputEl = typeof document !== 'undefined' ? document.getElementById('date-input') : null;

    // If the user has typed something, treat that as the canonical picker time
    if (inputEl && inputEl.value) {
        setDatePickerTime(inputEl.value);
    }

    // Always operate on the stored picker time so state stays consistent
    let currentValue = getDatePickerTime();
    if (!currentValue) {
        return;
    }

    // Expect format "yyyy-mm-dd, hh:mm:ss" or "-yyyy-mm-dd, hh:mm:ss" for BCE
    let [datePart, timePart] = currentValue.split(', ');
    if (!datePart) {
        return;
    }

    const pad = (n) => n.toString().padStart(2, '0');

    // Handle possible leading '-' for BCE years
    let bce = false;
    if (datePart.startsWith('-')) {
        bce = true;
        datePart = datePart.substring(1);
    }

    const [rawYearString, monthString, dayString] = datePart.split('-');
    const yearString = rawYearString || '0';
    const [hourString = '0', minuteString = '0', secondString = '0'] = (timePart || '').split(':');

    let year = parseInt(yearString, 10);
    if (bce) {
        year = -year;
    }
    const month = parseInt(monthString || '1', 10);
    const day = parseInt(dayString || '1', 10);
    const hour = parseInt(hourString || '0', 10);
    const minute = parseInt(minuteString || '0', 10);
    const second = parseInt(secondString || '0', 10);

    if (Number.isNaN(year)) {
        return;
    }

    // Work in UTC so we treat the fields as a simple civil date/time
    const workingDate = createAdjustedDateTime({year, month, day, hour, minute, second});

    switch (unit) {
        case 'year':
            workingDate.setUTCFullYear(workingDate.getUTCFullYear() + step);
            break;
        case 'month':
            workingDate.setUTCMonth(workingDate.getUTCMonth() + step);
            break;
        case 'day':
            workingDate.setUTCDate(workingDate.getUTCDate() + step);
            break;
        case 'hour':
            workingDate.setUTCHours(workingDate.getUTCHours() + step);
            break;
        case 'minute':
            workingDate.setUTCMinutes(workingDate.getUTCMinutes() + step);
            break;
        case 'second':
            workingDate.setUTCSeconds(workingDate.getUTCSeconds() + step);
            break;
        default:
            return;
    }

    const newYear = workingDate.getUTCFullYear();
    const newMonth = workingDate.getUTCMonth() + 1;
    const newDay = workingDate.getUTCDate();
    const newHour = workingDate.getUTCHours();
    const newMinute = workingDate.getUTCMinutes();
    const newSecond = workingDate.getUTCSeconds();

    const newValue = `${newYear}-${pad(newMonth)}-${pad(newDay)}, ${pad(newHour)}:${pad(newMinute)}:${pad(newSecond)}`;
    setDatePickerTime(newValue);
    changeDateTime(newValue);
}

// Wire up desktop-only step buttons
if (typeof document !== 'undefined') {
    const stepButtons = document.querySelectorAll('.step-button');
    stepButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const unit = button.getAttribute('data-unit');
            const step = parseInt(button.getAttribute('data-step') || '0', 10);
            if (!unit || !step) {
                return;
            }
            adjustDatePickerField(unit, step);
        });
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
        updateAllNodes(newDateString, timezoneChoice, true);
        if (typeof relayoutMasonry === 'function') {
            relayoutMasonry();
        }

    // Date was cleared, restart without argument
    } else {
        currentUrl.search = ""; // Removes all query parameters

        // Update the browser's URL without reloading the page
        window.history.replaceState(null, "", currentUrl);
        updateAllNodes(0, getLocalTimezoneOffset(), true);
        if (typeof relayoutMasonry === 'function') {
            relayoutMasonry();
        }
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