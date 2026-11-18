#!/usr/bin/env sh
# PreToolUse hook (matcher: Bash). Blocks `git commit` / `git push` when a stack check fails,
# and blocks force pushes and pushes to protected branches. Reads the tool call JSON on stdin. Exit 2 = block.
# Stack-agnostic: the commands to run come from .requiem/stack/checks (one per line).
set -u

input="$(cat)"
case "$input" in
  *"git commit"*|*"git push"*) ;;
  *) exit 0 ;;
esac

case "$input" in
  *"git push"*"--force"*|*"git push"*" -f"*)
    echo "BLOCKED: force push is not allowed (AGENTS.md)." >&2; exit 2 ;;
esac

# Protected branches: main plus the branch flow in requiem.config.
protected="main $(sed -n 's/^BRANCH_[A-Z]*=//p' requiem.config 2>/dev/null | tr '\n' ' ')"
branch="$(git symbolic-ref --short HEAD 2>/dev/null || echo "")"
case "$input" in
  *"git push"*)
    # Words after `git push`, minus flags: the first is the remote, the rest are refspecs.
    set -f
    args="$(printf '%s' "$input" | sed -n 's/.*git push\([^"&;|]*\).*/\1/p' | head -n 1)"
    n=0
    targets=""
    for word in $args; do
      case "$word" in -*) continue ;; esac
      n=$((n + 1))
      [ "$n" -ge 2 ] && targets="$targets ${word##*:}"
    done
    # No refspec means git pushes the current branch.
    [ -n "$targets" ] || targets="$branch"
    for target in $targets; do
      target="${target#refs/heads/}"
      [ "$target" = "HEAD" ] && target="$branch"
      for p in $protected; do
        if [ "$target" = "$p" ]; then
          echo "BLOCKED: no direct push to $p. Open a PR (docs/WORKFLOW.md)." >&2; exit 2
        fi
      done
    done
    set +f ;;
esac

checks=".requiem/stack/checks"
[ -f "$checks" ] || exit 0

while IFS= read -r cmd || [ -n "$cmd" ]; do
  case "$cmd" in ''|'#'*) continue ;; esac
  if ! sh -c "$cmd" >/tmp/requiem-gate.log 2>&1; then
    echo "BLOCKED: check failed: $cmd (see /tmp/requiem-gate.log)" >&2; exit 2
  fi
done < "$checks"
exit 0
