/*
    |===================|
    |    Main Script    |
    |===================|

*/

import { nodeDataArrays } from './nodeData.js';
import { createNode } from './nodeDisplay.js';
import * as descriptionPanel from './descriptionPanel.js';
import { instantiateFloatingPanel } from './userPanel.js';
import * as userInterface from './userInterface.js';

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

const urlParameters = new URLSearchParams(window.location.search);
const urlDateString = urlParameters.get('datetime');
const urlTimezone = urlParameters.get('timezone');
const urlCalendarType = urlParameters.get('type');
userInterface.setCalendarType(getCalendarTypeFromURL(urlCalendarType));

function getDateTimeFromURL(urlDateString) {
    if (!urlDateString) return null; // Return null if no parameter is provided
    const [date, time] = urlDateString.split('_');
    const formattedTime = time.replace(/-/g, ':');
    return `${date}, ${formattedTime}`; // Return as a string
}

function getTimezoneFromURL(urlTimezone) {
    if (!urlTimezone) return "UTC+00:00"; // Default to UTC
    // Convert '~' to '+', and '_' to ':'
    const formattedTimezone = urlTimezone.replace('_', ':').replace('~', '+');
    // Check if formatted timezone exists in the valid timezones array
    return timezones.includes(formattedTimezone) ? formattedTimezone : "UTC+00:00";
}

function getCalendarTypeFromURL(urlCalendarType) {
    if (!urlCalendarType) return "gregorian-proleptic"; // Default to Gregorian
    return urlCalendarType;
}

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

// Create the node arrays
nodeDataArrays.forEach(dataArray => {
    dataArray.forEach(item => {
        createNode(item, parentElements);
    });
});

document.addEventListener('DOMContentLoaded', function () {
    // Masonry Tiling library
    var grid = document.querySelector('.node-wrapper');
    var msnry = new Masonry(grid, {
        itemSelector: '.container',
        columnWidth: '.container',
        percentPosition: true,
    });

    // Get user's local timezone offset
    const localTimezone = userInterface.getLocalTimezoneOffset();
    
    // Get URL Timezone parameter
    const urlTimezoneFormatted = getTimezoneFromURL(urlTimezone);

    // Determine which timezone to use (URL timezone if valid, else local timezone)
    const selectedTimezone = timezones.includes(urlTimezoneFormatted) ? urlTimezoneFormatted : localTimezone;

    // Populate the dropdown with timezones
    const timezoneSelect = document.getElementById('timezone');
    timezones.forEach(timezone => {
        const option = document.createElement('option');
        option.value = timezone;
        option.text = timezone;
        if (timezone === selectedTimezone) {
            option.selected = true;
        }
        timezoneSelect.appendChild(option);
    });
});

// Display the initial Description Panel
descriptionPanel.homeButton();
descriptionPanel.changeActiveHeaderTab('header-button-1', 0);

descriptionPanel.addHeaderTabHoverEffect();
descriptionPanel.addHomeButtonHoverEffect();
instantiateFloatingPanel();

// Initial update
if (urlDateString && urlTimezone) {
    userInterface.updateAllNodes(getDateTimeFromURL(urlDateString), getTimezoneFromURL(urlTimezone), true);
    // Prevent from updating on repeat
    clearInterval(userInterface.getCurrentUpdateInterval());
  } else {
    // Use current date
    userInterface.updateAllNodes(0, userInterface.getLocalTimezoneOffset(), true);
  }