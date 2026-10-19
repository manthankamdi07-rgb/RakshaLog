import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldAlert,
  Truck,
  TrendingDown,
  Layers,
  AlertTriangle,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Zap,
  Activity,
  CheckCircle2,
  AlertOctagon,
  ShieldCheck,
  TrendingUp,
  Clock,
  Sparkles,
} from 'lucide-react';
import { ExpandableText } from '../components/ExpandableText';

export const OverviewView: React.FC = () => {
  const {
    nodes,
    alerts,
    convoys,
    dispatchProposal,
    setActiveTab,
    setIsDiagnosticModalOpen,
    acknowledgeAlert,
    stageForecastToDispatch,
    passK4Blocked,
    fpAgniBlizzard,
    tank03Leak,
    temperature,
    theme,
    agniFuelAnalysis,
    modelMetrics,
  } = useApp();

  const criticalAlerts = alerts.filter((a) => a.severity === 'CRITICAL');
  const avgDos = (
    nodes.reduce((acc, n) => acc + (n.dosClassI + n.dosClassIII + n.dosClassV) / 3, 0) /
    nodes.length
  ).toFixed(1);

  // Dynamic Operational Impact Calculations (Scenario-Sensitive)
  // 1. Stockouts Prevented
  const preventedItems: string[] = [];
  if (fpAgniBlizzard || temperature <= -18) {
    preventedItems.push('FP Agni (POL-D-01 Fuel)');
  }
  if (tank03Leak) {
    preventedItems.push('FAP Rudra (POL-D-03 Tank)');
  }
  if (preventedItems.length === 0) {
    preventedItems.push('FP Himmat (Class I Rations)');
  }
  const stockoutsPreventedCount = preventedItems.length;

  const [isRoiExpanded, setIsRoiExpanded] = useState(true);

  // 2. Distance Saved (km) - Single source of truth from dispatchProposal (68 km)
  const distanceSavedKm = dispatchProposal.efficiency.distanceSavedKm;
  const manualDistanceKm = 348;
  const rakshaDistanceKm = manualDistanceKm - distanceSavedKm;
  const distanceReductionPct = Number(((distanceSavedKm / manualDistanceKm) * 100).toFixed(1));

  // 3. Planning Time Reduced
  const manualPlanningMinutes = passK4Blocked ? 210 : 240;
  const rakshaPlanningMinutes = passK4Blocked ? 18 : 6;
  const timeReductionPct = Number((((manualPlanningMinutes - rakshaPlanningMinutes) / manualPlanningMinutes) * 100).toFixed(1));

  // 4. Convoy Consolidation Savings
  const vehiclesSavedCount = 1; // 1 Standby vehicle saved (3 separate dispatches -> 2 multi-drop vehicles)
  const fuelSavedL = dispatchProposal.efficiency.fuelSavedL;
  const manualFuelL = 420;
  const rakshaFuelL = manualFuelL - fuelSavedL;
  const fuelReductionPct = Number(((fuelSavedL / manualFuelL) * 100).toFixed(1));

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Page Title & Operational Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h1 className="font-display font-bold text-xl text-white tracking-wide flex items-center space-x-2">
            <span>SECTOR TRISHUL COMMAND OVERVIEW</span>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
              OPERATIONAL
            </span>
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Integrated Predictive Forward Supply Chain & Readiness Dashboard
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('sandbox')}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-mono transition-colors"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Simulate Anomaly (Pitch Demo)</span>
          </button>
        </div>
      </div>

      {/* 1. Tactical Metrics Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="glass-panel p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-mono uppercase tracking-wider">Avg Days of Supply (DOS)</span>
            <Layers className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className={`text-2xl font-mono font-bold ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{avgDos}</span>
            <span className="text-xs font-mono text-slate-400">Days</span>
            <span className="text-[10px] font-mono text-amber-500 ml-auto flex items-center">
              <TrendingDown className="w-3 h-3 mr-0.5" /> -1.4d (Blizzard)
            </span>
          </div>
          <div className={`w-full ${theme === 'light' ? 'bg-slate-200' : 'bg-slate-800'} h-1.5 rounded-full mt-3 overflow-hidden`}>
            <div className="bg-cyan-500 h-full rounded-full" style={{ width: '68%' }}></div>
          </div>
        </div>

        {/* Metric 2 */}
        <div
          onClick={() => setActiveTab('inventory')}
          className={`glass-panel p-4 rounded-xl border cursor-pointer transition-all ${
            criticalAlerts.length > 0
              ? theme === 'light'
                ? 'border-red-300 bg-red-50/70 hover:border-red-400'
                : 'border-red-600/60 bg-red-950/20 hover:border-red-500'
              : 'border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-mono uppercase tracking-wider">Critical Threats</span>
            <AlertTriangle className={`w-4 h-4 ${criticalAlerts.length > 0 ? (theme === 'light' ? 'text-red-600' : 'text-red-400') : 'text-slate-500'}`} />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className={`text-2xl font-mono font-bold ${criticalAlerts.length > 0 ? (theme === 'light' ? 'text-red-700' : 'text-red-400') : (theme === 'light' ? 'text-slate-900' : 'text-white')}`}>
              {criticalAlerts.length}
            </span>
            <span className="text-xs font-mono text-slate-400">Action Required</span>
            {criticalAlerts.length > 0 && (
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ml-auto ${
                theme === 'light'
                  ? 'bg-red-100 text-red-700 border border-red-300 animate-pulse'
                  : 'bg-red-900/80 text-red-200 animate-pulse'
              }`}>
                IMMEDIATE
              </span>
            )}
          </div>
          <p className="text-[10px] font-mono text-slate-400 mt-3 truncate">
            {passK4Blocked ? 'Pass K-4 Landslide + Tank-03 Leak' : 'All critical threats mitigated'}
          </p>
        </div>

        {/* Metric 3 */}
        <div
          onClick={() => setActiveTab('map')}
          className="glass-panel p-4 rounded-xl border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-mono uppercase tracking-wider">Active Convoys</span>
            <Truck className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className={`text-2xl font-mono font-bold ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{convoys.length}</span>
            <span className="text-xs font-mono text-slate-400">En Route</span>
            <span className={`text-[10px] font-mono ${theme === 'light' ? 'text-cyan-700 font-semibold' : 'text-cyan-400'} ml-auto flex items-center`}>
              1 Diversion
            </span>
          </div>
          <div className="flex items-center space-x-1.5 mt-3 text-[10px] font-mono text-slate-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>Vajra-4, Shakti-2, Chetak-1</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div
          onClick={() => setActiveTab('dispatch')}
          className="glass-panel p-4 rounded-xl border border-slate-800 hover:border-amber-500/50 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-mono uppercase tracking-wider">Replenishment Plan</span>
            <Activity className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className={`text-2xl font-mono font-bold ${theme === 'light' ? 'text-amber-700' : 'text-amber-300'}`}>
              {dispatchProposal.status === 'AUTHORIZED' ? 'STAMPED' : 'PENDING'}
            </span>
            <span className="text-[10px] font-mono text-slate-400 ml-auto">
              Plan #{dispatchProposal.id}
            </span>
          </div>
          <p className={`text-[10px] font-mono ${theme === 'light' ? 'text-emerald-700' : 'text-emerald-400'} mt-3 flex items-center justify-between`}>
            <span>Payload: {dispatchProposal.efficiency.payloadUtilizationPct}%</span>
            <span>+{distanceSavedKm}km Saved</span>
          </p>
        </div>
      </div>

      {/* 2. Operational Impact & Tactical ROI (4 KPI Cards - Collapsible) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div className="flex items-center space-x-2.5">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <h2 className={`font-display font-bold text-sm tracking-wide ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
              OPERATIONAL IMPACT & TACTICAL ROI
            </h2>
          </div>
          <button
            onClick={() => setIsRoiExpanded(!isRoiExpanded)}
            className="flex items-center space-x-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors px-2.5 py-1 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-900/60 cursor-pointer"
          >
            <span>{isRoiExpanded ? 'Hide Impact Metrics' : 'Show Impact Metrics (4 KPIs)'}</span>
            {isRoiExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {isRoiExpanded && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
            {/* Card 1: Stockouts Prevented */}
            <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-2.5 hover:border-slate-700 transition-all">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-mono uppercase tracking-wider">Stockouts Prevented</span>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="flex items-baseline justify-between">
                <span className={`text-2xl font-mono font-bold ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                  {stockoutsPreventedCount} <span className="text-xs font-normal text-slate-400 font-sans">Items</span>
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  100% PREVENTED
                </span>
              </div>
              <p className="text-[11px] font-mono text-cyan-400 truncate">
                {preventedItems.join(', ')}
              </p>
              <div className="pt-2 border-t border-slate-800/80 space-y-1 text-[10px] font-mono text-slate-400">
                <div className="flex justify-between">
                  <span>Before (manual):</span>
                  <span className="text-red-400 font-semibold">{stockoutsPreventedCount} Depleted</span>
                </div>
                <div className="flex justify-between">
                  <span>After (RAKSHALOG):</span>
                  <span className="text-emerald-400 font-semibold">0 Stockouts (Protected)</span>
                </div>
              </div>
            </div>

            {/* Card 2: Distance Saved (km) */}
            <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-2.5 hover:border-slate-700 transition-all">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-mono uppercase tracking-wider">Distance Saved</span>
                <TrendingUp className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="flex items-baseline justify-between">
                <span className={`text-2xl font-mono font-bold ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                  +{distanceSavedKm} <span className="text-xs font-normal text-slate-400 font-sans">km</span>
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                  -{distanceReductionPct}% ROUTE
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-400 truncate">
                Multi-Drop Consolidation (Plan #DP-2026-108)
              </p>
              <div className="pt-2 border-t border-slate-800/80 space-y-1 text-[10px] font-mono text-slate-400">
                <div className="flex justify-between">
                  <span>Before (manual):</span>
                  <span className="text-slate-300 font-semibold">{manualDistanceKm} km baseline</span>
                </div>
                <div className="flex justify-between">
                  <span>After (RAKSHALOG):</span>
                  <span className="text-cyan-300 font-semibold">{rakshaDistanceKm} km (Optimized)</span>
                </div>
              </div>
            </div>

            {/* Card 3: Planning Time Reduced */}
            <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-2.5 hover:border-slate-700 transition-all">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-mono uppercase tracking-wider">Planning Time</span>
                <Clock className="w-4 h-4 text-purple-400" />
              </div>
              <div className="flex items-baseline justify-between">
                <span className={`text-2xl font-mono font-bold ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                  {rakshaPlanningMinutes} <span className="text-xs font-normal text-slate-400 font-sans">Min</span>
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                  -{timeReductionPct}% CYCLE
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-400 truncate">
                Auto-Bundling & Crypto PIN vs 4.0h Manual
              </p>
              <div className="pt-2 border-t border-slate-800/80 space-y-1 text-[10px] font-mono text-slate-400">
                <div className="flex justify-between">
                  <span>Before (manual):</span>
                  <span className="text-slate-300 font-semibold">{passK4Blocked ? '3.5' : '4.0'} Hours baseline</span>
                </div>
                <div className="flex justify-between">
                  <span>After (RAKSHALOG):</span>
                  <span className="text-purple-300 font-semibold">{rakshaPlanningMinutes} Minutes (Instant)</span>
                </div>
              </div>
            </div>

            {/* Card 4: Convoy Consolidation Savings */}
            <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-2.5 hover:border-slate-700 transition-all">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[11px] font-mono uppercase tracking-wider">Convoy Consolidation</span>
                <Truck className="w-4 h-4 text-amber-400" />
              </div>
              <div className="flex items-baseline justify-between">
                <span className={`text-2xl font-mono font-bold ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                  {vehiclesSavedCount} <span className="text-xs font-normal text-slate-400 font-sans">Truck</span> &bull; +{fuelSavedL}L
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                  -{fuelReductionPct}% FUEL
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-400 truncate">
                Bundled Bowser + ALS (88% payload ratio)
              </p>
              <div className="pt-2 border-t border-slate-800/80 space-y-1 text-[10px] font-mono text-slate-400">
                <div className="flex justify-between">
                  <span>Before (manual):</span>
                  <span className="text-slate-300 font-semibold">3 Trucks &bull; {manualFuelL}L baseline</span>
                </div>
                <div className="flex justify-between">
                  <span>After (RAKSHALOG):</span>
                  <span className="text-amber-300 font-semibold">2 Trucks &bull; {rakshaFuelL}L Consumed</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Main Grid: Readiness Matrix (Left) + Critical Alerts & AI Action (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Sector Readiness Heatmap (Days of Supply) */}
        <div className="lg:col-span-2 glass-panel rounded-xl p-5 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div>
              <h2 className="font-display font-bold text-sm text-white tracking-wide">
                FORWARD FORMATION SUSTAINABILITY MATRIX
              </h2>
              <p className="text-[11px] text-slate-400 font-mono">
                Real-Time Days of Supply (DOS) calculated across 3 critical supply streams
              </p>
            </div>
            <button
              onClick={() => setActiveTab('forecast')}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
            >
              <span>View ML Forecast</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className={`border-b ${theme === 'light' ? 'border-slate-200 text-slate-600' : 'border-slate-800 text-slate-400'} font-mono text-[11px]`}>
                  <th className="py-2.5 px-3">NODE / FORMATION</th>
                  <th className="py-2.5 px-3">ELEVATION</th>
                  <th className="py-2.5 px-3 text-center">CLASS I (RATIONS)</th>
                  <th className="py-2.5 px-3 text-center">CLASS III (POL FUEL)</th>
                  <th className="py-2.5 px-3 text-center">CLASS V (AMMO)</th>
                  <th className="py-2.5 px-3 text-right">STATUS</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${theme === 'light' ? 'divide-slate-200' : 'divide-slate-800/60'} font-mono`}>
                {nodes.map((node) => {
                  const isAgniCritical = node.id === 'NODE-FP-AGNI';
                  const isRudraCritical = node.id === 'NODE-FAP-RUDRA';

                  return (
                    <tr
                      key={node.id}
                      className={`${theme === 'light' ? 'hover:bg-slate-50' : 'hover:bg-slate-800/40'} transition-colors cursor-pointer`}
                      onClick={() => {
                        if (isAgniCritical) setActiveTab('forecast');
                        else if (isRudraCritical) setIsDiagnosticModalOpen(true);
                        else setActiveTab('inventory');
                      }}
                    >
                      <td className="py-3 px-3">
                        <div className={`font-semibold ${theme === 'light' ? 'text-slate-900' : 'text-slate-200'}`}>{node.name}</div>
                        <div className={`text-[10px] ${theme === 'light' ? 'text-slate-500' : 'text-slate-500'}`}>{node.accessPass}</div>
                      </td>
                      <td className={`py-3 px-3 ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                        {node.elevationFt.toLocaleString()} ft
                      </td>

                      {/* Class I */}
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                            node.dosClassI < 5
                              ? theme === 'light'
                                ? 'bg-red-100 text-red-700 border border-red-300 font-bold'
                                : 'bg-red-950 text-red-400 border border-red-800'
                              : node.dosClassI < 10
                              ? theme === 'light'
                                ? 'bg-amber-100 text-amber-800 border border-amber-300 font-bold'
                                : 'bg-amber-950 text-amber-300 border border-amber-800'
                              : theme === 'light'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold'
                              : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/80'
                          }`}
                        >
                          {node.dosClassI.toFixed(1)}d
                        </span>
                      </td>

                      {/* Class III Fuel */}
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                            node.dosClassIII < 5
                              ? theme === 'light'
                                ? 'bg-red-100 text-red-700 border border-red-300 font-bold animate-pulse'
                                : 'bg-red-950 text-red-400 border border-red-800 animate-pulse'
                              : node.dosClassIII < 10
                              ? theme === 'light'
                                ? 'bg-amber-100 text-amber-800 border border-amber-300 font-bold'
                                : 'bg-amber-950 text-amber-300 border border-amber-800'
                              : theme === 'light'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold'
                              : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/80'
                          }`}
                        >
                          {node.dosClassIII.toFixed(1)}d
                        </span>
                      </td>

                      {/* Class V Ammo */}
                      <td className="py-3 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                          theme === 'light'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold'
                            : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/80'
                        }`}>
                          {node.dosClassV.toFixed(1)}d
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3 text-right">
                        {node.status === 'CRITICAL' ? (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            theme === 'light'
                              ? 'bg-red-100 text-red-700 border border-red-300'
                              : 'bg-red-950 text-red-400 border border-red-700'
                          }`}>
                            DEFICIT
                          </span>
                        ) : node.status === 'ADEQUATE' ? (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            theme === 'light'
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : 'bg-amber-950 text-amber-300 border border-amber-800'
                          }`}>
                            MONITOR
                          </span>
                        ) : (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            theme === 'light'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          }`}>
                            SECURE
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className={`flex items-center justify-between text-[11px] font-mono ${theme === 'light' ? 'text-slate-600 border-slate-200' : 'text-slate-500 border-slate-800/60'} pt-2 border-t`}>
            <span>Thresholds: Secure (&gt;10 DOS) | Advisory (5-10 DOS) | Critical Deficit (&lt;5 DOS)</span>
            <span className={`${theme === 'light' ? 'text-cyan-700 font-semibold' : 'text-cyan-400'}`}>Click any row to drill down</span>
          </div>
        </div>

        {/* Right Column: AI Actionable Recommendation + Active Incidents */}
        <div className="space-y-4">
          {/* AI Recommended Action Card */}
          <div className={`glass-panel p-4 rounded-xl border relative overflow-hidden transition-all ${
            theme === 'light'
              ? 'bg-white border-cyan-200 shadow-md'
              : 'border-cyan-700/60 bg-gradient-to-br from-cyan-950/40 via-slate-900 to-slate-900'
          }`}>
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl"></div>

            <div className={`flex items-center space-x-2 text-xs font-mono mb-2 ${theme === 'light' ? 'text-cyan-700' : 'text-cyan-400'}`}>
              <Zap className="w-4 h-4 fill-cyan-500 text-cyan-500" />
              <span className="font-bold tracking-wider">AI LOGISTICS DIRECTIVE</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ml-auto ${
                  theme === 'light'
                    ? 'bg-cyan-100 text-cyan-800 border border-cyan-300'
                    : 'bg-cyan-900 text-cyan-200'
                }`}
                title={modelMetrics.label}
              >
                CONFIDENCE: {modelMetrics.mlConfidencePct}%
              </span>
            </div>

            <h3 className={`font-semibold text-sm ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>
              Pre-Stocking Dispatch Required for FP Agni
            </h3>

            <ExpandableText
              summary={agniFuelAnalysis.directiveText.slice(0, 95) + '...'}
              details={agniFuelAnalysis.directiveText}
              summaryClassName={`text-xs mt-1.5 leading-relaxed font-sans ${theme === 'light' ? 'text-slate-600' : 'text-slate-300'}`}
              detailsClassName={`text-xs mt-1.5 leading-relaxed font-sans ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}
            />

            <div className={`mt-3 p-3 rounded-lg border space-y-1.5 text-[11px] font-mono transition-colors ${
              theme === 'light'
                ? 'bg-slate-50 border-slate-200 text-slate-700 shadow-inner'
                : 'bg-slate-950/70 border border-slate-800 text-slate-300'
            }`}>
              <div className="flex justify-between">
                <span>Recommended Load:</span>
                <span className={`${theme === 'light' ? 'text-cyan-800 font-bold' : 'text-cyan-300 font-semibold'}`}>4,600L Fuel + 400 MRE</span>
              </div>
              <div className="flex justify-between">
                <span>Proposed Route:</span>
                <span className={`${theme === 'light' ? 'text-emerald-800 font-bold' : 'text-emerald-300 font-semibold'}`}>Valley Bypass Corridor 9</span>
              </div>
            </div>

            <button
              onClick={stageForecastToDispatch}
              className={`mt-3 w-full py-2.5 px-3 rounded-lg font-bold font-mono text-xs shadow-md flex items-center justify-center space-x-2 transition-all ${
                theme === 'light'
                  ? 'bg-cyan-600 hover:bg-cyan-700 text-white shadow-cyan-600/20'
                  : 'bg-cyan-600 hover:bg-cyan-500 text-slate-950 shadow-cyan-950'
              }`}
            >
              <span>REVIEW & STAGE DISPATCH PLAN</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Active Incidents Feed */}
          <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-3">
            <div className={`flex items-center justify-between border-b ${theme === 'light' ? 'border-slate-200' : 'border-slate-800'} pb-2`}>
              <span className={`text-xs font-display font-bold tracking-wide flex items-center space-x-1.5 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                <AlertOctagon className="w-4 h-4 text-red-500" />
                <span>ACTIVE INCIDENTS</span>
              </span>
              <span className="text-[10px] font-mono text-slate-500">LIVE FEED</span>
            </div>

            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-2.5 rounded-lg border text-xs transition-colors ${
                    alert.severity === 'CRITICAL'
                      ? theme === 'light'
                        ? 'bg-red-50/90 border-red-200 hover:bg-red-100/70 text-slate-800 shadow-sm'
                        : 'bg-red-950/30 border-red-800/80 hover:bg-red-950/50'
                      : alert.severity === 'WARNING'
                      ? theme === 'light'
                        ? 'bg-amber-50/90 border-amber-200 hover:bg-amber-100/70 text-slate-800 shadow-sm'
                        : 'bg-amber-950/20 border-amber-800/60 hover:bg-amber-950/40'
                      : theme === 'light'
                      ? 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800'
                      : 'bg-slate-900 border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1">
                    <span
                      className={`font-semibold text-xs leading-tight ${
                        alert.severity === 'CRITICAL'
                          ? theme === 'light' ? 'text-red-700 font-bold' : 'text-red-300'
                          : theme === 'light' ? 'text-slate-900 font-semibold' : 'text-slate-200'
                      }`}
                    >
                      {alert.headline}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 shrink-0">
                      {alert.timestamp}
                    </span>
                  </div>

                  <p className={`text-[11px] mt-1 line-clamp-2 leading-tight ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                    {alert.detail}
                  </p>

                  <div className={`mt-2 flex items-center justify-between pt-1 border-t ${theme === 'light' ? 'border-slate-200' : 'border-slate-800/60'}`}>
                    <span className={`text-[10px] font-mono ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>{alert.sourceNode}</span>
                    <div className="flex items-center space-x-1.5">
                      {alert.category === 'IOT_LEAK' && (
                        <button
                          onClick={() => setIsDiagnosticModalOpen(true)}
                          className={`text-[10px] font-mono underline font-semibold ${theme === 'light' ? 'text-red-600 hover:text-red-800' : 'text-red-400 hover:text-red-300'}`}
                        >
                          Diagnose Leak
                        </button>
                      )}
                      {alert.category === 'WEATHER_TERRAIN' && (
                        <button
                          onClick={() => setActiveTab('map')}
                          className={`text-[10px] font-mono underline font-semibold ${theme === 'light' ? 'text-cyan-700 hover:text-cyan-900' : 'text-cyan-400 hover:text-cyan-300'}`}
                        >
                          View Pass
                        </button>
                      )}
                      {!alert.acknowledged && (
                        <button
                          onClick={() => acknowledgeAlert(alert.id)}
                          className={`text-[10px] font-mono px-2 py-0.5 rounded transition-colors ${
                            theme === 'light'
                              ? 'bg-slate-200 text-slate-800 hover:bg-slate-300'
                              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          Ack
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
