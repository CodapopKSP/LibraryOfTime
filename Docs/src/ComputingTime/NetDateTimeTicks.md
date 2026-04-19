# .NET DateTime Ticks

| Epoch                              | Confidence | Associated with |
| ---------------------------------- | ---------- | --------------- |
| 1 January 0001 CE, 00:00:00 UTC    | Exact      |   Redmond, WA   |

#### Overview

.NET DateTime Ticks is a count of the number of 100-nanosecond intervals since 1 January 1 CE.

#### Info

#### Accuracy

This calculation is a simple algorithm based on Unix time, and is thus exactly accurate. However, it doesn't actually count 100-nanosecond intervals, instead updating on the site's global 20ms update cycle.

#### Source

This calculation came from [this converter](https://www.epochconverter.com/dotnet).

---
