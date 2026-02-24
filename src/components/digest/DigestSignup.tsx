import { useState } from "react";
import { Loader2, Rocket, Target, Wallet, Wrench, Sprout, Handshake, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

export type SubscriberRole =
  | "Founder"
  | "Operator"
  | "Investor"
  | "Service Provider"
  | "Accelerator/Incubator"
  | "Ecosystem Builder"
  | "Other";

export type SourceTab = "events" | "deadlines" | "news" | "jobs" | "learning" | "resources";
export type SourceType = "bottom_section" | "exit_intent" | "after_interaction";

interface RoleOption {
  value: SubscriberRole;
  label: string;
  icon: typeof Rocket;
}

const ROLE_OPTIONS: RoleOption[] = [
  { value: "Founder", label: "Founder", icon: Rocket },
  { value: "Operator", label: "Operator", icon: Target },
  { value: "Investor", label: "Investor", icon: Wallet },
  { value: "Service Provider", label: "Technical", icon: Wrench },
  { value: "Accelerator/Incubator", label: "Accelerator", icon: Sprout },
  { value: "Ecosystem Builder", label: "Community Builder", icon: Handshake },
  { value: "Other", label: "Other", icon: Zap },
];

const TAB_MESSAGES: Record<SourceTab, string> = {
  events: "Never miss a high-signal event for your role",
  deadlines: "Stay ahead of critical deadlines and opportunities",
  news: "Stay informed with curated ecosystem updates",
  jobs: "New startup opportunities tailored to your interests",
  learning: "Best resources for your role delivered weekly",
  resources: "Connect with vetted operators in your inbox",
};

interface DigestSignupProps {
  sourceTab?: SourceTab;
  sourceType?: SourceType;
  compact?: boolean;
  onSuccess?: () => void;
}

export default function DigestSignup({
  sourceTab = "events",
  sourceType = "bottom_section",
  compact = false,
  onSuccess,
}: DigestSignupProps) {
  const [email, setEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState<SubscriberRole | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const isFormValid = email.trim() !== "" && selectedRole !== null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("digest_subscribers").insert([{
        email: email.trim().toLowerCase(),
        role: selectedRole!,
        source_tab: sourceTab,
        source_type: sourceType,
      }]);

      if (error) {
        if (error.code === "23505") {
          // Unique constraint violation - email already exists
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
      console.error("Subscription error:", error);
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
      <div className={cn("bg-primary/5 border border-primary/20", compact ? "p-4" : "p-6 md:p-8")}>
        <div className="text-center">
          <div className="text-2xl mb-2">🎉</div>
          <h3 className="font-semibold text-foreground mb-1">You're in!</h3>
          <p className="text-sm text-muted-foreground">
            Check your email for confirmation. First digest arrives Monday at 8 AM PT.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div data-digest-signup className={cn("bg-card border border-border", compact ? "p-4" : "p-6 md:p-8")}>
      <div className={compact ? "" : "max-w-2xl mx-auto"}>
        {/* Header */}
        <div className={compact ? "mb-4" : "text-center mb-6"}>
          <h3 className={cn("font-semibold text-foreground", compact ? "text-base" : "text-lg md:text-xl")}>
            Get the curated digest
          </h3>
          <p className={cn("text-muted-foreground mt-1", compact ? "text-sm" : "text-sm md:text-base")}>
            Top 5 things worth your time, every Monday
          </p>
          <p className="text-sm text-primary mt-2">{TAB_MESSAGES[sourceTab]}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Selection - Button Style */}
          <div>
            <p className="text-sm font-medium text-foreground mb-2">I am a...</p>
            <div className={cn("grid gap-2", compact ? "grid-cols-2" : "grid-cols-2 md:grid-cols-4")}>
              {ROLE_OPTIONS.map((option) => {
                const Icon = option.icon;
                const isSelected = selectedRole === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setSelectedRole(option.value)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2.5 text-sm font-medium border transition-all text-left",
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background border-border hover:border-primary/50 text-foreground",
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="truncate">{option.label}</span>
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
              className="flex-1"
              required
            />
            <Button type="submit" disabled={!isFormValid || isSubmitting} className="shrink-0">
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Subscribing...
                </>
              ) : (
                "Subscribe"
              )}
            </Button>
          </div>

          {/* Subtext */}
          <p className="text-xs text-muted-foreground text-center">No spam. Unsubscribe anytime. ~2 min read.</p>
        </form>
      </div>
    </div>
  );
}
