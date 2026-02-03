import { Search, Filter, Flame, Calendar, DollarSign, Ticket, X, CalendarRange } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { EventFilters as EventFiltersType, AudienceType, StageType, HostType } from '@/types/events';
import { AUDIENCE_OPTIONS, STAGE_OPTIONS, HOST_TYPE_OPTIONS, DEFAULT_FILTERS } from '@/types/events';

interface EventFiltersProps {
  filters: EventFiltersType;
  onFiltersChange: (filters: EventFiltersType) => void;
}

export default function EventFilters({ filters, onFiltersChange }: EventFiltersProps) {
  const hasActiveFilters = 
    filters.audience !== 'All' || 
    filters.stage !== 'All' || 
    filters.hostTypes.length > 0 ||
    filters.highSignalOnly ||
    filters.thisWeekOnly ||
    filters.freeOnly ||
    filters.spotsAvailable ||
    filters.showAllFuture ||
    filters.search !== '';

  const clearFilters = () => {
    onFiltersChange(DEFAULT_FILTERS);
  };

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

  return (
    <div className="bg-card border border-border p-4 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-primary" />
          <h3 className="font-semibold text-foreground">Filters</h3>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <X className="h-3 w-3 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search events, hosts..."
          value={filters.search}
          onChange={(e) => updateFilter('search', e.target.value)}
          className="pl-9 rounded-none h-9 text-sm"
        />
      </div>

      {/* Audience Filter */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-foreground uppercase tracking-wide">Audience</h4>
        <RadioGroup
          value={filters.audience}
          onValueChange={(value) => updateFilter('audience', value as AudienceType | 'All')}
          className="space-y-2"
        >
          {AUDIENCE_OPTIONS.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem value={option.value} id={`audience-${option.value}`} />
              <Label htmlFor={`audience-${option.value}`} className="text-sm font-normal cursor-pointer">
                {option.icon && <span className="mr-1">{option.icon}</span>}
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Stage Filter */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-foreground uppercase tracking-wide">Stage</h4>
        <RadioGroup
          value={filters.stage}
          onValueChange={(value) => updateFilter('stage', value as StageType | 'All')}
          className="space-y-2"
        >
          {STAGE_OPTIONS.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem value={option.value} id={`stage-${option.value}`} />
              <Label htmlFor={`stage-${option.value}`} className="text-sm font-normal cursor-pointer">
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Host Type Filter */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-foreground uppercase tracking-wide">Host Type</h4>
        <div className="space-y-2">
          {HOST_TYPE_OPTIONS.map((hostType) => (
            <div key={hostType} className="flex items-center space-x-2">
              <Checkbox
                id={`host-${hostType}`}
                checked={filters.hostTypes.includes(hostType)}
                onCheckedChange={() => toggleHostType(hostType)}
              />
              <Label htmlFor={`host-${hostType}`} className="text-sm font-normal cursor-pointer">
                {hostType}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Date Range */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-foreground uppercase tracking-wide">Date Range</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="this-week" className="text-sm font-normal cursor-pointer flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              This Week Only
            </Label>
            <Switch
              id="this-week"
              checked={filters.thisWeekOnly}
              onCheckedChange={(checked) => {
                updateFilter('thisWeekOnly', checked);
                if (checked) updateFilter('showAllFuture', false);
              }}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="show-all-future" className="text-sm font-normal cursor-pointer flex items-center gap-2">
              <CalendarRange className="h-4 w-4 text-primary" />
              All Future Events
            </Label>
            <Switch
              id="show-all-future"
              checked={filters.showAllFuture}
              onCheckedChange={(checked) => {
                updateFilter('showAllFuture', checked);
                if (checked) updateFilter('thisWeekOnly', false);
              }}
            />
          </div>
        </div>
        {!filters.thisWeekOnly && !filters.showAllFuture && (
          <p className="text-xs text-muted-foreground">Showing next 2 weeks by default</p>
        )}
      </div>

      {/* Quick Filters */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-foreground uppercase tracking-wide">Quick Filters</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="high-signal" className="text-sm font-normal cursor-pointer flex items-center gap-2">
              <Flame className="h-4 w-4 text-primary" />
              High Signal Only
            </Label>
            <Switch
              id="high-signal"
              checked={filters.highSignalOnly}
              onCheckedChange={(checked) => updateFilter('highSignalOnly', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="free-only" className="text-sm font-normal cursor-pointer flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-primary" />
              Free Only
            </Label>
            <Switch
              id="free-only"
              checked={filters.freeOnly}
              onCheckedChange={(checked) => updateFilter('freeOnly', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="spots-available" className="text-sm font-normal cursor-pointer flex items-center gap-2">
              <Ticket className="h-4 w-4 text-primary" />
              Spots Available
            </Label>
            <Switch
              id="spots-available"
              checked={filters.spotsAvailable}
              onCheckedChange={(checked) => updateFilter('spotsAvailable', checked)}
            />
          </div>
        </div>
      </div>

      {/* Sort */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-foreground uppercase tracking-wide">Sort By</h4>
        <Select
          value={filters.sortBy}
          onValueChange={(value) => updateFilter('sortBy', value as 'date' | 'highSignal' | 'deadline')}
        >
          <SelectTrigger className="rounded-none">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Date (soonest first)</SelectItem>
            <SelectItem value="highSignal">High Signal first</SelectItem>
            <SelectItem value="deadline">Registration deadline</SelectItem>
          </SelectContent>
        </Select>
      </div>

    </div>
  );
}
