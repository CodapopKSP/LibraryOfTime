# Minute

| Epoch        | Confidence |
| ------------ | ---------- |
| Every Minute | Exact      |

#### Overview

This is the fraction of time passed in the current minute.

#### Info

This calculation is based on local time.

#### Accuracy

This calculation is perfectly accurate to the millisecond.

#### Source

This is a simple calculation with no source.

---

### Calculation

This clock can be calculated by adding the current fraction of a second to the current seconds and then dividing the total by 60.

```js
const secondFraction = currentDateTime.getUTCMilliseconds() / 1000;
const minuteFraction = (currentDateTime.getUTCSeconds() +
                        secondFraction) / 60;
```
