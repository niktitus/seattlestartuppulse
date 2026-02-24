import { useState, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import DigestSignup from '@/components/digest/DigestSignup';
import ExitIntentModal from '@/components/digest/ExitIntentModal';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

interface ResourceLink {
  id: string;
  name: string;
  url: string;
  description: string;
  category: string;
  sort_order: number;
}

const SECTION_ORDER = ['Communities', 'Diagnostic Tools', 'Startup Resources', 'Operational', 'I want to start a company'];

export default function ResourcesPage() {
  const [resources, setResources] = useState<ResourceLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('Communities');

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

  const categories = SECTION_ORDER.filter(cat => resources.some(r => r.category === cat));
  // Include any categories from DB not in our predefined order
  const extraCats = [...new Set(resources.map(r => r.category))].filter(c => !SECTION_ORDER.includes(c));
  const allCategories = [...categories, ...extraCats];

  const activeItems = resources.filter(r => r.category === activeSection);

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
        </div>

        {/* Section pills */}
        <div className="flex flex-wrap items-center gap-2">
          {allCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveSection(cat)}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium transition-colors border",
                activeSection === cat
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-transparent text-foreground border-border hover:border-foreground/30"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Resource list */}
        <div className="space-y-2">
          {loading ? (
            <p className="text-center text-muted-foreground py-16">Loading...</p>
          ) : activeItems.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No resources in this category yet.</p>
          ) : activeItems.map((item) => (
            <a 
              key={item.id} 
              href={item.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-4 bg-card border border-border rounded-lg p-4 hover:shadow-md transition-all group"
            >
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-[15px] text-foreground group-hover:text-primary transition-colors">{item.name}</h3>
                <p className="text-[13px] text-muted-foreground line-clamp-1">{item.description}</p>
              </div>
              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary shrink-0 transition-colors" />
            </a>
          ))}
        </div>

        {/* Digest Signup */}
        <div className="mt-8">
          <DigestSignup sourceTab="resources" />
        </div>
      </div>

      <ExitIntentModal sourceTab="resources" />
    </AppLayout>
  );
}
