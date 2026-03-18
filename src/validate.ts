import path from "path";
import fsExtra from "fs-extra";

export interface ValidationIssue {
    severity: "error" | "warning" | "info";
    message: string;
    file: string;
}

const EXPECTED_FILES = ["PROJECT_BRIEF.md", "SPEC.md", "CLAUDE.md", "TASKS.md"];
const LANGUAGES = ["typescript", "python", "go", "rust", "javascript"];

type DocumentContents = Record<string, string | null>;

export async function validateDocs(dir: string): Promise<ValidationIssue[]> {
    const root = path.resolve(dir);
    const issues: ValidationIssue[] = [];

    // Check all expected files exist
    const contents: DocumentContents = {};
    for (const f of EXPECTED_FILES) {
        const fp = path.join(root, f);
        if (await fsExtra.pathExists(fp)) {
            contents[f] = await fsExtra.readFile(fp, "utf-8");
        } else {
            contents[f] = null;
            issues.push({ severity: "error", message: `Missing expected file: ${f}`, file: f });
        }
    }

    const claudeMd = contents["CLAUDE.md"];
    const specMd = contents["SPEC.md"];
    const tasksMd = contents["TASKS.md"];

    // Check language consistency between CLAUDE.md and SPEC.md
    if (claudeMd && specMd) {
        for (const lang of LANGUAGES) {
            const inClaude = claudeMd.toLowerCase().includes(lang);
            const inSpec = specMd.toLowerCase().includes(lang);
            if (inClaude && !inSpec) {
                issues.push({
                    severity: "warning",
                    message: `CLAUDE.md mentions "${lang}" but SPEC.md does not`,
                    file: "CLAUDE.md",
                });
            }
        }
    }

    // Check TASKS.md has checkbox items
    if (tasksMd) {
        const taskCount = (tasksMd.match(/- \[ \]/g) || []).length;
        if (taskCount === 0) {
            issues.push({
                severity: "warning",
                message: "TASKS.md has no checkbox items",
                file: "TASKS.md",
            });
        }
    }

    // Check for unresolved placeholders
    for (const [file, content] of Object.entries(contents)) {
        if (!content) continue;
        const todoCount = (content.match(/TODO|TBD|FIXME|_Not yet defined_/gi) || []).length;
        if (todoCount > 0) {
            issues.push({
                severity: "info",
                message: `${todoCount} unresolved TODO/TBD markers`,
                file,
            });
        }
    }

    // Check CLAUDE.md has build commands
    if (claudeMd) {
        const hasBuild = /build|test|lint|install/i.test(claudeMd);
        if (!hasBuild) {
            issues.push({
                severity: "warning",
                message: "No build/test/lint commands found",
                file: "CLAUDE.md",
            });
        }
    }

    // Check SPEC.md features map to TASKS.md
    if (specMd && tasksMd) {
        // Extract command names from SPEC.md (lines starting with - `command`)
        const cmdPattern = /[-*]\s+`(\w+)`/g;
        let match: RegExpExecArray | null;
        const specCommands: string[] = [];
        while ((match = cmdPattern.exec(specMd)) !== null) {
            specCommands.push(match[1]);
        }
        for (const cmd of specCommands) {
            if (!tasksMd.toLowerCase().includes(cmd.toLowerCase())) {
                issues.push({
                    severity: "warning",
                    message: `Command "${cmd}" in SPEC.md not found in TASKS.md`,
                    file: "TASKS.md",
                });
            }
        }
    }

    return issues;
}
