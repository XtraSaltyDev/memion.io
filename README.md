# memion.io

Personal website for Miller Emion. This is the v0.1 static homepage for `memion.io`, built to be simple, fast, and easy to deploy through Vercel.

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

The production domains will be:

- `memion.io`
- `www.memion.io`

DNS is managed in Cloudflare. Add the domain names in Vercel first, then wait for Vercel to show the exact DNS records it expects. After Vercel provides those records, update Cloudflare with those exact values.

Do not configure GoDaddy hosting for this site. GoDaddy is only the registrar in this setup.

## v0.1 Checklist

- [x] Single-page personal homepage
- [x] About, Projects, Now, and Contact sections
- [x] Placeholder links for LinkedIn, resume, and email
- [x] Basic metadata and Open Graph tags
- [x] Responsive layout
- [x] Light and dark mode support through system preferences
- [ ] Replace placeholder LinkedIn URL
- [ ] Add a real resume file at `/public/resume.pdf`
- [ ] Confirm the preferred public email address
- [ ] Add real project links as projects become public

## Future Improvements

- Add a small writing or notes section
- Add project detail pages when projects have public repositories or demos
- Add a real social preview image
- Tighten copy after the first production deploy
