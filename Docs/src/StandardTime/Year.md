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

This clock shouldn't need to be calculated, since dateTime already provides the year fraction.

```js
// Calculate if current year is a leap year
const isLeapYear = (currentDateTime.getFullYear() % 4 === 0 && currentDateTime.getFullYear() % 100 !== 0) || (currentDateTime.getFullYear() % 400 === 0);
const daysInYear = isLeapYear ? 366 : 365;
const dayOfYear = Math.floor((currentDateTime - new Date(currentDateTime.getFullYear(), 0, 0)) / 86400000);
const fractionOfDay = (currentDateTime.getHours() * 3600 + currentDateTime.getMinutes() * 60 + currentDateTime.getSeconds()) * 1000 + currentDateTime.getMilliseconds()) / 86400000;
((dayOfYear + fractionOfDay) / daysInYear);
```
