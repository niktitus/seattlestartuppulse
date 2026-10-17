import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowRight, Check, ChevronDown, Copy, Mic, ShieldCheck, Square, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import VoidScene from '@/components/void/VoidScene';
import { useVoidSpeech } from '@/components/void/useVoidSpeech';
import { LOUDNESS, ROLES, TENURES, MAX_SHOUTS, dailyCount, recordShout } from '../../supabase/functions/_shared/void-policy';
import { supabase } from '@/integrations/supabase/client';
import './void.css';

const starters=["Startups say they're scrappy, but…",'Enterprise is where good ideas go to…','The thing nobody says out loud is…','If I could fix one thing about tech in Seattle…','The networking thing that drives me nuts is…',"I'd hire / get hired faster if…"];
const localDate=()=>new Date().toLocaleDateString('en-CA',{timeZone:'America/Los_Angeles'});
const endpoint=`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/void-submit`;
const requestHeaders={apikey:import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,'Content-Type':'application/json'};

// Private, on-device proof of work: no third-party anti-spam scripts.
async function solvePow(challenge:string,difficulty:number,alive:()=>boolean):Promise<number|null> {
  const enc=new TextEncoder();
  for(let n=0;n<5_000_000;n++) {
    if(n%2000===0){ await new Promise(r=>setTimeout(r,0)); if(!alive())return null; }
    const d=new Uint8Array(await crypto.subtle.digest('SHA-256',enc.encode(`${challenge}:${n}`)));
    let bits=0; for(const b of d){ if(b===0){bits+=8;continue;} bits+=Math.clz32(b)-24; break; }
    if(bits>=difficulty)return n;
  }
  return null;
}

export default function VoidPage() {
  const [arena,setArena]=useState(''); const [text,setText]=useState(''); const [loudness,setLoudness]=useState(3); const [role,setRole]=useState(''); const [tenure,setTenure]=useState(''); const [quote,setQuote]=useState(false);
  const [phase,setPhase]=useState<'writing'|'sending'|'done'>('writing'); const [error,setError]=useState(''); const [warning,setWarning]=useState(''); const [copied,setCopied]=useState(false); const [website,setWebsite]=useState('');
  const [config,setConfig]=useState<{ready:boolean;challenge?:string;difficulty?:number}|null>(null); const [token,setToken]=useState(''); const [reset,setReset]=useState(0); const [count,setCount]=useState(0);
  const [stat,setStat]=useState<{theme:string;count:number}|null>(null); const voice=useVoidSpeech(text,setText);
  useEffect(()=> { document.title='Shout into the void | Seattle Startup Pulse'; try { setCount(dailyCount(localStorage,localDate())); } catch { /* private browsing */ }
  },[]);
  useEffect(()=> { let active=true;
    fetch(endpoint,{headers:requestHeaders}).then(r=>r.json()).then(async data=>{ if(!active)return; setConfig(data); if(data.challenge){ const n=await solvePow(data.challenge,data.difficulty??16,()=>active); if(active&&n!==null)setToken(`${data.challenge}|${n}`);} }).catch(()=>{if(active)setError('The void is temporarily unavailable. Your draft stays here.');});
    return ()=>{active=false;};
  },[reset]);
  async function send() {
    let used=count; try { used=Math.max(used,dailyCount(localStorage,localDate())); } catch { /* no identifiers */ }
    if(used>=MAX_SHOUTS) { setError('Five shouts is plenty for one day. The void will be here tomorrow.'); return; }
    if(!arena || !text.trim()) { setError('Pick your arena and give the void something to work with.'); return; }
    voice.stop(); setError(''); setWarning(''); setPhase('sending'); let saved=false;
    try {
      const response=await fetch(endpoint,{method:'POST',headers:requestHeaders,body:JSON.stringify({text,arena,loudness,role:role||null,seattle_tenure:tenure||null,quote_ok:quote,website,token})});
      if(!response.ok) { const body=await response.json(); throw new Error(body.error ?? 'The void could not accept your shout.'); }
      const reader=response.body?.getReader(); if(!reader) throw new Error('No confirmation was received.');
      let buffer=''; const decoder=new TextDecoder();
      while(true) { const part=await reader.read(); if(part.done)break; buffer+=decoder.decode(part.value,{stream:true}); const lines=buffer.split('\n');buffer=lines.pop()??'';
        for(const line of lines) { if(!line.startsWith('data: '))continue; const event=JSON.parse(line.slice(6)); if(event.stage==='saved') { saved=true; try { setCount(recordShout(localStorage,localDate())); } catch { setCount(c=>c+1); } } if(event.warning)setWarning(event.warning); }
      }
      if(!saved)throw new Error('Your shout was not confirmed. Please try later.');
      const month=new Date().toLocaleDateString('en-CA',{timeZone:'America/Los_Angeles'}).slice(0,7)+'-01';
      const {data}=await supabase.from('void_theme_counts').select('theme,count').eq('arena',arena).eq('month',month).order('count',{ascending:false}).limit(1);
      const top=data?.[0]; setStat(top && Number(top.count)>=5 ? {theme:top.theme??'this theme',count:Number(top.count)} : null); setText(''); setPhase('done');
    } catch(err) { if(saved) {setWarning('Your shout was saved. Theme counts are temporarily unavailable.');setText('');setPhase('done');} else { setError(err instanceof Error ? err.message : 'Something went wrong. Your draft is still here.');setPhase('writing'); } }
    finally {setToken('');setReset(r=>r+1);}
  }
  async function share() { try {const url=`${window.location.origin}/void`; await navigator.clipboard.writeText(url);setCopied(true);} catch {setError('Could not copy the link. Share this page’s address instead.');} }
  return <main className="void-theme min-h-screen bg-background text-foreground">
    <div className="void-grain" aria-hidden="true" />
    <header className="void-header"><Link to="/" className="text-xs font-semibold uppercase tracking-normal">Seattle Startup Pulse <span className="text-muted-foreground">/ The release valve</span></Link><span className="void-private"><ShieldCheck size={14}/> No names. No login.</span></header>
    <div className="void-layout">
      <section className="void-intro">
        <div className="void-orbit"><VoidScene/><span className="void-orbit-label">YOUR THOUGHTS. INTO NOTHING.</span></div>
        <p className="void-eyebrow">A little less bottled up.</p>
        <h1>Shout into<br/>the void<span className="text-primary">.</span></h1>
        <p className="void-subhead">Tech is weird. Say what you can’t say on LinkedIn. No names, no login, no audio saved.</p>
        <div className="void-intro-foot"><span className="void-line"/><span>For Seattle’s very human tech people.</span><ArrowDown size={15}/></div>
      </section>
      <section className="void-compose" aria-label="Your shout">
        {phase==='done' ? <div className="void-confirmation" aria-live="polite"><span className="void-check"><Check/></span><p className="void-eyebrow">Gone. Not forgotten.</p><h2>The void heard you.</h2><p>{stat ? `You’re not alone. ${stat.count} shouts about ${stat.theme.toLowerCase()} in your arena this month.` : 'You’re not alone. Small groups stay private — theme counts appear only after at least 5 shouts.'}</p>{warning&&<p className="text-sm text-muted-foreground">{warning}</p>}<Button size="lg" onClick={()=>{setPhase('writing');setQuote(false);setWarning('');setStat(null);}}>Shout again <ArrowRight/></Button><Button asChild variant="outline"><Link to="/feedback">Take the 2-minute Seattle diagnostic <ArrowRight/></Link></Button><Button variant="ghost" onClick={share}>{copied?<Check/>:<Copy/>}{copied?'Link copied':'Share the void'}</Button></div> : <div className={phase==='sending'?'void-shout void-being-pulled':'void-shout'}>
          <div className="void-section-label"><span>01</span><h2>Pick your arena</h2></div>
          <div className="void-arena">{[['startup','Startup'],['enterprise','Enterprise'],['both','Both / somewhere in between']].map(([value,label])=><Button key={value} variant={arena===value?'default':'outline'} aria-pressed={arena===value} onClick={()=>setArena(value)} disabled={phase==='sending'}>{label}</Button>)}</div>
          <div className="void-section-label mt-7"><span>02</span><h2>Get it off your chest</h2><span className="ml-auto text-muted-foreground">Need a running start?</span></div>
          <div className="void-starters">{starters.map(starter=><Button key={starter} variant="ghost" onClick={()=>setText(starter.replace('…',' '))} disabled={phase==='sending'}>{starter}<ArrowRight size={12}/></Button>)}</div>
          <div className="void-textbox"><Textarea aria-label="Your shout" value={text} maxLength={1500} placeholder="Go ahead. The void has heard worse." onChange={e=>setText(e.target.value)} disabled={phase==='sending'||voice.listening}/><div className="void-textbox-foot"><span>{voice.listening?'Listening…': 'Unfiltered thoughts. Editable before sending.'}</span><span>{text.length} / 1,500</span>{voice.supported&&<Button variant="ghost" size="icon" aria-label={voice.listening?'Stop recording':'Talk to text'} title={voice.listening?'Stop recording':'Talk to text'} className={voice.listening?'void-listening':''} onClick={voice.listening?voice.stop:voice.start} disabled={phase==='sending'}>{voice.listening?<Square/>:<Mic/>}</Button>}</div></div>
          <p className="void-voice-note">{voice.supported?'Voice is transcribed by your browser’s speech service. We only receive the text you send.':'Voice works in Chrome, Safari, and Edge when browser speech recognition is available.'}</p>{voice.error&&<p className="text-sm text-destructive" role="alert">{voice.error}</p>}
          <div className="void-loudness"><div className="flex items-center justify-between"><div className="void-section-label"><span>03</span><h2>How loud?</h2></div><span className="text-primary text-sm flex gap-2 items-center"><Volume2 size={15}/>{LOUDNESS[loudness-1]}</span></div><Slider aria-label="How loud?" value={[loudness]} onValueChange={values=>setLoudness(values[0]??3)} min={1} max={5} step={1} disabled={phase==='sending'}/><div className="void-slider-labels">{LOUDNESS.map(label=><span key={label}>{label}</span>)}</div></div>
          <details className="void-context"><summary>Add context <span className="text-muted-foreground">(optional)</span><ChevronDown size={15}/></summary><div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4"><label>Role<select value={role} onChange={e=>setRole(e.target.value)}><option value="">Prefer not to say</option>{ROLES.map(r=><option key={r}>{r}</option>)}</select></label><label>Years in Seattle tech<select value={tenure} onChange={e=>setTenure(e.target.value)}><option value="">Prefer not to say</option>{TENURES.map(t=><option key={t}>{t}</option>)}</select></label></div></details>
          <label className="void-consent"><Checkbox checked={quote} onCheckedChange={value=>setQuote(value===true)} disabled={phase==='sending'}/><span>OK to quote this anonymously in Seattle Startup Pulse posts and recaps.</span></label>
          <div className="void-honeypot" aria-hidden="true"><label>Website<input tabIndex={-1} autoComplete="off" value={website} onChange={e=>setWebsite(e.target.value)}/></label></div>
          <p className="void-nudge">Pro tip: leave out names of people and companies.<br/>Rage at the system, not at Dave.</p>
          {config&&!config.ready&&<p className="void-not-ready" role="status">The void is resting. Please try again shortly.</p>}
          {error&&<p className="text-sm text-destructive mb-3" role="alert">{error}</p>}
          <Button className="void-send" size="lg" onClick={send} disabled={phase==='sending'||!config?.ready||!token||!text.trim()||!arena||count>=5}>{phase==='sending'?'Into the void…':'Scream it'}<ArrowRight/></Button>
          <div className="void-bottom"><span>{count>=5?'Come back tomorrow.':'Leave lighter than you arrived.'}</span><Dialog><DialogTrigger asChild><Button variant="link" className="h-auto p-0 text-xs">How anonymous is this?</Button></DialogTrigger><DialogContent className="void-theme"><DialogHeader><DialogTitle>Anonymous. With honest limits.</DialogTitle></DialogHeader><div className="space-y-4 text-sm leading-relaxed text-muted-foreground"><p>No login, email or name. Saved shouts have dates only, optional broad role and tenure, and no IP address, device information or user identifier attached.</p><p>We strip emails, phone numbers, links and @handles. We don’t add analytics, tracking pixels or session replay to this page. A daily counter stays in your browser; it is not sent with your shout.</p><p>Voice uses your browser’s speech service, which may send audio to its provider. We never receive or save the audio. Only the text you choose to send reaches us.</p><p>Your cleaned text is processed by Lovable AI for themes and moderation. Hosting, AI and Cloudflare anti-spam services may retain connection or operational logs under their own policies. This is app-level anonymity, not a guarantee of zero infrastructure logs.</p><p>Your own words can still identify you. Leave out specific people, companies and personal details. We only publish statistics supported by at least 5 shouts; quotes also need consent and human review.</p></div></DialogContent></Dialog></div>
        </div>}
        {phase==='sending'&&<p className="void-sending-note" role="status">Letting it all go. Stay here for confirmation.</p>}
        {phase==='done'&&error&&<p className="text-sm text-destructive" role="alert">{error}</p>}
      </section>
    </div>
    <footer className="void-footer"><span>A community release valve. Not a crisis service.</span><Link to={`/resources?section=${encodeURIComponent("I'm Underemployed or Between Roles")}`}>Rough stretch? Layoff and career resources <ArrowRight size={12}/></Link></footer>
  </main>;
}