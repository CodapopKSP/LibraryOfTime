# Unix

| Epoch             | Confidence |
| ----------------- | ---------- |
| 1 January 1970 CE | Exact      |

#### Overview

Unix is the most widespread timing system in computing and on the internet. It is a simple count of number of seconds since midnight on January 1st, 1970. Many of the calculations on this website are derived from Unix timestamps.

#### Info

Unix time skips leap seconds, operating as if that time never happened.

#### Accuracy

As Unix is the source of all timekeeping systems on this site, it is perfectly accurate.

#### Source

Unix time is the source of all other timekeeping systems on this website. It is as accurate as JavaScript's Date library and your device's system time allow.

Some information for this clock came from <a href="https://en.wikipedia.org/wiki/Unix_time">this website</a>.

---

### Calculation

This clock shouldn't need to be calculated, since dateTime already provides the Unix time.

```js
currentDateTime.getTime();
```

This will also automatically skip leap seconds.
