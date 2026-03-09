import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { STARTUP_SUBPAGES } from './startupData';

const PILL_LABELS = STARTUP_SUBPAGES.map((sp) => sp.label);

export default function StartupSubpages() {
  const [activeTab, setActiveTab] = useState(PILL_LABELS[0]);

  const subpage = STARTUP_SUBPAGES.find((sp) => sp.label === activeTab)!;

  return (
    <div className="space-y-5">
      {/* Intro paragraph */}
      <p className="text-[14px] text-muted-foreground leading-relaxed">
        Building a company in Seattle's ecosystem? This guide covers the key stages — from validating
        your idea to raising your first round — with curated resources from founders who've been there.
      </p>

      {/* Pill row — horizontal scroll on mobile */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {PILL_LABELS.map((label) => (
          <button
            key={label}
            onClick={() => setActiveTab(label)}
            className={cn(
              'px-4 py-1.5 rounded-full text-sm font-medium transition-colors border whitespace-nowrap shrink-0',
              activeTab === label
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-transparent text-foreground border-border hover:border-foreground/30'
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Subpage header */}
      <div>
        <h2 className="text-lg font-semibold text-foreground">{subpage.label}</h2>
        <p className="text-[13px] text-muted-foreground italic mt-1">{subpage.subtitle}</p>
      </div>

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
