import { useState } from 'react';
import { Loader2, Rocket, Target, Wallet, Wrench, Sprout, Handshake, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

export type SubscriberRole = 
  | 'Founder'
  | 'Operator'
  | 'Investor'
  | 'Service Provider'
  | 'Accelerator/Incubator'
  | 'Ecosystem Builder'
  | 'Other';

export type SourceTab = 'events' | 'deadlines' | 'news' | 'jobs' | 'learning' | 'resources';
export type SourceType = 'bottom_section' | 'exit_intent' | 'after_interaction';

interface RoleOption {
  value: SubscriberRole;
  label: string;
  icon: typeof Rocket;
}

const ROLE_OPTIONS: RoleOption[] = [
  { value: 'Founder', label: 'Founder', icon: Rocket },
  { value: 'Operator', label: 'Operator', icon: Target },
  { value: 'Investor', label: 'Investor', icon: Wallet },
  { value: 'Service Provider', label: 'Service Provider', icon: Wrench },
  { value: 'Accelerator/Incubator', label: 'Accelerator', icon: Sprout },
  { value: 'Ecosystem Builder', label: 'Ecosystem Builder', icon: Handshake },
  { value: 'Other', label: 'Other', icon: Zap },
];

interface DigestSignupProps {
  sourceTab?: SourceTab;
  sourceType?: SourceType;
  compact?: boolean;
  onSuccess?: () => void;
}

export default function DigestSignup({ 
  sourceTab = 'events', 
  sourceType = 'bottom_section',
  compact = false,
  onSuccess 
}: DigestSignupProps) {
  const [email, setEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState<SubscriberRole | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const isFormValid = email.trim() !== '' && selectedRole !== null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('digest_subscribers')
        .insert({
          email: email.trim().toLowerCase(),
          role: selectedRole,
          source_tab: sourceTab,
          source_type: sourceType,
        });

      if (error) {
        if (error.code === '23505') {
          toast({
            title: "You're already subscribed!",
            description: "Check your inbox for past digests.",
          });
          setIsSuccess(true);
        } else {
          throw error;
        }
      } else {
        toast({
          title: "You're in!",
          description: "Check your email for confirmation.",
        });
        setIsSuccess(true);
        onSuccess?.();
      }
    } catch (error) {
      console.error('Subscription error:', error);
      toast({
        title: "Something went wrong",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className={cn(
        "border border-primary/20 rounded-lg",
        compact ? "p-4" : "p-6"
      )}>
        <div className="text-center">
          <div className="text-xl mb-2">🎉</div>
          <h3 className="font-semibold text-foreground text-sm mb-1">You're in!</h3>
          <p className="text-xs text-muted-foreground">
            First digest arrives Monday at 8 AM PT.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      data-digest-signup
      className={cn(
        "border border-border rounded-lg",
        compact ? "p-4" : "p-6"
      )}
    >
      <div className={compact ? "" : "max-w-lg mx-auto"}>
        {/* Header */}
        <div className={cn("mb-5", !compact && "text-center")}>
          <h3 className="font-semibold text-foreground text-base">
            Get the curated digest
          </h3>
          <p className="text-[13px] text-muted-foreground mt-0.5">
            Top 5 things worth your time, every Monday
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Selection */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">I am a...</p>
            <div className={cn(
              "grid gap-1.5",
              compact ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-4"
            )}>
              {ROLE_OPTIONS.map((option) => {
                const isSelected = selectedRole === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setSelectedRole(option.value)}
                    className={cn(
                      "px-3 py-2 text-xs font-medium border rounded-md transition-all text-left",
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card border-border hover:border-foreground/20 text-foreground"
                    )}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Email Input */}
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 h-9 text-sm"
              required
            />
            <Button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              size="sm"
              className="shrink-0 h-9"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Subscribing...
                </>
              ) : (
                'Subscribe'
              )}
            </Button>
          </div>

          <p className="text-[11px] text-muted-foreground text-center">
            No spam · Unsubscribe anytime · ~2 min read
          </p>
        </form>
      </div>
    </div>
  );
}
