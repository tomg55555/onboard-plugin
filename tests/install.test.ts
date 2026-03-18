import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { pathExists, readFile, remove, stat, writeFile } from "fs-extra";
import { afterEach, describe, expect, it } from "vitest";

import { installToProject } from "../src/install.js";

const tempDirs: string[] = [];

afterEach(async () => {
    await Promise.all(tempDirs.map(async (dir) => remove(dir)));
    tempDirs.length = 0;
});

async function makeTempDir(): Promise<string> {
    const dir = await mkdtemp(path.join(tmpdir(), "onboard-install-"));
    tempDirs.push(dir);
    return dir;
}

describe("installToProject", () => {
    it("installs skill files, commands, and executable scripts", async () => {
        const dir = await makeTempDir();

        await installToProject({
            targetDir: dir,
            targets: ["claude", "opencode"],
            force: false,
        });

        expect(await pathExists(path.join(dir, ".skills/onboard/SKILL.md"))).toBe(true);
        expect(await pathExists(path.join(dir, ".claude/commands/onboard.md"))).toBe(true);
        expect(await pathExists(path.join(dir, ".opencode/commands/onboard.md"))).toBe(true);

        const detectStat = await stat(path.join(dir, ".skills/onboard/scripts/detect.sh"));
        const validateStat = await stat(path.join(dir, ".skills/onboard/scripts/validate.sh"));
        expect((detectStat.mode & 0o111) !== 0).toBe(true);
        expect((validateStat.mode & 0o111) !== 0).toBe(true);
    });

    it("does not overwrite existing files without force", async () => {
        const dir = await makeTempDir();

        await installToProject({
            targetDir: dir,
            targets: ["claude", "opencode"],
            force: false,
        });

        const skillPath = path.join(dir, ".skills/onboard/SKILL.md");
        await writeFile(skillPath, "custom", "utf-8");

        await installToProject({
            targetDir: dir,
            targets: ["claude", "opencode"],
            force: false,
        });

        expect(await readFile(skillPath, "utf-8")).toBe("custom");
    });

    it("supports installing only Claude command", async () => {
        const dir = await makeTempDir();

        await installToProject({
            targetDir: dir,
            targets: ["claude"],
            force: false,
        });

        expect(await pathExists(path.join(dir, ".claude/commands/onboard.md"))).toBe(true);
        expect(await pathExists(path.join(dir, ".opencode/commands/onboard.md"))).toBe(false);
    });
});
