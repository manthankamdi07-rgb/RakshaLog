import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  MapPin,
  TrendingUp,
  Package,
  Truck,
  FileText,
  Sliders,
  AlertCircle,
  CheckCircle2,
  Sun,
  Moon,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, alerts, dispatchProposal, playTacticalSound, theme, setTheme } = useApp();

  const unackAlerts = alerts.filter((a) => !a.acknowledged).length;
  const isPendingDispatch = dispatchProposal.status === 'PENDING_AUTHORIZATION';

  const navItems = [
    {
      id: 'overview',
      label: 'Command Overview',
      icon: LayoutDashboard,
      badge: unackAlerts > 0 ? `${unackAlerts}` : undefined,
      badgeColor: 'bg-red-500/20 text-red-400 border border-red-500/50',
    },
    {
      id: 'map',
      label: 'Map & GIS Routes',
      icon: MapPin,
      badge: 'LIVE',
      badgeColor: 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40',
    },
    {
      id: 'forecast',
      label: 'Demand Forecast',
      icon: TrendingUp,
      badge: 'AI/ML',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40',
    },
    {
      id: 'inventory',
      label: 'Inventory & IoT',
      icon: Package,
      badge: undefined,
    },
    {
      id: 'dispatch',
      label: 'Dispatch Planner',
      icon: Truck,
      badge: isPendingDispatch ? '1 PENDING' : 'AUTHORIZED',
      badgeColor: isPendingDispatch
        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40',
    },
    {
      id: 'reports',
      label: 'Reports & Sitrep',
      icon: FileText,
      badge: undefined,
    },
    {
      id: 'sandbox',
      label: 'Simulation Sandbox',
      icon: Sliders,
      badge: 'DEMO',
      badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/40',
    },
  ];

  return (
    <aside className={`w-64 border-r ${theme === 'light' ? 'border-slate-200 bg-white' : 'border-slate-800 bg-[#0B0F19]'} flex flex-col justify-between select-none h-[calc(100vh-3.5rem)] shrink-0 transition-colors duration-200`}>
      <div className="py-4">
        <div className="px-4 mb-3">
          <p className="text-[10px] font-mono uppercase text-slate-500 tracking-wider font-semibold">
            Operational Navigation
          </p>
        </div>

        <nav className="space-y-1 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  playTacticalSound('beep');
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? theme === 'light'
                      ? 'bg-cyan-50 text-cyan-800 border border-cyan-300 shadow-sm font-semibold'
                      : 'bg-cyan-950/70 text-cyan-200 border border-cyan-800/80 shadow-sm shadow-cyan-950'
                    : theme === 'light'
                      ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-500' : theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-semibold ${
                      item.badgeColor || 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="space-y-2 pb-2">
        {/* Theme Mode Selector in Sidebar */}
        <div className={`px-3 py-2.5 border-t ${theme === 'light' ? 'border-slate-200 bg-slate-50' : 'border-slate-800/80 bg-slate-950/40'} m-2 rounded-lg transition-colors`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase text-slate-500 font-semibold tracking-wider">
              Theme Mode
            </span>
            <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-semibold ${
              theme === 'light'
                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                : 'bg-cyan-950 text-cyan-400 border border-cyan-800'
            }`}>
              {theme === 'light' ? 'LIGHT (DAY)' : 'DARK (NIGHT)'}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              id="sidebar-theme-dark-btn"
              onClick={() => {
                if (theme !== 'dark') {
                  setTheme('dark');
                  playTacticalSound('beep');
                }
              }}
              className={`flex items-center justify-center space-x-1.5 py-1.5 px-2 rounded-md text-xs font-mono transition-all ${
                theme === 'dark'
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-700 font-bold shadow-sm'
                  : theme === 'light'
                    ? 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
                    : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
              }`}
              title="Activate Dark Mode"
            >
              <Moon className="w-3.5 h-3.5 text-cyan-400" />
              <span>Dark</span>
            </button>
            <button
              id="sidebar-theme-light-btn"
              onClick={() => {
                if (theme !== 'light') {
                  setTheme('light');
                  playTacticalSound('beep');
                }
              }}
              className={`flex items-center justify-center space-x-1.5 py-1.5 px-2 rounded-md text-xs font-mono transition-all ${
                theme === 'light'
                  ? 'bg-amber-100 text-amber-900 border border-amber-400 font-bold shadow-sm'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
              }`}
              title="Activate Light Mode"
            >
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>Light</span>
            </button>
          </div>
        </div>

        {/* Bottom Classification & Verification Banner */}
        <div className={`p-3 border-t ${theme === 'light' ? 'border-slate-200 bg-slate-50' : 'border-slate-800/80 bg-slate-950/60'} m-2 rounded-lg text-center transition-colors`}>
          <div className="flex items-center justify-center space-x-1.5 mb-1 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>SIH 2026 PROTOTYPE</span>
          </div>
          <p className="text-[10px] font-mono text-slate-500 leading-tight">
            Ministry of Defence (DSSC)<br />
            Synthetic Data / Unclassified
          </p>
        </div>
      </div>
    </aside>
  );
};
