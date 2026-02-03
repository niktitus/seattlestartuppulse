import { ExternalLink, Star, Award, Clock, Zap, GraduationCap, Bookmark, BookmarkCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { LearningResource } from '@/types/learning';
import { CATEGORY_COLORS } from '@/types/learning';
import { formatPrice } from '@/hooks/useLearningResources';

interface LearningCardProps {
  resource: LearningResource;
  isBookmarked: boolean;
  onBookmark: (id: string) => void;
}

export default function LearningCard({ resource, isBookmarked, onBookmark }: LearningCardProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-5 transition-all hover:shadow-card-hover">
      {/* Badges Row */}
      <div className="flex items-center gap-2 flex-wrap mb-3">
        <Badge className={CATEGORY_COLORS[resource.skill_category]}>
          {resource.skill_category}
        </Badge>
        <Badge variant="muted">{resource.format}</Badge>
        <Badge variant="outline">{resource.difficulty}</Badge>
        
        {/* Special Badges */}
        {resource.is_free && (
          <Badge className="bg-primary/10 text-primary border-0">
            Free
          </Badge>
        )}
        {resource.has_certification && (
          <Badge className="bg-accent text-accent-foreground border-0 flex items-center gap-1">
            <Award className="h-3 w-3" />
            Certification
          </Badge>
        )}
        {resource.is_founder_recommended && (
          <Badge className="bg-secondary/20 text-secondary-foreground border-secondary/30 flex items-center gap-1">
            <Star className="h-3 w-3 fill-current" />
            Founder Recommended
          </Badge>
        )}
      </div>

      {/* Course Name */}
      <h3 className="font-semibold text-lg text-foreground mb-2">{resource.course_name}</h3>

      {/* Instructor */}
      <p className="text-sm text-muted-foreground mb-2">
        by{' '}
        {resource.instructor_linkedin ? (
          <a 
            href={resource.instructor_linkedin} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            {resource.instructor_name}
          </a>
        ) : (
          <span className="font-medium">{resource.instructor_name}</span>
        )}
      </p>

      {/* Description */}
      {resource.description && (
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{resource.description}</p>
      )}

      {/* Meta Row */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4 flex-wrap">
        {resource.time_commitment && (
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {resource.time_commitment}
          </span>
        )}
        <span className="flex items-center gap-1">
          {resource.time_to_roi === 'Apply immediately' ? (
            <>
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-primary font-medium">Apply immediately</span>
            </>
          ) : (
            <>
              <GraduationCap className="h-4 w-4" />
              Long-term skill building
            </>
          )}
        </span>
      </div>

      {/* Price and Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="text-lg font-semibold text-foreground">
          {formatPrice(resource)}
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onBookmark(resource.id)}
            className="h-9 w-9"
          >
            {isBookmarked ? (
              <BookmarkCheck className="h-5 w-5 text-primary" />
            ) : (
              <Bookmark className="h-5 w-5" />
            )}
          </Button>
          
          <Button asChild>
            <a 
              href={resource.course_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5"
            >
              View Course
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>

      {/* Last Updated */}
      <p className="text-xs text-muted-foreground mt-3">
        Last updated: {new Date(resource.updated_at).toLocaleDateString()}
      </p>
    </div>
  );
}
