import { useMemo } from 'react';
import { MapPin, Building2, ExternalLink } from 'lucide-react';
import type { StartupJob } from '@/types/jobs';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Funding stage colors - using primary green accent
const STAGE_COLORS: Record<string, string> = {
  'Pre-seed': 'bg-primary/40',
  'Seed': 'bg-primary/60',
  'Series A': 'bg-primary/80',
  'Series B': 'bg-primary',
  'Series C+': 'bg-primary',
  'Bootstrapped': 'bg-muted-foreground/50',
};

interface JobsMapProps {
  jobs: StartupJob[];
  hoveredJobId: string | null;
  onJobHover: (id: string | null) => void;
}

// Simple static map representation using a Seattle grid
// In a real implementation, you'd use Mapbox or Google Maps
export default function JobsMap({ jobs, hoveredJobId, onJobHover }: JobsMapProps) {
  // Group jobs by funding stage for the legend
  const jobsByStage = useMemo(() => {
    const grouped: Record<string, number> = {};
    jobs.forEach(job => {
      grouped[job.funding_stage] = (grouped[job.funding_stage] || 0) + 1;
    });
    return grouped;
  }, [jobs]);

  // Create a simple grid representation
  // Each job gets a pseudo-random position based on its company name
  const jobPositions = useMemo(() => {
    return jobs.map(job => {
      // Use a hash of company name to create consistent pseudo-random positions
      let hash = 0;
      for (let i = 0; i < job.company_name.length; i++) {
        hash = ((hash << 5) - hash) + job.company_name.charCodeAt(i);
        hash = hash & hash;
      }
      const x = 10 + (Math.abs(hash % 80)); // 10-90% horizontal
      const y = 10 + (Math.abs((hash >> 8) % 80)); // 10-90% vertical
      return { ...job, x, y };
    });
  }, [jobs]);

  return (
    <div className="bg-card border border-border overflow-hidden">
      {/* Map Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-sm font-medium text-foreground">Seattle Area</span>
          </div>
          <span className="text-xs text-muted-foreground">{jobs.length} companies</span>
        </div>
      </div>

      {/* Map Area */}
      <div className="relative h-72 bg-muted/30 overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 opacity-[0.03]">
          <svg className="w-full h-full">
            <defs>
              <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
                <path d="M 32 0 L 0 0 0 32" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Company pins */}
        {jobPositions.map(job => {
          const isHovered = hoveredJobId === job.id;
          const stageColor = STAGE_COLORS[job.funding_stage] || 'bg-gray-500';
          
          return (
            <div
              key={job.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200"
              style={{ left: `${job.x}%`, top: `${job.y}%` }}
              onMouseEnter={() => onJobHover(job.id)}
              onMouseLeave={() => onJobHover(null)}
            >
              {/* Pin */}
              <div
                className={cn(
                  'w-3 h-3 rounded-full cursor-pointer border-2 border-background shadow-sm',
                  stageColor,
                  isHovered && 'ring-2 ring-primary ring-offset-1 scale-150 z-10'
                )}
              />
              
              {/* Tooltip on hover */}
              {isHovered && (
                <div className="absolute left-1/2 bottom-full -translate-x-1/2 mb-2 z-20 w-52">
                  <div className="bg-popover border border-border rounded-lg shadow-lg p-3 text-left">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-foreground truncate">
                          {job.company_name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {job.job_title}
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-xs shrink-0">
                        {job.funding_stage}
                      </Badge>
                    </div>
                    {job.company_address && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Building2 className="h-3 w-3" />
                        {job.company_address}
                      </p>
                    )}
                    <a
                      href={job.application_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      Apply <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="p-4 border-t border-border">
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {Object.entries(jobsByStage).map(([stage, count]) => (
            <div key={stage} className="flex items-center gap-1.5">
              <div className={cn('w-2 h-2 rounded-full', STAGE_COLORS[stage])} />
              <span className="text-xs text-muted-foreground">
                {stage} <span className="font-medium text-foreground">{count}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
