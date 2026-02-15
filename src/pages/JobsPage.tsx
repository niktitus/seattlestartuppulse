import { useState, useMemo } from 'react';
import { Loader2, Map } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import JobCard from '@/components/jobs/JobCard';
import JobFilters from '@/components/jobs/JobFilters';
import SelectedJobsBar from '@/components/jobs/SelectedJobsBar';
import SubmitJobDialog from '@/components/jobs/SubmitJobDialog';
import { StageBenchmarkTooltip, StageRolesTooltip } from '@/components/jobs/StageBenchmarkTooltip';
import JobsMap from '@/components/jobs/JobsMap';
import DigestSignup from '@/components/digest/DigestSignup';
import ExitIntentModal from '@/components/digest/ExitIntentModal';
import { Button } from '@/components/ui/button';
import { useJobs } from '@/hooks/useJobs';
import type { JobFilters as JobFiltersType, JobSortOption, FundingStage } from '@/types/jobs';
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

export default function JobsPage() {
  const { data: jobs = [], isLoading } = useJobs();
  const [filters, setFilters] = useState<JobFiltersType>(defaultFilters);
  const [sortBy, setSortBy] = useState<JobSortOption>('newest');
  const [selectedJobIds, setSelectedJobIds] = useState<Set<string>>(new Set());
  const [showMap, setShowMap] = useState(true);
  const [hoveredJobId, setHoveredJobId] = useState<string | null>(null);

  // Filter jobs
  const filteredJobs = useMemo(() => {
    let result = jobs.filter(job => {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = 
          job.job_title.toLowerCase().includes(searchLower) ||
          job.company_name.toLowerCase().includes(searchLower) ||
          job.description?.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      if (filters.fundingStages.length > 0 && !filters.fundingStages.includes(job.funding_stage)) {
        return false;
      }

      if (filters.departments.length > 0 && !filters.departments.includes(job.department)) {
        return false;
      }

      if (filters.workModels.length > 0 && !filters.workModels.includes(job.work_model)) {
        return false;
      }

      if (filters.remoteFirst && job.work_model !== 'Remote-first' && job.work_model !== 'Remote') {
        return false;
      }

      if (filters.postedWithin !== 'all') {
        const daysAgo = parseInt(filters.postedWithin);
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - daysAgo);
        if (new Date(job.created_at) < cutoff) return false;
      }

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
        result.sort((a, b) => STAGE_ORDER[a.funding_stage as FundingStage] - STAGE_ORDER[b.funding_stage as FundingStage]);
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
    <AppLayout 
      activeTab="resources" 
    >
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl font-bold text-foreground">Startup Jobs in Seattle</h2>
            <p className="text-sm text-muted-foreground">Open roles at Seattle-area startups</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={showMap ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowMap(!showMap)}
              className="gap-1.5 hidden lg:flex"
            >
              <Map className="h-4 w-4" />
              {showMap ? 'Hide Map' : 'Show Map'}
            </Button>
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

        {/* Main content with optional map */}
        <div className={`mt-6 ${showMap ? 'lg:flex lg:gap-6' : ''}`}>
          {/* Job Listings */}
          <div className={showMap ? 'lg:w-3/5' : 'w-full'}>
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
                  <div
                    key={job.id}
                    onMouseEnter={() => setHoveredJobId(job.id)}
                    onMouseLeave={() => setHoveredJobId(null)}
                  >
                    <JobCard
                      job={job}
                      isSelected={selectedJobIds.has(job.id)}
                      onSelect={handleSelectJob}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Map Panel - Desktop only */}
          {showMap && (
            <div className="hidden lg:block lg:w-2/5">
              <div className="sticky top-32">
                <JobsMap 
                  jobs={filteredJobs} 
                  hoveredJobId={hoveredJobId}
                  onJobHover={setHoveredJobId}
                />
              </div>
            </div>
          )}
        </div>

        {/* Digest Signup */}
        <div className="mt-12 max-w-2xl">
          <DigestSignup sourceTab="jobs" />
        </div>
      </div>

      {/* Selected Jobs Bar */}
      <SelectedJobsBar 
        selectedJobs={selectedJobs} 
        onClearSelection={clearSelection} 
      />

      {/* Exit Intent Modal */}
      <ExitIntentModal sourceTab="jobs" />
    </AppLayout>
  );
}
