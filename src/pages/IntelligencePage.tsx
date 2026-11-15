import { useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import Seo from '@/components/seo/Seo';
import DigestSignup from '@/components/digest/DigestSignup';
import { useEvents } from '@/hooks/useEvents';
import { useIntelligenceData } from '@/hooks/useIntelligenceData';
import { withDates, getTokens } from '@/components/intelligence/shared';
import CalendarSection from '@/components/intelligence/CalendarSection';
import TracksSection from '@/components/intelligence/TracksSection';
import GroupsSection from '@/components/intelligence/GroupsSection';
import ShowUpSection from '@/components/intelligence/ShowUpSection';
import ForecastSection from '@/components/intelligence/ForecastSection';
import LifecycleSection from '@/components/intelligence/LifecycleSection';
import MonthSection from '@/components/intelligence/MonthSection';
import PulseSection from '@/components/intelligence/PulseSection';

const ANCHORS = [['calendar', 'Calendar'], ['tracks', 'Tracks'], ['groups', 'Groups'], ['showing-up', 'Show-up'], ['forecast', 'Forecast'], ['lifecycle', 'Lifecycle'], ['organizer', 'Organizer'], ['pulse', 'Pulse']];

export default function IntelligencePage() {
  const { events: raw, loading } = useEvents();
  const events = useMemo(() => withDates(raw), [raw]);
  const { lifecycle, pulses, snapshots, reload } = useIntelligenceData();
  const tokens = getTokens();
  const trackedIds = new Set(lifecycle.map((l) => l.event_id));
  const myEventIds = new Set(lifecycle.filter((l) => tokens[l.id]).map((l) => l.event_id));
  const siteAvg = snapshots.length ? Number(snapshots[snapshots.length - 1].avg_show_rate) : null;
  const divider = <hr className="my-10 border-border" />;

  return (
    <AppLayout activeTab="intelligence">
      <Seo title="Community Event Intelligence" path="/intelligence" description="Seattle's startup event ecosystem — tracked before, during, and after. Calendar, curated tracks, attendance forecasts and community pulse." />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <p className="text-[11px] font-bold tracking-widest text-primary uppercase">Community Event Intelligence</p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mt-1">Don't just host. Operate the room.</h1>
        <p className="text-muted-foreground mt-2 italic">Seattle's startup event ecosystem — tracked before, during, and after.</p>
        <nav className="flex gap-1.5 overflow-x-auto scrollbar-hide mt-5 -mx-4 px-4 pb-1">
          {ANCHORS.map(([id, label]) => (
            <a key={id} href={`#${id}`} onClick={(e) => { e.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); }}
              className="shrink-0 rounded-full border border-border px-3 py-1 text-xs font-medium hover:border-primary hover:text-primary">{label}</a>
          ))}
        </nav>
        {divider}
        {loading ? <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div> : (
          <>
            <CalendarSection events={events} trackedIds={trackedIds} onTracked={reload} />{divider}
            <TracksSection events={events} />{divider}
            <GroupsSection />{divider}
            <ShowUpSection snapshots={snapshots} />{divider}
            <ForecastSection />{divider}
            <LifecycleSection rows={lifecycle} events={events} pulses={pulses} siteAvg={siteAvg} onChange={reload} />{divider}
            <MonthSection events={events} myEventIds={myEventIds} />{divider}
            <PulseSection pulses={pulses} events={events} onChange={reload} />{divider}
          </>
        )}
        <DigestSignup sourceTab="events" title="Get the Seattle Startup Pulse" showTaglines={false} />
        <p className="text-xs text-muted-foreground text-center mt-2">A weekly digest of what's happening, who's showing up, and what people are saying.</p>
      </div>
    </AppLayout>
  );
}
