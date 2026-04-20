/*
    |=========================|
    |    Description Panel    |
    |=========================|

    This is a collection of functions for drawing and handling the Description Panel.
*/

// Add event listeners for desktop description actions and title button
document.getElementById('desktop-home-button').addEventListener('click', homeButton);
document.getElementById('desktop-calendar-button').addEventListener('click', openSelectedNodeInCalendarView);
document.getElementById('desktop-map-button').addEventListener('click', openSelectedNodeInMapView);
document.getElementById('title-button').addEventListener('click', titleButtonClick);

const mobileDescriptionDismiss = document.getElementById('mobile-description-dismiss');
if (mobileDescriptionDismiss) {
    mobileDescriptionDismiss.addEventListener('click', mobileDescriptionDismissClick);
}
const mobileDescriptionCalendar = document.getElementById('mobile-description-calendar');
if (mobileDescriptionCalendar) {
    mobileDescriptionCalendar.addEventListener('click', openSelectedNodeInCalendarView);
}
const mobileDescriptionMap = document.getElementById('mobile-description-map');
if (mobileDescriptionMap) {
    mobileDescriptionMap.addEventListener('click', openSelectedNodeInMapView);
}

// Attach event listeners to all header buttons
document.getElementById('header-button-1').addEventListener('click', () => changeActiveHeaderTab('header-button-1', 0));
document.getElementById('header-button-2').addEventListener('click', () => changeActiveHeaderTab('header-button-2', 1));
document.getElementById('header-button-3').addEventListener('click', () => changeActiveHeaderTab('header-button-3', 2));
document.getElementById('header-button-4').addEventListener('click', () => changeActiveHeaderTab('header-button-4', 3));

const headerTabs = ['header-button-1', 'header-button-2', 'header-button-3', 'header-button-4'];

// The current arrangement of information to be displayed in the Description Panel
let _currentDescriptionTab = [];

function getCurrentDescriptionTab() {
    return _currentDescriptionTab;
}

function setCurrentDescriptionTab(newTab) {
    if (Array.isArray(newTab)) {
        _currentDescriptionTab = newTab;
    } else {
        throw new Error("setCurrentDescriptionTab expects an array");
    }
}


function addHeaderTabHoverEffect() {
    headerTabs.forEach((tabID) => {
        const tab = document.getElementById(tabID);

        // Add hover event listeners
        tab.addEventListener('mouseenter', () => {
            tab.classList.add('hoveringTab');
        });
        tab.addEventListener('mouseleave', () => {
            tab.classList.remove('hoveringTab');
        });
    });
}

function addHomeButtonHoverEffect() {
    const desktopButtons = document.querySelectorAll('#desktop-home-button, #desktop-calendar-button, #desktop-map-button');
    desktopButtons.forEach((button) => {
        button.addEventListener('mouseenter', () => {
            button.classList.add('hoveringHome');
        });
        button.addEventListener('mouseleave', () => {
            button.classList.remove('hoveringHome');
        });
    });
}

function getDesktopDescriptionActions() {
    return document.getElementById('desktop-description-actions');
}

function isNodeShownOnMap(item) {
    if (!item || !item.id) {
        return false;
    }
    const associatedWith = typeof item.associatedWith === 'string' ? item.associatedWith.trim() : '';
    if (!associatedWith) {
        return false;
    }
    const placements = window.calendarMapPlacements;
    return !!(placements && placements[item.id]);
}

/**
 * Desktop: map button visibility + 2/3-column row. Mobile: Calendar/Map only when a grid node is selected; Map only if on map.
 * @param {object|null|undefined} item Pass null after clearing selection; omit to use current `selectedNodeData`.
 */
function syncDescriptionPanelPrimaryActions(item) {
    if (item === undefined && typeof selectedNodeData !== 'undefined') {
        item = selectedNodeData;
    }
    const actionsWrap = getDesktopDescriptionActions();
    const mapButton = document.getElementById('desktop-map-button');
    if (actionsWrap && mapButton) {
        const showMap = !!(item && isNodeShownOnMap(item));
        mapButton.hidden = !showMap;
        mapButton.setAttribute('aria-hidden', showMap ? 'false' : 'true');
        actionsWrap.classList.toggle('desktop-description-actions--two-buttons', !!(item && !showMap));
    }
    const mobileWrap = document.getElementById('mobile-description-actions');
    const mobileCal = document.getElementById('mobile-description-calendar');
    const mobileMap = document.getElementById('mobile-description-map');
    if (mobileWrap && mobileCal && mobileMap) {
        const hasNode = !!(item && item.id);
        const showMap = hasNode && isNodeShownOnMap(item);
        mobileCal.hidden = !hasNode;
        mobileCal.setAttribute('aria-hidden', hasNode ? 'false' : 'true');
        mobileMap.hidden = !showMap;
        mobileMap.setAttribute('aria-hidden', showMap ? 'false' : 'true');
        mobileWrap.classList.toggle('mobile-description-actions--two-buttons', hasNode && !showMap);
    }
}

window.syncDescriptionPanelPrimaryActions = syncDescriptionPanelPrimaryActions;

function openSelectedNodeInCalendarView() {
    if (typeof selectedNodeData === 'undefined' || !selectedNodeData || !selectedNodeData.id) {
        return;
    }
    if (typeof syncCalendarViewDisplayFromMainSelection === 'function') {
        syncCalendarViewDisplayFromMainSelection(selectedNodeData.id);
    }
    if (typeof openCalendarView === 'function') {
        openCalendarView();
    }
}

function openSelectedNodeInMapView() {
    if (typeof selectedNodeData === 'undefined' || !selectedNodeData || !selectedNodeData.id) {
        return;
    }
    if (!isNodeShownOnMap(selectedNodeData)) {
        return;
    }
    if (typeof window.openMapViewForNodeId === 'function') {
        window.openMapViewForNodeId(selectedNodeData.id, { resetPanZoom: true });
    }
}

// Create descriptions for Home Page tabs
const homePageDescriptions = {
    about: createHomePageDescription('about', 'home-info'),
    mission: createHomePageDescription('mission', 'home-mission'),
    accuracy: createHomePageDescription('accuracy', 'home-accuracy'),
    sources: createHomePageDescription('sources', 'home-sources'),
};

function setupScrollFade(scrollableElement, containerElement) {
    const updateFadeOpacity = () => {
        const scrollTop = scrollableElement.scrollTop;
        const scrollHeight = scrollableElement.scrollHeight;
        const clientHeight = scrollableElement.clientHeight;
        // Treat sub-pixel overflow as no scroll so the gradient doesn’t show as a false “more below” cue
        const scrollable = scrollHeight - clientHeight;

        if (scrollable <= 1) {
            // No scroll, hide fade completely
            containerElement.style.setProperty('--fade-opacity', '0');
            containerElement.classList.remove('fade-visible');
            return;
        }

        const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
        const ratio = Math.min(1, distanceFromBottom / 40);
        containerElement.style.setProperty('--fade-opacity', ratio.toFixed(2));
        containerElement.classList.add('fade-visible');
    };

    // Run once layout is ready
    requestAnimationFrame(updateFadeOpacity);
    
    // Also run after a short delay to ensure content is fully rendered
    setTimeout(updateFadeOpacity, 100);
    
    // Run again after images and other content load
    window.addEventListener('load', updateFadeOpacity);
    
    scrollableElement.addEventListener('scroll', updateFadeOpacity);

    if (typeof ResizeObserver !== 'undefined') {
        const resizeObserver = new ResizeObserver(() => {
            requestAnimationFrame(updateFadeOpacity);
        });
        resizeObserver.observe(scrollableElement);
    }
}

function createHomePageDescription(contentKey, contentClass) {
    const description = document.createElement('div');
    description.classList.add('nodeinfo', 'homepage');

    const contentElement = document.createElement('div');
    contentElement.innerHTML = welcomeDescription[0][contentKey];
    contentElement.classList.add(contentClass);

    // Apply scroll-fade logic
    setupScrollFade(contentElement, description);

    description.appendChild(contentElement);
    return description;
}

function createNodeDescription(item, type) {
    const description = document.createElement('div');
    description.id = `${item.id}-nodeinfo-${type}`;
    description.classList.add('nodeinfo');

    // Create and append the title
    description.appendChild(createTitleElement(item.name));

    let contentElement;

    if (type === 'overview') {
        // For 'overview', create the sub-elements
        description.appendChild(createEpochElement(item));
        description.appendChild(createConfidenceElement(item));

        const overviewElement = document.createElement('div');
        overviewElement.innerHTML = item.overview;
        overviewElement.classList.add('nodeinfo-overview');

        description.appendChild(overviewElement);
        contentElement = overviewElement;
    } else {
        // For 'info', 'accuracy', 'source'
        contentElement = document.createElement('div');
        contentElement.innerHTML = item[type];
        contentElement.classList.add(`nodeinfo-${type}`);
        description.appendChild(contentElement);
    }

    // Set up scroll fade
    setupScrollFade(contentElement, description);

    return description;
}


function createTitleElement(name) {
    const titleElement = document.createElement('div');
    titleElement.textContent = name;
    titleElement.classList.add('nodeinfo-title');
    return titleElement;
}

/** Closes any open mobile epoch “Go to Date” popover (listeners + DOM). */
let dismissActiveEpochTooltip = null;

/**
 * Collapses all whitespace (including newlines) so epoch strings from the panel
 * or docs parse the same as a single-line "1 January 1950 CE +10:00:00" form.
 */
function normalizeEpochStringForParsing(epochStr) {
    return String(epochStr).replace(/\s+/g, ' ').trim();
}

/**
 * Renders calendar epochs on two lines when a parseable tail follows the calendar date:
 * - Era + UTC offset: "1 January 1950 CE" / "+10:00:00" (optional comma after era)
 * - Era + wall time (no leading +): "12 March 1609 CE" / "18:40:06"
 * - Year + signed offset (no era): "31 December 2001" / "+16:07:45"
 * Other values (e.g. "Midnight", "Unknown") unchanged.
 */
function formatEpochDisplayForPanel(epoch) {
    if (epoch == null || typeof epoch !== 'string') return epoch;
    const singleLine = normalizeEpochStringForParsing(epoch);
    // Era + signed offset (e.g. "544 BCE, +17:00:00")
    const eraTz = singleLine.match(/^(.+?(?:BCE|CE))[\s,]*([+-]\s*\d{1,2}:\d{2}:\d{2})\s*$/);
    if (eraTz) {
        const tzDisplay = eraTz[2].replace(/\s+/g, '');
        return `${eraTz[1]}\n${tzDisplay}`;
    }
    // Era + clock time without leading + (e.g. "12 March 1609 CE, 18:40:06")
    const eraClock = singleLine.match(/^(.+?(?:BCE|CE))[\s,]*(\d{1,2}:\d{2}(?::\d{2})?)\s*$/);
    if (eraClock) {
        return `${eraClock[1]}\n${eraClock[2]}`;
    }
    // Date + signed offset, no era (e.g. Darian/Galilean: "13 March 1609 +05:29:26")
    const dateOffset = singleLine.match(/^(.+?)\s+([+-]\s*\d{1,2}:\d{2}:\d{2})\s*$/);
    if (dateOffset) {
        const off = dateOffset[2].replace(/\s+/g, '');
        return `${dateOffset[1]}\n${off}`;
    }
    return singleLine;
}

function createEpochElement(item) {
    const epochElement = document.createElement('div');
    epochElement.innerHTML = `
        <div class="epoch-block-wrap">
            <table class="table-epoch">
                <tr><th><b>Epoch</b></th></tr>
                <tr><td class="clickable-epoch">
                    <span class="epoch-value-text"></span>
                    <span class="epoch-external-wrap" aria-hidden="true"></span>
                </td></tr>
            </table>
        </div>`;
    epochElement.classList.add('nodeinfo-epoch');

    const valueEl = epochElement.querySelector('.epoch-value-text');
    if (valueEl) {
        valueEl.textContent = formatEpochDisplayForPanel(item.epoch);
    }

    const epochDateElement = epochElement.querySelector('.clickable-epoch');

    const tooltip = document.createElement('div');
    tooltip.className = 'epoch-action-tooltip';
    tooltip.setAttribute('hidden', '');
    tooltip.setAttribute('role', 'dialog');
    tooltip.setAttribute('aria-label', 'Epoch actions');
    const goBtn = document.createElement('button');
    goBtn.type = 'button';
    goBtn.className = 'epoch-tooltip-go-btn';
    goBtn.textContent = 'Go to Date';
    tooltip.appendChild(goBtn);

    const goToEpochDate = function () {
        handleEpochClick(item.epoch);
    };

    function isMobileDescriptionLayout() {
        return window.matchMedia('(max-width: 1024px)').matches;
    }

    function updateTooltipPosition() {
        const rect = epochDateElement.getBoundingClientRect();
        const pad = 8;
        const tw = tooltip.offsetWidth;
        const th = tooltip.offsetHeight;
        let left = rect.left + rect.width / 2 - tw / 2;
        left = Math.max(pad, Math.min(left, window.innerWidth - tw - pad));
        let top = rect.bottom + 6;
        if (top + th > window.innerHeight - pad) {
            top = rect.top - th - 6;
        }
        top = Math.max(pad, Math.min(top, window.innerHeight - th - pad));
        tooltip.style.left = left + 'px';
        tooltip.style.top = top + 'px';
    }

    function onOutsideClick(e) {
        if (tooltip.hasAttribute('hidden')) return;
        if (tooltip.contains(e.target) || epochDateElement.contains(e.target)) return;
        hideEpochTooltip();
    }

    function onEscape(e) {
        if (e.key === 'Escape') hideEpochTooltip();
    }

    function onResizeReposition() {
        if (!tooltip.hasAttribute('hidden')) updateTooltipPosition();
    }

    function onScrollClose() {
        hideEpochTooltip();
    }

    function hideEpochTooltip() {
        if (tooltip.hasAttribute('hidden')) return;
        tooltip.setAttribute('hidden', '');
        document.removeEventListener('click', onOutsideClick, true);
        document.removeEventListener('keydown', onEscape, true);
        window.removeEventListener('resize', onResizeReposition);
        window.removeEventListener('scroll', onScrollClose, true);
        if (tooltip.parentNode === document.body) {
            document.body.removeChild(tooltip);
        }
        if (dismissActiveEpochTooltip === hideEpochTooltip) {
            dismissActiveEpochTooltip = null;
        }
    }

    function showEpochTooltip() {
        if (dismissActiveEpochTooltip) dismissActiveEpochTooltip();
        document.body.appendChild(tooltip);
        tooltip.removeAttribute('hidden');
        requestAnimationFrame(() => {
            updateTooltipPosition();
            requestAnimationFrame(updateTooltipPosition);
        });
        setTimeout(() => {
            document.addEventListener('click', onOutsideClick, true);
            document.addEventListener('keydown', onEscape, true);
        }, 0);
        window.addEventListener('resize', onResizeReposition);
        window.addEventListener('scroll', onScrollClose, true);
        dismissActiveEpochTooltip = hideEpochTooltip;
    }

    function toggleEpochTooltip() {
        if (tooltip.hasAttribute('hidden')) {
            showEpochTooltip();
        } else {
            hideEpochTooltip();
        }
    }

    epochDateElement.addEventListener('click', function (e) {
        if (isMobileDescriptionLayout()) {
            e.stopPropagation();
            toggleEpochTooltip();
        } else {
            goToEpochDate();
        }
    });

    goBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        goToEpochDate();
        hideEpochTooltip();
    });

    epochDateElement.addEventListener('mouseenter', function () {
        epochDateElement.classList.add('hovering');
    });
    epochDateElement.addEventListener('mouseleave', function () {
        epochDateElement.classList.remove('hovering');
    });

    return epochElement;
}

function handleEpochClick(epoch) {
    let epoch_ = epoch;
    let timePicked = "UTC+00:00";

    // Most clocks
    if (epoch==='Midnight') {
        timePicked = getDatePickerTimezone();
        const now = parseInputDate(getDatePickerTime(), timePicked); // Get current URL or datePicker time
        const hours = '00';
        const minutes = '00';
        const seconds = '00';
        epoch_ = `${now.getUTCDate()} ${monthNames[now.getUTCMonth()]} ${now.getUTCFullYear()} +${hours}:${minutes}:${seconds}`;
    }

    // Sunrise
    if (epoch==='Sunrise') {
        timePicked = getDatePickerTimezone();
        const now = parseInputDate(getDatePickerTime(), timePicked); // Get current URL or datePicker time
        const hours = '06';
        const minutes = '00';
        const seconds = '00';
        epoch_ = `${now.getUTCDate()} ${monthNames[now.getUTCMonth()]} ${now.getUTCFullYear()} +${hours}:${minutes}:${seconds}`;
    }

    // .beat (BMT)
    if (epoch==='Midnight (BMT)') {
        timePicked = 'UTC+00:00';
        const now = parseInputDate(getDatePickerTime(), timePicked); // Get current URL or datePicker time
        const hours = '23';
        const minutes = '00';
        const seconds = '00';
        epoch_ = `${now.getUTCDate()} ${monthNames[now.getUTCMonth()]} ${now.getUTCFullYear()} +${hours}:${minutes}:${seconds}`;
    }

    // UTC (Standard Time)
    if (epoch==='Midnight (UTC)') {
        const now = parseInputDate(getDatePickerTime(), timePicked); // Get current URL or datePicker time
        epoch_ = `${now.getUTCDate()} ${monthNames[now.getUTCMonth()]} ${now.getUTCFullYear()}`;
        timePicked = 'UTC+00:00';
    }

    // Termina Time (Slowed)
    if (epoch==='6:00:00') {
        timePicked = getDatePickerTimezone();
        const now = parseInputDate(getDatePickerTime(), timePicked); // Get current URL or datePicker time
        const hours = '6';
        const minutes = '00';
        const seconds = '00';
        epoch_ = `${now.getUTCDate()} ${monthNames[now.getUTCMonth()]} ${now.getUTCFullYear()} +${hours}:${minutes}:${seconds}`;
    }

    // Thai Time
    if (epoch==='1:00:00') {
        timePicked = getDatePickerTimezone();
        const now = parseInputDate(getDatePickerTime(), timePicked); // Get current URL or datePicker time
        const hours = '1';
        const minutes = '00';
        const seconds = '00';
        epoch_ = `${now.getUTCDate()} ${monthNames[now.getUTCMonth()]} ${now.getUTCFullYear()} +${hours}:${minutes}:${seconds}`;
    }

    // Maya Calendars and any others
    if (epoch==='Unknown') {
        return;
    }

    // Yuga Cycle
    if (epoch==='3,891,102 BCE') {
        return;
    }

    // Every Second/Minute/Hour/Day - All Midnight
    if ((epoch==='Every Second') || (epoch==='Every Minute') || (epoch==='Every Hour') || (epoch==='Every Day')) {
        const now = parseInputDate(getDatePickerTime(), timePicked); // Get current URL or datePicker time
        epoch_ = `${now.getUTCDate()} ${monthNames[now.getUTCMonth()]} ${now.getUTCFullYear()}`;
        timePicked = '';
    }

    // Every Month
    if (epoch==='Every Month') {
        const now = parseInputDate(getDatePickerTime(), timePicked); // Get current URL or datePicker time
        epoch_ = `${1} ${monthNames[now.getUTCMonth()]} ${now.getUTCFullYear()}`;
        timePicked = '';
    }

    // Every Year
    if (epoch==='Every Year') {
        const now = parseInputDate(getDatePickerTime(), timePicked); // Get current URL or datePicker time
        epoch_ = `${1} ${'January'} ${now.getUTCFullYear()}`;
        timePicked = '';
    }

    // Every Decade
    if (epoch === 'Every Decade') {
        const now = parseInputDate(getDatePickerTime(), timePicked); // Get current URL or datePicker time
        const year = now.getUTCFullYear();
        const centuryYear = Math.floor(year / 10) * 10 + 1;
        epoch_ = `${1} January ${centuryYear}`;
        timePicked = getDatePickerTimezone();
    }

    // Every Century
    if (epoch === 'Every Century') {
        const now = parseInputDate(getDatePickerTime(), timePicked); // Get current URL or datePicker time
        const year = now.getUTCFullYear();
        const centuryYear = Math.floor(year / 100) * 100 + 1;
        epoch_ = `${1} January ${centuryYear}`;
        timePicked = getDatePickerTimezone();
    }

    // Every Millennium
    if (epoch === 'Every Millennium') {
        const now = parseInputDate(getDatePickerTime(), timePicked); // Get current URL or datePicker time
        const year = now.getUTCFullYear();
        const millenniumYear = Math.floor(year / 1000) * 1000 + 1;
        epoch_ = `${1} January ${millenniumYear}`;
        timePicked = getDatePickerTimezone();
    }

    // Equinoxes and Solstices
    if (epoch === 'Northward Equinox') {
        timePicked = getDatePickerTimezone();
        let timezoneOffset = convertUTCOffsetToMinutes(timePicked); // Get current timezone setting
        const now = parseInputDate(getDatePickerTime(), timePicked); // Get current URL or datePicker time
        let target = getSolsticeOrEquinox(now, 'SPRING');
        target.setTime(target.getTime() + (timezoneOffset*1000*60));

        const hours = String(target.getUTCHours()).padStart(2, '0');
        const minutes = String(target.getUTCMinutes()).padStart(2, '0');
        const seconds = String(target.getUTCSeconds()).padStart(2, '0');
        epoch_ = `${target.getUTCDate()} ${monthNames[target.getUTCMonth()]} ${target.getUTCFullYear()} +${hours}:${minutes}:${seconds}`;
    }
    if (epoch === 'Northern Solstice') {
        timePicked = getDatePickerTimezone();
        let timezoneOffset = convertUTCOffsetToMinutes(timePicked); // Get current timezone setting
        const now = parseInputDate(getDatePickerTime(), timePicked); // Get current URL or datePicker time
        let target = getSolsticeOrEquinox(now, 'SUMMER');
        target.setTime(target.getTime() + (timezoneOffset*1000*60));

        const hours = String(target.getUTCHours()).padStart(2, '0');
        const minutes = String(target.getUTCMinutes()).padStart(2, '0');
        const seconds = String(target.getUTCSeconds()).padStart(2, '0');
        epoch_ = `${target.getUTCDate()} ${monthNames[target.getUTCMonth()]} ${target.getUTCFullYear()} +${hours}:${minutes}:${seconds}`;
    }
    if (epoch === 'Southward Equinox') {
        timePicked = getDatePickerTimezone();
        let timezoneOffset = convertUTCOffsetToMinutes(timePicked); // Get current timezone setting
        const now = parseInputDate(getDatePickerTime(), timePicked); // Get current URL or datePicker time
        let target = getSolsticeOrEquinox(now, 'AUTUMN');
        target.setTime(target.getTime() + (timezoneOffset*1000*60));

        const hours = String(target.getUTCHours()).padStart(2, '0');
        const minutes = String(target.getUTCMinutes()).padStart(2, '0');
        const seconds = String(target.getUTCSeconds()).padStart(2, '0');
        epoch_ = `${target.getUTCDate()} ${monthNames[target.getUTCMonth()]} ${target.getUTCFullYear()} +${hours}:${minutes}:${seconds}`;
    }
    if (epoch === 'Southern Solstice') {
        timePicked = getDatePickerTimezone();
        let timezoneOffset = convertUTCOffsetToMinutes(timePicked); // Get current timezone setting
        const now = parseInputDate(getDatePickerTime(), timePicked); // Get current URL or datePicker time
        let target = getSolsticeOrEquinox(now, 'WINTER');
        target.setTime(target.getTime() + (timezoneOffset*1000*60));

        const hours = String(target.getUTCHours()).padStart(2, '0');
        const minutes = String(target.getUTCMinutes()).padStart(2, '0');
        const seconds = String(target.getUTCSeconds()).padStart(2, '0');
        epoch_ = `${target.getUTCDate()} ${monthNames[target.getUTCMonth()]} ${target.getUTCFullYear()} +${hours}:${minutes}:${seconds}`;
    }

    // Moon Phases
    if (epoch === 'New Moon' || epoch === 'First Quarter Moon' || epoch === 'Full Moon' || epoch === 'Last Quarter Moon') {
        timePicked = getDatePickerTimezone();
        let timezoneOffset = convertUTCOffsetToMinutes(timePicked); // Get current timezone setting
        const now = parseInputDate(getDatePickerTime(), timePicked); // Get current URL or datePicker time
        const y = now.getUTCFullYear();
        const m = now.getUTCMonth() + 1;
        const phaseType = epoch === 'New Moon' ? 0 : epoch === 'First Quarter Moon' ? 0.25 : epoch === 'Full Moon' ? 0.5 : 0.75;
        let target = getMoonPhaseInMonth(y, m, phaseType);
        target.setTime(target.getTime() + (timezoneOffset*1000*60));

        const hours = String(target.getUTCHours()).padStart(2, '0');
        const minutes = String(target.getUTCMinutes()).padStart(2, '0');
        const seconds = String(target.getUTCSeconds()).padStart(2, '0');
        epoch_ = `${target.getUTCDate()} ${monthNames[target.getUTCMonth()]} ${target.getUTCFullYear()} +${hours}:${minutes}:${seconds}`;
    }

    // Eclipses
    if (epoch === 'Next Solar Eclipse') {
        timePicked = getDatePickerTimezone();
        let timezoneOffset = convertUTCOffsetToMinutes(timePicked);
        const now = parseInputDate(getDatePickerTime(), timePicked); // Get current URL or datePicker time
        let targetRaw = getNextSolarLunarEclipse(now, 0);

        // Extract the first line (the date)
        let dateString = targetRaw.split('\n')[0].trim();

        // Parse toUTCString line without new Date(str) — years 0001–0099 map to 1901–1999 in ES
        let target = parseDateFromUTCStringLine(dateString);
        if (!target) {
            target = new Date(dateString);
        }

        // Apply timezone offset
        target.setTime(target.getTime() + (timezoneOffset * 1000 * 60));

        // Format the date output
        const hours = String(target.getUTCHours()).padStart(2, '0');
        const minutes = String(target.getUTCMinutes()).padStart(2, '0');
        const seconds = String(target.getUTCSeconds()).padStart(2, '0');
        epoch_ = `${target.getUTCDate()} ${monthNames[target.getUTCMonth()]} ${target.getUTCFullYear()} +${hours}:${minutes}:${seconds}`;
    }
    if (epoch === 'Next Lunar Eclipse') {
        timePicked = getDatePickerTimezone();
        let timezoneOffset = convertUTCOffsetToMinutes(timePicked); // Get current timezone setting
        const now = parseInputDate(getDatePickerTime(), timePicked); // Get current URL or datePicker time
        let targetRaw = getNextSolarLunarEclipse(now, 0.5);

        // Extract the first line (the date)
        let dateString = targetRaw.split('\n')[0].trim();

        // Parse toUTCString line without new Date(str) — years 0001–0099 map to 1901–1999 in ES
        let target = parseDateFromUTCStringLine(dateString);
        if (!target) {
            target = new Date(dateString);
        }

        // Apply timezone offset
        target.setTime(target.getTime() + (timezoneOffset * 1000 * 60));

        // Format the date output
        const hours = String(target.getUTCHours()).padStart(2, '0');
        const minutes = String(target.getUTCMinutes()).padStart(2, '0');
        const seconds = String(target.getUTCSeconds()).padStart(2, '0');
        epoch_ = `${target.getUTCDate()} ${monthNames[target.getUTCMonth()]} ${target.getUTCFullYear()} +${hours}:${minutes}:${seconds}`;
    }

    // Most calendars
    const datePicked = formatDateTime(epoch_);
    setDatePickerTimezone(timePicked);
    changeDateTime(datePicked, timePicked);

    if (typeof window.closeMobileDescriptionSheet === 'function') {
        window.closeMobileDescriptionSheet();
    }
}


function formatDateTime(dateString) {

    let date = new Date();
    let year;
    let month;
    let dayFormatted;
    let formattedDate;
    let formattedTime = '00:00:00';

    dateString = normalizeEpochStringForParsing(dateString);

    // Handle BCE/CE
    let era = '';
    if (dateString.includes('BCE')) {
        era = 'BCE';
        dateString = dateString.replace('BCE', '').trim();
    } else if (dateString.includes('CE')) {
        era = 'CE';
        dateString = dateString.replace('CE', '').trim();
    }

    // Extract the date and time parts
    let [datePart, timePart] = dateString.split('+');

    // Extract the day, month, and year from the date part
    let [day, monthStr, yearStr] = datePart.split(' ');
    const inputYear = parseInt(yearStr, 10);
    const monthIndex = monthNames.indexOf(monthStr);

    // Create a new Date object with the proper day, month, and year
    date = new Date(Date.UTC(inputYear, monthIndex, parseInt(day, 10)));

    // Set the actual year correctly using setUTCFullYear for BCE/CE
    date.setUTCFullYear(era === 'BCE' ? -inputYear : inputYear);

    // Handle time part (optional)
    if (timePart) {
        // Format time into hh:mm:ss
        const [hours, minutes, seconds] = timePart.split(':');
        formattedTime = `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
    }

    // Format the date into yyyy-mm-dd
    year = String(date.getUTCFullYear());
    month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    dayFormatted = String(date.getUTCDate()).padStart(2, '0');

    
    formattedDate = `${year}-${month}-${dayFormatted}`;

    // Return formatted date and time
    return `${formattedDate}, ${formattedTime}`;
}

function createConfidenceElement(item) {
    const confidenceMap = {
        "Exact": confidenceDescription[0].confidenceExact,
        "High": confidenceDescription[0].confidenceHigh,
        "Medium": confidenceDescription[0].confidenceMedium,
        "Low": confidenceDescription[0].confidenceLow
    };

    const specificInfo = confidenceMap[item.confidence] || "";
    const generalNote = confidenceDescription[0].confidenceNote;

    const confidenceElement = document.createElement('div');
    confidenceElement.classList.add('nodeinfo-confidence');

    confidenceElement.innerHTML = `
        <table class="table-confidence">
            <tr><th><b>Confidence: ${item.confidence}</b></th></tr>
        </table>
        <div class="tooltiptext">
            <div style="font-family: var(--ui-font-body); font-weight: bold; font-size: 16px; margin-bottom: 8px;">
                Confidence Criteria
            </div>
            ${specificInfo}
            <hr style="margin: 12px 0; border: none; border-top: 1px solid #aaa;">
            ${generalNote}
        </div>
    `;

    return confidenceElement;
}


function changeActiveHeaderTab(activeTab, index) {
    // Toggle active tab header
    headerTabs.forEach((tabID) => {
        const tab = document.getElementById(tabID);
        const isSelected = tabID === activeTab;
        tab.classList.toggle('activeTab', isSelected);
    });

    // Toggle tab info
    getCurrentDescriptionTab().forEach((page, i) => {
        page.classList.toggle('activePage', i === index);
    });
}

function fillHomeDescriptionPanelContent() {
    const descriptionBody = document.getElementById('description-body');
    descriptionBody.classList.remove('has-home-footer');
    Object.values(homePageDescriptions).forEach(description => {
        descriptionBody.appendChild(description);
    });
    setCurrentDescriptionTab(Object.values(homePageDescriptions));
    updateHeaderTabTitles(['About', 'Mission', 'Accuracy', 'Sources']);
    changeActiveHeaderTab('header-button-1', 0);
}

/** Site introduction (About / Mission / …) without clearing the selected node — used on mobile from the About toolbar and title tap. */
function showHomeIntroductionInDescriptionPanel() {
    clearDescriptionPanel();
    fillHomeDescriptionPanelContent();
    const desktopActions = getDesktopDescriptionActions();
    if (desktopActions && (typeof window.hasSelectedDescriptionNode !== 'function' || !window.hasSelectedDescriptionNode())) {
        desktopActions.classList.remove('home-button-visible');
    }
    if (typeof window.syncMobileDescriptionUi === 'function') {
        window.syncMobileDescriptionUi();
    }
}

function titleButtonClick() {
    if (window.matchMedia && window.matchMedia('(max-width: 1024px)').matches) {
        showHomeIntroductionInDescriptionPanel();
        if (typeof window.openMobileDescriptionSheet === 'function') {
            window.openMobileDescriptionSheet();
        }
    } else {
        homeButton();
    }
}

function mobileDescriptionDismissClick() {
    if (window.matchMedia && window.matchMedia('(max-width: 1024px)').matches) {
        clearMobileDescriptionAndSelection();
    } else {
        homeButton();
    }
}

/** Mobile: clear node selection, close the description sheet, and disable the Description toolbar control. */
function clearMobileDescriptionAndSelection() {
    clearDescriptionPanel();
    clearSelectedNode();
    const desktopActions = getDesktopDescriptionActions();
    if (desktopActions) {
        desktopActions.classList.remove('home-button-visible');
    }
    if (typeof window.closeMobileDescriptionSheet === 'function') {
        window.closeMobileDescriptionSheet();
    }
    syncDescriptionPanelPrimaryActions(null);
    if (typeof window.onMobileDescriptionDismissed === 'function') {
        window.onMobileDescriptionDismissed();
    }
}

function homeButton() {
    clearDescriptionPanel();
    clearSelectedNode();
    const desktopActions = getDesktopDescriptionActions();
    if (desktopActions) {
        desktopActions.classList.remove('home-button-visible');
    }
    syncDescriptionPanelPrimaryActions(null);
    fillHomeDescriptionPanelContent();
}

function updateHeaderTabTitles(labels) {
    headerTabs.forEach((btnId, index) => {
        const btn = document.getElementById(btnId);
        btn.innerHTML = `<b>${labels[index]}</b>`;
    });
}

function clearDescriptionPanel() {
    if (dismissActiveEpochTooltip) {
        dismissActiveEpochTooltip();
    }
    document.querySelectorAll('.epoch-action-tooltip').forEach(el => el.remove());
    const nodeinfos = document.querySelectorAll('.nodeinfo');
    nodeinfos.forEach(nodeinfo => {
        nodeinfo.parentNode.removeChild(nodeinfo);
    });
}

// Expand button functionality for mobile
let isDescriptionExpanded = false;
const expandButton = document.getElementById('expand-description-button');
const descriptionWrapper = document.querySelector('.description-wrapper');
const pageWrapper = document.querySelector('.page-wrapper');

// Initialize the collapsed state for iOS Safari compatibility
if (descriptionWrapper) {
    descriptionWrapper.classList.add('collapsed');
}

if (expandButton && pageWrapper && descriptionWrapper) {
    expandButton.addEventListener('click', function() {
        isDescriptionExpanded = !isDescriptionExpanded;
        
        if (isDescriptionExpanded) {
            pageWrapper.classList.add('description-panel-expanded');
            descriptionWrapper.classList.remove('collapsed');
            expandButton.textContent = 'Collapse';
        } else {
            pageWrapper.classList.remove('description-panel-expanded');
            descriptionWrapper.classList.add('collapsed');
            expandButton.textContent = 'Expand';
        }
        
        // Update fade effects after height change
        setTimeout(() => {
            const nodeinfos = document.querySelectorAll('.nodeinfo');
            nodeinfos.forEach(nodeinfo => {
                const scrollableElements = nodeinfo.querySelectorAll('.home-info, .home-mission, .home-sources, .home-accuracy, .nodeinfo-overview, .nodeinfo-info, .nodeinfo-accuracy, .nodeinfo-source');
                scrollableElements.forEach(element => {
                    // Re-run the fade calculation
                    const scrollTop = element.scrollTop;
                    const scrollHeight = element.scrollHeight;
                    const clientHeight = element.clientHeight;
                    const scrollable = scrollHeight - clientHeight;

                    if (scrollable <= 1) {
                        // No scroll, hide fade completely
                        nodeinfo.style.setProperty('--fade-opacity', '0');
                        nodeinfo.classList.remove('fade-visible');
                    } else {
                        const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
                        const ratio = Math.min(1, distanceFromBottom / 40);
                        nodeinfo.style.setProperty('--fade-opacity', ratio.toFixed(2));
                        nodeinfo.classList.add('fade-visible');
                    }
                });
            });
        }, 350); // Increased to account for 0.3s transition
    });
}