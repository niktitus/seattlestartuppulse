import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { STARTUP_SUBPAGES } from './startupData';

export default function StartupSubpages() {
  const [activeSubpage, setActiveSubpage] = useState(0);
  const subpage = STARTUP_SUBPAGES[activeSubpage];

  return (
    <div className="space-y-4">
      {/* Sub-navigation pills */}
      <div className="flex flex-wrap items-center gap-2 overflow-x-auto scrollbar-hide">
        {STARTUP_SUBPAGES.map((sp, i) => (
          <button
            key={sp.label}
            onClick={() => setActiveSubpage(i)}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium transition-colors border whitespace-nowrap",
              activeSubpage === i
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-transparent text-foreground border-border hover:border-foreground/30"
            )}
          >
            {sp.label}
          </button>
        ))}
      </div>

      {/* Subtitle */}
      <p className="text-[13px] text-muted-foreground italic">{subpage.subtitle}</p>

      {/* Resource cards */}
      <div className="space-y-2">
        {subpage.resources.map((item) => (
          <a
            key={item.url}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start justify-between gap-4 bg-card border border-border rounded-lg p-4 hover:bg-muted/40 transition-colors group"
          >
            <div className="flex-1 min-w-0 space-y-1">
              <h3 className="font-semibold text-[15px] text-foreground group-hover:text-primary transition-colors">
                {item.title}
              </h3>
              <p className="text-[13px] text-muted-foreground line-clamp-2">{item.description}</p>
              <p className="text-[11px] font-mono text-muted-foreground/70">
                {item.source}
                {item.sourceNote && <span> · {item.sourceNote}</span>}
              </p>
            </div>
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary shrink-0 mt-1 transition-colors" />
          </a>
        ))}
      </div>
    </div>
  );
}
