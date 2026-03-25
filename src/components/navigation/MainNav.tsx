import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Calendar, GraduationCap, Users, CalendarDays, Rocket, ExternalLink } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

interface StartupLink {
  id: string;
  name: string;
  url: string;
  description: string;
}

interface MainNavProps {
  showFullNav?: boolean;
}

export default function MainNav({ showFullNav = true }: MainNavProps) {
  const [startupLinks, setStartupLinks] = useState<StartupLink[]>([]);

  useEffect(() => {
    const fetchLinks = async () => {
      const { data } = await supabase
        .from('resource_links')
        .select('id, name, url, description')
        .eq('category', 'I want to start a company')
        .order('sort_order', { ascending: true });
      setStartupLinks((data as StartupLink[]) || []);
    };
    fetchLinks();
  }, []);

  return (
    <div className="flex items-center gap-2">
      {showFullNav && (
        <>
          {/* Explore Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium">
                Explore
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="start" 
              className="w-64 bg-popover border border-border shadow-lg z-50"
            >
              <div className="p-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-2 py-1">
                  Seattle Startup Hub
                </p>
              </div>
              <DropdownMenuSeparator />
              
              <DropdownMenuItem asChild>
                <Link to="/" className="flex items-start gap-3 p-3 cursor-pointer">
                  <Calendar className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Events & Digest</p>
                    <p className="text-xs text-muted-foreground">Weekly events, news & deadlines</p>
                  </div>
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuItem asChild>
                <Link to="/learning" className="flex items-start gap-3 p-3 cursor-pointer">
                  <GraduationCap className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Learning & Development</p>
                    <p className="text-xs text-muted-foreground">Courses for founders & operators</p>
                  </div>
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuItem asChild>
                <Link to="/fractional" className="flex items-start gap-3 p-3 cursor-pointer opacity-50">
                  <Users className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Fractional Services</p>
                    <p className="text-xs text-muted-foreground">Coming soon</p>
                  </div>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link to="/directory" className="flex items-start gap-3 p-3 cursor-pointer">
                  <Rocket className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Startup Directory</p>
                    <p className="text-xs text-muted-foreground">Browse local startups</p>
                  </div>
                </Link>
              </DropdownMenuItem>

              {startupLinks.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <div className="p-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-2 py-1">
                      I want to start a company
                    </p>
                  </div>
                  {startupLinks.map((link) => (
                    <DropdownMenuItem key={link.id} asChild>
                      <a 
                        href={link.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-start gap-3 p-3 cursor-pointer"
                      >
                        <ExternalLink className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        <div className="min-w-0">
                          <p className="font-medium">{link.name}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1">{link.description}</p>
                        </div>
                      </a>
                    </DropdownMenuItem>
                  ))}
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Quick Links */}
          <Link 
            to="/events"
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-foreground bg-muted hover:bg-muted/80 rounded-md transition-colors"
          >
            <CalendarDays className="h-4 w-4" />
            All Events
          </Link>
        </>
      )}
    </div>
  );
}
