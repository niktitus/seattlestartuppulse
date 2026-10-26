import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import QRCode from 'react-qr-code';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import type { FairOrg } from './FairPage';

/** 5×7 inch table tent, prints well in black and white. */
export default function FairCardPrintPage() {
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

  if (loading) return <p className="p-8 text-center text-muted-foreground">Loading…</p>;
  if (!org) return <p className="p-8 text-center text-muted-foreground">Card not found.</p>;

  return (
    <div className="min-h-screen bg-white text-black flex flex-col items-center py-6 px-4 print:py-0">
      <Button onClick={() => window.print()} className="mb-4 print:hidden gap-2">
        <Printer className="h-4 w-4" /> Print this card
      </Button>
      <div
        className="border-2 border-black rounded-lg p-6 flex flex-col justify-between print:border-black"
        style={{ width: '5in', height: '7in' }}
      >
        <div className="space-y-3">
          {org.logo_url && <img src={org.logo_url} alt="" className="h-12 object-contain" style={{ filter: 'grayscale(1)' }} />}
          <h1 className="text-2xl font-bold leading-tight">{org.name}</h1>
          <p className="text-base">{org.who_they_help}</p>
          <div className="border-t-2 border-black pt-3">
            <p className="text-sm font-bold uppercase tracking-wide">Do this today</p>
            <p className="text-lg font-medium">{org.action_today}</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {org.tags.map((t) => (
              <span key={t} className="px-2 py-0.5 text-xs border border-black rounded-full">{t}</span>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <QRCode value={`https://seattlestartuppulse.com/fair/${org.slug}`} size={180} />
          <p className="text-sm font-medium text-center">Scan to save this and find a coffee buddy.</p>
        </div>
      </div>
    </div>
  );
}
