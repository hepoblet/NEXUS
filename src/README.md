# src/

The code every app shares. Feature-based: code is grouped by what it does for the user, not by technical type.

```
src/
  app/                App.tsx, providers, root navigator
  navigation/         navigators, route types, deep link config
  features/<name>/
    screens/          screens, no business logic
    components/       UI used only by this feature
    hooks/            behavior (use-*.ts)
    api/              requests and response types
    store/            client state, only if needed
    __tests__/
    index.ts          the feature's public API
  shared/
    ui/               design system
    api/              HTTP client, errors
    lib/              pure utilities
    config/           the active app's definition and environment
```

Rules:
- Nothing app-specific is hard-coded here. Names, colors, URLs and keys come from `shared/config`.
- A feature imports from `shared/` or from another feature's `index.ts`, never from its internals.
- Business logic lives in hooks and pure functions; components render.
- TypeScript strict: no `any`, no `@ts-ignore`.

The folders are empty for now. The template's `App.tsx` is still at the repo root and moves into `app/` in roadmap step 2.
