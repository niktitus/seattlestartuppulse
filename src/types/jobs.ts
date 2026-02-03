// Job board types

export type FundingStage = 'Pre-seed' | 'Seed' | 'Series A' | 'Series B' | 'Series C+' | 'Bootstrapped';
export type Department = 'Engineering' | 'Product' | 'Sales' | 'Marketing' | 'Operations' | 'Design' | 'Data' | 'Finance' | 'Legal' | 'General Management';
export type WorkModel = 'Remote' | 'Hybrid' | 'In-office' | 'Remote-first';
export type SalaryType = 'Range' | 'Equity-heavy' | 'Competitive' | 'TBD';

export interface StartupJob {
  id: string;
  created_at: string;
  updated_at: string;
  expires_at: string;
  job_title: string;
  company_name: string;
  company_url: string | null;
  company_address: string | null;
  founder_name: string | null;
  founder_linkedin: string | null;
  funding_stage: FundingStage;
  department: Department;
  work_model: WorkModel;
  application_url: string;
  salary_type: SalaryType;
  salary_min: number | null;
  salary_max: number | null;
  equity_min: number | null;
  equity_max: number | null;
  description: string | null;
  is_approved: boolean;
  is_expired: boolean;
  renewal_count: number;
}

export interface JobFilters {
  fundingStages: FundingStage[];
  departments: Department[];
  workModels: WorkModel[];
  salaryMin: number;
  salaryMax: number;
  postedWithin: 'all' | '7' | '14' | '30';
  remoteFirst: boolean;
  search: string;
}

export interface JobSubmission {
  submitter_email: string;
  submitter_name?: string;
  job_title: string;
  company_name: string;
  company_url?: string;
  company_address?: string;
  founder_name?: string;
  founder_linkedin?: string;
  funding_stage: string;
  department: string;
  work_model: string;
  application_url: string;
  salary_type: string;
  salary_min?: number;
  salary_max?: number;
  equity_min?: number;
  equity_max?: number;
  description?: string;
}

export type JobSortOption = 'newest' | 'salary-high' | 'stage-early' | 'alphabetical';

export const FUNDING_STAGES: FundingStage[] = ['Pre-seed', 'Seed', 'Series A', 'Series B', 'Series C+', 'Bootstrapped'];
export const DEPARTMENTS: Department[] = ['Engineering', 'Product', 'Sales', 'Marketing', 'Operations', 'Design', 'Data', 'Finance', 'Legal', 'General Management'];
export const WORK_MODELS: WorkModel[] = ['Remote', 'Hybrid', 'In-office', 'Remote-first'];
export const SALARY_TYPES: SalaryType[] = ['Range', 'Equity-heavy', 'Competitive', 'TBD'];

// Stage order for sorting (early to late)
export const STAGE_ORDER: Record<FundingStage, number> = {
  'Pre-seed': 0,
  'Seed': 1,
  'Series A': 2,
  'Series B': 3,
  'Series C+': 4,
  'Bootstrapped': 5,
};
