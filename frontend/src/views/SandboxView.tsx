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
  const {
    triggerScenario,
    simulationLogs,
    setActiveTab,
    agniFuelAnalysis,
    rudraLeakAnalysis,
    theme,
  } = useApp();

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 ${theme === 'light' ? 'border-slate-200' : 'border-slate-800'}`}>
        <div>
          <h1 className={`font-display font-bold text-xl tracking-wide flex items-center space-x-2 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
            <span>DEMO SIMULATION SANDBOX</span>
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Single-Click Operational Crisis Injectors for Live Evaluation (PS-26251)
          </p>
        </div>

        <button
          onClick={() => triggerScenario('RESET')}
          className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs font-mono transition-colors ${
            theme === 'light'
              ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>RESET ALL TO NOMINAL BASELINE</span>
        </button>
      </div>

      {/* 4 Core Scenario Injectors (Max 4 cards, increased padding) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Scenario 1: Blizzard */}
        <div className={`glass-panel p-5 rounded-xl border space-y-3.5 flex flex-col justify-between ${
          theme === 'light' ? 'bg-blue-50/50 border-blue-200' : 'border-blue-900/60 bg-blue-950/20'
        }`}>
          <div className="space-y-2.5">
            <div className="flex items-center space-x-2 text-cyan-400">
              <CloudSnow className="w-5 h-5 shrink-0" />
              <h3 className="font-display font-bold text-xs uppercase tracking-wide">
                1. Blizzard & Fuel Deficit
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Simulates sub-zero temperature plunge (-24°C) at FP Agni, causing emergency generator burn to surge and projecting a stockout in {agniFuelAnalysis.hoursToStockout} hours ({agniFuelAnalysis.formattedDays}).
            </p>
          </div>
          <button
            onClick={() => {
              triggerScenario('BLIZZARD');
              setActiveTab('forecast');
            }}
            className="w-full py-2 px-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold font-mono text-xs flex items-center justify-center space-x-1.5 transition-all shadow-md cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 fill-slate-950" />
            <span>INJECT & VIEW FORECAST</span>
          </button>
        </div>

        {/* Scenario 2: Landslide */}
        <div className={`glass-panel p-5 rounded-xl border space-y-3.5 flex flex-col justify-between ${
          theme === 'light' ? 'bg-amber-50/50 border-amber-200' : 'border-amber-900/60 bg-amber-950/20'
        }`}>
          <div className="space-y-2.5">
            <div className="flex items-center space-x-2 text-amber-400">
              <AlertOctagon className="w-5 h-5 shrink-0" />
              <h3 className="font-display font-bold text-xs uppercase tracking-wide">
                2. Pass K-4 Closure
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Triggers geotechnical sensors registering 420T rockfall on Pass K-4. Traps Convoy Vajra-4 and calculates automated diversion via Valley Bypass.
            </p>
          </div>
          <button
            onClick={() => {
              triggerScenario('LANDSLIDE');
              setActiveTab('map');
            }}
            className="w-full py-2 px-3 rounded-lg bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold font-mono text-xs flex items-center justify-center space-x-1.5 transition-all shadow-md cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 fill-slate-950" />
            <span>INJECT & VIEW GIS MAP</span>
          </button>
        </div>

        {/* Scenario 3: Tank Leak */}
        <div className={`glass-panel p-5 rounded-xl border space-y-3.5 flex flex-col justify-between ${
          theme === 'light' ? 'bg-red-50/50 border-red-200' : 'border-red-900/60 bg-red-950/20'
        }`}>
          <div className="space-y-2.5">
            <div className="flex items-center space-x-2 text-red-400">
              <Droplet className="w-5 h-5 shrink-0" />
              <h3 className="font-display font-bold text-xs uppercase tracking-wide">
                3. IoT Tank Leak Anomaly
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Fires ultrasonic transducer drop ({rudraLeakAnalysis.leakRateHourly} L/hr) on POL-Tank-03 at FAP Rudra without registered pump draw (runway: {rudraLeakAnalysis.formattedHours} / {rudraLeakAnalysis.formattedDays}).
            </p>
          </div>
          <button
            onClick={() => {
              triggerScenario('LEAK');
              setActiveTab('inventory');
            }}
            className="w-full py-2 px-3 rounded-lg bg-red-600 hover:bg-red-500 text-slate-950 font-bold font-mono text-xs flex items-center justify-center space-x-1.5 transition-all shadow-md cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 fill-slate-950" />
            <span>INJECT & VIEW IOT ALERT</span>
          </button>
        </div>

        {/* Scenario 4: Commander Approval */}
        <div className={`glass-panel p-5 rounded-xl border space-y-3.5 flex flex-col justify-between ${
          theme === 'light' ? 'bg-emerald-50/50 border-emerald-200' : 'border-emerald-900/60 bg-emerald-950/20'
        }`}>
          <div className="space-y-2.5">
            <div className="flex items-center space-x-2 text-emerald-400">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <h3 className="font-display font-bold text-xs uppercase tracking-wide">
                4. Commander Sign-Off
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Loads consolidated 48-hour multi-drop replenishment plan (#DP-2026-108) with 88.0% payload packing ready for Commander PIN authorization.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('dispatch')}
            className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold font-mono text-xs flex items-center justify-center space-x-1.5 transition-all shadow-md cursor-pointer"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>OPEN DISPATCH GATE</span>
          </button>
        </div>
      </div>

      {/* Live Simulation Event Stream (Compact and scrollable: max-h-48) */}
      <div className={`p-5 rounded-xl border space-y-3 ${
        theme === 'light' ? 'bg-white border-slate-200' : 'glass-panel bg-slate-950 border-slate-800/90'
      }`}>
        <div className={`flex items-center justify-between border-b pb-2 ${theme === 'light' ? 'border-slate-200' : 'border-slate-800'}`}>
          <div className="flex items-center space-x-2 text-cyan-400 text-xs font-mono font-bold">
            <Terminal className="w-4 h-4" />
            <span>SYNTHETIC TELEMETRY & EVENT STREAM</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">COMPACT AUDIT TRAIL</span>
        </div>

        <div className="space-y-1.5 max-h-48 overflow-y-auto font-mono text-xs pr-1 scrollbar-thin">
          {simulationLogs.map((log) => (
            <div
              key={log.id}
              className={`p-2 rounded flex items-start space-x-3 leading-tight ${
                log.type === 'crisis'
                  ? 'bg-red-950/40 text-red-300 border-l-2 border-red-500'
                  : log.type === 'action'
                  ? 'bg-cyan-950/40 text-cyan-300 border-l-2 border-cyan-500'
                  : theme === 'light'
                  ? 'bg-slate-100 text-slate-700'
                  : 'bg-slate-900 text-slate-400'
              }`}
            >
              <span className="text-slate-500 text-[10px] shrink-0 font-bold">[{log.time}]</span>
              <span className="text-xs">{log.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

