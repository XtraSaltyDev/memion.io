# memion.io

Personal website for Miller Emion. This is a small static portfolio for `memion.io`, built to be simple, fast, and easy to deploy through Vercel.

The current homepage is organized around Work, Notes, and Contact.

## Tech Stack

- [Astro](https://astro.build/) for a mostly static site
- TypeScript-aware Astro configuration
- Plain CSS for styling
- npm for package management

## Local Development

```bash
npm install
npm run dev
```

The dev server usually runs at `http://localhost:4321`.

## Build

```bash
npm run format:check
npm test
npm run build
npm run check
```

`npm run build` creates the production output in `dist/`.

## Vercel Deployment

Import this GitHub repository into Vercel and use the default Astro settings:

- Framework preset: Astro
- Install command: `npm install`
- Build command: `npm run build`
- Output directory: `dist`

## Domain Notes

The production domains are:

- `memion.io`
- `www.memion.io`

DNS is managed in Cloudflare. Keep the Vercel domain settings and Cloudflare DNS records in sync, and avoid changing registrar or hosting settings when the remaining issue is local DNS cache.

Do not configure GoDaddy hosting for this site. GoDaddy is only the registrar in this setup.

## v0.1 Checklist

- [x] Single-page personal homepage
- [x] Work, Notes, and Contact sections
- [x] Public GitHub, email, and resume contact links
- [x] Basic metadata and Open Graph tags
- [x] Responsive layout
- [x] Confirmed public email address: `hello@memion.io`

## v0.2

v0.2 tightens the portfolio without changing its intentionally small shape.

- [x] Real PDF resume served from `/resume.pdf`
- [x] README matches current IA
- [x] CI runs formatting, tests, Astro check, and build
- [x] Dark mode support is real through `prefers-color-scheme`
- [x] Social metadata improved with a local SVG preview image
- [x] Public project links added where real URLs exist

## v0.2.1

v0.2.1 keeps the v0.2 site shape and focuses on deployment polish.

- [x] Social preview metadata points to a local PNG card for wider platform support
- [x] Resume generation documents both `uv` and standard Python setup paths
- [x] Tests validate the PDF resume and PNG social card static assets

The public resume source is in `resume/Miller-Emion-Resume-UPDATED.md`. Run the PDF generator after resume edits:

```bash
uv run --with-requirements resume/requirements.txt python resume/build_resume_pdf.py
```

If you do not have `uv`, use a standard Python virtual environment:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r resume/requirements.txt
python resume/build_resume_pdf.py
```

The DOCX generator is kept for editable Word drafts, but generated DOCX files are ignored. The public portfolio artifact is `public/resume.pdf`.

## Future Improvements

- Add a small writing or notes section
- Add project detail pages when projects have public repositories or demos
- Tighten copy after the first production deploy
