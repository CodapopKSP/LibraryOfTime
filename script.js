//https://www.fourmilab.ch/documents/calendar/
//https://archive.org/details/astronomicalalgorithmsjeanmeeus1991/page/n7/mode/2up
//http://www.leapsecond.com/java/gpsclock.htm
//https://www.tondering.dk/claus/cal/julperiod.php
//https://en.wikipedia.org/wiki/Date_and_time_notation_in_Thailand
//https://ytliu0.github.io/ChineseCalendar/rules.html

const decimals = 10;
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
    }
    /*
    console.log(currentDateTime);
    if (dateInput !== '') {
        currentDateTime = new Date(dateInput);
    }*/
    
    //let currentDateTime = new Date(Date.UTC(2023, 8, 12, 12, 0, 0));
    //currentDateTime.setUTCFullYear(8);
    
    //let currentTimeZone = currentDateTime.getTimezoneOffset();
    //let fixedTimeZone = Math.floor(Math.abs(currentTimeZone/60));
    //currentDateTime.setHours(currentDateTime.getUTCHours() + fixedTimeZone);

    // Get basic info about the date and time
    let day = currentDateTime.getDate().toString().padStart(2, '0');
    let month = currentDateTime.getMonth();
    let year = currentDateTime.getFullYear();
    let hour = currentDateTime.getHours().toString().padStart(2, '0');
    let minute = currentDateTime.getMinutes().toString().padStart(2, '0');
    let second = currentDateTime.getSeconds().toString().padStart(2, '0');
    const dayOfWeek = currentDateTime.getDay();
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let yearSuffix = 'CE';
    if (year<1) {
        yearSuffix = 'BCE';
    }
    let dateDisplayString = day + ' ' + monthNames[month] + ' ' + year + ' ' + yearSuffix;
    let timeDisplayString = dayNames[dayOfWeek] + ' ' + hour + ':' + minute + ':' + second;

    // All fractional times
    let secondFraction = calculateSecond(currentDateTime);
    let minuteFraction = calculateMinute(currentDateTime);
    let hourFraction = calculateHour(currentDateTime);
    let dayFraction = calculateDay(currentDateTime);
    let monthFraction = calculateMonth(currentDateTime);
    let yearFraction = calculateYear(currentDateTime);
    let decadeFraction = calculateDecade(currentDateTime);
    let centuryFraction = calculateCentury(currentDateTime);
    let millenniumFraction = calculateMillennium(currentDateTime);
    setTimeValue('local-time-node', timeDisplayString)
    setTimeValue('utc-node', currentDateTime.toISOString().slice(0, -5));
    setTimeValue('day-node', dayFraction.toFixed(decimals));
    setTimeValue('month-node', monthFraction.toFixed(decimals));
    setTimeValue('year-node', yearFraction.toFixed(decimals));
    setTimeValue('hour-node', hourFraction.toFixed(decimals));
    setTimeValue('minute-node', minuteFraction.toFixed(decimals));
    setTimeValue('second-node', secondFraction.toFixed(decimals));
    setTimeValue('decade-node', decadeFraction.toFixed(decimals));
    setTimeValue('century-node', centuryFraction.toFixed(decimals));
    setTimeValue('millennium-node', millenniumFraction.toFixed(decimals));

    // Computing Times
    let currentUnixDateTime = getUnixTime(currentDateTime);
    let filetimeValue = getCurrentFiletime(currentDateTime);
    let iso8601Value = currentDateTime.toISOString();
    let gpsValue = getGPSTime(currentDateTime);
    let julianDay = getJulianDayNumber(currentDateTime)
    let rataDie = getRataDie(currentDateTime);
    let TAI = getTAI(currentDateTime).toISOString().slice(0, -5);
    let LORANC = getLORANC(currentDateTime).toISOString().slice(0, -5);
    let julianPeriod = getJulianPeriod(currentDateTime);
    let dynamicalTime = getDynamicalTimeForward(currentDateTime);
    let lilianDate = getLilianDate(julianDay);
    setTimeValue('unix-node', currentUnixDateTime);
    setTimeValue('filetime-node', filetimeValue);
    setTimeValue('iso8601-node', iso8601Value);
    setTimeValue('gps-node', gpsValue);
    setTimeValue('julian-day-number-node', julianDay);
    setTimeValue('julian-period-node', julianPeriod);
    setTimeValue('rata-die-node', rataDie);
    setTimeValue('tai-node', TAI);
    setTimeValue('loran-c-node', LORANC);
    setTimeValue('dynamical-time-node', dynamicalTime);
    setTimeValue('lilian-date-node', lilianDate);

    // Decimal Time
    let decimalTime = getRevolutionaryTime(dayFraction);
    let swatchBeats = convertToSwatchBeats(currentDateTime);
    let hexadecimalTime = getHexadecimalTime(dayFraction);
    let binaryTime = getBinaryTime(dayFraction);
    //const newHexColor = get6DigitHexadecimalTime(dayFraction);
    //const hexColornode = document.querySelector('#hex-color-node');
    //const rgbaColor = hexToRGBA(newHexColor, 0.25);
    //hexColornode.style.backgroundColor = rgbaColor
    setTimeValue('revolutionary-time-node', decimalTime);
    setTimeValue('beat-time-node', swatchBeats);
    setTimeValue('hexadecimal-node', hexadecimalTime);
    setTimeValue('binary-node', binaryTime);

    // Solar Calendars
    let humanEra = getHumanEra(currentDateTime);
    let julianCalendar = getJulianDate(currentDateTime);
    let gregorianCalendar = dateDisplayString;
    let minguoCalendar = getMinguo(currentDateTime);
    let jucheCalendar = getJuche(currentDateTime);
    let thaiSolar = getThaiSolar(currentDateTime);
    let eraFascista = getEraFascista(currentDateTime)
    let republicanCalendar = getRepublicanCalendar(currentDateTime);
    let copticCalendar = julianDayToCoptic(julianDay);
    let ethiopianCalendar = julianDayToEthiopian(julianDay);
    let invariableCalendar = getInvariableCalendarDate(currentDateTime);
    let worldCalendar = getWorldCalendarDate(currentDateTime);
    setTimeValue('gregorian-node', gregorianCalendar);
    setTimeValue('human-era-node', humanEra);
    setTimeValue('julian-node', julianCalendar);
    setTimeValue('french-republican-node', republicanCalendar);
    setTimeValue('era-fascista-node', eraFascista);
    setTimeValue('minguo-node', minguoCalendar);
    setTimeValue('thai-solar-node', thaiSolar);
    setTimeValue('juche-node', jucheCalendar);
    setTimeValue('coptic-node', copticCalendar);
    setTimeValue('ethiopian-node', ethiopianCalendar);
    setTimeValue('invariable-node', invariableCalendar);
    setTimeValue('world-calendar-node', worldCalendar);

    // Lunisolar Calendars
    let chineseCalendar = getChineseLunisolarCalendarDate(currentDateTime);
    let vietnameseZodiacYear = getVietnameseZodiacYear(year);
    setTimeValue('sexagenary-year-node', getSexagenaryYear(chineseCalendar));
    setTimeValue('chinese-node', chineseCalendar);
    setTimeValue('vietnamese-zodiac-node', vietnameseZodiacYear);

    // Lunar Calendars
    let hijriCalendar = findCurrentHijriDate(currentDateTime);
    setTimeValue('hijri-node', hijriCalendar);

    // Astronomical Data
    let springEquinox = getCurrentSolsticeOrEquinox(currentDateTime, 'spring');
    let summerSolstice = getCurrentSolsticeOrEquinox(currentDateTime, 'summer');
    let autumnEquinox = getCurrentSolsticeOrEquinox(currentDateTime, 'autumn');
    let winterSolstice = getCurrentSolsticeOrEquinox(currentDateTime, 'winter');
    let sunLongitude = getLongitudeOfSun(currentDateTime);
    let nextNewMoon = getNewMoonThisMonth(currentDateTime, 0);
    setTimeValue('spring-equinox-node', springEquinox);
    setTimeValue('summer-solstice-node', summerSolstice);
    setTimeValue('autumn-equinox-node', autumnEquinox);
    setTimeValue('winter-solstice-node', winterSolstice);
    setTimeValue('sun-longitude-node', sunLongitude+'°');
    setTimeValue('this-new-moon-node', nextNewMoon);
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