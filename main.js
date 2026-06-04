/**
 * main.js — SkyGorilla Info/Status Page
 * Handles: context detection (path + query param), content injection,
 *          live clock, progress bars, and theme application.
 */

'use strict';

// ─── SVG Icon Library ─────────────────────────────────────────────────────────

const ICONS = {
  check: `<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="18" cy="18" r="14" stroke="var(--color-accent)" stroke-width="2" stroke-opacity="0.4"/>
    <path d="M11 18l5 5 9-10" stroke="var(--color-accent)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,

  wrench: `<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M28 8a6 6 0 0 0-8 8.5L8 28.5a2 2 0 0 0 0 2.8 2 2 0 0 0 2.8 0L22.5 19A6 6 0 0 0 28 8Z" stroke="var(--color-accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="26" cy="10" r="2" fill="var(--color-accent)" opacity="0.5"/>
  </svg>`,

  rocket: `<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M18 4C18 4 10 10 10 20l4 4 4-2 4 2 4-4C26 10 18 4 18 4Z" stroke="var(--color-accent)" stroke-width="2" stroke-linejoin="round"/>
    <circle cx="18" cy="17" r="3" stroke="var(--color-accent)" stroke-width="1.8"/>
    <path d="M12 26l-4 4M24 26l4 4M14 28l-2 4M22 28l2 4" stroke="var(--color-accent)" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>
    <path d="M10 20c-2 1-4 4-4 6l4-2M26 20c2 1 4 4 4 6l-4-2" stroke="var(--color-accent)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.6"/>
  </svg>`,

  warning: `<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M18 6L3 30h30L18 6Z" stroke="var(--color-accent)" stroke-width="2" stroke-linejoin="round"/>
    <line x1="18" y1="15" x2="18" y2="22" stroke="var(--color-accent)" stroke-width="2.2" stroke-linecap="round"/>
    <circle cx="18" cy="26" r="1.4" fill="var(--color-accent)"/>
  </svg>`,

  lock: `<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="9" y="17" width="18" height="14" rx="4" stroke="var(--color-accent)" stroke-width="2"/>
    <path d="M13 17v-4a5 5 0 0 1 10 0v4" stroke="var(--color-accent)" stroke-width="2" stroke-linecap="round"/>
    <circle cx="18" cy="24" r="2.5" fill="var(--color-accent)" opacity="0.7"/>
  </svg>`,

  sparkle: `<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M18 4l2.5 9.5L30 18l-9.5 2.5L18 30l-2.5-9.5L6 18l9.5-2.5Z" stroke="var(--color-accent)" stroke-width="2" stroke-linejoin="round"/>
    <circle cx="28" cy="8" r="2" fill="var(--color-accent)" opacity="0.5"/>
    <circle cx="8" cy="28" r="1.5" fill="var(--color-accent)" opacity="0.4"/>
  </svg>`
};

// ─── Context Configuration ────────────────────────────────────────────────────

const CONTEXTS = {
  default: {
    id: 'default',
    title: 'SkyGorilla Info',
    status: 'OPERATIONAL',
    headline: 'SkyGorilla Platform',
    body: 'This is the SkyGorilla information and status page. All systems are operational.',
    accentColor: '#00d4aa',
    accentRgb: '0,212,170',
    icon: 'check',
    progress: null,
    animated: false,
    showEmailInput: false
  },
  maintenance: {
    id: 'maintenance',
    title: 'Scheduled Maintenance — SkyGorilla',
    status: 'MAINTENANCE IN PROGRESS',
    headline: "We're upgrading our systems",
    body: "SkyGorilla is temporarily offline for scheduled maintenance. We'll be back shortly with improvements.",
    accentColor: '#f59e0b',
    accentRgb: '245,158,11',
    icon: 'wrench',
    progress: 60,
    progressLabel: 'Estimated completion',
    animated: false,
    showEmailInput: false
  },
  deploy: {
    id: 'deploy',
    title: 'Deployment in Progress — SkyGorilla',
    status: 'DEPLOYING',
    headline: 'New version launching',
    body: 'A new version of SkyGorilla is being deployed. This usually takes just a few minutes.',
    accentColor: '#3b82f6',
    accentRgb: '59,130,246',
    icon: 'rocket',
    progress: -1, // animated
    progressLabel: 'Deployment in progress',
    animated: true,
    showEmailInput: false
  },
  outage: {
    id: 'outage',
    title: 'Service Disruption — SkyGorilla',
    status: 'INCIDENT ACTIVE',
    headline: "We're experiencing an issue",
    body: 'Our team is actively investigating and working on a fix. We apologize for the inconvenience.',
    accentColor: '#ef4444',
    accentRgb: '239,68,68',
    icon: 'warning',
    progress: null,
    animated: false,
    showEmailInput: false
  },
  security: {
    id: 'security',
    title: 'Security Notice — SkyGorilla',
    status: 'SECURITY REVIEW',
    headline: 'Precautionary security measures in effect',
    body: 'Access is temporarily restricted as a precautionary measure. Our security team is reviewing the situation.',
    accentColor: '#f97316',
    accentRgb: '249,115,22',
    icon: 'lock',
    progress: null,
    animated: false,
    showEmailInput: false
  },
  'coming-soon': {
    id: 'coming-soon',
    title: 'Coming Soon — SkyGorilla',
    status: 'LAUNCHING SOON',
    headline: 'Something amazing is coming',
    body: 'SkyGorilla is preparing to launch. Sign up to be notified when we go live.',
    accentColor: '#00d4aa',
    accentRgb: '0,212,170',
    icon: 'sparkle',
    progress: null,
    animated: false,
    showEmailInput: true
  }
};

// ─── Context Detection ────────────────────────────────────────────────────────

function detectContext() {
  // 1. Path-based detection (priority)
  const path = window.location.pathname.replace(/^\/|\/$/g, '').toLowerCase();
  if (path && CONTEXTS[path]) {
    return path;
  }

  // 2. Query param fallback
  const params = new URLSearchParams(window.location.search);
  const ctxParam = (params.get('context') || '').toLowerCase();
  if (ctxParam && CONTEXTS[ctxParam]) {
    return ctxParam;
  }

  return 'default';
}

// ─── Apply Context ────────────────────────────────────────────────────────────

function applyContext(ctxId) {
  const ctx = CONTEXTS[ctxId] || CONTEXTS.default;

  // CSS custom properties for dynamic theming
  document.documentElement.style.setProperty('--color-accent', ctx.accentColor);
  document.documentElement.style.setProperty('--accent-rgb', ctx.accentRgb);

  // Body class for context-specific CSS overrides
  document.body.classList.remove(
    'ctx-default', 'ctx-maintenance', 'ctx-deploy',
    'ctx-outage', 'ctx-security', 'ctx-coming-soon'
  );
  document.body.classList.add(`ctx-${ctxId}`);

  // Page title
  document.title = ctx.title;
  const pageTitleEl = document.getElementById('page-title');
  if (pageTitleEl) pageTitleEl.textContent = ctx.title;

  // Status badge
  const statusLabel = document.getElementById('status-label');
  const statusDot   = document.getElementById('status-dot');
  if (statusLabel) statusLabel.textContent = ctx.status;
  if (statusDot)   statusDot.style.background = ctx.accentColor;

  // Status badge colors via inline style (for full dynamic color support)
  const badge = document.getElementById('status-badge');
  if (badge) {
    badge.style.background = `rgba(${ctx.accentRgb}, 0.12)`;
    badge.style.borderColor = `rgba(${ctx.accentRgb}, 0.28)`;
  }

  // Context icon
  const iconEl = document.getElementById('context-icon');
  if (iconEl) {
    iconEl.innerHTML = ICONS[ctx.icon] || ICONS.check;
    iconEl.style.background = `rgba(${ctx.accentRgb}, 0.1)`;
    iconEl.style.borderColor = `rgba(${ctx.accentRgb}, 0.2)`;
    iconEl.style.boxShadow   = `0 0 30px rgba(${ctx.accentRgb}, 0.12)`;
  }

  // Headline & body
  const headlineEl = document.getElementById('status-headline');
  const bodyEl     = document.getElementById('status-body');
  if (headlineEl) headlineEl.textContent = ctx.headline;
  if (bodyEl)     bodyEl.textContent     = ctx.body;

  // Last updated timestamp
  const lastUpdatedEl = document.getElementById('last-updated');
  if (lastUpdatedEl) {
    const now = new Date();
    lastUpdatedEl.dateTime = now.toISOString();
    lastUpdatedEl.textContent = 'Updated just now';
  }

  // Progress bar
  const progressWrap  = document.getElementById('progress-wrap');
  const progressFill  = document.getElementById('progress-fill');
  const progressValue = document.getElementById('progress-value');
  const progressLabel = document.getElementById('progress-label');
  const progressTrack = document.getElementById('progress-track');

  if (ctx.progress !== null && progressWrap) {
    progressWrap.hidden = false;

    if (ctx.progress === -1) {
      // Animated indeterminate-style progress
      progressFill.classList.add('animated');
      progressFill.style.background = `linear-gradient(90deg, ${ctx.accentColor}, rgba(124,58,237,0.8))`;
      if (progressValue) progressValue.textContent = '—';
      if (progressLabel) progressLabel.textContent = ctx.progressLabel || 'Progress';
      // Animate to ~75% and pulse
      setTimeout(() => {
        progressFill.style.width = '72%';
        animateIndeterminate(progressFill, ctx.accentColor);
      }, 600);
    } else {
      // Fixed progress
      progressFill.style.background = `linear-gradient(90deg, ${ctx.accentColor}, rgba(124,58,237,0.8))`;
      if (progressLabel) progressLabel.textContent = ctx.progressLabel || 'Progress';
      if (progressValue) progressValue.textContent = `${ctx.progress}%`;
      if (progressTrack) progressTrack.setAttribute('aria-valuenow', ctx.progress);
      setTimeout(() => {
        progressFill.style.width = `${ctx.progress}%`;
      }, 400);
    }
  } else if (progressWrap) {
    progressWrap.hidden = true;
  }

  // Email input
  const emailWrap = document.getElementById('email-wrap');
  if (emailWrap) {
    emailWrap.hidden = !ctx.showEmailInput;
  }

  // Update email button color
  const emailBtn = document.getElementById('notify-submit-btn');
  if (emailBtn) {
    emailBtn.style.background = ctx.accentColor;
  }

  // Pulsing dot color override for non-teal contexts
  if (statusDot) {
    statusDot.style.animationName = ctxId === 'outage' ? 'pulseRed' : 'pulseDot';
    // For non-teal, override pulseDot keyframe is handled by CSS ctx classes
  }
}

// ─── Indeterminate Progress Animation ────────────────────────────────────────

function animateIndeterminate(fillEl, accentColor) {
  let forward = true;
  let value = 72;

  setInterval(() => {
    if (forward) {
      value += 0.3;
      if (value >= 88) forward = false;
    } else {
      value -= 0.3;
      if (value <= 62) forward = true;
    }
    fillEl.style.width = `${value}%`;
  }, 60);
}

// ─── Live UTC Clock ───────────────────────────────────────────────────────────

function startClock() {
  const clockEl = document.getElementById('clock-display');
  if (!clockEl) return;

  function tick() {
    const now = new Date();
    const h = String(now.getUTCHours()).padStart(2, '0');
    const m = String(now.getUTCMinutes()).padStart(2, '0');
    const s = String(now.getUTCSeconds()).padStart(2, '0');
    clockEl.textContent = `${h}:${m}:${s}`;
  }

  tick();
  setInterval(tick, 1000);
}

// ─── Email Form Handler ───────────────────────────────────────────────────────

window.handleNotifySubmit = function(event) {
  event.preventDefault();
  const emailInput = document.getElementById('notify-email');
  const confirmEl  = document.getElementById('email-confirmation');
  const submitBtn  = document.getElementById('notify-submit-btn');

  if (!emailInput || !emailInput.value) return;

  const email = emailInput.value.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    if (confirmEl) {
      confirmEl.style.color = '#ef4444';
      confirmEl.textContent = 'Please enter a valid email address.';
    }
    return;
  }

  // Simulate submission
  if (submitBtn) {
    submitBtn.textContent = 'Sending…';
    submitBtn.disabled = true;
  }

  setTimeout(() => {
    if (confirmEl) {
      confirmEl.style.color = 'var(--color-primary)';
      confirmEl.textContent = '🎉 You\'re on the list! We\'ll notify you at launch.';
    }
    if (emailInput) emailInput.value = '';
    if (submitBtn) {
      submitBtn.innerHTML = `✓ Subscribed
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M3 8l4 4 6-7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`;
      submitBtn.style.opacity = '0.7';
    }
  }, 800);
};

// ─── Boot ─────────────────────────────────────────────────────────────────────

(function init() {
  const ctxId = detectContext();
  applyContext(ctxId);
  startClock();
})();
