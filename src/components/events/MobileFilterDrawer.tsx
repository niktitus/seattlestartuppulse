import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import EventFilters from './EventFilters';
import type { EventFilters as EventFiltersType } from '@/types/events';
import { DEFAULT_FILTERS } from '@/types/events';

interface MobileFilterDrawerProps {
  filters: EventFiltersType;
  onFiltersChange: (filters: EventFiltersType) => void;
}

export default function MobileFilterDrawer({ filters, onFiltersChange }: MobileFilterDrawerProps) {
  const activeFilterCount = [
    filters.audience !== 'All',
    filters.stage !== 'All',
    filters.hostTypes.length > 0,
    filters.highSignalOnly,
    filters.thisWeekOnly,
    filters.freeOnly,
    filters.spotsAvailable,
    filters.search !== '',
  ].filter(Boolean).length;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="rounded-none gap-2">
          <Filter className="h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full max-w-sm overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filter Events</SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <EventFilters filters={filters} onFiltersChange={onFiltersChange} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
