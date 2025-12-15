import { useState } from 'react';
import { Calendar, Clock, Newspaper, Users, Building2, Rocket, Briefcase, Heart, ChevronRight, MapPin, Video, Globe } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
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

const roleLabels = {
  operator: 'Operator',
  marketer: 'Marketing',
  finance: 'Finance',
  legal: 'Legal',
  hr: 'HR',
};

const resourceTypeLabels = {
  tool: '🔧 Tool',
  guide: '📖 Guide',
  template: '📄 Template',
  service: '🛠 Service',
};

const communityTypeLabels = {
  slack: '💬 Slack',
  meetup: '🤝 Meetup',
  dinner: '🍽 Dinner',
  discord: '🎮 Discord',
};

export default function MainLayout() {
  const [activeTab, setActiveTab] = useState('this-week');

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
            <Badge variant="outline" className="text-xs">
              Updated {weekInfo.lastUpdated.split(' at ')[0]}
            </Badge>
          </div>
          
          {/* Tabs - Notion style navigation */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full justify-start bg-transparent border-b-0 p-0 h-auto gap-0 overflow-x-auto">
              <TabsTrigger 
                value="this-week" 
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2 text-sm"
              >
                📅 This Week
              </TabsTrigger>
              <TabsTrigger 
                value="directory" 
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2 text-sm"
              >
                📂 Directory
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </header>

      {/* Content - Morning Brew scrollable style */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="this-week" className="mt-0 space-y-8">
            {/* Featured Events */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">Featured Events</h2>
              </div>
              <div className="space-y-3">
                {mockEvents.filter(e => e.featured).map((event) => {
                  const FormatIcon = formatIcon[event.format];
                  return (
                    <article key={event.id} className="bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant={event.format}>{event.format}</Badge>
                            <span className="text-xs text-muted-foreground">{event.type}</span>
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
              <button className="text-sm text-primary hover:underline mt-3 flex items-center gap-1">
                View all {mockEvents.length} events <ChevronRight className="h-4 w-4" />
              </button>
            </section>

            {/* Deadlines */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Clock className="h-5 w-5 text-deadline" />
                <h2 className="text-lg font-semibold text-foreground">⏰ Approaching Deadlines</h2>
              </div>
              <div className="space-y-2">
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
              </div>
            </section>

            {/* News */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Newspaper className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-lg font-semibold text-foreground">📰 Ecosystem News</h2>
              </div>
              <div className="space-y-2">
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
              </div>
            </section>
          </TabsContent>

          <TabsContent value="directory" className="mt-0">
            {/* Directory Sub-tabs */}
            <Tabs defaultValue="vcs" className="w-full">
              <TabsList className="w-full justify-start bg-muted/30 p-1 h-auto gap-1 overflow-x-auto mb-6">
                <TabsTrigger value="vcs" className="text-xs px-3 py-1.5">
                  <Building2 className="h-3 w-3 mr-1" /> VCs
                </TabsTrigger>
                <TabsTrigger value="accelerators" className="text-xs px-3 py-1.5">
                  <Rocket className="h-3 w-3 mr-1" /> Accelerators
                </TabsTrigger>
                <TabsTrigger value="communities" className="text-xs px-3 py-1.5">
                  <Users className="h-3 w-3 mr-1" /> Communities
                </TabsTrigger>
                <TabsTrigger value="resources" className="text-xs px-3 py-1.5">
                  <Briefcase className="h-3 w-3 mr-1" /> Resources
                </TabsTrigger>
                <TabsTrigger value="key-support" className="text-xs px-3 py-1.5">
                  <Heart className="h-3 w-3 mr-1" /> Key Support
                </TabsTrigger>
              </TabsList>

              {/* VCs */}
              <TabsContent value="vcs" className="space-y-3">
                {mockVCs.map((vc) => (
                  <article key={vc.id} className="bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground mb-1">{vc.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{vc.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {vc.focus.map((f) => (
                            <Badge key={f} variant="outline" className="text-xs">{f}</Badge>
                          ))}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-sm font-medium text-primary">{vc.checkSize}</div>
                        <div className="text-xs text-muted-foreground">{vc.stages.join(', ')}</div>
                      </div>
                    </div>
                  </article>
                ))}
              </TabsContent>

              {/* Accelerators */}
              <TabsContent value="accelerators" className="space-y-3">
                {mockAccelerators.map((acc) => (
                  <article key={acc.id} className="bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground mb-1">{acc.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{acc.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {acc.focus.map((f) => (
                            <Badge key={f} variant="outline" className="text-xs">{f}</Badge>
                          ))}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-sm font-medium text-primary">{acc.investment}</div>
                        <div className="text-xs text-muted-foreground">{acc.duration}</div>
                      </div>
                    </div>
                  </article>
                ))}
              </TabsContent>

              {/* Communities */}
              <TabsContent value="communities" className="space-y-3">
                {mockCommunities.map((community) => (
                  <article key={community.id} className="bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="muted" className="text-xs">{communityTypeLabels[community.type]}</Badge>
                        </div>
                        <h3 className="font-medium text-foreground mb-1">{community.name}</h3>
                        <p className="text-sm text-muted-foreground">{community.description}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-sm font-medium text-foreground">{community.members}</div>
                        <div className="text-xs text-muted-foreground">members</div>
                      </div>
                    </div>
                  </article>
                ))}
              </TabsContent>

              {/* Resources */}
              <TabsContent value="resources" className="space-y-3">
                {mockResources.map((resource) => (
                  <article key={resource.id} className="bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="muted" className="text-xs">{resourceTypeLabels[resource.type]}</Badge>
                          <Badge variant="outline" className="text-xs">{resource.category}</Badge>
                        </div>
                        <h3 className="font-medium text-foreground mb-1">{resource.name}</h3>
                        <p className="text-sm text-muted-foreground">{resource.description}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </TabsContent>

              {/* Key Support */}
              <TabsContent value="key-support" className="space-y-3">
                {mockKeySupport.map((person) => (
                  <article key={person.id} className="bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="muted" className="text-xs">{roleLabels[person.role]}</Badge>
                        </div>
                        <h3 className="font-medium text-foreground mb-1">{person.name}</h3>
                        <div className="text-sm font-medium text-primary mb-1">{person.specialty}</div>
                        <p className="text-sm text-muted-foreground">{person.description}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}