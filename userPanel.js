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