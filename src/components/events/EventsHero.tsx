export default function EventsHero() {
  return (
    <div className="bg-accent border border-border rounded-none p-6 mb-6">
      <h1 className="text-2xl font-bold text-foreground mb-2">
        Worth Leaving Your Desk For
      </h1>
      <p className="text-muted-foreground text-sm leading-relaxed">
        We curate, not aggregate. Every event answers:
      </p>
      <ul className="text-muted-foreground text-sm mt-2 space-y-1">
        <li className="flex items-center gap-2">
          <span className="text-primary">•</span>
          Who will I actually meet?
        </li>
        <li className="flex items-center gap-2">
          <span className="text-primary">•</span>
          What will I leave with?
        </li>
        <li className="flex items-center gap-2">
          <span className="text-primary">•</span>
          Is this right for my stage?
        </li>
      </ul>
      <p className="text-xs text-muted-foreground mt-4 font-medium uppercase tracking-wide">
        Quality over volume. Trust over FOMO.
      </p>
    </div>
  );
}
