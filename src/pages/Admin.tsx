import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Loader2, Lock, Calendar, MapPin, Globe, Users, UserPlus, Download, Pencil, Save, X, Signal, ChevronDown, ChevronUp, GraduationCap, Briefcase, Newspaper, Clock, Plus, Link2, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useEvents, Event } from '@/hooks/useEvents';
import { useLearningResources } from '@/hooks/useLearningResources';
import { useJobs } from '@/hooks/useJobs';
import { supabase } from '@/integrations/supabase/client';
import type { LearningResource } from '@/types/learning';
import type { StartupJob } from '@/types/jobs';
import { SKILL_CATEGORIES, LEARNING_FORMATS, DIFFICULTY_LEVELS, TIME_TO_ROI_OPTIONS, PRICE_TYPES } from '@/types/learning';
import { FUNDING_STAGES, DEPARTMENTS, WORK_MODELS, SALARY_TYPES } from '@/types/jobs';

interface EarlyAccessSignup {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  linkedin: string | null;
  created_at: string;
}

interface NewsItem {
  id: string;
  title: string;
  source: string;
  date: string;
  summary: string;
  url: string;
  category: string;
  is_approved: boolean;
  created_at: string;
}

interface DeadlineItem {
  id: string;
  title: string;
  due_date: string;
  days_left: number;
  type: string;
  description: string;
  url: string;
  is_approved: boolean;
  created_at: string;
}

interface ResourceLinkItem {
  id: string;
  name: string;
  url: string;
  description: string;
  category: string;
  sort_order: number;
  is_approved: boolean;
  created_at: string;
}

const ADMIN_TOKEN_KEY = 'admin_session_token';

const AUDIENCE_OPTIONS = ['Any', 'Founders', 'Investors', 'Operators', 'Technical', 'Students'];
const STAGE_OPTIONS = ['Pre-seed', 'Seed', 'Series A+'];
const FORMAT_OPTIONS = ['inperson', 'virtual', 'hybrid'];
const HOST_TYPE_OPTIONS = ['VC/Investor', 'Accelerator', 'Community/Independent', 'Corporate', 'University', 'Government'];
const SIZE_OPTIONS = ['10-25', '25-50', '50-100', '100+'];
const NEWS_CATEGORIES = ['Funding', 'Ecosystem', 'Policy', 'Talent', 'Exits', 'Product'];
const DEADLINE_TYPES = ['Accelerator', 'Competition', 'Grant', 'Fellowship', 'Award'];
const RESOURCE_CATEGORIES = ['Communities', 'Diagnostic Tools', 'Startup Resources', 'Operational'];

// ── Generic admin API helper ──
async function adminApi(table: string, id: string | null, action: 'update' | 'delete' | 'create', updates?: Record<string, any>) {
  const token = sessionStorage.getItem(ADMIN_TOKEN_KEY);
  if (!token) throw new Error('Session expired');

  const body: any = { table, id, action };
  if (action === 'create' || action === 'update') body.updates = updates;

  const { data, error } = await supabase.functions.invoke('admin-update-resource', {
    body,
    headers: { Authorization: `Bearer ${token}` },
  });

  if (error) throw error;
  if (!data.success) {
    if (data.error?.includes('token') || data.error?.includes('expired')) {
      sessionStorage.removeItem(ADMIN_TOKEN_KEY);
      throw new Error('Session expired. Please log in again.');
    }
    throw new Error(data.error || 'Operation failed');
  }
  return data;
}

// ── Admin fetch all (bypasses RLS) ──
async function adminFetchAll(table: string): Promise<any[]> {
  const token = sessionStorage.getItem(ADMIN_TOKEN_KEY);
  if (!token) throw new Error('Session expired');

  const { data, error } = await supabase.functions.invoke(`admin-list-all?table=${table}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (error) throw error;
  if (!data.success) throw new Error(data.error || 'Fetch failed');
  return data.data || [];
}

// ── Event Edit Form ──
function EventEditForm({ event, onSave, onCancel, saving }: {
  event: Event; onSave: (u: Partial<Event>) => void; onCancel: () => void; saving: boolean;
}) {
  const [form, setForm] = useState({
    title: event.title, date: event.date, time: event.time, format: event.format,
    type: event.type, organizer: event.organizer, description: event.description, url: event.url,
    audience: event.audience || [], stage: event.stage || [],
    featured: event.featured || false, is_high_signal: event.is_high_signal || false,
    is_approved: event.is_approved !== false, city: event.city || 'Seattle',
    host_type: event.host_type || 'Community/Independent', cost: event.cost || 'Free',
    expected_size: event.expected_size || '25-50', outcome_framing: event.outcome_framing || '',
  });

  const toggleArrayItem = (field: 'audience' | 'stage', item: string) => {
    setForm(prev => ({ ...prev, [field]: prev[field].includes(item) ? prev[field].filter(i => i !== item) : [...prev[field], item] }));
  };

  return (
    <div className="space-y-4 p-4 bg-muted/30 rounded-lg border border-border">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div><Label className="text-xs font-medium text-muted-foreground">Title</Label><Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} /></div>
        <div><Label className="text-xs font-medium text-muted-foreground">Organizer</Label><Input value={form.organizer} onChange={e => setForm(p => ({ ...p, organizer: e.target.value }))} /></div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div><Label className="text-xs font-medium text-muted-foreground">Date</Label><Input value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} /></div>
        <div><Label className="text-xs font-medium text-muted-foreground">Time</Label><Input value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))} /></div>
        <div><Label className="text-xs font-medium text-muted-foreground">Format</Label>
          <Select value={form.format} onValueChange={v => setForm(p => ({ ...p, format: v }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{FORMAT_OPTIONS.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent></Select>
        </div>
      </div>

      {/* Signal & Audience */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-3">
        <h4 className="text-sm font-semibold text-primary flex items-center gap-2"><Signal className="h-4 w-4" />Signal & Audience</h4>
        <div>
          <Label className="text-xs font-medium text-muted-foreground">Outcome Framing <span className="text-primary">(150 chars)</span></Label>
          <Textarea value={form.outcome_framing} onChange={e => setForm(p => ({ ...p, outcome_framing: e.target.value.slice(0, 150) }))} placeholder="Meet [roles], leave with [deliverable]" className="h-16" />
          <p className="text-xs text-muted-foreground mt-1">{form.outcome_framing.length}/150</p>
        </div>
        <div><Label className="text-xs font-medium text-muted-foreground">Audience</Label>
          <div className="flex flex-wrap gap-2 mt-1">{AUDIENCE_OPTIONS.map(a => <Badge key={a} variant={form.audience.includes(a) ? 'default' : 'outline'} className="cursor-pointer select-none" onClick={() => toggleArrayItem('audience', a)}>{a}</Badge>)}</div>
        </div>
        <div><Label className="text-xs font-medium text-muted-foreground">Stage</Label>
          <div className="flex flex-wrap gap-2 mt-1">{STAGE_OPTIONS.map(s => <Badge key={s} variant={form.stage.includes(s) ? 'default' : 'outline'} className="cursor-pointer select-none" onClick={() => toggleArrayItem('stage', s)}>{s}</Badge>)}</div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2"><Checkbox id="high-signal" checked={form.is_high_signal} onCheckedChange={c => setForm(p => ({ ...p, is_high_signal: !!c }))} /><Label htmlFor="high-signal" className="text-sm cursor-pointer">🔥 High Signal</Label></div>
          <div className="flex items-center gap-2"><Checkbox id="featured" checked={form.featured} onCheckedChange={c => setForm(p => ({ ...p, featured: !!c }))} /><Label htmlFor="featured" className="text-sm cursor-pointer">⭐ Featured</Label></div>
          <div className="flex items-center gap-2"><Checkbox id="approved" checked={form.is_approved} onCheckedChange={c => setForm(p => ({ ...p, is_approved: !!c }))} /><Label htmlFor="approved" className="text-sm cursor-pointer">✅ Approved</Label></div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div><Label className="text-xs font-medium text-muted-foreground">City</Label><Input value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} /></div>
        <div><Label className="text-xs font-medium text-muted-foreground">Host Type</Label>
          <Select value={form.host_type} onValueChange={v => setForm(p => ({ ...p, host_type: v }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{HOST_TYPE_OPTIONS.map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}</SelectContent></Select></div>
        <div><Label className="text-xs font-medium text-muted-foreground">Cost</Label><Input value={form.cost} onChange={e => setForm(p => ({ ...p, cost: e.target.value }))} /></div>
        <div><Label className="text-xs font-medium text-muted-foreground">Expected Size</Label>
          <Select value={form.expected_size} onValueChange={v => setForm(p => ({ ...p, expected_size: v }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{SIZE_OPTIONS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></div>
      </div>

      <div><Label className="text-xs font-medium text-muted-foreground">Description</Label><Textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className="h-20" /></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div><Label className="text-xs font-medium text-muted-foreground">URL</Label><Input value={form.url} onChange={e => setForm(p => ({ ...p, url: e.target.value }))} /></div>
        <div><Label className="text-xs font-medium text-muted-foreground">Event Type</Label><Input value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} /></div>
      </div>

      <div className="flex items-center gap-2 pt-2">
        <Button onClick={() => onSave(form)} disabled={saving} size="sm">{saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}Save</Button>
        <Button variant="ghost" size="sm" onClick={onCancel} disabled={saving}><X className="h-4 w-4 mr-2" />Cancel</Button>
      </div>
    </div>
  );
}

// ── News Edit Form ──
function NewsEditForm({ item, onSave, onCancel, saving }: {
  item: NewsItem; onSave: (u: Record<string, any>) => void; onCancel: () => void; saving: boolean;
}) {
  const [form, setForm] = useState({
    title: item.title, source: item.source, date: item.date,
    summary: item.summary, url: item.url, category: item.category,
    is_approved: item.is_approved,
  });

  return (
    <div className="space-y-4 p-4 bg-muted/30 rounded-lg border border-border">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div><Label className="text-xs font-medium text-muted-foreground">Title</Label><Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} /></div>
        <div><Label className="text-xs font-medium text-muted-foreground">Source</Label><Input value={form.source} onChange={e => setForm(p => ({ ...p, source: e.target.value }))} /></div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div><Label className="text-xs font-medium text-muted-foreground">Date</Label><Input value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} /></div>
        <div><Label className="text-xs font-medium text-muted-foreground">Category</Label>
          <Select value={form.category} onValueChange={v => setForm(p => ({ ...p, category: v }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{NEWS_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select>
        </div>
        <div><Label className="text-xs font-medium text-muted-foreground">URL</Label><Input value={form.url} onChange={e => setForm(p => ({ ...p, url: e.target.value }))} /></div>
      </div>
      <div><Label className="text-xs font-medium text-muted-foreground">Summary</Label><Textarea value={form.summary} onChange={e => setForm(p => ({ ...p, summary: e.target.value }))} className="h-16" /></div>
      <div className="flex items-center gap-2">
        <Checkbox id="news-approved" checked={form.is_approved} onCheckedChange={c => setForm(p => ({ ...p, is_approved: !!c }))} />
        <Label htmlFor="news-approved" className="text-sm cursor-pointer">✅ Approved</Label>
      </div>
      <div className="flex items-center gap-2 pt-2">
        <Button onClick={() => onSave(form)} disabled={saving} size="sm">{saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}Save</Button>
        <Button variant="ghost" size="sm" onClick={onCancel} disabled={saving}><X className="h-4 w-4 mr-2" />Cancel</Button>
      </div>
    </div>
  );
}

// ── Deadline Edit Form ──
function DeadlineEditForm({ item, onSave, onCancel, saving }: {
  item: DeadlineItem; onSave: (u: Record<string, any>) => void; onCancel: () => void; saving: boolean;
}) {
  const [form, setForm] = useState({
    title: item.title, due_date: item.due_date, days_left: item.days_left,
    type: item.type, description: item.description, url: item.url,
    is_approved: item.is_approved,
  });

  return (
    <div className="space-y-4 p-4 bg-muted/30 rounded-lg border border-border">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div><Label className="text-xs font-medium text-muted-foreground">Title</Label><Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} /></div>
        <div><Label className="text-xs font-medium text-muted-foreground">Type</Label>
          <Select value={form.type} onValueChange={v => setForm(p => ({ ...p, type: v }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{DEADLINE_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div><Label className="text-xs font-medium text-muted-foreground">Due Date</Label><Input value={form.due_date} onChange={e => setForm(p => ({ ...p, due_date: e.target.value }))} /></div>
        <div><Label className="text-xs font-medium text-muted-foreground">Days Left</Label><Input type="number" value={form.days_left} onChange={e => setForm(p => ({ ...p, days_left: Number(e.target.value) }))} /></div>
        <div><Label className="text-xs font-medium text-muted-foreground">URL</Label><Input value={form.url} onChange={e => setForm(p => ({ ...p, url: e.target.value }))} /></div>
      </div>
      <div><Label className="text-xs font-medium text-muted-foreground">Description</Label><Textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className="h-16" /></div>
      <div className="flex items-center gap-2">
        <Checkbox id="deadline-approved" checked={form.is_approved} onCheckedChange={c => setForm(p => ({ ...p, is_approved: !!c }))} />
        <Label htmlFor="deadline-approved" className="text-sm cursor-pointer">✅ Approved</Label>
      </div>
      <div className="flex items-center gap-2 pt-2">
        <Button onClick={() => onSave(form)} disabled={saving} size="sm">{saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}Save</Button>
        <Button variant="ghost" size="sm" onClick={onCancel} disabled={saving}><X className="h-4 w-4 mr-2" />Cancel</Button>
      </div>
    </div>
  );
}

// ── Learning Edit Form ──
function LearningEditForm({ resource, onSave, onCancel, saving }: {
  resource: LearningResource; onSave: (u: Record<string, any>) => void; onCancel: () => void; saving: boolean;
}) {
  const [form, setForm] = useState({
    course_name: resource.course_name, course_url: resource.course_url,
    description: resource.description || '', instructor_name: resource.instructor_name,
    instructor_linkedin: resource.instructor_linkedin || '',
    skill_category: resource.skill_category, format: resource.format,
    difficulty: resource.difficulty, time_to_roi: resource.time_to_roi,
    price_type: resource.price_type, price_amount: resource.price_amount || 0,
    time_commitment: resource.time_commitment || '',
    is_approved: resource.is_approved, is_founder_recommended: resource.is_founder_recommended,
    has_certification: resource.has_certification,
  });

  return (
    <div className="space-y-4 p-4 bg-muted/30 rounded-lg border border-border">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div><Label className="text-xs font-medium text-muted-foreground">Course Name</Label><Input value={form.course_name} onChange={e => setForm(p => ({ ...p, course_name: e.target.value }))} /></div>
        <div><Label className="text-xs font-medium text-muted-foreground">Instructor</Label><Input value={form.instructor_name} onChange={e => setForm(p => ({ ...p, instructor_name: e.target.value }))} /></div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div><Label className="text-xs font-medium text-muted-foreground">Category</Label>
          <Select value={form.skill_category} onValueChange={v => setForm(p => ({ ...p, skill_category: v as any }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{SKILL_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></div>
        <div><Label className="text-xs font-medium text-muted-foreground">Format</Label>
          <Select value={form.format} onValueChange={v => setForm(p => ({ ...p, format: v as any }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{LEARNING_FORMATS.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent></Select></div>
        <div><Label className="text-xs font-medium text-muted-foreground">Difficulty</Label>
          <Select value={form.difficulty} onValueChange={v => setForm(p => ({ ...p, difficulty: v as any }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{DIFFICULTY_LEVELS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent></Select></div>
        <div><Label className="text-xs font-medium text-muted-foreground">Time to ROI</Label>
          <Select value={form.time_to_roi} onValueChange={v => setForm(p => ({ ...p, time_to_roi: v as any }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{TIME_TO_ROI_OPTIONS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div><Label className="text-xs font-medium text-muted-foreground">Price Type</Label>
          <Select value={form.price_type} onValueChange={v => setForm(p => ({ ...p, price_type: v as any }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{PRICE_TYPES.map(pt => <SelectItem key={pt} value={pt}>{pt}</SelectItem>)}</SelectContent></Select></div>
        <div><Label className="text-xs font-medium text-muted-foreground">Time Commitment</Label><Input value={form.time_commitment} onChange={e => setForm(p => ({ ...p, time_commitment: e.target.value }))} /></div>
        <div><Label className="text-xs font-medium text-muted-foreground">Course URL</Label><Input value={form.course_url} onChange={e => setForm(p => ({ ...p, course_url: e.target.value }))} /></div>
      </div>
      <div><Label className="text-xs font-medium text-muted-foreground">Description</Label><Textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className="h-16" /></div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2"><Checkbox id="lr-approved" checked={form.is_approved} onCheckedChange={c => setForm(p => ({ ...p, is_approved: !!c }))} /><Label htmlFor="lr-approved" className="text-sm cursor-pointer">✅ Approved</Label></div>
        <div className="flex items-center gap-2"><Checkbox id="lr-rec" checked={form.is_founder_recommended} onCheckedChange={c => setForm(p => ({ ...p, is_founder_recommended: !!c }))} /><Label htmlFor="lr-rec" className="text-sm cursor-pointer">🌟 Founder Recommended</Label></div>
        <div className="flex items-center gap-2"><Checkbox id="lr-cert" checked={form.has_certification} onCheckedChange={c => setForm(p => ({ ...p, has_certification: !!c }))} /><Label htmlFor="lr-cert" className="text-sm cursor-pointer">📜 Certification</Label></div>
      </div>
      <div className="flex items-center gap-2 pt-2">
        <Button onClick={() => onSave(form)} disabled={saving} size="sm">{saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}Save</Button>
        <Button variant="ghost" size="sm" onClick={onCancel} disabled={saving}><X className="h-4 w-4 mr-2" />Cancel</Button>
      </div>
    </div>
  );
}

// ── Job Edit Form ──
function JobEditForm({ job, onSave, onCancel, saving }: {
  job: StartupJob; onSave: (u: Record<string, any>) => void; onCancel: () => void; saving: boolean;
}) {
  const [form, setForm] = useState({
    job_title: job.job_title, company_name: job.company_name,
    company_url: job.company_url || '', company_address: job.company_address || '',
    founder_name: job.founder_name || '', founder_linkedin: job.founder_linkedin || '',
    funding_stage: job.funding_stage, department: job.department,
    work_model: job.work_model, salary_type: job.salary_type,
    salary_min: job.salary_min || 0, salary_max: job.salary_max || 0,
    equity_min: job.equity_min || 0, equity_max: job.equity_max || 0,
    application_url: job.application_url, description: job.description || '',
    is_approved: job.is_approved, is_expired: job.is_expired,
  });

  return (
    <div className="space-y-4 p-4 bg-muted/30 rounded-lg border border-border">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div><Label className="text-xs font-medium text-muted-foreground">Job Title</Label><Input value={form.job_title} onChange={e => setForm(p => ({ ...p, job_title: e.target.value }))} /></div>
        <div><Label className="text-xs font-medium text-muted-foreground">Company</Label><Input value={form.company_name} onChange={e => setForm(p => ({ ...p, company_name: e.target.value }))} /></div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div><Label className="text-xs font-medium text-muted-foreground">Funding Stage</Label>
          <Select value={form.funding_stage} onValueChange={v => setForm(p => ({ ...p, funding_stage: v as any }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{FUNDING_STAGES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></div>
        <div><Label className="text-xs font-medium text-muted-foreground">Department</Label>
          <Select value={form.department} onValueChange={v => setForm(p => ({ ...p, department: v as any }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{DEPARTMENTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent></Select></div>
        <div><Label className="text-xs font-medium text-muted-foreground">Work Model</Label>
          <Select value={form.work_model} onValueChange={v => setForm(p => ({ ...p, work_model: v as any }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{WORK_MODELS.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}</SelectContent></Select></div>
        <div><Label className="text-xs font-medium text-muted-foreground">Salary Type</Label>
          <Select value={form.salary_type} onValueChange={v => setForm(p => ({ ...p, salary_type: v as any }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{SALARY_TYPES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div><Label className="text-xs font-medium text-muted-foreground">Salary Min</Label><Input type="number" value={form.salary_min} onChange={e => setForm(p => ({ ...p, salary_min: Number(e.target.value) }))} /></div>
        <div><Label className="text-xs font-medium text-muted-foreground">Salary Max</Label><Input type="number" value={form.salary_max} onChange={e => setForm(p => ({ ...p, salary_max: Number(e.target.value) }))} /></div>
        <div><Label className="text-xs font-medium text-muted-foreground">Equity Min %</Label><Input type="number" step="0.1" value={form.equity_min} onChange={e => setForm(p => ({ ...p, equity_min: Number(e.target.value) }))} /></div>
        <div><Label className="text-xs font-medium text-muted-foreground">Equity Max %</Label><Input type="number" step="0.1" value={form.equity_max} onChange={e => setForm(p => ({ ...p, equity_max: Number(e.target.value) }))} /></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div><Label className="text-xs font-medium text-muted-foreground">Application URL</Label><Input value={form.application_url} onChange={e => setForm(p => ({ ...p, application_url: e.target.value }))} /></div>
        <div><Label className="text-xs font-medium text-muted-foreground">Founder Name</Label><Input value={form.founder_name} onChange={e => setForm(p => ({ ...p, founder_name: e.target.value }))} /></div>
      </div>
      <div><Label className="text-xs font-medium text-muted-foreground">Description</Label><Textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className="h-16" /></div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2"><Checkbox id="job-approved" checked={form.is_approved} onCheckedChange={c => setForm(p => ({ ...p, is_approved: !!c }))} /><Label htmlFor="job-approved" className="text-sm cursor-pointer">✅ Approved</Label></div>
        <div className="flex items-center gap-2"><Checkbox id="job-expired" checked={form.is_expired} onCheckedChange={c => setForm(p => ({ ...p, is_expired: !!c }))} /><Label htmlFor="job-expired" className="text-sm cursor-pointer">⏰ Expired</Label></div>
      </div>
      <div className="flex items-center gap-2 pt-2">
        <Button onClick={() => onSave(form)} disabled={saving} size="sm">{saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}Save</Button>
        <Button variant="ghost" size="sm" onClick={onCancel} disabled={saving}><X className="h-4 w-4 mr-2" />Cancel</Button>
      </div>
    </div>
  );
}

// ── Resource Link Edit Form ──
function ResourceLinkEditForm({ item, onSave, onCancel, saving }: {
  item: ResourceLinkItem; onSave: (u: Record<string, any>) => void; onCancel: () => void; saving: boolean;
}) {
  const [form, setForm] = useState({
    name: item.name, url: item.url, description: item.description,
    category: item.category, sort_order: item.sort_order, is_approved: item.is_approved,
  });

  return (
    <div className="space-y-4 p-4 bg-muted/30 rounded-lg border border-border">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div><Label className="text-xs font-medium text-muted-foreground">Name</Label><Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} /></div>
        <div><Label className="text-xs font-medium text-muted-foreground">URL</Label><Input value={form.url} onChange={e => setForm(p => ({ ...p, url: e.target.value }))} /></div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div><Label className="text-xs font-medium text-muted-foreground">Category</Label>
          <Select value={form.category} onValueChange={v => setForm(p => ({ ...p, category: v }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{RESOURCE_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select>
        </div>
        <div><Label className="text-xs font-medium text-muted-foreground">Sort Order</Label><Input type="number" value={form.sort_order} onChange={e => setForm(p => ({ ...p, sort_order: Number(e.target.value) }))} /></div>
      </div>
      <div><Label className="text-xs font-medium text-muted-foreground">Description</Label><Textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className="h-16" /></div>
      <div className="flex items-center gap-2">
        <Checkbox id="rl-approved" checked={form.is_approved} onCheckedChange={c => setForm(p => ({ ...p, is_approved: !!c }))} />
        <Label htmlFor="rl-approved" className="text-sm cursor-pointer">✅ Approved</Label>
      </div>
      <div className="flex items-center gap-2 pt-2">
        <Button onClick={() => onSave(form)} disabled={saving} size="sm">{saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}Save</Button>
        <Button variant="ghost" size="sm" onClick={onCancel} disabled={saving}><X className="h-4 w-4 mr-2" />Cancel</Button>
      </div>
    </div>
  );
}

// ── Main Admin Component ──
export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [creatingTable, setCreatingTable] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [signups, setSignups] = useState<EarlyAccessSignup[]>([]);
  const [loadingSignups, setLoadingSignups] = useState(false);

  // Admin-fetched data (bypasses RLS)
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [loadingAllEvents, setLoadingAllEvents] = useState(false);
  const [allNews, setAllNews] = useState<NewsItem[]>([]);
  const [loadingNews, setLoadingNews] = useState(false);
  const [allDeadlines, setAllDeadlines] = useState<DeadlineItem[]>([]);
  const [loadingDeadlines, setLoadingDeadlines] = useState(false);
  const [allResourceLinks, setAllResourceLinks] = useState<ResourceLinkItem[]>([]);
  const [loadingResourceLinks, setLoadingResourceLinks] = useState(false);

  // Event filters
  const [eventSearchQuery, setEventSearchQuery] = useState('');
  const [eventDateFrom, setEventDateFrom] = useState('');
  const [eventDateTo, setEventDateTo] = useState('');
  const [addedDateFrom, setAddedDateFrom] = useState('');
  const [addedDateTo, setAddedDateTo] = useState('');

  const { data: learningResources = [], isLoading: loadingLearning, refetch: refetchLearning } = useLearningResources();
  const { data: jobs = [], isLoading: loadingJobs, refetch: refetchJobs } = useJobs();
  const { toast } = useToast();
  const navigate = useNavigate();

  // ── Fetch all events/news/deadlines via admin edge function ──
  const fetchAllEvents = async () => {
    setLoadingAllEvents(true);
    try {
      const data = await adminFetchAll('events');
      setAllEvents(data as Event[]);
    } catch (err: any) {
      console.error('Error fetching all events:', err);
      if (err.message?.includes('expired')) setIsAuthenticated(false);
    } finally { setLoadingAllEvents(false); }
  };

  const fetchAllNews = async () => {
    setLoadingNews(true);
    try {
      const data = await adminFetchAll('news');
      setAllNews(data as NewsItem[]);
    } catch (err: any) {
      console.error('Error fetching news:', err);
    } finally { setLoadingNews(false); }
  };

  const fetchAllDeadlines = async () => {
    setLoadingDeadlines(true);
    try {
      const data = await adminFetchAll('deadlines');
      setAllDeadlines(data as DeadlineItem[]);
    } catch (err: any) {
      console.error('Error fetching deadlines:', err);
    } finally { setLoadingDeadlines(false); }
  };

  const fetchAllResourceLinks = async () => {
    setLoadingResourceLinks(true);
    try {
      const data = await adminFetchAll('resource_links');
      setAllResourceLinks(data as ResourceLinkItem[]);
    } catch (err: any) {
      console.error('Error fetching resource links:', err);
    } finally { setLoadingResourceLinks(false); }
  };

  // ── Auth ──
  useEffect(() => {
    const token = sessionStorage.getItem(ADMIN_TOKEN_KEY);
    if (token) verifyExistingToken(token);
  }, []);

  const verifyExistingToken = async (token: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-signups', { headers: { Authorization: `Bearer ${token}` } });
      if (!error && data.success) { setIsAuthenticated(true); setSignups(data.signups || []); }
      else sessionStorage.removeItem(ADMIN_TOKEN_KEY);
    } catch { sessionStorage.removeItem(ADMIN_TOKEN_KEY); }
  };

  const fetchSignups = async () => {
    const token = sessionStorage.getItem(ADMIN_TOKEN_KEY);
    if (!token) return;
    setLoadingSignups(true);
    try {
      const { data, error } = await supabase.functions.invoke('admin-signups', { headers: { Authorization: `Bearer ${token}` } });
      if (error) throw error;
      if (!data.success) throw new Error(data.error);
      setSignups(data.signups || []);
    } catch (err) {
      console.error('Error fetching signups:', err);
      if (err instanceof Error && err.message.includes('token')) { sessionStorage.removeItem(ADMIN_TOKEN_KEY); setIsAuthenticated(false); }
    } finally { setLoadingSignups(false); }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchSignups();
      fetchAllEvents();
      fetchAllNews();
      fetchAllDeadlines();
      fetchAllResourceLinks();
    }
  }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setIsVerifying(true);
    try {
      const { data, error } = await supabase.functions.invoke('verify-admin', { body: { password } });
      if (error) throw error;
      if (data.success && data.token) { sessionStorage.setItem(ADMIN_TOKEN_KEY, data.token); setIsAuthenticated(true); setPassword(''); toast({ title: "Welcome, Admin" }); }
      else throw new Error(data.error || 'Auth failed');
    } catch (err: any) { toast({ title: "Access Denied", description: err.message, variant: "destructive" }); }
    finally { setIsVerifying(false); }
  };

  const handleLogout = () => { sessionStorage.removeItem(ADMIN_TOKEN_KEY); setIsAuthenticated(false); setSignups([]); };

  // ── Generic Save/Delete handlers ──
  const handleSave = async (table: string, id: string, updates: Record<string, any>, refetch: () => void) => {
    setSavingId(id);
    try {
      await adminApi(table, id, 'update', updates);
      toast({ title: "Updated", description: "Changes saved." });
      setEditingId(null);
      refetch();
    } catch (err: any) {
      if (err.message.includes('expired')) setIsAuthenticated(false);
      toast({ title: "Update Failed", description: err.message, variant: "destructive" });
    } finally { setSavingId(null); }
  };

  const handleDelete = async (table: string, id: string, label: string, refetch: () => void) => {
    if (!confirm(`Delete "${label}"?`)) return;
    setDeletingId(id);
    try {
      await adminApi(table, id, 'delete');
      toast({ title: "Deleted", description: `"${label}" removed.` });
      refetch();
    } catch (err: any) {
      if (err.message.includes('expired')) setIsAuthenticated(false);
      toast({ title: "Delete Failed", description: err.message, variant: "destructive" });
    } finally { setDeletingId(null); }
  };

  const handleCreate = async (table: string, data: Record<string, any>, refetch: () => void) => {
    setIsCreating(true);
    try {
      await adminApi(table, null, 'create', data);
      toast({ title: "Created", description: "New item added." });
      setCreatingTable(null);
      refetch();
    } catch (err: any) {
      if (err.message.includes('expired')) setIsAuthenticated(false);
      toast({ title: "Create Failed", description: err.message, variant: "destructive" });
    } finally { setIsCreating(false); }
  };

  const exportSignupsCSV = () => {
    const headers = ['First Name', 'Last Name', 'Email', 'LinkedIn', 'Signed Up'];
    const rows = signups.map(s => [s.first_name, s.last_name, s.email, s.linkedin || '', new Date(s.created_at).toLocaleDateString()]);
    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `signups-${new Date().toISOString().split('T')[0]}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const formatIcon: Record<string, any> = { virtual: Globe, inperson: MapPin, hybrid: Users };

  // ── Login screen ──
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4"><Lock className="h-6 w-6 text-primary" /></div>
            <CardTitle>Admin Access</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input type="password" placeholder="Enter admin password" value={password} onChange={e => setPassword(e.target.value)} autoFocus autoComplete="current-password" />
              <Button type="submit" className="w-full" disabled={isVerifying || !password}>{isVerifying ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Verifying...</> : 'Access Admin Panel'}</Button>
              <Button type="button" variant="ghost" className="w-full" onClick={() => navigate('/')}><ArrowLeft className="h-4 w-4 mr-2" />Back to Home</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ── Admin Panel ──
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/')}><ArrowLeft className="h-4 w-4 mr-2" />Back</Button>
            <h1 className="text-2xl font-bold">Admin Panel</h1>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>Logout</Button>
        </div>

        <Tabs defaultValue="events" className="w-full">
          <TabsList className="mb-6 flex-wrap h-auto gap-1">
            <TabsTrigger value="events" className="gap-2"><Calendar className="h-4 w-4" />Events<Badge variant="secondary" className="ml-1">{allEvents.length}</Badge></TabsTrigger>
            <TabsTrigger value="news" className="gap-2"><Newspaper className="h-4 w-4" />News<Badge variant="secondary" className="ml-1">{allNews.length}</Badge></TabsTrigger>
            <TabsTrigger value="deadlines" className="gap-2"><Clock className="h-4 w-4" />Deadlines<Badge variant="secondary" className="ml-1">{allDeadlines.length}</Badge></TabsTrigger>
            <TabsTrigger value="learning" className="gap-2"><GraduationCap className="h-4 w-4" />Learning<Badge variant="secondary" className="ml-1">{learningResources.length}</Badge></TabsTrigger>
            <TabsTrigger value="jobs" className="gap-2"><Briefcase className="h-4 w-4" />Jobs<Badge variant="secondary" className="ml-1">{jobs.length}</Badge></TabsTrigger>
            <TabsTrigger value="resources" className="gap-2"><Link2 className="h-4 w-4" />Resources<Badge variant="secondary" className="ml-1">{allResourceLinks.length}</Badge></TabsTrigger>
            <TabsTrigger value="signups" className="gap-2"><UserPlus className="h-4 w-4" />Early Access<Badge variant="secondary" className="ml-1">{signups.length}</Badge></TabsTrigger>
          </TabsList>

          {/* ── Events Tab ── */}
          <TabsContent value="events">
            <div className="flex justify-end mb-3">
              <Button size="sm" onClick={() => setCreatingTable(creatingTable === 'events' ? null : 'events')}><Plus className="h-4 w-4 mr-1" />Add Event</Button>
            </div>
            {creatingTable === 'events' && (
              <Card className="mb-3"><CardContent className="p-4">
                <EventEditForm
                  event={{ id: '', title: '', date: '', time: '', format: 'inperson', type: 'Event', organizer: '', description: '', url: '', audience: ['Founders'], stage: ['Pre-seed', 'Seed'], featured: false, is_approved: true, is_high_signal: false, city: 'Seattle', host_type: 'Community/Independent', cost: 'Free', expected_size: '25-50', outcome_framing: '', created_at: '' } as Event}
                  onSave={u => handleCreate('events', u, fetchAllEvents)}
                  onCancel={() => setCreatingTable(null)}
                  saving={isCreating}
                />
              </CardContent></Card>
            )}
            {loadingAllEvents ? <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div> :
            allEvents.length === 0 && !creatingTable ? <Card><CardContent className="py-12 text-center text-muted-foreground">No events found.</CardContent></Card> :
            <div className="space-y-3">{allEvents.map(event => {
              const FormatIcon = formatIcon[event.format] || Calendar;
              const isEditing = editingId === event.id;
              const isExpanded = expandedId === event.id;
              return (
                <Card key={event.id} className="group"><CardContent className="p-4">
                  {isEditing ? <EventEditForm event={event} onSave={u => handleSave('events', event.id, u, fetchAllEvents)} onCancel={() => setEditingId(null)} saving={savingId === event.id} /> : <>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <FormatIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                          <Badge variant="secondary" className="text-xs">{event.type}</Badge>
                          {event.featured && <Badge className="text-xs">⭐ Featured</Badge>}
                          {event.is_high_signal && <Badge variant="destructive" className="text-xs">🔥 High Signal</Badge>}
                          {!event.is_approved && <Badge variant="outline" className="text-xs text-destructive border-destructive">Unapproved</Badge>}
                        </div>
                        <h3 className="font-semibold truncate">{event.title}</h3>
                        <p className="text-sm text-muted-foreground truncate">{event.organizer} • {event.date} at {event.time}</p>
                        {event.outcome_framing && <p className="text-xs text-primary mt-1 italic">"{event.outcome_framing}"</p>}
                        {isExpanded && <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                          <p><strong>Audience:</strong> {event.audience?.join(', ') || 'Not set'}</p>
                          <p><strong>Stage:</strong> {event.stage?.join(', ') || 'Not set'}</p>
                          <p><strong>Host:</strong> {event.host_type} · {event.cost} · {event.expected_size}</p>
                          <p className="mt-1">{event.description}</p>
                        </div>}
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          variant={event.is_approved ? "ghost" : "outline"}
                          size="sm"
                          className={`h-8 text-xs ${event.is_approved ? 'text-green-600' : 'text-destructive border-destructive hover:bg-green-50'}`}
                          onClick={() => handleSave('events', event.id, { is_approved: !event.is_approved }, fetchAllEvents)}
                          disabled={savingId === event.id}
                        >
                          {savingId === event.id ? <Loader2 className="h-3 w-3 animate-spin" /> : event.is_approved ? '✅' : 'Approve'}
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setExpandedId(isExpanded ? null : event.id)}>{isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}</Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10" onClick={() => { setEditingId(event.id); setExpandedId(null); }}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete('events', event.id, event.title, fetchAllEvents)} disabled={deletingId === event.id}>{deletingId === event.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}</Button>
                      </div>
                    </div>
                  </>}
                </CardContent></Card>
              );
            })}</div>}
          </TabsContent>

          {/* ── News Tab ── */}
          <TabsContent value="news">
            <div className="flex justify-end gap-2 mb-3">
              <Button size="sm" variant="outline" onClick={async () => {
                const token = sessionStorage.getItem(ADMIN_TOKEN_KEY);
                if (!token) return;
                toast({ title: "Curating news...", description: "AI is searching for this week's Seattle startup news." });
                try {
                  const { data, error } = await supabase.functions.invoke('curate-news', { headers: { Authorization: `Bearer ${token}` } });
                  if (error) throw error;
                  if (!data.success) throw new Error(data.error);
                  toast({ title: "News curated!", description: `${data.count} articles added.` });
                  fetchAllNews();
                } catch (err: any) {
                  toast({ title: "Curation failed", description: err.message, variant: "destructive" });
                }
              }}>🤖 AI Curate</Button>
              <Button size="sm" onClick={() => setCreatingTable(creatingTable === 'news' ? null : 'news')}><Plus className="h-4 w-4 mr-1" />Add News</Button>
            </div>
            {creatingTable === 'news' && (
              <Card className="mb-3"><CardContent className="p-4">
                <NewsEditForm
                  item={{ id: '', title: '', source: '', date: '', summary: '', url: '', category: 'Ecosystem', is_approved: true, created_at: '' }}
                  onSave={u => handleCreate('news', u, fetchAllNews)}
                  onCancel={() => setCreatingTable(null)}
                  saving={isCreating}
                />
              </CardContent></Card>
            )}
            {loadingNews ? <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div> :
            allNews.length === 0 && !creatingTable ? <Card><CardContent className="py-12 text-center text-muted-foreground">No news items found.</CardContent></Card> :
            <div className="space-y-3">{allNews.map(item => {
              const isEditing = editingId === item.id;
              const isExpanded = expandedId === item.id;
              return (
                <Card key={item.id} className="group"><CardContent className="p-4">
                  {isEditing ? <NewsEditForm item={item} onSave={u => handleSave('news', item.id, u, fetchAllNews)} onCancel={() => setEditingId(null)} saving={savingId === item.id} /> : <>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <Badge variant="secondary" className="text-xs">{item.category}</Badge>
                          <span className="text-xs text-muted-foreground">{item.source} · {item.date}</span>
                          {!item.is_approved && <Badge variant="outline" className="text-xs text-destructive border-destructive">Unapproved</Badge>}
                        </div>
                        <h3 className="font-semibold truncate">{item.title}</h3>
                        {isExpanded && <p className="text-sm text-muted-foreground mt-1">{item.summary}</p>}
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setExpandedId(isExpanded ? null : item.id)}>{isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}</Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10" onClick={() => { setEditingId(item.id); setExpandedId(null); }}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete('news', item.id, item.title, fetchAllNews)} disabled={deletingId === item.id}>{deletingId === item.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}</Button>
                      </div>
                    </div>
                  </>}
                </CardContent></Card>
              );
            })}</div>}
          </TabsContent>

          {/* ── Deadlines Tab ── */}
          <TabsContent value="deadlines">
            <div className="flex justify-end mb-3">
              <Button size="sm" onClick={() => setCreatingTable(creatingTable === 'deadlines' ? null : 'deadlines')}><Plus className="h-4 w-4 mr-1" />Add Deadline</Button>
            </div>
            {creatingTable === 'deadlines' && (
              <Card className="mb-3"><CardContent className="p-4">
                <DeadlineEditForm
                  item={{ id: '', title: '', due_date: '', days_left: 30, type: 'Accelerator', description: '', url: '', is_approved: true, created_at: '' }}
                  onSave={u => handleCreate('deadlines', u, fetchAllDeadlines)}
                  onCancel={() => setCreatingTable(null)}
                  saving={isCreating}
                />
              </CardContent></Card>
            )}
            {loadingDeadlines ? <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div> :
            allDeadlines.length === 0 && !creatingTable ? <Card><CardContent className="py-12 text-center text-muted-foreground">No deadlines found.</CardContent></Card> :
            <div className="space-y-3">{allDeadlines.map(item => {
              const isEditing = editingId === item.id;
              const isExpanded = expandedId === item.id;
              return (
                <Card key={item.id} className="group"><CardContent className="p-4">
                  {isEditing ? <DeadlineEditForm item={item} onSave={u => handleSave('deadlines', item.id, u, fetchAllDeadlines)} onCancel={() => setEditingId(null)} saving={savingId === item.id} /> : <>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <Badge variant="outline" className="text-xs border-destructive/50 text-destructive">{item.type}</Badge>
                          {!item.is_approved && <Badge variant="outline" className="text-xs text-destructive border-destructive">Unapproved</Badge>}
                        </div>
                        <h3 className="font-semibold truncate">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">Due: {item.due_date} ({item.days_left} days)</p>
                        {isExpanded && <p className="text-sm text-muted-foreground mt-1">{item.description}</p>}
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setExpandedId(isExpanded ? null : item.id)}>{isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}</Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10" onClick={() => { setEditingId(item.id); setExpandedId(null); }}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete('deadlines', item.id, item.title, fetchAllDeadlines)} disabled={deletingId === item.id}>{deletingId === item.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}</Button>
                      </div>
                    </div>
                  </>}
                </CardContent></Card>
              );
            })}</div>}
          </TabsContent>

          {/* ── Learning Tab ── */}
          <TabsContent value="learning">
            <div className="flex justify-end mb-3">
              <Button size="sm" onClick={() => setCreatingTable(creatingTable === 'learning_resources' ? null : 'learning_resources')}><Plus className="h-4 w-4 mr-1" />Add Resource</Button>
            </div>
            {creatingTable === 'learning_resources' && (
              <Card className="mb-3"><CardContent className="p-4">
                <LearningEditForm
                  resource={{ id: '', course_name: '', course_url: '', description: '', instructor_name: '', instructor_linkedin: '', skill_category: 'Product', format: 'Self-paced', difficulty: 'Intermediate', time_to_roi: 'Apply immediately', price_type: 'Paid', price_amount: 0, time_commitment: '', is_approved: true, is_founder_recommended: false, has_certification: false, is_free: false, created_at: '', updated_at: '' } as LearningResource}
                  onSave={u => handleCreate('learning_resources', u, refetchLearning)}
                  onCancel={() => setCreatingTable(null)}
                  saving={isCreating}
                />
              </CardContent></Card>
            )}
            {loadingLearning ? <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div> :
            learningResources.length === 0 && !creatingTable ? <Card><CardContent className="py-12 text-center text-muted-foreground">No learning resources found.</CardContent></Card> :
            <div className="space-y-3">{learningResources.map(resource => {
              const isEditing = editingId === resource.id;
              const isExpanded = expandedId === resource.id;
              return (
                <Card key={resource.id} className="group"><CardContent className="p-4">
                  {isEditing ? <LearningEditForm resource={resource} onSave={u => handleSave('learning_resources', resource.id, u, refetchLearning)} onCancel={() => setEditingId(null)} saving={savingId === resource.id} /> : <>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <Badge variant="secondary" className="text-xs">{resource.skill_category}</Badge>
                          <Badge variant="outline" className="text-xs">{resource.format}</Badge>
                          <Badge variant="outline" className="text-xs">{resource.difficulty}</Badge>
                          {resource.is_founder_recommended && <Badge className="text-xs">🌟 Recommended</Badge>}
                          {!resource.is_approved && <Badge variant="outline" className="text-xs text-destructive border-destructive">Unapproved</Badge>}
                        </div>
                        <h3 className="font-semibold truncate">{resource.course_name}</h3>
                        <p className="text-sm text-muted-foreground truncate">{resource.instructor_name} • {resource.price_type}</p>
                        {isExpanded && <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                          <p><strong>Time to ROI:</strong> {resource.time_to_roi}</p>
                          <p><strong>Time Commitment:</strong> {resource.time_commitment || 'N/A'}</p>
                          <p><strong>Certification:</strong> {resource.has_certification ? 'Yes' : 'No'}</p>
                          {resource.description && <p className="mt-1">{resource.description}</p>}
                        </div>}
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setExpandedId(isExpanded ? null : resource.id)}>{isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}</Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10" onClick={() => { setEditingId(resource.id); setExpandedId(null); }}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete('learning_resources', resource.id, resource.course_name, refetchLearning)} disabled={deletingId === resource.id}>{deletingId === resource.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}</Button>
                      </div>
                    </div>
                  </>}
                </CardContent></Card>
              );
            })}</div>}
          </TabsContent>

          {/* ── Jobs Tab ── */}
          <TabsContent value="jobs">
            <div className="flex justify-end mb-3">
              <Button size="sm" onClick={() => setCreatingTable(creatingTable === 'startup_jobs' ? null : 'startup_jobs')}><Plus className="h-4 w-4 mr-1" />Add Job</Button>
            </div>
            {creatingTable === 'startup_jobs' && (
              <Card className="mb-3"><CardContent className="p-4">
                <JobEditForm
                  job={{ id: '', job_title: '', company_name: '', company_url: '', company_address: '', founder_name: '', founder_linkedin: '', funding_stage: 'Seed', department: 'Engineering', work_model: 'Hybrid', salary_type: 'TBD', salary_min: 0, salary_max: 0, equity_min: 0, equity_max: 0, application_url: '', description: '', is_approved: true, is_expired: false, expires_at: '', created_at: '', updated_at: '', renewal_count: 0 } as StartupJob}
                  onSave={u => handleCreate('startup_jobs', u, refetchJobs)}
                  onCancel={() => setCreatingTable(null)}
                  saving={isCreating}
                />
              </CardContent></Card>
            )}
            {loadingJobs ? <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div> :
            jobs.length === 0 && !creatingTable ? <Card><CardContent className="py-12 text-center text-muted-foreground">No jobs found.</CardContent></Card> :
            <div className="space-y-3">{jobs.map(job => {
              const isEditing = editingId === job.id;
              const isExpanded = expandedId === job.id;
              return (
                <Card key={job.id} className="group"><CardContent className="p-4">
                  {isEditing ? <JobEditForm job={job} onSave={u => handleSave('startup_jobs', job.id, u, refetchJobs)} onCancel={() => setEditingId(null)} saving={savingId === job.id} /> : <>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <Badge variant="secondary" className="text-xs">{job.department}</Badge>
                          <Badge variant="outline" className="text-xs">{job.funding_stage}</Badge>
                          <Badge variant="outline" className="text-xs">{job.work_model}</Badge>
                          {job.is_expired && <Badge variant="outline" className="text-xs text-destructive border-destructive">Expired</Badge>}
                          {!job.is_approved && <Badge variant="outline" className="text-xs text-destructive border-destructive">Unapproved</Badge>}
                        </div>
                        <h3 className="font-semibold truncate">{job.job_title}</h3>
                        <p className="text-sm text-muted-foreground truncate">{job.company_name} • {job.salary_type}</p>
                        {isExpanded && <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                          <p><strong>Salary:</strong> {job.salary_min && job.salary_max ? `$${(job.salary_min/1000).toFixed(0)}K - $${(job.salary_max/1000).toFixed(0)}K` : job.salary_type}</p>
                          <p><strong>Founder:</strong> {job.founder_name || 'N/A'}</p>
                          <p><strong>Expires:</strong> {new Date(job.expires_at).toLocaleDateString()}</p>
                          {job.description && <p className="mt-1">{job.description}</p>}
                        </div>}
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setExpandedId(isExpanded ? null : job.id)}>{isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}</Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10" onClick={() => { setEditingId(job.id); setExpandedId(null); }}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete('startup_jobs', job.id, job.job_title, refetchJobs)} disabled={deletingId === job.id}>{deletingId === job.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}</Button>
                      </div>
                    </div>
                  </>}
                </CardContent></Card>
              );
            })}</div>}
          </TabsContent>

          {/* ── Resources Tab ── */}
          <TabsContent value="resources">
            <div className="flex justify-end mb-3">
              <Button size="sm" onClick={() => setCreatingTable(creatingTable === 'resource_links' ? null : 'resource_links')}><Plus className="h-4 w-4 mr-1" />Add Link</Button>
            </div>
            {creatingTable === 'resource_links' && (
              <Card className="mb-3"><CardContent className="p-4">
                <ResourceLinkEditForm
                  item={{ id: '', name: '', url: '', description: '', category: 'Communities', sort_order: 0, is_approved: true, created_at: '' }}
                  onSave={u => handleCreate('resource_links', u, fetchAllResourceLinks)}
                  onCancel={() => setCreatingTable(null)}
                  saving={isCreating}
                />
              </CardContent></Card>
            )}
            {loadingResourceLinks ? <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div> :
            allResourceLinks.length === 0 && !creatingTable ? <Card><CardContent className="py-12 text-center text-muted-foreground">No resource links found.</CardContent></Card> :
            <div className="space-y-3">{allResourceLinks.map(item => {
              const isEditing = editingId === item.id;
              return (
                <Card key={item.id} className="group"><CardContent className="p-4">
                  {isEditing ? <ResourceLinkEditForm item={item} onSave={u => handleSave('resource_links', item.id, u, fetchAllResourceLinks)} onCancel={() => setEditingId(null)} saving={savingId === item.id} /> : <>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <Badge variant="secondary" className="text-xs">{item.category}</Badge>
                          <span className="text-xs text-muted-foreground">#{item.sort_order}</span>
                          {!item.is_approved && <Badge variant="outline" className="text-xs text-destructive border-destructive">Unapproved</Badge>}
                        </div>
                        <h3 className="font-semibold truncate">{item.name}</h3>
                        <p className="text-sm text-muted-foreground truncate">{item.description}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10" onClick={() => setEditingId(item.id)}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete('resource_links', item.id, item.name, fetchAllResourceLinks)} disabled={deletingId === item.id}>{deletingId === item.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}</Button>
                      </div>
                    </div>
                  </>}
                </CardContent></Card>
              );
            })}</div>}
          </TabsContent>

          {/* ── Early Access Tab ── */}
          <TabsContent value="signups">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">{signups.length} people signed up</p>
              {signups.length > 0 && <Button variant="outline" size="sm" onClick={exportSignupsCSV}><Download className="h-4 w-4 mr-2" />Export CSV</Button>}
            </div>
            {loadingSignups ? <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div> :
            signups.length === 0 ? <Card><CardContent className="py-12 text-center text-muted-foreground">No signups yet.</CardContent></Card> :
            <div className="space-y-2">{signups.map(signup => (
              <Card key={signup.id}><CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{signup.first_name} {signup.last_name}</p>
                    <p className="text-sm text-muted-foreground">{signup.email}</p>
                    {signup.linkedin && <a href={signup.linkedin} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">LinkedIn</a>}
                  </div>
                  <div className="text-right text-sm text-muted-foreground">{new Date(signup.created_at).toLocaleDateString()}</div>
                </div>
              </CardContent></Card>
            ))}</div>}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
