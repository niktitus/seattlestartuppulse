import { useState, ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export type TabId = 'events' | 'deadlines' | 'news' | 'resources';

interface Tab {
  id: TabId;
  label: string;
  path: string;
  children?: { id: string; label: string; path: string }[];
}

interface AppLayoutProps {
  children: ReactNode;
  activeTab: TabId;
  tabCounts?: Partial<Record<TabId, number>>;
}

const tabs: Tab[] = [
  { id: 'events', label: 'Events', path: '/' },
  { id: 'deadlines', label: 'Deadlines', path: '/deadlines' },
  { id: 'news', label: 'News', path: '/news' },
  { 
    id: 'resources', 
    label: 'Resources', 
    path: '/resources',
    children: [
      { id: 'learning', label: 'Learning & Development', path: '/learning' },
      { id: 'fractional', label: 'Fractional Services', path: '/fractional' },
    ]
  },
];

export default function AppLayout({ children, activeTab, tabCounts = {} }: AppLayoutProps) {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTabClick = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Soft Launch Banner */}
      <div className="bg-muted text-muted-foreground text-center text-xs py-1.5 px-4 border-b border-border">
        <span className="font-medium">Soft Launch</span> —{' '}
        <button
          onClick={() => {
            const digestSection = document.querySelector('[data-digest-signup]');
            if (digestSection) {
              digestSection.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          className="underline hover:no-underline font-medium text-foreground"
        >
          Sign up for the weekly digest
        </button>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {/* Mobile menu (hamburger only visible on mobile) */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="h-8 w-8 absolute right-4 top-2 z-10">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64 p-0">
              <nav className="flex flex-col pt-12">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.id || (tab.children && tab.children.some(c => c.id === activeTab));
                  return (
                    <div key={tab.id}>
                      <button
                        onClick={() => handleTabClick(tab.path)}
                        className={cn(
                          'flex items-center px-6 py-3.5 text-sm text-left transition-colors border-l-2 w-full',
                          isActive 
                            ? 'border-l-primary text-foreground font-medium' 
                            : 'border-l-transparent text-muted-foreground hover:text-foreground'
                        )}
                      >
                        {tab.label}
                      </button>
                      {tab.children && (
                        <div className="pl-6">
                          {tab.children.map((child) => (
                            <button
                              key={child.id}
                              onClick={() => handleTabClick(child.path)}
                              className={cn(
                                'flex items-center px-6 py-2.5 text-sm text-left transition-colors border-l-2 w-full',
                                activeTab === child.id
                                  ? 'border-l-primary text-foreground font-medium' 
                                  : 'border-l-transparent text-muted-foreground hover:text-foreground'
                              )}
                            >
                              {child.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
                <div className="border-t border-border mt-2 pt-4 px-6">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setTimeout(() => {
                        const digestSection = document.querySelector('[data-digest-signup]');
                        if (digestSection) {
                          digestSection.scrollIntoView({ behavior: 'smooth' });
                        }
                      }, 300);
                    }}
                    className="text-sm font-medium text-primary"
                  >
                    Get the digest →
                  </button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Desktop Tab Navigation + Digest CTA on same line */}
          <nav className="hidden md:flex items-center justify-between -mb-px">
            <div className="flex items-center gap-0">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id || (tab.children && tab.children.some(c => c.id === activeTab));
                
                if (tab.children) {
                  return (
                    <DropdownMenu key={tab.id}>
                      <DropdownMenuTrigger asChild>
                        <button
                          className={cn(
                            'px-4 py-2.5 text-sm font-medium border-b-2 transition-colors flex items-center gap-1',
                            isActive 
                              ? 'border-primary text-foreground' 
                              : 'border-transparent text-muted-foreground hover:text-foreground'
                          )}
                        >
                          {tab.label}
                          <ChevronDown className="h-3 w-3" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-48">
                        <DropdownMenuItem onClick={() => handleTabClick(tab.path)}>
                          All Resources
                        </DropdownMenuItem>
                        {tab.children.map((child) => (
                          <DropdownMenuItem key={child.id} onClick={() => handleTabClick(child.path)}>
                            {child.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  );
                }
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.path)}
                    className={cn(
                      'px-4 py-2.5 text-sm font-medium border-b-2 transition-colors',
                      isActive 
                        ? 'border-primary text-foreground' 
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
            <Button
              onClick={() => {
                const digestSection = document.querySelector('[data-digest-signup]');
                if (digestSection) {
                  digestSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              size="sm"
              variant="outline"
              className="h-7 text-xs font-medium mb-px"
            >
              ✉️ Weekly digest
            </Button>
          </nav>

          {/* Mobile Tab Navigation */}
          <nav className="flex md:hidden items-center gap-0 -mb-px overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id || (tab.children && tab.children.some(c => c.id === activeTab));
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.path)}
                  className={cn(
                    'px-3 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap transition-colors',
                    isActive 
                      ? 'border-primary text-foreground' 
                      : 'border-transparent text-muted-foreground'
                  )}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 text-center">
          <p className="text-xs text-muted-foreground">
            Curated by{' '}
            <a 
              href="https://www.linkedin.com/in/niktitus" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-medium text-foreground hover:text-primary transition-colors"
            >
              Nicole Titus
            </a>
            {' '}· Seattle startup community
          </p>
        </div>
      </footer>
    </div>
  );
}
