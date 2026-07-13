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

const chronologyComputingNodeIds = new Set([
    'julian-day-number',
    'julian-period',
    'rata-die',
    'lilian-date',
    'ordinal-date',
    'julian-sol-number',
    'julian-circad-number',
    'kali-ahargana',
    'deltat',
    'mars-sol-date',
    'lunation-number',
    'brown-lunation-number',
    'goldstine-lunation-number',
    'hebrew-lunation-number',
    'islamic-lunation-number',
    'thai-lunation-number',
    'nabonassar-lunation-number'
]);

function splitComputingTypeIntoMachineTimeAndChronology() {
    const computingType = 'Computing Time';
    const machineType = 'Machine Time';
    const chronologyType = 'Chronology';
    const computingArrayIndex = nodeDataArrays.findIndex(function (arr) {
        return Array.isArray(arr) && arr.length > 0 && arr[0].type === computingType;
    });
    if (computingArrayIndex === -1) {
        return;
    }
    const computingItems = nodeDataArrays[computingArrayIndex];
    const machineTimeItems = [];
    const chronologyItems = [];
    computingItems.forEach(function (item) {
        const isChronology = chronologyComputingNodeIds.has(item.id);
        item.type = isChronology ? chronologyType : machineType;
        if (isChronology) {
            chronologyItems.push(item);
        } else {
            machineTimeItems.push(item);
        }
    });
    nodeDataArrays.splice(computingArrayIndex, 1, machineTimeItems, chronologyItems);
}

splitComputingTypeIntoMachineTimeAndChronology();

const julianDerivedSolarNodeIds = new Set([
    'gregorian',
    'julian',
    'astronomical',
    'era-fascista',
    'minguo',
    'thai',
    'juche',
    'byzantine',
    'florentine',
    'pisan',
    'venetian',
    'sca',
    'iso-week-date',
    'anno-lucis'
]);

// Node parent elements
const parentElements = {
    'Solar Calendar': document.querySelector('.solar-calendars'),
    'Solar Calendar (Gregorian/Julian-derived)': document.querySelector('.solar-calendars-gregorian-julian-derived'),
    'Machine Time': document.querySelector('.machine-time'),
    'Chronology': document.querySelector('.chronology'),
    'Standard Time': document.querySelector('.standard-time'),
    'Alternative Time': document.querySelector('.alternative-time'),
    'Extraterrestrial Time': document.querySelector('.extraterrestrial-time'),
    'Extraterrestrial Calendar': document.querySelector('.extraterrestrial-calendars'),
    'Lunisolar Calendar': document.querySelector('.lunisolar-calendars'),
    'Lunar Calendar': document.querySelector('.lunar-calendars'),
    'Solilunar Calendar': document.querySelector('.solilunar-calendars'),
    'Proposed Calendar': document.querySelector('.proposed-calendars'),
    'Other Calendar': document.querySelector('.other-calendars'),
    'Astronomical Data': document.querySelector('.astronomical-data'),
    'Pop Culture': document.querySelector('.pop-culture'),
    'Politics': document.querySelector('.politics')
};

function getParentElementForItem(item) {
    if (item && item.type === 'Solar Calendar' && julianDerivedSolarNodeIds.has(item.id)) {
        return parentElements['Solar Calendar (Gregorian/Julian-derived)'];
    }
    return parentElements[item.type];
}

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
        const parentElement = getParentElementForItem(item);
        if (parentElement) {
            createNode(item, { [item.type]: parentElement });
        }
    });
});

/** Pixels between masonry columns on compact layouts; must match --mobile-node-col-gap in responsive.css (~0.75rem at 16px root). */
function getMainGridMasonryGutter() {
    return window.matchMedia('(max-width: 1024px)').matches ? 12 : 0;
}

/**
 * Desktop only: set --main-grid-col-width so a whole number of columns exactly fills the grid,
 * leaving no dead band next to the description panel. Picks the column count closest to the
 * preferred vh-based width (containers.css fallbacks), so columns stretch or shrink by at most
 * about half a column. Mobile (<=1024px) column widths are owned by responsive.css.
 */
function fitMainGridColumnWidth() {
    if (window.matchMedia('(max-width: 1024px)').matches) {
        document.body.style.removeProperty('--main-grid-col-width');
        return;
    }
    const wrapper = document.querySelector('.node-wrapper');
    if (!wrapper || wrapper.clientWidth <= 0) {
        return;
    }
    const vh = window.innerHeight / 100;
    const colGap = 1 * vh; // .container margin-right
    const preferredColWidth = (document.body.classList.contains('mac-chrome-only') ? 22 : 17) * vh;
    const count = Math.max(2, Math.round(wrapper.clientWidth / (preferredColWidth + colGap)));
    const width = Math.floor(wrapper.clientWidth / count - colGap);
    document.body.style.setProperty('--main-grid-col-width', width + 'px');
}

document.addEventListener('DOMContentLoaded', function () {
    // Larger type + wider cards (see .mac-chrome-only rules): the base vh sizes render too
    // small on Mac Chrome and Mac Firefox, leaving cramped extra columns. Safari keeps the
    // base sizes. Class name is historic — Chrome was detected first.
    if (navigator.platform === "MacIntel" &&
        (navigator.userAgent.includes("Chrome") || navigator.userAgent.includes("Firefox"))) {
        document.body.classList.add("mac-chrome-only");
    }

    // Masonry Tiling library
    fitMainGridColumnWidth();
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
    // Keep picker state in sync with the visible dropdown from first load,
    // so increment buttons use the selected timezone immediately.
    setDatePickerTimezone(selectedTimezone);

    timezoneSelect.addEventListener('change', function () {
        const datePickerTimezone = document.getElementById('timezone').value;
        setDatePickerTimezone(datePickerTimezone);
    });

    // Add event listeners for floating panel controls (add = inline select; wired in userPanel.js).
    // Scoped to the panel: the calendar view reuses these button classes with its own handlers.
    const removeButtons = document.querySelectorAll('#floating-box-node-container .remove-node-button');
    const selectButtons = document.querySelectorAll('#floating-box-node-container .select-node-button');

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
            if (typeof window.revealSelectedGridNode === 'function') {
                window.revealSelectedGridNode(mainContent);
            }
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
    fitMainGridColumnWidth();
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