import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { StartupJob, FundingStage, Department, WorkModel, SalaryType } from '@/types/jobs';

export function useJobs() {
  return useQuery({
    queryKey: ['startup-jobs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('startup_jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Map database types to our TypeScript types
      return (data || []).map(job => ({
        ...job,
        funding_stage: job.funding_stage as FundingStage,
        department: job.department as Department,
        work_model: job.work_model as WorkModel,
        salary_type: job.salary_type as SalaryType,
      })) as StartupJob[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function getJobAge(createdAt: string): 'new' | 'expiring' | 'normal' {
  const created = new Date(createdAt);
  const now = new Date();
  const daysSinceCreated = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysSinceCreated < 7) return 'new';
  if (daysSinceCreated >= 25) return 'expiring';
  return 'normal';
}

export function formatSalary(job: StartupJob): string {
  if (job.salary_type === 'Range' && job.salary_min && job.salary_max) {
    return `$${(job.salary_min / 1000).toFixed(0)}K - $${(job.salary_max / 1000).toFixed(0)}K`;
  }
  if (job.salary_type === 'Range' && job.salary_min) {
    return `$${(job.salary_min / 1000).toFixed(0)}K+`;
  }
  return job.salary_type;
}

export function formatEquity(job: StartupJob): string | null {
  if (job.equity_min && job.equity_max) {
    return `${job.equity_min}% - ${job.equity_max}%`;
  }
  if (job.equity_min) {
    return `${job.equity_min}%+`;
  }
  return null;
}
