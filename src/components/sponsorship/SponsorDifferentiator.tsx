import { BarChart3, ClipboardCheck, Users } from "lucide-react";

const POINTS = [
  {
    icon: Users,
    title: "Audience data, not vibes",
    body: "Who attends, in what roles, at what scale — documented before a listing goes live.",
  },
  {
    icon: ClipboardCheck,
    title: "Run-of-show clarity",
    body: "What a sponsor gets, when it happens, and who is accountable for delivering it.",
  },
  {
    icon: BarChart3,
    title: "Reporting capability",
    body: "Organizers commit to a post-event recap up front, so spend can be defended internally.",
  },
];

export default function SponsorDifferentiator() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-5xl px-4 py-16 md:py-24">
        <div className="max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-widest text-primary">
            What makes this different
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Vetted for delivery-readiness, not just listed
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            A directory tells you an event exists. We only publish opportunities that can actually
            deliver — and prove it afterward.
          </p>
        </div>

        <div className="mt-10 grid gap-px bg-border md:grid-cols-3">
          {POINTS.map((point) => (
            <div key={point.title} className="bg-background p-7">
              <div className="flex h-10 w-10 items-center justify-center border border-primary/30 bg-primary/5">
                <point.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mt-4 text-base font-semibold tracking-tight text-foreground">
                {point.title}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{point.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}