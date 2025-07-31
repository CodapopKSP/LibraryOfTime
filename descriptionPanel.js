/*
    |=========================|
    |    Description Panel    |
    |=========================|

    This is a collection of functions for drawing and handling the Description Panel.
*/



import { welcomeDescription, confidenceDescription } from './descriptionText.js';
import * as nodeDisplay from './nodeDisplay.js';
import * as utilities from './utilities.js';
import * as userInterface from './userInterface.js';
import * as astronomicalData from './Other/astronomicalData.js';

document.getElementById('home-button').addEventListener('click', homeButton);

// Attach event listeners to all header buttons
document.getElementById('header-button-1').addEventListener('click', () => changeActiveHeaderTab('header-button-1', 0));
document.getElementById('header-button-2').addEventListener('click', () => changeActiveHeaderTab('header-button-2', 1));
document.getElementById('header-button-3').addEventListener('click', () => changeActiveHeaderTab('header-button-3', 2));
document.getElementById('header-button-4').addEventListener('click', () => changeActiveHeaderTab('header-button-4', 3));

const headerTabs = ['header-button-1', 'header-button-2', 'header-button-3', 'header-button-4'];

// The current arrangement of information to be displayed in the Description Panel
let _currentDescriptionTab = [];

export function getCurrentDescriptionTab() {
    return _currentDescriptionTab;
}

export function setCurrentDescriptionTab(newTab) {
    if (Array.isArray(newTab)) {
        _currentDescriptionTab = newTab;
    } else {
        throw new Error("setCurrentDescriptionTab expects an array");
    }
}


export function addHeaderTabHoverEffect() {
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

export function addHomeButtonHoverEffect() {
    const homeButton = document.getElementById('home-button');

    // Add hover event listeners
    homeButton.addEventListener('mouseenter', () => {
        homeButton.classList.add('hoveringHome');
    });
    homeButton.addEventListener('mouseleave', () => {
        homeButton.classList.remove('hoveringHome');
    });
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
        const scrollable = scrollHeight - clientHeight;

        if (scrollable <= 0) {
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
    scrollableElement.addEventListener('scroll', updateFadeOpacity);
}

function createHomePageDescription(contentKey, contentClass) {
    const description = document.createElement('div');
    description.classList.add('nodeinfo', 'homepage');

    const contentElement = document.createElement('div');
    contentElement.innerHTML = welcomeDescription[0][contentKey];
    contentElement.classList.add(contentClass);
    contentElement.style.overflowY = 'auto';  // Ensure scrollable
    contentElement.style.maxHeight = '100%';  // Or whatever height you want

    // Apply scroll-fade logic
    setupScrollFade(contentElement, description);

    description.appendChild(contentElement);
    return description;
}

export function createNodeDescription(item, type) {
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
        overviewElement.style.overflowY = 'auto';
        overviewElement.style.maxHeight = '100%';

        description.appendChild(overviewElement);
        contentElement = overviewElement;
    } else {
        // For 'info', 'accuracy', 'source'
        contentElement = document.createElement('div');
        contentElement.innerHTML = item[type];
        contentElement.classList.add(`nodeinfo-${type}`);
        contentElement.style.overflowY = 'auto';
        contentElement.style.maxHeight = '100%';
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

function createEpochElement(item) {
    const epochElement = document.createElement('div');
    epochElement.innerHTML = `
        <table class="table-epoch">
            <tr><th><b>Epoch</b></th></tr>
            <tr><td class="clickable-epoch">${item.epoch}</td></tr>
        </table>`;
    epochElement.classList.add('nodeinfo-epoch');

    // Enable Epoch to be clicked
    const epochDateElement = epochElement.querySelector('.clickable-epoch');
    epochDateElement.addEventListener('click', function() {
        handleEpochClick(item.epoch); // Function to be called on click
    });

    epochDateElement.addEventListener('mouseenter', function() {
        epochDateElement.classList.add('hovering');
    });
    epochDateElement.addEventListener('mouseleave', function() {
        epochDateElement.classList.remove('hovering');
    });

    return epochElement;
}

function handleEpochClick(epoch) {
    let epoch_ = epoch;
    let timePicked = "UTC+00:00";

    // Most clocks
    if (epoch==='Midnight') {
        timePicked = utilities.getDatePickerTimezone();
        const now = new Date();
        const hours = '00';
        const minutes = '00';
        const seconds = '00';
        epoch_ = `${now.getUTCDate()} ${utilities.monthNames[now.getUTCMonth()]} ${now.getUTCFullYear()} +${hours}:${minutes}:${seconds}`;
    }

    // .beat (BMT)
    if (epoch==='Midnight (BMT)') {
        timePicked = 'UTC+00:00';
        const now = new Date();
        const hours = '23';
        const minutes = '00';
        const seconds = '00';
        epoch_ = `${now.getUTCDate()} ${utilities.monthNames[now.getUTCMonth()]} ${now.getUTCFullYear()} +${hours}:${minutes}:${seconds}`;
    }

    // UTC (Standard Time)
    if (epoch==='Midnight (UTC)') {
        const now = new Date();
        epoch_ = `${now.getUTCDate()} ${utilities.monthNames[now.getUTCMonth()]} ${now.getUTCFullYear()}`;
        timePicked = 'UTC+00:00';
    }

    // Termina Time (Slowed)
    if (epoch==='6:00:00') {
        timePicked = utilities.getDatePickerTimezone();
        const now = new Date();
        const hours = '6';
        const minutes = '00';
        const seconds = '00';
        epoch_ = `${now.getUTCDate()} ${utilities.monthNames[now.getUTCMonth()]} ${now.getUTCFullYear()} +${hours}:${minutes}:${seconds}`;
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
        const now = new Date();
        epoch_ = `${now.getUTCDate()} ${utilities.monthNames[now.getUTCMonth()]} ${now.getUTCFullYear()}`;
        timePicked = '';
    }

    // Every Month
    if (epoch==='Every Month') {
        const now = new Date();
        epoch_ = `${1} ${utilities.monthNames[now.getUTCMonth()]} ${now.getUTCFullYear()}`;
        timePicked = utilities.getDatePickerTimezone();
    }

    // Every Year
    if (epoch==='Every Year') {
        const now = new Date();
        epoch_ = `${1} ${'January'} ${now.getUTCFullYear()}`;
        timePicked = utilities.getDatePickerTimezone();
    }

    // Every Decade
    if (epoch === 'Every Decade') {
        const now = new Date();
        const year = now.getUTCFullYear();
        const centuryYear = Math.floor(year / 10) * 10;
        epoch_ = `${1} January ${centuryYear}`;
        timePicked = utilities.getDatePickerTimezone();
    }

    // Every Century
    if (epoch === 'Every Century') {
        const now = new Date();
        const year = now.getUTCFullYear();
        const centuryYear = Math.floor(year / 100) * 100;
        epoch_ = `${1} January ${centuryYear}`;
        timePicked = utilities.getDatePickerTimezone();
    }

    // Every Millennium
    if (epoch === 'Every Millennium') {
        const now = new Date();
        const year = now.getUTCFullYear();
        const millenniumYear = Math.floor(year / 1000) * 1000;
        epoch_ = `${1} January ${millenniumYear}`;
        timePicked = utilities.getDatePickerTimezone();
    }

    // Equinoxes and Solstices
    if (epoch === 'Northward Equinox') {
        timePicked = utilities.getDatePickerTimezone();
        let timezoneOffset = utilities.convertUTCOffsetToMinutes(timePicked);
        const now = new Date();
        let target = astronomicalData.getSolsticeOrEquinox(now, 'spring');
        target.setTime(target.getTime() + (timezoneOffset*1000*60));

        const hours = String(target.getUTCHours()).padStart(2, '0');
        const minutes = String(target.getUTCMinutes()).padStart(2, '0');
        const seconds = String(target.getUTCSeconds()).padStart(2, '0');
        epoch_ = `${target.getUTCDate()} ${utilities.monthNames[target.getUTCMonth()]} ${target.getUTCFullYear()} +${hours}:${minutes}:${seconds}`;
    }
    if (epoch === 'Northern Solstice') {
        timePicked = utilities.getDatePickerTimezone();
        let timezoneOffset = utilities.convertUTCOffsetToMinutes(timePicked);
        const now = new Date();
        let target = astronomicalData.getSolsticeOrEquinox(now, 'summer');
        target.setTime(target.getTime() + (timezoneOffset*1000*60));

        const hours = String(target.getUTCHours()).padStart(2, '0');
        const minutes = String(target.getUTCMinutes()).padStart(2, '0');
        const seconds = String(target.getUTCSeconds()).padStart(2, '0');
        epoch_ = `${target.getUTCDate()} ${utilities.monthNames[target.getUTCMonth()]} ${target.getUTCFullYear()} +${hours}:${minutes}:${seconds}`;
    }
    if (epoch === 'Southward Equinox') {
        timePicked = utilities.getDatePickerTimezone();
        let timezoneOffset = utilities.convertUTCOffsetToMinutes(timePicked);
        const now = new Date();
        let target = astronomicalData.getSolsticeOrEquinox(now, 'autumn');
        target.setTime(target.getTime() + (timezoneOffset*1000*60));

        const hours = String(target.getUTCHours()).padStart(2, '0');
        const minutes = String(target.getUTCMinutes()).padStart(2, '0');
        const seconds = String(target.getUTCSeconds()).padStart(2, '0');
        epoch_ = `${target.getUTCDate()} ${utilities.monthNames[target.getUTCMonth()]} ${target.getUTCFullYear()} +${hours}:${minutes}:${seconds}`;
    }
    if (epoch === 'Southern Solstice') {
        timePicked = utilities.getDatePickerTimezone();
        let timezoneOffset = utilities.convertUTCOffsetToMinutes(timePicked);
        const now = new Date();
        let target = astronomicalData.getSolsticeOrEquinox(now, 'winter');
        target.setTime(target.getTime() + (timezoneOffset*1000*60));

        const hours = String(target.getUTCHours()).padStart(2, '0');
        const minutes = String(target.getUTCMinutes()).padStart(2, '0');
        const seconds = String(target.getUTCSeconds()).padStart(2, '0');
        epoch_ = `${target.getUTCDate()} ${utilities.monthNames[target.getUTCMonth()]} ${target.getUTCFullYear()} +${hours}:${minutes}:${seconds}`;
    }

    // Moon Phases
    if (epoch === 'New Moon') {
        timePicked = utilities.getDatePickerTimezone();
        let timezoneOffset = utilities.convertUTCOffsetToMinutes(timePicked);
        const now = new Date();
        let target = astronomicalData.getNewMoon(now, 0);
        target.setTime(target.getTime() + (timezoneOffset*1000*60));

        const hours = String(target.getUTCHours()).padStart(2, '0');
        const minutes = String(target.getUTCMinutes()).padStart(2, '0');
        const seconds = String(target.getUTCSeconds()).padStart(2, '0');
        epoch_ = `${target.getUTCDate()} ${utilities.monthNames[target.getUTCMonth()]} ${target.getUTCFullYear()} +${hours}:${minutes}:${seconds}`;
    }
    if (epoch === 'First Quarter Moon') {
        timePicked = utilities.getDatePickerTimezone();
        let timezoneOffset = utilities.convertUTCOffsetToMinutes(timePicked);
        const now = new Date();
        let target = astronomicalData.getMoonPhase(now, 0.25);
        target.setTime(target.getTime() + (timezoneOffset*1000*60));

        const hours = String(target.getUTCHours()).padStart(2, '0');
        const minutes = String(target.getUTCMinutes()).padStart(2, '0');
        const seconds = String(target.getUTCSeconds()).padStart(2, '0');
        epoch_ = `${target.getUTCDate()} ${utilities.monthNames[target.getUTCMonth()]} ${target.getUTCFullYear()} +${hours}:${minutes}:${seconds}`;
    }
    if (epoch === 'Full Moon') {
        timePicked = utilities.getDatePickerTimezone();
        let timezoneOffset = utilities.convertUTCOffsetToMinutes(timePicked);
        const now = new Date();
        let target = astronomicalData.getMoonPhase(now, 0.5);
        target.setTime(target.getTime() + (timezoneOffset*1000*60));

        const hours = String(target.getUTCHours()).padStart(2, '0');
        const minutes = String(target.getUTCMinutes()).padStart(2, '0');
        const seconds = String(target.getUTCSeconds()).padStart(2, '0');
        epoch_ = `${target.getUTCDate()} ${utilities.monthNames[target.getUTCMonth()]} ${target.getUTCFullYear()} +${hours}:${minutes}:${seconds}`;
    }
    if (epoch === 'Last Quarter Moon') {
        timePicked = utilities.getDatePickerTimezone();
        let timezoneOffset = utilities.convertUTCOffsetToMinutes(timePicked);
        const now = new Date();
        let target = astronomicalData.getMoonPhase(now, 0.75);
        target.setTime(target.getTime() + (timezoneOffset*1000*60));

        const hours = String(target.getUTCHours()).padStart(2, '0');
        const minutes = String(target.getUTCMinutes()).padStart(2, '0');
        const seconds = String(target.getUTCSeconds()).padStart(2, '0');
        epoch_ = `${target.getUTCDate()} ${utilities.monthNames[target.getUTCMonth()]} ${target.getUTCFullYear()} +${hours}:${minutes}:${seconds}`;
    }

    // Eclipses
    if (epoch === 'Next Solar Eclipse') {
        timePicked = utilities.getDatePickerTimezone();
        let timezoneOffset = utilities.convertUTCOffsetToMinutes(timePicked);
        const now = new Date();
        let targetRaw = astronomicalData.getNextSolarLunarEclipse(now, 0);

        // Extract the first line (the date)
        let dateString = targetRaw.split('\n')[0].trim();

        // Convert to JS Date object
        let target = new Date(dateString);

        // Apply timezone offset
        target.setTime(target.getTime() + (timezoneOffset * 1000 * 60));

        // Format the date output
        const hours = String(target.getUTCHours()).padStart(2, '0');
        const minutes = String(target.getUTCMinutes()).padStart(2, '0');
        const seconds = String(target.getUTCSeconds()).padStart(2, '0');
        epoch_ = `${target.getUTCDate()} ${utilities.monthNames[target.getUTCMonth()]} ${target.getUTCFullYear()} +${hours}:${minutes}:${seconds}`;
    }
    if (epoch === 'Next Lunar Eclipse') {
        timePicked = utilities.getDatePickerTimezone();
        let timezoneOffset = utilities.convertUTCOffsetToMinutes(timePicked);
        const now = new Date();
        let targetRaw = astronomicalData.getNextSolarLunarEclipse(now, 0.5);

        // Extract the first line (the date)
        let dateString = targetRaw.split('\n')[0].trim();

        // Convert to JS Date object
        let target = new Date(dateString);

        // Apply timezone offset
        target.setTime(target.getTime() + (timezoneOffset * 1000 * 60));

        // Format the date output
        const hours = String(target.getUTCHours()).padStart(2, '0');
        const minutes = String(target.getUTCMinutes()).padStart(2, '0');
        const seconds = String(target.getUTCSeconds()).padStart(2, '0');
        epoch_ = `${target.getUTCDate()} ${utilities.monthNames[target.getUTCMonth()]} ${target.getUTCFullYear()} +${hours}:${minutes}:${seconds}`;
    }

    // Most calendars
    const datePicked = formatDateTime(epoch_);
    userInterface.changeDateTime(datePicked, timePicked);
}


function formatDateTime(dateString) {

    let date = new Date();
    let year;
    let month;
    let dayFormatted;
    let formattedDate;
    let formattedTime = '00:00:00';

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
    const monthIndex = utilities.monthNames.indexOf(monthStr);

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
            <div style="font-family: sans-serif; font-weight: bold; font-size: 16px; margin-bottom: 8px;">
                Confidence Criteria
            </div>
            ${specificInfo}
            <hr style="margin: 12px 0; border: none; border-top: 1px solid #aaa;">
            ${generalNote}
        </div>
    `;

    return confidenceElement;
}


export function changeActiveHeaderTab(activeTab, index) {
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

export function homeButton() {
    // Clear the Description Panel
    clearDescriptionPanel();
    nodeDisplay.clearSelectedNode();
    const homeButton = document.getElementById('home-button');
    homeButton.style.visibility = 'hidden';

    // Build the Home Description Panel
    Object.values(homePageDescriptions).forEach(description => {
        document.querySelector('.description-wrapper').appendChild(description);
    });
    setCurrentDescriptionTab(Object.values(homePageDescriptions));
    updateHeaderTabTitles(['About','Mission','Accuracy','Sources']);
    changeActiveHeaderTab('header-button-1', 0);
}

export function updateHeaderTabTitles(labels) {
    headerTabs.forEach((btnId, index) => {
        const btn = document.getElementById(btnId);
        btn.innerHTML = `<b>${labels[index]}</b>`;
    });
}

export function clearDescriptionPanel() {
    const nodeinfos = document.querySelectorAll('.nodeinfo');
    nodeinfos.forEach(nodeinfo => {
        nodeinfo.parentNode.removeChild(nodeinfo);
    });
}
