import { useState, useMemo } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import DigestSignup from '@/components/digest/DigestSignup';
import ExitIntentModal from '@/components/digest/ExitIntentModal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { mockNews } from '@/data/mockData';
import { AUDIENCE_OPTIONS, type AudienceType } from '@/types/events';

export default function NewsPage() {
  const [audience, setAudience] = useState<AudienceType | 'All'>('All');

  const filteredNews = useMemo(() => {
    // News doesn't have audience tags in current mock data, 
    // so filter is a placeholder that shows all when 'All' is selected
    return mockNews;
  }, [audience]);

  const activeLabel = audience === 'All' ? 'Audience' : 
    AUDIENCE_OPTIONS.find(o => o.value === audience)?.label || 'Audience';

  return (
    <AppLayout 
      activeTab="news" 
      tabCounts={{ news: filteredNews.length }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="mb-4">
          <h2 className="text-xl font-bold text-foreground">Ecosystem News</h2>
          <p className="text-sm text-muted-foreground">Latest from the Seattle startup community</p>
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
                    <RadioGroupItem value={option.value} id={`news-audience-${option.value}`} />
                    <Label htmlFor={`news-audience-${option.value}`} className="text-sm cursor-pointer">
                      {option.icon && <span className="mr-1">{option.icon}</span>}
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </PopoverContent>
          </Popover>
        </div>

        {/* News List */}
        <div className="space-y-3">
          {filteredNews.map((item) => (
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
          {filteredNews.length === 0 && (
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
