import { Search, X, Star, Award } from 'lucide-react';
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
import type { LearningFilters as LearningFiltersType, LearningSortOption } from '@/types/learning';
import { SKILL_CATEGORIES, LEARNING_FORMATS, DIFFICULTY_LEVELS, TIME_TO_ROI_OPTIONS } from '@/types/learning';

interface LearningFiltersProps {
  filters: LearningFiltersType;
  onFiltersChange: (filters: LearningFiltersType) => void;
  sortBy: LearningSortOption;
  onSortChange: (sort: LearningSortOption) => void;
  totalResources: number;
  filteredCount: number;
}

export default function LearningFilters({
  filters,
  onFiltersChange,
  sortBy,
  onSortChange,
  totalResources,
  filteredCount,
}: LearningFiltersProps) {
  const activeFilterCount = 
    filters.categories.length + 
    filters.formats.length + 
    filters.difficulties.length +
    filters.timeToROI.length +
    (filters.freeOnly ? 1 : 0) +
    (filters.certificationOnly ? 1 : 0) +
    (filters.founderRecommendedOnly ? 1 : 0);

  const clearFilters = () => {
    onFiltersChange({
      categories: [],
      formats: [],
      difficulties: [],
      timeToROI: [],
      priceTypes: [],
      freeOnly: false,
      certificationOnly: false,
      founderRecommendedOnly: false,
      search: '',
    });
  };

  const toggleArrayFilter = <K extends keyof LearningFiltersType>(
    key: K,
    value: LearningFiltersType[K] extends (infer T)[] ? T : never
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
            placeholder="Search courses, instructors..."
            value={filters.search}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            className="pl-9"
          />
        </div>
        
        <Select value={sortBy} onValueChange={(v) => onSortChange(v as LearningSortOption)}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Recently added</SelectItem>
            <SelectItem value="price-low">Price (low to high)</SelectItem>
            <SelectItem value="alphabetical">Alphabetical</SelectItem>
            <SelectItem value="roi-immediate">Apply immediately first</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2 items-center">
        {/* Category Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant={filters.categories.length > 0 ? "default" : "outline"} 
              size="sm"
              className="h-8"
            >
              Category
              {filters.categories.length > 0 && (
                <Badge variant="secondary" className="ml-1.5 h-5 px-1.5">
                  {filters.categories.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-52 p-2" align="start">
            <div className="space-y-1 max-h-64 overflow-y-auto">
              {SKILL_CATEGORIES.map(category => (
                <label 
                  key={category} 
                  className="flex items-center gap-2 p-2 hover:bg-accent rounded cursor-pointer"
                >
                  <Checkbox
                    checked={filters.categories.includes(category)}
                    onCheckedChange={() => toggleArrayFilter('categories', category)}
                  />
                  <span className="text-sm">{category}</span>
                </label>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Format Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant={filters.formats.length > 0 ? "default" : "outline"} 
              size="sm"
              className="h-8"
            >
              Format
              {filters.formats.length > 0 && (
                <Badge variant="secondary" className="ml-1.5 h-5 px-1.5">
                  {filters.formats.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-52 p-2" align="start">
            <div className="space-y-1">
              {LEARNING_FORMATS.map(format => (
                <label 
                  key={format} 
                  className="flex items-center gap-2 p-2 hover:bg-accent rounded cursor-pointer"
                >
                  <Checkbox
                    checked={filters.formats.includes(format)}
                    onCheckedChange={() => toggleArrayFilter('formats', format)}
                  />
                  <span className="text-sm">{format}</span>
                </label>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Difficulty Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant={filters.difficulties.length > 0 ? "default" : "outline"} 
              size="sm"
              className="h-8"
            >
              Difficulty
              {filters.difficulties.length > 0 && (
                <Badge variant="secondary" className="ml-1.5 h-5 px-1.5">
                  {filters.difficulties.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-2" align="start">
            <div className="space-y-1">
              {DIFFICULTY_LEVELS.map(level => (
                <label 
                  key={level} 
                  className="flex items-center gap-2 p-2 hover:bg-accent rounded cursor-pointer"
                >
                  <Checkbox
                    checked={filters.difficulties.includes(level)}
                    onCheckedChange={() => toggleArrayFilter('difficulties', level)}
                  />
                  <span className="text-sm">{level}</span>
                </label>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Time to ROI Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant={filters.timeToROI.length > 0 ? "default" : "outline"} 
              size="sm"
              className="h-8"
            >
              ROI
              {filters.timeToROI.length > 0 && (
                <Badge variant="secondary" className="ml-1.5 h-5 px-1.5">
                  {filters.timeToROI.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-52 p-2" align="start">
            <div className="space-y-1">
              {TIME_TO_ROI_OPTIONS.map(roi => (
                <label 
                  key={roi} 
                  className="flex items-center gap-2 p-2 hover:bg-accent rounded cursor-pointer"
                >
                  <Checkbox
                    checked={filters.timeToROI.includes(roi)}
                    onCheckedChange={() => toggleArrayFilter('timeToROI', roi)}
                  />
                  <span className="text-sm">{roi}</span>
                </label>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Quick Toggles */}
        <div className="flex items-center gap-3 px-2 border-l border-border ml-1">
          <div className="flex items-center gap-1.5">
            <Switch
              id="free-only"
              checked={filters.freeOnly}
              onCheckedChange={(checked) => onFiltersChange({ ...filters, freeOnly: checked })}
              className="scale-90"
            />
            <Label htmlFor="free-only" className="text-sm cursor-pointer">
              Free only
            </Label>
          </div>
          
          <div className="flex items-center gap-1.5">
            <Switch
              id="certification-only"
              checked={filters.certificationOnly}
              onCheckedChange={(checked) => onFiltersChange({ ...filters, certificationOnly: checked })}
              className="scale-90"
            />
            <Label htmlFor="certification-only" className="text-sm cursor-pointer flex items-center gap-1">
              <Award className="h-3.5 w-3.5" />
              Certified
            </Label>
          </div>
          
          <div className="flex items-center gap-1.5">
            <Switch
              id="founder-recommended"
              checked={filters.founderRecommendedOnly}
              onCheckedChange={(checked) => onFiltersChange({ ...filters, founderRecommendedOnly: checked })}
              className="scale-90"
            />
            <Label htmlFor="founder-recommended" className="text-sm cursor-pointer flex items-center gap-1">
              <Star className="h-3.5 w-3.5" />
              Recommended
            </Label>
          </div>
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
        Showing {filteredCount} of {totalResources} courses
      </p>
    </div>
  );
}
