import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Seo from '@/components/seo/Seo';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const SCHEDULE = [
  { time: '3:00 PM', label: 'Doors open', note: 'Coffee, the Hopper Wall and the Silent Community Fair. Browse at your own pace' },
  { time: '4:00 PM', label: 'Welcome', note: 'Sarah Studer, with Ada Developers Academy' },
  { time: '4:05 PM', label: 'Fireside chat', note: 'Priyanka Kulkarni and Preeti Suri, moderated by Sarah Studer, on how Seattle women support each other and the future of work with AI' },
  { time: '4:35 PM', label: 'Find your coffee', note: 'Mingle, meet a mentor, and visit the organizations you saved (some reps hold office hours)' },
  { time: '5:30 PM', label: 'Group photo', note: 'Meet at the stage' },
  { time: 'Before you go', label: 'Make a Coffee Commitment', note: "Name someone you'll have coffee with, or ask to be matched. We'll email you by Saturday" },
  { time: '6:00 PM', label: 'Close', note: '' },
];

function AskQuestion() {
  const [name, setName] = useState('');
  const [question, setQuestion] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim().length < 3) return;
    setState('sending');
    const { error } = await supabase.functions.invoke('fireside-qa', { body: { action: 'submit', name, question } });
    if (error) return setState('error');
    setQuestion('');
    setState('sent');
  };
  return (
    <section id="ask" className="space-y-3 rounded-lg border border-border p-4" aria-labelledby="ask-h">
      <h2 id="ask-h" className="text-lg font-semibold">Ask the panel a question</h2>
      <p className="text-sm text-muted-foreground">Questions go straight to Sarah on stage during the fireside chat.</p>
      <form onSubmit={submit} className="space-y-2">
        <textarea value={question} onChange={(e) => { setQuestion(e.target.value); if (state !== 'sending') setState('idle'); }}
          maxLength={500} rows={3} required placeholder="Your question"
          className="w-full rounded-md border border-border bg-background p-3 text-sm" />
        <input value={name} onChange={(e) => setName(e.target.value)} maxLength={80} placeholder="Your name (optional)"
          className="w-full h-11 rounded-md border border-border bg-background px-3 text-sm" />
        <button disabled={state === 'sending'} className="h-11 px-5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-60">
          {state === 'sending' ? 'Sending…' : 'Send question'}
        </button>
        {state === 'sent' && <p className="text-sm text-primary">Got it! Your question is with the moderator.</p>}
        {state === 'error' && <p className="text-sm text-destructive">That didn't go through. Please try again.</p>}
      </form>
    </section>
  );
}

const ACTIONS = [
  { to: '/fair', title: 'Explore the Silent Community Fair', body: 'Resources from local organizations. Tap "I\'m interested" to save them to your list.' },
  { to: '/coffee', title: 'Commit to a coffee', body: 'Name someone you met, or ask us to match you with someone into the same things. 30 seconds.' },
  { to: '/coffee/mentor', title: 'Volunteer as a mentor', body: 'Offer 1–3 coffees to someone earlier in their path. Vouched and approved before the event.' },
  { to: '/fair/submit', title: 'Share a resource', body: 'Run an organization or program? Add it to the fair so people can find you.' },
];

export default function GhcSeattlePage() {
  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="GHC Seattle Pop-Up · Nov 6 at AI House"
        description="A free, women-centric pop-up for everyone who missed Grace Hopper this year. Friday, Nov 6, 2026 at AI House, Seattle."
        path="/ghcseattle"
      />
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-10">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Seattle Startup Pulse home
        </Link>

        <header className="space-y-3">
          <p className="text-xs font-medium text-primary uppercase tracking-wide">Free pop-up · Friday, Nov 6, 2026 · AI House, Seattle</p>
          <h1 className="text-3xl sm:text-4xl font-semibold leading-tight">Missed Grace Hopper? Seattle's got you.</h1>
          <p className="text-muted-foreground">
            An afternoon on the future of how women in Seattle support each other, and the future of work with AI. Come and go
            whenever you like. This site does the connecting, so everything works from your phone.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <Link to="/fair" className="inline-flex items-center gap-1.5 h-11 px-5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">
              Explore the fair <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/coffee" className="inline-flex items-center h-11 px-5 rounded-md border border-border text-sm font-medium hover:border-primary">
              Commit to a coffee ☕
            </Link>
          </div>
        </header>

        <section className="space-y-3" aria-labelledby="schedule">
          <h2 id="schedule" className="text-lg font-semibold">The afternoon</h2>
          <ol className="divide-y divide-border border-y border-border">
            {SCHEDULE.map((s) => (
              <li key={s.label} className="flex gap-4 py-3">
                <span className="w-28 shrink-0 text-sm font-medium text-primary">{s.time}</span>
                <span>
                  <span className="block text-sm font-medium">{s.label}</span>
                  {s.note && <span className="block text-sm text-muted-foreground">{s.note}</span>}
                </span>
              </li>
            ))}
          </ol>
        </section>

        <AskQuestion />

        <section className="space-y-3" aria-labelledby="do">
          <h2 id="do" className="text-lg font-semibold">What you can do here</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {ACTIONS.map((a) => (
              <Link key={a.to} to={a.to} className="group rounded-lg border border-border p-4 hover:border-primary transition-colors">
                <p className="font-medium flex items-center justify-between gap-2">
                  {a.title} <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                </p>
                <p className="text-sm text-muted-foreground pt-1">{a.body}</p>
              </Link>
            ))}
          </div>
        </section>

        <footer className="border-t border-border pt-6 pb-4 text-sm text-muted-foreground flex flex-wrap justify-between gap-3">
          <span>Community is a library, not a storefront.</span>
          <Link to="/" className="text-primary hover:underline">Browse all Seattle tech events →</Link>
        </footer>
      </div>
    </div>
  );
}
