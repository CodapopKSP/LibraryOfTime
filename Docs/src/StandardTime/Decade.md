# Decade

| Epoch      | Confidence |
| ---------- | ---------- |
| Every Decade | Exact      |

#### Overview

This is the fraction of time passed in the current decade.

#### Info

Due to leap days, midnight on the 1st of January of the 6th year in the decade might not be exactly 50% of the way through the decade.

#### Accuracy

This calculation is perfectly accurate to the millisecond.

#### Source

This is a simple calculation with no source.

---

### Calculation

This clock shouldn't need to be calculated, since dateTime already provides the decade fraction.

```js
// Calculate decade start and end
const currentYear = currentDateTime.getFullYear();
const decadeStart = Math.floor(currentYear / 10) * 10;
const decadeEnd = decadeStart + 9;
const yearInDecade = currentYear - decadeStart;
const fractionOfYear = // (year fraction calculation from above)
((yearInDecade + fractionOfYear) / 10);
```
