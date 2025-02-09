/*
    |====================|
    |    Node Display    |
    |====================|

    This is a collection of functions for drawing and handling Nodes.
*/

import * as descriptionPanel from '../descriptionPanel.js';

// The current selected Node, blank if none
let selectedNode = '';

export function handleNodeClick(content, item) {
    // Build the description format
    const descriptionTypes = ['overview', 'info', 'accuracy', 'source'];
    const descriptions = descriptionTypes.map(type => descriptionPanel.createNodeDescription(item, type));
    const descriptionWrapper = document.querySelector('.description-wrapper');
    descriptions.forEach(description => {
        descriptionWrapper.appendChild(description);
    });
    descriptionPanel.setCurrentDescriptionTab(descriptions);
    descriptionPanel.updateHeaderTabTitles(['Overview', 'Info', 'Accuracy', 'Source']);

    // Update the selected node
    if (selectedNode && selectedNode !== content) {
        clearSelectedNode();
    }
    selectedNode = content;

    // Show home button
    document.getElementById('home-button').style.visibility = 'visible';

    // Show the first description by default
    descriptionPanel.changeActiveHeaderTab('header-button-1', 0);
}

export function createNode(item, parentElements) {
    let node = createNode_(item)

    const parentElement = parentElements[item.type];
    parentElement.appendChild(node);
}

export function createNode_(item) {
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

    // Handle left-click (selection)
    node.addEventListener('click', (event) => {
        if (event.button === 0) { // Check if it's a left-click
            descriptionPanel.clearDescriptionPanel();
            handleNodeClick(content, item);
        }
    });

    // Handle mouse hover effects
    node.addEventListener('mouseenter', () => {
        content.classList.add('hover');
    });
    
    node.addEventListener('mouseleave', () => {
        content.classList.remove('hover');
    });
    
    // Handle left mouse down to add 'clicking' class
    node.addEventListener('mousedown', (event) => {
        if (event.button === 0) { // Check if it's a left-click
            content.classList.add('clicking');
            setTimeout(() => {
                content.classList.remove('clicking');
                content.classList.add('active');
            }, 150);
        }
    });

    // Add right-click event for custom dropdown menu (prevent selection)
    node.addEventListener('contextmenu', (event) => {
        event.preventDefault(); // Prevent default context menu
        event.stopPropagation(); // Stop event propagation
        showNodeMenu(event, item); // Show custom context menu
    });

    return node; // Return the created node for appending elsewhere
}


export function showNodeMenu(event, item) {
    const dropdownMenu = document.getElementById('node-menu');
    dropdownMenu.style.display = 'block';
    dropdownMenu.style.left = `${event.pageX}px`; // Position the menu
    dropdownMenu.style.top = `${event.pageY}px`; // Position the menu

    // Optionally, you can attach data to the menu for further actions
    dropdownMenu.dataset.nodeId = item.id;

    // Add event listeners for dropdown actions
    document.getElementById('node-place1').onclick = () => {
        nodePlace(item, 1); // Define this function to handle edit
        dropdownMenu.style.display = 'none'; // Hide the menu after action
    };
    document.getElementById('node-place2').onclick = () => {
        nodePlace(item, 2); // Define this function to handle edit
        dropdownMenu.style.display = 'none'; // Hide the menu after action
    };
    document.getElementById('node-place3').onclick = () => {
        nodePlace(item, 3); // Define this function to handle edit
        dropdownMenu.style.display = 'none'; // Hide the menu after action
    };
    document.getElementById('node-place4').onclick = () => {
        nodePlace(item, 4); // Define this function to handle edit
        dropdownMenu.style.display = 'none'; // Hide the menu after action
    };

    // Hide the menu when clicking outside
    window.addEventListener('click', hideNodeMenu);
}

// Hide the dropdown menu
export function hideNodeMenu() {
    const dropdownMenu = document.getElementById('node-menu');
    dropdownMenu.style.display = 'none'; // Hide the menu
    window.removeEventListener('click', hideNodeMenu); // Remove listener
}

export function clearSelectedNode() {
    if (selectedNode !== '') {
        selectedNode.classList.remove('active');
        selectedNode = '';
    }
}

