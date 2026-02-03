// Learning & Development types

export type SkillCategory = 'Fundraising' | 'Product' | 'Sales' | 'Operations' | 'Leadership' | 'Technical' | 'Marketing' | 'Legal/Compliance';
export type LearningFormat = 'Self-paced' | 'Live cohort' | 'Workshop' | 'Bootcamp' | 'Certification program';
export type DifficultyLevel = 'Intermediate' | 'Advanced' | 'Expert';
export type TimeToROI = 'Apply immediately' | 'Long-term skill building';
export type PriceType = 'Free' | 'Paid' | 'Price on website';

export interface LearningResource {
  id: string;
  created_at: string;
  updated_at: string;
  course_name: string;
  course_url: string;
  description: string | null;
  instructor_name: string;
  instructor_linkedin: string | null;
  skill_category: SkillCategory;
  format: LearningFormat;
  difficulty: DifficultyLevel;
  time_to_roi: TimeToROI;
  price_type: PriceType;
  price_amount: number | null;
  time_commitment: string | null;
  is_free: boolean;
  has_certification: boolean;
  is_founder_recommended: boolean;
  is_approved: boolean;
}

export interface LearningFilters {
  categories: SkillCategory[];
  formats: LearningFormat[];
  difficulties: DifficultyLevel[];
  timeToROI: TimeToROI[];
  priceTypes: PriceType[];
  freeOnly: boolean;
  certificationOnly: boolean;
  founderRecommendedOnly: boolean;
  search: string;
}

export type LearningSortOption = 'newest' | 'price-low' | 'alphabetical' | 'roi-immediate';

export const SKILL_CATEGORIES: SkillCategory[] = ['Fundraising', 'Product', 'Sales', 'Operations', 'Leadership', 'Technical', 'Marketing', 'Legal/Compliance'];
export const LEARNING_FORMATS: LearningFormat[] = ['Self-paced', 'Live cohort', 'Workshop', 'Bootcamp', 'Certification program'];
export const DIFFICULTY_LEVELS: DifficultyLevel[] = ['Intermediate', 'Advanced', 'Expert'];
export const TIME_TO_ROI_OPTIONS: TimeToROI[] = ['Apply immediately', 'Long-term skill building'];
export const PRICE_TYPES: PriceType[] = ['Free', 'Paid', 'Price on website'];

// Category colors for visual distinction
export const CATEGORY_COLORS: Record<SkillCategory, string> = {
  'Fundraising': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  'Product': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  'Sales': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  'Operations': 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-300',
  'Leadership': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  'Technical': 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300',
  'Marketing': 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
  'Legal/Compliance': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
};
