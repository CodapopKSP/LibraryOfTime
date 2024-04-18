//|-------------------|
//|     Utilities     |
//|-------------------|

// A set of functions for calculating times in the Computing Time category.



function cleanStupidDate1900Issue(currentDateTime) {
    let year = currentDateTime.getFullYear();
    let dateToFix = new Date(currentDateTime);
    dateToFix.setFullYear(year);
    return dateToFix;
}