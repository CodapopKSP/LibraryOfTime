# Month

| Epoch       | Confidence |
| ----------- | ---------- |
| Every Month | Exact      |

#### Overview

This is the fraction of time passed in the current month.

#### Info

This calculation is based on local time.

#### Accuracy

This calculation is perfectly accurate to the millisecond.

#### Source

This is a simple calculation with no source.

---

### Calculation

This clock can be calculated by subtracting the start time of the current month from the start time of the next month, and dividing the total by 1000, 60, 60, and 24 to get the number of days in the current month.

```js
const year = currentDateTime.getUTCFullYear();
const month = currentDateTime.getUTCMonth();
const nextMonth = createDateWithFixedYear(year, month + 1, 0);
const thisMonth = createDateWithFixedYear(year, month, 0);
const daysInMonth = (nextMonth - thisMonth)/1000/60/60/24;
```

Then add  the current day fraction to the current day, and divide the total by the number of days in the current month.

```js
const secondFraction = currentDateTime.getUTCMilliseconds() / 1000;
const minuteFraction = (currentDateTime.getUTCSeconds() +
                        secondFraction) / 60;
const hourFraction = (currentDateTime.getUTCMinutes() +
                        minuteFraction) / 60;
const dayFraction = (currentDateTime.getUTCHours() +
                        hourFraction) / 24;
// Subtract one from the current date to get number of passed days
const monthFraction = ((currentDateTime.getUTCDate() - 1) +
                        dayFraction) / daysInMonth;
```
