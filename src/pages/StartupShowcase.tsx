import { useMemo, useState } from 'react';
import { Search, ExternalLink, Users, Mic } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import Seo from '@/components/seo/Seo';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import skyline from '@/assets/seattle-skyline.png.asset.json';
import {
  SHOWCASE_COMPANIES,
  SHOWCASE_SEGMENTS,
  SHOWCASE_TAGS,
  type ShowcaseSegment,
} from '@/data/showcaseCompanies';
import { FAIR_COMPANIES, FAIR_TAGS } from '@/data/fairCompanies';

type Part = 'stage' | 'fair';

export default function StartupShowcase() {
  const [part, setPart] = useState<Part>('stage');
  const [search, setSearch] = useState('');
  const [segment, setSegment] = useState<ShowcaseSegment | 'All'>('All');
  const [tag, setTag] = useState<string | 'All'>('All');
  const [fairTag, setFairTag] = useState<string | 'All'>('All');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return SHOWCASE_COMPANIES.filter((c) => {
      if (segment !== 'All' && c.segment !== segment) return false;
      if (tag !== 'All' && !c.tags.includes(tag)) return false;
      if (!q) return true;
      return (
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.website.toLowerCase().includes(q) ||
        c.presenting.toLowerCase().includes(q) ||
        c.founders.join(' ').toLowerCase().includes(q) ||
        c.tags.join(' ').toLowerCase().includes(q)
      );
    });
  }, [search, segment, tag]);

  const segmentCounts = useMemo(() => {
    const counts: Record<string, number> = { All: SHOWCASE_COMPANIES.length };
    for (const c of SHOWCASE_COMPANIES) counts[c.segment] = (counts[c.segment] || 0) + 1;
    return counts;
  }, []);

  const filteredFair = useMemo(() => {
    const q = search.trim().toLowerCase();
    return FAIR_COMPANIES.filter((c) => {
      if (fairTag !== 'All' && !c.tags.includes(fairTag)) return false;
      if (!q) return true;
      return (
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.website.toLowerCase().includes(q) ||
        c.founders.join(' ').toLowerCase().includes(q) ||
        c.tags.join(' ').toLowerCase().includes(q)
      );
    });
  }, [search, fairTag]);

  return (
    <>
      <Seo
        title="Startup Showcase"
        description="Scan and learn about every company demoing at the Seattle Startup Showcase — Startup Fair exhibitors and the Live on Stage demo lineup."
        path="/showcase"
      />
      <AppLayout activeTab={'showcase' as any}>
        <div className="bg-showcase min-h-screen showcase-theme">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-5">
            {/* Hero — skyline + clouds only */}
            <div className="relative overflow-hidden rounded-lg border border-border shadow-elevated">
              <img
                src={skyline.url}
                alt="Illustrated Seattle skyline with Mount Rainier and the Space Needle"
                className="h-28 sm:h-36 w-full object-cover object-bottom"
                loading="eager"
              />
            </div>

            {/* Title + credit */}
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold text-showcase-foreground">
                Startup Showcase
              </h1>
              <p className="text-sm text-showcase-foreground/80">
                Every company on the floor and on the stage — scan, search, and dig in.
              </p>
            </div>

          {/* Search (applies to both sections) */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search companies, founders, or focus areas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Sector filters (above the section buttons) */}
          {part === 'fair' ? (
            <div className="flex flex-wrap gap-1.5">
              {(['All', ...FAIR_TAGS] as const).map((t) => (
                <Badge
                  key={t}
                  variant={fairTag === t ? 'secondary' : 'outline'}
                  className="cursor-pointer select-none text-[11px] px-2.5 py-0.5"
                  onClick={() => setFairTag(t)}
                >
                  {t}
                </Badge>
              ))}
            </div>
          ) : (
            <>
              <div className="flex flex-wrap gap-1.5">
                {(['All', ...SHOWCASE_SEGMENTS] as const).map((s) => (
                  <Badge
                    key={s}
                    variant={segment === s ? 'default' : 'outline'}
                    className="cursor-pointer select-none text-xs px-3 py-1"
                    onClick={() => setSegment(s as ShowcaseSegment | 'All')}
                  >
                    {s} ({segmentCounts[s] ?? 0})
                  </Badge>
                ))}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(['All', ...SHOWCASE_TAGS] as const).map((t) => (
                  <Badge
                    key={t}
                    variant={tag === t ? 'secondary' : 'outline'}
                    className="cursor-pointer select-none text-[11px] px-2.5 py-0.5"
                    onClick={() => setTag(t)}
                  >
                    {t}
                  </Badge>
                ))}
              </div>
            </>
          )}

          {/* Part tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setPart('stage')}
              className={`flex-1 flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                part === 'stage'
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border text-muted-foreground hover:border-primary/40'
              }`}
            >
              <Mic className="h-4 w-4" />
              Live on Stage
            </button>
            <button
              onClick={() => setPart('fair')}
              className={`flex-1 flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                part === 'fair'
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border text-muted-foreground hover:border-primary/40'
              }`}
            >
              <Users className="h-4 w-4" />
              Startup Fair
            </button>
          </div>

          {part === 'fair' ? (
            <>
              <p className="text-sm text-muted-foreground">
                {filteredFair.length} of {FAIR_COMPANIES.length} exhibitors · listed alphabetically
              </p>

              {/* Cards */}
              {filteredFair.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center text-muted-foreground text-sm">
                    No exhibitors match your search.
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-2">
                  {filteredFair.map((c) => (
                    <Card key={c.name} className="group hover:border-primary/30 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="shrink-0 mt-0.5 flex h-7 w-7 items-center justify-center rounded-full border border-border text-xs font-semibold text-muted-foreground">
                            {c.order}
                          </div>
                          <div className="flex-1 min-w-0 space-y-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h2 className="font-semibold text-foreground">{c.name}</h2>
                              <Badge variant="outline" className="text-[10px] uppercase tracking-wide">
                                Early Stage
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{c.description}</p>
                            <div className="text-xs text-muted-foreground space-y-0.5">
                              <p>
                                <span className="font-medium text-foreground">Founders:</span>{' '}
                                {c.founders.join(' · ')}
                              </p>
                            </div>
                            <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                              {c.tags.map((t) => (
                                <Badge key={t} variant="secondary" className="text-[10px]">
                                  {t}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <a
                            href={c.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0 text-primary hover:text-primary/80 transition-colors"
                            aria-label={`Visit ${c.name} website`}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                {filtered.length} of {SHOWCASE_COMPANIES.length} companies · listed in order of
                performance
              </p>

              {/* Cards */}
              {filtered.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center text-muted-foreground text-sm">
                    No companies match your search.
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-2">
                  {filtered.map((c) => (
                    <Card key={c.name} className="group hover:border-primary/30 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="shrink-0 mt-0.5 flex h-7 w-7 items-center justify-center rounded-full border border-border text-xs font-semibold text-muted-foreground">
                            {c.order}
                          </div>
                          <div className="flex-1 min-w-0 space-y-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h2 className="font-semibold text-foreground">{c.name}</h2>
                              <Badge variant="outline" className="text-[10px] uppercase tracking-wide">
                                {c.segment.replace(' Demos', '')}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{c.description}</p>
                            <div className="text-xs text-muted-foreground space-y-0.5">
                              <p>
                                <span className="font-medium text-foreground">Founders:</span>{' '}
                                {c.founders.join(' · ')}
                              </p>
                              <p>
                                <span className="font-medium text-foreground">Presenting:</span>{' '}
                                {c.presenting}
                              </p>
                            </div>
                            <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                              {c.tags.map((t) => (
                                <Badge key={t} variant="secondary" className="text-[10px]">
                                  {t}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <a
                            href={c.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0 text-primary hover:text-primary/80 transition-colors"
                            aria-label={`Visit ${c.name} website`}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
              </>
            )}

          </div>

          {/* Surfboard credit — sticky footer so it stays visible */}
          <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/60 bg-showcase/95 backdrop-blur-sm py-2">
            <p className="text-xs text-center text-showcase-foreground/80">
              Planning for this event powered by{' '}
              <a
                href="https://www.surfboard.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium underline underline-offset-2 hover:text-showcase-foreground transition-colors"
              >
                Surfboard
              </a>
            </p>
          </div>
        </div>
        </div>
      </AppLayout>
    </>
  );
}