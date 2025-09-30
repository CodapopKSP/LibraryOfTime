# Second

| Epoch        | Confidence |
| ------------ | ---------- |
| Every Second | Exact      |

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

This clock cal be calculated by taking the current millisecond and dividing it by 1000.

```js
const secondFraction = currentDateTime.getMilliseconds() / 1000;
```
