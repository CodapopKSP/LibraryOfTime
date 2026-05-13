// Modal content for "AD/BC vs CE/BCE"
const bcVsBceModalContent = {
    title: "AD/BC vs CE/BCE",
    text: [
        `<h3>The Christian Calendars</h3>
        <p>
        The Gregorian calendar was introduced in 1582 to be a correction of the Julian calendar which was used by most of Europe and its associated territories. The clergy, led by Pope Gregory XIII, noticed that the calculated date of Easter was drifting relative to the observed dates of the equinoxes.`,

        `<p>
        <img src="Content/Inter-grav.webp" width="298" height="457" alt="The first page of the papal bull Inter Gravissimas" class="modal-image modal-image-inline modal-image-vh" style="--modal-image-vh: 35vh;">
        <small class="modal-image-caption">
        The first page of the papal bull Inter Gravissimas, promulgating the Gregorian calendar (1582). Source: Wikimedia Commons, "Inter-grav.jpg" (CC0).
        </small>
        </p>`,
        
        `<p>
        By that time, the calendar had drifted by 10 days, and so 10 days were skipped in October 1582 to switch to the Gregorian calendar.
        </p>`,

        `<p>
        The two calendars use an epoch that is intended to count the number of years since the birth of Jesus Christ. While it likely isn't exactly accurate, the fact remains that the Gregorian calendar was created as a Christian calendar and uses <strong>BC</strong> meaning “Before Christ” and <strong>AD</strong> meaning <em>"Anno Domini"</em> ("in the year of our Lord") to denote the years before and after the birth of Jesus Christ.
        </p>`,

        `<h3>The Common Era</h3>
        <p>
        The modern age saw the Industrial Revolution in the West and the spread of the Gregorian calendar to the rest of the world. Other countries adopted the calendar to aid in globalized commerce, but many of these countries had no connection to Christianity. To the people of these countries, the Gregorian calendar was just a way to count time to a global standard.
        </p>`,

        `<p>
        <img src="Content/Calendars_world_map.png" width="960" height="488" alt="World Gregorian Usage Map" class="modal-image modal-image-inline modal-image-vh" style="--modal-image-vh: 30vh;">
        <small class="modal-image-caption">
        Map of countries that use the Gregorian calendar as of 2026 CE. Green = full usage, blue = Gregorian with different epoch, orange = used alongside other calendars, red = no usage. Only a handful do not use it at all. Source: Wikimedia Commons, "Calendars world map.svg" (CC0).
        </small>
        </p>`,

        `<p>
        Most people who use the Gregorian calendar today are not Christians, and the “year of our Lord” has no meaning to them. It is for this reason that I have opted to use <strong>BCE</strong> meaning “Before Common Era” and <strong>CE</strong> meaning “Common Era” for this site. Using AD and BC is still correct for the Gregorian calendar, but it is specific to its Christian usage.
        </p>`,
    ],
};

document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("bc-vs-bce-modal");
    const btn = document.getElementById("bc-vs-bce-button");
    const headerCloseBtn = document.getElementById("bc-bce-modal-close");
    const footerCloseBtn = document.getElementById("bc-bce-modal-close-button");
    const modalTitle = document.getElementById("bc-bce-modal-title");
    const modalText = document.getElementById("bc-bce-modal-text");

    if (!modal || !btn || !headerCloseBtn || !footerCloseBtn || !modalTitle || !modalText) {
        return;
    }

    modalTitle.textContent = bcVsBceModalContent.title;
    modalText.innerHTML = bcVsBceModalContent.text.join("");

    btn.onclick = function () {
        modal.style.display = "block";
    };

    headerCloseBtn.onclick = function () {
        modal.style.display = "none";
    };

    footerCloseBtn.onclick = function () {
        modal.style.display = "none";
    };

    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && modal.style.display === "block") {
            modal.style.display = "none";
        }
    });
});
