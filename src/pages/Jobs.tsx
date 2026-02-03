import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import MainNav from '@/components/navigation/MainNav';
import JobCard from '@/components/jobs/JobCard';
import JobFilters from '@/components/jobs/JobFilters';
import SelectedJobsBar from '@/components/jobs/SelectedJobsBar';
import SubmitJobDialog from '@/components/jobs/SubmitJobDialog';
import { StageBenchmarkTooltip, StageRolesTooltip } from '@/components/jobs/StageBenchmarkTooltip';
import { Badge } from '@/components/ui/badge';
import { useJobs } from '@/hooks/useJobs';
import type { JobFilters as JobFiltersType, JobSortOption, StartupJob } from '@/types/jobs';
import { STAGE_ORDER } from '@/types/jobs';

const defaultFilters: JobFiltersType = {
  fundingStages: [],
  departments: [],
  workModels: [],
  salaryMin: 0,
  salaryMax: 500000,
  postedWithin: 'all',
  remoteFirst: false,
  search: '',
};

export default function Jobs() {
  const { data: jobs = [], isLoading } = useJobs();
  const [filters, setFilters] = useState<JobFiltersType>(defaultFilters);
  const [sortBy, setSortBy] = useState<JobSortOption>('newest');
  const [selectedJobIds, setSelectedJobIds] = useState<Set<string>>(new Set());

  // Filter jobs
  const filteredJobs = useMemo(() => {
    let result = jobs.filter(job => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = 
          job.job_title.toLowerCase().includes(searchLower) ||
          job.company_name.toLowerCase().includes(searchLower) ||
          job.description?.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Funding stage filter
      if (filters.fundingStages.length > 0 && !filters.fundingStages.includes(job.funding_stage)) {
        return false;
      }

      // Department filter
      if (filters.departments.length > 0 && !filters.departments.includes(job.department)) {
        return false;
      }

      // Work model filter
      if (filters.workModels.length > 0 && !filters.workModels.includes(job.work_model)) {
        return false;
      }

      // Remote-first filter
      if (filters.remoteFirst && job.work_model !== 'Remote-first' && job.work_model !== 'Remote') {
        return false;
      }

      // Posted within filter
      if (filters.postedWithin !== 'all') {
        const daysAgo = parseInt(filters.postedWithin);
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - daysAgo);
        if (new Date(job.created_at) < cutoff) return false;
      }

      // Salary filter
      if (job.salary_max && job.salary_max < filters.salaryMin) return false;
      if (job.salary_min && job.salary_min > filters.salaryMax) return false;

      return true;
    });

    // Sort
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'salary-high':
        result.sort((a, b) => (b.salary_max || 0) - (a.salary_max || 0));
        break;
      case 'stage-early':
        result.sort((a, b) => STAGE_ORDER[a.funding_stage] - STAGE_ORDER[b.funding_stage]);
        break;
      case 'alphabetical':
        result.sort((a, b) => a.company_name.localeCompare(b.company_name));
        break;
    }

    return result;
  }, [jobs, filters, sortBy]);

  const selectedJobs = useMemo(() => {
    return jobs.filter(job => selectedJobIds.has(job.id));
  }, [jobs, selectedJobIds]);

  const handleSelectJob = (id: string, selected: boolean) => {
    setSelectedJobIds(prev => {
      const next = new Set(prev);
      if (selected) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  };

  const clearSelection = () => setSelectedJobIds(new Set());

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Link 
                to="/"
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Link>
              <div>
                <h1 className="text-xl font-bold text-foreground">Startup Jobs in Seattle</h1>
                <p className="text-sm text-muted-foreground">Open roles at Seattle-area startups</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MainNav showFullNav={false} />
              <SubmitJobDialog />
            </div>
          </div>

          {/* Educational Tooltips */}
          <div className="flex items-center gap-4 mb-4">
            <StageBenchmarkTooltip />
            <StageRolesTooltip />
          </div>

          {/* Filters */}
          <JobFilters
            filters={filters}
            onFiltersChange={setFilters}
            sortBy={sortBy}
            onSortChange={setSortBy}
            totalJobs={jobs.length}
            filteredCount={filteredJobs.length}
          />
        </div>
      </header>

      {/* Job Listings */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No jobs match your filters.</p>
            {jobs.length === 0 && (
              <p className="text-sm text-muted-foreground mt-2">
                Be the first to post a job!
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredJobs.map(job => (
              <JobCard
                key={job.id}
                job={job}
                isSelected={selectedJobIds.has(job.id)}
                onSelect={handleSelectJob}
              />
            ))}
          </div>
        )}
      </main>

      {/* Selected Jobs Bar */}
      <SelectedJobsBar 
        selectedJobs={selectedJobs} 
        onClearSelection={clearSelection} 
      />

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30">
        <div className="max-w-5xl mx-auto px-4 py-4 text-center">
          <p className="text-sm text-muted-foreground">
            Part of{' '}
            <Link to="/" className="text-primary hover:underline">
              Seattle Startup Pulse
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
