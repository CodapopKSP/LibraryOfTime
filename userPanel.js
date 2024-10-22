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