# ΔT

| Epoch             | Confidence |
| ----------------- | ---------- |
| 1 January 1901 CE | High       |

#### Overview

ΔT is an approximation of the difference in time between Terrestrial Time and UTC due to various factors that affect Earth's rotation, such as gravitational effects from other planets, earthquakes, and tidal forces. The two systems match around the year 1880 and deviate further away in time as a parabolic equation, with an uncertainty as much as two hours by the year 4000 BCE.

#### Info

The exact length of the day is slowly changing on the order of a few seconds per year. This rate is not constant, though it can be estimated.

#### Accuracy

ΔT is itself an approximation, so the results here can only be as good as that approximation. Unfortunately, there seems to be a bit of induced error on top of that, as my solutions don't exactly match those provided by Meeus. This could be due to JavaScript's base-2 calculations or due to a misunderstanding in some of the steps. However, they are very close, within a few seconds for any given output.

The epoch for this value is not an epoch but rather a moment where ΔT is close to zero.

#### Source

This calculation was sourced from <a href="https://eclipse.gsfc.nasa.gov/SEcat5/deltatpoly.html">the NASA Eclipse Web Site</a>, which provides polynomial expressions for ΔT.

---

### Calculation
