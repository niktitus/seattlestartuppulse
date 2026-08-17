export default function SponsorProof() {
  return (
    <section className="border-b border-border bg-muted/30">
      <div className="mx-auto max-w-5xl px-4 py-16 md:py-20">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Credibility
        </p>
        <h2 className="mt-3 max-w-3xl text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          Built by the team behind [PLACEHOLDER: event name] — [PLACEHOLDER: 500+ attendees,
          JPMorgan-presented]
        </h2>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          [PLACEHOLDER: one line on prior sponsor outcomes — renewals, sell-through, spend range.]
        </p>

        <div className="mt-10">
          <p className="mb-4 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Past sponsors [PLACEHOLDER]
          </p>
          <div className="grid grid-cols-2 gap-px bg-border sm:grid-cols-3 md:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex h-20 items-center justify-center bg-background text-xs text-muted-foreground"
              >
                [LOGO {i + 1}]
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}