const welcomeDescription = [
    {
        about: `Welcome to the Library of Time!\n\nYou may input a date and time above using numerals and commas. Make sure they follow the correct format:\n\n<table><tr><th>Year, Month, Day, Hour, Minute, Second</th></tr><tr><td><i>Example: 2024, 4, 8, 18, 19, 19\n(April 8th, 2024 at 18:19:19 UTC)</i></td></tr><table>\nTo restart the current time ticker, send a blank date.\n\nIf you have any other interesting ideas or ways to tell time in recurring cycles, please let me know!\n\nYou may access the source code of this website <a href="https://github.com/CodapopKSP/LibraryOfTime">here</a>. Feel free to contact me on <a href="https://github.com/CodapopKSP">GitHub</a> or on <a href="https://old.reddit.com/user/CodapopKSP/">Reddit</a> for any questions, ideas, or offers of help.`,

        mission: 'After seeing the total solar eclipse of 8th April 2024 CE, I became interested in the fantastic ability of the math and astronomy used to calculate its time and location. I considered how such an event might have appeared to people in ancient times; they apparently found it as incredible as I did, because through my reading I was fascinated to hear that many ancient calendars were dated to the Gregorian calendar by the writings of eclipses by ancient peoples.\n\nThe mission of this website is to create a collection of every calendar with a verifiable date in the Gregorian calendar, as well as to display other methods of timekeeping. It is to be a celebration of time as counted by humans from all walks of life, displaying all of the unique ways different people chose to satisfy one of humanity\'s earliest and most universal curiosities.\n\nAlso included in this mission is the calculation of celestial phenomena, just as those who calculated the dates and times of the eclipse allowed me to know in advance of the event that would inspire me.\n\nCurrently my goal is to build this page and its calculations with simple HTML and JavaScript, utilizing few or no external libraries nor APIs and making it easy to duplicate and run locally. In the future I may add an API so that others may tap into the data here for their own projects.',

        accuracy: 'It is no secret that working with dates and times in computing is no easy task. You can refer to <a href="https://www.youtube.com/watch?v=-5wpm-gesOY">this famous video by YouTuber Tom Scott</a> for a deeper explanation.\n\nErrors are possible simply due to the fact that some calendars don\'t have a year 0, instead jumping straight to 1 from -1. This website uses Astronomical Time for all of its calculations and other info such as epochs. For that reason, you may notice that the displayed date or epoch is one year off from what a source might tell you.\n\nFor many of the calendars, particularly lunar calendars that start at sunset at a particuilar location, I have opted to use 18:00 of that location as an approximation for sunset. Thus, it is certain that some calendars will be off to some degree at some point in history.\n\nMost calendars have gone through various changes throughout history, which typically is not shown on this website. This can lead to the displayed calendars not matching historical records.\n\nAnd finally, some of the calculations are just very difficult or require mathematical approximations. Dynamical Time in particular is just an approximation of how much the Earth\'s orbit and rotation are affected by the rest of the universe, which can lead to calculations such as the New Moon to be off by a significant margin the further away from the current day you go.\n\nThese reasons are why I do not suggest using this website as a primary source. It can be a useful calculator or an educational tool, but please take the dates here with a grain of salt.',

        sources: 'There are two kinds of sources for many of the entries on this site: sources of initial calculations and, in the case of calendars still in use, sources of confirmation, such as a website displaying the current date of a particular calendar. When applicable, both will be listed in the Source tab of each entry.\n\nWhen necessary, I have made guesses and approximations, either because I wasn\'t able to locate the information, the information doesn\'t exist even at an academic level, or for the sake of reasonable simplicity. These will be noted in the Accuracy tabs.\n\nA lot of the information on this site comes from Wikipedia, but when necessary I have had to seek better, more informative, or more complete sources.\n\nThe underlying astronomical calculations have come from <i>Astronomical Algorithms</i> (1991) by Jean Meeus. You can find a full text archive of it <a href="https://archive.org/details/astronomicalalgorithmsjeanmeeus1991/page/n7/mode/2up">here</a>.\n\nSome of the Computing Time calculations came from <a href="http://www.leapsecond.com/java/gpsclock.htm">this ancient website</a> with several broken links.\n\nI\'ve gotten a lot of info and inspiration from <a href="https://www.fourmilab.ch/documents/calendar/">this website</a> that is something of a precursor to the Library of Time.\n\nThe basis of my lunar calendar calculations used in many Asiatic calendars comes from <a href="https://ytliu0.github.io/ChineseCalendar/rules.html">this github page.</a>'
    },
]