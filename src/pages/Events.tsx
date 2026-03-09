import { useState, useMemo } from 'react';
import { isSameDay } from 'date-fns';
/** Get the most recent Sunday as the "last updated" date */
function getLastSunday(): string {
  const now = new Date();
  const day = now.getDay();
  const diff = day === 0 ? 0 : day;
  const lastSunday = new Date(now);
  lastSunday.setDate(now.getDate() - diff);
  return lastSunday.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}
import { Loader2 } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import SuggestionDialog from '@/components/SuggestionDialog';
import DigestSignup from '@/components/digest/DigestSignup';
import ExitIntentModal from '@/components/digest/ExitIntentModal';
import EventCard from '@/components/events/EventCard';
import EventFilterBar from '@/components/events/EventFilterBar';
import EventCalendar from '@/components/events/EventCalendar';
import { useEvents } from '@/hooks/useEvents';
import { sortEventsByDate, isEventInNextTwoWeeks, isEventThisWeek, parseEventDate } from '@/lib/eventUtils';
import type { EventFilters as EventFiltersType, Event, ExpectedSize, HostType } from '@/types/events';
import { DEFAULT_FILTERS } from '@/types/events';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const INITIAL_EVENTS_COUNT = 15;

/** Group events by month/year */
function groupByMonth(events: Event[]): { label: string; events: Event[] }[] {
  const groups = new Map<string, Event[]>();
  
  for (const event of events) {
    const parsed = parseEventDate(event.date);
    const key = parsed
      ? parsed.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase()
      : 'UPCOMING';
    
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(event);
  }

  return Array.from(groups.entries()).map(([label, events]) => ({ label, events }));
}

export default function Events() {
  const [filters, setFilters] = useState<EventFiltersType>(DEFAULT_FILTERS);
  const [showAll, setShowAll] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
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
      cost: event.cost || 'Free',
      expected_size: (event.expected_size as ExpectedSize) || '25-50',
      outcome_framing: event.outcome_framing || undefined,
      host_type: (event.host_type as HostType) || 'Community/Independent',
      is_high_signal: event.is_high_signal ?? event.featured ?? false,
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

    // Calendar date filter
    if (selectedDate) {
      result = result.filter(event => {
        const parsed = parseEventDate(event.date);
        return parsed && isSameDay(parsed, selectedDate);
      });
    }
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
  }, [eventsInRange, filters, selectedDate]);

  const displayedEvents = showAll ? filteredEvents : filteredEvents.slice(0, INITIAL_EVENTS_COUNT);
  const hasMoreEvents = filteredEvents.length > INITIAL_EVENTS_COUNT && !showAll;
  const monthGroups = useMemo(() => groupByMonth(displayedEvents), [displayedEvents]);

  return (
    <AppLayout 
      activeTab="events" 
      tabCounts={{ events: allEvents.length }}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-muted rounded-full text-xs font-medium text-muted-foreground tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Updated {getLastSunday()}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight">
            Seattle <span className="text-primary">Startup Event Calendar</span>
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-lg mx-auto">
            Every pitch competition, demo day, hackathon, and founder event worth knowing about in 2026
          </p>
        </div>

        {/* Time range pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => setFilters({ ...filters, thisWeekOnly: true, showAllFuture: false })}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium transition-colors border",
              filters.thisWeekOnly
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-transparent text-foreground border-border hover:border-foreground/30"
            )}
          >
            This Week
          </button>
          <button
            onClick={() => setFilters({ ...filters, showAllFuture: true, thisWeekOnly: false })}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium transition-colors border",
              filters.showAllFuture
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-transparent text-foreground border-border hover:border-foreground/30"
            )}
          >
            All Future
          </button>
        </div>

        {/* Filters + submit */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <EventFilterBar filters={filters} onFiltersChange={setFilters} />
          </div>
          <SuggestionDialog />
        </div>

        {/* Event count */}
        <p className="text-xs text-muted-foreground">
          {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
        </p>
        
        {/* Events list grouped by month */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : displayedEvents.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No events match your filters.</p>
            <p className="text-sm text-muted-foreground mt-1">Try adjusting your criteria.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {monthGroups.map((group) => (
              <div key={group.label}>
                <h2 className="text-sm font-bold tracking-wider text-primary mb-4">
                  {group.label}
                </h2>
                <div className="space-y-3">
                  {group.events.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </div>
            ))}

            {hasMoreEvents && (
              <div className="text-center pt-2">
                <Button onClick={() => setShowAll(true)} size="sm" variant="outline" className="rounded-full">
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
