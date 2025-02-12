/*
    |======================|
    |    User Interface    |
    |======================|

*/

import * as solarCalendars from './Calendars/solarCalendars.js';
import * as computingTime from './Timekeeping/computingTime.js';
import * as timeFractions from './Timekeeping/timeFractions.js';
import * as nodeUpdate from './nodeUpdate.js';
import * as lunisolarCalendars from './Calendars/lunisolarCalendars.js';
import * as astronomicalData from './Other/astronomicalData.js';
import * as popCulture from './Other/popCulture.js';
import * as politics from './Other/politics.js';
import * as utilities from './utilities.js';


if (typeof document !== 'undefined') {
    document.getElementById('change-date-button')?.addEventListener('click', () => changeDateTime());
}

let _calendarType = 'gregorian-proleptic';
export function getCalendarType() {
    return _calendarType;
}
export function setCalendarType(newCalendarType) {
    _calendarType = newCalendarType;
}

let _gregJulianDifference = 0;
export function getGregJulianDifference() {
    return _gregJulianDifference;
}
export function setGregJulianDifference(newDifference) {
    _gregJulianDifference = newDifference;
}


let _currentUpdateInterval = setInterval(updateAllNodes, utilities.updateMilliseconds);
export function getCurrentUpdateInterval() {
    return _currentUpdateInterval;
}
export function setCurrentUpdateInterval(newInterval) {
    _currentUpdateInterval = newInterval;
}


// Convert chosen timezone into minutes to add
export function convertUTCOffsetToMinutes(offsetString) {
    // Validate the input format
    const regex = /^UTC([+-])(\d{2}):(\d{2})$/;
    const match = offsetString.trim().match(regex);

    // Extract the sign, hours, and minutes from the matched parts
    const sign = match[1] === "+" ? 1 : -1;
    const hours = parseInt(match[2], 10);
    const minutes = parseInt(match[3], 10);

    // Convert the total offset to minutes
    return sign * (hours * 60 + minutes);
}

// Return a formatted dateTime based on the user's date from the input field
export function parseInputDate(dateInput, timezoneOffset) {
    let [inputDate, inputTime] = dateInput.split(', ');
    let BCE = false;

    // Check if the year is BCE and remove the leading '-' if present
    if (inputDate.startsWith('-')) {
        BCE = true;
        inputDate = inputDate.substring(1); // Remove the '-' from the year part
    }

    // Parse date parts
    let [inputYear, inputMonth, inputDay] = inputDate ? inputDate.split('-').map(Number) : [0, 1, 1];
    let [inputHour, inputMinute, inputSecond] = inputTime ? inputTime.split(':').map(Number) : [0, 0, 0];

    // Calculate timezone offset in minutes
    const offsetInMinutes = convertUTCOffsetToMinutes(timezoneOffset);

    // Create a Date object using Date.UTC, setting the year to 0 initially
    let dateTime = new Date(Date.UTC(inputYear, inputMonth - 1, inputDay, inputHour, inputMinute, inputSecond));

    // Adjust by the timezone offset
    dateTime.setUTCMinutes(dateTime.getUTCMinutes() + offsetInMinutes);

    // Set the correct year using setUTCFullYear
    if (BCE) {
        // Handle BCE dates: Negative year
        dateTime.setUTCFullYear(inputYear * -1);
    } else {
        dateTime.setUTCFullYear(inputYear);
    }
    return dateTime;
}

// Calculate display date for user's calendar choice
export function adjustCalendarType(currentDateTime) {
    let gregJulDifference = 0;
    let julianDateParts = solarCalendars.getRealJulianDate(currentDateTime);
    const totalSeconds = (julianDateParts.fractionalDay) * 24 * 60 * 60; // Total seconds in the fraction
    const hours = Math.floor(totalSeconds / 3600); // Get the whole hours
    const minutes = Math.floor((totalSeconds % 3600) / 60); // Remaining minutes
    const seconds = Math.floor(totalSeconds % 60); // Remaining seconds
    let julianDate = new Date(Date.UTC(julianDateParts.year, julianDateParts.month - 1, julianDateParts.day, hours, minutes, seconds));
    julianDate.setTime(julianDate.getTime() - 0.5 * 24 * 60 * 60 * 1000);
    gregJulDifference = utilities.differenceInDays(currentDateTime, julianDate);
    let calendarType = getCalendarType();
    switch (calendarType) {
        case 'julian-liturgical':
            currentDateTime = adjustForJulianLiturgical(currentDateTime, gregJulDifference);
            break;
        case 'astronomical':
            currentDateTime = adjustForAstronomical(currentDateTime, gregJulDifference);
            break;
    }
    return currentDateTime;
}

// Calculate display date if user chooses Julian (Liturtgical)
export function adjustForJulianLiturgical(currentDateTime, gregJulDifference) {
    // No Year 0 exists, so add 1 to negative years
    if (currentDateTime.getFullYear() < 0) {
        currentDateTime.setFullYear(currentDateTime.getFullYear()+1);
    
    // No Year 0 exists, so return current date as fallback
    } else if (currentDateTime.getFullYear()===0) {
        currentDateTime = new Date();
    }
    currentDateTime.setDate(currentDateTime.getDate() + gregJulDifference);
    return currentDateTime;
}

// Calculate display date if user chooses Astronomical
export function adjustForAstronomical(currentDateTime, gregJulDifference) {
    const startOfGregorian = new Date(1582, 9, 15);
    if (currentDateTime < startOfGregorian) {
        currentDateTime.setDate(currentDateTime.getDate() + gregJulDifference);
    }
    return currentDateTime;
}

export function updateAllNodes(dateInput, timezoneOffset, firstPass) {

    let calendarType = getCalendarType();

    // Get the current datetime, keeping in mind the timezone, calendar type, and Date() bullshit
    let currentDateTime = dateInput ? parseInputDate(dateInput, timezoneOffset) : new Date();

    // currentPass is used for updating nodes in a staggered fashion. It is equivalent to the current second.
    // 100 is used to update all nodes
    let currentPass = (firstPass || dateInput) ? 100 : currentDateTime.getSeconds();

    // Make adjustments based on calendar choice
    currentDateTime = adjustCalendarType(currentDateTime);

    // Calculations that are used by multiple nodes
    const julianDay = computingTime.getJulianDayNumber(currentDateTime)
    const dayFraction = timeFractions.calculateDay(currentDateTime)
    const marsSolDay = computingTime.getMarsSolDate(julianDay);

    // Check if in the middle of a second, and update in a staggered fashion
    if (((currentDateTime.getMilliseconds() > 500) && (currentDateTime.getMilliseconds() < 500 + utilities.updateMilliseconds))||(currentPass===100)) {
        switch (currentPass) {
            case 100: // Update all nodes
            case 1:
                nodeUpdate.updateLunisolarCalendars(currentDateTime);
            case 3:
                setTimeValue('hebrew-node', lunisolarCalendars.calculateHebrewCalendar(currentDateTime));
            case 4:
                setTimeValue('next-solar-eclipse-node', astronomicalData.getNextSolarEclipse(currentDateTime, 0));
                setTimeValue('next-lunar-eclipse-node', astronomicalData.getNextSolarEclipse(currentDateTime, 0.5));
            case 5:
                nodeUpdate.updateProposedCalendars(currentDateTime);
            case 6:
                setTimeValue('spring-equinox-node', astronomicalData.getCurrentSolsticeOrEquinox(currentDateTime, 'spring').toUTCString());
                setTimeValue('summer-solstice-node', astronomicalData.getCurrentSolsticeOrEquinox(currentDateTime, 'summer').toUTCString());
                setTimeValue('autumn-equinox-node', astronomicalData.getCurrentSolsticeOrEquinox(currentDateTime, 'autumn').toUTCString());
            case 7:
                setTimeValue('winter-solstice-node', astronomicalData.getCurrentSolsticeOrEquinox(currentDateTime, 'winter').toUTCString());
                setTimeValue('sun-longitude-node', astronomicalData.getLongitudeOfSun(currentDateTime) + '°');
                setTimeValue('this-new-moon-node', astronomicalData.getMoonPhase(currentDateTime, 0).toUTCString());
                setTimeValue('this-first-quarter-moon-node', astronomicalData.getMoonPhase(currentDateTime, 0.25).toUTCString());
                setTimeValue('this-full-moon-node', astronomicalData.getMoonPhase(currentDateTime, 0.5).toUTCString());
                setTimeValue('this-last-quarter-moon-node', astronomicalData.getMoonPhase(currentDateTime, 0.75).toUTCString());
            case 8:
                nodeUpdate.updateSolarCalendars(currentDateTime, calendarType);
            case 9:
                nodeUpdate.updateOtherCalendars(currentDateTime, marsSolDay);
        }
    }

    // Update if at the beginning of a second
    if ((currentDateTime.getMilliseconds() < utilities.updateMilliseconds)||(currentPass===100)) {
        nodeUpdate.updateComputingTimes(currentDateTime, julianDay, marsSolDay);
        setTimeValue('local-time-node', solarCalendars.getGregorianDateTime(currentDateTime).time);
        setTimeValue('utc-node', currentDateTime.toISOString().slice(0, -5));
    }
    
    // Update if at the end of a second
    if ((currentDateTime.getMilliseconds() > 1000-utilities.updateMilliseconds)||(currentPass===100)) {
        setTimeValue('millennium-node', timeFractions.calculateMillennium(currentDateTime).toFixed(utilities.decimals));
    }

    // Update everything that needs to change constantly
    setTimeValue('julian-day-number-node', julianDay);
    setTimeValue('terrestrial-time-node', computingTime.getTerrestrialTimeOffset(currentDateTime));
    setTimeValue('iso8601-node', currentDateTime.toISOString());
    nodeUpdate.updateOtherAndDecimalTimes(currentDateTime, dayFraction, marsSolDay);
    nodeUpdate.updateFractionalTimes(currentDateTime, dayFraction, dateInput);
    setTimeValue('minecraft-time-node', popCulture.getMinecraftTime(currentDateTime));
    setTimeValue('dream-time-node', popCulture.getInceptionDreamTime(currentDateTime));
    setTimeValue('termina-time-node', popCulture.getTerminaTime(currentDateTime));
    setTimeValue('us-presidential-terms-node', politics.getCurrentPresidentialTerm(currentDateTime).toFixed(10));
}

// Main function for populating a node
export function setTimeValue(type, value) {
    if (typeof document === 'undefined') return;  // Prevents execution in Node.js
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

function getURLFormattedTimezone(timezone) {
    if (!timezone) return "UTC~00_00"; // Default URL-safe format

    // Convert '+' to '~' and ':' to '_'
    return timezone.replace('+', '~').replace(':', '_');
}


// Read the input box and set the date or restart the current time ticker
export function changeDateTime(newDateString = '', timezonePassthrough = '') {
    clearInterval(getCurrentUpdateInterval());

    // If newDateString isn't provided, use the input box value
    if (newDateString === '') {
        newDateString = document.getElementById('date-input').value;
    }
    setCalendarType(document.getElementById('calendar-type').value);
    let timezoneChoice = document.getElementById('timezone').value;
    if (timezonePassthrough) {
        timezoneChoice = timezonePassthrough;
    }

    const currentUrl = new URL(window.location.href);
    // Date was input, add it as an argument
    if (newDateString!=='') {
        currentUrl.searchParams.set("datetime", formatDateTimeForURL(newDateString));
        currentUrl.searchParams.set("timezone", getURLFormattedTimezone(timezoneChoice));
        currentUrl.searchParams.set("type", getCalendarType());
        window.history.replaceState(null, '', currentUrl);
        updateAllNodes(newDateString, timezoneChoice);
    
    // Date was cleared, restart without argument
    } else {
        currentUrl.search = ""; // Removes all query parameters

        // Update the browser's URL without reloading the page
        window.history.replaceState(null, "", currentUrl);
        updateAllNodes(0, getFormattedTimezoneOffset(), true);
        // Start repeating update
        setTimeout(() => {
            setCurrentUpdateInterval(setInterval(updateAllNodes, utilities.updateMilliseconds));
        }, 1);
    }
}

// Get local timezone for dropdown menu default option
export function getFormattedTimezoneOffset() {
    const now = new Date();
    const timezoneOffset = now.getTimezoneOffset();
    const offsetHours = Math.floor(Math.abs(timezoneOffset) / 60);
    const offsetMinutes = Math.abs(timezoneOffset) % 60;
    const offsetSign = timezoneOffset > 0 ? "-" : "+";
    return `UTC${offsetSign}${String(offsetHours).padStart(2, '0')}:${String(offsetMinutes).padStart(2, '0')}`;
}