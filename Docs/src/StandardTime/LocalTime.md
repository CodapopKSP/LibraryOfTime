# Local Time

| Epoch    | Confidence |
| -------- | ---------- |
| Midnight | Exact      |

#### Overview

This is the current local time based on the timezone provided by your device or the timezone selected in the datetime selection.

#### Info

Local Time can vary depending on location, timezone, Daylight Savings Time, and historical adjustments.

#### Accuracy

This calculation is perfectly accurate to the millisecond.

#### Source

Local Time is sourced directly from JavaScript's Date library and your device's system time.

---

### Calculation

This clock shouldn't need to be calculated, since dateTime already provides the local time.

```js
currentDateTime.toTimeString();
```
