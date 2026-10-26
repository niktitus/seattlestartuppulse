import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Check, Copy, Linkedin } from 'lucide-react';

interface BadgeCard {
  first_name: string;
  stage: string | null;
  badge_tags: string[] | null;
  linkedin_url: string | null;
  is_mentor: boolean;
}

export default function PersonCardPage() {
  const { shortId } = useParams<{ shortId: string }>();
  const [card, setCard] = useState<BadgeCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.rpc('get_badge_card', { p_short_id: shortId });
      const row = Array.isArray(data) ? data[0] : data;
      setCard((row as BadgeCard) ?? null);
      setLoading(false);
    })();
  }, [shortId]);

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><p className="text-muted-foreground">Loading…</p></div>;
  if (!card) return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center space-y-3">
        <h1 className="text-2xl font-semibold">Card not found</h1>
        <p className="text-muted-foreground">This person hasn't opted in to a badge card, or the link is wrong.</p>
        <Link to="/coffee" className="text-primary hover:underline">Make a Coffee Commitment →</Link>
      </div>
    </div>
  );

  const copyNote = async () => {
    try {
      await navigator.clipboard.writeText('Great meeting you at the Nov 6 pop-up at AI House. Let\'s get that coffee!');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard blocked — no-op
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-sm w-full space-y-6 text-center py-8">
        <div className="space-y-2">
          <div className="h-20 w-20 mx-auto rounded-full bg-accent flex items-center justify-center text-3xl font-semibold text-primary">
            {card.first_name.charAt(0).toUpperCase()}
          </div>
          <h1 className="text-3xl font-semibold">{card.first_name}</h1>
          {card.stage && <p className="text-muted-foreground">{card.stage}</p>}
          {card.is_mentor && (
            <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-primary text-primary-foreground">☕ Mentor</span>
          )}
        </div>
        {card.badge_tags && card.badge_tags.length > 0 && (
          <div className="flex flex-wrap justify-center gap-1.5">
            {card.badge_tags.slice(0, 3).map((t) => (
              <span key={t} className="px-3 py-1 text-xs rounded-full bg-accent text-accent-foreground">{t}</span>
            ))}
          </div>
        )}
        <div className="space-y-2">
          {card.linkedin_url && (
            <a href={card.linkedin_url} target="_blank" rel="noopener noreferrer">
              <Button className="w-full h-12 text-base gap-2">
                <Linkedin className="h-4 w-4" /> Connect on LinkedIn
              </Button>
            </a>
          )}
          <Link to={`/coffee?with=${encodeURIComponent(card.first_name)}`}>
            <Button variant="outline" className="w-full h-12 text-base">
              Commit to coffee with {card.first_name} ☕
            </Button>
          </Link>
          <Button variant="ghost" size="sm" onClick={copyNote} className="gap-1.5">
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? 'Copied!' : 'Copy a note'}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">Nov 6 pop-up · AI House · Seattle Startup Pulse</p>
      </div>
    </div>
  );
}
