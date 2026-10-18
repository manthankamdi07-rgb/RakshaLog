import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Lock, AlertCircle, X, CheckCircle } from 'lucide-react';

export const CommanderPinModal: React.FC = () => {
  const { isPinModalOpen, setIsPinModalOpen, authorizeDispatch, currentPersona, dispatchProposal } = useApp();
  const [pin, setPin] = useState<string>('1971');
  const [error, setError] = useState<string>('');

  if (!isPinModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length < 4) {
      setError('Please enter a valid 4-digit Commander Authorization PIN.');
      return;
    }
    const success = authorizeDispatch(pin);
    if (!success) {
      setError('Authorization failed. Invalid PIN.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-slate-900 border-2 border-amber-600/80 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-950/80 via-slate-900 to-amber-950/80 p-4 border-b border-amber-800/60 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-display font-bold text-slate-100 text-sm tracking-wide">
                COMMANDER AUTHORIZATION GATE
              </h3>
              <p className="text-[10px] font-mono text-amber-400">
                MILITARY DIGITAL SIGNATURE PROTOCOL
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsPinModalOpen(false)}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Plan Summary */}
        <div className="p-5 space-y-4">
          <div className="bg-slate-950/80 rounded-lg p-3 border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between text-slate-400 font-mono">
              <span>DISPATCH PLAN:</span>
              <span className="text-cyan-400 font-semibold">{dispatchProposal.id}</span>
            </div>
            <div className="flex justify-between text-slate-400 font-mono">
              <span>CONVOY TARGET:</span>
              <span className="text-slate-200">{dispatchProposal.targetSector}</span>
            </div>
            <div className="flex justify-between text-slate-400 font-mono">
              <span>PAYLOAD OPTIMIZATION:</span>
              <span className="text-emerald-400 font-semibold">
                {dispatchProposal.efficiency.payloadUtilizationPct}% Weight Ratio
              </span>
            </div>
            <div className="flex justify-between text-slate-400 font-mono">
              <span>RESOURCE SAVINGS:</span>
              <span className="text-emerald-400 font-semibold">
                +{dispatchProposal.efficiency.distanceSavedKm} km / {dispatchProposal.efficiency.fuelSavedL}L Fuel
              </span>
            </div>
          </div>

          <div className="text-xs text-slate-300">
            Authorizing will commit this multi-drop manifest, generate a tamper-evident cryptographic hash, and push loading instructions directly to Base Depot Garuda.
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1.5">
                Commander Security PIN (Default Demo: 1971)
              </label>
              <div className="relative">
                <input
                  type="password"
                  maxLength={6}
                  value={pin}
                  onChange={(e) => {
                    setPin(e.target.value);
                    setError('');
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 font-mono text-center tracking-widest text-lg text-amber-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  placeholder="••••"
                  autoFocus
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
              </div>
              {error && (
                <p className="text-[11px] text-red-400 font-mono mt-1 flex items-center space-x-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{error}</span>
                </p>
              )}
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setIsPinModalOpen(false)}
                className="w-1/3 py-2.5 rounded-lg border border-slate-700 text-slate-300 text-xs font-medium hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-2/3 py-2.5 rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold text-xs shadow-lg shadow-amber-900/40 transition-all flex items-center justify-center space-x-2"
              >
                <CheckCircle className="w-4 h-4 text-slate-950" />
                <span>AUTHORIZE & SIGN DISPATCH</span>
              </button>
            </div>
          </form>

          <p className="text-[10px] font-mono text-center text-slate-500">
            Signee: {currentPersona.name} ({currentPersona.title})
          </p>
        </div>
      </div>
    </div>
  );
};
