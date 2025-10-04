# Year

| Epoch      | Confidence |
| ---------- | ---------- |
| Every Year | Exact      |

#### Overview

This is the fraction of time passed in the current year.

#### Info

Due to leap days, this fraction might not be a perfect 10x multiplication of the century calculation.

#### Accuracy

This calculation is perfectly accurate to the millisecond.

#### Source

This is a simple calculation with no source.

---

### Calculation

This clock can be calculated by getting the start of the current and next year.

```js
const startOfYear = createDateWithFixedYear(year, 0, 1);
const startOfNextYear = createDateWithFixedYear(year + 1, 0, 1);
```

After that, the ratio between the difference of the current datetime and start of the year can be compared to the difference of the start of the next year and the start of the current year.

```js
return (currentDateTime - startOfYear) / (startOfNextYear - startOfYear);
```
