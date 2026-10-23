import { useMemo, useState } from "react";
import {
  GROUPS,
  GAPS,
  VENUES,
  PERSONAS,
  LAST_CHECKED,
  type Access,
  type Area,
  type Group,
  type Persona,
} from "@/data/seattleGroups";

// Fonts: add this to index.html <head> (falls back to system fonts without it):
// <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=Public+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@500&display=swap">
const DISPLAY = { fontFamily: '"Bricolage Grotesque", "Avenir Next", system-ui, sans-serif' };
const BODY = { fontFamily: '"Public Sans", "Segoe UI", system-ui, sans-serif' };
const MONO = { fontFamily: '"IBM Plex Mono", ui-monospace, Menlo, monospace' };

const ACCESS: Record<Access, { label: string; className: string }> = {
  open: { label: "Drop in", className: "bg-[#e3eadd] text-[#516d4d]" },
  apply: { label: "RSVP or apply", className: "bg-[#f6ead2] text-[#8a5a12]" },
  invite: { label: "Intro or membership", className: "bg-[#e6e9ee] text-[#4a5568]" },
};

const QUESTIONS = ["Who runs it", "Who it's built for", "Might not fit if", "You leave with", "Cost & access", "When & where"];

const eyebrow = "text-xs uppercase tracking-[0.08em] text-[#5d6a5b]";
const field = "rounded-lg border border-[#d9ddd0] bg-white px-3 py-2 text-[15px] text-[#1f2a1e] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#516d4d]";

function GroupCard({ g }: { g: Group }) {
  const acc = ACCESS[g.access];
  const rows: [string, string | undefined, boolean?][] = [
    ["Runs it", g.runBy],
    ["Built for", g.forWho],
    ["Might not fit if", g.mightNotFitIf],
    ["You leave with", g.outcome, true],
    ["Cost", g.cost],
    ["When", g.when],
    ["Where", g.where],
  ];
  return (
    <article className="flex min-w-0 flex-col gap-3 rounded-[10px] border border-[#d9ddd0] bg-white p-[18px] transition-colors hover:border-[#869684]">
      <div className="flex items-start justify-between gap-2.5">
        <div className="min-w-0">
          <h3 className="text-[21px] font-bold leading-tight text-[#1f2a1e]" style={DISPLAY}>{g.name}</h3>
          <div className="mt-1 text-[11.5px] uppercase tracking-[0.06em] text-[#5d6a5b]" style={MONO}>
            {g.kind} · {g.area}
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <span className={`whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11.5px] font-semibold ${acc.className}`}>{acc.label}</span>
          {g.newLabel && (
            <span className="whitespace-nowrap rounded-full bg-[#f1e7a7] px-2.5 py-0.5 text-[11.5px] font-semibold text-[#5a4d0c]">{g.newLabel}</span>
          )}
          {g.nikInvolved && (
            <span className="whitespace-nowrap rounded-full border border-dashed border-[#869684] px-2.5 py-0.5 text-[11.5px] font-semibold text-[#5d6a5b]">Nik is involved</span>
          )}
        </div>
      </div>
      <dl className="grid grid-cols-[104px_1fr] gap-x-3 gap-y-[7px] text-sm text-[#1f2a1e]">
        {rows.filter(([, v]) => v).map(([label, value, strong]) => (
          <div key={label} className="contents">
            <dt className="pt-0.5 text-[11.5px] uppercase tracking-[0.05em] text-[#5d6a5b]" style={MONO}>{label}</dt>
            <dd className={`min-w-0 ${strong ? "font-medium" : ""}`}>{value}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-auto flex items-center justify-between gap-2.5 border-t border-[#d9ddd0] pt-2.5 text-[13px]">
        <span className="text-[#5d6a5b]">Checked Oct 2026</span>
        {g.url ? (
          <a href={g.url} target="_blank" rel="noopener noreferrer" className="font-medium text-[#516d4d] underline-offset-2 hover:underline">
            Visit ↗
          </a>
        ) : (
          <span className="text-[#5d6a5b]">Ask Nik</span>
        )}
      </div>
    </article>
  );
}

export default function RoomGuide() {
  const [persona, setPersona] = useState<Persona | "all">("all");
  const [query, setQuery] = useState("");
  const [access, setAccess] = useState<Access | "">("");
  const [area, setArea] = useState<Area | "">("");

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return GROUPS.filter(
      (g) =>
        (persona === "all" || g.tags.includes(persona)) &&
        (!access || g.access === access) &&
        (!area || g.area === area) &&
        (!q || [g.name, g.kind, g.runBy, g.forWho, g.outcome, g.where].join(" ").toLowerCase().includes(q)),
    );
  }, [persona, query, access, area]);

  return (
    <div className="bg-[#f3f4ee] text-[15px] leading-[1.55] text-[#1f2a1e]" style={BODY}>
      <div className="mx-auto max-w-[1180px] px-4 pb-16 pt-10">
        <header className="grid max-w-[760px] gap-3.5">
          <h1 className="text-[clamp(34px,6vw,58px)] font-extrabold leading-[1.05] tracking-[-0.02em] [text-wrap:balance]" style={DISPLAY}>
            Where can I find <span className="text-[#516d4d]">entrepreneurial community</span> and events?
          </h1>
          <p className="m-0 max-w-[62ch] text-[17px] text-[#5d6a5b]">
            Seattle has plenty of groups and very little signal about them. Every listing here answers the same six questions, so you can see who runs a room, who it's built for, and what you'll leave with before you go. Every room has a door: where a group is invite-only, the listing says how people get in.
          </p>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {QUESTIONS.map((q) => (
              <span key={q} className="rounded-full border border-[#d9ddd0] bg-white px-2.5 py-0.5 text-xs text-[#5d6a5b]" style={MONO}>{q}</span>
            ))}
          </div>
        </header>

        <div className="mt-9 grid gap-3">
          <h2 className="text-xl font-bold" style={DISPLAY}>I am…</h2>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by who you are">
            {PERSONAS.map((p) => {
              const active = persona === p.value;
              return (
                <button
                  key={p.value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setPersona(p.value)}
                  className={`rounded-full border px-3.5 py-[7px] text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#516d4d] focus-visible:ring-offset-2 ${
                    active ? "border-[#516d4d] bg-[#516d4d] text-[#f3f4ee]" : "border-[#d9ddd0] bg-white text-[#1f2a1e] hover:border-[#869684]"
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-2.5">
            <input
              id="room-guide-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search groups, people, neighborhoods"
              aria-label="Search"
              className={`${field} min-w-0 flex-[1_1_240px]`}
            />
            <select id="room-guide-access" value={access} onChange={(e) => setAccess(e.target.value as Access | "")} aria-label="Access" className={field}>
              <option value="">Any access</option>
              <option value="open">Drop in, no sign-up</option>
              <option value="apply">Apply or RSVP approval</option>
              <option value="invite">Intro or membership</option>
            </select>
            <select id="room-guide-area" value={area} onChange={(e) => setArea(e.target.value as Area | "")} aria-label="Area" className={field}>
              <option value="">All areas</option>
              <option value="Seattle">Seattle</option>
              <option value="Eastside">Eastside</option>
              <option value="Online">Online</option>
            </select>
            <span className="ml-auto text-[13px] text-[#5d6a5b]" style={MONO}>
              {list.length} of {GROUPS.length} groups
            </span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-[repeat(auto-fill,minmax(330px,1fr))]" aria-live="polite">
          {list.length ? (
            list.map((g) => <GroupCard key={g.name} g={g} />)
          ) : (
            <div className="col-span-full rounded-[10px] border border-dashed border-[#d9ddd0] p-8 text-center text-[#5d6a5b]">
              No groups match yet. That might be a gap worth filling.
            </div>
          )}
        </div>

        <section id="gaps" className="mt-14 grid gap-4">
          <div className={eyebrow} style={MONO}>What the map shows</div>
          <h2 className="text-[clamp(24px,3.5vw,32px)] font-bold" style={DISPLAY}>Where the gaps are</h2>
          <p className="m-0 max-w-[64ch] text-[#5d6a5b]">Patterns that show up once the groups sit side by side. These are the bridges worth building.</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-[repeat(auto-fit,minmax(260px,1fr))]">
            {GAPS.map((gap) => (
              <div key={gap.title} className="min-w-0 border-l-[3px] border-[#516d4d] py-1 pl-3.5">
                <h3 className="mb-1.5 text-[17px] font-bold" style={DISPLAY}>{gap.title}</h3>
                <p className="m-0 text-sm text-[#5d6a5b]">
                  <b className="font-semibold text-[#1f2a1e]">{gap.emphasis}</b> {gap.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section id="space" className="mt-14 grid gap-4">
          <div className={eyebrow} style={MONO}>Accessible space</div>
          <h2 className="text-[clamp(24px,3.5vw,32px)] font-bold" style={DISPLAY}>Rooms you can actually get</h2>
          <p className="m-0 max-w-[64ch] text-[#5d6a5b]">Venues that already host outside community groups, and how to ask.</p>
          <div className="overflow-x-auto rounded-[10px] border border-[#d9ddd0] bg-white">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr>
                  {["Venue", "Neighborhood", "Good for", "How to ask"].map((h) => (
                    <th key={h} className="border-b border-[#d9ddd0] px-3.5 py-2.5 text-left text-[11.5px] font-medium uppercase tracking-[0.05em] text-[#5d6a5b]" style={MONO}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {VENUES.map((v) => (
                  <tr key={v.venue} className="[&:last-child>td]:border-b-0">
                    <td className="border-b border-[#d9ddd0] px-3.5 py-2.5 align-top font-medium">{v.venue}</td>
                    <td className="border-b border-[#d9ddd0] px-3.5 py-2.5 align-top">{v.neighborhood}</td>
                    <td className="border-b border-[#d9ddd0] px-3.5 py-2.5 align-top">{v.goodFor}</td>
                    <td className="border-b border-[#d9ddd0] px-3.5 py-2.5 align-top">{v.howToAsk}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <footer className="mt-14 grid max-w-[72ch] gap-1.5 text-[13px] text-[#5d6a5b]">
          <div>
            Compiled from public listings, event pages and GeekWire coverage, checked {LAST_CHECKED}. Prices, schedules and access rules change; confirm on each group's own page before you go.
          </div>
          <div>Most groups haven't published accessibility details yet, so ask hosts about step-free access, captioning or cost help; we'll add what we learn.</div>
          <div>Every community is welcome here. Run a group that should be listed, or spot something to fix? Send it to Seattle Startup Pulse.</div>
        </footer>
      </div>
    </div>
  );
}
