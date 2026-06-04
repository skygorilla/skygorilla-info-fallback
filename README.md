# skygorilla-info-fallback

Static Cloudflare Pages fallback for `info.skygorilla.hr`.

## Purpose

This repo is intentionally tiny and independent. It is meant to provide a stable maintenance,
downtime, and contact surface while the main `skygorilla.hr` replacement path is stabilized.

## Contents

- `index.html` - route-aware static shell
- `main.js` - context renderer
- `status-content.json` - copy and route content source
- `styles.css` - visual styling
- `public/_headers` - Cloudflare Pages headers
- `public/_redirects` - internal context aliases
- `public/robots.txt` - crawler exclusion
- `docs/` - architecture and implementation notes
- `docs/ARCHITECTURE_PACKET_M1.md` - one-page architecture packet
- `docs/INFO_SKYGORILLA_APPLICATION_WHEN_WHAT_HOW_M1.md` - application-layer decision note

## Deployment shape

- No build system
- No backend
- No Firebase dependency
- No Firestore dependency
- No Supabase dependency

## Cloudflare plan

Cloudflare Pages Free is sufficient for this surface as long as the repo stays static, small,
and free of Functions. See `docs/CLOUDFLARE_PAGES_FREE_PLAN_IMPLICATIONS_M1.md` for the limits
and risk controls that keep this M1 comfortably inside the free tier.

## Expected Cloudflare Pages setup

1. Create a GitHub repo from this folder.
2. Connect the repo to a Cloudflare Pages project.
3. Verify the generated `*.pages.dev` URL.
4. Add `info.skygorilla.hr` as a custom domain.
5. Verify HTTPS and DNS behavior.

## Content

This surface is limited to maintenance and contact information only.
