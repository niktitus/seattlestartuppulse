import { useState, useMemo } from 'react';
import { Video, MapPin, Globe, Loader2, ExternalLink } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import SuggestionDialog from '@/components/SuggestionDialog';
import DigestSignup from '@/components/digest/DigestSignup';
import ExitIntentModal from '@/components/digest/ExitIntentModal';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EventFilter, { AudienceFilter, LocationFilter, TypeFilter } from '@/components/EventFilter';
import { useEvents } from '@/hooks/useEvents';
import { 
  mockDeadlines, 
  mockNews, 
  mockCommunities, 
  mockResources, 
  weekInfo 
} from '@/data/mockData';
import { sortEventsByDate } from '@/lib/eventUtils';

const formatIcon: Record<string, typeof Video> = {
  virtual: Video,
  inperson: MapPin,
  hybrid: Globe,
};

export default function Events() {
  const [activeSubTab, setActiveSubTab] = useState('events');
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

  const resourceLinks = [
    { id: 'quiz', name: 'Chief of Staff Quiz', url: 'https://chiefofstaffquiz.lovable.app/', description: 'Challenge your hiring for Operations roles', category: 'Hiring' },
    { id: 'hiring-support', name: 'Fractional Support Directory', url: 'https://nicoletitus.notion.site/Other-Fractional-Support-2ca7696659d180f58625e345d061412a?source=copy_link', description: 'Founder-focused fractional professionals', category: 'Hiring' },
    ...mockCommunities.map(c => ({ id: c.id, name: c.name, url: c.url, description: c.description, category: 'Community' })),
    ...mockResources.map(r => ({ id: r.id, name: r.name, url: r.url, description: r.description, category: 'Resource' })),
  ];

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
        
        {/* Sub-tabs for Events content */}
        <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="w-full">
          <TabsList className="w-full justify-start bg-transparent border-b border-border rounded-none p-0 h-auto gap-0 mb-6">
            <TabsTrigger 
              value="events" 
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2 text-sm"
            >
              📅 Upcoming <Badge variant="secondary" className="ml-1.5 text-xs">{allEvents.length}</Badge>
            </TabsTrigger>
            <TabsTrigger 
              value="deadlines" 
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2 text-sm"
            >
              ⏰ Deadlines <Badge variant="outline" className="ml-1.5 text-xs border-destructive/50 text-destructive">{mockDeadlines.length}</Badge>
            </TabsTrigger>
            <TabsTrigger 
              value="news" 
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2 text-sm"
            >
              📰 News <Badge variant="secondary" className="ml-1.5 text-xs">{mockNews.length}</Badge>
            </TabsTrigger>
            <TabsTrigger 
              value="resources" 
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2 text-sm"
            >
              🔗 Resources
            </TabsTrigger>
          </TabsList>

          {/* Events Tab */}
          <TabsContent value="events" className="mt-0">
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
          </TabsContent>

          {/* Deadlines Tab */}
          <TabsContent value="deadlines" className="mt-0 space-y-2">
            {mockDeadlines.map((deadline) => (
              <article key={deadline.id} className="flex items-center justify-between gap-4 bg-card border border-border rounded-lg p-3 hover:border-destructive/30 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs border-destructive/50 text-destructive">{deadline.type}</Badge>
                  </div>
                  <h3 className="font-medium text-foreground text-sm">{deadline.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-1">{deadline.description}</p>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-medium text-destructive">{deadline.daysLeft} days</div>
                  <div className="text-xs text-muted-foreground">{deadline.dueDate}</div>
                </div>
              </article>
            ))}
          </TabsContent>

          {/* News Tab */}
          <TabsContent value="news" className="mt-0 space-y-2">
            {mockNews.map((item) => (
              <article key={item.id} className="bg-card border border-border rounded-lg p-3 hover:border-muted-foreground/30 transition-colors">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <span>{item.source}</span>
                  <span>•</span>
                  <span>{item.date}</span>
                  <Badge variant="secondary" className="ml-auto text-xs">{item.category}</Badge>
                </div>
                <h3 className="font-medium text-foreground text-sm">{item.title}</h3>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.summary}</p>
              </article>
            ))}
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="mt-0 space-y-2">
            {resourceLinks.map((link) => (
              <a 
                key={link.id} 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-4 bg-card border border-border rounded-lg p-3 hover:border-primary/50 hover:bg-accent/5 transition-colors group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="secondary" className="text-xs">{link.category}</Badge>
                  </div>
                  <h3 className="font-medium text-foreground text-sm group-hover:text-primary transition-colors">{link.name}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-1">{link.description}</p>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary shrink-0 transition-colors" />
              </a>
            ))}
          </TabsContent>
        </Tabs>

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
