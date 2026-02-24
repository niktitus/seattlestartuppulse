import { useState, useMemo, useEffect } from 'react';
import { Loader2, BookmarkCheck, Bookmark } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import LearningCard from '@/components/learning/LearningCard';
import LearningFilters from '@/components/learning/LearningFilters';
import SubmitCourseDialog from '@/components/learning/SubmitCourseDialog';
import DigestSignup from '@/components/digest/DigestSignup';
import ExitIntentModal from '@/components/digest/ExitIntentModal';
import { Button } from '@/components/ui/button';
import { useLearningResources } from '@/hooks/useLearningResources';
import type { LearningFilters as LearningFiltersType, LearningSortOption } from '@/types/learning';

const BOOKMARKS_KEY = 'learning_bookmarks';

const defaultFilters: LearningFiltersType = {
  search: '',
  categories: [],
  formats: [],
  difficulties: [],
  priceTypes: [],
  timeToROI: [],
  freeOnly: false,
  certificationOnly: false,
  founderRecommendedOnly: false,
};

export default function LearningPage() {
  const { data: resources = [], isLoading } = useLearningResources();
  const [filters, setFilters] = useState<LearningFiltersType>(defaultFilters);
  const [sortBy, setSortBy] = useState<LearningSortOption>('newest');
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);

  // Load bookmarks from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(BOOKMARKS_KEY);
    if (saved) {
      try {
        setBookmarkedIds(new Set(JSON.parse(saved)));
      } catch {
        // Invalid JSON, ignore
      }
    }
  }, []);

  const toggleBookmark = (id: string) => {
    setBookmarkedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify([...next]));
      return next;
    });
  };

  const filteredResources = useMemo(() => {
    let result = resources.filter(resource => {
      if (showBookmarksOnly && !bookmarkedIds.has(resource.id)) return false;
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = 
          resource.course_name.toLowerCase().includes(searchLower) ||
          resource.instructor_name.toLowerCase().includes(searchLower) ||
          resource.description?.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }
      if (filters.categories.length > 0 && !filters.categories.includes(resource.skill_category)) return false;
      if (filters.formats.length > 0 && !filters.formats.includes(resource.format)) return false;
      if (filters.difficulties.length > 0 && !filters.difficulties.includes(resource.difficulty)) return false;
      if (filters.priceTypes.length > 0 && !filters.priceTypes.includes(resource.price_type)) return false;
      if (filters.timeToROI.length > 0 && !filters.timeToROI.includes(resource.time_to_roi)) return false;
      if (filters.freeOnly && resource.price_type !== 'Free') return false;
      if (filters.certificationOnly && !resource.has_certification) return false;
      if (filters.founderRecommendedOnly && !resource.is_founder_recommended) return false;
      return true;
    });

    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'price-low':
        result.sort((a, b) => {
          if (a.price_type === 'Free' && b.price_type !== 'Free') return -1;
          if (a.price_type !== 'Free' && b.price_type === 'Free') return 1;
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
    <AppLayout activeTab="resources">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Learning & Development</h1>
          <p className="text-sm text-muted-foreground">High-ROI courses for founders and operators</p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-2">
          <Button
            variant={showBookmarksOnly ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
            className="h-7 text-xs gap-1.5 rounded-full"
          >
            {showBookmarksOnly ? <BookmarkCheck className="h-3.5 w-3.5" /> : <Bookmark className="h-3.5 w-3.5" />}
            {showBookmarksOnly ? 'All Courses' : 'Bookmarks'}
            {bookmarkedIds.size > 0 && <span>({bookmarkedIds.size})</span>}
          </Button>
          <SubmitCourseDialog />
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

        {/* Count */}
        <p className="text-xs text-muted-foreground">
          {filteredResources.length} course{filteredResources.length !== 1 ? 's' : ''}
        </p>

        {/* Results */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : filteredResources.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">
              {showBookmarksOnly 
                ? "No bookmarked courses yet."
                : "No courses match your filters."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
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

        {/* Digest Signup */}
        <div className="mt-8">
          <DigestSignup sourceTab="learning" />
        </div>
      </div>

      <ExitIntentModal sourceTab="learning" />
    </AppLayout>
  );
}
