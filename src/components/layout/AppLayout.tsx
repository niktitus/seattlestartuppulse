import { useState, ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Calendar, GraduationCap, Briefcase, Users, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export type TabId = 'events' | 'learning' | 'jobs' | 'fractional';

interface Tab {
  id: TabId;
  label: string;
  icon: typeof Calendar;
  path: string;
  count?: number;
}

interface AppLayoutProps {
  children: ReactNode;
  activeTab: TabId;
  tabCounts?: Partial<Record<TabId, number>>;
}

const tabs: Tab[] = [
  { id: 'events', label: 'Events', icon: Calendar, path: '/' },
  { id: 'learning', label: 'Learning', icon: GraduationCap, path: '/learning' },
  { id: 'jobs', label: 'Jobs', icon: Briefcase, path: '/jobs' },
  { id: 'fractional', label: 'Fractional', icon: Users, path: '/fractional' },
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
      {/* Header with branding and tab navigation */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-6xl mx-auto px-4">
          {/* Branding row */}
          <div className="flex items-center justify-between py-3">
            <Link to="/" className="flex flex-col">
              <h1 className="text-lg md:text-xl font-bold text-foreground">Seattle Startup Pulse</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Curated resources for Seattle founders</p>
            </Link>
            
            {/* Desktop secondary actions */}
            <div className="hidden md:flex items-center gap-2">
              <Link 
                to="/early-access"
                className="text-sm text-primary hover:underline"
              >
                Get the digest →
              </Link>
            </div>

            {/* Mobile menu button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <nav className="flex flex-col gap-2 mt-6">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    const count = tabCounts[tab.id];
                    
                    return (
                      <button
                        key={tab.id}
                        onClick={() => handleTabClick(tab.path)}
                        className={cn(
                          'flex items-center gap-3 px-4 py-3 rounded-md text-left transition-colors',
                          isActive 
                            ? 'bg-primary/10 text-primary font-medium' 
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{tab.label}</span>
                        {count !== undefined && count > 0 && (
                          <Badge variant="secondary" className="ml-auto text-xs">
                            {count}
                          </Badge>
                        )}
                      </button>
                    );
                  })}
                  <div className="border-t border-border mt-4 pt-4">
                    <Link 
                      to="/early-access"
                      className="block px-4 py-3 text-primary hover:underline"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Get the digest →
                    </Link>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Tab Navigation */}
          <nav className="hidden md:flex items-center gap-1 -mb-px">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const count = tabCounts[tab.id];
              
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.path)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors',
                    isActive 
                      ? 'border-primary text-primary' 
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                  {count !== undefined && count > 0 && (
                    <Badge 
                      variant={isActive ? 'default' : 'secondary'} 
                      className="text-xs px-1.5 py-0 h-5"
                    >
                      {count}
                    </Badge>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Mobile Tab Navigation - Scrollable */}
          <nav className="flex md:hidden items-center gap-1 -mb-px overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const count = tabCounts[tab.id];
              
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.path)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap transition-colors',
                    isActive 
                      ? 'border-primary text-primary' 
                      : 'border-transparent text-muted-foreground'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                  {count !== undefined && count > 0 && (
                    <Badge 
                      variant={isActive ? 'default' : 'secondary'} 
                      className="text-xs px-1 py-0 h-4 min-w-[1.25rem] justify-center"
                    >
                      {count}
                    </Badge>
                  )}
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
      <footer className="border-t border-border bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 py-4 text-center">
          <p className="text-sm text-muted-foreground">
            Curated by{' '}
            <a 
              href="https://www.linkedin.com/in/niktitus" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Nicole Titus
            </a>
            {' '}• Part of the Seattle startup community
          </p>
        </div>
      </footer>
    </div>
  );
}
