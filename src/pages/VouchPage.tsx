import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export default function VouchPage() {
  const { token } = useParams<{ token: string }>();
  const [state, setState] = useState<'loading' | 'ok' | 'already' | 'error'>('loading');

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.functions.invoke('vouch-confirm', { body: { token } });
      if (error || data?.error) setState('error');
      else setState(data?.already ? 'already' : 'ok');
    })();
  }, [token]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md text-center space-y-4">
        {state === 'loading' && <p className="text-muted-foreground">Confirming…</p>}
        {state === 'ok' && (
          <>
            <div className="text-4xl">💚</div>
            <h1 className="text-2xl font-semibold">Thanks for vouching</h1>
            <p className="text-muted-foreground">Your vouch is recorded. We'll take it from here.</p>
          </>
        )}
        {state === 'already' && (
          <>
            <div className="text-4xl">💚</div>
            <h1 className="text-2xl font-semibold">Already confirmed</h1>
            <p className="text-muted-foreground">You've already vouched — thank you.</p>
          </>
        )}
        {state === 'error' && (
          <>
            <h1 className="text-2xl font-semibold">That link didn't work</h1>
            <p className="text-muted-foreground">It may be invalid or expired. Ask the mentor to resend it.</p>
          </>
        )}
        <Link to="/fair" className="inline-block text-primary font-medium hover:underline">See the Silent Community Fair →</Link>
      </div>
    </div>
  );
}
