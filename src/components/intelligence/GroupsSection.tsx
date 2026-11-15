import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GROUPS, PERSONAS } from '@/data/seattleGroups';
import { SectionHead } from './shared';

export default function GroupsSection() {
  const [q, setQ] = useState('');
  const [focus, setFocus] = useState('all');
  const [kind, setKind] = useState('all');
  const kinds = useMemo(() => [...new Set(GROUPS.map((g) => g.kind))].sort(), []);
  const list = GROUPS.filter((g) =>
    (focus === 'all' || g.tags.includes(focus as any)) && (kind === 'all' || g.kind === kind) &&
    (!q || `${g.name} ${g.runBy} ${g.forWho} ${g.kind}`.toLowerCase().includes(q.toLowerCase()))
  ).sort((a, b) => Number(!!b.nikInvolved) - Number(!!a.nikInvolved) || a.name.localeCompare(b.name));

  return (
    <section>
      <SectionHead id="groups" eyebrow="03 · Groups" title="Who's Building Community" />
      <div className="relative mb-2"><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search groups" className="pl-9 h-9" /></div>
      <div className="grid grid-cols-2 gap-2 mb-4">
        <Select value={focus} onValueChange={setFocus}><SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="all">Any focus</SelectItem>{PERSONAS.filter((p) => p.value !== 'all').map((p) => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}</SelectContent></Select>
        <Select value={kind} onValueChange={setKind}><SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="all">Any format</SelectItem>{kinds.map((k) => <SelectItem key={k} value={k}>{k}</SelectItem>)}</SelectContent></Select>
      </div>
      <div className="grid sm:grid-cols-2 gap-3 max-h-[560px] overflow-y-auto pr-1">
        {list.map((g) => {
          const url = g.url || g.links?.[0]?.url;
          return (
            <div key={g.name} className={`rounded-lg border bg-card p-4 ${g.nikInvolved ? 'border-primary' : 'border-border'}`}>
              <span className="text-[11px] rounded-full border border-border px-2 py-0.5 text-muted-foreground">{g.kind}</span>
              <h3 className="font-semibold mt-2 leading-snug">{g.name}</h3>
              <p className="text-xs text-muted-foreground">{g.runBy}</p>
              <p className="text-xs mt-2"><span className="text-muted-foreground">When:</span> {g.when}</p>
              <p className="text-xs"><span className="text-muted-foreground">Where:</span> {g.where}</p>
              {url && <Button asChild size="sm" variant="outline" className="h-8 mt-3"><a href={url} target="_blank" rel="noopener noreferrer">Visit <ExternalLink className="ml-1 h-3 w-3" /></a></Button>}
            </div>
          );
        })}
      </div>
      <Link to="/groups" className="inline-block text-sm text-primary font-medium mt-3 hover:underline">See full Communities guide →</Link>
    </section>
  );
}
