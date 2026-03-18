export const EXAMPLES_MD = `# Onboard — Example Outputs

These are reference examples of what good generated docs look like.
Load this file when you need to calibrate output quality and format.

---

## Example: PROJECT_BRIEF.md

\\\`\\\`\\\`markdown
# specflow — Project Brief

## One-liner
A CLI that generates agent-ready project specs through structured developer interviews.

## Problem
Starting a new project with an AI coding agent requires upfront documentation —
CLAUDE.md, technical specs, task breakdowns — that most developers skip or write
poorly. The result: agents hallucinate architecture, invent conventions, and produce
code that drifts from the developer's mental model.

## Audience
Individual developers and small teams who use AI coding agents for greenfield projects.

## Success criteria
A developer with a rough idea can go from "I want to build X" to a complete,
consistent set of spec documents in under 15 minutes, through guided conversation.

## Inspiration
- OpenSpec — spec generation, but one-shot not iterative
- npm init — interactive scaffolding UX
- The Twelve-Factor App — opinionated documentation as project foundation

Last updated: {date}
\\\`\\\`\\\`

---

## Example: SPEC.md

\\\`\\\`\\\`markdown
# specflow — Technical Specification

## Features

### Core commands
- \\\`init\\\` — start a new onboarding interview from scratch
- \\\`refine\\\` — re-enter interview to update existing docs
- \\\`validate\\\` — cross-check all docs for consistency

### MVP scope
init and refine only. validate runs automatically.

### User workflow
1. Run \\\`npx specflow init\\\`
2. Answer interview questions
3. Four markdown files written to project root
4. Start coding with agent (reads CLAUDE.md)
5. Run \\\`specflow refine\\\` when scope changes

## Technical stack

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Language | TypeScript | Target audience |
| Distribution | npm / npx | Zero-install |
| Config | None | Interview state is ephemeral |
| Persistence | None | Docs on disk are the state |

## Architecture

| Decision | Choice |
|----------|--------|
| Structure | src/commands/, src/interview/, src/generators/ |
| Testing | vitest — unit + integration |
| Error handling | Typed errors + stderr |
| Output | Rich with --quiet and --json flags |

Last updated: {date}
\\\`\\\`\\\`

---

## Example: CLAUDE.md

\\\`\\\`\\\`markdown
# CLAUDE.md — Agent instructions for specflow

## Overview
CLI tool that generates agent-ready project documentation through developer interviews.

## Stack
TypeScript, Node.js >=20, commander, vitest, tsup

## Build & run
npm install
npm run build
npm run dev
npm test
npm run lint
npm run typecheck

## Conventions
- Functional style, no classes
- Named exports only
- Files under 150 lines
- Error messages must suggest a fix

## Always do
- Write tests for new functions
- Handle errors explicitly
- Update this file if build commands change

## Never do
- Add dependencies without asking
- Use any or unknown types
- Write to filesystem outside project root

## Autonomy
High for scaffolding. Medium for interview logic. Low for output format.

Last updated: {date}
\\\`\\\`\\\`

---

## Example: TASKS.md

\\\`\\\`\\\`markdown
# specflow — Task Breakdown

## Phase 0: Scaffolding
- [ ] npm init, tsconfig, tsup, eslint, prettier
- [ ] Directory structure
- [ ] Commander setup with placeholder commands

## Phase 1: Core framework
- [ ] Project scanner
- [ ] Interview engine
- [ ] Markdown generator base

## Phase 2: MVP
- [ ] init command — full interview
- [ ] refine command — detect + partial re-interview

## Phase 3: Full features
- [ ] validate command
- [ ] export command
- [ ] Smart defaults engine

## Phase 4: Polish
- [ ] Error messages, help text, README

## Phase 5: Testing & release
- [ ] Test coverage, edge cases
- [ ] npm publish, v0.1.0

Last updated: {date}
\\\`\\\`\\\`
`;