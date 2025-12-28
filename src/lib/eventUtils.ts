import { parse, isThisWeek as dateIsThisWeek, isValid, startOfWeek, endOfWeek, isBefore, isAfter } from 'date-fns';

/**
 * Parse various date string formats into a Date object
 */
export function parseEventDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  
  const now = new Date();
  const currentYear = now.getFullYear();
  
  // Handle date ranges like "Mar 17-21"
  const rangeMatch = dateStr.match(/^([A-Za-z]+)\s+(\d+)-\d+/);
  if (rangeMatch) {
    const [, month, startDay] = rangeMatch;
    const parsed = parse(`${month} ${startDay}, ${currentYear}`, 'MMM d, yyyy', new Date());
    if (isValid(parsed)) return parsed;
  }
  
  // Handle "Jan 15, 2026" format
  const fullDateMatch = dateStr.match(/^([A-Za-z]+)\s+(\d+),?\s+(\d{4})/);
  if (fullDateMatch) {
    const [, month, day, year] = fullDateMatch;
    const parsed = parse(`${month} ${day}, ${year}`, 'MMM d, yyyy', new Date());
    if (isValid(parsed)) return parsed;
  }
  
  // Handle "Jan 15" format (assume current or next year)
  const shortDateMatch = dateStr.match(/^([A-Za-z]+)\s+(\d+)/);
  if (shortDateMatch) {
    const [, month, day] = shortDateMatch;
    let parsed = parse(`${month} ${day}, ${currentYear}`, 'MMM d, yyyy', new Date());
    
    // If date is in the past, assume next year
    if (isValid(parsed) && isBefore(parsed, now)) {
      parsed = parse(`${month} ${day}, ${currentYear + 1}`, 'MMM d, yyyy', new Date());
    }
    
    if (isValid(parsed)) return parsed;
  }
  
  // Handle "This Week" or similar
  if (dateStr.toLowerCase().includes('this week')) {
    return now;
  }
  
  return null;
}

/**
 * Check if an event date is within this week
 */
export function isThisWeek(dateStr: string): boolean {
  const date = parseEventDate(dateStr);
  if (!date) return false;
  return dateIsThisWeek(date, { weekStartsOn: 0 });
}

/**
 * Sort events with this week's events first, then by date ascending
 */
export function sortEventsByDate<T extends { date: string; featured?: boolean }>(events: T[]): T[] {
  return [...events].sort((a, b) => {
    const dateA = parseEventDate(a.date);
    const dateB = parseEventDate(b.date);
    
    const isThisWeekA = isThisWeek(a.date);
    const isThisWeekB = isThisWeek(b.date);
    
    // This week's events come first
    if (isThisWeekA && !isThisWeekB) return -1;
    if (!isThisWeekA && isThisWeekB) return 1;
    
    // Within the same category, sort by date
    if (dateA && dateB) {
      return dateA.getTime() - dateB.getTime();
    }
    
    // Events with parseable dates come before unparseable ones
    if (dateA && !dateB) return -1;
    if (!dateA && dateB) return 1;
    
    return 0;
  });
}
