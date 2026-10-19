import React from 'react';
import { useApp } from '../context/AppContext';
import { AlertTriangle, Activity, ShieldAlert, X, Volume2, Ban, CheckCircle } from 'lucide-react';

export const DiagnosticModal: React.FC = () => {
  const { isDiagnosticModalOpen, setIsDiagnosticModalOpen, remedyTankLeak, rudraLeakAnalysis } = useApp();

  if (!isDiagnosticModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-xl bg-slate-900 border-2 border-red-600/80 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-950 via-slate-900 to-red-950 p-4 border-b border-red-800/60 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse">
              <ShieldAlert className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h3 className="font-display font-bold text-slate-100 text-sm tracking-wide flex items-center space-x-2">
                <span>IOT SENSOR ANOMALY DIAGNOSTIC</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-900 text-red-200 border border-red-600">
                  CRITICAL
                </span>
              </h3>
              <p className="text-[10px] font-mono text-red-400">
                SENSOR: US-TANK-03 | NODE: FAP RUDRA (TANK 03)
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsDiagnosticModalOpen(false)}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Telemetry Highlights */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 text-center">
              <p className="text-[10px] font-mono text-slate-400 uppercase">Current Volume</p>
              <p className="text-lg font-mono font-bold text-red-400 mt-0.5">{rudraLeakAnalysis.volumeRemainingLitres.toLocaleString()} L</p>
              <p className="text-[10px] text-red-400 font-mono">Runway: {rudraLeakAnalysis.formattedDays} ({rudraLeakAnalysis.formattedHours})</p>
            </div>
            <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 text-center">
              <p className="text-[10px] font-mono text-slate-400 uppercase">Depletion Rate</p>
              <p className="text-lg font-mono font-bold text-red-400 mt-0.5">{rudraLeakAnalysis.leakRateHourly} L/hr</p>
              <p className="text-[10px] text-red-400 font-mono">Baseline: 0 L/hr</p>
            </div>
            <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 text-center">
              <p className="text-[10px] font-mono text-slate-400 uppercase">Dispense Gate</p>
              <p className="text-sm font-mono font-bold text-emerald-400 mt-1">LOCKED (0 L)</p>
              <p className="text-[10px] text-slate-400 font-mono">No auth burn</p>
            </div>
          </div>

          {/* Anomaly Waveform Graph (SVG) */}
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-mono text-slate-400 flex items-center space-x-1">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                <span>ULTRASONIC LEVEL TRACE (LAST 60 MINS)</span>
              </span>
              <span className="text-[10px] font-mono text-red-400">UNSCHEDULED DRAW DETECTED</span>
            </div>
            <div className="h-28 w-full relative flex items-end">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 400 100" preserveAspectRatio="none">
                {/* Expected flat baseline */}
                <path
                  d="M 0,20 L 400,20"
                  fill="none"
                  stroke="#475569"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
                {/* Sudden rapid drop starting at x=180 */}
                <path
                  d="M 0,20 L 160,20 L 220,55 L 280,75 L 340,88 L 400,95"
                  fill="none"
                  stroke="#EF4444"
                  strokeWidth="2.5"
                />
                <circle cx="400" cy="95" r="4" fill="#EF4444" className="animate-ping" />
              </svg>
            </div>
            <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
              <span>15:45 hrs (Stable)</span>
              <span className="text-red-400">16:15 hrs (Rupture Event)</span>
              <span className="text-red-400 font-bold">16:45 hrs ({rudraLeakAnalysis.volumeRemainingLitres.toLocaleString()} L)</span>
            </div>
          </div>

          {/* Root Cause Probabilities */}
          <div className="space-y-1.5">
            <p className="text-[11px] font-mono uppercase text-slate-400">ML Anomaly Root-Cause Analysis:</p>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs bg-slate-800/60 px-3 py-1.5 rounded border border-slate-700">
                <span className="text-slate-200">1. Physical Storage Puncture / Cold Crack</span>
                <span className="font-mono font-bold text-red-400">89% Match</span>
              </div>
              <div className="flex items-center justify-between text-xs bg-slate-800/40 px-3 py-1.5 rounded border border-slate-800">
                <span className="text-slate-300">2. Flange Gasket Seal Failure</span>
                <span className="font-mono text-amber-400">9% Match</span>
              </div>
              <div className="flex items-center justify-between text-xs bg-slate-800/40 px-3 py-1.5 rounded border border-slate-800">
                <span className="text-slate-400">3. Transducer Acoustic Echo Drift</span>
                <span className="font-mono text-slate-400">2% Match</span>
              </div>
            </div>
          </div>

          {/* Operational Remediation Actions */}
          <div className="pt-2 border-t border-slate-800 space-y-2">
            <p className="text-[11px] font-mono uppercase text-slate-400">Initiate Operational Action:</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => remedyTankLeak('ISOLATE')}
                className="py-2.5 px-2 rounded-lg bg-red-950/80 hover:bg-red-900 border border-red-700 text-red-200 font-mono text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors"
              >
                <Ban className="w-3.5 h-3.5 text-red-400" />
                <span>ISOLATE TANK</span>
              </button>
              <button
                onClick={() => remedyTankLeak('SIREN')}
                className="py-2.5 px-2 rounded-lg bg-amber-950/80 hover:bg-amber-900 border border-amber-700 text-amber-200 font-mono text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors"
              >
                <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                <span>TRIGGER SIREN</span>
              </button>
              <button
                onClick={() => remedyTankLeak('FALSE_ALARM')}
                className="py-2.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-300 font-mono text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors"
              >
                <CheckCircle className="w-3.5 h-3.5 text-slate-400" />
                <span>CLEAR SENSOR</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
