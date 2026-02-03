// Geocoding utilities for Seattle-area addresses
// Since we don't have a geocoding API, we use approximate coordinates for Seattle neighborhoods

const SEATTLE_CENTER = { lat: 47.6062, lng: -122.3321 };

// Seattle neighborhood approximate coordinates
const SEATTLE_NEIGHBORHOODS: Record<string, { lat: number; lng: number }> = {
  'downtown': { lat: 47.6062, lng: -122.3321 },
  'south lake union': { lat: 47.6264, lng: -122.3366 },
  'capitol hill': { lat: 47.6253, lng: -122.3222 },
  'fremont': { lat: 47.6510, lng: -122.3505 },
  'ballard': { lat: 47.6686, lng: -122.3855 },
  'university district': { lat: 47.6588, lng: -122.3130 },
  'queen anne': { lat: 47.6324, lng: -122.3570 },
  'wallingford': { lat: 47.6615, lng: -122.3345 },
  'green lake': { lat: 47.6805, lng: -122.3287 },
  'pioneer square': { lat: 47.6018, lng: -122.3321 },
  'belltown': { lat: 47.6132, lng: -122.3457 },
  'eastlake': { lat: 47.6347, lng: -122.3258 },
  'sodo': { lat: 47.5808, lng: -122.3337 },
  'interbay': { lat: 47.6420, lng: -122.3780 },
  'magnolia': { lat: 47.6393, lng: -122.4001 },
  'west seattle': { lat: 47.5665, lng: -122.3870 },
  'columbia city': { lat: 47.5598, lng: -122.2872 },
  'beacon hill': { lat: 47.5684, lng: -122.3093 },
  'rainier valley': { lat: 47.5281, lng: -122.2848 },
  'northgate': { lat: 47.7056, lng: -122.3295 },
  // Eastside cities
  'bellevue': { lat: 47.6101, lng: -122.2015 },
  'kirkland': { lat: 47.6815, lng: -122.2087 },
  'redmond': { lat: 47.6740, lng: -122.1215 },
  'bothell': { lat: 47.7621, lng: -122.2053 },
  'issaquah': { lat: 47.5301, lng: -122.0326 },
  'woodinville': { lat: 47.7543, lng: -122.1635 },
  // South King County
  'renton': { lat: 47.4829, lng: -122.2171 },
  'kent': { lat: 47.3809, lng: -122.2348 },
  'tukwila': { lat: 47.4740, lng: -122.2610 },
  'seatac': { lat: 47.4435, lng: -122.2961 },
  'federal way': { lat: 47.3223, lng: -122.3126 },
  // North
  'shoreline': { lat: 47.7557, lng: -122.3415 },
  'lynnwood': { lat: 47.8209, lng: -122.3151 },
  'edmonds': { lat: 47.8107, lng: -122.3774 },
  'everett': { lat: 47.9790, lng: -122.2021 },
  'burien': { lat: 47.4704, lng: -122.3468 },
};

// Common street indicators to help with parsing
const STREET_TYPES = ['st', 'ave', 'blvd', 'rd', 'way', 'dr', 'pl', 'ct', 'ln', 'pkwy'];

/**
 * Attempts to geocode a Seattle-area address to approximate coordinates.
 * Falls back to a random position near downtown Seattle if no match found.
 */
export function geocodeSeattleAddress(address: string | null): { lat: number; lng: number } {
  if (!address) {
    return addRandomOffset(SEATTLE_CENTER, 0.03);
  }

  const addressLower = address.toLowerCase();

  // Check for neighborhood/city matches
  for (const [name, coords] of Object.entries(SEATTLE_NEIGHBORHOODS)) {
    if (addressLower.includes(name)) {
      return addRandomOffset(coords, 0.008);
    }
  }

  // Check for common Seattle zip codes and map to approximate areas
  const zipMatch = address.match(/\b(98\d{3})\b/);
  if (zipMatch) {
    const zipCoords = getZipCodeCoords(zipMatch[1]);
    if (zipCoords) {
      return addRandomOffset(zipCoords, 0.008);
    }
  }

  // Default: random position in greater Seattle area
  return addRandomOffset(SEATTLE_CENTER, 0.04);
}

/**
 * Seattle-area zip code to approximate coordinates
 */
function getZipCodeCoords(zip: string): { lat: number; lng: number } | null {
  const zipCodes: Record<string, { lat: number; lng: number }> = {
    '98101': { lat: 47.6062, lng: -122.3321 }, // Downtown
    '98102': { lat: 47.6253, lng: -122.3222 }, // Capitol Hill
    '98103': { lat: 47.6615, lng: -122.3345 }, // Wallingford/Fremont
    '98104': { lat: 47.6018, lng: -122.3321 }, // Pioneer Square
    '98105': { lat: 47.6588, lng: -122.3130 }, // U District
    '98107': { lat: 47.6686, lng: -122.3855 }, // Ballard
    '98109': { lat: 47.6264, lng: -122.3366 }, // South Lake Union
    '98112': { lat: 47.6325, lng: -122.3070 }, // Madison Park
    '98115': { lat: 47.6856, lng: -122.2983 }, // View Ridge
    '98116': { lat: 47.5665, lng: -122.3870 }, // West Seattle
    '98117': { lat: 47.6900, lng: -122.3883 }, // Crown Hill
    '98118': { lat: 47.5450, lng: -122.2870 }, // Rainier Beach
    '98119': { lat: 47.6393, lng: -122.3660 }, // Queen Anne
    '98121': { lat: 47.6132, lng: -122.3457 }, // Belltown
    '98122': { lat: 47.6130, lng: -122.3050 }, // Central District
    '98125': { lat: 47.7165, lng: -122.3100 }, // Lake City
    '98126': { lat: 47.5450, lng: -122.3720 }, // Delridge
    '98133': { lat: 47.7420, lng: -122.3450 }, // Bitter Lake
    '98134': { lat: 47.5808, lng: -122.3337 }, // SODO
    '98136': { lat: 47.5340, lng: -122.3860 }, // Alki
    '98144': { lat: 47.5850, lng: -122.2990 }, // Mount Baker
    '98199': { lat: 47.6510, lng: -122.4000 }, // Magnolia
    // Eastside
    '98004': { lat: 47.6180, lng: -122.2075 }, // Bellevue Downtown
    '98005': { lat: 47.5985, lng: -122.1650 }, // Bellevue SE
    '98006': { lat: 47.5510, lng: -122.1520 }, // Bellevue S
    '98007': { lat: 47.6120, lng: -122.1480 }, // Bellevue E
    '98008': { lat: 47.6100, lng: -122.1150 }, // Bellevue NE
    '98033': { lat: 47.6815, lng: -122.2087 }, // Kirkland
    '98034': { lat: 47.7165, lng: -122.2070 }, // Kirkland N
    '98052': { lat: 47.6740, lng: -122.1215 }, // Redmond
    '98053': { lat: 47.6850, lng: -122.0320 }, // Redmond E
  };

  return zipCodes[zip] || null;
}

/**
 * Add a random offset to coordinates to prevent pin stacking
 */
function addRandomOffset(
  coords: { lat: number; lng: number },
  maxOffset: number
): { lat: number; lng: number } {
  const latOffset = (Math.random() - 0.5) * 2 * maxOffset;
  const lngOffset = (Math.random() - 0.5) * 2 * maxOffset;
  
  return {
    lat: coords.lat + latOffset,
    lng: coords.lng + lngOffset,
  };
}

/**
 * Create a deterministic position based on company name hash
 * Useful for consistent placement across renders
 */
export function hashBasedPosition(
  companyName: string,
  center = SEATTLE_CENTER,
  spread = 0.06
): { lat: number; lng: number } {
  let hash = 0;
  for (let i = 0; i < companyName.length; i++) {
    hash = ((hash << 5) - hash) + companyName.charCodeAt(i);
    hash = hash & hash;
  }
  
  // Use hash to create deterministic but varied positions
  const latOffset = ((hash % 1000) / 1000 - 0.5) * spread;
  const lngOffset = (((hash >> 10) % 1000) / 1000 - 0.5) * spread;
  
  return {
    lat: center.lat + latOffset,
    lng: center.lng + lngOffset,
  };
}
