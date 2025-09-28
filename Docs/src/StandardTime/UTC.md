# UTC

#### Data

**Epoch:** Midnight (UTC)

**Confidence:** Exact

#### Overview

Coordinated Universal Time is the global time standard. The time expressed here is the same regardless of timezone. It is based on the timezone of the Prime Meridian at 0°.

#### Info

UTC is the successor to GMT.

#### Accuracy

This calculation is perfectly accurate to the millisecond.

#### Source

UTC is sourced directly from JavaScript's Date library and your device's system time.

---

### Calculation

This clock shouldn't need to be calculated, since dateTime already provides the UTC time.

```js
currentDateTime.toUTCString();
```
