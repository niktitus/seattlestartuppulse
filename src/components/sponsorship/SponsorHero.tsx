import { Button } from "@/components/ui/button";

interface SponsorHeroProps {
  onSelect: (audience: "organizer" | "brand") => void;
}

export default function SponsorHero({ onSelect }: SponsorHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      {/* Abstract geometric treatment */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-16 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-32 right-0 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,hsl(var(--foreground))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--foreground))_1px,transparent_1px)] [background-size:56px_56px]" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 py-20 md:py-28">
        <p className="mb-5 inline-flex items-center gap-2 border border-border bg-card px-3 py-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          Now forming the first cohort
        </p>
        <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight text-foreground md:text-6xl">
          Where community events and brand sponsors
          <span className="text-primary"> actually find each other</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
          A two-sided marketplace: organizers package and price sponsorships that brands will
          actually buy, and brands get vetted, delivery-ready grassroots opportunities without the
          RFP overhead.
        </p>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Button size="lg" className="h-12 px-7 text-base" onClick={() => onSelect("organizer")}>
            I run events
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-12 px-7 text-base"
            onClick={() => onSelect("brand")}
          >
            I sponsor events
          </Button>
        </div>

      </div>
    </section>
  );
}