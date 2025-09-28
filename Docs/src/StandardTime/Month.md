# Month

#### Data

**Epoch:** Every Month

**Confidence:** Exact

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

This clock shouldn't need to be calculated, since dateTime already provides the month fraction.

```js
// Calculate days in current month
const daysInMonth = new Date(currentDateTime.getFullYear(), currentDateTime.getMonth() + 1, 0).getDate();
const dayOfMonth = currentDateTime.getDate();
const fractionOfDay = (currentDateTime.getHours() * 3600 + currentDateTime.getMinutes() * 60 + currentDateTime.getSeconds()) * 1000 + currentDateTime.getMilliseconds()) / 86400000;
((dayOfMonth - 1 + fractionOfDay) / daysInMonth);
```
