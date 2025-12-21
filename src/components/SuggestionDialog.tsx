import { useState } from 'react';
import { MessageSquarePlus, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export default function SuggestionDialog() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    suggestionType: '',
    title: '',
    description: '',
    url: '',
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.suggestionType || !formData.title || !formData.description) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-suggestion', {
        body: formData,
      });

      if (error) throw error;

      toast({
        title: "Suggestion submitted!",
        description: "Thank you for your contribution. We'll review it soon.",
      });

      setFormData({
        name: '',
        email: '',
        suggestionType: '',
        title: '',
        description: '',
        url: '',
      });
      setOpen(false);
    } catch (error: any) {
      console.error('Error submitting suggestion:', error);
      toast({
        title: "Submission failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-8 p-4 bg-muted/50 border border-border rounded-lg">
      <div className="flex items-start gap-3">
        <MessageSquarePlus className="h-5 w-5 text-primary mt-0.5 shrink-0" />
        <div className="flex-1">
          <h3 className="font-medium text-foreground text-sm mb-1">Have an event or resource to share?</h3>
          <p className="text-xs text-muted-foreground mb-3">
            Help us keep this list up-to-date by submitting your suggestions.
          </p>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1.5">
                <Send className="h-3.5 w-3.5" />
                Submit a Suggestion
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Submit a Suggestion</DialogTitle>
                <DialogDescription>
                  Share an event, resource, or news item with us.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Your Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Doe"
                      maxLength={100}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email">Your Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@example.com"
                      maxLength={255}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="type">Suggestion Type *</Label>
                  <Select
                    value={formData.suggestionType}
                    onValueChange={(value) => setFormData({ ...formData, suggestionType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Event">Event</SelectItem>
                      <SelectItem value="Resource">Resource</SelectItem>
                      <SelectItem value="Community">Community</SelectItem>
                      <SelectItem value="News">News</SelectItem>
                      <SelectItem value="Deadline">Deadline / Application</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Startup Pitch Night"
                    maxLength={200}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Tell us more about this suggestion..."
                    rows={3}
                    maxLength={1000}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="url">URL (optional)</Label>
                  <Input
                    id="url"
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    placeholder="https://..."
                    maxLength={500}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit Suggestion
                    </>
                  )}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
