import { ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import DigestSignup from '@/components/digest/DigestSignup';
import ExitIntentModal from '@/components/digest/ExitIntentModal';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { mockCommunities, mockResources } from '@/data/mockData';
import { useState } from 'react';

export default function ResourcesPage() {
  const [activeSection, setActiveSection] = useState('communities');

  const diagnosticTools = [
    { id: 'quiz', name: 'Chief of Staff Quiz', url: 'https://chiefofstaffquiz.lovable.app/', description: 'Challenge your hiring for Operations roles' },
  ];

  const communities = mockCommunities.map(c => ({ 
    id: c.id, name: c.name, url: c.url, description: c.description 
  }));

  const operationalResources = [
    { id: 'hiring-support', name: 'Fractional Support Directory', url: 'https://nicoletitus.notion.site/Other-Fractional-Support-2ca7696659d180f58625e345d061412a?source=copy_link', description: 'Founder-focused fractional professionals' },
    ...mockResources.map(r => ({ id: r.id, name: r.name, url: r.url, description: r.description })),
  ];

  const startupResources = [
    { id: 'sr-1', name: 'Seattle Startup Legal Guide', url: '#', description: 'Free guide to incorporation, IP, and founder agreements in WA state' },
    { id: 'sr-2', name: 'PNW Fundraising Tracker', url: '#', description: 'Notion template for tracking investor outreach and pipeline' },
    { id: 'sr-3', name: 'AWS Activate', url: 'https://aws.amazon.com/activate/', description: 'Up to $100K in AWS credits for early-stage startups' },
    { id: 'sr-4', name: 'Microsoft for Startups Founders Hub', url: 'https://www.microsoft.com/en-us/startups', description: 'Up to $150K in Azure credits, plus OpenAI APIs and mentorship' },
    { id: 'sr-5', name: 'Startup WA Tax Benefits', url: '#', description: 'Guide to R&D tax credits and WA state incentives' },
    { id: 'sr-6', name: 'SCORE Seattle Mentorship', url: 'https://www.score.org/seattle', description: 'Free mentoring and workshops from experienced entrepreneurs' },
  ];

  const sections = [
    { id: 'communities', label: 'Communities', items: communities },
    { id: 'diagnostic', label: 'Diagnostic Tools', items: diagnosticTools },
    { id: 'startup', label: 'Startup Resources', items: startupResources },
    { id: 'operational', label: 'Operational', items: operationalResources },
  ];

  const activeItems = sections.find(s => s.id === activeSection)?.items || [];

  return (
    <AppLayout activeTab="resources">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Resources</h1>
          <p className="text-sm text-muted-foreground">Curated links for Seattle founders and operators</p>
        </div>

        {/* Feature call-outs */}
        <div className="space-y-2">
          <Link 
            to="/learning"
            className="flex items-center justify-between bg-card border border-border rounded-lg p-4 hover:shadow-md transition-all group"
          >
            <div>
              <h3 className="font-semibold text-[15px] text-foreground group-hover:text-primary transition-colors">Learning & Development</h3>
              <p className="text-[13px] text-muted-foreground">Courses for founders & operators</p>
            </div>
            <span className="text-muted-foreground text-sm">→</span>
          </Link>

          <Link 
            to="/fractional"
            className="flex items-center justify-between bg-card border border-border rounded-lg p-4 hover:shadow-md transition-all group"
          >
            <div>
              <h3 className="font-semibold text-[15px] text-foreground group-hover:text-primary transition-colors">Fractional Services</h3>
              <p className="text-[13px] text-muted-foreground">Find fractional executives and operators</p>
            </div>
            <Badge variant="outline" className="text-[10px] font-medium rounded-sm px-1.5 py-0 shrink-0">
              Coming Soon
            </Badge>
          </Link>
        </div>

        {/* Section pills */}
        <div className="flex flex-wrap items-center gap-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium transition-colors border",
                activeSection === section.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-transparent text-foreground border-border hover:border-foreground/30"
              )}
            >
              {section.label}
            </button>
          ))}
        </div>

        {/* Resource list */}
        <div className="space-y-2">
          {activeItems.map((item) => (
            <a 
              key={item.id} 
              href={item.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-4 bg-card border border-border rounded-lg p-4 hover:shadow-md transition-all group"
            >
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-[15px] text-foreground group-hover:text-primary transition-colors">{item.name}</h3>
                <p className="text-[13px] text-muted-foreground line-clamp-1">{item.description}</p>
              </div>
              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary shrink-0 transition-colors" />
            </a>
          ))}
        </div>

        {/* Digest Signup */}
        <div className="mt-8">
          <DigestSignup sourceTab="resources" />
        </div>
      </div>

      <ExitIntentModal sourceTab="resources" />
    </AppLayout>
  );
}
