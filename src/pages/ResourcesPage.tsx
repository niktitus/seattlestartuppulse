import { ExternalLink, Users, Wrench, UsersRound, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import DigestSignup from '@/components/digest/DigestSignup';
import ExitIntentModal from '@/components/digest/ExitIntentModal';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockCommunities, mockResources } from '@/data/mockData';

export default function ResourcesPage() {
  const diagnosticTools = [
    { id: 'quiz', name: 'Chief of Staff Quiz', url: 'https://chiefofstaffquiz.lovable.app/', description: 'Challenge your hiring for Operations roles' },
  ];

  const communities = mockCommunities.map(c => ({ 
    id: c.id, 
    name: c.name, 
    url: c.url, 
    description: c.description 
  }));

  const operationalResources = [
    { id: 'hiring-support', name: 'Fractional Support Directory', url: 'https://nicoletitus.notion.site/Other-Fractional-Support-2ca7696659d180f58625e345d061412a?source=copy_link', description: 'Founder-focused fractional professionals' },
    ...mockResources.map(r => ({ id: r.id, name: r.name, url: r.url, description: r.description })),
  ];

  const ResourceList = ({ items }: { items: { id: string; name: string; url: string; description: string }[] }) => (
    <div className="space-y-2">
      {items.map((link) => (
        <a 
          key={link.id} 
          href={link.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center justify-between gap-4 bg-card border border-border rounded-lg p-4 hover:border-primary/50 hover:bg-accent/5 transition-colors group"
        >
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">{link.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-1">{link.description}</p>
          </div>
          <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary shrink-0 transition-colors" />
        </a>
      ))}
    </div>
  );

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

        {/* Resource Tabs */}
        <Tabs defaultValue="communities" className="w-full">
          <TabsList className="w-full justify-start mb-4 h-auto flex-wrap gap-1 bg-transparent p-0">
            <TabsTrigger 
              value="communities" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2"
            >
              <UsersRound className="h-4 w-4" />
              Communities
            </TabsTrigger>
            <TabsTrigger 
              value="diagnostic" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2"
            >
              <Wrench className="h-4 w-4" />
              Support Diagnostic Tools
            </TabsTrigger>
            <TabsTrigger 
              value="operational" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2"
            >
              <Settings className="h-4 w-4" />
              Operational
            </TabsTrigger>
          </TabsList>

          <TabsContent value="communities">
            <ResourceList items={communities} />
          </TabsContent>

          <TabsContent value="diagnostic">
            <ResourceList items={diagnosticTools} />
          </TabsContent>

          <TabsContent value="operational">
            <ResourceList items={operationalResources} />
          </TabsContent>
        </Tabs>

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
