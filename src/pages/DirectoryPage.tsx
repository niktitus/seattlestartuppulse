import { useState, useMemo } from 'react';
import { Search, ExternalLink, Plus, Building2, Loader2 } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import Seo from '@/components/seo/Seo';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import SubmitCompanyDialog from '@/components/directory/SubmitCompanyDialog';

interface DirectoryEntry {
  id: string;
  name: string;
  website: string;
  purpose: string;
  description: string | null;
  created_at: string;
}

const PURPOSE_OPTIONS = ['All', 'SaaS', 'Marketplace', 'FinTech', 'HealthTech', 'EdTech', 'CleanTech', 'AI/ML', 'DevTools', 'Consumer', 'B2B', 'Hardware', 'Biotech', 'Other'];

export default function DirectoryPage() {
  const [search, setSearch] = useState('');
  const [selectedPurpose, setSelectedPurpose] = useState('All');
  const [submitOpen, setSubmitOpen] = useState(false);

  const { data: entries = [], isLoading } = useQuery({
    queryKey: ['startup-directory'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('startup_directory')
        .select('*')
        .order('name', { ascending: true });
      if (error) throw error;
      return data as DirectoryEntry[];
    },
  });

  const filtered = useMemo(() => {
    return entries.filter(entry => {
      if (selectedPurpose !== 'All' && entry.purpose !== selectedPurpose) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          entry.name.toLowerCase().includes(q) ||
          entry.purpose.toLowerCase().includes(q) ||
          (entry.description || '').toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [entries, search, selectedPurpose]);

  const purposeCounts = useMemo(() => {
    const counts: Record<string, number> = { All: entries.length };
    for (const e of entries) {
      counts[e.purpose] = (counts[e.purpose] || 0) + 1;
    }
    return counts;
  }, [entries]);

  return (
    <AppLayout activeTab="directory">
      <Seo
        title="Seattle Startup Directory | Seattle Startup Pulse"
        description="Discover startups in the Seattle ecosystem. Browse by purpose, search by name, and connect with local companies."
      />
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Startup Directory</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {entries.length} companies in the Seattle startup ecosystem
          </p>
        </div>

        {/* Submit button */}
        <Button
          className="w-full h-11 text-sm font-semibold"
          onClick={() => setSubmitOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Submit a Company
        </Button>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search companies..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Purpose filter pills */}
        <div className="flex flex-wrap gap-1.5">
          {PURPOSE_OPTIONS.filter(p => p === 'All' || (purposeCounts[p] && purposeCounts[p] > 0)).map(purpose => (
            <Badge
              key={purpose}
              variant={selectedPurpose === purpose ? 'default' : 'outline'}
              className="cursor-pointer select-none text-xs px-3 py-1"
              onClick={() => setSelectedPurpose(purpose)}
            >
              {purpose}
              {purposeCounts[purpose] ? ` (${purposeCounts[purpose]})` : ''}
            </Badge>
          ))}
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : filtered.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              {entries.length === 0
                ? 'No companies in the directory yet. Be the first to submit!'
                : 'No companies match your filters.'}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {filtered.map(entry => (
              <Card key={entry.id} className="group hover:border-primary/30 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Building2 className="h-4 w-4 text-primary shrink-0" />
                        <h3 className="font-semibold truncate">{entry.name}</h3>
                        <Badge variant="secondary" className="text-xs shrink-0">{entry.purpose}</Badge>
                      </div>
                      {entry.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 ml-6">{entry.description}</p>
                      )}
                    </div>
                    <a
                      href={entry.website.startsWith('http') ? entry.website : `https://${entry.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 text-primary hover:text-primary/80 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <SubmitCompanyDialog open={submitOpen} onOpenChange={setSubmitOpen} />
    </AppLayout>
  );
}
