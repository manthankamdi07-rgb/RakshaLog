import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Printer,
  TrendingDown,
  TrendingUp,
  Clock,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  FileText,
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const {
    dispatchProposal,
    modelMetrics,
    avgDos,
    agniFuelAnalysis,
    rudraLeakAnalysis,
    temperature,
    currentDtgClock,
    theme,
  } = useApp();

  const [openSections, setOpenSections] = useState<Record<number, boolean>>({
    1: true,
    2: false,
    3: false,
    4: false,
  });

  const toggleSection = (id: number) => {
    setOpenSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 ${theme === 'light' ? 'border-slate-200' : 'border-slate-800'}`}>
        <div>
          <h1 className={`font-display font-bold text-xl tracking-wide flex items-center space-x-2 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
            <span>OPERATIONAL REPORTS & LOG-SITREP</span>
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Military Situation Reports & Logistics Resiliency Performance KPIs (PS-26251)
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrint}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs font-mono transition-colors ${
              theme === 'light'
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
          >
            <Printer className="w-3.5 h-3.5" />
            <span>PRINT SITREP</span>
          </button>
        </div>
      </div>

      {/* 1. Logistics Resiliency Scorecard (Max 4 cards per row, 25% more padding) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-panel p-5 rounded-xl border border-slate-800/80 space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-400">Forecast Error (MAPE)</span>
          <p className="text-2xl font-mono font-bold text-white mt-1">{modelMetrics.mapePct}%</p>
          <span className="text-[10px] font-mono text-emerald-400 flex items-center mt-1">
            <TrendingDown className="w-3 h-3 mr-1" /> Multi-post backtested error
          </span>
        </div>

        <div className="glass-panel p-5 rounded-xl border border-slate-800/80 space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-400">Mean Time to Replenish</span>
          <p className="text-2xl font-mono font-bold text-white mt-1">14.2 Hours</p>
          <span className="text-[10px] font-mono text-emerald-400 flex items-center mt-1">
            <Clock className="w-3 h-3 mr-1" /> -62% reduction in replenishment cycle
          </span>
        </div>

        <div className="glass-panel p-5 rounded-xl border border-slate-800/80 space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-400">Pass Reroute Decision Time</span>
          <p className="text-2xl font-mono font-bold text-white mt-1">18 Minutes</p>
          <span className="text-[10px] font-mono text-cyan-400 flex items-center mt-1">
            Automated GIS vs 3.5h manual
          </span>
        </div>

        <div className="glass-panel p-5 rounded-xl border border-slate-800/80 space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-400">Convoy Asset Packing Ratio</span>
          <p className="text-2xl font-mono font-bold text-white mt-1">
            {dispatchProposal.efficiency.payloadUtilizationPct.toFixed(1)}%
          </p>
          <span className="text-[10px] font-mono text-emerald-400 flex items-center mt-1">
            Multi-drop consolidation (68 km saved)
          </span>
        </div>
      </div>

      {/* 2. Formal Military Log-Sitrep Accordion Section */}
      <div className={`p-6 rounded-xl border space-y-5 ${
        theme === 'light' ? 'bg-white border-slate-200' : 'glass-panel bg-slate-950/80 border-slate-800/90'
      }`}>
        <div className={`border-b pb-4 text-center space-y-1 ${theme === 'light' ? 'border-slate-200' : 'border-slate-800'}`}>
          <p className="text-[11px] text-red-400 font-mono font-bold uppercase tracking-widest">
            CONFIDENTIAL // FORWARD OPERATIONS ONLY
          </p>
          <h2 className={`font-display font-bold text-base tracking-wide ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
            DAILY LOGISTICS SITUATION REPORT (LOG-SITREP) — SECTOR TRISHUL
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            HEADQUARTERS BRIGADE LOGISTICS OPS ROOM | DTG: <span className="text-cyan-400 font-bold">{currentDtgClock}</span>
          </p>
        </div>

        {/* Accordions */}
        <div className="space-y-3">
          {/* Item 1 */}
          <div className={`rounded-lg border overflow-hidden transition-all ${
            theme === 'light' ? 'border-slate-200 bg-slate-50/50' : 'border-slate-800/80 bg-slate-900/40'
          }`}>
            <button
              onClick={() => toggleSection(1)}
              className="w-full px-4 py-3 flex items-center justify-between text-left cursor-pointer hover:bg-slate-800/30 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold text-cyan-400">1. GENERAL SUSTAINABILITY APPRAISAL</span>
                <span className="text-[11px] font-mono text-slate-400">({avgDos} DOS Sector Avg)</span>
              </div>
              {openSections[1] ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </button>
            {openSections[1] && (
              <div className={`px-4 pb-4 pt-1 border-t text-xs leading-relaxed ${
                theme === 'light' ? 'border-slate-200 text-slate-700' : 'border-slate-800/60 text-slate-300'
              }`}>
                <p>
                  Sector average sustainability stands at <strong className="text-cyan-400 font-mono">{avgDos} Days of Supply (DOS)</strong>. All forward outposts maintain operational integrity. Pre-emptive winter rationing measures are engaged across high-altitude posts in response to Western Disturbance weather alerts.
                </p>
              </div>
            )}
          </div>

          {/* Item 2 */}
          <div className={`rounded-lg border overflow-hidden transition-all ${
            theme === 'light' ? 'border-slate-200 bg-slate-50/50' : 'border-slate-800/80 bg-slate-900/40'
          }`}>
            <button
              onClick={() => toggleSection(2)}
              className="w-full px-4 py-3 flex items-center justify-between text-left cursor-pointer hover:bg-slate-800/30 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold text-cyan-400">2. CRITICAL FORMATION DEFICIENCIES & ACTIONS</span>
                <span className="text-[11px] font-mono text-amber-400">(2 Actions Active)</span>
              </div>
              {openSections[2] ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </button>
            {openSections[2] && (
              <div className={`px-4 pb-4 pt-1 border-t text-xs leading-relaxed space-y-2.5 ${
                theme === 'light' ? 'border-slate-200 text-slate-700' : 'border-slate-800/60 text-slate-300'
              }`}>
                <div>
                  <strong className="text-amber-400 font-semibold font-mono">Forward Post Agni (13.8k ft):</strong>
                  <p className="text-slate-400 mt-0.5">
                    Class III Arctic Diesel runway dropped to {agniFuelAnalysis.formattedDays} ({agniFuelAnalysis.hoursToStockout} hours) due to Western Disturbance sub-zero cold wave ({temperature}°C). Deficit is being mitigated by staging Dispatch Plan #{dispatchProposal.id} ({agniFuelAnalysis.recommendedReorderLitres.toLocaleString()}L fuel bowser allocation).
                  </p>
                </div>
                <div>
                  <strong className="text-cyan-400 font-semibold font-mono">Forward Ammunition Point Rudra:</strong>
                  <p className="text-slate-400 mt-0.5">
                    POL-Tank-03 reported ultrasonic telemetry anomaly ({rudraLeakAnalysis.leakRateHourly} L/hr rapid drop, calculated runway {rudraLeakAnalysis.formattedHours} / {rudraLeakAnalysis.formattedDays}). Tank successfully isolated and quarantined. Combat readiness unaffected.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Item 3 */}
          <div className={`rounded-lg border overflow-hidden transition-all ${
            theme === 'light' ? 'border-slate-200 bg-slate-50/50' : 'border-slate-800/80 bg-slate-900/40'
          }`}>
            <button
              onClick={() => toggleSection(3)}
              className="w-full px-4 py-3 flex items-center justify-between text-left cursor-pointer hover:bg-slate-800/30 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold text-cyan-400">3. TERRAIN & ACCESS ROUTE PASSABILITY</span>
                <span className="text-[11px] font-mono text-red-400">(Pass K-4 Impassable)</span>
              </div>
              {openSections[3] ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </button>
            {openSections[3] && (
              <div className={`px-4 pb-4 pt-1 border-t text-xs leading-relaxed ${
                theme === 'light' ? 'border-slate-200 text-slate-700' : 'border-slate-800/60 text-slate-300'
              }`}>
                <p>
                  Pass K-4 is <strong className="text-red-400 font-mono font-bold">IMPASSABLE (&gt;=95% Closure)</strong> due to 420T rockfall and avalanche risk. Valley Bypass Route-9 has been designated primary military corridor (Class 40 all-weather). Convoy Vajra-4 was successfully diverted.
                </p>
              </div>
            )}
          </div>

          {/* Item 4 */}
          <div className={`rounded-lg border overflow-hidden transition-all ${
            theme === 'light' ? 'border-slate-200 bg-slate-50/50' : 'border-slate-800/80 bg-slate-900/40'
          }`}>
            <button
              onClick={() => toggleSection(4)}
              className="w-full px-4 py-3 flex items-center justify-between text-left cursor-pointer hover:bg-slate-800/30 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold text-cyan-400">4. REPLENISHMENT CONVOY MOVEMENTS</span>
                <span className="text-[11px] font-mono text-emerald-400">({dispatchProposal.status})</span>
              </div>
              {openSections[4] ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </button>
            {openSections[4] && (
              <div className={`px-4 pb-4 pt-1 border-t text-xs leading-relaxed ${
                theme === 'light' ? 'border-slate-200 text-slate-700' : 'border-slate-800/60 text-slate-300'
              }`}>
                <p>
                  Consolidated Multi-Drop Dispatch Plan #DP-2026-108 status: <strong className="text-emerald-400 font-mono">{dispatchProposal.status}</strong>.
                  Consolidates FP Agni and FP Himmat into 1 run, yielding 68 km distance saved and 140L fuel conserved with 88.0% composite vehicle packing efficiency.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className={`pt-4 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-mono text-slate-400 ${
          theme === 'light' ? 'border-slate-200' : 'border-slate-800'
        }`}>
          <span>COMPILED BY: S4 LOGISTICS OPERATIONS</span>
          <span className="text-emerald-400 font-semibold flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>DIGITALLY STAMPED & VERIFIED</span>
          </span>
        </div>
      </div>
    </div>
  );
};

