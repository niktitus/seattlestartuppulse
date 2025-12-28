import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Loader2, Lock, Calendar, MapPin, Globe, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useEvents, Event } from '@/hooks/useEvents';
import { supabase } from '@/integrations/supabase/client';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { events, loading, refetch } = useEvents();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);

    try {
      const { data, error } = await supabase.functions.invoke('verify-admin', {
        body: { password },
      });

      if (error) throw error;

      if (data.success) {
        setIsAuthenticated(true);
        setAuthPassword(password);
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

  const handleDelete = async (event: Event) => {
    if (!confirm(`Are you sure you want to delete "${event.title}"?`)) return;

    setDeletingId(event.id);

    try {
      const { data, error } = await supabase.functions.invoke('delete-event', {
        body: { eventId: event.id, password: authPassword },
      });

      if (error) throw error;

      if (data.success) {
        toast({
          title: "Event Deleted",
          description: `"${event.title}" has been removed.`,
        });
        refetch();
      } else {
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
            <h1 className="text-2xl font-bold">Event Management</h1>
          </div>
          <Badge variant="outline" className="gap-1.5">
            <span className="h-2 w-2 bg-green-500 rounded-full" />
            {events.length} events
          </Badge>
        </div>

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
      </div>
    </div>
  );
}
