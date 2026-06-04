# Locale Policy — info.skygorilla.hr

**Status:** CANONICAL — read before modifying routes or adding locales
**Packet:** BLADE_FALLBACK_SNAPSHOT_VERSIONING_M1

## General workspace rule (do not break)
Normal Skygorilla/Nakovan/GO content routes must be locale-prefixed.
`/` must not render final content on normal surfaces.

## Documented exception
`info.skygorilla.hr` may render `/` as a neutral emergency fallback.
Reason: routing infrastructure may itself be broken during outage scenarios.
This exception does NOT apply to any other surface.

## M1 locale scope
- Primary: /hr (Croatian)
- Global fallback: /en (English)
- No other locales until M2 and surface stability confirmed.

## M2 expansion rule
- Add locales from the canonical workspace locale registry only.
- Do not hardcode random translations.
- Do not publish untranslated legal/status copy.
- Missing locale falls back to /en then /hr.
- Each locale must be added via an approved packet (INFO_SKYGORILLA_LOCALE_EXPANSION_M2).

## Architecture rule
Use a locale data map in status-content.json (i18n key per context).
Do not duplicate pages per locale.
Adding a new locale = adding to LOCALES constant + adding i18n keys in status-content.json.

## Forbidden
- Do not add locales not in the canonical workspace locale registry.
- Do not hardcode locale-specific legal content without legal review.
- Do not claim translation coverage for locales not explicitly added.
