import { Search, ChevronDown } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const AUDIENCE_OPTIONS = [
  'All',
  'Founders',
  'Investors',
  'Operators',
  'Service Providers',
  'Students',
] as const;

export type AudienceFilter = typeof AUDIENCE_OPTIONS[number];

interface EventFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  audienceFilter?: AudienceFilter;
  onAudienceChange?: (audience: AudienceFilter) => void;
}

export default function EventFilter({ 
  searchQuery, 
  onSearchChange,
  audienceFilter = 'All',
  onAudienceChange,
}: EventFilterProps) {
  return (
    <div className="flex gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-sm bg-card border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
        />
      </div>
      {onAudienceChange && (
        <Select value={audienceFilter} onValueChange={(value) => onAudienceChange(value as AudienceFilter)}>
          <SelectTrigger className="w-[160px] bg-card border-border">
            <SelectValue placeholder="Audience" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            {AUDIENCE_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
