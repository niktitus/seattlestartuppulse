import { ExternalLink, MapPin, Laptop, Building2, Globe } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import type { StartupJob } from '@/types/jobs';
import { getJobAge, formatSalary, formatEquity } from '@/hooks/useJobs';

interface JobCardProps {
  job: StartupJob;
  isSelected: boolean;
  onSelect: (id: string, selected: boolean) => void;
}

const workModelIcons = {
  'Remote': Laptop,
  'Remote-first': Laptop,
  'Hybrid': Globe,
  'In-office': Building2,
};

const fundingStageColors: Record<string, string> = {
  'Pre-seed': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  'Seed': 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300',
  'Series A': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
  'Series B': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  'Series C+': 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
  'Bootstrapped': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
};

export default function JobCard({ job, isSelected, onSelect }: JobCardProps) {
  const age = getJobAge(job.created_at);
  const WorkModelIcon = workModelIcons[job.work_model];
  const equity = formatEquity(job);

  return (
    <div 
      className={`bg-card border rounded-lg p-4 transition-all hover:shadow-card-hover ${
        isSelected ? 'border-primary ring-1 ring-primary/20' : 'border-border'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Selection Checkbox */}
        <Checkbox 
          checked={isSelected}
          onCheckedChange={(checked) => onSelect(job.id, checked === true)}
          className="mt-1"
        />

        <div className="flex-1 min-w-0">
          {/* Top Row: Badges */}
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <Badge className={fundingStageColors[job.funding_stage]}>
              {job.funding_stage}
            </Badge>
            <Badge variant="muted">{job.department}</Badge>
            {age === 'new' && (
              <Badge className="bg-primary/10 text-primary">
                New
              </Badge>
            )}
            {age === 'expiring' && (
              <Badge className="bg-secondary/20 text-secondary-foreground">
                Expiring Soon
              </Badge>
            )}
          </div>

          {/* Job Title */}
          <h3 className="font-semibold text-foreground text-lg mb-1">{job.job_title}</h3>

          {/* Company */}
          <div className="flex items-center gap-2 mb-2">
            {job.company_url ? (
              <a 
                href={job.company_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                {job.company_name}
              </a>
            ) : (
              <span className="font-medium text-foreground">{job.company_name}</span>
            )}
            {job.founder_name && (
              <span className="text-sm text-muted-foreground">
                • Founded by{' '}
                {job.founder_linkedin ? (
                  <a 
                    href={job.founder_linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {job.founder_name}
                  </a>
                ) : (
                  job.founder_name
                )}
              </span>
            )}
          </div>

          {/* Details Row */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
            <span className="flex items-center gap-1">
              <WorkModelIcon className="h-4 w-4" />
              {job.work_model}
            </span>
            {job.company_address && (
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {job.company_address}
              </span>
            )}
            <span className="font-medium text-foreground">{formatSalary(job)}</span>
            {equity && (
              <span className="text-primary">+ {equity} equity</span>
            )}
          </div>

          {/* Description */}
          {job.description && (
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{job.description}</p>
          )}
        </div>

        {/* Apply Button */}
        <Button asChild size="sm" className="shrink-0">
          <a 
            href={job.application_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1.5"
          >
            Apply
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </Button>
      </div>
    </div>
  );
}
