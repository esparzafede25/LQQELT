import {CORTOMETRAJE} from './portal-config.js';
let filmURL;
try{
  const value=CORTOMETRAJE.url.trim();
  if(value){const parsed=new URL(value,location.href);if(['http:','https:'].includes(parsed.protocol))filmURL=parsed.href;}
}catch{ /* An unfinished configuration keeps the coming-soon state. */ }
if(filmURL){
  document.querySelectorAll('[data-film-badge]').forEach(el=>{el.textContent='DISPONIBLE PARA VER';el.classList.add('available');});
  const action=document.querySelector('[data-film-action]');if(action)action.textContent='Ver cortometraje ↗';
  const card=document.querySelector('.film-card');if(card)card.setAttribute('aria-label','Ver cortometraje — Lo que queda en la Tierra');
  const screen=document.getElementById('film-screen'),status=document.getElementById('film-status');
  if(screen&&CORTOMETRAJE.formato==='video'){
    const video=document.createElement('video');video.controls=true;video.playsInline=true;video.preload='metadata';video.poster='assets/portal-v1/el-corto.webp';video.src=filmURL;video.setAttribute('aria-label','Lo que queda en la Tierra — Cortometraje');
    screen.replaceChildren(video);status.textContent='Lo que queda en la Tierra · Cortometraje';
    video.addEventListener('error',()=>{status.textContent='No se pudo cargar el cortometraje. Podés volver a intentar recargando esta página.';});
  }else if(screen){
    const wait=document.getElementById('film-wait');wait.replaceChildren();
    const title=document.createElement('h2');title.textContent='La historia continúa.';
    const link=document.createElement('a');link.className='button primary';link.href=filmURL;link.textContent='▶ Ver cortometraje';
    wait.append(title,link);status.textContent='El cortometraje se abre en su página de reproducción.';
  }
}
