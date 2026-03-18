export const REFERENCE_MD = `# Onboard — Full Interview Protocol

## Phase 0: Detection

Before asking anything, run \\\`bash .skills/onboard/scripts/detect.sh\\\` and read
its JSON output. This tells you:
- Which spec docs already exist (and their content)
- Which tech stack signals were found
- What project structure looks like
- Current operating mode (FRESH / PARTIAL / REFINE)

Based on the output, decide your mode and skip known answers.

---

## Phase 1: Vision

**Goal**: Understand what we're building and why.
**Output**: PROJECT_BRIEF.md

Ask these sequentially. Wait for each answer. After each, reflect back in one
sentence ("Got it — so this is basically X for Y").

| # | Question | If stuck, suggest |
|---|----------|-------------------|
| 1 | What's the working name for this project? | "A placeholder is fine — we can rename later" |
| 2 | Describe it in one sentence — what does it do and for whom? | Offer a template: "A [type] that [action] for [audience] so they can [outcome]" |
| 3 | What's the pain point? Who feels it, how often, and what do they do today? | "What's the most annoying part of the current workflow?" |
| 4 | What does success look like? How will you know it works? | "Think about the first user — what changes for them?" |
| 5 | Any existing tools or inspiration? What would you do differently? | "Even if there's nothing close, what's the nearest analog?" |

**After all 5**: Summarize the vision in 3-4 sentences. Ask: "Does this capture it?"
If confirmed → write PROJECT_BRIEF.md → proceed.

---

## Phase 2: Features & Commands

**Goal**: Define what the tool actually does.
**Output**: SPEC.md §1 (features section)

| # | Question | If stuck, suggest |
|---|----------|-------------------|
| 1 | Walk me through the main commands or features you envision. | "Start with the verbs — what actions does a user take?" |
| 2 | Describe a typical workflow from install to daily use. | "Imagine it's day 1 vs day 30 — what's different?" |
| 3 | What inputs does the tool consume? What outputs does it produce? | "Files, APIs, stdin, env vars on one side — files, stdout, API calls on the other" |
| 4 | Interactive prompts, TUI, or flags-only? | Suggest based on project type |
| 5 | If you shipped tomorrow with 2-3 features only, which ones? | "Which single command would make someone install this?" |

**After all**: Present features organized as MVP vs Later. Confirm before proceeding.

---

## Phase 3: Technical Decisions

**Goal**: Lock down the tech stack.
**Output**: SPEC.md §2 (technical section)

For each decision, if the developer is unsure, suggest a default based on
detected signals from Phase 0 and explain reasoning in one sentence.

| # | Question | Default logic |
|---|----------|---------------|
| 1 | Language and runtime? | Infer from package.json/go.mod/Cargo.toml/pyproject.toml if present |
| 2 | How will users install it? | Match to language: TS→npm, Python→pipx, Go→brew+binary, Rust→cargo |
| 3 | Configuration approach? | CLI tools → YAML or TOML; simple tools → env vars only |
| 4 | Persist state between runs? | Default: no, unless features imply it |
| 5 | External services or APIs? | Ask only if not obvious from Phase 2 |
| 6 | Hard constraints? | Prompt for: offline support, OS compat, licensing, performance |

**After all**: Present as a decision table. Confirm.

---

## Phase 4: Architecture

**Goal**: Define how the codebase is organized.
**Output**: SPEC.md §3 (architecture section)

| # | Question | Default logic |
|---|----------|---------------|
| 1 | Project structure? | See "Defaults by project type" below |
| 2 | Testing approach? | Default: unit + integration for most; E2E for CLI tools |
| 3 | Error handling philosophy? | CLI → exit codes + stderr; library → result types |
| 4 | Output style? | Default: rich (colors/spinners) with --quiet and --json flags |
| 5 | Plugin/extension system? | Default: "design for later" unless explicitly needed now |

**After all**: Write the complete SPEC.md (phases 2+3+4 combined). Confirm.

---

## Phase 5: Agent Rules

**Goal**: Define how the coding agent should behave.
**Output**: CLAUDE.md

| # | Question | If stuck, suggest |
|---|----------|-------------------|
| 1 | Coding style preferences? | "Functional or OOP? Max file size? Naming conventions?" |
| 2 | Things the agent should NEVER do? | Suggest: "don't add deps without asking, don't modify auth without approval" |
| 3 | Things the agent should ALWAYS do? | Suggest: "write tests, handle errors, update README" |
| 4 | How much autonomy? | Explain spectrum: "High = implement freely, Medium = propose first, Low = step by step" |
| 5 | Anything else? | "Team size, deadlines, compliance requirements, deployment targets?" |

**After all**: Write CLAUDE.md with all sections.

---

## Phase 6: Task Breakdown

**Goal**: Create a phased development plan.
**Output**: TASKS.md

Generate automatically from Phases 2-4. Structure:

- Phase 0: Scaffolding
- Phase 1: Core framework
- Phase 2: MVP
- Phase 3: Full features
- Phase 4: Polish
- Phase 5: Testing & release

Present the plan. Ask: "Does this phasing make sense?"
Write TASKS.md when confirmed.

---

## Phase 7: Final Review

1. Run \\\`bash .skills/onboard/scripts/validate.sh\\\`
2. Report any inconsistencies
3. Display file status summary
4. Offer next steps

---

## Refine Mode Protocol

When entering REFINE mode:
1. Read all four files
2. Summarize what's defined
3. Ask what to update (vision, features, tech, rules, tasks, or full review)
4. Jump to relevant phase, pre-populate known answers
5. Preserve unchanged sections
6. Re-run validation after updates

---

## Defaults by Project Type

### CLI Tool — Node.js / TypeScript
Structure: src/commands/, src/lib/, src/utils/, tests/
Testing: vitest, Config: cosmiconfig, Install: npm/npx, Args: commander

### CLI Tool — Python
Structure: src/{name}/, tests/
Testing: pytest, Config: pyproject.toml, Install: pipx/uv, Args: click/typer

### CLI Tool — Go
Structure: cmd/{name}/, internal/, pkg/
Testing: go test + testify, Config: viper, Install: go install, Args: cobra

### CLI Tool — Rust
Structure: src/commands/, src/lib.rs
Testing: cargo test, Config: serde+toml, Install: cargo install, Args: clap

### Web Application — Next.js
Structure: app/, components/, lib/, server/
Testing: vitest + playwright, DB: prisma + postgres

### API Service — Python (FastAPI)
Structure: app/routers/, app/models/, app/services/, tests/
Testing: pytest + httpx, DB: sqlalchemy + alembic
`;