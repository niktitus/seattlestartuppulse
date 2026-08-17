import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TRACKS = {
  organizer: [
    {
      title: "Package your event",
      body: "Answer a short intake and get a priced, credible sponsorship package built from what you already have.",
    },
    {
      title: "Get matched with vetted brands",
      body: "We put your event in front of brands whose audience, budget, and timing actually line up.",
    },
    {
      title: "Report results automatically",
      body: "A simple post-event recap goes out for you — the thing that turns a one-off into a renewal.",
    },
  ],
  brand: [
    {
      title: "Browse vetted opportunities",
      body: "Every listing has audience data, run-of-show clarity, and a reporting commitment before it appears.",
    },
    {
      title: "Commit to a few small, low-risk placements",
      body: "Test the long tail at meaningful spend levels instead of one oversized annual bet.",
    },
    {
      title: "See results without managing 10 vendors",
      body: "One point of contact, one reporting format, one invoice trail across every event you back.",
    },
  ],
};

function Steps({ steps }: { steps: { title: string; body: string }[] }) {
  return (
    <ol className="grid gap-px bg-border md:grid-cols-3">
      {steps.map((step, i) => (
        <li key={step.title} className="bg-background p-7">
          <span className="text-sm font-mono text-primary">0{i + 1}</span>
          <h3 className="mt-3 text-lg font-semibold tracking-tight text-foreground">{step.title}</h3>
          <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{step.body}</p>
        </li>
      ))}
    </ol>
  );
}

export default function SponsorHowItWorks() {
  return (
    <section className="border-b border-border bg-muted/30">
      <div className="mx-auto max-w-5xl px-4 py-16 md:py-24">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          How it works
        </h2>
        <p className="mt-3 text-muted-foreground">Two tracks, one marketplace.</p>

        <Tabs defaultValue="organizer" className="mt-8">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="organizer">Organizers</TabsTrigger>
            <TabsTrigger value="brand">Brands</TabsTrigger>
          </TabsList>
          <TabsContent value="organizer" className="mt-6 border border-border">
            <Steps steps={TRACKS.organizer} />
          </TabsContent>
          <TabsContent value="brand" className="mt-6 border border-border">
            <Steps steps={TRACKS.brand} />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}