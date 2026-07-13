# Calendar Suggestions

Researched candidates for future nodes (July 2026), prioritizing African and Southern Hemisphere calendars. Bar for inclusion: verified epoch/structure, or — like Igbo — no epoch but a structure anchorable to Gregorian.

Existing machinery that makes many of these cheap:

- Igbo pattern (fixed structure, no era, anchored to Gregorian): `getIgboDate` in `CalendarAPI/Calendars/solarCalendars.js`
- Julian-derived civil calendars: `getJulianDerivedCivilCalendarDate`
- Solar Hijri (for offset eras): `getSolarHijriDate`
- Qadimi (for Zoroastrian variants): `getQadimiDate`
- New-moon/lunation math (lunar anchoring): `getMonthStartFromNewMoon`, lunation numbers
- Cyclical-only calendars (no year): Pawukon, Tzolkin patterns
- Era counters: Human Era pattern
- Offset clock time: Thai Time pattern in Timekeeping

## Tier 1 — African, implementable now

1. **Akan Adaduanan (Ghana)** — Cyclical, no era (Igbo-style). 42-day cycle = 6-day *nnanson* week × 7-day week; 42 compound day names (prefix + stem); four sacred *dabɔne* days (Fɔdwo, Awukudae, Fofi, Akwasidae) at 9-day intervals. The 7-day component locks to the Gregorian weekday (Akwasidae is always a Sunday; Akan day-names/kradin derive from weekday), so the cycle anchors exactly like Pawukon. Confidence: high. Source: [Wikipedia — Akan calendar](https://en.wikipedia.org/wiki/Akan_calendar).
2. **Berber/Amazigh (Yennayer)** — Solar, Julian-derived. The agrarian *fellaḥi* calendar is the Julian calendar with Berber month names; Yennayer 1 = Julian Jan 1 = Gregorian Jan 12 (some communities Jan 13/14 — note in Accuracy tab). Year count: epoch 950 BC (accession of Shoshenq I), instituted 1980 by Ammar Negadi; 2026 CE = 2976. Reuses `getJulianDerivedCivilCalendarDate` almost verbatim. Confidence: high (for the modern codified calendar). Source: [Wikipedia — Yennayer](https://en.wikipedia.org/wiki/Yennayer).
3. **Yoruba Kọ́jọ́dá (Nigeria)** — Solar-ish, Igbo's closest sibling. 4-day week (each day tied to Òrìṣà), 7 weeks/month, 13 months = 364 days; new year ≈ June 3. Modern revival counts years from 8042 BC (2026 CE = 10,068). Caveats: the 364-day structure and year count are modern codifications with inconsistent sources (some call it lunar). Anchor: June 3 new year + continuous 4-day week. Confidence: medium. Source: [Wikipedia — Yoruba calendar](https://en.wikipedia.org/wiki/Yoruba_calendar).
4. **Borana Oromo (Dhaha/Ayyaana)** — Lunar-stellar, southern Ethiopia/N. Kenya. 27 named days (*ayyaana*) permuting through 12 lunar months (~354-day year); months anchored by moon-star conjunctions (Triangulum, Pleiades, Aldebaran, Bellatrix, Orion/Saiph, Sirius); documented by Legesse (1973), linked to the Namoratunga pillars (~300 BC). Implementable: run the 27-name cycle + month names against existing lunation math; flag the stellar new-year rule as approximated. Confidence: medium. Source: [Wikipedia — Borana calendar](https://en.wikipedia.org/wiki/Borana_calendar).
5. **Swahili Time (East Africa)** — Timekeeping node, not a calendar. Day starts at ~6:00 (sunrise); *saa moja* (hour one) = 7:00, i.e. clock offset by 6 hours. Direct analogue of the Thai Time node. Confidence: high, trivial.
6. **Malagasy (Taombaovao / Alahamady) — Madagascar, African AND Southern Hemisphere** — Lunar. 12 lunar months with Arabic-zodiac-derived names (Alahamady = al-Ḥamal/Aries, …), tied to the *vintana* destiny system; new year Alahamady Be. Anchoring is the weak point: months historically tracked Islamic lunations, but the modern festival date is set by tradition/region. Feasible as lunation-mapped month names with an "Unknown epoch" à la Igbo. Confidence: medium-low — include only with heavy caveats.

## Tier 2 — Southern Hemisphere, implementable now

7. **Aymara / Andean-Amazonic year count (Willkakuti) — Bolivia/Peru/Chile** — Solar era. Year begins at the June solstice (Willkakuti, official Bolivian holiday June 21); year 5533 began June 21, 2025 → Aymara year = Gregorian + 3508 after the solstice. Modern construction (1980s Katarista movement; 5 × 1000-year Andean centuries + ~500 since conquest) — say so in Info. Mechanically Human Era with a June-solstice year boundary. Confidence: high for the civil observance. Sources: [Wikipedia — Willkakuti](https://en.wikipedia.org/wiki/Willkakuti), [Bolivian Embassy 5533 announcement](https://bolivianembassy.co.uk/2025/06/21/ano-nuevo-andino-amazonico-y-chaqueno-ano-5533-willka-kuti/).
8. **Māori Maramataka (Aotearoa/NZ)** — Lunisolar. 12 (sometimes 13) lunar months with ~30 named nights; year begins at first new moon after the heliacal rising of Matariki (Pleiades, late June/early July). NZ government publishes official Matariki holiday dates decades ahead — a hard Gregorian anchor. 40+ iwi variants exist; use the Te Papa/official version and caveat like Igbo. Confidence: medium-high. Source: [Te Papa — Months of the Maramataka](https://tepapa.govt.nz/discover-collections/read-watch-play/maori/matariki-maori-new-year/months-maramataka-maori-lunar).
9. **Javanese calendar (Anno Javanico) — Indonesia** — Lunar, fully arithmetic, ~100M users. Instituted 1633 CE by Sultan Agung, continuing the Saka count (AJ 1555 = 1633 CE); 12 months of 29/30 days, 8-year *windu* cycle (354/355-day years), 5-day *pasaran* week (Legi, Pahing, Pon, Wage, Kliwon) pairing with the 7-day week into the 35-day *wetonan* cycle; periodic *kurup* corrections are documented. Verified epoch AND structure — strongest single candidate on this list. Confidence: high.
10. **Balinese Saka (Sasih / Nyepi) — Indonesia** — Lunisolar companion to the existing Pawukon node. 12 *sasih* months; Nyepi (new year) is the day after the new moon of the 10th month (Kadasa), ~March; official Indonesian holiday with published dates; uses the Saka era already on the site. Confidence: medium-high.
11. **Aboriginal Australian seasonal calendars** — Solar seasons, no era — the purest Igbo-style fit. Best documented: **D'harawal** (Sydney region, 6 seasons) and **Noongar** (SW Australia, 6 seasons: Birak, Bunuru, Djeran, Makuru, Djilba, Kambarang), both published with Gregorian month mappings by the Bureau of Meteorology's Indigenous Weather Knowledge project and CSIRO. Noongar has the crispest published month boundaries. Confidence: high for the published mapping.

## Tier 3 — other genuine gaps (not African/SH, but strong fits)

12. **Kurdish calendar** — Solar Hijri structure + different era (epoch 612 BC, fall of Nineveh): Kurdish year = SH year + 1321. One-liner on top of `getSolarHijriDate`.
13. **Assyrian calendar (modern)** — Epoch 4750 BC; new year Kha b-Nisan = April 1 Gregorian; 2026 CE = 6776. Trivial era node.
14. **Zoroastrian Shahanshahi & Fasli** — Shahanshahi is Qadimi offset one month (intercalation difference); Fasli is fixed to March 21. Near-free given `getQadimiDate`.
15. **Nanakshahi (Sikh)** — Fixed solar calendar, epoch 1469 CE (birth of Guru Nanak), official since 2003, month starts on fixed Gregorian dates. Trivial and verified.
16. **Tabular Islamic calendar** — Arithmetic 30-year cycle; complements the astronomical Umm al-Qura node and the Islamic Lunation Number.
17. **Vikram Samvat / Bikram Sambat (Nepal official)** — Notable gap since Saka Samvat is present; epoch 57 BC. Nepal's solar Bikram Sambat has published month lengths; the lunisolar variant is heavier.
18. **Tibetan calendar** — Arithmetic lunisolar (Kalachakra); Svante Janson's "Tibetan calendar mathematics" paper gives complete algorithms. Verified structure; medium effort, high payoff.
19. **Burmese calendar** — Arithmetic lunisolar, epoch 638 CE, well documented (Eade, Irwin). Similar effort profile to Tibetan.
20. **Aztec Tonalpohualli + Xiuhpohualli** — Would complete the Mesoamerican set next to Maya Haab/Tzolkin; the Caso correlation is standard but year-bearer alignment is debated — needs a confidence caveat.

## Researched and rejected (fail the anchoring bar)

- **Inca calendar** — structure itself is disputed among chroniclers; no reliable anchor.
- **Somali stellar calendar (dab-shid / god-dirir)** — documented ethnographically (Muusa Galaal) but no agreed anchoring rule.
- **Mapuche We Tripantu** — a new-year observance (June 21/24), but no standardized year count or month structure to display.
- **Zulu/Xhosa/Sotho month systems** — month names are now labels on Gregorian months; the older lunar system lacks a documented anchoring rule.
- **Coligny (Gaulish)** — structure partially reconstructed but anchoring to real dates is contested; a future "low confidence" node at best.

## Sanity-check anchors for implementation

Yennayer 2976 = 12 Jan 2026 · Willkakuti 5533 = 21 Jun 2025 · Yoruba year 10,068 begins ≈ 3 Jun 2026 · Akan Akwasidae always falls on a Sunday · Nyepi and Matariki dates against published official holiday lists.
