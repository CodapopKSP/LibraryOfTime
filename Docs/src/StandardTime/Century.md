# Century

| Epoch         | Confidence |
| ------------- | ---------- |
| Every Century | Exact      |

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

This clock can be calculated by first getting the year number of the start of the current century.

```js
// Calculate ordinal century start (ending in 1)
const year = currentDateTime.getUTCFullYear();
let startYear = Math.floor(year / 100) * 100 + 1;
```

This will provide the start of a century beginning in the 1s place (2201, 2001, etc.). After that, the start of the current century and the start of the next century can be calculated.

```js
const startThisCentury = createDateWithFixedYear(startYear, 0, 1);
const startNextCentury = createDateWithFixedYear(startYear + 10, 0, 1);
```

After that, the ratio between the difference of the current datetime and start of the century can be compared to the difference of the start of the next century and the start of the current century.

```js
return (currentDateTime - startThisCentury) /
    (startNextCentury - startThisCentury);
```
