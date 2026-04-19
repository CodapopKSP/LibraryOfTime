# FILETIME

| Epoch             | Confidence | Associated with |
| ----------------- | ---------- | --------------- |
| 1 January 1601 CE | Exact      | Redmond, WA     |

#### Overview

FILETIME is the timing method found on Windows filesystems. It is a simple count of number of 100-nanosecond intervals since midnight on January 1st, 1601.

#### Info

The particular date of 1 January 1601 was chosen because it is the start of a new 400-year Gregorian leap year cycle.

#### Accuracy

This calculation is a simple algorithm based on Unix time, and is thus exactly accurate. However, it doesn't actually count 100-nanosecond intervals, instead updating on the site's global 20ms update cycle.

#### Source

All of the information on this calendar came from its [Wikipedia article](https://en.wikipedia.org/wiki/System_time).
