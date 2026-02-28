
# Add Real Map to Jobs Tab

## Problem
The current Jobs map component is a placeholder that only shows colored dots on a gray background with a grid pattern. It's not an actual map - just a visual representation with pseudo-random pin positions.

## Solution
Replace the placeholder with a real interactive map using **React-Leaflet** (free, open-source, uses OpenStreetMap tiles). The map will center on Seattle and display job pins at their actual or approximate locations.

---

## Implementation Steps

### 1. Install Dependencies
Add the required packages:
- `react-leaflet` - React components for Leaflet maps
- `leaflet` - The core mapping library
- `@types/leaflet` - TypeScript definitions

### 2. Add Leaflet CSS
Import the required Leaflet styles in `index.css` to ensure the map tiles and markers render correctly.

### 3. Update JobsMap Component
Replace the placeholder with a real map:
- Use `MapContainer` centered on Seattle (47.6062, -122.3321)
- Add OpenStreetMap tile layer (free, no API key required)
- Create custom markers for each job using `divIcon` with the existing color scheme
- Keep the hover interaction and tooltips
- Maintain the funding stage legend

### 4. Handle Missing Coordinates
Since jobs may not have lat/lng coordinates:
- Create a geocoding utility that converts Seattle-area addresses to approximate coordinates
- For jobs without addresses, scatter them around downtown Seattle with slight random offsets
- This keeps the visual density while being honest about approximate locations

---

## Technical Details

**Map Configuration:**
- Center: Seattle (47.6062, -122.3321)
- Default zoom: 11 (shows greater Seattle area)
- Min/max zoom bounds to keep focus on Seattle
- Grayscale or muted tile style to match the minimalist design

**Marker Design:**
- Custom circular div markers matching existing color scheme
- Size: 12px diameter with 2px border
- Hover state: Scale up with ring effect (same as current)
- Popup on hover showing company info (same content as current tooltip)

**Tile Layer Options:**
- OpenStreetMap (default, free)
- CartoDB Positron (grayscale, minimalist - recommended for the design)
- Stamen Toner (high contrast black/white)

---

## Files to Modify

| File | Changes |
|------|---------|
| `package.json` | Add `react-leaflet`, `leaflet`, `@types/leaflet` |
| `src/index.css` | Import Leaflet CSS |
| `src/components/jobs/JobsMap.tsx` | Replace with React-Leaflet implementation |
| `src/lib/geocoding.ts` | New utility for address-to-coordinates (optional) |

---

## Visual Preview

The map will show:
```
+------------------------------------------+
|  🟢 Seattle Area          12 companies   |
+------------------------------------------+
|                                          |
|   [Interactive OpenStreetMap]            |
|                                          |
|     🟢    🟡                             |
|           Seattle  🟢                    |
|        🔵                                |
|     🟢      🟡                           |
|                                          |
+------------------------------------------+
| ● Pre-seed 3  ● Seed 4  ● Series A 2    |
+------------------------------------------+
```

---

## Notes
- No API key required (uses free OpenStreetMap tiles)
- CartoDB Positron tiles recommended for the minimalist aesthetic
- All existing hover interactions and tooltips preserved
- Mobile-friendly with touch zoom/pan support
