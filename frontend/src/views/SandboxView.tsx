import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Zap,
  RotateCcw,
  CloudSnow,
  AlertOctagon,
  Droplet,
  CheckCircle2,
  Terminal,
  ArrowRight,
} from 'lucide-react';

export const SandboxView: React.FC = () => {
  const { triggerScenario, simulationLogs, setActiveTab } = useApp();

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h1 className="font-display font-bold text-xl text-white tracking-wide flex items-center space-x-2">
            <span>HACKATHON DEMO SIMULATION SANDBOX</span>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 animate-pulse">
              PITCH CONTROLLER
            </span>
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Single-Click Operational Crisis Injectors for Live Evaluation (PS-26251)
          </p>
        </div>

        <button
          onClick={() => triggerScenario('RESET')}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>RESET ALL TO NOMINAL BASELINE</span>
        </button>
      </div>

      {/* 4 Core Scenario Injectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Scenario 1: Blizzard */}
        <div className="glass-panel p-4 rounded-xl border border-blue-800/60 bg-blue-950/20 space-y-3">
          <div className="flex items-center space-x-2 text-blue-400">
            <CloudSnow className="w-5 h-5" />
            <h3 className="font-display font-bold text-xs uppercase tracking-wide">
              1. Blizzard & Fuel Deficit
            </h3>
          </div>
          <p className="text-[11px] text-slate-300">
            Simulates sub-zero temperature plunge (-24°C) at FP Agni, causing emergency generator burn to surge and projecting a stockout in 96 hours.
          </p>
          <button
            onClick={() => {
              triggerScenario('BLIZZARD');
              setActiveTab('forecast');
            }}
            className="w-full py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-slate-950 font-bold font-mono text-xs flex items-center justify-center space-x-1.5 transition-all shadow-md"
          >
            <Zap className="w-3.5 h-3.5 fill-slate-950" />
            <span>INJECT & VIEW FORECAST</span>
          </button>
        </div>

        {/* Scenario 2: Landslide */}
        <div className="glass-panel p-4 rounded-xl border border-amber-800/60 bg-amber-950/20 space-y-3">
          <div className="flex items-center space-x-2 text-amber-400">
            <AlertOctagon className="w-5 h-5" />
            <h3 className="font-display font-bold text-xs uppercase tracking-wide">
              2. Pass K-4 Closure
            </h3>
          </div>
          <p className="text-[11px] text-slate-300">
            Triggers geotechnical sensors registering 420T rockfall on Pass K-4. Traps Convoy Vajra-4 and calculates automated diversion via Valley Bypass.
          </p>
          <button
            onClick={() => {
              triggerScenario('LANDSLIDE');
              setActiveTab('map');
            }}
            className="w-full py-2 px-3 rounded-lg bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold font-mono text-xs flex items-center justify-center space-x-1.5 transition-all shadow-md"
          >
            <Zap className="w-3.5 h-3.5 fill-slate-950" />
            <span>INJECT & VIEW GIS MAP</span>
          </button>
        </div>

        {/* Scenario 3: Tank Leak */}
        <div className="glass-panel p-4 rounded-xl border border-red-800/60 bg-red-950/20 space-y-3">
          <div className="flex items-center space-x-2 text-red-400">
            <Droplet className="w-5 h-5" />
            <h3 className="font-display font-bold text-xs uppercase tracking-wide">
              3. IoT Tank Leak Anomaly
            </h3>
          </div>
          <p className="text-[11px] text-slate-300">
            Fires ultrasonic liquid level transducer drop (-120 L/hr) on POL-Tank-03 at FAP Rudra without registered pump draw, testing leak isolation.
          </p>
          <button
            onClick={() => {
              triggerScenario('LEAK');
              setActiveTab('inventory');
            }}
            className="w-full py-2 px-3 rounded-lg bg-red-600 hover:bg-red-500 text-slate-950 font-bold font-mono text-xs flex items-center justify-center space-x-1.5 transition-all shadow-md"
          >
            <Zap className="w-3.5 h-3.5 fill-slate-950" />
            <span>INJECT & VIEW IOT ALERT</span>
          </button>
        </div>

        {/* Scenario 4: Commander Approval */}
        <div className="glass-panel p-4 rounded-xl border border-emerald-800/60 bg-emerald-950/20 space-y-3">
          <div className="flex items-center space-x-2 text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
            <h3 className="font-display font-bold text-xs uppercase tracking-wide">
              4. Commander Sign-Off
            </h3>
          </div>
          <p className="text-[11px] text-slate-300">
            Loads the consolidated 48-hour multi-drop replenishment plan (#DP-2026-108) with 88% payload packing ready for Commander PIN authorization.
          </p>
          <button
            onClick={() => setActiveTab('dispatch')}
            className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold font-mono text-xs flex items-center justify-center space-x-1.5 transition-all shadow-md"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>OPEN DISPATCH GATE</span>
          </button>
        </div>
      </div>

      {/* Live Simulation Event Stream */}
      <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-3 bg-slate-950">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center space-x-2 text-cyan-400 text-xs font-mono font-bold">
            <Terminal className="w-4 h-4" />
            <span>SYNTHETIC TELEMETRY & EVENT STREAM</span>
          </div>
          <span className="text-[10px] font-mono text-slate-500">REAL-TIME INJECTION LOG</span>
        </div>

        <div className="space-y-1.5 max-h-64 overflow-y-auto font-mono text-xs pr-1">
          {simulationLogs.map((log) => (
            <div
              key={log.id}
              className={`p-2 rounded flex items-start space-x-3 leading-tight ${
                log.type === 'crisis'
                  ? 'bg-red-950/40 text-red-300 border-l-2 border-red-500'
                  : log.type === 'action'
                  ? 'bg-cyan-950/40 text-cyan-300 border-l-2 border-cyan-500'
                  : 'bg-slate-900 text-slate-400'
              }`}
            >
              <span className="text-slate-500 text-[10px] shrink-0">[{log.time}]</span>
              <span>{log.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
