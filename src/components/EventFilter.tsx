import { Search } from 'lucide-react';

interface EventFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function EventFilter({ 
  searchQuery, 
  onSearchChange, 
}: EventFilterProps) {
  return (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <input
        type="text"
        placeholder="Search events..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full pl-9 pr-3 py-2 text-sm bg-card border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
      />
    </div>
  );
}
