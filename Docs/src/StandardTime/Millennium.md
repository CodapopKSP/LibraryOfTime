# Millennium

| Epoch            | Confidence |
| ---------------- | ---------- |
| Every Millennium | Exact      |

#### Overview

This is the fraction of time passed in the current millennium.

#### Info

Due to leap days, midnight on the 1st of January of the 501st year in the millennium might not be exactly 50% of the way through the millennium.

#### Accuracy

This calculation is perfectly accurate to the millisecond.

#### Source

This is a simple calculation with no source.

---

### Calculation

This clock can be calculated by first getting the year number of the start of the current millennium.

```js
// Calculate ordinal millennium start (ending in 1)
const year = currentDateTime.getUTCFullYear();
let startYear = Math.floor(year / 1000) * 1000 + 1;
```

This will provide the start of a millennium beginning in the 1s place (3001, 2001, etc.). After that, the start of the current millennium and the start of the next millennium can be calculated.

```js
const startThisMillennium = createDateWithFixedYear(startYear, 0, 1);
const startNextMillennium = createDateWithFixedYear(startYear + 10, 0, 1);
```

After that, the ratio between the difference of the current datetime and start of the millennium can be compared to the difference of the start of the next millennium and the start of the current millennium.

```js
return (currentDateTime - startThisMillennium) /
    (startNextMillennium - startThisMillennium);
```
