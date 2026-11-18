# Nexus

One React Native codebase, many apps.

Nexus is a base for producing and deploying several apps from a single repository. Each app is described by a small definition (its name, package identifier, icon, splash screen, colors, environment) and automation turns that definition into a built, signed, published app. Adding an app should mean adding a definition, not copying a project.

## The idea

```
apps/<app>/            what makes an app that app
  app.json             name, package id, version, environment
  icon.png  splash.png brand assets
        │
        ▼  scripts/    automation: validate, apply, build, deploy
        │
        ▼
ios/  android/  src/   one shared codebase
        │
        ▼
App A, App B, App C…   each with its own identity, from the same code
```

What belongs to an app, and should be definable without touching code:

| Aspect | Examples |
|---|---|
| Identity | display name, Android `applicationId`, iOS bundle identifier, version |
| Brand | icon, splash screen, colors, fonts |
| Environment | API URL, keys, per-environment values |
| Behavior | feature flags, enabled modules |
| Distribution | signing, store listing, release channel |

What stays shared: the code in `src/`, the native projects, the build pipeline.

## Status

This is the starting point, not the product yet.

- React Native 0.88.1 (bare, React Native CLI), React 19.3.0, TypeScript.
- Created from the official `@react-native-community/template`. The app is still the template's `App.tsx`.
- The folder structure below is in place and empty.
- There is one app, hard-coded: `Nexus` / `com.nexus`. No automation exists yet.
- Dependencies have not been installed in this repo yet, so there is no lockfile and the app has not been built.

## Structure

```
apps/                 one folder per app: its definition and brand assets   (empty)
scripts/              automation that turns a definition into an app        (empty)
src/
  app/                app entry, providers, root navigator
  navigation/         navigators, route types, deep link config
  features/<name>/    one folder per feature: screens, components, hooks, api, store, tests
  shared/
    ui/               design system; reads the app's brand
    api/              HTTP client, errors
    lib/              pure utilities
    config/           reads the active app's definition and environment
ios/  android/        native projects, shared by every app
```

Rules that keep it reusable across apps:
- No app name, color, URL or key is written in `src/`. Code reads them from `src/shared/config`.
- A feature never imports another feature's internals, only `src/shared` or the other feature's public `index.ts`.
- Business logic lives in hooks and pure functions, not in components.
- If an app needs something different, it is a value in its definition or a feature flag, not a branch in the code.

## Roadmap

Small steps, each one usable on its own. Order can change as we learn.

| # | Step | Result |
|---|---|---|
| 0 | Vision and folder structure | this document; empty folders in place |
| 1 | Install dependencies, commit the lockfile, confirm the template builds on Android and iOS | a known-good baseline |
| 2 | Move `App.tsx` into `src/app/` | code starts living in the structure |
| 3 | App definition: `apps/nexus/app.json` with name, package id and version, plus a script that validates it | the first app described as data |
| 4 | Apply identity: a script that writes display name and package id into `android/` and `ios/` from the definition | renaming an app is one command |
| 5 | Icons: generate every Android and iOS size from one source image | brand asset in, native icons out |
| 6 | Splash screen from the definition | same, for the launch screen |
| 7 | Theme: colors and fonts from the definition, consumed by `src/shared/ui` | the UI changes with the app |
| 8 | Environment and feature flags per app, read through `src/shared/config` | apps differ in behavior without code branches |
| 9 | A second app, to prove the first eight steps | real evidence it is multi-app |
| 10 | Build per app from the command line: `scripts/build <app> <platform>` | reproducible builds |
| 11 | CI: build every app on demand; signing | no manual builds |
| 12 | Deploy to the stores per app | the full path, automated |

Two things to decide along the way:

- **How apps coexist in the native projects.** Either apply a definition before each build (simple; one app at a time in the working tree), or model each app as an Android product flavor and an iOS target (all apps side by side; more native setup). Start with apply-before-build and move to flavors only if building one at a time becomes a limit.
- **When to bring in agent orchestration.** The plan is to develop features with [Requiem](https://github.com/hepoblet/requiem) once the baseline works. It is not installed yet.

## Getting started

Requires Node.js 22.11+ and the React Native environment for [Android and iOS](https://reactnative.dev/docs/set-up-your-environment).

```sh
npm install
cd ios && bundle install && bundle exec pod install && cd ..   # macOS only, for iOS

npm start            # Metro
npm run android      # or: npm run ios
```

Checks:
```sh
npm run lint
npx tsc --noEmit
npm test
```

## Branches

`development` (integration) → `stage` (validation) → `production` (released). Work happens on a branch from `development` and returns through a pull request; changes move up one level at a time.
