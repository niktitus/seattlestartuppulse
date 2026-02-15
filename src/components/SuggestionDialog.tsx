import { useState } from 'react';
import { Send, Loader2, CheckCircle } from 'lucide-react';
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

interface DateVerification {
  status: 'idle' | 'verifying' | 'verified' | 'mismatch';
  extractedDate?: string;
  extractedTime?: string;
  message?: string;
}

export default function SuggestionDialog() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dateVerification, setDateVerification] = useState<DateVerification>({ status: 'idle' });
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    format: 'inperson',
    type: 'Event',
    organizer: '',
    description: '',
    url: '',
    city: 'Seattle',
  });
  const { toast } = useToast();

  const verifyEventDate = async (url: string, submittedDate: string) => {
    if (!url || url === '#' || !url.startsWith('http')) {
      setDateVerification({ status: 'idle' });
      return;
    }

    setDateVerification({ status: 'verifying' });

    try {
      const { data, error } = await supabase.functions.invoke('verify-event-date', {
        body: { url, submittedDate },
      });

      if (error) throw error;

      if (data.extractedDate) {
        setDateVerification({
          status: 'verified',
          extractedDate: data.extractedDate,
          extractedTime: data.extractedTime,
          message: data.message,
        });
      } else {
        setDateVerification({ status: 'idle', message: data.message });
      }
    } catch (err) {
      console.error('Date verification error:', err);
      setDateVerification({ status: 'idle' });
    }
  };

  const handleUrlBlur = () => {
    if (formData.url) {
      verifyEventDate(formData.url, formData.date);
    }
  };

  const applyExtractedDate = () => {
    if (dateVerification.extractedDate) {
      setFormData(prev => ({
        ...prev,
        date: dateVerification.extractedDate || prev.date,
        time: dateVerification.extractedTime || prev.time,
      }));
      setDateVerification({ status: 'idle' });
      toast({
        title: "Date updated",
        description: "Applied the date from the event page.",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.date || !formData.time || !formData.organizer || !formData.description) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('events')
        .insert({
          title: formData.title.trim(),
          date: formData.date.trim(),
          time: formData.time.trim(),
          format: formData.format,
          type: formData.type,
          organizer: formData.organizer.trim(),
          description: formData.description.trim(),
          url: formData.url.trim() || '#',
          city: formData.city.trim(),
          audience: ['Founders'],
          stage: ['Pre-seed', 'Seed'],
          featured: false,
          is_approved: true,
        });

      if (error) throw error;

      toast({
        title: "Event submitted!",
        description: "Your event has been added to the list.",
      });

      setFormData({
        title: '', date: '', time: '', format: 'inperson', type: 'Event',
        organizer: '', description: '', url: '', city: 'Seattle',
      });
      setOpen(false);
    } catch (error: any) {
      console.error('Error submitting event:', error);
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5 text-xs bg-[hsl(var(--cta-blue))] text-[hsl(var(--cta-blue-foreground))] hover:bg-[hsl(var(--cta-blue)/.85)] shadow-md font-semibold">
          <Send className="h-3 w-3" />
          Submit Event
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Submit an Event</DialogTitle>
          <DialogDescription>
            Add a startup event to our community calendar.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="title">Event Title *</Label>
            <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="e.g., Seattle Startup Pitch Night" maxLength={200} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="date">Date *</Label>
              <Input id="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} placeholder="e.g., Jan 15" maxLength={50} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="time">Time *</Label>
              <Input id="time" value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} placeholder="e.g., 6:00 PM PST" maxLength={50} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="format">Format *</Label>
              <Select value={formData.format} onValueChange={(value) => setFormData({ ...formData, format: value })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="inperson">In-Person</SelectItem>
                  <SelectItem value="virtual">Virtual</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="type">Type *</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
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
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="organizer">Organizer *</Label>
              <Input id="organizer" value={formData.organizer} onChange={(e) => setFormData({ ...formData, organizer: e.target.value })} placeholder="e.g., Seattle Founders" maxLength={100} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="city">City</Label>
              <Input id="city" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} placeholder="Seattle" maxLength={100} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Description *</Label>
            <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Tell us about this event..." rows={3} maxLength={500} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="url">Event URL (optional)</Label>
            <Input id="url" type="url" value={formData.url} onChange={(e) => setFormData({ ...formData, url: e.target.value })} onBlur={handleUrlBlur} placeholder="https://..." maxLength={500} />
            {dateVerification.status === 'verifying' && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                <Loader2 className="h-3 w-3 animate-spin" />
                Verifying event date...
              </div>
            )}
            {dateVerification.status === 'verified' && dateVerification.extractedDate && (
              <div className="flex items-center justify-between gap-2 text-xs mt-1 p-2 bg-primary/10 border border-primary/20">
                <div className="flex items-center gap-2 text-primary">
                  <CheckCircle className="h-3 w-3" />
                  <span>Found: {dateVerification.extractedDate}{dateVerification.extractedTime ? ` at ${dateVerification.extractedTime}` : ''}</span>
                </div>
                <Button type="button" size="sm" variant="ghost" className="h-6 px-2 text-xs" onClick={applyExtractedDate}>
                  Use this date
                </Button>
              </div>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Submitting...</>
            ) : (
              <><Send className="h-4 w-4 mr-2" />Submit Event</>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
