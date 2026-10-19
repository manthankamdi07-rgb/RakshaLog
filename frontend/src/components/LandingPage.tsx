import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  Radio,
  Lock,
  ArrowRight,
  KeyRound,
  AlertTriangle,
  X,
  Sun,
  Moon,
  Clock,
  LayoutDashboard,
  MapPin,
  TrendingUp,
  Package,
  Network,
  Truck,
  FileText,
  Sliders,
  Flame,
  Zap,
  Activity,
  Layers,
  Sparkles,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { signIn, theme, toggleTheme, currentDtgClock } = useApp();
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);

  // Modal Login state matching exact LoginView
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

  const openModal = () => setIsSignInModalOpen(true);
  const closeModal = () => setIsSignInModalOpen(false);

  const isDark = theme === 'dark';

  return (
    <div
      className={`min-h-screen flex flex-col justify-between font-sans select-none antialiased transition-colors duration-300 ${
        isDark ? 'bg-[#070A11] text-slate-100' : 'bg-[#F4F8FC] text-slate-800'
      }`}
    >
      {/* 1. TOP NAVIGATION BAR */}
      <header
        className={`h-16 px-6 sm:px-12 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md transition-colors duration-300 ${
          isDark
            ? 'bg-[#0B0F19]/90 border-b border-slate-800/80 shadow-md'
            : 'bg-white/95 border-b border-slate-200/80 shadow-xs'
        }`}
      >
        {/* Left Logo */}
        <div className="flex items-center space-x-3">
          <img
            src="/logo.png"
            alt="ForwardLog AI Logo"
            className="w-8 h-8 rounded-lg object-contain shadow-xs shrink-0"
          />
          <div>
            <div className="flex items-center space-x-2">
              <h1 className={`font-extrabold text-sm sm:text-base tracking-wider leading-none ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                FORWARDLOG AI
              </h1>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                isDark ? 'bg-cyan-950 text-cyan-400 border border-cyan-800' : 'bg-cyan-100 text-cyan-800 border border-cyan-200'
              }`}>
                PS-26251
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono tracking-wider leading-tight mt-0.5">
              PREDICTIVE FORWARD LOGISTICS OS
            </p>
          </div>
        </div>

        {/* Center / Right Nav Links & Controls */}
        <div className="flex items-center space-x-4 sm:space-x-6">
          <nav className={`hidden lg:flex items-center space-x-6 text-xs font-mono font-medium ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}>
            <a href="#modules" className="hover:text-cyan-400 transition-colors">
              Capabilities
            </a>
            <a href="#scenario" className="hover:text-cyan-400 transition-colors">
              Live scenario
            </a>
            <a href="#roles" className="hover:text-cyan-400 transition-colors">
              Roles
            </a>
          </nav>

          {/* DTG Clock Badge */}
          <div
            className={`hidden sm:flex font-mono text-xs px-3 py-1.5 rounded-lg border items-center space-x-2 ${
              isDark
                ? 'bg-slate-900/90 border-slate-800 text-slate-300'
                : 'bg-slate-100 border-slate-200 text-slate-700'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">DTG:</span>
            <span className="text-cyan-400 font-bold">{currentDtgClock}</span>
          </div>

          {/* Dark / Light Mode Switcher */}
          <button
            onClick={toggleTheme}
            className={`px-3 py-1.5 rounded-xl border text-xs font-mono transition-colors flex items-center space-x-1.5 cursor-pointer shadow-xs ${
              isDark
                ? 'bg-slate-900 hover:bg-slate-800 text-amber-300 border-slate-700'
                : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
            }`}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? (
              <>
                <Sun className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-xs font-semibold">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-slate-700 shrink-0" />
                <span className="text-xs font-semibold">Dark</span>
              </>
            )}
          </button>

          {/* Sign In CTA */}
          <button
            onClick={openModal}
            className="px-4 py-2 rounded-xl bg-[#0F223D] hover:bg-[#162D4E] font-mono font-bold text-xs transition-all shadow-sm cursor-pointer flex items-center space-x-1.5 border border-slate-700/60"
            style={{ color: '#FFFFFF' }}
          >
            <Lock className="w-3.5 h-3.5 text-cyan-400 shrink-0" style={{ color: '#22D3EE' }} />
            <span style={{ color: '#FFFFFF' }}>Sign In</span>
          </button>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-16 px-6 sm:px-12 max-w-6xl mx-auto w-full text-center space-y-7">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-cyan-500/10 via-blue-600/10 to-transparent blur-3xl pointer-events-none rounded-full" />

        {/* Centered Top Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 relative z-10">
          <span className={`px-3 py-1 rounded-full text-[11px] font-mono font-semibold tracking-wide flex items-center space-x-1.5 ${
            isDark
              ? 'bg-cyan-950/70 border border-cyan-800 text-cyan-300'
              : 'bg-cyan-100/70 border border-cyan-200 text-cyan-800'
          }`}>
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>DEFENSE LOGISTICS OS</span>
          </span>
          <span className={`px-3 py-1 rounded-full text-[11px] font-mono font-semibold tracking-wide flex items-center space-x-1.5 ${
            isDark
              ? 'bg-amber-950/70 border border-amber-800 text-amber-300'
              : 'bg-amber-100/70 border border-amber-200 text-amber-900'
          }`}>
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>SECTOR TRISHUL (14,200 FT)</span>
          </span>
          <span className={`px-3 py-1 rounded-full text-[11px] font-mono font-semibold tracking-wide flex items-center space-x-1.5 ${
            isDark
              ? 'bg-emerald-950/70 border border-emerald-800 text-emerald-300'
              : 'bg-emerald-100/70 border border-emerald-200 text-emerald-800'
          }`}>
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span>ML THERMAL ENGINE ACTIVE</span>
          </span>
        </div>

        {/* Hero Title & Subtitle */}
        <div className="space-y-4 max-w-3xl mx-auto relative z-10">
          <h2 className={`text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight ${
            isDark ? 'text-white' : 'text-[#0F223D]'
          }`}>
            Autonomous Predictive Forward Logistics Command Center
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-sans max-w-xl mx-auto leading-relaxed">
            Real-time situational awareness and supply chain orchestration across snowbound Himalayan passes.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-1 relative z-10">
          <button
            onClick={openModal}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-slate-950 font-bold font-mono text-xs transition-all shadow-md shadow-cyan-900/30 cursor-pointer flex items-center space-x-2"
          >
            <ShieldCheck className="w-4 h-4 text-slate-950" />
            <span>Sign in to terminal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <a
            href="#modules"
            className={`px-6 py-3 rounded-xl border font-mono font-semibold text-xs transition-colors shadow-xs ${
              isDark
                ? 'bg-slate-900/80 hover:bg-slate-800 border-slate-700 text-slate-300'
                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            Explore capabilities &darr;
          </a>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto pt-6 relative z-10">
          <div className={`p-5 rounded-2xl border text-left transition-all ${
            isDark ? 'bg-slate-900/80 border-slate-800 shadow-lg' : 'bg-white border-slate-200/90 shadow-sm'
          }`}>
            <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold tracking-wider block">
              CONVOYS TRACKED
            </span>
            <p className="text-2xl font-bold font-mono text-[#0284C7] mt-1">4 Active</p>
            <p className="text-[11px] text-slate-400 mt-1">Zoji-La &amp; Pass K-4 Sector</p>
          </div>

          <div className={`p-5 rounded-2xl border text-left transition-all ${
            isDark ? 'bg-slate-900/80 border-slate-800 shadow-lg' : 'bg-white border-slate-200/90 shadow-sm'
          }`}>
            <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold tracking-wider block">
              SECTOR DOS
            </span>
            <p className="text-2xl font-bold font-mono text-[#10B981] mt-1">18.4 Days</p>
            <p className="text-[11px] text-slate-400 mt-1">Consolidated Class I &amp; III</p>
          </div>

          <div className={`p-5 rounded-2xl border text-left transition-all ${
            isDark ? 'bg-slate-900/80 border-slate-800 shadow-lg' : 'bg-white border-slate-200/90 shadow-sm'
          }`}>
            <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold tracking-wider block">
              ML FORECAST MAPE
            </span>
            <p className="text-2xl font-bold font-mono text-[#F59E0B] mt-1">4.4%</p>
            <p className="text-[11px] text-slate-400 mt-1">Cold Wave Dynamic Engine</p>
          </div>

          <div className={`p-5 rounded-2xl border text-left transition-all ${
            isDark ? 'bg-slate-900/80 border-slate-800 shadow-lg' : 'bg-white border-slate-200/90 shadow-sm'
          }`}>
            <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold tracking-wider block">
              IOT MESH UPTIME
            </span>
            <p className="text-2xl font-bold font-mono text-cyan-400 mt-1">99.8%</p>
            <p className="text-[11px] text-slate-400 mt-1">Tactical Edge Transducers</p>
          </div>
        </div>
      </section>

      {/* 3. EIGHT MODULES, ONE PICTURE SECTION */}
      <section id="modules" className="py-14 px-6 sm:px-12 max-w-6xl mx-auto w-full space-y-6">
        <div>
          <h3 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
            isDark ? 'text-white' : 'text-[#0F223D]'
          }`}>
            Eight modules, one picture
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            From forecast to sign-off, every step lives in the same console.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Module 01 */}
          <div className={`p-5 rounded-2xl border transition-all space-y-2.5 ${
            isDark ? 'bg-slate-900/80 border-slate-800 hover:border-cyan-500/50' : 'bg-white border-slate-200/90 hover:border-cyan-300 shadow-sm'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-cyan-500">01</span>
              <LayoutDashboard className="w-4 h-4 text-cyan-500/80" />
            </div>
            <h4 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-[#0F223D]'}`}>Command Overview</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Days of supply, critical threats, active convoys and replenishment status on one screen.
            </p>
          </div>

          {/* Module 02 */}
          <div className={`p-5 rounded-2xl border transition-all space-y-2.5 ${
            isDark ? 'bg-slate-900/80 border-slate-800 hover:border-cyan-500/50' : 'bg-white border-slate-200/90 hover:border-cyan-300 shadow-sm'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-cyan-500">02</span>
              <MapPin className="w-4 h-4 text-cyan-500/80" />
            </div>
            <h4 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-[#0F223D]'}`}>Map &amp; GIS Routes</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pass closures and blizzard risk mapped live, with bypass routes computed automatically.
            </p>
          </div>

          {/* Module 03 */}
          <div className={`p-5 rounded-2xl border transition-all space-y-2.5 ${
            isDark ? 'bg-slate-900/80 border-slate-800 hover:border-cyan-500/50' : 'bg-white border-slate-200/90 hover:border-cyan-300 shadow-sm'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-cyan-500">03</span>
              <TrendingUp className="w-4 h-4 text-cyan-500/80" />
            </div>
            <h4 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-[#0F223D]'}`}>Demand Forecast</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              90-day consumption analytics and 14-day what-if forecasts driven by temperature and tempo.
            </p>
          </div>

          {/* Module 04 */}
          <div className={`p-5 rounded-2xl border transition-all space-y-2.5 ${
            isDark ? 'bg-slate-900/80 border-slate-800 hover:border-cyan-500/50' : 'bg-white border-slate-200/90 hover:border-cyan-300 shadow-sm'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-cyan-500">04</span>
              <Package className="w-4 h-4 text-cyan-500/80" />
            </div>
            <h4 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-[#0F223D]'}`}>Inventory &amp; IoT</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              RFID and ultrasonic tank telemetry with leak alarms and runway estimates.
            </p>
          </div>

          {/* Module 05 */}
          <div className={`p-5 rounded-2xl border transition-all space-y-2.5 ${
            isDark ? 'bg-slate-900/80 border-slate-800 hover:border-cyan-500/50' : 'bg-white border-slate-200/90 hover:border-cyan-300 shadow-sm'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-cyan-500">05</span>
              <Network className="w-4 h-4 text-cyan-500/80" />
            </div>
            <h4 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-[#0F223D]'}`}>Data Integration</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Six feeds fused into one source of truth, with outlier filtering and zero imputation.
            </p>
          </div>

          {/* Module 06 */}
          <div className={`p-5 rounded-2xl border transition-all space-y-2.5 ${
            isDark ? 'bg-slate-900/80 border-slate-800 hover:border-cyan-500/50' : 'bg-white border-slate-200/90 hover:border-cyan-300 shadow-sm'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-cyan-500">06</span>
              <Truck className="w-4 h-4 text-cyan-500/80" />
            </div>
            <h4 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-[#0F223D]'}`}>Dispatch Planner</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Multi-drop convoys packed for capacity, driver rest and road rules, released with a PIN.
            </p>
          </div>

          {/* Module 07 */}
          <div className={`p-5 rounded-2xl border transition-all space-y-2.5 ${
            isDark ? 'bg-slate-900/80 border-slate-800 hover:border-cyan-500/50' : 'bg-white border-slate-200/90 hover:border-cyan-300 shadow-sm'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-cyan-500">07</span>
              <FileText className="w-4 h-4 text-cyan-500/80" />
            </div>
            <h4 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-[#0F223D]'}`}>Reports &amp; Sitrep</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Audit-ready daily LOG-SITREP with resilience KPIs for headquarters.
            </p>
          </div>

          {/* Module 08 */}
          <div className={`p-5 rounded-2xl border transition-all space-y-2.5 ${
            isDark ? 'bg-slate-900/80 border-slate-800 hover:border-cyan-500/50' : 'bg-white border-slate-200/90 hover:border-cyan-300 shadow-sm'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-cyan-500">08</span>
              <Sliders className="w-4 h-4 text-cyan-500/80" />
            </div>
            <h4 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-[#0F223D]'}`}>Simulation Sandbox</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              One-click crisis injectors for live evaluation and demos.
            </p>
          </div>
        </div>
      </section>

      {/* 4. FROM BLIZZARD TO DISPATCH IN MINUTES (NAVY SECTION WITH PRESERVE-DARK) */}
      <section id="scenario" className="preserve-dark bg-[#0B1728] py-14 px-6 sm:px-12 my-6 border-y border-slate-800/80">
        <div className="max-w-6xl mx-auto space-y-8">
          <div>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight !text-white" style={{ color: '#FFFFFF' }}>
              From blizzard to dispatch in minutes
            </h3>
            <p className="text-xs !text-slate-300 mt-1" style={{ color: '#CBD5E1' }}>
              The demo scenario, step by step.
            </p>
          </div>

          {/* 5 Steps Timeline */}
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {/* Step 1 */}
            <div className="space-y-3">
              <div className="h-0.5 w-full bg-cyan-400 shadow-sm shadow-cyan-400/50"></div>
              <span className="text-[11px] font-mono text-cyan-400 font-bold block tracking-wider" style={{ color: '#22D3EE' }}>
                STEP 1
              </span>
              <h4 className="font-bold text-sm !text-white" style={{ color: '#FFFFFF' }}>Blizzard hits</h4>
              <p className="text-xs !text-slate-300 leading-relaxed" style={{ color: '#CBD5E1' }}>
                Forecast shows fuel runway at FP Agni falling to 4.0 days.
              </p>
            </div>

            {/* Step 2 */}
            <div className="space-y-3">
              <div className="h-0.5 w-full bg-cyan-400 shadow-sm shadow-cyan-400/50"></div>
              <span className="text-[11px] font-mono text-cyan-400 font-bold block tracking-wider" style={{ color: '#22D3EE' }}>
                STEP 2
              </span>
              <h4 className="font-bold text-sm !text-white" style={{ color: '#FFFFFF' }}>Pass K-4 closes</h4>
              <p className="text-xs !text-slate-300 leading-relaxed" style={{ color: '#CBD5E1' }}>
                420T rockfall detected and convoy Vajra-4 diverted.
              </p>
            </div>

            {/* Step 3 */}
            <div className="space-y-3">
              <div className="h-0.5 w-full bg-cyan-400 shadow-sm shadow-cyan-400/50"></div>
              <span className="text-[11px] font-mono text-cyan-400 font-bold block tracking-wider" style={{ color: '#22D3EE' }}>
                STEP 3
              </span>
              <h4 className="font-bold text-sm !text-white" style={{ color: '#FFFFFF' }}>Tank leak flagged</h4>
              <p className="text-xs !text-slate-300 leading-relaxed" style={{ color: '#CBD5E1' }}>
                POL-Tank-03 at FAP Rudra isolated within a minute.
              </p>
            </div>

            {/* Step 4 */}
            <div className="space-y-3">
              <div className="h-0.5 w-full bg-cyan-400 shadow-sm shadow-cyan-400/50"></div>
              <span className="text-[11px] font-mono text-cyan-400 font-bold block tracking-wider" style={{ color: '#22D3EE' }}>
                STEP 4
              </span>
              <h4 className="font-bold text-sm !text-white" style={{ color: '#FFFFFF' }}>Bypass planned</h4>
              <p className="text-xs !text-slate-300 leading-relaxed" style={{ color: '#CBD5E1' }}>
                Valley Bypass Route 9 chosen with 88% packing efficiency.
              </p>
            </div>

            {/* Step 5 */}
            <div className="space-y-3">
              <div className="h-0.5 w-full bg-cyan-400 shadow-sm shadow-cyan-400/50"></div>
              <span className="text-[11px] font-mono text-cyan-400 font-bold block tracking-wider" style={{ color: '#22D3EE' }}>
                STEP 5
              </span>
              <h4 className="font-bold text-sm !text-white" style={{ color: '#FFFFFF' }}>Commander signs</h4>
              <p className="text-xs !text-slate-300 leading-relaxed" style={{ color: '#CBD5E1' }}>
                PIN authorization releases the multi-drop convoy.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 text-[10px] font-mono text-slate-400 uppercase tracking-widest" style={{ color: '#94A3B8' }}>
            SIMULATED RUNTIME &bull; SYNTHETIC DATA &bull; UNCLASSIFIED
          </div>
        </div>
      </section>

      {/* 5. BUILT FOR THE PEOPLE WHO SIGN IN SECTION */}
      <section id="roles" className="py-14 px-6 sm:px-12 max-w-6xl mx-auto w-full space-y-6">
        <div>
          <h3 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
            isDark ? 'text-white' : 'text-[#0F223D]'
          }`}>
            Built for the people who sign in
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Maj. Vikram Rao */}
          <div
            onClick={openModal}
            className={`p-6 rounded-2xl border transition-all cursor-pointer flex items-start space-x-4 ${
              isDark
                ? 'bg-slate-900/80 border-slate-800 hover:border-cyan-500 shadow-lg'
                : 'bg-white border-slate-200/90 shadow-sm hover:shadow-md hover:border-cyan-300'
            }`}
          >
            <div
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 border border-blue-400/40 flex items-center justify-center font-bold text-white text-xs shrink-0 shadow-sm"
              style={{ color: '#FFFFFF' }}
            >
              VR
            </div>
            <div className="space-y-1">
              <h4 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-[#0F223D]'}`}>Maj. Vikram Rao</h4>
              <p className="text-xs font-mono font-medium text-cyan-600">Logistics Officer (S4)</p>
              <p className="text-xs text-slate-400 pt-0.5">
                Plans requisitions and multi-drop dispatch.
              </p>
            </div>
          </div>

          {/* Brig. R. S. Chauhan */}
          <div
            onClick={openModal}
            className={`p-6 rounded-2xl border transition-all cursor-pointer flex items-start space-x-4 ${
              isDark
                ? 'bg-slate-900/80 border-slate-800 hover:border-amber-500 shadow-lg'
                : 'bg-white border-slate-200/90 shadow-sm hover:shadow-md hover:border-amber-300'
            }`}
          >
            <div
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-orange-600 border border-amber-400/40 flex items-center justify-center font-bold text-white text-xs shrink-0 shadow-sm"
              style={{ color: '#FFFFFF' }}
            >
              RC
            </div>
            <div className="space-y-1">
              <h4 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-[#0F223D]'}`}>Brig. R. S. Chauhan</h4>
              <p className="text-xs font-mono font-medium text-amber-600">Sector Commander</p>
              <p className="text-xs text-slate-400 pt-0.5">
                Approves every plan through the PIN gate.
              </p>
            </div>
          </div>

          {/* Capt. Neha Sharma */}
          <div
            onClick={openModal}
            className={`p-6 rounded-2xl border transition-all cursor-pointer flex items-start space-x-4 ${
              isDark
                ? 'bg-slate-900/80 border-slate-800 hover:border-emerald-500 shadow-lg'
                : 'bg-white border-slate-200/90 shadow-sm hover:shadow-md hover:border-emerald-300'
            }`}
          >
            <div
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 border border-emerald-400/40 flex items-center justify-center font-bold text-white text-xs shrink-0 shadow-sm"
              style={{ color: '#FFFFFF' }}
            >
              NS
            </div>
            <div className="space-y-1">
              <h4 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-[#0F223D]'}`}>Capt. Neha Sharma</h4>
              <p className="text-xs font-mono font-medium text-emerald-600">Signals &amp; IoT Admin</p>
              <p className="text-xs text-slate-400 pt-0.5">
                Monitors transducers and telemetry health.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. READY TO RUN THE SCENARIO? SECTION */}
      <section className="py-14 px-6 sm:px-12 max-w-5xl mx-auto w-full text-center space-y-4">
        <h3 className={`text-2xl sm:text-4xl font-extrabold tracking-tight ${
          isDark ? 'text-white' : 'text-[#0F223D]'
        }`}>
          Ready to run the scenario?
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
          Sign in with a demo officer account and inject a crisis with one click.
        </p>
        <div className="pt-2">
          <button
            onClick={openModal}
            className="btn-dark px-7 py-3 rounded-xl bg-[#0F223D] hover:bg-[#162D4E] text-white font-mono font-bold text-xs transition-all shadow-md cursor-pointer inline-flex items-center space-x-2"
            style={{ color: '#FFFFFF' }}
          >
            <Lock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Sign in to terminal</span>
          </button>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className={`h-12 border-t px-6 sm:px-12 flex items-center justify-between text-[11px] font-mono transition-colors ${
        isDark ? 'bg-[#070A11] border-slate-800 text-slate-500' : 'bg-white border-slate-200 text-slate-500'
      }`}>
        <span>FORWARDLOG AI &bull; Smart India Hackathon 2026 &bull; PS-26251 &bull; Ministry of Defence (DSSC)</span>
        <span>Synthetic data / Unclassified</span>
      </footer>

      {/* =========================================================================
          8. POP-UP MODAL: EXACT LOGINVIEW INTERFACE FROM THE SCREENSHOT
         ========================================================================= */}
      {isSignInModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="relative max-w-2xl w-full">
            {/* Modal Close Button */}
            <button
              onClick={closeModal}
              className="absolute -top-3 -right-3 z-10 w-8 h-8 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center cursor-pointer shadow-lg transition-colors"
              title="Close Authentication Window"
            >
              <X className="w-4 h-4" />
            </button>

            {/* THE EXACT CARD FROM LOGINVIEW.TSX & USER SCREENSHOT */}
            <div
              className={`p-8 rounded-2xl border ${
                theme === 'light' ? 'bg-white border-slate-200 shadow-2xl' : 'glass-panel bg-slate-950/95 border-slate-800/90 shadow-2xl'
              } space-y-6 animate-fade-in`}
            >
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
                    <h3
                      className={`font-bold text-sm ${
                        theme === 'light' ? 'text-slate-900' : 'text-white'
                      } group-hover:text-cyan-400 transition-colors`}
                    >
                      Maj. Vikram Rao
                    </h3>
                    <p className="text-[11px] text-cyan-400 font-mono">Logistics Officer (S4)</p>
                    <p className="text-[10px] text-slate-400 mt-1">Requisitions &amp; Multi-Drop Dispatch</p>
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
                    <h3
                      className={`font-bold text-sm ${
                        theme === 'light' ? 'text-slate-900' : 'text-white'
                      } group-hover:text-amber-400 transition-colors`}
                    >
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
                    <h3
                      className={`font-bold text-sm ${
                        theme === 'light' ? 'text-slate-900' : 'text-white'
                      } group-hover:text-emerald-400 transition-colors`}
                    >
                      Capt. Neha Sharma
                    </h3>
                    <p className="text-[11px] text-emerald-400 font-mono">Signals &amp; IoT Admin</p>
                    <p className="text-[10px] text-slate-400 mt-1">Transducer &amp; Telemetry Analysis</p>
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
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
