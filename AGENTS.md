## Library of Time – AI Guide

This document explains how AI assistants should work on the Library of Time project.

- **Project mission**: Maintain a beautiful, accurate, and dependency‑free library of human timekeeping systems, as described in `README.md`.
- **Tech constraints**:
  - Only vanilla HTML, JS, and CSS.
  - No new external packages, build tools, or APIs.
  - The site must keep working when `index.html` is opened directly from disk.
- **Accuracy first**:
  - Calendar and time calculations are correctness‑critical.
  - When changing any timekeeping logic, prefer to add or update tests in the `Tests` folder.

### How we want AI to help

- **Code changes**: Favor small, incremental edits that keep behavior obvious and testable.
- **Refactors**: When refactoring, preserve public behavior of existing modules, especially in `Timekeeping`, `Other`, and `Tests`.
- **Docs**: Keep explanations concise and focused on what future contributors (human or AI) need to know.

### Skills

- **Project rules**: Core constraints and expectations live in `.cursor/rules/library-of-time-core.mdc`.
- **Calendar math skill**: Use the `calendar-math` skill in `.cursor/skills/calendar-math/` when designing or implementing calendar and timekeeping logic, especially for one-shot calendar implementations.

You can add more project skills under `.cursor/skills/` as workflows emerge (e.g., UX tuning, documentation alignment), following Cursor’s standard `SKILL.md` format.

