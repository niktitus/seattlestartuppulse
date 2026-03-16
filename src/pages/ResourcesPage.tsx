import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import DigestSignup from '@/components/digest/DigestSignup';
import ExitIntentModal from '@/components/digest/ExitIntentModal';
import StartupSubpages from '@/components/resources/StartupSubpages';
import UnderemployedSubpages from '@/components/resources/UnderemployedSubpages';
import FounderResourcesSubpages from '@/components/resources/FounderResourcesSubpages';
import Seo from '@/components/seo/Seo';
import { supabase } from '@/integrations/supabase/client';

interface ResourceLink {
  id: string;
  name: string;
  url: string;
  description: string;
  category: string;
  sort_order: number;
}

const START_COMPANY_SECTION = 'I want to start a company';
const UNDEREMPLOYED_SECTION = "I'm Underemployed or Between Roles";
const FOUNDER_RESOURCES_SECTION = 'Founder Resources';

type ActiveSection =
  | typeof START_COMPANY_SECTION
  | typeof UNDEREMPLOYED_SECTION
  | typeof FOUNDER_RESOURCES_SECTION
  | null;

export default function ResourcesPage() {
  const [searchParams] = useSearchParams();
  const initialSection = (searchParams.get('section') as ActiveSection) || null;
  const [resources, setResources] = useState<ResourceLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<ActiveSection>(initialSection);

  useEffect(() => {
    const fetchResources = async () => {
      const { data } = await supabase.from('resource_links').select('*').order('sort_order', { ascending: true });
      setResources((data as ResourceLink[]) || []);
      setLoading(false);
    };
    fetchResources();
  }, []);

  const renderContent = () => {
    if (activeSection === START_COMPANY_SECTION) return <StartupSubpages />;
    if (activeSection === UNDEREMPLOYED_SECTION) return <UnderemployedSubpages />;
    if (activeSection === FOUNDER_RESOURCES_SECTION) {
      return <FounderResourcesSubpages resources={resources} loading={loading} />;
    }
    return null;
  };

  return (
    <AppLayout activeTab="resources">
      <Seo
        title="Seattle Startup Resources for Founders"
        description="Explore Seattle startup resources for people starting a company, navigating layoffs, leveling up skills, and finding founder communities, operators, and support networks."
        path="/resources"
        keywords={[
          'Seattle startup resources',
          'start a company Seattle',
          'Seattle layoff resources',
          'Seattle founder resources',
          'Seattle tech community',
          'Seattle operator resources',
        ]}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Seattle Startup Resources for Founders and Tech Workers',
          description:
            'Curated Seattle resources for founders, aspiring entrepreneurs, laid-off tech workers, and operators exploring their next step.',
          url: 'https://seattlestartuppulse.lovable.app/resources',
        }}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Seattle Startup Resources</h1>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            Curated guides for Seattle tech workers who want to start a company, plug into the founder ecosystem,
            or regain momentum after a layoff.
          </p>
        </div>

        <section className="rounded-lg border border-border bg-card px-4 py-4 sm:px-5">
          <h2 className="text-base font-semibold text-foreground">Built for career transitions and company building</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Use these Seattle-focused resources to find startup education, founder communities, practical tools,
            and support for the messy middle between getting laid off, exploring entrepreneurship, and building your next chapter.
          </p>
        </section>

        <div className="space-y-2">
          <Link
            to="/learning"
            className="flex items-center justify-between bg-card border border-border rounded-lg p-4 hover:shadow-md transition-all group"
          >
            <div>
              <h2 className="font-semibold text-[15px] text-foreground group-hover:text-primary transition-colors">
                Learning & Development
              </h2>
              <p className="text-[13px] text-muted-foreground">Courses for founders, operators, and ambitious tech workers</p>
            </div>
            <span className="text-muted-foreground text-sm">→</span>
          </Link>

          <Link
            to="/fractional"
            className="flex items-center justify-between bg-card border border-border rounded-lg p-4 hover:shadow-md transition-all group"
          >
            <div>
              <h2 className="font-semibold text-[15px] text-foreground group-hover:text-primary transition-colors">
                Fractional Services
              </h2>
              <p className="text-[13px] text-muted-foreground">Find Seattle-area fractional operators and leadership support</p>
            </div>
            <span className="text-muted-foreground text-sm">→</span>
          </Link>

          <button
            onClick={() => setActiveSection(FOUNDER_RESOURCES_SECTION)}
            className="flex items-center justify-between bg-card border border-border rounded-lg p-4 hover:shadow-md transition-all group w-full text-left"
          >
            <div>
              <h2 className="font-semibold text-[15px] text-foreground group-hover:text-primary transition-colors">
                Founder Resources
              </h2>
              <p className="text-[13px] text-muted-foreground">Communities, tools, and operating links for Seattle founders</p>
            </div>
            <span className="text-muted-foreground text-sm">→</span>
          </button>

          <button
            onClick={() => setActiveSection(START_COMPANY_SECTION)}
            className="flex items-center justify-between bg-card border border-border rounded-lg p-4 hover:shadow-md transition-all group w-full text-left"
          >
            <div>
              <h2 className="font-semibold text-[15px] text-foreground group-hover:text-primary transition-colors">
                I Want to Start a Company
              </h2>
              <p className="text-[13px] text-muted-foreground">Step-by-step startup resources for first-time founders in Seattle</p>
            </div>
            <span className="text-muted-foreground text-sm">→</span>
          </button>

          <button
            onClick={() => setActiveSection(UNDEREMPLOYED_SECTION)}
            className="flex items-center justify-between bg-card border border-border rounded-lg p-4 hover:shadow-md transition-all group w-full text-left"
          >
            <div>
              <h2 className="font-semibold text-[15px] text-foreground group-hover:text-primary transition-colors">
                I'm Underemployed or Between Roles
              </h2>
              <p className="text-[13px] text-muted-foreground">Seattle layoff support, community, and tools for your next move</p>
            </div>
            <span className="text-muted-foreground text-sm">→</span>
          </button>
        </div>

        {renderContent()}

        <div className="mt-8">
          <DigestSignup sourceTab="resources" />
        </div>
      </div>

      <ExitIntentModal sourceTab="resources" />
    </AppLayout>
  );
}
