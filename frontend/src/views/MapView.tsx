import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { useApp } from '../context/AppContext';
import {
  Layers,
  Truck,
  Navigation,
  AlertTriangle,
  CheckCircle,
  Compass,
  MapPin,
  Key,
} from 'lucide-react';
import {
  MAP_PROVIDERS,
  MapProviderId,
  getStoredGoogleKey,
  getStoredMapProvider,
  setStoredMapProvider,
  loadGoogleMapsApi,
} from '../utils/mapProviders';
import { GoogleMapsModal } from '../components/GoogleMapsModal';

export const MapView: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layersGroupRef = useRef<L.LayerGroup | null>(null);
  const currentTileLayerRef = useRef<L.TileLayer | null>(null);

  const {
    nodes,
    convoys,
    passK4Blocked,
    selectedConvoy,
    setSelectedConvoy,
    rerouteConvoy,
    playTacticalSound,
  } = useApp();

  const [activeLayers, setActiveLayers] = useState({
    depots: true,
    posts: true,
    convoys: true,
    hazards: true,
    routes: true,
  });

  const [currentProvider, setCurrentProvider] = useState<MapProviderId>(getStoredMapProvider);
  const [googleApiKey, setGoogleApiKey] = useState<string>(getStoredGoogleKey);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  const [chosenOption, setChosenOption] = useState<'OPT-A' | 'OPT-B'>('OPT-A');
  const [rerouteConfirmed, setRerouteConfirmed] = useState(false);

  // Initialize Leaflet Map
  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container) return;

    // Reset leaflet instance id if container was previously mounted
    if ((container as unknown as { _leaflet_id?: number | null })._leaflet_id) {
      (container as unknown as { _leaflet_id?: number | null })._leaflet_id = null;
    }

    if (!mapInstanceRef.current) {
      // Sector Trishul coordinates (High altitude Himalayan sector)
      const map = L.map(container, {
        center: [34.42, 76.75],
        zoom: 10,
        zoomControl: false,
        attributionControl: false,
      });

      // Add Zoom control to bottom right
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      mapInstanceRef.current = map;
      layersGroupRef.current = L.layerGroup().addTo(map);
      setMapReady(true);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        layersGroupRef.current = null;
        currentTileLayerRef.current = null;
        setMapReady(false);
      }
      if (container) {
        (container as unknown as { _leaflet_id?: number | null })._leaflet_id = null;
      }
    };
  }, []);

  // Dynamically update basemap tile layer (Google Maps / ESRI / Carto)
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current) return;

    const map = mapInstanceRef.current;

    // Remove existing tile layer if present
    if (currentTileLayerRef.current) {
      map.removeLayer(currentTileLayerRef.current);
      currentTileLayerRef.current = null;
    }

    const providerConfig = MAP_PROVIDERS[currentProvider] || MAP_PROVIDERS['google-hybrid'];
    let tileUrl = providerConfig.url;

    // Attach Google key or Carto key if configured
    if (providerConfig.id.startsWith('google') && googleApiKey) {
      tileUrl += `${tileUrl.includes('?') ? '&' : '?'}key=${encodeURIComponent(googleApiKey)}`;
    } else if (providerConfig.id === 'carto-dark' && import.meta.env.VITE_CARTO_API_KEY) {
      tileUrl += `?api_key=${encodeURIComponent(import.meta.env.VITE_CARTO_API_KEY)}`;
    }

    const tileOptions: L.TileLayerOptions = {
      maxZoom: providerConfig.maxZoom,
      attribution: providerConfig.attribution,
      className: providerConfig.className,
    };

    if (providerConfig.subdomains) {
      tileOptions.subdomains = providerConfig.subdomains;
    }

    const newTileLayer = L.tileLayer(tileUrl, tileOptions).addTo(map);
    currentTileLayerRef.current = newTileLayer;

    // Load Google Maps JS SDK if key is provided
    if (googleApiKey) {
      loadGoogleMapsApi(googleApiKey);
    }
  }, [mapReady, currentProvider, googleApiKey]);

  // Render Map Overlays, Markers & Routes
  useEffect(() => {
    if (!mapInstanceRef.current || !layersGroupRef.current) return;

    const group = layersGroupRef.current;
    group.clearLayers();

    // 1. Draw Routes
    if (activeLayers.routes) {
      // Route Trishul-Main (Depot Garuda -> Pass K-4 -> FP Agni)
      const mainRouteCoords: [number, number][] = [
        [34.3120, 76.5120], // Base Garuda
        [34.3600, 76.6200],
        [34.4100, 76.7200], // Pass K-4
        [34.4700, 76.8500],
        [34.5218, 76.9842], // FP Agni
      ];

      // If Pass K4 is blocked, color red / dashed
      L.polyline(mainRouteCoords, {
        color: passK4Blocked ? '#EF4444' : '#06B6D4',
        weight: 3.5,
        opacity: passK4Blocked ? 0.7 : 0.85,
        dashArray: passK4Blocked ? '6, 8' : undefined,
      }).addTo(group);

      // Alternate Bypass Route (Valley Bypass Route-9)
      const bypassCoords: [number, number][] = [
        [34.3600, 76.6200],
        [34.3850, 76.7200],
        [34.4300, 76.8800],
        [34.5218, 76.9842],
      ];

      L.polyline(bypassCoords, {
        color: '#10B981',
        weight: 3,
        opacity: 0.85,
        dashArray: '4, 6',
      }).addTo(group);

      // Secondary Route to FP Himmat
      const himmatRouteCoords: [number, number][] = [
        [34.3120, 76.5120],
        [34.3600, 76.6500],
        [34.4250, 76.8400],
      ];

      L.polyline(himmatRouteCoords, {
        color: '#0284C7',
        weight: 2.5,
        opacity: 0.6,
      }).addTo(group);
    }

    // 2. Hazard Marker: Pass K-4
    if (activeLayers.hazards && passK4Blocked) {
      const hazardIcon = L.divIcon({
        className: 'custom-hazard-marker',
        html: `
          <div class="relative flex items-center justify-center">
            <span class="absolute w-8 h-8 rounded-full bg-red-500/30 animate-ping"></span>
            <div class="w-7 h-7 rounded bg-red-950 border-2 border-red-500 flex items-center justify-center text-red-200 text-xs font-bold shadow-lg shadow-red-950">
              ⚠️
            </div>
            <div class="absolute top-8 bg-red-950/90 border border-red-700 text-red-200 text-[10px] font-mono px-1.5 py-0.5 rounded whitespace-nowrap">
              PASS K-4 (BLOCKED)
            </div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      L.marker([34.4100, 76.7200], { icon: hazardIcon })
        .addTo(group)
        .bindTooltip('<b>Pass K-4 Alert</b><br/>Landslide: 420T Rockfall<br/>Status: IMPASSABLE');
    }

    // 3. Nodes Markers (Depots & Forward Posts)
    nodes.forEach((node) => {
      const isDepot = node.type === 'BASE_DEPOT';
      const isCritical = node.status === 'CRITICAL';

      const nodeIcon = L.divIcon({
        className: 'custom-node-marker',
        html: `
          <div class="relative flex items-center justify-center cursor-pointer">
            <div class="w-6 h-6 rounded-md ${
              isDepot
                ? 'bg-cyan-950 border-2 border-cyan-400 text-cyan-300'
                : isCritical
                ? 'bg-red-950 border-2 border-red-500 text-red-300 animate-pulse'
                : 'bg-slate-900 border-2 border-emerald-500 text-emerald-300'
            } flex items-center justify-center text-[11px] font-mono font-bold shadow-md">
              ${isDepot ? 'HQ' : 'FP'}
            </div>
            <div class="absolute top-6 bg-slate-950/90 border border-slate-700 text-slate-200 text-[10px] font-mono px-1.5 py-0.2 rounded whitespace-nowrap">
              ${node.name.replace('Forward Post ', 'FP ')}
            </div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      L.marker(node.coordinates, { icon: nodeIcon })
        .addTo(group)
        .bindTooltip(
          `<b>${node.name}</b><br/>Elevation: ${node.elevationFt} ft<br/>Fuel DOS: ${node.dosClassIII.toFixed(1)}d<br/>Status: ${node.status}`
        );
    });

    // 4. Convoys Markers
    if (activeLayers.convoys) {
      convoys.forEach((convoy) => {
        const isSelected = selectedConvoy?.id === convoy.id;
        const isDiverted = convoy.status === 'DIVERTED';

        const convoyIcon = L.divIcon({
          className: 'custom-convoy-marker',
          html: `
            <div class="relative flex items-center justify-center cursor-pointer">
              <span class="absolute w-8 h-8 rounded-full ${
                isDiverted ? 'bg-emerald-500/30' : 'bg-cyan-500/30'
              } animate-ping"></span>
              <div class="w-7 h-7 rounded-full ${
                isDiverted ? 'bg-emerald-950 border-2 border-emerald-400' : 'bg-cyan-950 border-2 border-cyan-400'
              } ${isSelected ? 'ring-2 ring-cyan-300' : ''} flex items-center justify-center text-white text-xs shadow-lg">
                🚛
              </div>
              <div class="absolute -top-5 bg-slate-950 border border-cyan-600 text-cyan-300 text-[9px] font-mono px-1 rounded whitespace-nowrap">
                ${convoy.callsign}
              </div>
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        const marker = L.marker(convoy.coordinates, { icon: convoyIcon }).addTo(group);
        marker.on('click', () => {
          setSelectedConvoy(convoy);
          playTacticalSound('beep');
        });
      });
    }
  }, [nodes, convoys, passK4Blocked, activeLayers, selectedConvoy, playTacticalSound, setSelectedConvoy]);

  const handleTransmitReroute = () => {
    if (selectedConvoy) {
      rerouteConvoy(selectedConvoy.id, chosenOption);
      setRerouteConfirmed(true);
      setTimeout(() => setRerouteConfirmed(false), 3000);
    }
  };

  const handleProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value as MapProviderId;
    setCurrentProvider(next);
    setStoredMapProvider(next);
  };

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col lg:flex-row overflow-hidden bg-[#0B0F19]">
      {/* Map Canvas */}
      <div className="flex-1 relative h-full">
        <div ref={mapContainerRef} className="w-full h-full z-10" />

        {/* Map Header Overlay Controls */}
        <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2 max-w-[90%]">
          {/* GIS Command Bar */}
          <div className="glass-panel px-3 py-1.5 rounded-lg border border-slate-800 flex flex-wrap items-center gap-3 text-xs font-mono text-slate-300 shadow-lg">
            <span className="flex items-center space-x-1.5 text-cyan-400">
              <Compass className="w-4 h-4 animate-spin-slow" />
              <span className="font-bold">GIS LOGISTICS COMMAND</span>
            </span>

            <span className="text-slate-600 hidden sm:inline">|</span>

            {/* Tactical Basemap Switcher */}
            <div className="flex items-center space-x-1.5 bg-slate-900/90 border border-slate-700 rounded-md px-2 py-0.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <select
                value={currentProvider}
                onChange={handleProviderChange}
                className="bg-transparent text-cyan-300 text-[11px] font-mono focus:outline-none cursor-pointer pr-1"
                title="Switch GIS Basemap Layer"
              >
                <optgroup label="Google Maps (Himalayas High-Res)">
                  <option value="google-hybrid" className="bg-[#0B0F19] text-white">
                    Google Hybrid (Satellite + Roads)
                  </option>
                  <option value="google-satellite" className="bg-[#0B0F19] text-white">
                    Google Satellite (Defense Recon)
                  </option>
                  <option value="google-terrain" className="bg-[#0B0F19] text-white">
                    Google Terrain (Elevation Contours)
                  </option>
                  <option value="google-roadmap" className="bg-[#0B0F19] text-white">
                    Google Road (Tactical Dark)
                  </option>
                </optgroup>
                <optgroup label="Tactical Canvas & Satellite">
                  <option value="esri-dark" className="bg-[#0B0F19] text-white">
                    ESRI Tactical Dark
                  </option>
                  <option value="esri-satellite" className="bg-[#0B0F19] text-white">
                    ESRI World Imagery
                  </option>
                  <option value="carto-dark" className="bg-[#0B0F19] text-white">
                    CARTO Dark Matter
                  </option>
                </optgroup>
              </select>
            </div>

            <span className="text-slate-600 hidden sm:inline">|</span>

            {/* Feature Layers */}
            <div className="flex items-center space-x-3 text-[11px]">
              <label className="flex items-center space-x-1 cursor-pointer hover:text-white">
                <input
                  type="checkbox"
                  checked={activeLayers.routes}
                  onChange={(e) => setActiveLayers({ ...activeLayers, routes: e.target.checked })}
                  className="rounded bg-slate-800 text-cyan-500 cursor-pointer"
                />
                <span>Routes</span>
              </label>
              <label className="flex items-center space-x-1 cursor-pointer hover:text-white">
                <input
                  type="checkbox"
                  checked={activeLayers.convoys}
                  onChange={(e) => setActiveLayers({ ...activeLayers, convoys: e.target.checked })}
                  className="rounded bg-slate-800 text-cyan-500 cursor-pointer"
                />
                <span>Convoys</span>
              </label>
              <label className="flex items-center space-x-1 cursor-pointer hover:text-white">
                <input
                  type="checkbox"
                  checked={activeLayers.hazards}
                  onChange={(e) => setActiveLayers({ ...activeLayers, hazards: e.target.checked })}
                  className="rounded bg-slate-800 text-cyan-500 cursor-pointer"
                />
                <span>Hazards</span>
              </label>
            </div>
          </div>

          {/* Google Maps API Button */}
          <button
            onClick={() => setIsGoogleModalOpen(true)}
            className="glass-panel px-3 py-1.5 rounded-lg border border-cyan-500/40 hover:border-cyan-400 bg-cyan-950/20 hover:bg-cyan-950/50 text-xs font-mono text-cyan-300 flex items-center space-x-2 transition-all shadow-lg group cursor-pointer"
            title="Configure Google Maps API Key and Satellite Layers"
          >
            <div className="relative flex items-center justify-center">
              <span
                className={`w-2 h-2 rounded-full ${
                  googleApiKey ? 'bg-emerald-400' : 'bg-cyan-400 animate-ping'
                }`}
              />
              <span
                className={`w-2 h-2 rounded-full absolute ${
                  googleApiKey ? 'bg-emerald-400' : 'bg-cyan-400'
                }`}
              />
            </div>
            <MapPin className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span className="font-bold tracking-wider text-white">GOOGLE MAP API</span>
            <span
              className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-semibold ${
                googleApiKey
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                  : 'bg-cyan-950 text-cyan-300 border border-cyan-800'
              }`}
            >
              {googleApiKey ? 'AUTHENTICATED' : 'ACTIVE'}
            </span>
          </button>
        </div>

        {/* Map Legend Overlay (Bottom Left) */}
        <div className="absolute bottom-4 left-4 z-20 glass-panel p-2.5 rounded-lg border border-slate-800 text-[11px] font-mono space-y-1.5 text-slate-300 shadow-xl max-w-xs">
          <div className="flex items-center justify-between text-[10px] text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-800/80 pb-1">
            <span>Map Indicators</span>
            <span className="text-cyan-400 truncate max-w-[140px] text-right">
              {MAP_PROVIDERS[currentProvider]?.name.split('(')[0]}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-sm bg-cyan-500"></span>
            <span>Base Depot Garuda (Central Hub)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-sm bg-red-500"></span>
            <span>Critical Forward Post (Deficit)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>Verified Clear / Bypass Route</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-0.5 bg-red-500"></span>
            <span>Pass K-4 Impassable (Landslide)</span>
          </div>
          <div className="pt-1 border-t border-slate-800/80 flex items-center justify-between text-[9px] text-slate-400">
            <span>Sector Trishul &bull; 34.42° N</span>
            <button
              onClick={() => setIsGoogleModalOpen(true)}
              className="text-cyan-400 hover:text-cyan-300 underline font-mono cursor-pointer flex items-center space-x-1"
            >
              <Key className="w-2.5 h-2.5" />
              <span>Map API Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* Convoy Inspector Drawer & Reroute Controller (Right Column) */}
      <div className="w-full lg:w-96 border-l border-slate-800 bg-[#0B0F19] p-5 overflow-y-auto space-y-4 shrink-0">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Truck className="w-4 h-4 text-cyan-400" />
            <h2 className="font-display font-bold text-sm text-white">CONVOY INSPECTOR</h2>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
            GPS TELEMATICS
          </span>
        </div>

        {selectedConvoy ? (
          <div className="space-y-4">
            {/* Convoy Identity & Live Status */}
            <div className="glass-panel p-3.5 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-sm text-cyan-300">{selectedConvoy.callsign}</span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                    selectedConvoy.status === 'DIVERTED'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-amber-950 text-amber-300 border border-amber-800 animate-pulse'
                  }`}
                >
                  {selectedConvoy.status === 'DIVERTED' ? 'DIVERTED ON BYPASS' : 'REROUTE REQUIRED'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
                <div>
                  <span className="text-slate-500 block text-[10px]">DRIVER:</span>
                  <span className="text-slate-200">{selectedConvoy.driver}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">SPEED:</span>
                  <span className="text-slate-200">{selectedConvoy.speedKmh} km/h (Live)</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">CARGO:</span>
                  <span className="text-slate-200">{selectedConvoy.payloadTonnes}T (Rations/Meds)</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">ETA:</span>
                  <span className="text-cyan-400 font-semibold">{selectedConvoy.eta}</span>
                </div>
              </div>
            </div>

            {/* AI Dynamic Rerouting Engine Card */}
            <div className="glass-panel p-4 rounded-xl border border-amber-600/60 bg-gradient-to-b from-amber-950/20 to-slate-900 space-y-3">
              <div className="flex items-center space-x-2 text-amber-400 text-xs font-mono">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span className="font-bold">PASS K-4 CLOSED (ROCKFALL)</span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                420T rockfall confirmed at Pass K-4 elevation 13,200 ft. Automated GIS engine has computed 2 alternate corridors:
              </p>

              {/* Reroute Options */}
              <div className="space-y-2">
                {/* Option A (Recommended) */}
                <div
                  onClick={() => setChosenOption('OPT-A')}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    chosenOption === 'OPT-A'
                      ? 'bg-emerald-950/50 border-emerald-500 ring-1 ring-emerald-500'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-emerald-300 flex items-center space-x-1.5">
                      <span>Option A: Valley Bypass Route-9</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-900 text-emerald-200 font-mono">
                        RECOMMENDED
                      </span>
                    </span>
                    <span className="font-mono text-emerald-400">94% Safety</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mt-1">
                    <span>Delta: +22.4 km | +45 mins</span>
                    <span>All-Weather Class 40</span>
                  </div>
                </div>

                {/* Option B */}
                <div
                  onClick={() => setChosenOption('OPT-B')}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    chosenOption === 'OPT-B'
                      ? 'bg-amber-950/50 border-amber-500 ring-1 ring-amber-500'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-300">Option B: High Ridge Snow Trail</span>
                    <span className="font-mono text-amber-400">61% Safety</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mt-1">
                    <span>Delta: +14.1 km | +70 mins</span>
                    <span>Unpaved Crosswinds</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              {selectedConvoy.status !== 'DIVERTED' && !rerouteConfirmed ? (
                <button
                  onClick={handleTransmitReroute}
                  className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold font-mono text-xs shadow-lg shadow-emerald-950 flex items-center justify-center space-x-2 transition-all cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>TRANSMIT REROUTE TO CONVOY</span>
                </button>
              ) : (
                <div className="p-2.5 rounded-lg bg-emerald-950/80 border border-emerald-700 text-center font-mono text-xs text-emerald-300 flex items-center justify-center space-x-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>REROUTE TRANSMITTED & ACKNOWLEDGED</span>
                </div>
              )}
            </div>

            {/* Terrain Elevation Profile */}
            <div className="glass-panel p-3.5 rounded-xl border border-slate-800 space-y-2">
              <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
                Sector Elevation Profile (Route Trishul)
              </span>
              <div className="h-20 w-full relative">
                <svg className="w-full h-full" viewBox="0 0 300 70" preserveAspectRatio="none">
                  {/* Mountain profile */}
                  <path
                    d="M 0,60 L 60,45 L 120,50 L 170,12 L 220,35 L 260,20 L 300,55 L 300,70 L 0,70 Z"
                    fill="rgba(6, 182, 212, 0.15)"
                    stroke="#06B6D4"
                    strokeWidth="1.5"
                  />
                  {/* Pass K-4 Peak marker */}
                  <circle cx="170" cy="12" r="3" fill="#EF4444" />
                  <text x="175" y="16" fill="#EF4444" fontSize="8" fontFamily="monospace">
                    Pass K-4 (13.8k ft)
                  </text>
                </svg>
              </div>
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>Depot (10.2k ft)</span>
                <span>Pass K-4 (13.8k ft)</span>
                <span>FP Agni (13.8k ft)</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-slate-500 text-xs font-mono">
            Click any convoy marker on the map to inspect telematics.
          </div>
        )}
      </div>

      {/* Google Maps API Configuration Modal */}
      <GoogleMapsModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        apiKey={googleApiKey}
        setApiKey={setGoogleApiKey}
        currentProvider={currentProvider}
        setCurrentProvider={setCurrentProvider}
      />
    </div>
  );
};
