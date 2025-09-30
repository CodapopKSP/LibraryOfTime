# Day

| Epoch     | Confidence |
| --------- | ---------- |
| Every Day | Exact      |

#### Overview

This is the fraction of time passed in the current day, based on the local timezone.

#### Info

This calculation is based on local time.

#### Accuracy

This calculation is perfectly accurate to the millisecond.

#### Source

This is a simple calculation with no source.

---

### Calculation

This clock can be calculated by adding the hour fraction to the current hour and then dividing the total by 24.

```js
const secondFraction = currentDateTime.getUTCMilliseconds() / 1000;
const minuteFraction = (currentDateTime.getUTCSeconds() +
                        secondFraction) / 60;
const hourFraction = (currentDateTime.getUTCMinutes() +
                        minuteFraction) / 60;
const dayFraction = (currentDateTime.getUTCHours() +
                        hourFraction) / 24;
```
