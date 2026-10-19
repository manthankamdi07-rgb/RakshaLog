import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  ShieldCheck,
  FileCheck,
  Layers,
  ArrowRight,
  TrendingUp,
  Compass,
} from 'lucide-react';
import { FleetCapacityPanel } from '../components/FleetCapacityPanel';

export const DispatchView: React.FC = () => {
  const { dispatchProposal, setIsPinModalOpen, currentPersona, agniFuelAnalysis, theme } = useApp();
  const [activeTab, setActiveTab] = useState<'fleet' | 'plan' | 'all'>('fleet');

  const isAuthorized = dispatchProposal.status === 'AUTHORIZED';

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 ${theme === 'light' ? 'border-slate-200' : 'border-slate-800'}`}>
        <div>
          <h1 className={`font-display font-bold text-xl tracking-wide flex items-center space-x-2 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
            <span>MULTI-DROP DISPATCH OPTIMIZER & AUTHORIZATION</span>
            <span
              className={`text-xs font-mono font-semibold px-2 py-0.5 rounded ${
                isAuthorized
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  : 'bg-amber-950 text-amber-300 border border-amber-800 animate-pulse'
              }`}
            >
              {dispatchProposal.status.replace('_', ' ')}
            </span>
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Automated Requisition Bundling & Cryptographic Convoy Sign-Off (PS-26251)
          </p>
        </div>

        <div>
          {!isAuthorized ? (
            <button
              onClick={() => setIsPinModalOpen(true)}
              className="py-2 px-4 rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold font-mono text-xs shadow-lg shadow-amber-950 flex items-center space-x-2 transition-all"
            >
              <ShieldCheck className="w-4 h-4 text-slate-950" />
              <span>AUTHORIZE DISPATCH PLAN (PIN)</span>
            </button>
          ) : (
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-700 text-emerald-300 font-mono text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>DIGITALLY STAMPED & LOCKED</span>
            </div>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className={`flex flex-wrap items-center gap-2 border-b pb-3 ${theme === 'light' ? 'border-slate-200' : 'border-slate-800'}`}>
        <button
          onClick={() => setActiveTab('fleet')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-mono transition-all ${
            activeTab === 'fleet'
              ? theme === 'light'
                ? 'bg-cyan-600 text-white font-bold shadow-md shadow-cyan-200'
                : 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-900/40'
              : theme === 'light'
              ? 'bg-white text-slate-700 hover:text-slate-900 border border-slate-200 hover:border-slate-300'
              : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
          }`}
        >
          <Truck className="w-3.5 h-3.5" />
          <span>Fleet & Capacity Matrix</span>
        </button>

        <button
          onClick={() => setActiveTab('plan')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-mono transition-all ${
            activeTab === 'plan'
              ? theme === 'light'
                ? 'bg-cyan-600 text-white font-bold shadow-md shadow-cyan-200'
                : 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-900/40'
              : theme === 'light'
              ? 'bg-white text-slate-700 hover:text-slate-900 border border-slate-200 hover:border-slate-300'
              : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Dispatch Plan & Waypoints</span>
          <span className="text-[10px] opacity-75">DP-2026-108</span>
        </button>

        <button
          onClick={() => setActiveTab('all')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-mono transition-all ${
            activeTab === 'all'
              ? theme === 'light'
                ? 'bg-cyan-600 text-white font-bold shadow-md shadow-cyan-200'
                : 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-900/40'
              : theme === 'light'
              ? 'bg-white text-slate-700 hover:text-slate-900 border border-slate-200 hover:border-slate-300'
              : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>All Modules</span>
        </button>
      </div>

      {/* Fleet & Capacity Tab Section (Requirement 1 - 5) */}
      {(activeTab === 'fleet' || activeTab === 'all') && (
        <FleetCapacityPanel
          theme={theme}
          fuelReorderLitres={agniFuelAnalysis.recommendedReorderLitres}
        />
      )}

      {/* Main Grid: Plan Specification (Left 2 cols) + Load Optimization Meters (Right col) */}
      {(activeTab === 'plan' || activeTab === 'all') && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Manifest & Multi-Drop Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Plan Meta Card */}
          <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400">PLAN NUMBER</span>
                <h3 className="font-mono font-bold text-lg text-cyan-300">{dispatchProposal.id}</h3>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono uppercase text-slate-400">DEPARTURE WINDOW</span>
                <p className="font-mono text-xs text-slate-200">{dispatchProposal.departureWindow}</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed pt-1 border-t border-slate-800">
              <strong className="text-cyan-400">AI Clustering Rationale:</strong> {dispatchProposal.rationale}
            </p>

            {isAuthorized && (
              <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-700/80 space-y-1 text-xs font-mono">
                <div className="flex justify-between text-emerald-300 font-bold">
                  <span>CRYPTOGRAPHIC SIGNATURE:</span>
                  <span>{dispatchProposal.digitalSignature}</span>
                </div>
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>Authorized By: {dispatchProposal.approvedBy}</span>
                  <span>Manifest Pushed: Base Depot Garuda Bay 2</span>
                </div>
              </div>
            )}
          </div>

          {/* Multi-Drop Route Stops */}
          <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-4">
            <h2 className="font-display font-bold text-sm text-white">
              MULTI-DROP WAYPOINTS & DISCHARGE MANIFEST
            </h2>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
              {/* Origin */}
              <div className="relative">
                <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-cyan-500 border-2 border-slate-900"></div>
                <div className="text-xs font-mono">
                  <span className="text-cyan-400 font-bold">ORIGIN: Base Depot Garuda</span>
                  <span className="text-slate-500 ml-2">Loading Departure: 05:30 hrs</span>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Payload: {agniFuelAnalysis.recommendedReorderLitres.toLocaleString()}L Arctic Fuel (Bowser 1) + 1,000 MRE Rations + 20 Med Kits (Truck 1)
                  </p>
                </div>
              </div>

              {/* Stop 1 */}
              <div className="relative">
                <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-red-500 border-2 border-slate-900 animate-pulse"></div>
                <div className="text-xs font-mono bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-red-300 font-bold">STOP 1: Forward Post Agni (Priority)</span>
                    <span className="text-cyan-400">ETA: +3.5 hrs (09:00 hrs)</span>
                  </div>
                  <p className="text-slate-300 text-[11px] mt-1">
                    Discharge: {agniFuelAnalysis.recommendedReorderLitres.toLocaleString()} Litres Arctic Diesel (Refuels US-AGNI-TANK1) + 400 MRE Packs
                  </p>
                  <p className="text-emerald-400 text-[10px] mt-1">
                    Impact: Restores FP Agni Days of Supply from {agniFuelAnalysis.formattedDays} &rarr; 14.5d (Safe against blizzard)
                  </p>
                </div>
              </div>

              {/* Stop 2 */}
              <div className="relative">
                <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-900"></div>
                <div className="text-xs font-mono bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-300 font-bold">STOP 2: Forward Post Himmat</span>
                    <span className="text-cyan-400">ETA: +5.5 hrs (11:00 hrs)</span>
                  </div>
                  <p className="text-slate-300 text-[11px] mt-1">
                    Discharge: 600 MRE Packs + 20 Cold Weather Trauma Kits
                  </p>
                  <p className="text-emerald-400 text-[10px] mt-1">
                    Impact: Restores FP Himmat Ration Days of Supply from 8.5d &rarr; 16.0d
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Vehicle Packing & Resource Optimization */}
        <div className="space-y-4">
          <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-4">
            <h2 className="font-display font-bold text-sm text-white flex items-center space-x-2">
              <Truck className="w-4 h-4 text-cyan-400" />
              <span>VEHICLE PACKING EFFICIENCY</span>
            </h2>

            {/* Vehicle 1 Meter */}
            <div className="space-y-2 p-3 rounded-lg bg-slate-900 border border-slate-800">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-200 font-semibold">4x4 2.5-Ton ALS Truck</span>
                <span className="text-cyan-400 font-bold">84% Weight Ratio</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-cyan-500 h-full rounded-full" style={{ width: '84%' }}></div>
              </div>
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>Load: 2.1T / 2.5T Max</span>
                <span>Vol: 78% Filled</span>
              </div>
            </div>

            {/* Vehicle 2 Meter */}
            <div className="space-y-2 p-3 rounded-lg bg-slate-900 border border-slate-800">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-200 font-semibold">5,000L Arctic POL Bowser</span>
                <span className="text-emerald-400 font-bold">92% Volume Ratio</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '92%' }}></div>
              </div>
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>Load: {agniFuelAnalysis.recommendedReorderLitres.toLocaleString()}L / 5,000L</span>
                <span>Baffled Anti-Slosh: OK</span>
              </div>
            </div>

            {/* Total Consolidation Scorecard */}
            <div className="p-3.5 rounded-lg bg-emerald-950/30 border border-emerald-800/80 space-y-2">
              <span className="text-[10px] font-mono uppercase text-emerald-400 font-semibold">
                CONVOY CONSOLIDATION SAVINGS
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-200">
                <div>
                  <span className="text-slate-400 block text-[10px]">DISTANCE SAVED:</span>
                  <span className="text-emerald-400 font-bold">+68 km</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">FUEL CONSERVED:</span>
                  <span className="text-emerald-400 font-bold">+140 Litres</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">VEHICLES SAVED:</span>
                  <span className="text-emerald-400 font-bold">1 Standby</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">ROUTE RISK SCORE:</span>
                  <span className="text-emerald-400 font-bold">14.5 (Low)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};
