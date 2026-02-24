import { useState } from 'react';
import { Search, X, Flame, DollarSign, Ticket, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import type { EventFilters as EventFiltersType, AudienceType, StageType, HostType } from '@/types/events';
import { AUDIENCE_OPTIONS, STAGE_OPTIONS, HOST_TYPE_OPTIONS, DEFAULT_FILTERS } from '@/types/events';
import { cn } from '@/lib/utils';

interface EventFilterBarProps {
  filters: EventFiltersType;
  onFiltersChange: (filters: EventFiltersType) => void;
}

export default function EventFilterBar({ filters, onFiltersChange }: EventFilterBarProps) {
  const [searchOpen, setSearchOpen] = useState(false);

  const hasActiveFilters = 
    filters.audience !== 'All' || 
    filters.stage !== 'All' || 
    filters.hostTypes.length > 0 ||
    filters.highSignalOnly ||
    filters.freeOnly ||
    filters.spotsAvailable ||
    filters.search !== '';

  const updateFilter = <K extends keyof EventFiltersType>(key: K, value: EventFiltersType[K]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleHostType = (hostType: HostType) => {
    const current = filters.hostTypes;
    const updated = current.includes(hostType)
      ? current.filter(h => h !== hostType)
      : [...current, hostType];
    updateFilter('hostTypes', updated);
  };

  const clearFilters = () => onFiltersChange(DEFAULT_FILTERS);

  const activeAudienceLabel = filters.audience === 'All' ? 'Audience' : 
    AUDIENCE_OPTIONS.find(o => o.value === filters.audience)?.label || 'Audience';

  const activeStageLabel = filters.stage === 'All' ? 'Stage' : 
    STAGE_OPTIONS.find(o => o.value === filters.stage)?.label || 'Stage';

  return (
    <div className="space-y-3">
      {/* Filter chips row */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Search toggle */}
        <Button
          variant={filters.search ? "default" : "outline"}
          size="sm"
          className="h-8 gap-1.5"
          onClick={() => setSearchOpen(!searchOpen)}
        >
          <Search className="h-3.5 w-3.5" />
          {filters.search ? `"${filters.search}"` : 'Search'}
        </Button>

        {/* Audience dropdown */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={filters.audience !== 'All' ? "default" : "outline"}
              size="sm"
              className="h-8 gap-1"
            >
              {activeAudienceLabel}
              <ChevronDown className="h-3 w-3" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-3 bg-popover border border-border z-50" align="start">
            <RadioGroup
              value={filters.audience}
              onValueChange={(value) => updateFilter('audience', value as AudienceType | 'All')}
              className="space-y-2"
            >
              {AUDIENCE_OPTIONS.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`bar-audience-${option.value}`} />
                  <Label htmlFor={`bar-audience-${option.value}`} className="text-sm cursor-pointer">
                    {option.icon && <span className="mr-1">{option.icon}</span>}
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </PopoverContent>
        </Popover>

        {/* Stage dropdown */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={filters.stage !== 'All' ? "default" : "outline"}
              size="sm"
              className="h-8 gap-1"
            >
              {activeStageLabel}
              <ChevronDown className="h-3 w-3" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-44 p-3 bg-popover border border-border z-50" align="start">
            <RadioGroup
              value={filters.stage}
              onValueChange={(value) => updateFilter('stage', value as StageType | 'All')}
              className="space-y-2"
            >
              {STAGE_OPTIONS.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`bar-stage-${option.value}`} />
                  <Label htmlFor={`bar-stage-${option.value}`} className="text-sm cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </PopoverContent>
        </Popover>

        {/* Host Type dropdown */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={filters.hostTypes.length > 0 ? "default" : "outline"}
              size="sm"
              className="h-8 gap-1"
            >
              Host{filters.hostTypes.length > 0 && ` (${filters.hostTypes.length})`}
              <ChevronDown className="h-3 w-3" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-52 p-3 bg-popover border border-border z-50" align="start">
            <div className="space-y-2">
              {HOST_TYPE_OPTIONS.map((hostType) => (
                <div key={hostType} className="flex items-center space-x-2">
                  <Checkbox
                    id={`bar-host-${hostType}`}
                    checked={filters.hostTypes.includes(hostType)}
                    onCheckedChange={() => toggleHostType(hostType)}
                  />
                  <Label htmlFor={`bar-host-${hostType}`} className="text-sm cursor-pointer">
                    {hostType}
                  </Label>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Divider */}
        <div className="h-5 w-px bg-border hidden sm:block" />

        {/* Quick toggle chips */}
        <Button
          variant={filters.freeOnly ? "default" : "outline"}
          size="sm"
          className="h-8 gap-1.5"
          onClick={() => updateFilter('freeOnly', !filters.freeOnly)}
        >
          <DollarSign className="h-3.5 w-3.5" />
          Free
        </Button>

        <Button
          variant={filters.freeOnly ? "default" : "outline"}
          size="sm"
          className="h-8 gap-1.5"
          onClick={() => updateFilter('freeOnly', !filters.freeOnly)}
        >
          <DollarSign className="h-3.5 w-3.5" />
          Free
        </Button>

        <Button
          variant={filters.spotsAvailable ? "default" : "outline"}
          size="sm"
          className="h-8 gap-1.5"
          onClick={() => updateFilter('spotsAvailable', !filters.spotsAvailable)}
        >
          <Ticket className="h-3.5 w-3.5" />
          Open Spots
        </Button>

        {/* Clear all */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs text-muted-foreground hover:text-foreground gap-1"
            onClick={clearFilters}
          >
            <X className="h-3 w-3" />
            Clear all
          </Button>
        )}
      </div>

      {/* Expandable search bar */}
      {searchOpen && (
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search events, hosts..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="pl-9 h-9 text-sm"
            autoFocus
          />
          {filters.search && (
            <button
              onClick={() => { updateFilter('search', ''); setSearchOpen(false); }}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
