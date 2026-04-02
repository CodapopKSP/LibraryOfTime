// Glossary content and functionality for the Library of Time

// Glossary terms and definitions
const glossaryContent = {
    title: "Glossary of Terms",
    terms: [
        {
            term: "Calculated",
            definition: "Based on mathematical formulas, typically including rules for leap years and intercalations in order to approximate the solar year or lunar month."
        },
        {
            term: "Calibration",
            definition: "The process of adjusting an algorithm on this website to keep it in sync with official sources."
        },
        {
            term: "Drift",
            definition: "The gradual accumulation of error in a timekeeping system."
        },
        {
            term: "Epoch",
            definition: "A specific point in time used as a reference point for a calendar system."
        },
        {
            term: "Gregorian-based, Julian-based",
            definition: "Including all of the elements of the Gregorian or Julian calendar, such as the month names, leap year rules, and the number of days in each month, but with a different epoch."
        },
        {
            term: "Gregorian-derived, Julian-derived",
            definition: "A completely separate calendar system from the Gregorian or Julian calendar, but intrinsically related to them so that they do not experience any drift and can be calculated from them."
        },
        {
            term: "Intercalation",
            definition: "The process of adding an extra day or month to a calendar to keep it in sync with the solar year or lunar month."
        },
        {
            term: "Leap Second",
            definition: "An extra second added to the UTC time scale to keep it in sync with the solar year."
        },
        {
            term: "Liturgical",
            definition: "Used for religious purposes."
        },
        {
            term: "Lunar Calendar",
            definition: "A calendar that uses the lunar month as its basic unit, typically beginning with the new moon and ignoring the solar year entirely."
        },
        {
            term: "Lunisolar Calendar",
            definition: "A calendar that uses both the lunar month and the solar year as its basic units, using the moon to determine the month and the solar year to determine the year, with an intercalary leap month added every few years to keep the lunar month in sync with the solar year."
        },
        {
            term: "Metonic Cycle",
            definition: "A cycle of 19 years that repeats the same pattern of leap months and non-leap months in a lunisolar calendar. Leap years are typically years 3, 6, 8, 11, 14, 17, 19 in the cycle."
        },
        {
            term: "Observational",
            definition: "Based on observations of celestial phenomena such as the phases of the moon, equinoxes, solstices, positions of stars, and other astronomical events."
        },
        {
            term: "Orbit",
            definition: "The path of a celestial body around another celestial body."
        },
        {
            term: "Proleptic",
            definition: "The process of extending a calendar system backward in time before its historical introduction."
        },
        {
            term: "Solar Calendar",
            definition: "A calendar that uses the solar year as its basic unit, keeping the seasons in alignment. Usually refers to the Earth moving once around the sun."
        },
        {
            term: "Solilunar Calendar",
            definition: "A calendar that uses both the lunar month and the solar year as its basic units, using the moon to determine the month and the solar year to determine the year. Unlike a lunisolar calendar, the solar year always occurs after the same event, eliminating the need for intercalation rules."
        },
        {
            term: "Year 0 Problem",
            definition: "The issue of having no year 0 in the Julian calendar and how it relates to the Gregorian calendar. This website assumes year 0 exists for the Gregorian calendar but not for the Julian calendar."
        },
    ]
};

// Function to generate glossary HTML
function generateGlossaryHTML() {
    const termsHTML = glossaryContent.terms.map(item =>
        `<p><strong>${item.term}</strong><br>${item.definition}</p>`
    ).join('');
    
    return termsHTML;
}

// Glossary modal functionality
document.addEventListener('DOMContentLoaded', function() {
    const glossaryModal = document.getElementById('glossary-modal');
    const glossaryBtn = document.getElementById('glossary-button');
    const glossaryHeaderClose = document.getElementById('glossary-modal-close');
    const glossaryCloseButton = document.getElementById('glossary-close-button');
    const glossaryText = document.getElementById('glossary-text');

    // Populate glossary content
    glossaryText.innerHTML = generateGlossaryHTML();

    // When the user clicks the glossary button, open the modal
    glossaryBtn.onclick = function() {
        glossaryModal.style.display = 'block';
    }

    // When the user clicks the header (x), close the glossary modal
    glossaryHeaderClose.onclick = function() {
        glossaryModal.style.display = 'none';
    }

    // When the user clicks the close button at the bottom, close the glossary modal
    glossaryCloseButton.onclick = function() {
        glossaryModal.style.display = 'none';
    }

    // When the user clicks anywhere outside of the glossary modal, close it
    window.onclick = function(event) {
        if (event.target == glossaryModal) {
            glossaryModal.style.display = 'none';
        }
    }

    // Close glossary modal when Escape key is pressed
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && glossaryModal.style.display === 'block') {
            glossaryModal.style.display = 'none';
        }
    });
});
