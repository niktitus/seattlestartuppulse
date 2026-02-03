import AppLayout from '@/components/layout/AppLayout';
import DigestSignup from '@/components/digest/DigestSignup';
import ExitIntentModal from '@/components/digest/ExitIntentModal';
import { Badge } from '@/components/ui/badge';
import { mockDeadlines } from '@/data/mockData';

export default function DeadlinesPage() {
  return (
    <AppLayout 
      activeTab="deadlines" 
      tabCounts={{ deadlines: mockDeadlines.length }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-foreground">Upcoming Deadlines</h2>
          <p className="text-sm text-muted-foreground">Applications, grants, and time-sensitive opportunities</p>
        </div>

        {/* Deadlines List */}
        <div className="space-y-2">
          {mockDeadlines.map((deadline) => (
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
                <div className="text-lg font-bold text-destructive">{deadline.daysLeft} days</div>
                <div className="text-sm text-muted-foreground">{deadline.dueDate}</div>
              </div>
            </article>
          ))}
          {mockDeadlines.length === 0 && (
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
