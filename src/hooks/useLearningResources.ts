import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { LearningResource, SkillCategory, LearningFormat, DifficultyLevel, TimeToROI, PriceType } from '@/types/learning';

export function useLearningResources() {
  return useQuery({
    queryKey: ['learning-resources'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('learning_resources')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Map database types to our TypeScript types
      return (data || []).map(resource => ({
        ...resource,
        skill_category: resource.skill_category as SkillCategory,
        format: resource.format as LearningFormat,
        difficulty: resource.difficulty as DifficultyLevel,
        time_to_roi: resource.time_to_roi as TimeToROI,
        price_type: resource.price_type as PriceType,
      })) as LearningResource[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function formatPrice(resource: LearningResource): string {
  if (resource.price_type === 'Free') return 'Free';
  if (resource.price_type === 'Price on website') return 'See website';
  if (resource.price_amount) {
    return `$${(resource.price_amount / 100).toLocaleString()}`;
  }
  return 'Paid';
}
