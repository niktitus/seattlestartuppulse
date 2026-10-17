import { useEffect, useRef, useState } from 'react';
type SpeechEvent = { resultIndex: number; results: { length: number; [index: number]: { isFinal: boolean; [index: number]: { transcript: string } } } };
type Recognition = { continuous: boolean; interimResults: boolean; lang: string; onresult: ((event: SpeechEvent) => void) | null; onerror: ((event: { error: string }) => void) | null; onend: (() => void) | null; start: () => void; stop: () => void; abort: () => void };
type SpeechWindow = Window & { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition };
export function useVoidSpeech(text: string, setText: (text: string) => void) {
  const [listening,setListening] = useState(false); const [error,setError] = useState(''); const recognition = useRef<Recognition | null>(null);
  const supported = Boolean((window as SpeechWindow).SpeechRecognition ?? (window as SpeechWindow).webkitSpeechRecognition);
  useEffect(() => () => { const current=recognition.current; if(current) { current.onresult=null; current.onend=null; current.onerror=null; current.abort(); } },[]);
  function stop() { recognition.current?.stop(); setListening(false); }
  function start() {
    const Constructor=(window as SpeechWindow).SpeechRecognition ?? (window as SpeechWindow).webkitSpeechRecognition;
    if(!Constructor) return;
    const current = new Constructor(); recognition.current=current; const original=text.trim();
    current.continuous=true; current.interimResults=true; current.lang='en-US';
    current.onresult=event => { let transcript=''; for(let i=0;i<event.results.length;i++) transcript+=`${event.results[i][0].transcript} `; setText(`${original}${original ? ' ' : ''}${transcript}`.slice(0,1500)); };
    current.onerror=event => { setListening(false); setError(event.error==='not-allowed' ? 'Microphone permission was not granted. You can still type your shout.' : 'Voice stopped. Your text is still here.'); };
    current.onend=()=>setListening(false);
    try { current.start(); setListening(true); setError(''); } catch { setError('Voice could not start. Try typing instead.'); }
  }
  return { supported,listening,error,start,stop };
}