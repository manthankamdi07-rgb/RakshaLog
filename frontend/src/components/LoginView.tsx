import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  Radio,
  Lock,
  Sun,
  Moon,
  ArrowRight,
  UserCheck,
  CheckCircle2,
  KeyRound,
  AlertTriangle,
} from 'lucide-react';

export const LoginView: React.FC = () => {
  const { signIn, theme, toggleTheme, currentDtgClock } = useApp();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '4821' || pin.length >= 4) {
      signIn('maj_rao');
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col justify-between ${
      theme === 'light' ? 'bg-slate-100 text-slate-800' : 'bg-[#070A11] text-slate-100'
    } transition-colors duration-200 select-none`}>
      {/* Top Banner */}
      <header className={`h-14 border-b px-6 flex items-center justify-between ${
        theme === 'light' ? 'border-slate-200 bg-white/80' : 'border-slate-800/80 bg-[#0B0F19]/80'
      } backdrop-blur-md`}>
        <div className="flex items-center space-x-3">
          <img
            src="/logo.png"
            alt="ForwardLog AI Logo"
            className="w-8 h-8 rounded-lg object-contain shadow-xs shrink-0"
          />
          <div>
            <div className="flex items-center space-x-1.5">
              <span className={`font-display font-bold text-base tracking-wider ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                FORWARDLOG AI
              </span>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-semibold ${
                theme === 'light' ? 'bg-cyan-50 text-cyan-800 border border-cyan-200' : 'bg-cyan-950 text-cyan-400 border border-cyan-800'
              }`}>
                PS-26251
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono tracking-wide leading-none">
              PREDICTIVE FORWARD LOGISTICS OS
            </p>
          </div>
        </div>

        {/* DTG & Theme Selector */}
        <div className="flex items-center space-x-3">
          <div className={`font-mono text-xs px-3 py-1 rounded-md border ${
            theme === 'light' ? 'bg-slate-100 border-slate-200 text-slate-700' : 'bg-slate-900 border-slate-800 text-slate-300'
          }`}>
            <span className="text-slate-400 mr-1.5">DTG:</span>
            <span className="text-cyan-400 font-semibold">{currentDtgClock}</span>
          </div>

          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg border text-xs font-mono transition-colors flex items-center space-x-1.5 cursor-pointer ${
              theme === 'light'
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                : 'bg-slate-900 hover:bg-slate-800 text-amber-300 border-slate-700'
            }`}
            title="Toggle Light / Dark Mode"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline text-xs font-semibold">Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-indigo-600" />
                <span className="hidden sm:inline text-xs font-semibold">Dark Mode</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Authentication Centerpiece */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className={`max-w-2xl w-full p-8 rounded-2xl border ${
          theme === 'light' ? 'bg-white border-slate-200 shadow-xl' : 'glass-panel bg-slate-950/90 border-slate-800/90 shadow-2xl'
        } space-y-6 animate-fade-in`}>
          {/* Header */}
          <div className="text-center space-y-2 border-b border-slate-800/60 pb-5">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-800 text-cyan-300 text-xs font-mono font-semibold">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>SECURE TERMINAL ACCESS &bull; SECTOR TRISHUL</span>
            </div>
            <h1 className={`font-display font-bold text-2xl tracking-wide ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
              TACTICAL OPERATING SYSTEM AUTHENTICATION
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              Classified access restricted to authorized Northern Command logistics and signals officers.
            </p>
          </div>

          {/* Quick Persona Sign-In (Recommended) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400 font-semibold uppercase tracking-wider">Fast-Track Officer Sign In</span>
              <span className="text-[10px] text-cyan-400">Single-Click Access</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Maj. Vikram Rao */}
              <button
                onClick={() => signIn('maj_rao')}
                className={`p-4 rounded-xl border text-left transition-all hover:scale-[1.02] cursor-pointer group ${
                  theme === 'light'
                    ? 'bg-slate-50 hover:bg-cyan-50/50 border-slate-200 hover:border-cyan-300'
                    : 'bg-slate-900/80 hover:bg-cyan-950/30 border-slate-800 hover:border-cyan-700'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-blue-950 border border-blue-700 flex items-center justify-center font-mono font-bold text-blue-300 text-xs mb-2">
                  VR
                </div>
                <h3 className={`font-bold text-sm ${theme === 'light' ? 'text-slate-900' : 'text-white'} group-hover:text-cyan-400 transition-colors`}>
                  Maj. Vikram Rao
                </h3>
                <p className="text-[11px] text-cyan-400 font-mono">Logistics Officer (S4)</p>
                <p className="text-[10px] text-slate-400 mt-1">Requisitions & Multi-Drop Dispatch</p>
              </button>

              {/* Brig. R. S. Chauhan */}
              <button
                onClick={() => signIn('brig_chauhan')}
                className={`p-4 rounded-xl border text-left transition-all hover:scale-[1.02] cursor-pointer group ${
                  theme === 'light'
                    ? 'bg-slate-50 hover:bg-amber-50/50 border-slate-200 hover:border-amber-300'
                    : 'bg-slate-900/80 hover:bg-amber-950/30 border-slate-800 hover:border-amber-700'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-amber-950 border border-amber-700 flex items-center justify-center font-mono font-bold text-amber-300 text-xs mb-2">
                  RC
                </div>
                <h3 className={`font-bold text-sm ${theme === 'light' ? 'text-slate-900' : 'text-white'} group-hover:text-amber-400 transition-colors`}>
                  Brig. R. S. Chauhan
                </h3>
                <p className="text-[11px] text-amber-400 font-mono">Sector Commander</p>
                <p className="text-[10px] text-slate-400 mt-1">PIN Cryptographic Approval Gate</p>
              </button>

              {/* Capt. Neha Sharma */}
              <button
                onClick={() => signIn('capt_sharma')}
                className={`p-4 rounded-xl border text-left transition-all hover:scale-[1.02] cursor-pointer group ${
                  theme === 'light'
                    ? 'bg-slate-50 hover:bg-emerald-50/50 border-slate-200 hover:border-emerald-300'
                    : 'bg-slate-900/80 hover:bg-emerald-950/30 border-slate-800 hover:border-emerald-700'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-700 flex items-center justify-center font-mono font-bold text-emerald-300 text-xs mb-2">
                  NS
                </div>
                <h3 className={`font-bold text-sm ${theme === 'light' ? 'text-slate-900' : 'text-white'} group-hover:text-emerald-400 transition-colors`}>
                  Capt. Neha Sharma
                </h3>
                <p className="text-[11px] text-emerald-400 font-mono">Signals & IoT Admin</p>
                <p className="text-[10px] text-slate-400 mt-1">Transducer & Telemetry Analysis</p>
              </button>
            </div>
          </div>

          {/* Alternative: PIN Authentication */}
          <div className="pt-2 border-t border-slate-800/60">
            <form onSubmit={handlePinSubmit} className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label className="text-xs font-mono text-slate-400 flex items-center space-x-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Manual PIN Sign In (Master Clearance: 4821):</span>
                </label>
                <button
                  type="button"
                  onClick={() => setPin('4821')}
                  className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
                >
                  Auto-fill demo PIN (4821)
                </button>
              </div>

              <div className="flex space-x-2">
                <input
                  type="password"
                  maxLength={6}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Enter 4-digit security PIN"
                  className={`flex-1 px-4 py-2.5 rounded-lg border font-mono text-sm tracking-widest focus:outline-none focus:ring-1 transition-all ${
                    error
                      ? 'border-red-500 bg-red-950/30 text-red-200 focus:ring-red-500'
                      : theme === 'light'
                      ? 'border-slate-300 bg-slate-50 text-slate-900 focus:ring-cyan-500'
                      : 'border-slate-700 bg-slate-900 text-white focus:ring-cyan-500'
                  }`}
                />
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 text-slate-950 font-bold font-mono text-xs flex items-center space-x-2 transition-all cursor-pointer shadow-md"
                >
                  <span>AUTHENTICATE</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              {error && (
                <p className="text-xs font-mono text-red-400 flex items-center space-x-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Invalid PIN code. Please use demo PIN 4821 or click an officer persona above.</span>
                </p>
              )}
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={`h-8 border-t px-6 flex items-center justify-between text-[11px] font-mono ${
        theme === 'light' ? 'border-slate-200 bg-white text-slate-500' : 'border-slate-800 bg-[#070A11] text-slate-500'
      }`}>
        <span>FORWARDLOG AI TACTICAL LOGISTICS OS &bull; SECTOR TRISHUL (PS-26251)</span>
        <span className="text-slate-400 font-semibold tracking-wide">Synthetic Data / Unclassified</span>
      </footer>
    </div>
  );
};
