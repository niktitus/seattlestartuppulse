import { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import DigestSignup from '@/components/digest/DigestSignup';
import ExitIntentModal from '@/components/digest/ExitIntentModal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { AUDIENCE_OPTIONS, type AudienceType } from '@/types/events';

interface DeadlineItem {
  id: string;
  title: string;
  due_date: string;
  days_left: number;
  type: string;
  description: string;
  url: string;
}

export default function DeadlinesPage() {
  const [audience, setAudience] = useState<AudienceType | 'All'>('All');
  const [deadlines, setDeadlines] = useState<DeadlineItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeadlines = async () => {
      const { data } = await supabase
        .from('deadlines')
        .select('*')
        .order('days_left', { ascending: true });
      setDeadlines((data as any[]) || []);
      setLoading(false);
    };
    fetchDeadlines();
  }, []);

  const activeLabel = audience === 'All' ? 'Audience' : 
    AUDIENCE_OPTIONS.find(o => o.value === audience)?.label || 'Audience';

  return (
    <AppLayout 
      activeTab="deadlines" 
      tabCounts={{ deadlines: deadlines.length }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="mb-4">
          <h2 className="text-xl font-bold text-foreground">Upcoming Deadlines</h2>
          <p className="text-sm text-muted-foreground">Applications, grants, and time-sensitive opportunities</p>
        </div>

        {/* Audience Filter */}
        <div className="flex items-center gap-2 mb-6">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={audience !== 'All' ? "default" : "outline"}
                size="sm"
                className="h-8 gap-1"
              >
                {activeLabel}
                <ChevronDown className="h-3 w-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-3 bg-popover border border-border z-50" align="start">
              <RadioGroup
                value={audience}
                onValueChange={(value) => setAudience(value as AudienceType | 'All')}
                className="space-y-2"
              >
                {AUDIENCE_OPTIONS.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={`deadline-audience-${option.value}`} />
                    <Label htmlFor={`deadline-audience-${option.value}`} className="text-sm cursor-pointer">
                      {option.icon && <span className="mr-1">{option.icon}</span>}
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </PopoverContent>
          </Popover>
        </div>

        {/* Deadlines List */}
        <div className="space-y-2">
          {loading ? (
            <p className="text-center text-muted-foreground py-8">Loading...</p>
          ) : deadlines.map((deadline) => (
            <article 
              key={deadline.id} 
              className="flex items-center justify-between gap-4 bg-card border border-border rounded-lg p-4 hover:border-destructive/30 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-xs border-destructive/50 text-destructive">
                    {deadline.type}
                  </Badge>
                </div>
                <h3 className="font-medium text-foreground">{deadline.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{deadline.description}</p>
              </div>
              <div className="text-right shrink-0">
                <div className="text-lg font-bold text-destructive">{deadline.days_left} days</div>
                <div className="text-sm text-muted-foreground">{deadline.due_date}</div>
              </div>
            </article>
          ))}
          {!loading && deadlines.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No upcoming deadlines.</p>
          )}
        </div>

        {/* Digest Signup */}
        <div className="mt-12">
          <DigestSignup sourceTab="deadlines" />
        </div>
      </div>

      {/* Exit Intent Modal */}
      <ExitIntentModal sourceTab="deadlines" />
    </AppLayout>
  );
}
