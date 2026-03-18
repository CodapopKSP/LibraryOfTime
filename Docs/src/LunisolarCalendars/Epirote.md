# Epirote (EET)

| Epoch             | Confidence      |
| ----------------- | --------------- |
| 20 August 204 BCE + 16:00:00 | High |

#### Overview

The Epirote calendar is the previously-undescribed Greek lunisolar calendar displayed on the Antikythera mechanism, theorized to be from the Epirus region of Ancient Greece.

It is a lunisolar calendar with 12 months of 29 or 30 days, with an intercalary month added every 2-3 years in accordance with a variant of the Metonic cycle (year 1 instead of year 19). The exact intercalary month is unknown, but it is theorized to be the 4th month of ΜΑΧΑΝΕΥΣ.

Months were either "full" (30 days) or "hollow" (29 days) in a roughly alternating pattern; however, hollow months still had days that numbered 1-30, but one day was skipped entirely, starting with the 1st day of the 1st month of the Metonic cycle and then skipping a day every 64 days on a cycle of 47 months (repeating 5 times per Metonic cycle). Thus, the first day of each Metonic cycle is skipped and begins on the 2nd day of ΦΟΙΝΙΚΑΙΟΣ.

There is no known epoch for the Epirote calendar, but this site uses the calibration date of the Antikythera mechanism, 20 August 204 BCE, as a pseudoepoch, listed here in parentheses.

#### Info

When the Antikythera mechanism was discovered in the early 1900s, it shocked historians as proof that the Ancient Greeks had the technology to create precision bronze gears. While large portions of the mechanism were damaged or missing, enough remained that enabled 21st century researchers, with careful deduction and investigation, to rebuild and sufficiently calibrate its calendar.

| Months            |              |
| ----------------- | ------------ |
| Name              | Latinized    |
| ΦΟΙΝΙΚΑΙΟΣ        | Phoinikaios  |
| ΚΡΑΝΕΙΟΣ          | Kraneios     |
| ΛΑΝΟΤΡΟΠΙΟΣ       | Lanotropios  |
| ΜΑΧΑΝΕΥΣ          | Machaneus    |
| ΜΑΧΑΝΕΥΣ (Leap)   | Machaneus (Leap) |
| ΔΩΔΕΚΑΤΕΥΣ        | Dodekateus   |
| ΕΥΚΛΕΙΟΣ          | Eukleios     |
| ΑΡΤΕΜΙΣΙΟΣ        | Artemisios   |
| ΨΥΔΡΕΥΣ           | Psydreus     |
| ΓΑΜΕΙΛΙΟΣ         | Gameilios    |
| ΑΓΡΙΑΝΙΟΣ         | Agrianios    |
| ΠΑΝΑΜΟΣ           | Panamos      |
| ΑΠΕΛΛΑΙΟΣ         | Apellaios    |

| Hollow Day Cycle |         |          |         |
| ---------------- | ------- | -------- | ------- |
| Position         | Action  | Position | Action  |
| 1                | Skip 1  | 2        | Full    |
| 3                | Skip 5  | 4        | Full    |
| 5                | Skip 9  | 6        | Full    |
| 7                | Skip 13 | 8        | Full    |
| 9                | Skip 17 | 10       | Full    |
| 11               | Skip 21 | 12       | Full    |
| 13               | Skip 26 | 14       | Full    |
| 15               | Skip 30 | 16       | Full    |
| 17               | Full    | 18       | Skip 4  |
| 19               | Full    | 20       | Skip 8  |
| 21               | Full    | 22       | Skip 12 |
| 23               | Full    | 24       | Skip 16 |
| 25               | Full    | 26       | Skip 20 |
| 27               | Full    | 28       | Skip 24 |
| 29               | Full    | 30       | Skip 28 |
| 31               | Full    | 32       | Full    |
| 33               | Skip 2  | 34       | Full    |
| 35               | Skip 6  | 36       | Full    |
| 37               | Skip 11 | 38       | Full    |
| 39               | Skip 15 | 40       | Full    |
| 41               | Skip 19 | 42       | Full    |
| 43               | Skip 23 | 44       | Full    |
| 45               | Skip 27 | 46       | Full    |
| 47               | Full    |          |         |

#### Accuracy

The Epirote calendar is an enigma in horology. Many things are known about it thanks to research done on the Antikythera mechanism, but ultimately certain aspects of the calendar, such as its calibration date and leap month, are educated speculation.

Otherwise the implementation of the algorithm is fairly straightforward, if a bit complex. As this calendar was calibrated millennia ago, it is sure to have experienced significant drift from the solar year, which is unaccounted for here.

#### Source

Research into this calendar spans several scientific papers and studies.

Information about its month cycle can be found [here](https://antikytheramechanism.com/anatomy.html).

Here is [a paper](https://www.academia.edu/31490985/The_Calendar_on_the_Antikythera_Mechanism_and_the_Corinthian_Family_of_Calendars) that used deductive reasoning to locate the source of the calendar in Epirus.

[This paper](https://www.academia.edu/82846029/Calendars_with_Olympiad_and_Eclipse_Prediction_on_the_Antikythera_Mechanism_Supplementary_Notes) shows a lot of research about how the calibration date was uncovered.

And finally, Clickspring has [a fantastic YouTube series](https://www.youtube.com/watch?v=dRXI9KLImC4&list=PLZioPDnFPNsHnyxfygxA0to4RXv4_jDU2) about building a replica of the Antikythera mechanism using tools from the time period. He is also a leading researcher referenced in some of the other papers.


