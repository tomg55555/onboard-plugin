# Onboard-plugin

Interactive project onboarding for AI coding agents. Generates agent-ready
documentation (CLAUDE.md, SPEC.md, TASKS.md) through structured developer interviews.

## Quick start

```bash
# Install into your project (no global install needed)
cd your-project
npx onboard-plugin init

# Then start your agent and run the onboarding
claude         # or: opencode
/onboard
```

## What it does

When you run `/onboard` in Claude Code or OpenCode, the agent:

1. **Scans** your project for existing files and tech stack signals
2. **Interviews** you through 6 phases (vision, features, tech, architecture, rules, tasks)
3. **Generates** four markdown files:
   - `PROJECT_BRIEF.md` — Why this exists and for whom
   - `SPEC.md` — Features, tech stack, architecture decisions
   - `CLAUDE.md` — Agent instructions, coding conventions, build commands
   - `TASKS.md` — Phased development plan with checkboxes
4. **Validates** consistency across all docs

Re-run `/onboard` anytime to refine — it detects existing docs and only asks
about what's changed.

## Installation options

```bash
# Install for both Claude Code and OpenCode (default)
npx onboard-plugin init

# Claude Code only
npx onboard-plugin init --claude-only

# OpenCode only
npx onboard-plugin init --opencode-only

# Overwrite existing files
npx onboard-plugin init --force
```

## Standalone commands

```bash
# Scan project state (useful for debugging)
npx onboard-plugin detect

# Validate generated docs
npx onboard-plugin validate

# Remove plugin files (keeps generated docs)
npx onboard-plugin uninstall
```

## How it works

The plugin installs a skill directory (`.skills/onboard/`) and a slash command
into your agent's command directory. The skill contains:

- `SKILL.md` — Overview the agent reads on every invocation
- `reference.md` — Full interview protocol (loaded on demand)
- `examples.md` — Sample outputs for quality calibration (loaded on demand)
- `scripts/detect.sh` — Project scanner
- `scripts/validate.sh` — Doc consistency checker

The agent reads the skill, runs detection, interviews you, and writes docs.
No API keys, no cloud services, fully offline.

## Extending

Add new project types by editing `.skills/onboard/reference.md` — add a
"Defaults by project type" section. The interview structure stays the same;
only the suggestions change.

## License

MIT
