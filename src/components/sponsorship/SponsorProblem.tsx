import { CalendarRange, Megaphone } from "lucide-react";

const COLUMNS = [
  {
    icon: CalendarRange,
    label: "For organizers",
    title: "You have a real audience and no idea how to sell sponsorship",
    lines: [
      "You know who shows up — you just can't turn that into a deck, a price, or a pitch.",
      "Outreach happens between a day job and running the event itself.",
      "So the ask is undersold, or never made at all.",
    ],
  },
  {
    icon: Megaphone,
    label: "For brands",
    title: "You have budget for grassroots presence and no efficient way to find it",
    lines: [
      "The same 20 well-known events soak up the budget by default.",
      "The long tail is real, but sourcing and vetting it costs more than the placement.",
      "So you overpay for reach you can't attribute.",
    ],
  },
];

export default function SponsorProblem() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto grid max-w-5xl gap-px bg-border px-0 md:grid-cols-2">
        {COLUMNS.map((col) => (
          <div key={col.label} className="bg-background p-8 md:p-12">
            <div className="mb-5 flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-primary">
              <col.icon className="h-4 w-4" />
              {col.label}
            </div>
            <h2 className="text-2xl font-semibold leading-tight tracking-tight text-foreground">
              {col.title}
            </h2>
            <ul className="mt-5 space-y-2.5">
              {col.lines.map((line) => (
                <li key={line} className="text-[15px] leading-relaxed text-muted-foreground">
                  {line}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}