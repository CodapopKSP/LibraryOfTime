
const toggleButton = document.getElementById("floating-panel-toggle-button");
const panel = document.getElementById("floating-panel");
const panelHeader = document.getElementById("floating-panel-header");
const panelClose = document.getElementById("floating-panel-close");

let offsetX = 0, offsetY = 0, mouseX = 0, mouseY = 0;

function movePanel(e) {
    e.preventDefault();
    
    // Calculate the new cursor position
    offsetX = mouseX - e.clientX;
    offsetY = mouseY - e.clientY;
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Set the panel's new position
    panel.style.top = (panel.offsetTop - offsetY) + "px";
    panel.style.left = (panel.offsetLeft - offsetX) + "px";
}
  
function stopDrag() {
    // Remove the mousemove and mouseup events when the drag ends
    document.removeEventListener("mousemove", movePanel);
    document.removeEventListener("mouseup", stopDrag);
}

function setFloatingPanelOpen(isOpen) {
    if (!panel) {
        return;
    }
    panel.style.display = isOpen ? "flex" : "none";
    document.body.classList.toggle("floating-panel-open", isOpen);
    if (isOpen && typeof updateFloatingPanelSlotControls === 'function') {
        document.querySelectorAll('#floating-box-node-container .panel-section').forEach(function (section) {
            updateFloatingPanelSlotControls(section);
        });
    }
}

function toggleFloatingPanelVisibility() {
    if (!panel) {
        return;
    }
    const isHidden = panel.style.display === "none" || panel.style.display === "";
    setFloatingPanelOpen(isHidden);
}

function findNodeDataById(nodeId) {
    for (let i = 0; i < nodeDataArrays.length; i++) {
        const arr = nodeDataArrays[i];
        for (let j = 0; j < arr.length; j++) {
            if (arr[j].id === nodeId) {
                return arr[j];
            }
        }
    }
    return null;
}

function setFloatingPanelAddSelectsEnabled(enabled) {
    document.querySelectorAll('.add-node-select').forEach(function (el) {
        el.disabled = !enabled;
    });
}

function populateFloatingPanelNodeSelectIfNeeded(selectEl) {
    if (selectEl.dataset.prepared === '1') {
        return;
    }
    fillNodeSelectCategoryList(selectEl);
    selectEl.dataset.prepared = '1';
}

/** Sync select: category browser when slot empty, or full node list for that node’s category when filled. */
function syncFloatingPanelAddSelectForSection(panelSection) {
    if (!panelSection) {
        return;
    }
    const selectEl = panelSection.querySelector('.add-node-select');
    if (!selectEl || selectEl.dataset.prepared !== '1') {
        return;
    }
    const gridItem = panelSection.querySelector('.grid-item');
    const contentEl = gridItem && gridItem.querySelector('.node .content');
    const suffix = '-node';

    if (contentEl && contentEl.id && contentEl.id.endsWith(suffix)) {
        const nodeId = contentEl.id.slice(0, -suffix.length);
        const item = findNodeDataById(nodeId);
        if (item && item.type && typeof fillNodeSelectNodesForCategory === 'function') {
            fillNodeSelectNodesForCategory(selectEl, item.type, nodeId);
            if (typeof clearNodeSelectDrillDraft === 'function') {
                clearNodeSelectDrillDraft(selectEl);
            }
            return;
        }
    }
    fillNodeSelectCategoryList(selectEl);
    selectEl.value = '';
}

function wireFloatingPanelNodeSelects() {
    document.querySelectorAll('.add-node-select').forEach(function (selectEl) {
        populateFloatingPanelNodeSelectIfNeeded(selectEl);
        if (typeof wireNodeSelectDrillRestore === 'function') {
            wireNodeSelectDrillRestore(selectEl);
        }
        selectEl.addEventListener('change', function () {
            const interpreted = siteNodeSelectInterpretChange(selectEl);
            if (interpreted.action === 'navigate' || interpreted.action === 'empty') {
                return;
            }
            const item = findNodeDataById(interpreted.nodeId);
            const panelSection = selectEl.closest('.panel-section');
            const gridItem = panelSection && panelSection.querySelector('.grid-item');
            const m = gridItem && gridItem.className.match(/grid-item(\d+)/);
            const gridNumber = m ? parseInt(m[1], 10) : NaN;
            if (item && !isNaN(gridNumber)) {
                nodePlace(item, gridNumber);
            }
        });
    });
}

function instantiateFloatingPanel() {
    if (toggleButton) {
        toggleButton.addEventListener("click", toggleFloatingPanelVisibility);
    }

    panelClose.addEventListener("click", () => {
        setFloatingPanelOpen(false);
    });

    // Drag only from the header bar (not from grid buttons or the close control)
    panelHeader.addEventListener("mousedown", (e) => {
        if (e.target.closest("#floating-panel-close")) {
            return;
        }
        e.preventDefault();

        // Get the mouse cursor position at startup
        mouseX = e.clientX;
        mouseY = e.clientY;

        document.addEventListener("mousemove", movePanel);
        document.addEventListener("mouseup", stopDrag);
    });

    wireFloatingPanelNodeSelects();
}

// Function to redraw everything inside grid-item
function nodePlace(item, grid) {
    const gridItem = document.querySelector(`.grid-item${grid}`);
    if (!gridItem) {
        console.error(`Grid item ${grid} not found.`);
        return;
    }
    
    // Clear the grid item content
    gridItem.innerHTML = '';
    
    // Remove any class that doesn't start with "grid"
    gridItem.classList.forEach(className => {
        if (!className.startsWith('grid')) {
            gridItem.classList.remove(className);
        }
    });

    const sourceElement = document.getElementById(`${item.id}-node`);

    if (sourceElement) {
        const parentElement = sourceElement.parentElement;
        const grandparentElement = parentElement.parentElement;

        const clonedParent = parentElement.cloneNode(true);

        // Add the node ID as a class to the cloned content so it can be updated
        const clonedContent = clonedParent.querySelector('.content');
        if (clonedContent) {
            clonedContent.classList.add(`${item.id}-node`);
            // Remove any selected/hover/active styling classes
            clonedContent.classList.remove('hover', 'active', 'clicking');
        }

        if (grandparentElement) {
            const grandparentClasses = Array.from(grandparentElement.classList);
            grandparentClasses.forEach(className => {
                // Main grid uses .container for card chrome; that breaks panel layout and .content borders
                if (className === 'container') {
                    return;
                }
                gridItem.classList.add(className);
            });
        }

        gridItem.appendChild(clonedParent);
    } else {
        console.error(`Element with id ${item.id}-node not found.`);
    }

    if (typeof updateFloatingPanelSlotControls === 'function') {
        updateFloatingPanelSlotControls(gridItem.closest('.panel-section'));
    }
}





