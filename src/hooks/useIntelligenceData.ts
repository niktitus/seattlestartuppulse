import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Lifecycle, Pulse } from '@/components/intelligence/LifecycleSection';
import type { Snapshot } from '@/components/intelligence/ShowUpSection';

export function useIntelligenceData() {
  const [lifecycle, setLifecycle] = useState<Lifecycle[]>([]);
  const [pulses, setPulses] = useState<Pulse[]>([]);
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const reload = useCallback(async () => {
    const [l, p, s] = await Promise.all([
      supabase.from('event_lifecycle').select('id,event_id,pre_event_notes,live_pulse,post_event_summary,rsvps,attended,show_rate,connections_made,top_ask,top_offer,lessons'),
      supabase.from('pulse_themes').select('id,theme,source,event_id,upvotes,submitted_at').order('submitted_at', { ascending: false }).limit(200),
      supabase.from('showup_snapshots').select('id,snapshot_date,total_events_tracked,avg_show_rate,top_format,top_day,notes').order('snapshot_date'),
    ]);
    setLifecycle((l.data as any) || []); setPulses((p.data as any) || []); setSnapshots((s.data as any) || []);
  }, []);
  useEffect(() => { reload(); }, [reload]);
  return { lifecycle, pulses, snapshots, reload };
}
