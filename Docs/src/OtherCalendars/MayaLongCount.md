# Maya Long Count (CST)

| Epoch                        | Confidence |
| ---------------------------- | ---------- |
| 11 August 3113 BCE +06:00:00 | Exact      |

#### Overview

The Maya Long Count calendar is essentially a simple count of the number of days since the Maya date of creation. It is a five digit number, typically expressed with periods between the digits, made up of base-20 counters with the exception of the middle-right digit which is base-18.

Starting with the right, the smallest unit is the **kʼin**, which is equivalent to a day. Twenty kʼins make up one **winal**, 18 winals make up one **tun**, 20 tuns make up one **kʼatun**, and finally 20 kʼatuns make up one **bʼakʼtun**. A bʼakʼtun is roughly 394 solar years.

The Maya Long Count Calendar was of international interest in 2012 as it was the time when the bʼakʼtun incremented from 12 to 13, leading to superstitious theories and hysteria.

#### Info

Notably, winals are counted in base-18 rather than base-20 like the rest of the units. This is to reasonably match the tun to the length of the solar year. However, it is still over 5 days short, meaning it will drift about half as much as a true lunar calendar. 20 winals would be 400 days, which wouldn't have been as useful.

| Maya Unit | Length |
|-----------|--------|
| kʼin | 1 day |
| winal | 20 kʼins, 20 days |
| tun | 18 winals, 360 days |
| kʼatun | 20 tuns, 7200 days |
| bʼakʼtun | 20 kʼatuns, 144000 days |

#### Accuracy

Correlating the Maya Long Count calendar was a matter of debate even in recent times. The majority of scholars seem to have accepted the Goodman–Martinez–Thompson (GMT) correlation.

With that in mind, this calendar is actually very easy to calculate, as it is just a count of days since the epoch, not unlike the Julian Day Number. It has no concept of intercalary time such as leap days and the count is agnostic of the solar or lunar years. The only method of inaccuracy with this calendar could be when exactly each day increments, but that does not affect the rest of the calendar in any meaningful way.

#### Source

Much of the information on this calendar can be found at its [Wikipedia article](https://en.wikipedia.org/wiki/Mesoamerican_Long_Count_calendar).

The [Smithsonian website](https://maya.nmai.si.edu/calendar/maya-calendar-converter) has the current day as well as a converter, though it is broken for dates before the epoch.
