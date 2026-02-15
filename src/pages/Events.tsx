import { useState, useMemo } from 'react';
import { Loader2, CalendarRange, Calendar } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import SuggestionDialog from '@/components/SuggestionDialog';
import DigestSignup from '@/components/digest/DigestSignup';
import ExitIntentModal from '@/components/digest/ExitIntentModal';
import EventCard from '@/components/events/EventCard';
import EventFilterBar from '@/components/events/EventFilterBar';
import { useEvents } from '@/hooks/useEvents';
import { sortEventsByDate, isEventInNextTwoWeeks, isEventThisWeek } from '@/lib/eventUtils';
import type { EventFilters as EventFiltersType, Event } from '@/types/events';
import { DEFAULT_FILTERS } from '@/types/events';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const INITIAL_EVENTS_COUNT = 10;

export default function Events() {
  const [filters, setFilters] = useState<EventFiltersType>(DEFAULT_FILTERS);
  const [showAll, setShowAll] = useState(false);
  const { events: dbEvents, loading } = useEvents();

  const allEvents = useMemo(() => {
    const events: Event[] = dbEvents.map(event => ({
      id: event.id,
      title: event.title,
      organizer: event.organizer,
      date: event.date,
      time: event.time,
      format: event.format as 'virtual' | 'inperson' | 'hybrid',
      type: event.type,
      description: event.description,
      featured: event.featured ?? false,
      is_approved: event.is_approved ?? true,
      url: event.url,
      audience: event.audience || ['Founders'],
      stage: event.stage || ['All Stages'],
      city: event.city || 'Seattle',
      created_at: event.created_at,
      cost: 'Free',
      expected_size: '25-50' as const,
      outcome_framing: event.description,
      host_type: 'Community/Independent' as const,
      is_high_signal: event.featured,
    }));
    return sortEventsByDate(events);
  }, [dbEvents]);

  const eventsInRange = useMemo(() => {
    if (filters.showAllFuture) return allEvents;
    if (filters.thisWeekOnly) return allEvents.filter(event => isEventThisWeek(event.date));
    return allEvents.filter(event => isEventInNextTwoWeeks(event.date));
  }, [allEvents, filters.showAllFuture, filters.thisWeekOnly]);

  const filteredEvents = useMemo(() => {
    let result = eventsInRange;

    if (filters.search) {
      const query = filters.search.toLowerCase();
      result = result.filter(event =>
        event.title.toLowerCase().includes(query) ||
        event.organizer.toLowerCase().includes(query) ||
        (event.outcome_framing?.toLowerCase().includes(query))
      );
    }

    if (filters.audience !== 'All') {
      result = result.filter(event => {
        const audienceMap: Record<string, string[]> = {
          'FOUNDER ONLY': ['Founders', 'FOUNDER ONLY'],
          'OPERATOR ONLY': ['Operators', 'OPERATOR ONLY'],
          'TECHNICAL': ['Technical', 'TECHNICAL'],
          'OPEN TO ALL': ['All', 'OPEN TO ALL', 'Open to All'],
        };
        return event.audience.some(a => audienceMap[filters.audience]?.includes(a));
      });
    }

    if (filters.stage !== 'All') {
      result = result.filter(event => {
        const stageMap: Record<string, string[]> = {
          'PRE-REVENUE': ['Pre-seed', 'PRE-REVENUE', 'Pre-revenue'],
          '$0-1M': ['Seed', '$0-1M'],
          '$1M-10M': ['Series A', '$1M-10M'],
          '$10M+': ['Series B', 'Series C+', '$10M+'],
          'ALL STAGES': ['All Stages', 'ALL STAGES'],
        };
        return event.stage?.some(s => stageMap[filters.stage]?.includes(s));
      });
    }

    if (filters.hostTypes.length > 0) {
      result = result.filter(event => 
        filters.hostTypes.includes(event.host_type || 'Community/Independent')
      );
    }

    if (filters.highSignalOnly) {
      result = result.filter(event => event.is_high_signal || event.featured);
    }

    if (filters.thisWeekOnly) {
      result = result.filter(event => isEventThisWeek(event.date));
    }

    if (filters.freeOnly) {
      result = result.filter(event => 
        !event.cost || event.cost === 'Free' || event.cost.toLowerCase().includes('free')
      );
    }

    if (filters.spotsAvailable) {
      result = result.filter(event => 
        event.spots_available === undefined || event.spots_available > 0
      );
    }

    if (filters.sortBy === 'highSignal') {
      result = [...result].sort((a, b) => {
        if (a.is_high_signal && !b.is_high_signal) return -1;
        if (!a.is_high_signal && b.is_high_signal) return 1;
        return 0;
      });
    } else if (filters.sortBy === 'deadline') {
      result = [...result].sort((a, b) => {
        if (a.registration_deadline && b.registration_deadline) {
          return new Date(a.registration_deadline).getTime() - new Date(b.registration_deadline).getTime();
        }
        if (a.registration_deadline) return -1;
        if (b.registration_deadline) return 1;
        return 0;
      });
    }

    return result;
  }, [eventsInRange, filters]);

  const displayedEvents = showAll ? filteredEvents : filteredEvents.slice(0, INITIAL_EVENTS_COUNT);
  const hasMoreEvents = filteredEvents.length > INITIAL_EVENTS_COUNT && !showAll;

  const calendarMessage = useMemo(() => {
    if (filters.showAllFuture) return null;
    if (filteredEvents.length === 0) return "Quiet week — check back Friday";
    if (filteredEvents.length <= 2 && !filters.thisWeekOnly) return `Only ${filteredEvents.length} high-signal event${filteredEvents.length === 1 ? '' : 's'} coming up`;
    return null;
  }, [filteredEvents.length, filters.showAllFuture, filters.thisWeekOnly]);

  return (
    <AppLayout 
      activeTab="events" 
      tabCounts={{ events: allEvents.length }}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Date range tabs + event count */}
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-center gap-1 mb-1">
              <button
                onClick={() => setFilters({ ...filters, thisWeekOnly: false, showAllFuture: false })}
                className={cn(
                  "text-sm font-medium px-3 py-1.5 border-b-2 transition-colors",
                  !filters.thisWeekOnly && !filters.showAllFuture
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                Next 2 Weeks
              </button>
              <button
                onClick={() => setFilters({ ...filters, thisWeekOnly: true, showAllFuture: false })}
                className={cn(
                  "text-sm font-medium px-3 py-1.5 border-b-2 transition-colors",
                  filters.thisWeekOnly
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                This Week
              </button>
              <button
                onClick={() => setFilters({ ...filters, showAllFuture: true, thisWeekOnly: false })}
                className={cn(
                  "text-sm font-medium px-3 py-1.5 border-b-2 transition-colors",
                  filters.showAllFuture
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                All Future
              </button>
            </div>
            <p className="text-xs text-muted-foreground pl-3">
              {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
            </p>
          </div>
          <SuggestionDialog />
        </div>

        {/* Compact filter bar */}
        <EventFilterBar filters={filters} onFiltersChange={setFilters} />

        {/* Calendar message */}
        {calendarMessage && !loading && (
          <p className="text-sm text-muted-foreground font-medium">{calendarMessage}</p>
        )}
        
        {/* Events list - full width */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-3">
            {displayedEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
            
            {displayedEvents.length === 0 && (
              <div className="text-center py-16">
                <p className="text-muted-foreground">No events match your filters.</p>
                <p className="text-sm text-muted-foreground mt-1">Try adjusting your criteria.</p>
              </div>
            )}

            {hasMoreEvents && (
              <div className="text-center pt-4">
                <Button onClick={() => setShowAll(true)} size="sm" variant="outline">
                  Show all {filteredEvents.length} events
                </Button>
              </div>
            )}

            {showAll && filteredEvents.length > INITIAL_EVENTS_COUNT && (
              <div className="text-center pt-2">
                <button
                  onClick={() => setShowAll(false)}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Show fewer
                </button>
              </div>
            )}
          </div>
        )}

        {/* Digest Signup */}
        <div className="mt-8">
          <DigestSignup sourceTab="events" />
        </div>
      </div>

      <ExitIntentModal sourceTab="events" />
    </AppLayout>
  );
}
