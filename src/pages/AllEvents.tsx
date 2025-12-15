import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Video, Globe, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import EventFilter from '@/components/EventFilter';
import { 
  mockEvents, 
  mockVCs, 
  mockAccelerators,
  weekInfo 
} from '@/data/mockData';

const formatIcon = {
  virtual: Video,
  inperson: MapPin,
  hybrid: Globe,
};

// Extended mock data with future events
const futureEvents = [
  ...mockEvents,
  ...mockVCs.filter(vc => vc.upcomingEvent).map(vc => ({
    id: `vc-${vc.id}`,
    title: vc.upcomingEvent!,
    organizer: vc.name,
    date: 'This Week',
    time: 'TBD',
    format: 'hybrid' as const,
    type: 'VC Event',
    description: `Hosted by ${vc.name}`,
    featured: false,
  })),
  ...mockAccelerators.filter(acc => acc.upcomingEvent).map(acc => ({
    id: `acc-${acc.id}`,
    title: acc.upcomingEvent!,
    organizer: acc.name,
    date: 'This Week',
    time: 'TBD',
    format: 'inperson' as const,
    type: 'Accelerator Event',
    description: `Hosted by ${acc.name}`,
    featured: false,
  })),
  // Additional future events
  {
    id: 'future-1',
    title: 'Seattle Startup Week 2025',
    organizer: 'Seattle Chamber',
    date: 'Feb 10-14',
    time: 'Various',
    format: 'hybrid' as const,
    type: 'Conference',
    description: 'A week-long celebration of Seattle\'s startup ecosystem with workshops, panels, and networking.',
    featured: true,
  },
  {
    id: 'future-2',
    title: 'AI in Enterprise Summit',
    organizer: 'TechStars Seattle',
    date: 'Feb 20',
    time: '9:00 AM',
    format: 'inperson' as const,
    type: 'Conference',
    description: 'Deep dive into how enterprises are adopting AI solutions from local startups.',
    featured: false,
  },
  {
    id: 'future-3',
    title: 'Women in Tech Networking Night',
    organizer: 'Seattle Women in Tech',
    date: 'Feb 25',
    time: '6:00 PM',
    format: 'inperson' as const,
    type: 'Networking',
    description: 'Monthly gathering for women founders, engineers, and tech professionals.',
    featured: false,
  },
  {
    id: 'future-4',
    title: 'Remote Founder Fireside Chat',
    organizer: 'Pioneer Square Labs',
    date: 'Mar 1',
    time: '12:00 PM',
    format: 'virtual' as const,
    type: 'Panel',
    description: 'Learn from founders who\'ve built successful distributed teams.',
    featured: false,
  },
];

export default function AllEvents() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvents = futureEvents.filter((event) => {
    return event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.organizer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.type.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link 
              to="/" 
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
            <div className="flex-1">
            <h1 className="text-xl font-display font-bold text-foreground">All Future Events</h1>
              <p className="text-sm text-muted-foreground">Plan your calendar in advance</p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-4">
          <EventFilter
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </div>

        <div className="text-sm text-muted-foreground mb-4">
          Showing {filteredEvents.length} events
        </div>

        <div className="space-y-3">
          {filteredEvents.map((event) => {
            const FormatIcon = formatIcon[event.format];
            return (
              <article 
                key={event.id} 
                className={`bg-card border rounded-lg p-4 hover:border-primary/50 transition-colors ${
                  event.featured ? 'border-primary/30' : 'border-border'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={event.format}>{event.format === 'inperson' ? 'In-Person' : event.format}</Badge>
                      <span className="text-xs text-muted-foreground">{event.type}</span>
                      {event.featured && (
                        <Badge variant="outline" className="text-xs border-primary/50 text-primary">Featured</Badge>
                      )}
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
              </article>
            );
          })}
        </div>
      </main>
    </div>
  );
}
