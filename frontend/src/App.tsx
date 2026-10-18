import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { TopBar } from './components/TopBar';
import { Sidebar } from './components/Sidebar';
import { CommanderPinModal } from './components/CommanderPinModal';
import { DiagnosticModal } from './components/DiagnosticModal';

import { OverviewView } from './views/OverviewView';
import { MapView } from './views/MapView';
import { ForecastView } from './views/ForecastView';
import { InventoryView } from './views/InventoryView';
import { DispatchView } from './views/DispatchView';
import { ReportsView } from './views/ReportsView';
import { SandboxView } from './views/SandboxView';

const MainContent: React.FC = () => {
  const { activeTab, theme } = useApp();

  return (
    <div className={`flex-1 overflow-y-auto ${theme === 'light' ? 'bg-slate-100/70 text-slate-900' : 'bg-[#0B0F19] text-slate-100'} transition-colors duration-200`}>
      {activeTab === 'overview' && <OverviewView />}
      {activeTab === 'map' && <MapView />}
      {activeTab === 'forecast' && <ForecastView />}
      {activeTab === 'inventory' && <InventoryView />}
      {activeTab === 'dispatch' && <DispatchView />}
      {activeTab === 'reports' && <ReportsView />}
      {activeTab === 'sandbox' && <SandboxView />}
    </div>
  );
};

const AppShell: React.FC = () => {
  const { theme } = useApp();

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'light' ? 'bg-slate-100 text-slate-900' : 'bg-[#0B0F19] text-slate-100'} select-none transition-colors duration-200`}>
      <TopBar />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <MainContent />
      </div>
      <CommanderPinModal />
      <DiagnosticModal />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}

export default App;
