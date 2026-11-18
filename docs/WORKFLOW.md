# Branch and release workflow

The recommended flow for a project that uses Requiem. It is a starting point: this file belongs to the project, so change it to match how your team releases. Agents read it and follow what it says.

Branch names come from `requiem.config`, so you can rename them without touching agents or hooks.

```
BRANCH_DEV=development     integration: every finished feature lands here
BRANCH_STAGE=stage         validation: what QA and stakeholders test
BRANCH_PROD=production     released: what users run
```

## The flow

```
feat/<feature> ──PR──▶ development ──PR──▶ stage ──PR──▶ production ──▶ tag vX.Y.Z
fix/<topic>    ──PR──▶ development

hotfix/<topic> ──PR──▶ production ──▶ back to stage and development
```

| Step | From → to | Opened with | Merge type | Who merges |
|---|---|---|---|---|
| Feature or fix | `feat/*`, `fix/*` → development | `/pr <feature>` | squash | human |
| Promote to stage | development → stage | `/promote stage` | merge commit | human |
| Promote to production | stage → production | `/promote production` | merge commit | human |
| Hotfix | `hotfix/*` → production | manual PR | squash | human |

Promotions use a merge commit so the three branches keep a shared history and the next promotion shows only what is new. Squashing a promotion makes every later one look like a conflict.

## Rules

- Work never starts on a protected branch. Branch from `development` (or from `production` for a hotfix).
- Changes only move up one level at a time. Nothing goes from `development` straight to `production`.
- `production` only receives what was validated in `stage`, except hotfixes.
- After a hotfix merges, bring the same change to `stage` and `development` right away so it is not lost in the next release.
- Agents open PRs only when asked and never merge, tag or deploy. The pre-commit gate blocks direct pushes to the three branches and to `main`, and blocks force pushes.

## Branch names

| Prefix | For | Example |
|---|---|---|
| `feat/` | a feature with a spec | `feat/login` |
| `fix/` | a bug fix going through development | `fix/cart-total-rounding` |
| `hotfix/` | an urgent fix to production | `hotfix/payment-crash` |
| `chore/`, `docs/` | maintenance and documentation | `docs/workflow` |

Names are lowercase English with hyphens.

## Parallel work with worktrees

To work on two features at once, give each its own worktree: a second working folder of the same repo on its own branch.

```sh
node .requiem/scripts/worktree.mjs add checkout      # .worktrees/checkout on feat/checkout, from development
cd .worktrees/checkout && claude                     # one agent session per worktree
node .requiem/scripts/worktree.mjs remove checkout   # after its PR is merged
```
Inside the agent CLI, `/worktree add|remove|list` does the same and verifies the stack checks pass before work starts.

- `.worktrees/` is git-ignored. Each worktree has its own branch; they never merge into each other.
- Removal never forces: if git refuses, there is uncommitted work.
- Cost is recorded in one ledger for the whole repo, while the active-feature marker is per worktree, so parallel sessions are attributed correctly.

## Versions and releases

- A release is a merge into `production` followed by a tag `vMAJOR.MINOR.PATCH` created by a human.
- MAJOR for breaking changes, MINOR for new features, PATCH for fixes.
- The promotion PR to production lists what is included; that list is the release notes.
- What "deploy" means depends on the stack; see the stack's release skill under `.requiem/stack/skills/`, if it has one.

## Setting it up

1. Create the three branches and make `development` the default branch.
2. Protect the three in your Git host: require a pull request and passing checks, and disallow force pushes. The local hook only guards agent sessions; branch protection guards everyone.
3. Point your CI at them: run the commands in `.requiem/stack/checks` on every PR, deploy `stage` and `production` on merge.

If `BRANCH_DEV` does not exist yet, `/build` works from the default branch and says so.

## Fewer environments

- No staging environment: set `BRANCH_STAGE` to the same value as `BRANCH_PROD` and promote once.
- Trunk-based: set all three to `main`. `/pr` then targets `main` and `/promote` has nothing to do.
