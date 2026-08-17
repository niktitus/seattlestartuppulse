import { forwardRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

export type Audience = "organizer" | "brand";

const waitlistSchema = z.object({
  name: z.string().trim().min(1, { message: "Please add your name" }).max(120),
  email: z.string().trim().email({ message: "Enter a valid email address" }).max(255),
  organization: z.string().trim().max(200).optional().or(z.literal("")),
  audience_type: z.enum(["organizer", "brand"]),
});

interface SponsorWaitlistProps {
  audience: Audience;
  onAudienceChange: (audience: Audience) => void;
}

const SponsorWaitlist = forwardRef<HTMLElement, SponsorWaitlistProps>(function SponsorWaitlist(
  { audience, onAudienceChange },
  ref,
) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const parsed = waitlistSchema.safeParse({ name, email, organization, audience_type: audience });
    if (!parsed.success) {
      toast({
        title: "Check the form",
        description: parsed.error.errors[0]?.message ?? "Please review your details.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("sponsorship_waitlist").insert([
        {
          name: parsed.data.name,
          email: parsed.data.email.toLowerCase(),
          organization: parsed.data.organization || null,
          audience_type: parsed.data.audience_type,
        },
      ]);
      if (error) throw error;
      setIsDone(true);
    } catch (error) {
      console.error("Waitlist error:", error);
      toast({
        title: "Something went wrong",
        description: "Please try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section ref={ref} id="waitlist" className="border-b border-border scroll-mt-4">
      <div className="mx-auto max-w-2xl px-4 py-16 md:py-24">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          Join the waitlist
        </h2>
        <p className="mt-3 text-muted-foreground">
          Four fields. We'll reach out as we open the first cohort in your category.
        </p>

        {isDone ? (
          <div className="mt-8 border border-primary/30 bg-primary/5 p-8 text-center">
            <h3 className="text-lg font-semibold text-foreground">You're on the list</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              We'll be in touch as {audience === "organizer" ? "organizer" : "brand"} spots open up.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-5 border border-border bg-card p-6 md:p-8">
            <div className="space-y-2">
              <Label htmlFor="wl-audience">I'm a...</Label>
              <Select value={audience} onValueChange={(v) => onAudienceChange(v as Audience)}>
                <SelectTrigger id="wl-audience">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="organizer">I'm an organizer</SelectItem>
                  <SelectItem value="brand">I'm a brand</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="wl-name">Name</Label>
              <Input
                id="wl-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="wl-email">Email</Label>
              <Input
                id="wl-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@company.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="wl-org">
                {audience === "organizer" ? "Event or organization" : "Brand or company"}
              </Label>
              <Input
                id="wl-org"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder={audience === "organizer" ? "Seattle AI Meetup" : "Acme Co."}
              />
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Joining...
                </>
              ) : (
                "Request early access"
              )}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              No spam. We'll only email about early access.
            </p>
          </form>
        )}
      </div>
    </section>
  );
});

export default SponsorWaitlist;