import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { remove, writeFile } from "fs-extra";
import { afterEach, describe, expect, it } from "vitest";

import { detectProject } from "../src/detect.js";

const tempDirs: string[] = [];

afterEach(async () => {
    await Promise.all(tempDirs.map(async (dir) => remove(dir)));
    tempDirs.length = 0;
});

async function makeTempDir(): Promise<string> {
    const dir = await mkdtemp(path.join(tmpdir(), "onboard-detect-"));
    tempDirs.push(dir);
    return dir;
}

describe("detectProject", () => {
    it("returns FRESH mode for an empty project", async () => {
        const dir = await makeTempDir();

        const result = await detectProject(dir);

        expect(result.mode).toBe("FRESH");
        expect(result.language).toBe("unknown");
        expect(result.specDocs["SPEC.md"]).toBe(false);
    });

    it("returns PARTIAL mode and typescript when ts signals exist", async () => {
        const dir = await makeTempDir();
        await writeFile(path.join(dir, "package.json"), "{}", "utf-8");
        await writeFile(path.join(dir, "tsconfig.json"), "{}", "utf-8");

        const result = await detectProject(dir);

        expect(result.mode).toBe("PARTIAL");
        expect(result.language).toBe("typescript");
        expect(result.techSignals["package.json"]).toBe(true);
        expect(result.techSignals["tsconfig.json"]).toBe(true);
    });

    it("returns REFINE mode when spec docs already exist", async () => {
        const dir = await makeTempDir();
        await writeFile(path.join(dir, "SPEC.md"), "# Spec", "utf-8");

        const result = await detectProject(dir);

        expect(result.mode).toBe("REFINE");
        expect(result.specDocs["SPEC.md"]).toBe(true);
        expect(result.existingDocPreviews["SPEC.md"]).toContain("# Spec");
    });
});
