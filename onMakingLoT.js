// Modal content for "On Making the LoT"
const modalContent = {
    title: "On Making the Library of Time",
    text: [
        `<p>
        This website, comprised of calendar information and a calculator to display the date in multiple calendars, is not a new idea. Many have built similar tools in the past, albeit at a much smaller scale, typically consisting of only 3 or 4 calendars. 
        </p>`,

        `<p>
        But much like how the Rosetta Stone allowed linguists to decode ancient Egyptian hieroglyphs by having the same passage written in Ancient Greek, Demotic, and Egyptian hieroglyphs (of which we had already known the Greek and some of the Demotic), these earlier websites have allowed me to calibrate unknown calendars to known ones. 
        </p>`,

        `<p>
        Thus, I have dubbed these phenomena <strong>Temporal Rosetta Stones</strong>, as well as referring to the discovery and study of them to be <strong>Digital Archaeology</strong>.
        </p>`,

        `<p>
        Temporal Rosetta Stones all seem to have come from a similar time in the history of the internet, when one-off websites were made for specific purposes rather than the general-purpose websites that we have today. These sites, built with simple HTML sporting plain text on colored backgrounds, genuinely feel ancient. 
        </p>`,

        `<p>
        And when the time comes that their maintainers cancel the project, forget it even existed and forget to renew the domain, or pass away, then my fear is that much of their work will be lost. Some of these Temporal Rosetta Stones are primary sources, displaying information that cannot be found anywhere else, whether it's because their creator had studied something legitimately niche or because they are documenting calendars that they themselves had created.
        </p>`,

        `<div class="modal-images-container">
            <button class="images-toggle-btn" onclick="toggleImages()">
                <span class="toggle-text">Here are some screenshots from particularly impressive Temporal Rosetta Stones:</span>
                <span class="toggle-icon">▼</span>
            </button>
            <div class="modal-images" id="modal-images" style="display: none;">
                <img src="OnMakingLoTImages/darian.png" alt="Darian Calendar Screenshot" class="modal-image">
                <img src="OnMakingLoTImages/leapsecond.png" alt="Leap Second Screenshot" class="modal-image">
                <img src="OnMakingLoTImages/hermetic.png" alt="Hermetic Calendar Screenshot" class="modal-image">
                <img src="OnMakingLoTImages/calendarconverter.png" alt="Calendar Converter Screenshot" class="modal-image">
            </div>
        </div>`,

        `<p>
        My studies have also brought me to the writings of Jean Meeus, who is the author of <strong>Astronomical Algorithms</strong>, a compilation of some of the most incredible math equations for calculating the times and positions of celestial phenomena. He is the principal astronomer for hobbyists, and his work is unmatched to this day among amateurs despite being from 1991. 
        </p>`,

        `<p>
        Calendars are ultimately just approximations of the kind of work that Meeus did, though usually packaged up for human consumption. It's no surprise that the earliest calendars were all lunar calendars; the moon was the first physical clock floating in the sky above prehistoric humans, with phases to show the passage of time rather than hands and numbers. 
        </p>`,

        `<p>
        It is for this reason that the word 'month' is etymologically derived from the word 'moon' ('moonth'). Speakers of some languages won't even think this is any sort of revelation, as their word for 'month' is literally 'moon', such as the Chinese 月.
        </p>`,

        `<p>
        Yet because the universe is not arranged in perfect geometry, the years, months, and days can never line up in any reasonable way. Thus, calendars grew out of sync with what they were originally measuring, and their maintainers had to enact more and more complex techniques to keep everything aligned as best as possible. 
        </p>`,

        `<p>
        Regarding the Library of Time, this website may never be finished, simply due to the fact that there are just too many calendars, cycles, and exceptions to be documented in my lifetime. For that reason, I constrained this website to being written in simple HTML and JavaScript, without a backend, so that it can be downloaded as a single file and run by anyone. 
        </p>`,

        `<p>
        With any luck, this work can stand the test of time as the ultimate Temporal Rosetta Stone.
        </p>`,
    ]
};

// Modal functionality for "On Making the LoT" button
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('on-making-lot-modal');
    const btn = document.getElementById('on-making-LoT-button');
    const span = document.getElementsByClassName('close')[0];
    const modalTitle = document.getElementById('modal-title');
    const modalText = document.getElementById('modal-text');

    // Populate modal content
    modalTitle.textContent = modalContent.title;
    modalText.innerHTML = modalContent.text.join('');

    // When the user clicks the button, open the modal
    btn.onclick = function() {
        modal.style.display = 'block';
    }

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = 'none';
    }

    // When the user clicks the close button at the bottom, close the modal
    const closeButton = document.getElementById('modal-close-button');
    closeButton.onclick = function() {
        modal.style.display = 'none';
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }

    // Close modal when Escape key is pressed
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
        }
    });
});

// Function to toggle images visibility
function toggleImages() {
    const imagesContainer = document.getElementById('modal-images');
    const toggleBtn = document.querySelector('.images-toggle-btn');
    const toggleText = toggleBtn.querySelector('.toggle-text');
    const toggleIcon = toggleBtn.querySelector('.toggle-icon');
    
    if (imagesContainer.style.display === 'none') {
        imagesContainer.style.display = 'flex';
        toggleText.textContent = 'Hide Images';
        toggleIcon.textContent = '▲';
    } else {
        imagesContainer.style.display = 'none';
        toggleText.textContent = 'Here are some screenshots from particularly impressive Temporal Rosetta Stones:';
        toggleIcon.textContent = '▼';
    }
}
