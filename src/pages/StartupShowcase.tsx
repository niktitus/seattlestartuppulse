import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ExternalLink, Users, Mic } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import Seo from '@/components/seo/Seo';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import skyline from '@/assets/seattle-skyline.png.asset.json';
import { SHOWCASE_COMPANIES, type ShowcaseCompany } from '@/data/showcaseCompanies';
import { FAIR_COMPANIES, type FairCompany } from '@/data/fairCompanies';

type Part = 'stage' | 'fair';
type SearchResult =
  | { program: 'stage'; company: ShowcaseCompany }
  | { program: 'fair'; company: FairCompany };

const fieldMatches = (fields: Array<string | string[]>, query: string) =>
  fields.some((field) =>
    (Array.isArray(field) ? field.join(' ') : field).toLowerCase().includes(query),
  );

type CompanyCardProps = {
  order: number | string;
  name: string;
  description: string;
  website: string;
  founders: string[];
  tags: string[];
  presenting?: string;
  badges: string[];
};

function CompanyCard({
  order,
  name,
  description,
  website,
  founders,
  tags,
  presenting,
  badges,
}: CompanyCardProps) {
  return (
    <Card className="group hover:border-primary/30 transition-colors">
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-start gap-2.5 sm:gap-3">
          <div className="shrink-0 mt-0.5 flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full border border-border text-[11px] sm:text-xs font-semibold text-muted-foreground">
            {order}
          </div>
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-start gap-2 flex-wrap">
              <h2 className="font-semibold text-foreground text-[15px] sm:text-base break-words">
                {name}
              </h2>
              {badges.map((b) => (
                <Badge
                  key={b}
                  variant="outline"
                  className="text-[10px] uppercase tracking-wide shrink-0"
                >
                  {b}
                </Badge>
              ))}
            </div>
            <p className="text-sm text-muted-foreground break-words">{description}</p>
            <div className="text-xs text-muted-foreground space-y-0.5">
              <p className="break-words">
                <span className="font-medium text-foreground">Founders:</span>{' '}
                {founders.join(' · ')}
              </p>
              {presenting && (
                <p className="break-words">
                  <span className="font-medium text-foreground">Presenting:</span> {presenting}
                </p>
              )}
            </div>
            <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
              {tags.map((t) => (
                <Badge key={t} variant="secondary" className="text-[10px]">
                  {t}
                </Badge>
              ))}
            </div>
          </div>
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 -mr-1 -mt-1 flex h-10 w-10 items-center justify-center rounded-md text-primary hover:text-primary/80 hover:bg-primary/5 transition-colors"
            aria-label={`Visit ${name} website`}
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </CardContent>
    </Card>
  );
}

export default function StartupShowcase() {
  const [part, setPart] = useState<Part>('stage');
  const [search, setSearch] = useState('');
  const searching = search.trim().length > 0;

  const searchResults = useMemo<SearchResult[]>(() => {
    const q = search.trim().toLowerCase();
    if (!q) return [];

    const stageResults = SHOWCASE_COMPANIES.filter((c) =>
      fieldMatches([c.name, c.description, c.website, c.presenting, c.founders, c.tags], q),
    ).map((company) => ({ program: 'stage' as const, company }));

    const fairResults = FAIR_COMPANIES.filter((c) =>
      fieldMatches([c.name, c.description, c.website, c.founders, c.tags], q),
    ).map((company) => ({ program: 'fair' as const, company }));

    return [...stageResults, ...fairResults];
  }, [search]);

  return (
    <>
      <Seo
        title="Startup Showcase"
        description="Scan and learn about every company demoing at the Seattle Startup Showcase — Startup Fair exhibitors and the Live on Stage demo lineup."
        path="/showcase"
      />
      <AppLayout activeTab={'showcase' as any}>
        <div className="bg-showcase min-h-screen showcase-theme">
          <div className="max-w-3xl mx-auto px-3 sm:px-6 py-4 sm:py-6 pb-24 space-y-4 sm:space-y-5">
            {/* Hero — skyline + clouds only */}
            <div className="relative overflow-hidden rounded-lg border border-border shadow-elevated">
              <Link
                to="/feedback"
                className="absolute top-2 right-2 z-10 inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
              >
                Share Event Feedback
              </Link>
              <img
                src={skyline.url}
                alt="Illustrated Seattle skyline with Mount Rainier and the Space Needle"
                className="h-20 sm:h-36 w-full object-cover object-bottom"
                loading="eager"
              />
            </div>

            {/* Title + credit */}
            <div className="space-y-1">
              <h1 className="text-xl sm:text-2xl font-semibold text-showcase-foreground">
                Startup Showcase
              </h1>
              <p className="text-sm text-showcase-foreground/80">
                Every company on the floor and on the stage — scan, search, and dig in.
              </p>
            </div>

            {/* Sticky search + program selection */}
            <div className="sticky top-0 z-30 -mx-3 sm:mx-0 px-3 sm:px-0 py-2 sm:py-0 bg-showcase/95 backdrop-blur-sm sm:bg-transparent sm:backdrop-blur-none space-y-2 sm:space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search companies or founders..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-11 text-base sm:text-sm"
                  inputMode="search"
                  enterKeyHint="search"
                />
              </div>

              <div className="flex gap-2">
                {([
                  { key: 'stage' as Part, label: 'Live on Stage', icon: <Mic className="h-4 w-4" /> },
                  { key: 'fair' as Part, label: 'Startup Fair', icon: <Users className="h-4 w-4" /> },
                ]).map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setPart(t.key)}
                    className={`flex-1 min-h-11 flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                      part === t.key
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-background/60 text-muted-foreground hover:border-primary/40'
                    }`}
                  >
                    {t.icon}
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {searching ? (
              <>
                <p className="text-sm text-muted-foreground">
                  {searchResults.length} matches across Live on Stage and Startup Fair
                </p>

                {searchResults.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center text-muted-foreground text-sm">
                      No companies match your search.
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-2">
                    {searchResults.map((result) =>
                      result.program === 'stage' ? (
                        <CompanyCard
                          key={`stage-${result.company.name}`}
                          order={result.company.order}
                          name={result.company.name}
                          description={result.company.description}
                          website={result.company.website}
                          founders={result.company.founders}
                          tags={result.company.tags}
                          presenting={result.company.presenting}
                          badges={['Live on Stage', result.company.segment.replace(' Demos', '')]}
                        />
                      ) : (
                        <CompanyCard
                          key={`fair-${result.company.name}`}
                          order={result.company.order}
                          name={result.company.name}
                          description={result.company.description}
                          website={result.company.website}
                          founders={result.company.founders}
                          tags={result.company.tags}
                          badges={['Startup Fair']}
                        />
                      ),
                    )}
                  </div>
                )}
              </>
            ) : part === 'stage' ? (
              <>
                <p className="text-sm text-muted-foreground">
                  {SHOWCASE_COMPANIES.length} companies · listed in order of performance
                </p>

                <div className="space-y-2">
                  {SHOWCASE_COMPANIES.map((c) => (
                    <CompanyCard
                      key={c.name}
                      order={c.order}
                      name={c.name}
                      description={c.description}
                      website={c.website}
                      founders={c.founders}
                      tags={c.tags}
                      presenting={c.presenting}
                      badges={[c.segment.replace(' Demos', '')]}
                    />
                  ))}
                </div>
              </>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">
                  {FAIR_COMPANIES.length} exhibitors · listed alphabetically
                </p>

                <div className="space-y-2">
                  {FAIR_COMPANIES.map((c) => (
                    <CompanyCard
                      key={c.name}
                      order={c.order}
                      name={c.name}
                      description={c.description}
                      website={c.website}
                      founders={c.founders}
                      tags={c.tags}
                      badges={['Early Stage']}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Event credits — sticky footer so they stay visible */}
          <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/60 bg-showcase/95 backdrop-blur-sm py-2 px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
            <p className="text-[11px] sm:text-xs text-center leading-snug text-showcase-foreground/80">
              Planning powered by{' '}
              <a
                href="https://www.surfboard.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium underline underline-offset-2 hover:text-showcase-foreground transition-colors"
              >
                Surfboard
              </a>
              {' · '}
              Event photography by{' '}
              <a
                href="https://snapmatephoto.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium underline underline-offset-2 hover:text-showcase-foreground transition-colors"
              >
                SnapMatePhoto
              </a>
              {' · '}
              <Link
                to="/feedback"
                className="font-medium underline underline-offset-2 hover:text-showcase-foreground transition-colors"
              >
                Share feedback
              </Link>
            </p>
          </div>
        </div>
      </AppLayout>
    </>
  );
}
