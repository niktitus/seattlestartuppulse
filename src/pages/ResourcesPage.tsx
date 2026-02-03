import { ExternalLink, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import DigestSignup from '@/components/digest/DigestSignup';
import ExitIntentModal from '@/components/digest/ExitIntentModal';
import { Badge } from '@/components/ui/badge';
import { mockCommunities, mockResources } from '@/data/mockData';

export default function ResourcesPage() {
  const resourceLinks = [
    { id: 'quiz', name: 'Chief of Staff Quiz', url: 'https://chiefofstaffquiz.lovable.app/', description: 'Challenge your hiring for Operations roles', category: 'Hiring' },
    { id: 'hiring-support', name: 'Fractional Support Directory', url: 'https://nicoletitus.notion.site/Other-Fractional-Support-2ca7696659d180f58625e345d061412a?source=copy_link', description: 'Founder-focused fractional professionals', category: 'Hiring' },
    ...mockCommunities.map(c => ({ id: c.id, name: c.name, url: c.url, description: c.description, category: 'Community' })),
    ...mockResources.map(r => ({ id: r.id, name: r.name, url: r.url, description: r.description, category: 'Resource' })),
  ];

  return (
    <AppLayout activeTab="resources">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-foreground">Resources</h2>
          <p className="text-sm text-muted-foreground">Curated links for Seattle founders and operators</p>
        </div>

        {/* Fractional Services Call-out */}
        <Link 
          to="/fractional"
          className="flex items-center justify-between gap-4 bg-accent/30 border border-primary/20 rounded-lg p-4 mb-6 hover:border-primary/50 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">Fractional Services</h3>
              <p className="text-sm text-muted-foreground">Find fractional executives and operators for your startup</p>
            </div>
          </div>
          <Badge variant="outline" className="text-xs border-primary/50 text-primary shrink-0">
            Coming Soon
          </Badge>
        </Link>

        {/* Resource Links */}
        <div className="space-y-2">
          {resourceLinks.map((link) => (
            <a 
              key={link.id} 
              href={link.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-4 bg-card border border-border rounded-lg p-4 hover:border-primary/50 hover:bg-accent/5 transition-colors group"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="secondary" className="text-xs">{link.category}</Badge>
                </div>
                <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">{link.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-1">{link.description}</p>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary shrink-0 transition-colors" />
            </a>
          ))}
        </div>

        {/* Digest Signup */}
        <div className="mt-12">
          <DigestSignup sourceTab="resources" />
        </div>
      </div>

      {/* Exit Intent Modal */}
      <ExitIntentModal sourceTab="resources" />
    </AppLayout>
  );
}
