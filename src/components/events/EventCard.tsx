import { Star, Calendar, MapPin, ExternalLink, CalendarPlus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Event } from '@/types/events';
import { cn } from '@/lib/utils';

interface EventCardProps {
  event: Event;
}

function getAudienceLabel(audience: string[]): string {
  const first = audience[0] || 'Open to All';
  if (first.toUpperCase().includes('FOUNDER')) return 'Founders';
  if (first.toUpperCase().includes('OPERATOR')) return 'Operators';
  if (first.toUpperCase().includes('TECHNICAL')) return 'Technical';
  return 'Open to All';
}

function getStageLabel(stage: string[]): string {
  if (!stage || stage.length === 0) return 'All Stages';
  if (stage.includes('Pre-seed') || stage.includes('PRE-REVENUE')) return 'Pre-revenue';
  if (stage.includes('Seed') || stage.includes('$0-1M')) return '$0–1M';
  if (stage.includes('Series A') || stage.includes('$1M-10M')) return '$1M–10M';
  if (stage.includes('Series B') || stage.includes('Series C+') || stage.includes('$10M+')) return '$10M+';
  return 'All Stages';
}

export default function EventCard({ event }: EventCardProps) {
  const audienceLabel = getAudienceLabel(event.audience || []);
  const stageLabel = getStageLabel(event.stage || []);
  const isHighSignal = event.is_high_signal || event.featured;
  
  const calendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${encodeURIComponent(event.date)}/${encodeURIComponent(event.date)}&details=${encodeURIComponent(event.description || '')}&location=${encodeURIComponent(event.city || '')}`;

  return (
    <div
      className={cn(
        'bg-card border border-border p-4 transition-all hover:shadow-card-hover',
        isHighSignal && 'border-l-4 border-l-primary'
      )}
    >
      {/* Top row: tags */}
      <div className="flex flex-wrap items-center gap-1.5 mb-2">
        <Badge variant="outline" className="text-xs font-medium">{audienceLabel}</Badge>
        <Badge variant="outline" className="text-xs font-medium">{stageLabel}</Badge>
        <span className="text-xs text-muted-foreground">by {event.organizer}</span>
        {isHighSignal && (
          <Badge className="bg-primary/10 text-primary border-primary/20 text-xs font-semibold gap-1">
            <Star className="h-3 w-3 fill-current" />
            High Signal
          </Badge>
        )}
      </div>

      {/* Title */}
      <h3 className="font-semibold text-foreground text-base mb-1.5 leading-snug">
        {event.title}
      </h3>

      {/* Date / Location */}
      <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
        <span className="flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5" />
          {event.date} · {event.time}
        </span>
        <span className="flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5" />
          {event.city || 'Seattle'}
        </span>
      </div>

      {/* Description - clean, no box */}
      {event.description && (
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2 leading-relaxed">
          {event.outcome_framing || event.description}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <span className="text-xs text-muted-foreground">{event.cost || 'Free'}</span>
        <div className="flex items-center gap-1.5">
          <Button variant="ghost" size="sm" className="h-7 text-xs" asChild>
            <a href={calendarUrl} target="_blank" rel="noopener noreferrer">
              <CalendarPlus className="h-3 w-3 mr-1" />
              Save
            </a>
          </Button>
          <Button size="sm" className="h-7 text-xs" asChild>
            <a href={event.url} target="_blank" rel="noopener noreferrer">
              Register
              <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
