# RBAC Context Policy

## Goal

The fallback surface is public, but the content must still be governed so it cannot drift into
claims that belong to the main product.

## Roles

- `OWNER`: approves domain changes, copy claims, and production attachment
- `HYGIENE_AGENT`: updates governance docs, registries, and packets
- `DEPLOY_AGENT`: connects Cloudflare Pages and manages preview/production deploy settings
- `EDITOR`: updates static copy and layout

## Rules

- Only `OWNER` can approve custom-domain attachment.
- Only `DEPLOY_AGENT` can wire Pages deployment settings.
- `EDITOR` may change copy only within the approved static scope.
- No role may introduce Firebase, Firestore, Supabase, auth, forms, or backend logic.

## Copy rules

- No uptime claims unless verified
- No backend claims unless verified
- No branding claims beyond the approved fallback surface
- No redirects beyond the approved `_redirects` file

