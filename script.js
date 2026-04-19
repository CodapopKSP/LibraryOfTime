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
    'Alternative Time': document.querySelector('.alternative-time'),
    'Extraterrestrial Time': document.querySelector('.extraterrestrial-time'),
    'Lunisolar Calendar': document.querySelector('.lunisolar-calendars'),
    'Lunar Calendar': document.querySelector('.lunar-calendars'),
    'Solilunar Calendar': document.querySelector('.solilunar-calendars'),
    'Proposed Calendar': document.querySelector('.proposed-calendars'),
    'Other Calendar': document.querySelector('.other-calendars'),
    'Astronomical Data': document.querySelector('.astronomical-data'),
    'Pop Culture': document.querySelector('.pop-culture'),
    'Politics': document.querySelector('.politics')
};

function updateFloatingPanelSlotControls(panelSection) {
    if (!panelSection) {
        return;
    }
    const selectBtn = panelSection.querySelector('.select-node-button');
    const removeBtn = panelSection.querySelector('.remove-node-button');
    const gridItem = panelSection.querySelector('.grid-item');
    const hasNode = !!(gridItem && gridItem.querySelector('.node .content'));
    if (selectBtn) {
        selectBtn.disabled = !hasNode;
    }
    if (removeBtn) {
        removeBtn.disabled = !hasNode;
    }
    if (typeof syncFloatingPanelAddSelectForSection === 'function') {
        syncFloatingPanelAddSelectForSection(panelSection);
    }
}

// Create the node arrays
nodeDataArrays.forEach(dataArray => {
    dataArray.forEach(item => {
        createNode(item, parentElements);
    });
});

/** Pixels between masonry columns on compact layouts; must match --mobile-node-col-gap in responsive.css (~0.75rem at 16px root). */
function getMainGridMasonryGutter() {
    return window.matchMedia('(max-width: 1024px)').matches ? 12 : 0;
}

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
        gutter: getMainGridMasonryGutter(),
    });
    // Expose Masonry instance globally so other scripts can trigger relayouts
    window.msnry = msnry;

    // In-app browsers (e.g. LINE, Facebook) often report a wrong width at DOMContentLoaded;
    // Masonry then lays out as a single column. Re-run after load / next frames / delays.
    scheduleDeferredMasonryRelayouts();

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

    // Add event listeners for floating panel controls (add = inline select; wired in userPanel.js)
    const removeButtons = document.querySelectorAll('.remove-node-button');
    const selectButtons = document.querySelectorAll('.select-node-button');

    document.querySelectorAll('#floating-box-node-container .panel-section').forEach(function (section) {
        updateFloatingPanelSlotControls(section);
    });

    removeButtons.forEach((button) => {
        button.addEventListener('click', function () {
            const panelSection = button.closest('.panel-section');
            const gridItem = panelSection.querySelector('.grid-item');

            gridItem.innerHTML = '';

            gridItem.classList.forEach(className => {
                if (!className.startsWith('grid')) {
                    gridItem.classList.remove(className);
                }
            });

            gridItem.style.border = '0vh';
            updateFloatingPanelSlotControls(panelSection);
        });
    });

    selectButtons.forEach((button) => {
        button.addEventListener('click', function () {
            if (button.disabled) {
                return;
            }
            const panelSection = button.closest('.panel-section');
            const gridItem = panelSection.querySelector('.grid-item');
            const contentEl = gridItem && gridItem.querySelector('.content');
            if (!contentEl || !contentEl.id) {
                return;
            }
            const suffix = '-node';
            if (!contentEl.id.endsWith(suffix)) {
                return;
            }
            const nodeId = contentEl.id.slice(0, -suffix.length);
            const item = findNodeDataById(nodeId);
            if (!item) {
                return;
            }
            const mainContent = document.getElementById(contentEl.id);
            if (!mainContent) {
                return;
            }
            clearDescriptionPanel();
            handleNodeClick(mainContent, item);
            mainContent.classList.add('active');
        });
    });
});

var mainGridMasonryResizeTimer;
window.addEventListener('resize', function () {
    clearTimeout(mainGridMasonryResizeTimer);
    mainGridMasonryResizeTimer = setTimeout(relayoutMasonry, 100);
});

// Safe helper to trigger a Masonry relayout when node sizes or visibility change.
function relayoutMasonry() {
    if (window.msnry && typeof window.msnry.layout === 'function') {
        if (typeof window.msnry.option === 'function') {
            window.msnry.option({ gutter: getMainGridMasonryGutter() });
        }
        if (typeof window.msnry.reloadItems === 'function') {
            window.msnry.reloadItems();
        }
        window.msnry.layout();
    }
}

var mainGridMasonryViewportTimer;
function scheduleDeferredMasonryRelayouts() {
    function run() {
        relayoutMasonry();
    }
    window.addEventListener('load', function () {
        run();
        requestAnimationFrame(function () {
            requestAnimationFrame(run);
        });
        setTimeout(run, 100);
        setTimeout(run, 400);
    });
    if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', function () {
            clearTimeout(mainGridMasonryViewportTimer);
            mainGridMasonryViewportTimer = setTimeout(relayoutMasonry, 100);
        });
    }
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

// Display the initial Description Panel (desktop: home intro; narrow viewports: cleared here, then mobileToolbar opens the introduction sheet every load including refresh — sessionStorage is not used because it survives refresh in the same tab)
if (window.matchMedia && window.matchMedia('(max-width: 1024px)').matches) {
    clearDescriptionPanel();
    const desktopActionsEl = document.getElementById('desktop-description-actions');
    if (desktopActionsEl) {
        desktopActionsEl.classList.remove('home-button-visible');
    }
} else {
    homeButton();
}
changeActiveHeaderTab('header-button-1', 0);
setTimeout(function () {
    if (typeof window.syncMobileDescriptionUi === 'function') {
        window.syncMobileDescriptionUi();
    }
}, 0);

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