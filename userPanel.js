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

// Function to redraw everything inside grid-item 1
function nodePlace(item, grid) {
    // Select the grid item based on the grid parameter
    const gridItem = document.querySelector(`.grid-item${grid}`); // Use template literal to include grid in the selector
    // Clear existing content
    gridItem.innerHTML = ''; 

    // Get the source element using the item's id
    const sourceElement = document.getElementById(`${item.id}-node`);

    if (sourceElement) {
        // Get the parent of the source element
        const parentElement = sourceElement.parentElement;
        
        // Get the grandparent of the source element
        const grandparentElement = parentElement.parentElement;

        // Clone the parent element, including its structure and classes
        const clonedParent = parentElement.cloneNode(true); // true to clone all child nodes

        // Add classes of the grandparent to grid-item
        if (grandparentElement) {
            const grandparentClasses = Array.from(grandparentElement.classList);
            grandparentClasses.forEach(className => {
                gridItem.classList.add(className);
            });
        }

        // Append the cloned parent to grid-item
        gridItem.appendChild(clonedParent);
    } else {
        console.error(`Element with id ${item.id}-node not found.`);
    }
}




