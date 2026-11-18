# Nexus

A bare React Native app (React Native CLI), orchestrated with [Requiem](https://github.com/hepoblet/requiem).

- React Native 0.88.1, React 19.3.0, TypeScript
- Created from the official `@react-native-community/template` 0.88.1
- Requires Node.js 22.11+, and the React Native environment for [Android and iOS](https://reactnative.dev/docs/set-up-your-environment)

## Getting started
```sh
npm install
cd ios && bundle install && bundle exec pod install && cd ..   # macOS only, for iOS

npm start            # Metro
npm run android      # or: npm run ios
```

## Checks
```sh
npm run lint
npx tsc --noEmit
npm test
```

## Working with agents
Requiem is installed in this repo (`requiem.lock` records the version). From an agent CLI such as Claude Code:
```
/spec <feature> "<idea>"     write the spec, then approve it
/plan <feature>              plan and tasks
/build <feature>             tests, code and review, task by task
/pr <feature>                open the PR into development
```
- Rules for agents: `AGENTS.md` (Requiem's block plus this project's rules).
- Branch flow: `docs/WORKFLOW.md` (`development` → `stage` → `production`).
- Stack and methods: `requiem.config`.

To update Requiem: `node path/to/requiem/scripts/requiem.mjs update .`
