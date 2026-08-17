import { useRef, useState } from "react";
import Seo from "@/components/seo/Seo";
import SponsorHero from "@/components/sponsorship/SponsorHero";
import SponsorProblem from "@/components/sponsorship/SponsorProblem";
import SponsorHowItWorks from "@/components/sponsorship/SponsorHowItWorks";
import SponsorDifferentiator from "@/components/sponsorship/SponsorDifferentiator";

import SponsorWaitlist, { type Audience } from "@/components/sponsorship/SponsorWaitlist";
import SponsorFooter from "@/components/sponsorship/SponsorFooter";

export default function SponsorshipPage() {
  const [audience, setAudience] = useState<Audience>("organizer");
  const waitlistRef = useRef<HTMLElement>(null);

  const handleSelect = (next: Audience) => {
    setAudience(next);
    waitlistRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="Sponsorship marketplace for community events and brands"
        description="A two-sided marketplace connecting community event organizers with brand sponsors — vetted, delivery-ready opportunities instead of endless RFPs. Join the waitlist."
        path="/sponsorship"
        keywords={["event sponsorship", "community events", "brand sponsors", "sponsorship marketplace"]}
      />
      <main>
        <SponsorHero onSelect={handleSelect} />
        <SponsorProblem />
        <SponsorHowItWorks />
        <SponsorDifferentiator />
        
        <SponsorWaitlist ref={waitlistRef} audience={audience} onAudienceChange={setAudience} />
      </main>
      <SponsorFooter />
    </div>
  );
}