// Fractional services types

export type ServiceType = 
  | 'Fractional CFO'
  | 'Fractional CMO'
  | 'Fractional COO/Chief of Staff'
  | 'Fractional CTO/VP Engineering'
  | 'HR/People Operations'
  | 'Legal/General Counsel'
  | 'Product Leadership'
  | 'Growth/Marketing'
  | 'Sales Leadership'
  | 'Operations & Systems'
  | 'Fundraising Advisory';

export type EngagementModel = 
  | 'Monthly Retainer'
  | 'Hourly Consulting'
  | 'Project-Based'
  | 'Equity Consideration Available';

export type PriceRange = 
  | '$5-10K/month'
  | '$10-20K/month'
  | '$20K+/month'
  | 'Custom/Project-based'
  | 'Hourly Rate Available';

export type IndustrySpecialty = 
  | 'B2B SaaS'
  | 'Marketplace'
  | 'Hardware'
  | 'Consumer'
  | 'Fintech'
  | 'Healthcare'
  | 'AI/ML'
  | 'Climate Tech'
  | 'E-commerce';

export interface FractionalProvider {
  id: string;
  created_at: string;
  name: string;
  service_type: ServiceType;
  engagement_models: EngagementModel[];
  price_range: PriceRange;
  years_experience: number;
  specialties: IndustrySpecialty[];
  linkedin_url: string;
  website_url: string | null;
  contact_method: string;
  description: string;
  testimonial: string | null;
  is_fi_affiliated: boolean;
  is_approved: boolean;
}

export interface FractionalFilters {
  serviceTypes: ServiceType[];
  priceRanges: PriceRange[];
  engagementModels: EngagementModel[];
  specialties: IndustrySpecialty[];
  minExperience: number;
  fiAffiliatedOnly: boolean;
  search: string;
}

export type FractionalSortOption = 'experience' | 'newest' | 'alphabetical' | 'price-low';

export const SERVICE_TYPES: ServiceType[] = [
  'Fractional CFO',
  'Fractional CMO',
  'Fractional COO/Chief of Staff',
  'Fractional CTO/VP Engineering',
  'HR/People Operations',
  'Legal/General Counsel',
  'Product Leadership',
  'Growth/Marketing',
  'Sales Leadership',
  'Operations & Systems',
  'Fundraising Advisory',
];

export const ENGAGEMENT_MODELS: EngagementModel[] = [
  'Monthly Retainer',
  'Hourly Consulting',
  'Project-Based',
  'Equity Consideration Available',
];

export const PRICE_RANGES: PriceRange[] = [
  '$5-10K/month',
  '$10-20K/month',
  '$20K+/month',
  'Custom/Project-based',
  'Hourly Rate Available',
];

export const INDUSTRY_SPECIALTIES: IndustrySpecialty[] = [
  'B2B SaaS',
  'Marketplace',
  'Hardware',
  'Consumer',
  'Fintech',
  'Healthcare',
  'AI/ML',
  'Climate Tech',
  'E-commerce',
];

// Service type icons/colors for visual distinction
export const SERVICE_TYPE_COLORS: Record<ServiceType, string> = {
  'Fractional CFO': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  'Fractional CMO': 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
  'Fractional COO/Chief of Staff': 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-300',
  'Fractional CTO/VP Engineering': 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300',
  'HR/People Operations': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  'Legal/General Counsel': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  'Product Leadership': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  'Growth/Marketing': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  'Sales Leadership': 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
  'Operations & Systems': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
  'Fundraising Advisory': 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300',
};
