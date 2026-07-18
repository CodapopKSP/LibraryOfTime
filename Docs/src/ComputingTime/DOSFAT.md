# DOS FAT/FAT32

| Epoch             | Confidence | Associated with |
| ----------------- | ---------- | --------------- |
| 1 January 1980 CE | Exact      | Redmond, WA     |

## Overview

DOS FAT timestamps are used in the FAT filesystem. It is a hexadecimal representation of the Gregorian date and time, with an epoch of 1 January 1980 CE.

The date encoding is difficult to read due to the way each byte overflows into the next, meaning there is no clear delineation between units of time and bytes in the string. Roughly speaking, the first two digits represent the number of years since the epoch, followed by the month in the third digit, the days in the next, the hours in the following two, and minutes and seconds for the final two.

Seconds only increment every two, so it is not a second counter but a 2-second counter. Months also start on 2 instead of 1.

This clock can be represented with big endian or little endian, which effectively swaps the front and back halves of the hex string.

## Info

| Example Date             | DOS FAT Hex Code |
| ------------------------ | ---------------- |
| 1 January 1980 CE        | 0x00210000       |
| 1 January 1980 CE +2s    | 0x00210001       |
| 1 January 1980 CE +1m    | 0x00210020       |
| 2 January 1980 CE        | 0x00220000       |
| 1 February 1980 CE       | 0x00410000       |
| 1 January 1981 CE        | 0x02210000       |

## Accuracy

This calculation is a simple algorithm based on Unix time, and is thus exactly accurate.

## Source

### Primary Sources
[Epoch Converter website](https://www.epochconverter.com/fat)
