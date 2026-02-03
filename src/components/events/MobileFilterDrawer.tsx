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
        <Button 
          variant={activeFilterCount > 0 ? "default" : "outline"} 
          size="default" 
          className="rounded-none gap-2 font-semibold"
        >
          <Filter className="h-4 w-4" />
          Filter Events
          {activeFilterCount > 0 && (
            <span className="bg-primary-foreground text-primary text-xs px-1.5 py-0.5 rounded-full font-bold">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full max-w-sm overflow-y-auto p-0">
        <SheetHeader className="p-4 border-b border-border">
          <SheetTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary" />
            Filter Events
          </SheetTitle>
        </SheetHeader>
        <div className="p-4">
          <EventFilters filters={filters} onFiltersChange={onFiltersChange} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
