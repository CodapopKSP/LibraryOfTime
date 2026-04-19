# DOS FAT/FAT32

| Epoch             | Confidence | Associated with |
| ----------------- | ---------- | --------------- |
| 1 January 1980 CE | Exact      | Redmond, WA     |

#### Overview

DOS FAT timestamps are used in the FAT filesystem.

It is a hexadecimal representation of different numbers that add onto each other. The first two digits (after 0x) represent the number of years since the epoch, though the second digit also increments when the third digit rolls over. The forth digit represents the current day of the month, and the third digit represents the current month (starting with 2), though it increments on the first day of the month and when the month digit rolls over (on the 16th day).

The fifth and sixth digits represent the hours since midnight, though the sixth digit also increments when the seventh digit, representing minutes, rolls over. The seventh digit also increments when the eighth digit rolls over, which represents double seconds, incrementing once every two seconds.

It can also be written in reverse byte order (big-endian vs the standard little-endian). This means that the resulting number will have the first four and the last four digits swapped, as well as the two pairs of digits within them.

#### Info

| Date or time | Packed value |
| ------------ | ------------ |
| 1 January 1980 CE | 0x00210000 |
| 1 February 1980 CE | 0x00410000 |
| 1 December 1980 CE | 0x01810000 |
| 1 January at midnight | 0xXX210000 |
| 1 January at noon | 0xXX216000 |
| 2 January at midnight | 0xXX220000 |

#### Accuracy

This calculation is a simple algorithm based on Unix time, and is thus exactly accurate.

#### Source

This calculation came from [this converter](https://www.epochconverter.com/fat).

---
