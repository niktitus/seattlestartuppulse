import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Loader2, Lock, Calendar, MapPin, Globe, Users, UserPlus, Download, Pencil, Save, X, Signal, ChevronDown, ChevronUp } from 'lucide-react';
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
import { supabase } from '@/integrations/supabase/client';

interface EarlyAccessSignup {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  linkedin: string | null;
  created_at: string;
}

const ADMIN_TOKEN_KEY = 'admin_session_token';

const AUDIENCE_OPTIONS = ['Founders', 'Investors', 'Operators', 'Developers', 'Designers', 'Students'];
const STAGE_OPTIONS = ['Pre-seed', 'Seed', 'Series A+'];
const FORMAT_OPTIONS = ['inperson', 'virtual', 'hybrid'];
const HOST_TYPE_OPTIONS = ['VC/Investor', 'Accelerator', 'Community/Independent', 'Corporate', 'University', 'Government'];
const SIZE_OPTIONS = ['< 25', '25-50', '50-100', '100-250', '250+'];

function EventEditForm({ event, onSave, onCancel, saving }: {
  event: Event;
  onSave: (updates: Partial<Event>) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState({
    title: event.title,
    date: event.date,
    time: event.time,
    format: event.format,
    type: event.type,
    organizer: event.organizer,
    description: event.description,
    url: event.url,
    audience: event.audience || [],
    stage: event.stage || [],
    featured: event.featured || false,
    is_high_signal: event.is_high_signal || false,
    is_approved: event.is_approved !== false,
    city: event.city || 'Seattle',
    host_type: event.host_type || 'Community/Independent',
    cost: event.cost || 'Free',
    expected_size: event.expected_size || '25-50',
    outcome_framing: event.outcome_framing || '',
  });

  const toggleArrayItem = (field: 'audience' | 'stage', item: string) => {
    setForm(prev => ({
      ...prev,
      [field]: prev[field].includes(item)
        ? prev[field].filter(i => i !== item)
        : [...prev[field], item],
    }));
  };

  return (
    <div className="space-y-4 p-4 bg-muted/30 rounded-lg border border-border">
      {/* Title & Organizer */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <Label className="text-xs font-medium text-muted-foreground">Title</Label>
          <Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
        </div>
        <div>
          <Label className="text-xs font-medium text-muted-foreground">Organizer</Label>
          <Input value={form.organizer} onChange={e => setForm(p => ({ ...p, organizer: e.target.value }))} />
        </div>
      </div>

      {/* Date, Time, Format */}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <Label className="text-xs font-medium text-muted-foreground">Date</Label>
          <Input value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />
        </div>
        <div>
          <Label className="text-xs font-medium text-muted-foreground">Time</Label>
          <Input value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))} />
        </div>
        <div>
          <Label className="text-xs font-medium text-muted-foreground">Format</Label>
          <Select value={form.format} onValueChange={v => setForm(p => ({ ...p, format: v }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {FORMAT_OPTIONS.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Signal & Audience — highlighted section */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-3">
        <h4 className="text-sm font-semibold text-primary flex items-center gap-2">
          <Signal className="h-4 w-4" />
          Signal & Audience (Key Curation Fields)
        </h4>

        {/* Outcome Framing */}
        <div>
          <Label className="text-xs font-medium text-muted-foreground">
            Outcome Framing <span className="text-primary">(150 chars — "Meet [roles], leave with [deliverable]")</span>
          </Label>
          <Textarea
            value={form.outcome_framing}
            onChange={e => setForm(p => ({ ...p, outcome_framing: e.target.value.slice(0, 150) }))}
            placeholder="Meet [specific roles/titles], leave with [tangible deliverable]"
            className="h-16"
          />
          <p className="text-xs text-muted-foreground mt-1">{form.outcome_framing.length}/150</p>
        </div>

        {/* Audience tags */}
        <div>
          <Label className="text-xs font-medium text-muted-foreground">Audience</Label>
          <div className="flex flex-wrap gap-2 mt-1">
            {AUDIENCE_OPTIONS.map(a => (
              <Badge
                key={a}
                variant={form.audience.includes(a) ? 'default' : 'outline'}
                className="cursor-pointer select-none"
                onClick={() => toggleArrayItem('audience', a)}
              >
                {a}
              </Badge>
            ))}
          </div>
        </div>

        {/* Stage tags */}
        <div>
          <Label className="text-xs font-medium text-muted-foreground">Stage</Label>
          <div className="flex flex-wrap gap-2 mt-1">
            {STAGE_OPTIONS.map(s => (
              <Badge
                key={s}
                variant={form.stage.includes(s) ? 'default' : 'outline'}
                className="cursor-pointer select-none"
                onClick={() => toggleArrayItem('stage', s)}
              >
                {s}
              </Badge>
            ))}
          </div>
        </div>

        {/* Flags */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Checkbox
              id="high-signal"
              checked={form.is_high_signal}
              onCheckedChange={c => setForm(p => ({ ...p, is_high_signal: !!c }))}
            />
            <Label htmlFor="high-signal" className="text-sm cursor-pointer">🔥 High Signal</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="featured"
              checked={form.featured}
              onCheckedChange={c => setForm(p => ({ ...p, featured: !!c }))}
            />
            <Label htmlFor="featured" className="text-sm cursor-pointer">⭐ Featured</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="approved"
              checked={form.is_approved}
              onCheckedChange={c => setForm(p => ({ ...p, is_approved: !!c }))}
            />
            <Label htmlFor="approved" className="text-sm cursor-pointer">✅ Approved</Label>
          </div>
        </div>
      </div>

      {/* Host details */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div>
          <Label className="text-xs font-medium text-muted-foreground">City</Label>
          <Input value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} />
        </div>
        <div>
          <Label className="text-xs font-medium text-muted-foreground">Host Type</Label>
          <Select value={form.host_type} onValueChange={v => setForm(p => ({ ...p, host_type: v }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {HOST_TYPE_OPTIONS.map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs font-medium text-muted-foreground">Cost</Label>
          <Input value={form.cost} onChange={e => setForm(p => ({ ...p, cost: e.target.value }))} />
        </div>
        <div>
          <Label className="text-xs font-medium text-muted-foreground">Expected Size</Label>
          <Select value={form.expected_size} onValueChange={v => setForm(p => ({ ...p, expected_size: v }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {SIZE_OPTIONS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Description */}
      <div>
        <Label className="text-xs font-medium text-muted-foreground">Description</Label>
        <Textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className="h-20" />
      </div>

      {/* URL & Type */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <Label className="text-xs font-medium text-muted-foreground">URL</Label>
          <Input value={form.url} onChange={e => setForm(p => ({ ...p, url: e.target.value }))} />
        </div>
        <div>
          <Label className="text-xs font-medium text-muted-foreground">Event Type</Label>
          <Input value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-2">
        <Button onClick={() => onSave(form)} disabled={saving} size="sm">
          {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          Save Changes
        </Button>
        <Button variant="ghost" size="sm" onClick={onCancel} disabled={saving}>
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
      </div>
    </div>
  );
}

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [signups, setSignups] = useState<EarlyAccessSignup[]>([]);
  const [loadingSignups, setLoadingSignups] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { events, loading, refetch } = useEvents();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check for existing valid session on mount
  useEffect(() => {
    const token = sessionStorage.getItem(ADMIN_TOKEN_KEY);
    if (token) {
      verifyExistingToken(token);
    }
  }, []);

  const verifyExistingToken = async (token: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-signups', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!error && data.success) {
        setIsAuthenticated(true);
        setSignups(data.signups || []);
      } else {
        sessionStorage.removeItem(ADMIN_TOKEN_KEY);
      }
    } catch {
      sessionStorage.removeItem(ADMIN_TOKEN_KEY);
    }
  };

  const fetchSignups = async () => {
    const token = sessionStorage.getItem(ADMIN_TOKEN_KEY);
    if (!token) return;

    setLoadingSignups(true);
    try {
      const { data, error } = await supabase.functions.invoke('admin-signups', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (error) throw error;
      if (!data.success) throw new Error(data.error);
      
      setSignups(data.signups || []);
    } catch (err) {
      console.error('Error fetching signups:', err);
      if (err instanceof Error && err.message.includes('token')) {
        sessionStorage.removeItem(ADMIN_TOKEN_KEY);
        setIsAuthenticated(false);
      }
    } finally {
      setLoadingSignups(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchSignups();
    }
  }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);

    try {
      const { data, error } = await supabase.functions.invoke('verify-admin', {
        body: { password },
      });

      if (error) throw error;

      if (data.success && data.token) {
        sessionStorage.setItem(ADMIN_TOKEN_KEY, data.token);
        setIsAuthenticated(true);
        setPassword('');
        toast({ title: "Welcome, Admin", description: "You now have access to manage content." });
      } else {
        throw new Error(data.error || 'Authentication failed');
      }
    } catch (err: any) {
      toast({ title: "Access Denied", description: err.message || "Incorrect password", variant: "destructive" });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(ADMIN_TOKEN_KEY);
    setIsAuthenticated(false);
    setSignups([]);
    toast({ title: "Logged out", description: "Your admin session has ended." });
  };

  const handleDelete = async (event: Event) => {
    if (!confirm(`Are you sure you want to delete "${event.title}"?`)) return;

    const token = sessionStorage.getItem(ADMIN_TOKEN_KEY);
    if (!token) {
      toast({ title: "Session Expired", description: "Please log in again.", variant: "destructive" });
      setIsAuthenticated(false);
      return;
    }

    setDeletingId(event.id);

    try {
      const { data, error } = await supabase.functions.invoke('delete-event', {
        body: { eventId: event.id },
        headers: { Authorization: `Bearer ${token}` }
      });

      if (error) throw error;

      if (data.success) {
        toast({ title: "Event Deleted", description: `"${event.title}" has been removed.` });
        refetch();
      } else {
        if (data.error?.includes('token') || data.error?.includes('expired')) {
          sessionStorage.removeItem(ADMIN_TOKEN_KEY);
          setIsAuthenticated(false);
          throw new Error('Session expired. Please log in again.');
        }
        throw new Error(data.error || 'Failed to delete');
      }
    } catch (err: any) {
      toast({ title: "Delete Failed", description: err.message, variant: "destructive" });
    } finally {
      setDeletingId(null);
    }
  };

  const handleSaveEvent = async (eventId: string, updates: Partial<Event>) => {
    const token = sessionStorage.getItem(ADMIN_TOKEN_KEY);
    if (!token) {
      toast({ title: "Session Expired", description: "Please log in again.", variant: "destructive" });
      setIsAuthenticated(false);
      return;
    }

    setSavingId(eventId);

    try {
      const { data, error } = await supabase.functions.invoke('update-event', {
        body: { eventId, updates },
        headers: { Authorization: `Bearer ${token}` }
      });

      if (error) throw error;

      if (data.success) {
        toast({ title: "Event Updated", description: "Changes saved successfully." });
        setEditingId(null);
        refetch();
      } else {
        if (data.error?.includes('token') || data.error?.includes('expired')) {
          sessionStorage.removeItem(ADMIN_TOKEN_KEY);
          setIsAuthenticated(false);
          throw new Error('Session expired. Please log in again.');
        }
        throw new Error(data.error || 'Failed to update');
      }
    } catch (err: any) {
      toast({ title: "Update Failed", description: err.message, variant: "destructive" });
    } finally {
      setSavingId(null);
    }
  };

  const exportSignupsCSV = () => {
    const headers = ['First Name', 'Last Name', 'Email', 'LinkedIn', 'Signed Up'];
    const rows = signups.map(s => [
      s.first_name, s.last_name, s.email, s.linkedin || '',
      new Date(s.created_at).toLocaleDateString()
    ]);
    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `early-access-signups-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatIcon = {
    virtual: Globe,
    inperson: MapPin,
    hybrid: Users,
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Admin Access</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                autoComplete="current-password"
              />
              <Button type="submit" className="w-full" disabled={isVerifying || !password}>
                {isVerifying ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Verifying...</>
                ) : (
                  'Access Admin Panel'
                )}
              </Button>
              <Button type="button" variant="ghost" className="w-full" onClick={() => navigate('/')}>
                <ArrowLeft className="h-4 w-4 mr-2" />Back to Home
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />Back
            </Button>
            <h1 className="text-2xl font-bold">Admin Panel</h1>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>Logout</Button>
        </div>

        <Tabs defaultValue="events" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="events" className="gap-2">
              <Calendar className="h-4 w-4" />
              Events
              <Badge variant="secondary" className="ml-1">{events.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="signups" className="gap-2">
              <UserPlus className="h-4 w-4" />
              Early Access
              <Badge variant="secondary" className="ml-1">{signups.length}</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="events">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : events.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  No events found. Events submitted through suggestions will appear here.
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {events.map((event) => {
                  const FormatIcon = formatIcon[event.format as keyof typeof formatIcon] || Calendar;
                  const isEditing = editingId === event.id;
                  const isExpanded = expandedId === event.id;
                  
                  return (
                    <Card key={event.id} className="group">
                      <CardContent className="p-4">
                        {isEditing ? (
                          <EventEditForm
                            event={event}
                            onSave={(updates) => handleSaveEvent(event.id, updates)}
                            onCancel={() => setEditingId(null)}
                            saving={savingId === event.id}
                          />
                        ) : (
                          <>
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                  <FormatIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                                  <Badge variant="secondary" className="text-xs">{event.type}</Badge>
                                  {event.featured && <Badge className="text-xs">⭐ Featured</Badge>}
                                  {event.is_high_signal && <Badge variant="destructive" className="text-xs">🔥 High Signal</Badge>}
                                  <Badge variant="outline" className="text-xs">{event.city}</Badge>
                                  {!event.is_approved && <Badge variant="outline" className="text-xs text-destructive border-destructive">Unapproved</Badge>}
                                </div>
                                <h3 className="font-semibold truncate">{event.title}</h3>
                                <p className="text-sm text-muted-foreground truncate">
                                  {event.organizer} • {event.date} at {event.time}
                                </p>
                                {event.outcome_framing && (
                                  <p className="text-xs text-primary mt-1 italic">
                                    "{event.outcome_framing}"
                                  </p>
                                )}
                                {isExpanded && (
                                  <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                                    <p><strong>Audience:</strong> {event.audience?.join(', ') || 'Not set'}</p>
                                    <p><strong>Stage:</strong> {event.stage?.join(', ') || 'Not set'}</p>
                                    <p><strong>Host:</strong> {event.host_type} · {event.cost} · {event.expected_size}</p>
                                    <p className="mt-1">{event.description}</p>
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center gap-1 shrink-0">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => setExpandedId(isExpanded ? null : event.id)}
                                >
                                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
                                  onClick={() => { setEditingId(event.id); setExpandedId(null); }}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                  onClick={() => handleDelete(event)}
                                  disabled={deletingId === event.id}
                                >
                                  {deletingId === event.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Trash2 className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </div>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="signups">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                {signups.length} people have signed up for early access
              </p>
              {signups.length > 0 && (
                <Button variant="outline" size="sm" onClick={exportSignupsCSV}>
                  <Download className="h-4 w-4 mr-2" />Export CSV
                </Button>
              )}
            </div>

            {loadingSignups ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : signups.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  No signups yet.
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                {signups.map((signup) => (
                  <Card key={signup.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{signup.first_name} {signup.last_name}</p>
                          <p className="text-sm text-muted-foreground">{signup.email}</p>
                          {signup.linkedin && (
                            <a href={signup.linkedin} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">
                              LinkedIn Profile
                            </a>
                          )}
                        </div>
                        <div className="text-right text-sm text-muted-foreground">
                          {new Date(signup.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
