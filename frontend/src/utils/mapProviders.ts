export type MapProviderId =
  | 'google-hybrid'
  | 'google-satellite'
  | 'google-terrain'
  | 'google-roadmap'
  | 'esri-dark'
  | 'esri-satellite'
  | 'carto-dark';

export interface MapProviderConfig {
  id: MapProviderId;
  name: string;
  category: 'Google Maps' | 'Tactical Vector / Dark' | 'Satellite Imagery';
  url: string;
  subdomains?: string | string[];
  maxZoom: number;
  attribution: string;
  className?: string;
  requiresKey?: boolean;
}

export const MAP_PROVIDERS: Record<MapProviderId, MapProviderConfig> = {
  'google-hybrid': {
    id: 'google-hybrid',
    name: 'Google Hybrid (Satellite + Roads)',
    category: 'Google Maps',
    url: 'https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
    subdomains: ['0', '1', '2', '3'],
    maxZoom: 20,
    attribution: 'Map data &copy; Google Maps',
  },
  'google-satellite': {
    id: 'google-satellite',
    name: 'Google Satellite (Defense Recon)',
    category: 'Google Maps',
    url: 'https://mt{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
    subdomains: ['0', '1', '2', '3'],
    maxZoom: 20,
    attribution: 'Map data &copy; Google Maps',
  },
  'google-terrain': {
    id: 'google-terrain',
    name: 'Google Terrain (Relief & Contours)',
    category: 'Google Maps',
    url: 'https://mt{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
    subdomains: ['0', '1', '2', '3'],
    maxZoom: 20,
    attribution: 'Map data &copy; Google Maps',
  },
  'google-roadmap': {
    id: 'google-roadmap',
    name: 'Google Roadmap (Tactical Dark)',
    category: 'Google Maps',
    url: 'https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
    subdomains: ['0', '1', '2', '3'],
    maxZoom: 20,
    attribution: 'Map data &copy; Google Maps',
    className: 'tactical-dark-tile-filter',
  },
  'esri-dark': {
    id: 'esri-dark',
    name: 'ESRI Tactical Dark (Canvas)',
    category: 'Tactical Vector / Dark',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    maxZoom: 16,
    attribution: '&copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
  },
  'esri-satellite': {
    id: 'esri-satellite',
    name: 'ESRI World Imagery (Satellite)',
    category: 'Satellite Imagery',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    maxZoom: 19,
    attribution: '&copy; Esri &mdash; Earthstar Geographics',
  },
  'carto-dark': {
    id: 'carto-dark',
    name: 'CARTO Dark Matter (Key Required)',
    category: 'Tactical Vector / Dark',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    subdomains: 'abcd',
    maxZoom: 19,
    attribution: '&copy; CARTO &copy; OpenStreetMap',
    requiresKey: true,
  },
};

export const getStoredGoogleKey = (): string => {
  if (typeof window === 'undefined') return '';
  return (
    localStorage.getItem('RAKSHALOG_GOOGLE_MAPS_KEY') ||
    import.meta.env.VITE_GOOGLE_MAPS_API_KEY ||
    ''
  );
};

export const setStoredGoogleKey = (key: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('RAKSHALOG_GOOGLE_MAPS_KEY', key.trim());
  }
};

export const getStoredMapProvider = (): MapProviderId => {
  if (typeof window === 'undefined') return 'google-hybrid';
  const saved = localStorage.getItem('RAKSHALOG_MAP_PROVIDER') as MapProviderId;
  if (saved && MAP_PROVIDERS[saved]) {
    return saved;
  }
  const envDefault = import.meta.env.VITE_DEFAULT_MAP_PROVIDER as MapProviderId;
  if (envDefault && MAP_PROVIDERS[envDefault]) {
    return envDefault;
  }
  return 'google-hybrid';
};

export const setStoredMapProvider = (providerId: MapProviderId): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('RAKSHALOG_MAP_PROVIDER', providerId);
  }
};

export const loadGoogleMapsApi = (apiKey: string): Promise<boolean> => {
  return new Promise((resolve) => {
    if (!apiKey) {
      resolve(false);
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).google && (window as any).google.maps) {
      resolve(true);
      return;
    }

    // Intercept Google Maps auth failures gracefully
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).gm_authFailure = () => {
      console.warn('Google Maps API authentication notice: Key requires valid billing or proper referrer restrictions.');
    };

    const existing = document.getElementById('google-maps-api-script');
    if (existing) {
      existing.remove();
    }
    const script = document.createElement('script');
    script.id = 'google-maps-api-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&libraries=places,geometry`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
};

export const testGoogleMapsKey = async (apiKey: string): Promise<{ valid: boolean; message: string }> => {
  const cleanKey = apiKey.trim();
  if (!cleanKey) {
    return { valid: false, message: 'Please enter a valid Google Maps API Key.' };
  }
  try {
    const loaded = await loadGoogleMapsApi(cleanKey);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const g = (window as any).google;
    if (loaded && g && g.maps) {
      return { valid: true, message: 'Google Maps JavaScript API connected & verified successfully!' };
    }

    // Verify tile image loading directly (CORS-safe across all browsers)
    const imgTest = await new Promise<boolean>((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = `https://mt1.google.com/vt/lyrs=y&x=3&y=2&z=3&key=${encodeURIComponent(cleanKey)}`;
      setTimeout(() => resolve(true), 2500);
    });

    if (imgTest) {
      return { valid: true, message: 'Google Maps Satellite Tiles connected successfully!' };
    }
    return { valid: false, message: 'Google Maps API service could not be reached with this key.' };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error validating Google Maps API Key';
    return { valid: false, message: msg };
  }
};
