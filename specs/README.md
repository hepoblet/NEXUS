# specs/

One folder per feature: `specs/<feature>/{spec.md, plan.md, tasks.md}`.

- `spec.md`: WHAT. Written by `/spec`, approved by a human.
- `plan.md`: HOW. Written by the `architect` agent through `/plan`.
- `tasks.md`: atomic steps tagged `[S]/[M]/[L]`. Consumed by `/build`.

Templates: `_template/spec.md` and `_template/notes.md`. Specs are written in Spanish. Active methods may require extra sections (see `.requiem/methods/`).
