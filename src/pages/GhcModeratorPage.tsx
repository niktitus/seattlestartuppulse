import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Seo from '@/components/seo/Seo';

type Q = { id: string; name: string | null; question: string; status: string; created_at: string };
const TABS = [
  { key: 'open', label: 'Live' },
  { key: 'starred', label: 'Starred' },
  { key: 'asked', label: 'Asked' },
  { key: 'archived', label: 'Hidden' },
];
const TOKEN_KEY = 'coffee-admin-token';

export default function GhcModeratorPage() {
  const [token, setToken] = useState(() => sessionStorage.getItem(TOKEN_KEY) ?? '');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [questions, setQuestions] = useState<Q[]>([]);
  const [tab, setTab] = useState('open');

  const call = useCallback(async (body: Record<string, unknown>) => {
    const { data, error } = await supabase.functions.invoke('fireside-qa', { body, headers: { Authorization: `Bearer ${token}` } });
    if (error) {
      sessionStorage.removeItem(TOKEN_KEY);
      setToken('');
      return null;
    }
    return data;
  }, [token]);

  const load = useCallback(async () => {
    const data = await call({ action: 'list' });
    if (data?.questions) setQuestions(data.questions);
  }, [call]);

  useEffect(() => {
    if (!token) return;
    void load();
    const t = setInterval(load, 3000);
    return () => clearInterval(t);
  }, [token, load]);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase.functions.invoke('verify-admin', { body: { password } });
    if (error || !data?.success) return setAuthError('Incorrect password');
    sessionStorage.setItem(TOKEN_KEY, data.token);
    setToken(data.token);
  };

  const setStatus = async (id: string, status: string) => {
    setQuestions((qs) => qs.map((q) => (q.id === id ? { ...q, status } : q)));
    await call({ action: 'update', id, status });
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Seo title="Moderator" description="Fireside moderator view" path="/ghcseattle/moderator" />
        <form onSubmit={login} className="w-full max-w-sm space-y-3">
          <h1 className="text-xl font-semibold">Moderator sign-in</h1>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Admin password"
            className="w-full h-11 px-3 rounded-md border border-border bg-background" />
          {authError && <p className="text-sm text-destructive">{authError}</p>}
          <button className="w-full h-11 rounded-md bg-primary text-primary-foreground font-medium">Open the question feed</button>
        </form>
      </div>
    );
  }

  const shown = questions
    .filter((q) => (tab === 'open' ? q.status === 'new' || q.status === 'starred' : q.status === tab))
    .sort((a, b) => (tab === 'open' ? Number(b.status === 'starred') - Number(a.status === 'starred') : 0) || b.created_at.localeCompare(a.created_at));
  const count = (k: string) => questions.filter((q) => (k === 'open' ? q.status === 'new' || q.status === 'starred' : q.status === k)).length;

  return (
    <div className="min-h-screen bg-foreground text-background">
      <Seo title="Moderator · Fireside questions" description="Live audience questions" path="/ghcseattle/moderator" />
      <div className="max-w-3xl mx-auto px-4 py-5 space-y-4">
        <header className="flex items-baseline justify-between gap-3">
          <h1 className="text-2xl font-semibold">Audience questions</h1>
          <span className="text-sm opacity-70 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" /> Live · {questions.length} total
          </span>
        </header>
        <nav className="flex gap-2 flex-wrap">
          {TABS.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`h-10 px-4 rounded-full border text-sm ${tab === t.key ? 'bg-background text-foreground border-background' : 'border-background/40'}`}>
              {t.label} ({count(t.key)})
            </button>
          ))}
        </nav>
        <ul className="space-y-3">
          {shown.length === 0 && <li className="opacity-60 py-10 text-center">No questions here yet.</li>}
          {shown.map((q) => (
            <li key={q.id} className={`rounded-lg p-4 border ${q.status === 'starred' ? 'border-primary bg-primary/20' : 'border-background/20'}`}>
              <p className="text-xl leading-snug">{q.question}</p>
              <p className="text-sm opacity-70 pt-2">
                {q.name || 'Anonymous'} · {new Date(q.created_at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
              </p>
              <div className="flex gap-2 pt-3 flex-wrap">
                {q.status !== 'starred' && <Btn onClick={() => setStatus(q.id, 'starred')}>★ Star</Btn>}
                {q.status === 'starred' && <Btn onClick={() => setStatus(q.id, 'new')}>Unstar</Btn>}
                {q.status !== 'asked' && <Btn onClick={() => setStatus(q.id, 'asked')}>✓ Asked</Btn>}
                {q.status !== 'archived' && <Btn onClick={() => setStatus(q.id, 'archived')}>Hide</Btn>}
                {(q.status === 'asked' || q.status === 'archived') && <Btn onClick={() => setStatus(q.id, 'new')}>Back to live</Btn>}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Btn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return <button onClick={onClick} className="h-10 px-4 rounded-md border border-background/40 text-sm hover:bg-background/10">{children}</button>;
}
