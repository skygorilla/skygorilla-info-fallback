# Implementation Packet M1

## Goal

Deploy `info.skygorilla.hr` as an independent static Cloudflare Pages fallback.

## Scope

- Static page only
- No backend
- No Firebase dependency
- No Firestore dependency
- No auth
- No forms
- No payment
- No Pages Functions
- No large media

## Files

- `index.html`
- `main.js`
- `status-content.json`
- `styles.css`
- `public/_headers`
- `public/_redirects`
- `public/robots.txt`
- `docs/ARCHITECTURE.md`
- `docs/PAGE_CONTEXT_MATRIX.md`
- `docs/RBAC_CONTEXT_POLICY.md`

## Acceptance criteria

1. The site renders a truthful maintenance page.
2. Route contexts work for `/maintenance`, `/deploy`, `/outage`, `/security`, and `/coming-soon`.
3. The repository can be deployed from Git to Cloudflare Pages.
4. `*.pages.dev` is verified before any custom domain attachment.
5. `info.skygorilla.hr` is only attached after preview verification.
6. The build command may remain blank if no build step is needed.
