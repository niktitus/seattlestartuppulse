import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Loader2, Lock, Calendar, MapPin, Globe, Users, UserPlus, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

// Session storage key for admin token
const ADMIN_TOKEN_KEY = 'admin_session_token';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [signups, setSignups] = useState<EarlyAccessSignup[]>([]);
  const [loadingSignups, setLoadingSignups] = useState(false);
  const { events, loading, refetch } = useEvents();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check for existing valid session on mount
  useEffect(() => {
    const token = sessionStorage.getItem(ADMIN_TOKEN_KEY);
    if (token) {
      // Verify token is still valid by making a test request
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
        // Token invalid, clear it
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
      // If unauthorized, clear session
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
        // Store JWT in sessionStorage (cleared when browser closes)
        sessionStorage.setItem(ADMIN_TOKEN_KEY, data.token);
        setIsAuthenticated(true);
        setPassword(''); // Clear password from memory immediately
        toast({
          title: "Welcome, Admin",
          description: "You now have access to manage events.",
        });
      } else {
        throw new Error(data.error || 'Authentication failed');
      }
    } catch (err: any) {
      toast({
        title: "Access Denied",
        description: err.message || "Incorrect password",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(ADMIN_TOKEN_KEY);
    setIsAuthenticated(false);
    setSignups([]);
    toast({
      title: "Logged out",
      description: "Your admin session has ended.",
    });
  };

  const handleDelete = async (event: Event) => {
    if (!confirm(`Are you sure you want to delete "${event.title}"?`)) return;

    const token = sessionStorage.getItem(ADMIN_TOKEN_KEY);
    if (!token) {
      toast({
        title: "Session Expired",
        description: "Please log in again.",
        variant: "destructive",
      });
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
        toast({
          title: "Event Deleted",
          description: `"${event.title}" has been removed.`,
        });
        refetch();
      } else {
        // Check if token expired
        if (data.error?.includes('token') || data.error?.includes('expired')) {
          sessionStorage.removeItem(ADMIN_TOKEN_KEY);
          setIsAuthenticated(false);
          throw new Error('Session expired. Please log in again.');
        }
        throw new Error(data.error || 'Failed to delete');
      }
    } catch (err: any) {
      toast({
        title: "Delete Failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const exportSignupsCSV = () => {
    const headers = ['First Name', 'Last Name', 'Email', 'LinkedIn', 'Signed Up'];
    const rows = signups.map(s => [
      s.first_name,
      s.last_name,
      s.email,
      s.linkedin || '',
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
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Access Admin Panel'
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => navigate('/')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold">Admin Panel</h1>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Logout
          </Button>
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
                  
                  return (
                    <Card key={event.id} className="group">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <FormatIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                              <Badge variant="secondary" className="text-xs">
                                {event.type}
                              </Badge>
                              {event.featured && (
                                <Badge className="text-xs">Featured</Badge>
                              )}
                              <Badge variant="outline" className="text-xs">
                                {event.city}
                              </Badge>
                            </div>
                            <h3 className="font-semibold truncate">{event.title}</h3>
                            <p className="text-sm text-muted-foreground truncate">
                              {event.organizer} • {event.date} at {event.time}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {event.description}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
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
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
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
                  No signups yet. Share the early access link to start collecting interest.
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                {signups.map((signup) => (
                  <Card key={signup.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">
                            {signup.first_name} {signup.last_name}
                          </p>
                          <p className="text-sm text-muted-foreground">{signup.email}</p>
                          {signup.linkedin && (
                            <a 
                              href={signup.linkedin} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs text-primary hover:underline"
                            >
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
