import { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { FUNDING_STAGES, DEPARTMENTS, WORK_MODELS, SALARY_TYPES } from '@/types/jobs';

export default function SubmitJobDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [form, setForm] = useState({
    submitter_email: '',
    submitter_name: '',
    job_title: '',
    company_name: '',
    company_url: '',
    company_address: '',
    founder_name: '',
    founder_linkedin: '',
    funding_stage: 'Seed',
    department: 'Engineering',
    work_model: 'Hybrid',
    application_url: '',
    salary_type: 'TBD',
    salary_min: '',
    salary_max: '',
    equity_min: '',
    equity_max: '',
    description: '',
  });

  const updateForm = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from('job_submissions').insert({
        submitter_email: form.submitter_email,
        submitter_name: form.submitter_name || null,
        job_title: form.job_title,
        company_name: form.company_name,
        company_url: form.company_url || null,
        company_address: form.company_address || null,
        founder_name: form.founder_name || null,
        founder_linkedin: form.founder_linkedin || null,
        funding_stage: form.funding_stage,
        department: form.department,
        work_model: form.work_model,
        application_url: form.application_url,
        salary_type: form.salary_type,
        salary_min: form.salary_min ? parseInt(form.salary_min) : null,
        salary_max: form.salary_max ? parseInt(form.salary_max) : null,
        equity_min: form.equity_min ? parseFloat(form.equity_min) : null,
        equity_max: form.equity_max ? parseFloat(form.equity_max) : null,
        description: form.description || null,
      });

      if (error) throw error;

      toast({
        title: 'Job submitted!',
        description: 'Your job posting will be reviewed and added within 24-48 hours.',
      });

      setOpen(false);
      setForm({
        submitter_email: '',
        submitter_name: '',
        job_title: '',
        company_name: '',
        company_url: '',
        company_address: '',
        founder_name: '',
        founder_linkedin: '',
        funding_stage: 'Seed',
        department: 'Engineering',
        work_model: 'Hybrid',
        application_url: '',
        salary_type: 'TBD',
        salary_min: '',
        salary_max: '',
        equity_min: '',
        equity_max: '',
        description: '',
      });
    } catch (error) {
      console.error('Error submitting job:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit job. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-1.5" />
          Post a Job
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Submit a Job Posting</DialogTitle>
          <DialogDescription>
            Submit a job at your Seattle-area startup. All submissions are reviewed before publishing.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Your Info */}
          <div className="space-y-4">
            <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Your Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="submitter_email">Your Email *</Label>
                <Input
                  id="submitter_email"
                  type="email"
                  required
                  value={form.submitter_email}
                  onChange={(e) => updateForm('submitter_email', e.target.value)}
                  placeholder="you@company.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="submitter_name">Your Name</Label>
                <Input
                  id="submitter_name"
                  value={form.submitter_name}
                  onChange={(e) => updateForm('submitter_name', e.target.value)}
                  placeholder="Jane Doe"
                />
              </div>
            </div>
          </div>

          {/* Job Details */}
          <div className="space-y-4">
            <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Job Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="job_title">Job Title *</Label>
                <Input
                  id="job_title"
                  required
                  value={form.job_title}
                  onChange={(e) => updateForm('job_title', e.target.value)}
                  placeholder="Senior Software Engineer"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="application_url">Application URL *</Label>
                <Input
                  id="application_url"
                  type="url"
                  required
                  value={form.application_url}
                  onChange={(e) => updateForm('application_url', e.target.value)}
                  placeholder="https://company.com/careers/..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department *</Label>
                <Select value={form.department} onValueChange={(v) => updateForm('department', v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DEPARTMENTS.map(d => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="work_model">Work Model *</Label>
                <Select value={form.work_model} onValueChange={(v) => updateForm('work_model', v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {WORK_MODELS.map(m => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Job Description</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => updateForm('description', e.target.value)}
                placeholder="Brief description of the role..."
                rows={3}
              />
            </div>
          </div>

          {/* Company Details */}
          <div className="space-y-4">
            <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Company Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company_name">Company Name *</Label>
                <Input
                  id="company_name"
                  required
                  value={form.company_name}
                  onChange={(e) => updateForm('company_name', e.target.value)}
                  placeholder="Acme Inc."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company_url">Company Website</Label>
                <Input
                  id="company_url"
                  type="url"
                  value={form.company_url}
                  onChange={(e) => updateForm('company_url', e.target.value)}
                  placeholder="https://company.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="funding_stage">Funding Stage *</Label>
                <Select value={form.funding_stage} onValueChange={(v) => updateForm('funding_stage', v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FUNDING_STAGES.map(s => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="company_address">Company Location</Label>
                <Input
                  id="company_address"
                  value={form.company_address}
                  onChange={(e) => updateForm('company_address', e.target.value)}
                  placeholder="Seattle, WA"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="founder_name">Founder/CEO Name</Label>
                <Input
                  id="founder_name"
                  value={form.founder_name}
                  onChange={(e) => updateForm('founder_name', e.target.value)}
                  placeholder="John Smith"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="founder_linkedin">Founder LinkedIn</Label>
                <Input
                  id="founder_linkedin"
                  type="url"
                  value={form.founder_linkedin}
                  onChange={(e) => updateForm('founder_linkedin', e.target.value)}
                  placeholder="https://linkedin.com/in/..."
                />
              </div>
            </div>
          </div>

          {/* Compensation */}
          <div className="space-y-4">
            <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Compensation</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="salary_type">Salary Type</Label>
                <Select value={form.salary_type} onValueChange={(v) => updateForm('salary_type', v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SALARY_TYPES.map(t => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Salary Range (if applicable)</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Min ($)"
                    value={form.salary_min}
                    onChange={(e) => updateForm('salary_min', e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Max ($)"
                    value={form.salary_max}
                    onChange={(e) => updateForm('salary_max', e.target.value)}
                  />
                </div>
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Equity Range (%)</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Min %"
                    value={form.equity_min}
                    onChange={(e) => updateForm('equity_min', e.target.value)}
                  />
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Max %"
                    value={form.equity_max}
                    onChange={(e) => updateForm('equity_max', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />}
              Submit for Review
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
