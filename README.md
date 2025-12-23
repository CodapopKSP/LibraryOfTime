# The Library of Time

The mission of this website is to create a collection of every calendar with a verifiable date at a specific point in time, as well as other methods of timekeeping. It is to be a celebration of time as counted by humans from all walks of life, displaying all of the unique ways different people chose to satisfy one of humanity's earliest and most universal curiosities.

https://libraryoftime.xyz

---

## Deployment

The library automatically gets converted into a single HTML file, including in-line images, via GitHub Actions. The minified site can be found in GitHub Releases, and it is what gets deployed to https://libraryoftime.xyz.

To run the site, simply open the index.html. Both the minified version as well as the version within this repo will open to the same result.

There is an mdBook located in /Docs that is a copy of the calendar information found on the website. It currently is non-functional but is intended to be the source of truth for the calendar info in the future. To build it, run:

```mdbook build```

This command should be run from the Docs directory. It will generate the HTML files in the book directory based on the markdown files in src. To run it, open the index.html file located in /Docs/book.

## Development

The Library of Time is written entirely in vanilla HTML/JS/CSS. There must not be any imported packages nor external API.

*Currently there is one exception (masonry.pkgd.min.js) purely to make the calendar groups more pleasing to look at. The website does not need it to function and should eventually be phased out.*

Calendars should be rigorously tested to ensure accuracy. These tests can be found in /Tests, and they can be run by uncommenting the following line located in runTests.js

```runAllTests();```

This is very resource-intensive as it has to calculate hundreds of moon phases and other expensive calculations. Tests should not be left on in production.