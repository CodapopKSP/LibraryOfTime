// Node parent elements
const parentElements = {
    'Solar Calendar': document.querySelector('.solar-calendars'),
    'Computing Time': document.querySelector('.computing-time'),
    'Standard Time': document.querySelector('.standard-time'),
    'Decimal Time': document.querySelector('.decimal-time'),
    'Other Time': document.querySelector('.other-time'),
    'Lunisolar Calendar': document.querySelector('.lunisolar-calendars'),
    'Lunar Calendar': document.querySelector('.lunar-calendars'),
    'Proposed Calendar': document.querySelector('.proposed-calendars'),
    'Other Calendar': document.querySelector('.other-calendars'),
    'Astronomical Data': document.querySelector('.astronomical-data'),
    'Pop Culture': document.querySelector('.pop-culture'),
    'Politics': document.querySelector('.politics')
};

function handleNodeClick(content, descriptions) {
    // Hide the previous tooltip
    visibleTooltip = descriptions[0];
    visibleTooltip.style.visibility = 'visible';

    // Hide previous descriptions and show new ones
    currentDescriptionPage.forEach(desc => {
        desc.style.visibility = 'hidden';
    });
    currentDescriptionPage = descriptions;

    // Update the selected node styling
    if (selectedNode && selectedNode !== content) {
        clearSelectedNode();
    }
    selectedNode = content;
    content.style.borderColor = 'rgb(150, 150, 150)';
    updateHeaderButtonTitles(['Overview', 'Info', 'Accuracy', 'Source']);

    // Show home button
    document.getElementById('home-button').style.visibility = 'visible';

    // Show the first description by default
    changeActiveHeaderButton('header-button-1', 0);
}

// Refactored createNode function
function createNode(item) {
    // Create the node element
    const node = document.createElement('div');
    node.classList.add('node');

    // Create and append the label
    const label = document.createElement('label');
    label.textContent = item.name;
    node.appendChild(label);

    // Create and append the content div
    const content = document.createElement('div');
    content.id = `${item.id}-node`;
    content.classList.add('content');
    node.appendChild(content);

    // Add event listeners to the node
    node.addEventListener('click', () => {
        const tooltips = document.querySelectorAll('.tooltip');
        deleteAllTooltips();

        // Create descriptions for 'overview', 'info', 'accuracy', 'source'
        const descriptionTypes = ['overview', 'info', 'accuracy', 'source'];
        const descriptions = descriptionTypes.map(type => createDescription(item, type));

        // Append descriptions to the description wrapper
        const descriptionWrapper = document.querySelector('.description-wrapper');
        descriptions.forEach(description => {
            descriptionWrapper.appendChild(description);
            
        });
        handleNodeClick(content, descriptions);
    });

    node.addEventListener('mouseenter', () => {
        content.style.borderColor = 'rgb(150, 150, 150)';
    });

    node.addEventListener('mouseleave', () => {
        if (selectedNode !== content) {
            content.style.borderColor = '';
        }
    });

    node.addEventListener('mousedown', () => {
        content.style.backgroundColor = 'rgb(150, 150, 150)';
        setTimeout(() => {
            content.style.transition = 'background-color 0.3s';
            content.style.backgroundColor = 'rgb(60, 60, 60)';
        }, 150);
    });

    // Append the node to the corresponding parent element
    const parentElement = parentElements[item.type];
    if (parentElement) {
        parentElement.appendChild(node);
    } else {
        console.error(`No parent element found for item type: ${item.type}`);
    }
}

function clearSelectedNode() {
    if (selectedNode !== '') {
        selectedNode.style.borderColor = '';
        selectedNode.style.backgroundColor = '';
        selectedNode = '';
    }
}