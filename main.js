/**
 * main.js — Whitelabel Fallback Engine
 * 
 * Architecture:
 * - Pure vanilla JS native renderer.
 * - Single Page App (SPA) logic for smooth transitions.
 * - Video continues looping uninterrupted during language swaps.
 */

'use strict';

const LOCALES = ['hr', 'en'];
const DEFAULT_LOCALE = 'hr';

const CONTEXTS = {
  maintenance: {
    video: 'maintenance',
    routes: { hr: '/hr/odrzavanje', en: '/en/maintenance', hr_alias: '/hr/maintenance' },
    i18n: {
      hr: { headline: 'Vraćamo se uskoro.', message: 'Sustav se osvježava. Hvala na strpljenju.' },
      en: { headline: 'We\'ll be back soon.', message: 'The system is refreshing. Thanks for your patience.' }
    }
  },
  comingSoon: {
    video: 'coming_soon',
    routes: { hr: '/hr/uskoro', en: '/en/coming-soon' },
    i18n: {
      hr: { headline: 'Uskoro smo tu.', message: 'Nova platforma se priprema. Hvala na strpljenju.' },
      en: { headline: 'We\'ll be here soon.', message: 'The new platform is being prepared. Thanks for your patience.' }
    }
  },
  outage: {
    video: 'outage',
    routes: { hr: '/hr/incident', en: '/en/outage' },
    i18n: {
      hr: { headline: 'Privremeno nedostupno.', message: 'Inženjeri rade na uspostavi usluge.' },
      en: { headline: 'Temporarily unavailable.', message: 'Engineers are investigating the issue.' }
    }
  },
  security: {
    video: 'security',
    routes: { hr: '/hr/sigurnost', en: '/en/security' },
    i18n: {
      hr: { headline: 'Pristup pauziran.', message: 'Površina je privremeno onemogućena dok se konfiguracija pregledava.' },
      en: { headline: 'Access paused.', message: 'Surface is temporarily disabled while configuration is reviewed.' }
    }
  },
  deploy: {
    video: 'deploy',
    routes: { hr: '/hr/azuriranje', en: '/en/deploy' },
    i18n: {
      hr: { headline: 'Sustav se ažurira.', message: 'Nova verzija se trenutno postavlja na poslužitelje.' },
      en: { headline: 'System is updating.', message: 'A new version is currently being deployed to the servers.' }
    }
  },
  contact: {
    video: 'contact',
    routes: { hr: '/hr/kontakt', en: '/en/contact' },
    i18n: {
      hr: { headline: 'Trebate pomoć?', message: 'Obratite nam se direktno.' },
      en: { headline: 'Need help?', message: 'Reach out to us directly.' }
    }
  },
  default: {
    video: 'default',
    routes: { hr: '/hr/404', en: '/en/404' },
    i18n: {
      hr: { headline: 'Nešto je pošlo po zlu.', message: 'Oprostite, ne možemo pronaći stranicu koju tražite.' },
      en: { headline: 'Something went wrong.', message: 'Sorry, We can\'t find the page you\'re looking for.' }
    }
  }
};

function detectContext(pathStr) {
  let locale = DEFAULT_LOCALE;
  let key = 'default';
  
  if (!pathStr) pathStr = window.location.pathname;
  
  if (!pathStr.startsWith('/')) pathStr = '/' + pathStr;
  if (pathStr.endsWith('/') && pathStr.length > 1) pathStr = pathStr.slice(0, -1);
  
  const pathParts = pathStr.split('/').filter(Boolean);
  if (LOCALES.includes(pathParts[0])) {
    locale = pathParts[0];
  }
  
  // Reverse lookup to find the context key based on translated route
  for (const [ctxKey, ctxVal] of Object.entries(CONTEXTS)) {
    if (Object.values(ctxVal.routes).includes(pathStr)) {
      key = ctxKey;
      break;
    }
  }

  return { locale, key, ctx: CONTEXTS[key] };
}

window.handleNav = function(e, url) {
  e.preventDefault();
  
  const textContainer = document.getElementById('text-container');
  const navContainer = document.querySelector('.wl-lang');
  
  // Trigger CSS fade out
  if (textContainer) textContainer.classList.add('fading');
  if (navContainer) navContainer.classList.add('fading');
  
  setTimeout(() => {
    history.pushState(null, '', url);
    render();
    
    // Trigger CSS fade in
    setTimeout(() => {
      if (textContainer) textContainer.classList.remove('fading');
      if (navContainer) navContainer.classList.remove('fading');
    }, 50);
  }, 300); // Matches CSS transition duration
};

function render() {
  const { locale, ctx } = detectContext();
  const root = document.getElementById('app-root');
  
  document.documentElement.lang = locale;
  document.title = ctx.i18n[locale].headline;
  
  const existingLayout = root.querySelector('.wl-layout');
  const t = ctx.i18n[locale];
  const hrPath = ctx.routes['hr'];
  const enPath = ctx.routes['en'];
  const hrActive = locale === 'hr' ? 'active' : '';
  const enActive = locale === 'en' ? 'active' : '';
  
  if (!existingLayout) {
    // Initial Render
    root.innerHTML = `
      <div class="wl-layout">
        <nav class="wl-lang">
          <a href="${hrPath}" onclick="handleNav(event, '${hrPath}')" class="${hrActive}" id="lang-btn-hr" aria-label="Switch to Croatian">HR</a>
          <span class="wl-lang-sep">|</span>
          <a href="${enPath}" onclick="handleNav(event, '${enPath}')" class="${enActive}" id="lang-btn-en" aria-label="Switch to English">EN</a>
        </nav>
        <div class="wl-video-container">
          <video class="wl-video" id="wl-video" autoplay loop muted playsinline>
            <source src="/assets/${ctx.video}.webm" type="video/webm">
          </video>
        </div>
        <div id="text-container" class="wl-text-container">
          <h1 class="wl-headline" id="wl-headline">${t.headline}</h1>
          <p class="wl-message" id="wl-message">${t.message}</p>
        </div>
      </div>
    `;
  } else {
    // Targeted DOM updates for ultra-smooth transitions
    const btnHr = document.getElementById('lang-btn-hr');
    const btnEn = document.getElementById('lang-btn-en');
    
    btnHr.href = hrPath;
    btnHr.setAttribute('onclick', `handleNav(event, '${hrPath}')`);
    btnHr.className = hrActive;
    
    btnEn.href = enPath;
    btnEn.setAttribute('onclick', `handleNav(event, '${enPath}')`);
    btnEn.className = enActive;
    
    document.getElementById('wl-headline').textContent = t.headline;
    document.getElementById('wl-message').textContent = t.message;
    
    const videoElem = document.getElementById('wl-video');
    const sourceElem = videoElem.querySelector('source');
    const newSrc = `/assets/${ctx.video}.webm`;
    
    // Only swap video if context completely changed
    if (sourceElem.getAttribute('src') !== newSrc) {
      sourceElem.setAttribute('src', newSrc);
      videoElem.load();
      videoElem.play().catch(() => {});
    }
  }
}

// Handle native browser back/forward buttons
window.addEventListener('popstate', () => {
  const textContainer = document.getElementById('text-container');
  const navContainer = document.querySelector('.wl-lang');
  
  if (textContainer) textContainer.classList.add('fading');
  if (navContainer) navContainer.classList.add('fading');
  
  setTimeout(() => {
    render();
    setTimeout(() => {
      if (textContainer) textContainer.classList.remove('fading');
      if (navContainer) navContainer.classList.remove('fading');
    }, 50);
  }, 300);
});

// Safely execute render
if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', render);
} else {
  render();
}
