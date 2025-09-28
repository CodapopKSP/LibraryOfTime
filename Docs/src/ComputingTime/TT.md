# TT

| Epoch          | Confidence |
| -------------- | ---------- |
| 1 January 1902 | High       |

#### Overview

Terrestrial Time is the timekeeping standard used by astronomers to calculate time as a global concept rather than in relation to the motion of the Earth. As the Earth's rotation slows due to tidal forces and earthquakes, UTC and TT will continue to drift apart. The difference between them is ΔT.

#### Info

TT is an ideal that can only ever be approximated, including at the precision of atomic clocks. The chosen epoch has no basis in science and is just used as a reference point for when ΔT was zero and thus TT and UTC were aligned.

#### Accuracy

This clock relies on the ΔT calculations, which are only approximations. On top of that, they were created in the 1990s are are certainly out of date by a few seconds.

#### Source

All of the information on this calendar came from its <a href="https://en.wikipedia.org/wiki/Terrestrial_Time">Wikipedia article</a>.

---

### Calculation

Calculating TT simply involves adding ΔT to the current datetime.

```js
TT.setSeconds(currentDateTime.getSeconds() + getDeltaT(currentDateTime));
```
