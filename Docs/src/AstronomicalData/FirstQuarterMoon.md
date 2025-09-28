# This Month's First Quarter Moon

| Epoch             | Confidence |
| ----------------- | ---------- |
| First Quarter Moon | High       |

#### Overview

This is the approximate time of the First Quarter Moon of the current month.

A First Quarter Moon is when the Eastern half of the moon is in sunlight from the perspective of Earth.

#### Info

Calculating the lunar phases is no easy task. It involves several steps and different tables of equations, and it is likely the most resource-taxing calculation on this site.

First Quarter Moons are on average 29.53059 days apart, but that number can vary by several hours in a given cycle due to the shape of the moon's orbit as well as other gravitational effects.

#### Accuracy

This calculation is *mostly* accurate, but it differs from Jean Meeus's solutions by a few minutes. I am not sure why this is the case, though I suspect it has to do with the base-2 calculations in JavaScript. It is also possible that my Terrestrial Time calculations are independently incorrect, which are factored into the New Moon calculation. Dates far away from the current year are likely to be significantly off.

#### Source

This calculation in its entirety was sourced from [Astronomical Algorithms (1991)](https://archive.org/details/astronomicalalgorithmsjeanmeeus1991/page/n7/mode/2up) by Jean Meeus.

This cycle can be calibrated using the ephemerides at [this website](https://astropixels.com/ephemeris/phasescat/phasescat.html).
