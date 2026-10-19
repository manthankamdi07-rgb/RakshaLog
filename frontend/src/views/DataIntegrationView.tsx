import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Network,
  Radio,
  CloudSnow,
  MapPin,
  Database,
  Truck,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Cpu,
  Layers,
  Activity,
  AlertOctagon,
  Sparkles,
  GitBranch,
  Filter,
} from 'lucide-react';

interface StreamSource {
  id: string;
  name: string;
  category: string;
  protocol: string;
  status: 'ONLINE' | 'DELAYED' | 'OFFLINE';
  lastSync: string;
  recordsPerHour: number;
  qualityScorePct: number;
  description: string;
  samplePayload: string;
  activeEndpoint: string;
}

interface IngestionEvent {
  id: string;
  timestamp: string;
  streamId: string;
  sourceName: string;
  status: 'VALIDATED' | 'FALLBACK_ACTIVE' | 'ANOMALY_DETECTED';
  payloadSummary: string;
  fallbackAction: string;
  latencyMs: number;
}

export const DataIntegrationView: React.FC = () => {
  const { theme, agniFuelAnalysis, rudraLeakAnalysis, passK4Blocked, temperature, troopCount } = useApp();
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const handleSimulateRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const streamSources: StreamSource[] = [
    {
      id: 'STREAM-IOT',
      name: 'IoT Transducers & Smart Storage',
      category: 'EDGE SENSORS',
      protocol: 'MQTT / Tactical LoRaWAN',
      status: 'ONLINE',
      lastSync: '12s ago',
      recordsPerHour: 360,
      qualityScorePct: 99.2,
      description: 'Ultrasonic liquid-level sensors on forward POL fuel tanks & RFID smart crate seals.',
      samplePayload: `US-TANK-03: 1,150 L | Rate: ${rudraLeakAnalysis.leakRateHourly} L/hr | Gate: LOCKED`,
      activeEndpoint: 'lora://sector-trishul.edge/pol/rudra-03',
    },
    {
      id: 'STREAM-MET',
      name: 'High-Altitude Met & Weather Feed',
      category: 'ENVIRONMENT',
      protocol: 'REST JSON / Sat-WMS',
      status: 'DELAYED',
      lastSync: '4m 18s ago',
      recordsPerHour: 48,
      qualityScorePct: 88.5,
      description: 'IMD mountain telemetry, pass anemometers, barometric pressure & Western Disturbance radar.',
      samplePayload: `Pass K-4 micro-met sensor uplink timeout (>180s). Fallback model engaged (${temperature}°C).`,
      activeEndpoint: 'satellite://imd.mod.gov.in/telemetry/k4-pass',
    },
    {
      id: 'STREAM-GIS',
      name: 'GIS, Terrain & Road Passability',
      category: 'GEOSPATIAL',
      protocol: 'GeoJSON / Defense Vector Layer',
      status: 'ONLINE',
      lastSync: '45s ago',
      recordsPerHour: 120,
      qualityScorePct: 96.8,
      description: 'Border Roads Organisation (BRO) clearance status, landslide sensors & terrain slope stability.',
      samplePayload: `Pass K-4: ${passK4Blocked ? 'IMPASSABLE (420T Rockfall)' : 'CLEAR'} | Valley Bypass: ALL-WEATHER`,
      activeEndpoint: 'gis://bro.ops.mil.in/sector-trishul/chokepoints',
    },
    {
      id: 'STREAM-CONSUME',
      name: 'Historical & Dynamic Consumption',
      category: 'LOGISTICS ERP',
      protocol: 'PostgreSQL / Secure Kafka',
      status: 'ONLINE',
      lastSync: '2m ago',
      recordsPerHour: 240,
      qualityScorePct: 97.5,
      description: 'Aggregated ration, ammunition, and winter fuel draw history cross-tabulated by troop strength.',
      samplePayload: `FP Agni baseline: ${agniFuelAnalysis.effectiveBurnRateLPerDay} L/day | Garrison: ${troopCount} troops`,
      activeEndpoint: 'db://s4.trishul.brigade/consumption/class3',
    },
    {
      id: 'STREAM-FLEET',
      name: 'Fleet Telematics & Vehicle Diagnostics',
      category: 'MOBILITY',
      protocol: 'CAN-bus J1939 / SatCom',
      status: 'ONLINE',
      lastSync: '18s ago',
      recordsPerHour: 480,
      qualityScorePct: 98.9,
      description: 'Real-time GPS coordinates, axle weight sensors, bowser liquid level & engine diagnostic codes.',
      samplePayload: 'Convoy Vajra-4: [34.4200, 76.6200] | 2.1T / 2.5T (84% capacity) | Speed: 24 km/h',
      activeEndpoint: 'satcom://als.telematics.garuda/convoy-04',
    },
    {
      id: 'STREAM-SITREP',
      name: 'Command Sitreps & Radio Dispatches',
      category: 'HUMAN-IN-THE-LOOP',
      protocol: 'Cryptographic STANAG / Digitized Sitrep',
      status: 'ONLINE',
      lastSync: '14m ago',
      recordsPerHour: 12,
      qualityScorePct: 94.0,
      description: 'Field officer situational reports, verbal radio clearances & Commander PIN authorizations.',
      samplePayload: 'Maj Rao (S4): Signed Requisition Plan #DP-2026-108 authorized via RSA-2048 key',
      activeEndpoint: 'secure://hq.brigade.mil.in/sitrep/daily-108',
    },
  ];

  const filteredStreams = streamSources.filter(
    (s) => filterCategory === 'ALL' || s.category === filterCategory
  );

  const recentIngestionEvents: IngestionEvent[] = [
    {
      id: 'EVT-8092',
      timestamp: '16:51:24',
      streamId: 'STREAM-MET',
      sourceName: 'High-Altitude Met Feed',
      status: 'FALLBACK_ACTIVE',
      payloadSummary: 'Pass K-4 micro-met sensor uplink lost (>180s timeout due to blizzard ionospheric interference).',
      fallbackAction: 'AUTOMATED FALLBACK: Switched to Satellite Doppler & Ridge Extrapolation model (+1.8°C error band compensation applied).',
      latencyMs: 240,
    },
    {
      id: 'EVT-8091',
      timestamp: '16:48:10',
      streamId: 'STREAM-IOT',
      sourceName: 'IoT Transducers (POL-D-03)',
      status: 'ANOMALY_DETECTED',
      payloadSummary: `Ultrasonic telemetry logged rapid drop: 1,150 L at ${rudraLeakAnalysis.leakRateHourly} L/hr with dispense gate locked.`,
      fallbackAction: `ANOMALY ISOLATED: Dispatched alert ALT-9041; computed runway ${rudraLeakAnalysis.formattedHours} (${rudraLeakAnalysis.formattedDays}) propagated to ledger.`,
      latencyMs: 18,
    },
    {
      id: 'EVT-8090',
      timestamp: '16:45:02',
      streamId: 'STREAM-GIS',
      sourceName: 'GIS Road Passability',
      status: 'VALIDATED',
      payloadSummary: 'Geotechnical sensor S-12 at Pass K-4 confirmed 420T rockfall obstruction across both carriageways.',
      fallbackAction: 'CORRIDOR REROUTED: Pass marked IMPASSABLE; automated route divert via Valley Bypass Route-9 calculated.',
      latencyMs: 42,
    },
    {
      id: 'EVT-8089',
      timestamp: '16:42:30',
      streamId: 'STREAM-CONSUME',
      sourceName: 'Consumption Records',
      status: 'VALIDATED',
      payloadSummary: `Sub-zero temperature plunge (${temperature}°C) correlated with FP Agni emergency generator load.`,
      fallbackAction: `FORECAST UPDATED: LSTM depletion curve adjusted; runway synchronized to ${agniFuelAnalysis.hoursToStockout}h (${agniFuelAnalysis.formattedDays}).`,
      latencyMs: 35,
    },
    {
      id: 'EVT-8088',
      timestamp: '16:39:15',
      streamId: 'STREAM-FLEET',
      sourceName: 'Fleet Telematics',
      status: 'VALIDATED',
      payloadSummary: 'Convoy Vajra-4 4x4 ALS Truck GPS telemetry & bowser baffled level sensor sync confirmed.',
      fallbackAction: 'FLEET POSITIONED: Marker moved to waypoint [34.4200, 76.6200]; ETA +2.5h to diversion junction.',
      latencyMs: 22,
    },
    {
      id: 'EVT-8087',
      timestamp: '16:35:00',
      streamId: 'STREAM-SITREP',
      sourceName: 'Command Sitreps',
      status: 'VALIDATED',
      payloadSummary: 'Daily Sitrep #LOG-2026-108 cryptographic sign-off received from Brigade Logistics Ops.',
      fallbackAction: 'LEDGER COMMITTED: Digitally stamped into immutable audit archive DTG 181650H.',
      latencyMs: 15,
    },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h1 className="font-display font-bold text-xl text-white tracking-wide">
            DATA INTEGRATION & STREAM FUSION PIPELINE
          </h1>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Fusing telemetry, weather radar, and GIS streams into a single synchronized tactical truth
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleSimulateRefresh}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
              theme === 'light'
                ? 'bg-purple-100 hover:bg-purple-200 text-purple-900 border border-purple-300'
                : 'bg-purple-950/60 hover:bg-purple-900/80 text-purple-300 border border-purple-700'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>FORCE STREAM RE-SYNC</span>
          </button>
        </div>
      </div>

      {/* KPI Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-mono uppercase tracking-wider">Ingestion Throughput</span>
            <Activity className="w-4 h-4 text-purple-400" />
          </div>
          <p className={`text-2xl font-mono font-bold mt-1 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
            1,260 <span className="text-xs font-normal text-slate-400">rec/hr</span>
          </p>
          <span className="text-[10px] font-mono text-emerald-400 flex items-center mt-1">
            <CheckCircle2 className="w-3 h-3 mr-1" /> 6 Active Data Feeds
          </span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-mono uppercase tracking-wider">End-to-End Fusion Latency</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <p className={`text-2xl font-mono font-bold mt-1 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
            1.2 <span className="text-xs font-normal text-slate-400">Seconds</span>
          </p>
          <span className="text-[10px] font-mono text-emerald-400 flex items-center mt-1">
            vs 6-18h Legacy Phone/Radio
          </span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-mono uppercase tracking-wider">Stream Health & Integrity</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <p className={`text-2xl font-mono font-bold mt-1 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
            98.4%
          </p>
          <span className="text-[10px] font-mono text-amber-400 flex items-center mt-1">
            1 Stream on Imputed Fallback
          </span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-mono uppercase tracking-wider">Single Store Consistency</span>
            <Database className="w-4 h-4 text-indigo-400" />
          </div>
          <p className={`text-2xl font-mono font-bold mt-1 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
            100%
          </p>
          <span className="text-[10px] font-mono text-cyan-400 flex items-center mt-1">
            logisticsStore.ts Source of Truth
          </span>
        </div>
      </div>

      {/* 2. Visual Fusion Flow Diagram */}
      <div className="glass-panel p-5 rounded-xl border border-purple-800/50 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Network className="w-4 h-4 text-purple-400" />
            <h2 className={`font-display font-bold text-sm ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
              DATA FUSION ARCHITECTURE: MULTI-STREAM INGESTION TO OPERATIONAL DIRECTIVE
            </h2>
          </div>
          <span className="text-[10px] font-mono text-purple-400">
            Continuous Pipeline Validation & Error-Bounded Imputation
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-7 gap-3 items-center text-xs font-mono">
          {/* Left Column: 6 Sources */}
          <div className="lg:col-span-2 space-y-2">
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1 flex items-center justify-between">
              <span>INGESTION STREAMS (6 SOURCES)</span>
              <span className="text-purple-400">EDGE INGRESS</span>
            </div>

            <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <span className="flex items-center space-x-1.5 text-slate-200">
                <Radio className="w-3.5 h-3.5 text-cyan-400" />
                <span>IoT Sensors (RFID/Ultrasonic)</span>
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                360/h
              </span>
            </div>

            <div className="p-2 rounded-lg bg-slate-900/80 border border-amber-800/60 flex items-center justify-between">
              <span className="flex items-center space-x-1.5 text-slate-200">
                <CloudSnow className="w-3.5 h-3.5 text-blue-400" />
                <span>Weather & Blizzard Radar</span>
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-800 animate-pulse">
                DELAYED
              </span>
            </div>

            <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <span className="flex items-center space-x-1.5 text-slate-200">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>GIS Passability & Road Terrain</span>
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                120/h
              </span>
            </div>

            <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <span className="flex items-center space-x-1.5 text-slate-200">
                <Database className="w-3.5 h-3.5 text-indigo-400" />
                <span>Historical Consumption Logs</span>
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                240/h
              </span>
            </div>

            <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <span className="flex items-center space-x-1.5 text-slate-200">
                <Truck className="w-3.5 h-3.5 text-cyan-400" />
                <span>Fleet Telematics & GPS</span>
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                480/h
              </span>
            </div>

            <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <span className="flex items-center space-x-1.5 text-slate-200">
                <FileText className="w-3.5 h-3.5 text-purple-400" />
                <span>Field Sitreps & Radio Orders</span>
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                12/h
              </span>
            </div>
          </div>

          {/* Connector Arrow Left -> Center */}
          <div className="hidden lg:flex flex-col items-center justify-center space-y-1 text-purple-400">
            <span className="text-[9px] uppercase tracking-widest text-slate-500">INGEST</span>
            <ArrowRight className="w-6 h-6 animate-pulse" />
            <span className="text-[9px] text-slate-500">NORMALIZE</span>
          </div>

          {/* Center Column: Fusion Engine */}
          <div className="lg:col-span-2 p-4 rounded-xl bg-purple-950/20 border-2 border-purple-600/70 space-y-2.5">
            <div className="flex items-center space-x-2 border-b border-purple-800/60 pb-2">
              <Cpu className="w-4 h-4 text-purple-300" />
              <div>
                <h3 className="font-bold text-purple-200 text-xs">FUSION & VALIDATION ENGINE</h3>
                <p className="text-[9px] text-purple-400 font-mono">logisticsStore.ts</p>
              </div>
            </div>

            <div className="space-y-1.5 text-[11px] font-sans">
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <strong className="text-cyan-400 font-mono text-[10px] block uppercase">1. Outlier Filter</strong>
                <span className="text-slate-300">Isolated Rudra tank drop (-120 L/hr) in &lt;60s</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <strong className="text-amber-400 font-mono text-[10px] block uppercase">2. Fallback Imputation</strong>
                <span className="text-slate-300">Ridge extrapolation on sensor timeout</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <strong className="text-emerald-400 font-mono text-[10px] block uppercase">3. Cross-Correlation</strong>
                <span className="text-slate-300">Sub-zero (-18°C) &times; garrison burn = 4.0d runway</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <strong className="text-indigo-400 font-mono text-[10px] block uppercase">4. State Publisher</strong>
                <span className="text-slate-300">Unified single source of truth across views</span>
              </div>
            </div>
          </div>

          {/* Connector Arrow Center -> Right */}
          <div className="hidden lg:flex flex-col items-center justify-center space-y-1 text-cyan-400">
            <span className="text-[9px] uppercase tracking-widest text-slate-500">PUBLISH</span>
            <ArrowRight className="w-6 h-6 animate-pulse" />
            <span className="text-[9px] text-slate-500">DIRECTIVES</span>
          </div>

          {/* Right Column: 4 Synchronized Outputs */}
          <div className="lg:col-span-2 space-y-2">
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1 flex items-center justify-between">
              <span>UNIFIED TACTICAL OUTPUTS</span>
              <span className="text-cyan-400">CONSUMERS</span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-0.5">
              <span className="text-cyan-300 font-bold flex items-center space-x-1">
                <span>AI Demand Forecast Engine</span>
              </span>
              <p className="text-[10px] text-slate-400">14-day depletion curve (Agni stockout Day 4 / 96h / 4.0d)</p>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-0.5">
              <span className="text-emerald-300 font-bold flex items-center space-x-1">
                <span>Automated GIS Route Optimizer</span>
              </span>
              <p className="text-[10px] text-slate-400">Pass K-4 rockfall divert via Valley Bypass Route-9</p>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-0.5">
              <span className="text-amber-300 font-bold flex items-center space-x-1">
                <span>Multi-Drop Dispatch Planner</span>
              </span>
              <p className="text-[10px] text-slate-400">4,600L bowser + ration load consolidation (84% ratio)</p>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-0.5">
              <span className="text-red-300 font-bold flex items-center space-x-1">
                <span>Real-Time Alert Dispatcher</span>
              </span>
              <p className="text-[10px] text-slate-400">Instant quarantine siren & diagnostic modal for Rudra Tank-03</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Before vs After Comparison Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Before */}
        <div className="glass-panel p-5 rounded-xl border border-red-800/40 bg-red-950/10 space-y-3">
          <div className="flex items-center justify-between border-b border-red-800/40 pb-2">
            <div className="flex items-center space-x-2 text-red-400">
              <AlertOctagon className="w-4 h-4" />
              <h3 className="font-display font-bold text-sm text-red-300">
                BEFORE: 6 DISCONNECTED LEGACY SILOS & MANUAL RECONCILIATION
              </h3>
            </div>
            <span className="text-[10px] font-mono text-red-400 px-2 py-0.5 rounded bg-red-950 border border-red-800">
              LEGACY BASELINE
            </span>
          </div>

          <ul className="space-y-2 text-xs font-mono text-slate-300">
            <li className="flex items-start space-x-2">
              <span className="text-red-400 font-bold mt-0.5">✕</span>
              <span><strong>Fragmented Spreadsheets & Registers:</strong> Inventory ledgers, fuel dips, and vehicle logs tracked on isolated desk computers and paper.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-red-400 font-bold mt-0.5">✕</span>
              <span><strong>6 to 18-Hour Reconciliation Lag:</strong> S4 logistics staff manually phone outposts and radio convoys to cross-check numbers during shift changes.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-red-400 font-bold mt-0.5">✕</span>
              <span><strong>Disastrous Information Disconnects:</strong> A sub-zero blizzard wave was reported by Met, but nobody updated the outpost generator fuel depletion rate in time.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-red-400 font-bold mt-0.5">✕</span>
              <span><strong>Undetected Tank Leaks:</strong> Tank cracks or punctures (-120 L/hr) were only discovered days later during weekly manual physical stick readings.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-red-400 font-bold mt-0.5">✕</span>
              <span><strong>High Risk of Fatal Stockouts:</strong> Convoy dispatched into closed mountain passes without visibility into real-time terrain blockages.</span>
            </li>
          </ul>
        </div>

        {/* After */}
        <div className="glass-panel p-5 rounded-xl border border-emerald-800/40 bg-emerald-950/10 space-y-3">
          <div className="flex items-center justify-between border-b border-emerald-800/40 pb-2">
            <div className="flex items-center space-x-2 text-emerald-400">
              <Sparkles className="w-4 h-4" />
              <h3 className="font-display font-bold text-sm text-emerald-300">
                AFTER: RAKSHALOG REAL-TIME COMMON OPERATING PICTURE
              </h3>
            </div>
            <span className="text-[10px] font-mono text-emerald-300 px-2 py-0.5 rounded bg-emerald-950 border border-emerald-700">
              PS-26251 SOLUTION
            </span>
          </div>

          <ul className="space-y-2 text-xs font-mono text-slate-300">
            <li className="flex items-start space-x-2">
              <span className="text-emerald-400 font-bold mt-0.5">✓</span>
              <span><strong>Single Unified Data Store (logisticsStore.ts):</strong> All 7 tactical pages read from one mathematical model with zero conflicting figures.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-emerald-400 font-bold mt-0.5">✓</span>
              <span><strong>Sub-Second Real-Time Cross-Correlation:</strong> Ambient cold wave (-18°C) automatically recalibrates generator burn to 1,050 L/day and flags 4.0d (96h) stockout.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-emerald-400 font-bold mt-0.5">✓</span>
              <span><strong>Instant Anomaly Isolation (&lt; 60 Seconds):</strong> Ultrasonic sensor drop (-120 L/hr) fires leak alarm and calculates 0.4d (9.6 hrs) runway immediately.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-emerald-400 font-bold mt-0.5">✓</span>
              <span><strong>Automated Route Rerouting:</strong> Pass K-4 rockfall instantly loads Valley Bypass Route-9 for Convoy Vajra-4 with 68 km distance saved.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-emerald-400 font-bold mt-0.5">✓</span>
              <span><strong>Resilient Fallback Imputation:</strong> Intermittent weather or sensor links automatically fallback to bounded model estimates without crashing operations.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* 4. Data Streams Grid (6 Source Cards) */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
          <div className="flex items-center space-x-2">
            <Database className="w-4 h-4 text-cyan-400" />
            <h2 className={`font-display font-bold text-sm ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
              INGESTION STREAM STATUS & HEALTH LEDGER
            </h2>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono text-slate-400">Filter Stream:</span>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-xs font-mono rounded px-2.5 py-1 text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All Stream Categories (6)</option>
              <option value="EDGE SENSORS">Edge Sensors (IoT)</option>
              <option value="ENVIRONMENT">Environment & Weather</option>
              <option value="GEOSPATIAL">Geospatial & Passability</option>
              <option value="LOGISTICS ERP">Logistics ERP & Consumption</option>
              <option value="MOBILITY">Mobility & Telematics</option>
              <option value="HUMAN-IN-THE-LOOP">Human-in-the-Loop Sitreps</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStreams.map((stream) => {
            const isOnline = stream.status === 'ONLINE';
            const isDelayed = stream.status === 'DELAYED';

            return (
              <div
                key={stream.id}
                className={`glass-panel p-4 rounded-xl border transition-all ${
                  isDelayed
                    ? 'border-amber-700/80 bg-amber-950/20'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400">{stream.category}</span>
                    <h3 className={`font-mono font-bold text-xs mt-0.5 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                      {stream.name}
                    </h3>
                  </div>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded flex items-center space-x-1 ${
                      isOnline
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : isDelayed
                        ? 'bg-amber-950 text-amber-300 border border-amber-800 animate-pulse'
                        : 'bg-red-950 text-red-300 border border-red-800'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-400 animate-ping' : isDelayed ? 'bg-amber-400' : 'bg-red-400'}`}></span>
                    <span>{stream.status}</span>
                  </span>
                </div>

                <p className="text-[11px] text-slate-300 mt-2 line-clamp-2">
                  {stream.description}
                </p>

                {/* Stream Metrics Grid */}
                <div className="grid grid-cols-3 gap-2 p-2 mt-3 rounded bg-slate-900/90 border border-slate-800 text-[10px] font-mono">
                  <div>
                    <span className="text-slate-500 block">LAST SYNC</span>
                    <span className="text-slate-200 font-semibold">{stream.lastSync}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">RATE</span>
                    <span className="text-cyan-400 font-semibold">{stream.recordsPerHour}/hr</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">QUALITY</span>
                    <span className={`font-semibold ${stream.qualityScorePct > 95 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {stream.qualityScorePct}%
                    </span>
                  </div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-800/80 text-[10px] font-mono text-slate-400 space-y-1">
                  <div className="flex justify-between">
                    <span>Protocol:</span>
                    <span className="text-slate-300">{stream.protocol}</span>
                  </div>
                  <div className="truncate">
                    <span className="text-slate-500">Live Payload: </span>
                    <span className="text-cyan-300">{stream.samplePayload}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Ingestion Events Table & Fallback Routing Action */}
      <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-3 bg-slate-950 font-mono text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-purple-400" />
            <h2 className="font-display font-bold text-sm text-white">
              STREAM INGESTION LOG & RESILIENT FALLBACK ROUTING DISPATCH
            </h2>
          </div>
          <span className="text-[10px] text-slate-400">
            Real-Time Edge Intercepts & Error Recovery (PS-26251)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] text-slate-400 uppercase border-b border-slate-800">
                <th className="py-2 px-3">Time</th>
                <th className="py-2 px-3">Stream Source</th>
                <th className="py-2 px-3">Validation Status</th>
                <th className="py-2 px-3">Ingested Payload Summary</th>
                <th className="py-2 px-3">Operational Fallback & Decision Action</th>
                <th className="py-2 px-3 text-right">Latency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-[11px]">
              {recentIngestionEvents.map((evt) => (
                <tr key={evt.id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-2.5 px-3 text-slate-400 whitespace-nowrap">{evt.timestamp}</td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <span className="text-slate-200 font-semibold">{evt.sourceName}</span>
                    <span className="block text-[9px] text-slate-500">{evt.streamId}</span>
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    {evt.status === 'FALLBACK_ACTIVE' ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800 animate-pulse">
                        FALLBACK ACTIVE
                      </span>
                    ) : evt.status === 'ANOMALY_DETECTED' ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-950 text-red-300 border border-red-800 animate-pulse">
                        ANOMALY FLAGGED
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                        VALIDATED
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-slate-300 max-w-xs">{evt.payloadSummary}</td>
                  <td className="py-2.5 px-3 text-cyan-300 max-w-sm font-semibold">{evt.fallbackAction}</td>
                  <td className="py-2.5 px-3 text-right text-slate-400 whitespace-nowrap">{evt.latencyMs}ms</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500">
          <span>CLASSIFICATION: SYNTHETIC DATA // DEFENSE HACKATHON EVALUATION</span>
          <span className="text-purple-400">DATA FUSION MODULE READY (PS-26251)</span>
        </div>
      </div>
    </div>
  );
};
