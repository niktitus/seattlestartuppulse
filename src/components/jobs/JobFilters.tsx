import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import type { JobFilters as JobFiltersType, JobSortOption } from '@/types/jobs';
import { FUNDING_STAGES, DEPARTMENTS, WORK_MODELS } from '@/types/jobs';

interface JobFiltersProps {
  filters: JobFiltersType;
  onFiltersChange: (filters: JobFiltersType) => void;
  sortBy: JobSortOption;
  onSortChange: (sort: JobSortOption) => void;
  totalJobs: number;
  filteredCount: number;
}

export default function JobFilters({
  filters,
  onFiltersChange,
  sortBy,
  onSortChange,
  totalJobs,
  filteredCount,
}: JobFiltersProps) {
  const activeFilterCount = 
    filters.fundingStages.length + 
    filters.departments.length + 
    filters.workModels.length + 
    (filters.remoteFirst ? 1 : 0) +
    (filters.postedWithin !== 'all' ? 1 : 0);

  const clearFilters = () => {
    onFiltersChange({
      fundingStages: [],
      departments: [],
      workModels: [],
      salaryMin: 0,
      salaryMax: 500000,
      postedWithin: 'all',
      remoteFirst: false,
      search: '',
    });
  };

  const toggleArrayFilter = <K extends keyof JobFiltersType>(
    key: K,
    value: JobFiltersType[K] extends (infer T)[] ? T : never
  ) => {
    const currentArray = filters[key] as unknown[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(v => v !== value)
      : [...currentArray, value];
    onFiltersChange({ ...filters, [key]: newArray });
  };

  return (
    <div className="space-y-4">
      {/* Search and Sort Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search jobs, companies..."
            value={filters.search}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            className="pl-9"
          />
        </div>
        
        <Select value={sortBy} onValueChange={(v) => onSortChange(v as JobSortOption)}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest first</SelectItem>
            <SelectItem value="salary-high">Salary (high to low)</SelectItem>
            <SelectItem value="stage-early">Stage (early to late)</SelectItem>
            <SelectItem value="alphabetical">Alphabetical</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2 items-center">
        {/* Funding Stage Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant={filters.fundingStages.length > 0 ? "default" : "outline"} 
              size="sm"
              className="h-8"
            >
              Stage
              {filters.fundingStages.length > 0 && (
                <Badge variant="secondary" className="ml-1.5 h-5 px-1.5">
                  {filters.fundingStages.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-2" align="start">
            <div className="space-y-1">
              {FUNDING_STAGES.map(stage => (
                <label 
                  key={stage} 
                  className="flex items-center gap-2 p-2 hover:bg-accent rounded cursor-pointer"
                >
                  <Checkbox
                    checked={filters.fundingStages.includes(stage)}
                    onCheckedChange={() => toggleArrayFilter('fundingStages', stage)}
                  />
                  <span className="text-sm">{stage}</span>
                </label>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Department Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant={filters.departments.length > 0 ? "default" : "outline"} 
              size="sm"
              className="h-8"
            >
              Department
              {filters.departments.length > 0 && (
                <Badge variant="secondary" className="ml-1.5 h-5 px-1.5">
                  {filters.departments.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-52 p-2" align="start">
            <div className="space-y-1 max-h-64 overflow-y-auto">
              {DEPARTMENTS.map(dept => (
                <label 
                  key={dept} 
                  className="flex items-center gap-2 p-2 hover:bg-accent rounded cursor-pointer"
                >
                  <Checkbox
                    checked={filters.departments.includes(dept)}
                    onCheckedChange={() => toggleArrayFilter('departments', dept)}
                  />
                  <span className="text-sm">{dept}</span>
                </label>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Work Model Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant={filters.workModels.length > 0 ? "default" : "outline"} 
              size="sm"
              className="h-8"
            >
              Work Model
              {filters.workModels.length > 0 && (
                <Badge variant="secondary" className="ml-1.5 h-5 px-1.5">
                  {filters.workModels.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-2" align="start">
            <div className="space-y-1">
              {WORK_MODELS.map(model => (
                <label 
                  key={model} 
                  className="flex items-center gap-2 p-2 hover:bg-accent rounded cursor-pointer"
                >
                  <Checkbox
                    checked={filters.workModels.includes(model)}
                    onCheckedChange={() => toggleArrayFilter('workModels', model)}
                  />
                  <span className="text-sm">{model}</span>
                </label>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Posted Within Filter */}
        <Select 
          value={filters.postedWithin} 
          onValueChange={(v) => onFiltersChange({ ...filters, postedWithin: v as JobFiltersType['postedWithin'] })}
        >
          <SelectTrigger className="w-36 h-8">
            <SelectValue placeholder="Posted" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All time</SelectItem>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="14">Last 14 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
          </SelectContent>
        </Select>

        {/* Remote First Toggle */}
        <div className="flex items-center gap-2 px-2">
          <Switch
            id="remote-first"
            checked={filters.remoteFirst}
            onCheckedChange={(checked) => onFiltersChange({ ...filters, remoteFirst: checked })}
          />
          <Label htmlFor="remote-first" className="text-sm cursor-pointer">
            Remote-first only
          </Label>
        </div>

        {/* Clear Filters */}
        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8">
            <X className="h-4 w-4 mr-1" />
            Clear ({activeFilterCount})
          </Button>
        )}
      </div>

      {/* Results Count */}
      <p className="text-sm text-muted-foreground">
        Showing {filteredCount} of {totalJobs} jobs
      </p>
    </div>
  );
}
