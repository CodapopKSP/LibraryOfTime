/*
    |==================|
    |    Node Draw     |
    |==================|

    This is a collection of functions for drawing and handling Nodes.
*/

// Selected node's .content element, or null when selection is not tied to a grid cell (e.g. calendar picker).
let selectedNode = null;
let selectedNodeData = null; // Store the JavaScript object for the selected node

// Keeps track of how far ahead the Julian calendar is from the Gregorian
let _gregJulianDifference = 0;
function getGregJulianDifference() {
    return _gregJulianDifference;
}
function setGregJulianDifference(newDifference) {
    _gregJulianDifference = newDifference;
}

// Fills the description panel for `item` and updates selection; `content` is the grid .content element or null.
function populateNodeDescriptionAndSelection(content, item, options) {
    clearDescriptionPanel();
    var opts = options || {};
    var openMobileSheet = opts.openMobileSheet !== false;
    var descriptionTypes = ['overview', 'info', 'accuracy', 'source'];
    var descriptions = descriptionTypes.map(function (type) {
        return createNodeDescription(item, type);
    });
    var descriptionBody = document.getElementById('description-body');
    descriptionBody.classList.add('has-home-footer');
    descriptions.forEach(function (description) {
        descriptionBody.appendChild(description);
    });
    setCurrentDescriptionTab(descriptions);
    updateHeaderTabTitles(['Overview', 'Info', 'Accuracy', 'Source']);

    if (selectedNode && selectedNode !== content) {
        clearSelectedNode();
    }
    selectedNode = content || null;
    selectedNodeData = item;

    document.getElementById('desktop-home-button').classList.add('home-button-visible');
    changeActiveHeaderTab('header-button-1', 0);

    if (content) {
        content.classList.add('active');
    }

    if (openMobileSheet && typeof window.openMobileDescriptionSheet === 'function') {
        window.openMobileDescriptionSheet();
    }

    if (typeof window.refreshCalendarViewIfOpen === 'function') {
        window.refreshCalendarViewIfOpen();
    }
    if (typeof window.syncMobileDescriptionUi === 'function') {
        window.syncMobileDescriptionUi();
    }
}

/** True when a main-grid node is selected (used for mobile Description toolbar). */
function hasSelectedDescriptionNode() {
    return selectedNode != null && selectedNodeData != null;
}

/** Rebuilds the description panel from the current selection (e.g. after viewing site intro on mobile). */
function ensureDescriptionShowsSelectedNode() {
    if (!selectedNode || !selectedNodeData) {
        return;
    }
    populateNodeDescriptionAndSelection(selectedNode, selectedNodeData, { openMobileSheet: false });
}

function handleNodeClick(content, item) {
    populateNodeDescriptionAndSelection(content, item, { openMobileSheet: true });
}

function createNode(item, parentElements) {
    let node = createNode_(item)

    const parentElement = parentElements[item.type];
    parentElement.appendChild(node);
}

/** Matches `responsive.css` mobile layout; node hover is desktop-only. */
function isMobileLayout() {
    return typeof window.matchMedia === 'function' && window.matchMedia('(max-width: 1024px)').matches;
}

(function initStripNodeHoverOnMobileLayout() {
    if (typeof window.matchMedia !== 'function') return;
    var mq = window.matchMedia('(max-width: 1024px)');
    function stripNodeHover() {
        if (!mq.matches) return;
        document.querySelectorAll('.node .content.hover').forEach(function (el) {
            el.classList.remove('hover');
        });
    }
    if (typeof mq.addEventListener === 'function') {
        mq.addEventListener('change', stripNodeHover);
    } else if (typeof mq.addListener === 'function') {
        mq.addListener(stripNodeHover);
    }
})();

function createNode_(item) {
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
            handleNodeClick(content, item);
        }
    });

    // Mouse hover highlight (desktop only; mobile uses touch — no hover affordance)
    node.addEventListener('mouseenter', () => {
        if (isMobileLayout()) return;
        content.classList.add('hover');
    });

    node.addEventListener('mouseleave', () => {
        content.classList.remove('hover');
    });
    
    // Handle left mouse down to add 'clicking' class (cleared after a short delay).
    // Selection applies `active` in populateNodeDescriptionAndSelection when the click completes.
    node.addEventListener('mousedown', (event) => {
        if (event.button === 0) { // Check if it's a left-click
            content.classList.add('clicking');
            setTimeout(() => {
                content.classList.remove('clicking');
            }, 150);
        }
    });

    // Add right-click event for custom dropdown menu (prevent selection)
    node.addEventListener('contextmenu', (event) => {
        // Check if we're on mobile (portrait orientation and small screen)
        if (window.innerWidth <= 1024 && window.innerHeight > window.innerWidth) {
            event.preventDefault(); // Prevent default context menu on mobile
            return; // Don't show custom menu on mobile
        }
        
        event.preventDefault(); // Prevent default context menu
        event.stopPropagation(); // Stop event propagation
        showNodeMenu(event, item); // Show custom context menu
    });

    return node; // Return the created node for appending elsewhere
}


function showNodeMenu(event, item) {
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
function hideNodeMenu() {
    const dropdownMenu = document.getElementById('node-menu');
    dropdownMenu.style.display = 'none'; // Hide the menu
    window.removeEventListener('click', hideNodeMenu); // Remove listener
}

function clearSelectedNode() {
    if (selectedNode) {
        selectedNode.classList.remove('active');
        selectedNode = null;
        selectedNodeData = null;
    }
    if (typeof window.refreshCalendarViewIfOpen === 'function') {
        window.refreshCalendarViewIfOpen();
    }
    if (typeof window.syncMobileDescriptionUi === 'function') {
        window.syncMobileDescriptionUi();
    }
}

