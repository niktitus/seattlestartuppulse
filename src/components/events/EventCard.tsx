import { Star, Calendar, MapPin, Users, ExternalLink, CalendarPlus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Event, AudienceType } from '@/types/events';
import { cn } from '@/lib/utils';

interface EventCardProps {
  event: Event;
}

const audienceBadgeStyles: Record<string, string> = {
  'FOUNDER ONLY': 'bg-destructive/10 text-destructive border-destructive/20',
  'OPERATOR ONLY': 'bg-primary/10 text-primary border-primary/20',
  'TECHNICAL': 'bg-primary/10 text-primary border-primary/20',
  'OPEN TO ALL': 'bg-muted text-muted-foreground border-border',
  'Founders': 'bg-destructive/10 text-destructive border-destructive/20',
  'Operators': 'bg-primary/10 text-primary border-primary/20',
};

const audienceIcons: Record<string, string> = {
  'FOUNDER ONLY': '🎯',
  'OPERATOR ONLY': '🎯',
  'TECHNICAL': '💻',
  'OPEN TO ALL': '🌐',
  'Founders': '🎯',
  'Operators': '🎯',
};

function getAudienceDisplay(audience: string[]): { label: string; style: string; icon: string } {
  const first = audience[0] || 'OPEN TO ALL';
  return {
    label: first.toUpperCase().includes('FOUNDER') ? 'FOUNDER ONLY' : 
           first.toUpperCase().includes('OPERATOR') ? 'OPERATOR ONLY' :
           first.toUpperCase().includes('TECHNICAL') ? 'TECHNICAL' : 'OPEN TO ALL',
    style: audienceBadgeStyles[first] || audienceBadgeStyles['OPEN TO ALL'],
    icon: audienceIcons[first] || '🌐',
  };
}

function getStageDisplay(stage: string[]): string {
  if (!stage || stage.length === 0) return 'ALL STAGES';
  if (stage.includes('Pre-seed') || stage.includes('PRE-REVENUE')) return 'PRE-REVENUE';
  if (stage.includes('Seed') || stage.includes('$0-1M')) return '$0-1M';
  if (stage.includes('Series A') || stage.includes('$1M-10M')) return '$1M-10M';
  if (stage.includes('Series B') || stage.includes('Series C+') || stage.includes('$10M+')) return '$10M+';
  return 'ALL STAGES';
}

export default function EventCard({ event }: EventCardProps) {
  const audienceDisplay = getAudienceDisplay(event.audience || []);
  const stageDisplay = getStageDisplay(event.stage || []);
  const isHighSignal = event.is_high_signal || event.featured;
  
  // Generate calendar link
  const calendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${encodeURIComponent(event.date)}/${encodeURIComponent(event.date)}&details=${encodeURIComponent(event.description || '')}&location=${encodeURIComponent(event.city || '')}`;

  return (
    <div
      className={cn(
        'relative bg-card border rounded-none p-4 transition-all',
        isHighSignal 
          ? 'border-l-4 border-l-primary border-t-border border-r-border border-b-border' 
          : 'border-border',
        'hover:shadow-card-hover'
      )}
    >
      {/* Tags Row - TOP (CRITICAL) */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        {/* Audience Badge */}
        <Badge 
          variant="outline" 
          className={cn('font-semibold text-xs uppercase tracking-wide border', audienceDisplay.style)}
        >
          {audienceDisplay.icon} {audienceDisplay.label}
        </Badge>
        
        {/* Stage Badge */}
        <Badge 
          variant="outline" 
          className="font-semibold text-xs uppercase tracking-wide bg-accent text-accent-foreground border-border"
        >
          {stageDisplay}
        </Badge>
        
        {/* Host Badge */}
        <Badge 
          variant="outline" 
          className="font-medium text-xs bg-secondary text-secondary-foreground border-border"
        >
          HOSTED BY: <a 
            href={event.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="ml-1 underline hover:text-primary"
            onClick={(e) => e.stopPropagation()}
          >
            {event.organizer}
          </a>
        </Badge>
        
        {/* High Signal Badge */}
        {isHighSignal && (
          <Badge className="bg-accent text-primary border border-primary/20 font-semibold text-xs">
            <Star className="h-3 w-3 mr-1 fill-current" />
            HIGH SIGNAL
          </Badge>
        )}
      </div>

      {/* Event Name */}
      <h3 className="font-semibold text-foreground text-lg mb-2">
        {event.title}
      </h3>

      {/* Date / Location */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
        <span className="flex items-center gap-1.5">
          <Calendar className="h-4 w-4" />
          {event.date} • {event.time}
        </span>
        <span className="flex items-center gap-1.5">
          <MapPin className="h-4 w-4" />
          {event.city || 'Seattle'}
        </span>
      </div>

      {/* Outcome Framing - PROMINENT */}
      {event.outcome_framing || event.description ? (
        <div className="bg-accent border border-border rounded-none p-3 mb-4">
          <div className="flex items-start gap-2">
            <span className="text-lg">💡</span>
            <p className="text-sm font-medium text-foreground leading-relaxed">
              {event.outcome_framing || event.description}
            </p>
          </div>
        </div>
      ) : null}

      {/* Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>{event.cost || 'Free'}</span>
          <span className="text-border">•</span>
          <span>RSVP Required</span>
          {event.expected_size && (
            <>
              <span className="text-border">•</span>
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {event.expected_size} people
              </span>
            </>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs text-muted-foreground hover:text-foreground"
            asChild
          >
            <a href={calendarUrl} target="_blank" rel="noopener noreferrer">
              <CalendarPlus className="h-3.5 w-3.5 mr-1" />
              Save
            </a>
          </Button>
          <Button
            size="sm"
            className="h-8 text-xs"
            asChild
          >
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
