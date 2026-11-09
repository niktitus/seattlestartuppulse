import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { witSignupSchema } from "@/lib/wit-signup";

const STAGES = [
  { value: "student", label: "Student" },
  { value: "startup", label: "At a startup" },
  { value: "corporate", label: "At a corporate / enterprise" },
  { value: "transition", label: "In a transition period" },
] as const;

const INVOLVEMENT = [
  { value: "host_space", label: "Host a space or venue" },
  { value: "speak", label: "Speak or be a panelist" },
  { value: "organize", label: "Help plan & organize" },
  { value: "sponsor", label: "Sponsor an event" },
  { value: "attend", label: "Just attend for now" },
] as const;

const chip = (on: boolean) =>
  `min-h-11 rounded-full border px-4 py-2 text-sm text-left transition-colors ${
    on ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:border-primary"
  }`;

export default function WomenInTechPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [stage, setStage] = useState<string>("");
  const [involvement, setInvolvement] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    document.title = "Seattle Women in Tech | Seattle Startup Pulse";
  }, []);

  const toggle = (v: string) =>
    setInvolvement((cur) => (cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v]));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = witSignupSchema.safeParse({ name: name || undefined, email, stage, involvement, note: note || undefined });
    if (!parsed.success) {
      toast({ title: "Check the form", description: parsed.error.errors[0]?.message, variant: "destructive" });
      return;
    }
    setBusy(true);
    const { error } = await supabase.from("women_in_tech_interests").insert({
      name: parsed.data.name || null,
      email: parsed.data.email.toLowerCase(),
      stage: parsed.data.stage,
      involvement: parsed.data.involvement,
      note: parsed.data.note ?? null,
      consent_shared: false,
    });
    setBusy(false);
    if (error) {
      toast({ title: "Something went wrong", description: "Please try again.", variant: "destructive" });
      return;
    }
    setDone(true);
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-5 py-8 sm:py-14">
        <Link to="/" className="text-sm text-muted-foreground hover:text-primary">← Seattle Startup Pulse</Link>

        <p className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-primary">Seattle Women in Tech</p>
        <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-5xl">Want to get involved?</h1>
        {done ? (
          <div className="mt-10 rounded-lg border border-primary p-6">
            <Check className="h-6 w-6 text-primary" />
            <h2 className="mt-3 text-xl font-semibold">You're in.</h2>
            <p className="mt-2 text-muted-foreground">We'll be in touch with what's coming up.</p>
            <Link to="/?wit=1" className="mt-5 inline-block text-sm font-medium text-primary underline">
              See women in tech events on the calendar →
            </Link>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-10 space-y-8">
            <div>
              <label htmlFor="wit-name" className="text-sm font-semibold">Name <span className="font-normal text-muted-foreground">(optional)</span></label>
              <Input id="wit-name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-2 h-12 text-base" maxLength={120} />
            </div>

            <div>
              <label htmlFor="wit-email" className="text-sm font-semibold">Email</label>
              <Input id="wit-email" type="email" inputMode="email" autoComplete="email" value={email}
                onChange={(e) => setEmail(e.target.value)} className="mt-2 h-12 text-base" placeholder="you@email.com" maxLength={255} />
            </div>

            <fieldset>
              <legend className="text-sm font-semibold">Where are you today?</legend>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                {STAGES.map((s) => (
                  <button type="button" key={s.value} aria-pressed={stage === s.value} onClick={() => setStage(s.value)} className={chip(stage === s.value)}>
                    {s.label}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="text-sm font-semibold">Want to help plan and host events?</legend>
              <p className="mt-1 text-sm text-muted-foreground">Pick any that fit.</p>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                {INVOLVEMENT.map((o) => (
                  <button type="button" key={o.value} aria-pressed={involvement.includes(o.value)} onClick={() => toggle(o.value)} className={chip(involvement.includes(o.value))}>
                    {o.label}
                  </button>
                ))}
              </div>
            </fieldset>

            <div>
              <label htmlFor="wit-note" className="text-sm font-semibold">Anything else? <span className="font-normal text-muted-foreground">(optional)</span></label>
              <Textarea id="wit-note" value={note} onChange={(e) => setNote(e.target.value)} maxLength={1000} className="mt-2 text-base" rows={3} />
            </div>

            <p className="text-sm text-muted-foreground">
              The information you submit will be shared with other community organizers to help create better events.
            </p>

            <Button type="submit" size="lg" disabled={busy} className="h-12 w-full sm:w-auto">
              {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Count me in
            </Button>
          </form>
        )}
      </div>
    </main>
  );
}
