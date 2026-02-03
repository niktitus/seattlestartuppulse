import { useState } from 'react';
import { Mail, Copy, X, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import type { StartupJob } from '@/types/jobs';
import { formatSalary, formatEquity } from '@/hooks/useJobs';

interface SelectedJobsBarProps {
  selectedJobs: StartupJob[];
  onClearSelection: () => void;
}

export default function SelectedJobsBar({ selectedJobs, onClearSelection }: SelectedJobsBarProps) {
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [copied, setCopied] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  if (selectedJobs.length === 0) return null;

  const copyLinks = () => {
    const links = selectedJobs.map(job => job.application_url).join('\n');
    navigator.clipboard.writeText(links);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: 'Copied!',
      description: `${selectedJobs.length} application link(s) copied to clipboard`,
    });
  };

  const sendEmail = async () => {
    if (!email) return;
    
    setSending(true);
    try {
      // This would call an edge function to send the email
      const jobList = selectedJobs.map(job => ({
        title: job.job_title,
        company: job.company_name,
        salary: formatSalary(job),
        equity: formatEquity(job),
        url: job.application_url,
      }));

      // For now, we'll just show a success message
      // TODO: Implement edge function for sending emails
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Email sent!',
        description: `Job list sent to ${email}`,
      });
      setEmail('');
      setDialogOpen(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send email. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-card border border-border shadow-elevated rounded-lg px-4 py-3 flex items-center gap-4">
        <span className="text-sm font-medium">
          {selectedJobs.length} job{selectedJobs.length > 1 ? 's' : ''} selected
        </span>

        <div className="flex items-center gap-2">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Mail className="h-4 w-4 mr-1.5" />
                Email Me This List
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Email Selected Jobs</DialogTitle>
                <DialogDescription>
                  We'll send you a formatted list of these {selectedJobs.length} jobs with all the details and application links.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 mt-4">
                {/* Preview */}
                <div className="max-h-48 overflow-y-auto space-y-2 border rounded-lg p-3 bg-muted/50">
                  {selectedJobs.map(job => (
                    <div key={job.id} className="text-sm">
                      <p className="font-medium">{job.job_title}</p>
                      <p className="text-muted-foreground">{job.company_name} • {formatSalary(job)}</p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={sendEmail} disabled={!email || sending}>
                    {sending && <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />}
                    Send
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="outline" size="sm" onClick={copyLinks}>
            {copied ? (
              <Check className="h-4 w-4 mr-1.5 text-primary" />
            ) : (
              <Copy className="h-4 w-4 mr-1.5" />
            )}
            Copy Links
          </Button>

          <Button variant="ghost" size="sm" onClick={onClearSelection}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
