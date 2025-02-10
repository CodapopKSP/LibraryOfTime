/*
    |===================|
    |    Main Script    |
    |===================|

*/

import * as nodeData from './nodeData.js';
import * as nodeDisplay from './nodeDisplay.js';
import * as descriptionPanel from './descriptionPanel.js';
import * as userPanel from './userPanel.js';
import * as userInterface from './userInterface.js';
import * as utilities from './utilities.js';

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
    nodeData.standardTimeData,
    nodeData.computingTimeData,
    nodeData.decimalTimeData,
    nodeData.otherTimeData,
    nodeData.solarCalendarsData,
    nodeData.lunisolarCalendarsData,
    nodeData.lunarCalendarsData,
    nodeData.proposedCalendars,
    nodeData.otherCalendars,
    nodeData.astronomicalData,
    nodeData.popCultureData,
    nodeData.politicalCycles
];

// Create the node arrays
nodeDataArrays.forEach(dataArray => {
    dataArray.forEach(item => {
        nodeDisplay.createNode(item, parentElements);
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
        if (timezone === userInterface.getFormattedTimezoneOffset()) {
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
userPanel.instantiateFloatingPanel();

// Initial update
userInterface.getCurrentUpdateInterval();
userInterface.updateAllNodes(0, userInterface.getFormattedTimezoneOffset(), true, utilities.updateMiliseconds);