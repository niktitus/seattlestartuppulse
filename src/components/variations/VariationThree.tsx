import { Calendar, Clock, MapPin, Monitor, Users, ArrowRight, ExternalLink, Hash, MessageSquare, ChevronRight, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockEvents, mockDeadlines, mockNews, mockCommunities, weekInfo } from '@/data/mockData';

/**
 * VARIATION 3: "Notion Flexibility"
 * 
 * Key characteristics:
 * - Tab-based navigation for different views
 * - Timeline/calendar view option
 * - Flexible filtering without overwhelming
 * - Compact but information-rich cards
 * - Utility-focused with quick actions
 */

const formatIcon = {
  virtual: Monitor,
  inperson: MapPin,
  hybrid: Users,
};

export function VariationThree() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="font-serif text-xl font-bold text-foreground">Seattle Startup Pulse</h1>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Zap className="w-3 h-3 text-secondary" />
                {weekInfo.weekNumber}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">Submit</Button>
              <Button size="sm" className="gradient-hero text-primary-foreground">Subscribe</Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-6">
        {/* Quick Stats Bar */}
        <div className="animate-fade-up grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="bg-card rounded-lg border border-border p-3 text-center">
            <div className="text-2xl font-bold text-foreground">{mockEvents.length}</div>
            <div className="text-xs text-muted-foreground">Events</div>
          </div>
          <div className="bg-card rounded-lg border border-border p-3 text-center">
            <div className="text-2xl font-bold text-secondary">{mockDeadlines.filter(d => d.daysLeft <= 7).length}</div>
            <div className="text-xs text-muted-foreground">Urgent Deadlines</div>
          </div>
          <div className="bg-card rounded-lg border border-border p-3 text-center">
            <div className="text-2xl font-bold text-foreground">{mockNews.length}</div>
            <div className="text-xs text-muted-foreground">News Items</div>
          </div>
          <div className="bg-card rounded-lg border border-border p-3 text-center">
            <div className="text-2xl font-bold text-foreground">{mockCommunities.length}</div>
            <div className="text-xs text-muted-foreground">Communities</div>
          </div>
        </div>

        {/* Tabbed Interface */}
        <Tabs defaultValue="thisweek" className="animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <TabsList className="w-full justify-start bg-transparent border-b border-border rounded-none h-auto p-0 mb-6">
            <TabsTrigger 
              value="thisweek" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
            >
              This Week
            </TabsTrigger>
            <TabsTrigger 
              value="deadlines"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
            >
              Deadlines
            </TabsTrigger>
            <TabsTrigger 
              value="news"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
            >
              News
            </TabsTrigger>
            <TabsTrigger 
              value="directory"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
            >
              Directory
            </TabsTrigger>
          </TabsList>

          <TabsContent value="thisweek" className="mt-0">
            {/* Timeline View */}
            <div className="space-y-6">
              {/* Day Grouping */}
              {['Tuesday, Dec 17', 'Wednesday, Dec 18', 'Thursday, Dec 19', 'Friday, Dec 20', 'Saturday, Dec 21'].map((day, dayIndex) => {
                const dayEvents = mockEvents.filter((_, i) => i === dayIndex);
                if (dayEvents.length === 0 && dayIndex > 0) return null;
                
                const event = mockEvents[dayIndex];
                if (!event) return null;

                const FormatIcon = formatIcon[event.format];

                return (
                  <div key={day} className="flex gap-4">
                    {/* Date Column */}
                    <div className="w-20 sm:w-28 shrink-0 pt-1">
                      <div className="text-xs text-muted-foreground">{day.split(',')[0]}</div>
                      <div className="text-sm font-semibold text-foreground">{day.split(',')[1]}</div>
                    </div>

                    {/* Events Column */}
                    <div className="flex-1 pb-6 border-l border-border pl-4">
                      <div className="relative">
                        <div className="absolute -left-[21px] top-2 w-2 h-2 rounded-full bg-primary"></div>
                        
                        <div className="group bg-card rounded-lg border border-border p-4 hover:shadow-card-hover transition-all hover:border-primary/20">
                          <div className="flex items-start gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <Badge variant={event.format} className="flex items-center gap-1 text-xs">
                                  <FormatIcon className="w-3 h-3" />
                                  {event.format}
                                </Badge>
                                <Badge variant="muted" className="text-xs">{event.type}</Badge>
                                <span className="text-xs text-muted-foreground">{event.time}</span>
                              </div>
                              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                {event.title}
                              </h3>
                              <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                              <p className="text-xs text-muted-foreground mt-2">by {event.organizer}</p>
                            </div>
                            <Button size="sm" variant="outline" className="shrink-0">
                              Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="deadlines" className="mt-0">
            <div className="space-y-3">
              {mockDeadlines.map((deadline) => (
                <div
                  key={deadline.id}
                  className="flex items-center gap-4 bg-card rounded-lg border border-border p-4 hover:shadow-card-hover transition-shadow"
                >
                  <div className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center shrink-0 ${
                    deadline.daysLeft <= 5 
                      ? 'bg-destructive/10 text-destructive' 
                      : deadline.daysLeft <= 10 
                        ? 'bg-secondary/10 text-secondary'
                        : 'bg-muted text-muted-foreground'
                  }`}>
                    <span className="text-lg font-bold">{deadline.daysLeft}</span>
                    <span className="text-xs">days</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground">{deadline.title}</h3>
                      {deadline.daysLeft <= 5 && (
                        <Badge variant="deadline">Urgent</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{deadline.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">Due: {deadline.dueDate}</p>
                  </div>
                  <Button size="sm" className="shrink-0">
                    Apply Now
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="news" className="mt-0">
            <div className="space-y-3">
              {mockNews.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-4 bg-card rounded-lg border border-border p-4 hover:shadow-card-hover transition-shadow group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="muted">{item.category}</Badge>
                      <span className="text-xs text-muted-foreground">{item.source}</span>
                      <span className="text-xs text-muted-foreground">·</span>
                      <span className="text-xs text-muted-foreground">{item.date}</span>
                    </div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{item.summary}</p>
                  </div>
                  <Button size="sm" variant="ghost" className="shrink-0">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="directory" className="mt-0">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockCommunities.map((community) => (
                <div
                  key={community.id}
                  className="bg-card rounded-lg border border-border p-4 hover:shadow-card-hover transition-shadow group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      {community.type === 'slack' && <Hash className="w-5 h-5 text-primary" />}
                      {community.type === 'meetup' && <Users className="w-5 h-5 text-primary" />}
                      {community.type === 'dinner' && <Calendar className="w-5 h-5 text-primary" />}
                      {community.type === 'discord' && <MessageSquare className="w-5 h-5 text-primary" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{community.name}</h3>
                      <p className="text-xs text-muted-foreground mb-2">{community.members}</p>
                      <p className="text-sm text-muted-foreground line-clamp-2">{community.description}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-3">
                    Join
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-12">
        <div className="container py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
            <p>Updated {weekInfo.lastUpdated}</p>
            <div className="flex items-center gap-4">
              <button className="hover:text-foreground transition-colors">Archive</button>
              <button className="hover:text-foreground transition-colors">Submit Resource</button>
              <button className="hover:text-foreground transition-colors">About</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
