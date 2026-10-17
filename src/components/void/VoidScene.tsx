import { useEffect, useRef } from 'react';

export default function VoidScene() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0; let time = 0;
    const render = () => {
      const box = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio,2);
      if (canvas.width !== Math.round(box.width*ratio) || canvas.height !== Math.round(box.height*ratio)) { canvas.width = Math.round(box.width*ratio); canvas.height = Math.round(box.height*ratio); }
      ctx.setTransform(ratio,0,0,ratio,0,0); ctx.clearRect(0,0,box.width,box.height);
      const colors = getComputedStyle(canvas); const ink = colors.getPropertyValue('--void-particle').trim(); const bright = colors.getPropertyValue('--void-particle-bright').trim();
      const cx = box.width/2; const cy = box.height/2; const radius = Math.min(box.width,box.height)*.44;
      for(let i=0;i<1500;i++) {
        const fraction = (i*.61803398875)%1; const r = radius*(.29 + fraction*.71);
        const arm = i%3; const angle = fraction*8.5 + arm*Math.PI*2/3 + time*(.18 + (1-fraction)*.15);
        const wobble = Math.sin(i*17.13)*.036*radius;
        const x = cx+Math.cos(angle)*(r+wobble); const y = cy+Math.sin(angle)*(r+wobble)*.74;
        ctx.globalAlpha = (.12 + ((i*0.317)%1)*.5)*(1-fraction*.6); ctx.fillStyle = i%8===0 ? bright : ink;
        ctx.beginPath(); ctx.arc(x,y,i%13===0 ? 1.2 : .65,0,Math.PI*2); ctx.fill();
      }
      ctx.globalAlpha=1;
      if (!reduced.matches) { time+=.006; frame=requestAnimationFrame(render); }
    };
    render(); const resize = () => { if(reduced.matches) render(); }; window.addEventListener('resize',resize);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('resize',resize); };
  },[]);
  return <canvas ref={ref} className="void-scene" aria-hidden="true" />;
}