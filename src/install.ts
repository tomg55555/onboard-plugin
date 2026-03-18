import path from "path";
import fsExtra from "fs-extra";
import chalk from "chalk";
import ora from "ora";

import { SKILL_MD } from "./templates/skill.js";
import { REFERENCE_MD } from "./templates/reference.js";
import { EXAMPLES_MD } from "./templates/examples.js";
import { CLAUDE_COMMAND } from "./templates/claude-command.js";
import { OPENCODE_COMMAND } from "./templates/opencode-command.js";
import { DETECT_SCRIPT } from "./templates/detect-script.js";
import { VALIDATE_SCRIPT } from "./templates/validate-script.js";

interface InstallOptions {
    targetDir: string;
    targets: ("claude" | "opencode")[];
    force: boolean;
}

interface FileEntry {
    path: string;
    content: string;
    executable?: boolean;
}

export async function installToProject(opts: InstallOptions): Promise<void> {
    const root = path.resolve(opts.targetDir);
    const spinner = ora("Installing onboard plugin...").start();

    const files: FileEntry[] = [
        // Skill files (always installed)
        { path: ".skills/onboard/SKILL.md", content: SKILL_MD },
        { path: ".skills/onboard/reference.md", content: REFERENCE_MD },
        { path: ".skills/onboard/examples.md", content: EXAMPLES_MD },
        { path: ".skills/onboard/scripts/detect.sh", content: DETECT_SCRIPT, executable: true },
        { path: ".skills/onboard/scripts/validate.sh", content: VALIDATE_SCRIPT, executable: true },
    ];

    // Agent-specific command files
    if (opts.targets.includes("claude")) {
        files.push({ path: ".claude/commands/onboard.md", content: CLAUDE_COMMAND });
    }
    if (opts.targets.includes("opencode")) {
        files.push({ path: ".opencode/commands/onboard.md", content: OPENCODE_COMMAND });
    }

    let written = 0;
    let skipped = 0;

    for (const file of files) {
        const fullPath = path.join(root, file.path);

        if (!opts.force && await fsExtra.pathExists(fullPath)) {
            skipped++;
            continue;
        }

        await fsExtra.ensureDir(path.dirname(fullPath));
        await fsExtra.writeFile(fullPath, file.content, "utf-8");

        if (file.executable) {
            await fsExtra.chmod(fullPath, 0o755);
        }

        written++;
    }

    spinner.succeed(
        `Installed ${chalk.bold(written)} files` +
        (skipped > 0 ? ` (${skipped} skipped — use ${chalk.dim("--force")} to overwrite)` : "")
    );

    console.log();
    console.log(chalk.dim("  Files installed:"));
    for (const file of files) {
        const exists = await fsExtra.pathExists(path.join(root, file.path));
        const icon = exists ? chalk.green("✓") : chalk.dim("·");
        console.log(`  ${icon} ${file.path}`);
    }

    console.log();
    console.log(chalk.bold("Next steps:"));
    if (opts.targets.includes("claude")) {
        console.log(`  ${chalk.cyan("claude")} then type ${chalk.cyan("/onboard")}`);
    }
    if (opts.targets.includes("opencode")) {
        console.log(`  ${chalk.cyan("opencode")} then type ${chalk.cyan("/onboard")}`);
    }
}
