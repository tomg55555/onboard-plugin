export const DETECT_SCRIPT = `#!/usr/bin/env bash
set -euo pipefail

ROOT="\${1:-.}"

file_exists() { [ -f "$ROOT/$1" ] && echo "true" || echo "false"; }
file_head() {
  if [ -f "$ROOT/$1" ]; then
    head -c 2000 "$ROOT/$1" | sed 's/"/\\\\"/g' | tr '\\n' ' '
  else
    echo ""
  fi
}
dir_exists() { [ -d "$ROOT/$1" ] && echo "true" || echo "false"; }

has_brief=$(file_exists "PROJECT_BRIEF.md")
has_spec=$(file_exists "SPEC.md")
has_claude=$(file_exists "CLAUDE.md")
has_tasks=$(file_exists "TASKS.md")

has_package_json=$(file_exists "package.json")
has_tsconfig=$(file_exists "tsconfig.json")
has_pyproject=$(file_exists "pyproject.toml")
has_go_mod=$(file_exists "go.mod")
has_cargo=$(file_exists "Cargo.toml")
has_dockerfile=$(file_exists "Dockerfile")
has_docker_compose=$(file_exists "docker-compose.yml")
has_readme=$(file_exists "README.md")
has_env_example=$(file_exists ".env.example")
has_gitignore=$(file_exists ".gitignore")

lang="unknown"
if [ "$has_cargo" = "true" ]; then lang="rust"
elif [ "$has_go_mod" = "true" ]; then lang="go"
elif [ "$has_tsconfig" = "true" ]; then lang="typescript"
elif [ "$has_package_json" = "true" ]; then lang="javascript"
elif [ "$has_pyproject" = "true" ]; then lang="python"
fi

has_src=$(dir_exists "src")
has_lib=$(dir_exists "lib")
has_cmd=$(dir_exists "cmd")
has_app=$(dir_exists "app")
has_tests=$(dir_exists "tests")
has_test=$(dir_exists "test")

if [ "$has_brief" = "true" ] || [ "$has_spec" = "true" ] || [ "$has_claude" = "true" ]; then
  mode="REFINE"
elif [ "$has_package_json" = "true" ] || [ "$has_pyproject" = "true" ] || \\
     [ "$has_go_mod" = "true" ] || [ "$has_cargo" = "true" ]; then
  mode="PARTIAL"
else
  mode="FRESH"
fi

src_count=0
if command -v find &>/dev/null; then
  src_count=$(find "$ROOT" -maxdepth 4 \\
    \\( -name "*.ts" -o -name "*.js" -o -name "*.py" -o -name "*.go" -o -name "*.rs" \\) \\
    -not -path "*/node_modules/*" \\
    -not -path "*/.git/*" \\
    -not -path "*/target/*" \\
    -not -path "*/__pycache__/*" \\
    2>/dev/null | wc -l | tr -d ' ')
fi

cat <<EOF
{
  "mode": "$mode",
  "language": "$lang",
  "source_file_count": $src_count,
  "spec_docs": {
    "PROJECT_BRIEF.md": $has_brief,
    "SPEC.md": $has_spec,
    "CLAUDE.md": $has_claude,
    "TASKS.md": $has_tasks
  },
  "tech_signals": {
    "package.json": $has_package_json,
    "tsconfig.json": $has_tsconfig,
    "pyproject.toml": $has_pyproject,
    "go.mod": $has_go_mod,
    "Cargo.toml": $has_cargo,
    "Dockerfile": $has_dockerfile,
    "docker-compose.yml": $has_docker_compose,
    "README.md": $has_readme,
    ".env.example": $has_env_example,
    ".gitignore": $has_gitignore
  },
  "directories": {
    "src": $has_src,
    "lib": $has_lib,
    "cmd": $has_cmd,
    "app": $has_app,
    "tests": $has_tests,
    "test": $has_test
  },
  "existing_doc_previews": {
    "PROJECT_BRIEF": "$(file_head PROJECT_BRIEF.md)",
    "SPEC": "$(file_head SPEC.md)",
    "CLAUDE": "$(file_head CLAUDE.md)",
    "TASKS": "$(file_head TASKS.md)",
    "README": "$(file_head README.md)"
  }
}
EOF
`;
