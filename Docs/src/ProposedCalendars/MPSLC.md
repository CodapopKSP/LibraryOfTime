# MPSLC

| Epoch | Confidence |
| ----------------- | ---------- |
| 8 April 4145 BCE | Exact |

#### Overview

The Meyer-Palmen Solilunar Calendar (MPSLC), despite being named a "solilunar" calendar, is a calculated lunisolar calendar based on the definitions settled upon in this website.

It features 12 regular months of 29 or 30 days plus a leap month at the end of the year that takes place every 2-3 years and can be either 30 or 31 days. Months begin at or near the date of the New Moon, with an epoch of 8 April 4145 BCE.

Dates are written as a sequence of four numbers separated by hyphens, in the format [cycle]-[year]-[month]-[day] followed by "MP" for the name of the calandar. Months also have standard names.

#### Info

| Month | Name | Days |
| ----------- | ---------- | -------------- |
| 1 | Aristarchus | 29 |
| 2 | Bruno | 30 |
| 3 | Copernicus | 29 |
| 4 | Dee | 30 |
| 5 | Eratosthenes | 29 |
| 6 | Flamsteed | 30 |
| 7 | Galileo | 29 |
| 8 | Hypatia | 30 |
| 9 | Ibrahim | 29 |
| 10 | Julius | 30 |
| 11 | Khayyam | 29 |
| 12 | Lilius | 30 |
| 13 (leap) | Meton | 30/31 |

Leap years and leap-month length follow two simple steps:

1. Compute the running year number:

   `n = 60 * cycle + year`

2. Decide the year type:
   - The year is **long** (has a Meton month) when `(n * 2519) mod 6840 < 2519`.
   - If the year is long, Meton has **31 days** when `(floor((n * 2519) / 6840) * 1328) mod 2519 < 1328`.
   - Otherwise, Meton has **30 days**.

#### Accuracy

This calculation, despite being difficult to calculate mentally, is straightforward and exactly accurate. Furthermore, the calendar itself is remarkably accurate over the course of several thousand years.

The name of the calendar suggests it is a solilunar calendar, which is likely due to shifting definitions of the words 'lunisolar' and 'solilunar'. Based on the definitions used in this site, it is actually a lunisolar calendar.

#### Source

All of the information on this calendar came from [this website](https://www.hermetic.ch/cal_stud/nlsc/nlsc.htm).
