export const SKILL_MD = `# Onboard — Project Specification Builder

## Purpose
Interactive onboarding that takes a project from zero (or partial) to a complete,
agent-ready documentation set through structured interview and iterative refinement.

## What it produces
Four files written to the project root:

| File | Purpose | Source step |
|------|---------|-------------|
| PROJECT_BRIEF.md | Vision, problem, audience, success criteria | Interview phase 1 |
| SPEC.md | Features, tech stack, architecture decisions | Interview phases 2-4 |
| CLAUDE.md | Agent instructions, conventions, build commands | Interview phase 5 |
| TASKS.md | Phased development plan with checkboxes | Interview phase 6 |

## When to use
- Developer runs \\\`/onboard\\\`
- Project has no CLAUDE.md or SPEC.md
- Developer asks to "set up the project", "define the spec", or "start from scratch"

## Operating modes
1. **FRESH** — No docs exist. Run full interview (phases 1-7).
2. **PARTIAL** — Tech signals exist (package.json, go.mod, etc.) but no spec docs.
   Skip questions already answered by existing files.
3. **REFINE** — Previous /onboard outputs exist. Show what's defined,
   ask what to change, surgically update.

## Quick reference

### Interview phases
1. Vision → PROJECT_BRIEF.md
2. Features & commands → SPEC.md §1
3. Technical decisions → SPEC.md §2
4. Architecture → SPEC.md §3
5. Agent rules → CLAUDE.md
6. Task breakdown → TASKS.md
7. Final review + consistency check

### Key behaviors
- Ask ONE question at a time, reflect answer back briefly
- Suggest opinionated defaults when developer is unsure
- Never dump all questions at once
- In refine mode: preserve unchanged sections, only touch what's requested
- After writing files: run \\\`scripts/validate.sh\\\` to cross-check consistency

## Detailed documentation
- For the full interview protocol and question sequences:
  read \\\`.skills/onboard/reference.md\\\`
- For example outputs and file templates:
  read \\\`.skills/onboard/examples.md\\\`
- To detect existing project state:
  run \\\`.skills/onboard/scripts/detect.sh\\\`
- To validate generated docs:
  run \\\`.skills/onboard/scripts/validate.sh\\\`
`;