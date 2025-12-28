import { Search, Users, MapPin, Tag, X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

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
  const hasActiveFilters = audienceFilter !== 'All' || locationFilter !== 'All' || typeFilter !== 'All' || searchQuery !== '';

  const clearAllFilters = () => {
    onSearchChange('');
    onAudienceChange?.('All');
    onLocationChange?.('All');
    onTypeChange?.('All');
  };

  return (
    <div className="bg-muted/30 border border-border rounded-lg p-4">
      {/* Search bar */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search events, organizers..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-3 py-2.5 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
        />
      </div>

      {/* Filter row */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-medium text-muted-foreground mr-1">Filter by:</span>
        
        {onAudienceChange && (
          <Select value={audienceFilter} onValueChange={(value) => onAudienceChange(value as AudienceFilter)}>
            <SelectTrigger className={`h-8 w-auto gap-1.5 text-xs border-border ${audienceFilter !== 'All' ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-background'}`}>
              <Users className="h-3.5 w-3.5" />
              <SelectValue placeholder="Audience" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              {AUDIENCE_OPTIONS.map((option) => (
                <SelectItem key={option} value={option} className="text-xs">
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {onLocationChange && (
          <Select value={locationFilter} onValueChange={(value) => onLocationChange(value as LocationFilter)}>
            <SelectTrigger className={`h-8 w-auto gap-1.5 text-xs border-border ${locationFilter !== 'All' ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-background'}`}>
              <MapPin className="h-3.5 w-3.5" />
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              {LOCATION_OPTIONS.map((option) => (
                <SelectItem key={option} value={option} className="text-xs">
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {onTypeChange && (
          <Select value={typeFilter} onValueChange={(value) => onTypeChange(value as TypeFilter)}>
            <SelectTrigger className={`h-8 w-auto gap-1.5 text-xs border-border ${typeFilter !== 'All' ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-background'}`}>
              <Tag className="h-3.5 w-3.5" />
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              {TYPE_OPTIONS.map((option) => (
                <SelectItem key={option} value={option} className="text-xs">
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearAllFilters}
            className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5 mr-1" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}
