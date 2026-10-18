import React from 'react';
import { useApp } from '../context/AppContext';
import {
  FileText,
  Printer,
  Download,
  Award,
  TrendingUp,
  Clock,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { nodes, convoys, dispatchProposal } = useApp();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h1 className="font-display font-bold text-xl text-white tracking-wide flex items-center space-x-2">
            <span>OPERATIONAL REPORTS & LOG-SITREP</span>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
              AUDIT READY
            </span>
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Military Situation Reports & Logistics Resiliency Performance KPIs (PS-26251)
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>PRINT SITREP</span>
          </button>
        </div>
      </div>

      {/* 1. Logistics Resiliency Scorecard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <span className="text-[10px] font-mono uppercase text-slate-400">Forecast Accuracy (MAE)</span>
          <p className="text-2xl font-mono font-bold text-white mt-1">94.6%</p>
          <span className="text-[10px] font-mono text-emerald-400 flex items-center mt-1">
            <TrendingUp className="w-3 h-3 mr-1" /> +3.2% vs baseline
          </span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <span className="text-[10px] font-mono uppercase text-slate-400">Mean Time to Replenish</span>
          <p className="text-2xl font-mono font-bold text-white mt-1">14.2 Hours</p>
          <span className="text-[10px] font-mono text-emerald-400 flex items-center mt-1">
            <Clock className="w-3 h-3 mr-1" /> -62% reduction in cycle
          </span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <span className="text-[10px] font-mono uppercase text-slate-400">Pass Reroute Decision Time</span>
          <p className="text-2xl font-mono font-bold text-white mt-1">18 Minutes</p>
          <span className="text-[10px] font-mono text-cyan-400 flex items-center mt-1">
            Automated GIS vs 3.5h manual
          </span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <span className="text-[10px] font-mono uppercase text-slate-400">Convoy Asset Packing Ratio</span>
          <p className="text-2xl font-mono font-bold text-white mt-1">87.4%</p>
          <span className="text-[10px] font-mono text-emerald-400 flex items-center mt-1">
            Multi-drop consolidation
          </span>
        </div>
      </div>

      {/* 2. Formal Military Log-Sitrep Preview */}
      <div className="glass-panel p-6 rounded-xl border border-slate-800 space-y-4 bg-slate-950 font-mono text-xs">
        <div className="border-b border-slate-800 pb-3 text-center space-y-1">
          <p className="text-[11px] text-red-400 font-bold uppercase tracking-widest">
            CONFIDENTIAL // FORWARD OPERATIONS ONLY
          </p>
          <h2 className="text-sm font-bold text-white">
            DAILY LOGISTICS SITUATION REPORT (LOG-SITREP) — SECTOR TRISHUL
          </h2>
          <p className="text-[10px] text-slate-500">
            HEADQUARTERS BRIGADE LOGISTICS OPS ROOM | DTG: 181650H OCT 2026
          </p>
        </div>

        <div className="space-y-3 text-slate-300 leading-relaxed">
          <div>
            <h4 className="text-cyan-400 font-bold">1. GENERAL SUSTAINABILITY APPRAISAL:</h4>
            <p className="text-[11px] text-slate-400 pl-3">
              Sector average sustainability stands at <strong className="text-slate-200">14.2 Days of Supply (DOS)</strong>.
              All forward outposts maintain operational integrity. Pre-emptive winter rationing measures engaged across high-altitude posts.
            </p>
          </div>

          <div>
            <h4 className="text-cyan-400 font-bold">2. CRITICAL FORMATION DEFICIENCIES & ACTIONS:</h4>
            <ul className="list-disc list-inside text-[11px] text-slate-400 pl-3 space-y-1">
              <li>
                <strong className="text-slate-200">Forward Post Agni (13.8k ft):</strong> Class III Arctic Diesel runway dropped to 3.2 days due to Western Disturbance sub-zero cold wave (-18°C). Deficit mitigated by staging Dispatch Plan #DP-2026-108 (4,600L fuel bowser allocation).
              </li>
              <li>
                <strong className="text-slate-200">Forward Ammunition Point Rudra:</strong> POL-Tank-03 reported ultrasonic telemetry anomaly (-120 L/hr rapid drop). Tank successfully isolated and quarantined. Zero impact to active combat readiness.
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-cyan-400 font-bold">3. TERRAIN & ACCESS ROUTE PASSABILITY:</h4>
            <p className="text-[11px] text-slate-400 pl-3">
              Pass K-4 is <strong className="text-red-400">IMPASSABLE</strong> due to 420T rockfall and avalanche risk. Valley Bypass Route-9 has been designated primary military corridor (Class 40 all-weather). Convoy Vajra-4 successfully diverted.
            </p>
          </div>

          <div>
            <h4 className="text-cyan-400 font-bold">4. REPLENISHMENT CONVOY MOVEMENTS:</h4>
            <p className="text-[11px] text-slate-400 pl-3">
              Consolidated Multi-Drop Dispatch Plan #DP-2026-108 status: <strong className="text-emerald-400">{dispatchProposal.status}</strong>.
              Consolidates FP Agni and FP Himmat into 1 run, yielding 68 km distance saved and 140L fuel conserved.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <span>COMPILED BY: S4 LOGISTICS OPERATIONS</span>
          <span className="text-emerald-400 font-bold">DIGITALLY STAMPED & VERIFIED</span>
        </div>
      </div>
    </div>
  );
};
