import React, { useState } from 'react';
import {
  MapPin,
  Key,
  ShieldCheck,
  CheckCircle2,
  X,
  ExternalLink,
  Layers,
  Sparkles,
  AlertCircle,
  Eye,
  EyeOff,
  RefreshCw,
} from 'lucide-react';
import {
  MAP_PROVIDERS,
  MapProviderId,
  testGoogleMapsKey,
  setStoredGoogleKey,
  setStoredMapProvider,
} from '../utils/mapProviders';

interface GoogleMapsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  setApiKey: (key: string) => void;
  currentProvider: MapProviderId;
  setCurrentProvider: (provider: MapProviderId) => void;
}

export const GoogleMapsModal: React.FC<GoogleMapsModalProps> = ({
  isOpen,
  onClose,
  apiKey,
  setApiKey,
  currentProvider,
  setCurrentProvider,
}) => {
  const [inputKey, setInputKey] = useState(apiKey);
  const [showKey, setShowKey] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ valid: boolean; message: string } | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [prevApiKey, setPrevApiKey] = useState(apiKey);
  if (prevApiKey !== apiKey) {
    setPrevApiKey(apiKey);
    setInputKey(apiKey);
    setTestResult(null);
  }

  if (!isOpen) return null;

  const handleSave = () => {
    const trimmed = inputKey.trim();
    setStoredGoogleKey(trimmed);
    setApiKey(trimmed);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleTestKey = async () => {
    setTesting(true);
    setTestResult(null);
    const res = await testGoogleMapsKey(inputKey);
    setTesting(false);
    setTestResult(res);
  };

  const handleProviderSelect = (pId: MapProviderId) => {
    setCurrentProvider(pId);
    setStoredMapProvider(pId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#0D1322] border border-cyan-500/30 rounded-2xl max-w-xl w-full shadow-2xl shadow-cyan-950/50 overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#111827]">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-cyan-400 shadow-md">
              <MapPin className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-white tracking-wide flex items-center space-x-2">
                <span>GOOGLE MAPS & GIS ENGINE CONFIGURATION</span>
              </h3>
              <p className="text-[11px] font-mono text-slate-400">
                Configure Google Maps API Key & Tactical Defense Basemaps
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
          {/* Status Banner */}
          <div className="p-3.5 rounded-xl border border-cyan-800/60 bg-gradient-to-r from-cyan-950/40 to-slate-900/60 flex items-start space-x-3">
            <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <div className="font-bold text-cyan-300 font-mono flex items-center space-x-2">
                <span>MILITARY GIS MAPPING ENGINE ACTIVE</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-700 font-mono">
                  READY
                </span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Google Maps Hybrid Satellite and Terrain basemaps are operational. Providing a valid Google Cloud API key enables Google Maps JavaScript SDK, Places, and high-volume geocoding services.
              </p>
            </div>
          </div>

          {/* API Key Input Section */}
          <div className="space-y-2">
            <label className="block text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider">
              Google Maps API Key
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3 text-slate-500">
                <Key className="w-4 h-4 text-cyan-400" />
              </div>
              <input
                type={showKey ? 'text' : 'password'}
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full pl-9 pr-24 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-cyan-200 placeholder-slate-600 font-mono text-xs focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
              />
              <div className="absolute right-2 flex items-center space-x-1">
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 transition-colors"
                  title={showKey ? 'Hide key' : 'Show key'}
                >
                  {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] font-mono text-slate-400">
                Stored in browser storage & `.env` (<code>VITE_GOOGLE_MAPS_API_KEY</code>)
              </span>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleTestKey}
                  disabled={testing || !inputKey.trim()}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-300 font-mono text-xs flex items-center space-x-1.5 transition-all"
                >
                  <RefreshCw className={`w-3 h-3 ${testing ? 'animate-spin text-cyan-400' : ''}`} />
                  <span>{testing ? 'Testing...' : 'Test Key'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-mono font-bold text-xs shadow-md shadow-cyan-950 flex items-center space-x-1.5 transition-all"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Save Key</span>
                </button>
              </div>
            </div>

            {savedSuccess && (
              <div className="p-2 rounded-lg bg-emerald-950/80 border border-emerald-700 text-emerald-300 font-mono text-[11px] flex items-center space-x-2 animate-fade-in">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Google Maps API Key saved and applied to live GIS viewer!</span>
              </div>
            )}

            {testResult && (
              <div
                className={`p-2.5 rounded-lg border font-mono text-[11px] flex items-start space-x-2 ${
                  testResult.valid
                    ? 'bg-emerald-950/70 border-emerald-600 text-emerald-300'
                    : 'bg-amber-950/70 border-amber-600 text-amber-300'
                }`}
              >
                {testResult.valid ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                )}
                <span>{testResult.message}</span>
              </div>
            )}
          </div>

          {/* Tactical Basemap Selection */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>Select Tactical Basemap Layer</span>
              </label>
              <span className="text-[10px] font-mono text-cyan-400">
                Active: {MAP_PROVIDERS[currentProvider]?.name}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {Object.values(MAP_PROVIDERS).map((p) => {
                const isSelected = currentProvider === p.id;
                const isGoogle = p.id.startsWith('google');
                return (
                  <div
                    key={p.id}
                    onClick={() => handleProviderSelect(p.id)}
                    className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-cyan-950/60 border-cyan-400 shadow-md shadow-cyan-950/50 ring-1 ring-cyan-400'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-display font-semibold text-xs text-slate-200">
                        {p.name}
                      </span>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mt-1">
                      <span>{p.category}</span>
                      {isGoogle ? (
                        <span className="text-cyan-400 font-semibold">Google Maps</span>
                      ) : (
                        <span className="text-slate-500">Free / Open</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Guide to get a key */}
          <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/50 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-mono font-semibold text-slate-300 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Need a Google Maps API Key?</span>
              </span>
              <a
                href="https://console.cloud.google.com/google/maps-apis"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 underline"
              >
                <span>Google Cloud Console</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
              Google provides $200 free monthly credit for Maps JavaScript API and Geocoding API (~28,000 monthly map loads). Even without a key, Google Hybrid and Satellite tiles render immediately in RakshaLog.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-[#111827] flex items-center justify-between">
          <div className="text-[10px] font-mono text-slate-500">
            Sector Trishul (34.42° N, 76.75° E) &bull; High Altitude Himalayan Command
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
