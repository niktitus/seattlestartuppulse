import { Search } from 'lucide-react';
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

export const LOCATION_OPTIONS = [
  'All',
  'Seattle',
  'Bellevue',
  'Virtual',
] as const;

export const TYPE_OPTIONS = [
  'All',
  'Event',
  'Pitch Competition',
  'Networking',
  'Workshop',
  'Conference',
  'Meetup',
] as const;

export type AudienceFilter = typeof AUDIENCE_OPTIONS[number];
export type LocationFilter = typeof LOCATION_OPTIONS[number];
export type TypeFilter = typeof TYPE_OPTIONS[number];

interface EventFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  audienceFilter?: AudienceFilter;
  onAudienceChange?: (audience: AudienceFilter) => void;
  locationFilter?: LocationFilter;
  onLocationChange?: (location: LocationFilter) => void;
  typeFilter?: TypeFilter;
  onTypeChange?: (type: TypeFilter) => void;
}

export default function EventFilter({ 
  searchQuery, 
  onSearchChange,
  audienceFilter = 'All',
  onAudienceChange,
  locationFilter = 'All',
  onLocationChange,
  typeFilter = 'All',
  onTypeChange,
}: EventFilterProps) {
  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-sm bg-card border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
        />
      </div>
      <div className="flex flex-wrap gap-3">
        {onAudienceChange && (
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted-foreground">Audience</label>
            <Select value={audienceFilter} onValueChange={(value) => onAudienceChange(value as AudienceFilter)}>
              <SelectTrigger className="w-[150px] bg-card border-border">
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
          </div>
        )}
        {onLocationChange && (
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted-foreground">Location</label>
            <Select value={locationFilter} onValueChange={(value) => onLocationChange(value as LocationFilter)}>
              <SelectTrigger className="w-[130px] bg-card border-border">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {LOCATION_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        {onTypeChange && (
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted-foreground">Type</label>
            <Select value={typeFilter} onValueChange={(value) => onTypeChange(value as TypeFilter)}>
              <SelectTrigger className="w-[150px] bg-card border-border">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {TYPE_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </div>
  );
}
