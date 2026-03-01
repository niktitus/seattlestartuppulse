import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import DigestSignup from '@/components/digest/DigestSignup';
import ExitIntentModal from '@/components/digest/ExitIntentModal';
import StartupSubpages from '@/components/resources/StartupSubpages';
import UnderemployedSubpages from '@/components/resources/UnderemployedSubpages';
import FounderResourcesSubpages from '@/components/resources/FounderResourcesSubpages';
import { Badge } from '@/components/ui/badge';
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

type ActiveSection = typeof START_COMPANY_SECTION | typeof UNDEREMPLOYED_SECTION | typeof FOUNDER_RESOURCES_SECTION | null;

export default function ResourcesPage() {
  const [searchParams] = useSearchParams();
  const initialSection = searchParams.get('section') as ActiveSection || null;
  const [resources, setResources] = useState<ResourceLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<ActiveSection>(initialSection);

  useEffect(() => {
    const fetchResources = async () => {
      const { data } = await supabase
        .from('resource_links')
        .select('*')
        .order('sort_order', { ascending: true });
      setResources((data as ResourceLink[]) || []);
      setLoading(false);
    };
    fetchResources();
  }, []);

  const renderContent = () => {
    if (activeSection === START_COMPANY_SECTION) return <StartupSubpages />;
    if (activeSection === UNDEREMPLOYED_SECTION) return <UnderemployedSubpages />;
    if (activeSection === FOUNDER_RESOURCES_SECTION) return <FounderResourcesSubpages resources={resources} loading={loading} />;
    return null;
  };

  return (
    <AppLayout activeTab="resources">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Resources</h1>
          <p className="text-sm text-muted-foreground">Curated links for Seattle founders and operators</p>
        </div>

        {/* Feature call-outs */}
        <div className="space-y-2">
          <Link 
            to="/learning"
            className="flex items-center justify-between bg-card border border-border rounded-lg p-4 hover:shadow-md transition-all group"
          >
            <div>
              <h3 className="font-semibold text-[15px] text-foreground group-hover:text-primary transition-colors">Learning & Development</h3>
              <p className="text-[13px] text-muted-foreground">Courses for founders & operators</p>
            </div>
            <span className="text-muted-foreground text-sm">→</span>
          </Link>

          <Link 
            to="/fractional"
            className="flex items-center justify-between bg-card border border-border rounded-lg p-4 hover:shadow-md transition-all group"
          >
            <div>
              <h3 className="font-semibold text-[15px] text-foreground group-hover:text-primary transition-colors">Fractional Services</h3>
              <p className="text-[13px] text-muted-foreground">Find fractional executives and operators</p>
            </div>
            <Badge variant="outline" className="text-[10px] font-medium rounded-sm px-1.5 py-0 shrink-0">
              Coming Soon
            </Badge>
          </Link>

          <button 
            onClick={() => setActiveSection(FOUNDER_RESOURCES_SECTION)}
            className="flex items-center justify-between bg-card border border-border rounded-lg p-4 hover:shadow-md transition-all group w-full text-left"
          >
            <div>
              <h3 className="font-semibold text-[15px] text-foreground group-hover:text-primary transition-colors">Founder Resources</h3>
              <p className="text-[13px] text-muted-foreground">Communities, tools, and operational links for founders</p>
            </div>
            <span className="text-muted-foreground text-sm">→</span>
          </button>

          <button 
            onClick={() => setActiveSection(START_COMPANY_SECTION)}
            className="flex items-center justify-between bg-card border border-border rounded-lg p-4 hover:shadow-md transition-all group w-full text-left"
          >
            <div>
              <h3 className="font-semibold text-[15px] text-foreground group-hover:text-primary transition-colors">I Want to Start a Company</h3>
              <p className="text-[13px] text-muted-foreground">Resources to help you get started</p>
            </div>
            <span className="text-muted-foreground text-sm">→</span>
          </button>

          <button 
            onClick={() => setActiveSection(UNDEREMPLOYED_SECTION)}
            className="flex items-center justify-between bg-card border border-border rounded-lg p-4 hover:shadow-md transition-all group w-full text-left"
          >
            <div>
              <h3 className="font-semibold text-[15px] text-foreground group-hover:text-primary transition-colors">I'm Underemployed or Between Roles</h3>
              <p className="text-[13px] text-muted-foreground">Support, community, and tools for your next move</p>
            </div>
            <span className="text-muted-foreground text-sm">→</span>
          </button>
        </div>

        {/* Active section content */}
        {renderContent()}

        {/* Digest Signup */}
        <div className="mt-8">
          <DigestSignup sourceTab="resources" />
        </div>
      </div>

      <ExitIntentModal sourceTab="resources" />
    </AppLayout>
  );
}
