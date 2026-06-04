# Blade Fallback Versioning

**Packet:** `BLADE_FALLBACK_SNAPSHOT_VERSIONING_M1`
**Status:** IMPLEMENTED_AS_STATIC_SNAPSHOT_M1
**Date:** 2026-06-04
**Authority:** Canonical governance for `info.skygorilla.hr` CSS provenance

---

## Current state

```txt
Blade fallback versioning  = IMPLEMENTED_AS_STATIC_SNAPSHOT_M1
Runtime Blade dependency   = FORBIDDEN
Static Blade snapshot      = vendor/blade-fallback/
CSS deletion               = FORBIDDEN without INFO_SKYGORILLA_CSS_SNAPSHOT_REPLACEMENT_M1
```

## What this means

`info.skygorilla.hr` carries a **pinned, committed, static snapshot** of Blade-aligned CSS.

It does not import Blade at runtime. It does not require the monorepo to be healthy to render.

The vendored snapshot is the approved source of truth for fallback styling until
`BLADE_FALLBACK_EXPORTER_M1` runs and replaces the stubs with real Blade-exported CSS.

---

## Vendor snapshot location

```txt
skygorilla-info-fallback/
  vendor/
    blade-fallback/
      manifest.json      ← provenance record (kit, version, sourceCommit, removalRequiresPacket)
      tokens.css         ← APPROVED_VENDOR_STATIC_CSS (M1: stubs)
      components.css     ← APPROVED_VENDOR_STATIC_CSS (M1: stubs)
      fallback.css       ← APPROVED_VENDOR_STATIC_CSS (M1: stubs)
```

## Manifest record (0.1.0)

| Field | Value |
|---|---|
| `kit` | `blade-fallback` |
| `version` | `0.1.0` |
| `source` | `@skygorilla/blade` |
| `sourcePath` | `skygorilla-live/packages/blade` |
| `mode` | `static-export` |
| `runtimeDependency` | `false` |
| `approvedFor` | `info.skygorilla.hr` |
| `exportDate` | `2026-06-04` |
| `sourceCommit` | `UNKNOWN_UNTIL_GIT` |
| `removalRequiresPacket` | `INFO_SKYGORILLA_CSS_SNAPSHOT_REPLACEMENT_M1` |

---

## Lifecycle

```txt
Blade matures in skygorilla-live/packages/blade
→ run packages/blade-fallback-exporter  (BLADE_FALLBACK_EXPORTER_M1)
→ generate static CSS kit into dist/fallback-kit/
→ compare regression against current vendor/blade-fallback/
→ update manifest: version, exportDate, sourceCommit
→ commit snapshot into skygorilla-info-fallback/vendor/blade-fallback/
→ push to main branch of skygorilla-info-fallback repo
→ Cloudflare Pages auto-deploys
→ verify https://info.skygorilla.hr loads correctly
→ record in ACTIVE_WORKSPACE_STATE.md
```

## Rollback rule

```txt
If a new snapshot breaks the fallback:
1. Revert the vendor/blade-fallback/ files to previous commit.
2. Do NOT debug live Cloudflare fallback by changing Blade itself.
3. Do NOT remove the fallback CSS entirely.
4. Open packet: INFO_SKYGORILLA_CSS_SNAPSHOT_REPLACEMENT_M1
```

---

## Hard resilience rule

```txt
This fallback page MUST render correctly even when ALL of the following are broken:

  ✗ Blade (@skygorilla/blade)
  ✗ Nakovan platform
  ✗ Storybook
  ✗ npm workspaces / monorepo install
  ✗ Firebase / App Hosting
  ✗ Firestore
  ✗ Supabase

Therefore: the fallback owns a frozen, reviewed, vendored copy of CSS.
It does not reach into any of these systems at runtime.
```

---

## Agent instruction (mandatory read)

> **Do NOT remove or delete `vendor/blade-fallback/` or its CSS files.**
> This CSS is the approved Blade fallback snapshot. It is intentionally committed.
> It is not drift. It is not generated output contamination.
> Removal requires an explicit approved packet: `INFO_SKYGORILLA_CSS_SNAPSHOT_REPLACEMENT_M1`.
>
> A later agent must NOT:
> - Remove this CSS as drift and "relink Blade later"
> - Replace local CSS with live Blade imports
> - Import `@skygorilla/blade` at runtime from this repo
> - Require monorepo build for fallback to render
> - Classify vendored fallback CSS as generated-output contamination

---

## Next packet (upgrade path)

```txt
BLADE_FALLBACK_EXPORTER_M1
  Mission: Create packages/blade-fallback-exporter build-time utility.
           Reads real Blade tokens/components.
           Exports static CSS kit into dist/fallback-kit/.
           Replaces M1 stubs in vendor/blade-fallback/.
           Updates manifest with real sourceCommit and version.
  Blocking condition: Blade must reach sufficient token/component maturity first.
```

---

*Authority: BLADE_FALLBACK_SNAPSHOT_VERSIONING_M1 | Date: 2026-06-04 | Canonical*
