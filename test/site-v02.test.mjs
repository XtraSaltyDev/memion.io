import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");

const read = (filePath) => readFile(path.join(root, filePath), "utf8");

describe("v0.2 site promises", () => {
  it("publishes a real PDF resume at /resume.pdf", async () => {
    const resumePath = path.join(root, "public", "resume.pdf");

    assert.equal(existsSync(resumePath), true);

    const pdfHeader = await readFile(resumePath, {
      encoding: "utf8",
      flag: "r",
    });
    assert.match(pdfHeader.slice(0, 8), /^%PDF-/);
  });

  it("defines social metadata and light/dark theme colors", async () => {
    const page = await read("src/pages/index.astro");

    assert.match(page, /<link rel="canonical" href="https:\/\/memion\.io\/?"/);
    assert.match(page, /property="og:image"/);
    assert.match(page, /name="twitter:card"/);
    assert.match(page, /name="twitter:image"/);
    assert.match(
      page,
      /name="theme-color"[^>]+media="\(prefers-color-scheme: light\)"/,
    );
    assert.match(
      page,
      /name="theme-color"[^>]+media="\(prefers-color-scheme: dark\)"/,
    );
  });

  it("uses project-list semantics for selected work", async () => {
    const page = await read("src/pages/index.astro");

    assert.match(page, /<ul class="work-list"/);
    assert.match(page, /<li class="work-item">/);
    assert.match(page, /<article class="work-card">/);
  });

  it("supports system dark mode with CSS variables", async () => {
    const css = await read("src/styles/global.css");

    assert.match(css, /color-scheme:\s*light dark;/);
    assert.match(css, /@media\s+\(prefers-color-scheme:\s*dark\)/);
  });

  it("has CI and formatting scripts", async () => {
    const packageJson = JSON.parse(await read("package.json"));
    const ci = await read(".github/workflows/ci.yml");

    assert.equal(packageJson.scripts.format, "prettier --write .");
    assert.equal(packageJson.scripts["format:check"], "prettier --check .");
    assert.match(ci, /npm ci/);
    assert.match(ci, /npm run check/);
    assert.match(ci, /npm run build/);
  });

  it("documents v0.2 without stale v0.1 section names", async () => {
    const readme = await read("README.md");

    assert.match(readme, /## v0\.2/);
    assert.match(readme, /Work, Notes, and Contact/);
    assert.doesNotMatch(readme, /About, Projects, Now, and Contact/);
    assert.match(readme, /Real PDF resume served from `\/resume\.pdf`/);
  });
});
