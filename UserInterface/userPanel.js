
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
}

function toggleFloatingPanelVisibility() {
    if (!panel) {
        return;
    }
    const isHidden = panel.style.display === "none" || panel.style.display === "";
    setFloatingPanelOpen(isHidden);
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

    window.toggleFloatingPanelVisibility = toggleFloatingPanelVisibility;
    window.setFloatingPanelOpen = setFloatingPanelOpen;
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





