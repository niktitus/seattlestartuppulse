import { useState } from 'react';
import { Calendar, Clock, Newspaper, ExternalLink, MapPin, Video, Globe, Link2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  mockEvents, 
  mockDeadlines, 
  mockNews, 
  mockCommunities, 
  mockVCs, 
  mockAccelerators, 
  mockResources, 
  mockKeySupport,
  weekInfo 
} from '@/data/mockData';

const formatIcon = {
  virtual: Video,
  inperson: MapPin,
  hybrid: Globe,
};

export default function MainLayout() {
  const [activeTab, setActiveTab] = useState('events');

  // Combine events with VC/Accelerator hosted events
  const allEvents = [
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
  ];

  const resourceLinks = [
    { id: 'quiz', name: 'Chief of Staff Quiz', url: 'https://chiefofstaffquiz.lovable.app/', description: 'Challenge your hiring for Operations roles', category: 'Hiring' },
    { id: 'hiring-support', name: 'Fractional Support Directory', url: 'https://nicoletitus.notion.site/Other-Fractional-Support-2ca7696659d180f58625e345d061412a?source=copy_link', description: 'Founder-focused fractional professionals', category: 'Hiring' },
    ...mockCommunities.map(c => ({ id: c.id, name: c.name, url: c.url, description: c.description, category: 'Community' })),
    ...mockResources.map(r => ({ id: r.id, name: r.name, url: r.url, description: r.description, category: 'Resource' })),
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Notion style */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-display font-bold text-foreground">Seattle Startup Pulse</h1>
              <p className="text-sm text-muted-foreground">{weekInfo.weekNumber}</p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setActiveTab('resources')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded-md transition-colors"
              >
                <Link2 className="h-4 w-4" />
                Resources
              </button>
              <Badge variant="outline" className="text-xs">
                Updated {weekInfo.lastUpdated.split(' at ')[0]}
              </Badge>
            </div>
          </div>
          
          {/* Tabs - Notion style with counts */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full justify-start bg-transparent border-b-0 p-0 h-auto gap-0 overflow-x-auto">
              <TabsTrigger 
                value="events" 
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2 text-sm"
              >
                📅 Events <Badge variant="muted" className="ml-1.5 text-xs">{allEvents.length}</Badge>
              </TabsTrigger>
              <TabsTrigger 
                value="deadlines" 
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2 text-sm"
              >
                ⏰ Deadlines <Badge variant="deadline" className="ml-1.5 text-xs">{mockDeadlines.length}</Badge>
              </TabsTrigger>
              <TabsTrigger 
                value="news" 
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2 text-sm"
              >
                📰 News <Badge variant="muted" className="ml-1.5 text-xs">{mockNews.length}</Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </header>

      {/* Content - Morning Brew scrollable style */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          {/* Events Tab */}
          <TabsContent value="events" className="mt-0 space-y-3">
            {allEvents.map((event) => {
              const FormatIcon = formatIcon[event.format];
              return (
                <article key={event.id} className={`bg-card border rounded-lg p-4 hover:border-primary/50 transition-colors ${event.featured ? 'border-primary/30' : 'border-border'}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={event.format}>{event.format}</Badge>
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
                </article>
              );
            })}
          </TabsContent>

          {/* Deadlines Tab */}
          <TabsContent value="deadlines" className="mt-0 space-y-2">
            {mockDeadlines.map((deadline) => (
              <article key={deadline.id} className="flex items-center justify-between gap-4 bg-card border border-border rounded-lg p-3 hover:border-deadline/50 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="deadline">{deadline.type}</Badge>
                  </div>
                  <h3 className="font-medium text-foreground text-sm">{deadline.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-1">{deadline.description}</p>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-medium text-deadline">{deadline.daysLeft} days</div>
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
                  <Badge variant="muted" className="ml-auto">{item.category}</Badge>
                </div>
                <h3 className="font-medium text-foreground text-sm">{item.title}</h3>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.summary}</p>
              </article>
            ))}
          </TabsContent>

          {/* Resources Tab - Link focused */}
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
                    <Badge variant="muted" className="text-xs">{link.category}</Badge>
                  </div>
                  <h3 className="font-medium text-foreground text-sm group-hover:text-primary transition-colors">{link.name}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-1">{link.description}</p>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary shrink-0 transition-colors" />
              </a>
            ))}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}