import { Calendar, Clock, MapPin, Monitor, Users, ArrowRight, ExternalLink, Filter, ChevronDown, Hash, MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockEvents, mockDeadlines, mockNews, mockCommunities, weekInfo } from '@/data/mockData';

/**
 * VARIATION 2: "Product Hunt Card Grid"
 * 
 * Key characteristics:
 * - Card-based grid layout with generous whitespace
 * - Sticky filter bar at top
 * - Two-column layout on desktop, single on mobile
 * - Visual hierarchy through card size and prominence
 * - Clean, Product Hunt-inspired aesthetic
 */

const formatIcon = {
  virtual: Monitor,
  inperson: MapPin,
  hybrid: Users,
};

export function VariationTwo() {
  const featuredEvents = mockEvents.filter(e => e.featured);
  const otherEvents = mockEvents.filter(e => !e.featured);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-sm">
        <div className="container py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="font-serif text-lg font-bold text-foreground">Seattle Startup Pulse</h1>
              <span className="hidden sm:inline-block text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                {weekInfo.weekNumber}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                <Filter className="w-4 h-4 mr-1" />
                Filters
                <ChevronDown className="w-3 h-3 ml-1" />
              </Button>
              <Button size="sm" className="gradient-hero text-primary-foreground">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-8">
        {/* Grid Layout */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - 2 cols */}
          <div className="lg:col-span-2 space-y-8">
            {/* Featured Events Section */}
            <section className="animate-fade-up">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif text-lg font-semibold text-foreground flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                  Featured Events
                </h2>
                <button className="text-sm text-muted-foreground hover:text-foreground">
                  View all →
                </button>
              </div>

              <div className="grid gap-4">
                {featuredEvents.map((event, index) => {
                  const FormatIcon = formatIcon[event.format];
                  return (
                    <div
                      key={event.id}
                      className="group bg-card rounded-xl border border-border p-5 shadow-card hover:shadow-card-hover transition-all hover:border-primary/20"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div className="flex gap-4">
                        {/* Date Block */}
                        <div className="shrink-0 w-14 text-center">
                          <div className="text-xs text-muted-foreground uppercase tracking-wider">Dec</div>
                          <div className="text-2xl font-bold text-foreground">{event.date.split(' ')[1]}</div>
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant={event.format} className="flex items-center gap-1">
                              <FormatIcon className="w-3 h-3" />
                              {event.format}
                            </Badge>
                            <Badge variant="muted">{event.type}</Badge>
                          </div>
                          <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                            {event.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{event.description}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {event.time}
                            </span>
                            <span>{event.organizer}</span>
                          </div>
                        </div>

                        {/* Action */}
                        <Button size="sm" variant="ghost" className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* More Events */}
            <section className="animate-fade-up" style={{ animationDelay: '0.15s' }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif text-lg font-semibold text-foreground flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground"></span>
                  More This Week
                </h2>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {otherEvents.map((event) => {
                  const FormatIcon = formatIcon[event.format];
                  return (
                    <div
                      key={event.id}
                      className="group bg-card rounded-lg border border-border p-4 hover:shadow-card-hover transition-all hover:border-primary/20"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={event.format} className="text-xs">
                          <FormatIcon className="w-3 h-3" />
                        </Badge>
                        <span className="text-xs text-muted-foreground">{event.date} · {event.time}</span>
                      </div>
                      <h3 className="font-medium text-foreground text-sm group-hover:text-primary transition-colors">
                        {event.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">{event.organizer}</p>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* News Section */}
            <section className="animate-fade-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif text-lg font-semibold text-foreground flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  Ecosystem Updates
                </h2>
              </div>

              <div className="space-y-3">
                {mockNews.map((item) => (
                  <div
                    key={item.id}
                    className="group flex items-start gap-4 p-4 bg-card rounded-lg border border-border hover:border-primary/20 transition-all"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-primary">{item.source}</span>
                        <span className="text-xs text-muted-foreground">· {item.date}</span>
                      </div>
                      <h3 className="font-medium text-foreground text-sm group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{item.summary}</p>
                    </div>
                    <Button size="sm" variant="ghost" className="shrink-0 opacity-0 group-hover:opacity-100">
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar - 1 col */}
          <div className="space-y-6">
            {/* Deadlines Card */}
            <section className="animate-fade-up bg-card rounded-xl border border-border p-5 shadow-card" style={{ animationDelay: '0.1s' }}>
              <h2 className="font-serif text-base font-semibold text-foreground mb-4 flex items-center gap-2">
                ⏰ Deadlines
              </h2>
              <div className="space-y-4">
                {mockDeadlines.map((deadline) => (
                  <div key={deadline.id} className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                      deadline.daysLeft <= 5 
                        ? 'bg-destructive/10 text-destructive' 
                        : 'bg-secondary/10 text-secondary'
                    }`}>
                      {deadline.daysLeft}d
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-foreground">{deadline.title}</h3>
                      <p className="text-xs text-muted-foreground">{deadline.type}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="w-full mt-4">
                View All Deadlines
              </Button>
            </section>

            {/* Communities Card */}
            <section className="animate-fade-up bg-card rounded-xl border border-border p-5 shadow-card" style={{ animationDelay: '0.15s' }}>
              <h2 className="font-serif text-base font-semibold text-foreground mb-4 flex items-center gap-2">
                👥 Communities
              </h2>
              <div className="space-y-3">
                {mockCommunities.slice(0, 3).map((community) => (
                  <a
                    key={community.id}
                    href={community.url}
                    className="flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      {community.type === 'slack' && <Hash className="w-4 h-4 text-primary" />}
                      {community.type === 'meetup' && <Users className="w-4 h-4 text-primary" />}
                      {community.type === 'dinner' && <Calendar className="w-4 h-4 text-primary" />}
                      {community.type === 'discord' && <MessageSquare className="w-4 h-4 text-primary" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-foreground truncate">{community.name}</h3>
                      <p className="text-xs text-muted-foreground">{community.members}</p>
                    </div>
                  </a>
                ))}
              </div>
              <Button variant="outline" size="sm" className="w-full mt-3">
                Browse All
              </Button>
            </section>

            {/* Submit CTA */}
            <div className="animate-fade-up bg-accent rounded-xl p-5 text-center" style={{ animationDelay: '0.2s' }}>
              <p className="text-sm text-foreground mb-3">Know something we should include?</p>
              <Button variant="outline" size="sm">
                Submit a Resource
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-12">
        <div className="container py-6 text-center">
          <p className="text-sm text-muted-foreground">
            Curated weekly · Updated {weekInfo.lastUpdated}
          </p>
        </div>
      </footer>
    </div>
  );
}
