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

// Display the initial Description Panel
homeButton();
changeActiveHeaderTab('header-button-1', 0);

addHeaderTabHoverEffect();
addHomeButtonHoverEffect();
instantiateFloatingPanel();

// Initial update
let updateIntervalId = setInterval(updateAllNodes, updateMiliseconds);
updateAllNodes(0, 'gregorian-proleptic', getFormattedTimezoneOffset(), true);