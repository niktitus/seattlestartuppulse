export type AudienceType = 'FOUNDER ONLY' | 'OPERATOR ONLY' | 'TECHNICAL' | 'OPEN TO ALL';
export type StageType = 'PRE-REVENUE' | '$0-1M' | '$1M-10M' | '$10M+' | 'ALL STAGES';
export type HostType = 'VC Firms' | 'Accelerators/Incubators' | 'Corporate' | 'Community/Independent';
export type ExpectedSize = '10-25' | '25-50' | '50-100' | '100+';
export type EventFormat = 'virtual' | 'inperson' | 'hybrid';

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  format: EventFormat;
  audience: string[];
  stage: string[];
  type: string;
  organizer: string;
  description: string;
  url: string;
  featured: boolean;
  is_approved: boolean;
  city: string;
  created_at: string;
  // New fields
  cost?: string;
  expected_size?: ExpectedSize;
  outcome_framing?: string;
  host_type?: HostType;
  is_high_signal?: boolean;
  registration_deadline?: string;
  spots_available?: number;
}

export interface EventFilters {
  audience: AudienceType | 'All';
  stage: StageType | 'All';
  hostTypes: HostType[];
  highSignalOnly: boolean;
  thisWeekOnly: boolean;
  freeOnly: boolean;
  spotsAvailable: boolean;
  search: string;
  sortBy: 'date' | 'highSignal' | 'deadline';
}

export const DEFAULT_FILTERS: EventFilters = {
  audience: 'All',
  stage: 'All',
  hostTypes: [],
  highSignalOnly: false,
  thisWeekOnly: false,
  freeOnly: false,
  spotsAvailable: false,
  search: '',
  sortBy: 'date',
};

export const AUDIENCE_OPTIONS: { value: AudienceType | 'All'; label: string; icon: string }[] = [
  { value: 'All', label: 'All Events', icon: '' },
  { value: 'FOUNDER ONLY', label: 'Founder Only', icon: '🎯' },
  { value: 'OPERATOR ONLY', label: 'Operator Only', icon: '🎯' },
  { value: 'TECHNICAL', label: 'Technical', icon: '💻' },
  { value: 'OPEN TO ALL', label: 'Open to All', icon: '🌐' },
];

export const STAGE_OPTIONS: { value: StageType | 'All'; label: string }[] = [
  { value: 'All', label: 'All Stages' },
  { value: 'PRE-REVENUE', label: 'Pre-revenue' },
  { value: '$0-1M', label: '$0-1M revenue' },
  { value: '$1M-10M', label: '$1M-10M revenue' },
  { value: '$10M+', label: '$10M+ revenue' },
  { value: 'ALL STAGES', label: 'All Stages (event open)' },
];

export const HOST_TYPE_OPTIONS: HostType[] = [
  'VC Firms',
  'Accelerators/Incubators',
  'Corporate',
  'Community/Independent',
];
