import { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

const OPTIONS = [
  { id: 'met', label: 'We met ☕' },
  { id: 'not_yet', label: 'Not yet' },
  { id: 'didnt_work', label: "It didn't work out" },
];

export default function CheckinPage() {
  const { token } = useParams<{ token: string }>();
  const [params] = useSearchParams();
  const [response, setResponse] = useState(params.get('r') ?? '');
  const [note, setNote] = useState('');
  const [state, setState] = useState<'idle' | 'saved' | 'thanks' | 'error'>('idle');

  const save = async (r: string, n?: string) => {
    const { data, error } = await supabase.functions.invoke('coffee-submit', { body: { action: 'checkin', token, response: r, note: n } });
    if (error || data?.error) { setState('error'); return false; }
    return true;
  };

  useEffect(() => {
    const r = params.get('r');
    if (r && OPTIONS.some((o) => o.id === r)) void save(r).then((ok) => ok && setState('saved'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pick = async (r: string) => { setResponse(r); if (await save(r)) setState('saved'); };
  const sendNote = async () => { if (await save(response, note)) setState('thanks'); };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-5 text-center">
        {state === 'error' ? (
          <>
            <h1 className="text-2xl font-semibold">That link didn't work</h1>
            <p className="text-muted-foreground">Just reply to the email instead — Nik reads every one.</p>
          </>
        ) : state === 'thanks' ? (
          <>
            <div className="text-4xl">💚</div>
            <h1 className="text-2xl font-semibold">Thank you</h1>
            <p className="text-muted-foreground">Got it. This helps shape the next one.</p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-semibold">Did your coffee happen?</h1>
            <div className="grid gap-2">
              {OPTIONS.map((o) => (
                <button key={o.id} onClick={() => pick(o.id)} aria-pressed={response === o.id}
                  className={cn('w-full px-4 py-3 rounded-lg border text-sm transition-colors',
                    response === o.id ? 'border-primary bg-accent font-medium' : 'border-border hover:border-primary/50')}>
                  {o.label}
                </button>
              ))}
            </div>
            {state === 'saved' && (
              <div className="space-y-2 text-left">
                <p className="text-sm text-primary text-center">Saved ✓</p>
                <label htmlFor="note" className="text-sm font-medium">What helped? (optional)</label>
                <Textarea id="note" value={note} onChange={(e) => setNote(e.target.value)} maxLength={1000} />
                <Button onClick={sendNote} disabled={!note.trim()} className="w-full">Send</Button>
              </div>
            )}
          </>
        )}
        <Link to="/coffee" className="inline-block text-sm text-primary hover:underline">Commit to another coffee →</Link>
      </div>
    </div>
  );
}
