import { Calendar, Clock, MapPin, Monitor, Users, ArrowRight, ExternalLink, AlertCircle, MessageSquare, Hash } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockEvents, mockDeadlines, mockNews, mockCommunities, weekInfo } from '@/data/mockData';

/**
 * VARIATION 1: "Morning Brew Style"
 * 
 * Key characteristics:
 * - Single-column, newsletter-like scroll
 * - Clear section headers with emoji accents
 * - Generous whitespace between sections
 * - Cards with subtle borders, clean typography
 * - Mobile-first, scannable in 3 minutes
 */

const formatIcon = {
  virtual: Monitor,
  inperson: MapPin,
  hybrid: Users,
};

export function VariationOne() {
  const featuredEvents = mockEvents.filter(e => e.featured);
  const otherEvents = mockEvents.filter(e => !e.featured);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-xl font-bold text-foreground">Seattle Startup Pulse</h1>
              <p className="text-sm text-muted-foreground">{weekInfo.weekNumber}</p>
            </div>
            <Button variant="outline" size="sm" className="hidden sm:flex">
              Subscribe
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-6 space-y-10">
        {/* Hero Section */}
        <section className="animate-fade-up">
          <div className="rounded-xl gradient-hero p-6 text-primary-foreground">
            <p className="text-sm font-medium opacity-90 mb-2">📍 This Week in Seattle</p>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold mb-3">
              {weekInfo.totalEvents} events, {weekInfo.totalDeadlines} deadlines
            </h2>
            <p className="text-sm opacity-80">
              Updated {weekInfo.lastUpdated}
            </p>
          </div>
        </section>

        {/* Featured Events */}
        <section className="animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">🎯</span>
            <h2 className="font-serif text-xl font-semibold text-foreground">Featured This Week</h2>
          </div>
          
          <div className="space-y-3">
            {featuredEvents.map((event) => {
              const FormatIcon = formatIcon[event.format];
              return (
                <div
                  key={event.id}
                  className="bg-card rounded-lg border border-border p-4 shadow-card hover:shadow-card-hover transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={event.format}>{event.format}</Badge>
                        <Badge variant="muted">{event.type}</Badge>
                      </div>
                      <h3 className="font-semibold text-foreground mb-1">{event.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {event.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {event.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <FormatIcon className="w-3.5 h-3.5" />
                          {event.organizer}
                        </span>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost" className="shrink-0">
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Deadlines */}
        <section className="animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">⏰</span>
            <h2 className="font-serif text-xl font-semibold text-foreground">Upcoming Deadlines</h2>
          </div>
          
          <div className="bg-card rounded-lg border border-border divide-y divide-border">
            {mockDeadlines.map((deadline) => (
              <div key={deadline.id} className="p-4 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${
                  deadline.daysLeft <= 5 ? 'bg-destructive/10 text-destructive' : 'bg-secondary/10 text-secondary'
                }`}>
                  <span className="text-sm font-bold">{deadline.daysLeft}d</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-foreground">{deadline.title}</h3>
                    {deadline.daysLeft <= 5 && (
                      <Badge variant="deadline">Urgent</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{deadline.description}</p>
                </div>
                <Button size="sm" variant="outline" className="shrink-0">
                  Apply
                </Button>
              </div>
            ))}
          </div>
        </section>

        {/* News */}
        <section className="animate-fade-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">📰</span>
            <h2 className="font-serif text-xl font-semibold text-foreground">Ecosystem News</h2>
          </div>
          
          <div className="space-y-3">
            {mockNews.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-4 p-4 bg-card rounded-lg border border-border"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="muted">{item.category}</Badge>
                    <span className="text-xs text-muted-foreground">{item.source} · {item.date}</span>
                  </div>
                  <h3 className="font-medium text-foreground mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.summary}</p>
                </div>
                <Button size="sm" variant="ghost" className="shrink-0">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </section>

        {/* More Events */}
        {otherEvents.length > 0 && (
          <section className="animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">📅</span>
              <h2 className="font-serif text-xl font-semibold text-foreground">More This Week</h2>
            </div>
            
            <div className="space-y-3">
              {otherEvents.map((event) => {
                const FormatIcon = formatIcon[event.format];
                return (
                  <div
                    key={event.id}
                    className="bg-card rounded-lg border border-border p-4 shadow-card hover:shadow-card-hover transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={event.format}>{event.format}</Badge>
                          <Badge variant="muted">{event.type}</Badge>
                        </div>
                        <h3 className="font-semibold text-foreground mb-1">{event.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {event.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {event.time}
                          </span>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost" className="shrink-0">
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Communities */}
        <section className="animate-fade-up" style={{ animationDelay: '0.5s' }}>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">👥</span>
            <h2 className="font-serif text-xl font-semibold text-foreground">Join the Community</h2>
          </div>
          
          <div className="grid gap-3 sm:grid-cols-2">
            {mockCommunities.map((community) => (
              <div
                key={community.id}
                className="bg-card rounded-lg border border-border p-4 hover:shadow-card-hover transition-shadow"
              >
                <div className="flex items-center gap-2 mb-2">
                  {community.type === 'slack' && <Hash className="w-4 h-4 text-primary" />}
                  {community.type === 'meetup' && <Users className="w-4 h-4 text-primary" />}
                  {community.type === 'dinner' && <Calendar className="w-4 h-4 text-primary" />}
                  {community.type === 'discord' && <MessageSquare className="w-4 h-4 text-primary" />}
                  <h3 className="font-medium text-foreground">{community.name}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{community.description}</p>
                <p className="text-xs text-muted-foreground">{community.members} members</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-12">
        <div className="container py-6 text-center">
          <p className="text-sm text-muted-foreground">
            Curated weekly for Seattle founders · <button className="text-primary hover:underline">Submit a resource</button>
          </p>
        </div>
      </footer>
    </div>
  );
}
