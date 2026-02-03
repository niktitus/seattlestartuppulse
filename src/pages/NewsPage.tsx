import AppLayout from '@/components/layout/AppLayout';
import DigestSignup from '@/components/digest/DigestSignup';
import ExitIntentModal from '@/components/digest/ExitIntentModal';
import { Badge } from '@/components/ui/badge';
import { mockNews } from '@/data/mockData';

export default function NewsPage() {
  return (
    <AppLayout 
      activeTab="news" 
      tabCounts={{ news: mockNews.length }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-foreground">Ecosystem News</h2>
          <p className="text-sm text-muted-foreground">Latest from the Seattle startup community</p>
        </div>

        {/* News List */}
        <div className="space-y-3">
          {mockNews.map((item) => (
            <article 
              key={item.id} 
              className="bg-card border border-border rounded-lg p-4 hover:border-muted-foreground/30 transition-colors"
            >
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                <span className="font-medium">{item.source}</span>
                <span>•</span>
                <span>{item.date}</span>
                <Badge variant="secondary" className="ml-auto text-xs">{item.category}</Badge>
              </div>
              <h3 className="font-medium text-foreground mb-1">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.summary}</p>
            </article>
          ))}
          {mockNews.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No news available.</p>
          )}
        </div>

        {/* Digest Signup */}
        <div className="mt-12">
          <DigestSignup sourceTab="news" />
        </div>
      </div>

      {/* Exit Intent Modal */}
      <ExitIntentModal sourceTab="news" />
    </AppLayout>
  );
}
