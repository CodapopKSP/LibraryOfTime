/*
    |====================|
    |    Node Display    |
    |====================|

    This is a collection of functions for drawing and handling Nodes.
*/

function handleNodeClick(content, item) {
    // Build the description format
    const descriptionTypes = ['overview', 'info', 'accuracy', 'source'];
    const descriptions = descriptionTypes.map(type => createNodeDescription(item, type));
    const descriptionWrapper = document.querySelector('.description-wrapper');
    descriptions.forEach(description => {
        descriptionWrapper.appendChild(description);
    });
    currentDescriptionTab = descriptions;
    updateHeaderTabTitles(['Overview', 'Info', 'Accuracy', 'Source']);

    // Update the selected node
    if (selectedNode && selectedNode !== content) {
        clearSelectedNode();
    }
    selectedNode = content;

    // Show home button
    document.getElementById('home-button').style.visibility = 'visible';

    // Show the first description by default
    changeActiveHeaderTab('header-button-1', 0);
}

function createNode(item) {
    // Create the node element
    const node = document.createElement('div');
    node.classList.add('node');

    // Create the label
    const label = document.createElement('label');
    label.textContent = item.name;
    node.appendChild(label);

    // Create the content
    const content = document.createElement('div');
    content.id = `${item.id}-node`;
    content.classList.add('content');
    node.appendChild(content);

    node.addEventListener('click', () => {
        clearDescriptionPanel();
        handleNodeClick(content, item);
    });

    node.addEventListener('mouseenter', () => {
        content.classList.add('hover');
    });
    
    node.addEventListener('mouseleave', () => {
        content.classList.remove('hover');
    });
    
    node.addEventListener('mousedown', () => {
        // Temporarily add the 'clicking' class
        content.classList.add('clicking');
    
        // Remove the 'clicking' class and add 'active' class after 150ms
        setTimeout(() => {
            content.classList.remove('clicking');
            content.classList.add('active');
        }, 150);
    });

    const parentElement = parentElements[item.type];
    parentElement.appendChild(node);
}

function clearSelectedNode() {
    if (selectedNode !== '') {
        selectedNode.classList.remove('active');
        selectedNode = '';
    }
}