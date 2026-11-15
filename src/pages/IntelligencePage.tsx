import { useMemo, useState } from 'react';
import { Loader2 } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import Seo from '@/components/seo/Seo';
import { cn } from '@/lib/utils';
import { useEvents } from '@/hooks/useEvents';
import { useIntelligenceData } from '@/hooks/useIntelligenceData';
import { withDates, startOfToday } from '@/components/intelligence/shared';
import CollisionSection from '@/components/intelligence/CollisionSection';
import ShowUpSection from '@/components/intelligence/ShowUpSection';
import ForecastSection from '@/components/intelligence/ForecastSection';
import LifecycleSection from '@/components/intelligence/LifecycleSection';
import PulseSection from '@/components/intelligence/PulseSection';
import PlanEventPage from '@/pages/PlanEventPage';
import { useSearchParams } from 'react-router-dom';
import AskOfferSection from '@/components/intelligence/AskOfferSection';

const TABS = [['plan', 'Plan Event Structure'], ['visibility', 'Search For The Best Date'], ['data', 'Flake Rate Forecasting'], ['matching', 'Ask & Offer Board']] as const;
type Tab = typeof TABS[number][0];

export default function IntelligencePage() {
  const { events: raw, loading } = useEvents();
  const events = useMemo(() => withDates(raw).filter((e) => e.d >= startOfToday()), [raw]);
  const { lifecycle, pulses, snapshots, reload } = useIntelligenceData();
  const [params, setParams] = useSearchParams();
  const initial = TABS.some(([id]) => id === params.get('tab')) ? (params.get('tab') as Tab) : 'plan';
  const [tab, setTabState] = useState<Tab>(initial);
  const setTab = (t: Tab) => { setTabState(t); setParams({ tab: t }, { replace: true }); };
  const siteAvg = snapshots.length ? Number(snapshots[snapshots.length - 1].avg_show_rate) : null;
  const community = pulses.filter((p) => p.source !== 'ask' && p.source !== 'offer');

  return (
    <AppLayout activeTab="resources">
      <Seo title="Event Intelligence" path="/intelligence" description="The operating layer for Seattle's event ecosystem: open dates, show-up forecasts, room feedback, and an ask & offer board." />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <p className="text-[11px] font-bold tracking-widest text-primary uppercase">Event Intelligence</p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mt-1">Don't just host. Operate the room.</h1>
        <p className="text-muted-foreground mt-2">Shape the outcome, pick a date that doesn't collide and plan for who actually shows up.</p>
        <div role="tablist" className="grid grid-cols-2 sm:grid-cols-4 gap-1 mt-6 rounded-lg border border-border p-1">
          {TABS.map(([id, label]) => (
            <button key={id} role="tab" aria-selected={tab === id} onClick={() => setTab(id)}
              className={cn('rounded-md px-2 py-2 text-sm font-medium', tab === id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground')}>{label}</button>
          ))}
        </div>
        <div className="mt-8">
          {tab === 'plan' ? <PlanEventPage embedded /> : loading ? <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div> : <>
            {tab === 'visibility' && <CollisionSection events={events} />}
            {tab === 'data' && <div className="space-y-10"><ShowUpSection snapshots={snapshots} /><ForecastSection /></div>}
                        {tab === 'matching' && <AskOfferSection pulses={pulses} onChange={reload} />}
          </>}
        </div>
      </div>
    </AppLayout>
  );
}
