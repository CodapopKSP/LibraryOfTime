---
name: calendar-month-names
description: Use user-provided month names or labels in calendar implementations and output. Use when implementing or updating a calendar and the user has given a list of month names (including for leap months), so the implementation does not default to numeric-only output.
---

# Calendar Month Names

## When to use this skill

Use this skill when:
- Implementing a new calendar or timekeeping system and the user **provides month names** (in any form: transliterations, native script, cuneiform, etc.).
- Updating an existing calendar and the user adds or corrects month names.
- The spec or user message includes an ordered list of months; do **not** ignore it in favor of "month 1", "month 2", or numeric-only output.

## Use the names the user provided

1. **Include the names in the implementation**
   - Define a month-names array (or equivalent) using the **exact labels** the user gave, in the **order** they gave.
   - Use these names in the calendar’s **formatted output** (the string or object returned to the UI), not only in comments or docs.
   - **Use literal characters only:** Paste the user’s month names (native script, cuneiform, etc.) directly into the source as literal text. **Do not** use Unicode escape sequences (`\uXXXX`, `\u{XXXXX}`, or similar) for month names — they are error-prone, hard to read, and often wrong (e.g. 4-digit `\u` cannot represent code points above U+FFFF). Literal characters in the source are correct, verifiable, and match what the user provided.

2. **Order is usually sequential**
   - The user’s list is typically in calendar order (month 1, month 2, …).
   - Map your internal month index (1–12 or 1–13 with leap) to the correct name by position.

3. **Leap months need interpretation**
   - Leap months are often **not** a separate entry in the list; they repeat or extend an existing month’s name.
   - Common patterns:
     - **Repeated name**: e.g. "Addaru II", "Ululu II", or "month 12 (leap)" — the leap month shares the number/name of the month it follows.
     - **Single leap entry**: the user may list one leap name (e.g. "𒌚𒋛𒀀𒆥") that appears only in a specific cycle position (e.g. year 17); other years use a different leap name (e.g. "𒌚𒋛𒀀𒊺").
     - **Skipped in list**: the main list might have 12 names; the 13th "month" in a leap year uses the same name as the repeated month (e.g. second Addaru).
   - **Follow the user’s wording**: if they say "leap month after month 6" or "Addaru II at the end", implement that; do not invent a different rule.

4. **Do not default to numbers only**
   - If the user provided names, the primary output should use those names (possibly with a numeric or "leap" qualifier).
   - Numeric fallback (e.g. "month 6 (leap)") is acceptable only when no names were given or for debugging; when names exist, show them.

## Do not use Unicode escapes for month names

- **Never** encode month names (or any user-provided labels) with `\uXXXX` or `\u{XXXXX}` in JavaScript.
- **Always** paste the actual characters (e.g. 𒌚𒁈, 甲, 正月) into the source so the labels are literal strings.
- This avoids wrong glyphs (e.g. `\u13048` parsed as `\u1304` + `"8"`), keeps code readable, and matches the user’s list exactly.

## Quick checklist

- [ ] Month names from the user’s list are stored in code in the same order.
- [ ] Names are **literal characters** in the source; no `\u` or `\u{...}` escapes for month labels.
- [ ] Formatted calendar output uses those names (or the correct repeated name for leap months).
- [ ] Leap-month placement and naming match the user’s description (which month is repeated, and where).
- [ ] No numeric-only output when the user supplied names.
