import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import QRCode from 'react-qr-code';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import type { FairOrg } from './FairPage';

export default function FairOrgPage() {
  const { slug } = useParams<{ slug: string }>();
  const [org, setOrg] = useState<FairOrg | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('organizations').select('*').eq('slug', slug).eq('status', 'approved').maybeSingle();
      setOrg((data as FairOrg) ?? null);
      setLoading(false);
    })();
  }, [slug]);

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><p className="text-muted-foreground">Loading…</p></div>;
  if (!org) return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center space-y-3">
        <h1 className="text-2xl font-semibold">Not found</h1>
        <p className="text-muted-foreground">This resource isn't listed yet.</p>
        <Link to="/fair" className="text-primary hover:underline">Browse the fair →</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-xl mx-auto px-4 py-8 space-y-6">
        <Link to="/fair" className="text-sm text-muted-foreground hover:text-foreground">← Back to the fair</Link>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            {org.logo_url ? (
              <img src={org.logo_url} alt="" className="h-14 w-14 rounded object-contain" />
            ) : (
              <div className="h-14 w-14 rounded bg-accent flex items-center justify-center text-2xl">🌱</div>
            )}
            <h1 className="text-2xl font-semibold">{org.name}</h1>
          </div>
          <p className="text-lg text-muted-foreground">{org.who_they_help}</p>
          <div className="rounded-lg border border-border p-4 space-y-1">
            <p className="text-sm font-medium">One action you can take today</p>
            <p>{org.action_today}</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {org.tags.map((t) => (
              <span key={t} className="px-2.5 py-1 text-xs rounded-full bg-accent text-accent-foreground">{t}</span>
            ))}
            {org.office_hours && (
              <span className="px-2.5 py-1 text-xs rounded-full border border-primary text-primary">Office hours {org.office_hours}</span>
            )}
          </div>
          {org.contact_public && org.contact_name && (
            <p className="text-sm text-muted-foreground">Who to reach out to: {org.contact_name}{org.contact_role ? `, ${org.contact_role}` : ''}{org.contact_info ? ` · ${org.contact_info}` : ''}</p>
          )}
          <a href={org.url} target="_blank" rel="noopener noreferrer">
            <Button className="w-full h-12 text-base">Go to {org.name} <ExternalLink className="h-4 w-4 ml-2" /></Button>
          </a>
          <div className="flex flex-col items-center gap-2 pt-4">
            <div className="bg-white p-3 rounded-lg border border-border">
              <QRCode value={`https://seattlestartuppulse.com/fair/${org.slug}`} size={120} />
            </div>
            <p className="text-xs text-muted-foreground">Scan to save this and find a coffee buddy.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
