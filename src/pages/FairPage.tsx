import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { TAG_GROUPS, STAGES, getIdentity, saveIdentity, getMyFair, addToMyFair, type FairIdentity } from '@/lib/coffee';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Bookmark, ExternalLink, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FairOrg {
  id: string;
  name: string;
  logo_url: string | null;
  who_they_help: string;
  themes: string[];
  tags: string[];
  action_today: string;
  url: string;
  contact_name: string | null;
  contact_role: string | null;
  contact_info: string | null;
  contact_public: boolean;
  office_hours: string | null;
  slug: string;
}

const EVENT_DATE = new Date('2026-11-07T00:00:00-08:00');
const isLibraryMode = () => new Date() >= EVENT_DATE;

export default function FairPage() {
  const [orgs, setOrgs] = useState<FairOrg[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'All' | 'Women supporting women' | 'Work + AI'>('All');
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [interestOrg, setInterestOrg] = useState<FairOrg | null>(null);
  const [identity, setIdentity] = useState<FairIdentity | null>(getIdentity());
  const [myFair, setMyFair] = useState(getMyFair());
  const [emailListState, setEmailListState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const library = isLibraryMode();

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('organizations').select('*').eq('status', 'approved').order('name');
      setOrgs((data as FairOrg[]) ?? []);
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orgs.filter((o) => {
      if (tab !== 'All' && !o.themes.includes(tab)) return false;
      if (activeTags.length && !activeTags.some((t) => o.tags.includes(t))) return false;
      if (q && !`${o.name} ${o.who_they_help} ${o.action_today} ${o.tags.join(' ')}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [orgs, tab, activeTags, search]);

  const toggleTag = (tag: string) =>
    setActiveTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));

  const handleInterested = (org: FairOrg) => {
    if (identity) {
      void sendInterest(org, identity);
    } else {
      setInterestOrg(org);
    }
  };

  const sendInterest = async (org: FairOrg, id: FairIdentity) => {
    addToMyFair({ slug: org.slug, name: org.name, url: org.url, action_today: org.action_today, tags: org.tags });
    setMyFair(getMyFair());
    await supabase.functions.invoke('coffee-submit', {
      body: { action: 'interest', organization_id: org.id, ...id },
    });
  };

  const emailMyList = async () => {
    if (!identity?.email) return;
    setEmailListState('sending');
    const { data, error } = await supabase.functions.invoke('coffee-submit', {
      body: { action: 'email-list', email: identity.email },
    });
    setEmailListState(error || data?.error ? 'error' : 'sent');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <div className="space-y-3">
          {library ? (
            <>
              <h1 className="text-2xl sm:text-3xl font-semibold">Resource library from the Nov 6 Silent Community Fair</h1>
              <p className="text-muted-foreground">Community is a library, not a storefront. Everything shared at the pop-up stays here.</p>
              <Link to="/fair/submit"><Button variant="outline" size="sm">Submit a resource</Button></Link>
            </>
          ) : (
            <>
              <p className="text-xs font-medium text-primary uppercase tracking-wide">Free pop-up · Friday, Nov 6, 2026 · AI House · Doors 3:00 PM, fireside 4:00 PM</p>
              <h1 className="text-2xl sm:text-3xl font-semibold">Silent Community Fair: the future of how we support each other</h1>
              <p className="text-muted-foreground">For everyone who lost Grace Hopper this year. Organizations share resources through QR cards — browse, tap "I'm interested," and your list is saved.</p>
            </>
          )}
        </div>

        {/* Tabs + search */}
        <div className="space-y-3 sticky top-0 bg-background/95 backdrop-blur-sm py-3 z-10 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="flex gap-1 flex-1">
              {(['All', 'Women supporting women', 'Work + AI'] as const).map((t) => (
                <button key={t} onClick={() => setTab(t)}
                  className={cn('px-3 py-1.5 text-xs sm:text-sm rounded-full border transition-colors whitespace-nowrap',
                    tab === t ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-primary/50')}>
                  {t}
                </button>
              ))}
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Bookmark className="h-3.5 w-3.5" /> My fair ({myFair.length})
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
                <SheetHeader><SheetTitle>My fair</SheetTitle></SheetHeader>
                <div className="mt-4 space-y-3">
                  {myFair.length === 0 && <p className="text-sm text-muted-foreground">Nothing saved yet. Tap "I'm interested" on any card.</p>}
                  {myFair.map((item) => (
                    <div key={item.slug} className="rounded-lg border border-border p-3 space-y-1">
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.action_today}</p>
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline inline-flex items-center gap-1">
                        Go <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  ))}
                  {myFair.length > 0 && (
                    <Button onClick={emailMyList} disabled={emailListState === 'sending' || !identity?.email} className="w-full">
                      {emailListState === 'sending' ? 'Sending…' : emailListState === 'sent' ? 'Sent — check your inbox ✓' : 'Email me my list'}
                    </Button>
                  )}
                  {emailListState === 'error' && <p className="text-xs text-destructive">Couldn't send — try again.</p>}
                </div>
              </SheetContent>
            </Sheet>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search resources…" className="pl-9" />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(tab === 'All' ? TAG_GROUPS.flatMap((g) => g.tags) : TAG_GROUPS.find((g) => g.theme === tab)?.tags ?? []).map((tag) => (
              <button key={tag} onClick={() => toggleTag(tag)} aria-pressed={activeTags.includes(tag)}
                className={cn('px-2.5 py-1 text-xs rounded-full border transition-colors',
                  activeTags.includes(tag) ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-primary/50')}>
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Cards */}
        {loading ? (
          <p className="text-muted-foreground text-sm">Loading…</p>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 space-y-2">
            <p className="text-muted-foreground">No resources in this tag yet. Know one? <Link to="/fair/submit" className="text-primary hover:underline">Submit it.</Link></p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filtered.map((org) => (
              <div key={org.id} className="rounded-lg border border-border p-4 space-y-3 shadow-card hover:shadow-card-hover transition-shadow">
                <div className="flex items-start gap-3">
                  {org.logo_url ? (
                    <img src={org.logo_url} alt="" className="h-10 w-10 rounded object-contain shrink-0" />
                  ) : (
                    <div className="h-10 w-10 rounded bg-accent flex items-center justify-center text-lg shrink-0">🌱</div>
                  )}
                  <div className="min-w-0">
                    <Link to={`/fair/${org.slug}`} className="font-semibold hover:text-primary transition-colors">{org.name}</Link>
                    <p className="text-sm text-muted-foreground">{org.who_they_help}</p>
                  </div>
                </div>
                <p className="text-sm"><span className="font-medium">Today:</span> {org.action_today}</p>
                <div className="flex flex-wrap gap-1">
                  {org.tags.map((t) => (
                    <span key={t} className="px-2 py-0.5 text-xs rounded-full bg-accent text-accent-foreground">{t}</span>
                  ))}
                  {org.office_hours && (
                    <span className="px-2 py-0.5 text-xs rounded-full border border-primary text-primary">Office hours {org.office_hours}</span>
                  )}
                </div>
                {org.contact_public && org.contact_name && (
                  <p className="text-xs text-muted-foreground">Contact: {org.contact_name}{org.contact_role ? `, ${org.contact_role}` : ''}{org.contact_info ? ` · ${org.contact_info}` : ''}</p>
                )}
                <div className="flex gap-2 pt-1">
                  <a href={org.url} target="_blank" rel="noopener noreferrer" className="flex-1">
                    <Button size="sm" className="w-full">Go <ExternalLink className="h-3.5 w-3.5 ml-1" /></Button>
                  </a>
                  <Button size="sm" variant="outline" onClick={() => handleInterested(org)}
                    className={cn(myFair.some((i) => i.slug === org.slug) && 'border-primary text-primary')}>
                    {myFair.some((i) => i.slug === org.slug) ? 'Saved ✓' : "I'm interested"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center pt-4 space-y-2">
          <p className="text-sm text-muted-foreground">Running an organization?</p>
          <Link to="/fair/submit" className="text-primary font-medium hover:underline">Submit your resources →</Link>
        </div>
      </div>

      {/* First-tap identity dialog */}
      <Dialog open={!!interestOrg} onOpenChange={(open) => !open && setInterestOrg(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Quick intro — just once</DialogTitle></DialogHeader>
          <form
            className="space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              const id: FairIdentity = {
                first_name: String(fd.get('first_name') || '').trim(),
                email: String(fd.get('email') || '').trim(),
                stage: String(fd.get('stage') || ''),
                linkedin_url: String(fd.get('linkedin_url') || '').trim() || undefined,
                show_badge_card: fd.get('show_badge_card') === 'on',
              };
              saveIdentity(id);
              setIdentity(id);
              const org = interestOrg;
              setInterestOrg(null);
              if (org) await sendInterest(org, id);
            }}
          >
            <div className="space-y-1.5">
              <Label htmlFor="first_name">First name *</Label>
              <Input id="first_name" name="first_name" required autoComplete="given-name" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" name="email" type="email" required autoComplete="email" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="stage">Stage *</Label>
              <select id="stage" name="stage" required className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                <option value="">Pick one…</option>
                {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="linkedin_url">LinkedIn URL (optional)</Label>
              <Input id="linkedin_url" name="linkedin_url" type="url" placeholder="https://linkedin.com/in/…" />
            </div>
            <label className="flex items-start gap-3 cursor-pointer">
              <Checkbox name="show_badge_card" className="mt-0.5" />
              <span className="text-sm">Show my first name, stage, tags and LinkedIn on my badge card.</span>
            </label>
            <Button type="submit" className="w-full">Save & continue</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
