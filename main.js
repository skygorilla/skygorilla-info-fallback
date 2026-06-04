/**
 * main.js — Skygorilla info.skygorilla.hr
 * Handles: locale detection (/hr /en), context detection (9 routes),
 *          i18n content injection, all 13 UI components.
 *
 * Architecture:
 *   - Locale data map (LOCALES) — add M2 locales here only
 *   - Context data loaded from status-content.json (embedded below as CONTEXTS)
 *   - URL path detection: /hr/{context} | /en/{context} | bare /{context} | /
 *   - No live API calls. No monitoring. No forms. Static only.
 *
 * Public copy rules observed:
 *   - Does NOT claim: guaranteed uptime, real-time monitoring, auto-recovery,
 *     certified security, incident resolution, world-class anything
 *   - MAY state: page is independent from main application stack
 */

'use strict';

// ─── M1 Locale Registry ───────────────────────────────────────────────────────
// M2: add locales from canonical workspace locale registry only.
// Do NOT add de, fr, it, sl or any other locale in M1.

const LOCALES = {
  hr: { name: 'Hrvatski', dir: 'ltr', label: 'HR' },
  en: { name: 'English',  dir: 'ltr', label: 'EN' }
};

const DEFAULT_LOCALE       = 'hr';
const SUPPORTED_LOCALES    = Object.keys(LOCALES); // ['hr', 'en']

// ─── SVG Icon Library ─────────────────────────────────────────────────────────

const ICONS = {
  check: (color) => `<svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="17" cy="17" r="13" stroke="${color}" stroke-width="1.8" stroke-opacity="0.4"/>
    <path d="M10 17l5 5 9-10" stroke="${color}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,

  wrench: (color) => `<svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M26 7a6 6 0 0 0-8 8L7 26.5a2 2 0 1 0 2.8 2.8L21 17A6 6 0 0 0 26 7Z" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="24.5" cy="9.5" r="1.8" fill="${color}" opacity="0.5"/>
  </svg>`,

  rocket: (color) => `<svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M17 4C17 4 9 10 9 19l4 4 4-2 4 2 4-4C25 10 17 4 17 4Z" stroke="${color}" stroke-width="1.8" stroke-linejoin="round"/>
    <circle cx="17" cy="16" r="3" stroke="${color}" stroke-width="1.6"/>
    <path d="M9 20c-2 1-3 4-3 5l3-2M25 20c2 1 3 4 3 5l-3-2" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.55"/>
  </svg>`,

  warning: (color) => `<svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M17 5L3 29h28L17 5Z" stroke="${color}" stroke-width="1.8" stroke-linejoin="round"/>
    <line x1="17" y1="14" x2="17" y2="21" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
    <circle cx="17" cy="25" r="1.3" fill="${color}"/>
  </svg>`,

  lock: (color) => `<svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="8" y="16" width="18" height="13" rx="3.5" stroke="${color}" stroke-width="1.8"/>
    <path d="M12 16v-4a5 5 0 0 1 10 0v4" stroke="${color}" stroke-width="1.8" stroke-linecap="round"/>
    <circle cx="17" cy="22.5" r="2.2" fill="${color}" opacity="0.65"/>
  </svg>`,

  sparkle: (color) => `<svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M17 4l2.4 9L29 17l-9.6 2.4L17 29l-2.4-9.6L5 17l9.6-2.4Z" stroke="${color}" stroke-width="1.8" stroke-linejoin="round"/>
    <circle cx="27" cy="7" r="1.8" fill="${color}" opacity="0.5"/>
    <circle cx="7" cy="27" r="1.3" fill="${color}" opacity="0.4"/>
  </svg>`,

  mail: (color) => `<svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="4" y="9" width="26" height="18" rx="3" stroke="${color}" stroke-width="1.8"/>
    <path d="M4 13l13 8 13-8" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,

  list: (color) => `<svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M6 10h22M6 17h22M6 24h14" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
  </svg>`,

  notFound: (color) => `<svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="17" cy="17" r="13" stroke="${color}" stroke-width="1.8" stroke-opacity="0.4"/>
    <path d="M12 12l10 10M22 12l-10 10" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
  </svg>`
};

// ─── Context Icon Map ─────────────────────────────────────────────────────────

const CONTEXT_ICONS = {
  maintenance: 'wrench',
  deploy:      'rocket',
  outage:      'warning',
  security:    'lock',
  comingSoon:  'sparkle',
  contact:     'mail',
  status:      'list',
  '404':       'notFound',
  default:     'check'
};

// ─── Context status badge variant → bf-status-banner class ───────────────────

const VARIANT_CLASS = {
  operational: 'bf-status-banner--operational',
  maintenance: 'bf-status-banner--maintenance',
  incident:    'bf-status-banner--incident',
  deploy:      'bf-status-banner--deploy',
  security:    'bf-status-banner--security'
};

// ─── Context Data (matches status-content.json exactly) ───────────────────────
// Embedded for reliability — static page must work without fetch().

const CONTEXTS = {
  maintenance: {
    route: '/hr/maintenance', tone: 'planned', statusVariant: 'maintenance',
    accentColor: '#f59e0b', accentRgb: '245,158,11',
    affectedSurfaces: {
      hr: ['skygorilla.hr', 'Nakovan platforma'],
      en: ['skygorilla.hr', 'Nakovan platform']
    },
    progress: 60, animated: false,
    i18n: {
      hr: { statusLabel: 'ODRŽAVANJE U TIJEKU', headline: 'Skygorilla se ažurira.', message: 'Glavna stranica Skygorilla je u pripremi. Kontakt ostaje dostupan ovdje.', progressLabel: 'Napredak' },
      en: { statusLabel: 'MAINTENANCE IN PROGRESS', headline: 'Skygorilla is being updated.', message: 'The main Skygorilla website is being prepared. Core contact remains available here.', progressLabel: 'Progress' }
    }
  },
  deploy: {
    route: '/hr/deploy', tone: 'active', statusVariant: 'deploy',
    accentColor: '#3b82f6', accentRgb: '59,130,246',
    affectedSurfaces: { hr: ['skygorilla.hr'], en: ['skygorilla.hr'] },
    progress: null, animated: true,
    i18n: {
      hr: { statusLabel: 'POSTAVLJANJE', headline: 'Skygorilla površina se postavlja.', message: 'Javna stranica može biti privremeno nedostupna dok se nova verzija provjerava.', progressLabel: 'Postavljanje u tijeku' },
      en: { statusLabel: 'DEPLOYING', headline: 'A Skygorilla surface is being deployed.', message: 'The public site may be temporarily unavailable while the new version is verified.', progressLabel: 'Deployment in progress' }
    }
  },
  outage: {
    route: '/hr/outage', tone: 'incident', statusVariant: 'incident',
    accentColor: '#ef4444', accentRgb: '239,68,68',
    affectedSurfaces: {
      hr: ['skygorilla.hr', 'info.skygorilla.hr (ova stranica je neovisna)'],
      en: ['skygorilla.hr', 'info.skygorilla.hr (this page is independent)']
    },
    progress: null, animated: false,
    i18n: {
      hr: { statusLabel: 'INCIDENT AKTIVAN', headline: 'Skygorilla je privremeno nedostupan.', message: 'Ova stranica je neovisna od glavnog aplikacijskog skupa.' },
      en: { statusLabel: 'INCIDENT ACTIVE', headline: 'Skygorilla is temporarily unavailable.', message: 'This fallback page is independent from the main application stack.' }
    }
  },
  security: {
    route: '/hr/security', tone: 'restricted', statusVariant: 'security',
    accentColor: '#f97316', accentRgb: '249,115,22',
    affectedSurfaces: { hr: ['skygorilla.hr'], en: ['skygorilla.hr'] },
    progress: null, animated: false,
    i18n: {
      hr: { statusLabel: 'PRISTUP PAUZIRAN', headline: 'Pristup glavnoj površini je pauziran.', message: 'Javna površina može biti privremeno onemogućena dok se konfiguracija pregledava.' },
      en: { statusLabel: 'ACCESS PAUSED', headline: 'Access to the main surface is paused.', message: 'A public surface may be temporarily disabled while configuration is reviewed.' }
    }
  },
  comingSoon: {
    route: '/hr/coming-soon', tone: 'planned', statusVariant: 'operational',
    accentColor: '#00d4aa', accentRgb: '0,212,170',
    affectedSurfaces: { hr: [], en: [] },
    progress: null, animated: false,
    i18n: {
      hr: { statusLabel: 'USKORO', headline: 'Nova Skygorilla stranica se priprema.', message: 'Dok cijela stranica nije spremna, ova stranica nosi kontakt i statusne informacije.' },
      en: { statusLabel: 'LAUNCHING SOON', headline: 'A new Skygorilla site is being prepared.', message: 'Until the full site is ready, this page carries contact and status information.' }
    }
  },
  contact: {
    route: '/hr/contact', tone: 'neutral', statusVariant: 'operational',
    accentColor: '#7c3aed', accentRgb: '124,58,237',
    affectedSurfaces: { hr: [], en: [] },
    progress: null, animated: false,
    i18n: {
      hr: { statusLabel: 'KONTAKT', headline: 'Kontaktirajte Skygorilla.', message: 'Koristite adresu e-pošte ispod. Bez obrasca. Bez potrebe za računom.' },
      en: { statusLabel: 'CONTACT', headline: 'Contact Skygorilla.', message: 'Use the email address below. No form. No account required.' }
    }
  },
  status: {
    route: '/hr/status', tone: 'neutral', statusVariant: 'operational',
    accentColor: '#00d4aa', accentRgb: '0,212,170',
    affectedSurfaces: { hr: [], en: [] },
    progress: null, animated: false,
    i18n: {
      hr: { statusLabel: 'PREGLED STATUSA', headline: 'Pregled statusa Skygorilla.', message: 'Ova stranica povezuje sve aktivne kontekste. Ovdje nema podataka o praćenju uživo.' },
      en: { statusLabel: 'STATUS OVERVIEW', headline: 'Skygorilla status overview.', message: 'This page links to each active context. No live monitoring data is shown here.' }
    }
  },
  '404': {
    route: '/404', tone: 'neutral', statusVariant: 'maintenance',
    accentColor: '#7c3aed', accentRgb: '124,58,237',
    affectedSurfaces: { hr: [], en: [] },
    progress: null, animated: false,
    i18n: {
      hr: { statusLabel: 'NIJE PRONAĐENO', headline: 'Stranica nije pronađena.', message: 'Ova putanja ne postoji na rezervnoj površini. Vratite se na glavnu stranicu.' },
      en: { statusLabel: 'NOT FOUND', headline: 'Page not found.', message: 'This route does not exist on the fallback surface. Return to the main fallback page.' }
    }
  },
  default: {
    route: '/', tone: 'planned', statusVariant: 'operational',
    accentColor: '#00d4aa', accentRgb: '0,212,170',
    affectedSurfaces: { hr: [], en: [] },
    progress: null, animated: false,
    i18n: {
      hr: { statusLabel: 'INFO', headline: 'Skygorilla info.', message: 'Ova neovisna stranica nosi kontakt i statusne informacije za Skygorilla umbrella.' },
      en: { statusLabel: 'INFO', headline: 'Skygorilla info.', message: 'This independent page carries contact and status information for the Skygorilla umbrella.' }
    }
  }
};

// Context switcher display labels
const CONTEXT_LABELS = {
  maintenance: { hr: 'Održavanje', en: 'Maintenance' },
  deploy:      { hr: 'Postavljanje', en: 'Deploy' },
  outage:      { hr: 'Nedostupnost', en: 'Outage' },
  security:    { hr: 'Sigurnost', en: 'Security' },
  comingSoon:  { hr: 'Uskoro', en: 'Coming Soon' },
  contact:     { hr: 'Kontakt', en: 'Contact' },
  status:      { hr: 'Status', en: 'Status' }
};

// ─── URL Path Detection ───────────────────────────────────────────────────────

/**
 * Detects locale (hr|en) and context key from the URL pathname.
 * Supports:
 *   /hr/maintenance   → { locale: 'hr', contextKey: 'maintenance' }
 *   /en/coming-soon   → { locale: 'en', contextKey: 'comingSoon' }
 *   /outage           → { locale: 'hr', contextKey: 'outage' }  (bare — default locale)
 *   /                 → { locale: 'hr', contextKey: 'default' }
 *   ?context=deploy   → query param fallback (lowest priority)
 */
function detectLocaleAndContext() {
  const pathname = window.location.pathname;
  const segments = pathname.replace(/^\//, '').split('/').filter(Boolean);

  let locale     = DEFAULT_LOCALE;
  let contextKey = 'default';

  if (SUPPORTED_LOCALES.includes(segments[0])) {
    locale     = segments[0];
    contextKey = segments[1] || 'default';
  } else if (segments[0]) {
    contextKey = segments[0]; // bare route — use default locale
  }

  // Normalise coming-soon → comingSoon
  if (contextKey === 'coming-soon') contextKey = 'comingSoon';

  // Query param fallback (lowest priority)
  if (contextKey === 'default') {
    const param = new URLSearchParams(window.location.search).get('context') || '';
    if (param) {
      const normParam = param === 'coming-soon' ? 'comingSoon' : param;
      if (CONTEXTS[normParam]) contextKey = normParam;
    }
  }

  // Validate — fall back to default if unknown
  if (!CONTEXTS[contextKey]) contextKey = 'default';

  return { locale, contextKey };
}

// ─── Language switcher URL builder ───────────────────────────────────────────

/**
 * Given a target locale and the current contextKey, builds the correct URL.
 * / stays as / | /hr/... ↔ /en/...
 */
function buildLocaleUrl(targetLocale, contextKey) {
  if (contextKey === 'default') {
    return targetLocale === DEFAULT_LOCALE ? '/hr' : `/${targetLocale}`;
  }
  const routeSlug = contextKey === 'comingSoon' ? 'coming-soon' : contextKey;
  return `/${targetLocale}/${routeSlug}`;
}

// ─── Apply to DOM ─────────────────────────────────────────────────────────────

function applyContext(locale, contextKey) {
  const ctx  = CONTEXTS[contextKey] || CONTEXTS.default;
  const t    = ctx.i18n[locale] || ctx.i18n[DEFAULT_LOCALE];

  // ── CSS custom property accent ──────────────────────────────────────────
  document.documentElement.style.setProperty('--sg-accent-color', ctx.accentColor);
  document.documentElement.style.setProperty('--sg-accent-rgb',   ctx.accentRgb);

  // ── html lang / dir ─────────────────────────────────────────────────────
  document.documentElement.lang = locale;
  document.documentElement.dir  = LOCALES[locale]?.dir || 'ltr';

  // ── body tone class ─────────────────────────────────────────────────────
  document.body.classList.remove(
    'sg-tone--planned', 'sg-tone--active', 'sg-tone--incident',
    'sg-tone--restricted', 'sg-tone--neutral'
  );
  document.body.classList.add(`sg-tone--${ctx.tone}`);

  // ── Page title ──────────────────────────────────────────────────────────
  document.title = t.headline ? `${t.headline} — Skygorilla` : 'Skygorilla Info';
  const pageTitleEl = document.getElementById('page-title');
  if (pageTitleEl) pageTitleEl.textContent = document.title;

  // ── StatusBadge ─────────────────────────────────────────────────────────
  const badge      = document.getElementById('sg-status-badge');
  const badgeLabel = document.getElementById('sg-badge-label');
  const badgeDot   = document.getElementById('sg-badge-dot');

  if (badge) {
    // Remove all variant classes
    Object.values(VARIANT_CLASS).forEach(c => badge.classList.remove(c));
    badge.classList.add(VARIANT_CLASS[ctx.statusVariant] || VARIANT_CLASS.operational);
  }
  if (badgeLabel) badgeLabel.textContent = t.statusLabel || 'INFO';
  if (badgeDot) {
    badgeDot.style.color = ctx.accentColor;
  }

  // Last updated
  const updatedEl = document.getElementById('sg-updated');
  if (updatedEl) {
    const now = new Date();
    updatedEl.dateTime = now.toISOString();
    updatedEl.textContent = locale === 'hr' ? 'Ažurirano upravo sada' : 'Updated just now';
  }

  // ── Context icon ─────────────────────────────────────────────────────────
  const iconEl   = document.getElementById('sg-hero-icon');
  const iconKey  = CONTEXT_ICONS[contextKey] || 'check';
  if (iconEl) {
    iconEl.innerHTML = ICONS[iconKey](ctx.accentColor);
    iconEl.style.background   = `rgba(${ctx.accentRgb}, 0.1)`;
    iconEl.style.borderColor  = `rgba(${ctx.accentRgb}, 0.22)`;
    iconEl.style.boxShadow    = `0 0 28px rgba(${ctx.accentRgb}, 0.12)`;
  }

  // ── Headline + message ───────────────────────────────────────────────────
  const headlineEl = document.getElementById('sg-headline');
  const messageEl  = document.getElementById('sg-message');
  if (headlineEl) headlineEl.textContent = t.headline;
  if (messageEl)  messageEl.textContent  = t.message;

  // ── Progress bar ─────────────────────────────────────────────────────────
  const progressWrap  = document.getElementById('sg-progress-wrap');
  const progressFill  = document.getElementById('sg-progress-fill');
  const progressValue = document.getElementById('sg-progress-value');
  const progressLabel = document.getElementById('sg-progress-label');
  const progressTrack = document.getElementById('sg-progress-track');

  if (progressWrap) {
    const hasProgress = ctx.progress !== null || ctx.animated;
    progressWrap.hidden = !hasProgress;
    progressWrap.setAttribute('aria-hidden', String(!hasProgress));

    if (hasProgress) {
      if (ctx.animated) {
        // Indeterminate animated progress for deploy
        progressFill.classList.add('sg-progress-fill--animated');
        if (progressValue) progressValue.textContent = '—';
        if (progressLabel) progressLabel.textContent  = t.progressLabel || (locale === 'hr' ? 'U tijeku' : 'In progress');
        setTimeout(() => { if (progressFill) progressFill.style.width = '68%'; animateIndeterminate(progressFill); }, 500);
      } else if (ctx.progress !== null) {
        // Fixed progress
        progressFill.classList.remove('sg-progress-fill--animated');
        if (progressLabel) progressLabel.textContent  = t.progressLabel || (locale === 'hr' ? 'Napredak' : 'Progress');
        if (progressValue) progressValue.textContent  = `${ctx.progress}%`;
        if (progressTrack) progressTrack.setAttribute('aria-valuenow', String(ctx.progress));
        setTimeout(() => { if (progressFill) progressFill.style.width = `${ctx.progress}%`; }, 400);
      }
    }
  }

  // ── Context card title (hidden from screen, for a11y) ───────────────────
  const cardTitleEl = document.getElementById('sg-context-card-title');
  if (cardTitleEl) {
    cardTitleEl.textContent = locale === 'hr' ? 'Detalji konteksta' : 'Context details';
  }

  // ── AffectedSurfaceList ──────────────────────────────────────────────────
  const affectedWrap = document.getElementById('sg-affected-wrap');
  const affectedList = document.getElementById('sg-affected-list');
  const affectedHead = document.getElementById('sg-affected-heading');
  const surfaces     = ctx.affectedSurfaces?.[locale] || ctx.affectedSurfaces?.[DEFAULT_LOCALE] || [];

  if (affectedWrap && affectedList) {
    if (surfaces.length > 0) {
      affectedWrap.hidden = false;
      if (affectedHead) affectedHead.textContent = locale === 'hr' ? 'Pogođene površine:' : 'Affected surfaces:';
      affectedList.innerHTML = surfaces.map(s => `<li>${escapeHtml(s)}</li>`).join('');
    } else {
      affectedWrap.hidden = true;
    }
  }

  // ── ContactPanel ─────────────────────────────────────────────────────────
  const contactWrap = document.getElementById('sg-contact-wrap');
  if (contactWrap) {
    contactWrap.hidden = (contextKey !== 'contact');
    if (contextKey === 'contact') {
      const contactNote = document.getElementById('sg-contact-note');
      if (contactNote) {
        contactNote.textContent = locale === 'hr'
          ? 'Bez obrasca. Bez prijave. / No form. No login.'
          : 'No form. No login required.';
      }
    }
  }

  // ── Status page links (on /status) ───────────────────────────────────────
  const statusLinksWrap = document.getElementById('sg-status-links-wrap');
  if (statusLinksWrap) {
    if (contextKey === 'status') {
      statusLinksWrap.hidden = false;
      const linkContexts = ['maintenance', 'deploy', 'outage', 'security', 'comingSoon', 'contact'];
      statusLinksWrap.innerHTML = `
        <p class="sg-affected-heading">${locale === 'hr' ? 'Kontekst stranice:' : 'Page contexts:'}</p>
        <div class="sg-status-links-wrap" style="display:flex;flex-direction:column;gap:8px;">
          ${linkContexts.map(k => {
            const c = CONTEXTS[k];
            const label = CONTEXT_LABELS[k]?.[locale] || k;
            const slug  = k === 'comingSoon' ? 'coming-soon' : k;
            const href  = `/${locale}/${slug}`;
            return `<a href="${href}" class="sg-status-link">
              <span>${escapeHtml(label)}</span>
              <span class="sg-status-link__tone">${c?.tone || ''}</span>
            </a>`;
          }).join('')}
        </div>`;
    } else {
      statusLinksWrap.hidden = true;
    }
  }

  // ── 404 back button ───────────────────────────────────────────────────────
  const notFoundWrap = document.getElementById('sg-404-wrap');
  if (notFoundWrap) {
    notFoundWrap.hidden = (contextKey !== '404');
    const backLabel = document.getElementById('sg-back-label');
    if (backLabel && contextKey === '404') {
      backLabel.textContent = locale === 'hr' ? 'Natrag na početak' : 'Return to home';
    }
  }

  // ── Diagram bilingual text ─────────────────────────────────────────────
  showLocaleEls(locale);

  // ── Metric cards i18n ──────────────────────────────────────────────────
  const metricLabels = {
    hr: { independence: 'Ova stranica', stack: 'Stos', vendor: 'Vendor CSS', export: 'Datum izvoza' },
    en: { independence: 'This page',   stack: 'Stack',  vendor: 'Vendor CSS', export: 'Export date'  }
  };
  const ml = metricLabels[locale] || metricLabels.hr;
  setText('sg-metric-independence-label', ml.independence);
  setText('sg-metric-stack-label',        ml.stack);
  setText('sg-metric-vendor-label',       ml.vendor);
  setText('sg-metric-export-label',       ml.export);

  // Metric values i18n
  const metricVals = {
    hr: 'Neovisna',
    en: 'Independent'
  };
  const metricIndep = document.querySelector('#sg-metric-independence .bf-metric-card__value');
  if (metricIndep) metricIndep.textContent = metricVals[locale] || 'Independent';

  const metricStack = document.querySelector('#sg-metric-stack .bf-metric-card__value');
  if (metricStack) metricStack.textContent = locale === 'hr' ? 'Statični HTML' : 'Static HTML';

  // ── Version label ────────────────────────────────────────────────────────
  const versionLabelEl = document.getElementById('sg-version-label');
  if (versionLabelEl) {
    versionLabelEl.textContent = locale === 'hr' ? 'Verzija stranice:' : 'Page version:';
  }

  // ── ContextSwitcher ──────────────────────────────────────────────────────
  renderContextSwitcher(locale, contextKey);

  // ── Context switcher links heading ───────────────────────────────────────
  const linksHeadHr = document.querySelector('.sg-links-heading-hr');
  const linksHeadEn = document.querySelector('.sg-links-heading-en');
  if (locale === 'en') {
    if (linksHeadHr) linksHeadHr.hidden = true;
    if (linksHeadEn) linksHeadEn.hidden = false;
  } else {
    if (linksHeadHr) linksHeadHr.hidden = false;
    if (linksHeadEn) linksHeadEn.hidden = true;
  }

  // ── Language switcher active state + hrefs ───────────────────────────────
  updateLangSwitcher(locale, contextKey);

  // ── Footer contact href ──────────────────────────────────────────────────
  const footerContact = document.getElementById('sg-footer-contact');
  if (footerContact) {
    footerContact.href = `/${locale}/contact`;
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/**
 * Shows/hides elements with *-hr / *-en class based on current locale.
 * Elements with class sg-diagram-title-hr etc.
 */
function showLocaleEls(locale) {
  document.querySelectorAll('[class*="-hr"]').forEach(el => {
    if (Array.from(el.classList).some(c => c.endsWith('-hr'))) {
      el.hidden = (locale !== 'hr');
    }
  });
  document.querySelectorAll('[class*="-en"]').forEach(el => {
    if (Array.from(el.classList).some(c => c.endsWith('-en'))) {
      el.hidden = (locale !== 'en');
    }
  });
}

// ─── ContextSwitcher renderer ─────────────────────────────────────────────────

function renderContextSwitcher(locale, activeKey) {
  const switcher = document.getElementById('sg-context-switcher');
  if (!switcher) return;

  const entries = ['maintenance', 'deploy', 'outage', 'security', 'comingSoon', 'contact', 'status'];

  switcher.innerHTML = entries.map(key => {
    const label   = CONTEXT_LABELS[key]?.[locale] || key;
    const slug    = key === 'comingSoon' ? 'coming-soon' : key;
    const href    = `/${locale}/${slug}`;
    const isActive = (key === activeKey);
    const cls   = `sg-ctx-link${isActive ? ' sg-ctx-link--active' : ''}`;
    return `<a href="${href}" class="${cls}" ${isActive ? 'aria-current="page"' : ''}>
      <span class="sg-ctx-link__dot" aria-hidden="true"></span>
      ${escapeHtml(label)}
    </a>`;
  }).join('');
}

// ─── Language switcher ────────────────────────────────────────────────────────

function updateLangSwitcher(locale, contextKey) {
  SUPPORTED_LOCALES.forEach(loc => {
    const btn = document.getElementById(`sg-lang-${loc}`);
    if (!btn) return;
    const isActive = (loc === locale);
    btn.setAttribute('aria-current', isActive ? 'true' : 'false');
    btn.classList.toggle('active', isActive);
    btn.href = buildLocaleUrl(loc, contextKey);
  });
}

// ─── Indeterminate Progress ───────────────────────────────────────────────────

function animateIndeterminate(fillEl) {
  let v = 68, fwd = true;
  setInterval(() => {
    fwd ? v += 0.25 : v -= 0.25;
    if (v >= 86) fwd = false;
    if (v <= 58) fwd = true;
    fillEl.style.width = `${v}%`;
  }, 60);
}

// ─── Live UTC Clock ───────────────────────────────────────────────────────────

function startClock() {
  const clockEl = document.getElementById('sg-clock-time');
  if (!clockEl) return;
  function tick() {
    const n = new Date();
    clockEl.textContent = [n.getUTCHours(), n.getUTCMinutes(), n.getUTCSeconds()]
      .map(v => String(v).padStart(2, '0')).join(':');
  }
  tick();
  setInterval(tick, 1000);
}

// ─── Boot ─────────────────────────────────────────────────────────────────────

(function init() {
  const { locale, contextKey } = detectLocaleAndContext();
  applyContext(locale, contextKey);
  startClock();
})();
