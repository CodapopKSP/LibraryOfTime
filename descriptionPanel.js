// Define a function to create description elements
function createHomePageDescription(contentKey, contentClass) {
    const description = document.createElement('div');
    description.classList.add('tooltip');
    const contentElement = document.createElement('div');
    contentElement.innerHTML = welcomeDescription[0][contentKey];
    contentElement.classList.add(contentClass);
    description.appendChild(contentElement);
    return description;
}

// Create descriptions for home page tabs
const homePageDescriptions = {
    about: createHomePageDescription('about', 'tooltip-info'),
    mission: createHomePageDescription('mission', 'tooltip-mission'),
    accuracy: createHomePageDescription('accuracy', 'tooltip-accuracy'),
    sources: createHomePageDescription('sources', 'tooltip-sources'),
};

// Helper function to create title element
function createTitleElement(name) {
    const titleElement = document.createElement('div');
    titleElement.textContent = name;
    titleElement.classList.add('tooltip-title');
    return titleElement;
}

// Helper function to create description elements
function createDescription(item, type) {
    const description = document.createElement('div');
    description.id = `${item.id}-tooltip-${type}`;
    description.classList.add('tooltip');

    // Create and append the title
    description.appendChild(createTitleElement(item.name));

    // Create content based on type
    let contentElement = document.createElement('div');
    contentElement.classList.add(`tooltip-${type}`);

    if (type === 'overview') {
        // Overview includes epoch and confidence
        const epochElement = document.createElement('div');
        epochElement.innerHTML = `
            <table class="table-epoch">
                <tr><th><b>Epoch</b></th></tr>
                <tr><td>${item.epoch}</td></tr>
            </table>`;
        epochElement.classList.add('tooltip-epoch');

        const confidenceElement = document.createElement('div');
        confidenceElement.innerHTML = `
            <table class="table-confidence">
                <tr><th><b>Confidence: ${item.confidence}</b></th></tr>
            </table>`;
        confidenceElement.classList.add('tooltip-confidence');

        const overviewElement = document.createElement('div');
        overviewElement.innerHTML = item.overview;
        overviewElement.classList.add('tooltip-overview');

        description.appendChild(epochElement);
        description.appendChild(confidenceElement);
        description.appendChild(overviewElement);
    } else {
        // For 'info', 'accuracy', 'source'
        contentElement.innerHTML = item[type];
        description.appendChild(contentElement);
    }

    return description;
}

// Register a click of a header button
function changeActiveHeaderButton(button, index) {
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
    const tooltips = document.querySelectorAll('.tooltip');
    deleteAllTooltips();
    Object.values(homePageDescriptions).forEach(description => {
        document.querySelector('.description-wrapper').appendChild(description);
    });
    currentDescriptionPage = Object.values(homePageDescriptions);
    visibleTooltip = homePageDescriptions['about'];
    updateHeaderButtonTitles(['About','Mission','Accuracy','Sources']);

    // Return to home description
    changeActiveHeaderButton('header-button-1', 0);
    const homeButton = document.getElementById('home-button');
    homeButton.style.visibility = 'hidden';

    // Return border color of deselected node if there is one
    clearSelectedNode()
}

// Function to update header buttons
function updateHeaderButtonTitles(labels) {
    const headerButtons = ['header-button-1', 'header-button-2', 'header-button-3', 'header-button-4'];
    headerButtons.forEach((btnId, index) => {
        const btn = document.getElementById(btnId);
        btn.innerHTML = `<b>${labels[index]}</b>`;
    });
}

function deleteAllTooltips() {
    const tooltips = document.querySelectorAll('.tooltip');
    tooltips.forEach(tooltip => {
        tooltip.parentNode.removeChild(tooltip);
    });
}
