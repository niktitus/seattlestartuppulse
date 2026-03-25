import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const PURPOSE_OPTIONS = ['SaaS', 'Marketplace', 'FinTech', 'HealthTech', 'EdTech', 'CleanTech', 'AI/ML', 'DevTools', 'Consumer', 'B2B', 'Hardware', 'Biotech', 'Other'];

interface SubmitCompanyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SubmitCompanyDialog({ open, onOpenChange }: SubmitCompanyDialogProps) {
  const [name, setName] = useState('');
  const [website, setWebsite] = useState('');
  const [purpose, setPurpose] = useState('SaaS');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!name.trim() || !website.trim()) {
      toast({ title: 'Missing fields', description: 'Name and website are required.', variant: 'destructive' });
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from('startup_directory').insert({
        name: name.trim().slice(0, 200),
        website: website.trim().slice(0, 500),
        purpose,
        description: description.trim().slice(0, 500) || null,
      });
      if (error) throw error;
      toast({ title: 'Company submitted!', description: 'It will appear after review.' });
      setName('');
      setWebsite('');
      setPurpose('SaaS');
      setDescription('');
      onOpenChange(false);
    } catch (err: any) {
      toast({ title: 'Submission failed', description: err.message, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Submit a Company</DialogTitle>
          <DialogDescription>Add a startup to the Seattle directory. Submissions are reviewed before publishing.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="text-sm">Company Name *</Label>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="Acme Inc." maxLength={200} />
          </div>
          <div>
            <Label className="text-sm">Website *</Label>
            <Input value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://acme.com" maxLength={500} />
          </div>
          <div>
            <Label className="text-sm">Purpose / Category</Label>
            <Select value={purpose} onValueChange={setPurpose}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {PURPOSE_OPTIONS.map(p => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm">Description (optional)</Label>
            <Textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="What does this company do?"
              className="h-20"
              maxLength={500}
            />
          </div>
          <Button onClick={handleSubmit} disabled={submitting || !name.trim() || !website.trim()} className="w-full">
            {submitting ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Submitting...</> : 'Submit Company'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
