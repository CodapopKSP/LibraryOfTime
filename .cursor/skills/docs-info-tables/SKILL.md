---
name: docs-info-tables
description: Standardizes column order and headers for Info-section tables in Docs/src calendar markdown files. Use when adding or editing month, day-name, weekday, or epoch tables in Docs/src, or when the user asks to standardize doc tables.
---

# Docs Info Tables

## When to use

Use when adding or editing tables under `## Info` (or the epoch block at the top) in `Docs/src/**/*.md`.

## Hard constraint

**Never use HTML tables** in `Docs/src`. Markdown tables only — no `<table>`, `<thead>`, `<tr>`, `<th>`, `<td>`, or `colspan`.

Markdown allows only **one** `|---|` separator per table. A second separator renders as a visible dash row in mdBook.

## General rules

1. **Index column** — Use `#` when numbering adds information. Omit it when order is already universal (e.g. Sunday–Saturday in English) or when a single label column is enough.
2. **Native before transliteration** — Script or local form first, then `Transliteration`.
3. **First column header** — Use the section name (`Months`, `Day Names`, `Weekdays`) for the native/script column when paired with `Transliteration`. Do not use a separate section title row plus `{Script/Language}` (e.g. avoid `Armenian` when `Months` already names the column).
4. **Transliteration header** — Use `Transliteration` (not `Latin transliteration` unless disambiguation is needed).
5. **Missing values** — Use `—` in the cell that lacks data.
6. **RTL script in LTR tables** — Mandaic, Arabic, Hebrew, Armenian, and similar scripts in markdown tables can reorder columns visually. Wrap each RTL cell in left-to-right marks (U+200E `‎` … `‎`) so `Months | Days | Transliteration` columns stay aligned. See `Docs/src/SolarCalendars/Mandaean.md`.
7. **One header row** — Prefer a single header row. Use a separate section title row only when the table layout needs it (e.g. English + local name with no transliteration column — see Bahá'í weekdays). Do not use `###` headings above Info tables.

```markdown
| Months | Days | Transliteration |
| ------ | ---- | --------------- |
| … | 30 | … |
```

## Table types

### Epoch (top of file)

```markdown
| Epoch | Confidence | Associated with |
| ----- | ---------- | --------------- |
```

### Months — native script + transliteration

```markdown
| Months | Days | Transliteration |
| ------ | ---- | --------------- |
| … | 30 | … |
```

Omit `#` when months are listed in calendar order (including intercalary periods in their calendar position, e.g. Parwanaya after month 8 in Mandaean).

### Months — transliterated names only (no separate native column)

```markdown
| Months | Days | … |
| ------ | ---- | - |
```

Or, when grouped with other Info tables and a `Days` column is not the focus:

```markdown
| Months | Days | Approx. Gregorian Time |
| ------ | ---- | ---------------------- |
| Bahá | 19 | … |
```

### Day-of-month names

```markdown
| Day Names | Transliteration |
| --------- | --------------- |
| … | … |
```

### Weekdays

**English only, universal order** (Anno Lucis pattern — no translation, no `#`):

```markdown
| Weekdays  |
| --------- |
| Sunday    |
| …         |
| Saturday  |
```

**Named weekdays, fixed order** (Discordian pattern — no English gloss, no `#`):

```markdown
| Weekdays |
| -------- |
| Sweetmorn |
| … |
```

Use a single `Weekdays` column when the list is short, order is fixed, and numbering does not add information (same rule as omitting `#` for Sunday–Saturday).

**English + local name** (Bahá'í, Mandaean pattern — grouped with months):

```markdown
| Weekdays | |
| -------- | - |
| Sunday | … |
```

English in the first column; local name in the second. Section title row only — no column-header row. No `#` column.

**English + native script + transliteration** (Coptic, Ge'ez, Saka Samvat pattern):

```markdown
| Weekdays | | Transliteration |
| -------- | - | --------------- |
| Sunday | … | … |
```

English in the first column; native script in the second (unnamed `-` header). Do not use `{Script/Language}` as a column header.

**Native script + transliteration, no English** (Armenian pattern):

```markdown
| Weekdays | Transliteration |
| -------- | --------------- |
| … | … |
```

**Local weekday names, fixed order** (Igbo pattern — single column, no `#`):

```markdown
| Weekdays |
| -------- |
| Eke |
| … |
```

## Quick checklist

- [ ] Markdown tables only — no HTML
- [ ] Exactly one `|---|` separator per table
- [ ] Native + transliteration: first column is `Months`, `Day Names`, or `Weekdays` — not `{Script/Language}`
- [ ] Index uses `#` only when numbering adds information
- [ ] Native/script column precedes `Transliteration`

## Reference examples

- Native + transliteration (`Months` / `Day Names` / `Weekdays` headers): `Docs/src/SolarCalendars/Armenian.md`
- Months + English weekday names with local names: `Docs/src/SolarCalendars/Bahai.md`
- English weekdays only: `Docs/src/SolarCalendars/AnnoLucis.md`
- Named weekdays, fixed order (no `#`): `Docs/src/SolarCalendars/Discordian.md`
- Native months + intercalary in calendar order; weekdays with translation: `Docs/src/SolarCalendars/Mandaean.md`
- Section title row (weekdays with translation): `Docs/src/SolarCalendars/Qadimi.md`
- English + native script + transliteration: `Docs/src/SolarCalendars/Coptic.md`, `Docs/src/SolarCalendars/GeEz.md`, `Docs/src/SolarCalendars/SakaSamvat.md`
- Transliterated months only: `Docs/src/SolarCalendars/Coptic.md` (month table)
- Local weekday names, fixed order: `Docs/src/SolarCalendars/Igbo.md`
