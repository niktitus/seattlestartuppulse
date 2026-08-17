export default function SponsorFooter() {
  return (
    <footer className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center border border-border text-xs font-semibold text-primary">
            [L]
          </div>
          <p className="text-sm text-muted-foreground">
            [PLACEHOLDER: Product name] — sponsorship, matched and delivered.
          </p>
        </div>
        <a
          href="mailto:hello@seattlestartuppulse.com"
          className="text-sm text-foreground underline-offset-4 hover:underline"
        >
          hello@seattlestartuppulse.com
        </a>
      </div>
    </footer>
  );
}