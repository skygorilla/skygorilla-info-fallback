# Locale Exception — info.skygorilla.hr

**Rule class:** DOCUMENTED_APPROVED_EXCEPTION
**Exception from:** Skygorilla workspace locale rule (/ cannot render content)
**Approved in:** BLADE_FALLBACK_SNAPSHOT_VERSIONING_M1 governance

## General locale rule

Normal Skygorilla/Nakovan/GO content routes must be locale-prefixed.
`/` must not render final content — it may only redirect or show language choice.

## Exception

`info.skygorilla.hr` is a static resilience/error-handler surface, NOT a normal content site.

It is allowed to render `/` as a minimal neutral fallback status page because:
1. During outage, `/` must be instantly readable without redirect chain failure
2. Routing infrastructure may itself be broken during the scenarios this page handles
3. The page carries no locale-sensitive business content — only operational status messaging

## Approved route structure

```
/                  → neutral fallback (exception: minimal bilingual Croatian-first)
/hr                → Croatian canonical
/en                → English canonical
/hr/{context}      → Croatian context pages
/en/{context}      → English context pages
```

## Constraint

This exception applies ONLY to info.skygorilla.hr.
It does NOT apply to skygorilla.hr, GO, Nakovan, tenant sites, or any normal content surface.
