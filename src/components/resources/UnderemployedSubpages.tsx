import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UNDEREMPLOYED_SUBPAGES } from './underemployedData';

const PILL_LABELS = UNDEREMPLOYED_SUBPAGES.map((sp) => sp.label);

export default function UnderemployedSubpages() {
  const [activeTab, setActiveTab] = useState(PILL_LABELS[0]);

  const subpage = UNDEREMPLOYED_SUBPAGES.find((sp) => sp.label === activeTab)!;

  return (
    <div className="space-y-5">
      {/* Intro paragraph */}
      <p className="text-[14px] text-muted-foreground leading-relaxed">
        Seattle's tech market has shed thousands of jobs in recent years. Whether you were laid off,
        underutilized, or just getting started — this page is for you. Find your people first, then
        figure out your next move.
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

      {/* Callout box — Immediate Support only */}
      {activeTab === 'Immediate Support' && (
        <div className="rounded-lg border-l-[3px] border-l-primary bg-primary/5 p-3 text-[13px] text-foreground leading-relaxed">
          <strong>If you were laid off in the last 7 days:</strong> File for unemployment at{' '}
          <a
            href="https://esd.wa.gov/unemployment"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-primary"
          >
            esd.wa.gov
          </a>{' '}
          before doing anything else. Benefits can be retroactive, but only within a limited window.
          Then call WorkSource at{' '}
          <span className="font-medium">(206) 684-0502</span> to schedule a free career
          consultation.
        </div>
      )}

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
