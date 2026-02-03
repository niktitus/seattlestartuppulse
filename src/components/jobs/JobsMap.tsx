import { useMemo, useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import { Building2, ExternalLink, Loader2, MapPin } from 'lucide-react';
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
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const [isMapReady, setIsMapReady] = useState(false);

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

  // Initialize map using vanilla Leaflet (bypassing react-leaflet context issues)
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Create the map
    const map = L.map(mapContainerRef.current, {
      center: SEATTLE_CENTER,
      zoom: DEFAULT_ZOOM,
      scrollWheelZoom: true,
      minZoom: 9,
      maxZoom: 15,
    });

    // Add tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    }).addTo(map);

    mapRef.current = map;
    setIsMapReady(true);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markersRef.current.clear();
      }
    };
  }, []);

  // Update markers when jobs change
  useEffect(() => {
    if (!mapRef.current || !isMapReady) return;

    const map = mapRef.current;
    const existingMarkers = markersRef.current;
    const currentJobIds = new Set(jobsWithCoords.map(j => j.id));

    // Remove markers for jobs that no longer exist
    existingMarkers.forEach((marker, id) => {
      if (!currentJobIds.has(id)) {
        marker.remove();
        existingMarkers.delete(id);
      }
    });

    // Add or update markers
    jobsWithCoords.forEach(job => {
      const isHovered = hoveredJobId === job.id;
      
      if (existingMarkers.has(job.id)) {
        // Update existing marker icon if hover state changed
        const marker = existingMarkers.get(job.id)!;
        marker.setIcon(createMarkerIcon(job.funding_stage, isHovered));
      } else {
        // Create new marker
        const marker = L.marker([job.lat, job.lng], {
          icon: createMarkerIcon(job.funding_stage, false),
        });

        // Add popup
        const popupContent = `
          <div style="min-width: 200px;">
            <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; margin-bottom: 4px;">
              <div style="flex: 1; min-width: 0;">
                <p style="font-weight: 500; font-size: 14px; margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                  ${job.company_name}
                </p>
                <p style="font-size: 12px; color: #666; margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                  ${job.job_title}
                </p>
              </div>
              <span style="font-size: 12px; background: #f1f5f9; padding: 2px 8px; border-radius: 4px; flex-shrink: 0;">
                ${job.funding_stage}
              </span>
            </div>
            ${job.company_address ? `
              <p style="font-size: 12px; color: #666; display: flex; align-items: center; gap: 4px; margin: 4px 0 0 0;">
                📍 ${job.company_address}
              </p>
            ` : ''}
            <a 
              href="${job.application_url}" 
              target="_blank" 
              rel="noopener noreferrer"
              style="display: inline-flex; align-items: center; gap: 4px; font-size: 12px; color: #2e7d6a; text-decoration: none; margin-top: 8px;"
            >
              Apply →
            </a>
          </div>
        `;

        marker.bindPopup(popupContent, { closeButton: false });
        
        marker.on('mouseover', () => onJobHover(job.id));
        marker.on('mouseout', () => onJobHover(null));
        
        marker.addTo(map);
        existingMarkers.set(job.id, marker);
      }
    });
  }, [jobsWithCoords, hoveredJobId, isMapReady, onJobHover]);

  // Update marker icons when hover state changes
  useEffect(() => {
    if (!isMapReady) return;
    
    markersRef.current.forEach((marker, id) => {
      const job = jobsWithCoords.find(j => j.id === id);
      if (job) {
        const isHovered = hoveredJobId === id;
        marker.setIcon(createMarkerIcon(job.funding_stage, isHovered));
      }
    });
  }, [hoveredJobId, jobsWithCoords, isMapReady]);

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

      {/* Map Container - using vanilla Leaflet */}
      <div className="h-72 relative">
        <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }} />
        {!isMapReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}
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
