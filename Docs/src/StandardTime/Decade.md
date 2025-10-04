# Decade

| Epoch        | Confidence |
| ------------ | ---------- |
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

This clock can be calculated by first getting the year number of the start of the current decade.

```js
// Calculate ordinal decade start (ending in 1)
const year = currentDateTime.getUTCFullYear();
let startYear = Math.floor(year / 10) * 10 + 1;
```

This will provide the start of a decade beginning in the 1s place (2021, 2001, etc.). After that, the start of the current decade and the start of the next decade can be calculated.

```js
const startThisDecade = createDateWithFixedYear(startYear, 0, 1);
const startNextDecade = createDateWithFixedYear(startYear + 10, 0, 1);
```

After that, the ratio between the difference of the current datetime and start of the decade can be compared to the difference of the start of the next decade and the start of the current decade.

```js
return (currentDateTime - startThisDecade) /
    (startNextDecade - startThisDecade);
```
