//https://www.fourmilab.ch/documents/calendar/
//https://archive.org/details/astronomicalalgorithmsjeanmeeus1991/page/n7/mode/2up
//http://www.leapsecond.com/java/gpsclock.htm
//https://www.tondering.dk/claus/cal/julperiod.php
//https://en.wikipedia.org/wiki/Date_and_time_notation_in_Thailand
//https://ytliu0.github.io/ChineseCalendar/rules.html
//https://www.jewfaq.org/jewish_calendar_calculation
//https://ops-alaska.com/time/gangale_converter/calendar_clock.htm
//https://planetcalc.com/9166/
//https://assets.cambridge.org/97811070/57623/frontmatter/9781107057623_frontmatter.pdf
///https://archive.org/details/calendrical-calculations/page/n11/mode/2up

/*
TODO:
Weeks
Seasons
Divide nodes by region
Fantasy calendars that can be verified, like Star Trek
Metric Time
Astronomical Time and determine if epoch displays need to be in AT or regular time
Hebrew/Thai/Chinese/Byzantine/Zoroastrian/Egyptian times
*/

let selectedNode = '';              // The current selected node, blank if none
let dateInput = '';                 // Text string from the date input box
let currentDescriptionPage = [];    // The current arrangement of information to be displayed in the description box
let updateIntervalId;               // The current interval ID for spreading calculations out so they don't happen all at once

// About tab (Home Page)
const aboutDescription = document.createElement('div');
aboutDescription.classList.add('tooltip');
const aboutElement = document.createElement('div');
aboutElement.innerHTML = `${welcomeDescription[0].about}`;
aboutElement.classList.add('tooltip-info');
aboutDescription.appendChild(aboutElement);

// Mission tab (Home Page)
const missionDescription = document.createElement('div');
missionDescription.classList.add('tooltip');
const missionElement = document.createElement('div');
missionElement.innerHTML = `${welcomeDescription[0].mission}`;
missionElement.classList.add('tooltip-mission');
missionDescription.appendChild(missionElement);

// Accuracy tab (Home Page)
const accuracyDescription = document.createElement('div');
accuracyDescription.classList.add('tooltip');
const accuracyElement = document.createElement('div');
accuracyElement.innerHTML = `${welcomeDescription[0].accuracy}`;
accuracyElement.classList.add('tooltip-accuracy');
accuracyDescription.appendChild(accuracyElement);

// Sources tab (Home Page)
const sourcesDescription = document.createElement('div');
sourcesDescription.classList.add('tooltip');
const sourcesElement = document.createElement('div');
sourcesElement.innerHTML = `${welcomeDescription[0].sources}`;
sourcesElement.classList.add('tooltip-sources');
sourcesDescription.appendChild(sourcesElement);

// Add the tab text to the description window
document.querySelector('.description-wrapper').appendChild(aboutDescription);
document.querySelector('.description-wrapper').appendChild(missionDescription);
document.querySelector('.description-wrapper').appendChild(accuracyDescription);
document.querySelector('.description-wrapper').appendChild(sourcesDescription);

// Update Description data with home page
let visibleTooltip = aboutDescription;
currentDescriptionPage = [aboutDescription, missionDescription, accuracyDescription, sourcesDescription];

// Main function for 
function updateDateAndTime(dateInput, firstPass) {
    let currentPass = 0;
    let currentDateTime = '';
    const decimals = 10; // Decimals to show in some nodes
    const millisecondStart = 10; // The timeframe that 1s incrementing updates have each second, starting at 0ms

    // If there is no date input
    if ((dateInput === 0)||(dateInput === undefined)) {
        currentDateTime = new Date();

        // Create pass number for optimization so that calendars don't all update constantly
        for (let i = 0; i < 8; i++) {
            let lastDigit = currentDateTime.getSeconds() % 10;
            if (lastDigit === i) {
                currentPass = i;
            }
        }

    // There is a date input
    } else {
        const inputParts = dateInput.split(', ');
        const inputYear = inputParts[0];
        const inputMonth = inputParts[1] - 1;
        const inputDay = inputParts[2];
        const inputHour = inputParts[3] || 0;
        const inputMinute = inputParts[4] || 0;
        const inputSecond = inputParts[5] || 0;
        currentDateTime = new Date(Date.UTC(inputYear, inputMonth, inputDay, inputHour, inputMinute, inputSecond));
        currentDateTime.setUTCFullYear(inputYear);
        currentPass = 100;
    }

    // Website just loaded, so update all calendars
    if (firstPass===true) {
        currentPass = 100;
    }

    // Calculations that are used by multiple nodes
    const julianDay = getJulianDayNumber(currentDateTime)
    const dayFraction = calculateDay(currentDateTime)
    const marsSolDay = getMarsSolDate(julianDay);

    // All fractional times
    if ((currentDateTime.getMilliseconds() < millisecondStart)||(currentPass===100)) {
        setTimeValue('local-time-node', getGregorianDateTime(currentDateTime).time);
        setTimeValue('utc-node', currentDateTime.toISOString().slice(0, -5));
    }
    setTimeValue('day-node', dayFraction.toFixed(decimals));
    setTimeValue('month-node', calculateMonth(currentDateTime).toFixed(decimals));
    setTimeValue('year-node', calculateYear(currentDateTime).toFixed(decimals));
    setTimeValue('hour-node', calculateHour(currentDateTime).toFixed(decimals));
    setTimeValue('minute-node', calculateMinute(currentDateTime).toFixed(decimals));
    setTimeValue('second-node', calculateSecond(currentDateTime));
    setTimeValue('decade-node', calculateDecade(currentDateTime).toFixed(decimals));
    setTimeValue('century-node', calculateCentury(currentDateTime).toFixed(decimals));
    if ((currentDateTime.getMilliseconds() > 900)||(currentPass===100)) {
        setTimeValue('millennium-node', calculateMillennium(currentDateTime).toFixed(decimals));
    }

    // Computing Times
    setTimeValue('julian-day-number-node', julianDay);
    setTimeValue('dynamical-time-node', getDynamicalTimeForward(currentDateTime));
    setTimeValue('iso8601-node', currentDateTime.toISOString());
    if ((currentDateTime.getMilliseconds() < millisecondStart)||(currentPass===100)) {
        setTimeValue('unix-node', getUnixTime(currentDateTime));
        setTimeValue('filetime-node', getCurrentFiletime(currentDateTime));
        setTimeValue('gps-node', getGPSTime(currentDateTime));
        setTimeValue('julian-period-node', getJulianPeriod(currentDateTime));
        setTimeValue('rata-die-node', getRataDie(currentDateTime));
        setTimeValue('tai-node', getTAI(currentDateTime).toISOString().slice(0, -5));
        setTimeValue('loran-c-node', getLORANC(currentDateTime).toISOString().slice(0, -5));
        setTimeValue('lilian-date-node', getLilianDate(julianDay));
        setTimeValue('mars-sol-date-node', marsSolDay.toFixed(5));
        setTimeValue('julian-sol-number-node', getJulianSolDate(marsSolDay).toFixed(0));
        setTimeValue('kali-ahargaṅa-node', getKaliAhargana(currentDateTime).toFixed(0));
        setTimeValue('lunation-node', calculateLunationNumber(currentDateTime));
    }

    // Decimal Time
    setTimeValue('revolutionary-time-node', getRevolutionaryTime(dayFraction));
    setTimeValue('beat-time-node', convertToSwatchBeats(currentDateTime));
    setTimeValue('hexadecimal-node', getHexadecimalTime(dayFraction));
    setTimeValue('binary-node', getBinaryTime(dayFraction));

    // Other Time
    setTimeValue('coordinated-mars-time-node', getMTC(marsSolDay));

    // Solar Calendars
    if ((((currentDateTime.getMilliseconds() > 500)&&(currentDateTime.getMilliseconds() < 510))&&(currentPass===5))||(currentPass===100)) {
        const springEquinox = getCurrentSolsticeOrEquinox(currentDateTime, 'spring');
        setTimeValue('gregorian-node', getGregorianDateTime(currentDateTime).date);
        setTimeValue('julian-node', getJulianCalendar(currentDateTime));
        setTimeValue('byzantine-node', getByzantineCalendar(currentDateTime));
        setTimeValue('florentine-node', getFlorentineCalendar(currentDateTime));
        setTimeValue('french-republican-node', getRepublicanCalendar(currentDateTime, getCurrentSolsticeOrEquinox(currentDateTime, 'autumn')));
        setTimeValue('era-fascista-node', getEraFascista(currentDateTime));
        setTimeValue('minguo-node', getMinguo(currentDateTime));
        setTimeValue('thai-node', getThaiSolar(currentDateTime));
        setTimeValue('juche-node', getJuche(currentDateTime));
        setTimeValue('coptic-node', julianDayToCoptic(julianDay));
        setTimeValue('ethiopian-node', julianDayToEthiopian(julianDay));
        setTimeValue('bahai-node', getBahaiCalendar(currentDateTime, springEquinox));
        setTimeValue('pataphysical-node', getPataphysicalDate(currentDateTime));
        setTimeValue('discordian-node', getDiscordianDate(currentDateTime));
        setTimeValue('solar-hijri-node', getSolarHijriDate(currentDateTime, springEquinox));
        setTimeValue('qadimi-node', getQadimiDate(currentDateTime));
        setTimeValue('egyptian-civil-node', getEgyptianDate(currentDateTime));
    }

    // Other Calendars
    if ((((currentDateTime.getMilliseconds() > 500)&&(currentDateTime.getMilliseconds() < 510))&&(currentPass===5))||(currentPass===100)) {
        setTimeValue('mayan-long-count-node', getCurrentMayanLongCount(currentDateTime));
        setTimeValue('darian-node', getDarianCalendar(getJulianSolDate(marsSolDay)));
        setTimeValue('yuga-cycle-node', getYugaCycle(currentDateTime));
        setTimeValue('sothic-cycle-node', getSothicCycle(currentDateTime));
    }

    // Lunisolar and Lunar Calendars
    if ((((currentDateTime.getMilliseconds() > 500)&&(currentDateTime.getMilliseconds() < 510))&&(currentPass===1))||(currentPass===100)) {
        const newMoonThisMonth = getNewMoonThisMonth(currentDateTime, 0);
        const newMoonLastMonth = getNewMoonThisMonth(currentDateTime, -1);
        let lunisolarCalendarChina = getLunisolarCalendarDate(currentDateTime, newMoonThisMonth, newMoonLastMonth, 16); // China midnight happens at UTC 16:00
        let chineseCalendar = getChineseLunisolarCalendarDate(currentDateTime, lunisolarCalendarChina);
        setTimeValue('chinese-node', chineseCalendar);
        setTimeValue('sexagenary-year-node', getSexagenaryYear(chineseCalendar));
        let lunisolarCalendarVietnam = getLunisolarCalendarDate(currentDateTime, newMoonThisMonth, newMoonLastMonth, 15); // Vietnam midnight happens at UTC 15:00
        setTimeValue('vietnamese-node', getVietnameseLunisolarCalendarDate(currentDateTime, lunisolarCalendarVietnam));
        let lunisolarCalendarKorea = getLunisolarCalendarDate(currentDateTime, newMoonThisMonth, newMoonLastMonth, 17); // Korea midnight happens at UTC 17:00
        setTimeValue('dangun-node', getDangunLunisolarCalendarDate(currentDateTime, lunisolarCalendarKorea));
        setTimeValue('hijri-node', getHijriDate(currentDateTime, newMoonThisMonth, newMoonLastMonth)); // Returns a wrong day for May 8 2024
    }
    if ((((currentDateTime.getMilliseconds() > 500)&&(currentDateTime.getMilliseconds() < 510))&&(currentPass===3))||(currentPass===100)) {
        setTimeValue('hebrew-node', calculateHebrewCalendar(currentDateTime)); // Returns a wrong day for October 10 1989
    }

    // Proposed Calendars
    if ((((currentDateTime.getMilliseconds() > 500)&&(currentDateTime.getMilliseconds() < 510))&&(currentPass===5))||(currentPass===100)) {
        setTimeValue('human-era-node', getHumanEra(currentDateTime));
        setTimeValue('invariable-node', getInvariableCalendarDate(currentDateTime));
        setTimeValue('world-calendar-node', getWorldCalendarDate(currentDateTime));
        setTimeValue('symmetry454-node', getSymmetry454Date(currentDateTime));
    }

    // Astronomical Data
    if ((((currentDateTime.getMilliseconds() > 500)&&(currentDateTime.getMilliseconds() < 510))&&(currentPass===6))||(currentPass===100)) {
        setTimeValue('spring-equinox-node', getCurrentSolsticeOrEquinox(currentDateTime, 'spring').toUTCString());
        setTimeValue('summer-solstice-node', getCurrentSolsticeOrEquinox(currentDateTime, 'summer').toUTCString());
        setTimeValue('autumn-equinox-node', getCurrentSolsticeOrEquinox(currentDateTime, 'autumn').toUTCString());
    }
    if ((((currentDateTime.getMilliseconds() > 500)&&(currentDateTime.getMilliseconds() < 510))&&(currentPass===7))||(currentPass===100)) {
        const newMoonThisMonth = getNewMoonThisMonth(currentDateTime, 0);
        setTimeValue('winter-solstice-node', getCurrentSolsticeOrEquinox(currentDateTime, 'winter').toUTCString());
        setTimeValue('sun-longitude-node', getLongitudeOfSun(currentDateTime)+'°');
        setTimeValue('this-new-moon-node', newMoonThisMonth.toUTCString());
    }

    // Pop Culture
    setTimeValue('minecraft-time-node', getMinecraftTime(currentDateTime));
    setTimeValue('dream-time-node', getInceptionDreamTime(currentDateTime));

    // Politics
    setTimeValue('us-presidential-terms-node', getCurrentPresidentialTerm(currentDateTime).toFixed(10));
}

// Create the nodes
function createElements() {
    const dataArrays = [
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

    dataArrays.forEach(dataArray => {
        dataArray.forEach(item => {
            createnode(item);
        });
    });
}

// Function to create node elements
function createnode(item) {
    const standardTime = document.querySelector('.standard-time');
    const computingTime = document.querySelector('.computing-time');
    const decimalTime = document.querySelector('.decimal-time');
    const otherTime = document.querySelector('.other-time');
    const solarCalendars = document.querySelector('.solar-calendars');
    const lunisolarCalendars = document.querySelector('.lunisolar-calendars');
    const lunarCalendars = document.querySelector('.lunar-calendars');
    const proposedCalendars = document.querySelector('.proposed-calendars');
    const otherCalendars = document.querySelector('.other-calendars');
    const astronomicalData = document.querySelector('.astronomical-data');
    const popCulture = document.querySelector('.pop-culture');
    const politicalCycles = document.querySelector('.politics');

    // Create a div element for the node
    const node = document.createElement('div');
    node.classList.add('node');

    // Create a label element for the node
    const label = document.createElement('label');
    label.textContent = item.name;

    // Create a div element for the content
    const content = document.createElement('div');
    content.id = item.id + '-node';
    content.classList.add('content');

    // Function to create a title element
    function createTitleElement(name) {
        const titleElement = document.createElement('div');
        titleElement.textContent = name;
        titleElement.classList.add('tooltip-title');
        return titleElement;
    }

    // Create the overview for the description
    const overviewDescription = document.createElement('div');
    overviewDescription.id = item.id + '-tooltip';
    overviewDescription.classList.add('tooltip');

    const epochElement = document.createElement('div');
    epochElement.innerHTML = `<table class="table-epoch"><tr><th><b>Epoch</th><tr><td>${item.epoch}</b></td></tr></tr></table>`;
    epochElement.classList.add('tooltip-epoch');

    const confidenceElement = document.createElement('div');
    confidenceElement.innerHTML = `<table class="table-confidence"><tr><th><b>Confidence: ${item.confidence}</b></th></tr></table>`;
    confidenceElement.classList.add('tooltip-confidence');

    const overviewElement = document.createElement('div');
    overviewElement.innerHTML = `${item.overview}`;
    overviewElement.classList.add('tooltip-overview');

    overviewDescription.appendChild(createTitleElement(item.name));
    overviewDescription.appendChild(epochElement);
    overviewDescription.appendChild(confidenceElement);
    overviewDescription.appendChild(overviewElement);

    // Add Info elements
    const infoDescription = document.createElement('div');
    infoDescription.id = item.id + '-tooltip';
    infoDescription.classList.add('tooltip');

    const infoElement = document.createElement('div');
    infoElement.innerHTML = `${item.info}`;
    infoElement.classList.add('tooltip-info');

    infoDescription.appendChild(createTitleElement(item.name));
    infoDescription.appendChild(infoElement);

    // Add Accuracy elements
    const accuracyDescription = document.createElement('div');
    accuracyDescription.id = item.id + '-tooltip';
    accuracyDescription.classList.add('tooltip');

    const accuracyElement = document.createElement('div');
    accuracyElement.innerHTML = `${item.accuracy}`;
    accuracyElement.classList.add('tooltip-accuracy');

    accuracyDescription.appendChild(createTitleElement(item.name));
    accuracyDescription.appendChild(accuracyElement);

    // Add Source elements
    const sourceDescription = document.createElement('div');
    sourceDescription.id = item.id + '-tooltip';
    sourceDescription.classList.add('tooltip');

    const sourceElement = document.createElement('div');
    sourceElement.innerHTML = `${item.source}`;
    sourceElement.classList.add('tooltip-accuracy');

    sourceDescription.appendChild(createTitleElement(item.name));
    sourceDescription.appendChild(sourceElement);

    // Append the label, content, and description to the node
    node.appendChild(label);
    node.appendChild(content);
    document.querySelector('.description-wrapper').appendChild(overviewDescription);
    document.querySelector('.description-wrapper').appendChild(infoDescription);
    document.querySelector('.description-wrapper').appendChild(accuracyDescription);
    document.querySelector('.description-wrapper').appendChild(sourceDescription);

    // Node is clicked
    node.addEventListener('click', () => {
        // Select a node and update the description while deselecting an old node
        visibleTooltip.style.visibility = 'hidden';
        visibleTooltip = overviewDescription;
        overviewDescription.style.visibility = 'visible';

        // Clear descriptions and load new ones
        for (let i = 0; i < currentDescriptionPage.length; i++) {
            currentDescriptionPage[i].style.visibility = 'hidden';
        }
        currentDescriptionPage = [overviewDescription, infoDescription, accuracyDescription, sourceDescription];

        // Return border color of deselected node if there is one and set new node
        if (selectedNode !== '') {
            selectedNode.style.borderColor = '';
            selectedNode.style.backgroundColor = '';
        }
        selectedNode = content;
        content.style.borderColor = 'rgb(150, 150, 150)';

        // Set up new description and formatting
        changeHeaderButton('header-button-1', 'none');
        currentDescriptionPage[0].style.visibility = 'visible';
        const homeButton = document.getElementById('home-button');
        homeButton.style.visibility = 'visible';

        // Change header buttons to display node options
        const headerButton1 = document.getElementById('header-button-1');
        const headerButton2 = document.getElementById('header-button-2');
        const headerButton3 = document.getElementById('header-button-3');
        const headerButton4 = document.getElementById('header-button-4');
        headerButton1.innerHTML = "<b>Overview</b>";
        headerButton2.innerHTML = "<b>Info</b>";
        headerButton3.innerHTML = "<b>Accuracy</b>";
        headerButton4.innerHTML = "<b>Source</b>";
    });

    // Node is hovered
    node.addEventListener('mouseenter', () => {
        // Change border color when mouse is hovering
        content.style.borderColor = 'rgb(150, 150, 150)';
    });
    node.addEventListener('mouseleave', () => {
        // Change border back to default if not selected
        if (selectedNode !== content) {
            content.style.borderColor = '';
        }
    });

    // Animation for node click
    node.addEventListener('mousedown', () => {
        // Change background color of a node when selected
        content.style.backgroundColor = 'rgb(150, 150, 150)';
        setTimeout(() => {
            content.style.transition = 'background-color 0.3s';
            content.style.backgroundColor = 'rgb(60, 60, 60)';
        }, 150);
    });

    // Mapping of item types to parent elements
    const parentElements = {
        'Solar Calendar': solarCalendars,
        'Computing Time': computingTime,
        'Standard Time': standardTime,
        'Decimal Time': decimalTime,
        'Other Time': otherTime,
        'Lunisolar Calendar': lunisolarCalendars,
        'Lunar Calendar': lunarCalendars,
        'Proposed Calendar': proposedCalendars,
        'Other Calendar': otherCalendars,
        'Astronomical Data': astronomicalData,
        'Pop Culture': popCulture,
        'Politics': politicalCycles
    };

    // Append node to the corresponding parent element based on item type
    const parentElement = parentElements[item.type];
    if (parentElement) {
        parentElement.appendChild(node);
    } else {
        console.error(`No parent element found for item type: ${item.type}`);
    }
}

// Main function for populating a node
function setTimeValue(type, value) {
    document.getElementById(type).textContent = value;
}

// Read the input box and set the date or restart the current time ticker
function changeDateTime() {
    clearInterval(updateIntervalId);
    // Get the value entered in the input box
    const newDateString = document.getElementById('date-input').value;

    // Date was input, add it as an argument
    if (newDateString!=='') {
        updateDateAndTime(newDateString);
        setTimeout(() => {
            updateIntervalId = setInterval(updateDateAndTime(newDateString), 1);
        }, 1000);
    
    // Date was cleared, restart without argument
    } else {
        updateDateAndTime;
        setTimeout(() => {
            updateIntervalId = setInterval(updateDateAndTime, 1);
        }, 1);
    }
}

// Register a click of a header button
function changeHeaderButton(button, index) {
    const buttons = ['header-button-1', 'header-button-2', 'header-button-3', 'header-button-4'];

    buttons.forEach((btnId) => {
        const btn = document.getElementById(btnId);
        const isSelected = btnId === button;
        btn.style.background = isSelected ? "rgb(55, 55, 55)" : "#2b2b2b";
        btn.classList.toggle('selected', isSelected);
        if (isSelected) {
            // Show the corresponding description page
            for (let i = 0; i < currentDescriptionPage.length; i++) {
                currentDescriptionPage[i].style.visibility = i === index ? 'visible' : 'hidden';
            }
        }
    });
}

// Return site to home state
function homeButton() {
    // Clear old descriptions
    for (let i = 0; i < currentDescriptionPage.length; i++) {
        currentDescriptionPage[i].style.visibility = 'hidden';
    }
    currentDescriptionPage = [];
    currentDescriptionPage = [aboutDescription, missionDescription, accuracyDescription, sourcesDescription];
    
    // Change header buttons to original labels
    const headerButton1 = document.getElementById('header-button-1');
    const headerButton2 = document.getElementById('header-button-2');
    const headerButton3 = document.getElementById('header-button-3');
    const headerButton4 = document.getElementById('header-button-4');
    headerButton1.innerHTML = "<b>About</b>";
    headerButton2.innerHTML = "<b>Mission</b>";
    headerButton3.innerHTML = "<b>Accuracy</b>";
    headerButton4.innerHTML = "<b>Sources</b>";

    // Return to home description
    changeHeaderButton('header-button-1', 0);
    const homeButton = document.getElementById('home-button');
    homeButton.style.visibility = 'hidden';

    // Return border color of deselected node if there is one
    if (selectedNode !== '') {
        selectedNode.style.borderColor = '';
        selectedNode.style.backgroundColor = '';
        selectedNode = '';
    }
}

// Masonry Tiling library
document.addEventListener('DOMContentLoaded', function () {
    var grid = document.querySelector('.node-wrapper');
    var msnry = new Masonry(grid, {
        itemSelector: '.container',
        columnWidth: '.container',
        percentPosition: true,
    });
});

// Draw elements in HTML
createElements();

// Update the date and time every millisecond
updateIntervalId = setInterval(updateDateAndTime, 10);
changeHeaderButton('header-button-1', 0);

// Initial update
updateDateAndTime(0, true);