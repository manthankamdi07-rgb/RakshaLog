import React, { useState, useEffect, useRef } from 'react';
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
  Settings,
  Activity,
  Shield,
  Sliders,
  LogOut,
  LogIn,
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
    setTheme,
    toggleTheme,
    playTacticalSound,
    currentDtgClock,
    signOut,
    signIn,
    isAuthenticated,
  } = useApp();

  const [isPersonaOpen, setIsPersonaOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);
  const personaRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setIsSettingsOpen(false);
      }
      if (personaRef.current && !personaRef.current.contains(e.target as Node)) {
        setIsPersonaOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const unacknowledgedCount = alerts.filter((a) => !a.acknowledged).length;

  return (
    <header className={`h-14 border-b ${theme === 'light' ? 'border-slate-200 bg-white text-slate-800' : 'border-slate-800 bg-[#0B0F19] text-slate-100'} backdrop-blur-md px-4 flex items-center justify-between sticky top-0 z-40 select-none transition-colors duration-200 whitespace-nowrap overflow-hidden shrink-0`}>
      {/* 1. Left: Branding & Sector (Requirement 1: keep Sector visible) */}
      <div className="flex items-center space-x-3 shrink-0">
        <div className="flex items-center space-x-2.5">
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
                theme === 'light'
                  ? 'bg-cyan-50 text-cyan-800 border border-cyan-200'
                  : 'bg-cyan-950 text-cyan-400 border border-cyan-800'
              }`}>
                PS-26251
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono tracking-wide leading-none">
              PREDICTIVE FORWARD LOGISTICS
            </p>
          </div>
        </div>

        {/* Sector Tag */}
        <div className={`flex items-center space-x-2 pl-3 border-l ${theme === 'light' ? 'border-slate-200' : 'border-slate-800'} shrink-0`}>
          <span className="text-[11px] font-mono text-slate-400">SECTOR:</span>
          <span className={`text-xs font-mono font-semibold px-2 py-0.5 rounded ${
            theme === 'light'
              ? 'bg-slate-100 text-cyan-800 border border-slate-200'
              : 'bg-slate-800/80 text-cyan-300 border border-slate-700'
          }`}>
            TRISHUL (NORTH-EAST)
          </span>
        </div>
      </div>

      {/* 2. Center: Live DTG Clock & Critical Alerts (Requirement 1: keep DTG & Critical Alerts visible) */}
      <div className="flex items-center space-x-3 shrink-0 mx-2">
        <div className={`text-center font-mono text-xs ${
          theme === 'light'
            ? 'text-slate-700 bg-slate-100 border-slate-200'
            : 'text-slate-300 bg-slate-900/90 border-slate-800'
        } px-3 py-1 rounded-md border shrink-0`}>
          <span className="text-slate-400 mr-1.5">DTG:</span>
          <span className={`${theme === 'light' ? 'text-cyan-700 font-bold' : 'text-cyan-400 font-semibold'}`}>
            {currentDtgClock}
          </span>
        </div>

        {unacknowledgedCount > 0 && (
          <button
            onClick={() => setActiveTab('overview')}
            className="flex items-center space-x-1.5 text-xs font-mono px-2.5 py-1 rounded-md bg-red-950/80 text-red-300 border border-red-700 animate-pulse hover:bg-red-900 transition-colors shrink-0 cursor-pointer"
            title="Click to view critical alerts in Command Overview"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
            <span className="font-bold">{unacknowledgedCount} CRITICAL ALERT{unacknowledgedCount > 1 ? 'S' : ''}</span>
          </button>
        )}
      </div>

      {/* 3. Right: Settings/Status Dropdown + User Menu (Requirement 1) */}
      <div className="flex items-center space-x-2 shrink-0">
        {/* Combined Status & Settings Dropdown */}
        <div className="relative" ref={settingsRef}>
          <button
            onClick={() => {
              setIsSettingsOpen(!isSettingsOpen);
              setIsPersonaOpen(false);
            }}
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-mono transition-colors cursor-pointer ${
              theme === 'light'
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                : 'bg-slate-800/90 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
            title="System Status & Quick Settings"
            aria-label="Settings and System Status"
          >
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline font-semibold">STATUS & SETTINGS</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {isSettingsOpen && (
            <div className={`absolute right-0 mt-2 w-72 ${
              theme === 'light' ? 'bg-white border-slate-200 shadow-xl' : 'bg-slate-900 border-slate-700 shadow-2xl'
            } border rounded-xl py-2 z-50 text-xs font-mono animate-fade-in`}>
              <div className="px-3.5 py-1.5 border-b border-slate-800/80">
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Tactical System Status</p>
              </div>

              {/* Tactical Mesh Status */}
              <div className="px-3.5 py-2.5 flex items-center justify-between border-b border-slate-800/50">
                <span className="text-slate-400 flex items-center space-x-1.5">
                  <Activity className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Tactical Mesh</span>
                </span>
                <span className="flex items-center space-x-1 text-emerald-400 font-bold text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>99.8% ONLINE</span>
                </span>
              </div>

              {/* Simulation Sandbox Shortcut */}
              <div className="px-3.5 py-2.5 flex items-center justify-between border-b border-slate-800/50">
                <span className="text-slate-400 flex items-center space-x-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>Simulation Sandbox</span>
                </span>
                <button
                  onClick={() => {
                    setActiveTab('sandbox');
                    setIsSettingsOpen(false);
                  }}
                  className="px-2 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[10px] font-bold transition-colors cursor-pointer"
                >
                  OPEN SANDBOX
                </button>
              </div>

              {/* Tactical Audio Toggle */}
              <div className="px-3.5 py-2.5 flex items-center justify-between border-b border-slate-800/50">
                <span className="text-slate-400 flex items-center space-x-1.5">
                  {isMuted ? <VolumeX className="w-3.5 h-3.5 text-slate-500" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}
                  <span>Tactical Audio</span>
                </span>
                <button
                  onClick={() => {
                    setIsMuted(!isMuted);
                    if (isMuted) playTacticalSound('beep');
                  }}
                  className={`px-2 py-1 rounded text-[10px] font-bold border transition-colors cursor-pointer ${
                    isMuted
                      ? 'bg-slate-800 text-slate-400 border-slate-700'
                      : 'bg-cyan-950 text-cyan-300 border-cyan-700'
                  }`}
                >
                  {isMuted ? 'MUTED' : 'ENABLED'}
                </button>
              </div>

              {/* Theme Mode Toggle - Segmented Choice */}
              <div className="px-3.5 py-2.5 flex items-center justify-between">
                <span className="text-slate-400 flex items-center space-x-1.5">
                  {theme === 'dark' ? <Moon className="w-3.5 h-3.5 text-indigo-400" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
                  <span>Display Theme</span>
                </span>
                <div className="flex items-center space-x-1 p-0.5 rounded-lg bg-slate-800/90 border border-slate-700">
                  <button
                    onClick={() => {
                      setTheme('light');
                      playTacticalSound('beep');
                    }}
                    className={`px-2 py-1 rounded text-[10px] font-bold flex items-center space-x-1 transition-all cursor-pointer ${
                      theme === 'light'
                        ? 'bg-amber-400 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Sun className="w-3 h-3" />
                    <span>Light</span>
                  </button>
                  <button
                    onClick={() => {
                      setTheme('dark');
                      playTacticalSound('beep');
                    }}
                    className={`px-2 py-1 rounded text-[10px] font-bold flex items-center space-x-1 transition-all cursor-pointer ${
                      theme === 'dark'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Moon className="w-3 h-3" />
                    <span>Dark</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Direct Light / Dark Mode Toggle Button in Header */}
        <button
          id="header-theme-toggle-btn"
          data-testid="header-theme-toggle"
          onClick={() => {
            toggleTheme();
            playTacticalSound('beep');
          }}
          className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border text-xs font-mono transition-colors flex items-center space-x-1.5 cursor-pointer shrink-0 ${
            theme === 'light'
              ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
              : 'bg-slate-800/90 hover:bg-slate-700 text-amber-300 border-slate-700'
          }`}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle display theme"
        >
          {theme === 'dark' ? (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline font-bold text-[11px]">LIGHT</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden md:inline font-bold text-[11px]">DARK</span>
            </>
          )}
        </button>

        {/* User Menu / Persona Switcher (Requirement 1: keep User menu visible) */}
        <div className="relative" ref={personaRef}>
          <button
            onClick={() => {
              setIsPersonaOpen(!isPersonaOpen);
              setIsSettingsOpen(false);
            }}
            className={`flex items-center space-x-2 px-2.5 py-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
              theme === 'light'
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800'
                : 'bg-slate-800/90 hover:bg-slate-700 border-slate-700 text-slate-100'
            }`}
            title="Fast-Track Persona Switcher & Account Actions"
          >
            <div className="w-6 h-6 rounded bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center font-mono font-bold text-cyan-300 border border-cyan-800 text-[11px] shrink-0">
              {currentPersona.avatarInitials}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-[11px] font-semibold leading-none">{currentPersona.name}</p>
              <p className="text-[9px] text-cyan-400 font-mono leading-none mt-0.5">{currentPersona.role}</p>
            </div>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {isPersonaOpen && (
            <div className={`absolute right-0 mt-2 w-64 ${
              theme === 'light' ? 'bg-white border-slate-200 shadow-xl' : 'bg-slate-900 border-slate-700 shadow-2xl'
            } border rounded-xl py-1 z-50 animate-fade-in`}>
              <div className="px-3 py-1.5 border-b border-slate-800/80">
                <p className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">Fast-Track Persona Switcher</p>
                <p className="text-[11px] text-slate-400">Select operational viewpoint:</p>
              </div>

              <button
                onClick={() => {
                  switchPersona('maj_rao');
                  setIsPersonaOpen(false);
                }}
                className={`w-full text-left px-3 py-2 flex items-center space-x-2.5 hover:bg-slate-800/70 transition-colors cursor-pointer ${
                  currentPersona.id === 'maj_rao' ? 'bg-cyan-950/40 border-l-2 border-cyan-500' : ''
                }`}
              >
                <div className="w-7 h-7 rounded bg-blue-950 border border-blue-700 flex items-center justify-center text-xs font-mono text-blue-300 font-bold shrink-0">
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
                  setIsPersonaOpen(false);
                }}
                className={`w-full text-left px-3 py-2 flex items-center space-x-2.5 hover:bg-slate-800/70 transition-colors cursor-pointer ${
                  currentPersona.id === 'brig_chauhan' ? 'bg-amber-950/40 border-l-2 border-amber-500' : ''
                }`}
              >
                <div className="w-7 h-7 rounded bg-amber-950 border border-amber-700 flex items-center justify-center text-xs font-mono text-amber-300 font-bold shrink-0">
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
                  setIsPersonaOpen(false);
                }}
                className={`w-full text-left px-3 py-2 flex items-center space-x-2.5 hover:bg-slate-800/70 transition-colors cursor-pointer ${
                  currentPersona.id === 'capt_sharma' ? 'bg-emerald-950/40 border-l-2 border-emerald-500' : ''
                }`}
              >
                <div className="w-7 h-7 rounded bg-emerald-950 border border-emerald-700 flex items-center justify-center text-xs font-mono text-emerald-300 font-bold shrink-0">
                  NS
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-200">Capt. Neha Sharma</p>
                  <p className="text-[10px] font-mono text-emerald-400">Signals / IoT Systems Admin</p>
                </div>
              </button>

              {/* Sign Out Option in Dropdown */}
              <div className="pt-1.5 mt-1 border-t border-slate-800/80">
                <button
                  id="dropdown-sign-out-btn"
                  onClick={() => {
                    setIsPersonaOpen(false);
                    signOut();
                  }}
                  className="w-full text-left px-3 py-2 flex items-center space-x-2 text-rose-400 hover:bg-rose-950/30 hover:text-rose-300 transition-colors cursor-pointer text-xs font-mono font-semibold"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-400" />
                  <span>SIGN OUT (LOCK TERMINAL)</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* TOP RIGHT MOST: Sign Out / Sign In Button */}
        {isAuthenticated ? (
          <button
            id="top-right-sign-out-btn"
            data-testid="top-right-sign-out"
            onClick={() => signOut()}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono font-semibold transition-all cursor-pointer shrink-0 shadow-sm ${
              theme === 'light'
                ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-300 hover:border-rose-400'
                : 'bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border-rose-800/80 hover:border-rose-600'
            }`}
            title="Sign Out / Lock Terminal"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-400" />
            <span className="font-bold text-[11px]">SIGN OUT</span>
          </button>
        ) : (
          <button
            id="top-right-sign-in-btn"
            data-testid="top-right-sign-in"
            onClick={() => signIn('maj_rao')}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 text-slate-950 font-bold font-mono text-xs transition-all cursor-pointer shrink-0 shadow-md"
            title="Sign In to Tactical Terminal"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span className="font-bold text-[11px]">SIGN IN</span>
          </button>
        )}
      </div>
    </header>
  );
};
