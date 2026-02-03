import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface BenchmarkData {
  stage: string;
  description: string;
  typicalRoles: string;
  salaryRanges: { role: string; range: string; equity: string }[];
}

const benchmarks: BenchmarkData[] = [
  {
    stage: 'Pre-seed',
    description: 'Earliest stage - usually just the founding team',
    typicalRoles: 'Generalists, co-founders, founding engineers',
    salaryRanges: [
      { role: 'Founding Engineer', range: '$100-140K', equity: '1-3%' },
      { role: 'First Hire', range: '$80-120K', equity: '0.5-2%' },
    ],
  },
  {
    stage: 'Seed',
    description: 'First institutional funding, building initial team',
    typicalRoles: 'First specialized hires, eng leads, first sales',
    salaryRanges: [
      { role: 'Software Engineer', range: '$120-160K', equity: '0.5-1.5%' },
      { role: 'First Sales Hire', range: '$80-120K + OTE', equity: '0.25-0.75%' },
      { role: 'Product Manager', range: '$110-150K', equity: '0.25-0.75%' },
    ],
  },
  {
    stage: 'Series A',
    description: 'Scaling the core team with department leads',
    typicalRoles: 'Department heads, managers, senior ICs',
    salaryRanges: [
      { role: 'Senior Engineer', range: '$140-180K', equity: '0.15-0.5%' },
      { role: 'Engineering Manager', range: '$160-200K', equity: '0.2-0.5%' },
      { role: 'Product Manager', range: '$130-180K', equity: '0.15-0.4%' },
    ],
  },
  {
    stage: 'Series B+',
    description: 'Mature org structure with VP-level roles',
    typicalRoles: 'VPs, Directors, specialized senior roles',
    salaryRanges: [
      { role: 'VP Engineering', range: '$200-280K', equity: '0.25-0.75%' },
      { role: 'Staff Engineer', range: '$180-250K', equity: '0.1-0.3%' },
      { role: 'Director of Product', range: '$180-250K', equity: '0.15-0.4%' },
    ],
  },
];

export function StageBenchmarkTooltip() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <Info className="h-4 w-4" />
          Salary Benchmarks
        </button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="w-96 p-0">
        <div className="p-3 border-b">
          <p className="font-medium">Typical Compensation by Stage</p>
          <p className="text-xs text-muted-foreground">Seattle startup benchmarks (2024)</p>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {benchmarks.map((b) => (
            <div key={b.stage} className="p-3 border-b last:border-0">
              <p className="font-medium text-sm">{b.stage}</p>
              <p className="text-xs text-muted-foreground mb-2">{b.typicalRoles}</p>
              <div className="space-y-1">
                {b.salaryRanges.map((r, i) => (
                  <div key={i} className="flex justify-between text-xs">
                    <span>{r.role}</span>
                    <span className="text-muted-foreground">
                      {r.range} + {r.equity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

export function StageRolesTooltip() {
  const stageRoles = [
    { stage: 'Pre-seed', roles: 'Generalists, founding team roles, anyone who can wear multiple hats' },
    { stage: 'Seed', roles: 'First specialized hires - engineering, sales, product' },
    { stage: 'Series A', roles: 'Department leads, managers, senior individual contributors' },
    { stage: 'Series B+', roles: 'VP-level roles, directors, highly specialized positions' },
    { stage: 'Bootstrapped', roles: 'Varies widely - often lean teams with experienced operators' },
  ];

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <Info className="h-4 w-4" />
          Stage-Appropriate Roles
        </button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="w-80 p-0">
        <div className="p-3 border-b">
          <p className="font-medium">What to Expect by Stage</p>
        </div>
        <div className="p-3 space-y-3">
          {stageRoles.map((s) => (
            <div key={s.stage}>
              <p className="font-medium text-sm">{s.stage}</p>
              <p className="text-xs text-muted-foreground">{s.roles}</p>
            </div>
          ))}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
