import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");

const read = (filePath) => readFile(path.join(root, filePath), "utf8");
const readBytes = (filePath) => readFile(path.join(root, filePath));

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
    assert.match(page, /content=\{socialImage\}/);
    assert.match(page, /\/social-card\.png/);
    assert.doesNotMatch(page, /const socialImage = .*social-card\.svg/);
    assert.match(page, /name="twitter:card"/);
    assert.match(page, /name="twitter:image"/);
    assert.doesNotMatch(page, /favicon\.jpe?g/i);
    assert.match(
      page,
      /name="theme-color"[^>]+media="\(prefers-color-scheme: light\)"/,
    );
    assert.match(
      page,
      /name="theme-color"[^>]+media="\(prefers-color-scheme: dark\)"/,
    );
  });

  it("uses one M plus dot monogram direction across favicon, header, and social card", async () => {
    const page = await read("src/pages/index.astro");
    const css = await read("src/styles/global.css");
    const favicon = await read("public/favicon.svg");
    const socialCard = await read("public/social-card.svg");

    assert.equal(existsSync(path.join(root, "public", "favicon.svg")), true);
    assert.equal(existsSync(path.join(root, "public", "favicon.jpeg")), false);
    assert.equal(existsSync(path.join(root, "public", "favicon.jpg")), false);
    assert.match(
      page,
      /<link rel="icon" href="\/favicon\.svg" type="image\/svg\+xml" \/>/,
    );
    assert.match(page, /<span class="brand-mark" aria-hidden="true">M<\/span>/);
    assert.doesNotMatch(page, /<span class="brand-mark"[^>]*>ME<\/span>/);
    assert.doesNotMatch(css, /--brand-mark-text:\s*var\(--bg\)/);
    assert.doesNotMatch(css, /--brand-mark-bg:\s*#eef7f2/i);
    assert.match(css, /\.brand-mark::after/);
    assert.match(favicon, /<circle\b[^>]*fill="#7CC7B2"/);
    assert.doesNotMatch(favicon, />ME</);
    assert.match(socialCard, /id="brand-lockup"/);
    assert.match(socialCard, /id="monogram"/);
    assert.match(socialCard, /<circle\b[^>]*fill="#7CC7B2"/);
    assert.doesNotMatch(socialCard, />ME</);
    assert.doesNotMatch(socialCard, /x="70" y="70" width="1060" height="490"/);
  });

  it("publishes a real PNG social card at social sharing dimensions", async () => {
    const cardPath = path.join(root, "public", "social-card.png");

    assert.equal(existsSync(cardPath), true);

    const png = await readBytes("public/social-card.png");
    assert.deepEqual(
      [...png.subarray(0, 8)],
      [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a],
    );
    assert.equal(png.readUInt32BE(16), 1200);
    assert.equal(png.readUInt32BE(20), 630);
  });

  it("copies the social card PNG into build output when dist exists", async (t) => {
    const distCardPath = path.join(root, "dist", "social-card.png");

    if (!existsSync(path.join(root, "dist"))) {
      t.skip("dist is created by npm run build");
      return;
    }

    assert.equal(existsSync(distCardPath), true);

    const png = await readFile(distCardPath);
    assert.deepEqual(
      [...png.subarray(0, 8)],
      [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a],
    );
    assert.equal(png.readUInt32BE(16), 1200);
    assert.equal(png.readUInt32BE(20), 630);
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

    assert.equal(packageJson.version, "0.2.2");
    assert.equal(packageJson.scripts.format, "prettier --write .");
    assert.equal(packageJson.scripts["format:check"], "prettier --check .");
    assert.match(ci, /npm ci/);
    assert.match(ci, /npm run check/);
    assert.match(ci, /npm run build/);
  });

  it("documents v0.2 without stale v0.1 section names", async () => {
    const readme = await read("README.md");
    const gitignore = await read(".gitignore");
    const prettierignore = await read(".prettierignore");

    assert.match(readme, /## v0\.2/);
    assert.match(readme, /Work, Notes, and Contact/);
    assert.doesNotMatch(readme, /About, Projects, Now, and Contact/);
    assert.match(readme, /Real PDF resume served from `\/resume\.pdf`/);
    assert.match(readme, /python -m venv \.venv/);
    assert.match(readme, /pip install -r resume\/requirements\.txt/);
    assert.match(readme, /python resume\/build_resume_pdf\.py/);
    assert.match(gitignore, /^\.venv\/$/m);
    assert.match(prettierignore, /^\.venv\/$/m);
  });
});
