import { CORTOMETRAJE } from './portal-config.js';

let filmURL;
try {
  const value = (CORTOMETRAJE.url || '').trim();
  if (value) {
    const parsed = new URL(value, location.href);
    if (['http:', 'https:'].includes(parsed.protocol)) filmURL = parsed.href;
  }
} catch { /* An unfinished configuration keeps the coming-soon state. */ }

const isAvailable = Boolean(filmURL || CORTOMETRAJE.videoId);

if (isAvailable) {
  document.querySelectorAll('[data-film-badge]').forEach(el => {
    el.textContent = 'DISPONIBLE PARA VER';
    el.classList.add('available');
  });

  const action = document.querySelector('[data-film-action]');
  if (action) {
    action.innerHTML = 'Ver cortometraje <span aria-hidden="true">↗</span>';
  }

  const card = document.querySelector('.film-card');
  if (card) {
    card.setAttribute('aria-label', 'Ver cortometraje — Lo que queda en la Tierra');
  }

  const screen = document.getElementById('film-screen');
  const status = document.getElementById('film-status');

  if (screen) {
    if (CORTOMETRAJE.formato === 'youtube' || CORTOMETRAJE.videoId) {
      const videoId = CORTOMETRAJE.videoId || (filmURL ? (new URL(filmURL).pathname.replace('/', '') || new URL(filmURL).searchParams.get('v')) : 'bwwzyFxFqxw');
      const baseEmbed = CORTOMETRAJE.embedUrl || `https://www.youtube-nocookie.com/embed/${videoId}`;
      const embedSrc = baseEmbed.includes('?') ? baseEmbed : `${baseEmbed}?rel=0&playsinline=1`;

      const iframe = document.createElement('iframe');
      iframe.src = embedSrc;
      iframe.title = 'Lo que queda en la Tierra — Cortometraje';
      iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
      iframe.setAttribute('allowfullscreen', '');
      iframe.allowFullscreen = true;
      iframe.setAttribute('loading', 'eager');

      screen.replaceChildren(iframe);
      if (status) status.textContent = 'Un cortometraje de Federico Esparza.';
    } else if (CORTOMETRAJE.formato === 'video') {
      const video = document.createElement('video');
      video.controls = true;
      video.playsInline = true;
      video.preload = 'metadata';
      video.poster = 'assets/portal-v1/el-corto.webp';
      video.src = filmURL;
      video.setAttribute('aria-label', 'Lo que queda en la Tierra — Cortometraje');
      screen.replaceChildren(video);
      if (status) status.textContent = 'Un cortometraje de Federico Esparza.';
      video.addEventListener('error', () => {
        if (status) status.textContent = 'No se pudo cargar el cortometraje. Podés volver a intentar recargando esta página.';
      });
    } else {
      const wait = document.getElementById('film-wait');
      if (wait) {
        wait.replaceChildren();
        const title = document.createElement('h2');
        title.textContent = 'La historia continúa.';
        const link = document.createElement('a');
        link.className = 'button primary';
        link.href = filmURL;
        link.textContent = '▶ Ver cortometraje';
        wait.append(title, link);
      }
      if (status) status.textContent = 'El cortometraje se abre en su página de reproducción.';
    }
  }
}
