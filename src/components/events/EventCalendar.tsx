import { useState, useMemo } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, addMonths, subMonths, startOfWeek, endOfWeek, isToday, isBefore, startOfDay } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { parseEventDate } from '@/lib/eventUtils';
import type { Event } from '@/types/events';

interface EventCalendarProps {
  events: Event[];
  selectedDate: Date | null;
  onSelectDate: (date: Date | null) => void;
}

export default function EventCalendar({ events, selectedDate, onSelectDate }: EventCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Build a map of date -> event count
  const eventCountByDay = useMemo(() => {
    const map = new Map<string, number>();
    for (const event of events) {
      const parsed = parseEventDate(event.date);
      if (parsed) {
        const key = format(parsed, 'yyyy-MM-dd');
        map.set(key, (map.get(key) || 0) + 1);
      }
    }
    return map;
  }, [events]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const handleDateClick = (day: Date) => {
    if (selectedDate && isSameDay(day, selectedDate)) {
      onSelectDate(null); // toggle off
    } else {
      onSelectDate(day);
    }
  };

  return (
    <TooltipProvider delayDuration={200}>
      <div className="bg-card border border-border rounded-lg p-3">
        {/* Month navigation */}
        <div className="flex items-center justify-between mb-2">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-semibold text-foreground">
            {format(currentMonth, 'MMMM yyyy')}
          </span>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 mb-1">
          {weekDays.map(d => (
            <div key={d} className="text-center text-[10px] font-medium text-muted-foreground py-1">{d}</div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7">
          {days.map(day => {
            const key = format(day, 'yyyy-MM-dd');
            const count = eventCountByDay.get(key) || 0;
            const inMonth = isSameMonth(day, currentMonth);
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const isPast = isBefore(day, startOfDay(new Date()));
            const today = isToday(day);

            const cell = (
              <button
                key={key}
                onClick={() => inMonth && !isPast ? handleDateClick(day) : undefined}
                className={cn(
                  "relative h-8 w-full text-xs rounded transition-colors",
                  !inMonth && "text-muted-foreground/30",
                  inMonth && isPast && "text-muted-foreground/50",
                  inMonth && !isPast && "hover:bg-muted cursor-pointer",
                  isSelected && "bg-primary text-primary-foreground hover:bg-primary/90",
                  today && !isSelected && "font-bold text-primary",
                  count > 0 && inMonth && !isPast && !isSelected && "font-semibold text-foreground"
                )}
                disabled={!inMonth || isPast}
              >
                {format(day, 'd')}
                {count > 0 && inMonth && (
                  <span className={cn(
                    "absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full",
                    isSelected ? "bg-primary-foreground" : "bg-primary"
                  )} />
                )}
              </button>
            );

            if (count > 0 && inMonth) {
              return (
                <Tooltip key={key}>
                  <TooltipTrigger asChild>{cell}</TooltipTrigger>
                  <TooltipContent side="top" className="text-xs">
                    {count} event{count !== 1 ? 's' : ''}
                  </TooltipContent>
                </Tooltip>
              );
            }

            return cell;
          })}
        </div>

        {/* Selected date indicator */}
        {selectedDate && (
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Showing: {format(selectedDate, 'MMM d, yyyy')}
            </span>
            <Button variant="ghost" size="sm" className="h-6 text-xs px-2" onClick={() => onSelectDate(null)}>
              Clear
            </Button>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
