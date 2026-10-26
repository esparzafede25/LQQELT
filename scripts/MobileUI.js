import {isMobileEdition} from './MediaAssets.js';

/** Mirror only the current scene's real actions; no alternate story/progress logic. */
export function installMobileUI(stage){
  if(!isMobileEdition())return;
  document.body.classList.add('mobile-game');
  const tray=document.createElement('nav');
  tray.className='mobile-action-tray';tray.setAttribute('aria-label','Acciones disponibles');tray.hidden=true;
  document.body.appendChild(tray);
  let previous=[],signature='',queued=false;
  const sync=()=>{
    queued=false;
    for(const hint of stage.querySelectorAll('.mate-caption small'))if(hint.textContent!=='Tocá para seguir')hint.textContent='Tocá para seguir';
    const help=stage.querySelector('.present-help');if(help?.textContent.includes('· H'))help.textContent='Ver objetos';
    const tagline=stage.querySelector('.menu-tagline');if(tagline&&tagline.textContent!=='VERSIÓN PARA CELULAR · HISTORIA COMPLETA')tagline.textContent='VERSIÓN PARA CELULAR · HISTORIA COMPLETA';
    const footer=stage.querySelector('.menu-footer');if(footer&&footer.textContent!=='Podés girar el teléfono para ver mejor la escena.')footer.textContent='Podés girar el teléfono para ver mejor la escena.';
    const targets=[...stage.querySelectorAll('.mate-object,.present-object')].filter(el=>{
      const style=getComputedStyle(el);
      return el.isConnected&&!el.disabled&&!el.hidden&&style.display!=='none'&&style.visibility!=='hidden';
    });
    const next=targets.map(el=>el.getAttribute('aria-label')||el.textContent.trim()).join('|');
    if(next===signature&&targets.length===previous.length&&targets.every((el,i)=>el===previous[i]))return;
    previous=targets;signature=next;tray.replaceChildren();tray.hidden=!targets.length;
    for(const target of targets){
      const button=document.createElement('button');button.type='button';button.textContent=target.getAttribute('aria-label')||target.textContent.trim();
      button.addEventListener('click',()=>{
        if(!target.isConnected||target.disabled||target.hidden)return;
        target.focus({preventScroll:true});target.click();
      });
      tray.appendChild(button);
    }
  };
  const observer=new MutationObserver(()=>{if(!queued){queued=true;queueMicrotask(sync);}});
  observer.observe(stage,{subtree:true,childList:true,attributes:true,attributeFilter:['class','hidden','disabled','aria-label']});
  const resize=new ResizeObserver(()=>{
    const height=tray.hidden?0:Math.ceil(tray.getBoundingClientRect().height);
    document.documentElement.style.setProperty('--mobile-tray-height',height+'px');
  });
  resize.observe(tray);sync();
  return ()=>{observer.disconnect();resize.disconnect();tray.remove();};
}
