# Millennium

| Epoch           | Confidence |
| --------------- | ---------- |
| Every Millennium | Exact      |

#### Overview

This is the fraction of time passed in the current millennium.

#### Info

Due to leap days, this fraction might not be a perfect /10 division of the century calculation.

#### Accuracy

This calculation is perfectly accurate to the millisecond.

#### Source

This is a simple calculation with no source.

---

### Calculation

This clock shouldn't need to be calculated, since dateTime already provides the millennium fraction.

```js
// Calculate millennium start and end
const currentYear = currentDateTime.getFullYear();
const millenniumStart = Math.floor(currentYear / 1000) * 1000;
const millenniumEnd = millenniumStart + 999;
const yearInMillennium = currentYear - millenniumStart;
const fractionOfYear = // (year fraction calculation from above)
((yearInMillennium + fractionOfYear) / 1000);
```
