import { useState, useMemo, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import DigestSignup from '@/components/digest/DigestSignup';
import ExitIntentModal from '@/components/digest/ExitIntentModal';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface NewsItem {
  id: string;
  title: string;
  source: string;
  date: string;
  summary: string;
  url: string;
  category: string;
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      const { data } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false });
      setNews((data as any[]) || []);
      setLoading(false);
    };
    fetchNews();
  }, []);

  return (
    <AppLayout activeTab="news" tabCounts={{ news: news.length }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Ecosystem News</h1>
          <p className="text-sm text-muted-foreground">Latest from the Seattle startup community</p>
        </div>

        {/* Count */}
        <p className="text-xs text-muted-foreground">{news.length} article{news.length !== 1 ? 's' : ''}</p>

        {/* News List */}
        <div className="space-y-3">
          {loading ? (
            <p className="text-center text-muted-foreground py-16">Loading...</p>
          ) : news.map((item) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start justify-between gap-4 bg-card border border-border rounded-lg p-4 hover:shadow-md transition-all group"
            >
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mb-1.5">
                  <span className="font-medium">{item.source}</span>
                  <span className="opacity-50">·</span>
                  <span>{item.date}</span>
                  <Badge variant="outline" className="text-[10px] font-medium rounded-sm px-1.5 py-0 ml-auto">
                    {item.category}
                  </Badge>
                </div>
                <h3 className="font-semibold text-foreground text-[15px] leading-snug mb-1 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-[13px] text-muted-foreground line-clamp-2">{item.summary}</p>
              </div>
              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary shrink-0 mt-1 transition-colors" />
            </a>
          ))}
          {!loading && news.length === 0 && (
            <p className="text-center text-muted-foreground py-16">No news available.</p>
          )}
        </div>

        {/* Digest Signup */}
        <div className="mt-8">
          <DigestSignup sourceTab="news" />
        </div>
      </div>

      <ExitIntentModal sourceTab="news" />
    </AppLayout>
  );
}
