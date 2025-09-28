# Spreadsheet =NOW()

| Epoch              | Confidence |
| ------------------ | ---------- |
| 30 December 1899 CE | Exact     |

#### Overview

When using spreadsheets such as Excel or Google Sheets, =NOW() can be used to return the current date. This is saved in the background as a single floating point number, which can be revealed if the user incorrectly formats the date to a number.

Days are counted from the epoch of 30 December 1899 CE, which can also be seen if the user formats a zero to a date.

#### Info

One might notice that the epoch of 30 December 1899 CE is an odd choice. It is very close to 1 January 1900. Assuming that is day 1, then day 0 should be 31 December 1899.

The reason for this discrepancy is due to Microsoft Excel originally needing to be compatible with Lotus 1-2-3. The date system in Lotus 1-2-3 incorrectly determined the year 1900 to be a leap year (which was true in the Julian calendar but not the Gregorian). This error added an extra date of 29 February, which did not exist. Thus, in order for days after 28 February 1900 to be correct, the epoch must be shifted backwards by one day.

#### Accuracy

This calculation is a simple count based on a Gregorian date and is thus exactly accurate.

#### Source

All of the information on this clock came from its [Wikipedia article](https://en.wikipedia.org/wiki/Year_1900_problem).
