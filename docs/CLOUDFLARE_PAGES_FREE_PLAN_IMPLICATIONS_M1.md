# Cloudflare Pages Free Plan Implications M1

## Decision

Cloudflare Pages Free is sufficient for `info.skygorilla.hr` M1 as long as the surface remains
static, isolated, and free of Functions or large media.

## Relevant limits

Cloudflare Pages Free currently provides:

- 500 builds per month
- 1 concurrent build
- 20 minute build timeout
- 100 custom domains per project
- 20,000 files per site
- 25 MiB max single asset size
- unlimited active preview deployments
- `_headers` support up to 100 rules
- `_redirects` support up to 2,000 static redirects and 100 dynamic redirects

## Implications

- No paid plan is required for M1.
- No Functions should be introduced.
- No database, auth, or backend stack should be attached.
- No build system is needed; the Pages build command can remain blank.
- The repo should stay tiny to avoid build spam or asset bloat.
- The custom domain must be attached through the Pages project Custom domains flow.

## Risk controls

- Keep the site static.
- Avoid heavy media.
- Avoid Pages Functions entirely.
- Avoid redirect complexity until the fallback is verified.
- Keep `skygorilla.hr` separate until the fallback is independently validated.

