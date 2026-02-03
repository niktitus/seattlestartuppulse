import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Loader2, Bookmark } from 'lucide-react';
import MainNav from '@/components/navigation/MainNav';
import LearningCard from '@/components/learning/LearningCard';
import LearningFilters from '@/components/learning/LearningFilters';
import SubmitCourseDialog from '@/components/learning/SubmitCourseDialog';
import { Button } from '@/components/ui/button';
import { useLearningResources } from '@/hooks/useLearningResources';
import type { LearningFilters as LearningFiltersType, LearningSortOption } from '@/types/learning';

const defaultFilters: LearningFiltersType = {
  categories: [],
  formats: [],
  difficulties: [],
  timeToROI: [],
  priceTypes: [],
  freeOnly: false,
  certificationOnly: false,
  founderRecommendedOnly: false,
  search: '',
};

export default function Learning() {
  const { data: resources = [], isLoading } = useLearningResources();
  const [filters, setFilters] = useState<LearningFiltersType>(defaultFilters);
  const [sortBy, setSortBy] = useState<LearningSortOption>('newest');
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);

  // Load bookmarks from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('learning-bookmarks');
    if (saved) {
      setBookmarkedIds(new Set(JSON.parse(saved)));
    }
  }, []);

  // Save bookmarks to localStorage
  const toggleBookmark = (id: string) => {
    setBookmarkedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      localStorage.setItem('learning-bookmarks', JSON.stringify([...next]));
      return next;
    });
  };

  // Filter resources
  const filteredResources = useMemo(() => {
    let result = resources.filter(resource => {
      // Bookmarks filter
      if (showBookmarksOnly && !bookmarkedIds.has(resource.id)) {
        return false;
      }

      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = 
          resource.course_name.toLowerCase().includes(searchLower) ||
          resource.instructor_name.toLowerCase().includes(searchLower) ||
          resource.description?.toLowerCase().includes(searchLower) ||
          resource.skill_category.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Category filter
      if (filters.categories.length > 0 && !filters.categories.includes(resource.skill_category)) {
        return false;
      }

      // Format filter
      if (filters.formats.length > 0 && !filters.formats.includes(resource.format)) {
        return false;
      }

      // Difficulty filter
      if (filters.difficulties.length > 0 && !filters.difficulties.includes(resource.difficulty)) {
        return false;
      }

      // Time to ROI filter
      if (filters.timeToROI.length > 0 && !filters.timeToROI.includes(resource.time_to_roi)) {
        return false;
      }

      // Free only filter
      if (filters.freeOnly && !resource.is_free) {
        return false;
      }

      // Certification only filter
      if (filters.certificationOnly && !resource.has_certification) {
        return false;
      }

      // Founder recommended filter
      if (filters.founderRecommendedOnly && !resource.is_founder_recommended) {
        return false;
      }

      return true;
    });

    // Sort
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'price-low':
        result.sort((a, b) => {
          // Free first, then by price
          if (a.is_free && !b.is_free) return -1;
          if (!a.is_free && b.is_free) return 1;
          return (a.price_amount || 0) - (b.price_amount || 0);
        });
        break;
      case 'alphabetical':
        result.sort((a, b) => a.course_name.localeCompare(b.course_name));
        break;
      case 'roi-immediate':
        result.sort((a, b) => {
          if (a.time_to_roi === 'Apply immediately' && b.time_to_roi !== 'Apply immediately') return -1;
          if (a.time_to_roi !== 'Apply immediately' && b.time_to_roi === 'Apply immediately') return 1;
          return 0;
        });
        break;
    }

    return result;
  }, [resources, filters, sortBy, showBookmarksOnly, bookmarkedIds]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Link 
                to="/"
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Link>
              <div>
                <h1 className="text-xl font-bold text-foreground">Learning & Development</h1>
                <p className="text-sm text-muted-foreground">Advanced courses for founders & operators</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant={showBookmarksOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
                className="flex items-center gap-1.5"
              >
                <Bookmark className="h-4 w-4" />
                Bookmarks ({bookmarkedIds.size})
              </Button>
              <MainNav showFullNav={false} />
              <SubmitCourseDialog />
            </div>
          </div>

          {/* Intro Text */}
          <div className="mb-4 p-3 bg-muted/50 rounded-lg border border-border">
            <p className="text-sm text-muted-foreground">
              <span className="text-foreground font-medium">Curated for impact.</span> We focus on advanced, high-ROI programs—no basic courses. 
              Look for <span className="text-secondary font-medium">⭐ Founder Recommended</span> badges for peer-vetted content.
            </p>
          </div>

          {/* Filters */}
          <LearningFilters
            filters={filters}
            onFiltersChange={setFilters}
            sortBy={sortBy}
            onSortChange={setSortBy}
            totalResources={resources.length}
            filteredCount={filteredResources.length}
          />
        </div>
      </header>

      {/* Course Listings */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : filteredResources.length === 0 ? (
          <div className="text-center py-12">
            {showBookmarksOnly ? (
              <>
                <Bookmark className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No bookmarked courses yet.</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Click the bookmark icon on courses to save them for later.
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setShowBookmarksOnly(false)}
                >
                  View all courses
                </Button>
              </>
            ) : (
              <>
                <p className="text-muted-foreground">No courses match your filters.</p>
                {resources.length === 0 && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Be the first to suggest a course!
                  </p>
                )}
              </>
            )}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredResources.map(resource => (
              <LearningCard
                key={resource.id}
                resource={resource}
                isBookmarked={bookmarkedIds.has(resource.id)}
                onBookmark={toggleBookmark}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30">
        <div className="max-w-5xl mx-auto px-4 py-4 text-center">
          <p className="text-sm text-muted-foreground">
            Part of{' '}
            <Link to="/" className="text-primary hover:underline">
              Seattle Startup Pulse
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
