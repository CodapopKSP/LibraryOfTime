/*
    |===================|
    |    Main Script    |
    |===================|

*/

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
setCalendarType(getCalendarTypeFromURL(urlCalendarType));

let needsUpdate_PerSecond = true;
function setNeedsUpdate_PerSecond(newNeedsUpdate_PerSecond) {
    needsUpdate_PerSecond = newNeedsUpdate_PerSecond;
}

function getNeedsUpdate_PerSecond() {
    return needsUpdate_PerSecond;
}

let needsUpdate_PerQuarterHour = true;
function setNeedsUpdate_PerQuarterHour(newNeedsUpdate_PerQuarterHour) {
    needsUpdate_PerQuarterHour = newNeedsUpdate_PerQuarterHour;
}

function getNeedsUpdate_PerQuarterHour() {
    return needsUpdate_PerQuarterHour;
}

let needsUpdate_PerDay = true;
function setNeedsUpdate_PerDay(newNeedsUpdate_PerDay) {
    needsUpdate_PerDay = newNeedsUpdate_PerDay;
}

function getNeedsUpdate_PerDay() {
    return needsUpdate_PerDay;
}

function getDateTimeFromURL(urlDateString) {
    if (!urlDateString) return null; // Return null if no parameter is provided
    const [date, time] = urlDateString.split('_');
    const formattedTime = time.replace(/-/g, ':');
    const newDate = `${date}, ${formattedTime}`;
    setDatePickerTime(newDate);
    return newDate;
}

function getTimezoneFromURL(urlTimezone) {
    if (!urlTimezone) return ""; // Default to UTC
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
    'Solilunar Calendar': document.querySelector('.solilunar-calendars'),
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
    // Detect Mac Chrome and add class to body
    if (navigator.userAgent.includes("Chrome") && navigator.platform === "MacIntel") {
        document.body.classList.add("mac-chrome-only");
    }

    // Masonry Tiling library
    var grid = document.querySelector('.node-wrapper');
    var msnry = new Masonry(grid, {
        itemSelector: '.container',
        columnWidth: '.container',
        percentPosition: true,
    });

    // Get user's local timezone offset
    const localTimezone = getLocalTimezoneOffset();
    
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

    timezoneSelect.addEventListener('change', function () {
        const datePickerTimezone = document.getElementById('timezone').value;
        setDatePickerTimezone(datePickerTimezone);
    });

    // Add event listeners for all add/remove buttons in the floating panel
    const addButtons = document.querySelectorAll('.add-node-button');
    const removeButtons = document.querySelectorAll('.remove-node-button');
    
    addButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            if (selectedNodeData) {
                // Find which panel section this button belongs to
                const panelSection = button.closest('.panel-section');
                const gridItem = panelSection.querySelector('.grid-item');
                const gridNumber = gridItem.className.match(/grid-item(\d+)/)[1];
                nodePlace(selectedNodeData, parseInt(gridNumber));
            }
        });
    });
    
    removeButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            // Find which panel section this button belongs to
            const panelSection = button.closest('.panel-section');
            const gridItem = panelSection.querySelector('.grid-item');
            const gridNumber = gridItem.className.match(/grid-item(\d+)/)[1];
            console.log(`Remove button clicked for grid item ${gridNumber}`);
            
            // Clear the grid item
            gridItem.innerHTML = '';
            
            // Remove any non-grid classes
            gridItem.classList.forEach(className => {
                if (!className.startsWith('grid')) {
                    gridItem.classList.remove(className);
                }
            });
            
            // Set grid item border to 0vh
            gridItem.style.border = '0vh';
        });
    });
});

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

// Display the initial Description Panel
homeButton();
changeActiveHeaderTab('header-button-1', 0);

addHeaderTabHoverEffect();
addHomeButtonHoverEffect();
instantiateFloatingPanel();

// Initial update
if (urlDateString && urlTimezone) {
    updateAllNodes(getDateTimeFromURL(urlDateString), getTimezoneFromURL(urlTimezone), true);
    // Prevent from updating on repeat
    clearInterval(getCurrentUpdateInterval());
} else {
    // Use current date
    updateAllNodes(0, getLocalTimezoneOffset(), true);
}