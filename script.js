//https://www.fourmilab.ch/documents/calendar/
//https://archive.org/details/astronomicalalgorithmsjeanmeeus1991/page/n7/mode/2up
//http://www.leapsecond.com/java/gpsclock.htm
//https://www.tondering.dk/claus/cal/julperiod.php
//https://en.wikipedia.org/wiki/Date_and_time_notation_in_Thailand
//https://ytliu0.github.io/ChineseCalendar/rules.html
//https://www.jewfaq.org/jewish_calendar_calculation

/*
TODO:
Weeks
Seasons
Divide by region
Fantasy calendars that can be verified, like Star Trek
*/

let visibleTooltip = document.querySelector('.pre-description');
const nodeWrapper = document.querySelector('.node-wrapper');
let selectedNode = '';
let dateInput = '';

function updateDateAndTime(dateInput) {
    let currentDateTime = '';
    if (dateInput === undefined) {
        currentDateTime = new Date();
    } else {
        const inputParts = dateInput.split(', ');
        const inputYear = inputParts[0];
        const inputMonth = inputParts[1] - 1;
        const inputDay = inputParts[2];
        const inputHour = inputParts[3];
        const inputMinute = inputParts[4];
        const inputSecond = inputParts[5];
        currentDateTime = new Date(Date.UTC(inputYear, inputMonth, inputDay, inputHour, inputMinute, inputSecond));
        currentDateTime.setUTCFullYear(inputYear);
    }
    
    //let currentTimeZone = currentDateTime.getTimezoneOffset();
    //let fixedTimeZone = Math.floor(Math.abs(currentTimeZone/60));
    //currentDateTime.setHours(currentDateTime.getUTCHours() + fixedTimeZone);

    const decimals = 10;
    const gregorianLocal = getGregorianDateTime(currentDateTime);
    const julianDay = getJulianDayNumber(currentDateTime)
    const dayFraction = calculateDay(currentDateTime)

    // All fractional times
    setTimeValue('local-time-node', gregorianLocal.time);
    setTimeValue('utc-node', currentDateTime.toISOString().slice(0, -5));
    setTimeValue('day-node', dayFraction.toFixed(decimals));
    setTimeValue('month-node', calculateMonth(currentDateTime).toFixed(decimals));
    setTimeValue('year-node', calculateYear(currentDateTime).toFixed(decimals));
    setTimeValue('hour-node', calculateHour(currentDateTime).toFixed(decimals));
    setTimeValue('minute-node', calculateMinute(currentDateTime).toFixed(decimals));
    setTimeValue('second-node', calculateSecond(currentDateTime).toFixed(decimals));
    setTimeValue('decade-node', calculateDecade(currentDateTime).toFixed(decimals));
    setTimeValue('century-node', calculateCentury(currentDateTime).toFixed(decimals));
    setTimeValue('millennium-node', calculateMillennium(currentDateTime).toFixed(decimals));

    // Computing Times
    setTimeValue('unix-node', getUnixTime(currentDateTime));
    setTimeValue('filetime-node', getCurrentFiletime(currentDateTime));
    setTimeValue('iso8601-node', currentDateTime.toISOString());
    setTimeValue('gps-node', getGPSTime(currentDateTime));
    setTimeValue('julian-day-number-node', julianDay);
    setTimeValue('julian-period-node', getJulianPeriod(currentDateTime));
    setTimeValue('rata-die-node', getRataDie(currentDateTime));
    setTimeValue('tai-node', getTAI(currentDateTime).toISOString().slice(0, -5));
    setTimeValue('loran-c-node', getLORANC(currentDateTime).toISOString().slice(0, -5));
    setTimeValue('dynamical-time-node', getDynamicalTimeForward(currentDateTime));
    setTimeValue('lilian-date-node', getLilianDate(julianDay));

    // Decimal Time
    setTimeValue('revolutionary-time-node', getRevolutionaryTime(dayFraction));
    setTimeValue('beat-time-node', convertToSwatchBeats(currentDateTime));
    setTimeValue('hexadecimal-node', getHexadecimalTime(dayFraction));
    setTimeValue('binary-node', getBinaryTime(dayFraction));

    // Solar Calendars
    setTimeValue('gregorian-node', gregorianLocal.date);
    setTimeValue('human-era-node', getHumanEra(currentDateTime));
    setTimeValue('julian-node', getJulianDate(currentDateTime));
    setTimeValue('french-republican-node', getRepublicanCalendar(currentDateTime));
    setTimeValue('era-fascista-node', getEraFascista(currentDateTime));
    setTimeValue('minguo-node', getMinguo(currentDateTime));
    setTimeValue('thai-solar-node', getThaiSolar(currentDateTime));
    setTimeValue('juche-node', getJuche(currentDateTime));
    setTimeValue('coptic-node', julianDayToCoptic(julianDay));
    setTimeValue('ethiopian-node', julianDayToEthiopian(julianDay));
    setTimeValue('invariable-node', getInvariableCalendarDate(currentDateTime));
    setTimeValue('world-calendar-node', getWorldCalendarDate(currentDateTime));

    // Lunisolar Calendars
    let lunisolarCalendarChina = getLunisolarCalendarDate(currentDateTime, 16); // China midnight happens at UTC 16:00
    let lunisolarCalendarVietnam = getLunisolarCalendarDate(currentDateTime, 15); // Vietnam midnight happens at UTC 15:00
    let chineseCalendar = getChineseLunisolarCalendarDate(currentDateTime, lunisolarCalendarChina);
    setTimeValue('sexagenary-year-node', getSexagenaryYear(chineseCalendar));
    setTimeValue('chinese-node', chineseCalendar);
    setTimeValue('vietnamese-node', getVietnameseLunisolarCalendarDate(currentDateTime, lunisolarCalendarVietnam));
    setTimeValue('dangun-node', getDangunLunisolarCalendarDate(currentDateTime, lunisolarCalendarChina));

    // Lunar Calendars
    setTimeValue('hijri-node', findCurrentHijriDate(currentDateTime));

    // Astronomical Data
    setTimeValue('spring-equinox-node', getCurrentSolsticeOrEquinox(currentDateTime, 'spring'));
    setTimeValue('summer-solstice-node', getCurrentSolsticeOrEquinox(currentDateTime, 'summer'));
    setTimeValue('autumn-equinox-node', getCurrentSolsticeOrEquinox(currentDateTime, 'autumn'));
    setTimeValue('winter-solstice-node', getCurrentSolsticeOrEquinox(currentDateTime, 'winter'));
    setTimeValue('sun-longitude-node', getLongitudeOfSun(currentDateTime)+'°');
    setTimeValue('this-new-moon-node', getNewMoonThisMonth(currentDateTime, 0));

    // Pop Culture
    setTimeValue('shake-of-a-lambs-tail-node', getCurrentShakeOfALambsTail(currentDateTime));
}

function createElements() {
    standardTimeData.forEach(item => {
        createnode(item);
    });
    computingTimeData.forEach(item => {
        createnode(item);
    });
    decimalTimeData.forEach(item => {
        createnode(item);
    });
    solarCalendarsData.forEach(item => {
        createnode(item);
    });
    lunisolarCalendarsData.forEach(item => {
        createnode(item);
    });
    lunarCalendarsData.forEach(item => {
        createnode(item);
    });
    astronomicalData.forEach(item => {
        createnode(item);
    });
    popCultureData.forEach(item => {
        createnode(item);
    });
}

// Function to create node elements
function createnode(item) {
    const standardTime = document.querySelector('.standard-time');
    const computingTime = document.querySelector('.computing-time');
    const decimalTime = document.querySelector('.decimal-time');
    const solarCalendars = document.querySelector('.solar-calendars');
    const lunisolarCalendars = document.querySelector('.lunisolar-calendars');
    const lunarCalendars = document.querySelector('.lunar-calendars');
    const astronomicalData = document.querySelector('.astronomical-data');
    const popCulture = document.querySelector('.pop-culture');

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

    // Create a popup tooltip for the description
    const description = document.createElement('div');
    description.id = item.id + '-tooltip';
    description.classList.add('tooltip');

    // Add tooltip elements
    const titleElement = document.createElement('div');
    titleElement.textContent = `${item.name}`;
    titleElement.classList.add('tooltip-title');
    description.appendChild(titleElement);

    const epochElement = document.createElement('div');
    epochElement.textContent = `Epoch: ${item.epoch}`;
    epochElement.classList.add('tooltip-epoch');
    description.appendChild(epochElement);

    const confidenceElement = document.createElement('div');
    confidenceElement.textContent = `Confidence: ${item.confidence}`;
    confidenceElement.classList.add('tooltip-confidence');
    description.appendChild(confidenceElement);

    const descriptionElement = document.createElement('div');
    descriptionElement.textContent = `${item.description}`;
    descriptionElement.classList.add('tooltip-description');
    description.appendChild(descriptionElement);

    // Append the label, content, and description to the node
    node.appendChild(label);
    node.appendChild(content);
    document.querySelector('.description-wrapper').appendChild(description);

    node.addEventListener('click', () => {
        // Select a node and update the description while deselecting an old node
        visibleTooltip.style.visibility = 'hidden';
        visibleTooltip = description;
        description.style.visibility = 'visible';
        document.querySelector('.pre-description').style.visibility = 'hidden';
        // Return border color of deselected node if there is one
        if (selectedNode !== '') {
            selectedNode.style.borderColor = '';
            selectedNode.style.backgroundColor = '';
        }
        selectedNode = content;
        content.style.borderColor = 'rgb(150, 150, 150)';
    });


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

    node.addEventListener('mousedown', () => {
        // Change background color of a node when selected
        content.style.backgroundColor = 'rgb(150, 150, 150)';
        setTimeout(() => {
            content.style.transition = 'background-color 0.3s';
            content.style.backgroundColor = 'rgb(60, 60, 60)';
        }, 150);
    });

    nodeWrapper.addEventListener('click', (event) => {
        // Check if the click target is a node or a descendant of a node
        const isNodeClick = event.target.classList.contains('node') || event.target.closest('.node');

        // If it's not a node click, deselect the node
        if (!isNodeClick) {
            // Replace the tooltip with the landing text
            visibleTooltip.style.visibility = 'hidden';
            visibleTooltip = description;
            document.querySelector('.pre-description').style.visibility = 'visible';

            // Handle the highlighting of the deselected node
            if (selectedNode !== '') {
                selectedNode.style.borderColor = '';
                selectedNode.style.backgroundColor = '';
            }
            selectedNode = '';
        }
    });

    if (item.type === 'Solar Calendar') {
        solarCalendars.appendChild(node);
    } else if (item.type === 'Computing Time') {
        computingTime.appendChild(node);
    } else if (item.type === 'Standard Time') {
        standardTime.appendChild(node);
    } else if (item.type === 'Decimal Time') {
        decimalTime.appendChild(node);
    } else if (item.type === 'Lunisolar Calendar') {
        lunisolarCalendars.appendChild(node);
    } else if (item.type === 'Lunar Calendar') {
        lunarCalendars.appendChild(node);
    } else if (item.type === 'Astronomical Data') {
        astronomicalData.appendChild(node);
    } else if (item.type === 'Pop Culture') {
        popCulture.appendChild(node);
    }
}
let updateIntervalId;

// Draw elements in HTML
createElements();

// Update the date and time every millisecond
updateIntervalId = setInterval(updateDateAndTime, 1);

// Initial update
updateDateAndTime();

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