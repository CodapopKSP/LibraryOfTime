/*
    |===================|
    |    Main Script    |
    |===================|

*/

// Settings
const updateMiliseconds = 20;   // Update tick length
const decimals = 10;            // Decimals to show in some nodes

// Global Containers
let selectedNode = '';              // The current selected Node, blank if none
let currentDescriptionTab = [];     // The current arrangement of information to be displayed in the Description Panel
let calendarType = 'gregorian-proleptic';
let gregJulDifference = 0;

const panel = document.getElementById("floating-panel");
const toggleButton = document.getElementById("floating-panel-toggle-button");
let offsetX = 0, offsetY = 0, mouseX = 0, mouseY = 0;


// Node parent elements
const parentElements = {
    'Solar Calendar': document.querySelector('.solar-calendars'),
    'Computing Time': document.querySelector('.computing-time'),
    'Standard Time': document.querySelector('.standard-time'),
    'Decimal Time': document.querySelector('.decimal-time'),
    'Other Time': document.querySelector('.other-time'),
    'Lunisolar Calendar': document.querySelector('.lunisolar-calendars'),
    'Lunar Calendar': document.querySelector('.lunar-calendars'),
    'Proposed Calendar': document.querySelector('.proposed-calendars'),
    'Other Calendar': document.querySelector('.other-calendars'),
    'Astronomical Data': document.querySelector('.astronomical-data'),
    'Pop Culture': document.querySelector('.pop-culture'),
    'Politics': document.querySelector('.politics')
};

const nodeDataArrays = [
    standardTimeData,
    computingTimeData,
    decimalTimeData,
    otherTimeData,
    solarCalendarsData,
    lunisolarCalendarsData,
    lunarCalendarsData,
    proposedCalendars,
    otherCalendars,
    astronomicalData,
    popCultureData,
    politicalCycles
];

// Create the node arrays
nodeDataArrays.forEach(dataArray => {
    dataArray.forEach(item => {
        createNode(item);
    });
});

// Convert chosen timezone into minutes to add
function convertUTCOffsetToMinutes(offsetString) {
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
function parseInputDate(dateInput, timezoneOffset) {
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
    let dateTime = new Date(Date.UTC(0, inputMonth - 1, inputDay, inputHour, inputMinute - offsetInMinutes, inputSecond));

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
function adjustCalendarDate(currentDateTime, calendarType) {
    let gregJulDifference = 0;
    gregJulDifference = differenceInDays(currentDateTime, getRealJulianDate(currentDateTime));
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
function adjustForJulianLiturgical(currentDateTime, gregJulDifference) {
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
function adjustForAstronomical(currentDateTime, gregJulDifference) {
    const startOfGregorian = new Date(1582, 9, 15);
    if (currentDateTime < startOfGregorian) {
        currentDateTime.setDate(currentDateTime.getDate() + gregJulDifference);
    }
    return currentDateTime;
}

function updateAllNodes(dateInput, calendarType, timezoneOffset, firstPass) {

    // Get the current datetime, keeping in mind the timezone, calendar type, and Date() bullshit
    let currentDateTime = dateInput ? parseInputDate(dateInput, timezoneOffset) : new Date();

    // currentPass is used for updating nodes in a staggered fashion. It is equivalent to the current second.
    // 100 is used to update all nodes
    let currentPass = (firstPass || dateInput) ? 100 : currentDateTime.getSeconds();

    // Make adjustments based on calendar choice
    //currentDateTime = adjustCalendarDate(currentDateTime, calendarType);

    // Calculations that are used by multiple nodes
    const julianDay = getJulianDayNumber(currentDateTime)
    const dayFraction = calculateDay(currentDateTime)
    const marsSolDay = getMarsSolDate(julianDay);

    // Check if in the middle of a second, and update in a staggered fashion
    if (((currentDateTime.getMilliseconds() > 500) && (currentDateTime.getMilliseconds() < 500 + updateMiliseconds))||(currentPass===100)) {
        switch (currentPass) {
            case 100: // Update all nodes
            case 1:
                updateLunisolarCalendars(currentDateTime);
            case 3:
                setTimeValue('hebrew-node', calculateHebrewCalendar(currentDateTime));
            case 4:
                setTimeValue('next-solar-eclipse-node', getNextSolarEclipse(currentDateTime, 0));
            case 5:
                updateProposedCalendars(currentDateTime);
            case 6:
                setTimeValue('spring-equinox-node', getCurrentSolsticeOrEquinox(currentDateTime, 'spring').toUTCString());
                setTimeValue('summer-solstice-node', getCurrentSolsticeOrEquinox(currentDateTime, 'summer').toUTCString());
                setTimeValue('autumn-equinox-node', getCurrentSolsticeOrEquinox(currentDateTime, 'autumn').toUTCString());
            case 7:
                const newMoonThisMonth = getNewMoonThisMonth(currentDateTime, 0);
                setTimeValue('winter-solstice-node', getCurrentSolsticeOrEquinox(currentDateTime, 'winter').toUTCString());
                setTimeValue('sun-longitude-node', getLongitudeOfSun(currentDateTime) + '°');
                setTimeValue('this-new-moon-node', newMoonThisMonth.toUTCString());
            case 8:
                updateSolarCalendars(currentDateTime, calendarType);
            case 9:
                updateOtherCalendars(currentDateTime, marsSolDay);
        }
    }

    // Update if at the beginning of a second
    if ((currentDateTime.getMilliseconds() < updateMiliseconds)||(currentPass===100)) {
        updateComputingTimes(currentDateTime, julianDay, marsSolDay);
        setTimeValue('local-time-node', getGregorianDateTime(currentDateTime).time);
        setTimeValue('utc-node', currentDateTime.toISOString().slice(0, -5));
    }
    
    // Update if at the end of a second
    if ((currentDateTime.getMilliseconds() > 1000-updateMiliseconds)||(currentPass===100)) {
        setTimeValue('millennium-node', calculateMillennium(currentDateTime).toFixed(decimals));
    }

    // Update everything that needs to change constantly
    setTimeValue('julian-day-number-node', julianDay);
    setTimeValue('terrestrial-time-node', getTerrestrialTimeOffset(currentDateTime));
    setTimeValue('iso8601-node', currentDateTime.toISOString());
    updateOtherAndDecimalTimes(currentDateTime, dayFraction, marsSolDay);
    updateFractionalTimes(currentDateTime, dayFraction, dateInput);
    setTimeValue('minecraft-time-node', getMinecraftTime(currentDateTime));
    setTimeValue('dream-time-node', getInceptionDreamTime(currentDateTime));
    setTimeValue('termina-time-node', getTerminaTime(currentDateTime));
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


// Read the input box and set the date or restart the current time ticker
function changeDateTime(newDateString = '', timezonePassthrough = '') {
    clearInterval(updateIntervalId);

    // If newDateString isn't provided, use the input box value
    if (newDateString === '') {
        newDateString = document.getElementById('date-input').value;
    }
    calendarType = document.getElementById('calendar-type').value;
    let timezoneChoice = document.getElementById('timezone').value;
    if (timezonePassthrough) {
        timezoneChoice = timezonePassthrough;
    }

    // Date was input, add it as an argument
    if (newDateString!=='') {
        updateAllNodes(newDateString, calendarType, timezoneChoice);
        setTimeout(() => {
            updateIntervalId = setInterval(updateAllNodes(newDateString, calendarType, timezoneChoice), updateMiliseconds);
        }, 1000);
    
    // Date was cleared, restart without argument
    } else {
        updateAllNodes(0, true);
        setTimeout(() => {
            updateIntervalId = setInterval(updateAllNodes, updateMiliseconds);
        }, 1);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    // Masonry Tiling library
    var grid = document.querySelector('.node-wrapper');
    var msnry = new Masonry(grid, {
        itemSelector: '.container',
        columnWidth: '.container',
        percentPosition: true,
    });

    // User's timezone dropdown selection
    const timezoneSelect = document.getElementById('timezone');
    const timezones = [
        'UTC-12:00', 'UTC-11:00', 'UTC-10:00', 'UTC-09:30', 'UTC-09:00',
        'UTC-08:00', 'UTC-07:00', 'UTC-06:00', 'UTC-05:00', 'UTC-04:00',
        'UTC-03:30', 'UTC-03:00', 'UTC-02:00', 'UTC-01:00', 'UTC+00:00',
        'UTC+01:00', 'UTC+02:00', 'UTC+03:00', 'UTC+03:30', 'UTC+04:00',
        'UTC+04:30', 'UTC+05:00', 'UTC+05:30', 'UTC+05:45', 'UTC+06:00',
        'UTC+06:30', 'UTC+07:00', 'UTC+08:00', 'UTC+08:45', 'UTC+09:00',
        'UTC+09:30', 'UTC+10:00', 'UTC+10:30', 'UTC+11:00', 'UTC+12:00',
        'UTC+12:45', 'UTC+13:00', 'UTC+14:00'
    ];
    timezones.forEach(timezone => {
        const option = document.createElement('option');
        option.value = timezone;
        option.text = timezone;
        if (timezone === getFormattedTimezoneOffset()) {
            option.selected = true;
        }
        timezoneSelect.appendChild(option);
    });
});

// Get local timezone for dropdown menu default option
function getFormattedTimezoneOffset() {
    const now = new Date();
    const timezoneOffset = now.getTimezoneOffset();
    const offsetHours = Math.floor(Math.abs(timezoneOffset) / 60);
    const offsetMinutes = Math.abs(timezoneOffset) % 60;
    const offsetSign = timezoneOffset > 0 ? "-" : "+";
    return formattedOffset = `UTC${offsetSign}${String(offsetHours).padStart(2, '0')}:${String(offsetMinutes).padStart(2, '0')}`;
}

// Display the initial Description Panel
homeButton();
changeActiveHeaderTab('header-button-1', 0);

addHeaderTabHoverEffect();
addHomeButtonHoverEffect();
instantiateFloatingPanel();

// Initial update
let updateIntervalId = setInterval(updateAllNodes, updateMiliseconds);
updateAllNodes(0, 'gregorian-proleptic', getFormattedTimezoneOffset(), true);