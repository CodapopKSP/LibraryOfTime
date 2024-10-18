/*
    |=========================|
    |    Description Panel    |
    |=========================|

    This is a collection of functions for drawing and handling the Description Panel.
*/

const headerTabs = ['header-button-1', 'header-button-2', 'header-button-3', 'header-button-4'];

function createHomePageDescription(contentKey, contentClass) {
    const description = document.createElement('div');
    description.classList.add('nodeinfo');
    const contentElement = document.createElement('div');
    contentElement.innerHTML = welcomeDescription[0][contentKey];
    contentElement.classList.add(contentClass);
    description.appendChild(contentElement);
    return description;
}

// Create descriptions for Home Page tabs
const homePageDescriptions = {
    about: createHomePageDescription('about', 'home-info'),
    mission: createHomePageDescription('mission', 'home-mission'),
    accuracy: createHomePageDescription('accuracy', 'home-accuracy'),
    sources: createHomePageDescription('sources', 'home-sources'),
};

function createTitleElement(name) {
    const titleElement = document.createElement('div');
    titleElement.textContent = name;
    titleElement.classList.add('nodeinfo-title');
    return titleElement;
}

function createNodeDescription(item, type) {
    const description = document.createElement('div');
    description.id = `${item.id}-nodeinfo-${type}`;
    description.classList.add('nodeinfo');

    // Create and append the title
    description.appendChild(createTitleElement(item.name));

    // Create content based on type
    let contentElement = document.createElement('div');
    contentElement.classList.add(`nodeinfo-${type}`);

    if (type === 'overview') {
        const overviewElement = document.createElement('div');
        overviewElement.innerHTML = item.overview;
        overviewElement.classList.add('nodeinfo-overview');
        description.appendChild(createEpochElement(item));
        description.appendChild(createConfidenceElement(item));
        description.appendChild(overviewElement);
    } else {
        // For 'info', 'accuracy', 'source'
        contentElement.innerHTML = item[type];
        description.appendChild(contentElement);
    }
    return description;
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
    const tdElement = epochElement.querySelector('.clickable-epoch');
    tdElement.addEventListener('click', function() {
        handleEpochClick(item.epoch); // Function to be called on click
    });

    tdElement.addEventListener('mouseenter', function() {
        tdElement.classList.add('hovering');
    });
    tdElement.addEventListener('mouseleave', function() {
        tdElement.classList.remove('hovering');
    });

    return epochElement;
}

function handleEpochClick(epoch) {
    console.log(formatDateTime(epoch));
    changeDateTime(formatDateTime(epoch), "UTC+00:00");
}


function formatDateTime(dateString) {
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
    const date = new Date(Date.UTC(inputYear, monthIndex, parseInt(day, 10)));

    // Set the actual year correctly using setUTCFullYear for BCE/CE
    date.setUTCFullYear(era === 'BCE' ? -inputYear : inputYear);

    // Format the date into yyyy-mm-dd
    const year = String(date.getUTCFullYear()).padStart(4, '0'); // Ensure year is always four digits
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const dayFormatted = String(date.getUTCDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${dayFormatted}`;

    // Handle time part (optional)
    let formattedTime = '00:00:00';
    if (timePart) {
        // Format time into hh:mm:ss
        const [hours, minutes, seconds] = timePart.split(':');
        formattedTime = `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
    }

    // Return formatted date and time
    return `${formattedDate}, ${formattedTime}`;
}

function createConfidenceElement(item) {
    const confidenceElement = document.createElement('div');
    confidenceElement.innerHTML = `
        <table class="table-confidence">
            <tr><th><b>Confidence: ${item.confidence}</b></th></tr>
        </table>`;
    confidenceElement.classList.add('nodeinfo-confidence');
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
    currentDescriptionTab.forEach((page, i) => {
        page.classList.toggle('activePage', i === index);
    });
}

function homeButton() {
    // Clear the Description Panel
    clearDescriptionPanel();
    clearSelectedNode();
    const homeButton = document.getElementById('home-button');
    homeButton.style.visibility = 'hidden';

    // Build the Home Description Panel
    Object.values(homePageDescriptions).forEach(description => {
        document.querySelector('.description-wrapper').appendChild(description);
    });
    currentDescriptionTab = Object.values(homePageDescriptions);
    updateHeaderTabTitles(['About','Mission','Accuracy','Sources']);
    changeActiveHeaderTab('header-button-1', 0);
}

function updateHeaderTabTitles(labels) {
    headerTabs.forEach((btnId, index) => {
        const btn = document.getElementById(btnId);
        btn.innerHTML = `<b>${labels[index]}</b>`;
    });
}

function clearDescriptionPanel() {
    const nodeinfos = document.querySelectorAll('.nodeinfo');
    nodeinfos.forEach(nodeinfo => {
        nodeinfo.parentNode.removeChild(nodeinfo);
    });
}
