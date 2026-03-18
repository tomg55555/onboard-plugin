# AGENTS.md

Guidance for coding agents working in `onboard-plugin`.
Use this as the default implementation and validation playbook.

## Project Snapshot
- Language: TypeScript with `strict` mode.
- Module system: ESM (`"type": "module"`).
- Build: `tsup` (entries defined in `package.json`).
- Tests: `vitest`.
- Lint: `eslint` v9 (flat-config format expected).
- CLI entry: `bin/cli.ts`.
- Library entry: `src/index.ts`.
- Published artifacts: `dist/` and `templates/`.

## Repository Layout
- `bin/cli.ts`: CLI commands (`init`, `detect`, `validate`, `uninstall`).
- `src/install.ts`: writes skill and command files into target projects.
- `src/detect.ts`: scans project state and infers onboarding mode.
- `src/validate.ts`: cross-checks generated markdown docs.
- `src/templates/*.ts`: embedded template payloads.
- `templates/`: source-of-truth markdown/shell templates.
- `tests/*.test.ts`: Vitest suites.
- `dist/`: generated output only; avoid manual edits.

## Build, Lint, and Test Commands
Run all commands from repository root.

### Setup
```bash
npm install
```

### Build
```bash
npm run build
```

### Typecheck
```bash
npm run typecheck
```

### Lint
```bash
npm run lint
```

### Test (default watch)
```bash
npm test
```

### Test once (CI-style)
```bash
npm test -- --run
```

### Single test file (important)
```bash
npm test -- --run tests/detect.test.ts
```

### Single test by name (important)
```bash
npm test -- --run -t "detects TypeScript project"
```

### Single file + test name
```bash
npm test -- --run tests/validate.test.ts -t "flags missing files"
```

### If suites are intentionally empty
```bash
npm test -- --run --passWithNoTests
```

## CLI Dev Commands
```bash
npm run dev -- init --dir .
npm run dev -- detect --dir .
npm run dev -- validate --dir .
npm run dev -- uninstall --dir .
```

## Current Baseline Health
- `npm run build` fails in DTS generation due TypeScript typing issues.
- `npm run typecheck` fails (missing generic params, implicit `any`).
- `npm run lint` fails (missing `eslint.config.js|mjs|cjs`).
- `npm test -- --run --passWithNoTests` succeeds with zero tests.

Do not assume a clean baseline; run targeted checks for touched files first.

## Code Style Guidelines

### Imports
- Use ESM imports only; do not add CommonJS `require`.
- Use explicit `.js` extension on relative TS imports.
- Import order: Node built-ins, third-party packages, then local modules.
- Prefer one import per line unless a grouped import is clearer.
- Use `import type` for type-only imports.

### Formatting
- Match existing TypeScript style: double quotes, semicolons, trailing commas.
- Use 4-space indentation in `.ts` source files.
- Keep changes localized; avoid reformatting untouched code.

### Types
- Keep code `strict`-compatible.
- Always specify required generics (`Promise<T>`, `Record<K, V>`, etc.).
- Avoid `any`; use `unknown` with explicit narrowing.
- Give exported functions explicit return types.
- Prefer explicit interfaces/types for public contracts.
- Model finite states with unions (`"FRESH" | "PARTIAL" | "REFINE"`, etc.).

### Naming
- `camelCase` for variables, params, and functions.
- `PascalCase` for interfaces and type aliases.
- `UPPER_SNAKE_CASE` for module-level constants.
- Use kebab-case for multi-word filenames (for example `claude-command.ts`).

### Error Handling
- Guard filesystem and external side effects with `try/catch` where needed.
- Swallow errors only when intentionally non-fatal; add a short reason comment.
- In CLI flows, prefer actionable messages over raw stack traces.
- Use `process.exitCode` instead of hard `process.exit()` in reusable code paths.
- Fail fast on invalid user input.

### Async and Filesystem
- Prefer `async/await` over chained `.then()` calls.
- Use `path.resolve` for roots and `path.join` for child paths.
- Use `fs-extra` helpers consistently (`ensureDir`, `pathExists`, `readFile`, `writeFile`).
- Mark generated shell scripts executable when required (`chmod 0o755`).

### Testing
- Keep tests in `tests/` with `.test.ts` suffix.
- Prefer behavior-driven tests over implementation-coupled assertions.
- Cover happy path, missing-file cases, and malformed-content edge cases.
- Add regression tests for bug fixes when practical.

### Templates and Docs
- Treat `templates/` as source-of-truth content.
- Keep `src/templates/*.ts` in sync with raw template files intentionally.
- Preserve placeholder semantics and command names across generated docs.
- Keep validation logic aligned with actual generated markdown structure.

## Scope and Hygiene
- Keep diffs focused; avoid incidental refactors.
- Do not edit `dist/` manually unless task explicitly requires generated output updates.
- Never modify `node_modules/`.
- If you add or change tooling, update this file with new command expectations.

## Cursor and Copilot Rules
- Checked `.cursor/rules/`: no rules found.
- Checked `.cursorrules`: not present.
- Checked `.github/copilot-instructions.md`: not present.
- If these files are added later, treat them as authoritative supplements.

## Recommended Agent Workflow
1. Read target source file(s) and nearby tests before editing.
2. Implement the smallest typed change that solves the task.
3. Run focused verification first (single test file), then broader checks.
4. Run `npm run typecheck` for TypeScript changes.
5. Run `npm run build` when exports/CLI/templates are touched.
6. Report what changed, what commands were run, and any remaining failures.
