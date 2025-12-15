import { useState } from 'react';
import { VariationOne } from './variations/VariationOne';
import { VariationTwo } from './variations/VariationTwo';
import { VariationThree } from './variations/VariationThree';
import { Button } from '@/components/ui/button';

export function VariationSwitcher() {
  const [activeVariation, setActiveVariation] = useState<1 | 2 | 3>(1);

  const variations = [
    { id: 1 as const, name: 'Morning Brew', description: 'Single-column newsletter style, scannable sections with emoji headers' },
    { id: 2 as const, name: 'Product Hunt', description: 'Card grid with sidebar, generous whitespace, visual hierarchy' },
    { id: 3 as const, name: 'Notion', description: 'Tab-based navigation, timeline view, flexible filtering' },
  ];

  return (
    <div className="min-h-screen">
      {/* Variation Selector - Sticky */}
      <div className="sticky top-0 z-[100] bg-foreground text-background border-b-2 border-primary">
        <div className="container py-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <span className="text-sm font-medium shrink-0">Compare Layouts:</span>
            <div className="flex flex-wrap gap-2">
              {variations.map((v) => (
                <Button
                  key={v.id}
                  size="sm"
                  variant={activeVariation === v.id ? 'default' : 'outline'}
                  onClick={() => setActiveVariation(v.id)}
                  className={activeVariation === v.id 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-transparent text-background border-background/30 hover:bg-background/10 hover:text-background'
                  }
                >
                  {v.id}. {v.name}
                </Button>
              ))}
            </div>
          </div>
          <p className="text-xs text-background/70 mt-2">
            {variations.find(v => v.id === activeVariation)?.description}
          </p>
        </div>
      </div>

      {/* Active Variation */}
      {activeVariation === 1 && <VariationOne />}
      {activeVariation === 2 && <VariationTwo />}
      {activeVariation === 3 && <VariationThree />}
    </div>
  );
}
