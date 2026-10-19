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
  Network,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    alerts,
    dispatchProposal,
    playTacticalSound,
    theme,
  } = useApp();

  const unackAlerts = alerts.filter((a) => !a.acknowledged).length;
  const isPendingDispatch = dispatchProposal.status === 'PENDING_AUTHORIZATION';

  // Requirement 2: Keep ONLY the alert count on Command Overview and the PENDING count on Dispatch Planner
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
      badge: undefined,
    },
    {
      id: 'forecast',
      label: 'Demand Forecast',
      icon: TrendingUp,
      badge: undefined,
    },
    {
      id: 'inventory',
      label: 'Inventory & IoT',
      icon: Package,
      badge: undefined,
    },
    {
      id: 'integration',
      label: 'Data Integration',
      icon: Network,
      badge: undefined,
    },
    {
      id: 'dispatch',
      label: 'Dispatch Planner',
      icon: Truck,
      badge: isPendingDispatch ? '1 PENDING' : undefined,
      badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/40',
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
      badge: undefined,
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
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
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

      <div className={`p-3 m-2 border-t text-center ${theme === 'light' ? 'border-slate-200' : 'border-slate-800/60'}`}>
        <p className="text-[10px] font-mono text-slate-500">
          Sector Trishul &bull; 34.42° N
        </p>
      </div>
    </aside>
  );
};
