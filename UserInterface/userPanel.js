
const toggleButton = document.getElementById("floating-panel-toggle-button");
const panel = document.getElementById("floating-panel");

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

function instantiateFloatingPanel() {
    // Show/Hide the panel when the button is clicked
    toggleButton.addEventListener("click", () => {
        if (panel.style.display === "none" || panel.style.display === "") {
        panel.style.display = "flex";
        } else {
        panel.style.display = "none";
        }
    });

    panel.addEventListener("mousedown", (e) => {
        e.preventDefault();
        
        // Get the mouse cursor position at startup
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Call the function when the cursor moves
        document.addEventListener("mousemove", movePanel);
        
        // Stop moving when mouse button is released
        document.addEventListener("mouseup", stopDrag);
    });
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
                gridItem.classList.add(className);
            });
        }

        gridItem.appendChild(clonedParent);
    } else {
        console.error(`Element with id ${item.id}-node not found.`);
    }
}





