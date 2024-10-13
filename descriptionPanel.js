/*
    |=========================|
    |    Description Panel    |
    |=========================|

    This is a collection of functions for drawing and handling the Description Panel.
*/

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
    about: createHomePageDescription('about', 'nodeinfo-info'),
    mission: createHomePageDescription('mission', 'nodeinfo-mission'),
    accuracy: createHomePageDescription('accuracy', 'nodeinfo-accuracy'),
    sources: createHomePageDescription('sources', 'nodeinfo-sources'),
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
            <tr><td>${item.epoch}</td></tr>
        </table>`;
    epochElement.classList.add('nodeinfo-epoch');
    return epochElement;
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

function changeActiveHeaderTab(selectedTab, index) {
    // Toggle selected tab header
    headerTabs.forEach((tabID) => {
        const tab = document.getElementById(tabID);
        const isSelected = tabID === selectedTab;
        tab.classList.toggle('selected', isSelected);
    });

    // Toggle tab info
    currentDescriptionTab.forEach((page, i) => {
        page.classList.toggle('active', i === index);
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
