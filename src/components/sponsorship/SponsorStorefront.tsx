import { Button } from "@/components/ui/button";
import { Beer, Camera, Cookie, ShoppingBag, Signpost, Wine } from "lucide-react";

interface SponsorStorefrontProps {
  onClaim: () => void;
}

const LISTINGS = [
  {
    icon: Wine,
    category: "Napkins & Cups",
    value: "$150–400 in-kind",
    tags: "Women in Tech · Seattle · 30-150 attendees",
  },
  {
    icon: Cookie,
    category: "Snack Table",
    value: "$200–600 in-kind",
    tags: "Founders & Operators · Seattle · 50-250 attendees",
  },
  {
    icon: ShoppingBag,
    category: "Swag & Goodie Bags",
    value: "$500–1,500 in-kind",
    tags: "Tech Community · Seattle · 100-500 attendees",
  },
  {
    icon: Signpost,
    category: "Signage & Banners",
    value: "$300–800 in-kind",
    tags: "Design & Product · Seattle · 30-200 attendees",
  },
  {
    icon: Beer,
    category: "Bar Sponsor",
    value: "$1,000–3,000 in-kind",
    tags: "Cross-community · Seattle · 75-400 attendees",
  },
  {
    icon: Camera,
    category: "Photography",
    value: "$800–2,000 in-kind",
    tags: "Startup Ecosystem · Seattle · 50-300 attendees",
  },
];

export default function SponsorStorefront({ onClaim }: SponsorStorefrontProps) {
  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto max-w-5xl px-4 py-16 md:py-24">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Sponsorship, sold in pieces
          </h2>
          <p className="mt-3 text-muted-foreground">
            Brands pre-commit to sponsoring specific event components. Organizers browse and claim
            what fits — no cold outreach required.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {LISTINGS.map((listing) => {
            const Icon = listing.icon;
            return (
              <div
                key={listing.category}
                className="group flex flex-col border border-border bg-card p-5 transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center border border-border bg-muted">
                    <Icon className="h-5 w-5 text-primary" strokeWidth={1.5} />
                  </div>
                  <span className="text-sm font-medium text-primary">{listing.value}</span>
                </div>

                <h3 className="mt-4 text-lg font-semibold tracking-tight text-foreground">
                  {listing.category}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">{listing.tags}</p>

                <div className="mt-5 flex flex-col gap-3 pt-4 border-t border-border">
                  <Button
                    size="sm"
                    className="w-full transition-transform active:scale-95"
                    onClick={onClaim}
                  >
                    Claim this
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="w-full text-muted-foreground"
                    disabled
                  >
                    Browse full catalog
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 border border-primary/30 bg-primary/5 p-6 md:p-8">
          <p className="max-w-3xl text-lg font-medium leading-relaxed text-foreground">
            Brands set a budget and criteria once. Every qualifying event gets matched automatically
            — no repeat outreach, no RFPs.
          </p>
        </div>
      </div>
    </section>
  );
}
