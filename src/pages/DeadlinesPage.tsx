import { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import DigestSignup from '@/components/digest/DigestSignup';
import ExitIntentModal from '@/components/digest/ExitIntentModal';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

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

  return (
    <AppLayout activeTab="deadlines" tabCounts={{ deadlines: deadlines.length }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Upcoming Deadlines</h1>
          <p className="text-sm text-muted-foreground">Applications, grants, and time-sensitive opportunities</p>
        </div>

        {/* Count */}
        <p className="text-xs text-muted-foreground">{deadlines.length} deadline{deadlines.length !== 1 ? 's' : ''}</p>

        {/* Deadlines List */}
        <div className="space-y-3">
          {loading ? (
            <p className="text-center text-muted-foreground py-16">Loading...</p>
          ) : deadlines.map((deadline) => (
            <a
              key={deadline.id}
              href={deadline.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex bg-card border border-border rounded-lg overflow-hidden hover:shadow-md transition-all group"
            >
              {/* Days left block */}
              <div className="flex flex-col items-center justify-center px-4 py-4 bg-muted text-muted-foreground min-w-[72px] shrink-0">
                <span className="text-2xl font-bold leading-none text-destructive">{deadline.days_left}</span>
                <span className="text-[10px] font-medium tracking-wider uppercase mt-0.5 opacity-70">days</span>
              </div>
              
              <div className="flex-1 px-4 py-3.5 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <Badge variant="outline" className="text-[10px] font-semibold uppercase tracking-wide rounded-sm px-1.5 py-0 border-destructive/30 text-destructive">
                    {deadline.type}
                  </Badge>
                </div>
                <h3 className="font-semibold text-foreground text-[15px] leading-snug mb-1 group-hover:text-primary transition-colors">
                  {deadline.title}
                </h3>
                <p className="text-[13px] text-muted-foreground line-clamp-2">{deadline.description}</p>
                <p className="text-xs text-muted-foreground mt-1.5 opacity-70">Due {deadline.due_date}</p>
              </div>

              <div className="flex items-center pr-4">
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </a>
          ))}
          {!loading && deadlines.length === 0 && (
            <p className="text-center text-muted-foreground py-16">No upcoming deadlines.</p>
          )}
        </div>

        {/* Digest Signup */}
        <div className="mt-8">
          <DigestSignup sourceTab="deadlines" />
        </div>
      </div>

      <ExitIntentModal sourceTab="deadlines" />
    </AppLayout>
  );
}
