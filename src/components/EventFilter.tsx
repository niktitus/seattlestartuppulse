import { Search, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface EventFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  formatFilter: string | null;
  onFormatChange: (format: string | null) => void;
}

const formats = ['virtual', 'inperson', 'hybrid'] as const;

export default function EventFilter({ 
  searchQuery, 
  onSearchChange, 
  formatFilter, 
  onFormatChange 
}: EventFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-4">
      {/* Search Input */}
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
      
      {/* Format Filter Pills */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="h-4 w-4 text-muted-foreground hidden sm:block" />
        <button
          onClick={() => onFormatChange(null)}
          className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
            formatFilter === null 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          All
        </button>
        {formats.map((format) => (
          <button
            key={format}
            onClick={() => onFormatChange(formatFilter === format ? null : format)}
            className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors capitalize ${
              formatFilter === format 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {format === 'inperson' ? 'In-Person' : format}
          </button>
        ))}
      </div>
    </div>
  );
}
