# Hour

#### Data

**Epoch:** Every Hour

**Confidence:** Exact

#### Overview

This is the fraction of time passed in the current hour.

#### Info

This calculation is based on local time.

#### Accuracy

This calculation is perfectly accurate to the millisecond.

#### Source

This is a simple calculation with no source.

---

### Calculation

This clock shouldn't need to be calculated, since dateTime already provides the hour fraction.

```js
(currentDateTime.getMinutes() * 60 + currentDateTime.getSeconds()) * 1000 + currentDateTime.getMilliseconds()) / 3600000;
```
