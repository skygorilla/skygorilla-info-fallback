# Info Skygorilla Application When What How M1

## When

Now.

The live host has been observed in a broken split state:

- the legacy `skygorilla.hr` surface is still reachable
- the backend path has been reported as `Backend Not Found`

That means `info.skygorilla.hr` must be treated as a resilience application, not as a loose
note or a future idea.

## What

`skygorilla-info-fallback`

This is a pure static Cloudflare Pages app, not a normal Skygorilla/Nakovan app.

It exists to provide:

- maintenance
- downtime recovery
- deployment recovery
- essential contact information
- a truthful fallback surface

## How

1. Create the GitHub repo: `skygorilla-info-fallback`
2. Copy the static package files into the repo
3. Push `main`
4. Connect Cloudflare Pages from Git
5. Use no framework preset
6. Leave the build command blank
7. Keep the output directory at `/`
8. Verify the generated `*.pages.dev` URL
9. Add the custom domain `info.skygorilla.hr`
10. Verify HTTPS
11. Only after that, consider routing or redirecting `skygorilla.hr`

## Junior does

- create the GitHub repo
- copy the static package files
- push `main`
- connect Cloudflare Pages
- verify preview
- attach the custom domain
- confirm HTTPS

## Junior does not

- touch `skygorilla.hr` root
- change Firebase
- change DNS apex
- set redirects
- modify Supabase
- add Functions
- add analytics
- invent incident copy

## Cloudflare Pages fit

Cloudflare Pages Free is sufficient for this surface as long as it stays static and isolated.
The surface must remain tiny, use no build step if unnecessary, and avoid Functions entirely.

## Safety boundary

The fallback is not the main website.
It is not a product app.
It is not an auth surface.
It is not a database-backed system.

