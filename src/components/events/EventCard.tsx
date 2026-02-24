import { useState } from 'react';
import { Clock, MapPin, ExternalLink, CalendarPlus, Lightbulb } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Event } from '@/types/events';
import { cn } from '@/lib/utils';
import { parseEventDate } from '@/lib/eventUtils';

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

function getTypeLabel(type: string, format: string): string {
  if (type && type !== 'Event') return type.toUpperCase();
  if (format === 'virtual') return 'VIRTUAL';
  if (format === 'hybrid') return 'HYBRID';
  return 'EVENT';
}

export default function EventCard({ event }: EventCardProps) {
  const [expanded, setExpanded] = useState(false);
  const audienceLabel = getAudienceLabel(event.audience || []);
  const signal = event.outcome_framing || '';

  const parsed = parseEventDate(event.date);
  const monthShort = parsed
    ? parsed.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
    : '';
  const dayNum = parsed ? parsed.getDate() : '';

  const calendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${encodeURIComponent(event.date)}/${encodeURIComponent(event.date)}&details=${encodeURIComponent(event.description || '')}&location=${encodeURIComponent(event.city || '')}`;

  return (
    <div className="flex bg-card border border-border rounded-lg overflow-hidden transition-all hover:shadow-md">
      {/* Date block */}
      <div className="flex flex-col items-center justify-center px-4 py-5 bg-muted text-muted-foreground min-w-[72px] shrink-0">
        <span className="text-xs font-medium tracking-wider opacity-80">{monthShort}</span>
        <span className="text-2xl font-bold leading-none mt-0.5">{dayNum}</span>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-3.5 min-w-0">
        {/* Tags */}
        <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
          <Badge className="text-[10px] font-semibold uppercase tracking-wide bg-primary/10 text-primary border-primary/20 rounded-sm px-1.5 py-0">
            {audienceLabel}
          </Badge>
          <Badge variant="outline" className="text-[10px] font-semibold uppercase tracking-wide rounded-sm px-1.5 py-0">
            {getTypeLabel(event.type, event.format)}
          </Badge>
          {event.cost && event.cost !== 'Free' && (
            <Badge variant="outline" className="text-[10px] font-medium rounded-sm px-1.5 py-0">
              {event.cost}
            </Badge>
          )}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-foreground text-[15px] leading-snug mb-1.5">
          {event.title}
        </h3>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[13px] text-muted-foreground mb-1.5">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {event.time}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {event.city || 'Seattle'}
          </span>
          <span className="opacity-70">{event.organizer}</span>
        </div>

        {/* Signal */}
        {signal && (
          <div className="flex items-start gap-1.5 mb-1.5">
            <Lightbulb className="h-3 w-3 text-primary mt-0.5 shrink-0" />
            <p className="text-[13px] text-foreground/70 leading-relaxed">{signal}</p>
          </div>
        )}

        {/* Description - show first line, expandable */}
        {event.description && (
          <p
            className={cn(
              "text-[13px] text-muted-foreground leading-relaxed cursor-pointer hover:text-foreground/70 transition-colors",
              !expanded && "line-clamp-2"
            )}
            onClick={() => setExpanded(!expanded)}
          >
            {event.description}
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 mt-2.5">
          <Button size="sm" className="h-7 text-xs rounded-sm" asChild>
            <a href={event.url} target="_blank" rel="noopener noreferrer">
              Register
              <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          </Button>
          <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground rounded-sm" asChild>
            <a href={calendarUrl} target="_blank" rel="noopener noreferrer">
              <CalendarPlus className="h-3 w-3 mr-1" />
              Save
            </a>
          </Button>
          {event.cost === 'Free' && (
            <span className="text-[11px] text-muted-foreground ml-auto">Free</span>
          )}
        </div>
      </div>
    </div>
  );
}
