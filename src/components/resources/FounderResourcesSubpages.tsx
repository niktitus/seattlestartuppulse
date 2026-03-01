import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResourceLink {
  id: string;
  name: string;
  url: string;
  description: string;
  category: string;
  sort_order: number;
}

const FOUNDER_CATEGORIES = ['Communities', 'Diagnostic Tools', 'Startup Resources', 'Operational'];

interface FounderResourcesSubpagesProps {
  resources: ResourceLink[];
  loading: boolean;
}

export default function FounderResourcesSubpages({ resources, loading }: FounderResourcesSubpagesProps) {
  const availableCategories = FOUNDER_CATEGORIES.filter(cat =>
    resources.some(r => r.category === cat)
  );
  const [activeTab, setActiveTab] = useState(availableCategories[0] || FOUNDER_CATEGORIES[0]);

  const activeItems = resources.filter(r => r.category === activeTab);

  return (
    <div className="space-y-5">
      {/* Pill row — horizontal scroll on mobile */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {availableCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={cn(
              'px-4 py-1.5 rounded-full text-sm font-medium transition-colors border whitespace-nowrap shrink-0',
              activeTab === cat
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-transparent text-foreground border-border hover:border-foreground/30'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Resource cards */}
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
            className="flex items-center justify-between gap-4 bg-card border border-border rounded-lg p-4 hover:bg-muted/40 transition-colors group"
          >
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-[15px] text-foreground group-hover:text-primary transition-colors">{item.name}</h3>
              <p className="text-[13px] text-muted-foreground line-clamp-1">{item.description}</p>
            </div>
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary shrink-0 transition-colors" />
          </a>
        ))}
      </div>
    </div>
  );
}
