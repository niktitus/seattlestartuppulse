import { useState } from 'react';
import { Link } from 'react-router-dom';
import Seo from '@/components/seo/Seo';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { feedbackSchema, firstError } from '@/lib/submissionSchemas';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import skyline from '@/assets/seattle-skyline.png.asset.json';
import { cn } from '@/lib/utils';

type FeedbackInsert = Database['public']['Tables']['event_feedback']['Insert'];

const MOST_VALUABLE_OPTIONS = [
  'Startup Fair',
  'Investor Reverse Pitches',
  'Live demos',
  'Networking',
];

const ROLE_OPTIONS = [
  { value: 'founder', label: 'Founder' },
  { value: 'operator', label: 'Operator' },
  { value: 'investor', label: 'Investor' },
  { value: 'other', label: 'Other' },
];

export default function FeedbackPage() {
  const { toast } = useToast();
  const [rating, setRating] = useState<number | null>(null);
  const [mostValuable, setMostValuable] = useState('');
  const [wishMore, setWishMore] = useState('');
  const [attendAgain, setAttendAgain] = useState<boolean | null>(null);
  const [role, setRole] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      rating,
      most_valuable_part: mostValuable,
      wish_more: wishMore.trim() || null,
      attend_again: attendAgain,
      role,
    };

    const parsed = feedbackSchema.safeParse(payload);
    if (!parsed.success) {
      toast({
        title: 'Please check your answers',
        description: firstError(parsed),
      });
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from('event_feedback').insert([parsed.data as FeedbackInsert]);
    setSubmitting(false);

    if (error) {
      toast({
        title: 'Something went wrong',
        description: error.message,
      });
      return;
    }

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <>
        <Seo
          title="Feedback Received"
          description="Thanks for sharing your thoughts on the Startup Showcase."
          path="/feedback"
        />
        <div className="bg-showcase min-h-screen showcase-theme">
          <div className="max-w-xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
            <Link
              to="/showcase"
              className="inline-flex items-center gap-1.5 text-sm text-showcase-foreground/80 hover:text-showcase-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to program
            </Link>

            <Card className="mt-6 text-center">
              <CardContent className="p-8 sm:p-10 space-y-4">
                <CheckCircle className="h-12 w-12 mx-auto text-primary" />
                <h1 className="text-xl sm:text-2xl font-semibold text-foreground">
                  Thanks for your feedback
                </h1>
                <p className="text-sm text-muted-foreground">
                  Your thoughts help us make next year's showcase even better.
                </p>
                <Button asChild className="mt-2">
                  <Link to="/showcase">Back to program</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Seo
        title="Startup Showcase Feedback"
        description="Share your feedback on the Startup Showcase and help us improve next year's event."
        path="/feedback"
      />
      <div className="bg-showcase min-h-screen showcase-theme">
        <div className="max-w-xl mx-auto px-4 sm:px-6 py-4 sm:py-6 pb-12">
          <Link
            to="/showcase"
            className="inline-flex items-center gap-1.5 text-sm text-showcase-foreground/80 hover:text-showcase-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to program
          </Link>

          <div className="relative overflow-hidden rounded-lg border border-border shadow-elevated mt-4">
            <img
              src={skyline.url}
              alt="Illustrated Seattle skyline with Mount Rainier and the Space Needle"
              className="h-20 sm:h-28 w-full object-cover object-bottom"
              loading="eager"
            />
          </div>

          <div className="mt-4 space-y-1">
            <h1 className="text-xl sm:text-2xl font-semibold text-showcase-foreground">
              Startup Showcase Feedback
            </h1>
            <p className="text-sm text-showcase-foreground/80">
              Help us make next year's event even better. Takes about one minute.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            {/* Overall rating */}
            <Card>
              <CardContent className="p-4 sm:p-5 space-y-3">
                <Label className="text-sm font-medium text-foreground">
                  How would you rate the event overall? <span className="text-destructive">*</span>
                </Label>
                <div
                  className="flex flex-wrap gap-2"
                  role="radiogroup"
                  aria-label="Overall event rating"
                >
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      role="radio"
                      aria-checked={rating === value}
                      onClick={() => setRating(value)}
                      className={cn(
                        'h-11 w-11 rounded-md border text-sm font-semibold transition-colors',
                        rating === value
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-background/60 text-muted-foreground hover:border-primary/40 hover:text-foreground'
                      )}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Most valuable part */}
            <Card>
              <CardContent className="p-4 sm:p-5 space-y-3">
                <Label className="text-sm font-medium text-foreground">
                  Which part of the event delivered the most value?{' '}
                  <span className="text-destructive">*</span>
                </Label>
                <RadioGroup
                  value={mostValuable}
                  onValueChange={setMostValuable}
                  className="gap-2"
                >
                  {MOST_VALUABLE_OPTIONS.map((option) => (
                    <div key={option} className="flex items-center gap-2">
                      <RadioGroupItem value={option} id={`most-${option}`} />
                      <Label
                        htmlFor={`most-${option}`}
                        className="text-sm font-normal text-muted-foreground cursor-pointer"
                      >
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Role */}
            <Card>
              <CardContent className="p-4 sm:p-5 space-y-3">
                <Label className="text-sm font-medium text-foreground">
                  I am a… <span className="text-destructive">*</span>
                </Label>
                <RadioGroup value={role} onValueChange={setRole} className="gap-2">
                  {ROLE_OPTIONS.map(({ value, label }) => (
                    <div key={value} className="flex items-center gap-2">
                      <RadioGroupItem value={value} id={`role-${value}`} />
                      <Label
                        htmlFor={`role-${value}`}
                        className="text-sm font-normal text-muted-foreground cursor-pointer"
                      >
                        {label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Wish there'd been more of */}
            <Card>
              <CardContent className="p-4 sm:p-5 space-y-3">
                <Label htmlFor="wish-more" className="text-sm font-medium text-foreground">
                  What's one thing you wish there'd been more of?
                </Label>
                <Textarea
                  id="wish-more"
                  value={wishMore}
                  onChange={(e) => setWishMore(e.target.value)}
                  placeholder="e.g., more time for networking, deeper founder Q&A..."
                  maxLength={1000}
                  className="min-h-[100px] resize-none"
                />
                <p className="text-xs text-muted-foreground text-right">
                  {wishMore.length}/1000
                </p>
              </CardContent>
            </Card>

            {/* Attend again */}
            <Card>
              <CardContent className="p-4 sm:p-5 space-y-3">
                <Label className="text-sm font-medium text-foreground">
                  Would you attend again next year?{' '}
                  <span className="text-destructive">*</span>
                </Label>
                <div
                  className="flex flex-wrap gap-2"
                  role="radiogroup"
                  aria-label="Would you attend again next year?"
                >
                  {[
                    { label: 'Yes', value: true },
                    { label: 'No', value: false },
                  ].map(({ label, value }) => (
                    <button
                      key={label}
                      type="button"
                      role="radio"
                      aria-checked={attendAgain === value}
                      onClick={() => setAttendAgain(value)}
                      className={cn(
                        'h-11 px-6 rounded-md border text-sm font-medium transition-colors',
                        attendAgain === value
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-background/60 text-muted-foreground hover:border-primary/40 hover:text-foreground'
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full h-11 text-sm font-semibold"
            >
              {submitting ? 'Submitting...' : 'Submit feedback'}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
