import { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Building2, ExternalLink } from 'lucide-react';
import type { StartupJob } from '@/types/jobs';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { geocodeSeattleAddress, hashBasedPosition } from '@/lib/geocoding';

// Seattle center coordinates
const SEATTLE_CENTER: [number, number] = [47.6062, -122.3321];
const DEFAULT_ZOOM = 11;

// Funding stage colors - matching the primary green scale
const STAGE_COLORS: Record<string, string> = {
  'Pre-seed': 'hsl(158, 64%, 32%, 0.4)',
  'Seed': 'hsl(158, 64%, 32%, 0.6)',
  'Series A': 'hsl(158, 64%, 32%, 0.8)',
  'Series B': 'hsl(158, 64%, 32%, 1)',
  'Series C+': 'hsl(158, 64%, 32%, 1)',
  'Bootstrapped': 'hsl(160, 10%, 45%, 0.5)',
};

const STAGE_BG_CLASSES: Record<string, string> = {
  'Pre-seed': 'bg-primary/40',
  'Seed': 'bg-primary/60',
  'Series A': 'bg-primary/80',
  'Series B': 'bg-primary',
  'Series C+': 'bg-primary',
  'Bootstrapped': 'bg-muted-foreground/50',
};

interface JobsMapProps {
  jobs: StartupJob[];
  hoveredJobId: string | null;
  onJobHover: (id: string | null) => void;
}

// Create custom icon for a job marker
function createMarkerIcon(fundingStage: string, isHovered: boolean) {
  const color = STAGE_COLORS[fundingStage] || 'hsl(160, 10%, 45%, 0.5)';
  const size = isHovered ? 18 : 12;
  const borderWidth = isHovered ? 3 : 2;
  const ring = isHovered ? 'box-shadow: 0 0 0 3px hsl(158, 64%, 32%, 0.3);' : '';
  
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      border: ${borderWidth}px solid white;
      border-radius: 50%;
      ${ring}
      transition: all 0.2s ease;
      cursor: pointer;
    "></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

export default function JobsMap({ jobs, hoveredJobId, onJobHover }: JobsMapProps) {
  // Group jobs by funding stage for the legend
  const jobsByStage = useMemo(() => {
    const grouped: Record<string, number> = {};
    jobs.forEach(job => {
      grouped[job.funding_stage] = (grouped[job.funding_stage] || 0) + 1;
    });
    return grouped;
  }, [jobs]);

  // Calculate job positions
  const jobsWithCoords = useMemo(() => {
    return jobs.map(job => {
      const coords = job.company_address 
        ? geocodeSeattleAddress(job.company_address)
        : hashBasedPosition(job.company_name);
      
      return { ...job, lat: coords.lat, lng: coords.lng };
    });
  }, [jobs]);

  return (
    <div className="bg-card border border-border overflow-hidden">
      {/* Map Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-sm font-medium text-foreground">Seattle Area</span>
          </div>
          <span className="text-xs text-muted-foreground">{jobs.length} companies</span>
        </div>
      </div>

      {/* Map Container */}
      <div className="h-72">
        <MapContainer
          center={SEATTLE_CENTER}
          zoom={DEFAULT_ZOOM}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
          minZoom={9}
          maxZoom={15}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
          {jobsWithCoords.map(job => {
            const isHovered = hoveredJobId === job.id;
            
            return (
              <Marker
                key={job.id}
                position={[job.lat, job.lng]}
                icon={createMarkerIcon(job.funding_stage, isHovered)}
                eventHandlers={{
                  mouseover: () => onJobHover(job.id),
                  mouseout: () => onJobHover(null),
                }}
              >
                <Popup closeButton={false}>
                  <div className="min-w-[200px]">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-foreground truncate">
                          {job.company_name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {job.job_title}
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-xs shrink-0">
                        {job.funding_stage}
                      </Badge>
                    </div>
                    {job.company_address && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Building2 className="h-3 w-3" />
                        {job.company_address}
                      </p>
                    )}
                    <a
                      href={job.application_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      Apply <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* Legend */}
      <div className="p-4 border-t border-border">
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {Object.entries(jobsByStage).map(([stage, count]) => (
            <div key={stage} className="flex items-center gap-1.5">
              <div className={cn('w-2 h-2 rounded-full', STAGE_BG_CLASSES[stage])} />
              <span className="text-xs text-muted-foreground">
                {stage} <span className="font-medium text-foreground">{count}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
