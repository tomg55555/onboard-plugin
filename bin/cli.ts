#!/usr/bin/env node

import { program } from "commander";
import chalk from "chalk";
import fsExtra from "fs-extra";
import { installToProject } from "../src/install.js";
import { detectProject } from "../src/detect.js";
import { validateDocs } from "../src/validate.js";

program
    .name("onboard-plugin")
    .description("Interactive project onboarding for AI coding agents")
    .version("0.1.1");

program
    .command("init")
    .description("Install onboard skill + commands into the current project")
    .option("--claude-only", "Only install Claude Code command")
    .option("--opencode-only", "Only install OpenCode command")
    .option("--force", "Overwrite existing files")
    .option("--dir <dir>", "Target directory", ".")
    .action(async (opts) => {
        const targets: ("claude" | "opencode")[] = [];
        if (opts.claudeOnly) targets.push("claude");
        else if (opts.opencodeOnly) targets.push("opencode");
        else targets.push("claude", "opencode");

        await installToProject({
            targetDir: opts.dir,
            targets,
            force: opts.force ?? false,
        });
    });

program
    .command("detect")
    .description("Scan project and report current state")
    .option("--dir <dir>", "Target directory", ".")
    .action(async (opts) => {
        const result = await detectProject(opts.dir);
        console.log(JSON.stringify(result, null, 2));
    });

program
    .command("validate")
    .description("Cross-check generated docs for consistency")
    .option("--dir <dir>", "Target directory", ".")
    .action(async (opts) => {
        const issues = await validateDocs(opts.dir);
        if (issues.length === 0) {
            console.log(chalk.green("✅ All docs are consistent."));
        } else {
            for (const issue of issues) {
                const icon =
                    issue.severity === "error" ? "❌" :
                        issue.severity === "warning" ? "⚠️" : "ℹ️";
                console.log(`${icon}  ${chalk.dim(issue.file)} — ${issue.message}`);
            }
            process.exitCode = issues.some(i => i.severity === "error") ? 1 : 0;
        }
    });

program
    .command("uninstall")
    .description("Remove onboard skill + commands from the project")
    .option("--dir <dir>", "Target directory", ".")
    .action(async (opts) => {
        const path = await import("path");
        const root = path.resolve(opts.dir);

        const paths = [
            path.join(root, ".skills", "onboard"),
            path.join(root, ".claude", "commands", "onboard.md"),
            path.join(root, ".opencode", "commands", "onboard.md"),
        ];

        for (const p of paths) {
            try {
                await fsExtra.remove(p);
                console.log(chalk.dim(`Removed ${path.relative(root, p)}`));
            } catch {
                // doesn't exist, skip
            }
        }
        console.log(chalk.green("Done. Generated docs (SPEC.md etc.) were left in place."));
    });

program.parse();
