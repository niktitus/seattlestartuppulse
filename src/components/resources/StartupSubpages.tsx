import { ExternalLink, ArrowLeft } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { STARTUP_SUBPAGES } from './startupData';

export default function StartupSubpages() {
  const [searchParams, setSearchParams] = useSearchParams();
  const subtopic = searchParams.get('subtopic');

  const activeIndex = STARTUP_SUBPAGES.findIndex(
    (sp) => sp.label.toLowerCase() === subtopic?.toLowerCase()
  );
  const subpage = activeIndex >= 0 ? STARTUP_SUBPAGES[activeIndex] : null;

  const navigateTo = (label: string) => {
    setSearchParams({ section: 'I want to start a company', subtopic: label });
  };

  const goBack = () => {
    setSearchParams({ section: 'I want to start a company' });
  };

  // Subpage detail view
  if (subpage) {
    return (
      <div className="space-y-4">
        <button
          onClick={goBack}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back
        </button>

        <div>
          <h2 className="text-lg font-semibold text-foreground">{subpage.label}</h2>
          <p className="text-[13px] text-muted-foreground italic mt-1">{subpage.subtitle}</p>
        </div>

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

  // Topic index view — show cards for each subtopic
  return (
    <div className="space-y-2">
      {STARTUP_SUBPAGES.map((sp) => (
        <button
          key={sp.label}
          onClick={() => navigateTo(sp.label)}
          className="flex items-center justify-between w-full bg-card border border-border rounded-lg p-4 hover:bg-muted/40 transition-colors group text-left"
        >
          <div>
            <h3 className="font-semibold text-[15px] text-foreground group-hover:text-primary transition-colors">
              {sp.label}
            </h3>
            <p className="text-[13px] text-muted-foreground line-clamp-1">{sp.subtitle}</p>
          </div>
          <span className="text-muted-foreground text-sm shrink-0 ml-4">→</span>
        </button>
      ))}
    </div>
  );
}
