import { useState, ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Calendar, GraduationCap, Briefcase, Clock, Newspaper, FolderOpen, ChevronDown, Menu, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export type TabId = 'events' | 'deadlines' | 'news' | 'learning' | 'jobs' | 'resources';

interface Tab {
  id: TabId;
  label: string;
  icon: typeof Calendar;
  path: string;
  count?: number;
  children?: { id: string; label: string; path: string; icon: typeof Calendar }[];
}

interface AppLayoutProps {
  children: ReactNode;
  activeTab: TabId;
  tabCounts?: Partial<Record<TabId, number>>;
}

const tabs: Tab[] = [
  { id: 'events', label: 'Events', icon: Calendar, path: '/' },
  { id: 'deadlines', label: 'Deadlines', icon: Clock, path: '/deadlines' },
  { id: 'news', label: 'News', icon: Newspaper, path: '/news' },
  { id: 'learning', label: 'Learning', icon: GraduationCap, path: '/learning' },
  { id: 'jobs', label: 'Jobs', icon: Briefcase, path: '/jobs' },
  { 
    id: 'resources', 
    label: 'Resources', 
    icon: FolderOpen, 
    path: '/resources',
    children: [
      { id: 'fractional', label: 'Fractional Services', path: '/fractional', icon: Users },
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

  // Check if we're in a resources sub-section
  const isResourcesActive = activeTab === 'resources' || 
    tabs.find(t => t.id === 'resources')?.children?.some(c => c.id === activeTab);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Soft Launch Banner */}
      <div className="bg-primary text-primary-foreground text-center text-sm py-2 px-4">
        <span className="font-medium">Soft Launch</span> — We're testing with a small group.{' '}
        <button
          onClick={() => {
            const digestSection = document.querySelector('[data-digest-signup]');
            if (digestSection) {
              digestSection.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          className="underline hover:no-underline font-medium"
        >
          Sign up for early access →
        </button>
      </div>

      {/* Header with branding and tab navigation */}
      <header className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          {/* Branding row */}
          <div className="flex items-center justify-between h-14">
            <Link to="/" className="group">
              <h1 className="text-lg font-semibold text-foreground tracking-tight">
                Seattle Startup <span className="text-primary">Pulse</span>
              </h1>
            </Link>
            
            {/* Desktop secondary actions */}
            <div className="hidden md:flex items-center gap-4">
              <Button
                onClick={() => {
                  const digestSection = document.querySelector('[data-digest-signup]');
                  if (digestSection) {
                    digestSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                size="sm"
                className="bg-primary text-primary-foreground font-bold px-6 py-2 shadow-md hover:bg-primary/90 ring-2 ring-primary/30 animate-pulse hover:animate-none"
              >
                ✉️ Get the weekly digest
              </Button>
            </div>

            {/* Mobile menu button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 p-0">
                <nav className="flex flex-col pt-12">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id || (tab.children && tab.children.some(c => c.id === activeTab));
                    const count = tabCounts[tab.id];
                    
                    return (
                      <div key={tab.id}>
                        <button
                          onClick={() => handleTabClick(tab.path)}
                          className={cn(
                            'flex items-center gap-3 px-6 py-4 text-left transition-colors border-l-2 w-full',
                            isActive 
                              ? 'border-l-primary bg-primary/5 text-foreground font-medium' 
                              : 'border-l-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
                          )}
                        >
                          <Icon className="h-5 w-5" />
                          <span>{tab.label}</span>
                          {count !== undefined && count > 0 && (
                            <span className="ml-auto text-xs font-medium text-muted-foreground">
                              {count}
                            </span>
                          )}
                        </button>
                        {/* Show children for Resources */}
                        {tab.children && (
                          <div className="pl-8">
                            {tab.children.map((child) => {
                              const ChildIcon = child.icon;
                              const isChildActive = activeTab === child.id;
                              return (
                                <button
                                  key={child.id}
                                  onClick={() => handleTabClick(child.path)}
                                  className={cn(
                                    'flex items-center gap-3 px-6 py-3 text-left transition-colors border-l-2 w-full text-sm',
                                    isChildActive 
                                      ? 'border-l-primary bg-primary/5 text-foreground font-medium' 
                                      : 'border-l-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
                                  )}
                                >
                                  <ChildIcon className="h-4 w-4" />
                                  <span>{child.label}</span>
                                </button>
                              );
                            })}
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
          </div>

          {/* Desktop Tab Navigation */}
          <nav className="hidden md:flex items-center gap-0 -mb-px">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id || (tab.children && tab.children.some(c => c.id === activeTab));
              const count = tabCounts[tab.id];
              
              // Resources has a dropdown
              if (tab.children) {
                return (
                  <DropdownMenu key={tab.id}>
                    <DropdownMenuTrigger asChild>
                      <button
                        className={cn(
                          'flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-all',
                          isActive 
                            ? 'border-primary text-foreground' 
                            : 'border-transparent text-muted-foreground hover:text-foreground'
                        )}
                      >
                        <Icon className={cn("h-4 w-4", isActive && "text-primary")} />
                        <span>{tab.label}</span>
                        <ChevronDown className="h-3 w-3 ml-0.5" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48">
                      <DropdownMenuItem onClick={() => handleTabClick(tab.path)}>
                        <Icon className="h-4 w-4 mr-2" />
                        All Resources
                      </DropdownMenuItem>
                      {tab.children.map((child) => {
                        const ChildIcon = child.icon;
                        return (
                          <DropdownMenuItem key={child.id} onClick={() => handleTabClick(child.path)}>
                            <ChildIcon className="h-4 w-4 mr-2" />
                            {child.label}
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              }
              
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.path)}
                  className={cn(
                    'flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-all',
                    isActive 
                      ? 'border-primary text-foreground' 
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Icon className={cn("h-4 w-4", isActive && "text-primary")} />
                  <span>{tab.label}</span>
                  {count !== undefined && count > 0 && (
                    <span className={cn(
                      "text-xs font-medium px-1.5 py-0.5 rounded",
                      isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                    )}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Mobile Tab Navigation - Scrollable */}
          <nav className="flex md:hidden items-center gap-0 -mb-px overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id || (tab.children && tab.children.some(c => c.id === activeTab));
              const count = tabCounts[tab.id];
              
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.path)}
                  className={cn(
                    'flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-all',
                    isActive 
                      ? 'border-primary text-foreground' 
                      : 'border-transparent text-muted-foreground'
                  )}
                >
                  <Icon className={cn("h-4 w-4", isActive && "text-primary")} />
                  <span>{tab.label}</span>
                  {count !== undefined && count > 0 && (
                    <span className={cn(
                      "text-xs font-medium",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )}>
                      {count}
                    </span>
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
      <footer className="border-t border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 text-center">
          <p className="text-sm text-muted-foreground">
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
