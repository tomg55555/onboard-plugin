import path from "path";
import fsExtra from "fs-extra";

export interface DetectResult {
    mode: "FRESH" | "PARTIAL" | "REFINE";
    language: string;
    sourceFileCount: number;
    specDocs: Record<string, boolean>;
    techSignals: Record<string, boolean>;
    directories: Record<string, boolean>;
    existingDocPreviews: Record<string, string>;
}

const SPEC_DOCS = ["PROJECT_BRIEF.md", "SPEC.md", "CLAUDE.md", "TASKS.md"];

const TECH_SIGNALS = [
    "package.json", "tsconfig.json", "pyproject.toml",
    "go.mod", "Cargo.toml", "Dockerfile",
    "docker-compose.yml", "README.md", ".env.example", ".gitignore",
];

const DIRECTORIES = ["src", "lib", "cmd", "app", "tests", "test"];

const EXTENSIONS = new Set([".ts", ".js", ".py", ".go", ".rs", ".tsx", ".jsx"]);
const IGNORE_DIRS = new Set(["node_modules", ".git", "target", "__pycache__", "dist", "build"]);

export async function detectProject(dir: string): Promise<DetectResult> {
    const root = path.resolve(dir);

    const specDocs: Record<string, boolean> = {};
    for (const f of SPEC_DOCS) {
        specDocs[f] = await fsExtra.pathExists(path.join(root, f));
    }

    const techSignals: Record<string, boolean> = {};
    for (const f of TECH_SIGNALS) {
        techSignals[f] = await fsExtra.pathExists(path.join(root, f));
    }

    const directories: Record<string, boolean> = {};
    for (const d of DIRECTORIES) {
        directories[d] = await fsExtra.pathExists(path.join(root, d));
    }

    // Detect language
    let language = "unknown";
    if (techSignals["Cargo.toml"]) language = "rust";
    else if (techSignals["go.mod"]) language = "go";
    else if (techSignals["tsconfig.json"]) language = "typescript";
    else if (techSignals["package.json"]) language = "javascript";
    else if (techSignals["pyproject.toml"]) language = "python";

    // Count source files (max depth 4)
    const sourceFileCount = await countSourceFiles(root, 0, 4);

    // Preview existing docs
    const existingDocPreviews: Record<string, string> = {};
    for (const f of [...SPEC_DOCS, "README.md"]) {
        const fp = path.join(root, f);
        if (await fsExtra.pathExists(fp)) {
            const content = await fsExtra.readFile(fp, "utf-8");
            existingDocPreviews[f] = content.slice(0, 2000);
        }
    }

    // Determine mode
    const hasSpecDocs = SPEC_DOCS.some(f => specDocs[f]);
    const hasTechSignals = TECH_SIGNALS.some(f => techSignals[f]);

    let mode: DetectResult["mode"] = "FRESH";
    if (hasSpecDocs) mode = "REFINE";
    else if (hasTechSignals) mode = "PARTIAL";

    return {
        mode,
        language,
        sourceFileCount,
        specDocs,
        techSignals,
        directories,
        existingDocPreviews,
    };
}

async function countSourceFiles(dir: string, depth: number, max: number): Promise<number> {
    if (depth > max) return 0;
    let count = 0;
    try {
        const entries = await fsExtra.readdir(dir, { withFileTypes: true });
        for (const entry of entries) {
            if (entry.isDirectory()) {
                if (IGNORE_DIRS.has(entry.name)) continue;
                count += await countSourceFiles(path.join(dir, entry.name), depth + 1, max);
            } else if (EXTENSIONS.has(path.extname(entry.name))) {
                count++;
            }
        }
    } catch {
        // permission error or similar, skip
    }
    return count;
}
