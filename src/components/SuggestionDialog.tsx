import { useState } from 'react';
import { Send, Loader2, Globe, Pencil } from 'lucide-react';
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

type Step = 'url' | 'review';

interface ExtractedData {
  title: string;
  date: string;
  time: string;
  organizer: string;
  description: string;
  format: string;
  type: string;
  city: string;
  cost: string;
  confidence: string;
}

export default function SuggestionDialog() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>('url');
  const [url, setUrl] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ExtractedData>({
    title: '', date: '', time: '', organizer: '',
    description: '', format: 'inperson', type: 'Event',
    city: 'Seattle', cost: 'Free', confidence: '',
  });
  const { toast } = useToast();

  const resetForm = () => {
    setStep('url');
    setUrl('');
    setFormData({
      title: '', date: '', time: '', organizer: '',
      description: '', format: 'inperson', type: 'Event',
      city: 'Seattle', cost: 'Free', confidence: '',
    });
  };

  const handleExtract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = `https://${formattedUrl}`;
      setUrl(formattedUrl);
    }

    setIsExtracting(true);
    try {
      const { data, error } = await supabase.functions.invoke('verify-event-date', {
        body: { url: formattedUrl },
      });

      if (error) throw error;

      if (data.success && data.data) {
        setFormData(data.data);
        setStep('review');
      } else {
        toast({
          title: "Couldn't extract details",
          description: data.message || "Try a different URL or fill in manually.",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      console.error('Extraction error:', err);
      toast({
        title: "Extraction failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExtracting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.date) {
      toast({
        title: "Missing fields",
        description: "Title and date are required.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('events').insert({
        title: formData.title.trim(),
        date: formData.date.trim(),
        time: formData.time.trim() || 'TBD',
        format: formData.format,
        type: formData.type,
        organizer: formData.organizer.trim() || 'Unknown',
        description: formData.description.trim() || formData.title,
        url: url.trim(),
        city: formData.city.trim() || 'Seattle',
        cost: formData.cost || 'Free',
        audience: ['Founders'],
        stage: ['Pre-seed', 'Seed'],
        featured: false,
        is_approved: false,
      });

      if (error) throw error;

      toast({
        title: "Event submitted!",
        description: "Your event is pending review.",
      });

      resetForm();
      setOpen(false);
    } catch (error: any) {
      console.error('Submit error:', error);
      toast({
        title: "Submission failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) resetForm(); }}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full h-9 gap-2 text-sm border-dashed border-border hover:border-primary/50 hover:bg-primary/5 text-muted-foreground hover:text-foreground transition-colors">
          <Send className="h-3.5 w-3.5" />
          Submit an Event
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        {step === 'url' ? (
          <>
            <DialogHeader>
              <DialogTitle>Submit an Event</DialogTitle>
              <DialogDescription>
                Paste the event URL and we'll extract the details automatically.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleExtract} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="event-url">Event URL *</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="event-url"
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://eventbrite.com/e/..."
                    className="pl-9"
                    required
                    autoFocus
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Works with Eventbrite, Lu.ma, Meetup, and most event pages
                </p>
              </div>
              <Button type="submit" className="w-full" disabled={isExtracting || !url.trim()}>
                {isExtracting ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Extracting details...</>
                ) : (
                  <><Send className="h-4 w-4 mr-2" />Extract &amp; Review</>
                )}
              </Button>
            </form>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Review Event Details</DialogTitle>
              <DialogDescription>
                We extracted these details. Edit anything that looks off before submitting.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="r-title">Title</Label>
                <Input id="r-title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} maxLength={200} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="r-date">Date</Label>
                  <Input id="r-date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} maxLength={50} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="r-time">Time</Label>
                  <Input id="r-time" value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} maxLength={50} />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="r-organizer">Organizer</Label>
                <Input id="r-organizer" value={formData.organizer} onChange={(e) => setFormData({ ...formData, organizer: e.target.value })} maxLength={100} />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="r-description">Description</Label>
                <Textarea id="r-description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={2} maxLength={500} />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">Format</Label>
                  <Select value={formData.format} onValueChange={(v) => setFormData({ ...formData, format: v })}>
                    <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inperson">In-Person</SelectItem>
                      <SelectItem value="virtual">Virtual</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Type</Label>
                  <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                    <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Event">Event</SelectItem>
                      <SelectItem value="Networking">Networking</SelectItem>
                      <SelectItem value="Workshop">Workshop</SelectItem>
                      <SelectItem value="Pitch Event">Pitch Event</SelectItem>
                      <SelectItem value="Conference">Conference</SelectItem>
                      <SelectItem value="Meetup">Meetup</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">City</Label>
                  <Input value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="h-8 text-xs" maxLength={50} />
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setStep('url')}>
                  <Pencil className="h-3.5 w-3.5 mr-1" />Back
                </Button>
                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Submitting...</>
                  ) : (
                    <><Send className="h-4 w-4 mr-2" />Submit</>
                  )}
                </Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
