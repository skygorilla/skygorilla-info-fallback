# Skygorilla Info Fallback Architecture Packet M1

## Surface Card

| Field | Value |
|---|---|
| Surface | `info.skygorilla.hr` |
| Repo | `skygorilla-info-fallback` |
| Class | public static fallback / resilience app |
| Host | Cloudflare Pages |
| Plan | Free |
| Source of truth | GitHub repository |
| Build model | no framework, blank build command |
| Deploy model | preview first, custom domain second |

## What It Is

`skygorilla-info-fallback` is a tiny, static Cloudflare Pages app that remains independent from
the main Skygorilla application stack.

It exists to provide:

- maintenance
- downtime recovery
- deployment recovery
- a truthful contact surface

## What It Is Not

- not Firebase
- not Firestore
- not Supabase
- not a product app
- not an auth surface
- not a database-backed system
- not a function-enabled app
- not the main `skygorilla.hr` surface

## Dependency Boundaries

| Dependency | Class | Owner | Status | What breaks if missing | Recovery path |
|---|---|---|---|---|---|
| GitHub repo | required | owner | pending intake | no governed source of truth | create repo and push `main` |
| Cloudflare Pages project | required | deploy agent | pending setup | no preview or custom domain hosting | connect repo to Pages |
| `*.pages.dev` preview | required | deploy agent | pending verification | no safe validation step | verify preview before domain attachment |
| Custom domain `info.skygorilla.hr` | required | owner + deploy agent | pending attach | no public fallback domain | attach in Pages custom domains flow |

## Deploy Flow

`local files -> GitHub repo -> Cloudflare Pages preview -> verified pages.dev -> custom domain -> HTTPS verification`

## Rollback Path

1. Detach custom domain from Pages.
2. Keep the `*.pages.dev` preview available.
3. Re-point `info.skygorilla.hr` only after a verified replacement exists.

## Surface Rules

- Use static HTML, CSS, and small JS only.
- Keep the build command blank unless a build step becomes necessary.
- Do not add Pages Functions.
- Do not add database or auth dependencies.
- Do not add heavy media.
- Do not add redirect complexity before preview verification.

## Forbidden Work

- touching the `skygorilla.hr` apex/root
- changing Firebase/App Hosting for this fallback
- changing DNS apex records
- adding analytics
- adding forms
- adding backend code
- inventing incident copy

## Junior Execution

Junior is allowed to:

1. create the GitHub repo
2. copy the static package files
3. push `main`
4. connect Cloudflare Pages
5. verify preview
6. attach the custom domain
7. verify HTTPS

Junior is not allowed to:

1. change `skygorilla.hr`
2. modify Firebase
3. add functions
4. add analytics
5. add redirects before verification

