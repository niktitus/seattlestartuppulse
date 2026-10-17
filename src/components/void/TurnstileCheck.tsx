import { useEffect, useRef } from 'react';
type Turnstile = { render: (element: HTMLElement, options: Record<string,unknown>) => string; remove: (id:string)=>void };
declare global { interface Window { turnstile?: Turnstile } }
export default function TurnstileCheck({ siteKey, onToken, reset }: { siteKey: string; onToken:(value:string)=>void; reset:number }) {
  const ref=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    let widget:string|undefined; let cancelled=false;
    const mount=()=> { if(cancelled || !ref.current || !window.turnstile) return; widget=window.turnstile.render(ref.current,{sitekey:siteKey,action:'void-shout',size:'invisible',callback:onToken,'expired-callback':()=>onToken(''),'error-callback':()=>onToken('')}); };
    let script=document.querySelector<HTMLScriptElement>('script[data-void-turnstile]');
    if(window.turnstile) mount();
    else { if(!script) { script=document.createElement('script'); script.src='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'; script.dataset.voidTurnstile='true'; script.async=true; document.head.appendChild(script); } script.addEventListener('load',mount); }
    return ()=> { cancelled=true; script?.removeEventListener('load',mount); if(widget) window.turnstile?.remove(widget); };
  },[siteKey,onToken,reset]);
  return <div ref={ref} />;
}