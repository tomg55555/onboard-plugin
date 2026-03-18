import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { remove, writeFile } from "fs-extra";
import { afterEach, describe, expect, it } from "vitest";

import { validateDocs } from "../src/validate.js";

const tempDirs: string[] = [];

afterEach(async () => {
    await Promise.all(tempDirs.map(async (dir) => remove(dir)));
    tempDirs.length = 0;
});

async function makeTempDir(): Promise<string> {
    const dir = await mkdtemp(path.join(tmpdir(), "onboard-validate-"));
    tempDirs.push(dir);
    return dir;
}

describe("validateDocs", () => {
    it("reports missing required files", async () => {
        const dir = await makeTempDir();

        const issues = await validateDocs(dir);

        const missingErrors = issues.filter((issue) => issue.severity === "error");
        expect(missingErrors).toHaveLength(4);
        expect(missingErrors.map((issue) => issue.file)).toEqual(
            expect.arrayContaining(["PROJECT_BRIEF.md", "SPEC.md", "CLAUDE.md", "TASKS.md"]),
        );
    });

    it("returns no issues for consistent complete docs", async () => {
        const dir = await makeTempDir();
        await writeFile(path.join(dir, "PROJECT_BRIEF.md"), "# Brief", "utf-8");
        await writeFile(path.join(dir, "SPEC.md"), "typescript stack", "utf-8");
        await writeFile(path.join(dir, "CLAUDE.md"), "install build test lint with typescript", "utf-8");
        await writeFile(path.join(dir, "TASKS.md"), "- [ ] Implement MVP", "utf-8");

        const issues = await validateDocs(dir);

        expect(issues).toHaveLength(0);
    });

    it("warns when TASKS.md has no checkboxes", async () => {
        const dir = await makeTempDir();
        await writeFile(path.join(dir, "PROJECT_BRIEF.md"), "# Brief", "utf-8");
        await writeFile(path.join(dir, "SPEC.md"), "# Spec", "utf-8");
        await writeFile(path.join(dir, "CLAUDE.md"), "build test", "utf-8");
        await writeFile(path.join(dir, "TASKS.md"), "No checklist items here", "utf-8");

        const issues = await validateDocs(dir);

        expect(issues.some((issue) => issue.file === "TASKS.md" && issue.severity === "warning")).toBe(true);
    });
});
