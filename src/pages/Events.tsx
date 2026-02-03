import { useState, useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import SuggestionDialog from '@/components/SuggestionDialog';
import DigestSignup from '@/components/digest/DigestSignup';
import ExitIntentModal from '@/components/digest/ExitIntentModal';
import EventCard from '@/components/events/EventCard';
import EventFilters from '@/components/events/EventFilters';
import MobileFilterDrawer from '@/components/events/MobileFilterDrawer';
import { useEvents } from '@/hooks/useEvents';
import { sortEventsByDate, isEventInNextTwoWeeks, isEventThisWeek } from '@/lib/eventUtils';
import type { EventFilters as EventFiltersType, Event } from '@/types/events';
import { DEFAULT_FILTERS } from '@/types/events';

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
      // New fields with defaults
      cost: 'Free',
      expected_size: '25-50' as const,
      outcome_framing: event.description,
      host_type: 'Community/Independent' as const,
      is_high_signal: event.featured,
    }));
    return sortEventsByDate(events);
  }, [dbEvents]);

  // Filter by date range based on filter settings
  const eventsInRange = useMemo(() => {
    if (filters.showAllFuture) {
      return allEvents; // Show all future events (already filtered by sortEventsByDate)
    }
    if (filters.thisWeekOnly) {
      return allEvents.filter(event => isEventThisWeek(event.date));
    }
    // Default: next 2 weeks
    return allEvents.filter(event => isEventInNextTwoWeeks(event.date));
  }, [allEvents, filters.showAllFuture, filters.thisWeekOnly]);

  const filteredEvents = useMemo(() => {
    let result = eventsInRange;

    // Search filter
    if (filters.search) {
      const query = filters.search.toLowerCase();
      result = result.filter(event =>
        event.title.toLowerCase().includes(query) ||
        event.organizer.toLowerCase().includes(query) ||
        (event.outcome_framing?.toLowerCase().includes(query))
      );
    }

    // Audience filter
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

    // Stage filter
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

    // Host type filter
    if (filters.hostTypes.length > 0) {
      result = result.filter(event => 
        filters.hostTypes.includes(event.host_type || 'Community/Independent')
      );
    }

    // Quick filters
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

    // Sorting
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

  // Progressive loading - show initial count, then all on "Show More"
  const displayedEvents = showAll ? filteredEvents : filteredEvents.slice(0, INITIAL_EVENTS_COUNT);
  const hasMoreEvents = filteredEvents.length > INITIAL_EVENTS_COUNT && !showAll;

  // Calendar message based on event count
  const calendarMessage = useMemo(() => {
    if (filters.showAllFuture) return null; // Don't show message when viewing all future
    if (filteredEvents.length === 0) return "Quiet week - check back Friday";
    if (filteredEvents.length <= 2 && !filters.thisWeekOnly) return `Only ${filteredEvents.length} high-signal event${filteredEvents.length === 1 ? '' : 's'} coming up 👇`;
    return null;
  }, [filteredEvents.length, filters.showAllFuture, filters.thisWeekOnly]);

  // Date range label
  const dateRangeLabel = useMemo(() => {
    if (filters.thisWeekOnly) return "This Week";
    if (filters.showAllFuture) return "All Future Events";
    return "Next 2 Weeks";
  }, [filters.thisWeekOnly, filters.showAllFuture]);

  return (
    <AppLayout 
      activeTab="events" 
      tabCounts={{ events: allEvents.length }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Suggestion Box */}
        <SuggestionDialog />
        
        {/* Desktop Layout: Sidebar + Main */}
        <div className="flex gap-8">
          {/* Left Sidebar - Filters (Desktop) */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 space-y-6">
              <EventFilters filters={filters} onFiltersChange={setFilters} />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Mobile: Filter Drawer */}
            <div className="lg:hidden mb-4">
              <MobileFilterDrawer filters={filters} onFiltersChange={setFilters} />
            </div>

            {/* Header with date range */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">{dateRangeLabel}</h2>
                <p className="text-sm text-muted-foreground">
                  {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
                </p>
              </div>
              {!filters.showAllFuture && (
                <button
                  onClick={() => setFilters({ ...filters, showAllFuture: true })}
                  className="text-sm text-primary hover:underline font-medium"
                >
                  View all future events →
                </button>
              )}
            </div>

            {/* Calendar Message */}
            {calendarMessage && !loading && (
              <div className="text-sm text-muted-foreground mb-4 font-medium">
                {calendarMessage}
              </div>
            )}
            
            {/* Events List */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="space-y-4">
                {displayedEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
                
                {displayedEvents.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No events match your filters.</p>
                    <p className="text-sm text-muted-foreground mt-1">Try adjusting your criteria or check back later.</p>
                  </div>
                )}

                {hasMoreEvents && (
                  <div className="text-center pt-6">
                    <button
                      onClick={() => setShowAll(true)}
                      className="inline-flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                    >
                      Show All {filteredEvents.length} Events
                    </button>
                  </div>
                )}

                {showAll && filteredEvents.length > INITIAL_EVENTS_COUNT && (
                  <div className="text-center pt-4">
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
            <div className="mt-12">
              <DigestSignup sourceTab="events" />
            </div>
          </main>
        </div>
      </div>

      {/* Exit Intent Modal */}
      <ExitIntentModal sourceTab="events" />
    </AppLayout>
  );
}
