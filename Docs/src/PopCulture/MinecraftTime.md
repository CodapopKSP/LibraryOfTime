# Minecraft Time

| Epoch             | Confidence |
| ----------------- | ---------- |
| Midnight          | Exact       |

#### Overview

One day/night cycle in Minecraft is exactly 20 minutes. Days typically start when the player wakes up from their bed, and although there is a clock in the game, it has little information to expand upon that. This representation of Minecraft time divides the Minecraft day into 24-hour segments with minutes and seconds, set to midnight in the real world when it also resets the day counter.

#### Info

Time in Minecraft, and many games for that matter, is counted in ticks, which are the game loop cycles. One tick is 50ms, allowing for a rate of 20Hz. These are then counted and converted into game time.

#### Accuracy

This clock should be perfectly accurate, with the caveat that time in an actual Minecraft game can vary due to the fact that players can skip the night by sleeping in a bed.

#### Source

This calculation was sourced from [the Minecraft Fandom Wiki](https://minecraft.fandom.com/wiki/Daylight_cycle).
