import { useState } from 'react';
import { ChevronDown, ChevronUp, CheckCircle2, XCircle, Clock, DollarSign, Users, Lightbulb } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import DigestSignup from '@/components/digest/DigestSignup';
import ExitIntentModal from '@/components/digest/ExitIntentModal';
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

interface EducationSection {
  id: string;
  title: string;
  icon: typeof CheckCircle2;
  content: React.ReactNode;
}

export default function FractionalPage() {
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(['vetting']));

  const toggleSection = (id: string) => {
    setOpenSections(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const educationSections: EducationSection[] = [
    {
      id: 'vetting',
      title: 'How to Vet Fractional Talent',
      icon: CheckCircle2,
      content: (
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-primary flex items-center gap-2 mb-3">
              <CheckCircle2 className="h-4 w-4" />
              Green Flags
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                5+ years as an operator (not just consultant)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                Verifiable track record with specific metrics/outcomes
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                Industry-specific expertise relevant to your business model
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                3+ founder references willing to speak
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                Clear engagement models with transparent pricing
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                Can articulate their operating philosophy/frameworks
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                Has worked with companies at your stage
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-destructive flex items-center gap-2 mb-3">
              <XCircle className="h-4 w-4" />
              Red Flags
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-destructive mt-1">•</span>
                Career entirely in consulting/advisory (no operator experience)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive mt-1">•</span>
                Vague deliverables or outcomes
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive mt-1">•</span>
                Unwilling to provide references
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive mt-1">•</span>
                Pushy sales tactics or urgency creation
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive mt-1">•</span>
                One-size-fits-all approach
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive mt-1">•</span>
                Can't explain their decision-making frameworks
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive mt-1">•</span>
                Overpromises on timeline or results
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 'when',
      title: 'When to Hire Fractional vs. Full-Time',
      icon: Clock,
      content: (
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-foreground mb-3">Choose Fractional When:</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                You need specialized expertise for 12-18 months
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                You're pre-product-market fit and need flexibility
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                You need senior strategic guidance, not daily execution
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                Budget constraints make full-time hire impossible
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                You want to "try before you buy" for a critical role
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                The function needs are &lt;20 hours/week
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-foreground mb-3">Choose Full-Time When:</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-secondary mt-1">✓</span>
                You need 30+ hours/week of dedicated focus
              </li>
              <li className="flex items-start gap-2">
                <span className="text-secondary mt-1">✓</span>
                The role requires deep institutional knowledge
              </li>
              <li className="flex items-start gap-2">
                <span className="text-secondary mt-1">✓</span>
                You've achieved product-market fit and need to scale
              </li>
              <li className="flex items-start gap-2">
                <span className="text-secondary mt-1">✓</span>
                Company culture building is a priority
              </li>
              <li className="flex items-start gap-2">
                <span className="text-secondary mt-1">✓</span>
                The function is core to competitive advantage
              </li>
              <li className="flex items-start gap-2">
                <span className="text-secondary mt-1">✓</span>
                You need someone managing a team
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 'models',
      title: 'Typical Engagement Models',
      icon: DollarSign,
      content: (
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-medium text-foreground mb-1">Monthly Retainer</h4>
            <p className="text-sm text-primary font-medium mb-2">$5K-20K+/month</p>
            <p className="text-sm text-muted-foreground">
              Best for: Ongoing strategic guidance (CFO, CMO, COO)
            </p>
          </div>
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-medium text-foreground mb-1">Hourly</h4>
            <p className="text-sm text-primary font-medium mb-2">$200-500/hour</p>
            <p className="text-sm text-muted-foreground">
              Best for: Specialized consulting, workshops, coaching
            </p>
          </div>
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-medium text-foreground mb-1">Project-Based</h4>
            <p className="text-sm text-primary font-medium mb-2">$10K-50K+ per project</p>
            <p className="text-sm text-muted-foreground">
              Best for: Defined scope work (fundraising, GTM strategy, systems)
            </p>
          </div>
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-medium text-foreground mb-1">Equity + Cash Hybrid</h4>
            <p className="text-sm text-primary font-medium mb-2">Reduced cash + 0.1-0.5% equity</p>
            <p className="text-sm text-muted-foreground">
              Best for: Longer-term partnerships, advisor-level engagement
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'stories',
      title: 'Fractional Success Stories',
      icon: Lightbulb,
      content: (
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              <span className="bg-primary/10 text-primary px-2 py-0.5 rounded">Series A SaaS</span>
              <span>•</span>
              <span>Fractional CFO</span>
            </div>
            <p className="text-sm text-foreground mb-2">
              "Brought in a fractional CFO 6 months before our Series A. They built our financial model, 
              implemented proper reporting, and coached me through investor meetings."
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Outcome:</strong> Raised $8M at 2x better terms than initial offers. Engagement: 4 months, $12K/month.
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              <span className="bg-primary/10 text-primary px-2 py-0.5 rounded">Seed Stage Marketplace</span>
              <span>•</span>
              <span>Fractional Head of Growth</span>
            </div>
            <p className="text-sm text-foreground mb-2">
              "We couldn't afford a full-time growth lead, so we hired fractional. They set up our 
              entire paid acquisition stack and trained our team."
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Outcome:</strong> CAC dropped 40%, established repeatable growth playbook. Engagement: 6 months, $8K/month.
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <AppLayout activeTab="resources">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-foreground">Fractional Resources</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Expert guidance for hiring and working with fractional operators
          </p>
        </div>

        {/* Educational Accordions */}
        <div className="space-y-3 mb-8">
          {educationSections.map((section) => {
            const Icon = section.icon;
            const isOpen = openSections.has(section.id);
            
            return (
              <Collapsible
                key={section.id}
                open={isOpen}
                onOpenChange={() => toggleSection(section.id)}
              >
                <CollapsibleTrigger asChild>
                  <button
                    className={cn(
                      'w-full flex items-center justify-between gap-3 p-4 rounded-lg border transition-colors text-left',
                      isOpen
                        ? 'bg-card border-primary/30'
                        : 'bg-card border-border hover:border-primary/20'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={cn('h-5 w-5', isOpen ? 'text-primary' : 'text-muted-foreground')} />
                      <span className="font-medium text-foreground">{section.title}</span>
                    </div>
                    {isOpen ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="p-4 pt-2 bg-card border border-t-0 border-border rounded-b-lg -mt-2">
                    {section.content}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>

        {/* Provider Directory Coming Soon */}
        <div className="bg-muted/50 border border-border rounded-lg p-8 text-center">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold text-foreground mb-2">Provider Directory Coming Soon</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            We're curating a vetted directory of fractional operators in the Seattle area. 
            Each provider will be verified for operator experience and founder references.
          </p>
          <p className="text-sm text-primary mt-4">
            Interested in being listed?{' '}
            <a href="mailto:hello@seattlefounderscalendar.com" className="underline">
              Get in touch
            </a>
          </p>
        </div>

        {/* Digest Signup */}
        <div className="mt-12">
          <DigestSignup sourceTab="resources" />
        </div>
      </div>

      {/* Exit Intent Modal */}
      <ExitIntentModal sourceTab="resources" />
    </AppLayout>
  );
}
