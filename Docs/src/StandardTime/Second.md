# Second

#### Data

**Epoch:** Every Second

**Confidence:** Exact

#### Overview

This is the fraction of time passed in the current second.

#### Info

This calculation is based on local time.

#### Accuracy

This calculation is perfectly accurate to the millisecond.

#### Source

This is a simple calculation with no source.

---

### Calculation

This clock shouldn't need to be calculated, since dateTime already provides the second fraction.

```js
currentDateTime.getMilliseconds() / 1000;
```
