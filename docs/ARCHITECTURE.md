# Architecture

## Purpose

`skygorilla-info-fallback` is a tiny, static Cloudflare Pages surface for `info.skygorilla.hr`.
It exists to remain independent from the main Skygorilla application stack.

## Constraints

- No Firebase dependency
- No Firestore dependency
- No Supabase dependency
- No auth
- No payments
- No form submission
- No backend calls
- No build system required
- No Pages Functions
- No large media payloads

## Rendering model

- `index.html` loads `main.js`.
- `main.js` reads `status-content.json`.
- The page swaps content based on path or `?context=` query parameters.

## Route contexts

- `/` or `?context=maintenance`
- `/deploy`
- `/outage`
- `/security`
- `/coming-soon`

## Layout behavior

- Mobile-first static shell
- Minimal cards and strong headline hierarchy
- No fake telemetry
- No animated dependency on runtime data

## Deployment notes

- Deploy to Cloudflare Pages from Git.
- Leave the build command blank if no build step is needed.
- Verify the generated `*.pages.dev` URL before attaching the custom domain.
- Attach `info.skygorilla.hr` only after preview verification.
- Add the custom domain through the Pages project, not by manual DNS-only setup.
