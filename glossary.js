// Glossary content and functionality for the Library of Time

// Glossary terms and definitions
const glossaryContent = {
    title: "Glossary of Terms",
    terms: [
        {
            term: "Solar Calendar",
            definition: "A calendar that uses the solar year as its basic unit, keeping the seasons in alignment. Usually refers to the Earth moving once around the sun."
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
            term: "Solilunar Calendar",
            definition: "A calendar that uses both the lunar month and the solar year as its basic units, using the moon to determine the month and the solar year to determine the year. Unlike a lunisolar calendar, the solar year always occurs after the same event, eliminating the need for intercalation rules."
        },
        {
            term: "Epoch",
            definition: "A specific point in time used as a reference point for a calendar system."
        },
        {
            term: "Intercalation",
            definition: "The process of adding an extra day or month to a calendar to keep it in sync with the solar year or lunar month."
        },
        {
            term: "Liturgical",
            definition: "Used for religious purposes."
        },
        {
            term: "Proleptic",
            definition: "The process of extending a calendar system backward in time before its historical introduction."
        },
        {
            term: "Leap Second",
            definition: "An extra second added to the UTC time scale to keep it in sync with the solar year."
        },
        {
            term: "Metonic Cycle",
            definition: "A cycle of 19 years that repeats the same pattern of leap months and non-leap months in a lunisolar calendar."
        },
        {
            term: "Year 0 Problem",
            definition: "The issue of having no year 0 in the Julian calendar and how it relates to the Gregorian calendar. This website assumes year 0 exists for the Gregorian calendar but not for the Julian calendar."
        },
        {
            term: "Orbit",
            definition: "The path of a celestial body around another celestial body."
        },
        {
            term: "Calibration",
            definition: "The process of adjusting an algorithm on this website to keep it in sync with official sources."
        },
        {
            term: "Drift",
            definition: "The gradual accumulation of error in a timekeeping system."
        },
        
    ]
};

// Function to generate glossary HTML
function generateGlossaryHTML() {
    const termsHTML = glossaryContent.terms.map(item => 
        `<p><strong>${item.term}:</strong> ${item.definition}</p>`
    ).join('');
    
    return termsHTML;
}

// Glossary modal functionality
document.addEventListener('DOMContentLoaded', function() {
    const glossaryModal = document.getElementById('glossary-modal');
    const glossaryBtn = document.getElementById('glossary-button');
    const glossarySpan = glossaryModal.getElementsByClassName('close')[0];
    const glossaryCloseButton = document.getElementById('glossary-close-button');
    const glossaryText = document.getElementById('glossary-text');

    // Populate glossary content
    glossaryText.innerHTML = generateGlossaryHTML();

    // When the user clicks the glossary button, open the modal
    glossaryBtn.onclick = function() {
        glossaryModal.style.display = 'block';
    }

    // When the user clicks on <span> (x), close the glossary modal
    glossarySpan.onclick = function() {
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
