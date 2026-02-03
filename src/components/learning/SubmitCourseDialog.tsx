import { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
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
import { SKILL_CATEGORIES, LEARNING_FORMATS, DIFFICULTY_LEVELS, TIME_TO_ROI_OPTIONS, PRICE_TYPES } from '@/types/learning';

export default function SubmitCourseDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [form, setForm] = useState({
    submitter_email: '',
    submitter_name: '',
    course_name: '',
    course_url: '',
    description: '',
    instructor_name: '',
    instructor_linkedin: '',
    skill_category: 'Product',
    format: 'Self-paced',
    difficulty: 'Intermediate',
    time_to_roi: 'Apply immediately',
    price_type: 'Paid',
    price_amount: '',
    time_commitment: '',
    has_certification: false,
  });

  const updateForm = (field: string, value: string | boolean) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from('learning_submissions').insert({
        submitter_email: form.submitter_email,
        submitter_name: form.submitter_name || null,
        course_name: form.course_name,
        course_url: form.course_url,
        description: form.description || null,
        instructor_name: form.instructor_name,
        instructor_linkedin: form.instructor_linkedin || null,
        skill_category: form.skill_category,
        format: form.format,
        difficulty: form.difficulty,
        time_to_roi: form.time_to_roi,
        price_type: form.price_type,
        price_amount: form.price_amount ? parseInt(form.price_amount) * 100 : null, // Convert to cents
        time_commitment: form.time_commitment || null,
        has_certification: form.has_certification,
      });

      if (error) throw error;

      toast({
        title: 'Course submitted!',
        description: 'Your suggestion will be reviewed and added within 24-48 hours.',
      });

      setOpen(false);
      setForm({
        submitter_email: '',
        submitter_name: '',
        course_name: '',
        course_url: '',
        description: '',
        instructor_name: '',
        instructor_linkedin: '',
        skill_category: 'Product',
        format: 'Self-paced',
        difficulty: 'Intermediate',
        time_to_roi: 'Apply immediately',
        price_type: 'Paid',
        price_amount: '',
        time_commitment: '',
        has_certification: false,
      });
    } catch (error) {
      console.error('Error submitting course:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit course. Please try again.',
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
          Submit a Course
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Suggest a Learning Resource</DialogTitle>
          <DialogDescription>
            Know a great course or program for founders? Submit it for review.
            We focus on advanced, high-ROI content—no basic intro courses.
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

          {/* Course Details */}
          <div className="space-y-4">
            <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Course Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="course_name">Course/Program Name *</Label>
                <Input
                  id="course_name"
                  required
                  value={form.course_name}
                  onChange={(e) => updateForm('course_name', e.target.value)}
                  placeholder="Fundraising Masterclass"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="course_url">Course URL *</Label>
                <Input
                  id="course_url"
                  type="url"
                  required
                  value={form.course_url}
                  onChange={(e) => updateForm('course_url', e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instructor_name">Instructor Name *</Label>
                <Input
                  id="instructor_name"
                  required
                  value={form.instructor_name}
                  onChange={(e) => updateForm('instructor_name', e.target.value)}
                  placeholder="John Smith"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instructor_linkedin">Instructor LinkedIn</Label>
                <Input
                  id="instructor_linkedin"
                  type="url"
                  value={form.instructor_linkedin}
                  onChange={(e) => updateForm('instructor_linkedin', e.target.value)}
                  placeholder="https://linkedin.com/in/..."
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => updateForm('description', e.target.value)}
                placeholder="What will students learn? Why is it valuable?"
                rows={3}
              />
            </div>
          </div>

          {/* Categorization */}
          <div className="space-y-4">
            <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Categorization</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="skill_category">Skill Category *</Label>
                <Select value={form.skill_category} onValueChange={(v) => updateForm('skill_category', v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SKILL_CATEGORIES.map(c => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="format">Format *</Label>
                <Select value={form.format} onValueChange={(v) => updateForm('format', v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LEARNING_FORMATS.map(f => (
                      <SelectItem key={f} value={f}>{f}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty Level *</Label>
                <Select value={form.difficulty} onValueChange={(v) => updateForm('difficulty', v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DIFFICULTY_LEVELS.map(d => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="time_to_roi">Time to ROI *</Label>
                <Select value={form.time_to_roi} onValueChange={(v) => updateForm('time_to_roi', v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_TO_ROI_OPTIONS.map(r => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="time_commitment">Time Commitment</Label>
                <Input
                  id="time_commitment"
                  value={form.time_commitment}
                  onChange={(e) => updateForm('time_commitment', e.target.value)}
                  placeholder="e.g., 4 weeks, 5 hrs/week"
                />
              </div>
              <div className="space-y-2 flex items-end pb-2">
                <div className="flex items-center gap-2">
                  <Switch
                    id="has_certification"
                    checked={form.has_certification}
                    onCheckedChange={(checked) => updateForm('has_certification', checked)}
                  />
                  <Label htmlFor="has_certification" className="cursor-pointer">
                    Offers certification
                  </Label>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-4">
            <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Pricing</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price_type">Price Type</Label>
                <Select value={form.price_type} onValueChange={(v) => updateForm('price_type', v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRICE_TYPES.map(p => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {form.price_type === 'Paid' && (
                <div className="space-y-2">
                  <Label htmlFor="price_amount">Price ($)</Label>
                  <Input
                    id="price_amount"
                    type="number"
                    value={form.price_amount}
                    onChange={(e) => updateForm('price_amount', e.target.value)}
                    placeholder="499"
                  />
                </div>
              )}
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
