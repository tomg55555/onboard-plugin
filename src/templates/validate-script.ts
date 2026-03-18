export const VALIDATE_SCRIPT = `#!/usr/bin/env bash
set -euo pipefail

ROOT="\${1:-.}"
issues="[]"

add_issue() {
  local sev="$1" msg="$2" file="$3"
  issues=$(echo "$issues" | sed "s/]$/, {\\"severity\\": \\"$sev\\", \\"message\\": \\"$msg\\", \\"file\\": \\"$file\\"}]/;s/\\[, /[/")
}

for f in PROJECT_BRIEF.md SPEC.md CLAUDE.md TASKS.md; do
  if [ ! -f "$ROOT/$f" ]; then
    add_issue "error" "Missing expected file: $f" "$f"
  fi
done

if [ -f "$ROOT/CLAUDE.md" ] && [ -f "$ROOT/SPEC.md" ]; then
  for lang in typescript python go rust javascript; do
    in_claude=$(grep -ci "$lang" "$ROOT/CLAUDE.md" || true)
    in_spec=$(grep -ci "$lang" "$ROOT/SPEC.md" || true)
    if [ "$in_claude" -gt 0 ] && [ "$in_spec" -eq 0 ]; then
      add_issue "warning" "CLAUDE.md mentions $lang but SPEC.md does not" "CLAUDE.md"
    fi
  done
fi

if [ -f "$ROOT/TASKS.md" ]; then
  task_count=$(grep -c '\\- \\[ \\]' "$ROOT/TASKS.md" || true)
  if [ "$task_count" -eq 0 ]; then
    add_issue "warning" "TASKS.md has no checkbox items" "TASKS.md"
  fi
fi

for f in PROJECT_BRIEF.md SPEC.md CLAUDE.md TASKS.md; do
  if [ -f "$ROOT/$f" ]; then
    todo_count=$(grep -ci "TODO\\|TBD\\|FIXME\\|_Not yet defined_" "$ROOT/$f" || true)
    if [ "$todo_count" -gt 0 ]; then
      add_issue "info" "$f has $todo_count unresolved TODOs/TBDs" "$f"
    fi
  fi
done

if [ -f "$ROOT/CLAUDE.md" ]; then
  has_build=$(grep -c "build\\|test\\|lint\\|install" "$ROOT/CLAUDE.md" || true)
  if [ "$has_build" -eq 0 ]; then
    add_issue "warning" "CLAUDE.md has no build/test/lint commands" "CLAUDE.md"
  fi
fi

echo "$issues"
`;
