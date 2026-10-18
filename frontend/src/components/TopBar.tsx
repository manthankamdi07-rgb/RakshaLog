import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Radio,
  Volume2,
  VolumeX,
  ChevronDown,
  AlertTriangle,
  Zap,
  Sun,
  Moon,
} from 'lucide-react';

export const TopBar: React.FC = () => {
  const {
    currentPersona,
    switchPersona,
    alerts,
    isMuted,
    setIsMuted,
    setActiveTab,
    theme,
    toggleTheme,
    playTacticalSound,
  } = useApp();
  const [currentTime, setCurrentTime] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const day = String(now.getDate()).padStart(2, '0');
      const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      const month = monthNames[now.getMonth()];
      const year = now.getFullYear();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setCurrentTime(`${day}${hours}${minutes}H ${month} ${year} (${hours}:${minutes}:${seconds})`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const unacknowledgedCount = alerts.filter((a) => !a.acknowledged).length;

  return (
    <header className={`h-14 border-b ${theme === 'light' ? 'border-slate-200 bg-white/95 text-slate-800' : 'border-slate-800 bg-[#0B0F19]/90 text-slate-100'} backdrop-blur-md px-4 flex items-center justify-between sticky top-0 z-40 select-none transition-colors duration-200`}>
      {/* Left: Branding & Sector */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-cyan-500 to-blue-700 flex items-center justify-center font-bold text-white shadow-lg shadow-cyan-500/20 shrink-0">
            <Radio className="w-4 h-4 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className={`font-display font-bold text-base tracking-wider ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>RAKSHALOG</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-semibold ${
                theme === 'light'
                  ? 'bg-cyan-50 text-cyan-800 border border-cyan-200'
                  : 'bg-cyan-950 text-cyan-400 border border-cyan-800'
              }`}>
                PS-26251
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono tracking-wide">
              PREDICTIVE FORWARD LOGISTICS COMMAND
            </p>
          </div>
        </div>

        <div className={`hidden md:flex items-center space-x-2 pl-4 border-l ${theme === 'light' ? 'border-slate-200' : 'border-slate-800'}`}>
          <span className="text-xs font-mono text-slate-400">SECTOR:</span>
          <span className={`text-xs font-mono font-semibold px-2 py-0.5 rounded ${
            theme === 'light'
              ? 'bg-slate-100 text-cyan-800 border border-slate-200'
              : 'bg-slate-800/80 text-cyan-300 border border-slate-700'
          }`}>
            TRISHUL (NORTH-EAST)
          </span>
          <span className="flex items-center space-x-1 text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>TACTICAL MESH 99.8%</span>
          </span>
        </div>
      </div>

      {/* Center: Live DTG Clock & Alerts Flash */}
      <div className="hidden lg:flex items-center space-x-4">
        <div className={`text-center font-mono text-xs ${
          theme === 'light'
            ? 'text-slate-700 bg-slate-100 border-slate-200'
            : 'text-slate-300 bg-slate-900/90 border-slate-800'
        } px-3 py-1 rounded border`}>
          <span className="text-slate-400 mr-2">DTG:</span>
          <span className={`${theme === 'light' ? 'text-cyan-700 font-bold' : 'text-cyan-400 font-semibold'}`}>{currentTime || '181650H OCT 2026'}</span>
        </div>

        {unacknowledgedCount > 0 && (
          <button
            onClick={() => setActiveTab('overview')}
            className="flex items-center space-x-1.5 text-xs font-mono px-2.5 py-1 rounded bg-red-950/80 text-red-300 border border-red-700 animate-pulse hover:bg-red-900 transition-colors"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
            <span className="font-bold">{unacknowledgedCount} CRITICAL ALERT{unacknowledgedCount > 1 ? 'S' : ''}</span>
          </button>
        )}
      </div>

      {/* Right: Audio Toggle, Sandbox Trigger Shortcut, Light Mode Option, Persona Switcher */}
      <div className="flex items-center space-x-2.5">
        {/* Sandbox Quick Access */}
        <button
          onClick={() => setActiveTab('sandbox')}
          className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors ${
            theme === 'light'
              ? 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
              : 'bg-amber-950/60 border border-amber-800/80 text-amber-300 hover:bg-amber-900/80'
          }`}
          title="Open Hackathon Simulation Sandbox"
        >
          <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span className="hidden sm:inline font-semibold">SANDBOX</span>
        </button>

        {/* Tactical Sound Toggle */}
        <button
          onClick={() => setIsMuted(!isMuted)}
          className={`p-1.5 rounded-lg border transition-colors ${
            theme === 'light'
              ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
              : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700'
          }`}
          title={isMuted ? 'Unmute tactical audio cues' : 'Mute tactical audio cues'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-cyan-500" />}
        </button>

        {/* Light / Dark Mode Theme Option */}
        <button
          id="theme-toggle-btn"
          data-testid="theme-toggle"
          onClick={() => {
            toggleTheme();
            playTacticalSound('beep');
          }}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all shadow-sm ${
            theme === 'dark'
              ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/50 hover:border-amber-400 shadow-amber-950/20'
              : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 hover:border-indigo-300 shadow-indigo-100'
          }`}
          title={theme === 'dark' ? 'Click to change theme to Light Mode (Day Operations)' : 'Click to change theme to Dark Mode (Night Operations)'}
        >
          {theme === 'dark' ? (
            <>
              <Sun className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-indigo-600" />
              <span>Dark Mode</span>
            </>
          )}
        </button>

        {/* Persona Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-2 px-2.5 py-1 rounded bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-xs transition-colors"
          >
            <div className="w-6 h-6 rounded bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center font-mono font-bold text-cyan-300 border border-cyan-800 text-[11px]">
              {currentPersona.avatarInitials}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-[11px] font-semibold text-slate-200 leading-none">{currentPersona.name}</p>
              <p className="text-[9px] text-cyan-400 font-mono leading-none mt-0.5">{currentPersona.role}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl py-1 z-50">
              <div className="px-3 py-1.5 border-b border-slate-800">
                <p className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">Fast-Track Persona Switcher</p>
                <p className="text-[11px] text-slate-300">Click to evaluate perspective:</p>
              </div>

              <button
                onClick={() => {
                  switchPersona('maj_rao');
                  setIsDropdownOpen(false);
                }}
                className={`w-full text-left px-3 py-2 flex items-center space-x-2.5 hover:bg-slate-800/90 transition-colors ${
                  currentPersona.id === 'maj_rao' ? 'bg-cyan-950/60 border-l-2 border-cyan-500' : ''
                }`}
              >
                <div className="w-7 h-7 rounded bg-blue-950 border border-blue-700 flex items-center justify-center text-xs font-mono text-blue-300 font-bold">
                  VR
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-200">Maj. Vikram Rao</p>
                  <p className="text-[10px] font-mono text-cyan-400">Logistics Officer (S4)</p>
                </div>
              </button>

              <button
                onClick={() => {
                  switchPersona('brig_chauhan');
                  setIsDropdownOpen(false);
                }}
                className={`w-full text-left px-3 py-2 flex items-center space-x-2.5 hover:bg-slate-800/90 transition-colors ${
                  currentPersona.id === 'brig_chauhan' ? 'bg-amber-950/60 border-l-2 border-amber-500' : ''
                }`}
              >
                <div className="w-7 h-7 rounded bg-amber-950 border border-amber-700 flex items-center justify-center text-xs font-mono text-amber-300 font-bold">
                  RC
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-200">Brig. R. S. Chauhan</p>
                  <p className="text-[10px] font-mono text-amber-400">Commander (Approval Gate)</p>
                </div>
              </button>

              <button
                onClick={() => {
                  switchPersona('capt_sharma');
                  setIsDropdownOpen(false);
                }}
                className={`w-full text-left px-3 py-2 flex items-center space-x-2.5 hover:bg-slate-800/90 transition-colors ${
                  currentPersona.id === 'capt_sharma' ? 'bg-emerald-950/60 border-l-2 border-emerald-500' : ''
                }`}
              >
                <div className="w-7 h-7 rounded bg-emerald-950 border border-emerald-700 flex items-center justify-center text-xs font-mono text-emerald-300 font-bold">
                  NS
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-200">Capt. Neha Sharma</p>
                  <p className="text-[10px] font-mono text-emerald-400">Signals / IoT Systems Admin</p>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
