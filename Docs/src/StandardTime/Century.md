# Century

#### Data

**Epoch:** Every Century

**Confidence:** Exact

#### Overview

This is the fraction of time passed in the current century.

#### Info

Due to leap days, midnight on the 1st of January of the 51st year in the century might not be exactly 50% of the way through the century.

#### Accuracy

This calculation is perfectly accurate to the millisecond.

#### Source

This is a simple calculation with no source.

---

### Calculation

This clock shouldn't need to be calculated, since dateTime already provides the century fraction.

```js
// Calculate century start and end
const currentYear = currentDateTime.getFullYear();
const centuryStart = Math.floor(currentYear / 100) * 100;
const centuryEnd = centuryStart + 99;
const yearInCentury = currentYear - centuryStart;
const fractionOfYear = // (year fraction calculation from above)
((yearInCentury + fractionOfYear) / 100);
```
