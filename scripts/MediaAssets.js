import {MOBILE_ASSETS} from './MobileAssets.js';
export function isMobileEdition(){return typeof document!=='undefined'&&document.documentElement?.dataset.edition==='mobile';}
export function mediaPath(source,mobile=isMobileEdition()){return mobile?(MOBILE_ASSETS[source]||source):source;}
export function mediaPreload(desktop='auto'){return isMobileEdition()?'none':desktop;}
export function mediaHTML(html){return isMobileEdition()?html.replace(/\bsrc="(assets\/[^\"]+)"/g,(match,source)=>`src="${mediaPath(source)}"`):html;}
