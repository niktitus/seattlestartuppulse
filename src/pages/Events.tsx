import { useState, useMemo } from 'react';
import { Video, MapPin, Globe, Loader2 } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import SuggestionDialog from '@/components/SuggestionDialog';
import DigestSignup from '@/components/digest/DigestSignup';
import ExitIntentModal from '@/components/digest/ExitIntentModal';
import { Badge } from '@/components/ui/badge';
import EventFilter, { AudienceFilter, LocationFilter, TypeFilter } from '@/components/EventFilter';
import { useEvents } from '@/hooks/useEvents';
import { sortEventsByDate } from '@/lib/eventUtils';

const formatIcon: Record<string, typeof Video> = {
  virtual: Video,
  inperson: MapPin,
  hybrid: Globe,
};

export default function Events() {
  const [searchQuery, setSearchQuery] = useState('');
  const [audienceFilter, setAudienceFilter] = useState<AudienceFilter>('All');
  const [locationFilter, setLocationFilter] = useState<LocationFilter>('All');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('All');
  const { events: dbEvents, loading } = useEvents();

  const allEvents = useMemo(() => {
    const events = dbEvents.map(event => ({
      id: event.id,
      title: event.title,
      organizer: event.organizer,
      date: event.date,
      time: event.time,
      format: event.format as 'virtual' | 'inperson' | 'hybrid',
      type: event.type,
      description: event.description,
      featured: event.featured ?? false,
      url: event.url,
      audience: event.audience || ['Founders'],
      city: event.city || 'Seattle',
    }));
    return sortEventsByDate(events);
  }, [dbEvents]);

  const filteredEvents = useMemo(() => {
    return allEvents.filter((event) => {
      const matchesSearch = 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.organizer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.type.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesAudience = 
        audienceFilter === 'All' || 
        event.audience.includes(audienceFilter);
      const matchesLocation = 
        locationFilter === 'All' || 
        (locationFilter === 'Virtual' && event.format === 'virtual') ||
        event.city === locationFilter;
      const matchesType = 
        typeFilter === 'All' || 
        event.type === typeFilter;
      return matchesSearch && matchesAudience && matchesLocation && matchesType;
    });
  }, [allEvents, searchQuery, audienceFilter, locationFilter, typeFilter]);

  return (
    <AppLayout 
      activeTab="events" 
      tabCounts={{ events: allEvents.length }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {/* Suggestion Box */}
        <SuggestionDialog />
        
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-foreground">Upcoming Events</h2>
          <p className="text-sm text-muted-foreground">Curated events for Seattle founders and operators</p>
        </div>

        {/* Filters */}
        <div className="mb-4">
          <EventFilter
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            audienceFilter={audienceFilter}
            onAudienceChange={setAudienceFilter}
            locationFilter={locationFilter}
            onLocationChange={setLocationFilter}
            typeFilter={typeFilter}
            onTypeChange={setTypeFilter}
          />
        </div>
        
        {/* Events List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-3">
            {filteredEvents.map((event) => {
              const FormatIcon = formatIcon[event.format];
              return (
                <a 
                  key={event.id} 
                  href={event.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block bg-card border rounded-lg p-4 hover:border-primary/50 transition-colors ${event.featured ? 'border-primary/30' : 'border-border'}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={event.format as 'virtual' | 'inperson' | 'hybrid'}>{event.format}</Badge>
                        <span className="text-xs text-muted-foreground">{event.type}</span>
                        {event.featured && <Badge variant="outline" className="text-xs border-primary/50 text-primary">Featured</Badge>}
                      </div>
                      <h3 className="font-medium text-foreground mb-1">{event.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <FormatIcon className="h-3 w-3" />
                          {event.organizer}
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-sm font-medium text-foreground">{event.date}</div>
                      <div className="text-xs text-muted-foreground">{event.time}</div>
                    </div>
                  </div>
                </a>
              );
            })}
            {filteredEvents.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No events match your filters.</p>
            )}
          </div>
        )}

        {/* Digest Signup */}
        <div className="mt-12">
          <DigestSignup sourceTab="events" />
        </div>
      </div>

      {/* Exit Intent Modal */}
      <ExitIntentModal sourceTab="events" />
    </AppLayout>
  );
}
