import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type {
  UserPersona,
  TacticalNode,
  Convoy,
  AlertItem,
  InventoryItem,
  DispatchProposal,
} from '../types';
import {
  INITIAL_PERSONAS,
  INITIAL_CONVOYS,
  INITIAL_ALERTS,
  INITIAL_DISPATCH_PROPOSAL,
} from '../mockData';
import {
  computeAgniFuelForecast,
  computeRudraLeakAnalysis,
  computeModelBacktestMetrics,
  buildSynchronizedInventory,
  buildSynchronizedNodes,
  computeSectorAverageDos,
  SHARED_MODEL_METRICS,
  RUDRA_TANK_CONFIG,
  formatShortDTG,
  formatMilitaryDTG,
  type AgniFuelAnalysis,
  type RudraLeakAnalysis,
  type ModelBacktestMetrics,
} from '../utils/logisticsStore';

interface AppContextType {
  currentPersona: UserPersona;
  activeTab: string;
  nodes: TacticalNode[];
  convoys: Convoy[];
  alerts: AlertItem[];
  inventory: InventoryItem[];
  dispatchProposal: DispatchProposal;
  isMuted: boolean;
  passK4Blocked: boolean;
  fpAgniBlizzard: boolean;
  tank03Leak: boolean;
  selectedConvoy: Convoy | null;
  isPinModalOpen: boolean;
  isDiagnosticModalOpen: boolean;
  simulationLogs: { id: string; time: string; text: string; type: 'crisis' | 'action' | 'system' }[];

  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  toggleTheme: () => void;

  // Authentication State
  isAuthenticated: boolean;
  signOut: () => void;
  signIn: (personaKey?: string) => void;

  // Single Shared Data Store Elements
  rudraLeakAnalysis: RudraLeakAnalysis;
  agniFuelAnalysis: AgniFuelAnalysis;
  modelMetrics: ModelBacktestMetrics;
  avgDos: string;
  temperature: number;
  setTemperature: (t: number) => void;
  troopCount: number;
  setTroopCount: (c: number) => void;
  blizzardDays: number;
  setBlizzardDays: (d: number) => void;
  currentDtgClock: string;
  currentShortDtg: string;

  // Actions
  switchPersona: (personaKey: string) => void;
  setActiveTab: (tab: string) => void;
  setIsMuted: (muted: boolean) => void;
  acknowledgeAlert: (alertId: string) => void;
  rerouteConvoy: (convoyId: string, option: 'OPT-A' | 'OPT-B') => void;
  authorizeDispatch: (pin: string) => boolean;
  remedyTankLeak: (action: 'ISOLATE' | 'SIREN' | 'FALSE_ALARM') => void;
  triggerScenario: (type: 'BLIZZARD' | 'LANDSLIDE' | 'LEAK' | 'RESET') => void;
  setSelectedConvoy: (convoy: Convoy | null) => void;
  setIsPinModalOpen: (open: boolean) => void;
  setIsDiagnosticModalOpen: (open: boolean) => void;
  playTacticalSound: (type: 'alert' | 'success' | 'beep') => void;
  stageForecastToDispatch: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPersona, setCurrentPersona] = useState<UserPersona>(INITIAL_PERSONAS.maj_rao);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('RAKSHALOG_AUTH');
      if (stored === 'false') return false;
    }
    return true;
  });

  const signOut = () => {
    setIsAuthenticated(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('RAKSHALOG_AUTH', 'false');
    }
    try {
      playTacticalSound('alert');
    } catch {
      // ignore
    }
  };

  const signIn = (personaKey?: string) => {
    if (personaKey && INITIAL_PERSONAS[personaKey]) {
      setCurrentPersona(INITIAL_PERSONAS[personaKey]);
    }
    setIsAuthenticated(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('RAKSHALOG_AUTH', 'true');
    }
    try {
      playTacticalSound('success');
    } catch {
      // ignore
    }
  };

  const [activeTab, setActiveTab] = useState<string>('overview');
  const [convoys, setConvoys] = useState<Convoy[]>(INITIAL_CONVOYS);
  const [alerts, setAlerts] = useState<AlertItem[]>(INITIAL_ALERTS);
  const [dispatchProposal, setDispatchProposal] = useState<DispatchProposal>(INITIAL_DISPATCH_PROPOSAL);

  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [passK4Blocked, setPassK4Blocked] = useState<boolean>(true);
  const [fpAgniBlizzard, setFpAgniBlizzard] = useState<boolean>(true);

  // Simulation Sliders (Shared store source)
  const [temperature, setTemperature] = useState<number>(-18);
  const [troopCount, setTroopCount] = useState<number>(120);
  const [blizzardDays, setBlizzardDays] = useState<number>(8);

  // FAP Rudra Tank-03 State (Shared store source)
  const [tank03Leak, setTank03Leak] = useState<boolean>(true);
  const [tank03Volume, setTank03Volume] = useState<number>(RUDRA_TANK_CONFIG.baselineOnHandL);
  const [tank03Isolated, setTank03Isolated] = useState<boolean>(false);

  // 1. Single calculation engine for FAP Rudra leak
  const rudraLeakAnalysis = useMemo(
    () => computeRudraLeakAnalysis(tank03Leak, tank03Volume, tank03Isolated),
    [tank03Leak, tank03Volume, tank03Isolated]
  );

  // 2. Single calculation engine for FP Agni fuel forecast & runway
  const agniFuelAnalysis = useMemo(
    () => computeAgniFuelForecast(temperature, troopCount, fpAgniBlizzard),
    [temperature, troopCount, fpAgniBlizzard]
  );

  // 3. Single calculation engine for Model Evaluation & Backtest Metrics
  const modelMetrics = useMemo(() => computeModelBacktestMetrics(), []);

  // 4. Synchronized Inventory Ledger
  const inventory = useMemo(
    () => buildSynchronizedInventory(agniFuelAnalysis, rudraLeakAnalysis),
    [agniFuelAnalysis, rudraLeakAnalysis]
  );

  // 5. Synchronized Tactical Nodes & Sustainability Matrix
  const nodes = useMemo(
    () => buildSynchronizedNodes(agniFuelAnalysis, rudraLeakAnalysis),
    [agniFuelAnalysis, rudraLeakAnalysis]
  );

  // 6. Sector average sustainability
  const avgDos = useMemo(() => computeSectorAverageDos(nodes), [nodes]);

  // Sync alert texts with shared calculation outputs
  useEffect(() => {
    setAlerts((prev) =>
      prev.map((a) => {
        if (a.id === 'ALT-9041') {
          return {
            ...a,
            detail: tank03Isolated
              ? 'Tank POL-D-03 ISOLATED and purged from active ledger.'
              : `Depletion rate exceeds maximum operational draw while digital dispense gate is verified closed. Critical runway: ${rudraLeakAnalysis.formattedHours} (${rudraLeakAnalysis.formattedDays}). Structural breach or seal failure probability: 89%.`,
            severity: tank03Leak ? 'CRITICAL' : 'INFO',
          };
        }
        if (a.id === 'ALT-9043') {
          return {
            ...a,
            headline: `Stockout Projected in ${agniFuelAnalysis.hoursToStockout} Hours (${agniFuelAnalysis.formattedDays})`,
            detail: `Western Disturbance will plunge temps to -22°C. Current Arctic fuel runway will deplete in ${agniFuelAnalysis.hoursToStockout} hours (${agniFuelAnalysis.formattedDays}). Pre-emptive dispatch required before road freeze.`,
            severity: agniFuelAnalysis.dosDays < 5 ? 'WARNING' : 'INFO',
          };
        }
        return a;
      })
    );
  }, [rudraLeakAnalysis, agniFuelAnalysis, tank03Isolated, tank03Leak]);
  
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('RAKSHALOG_THEME');
      if (saved === 'dark') return 'dark';
      if (saved === 'light') return 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
      localStorage.setItem('RAKSHALOG_THEME', 'light');
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
      localStorage.setItem('RAKSHALOG_THEME', 'dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const [dtgNow, setDtgNow] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDtgNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const currentDtgClock = formatMilitaryDTG(dtgNow);
  const currentShortDtg = formatShortDTG(dtgNow);

  const [selectedConvoy, setSelectedConvoy] = useState<Convoy | null>(INITIAL_CONVOYS[0]);
  const [isPinModalOpen, setIsPinModalOpen] = useState<boolean>(false);
  const [isDiagnosticModalOpen, setIsDiagnosticModalOpen] = useState<boolean>(false);

  const [simulationLogs, setSimulationLogs] = useState<{ id: string; time: string; text: string; type: 'crisis' | 'action' | 'system' }[]>([
    { id: '1', time: formatShortDTG(new Date(Date.now() - 30 * 60 * 1000)), text: 'System initialized. Tactical mesh connected to 6 forward post telemetry repeaters.', type: 'system' },
    { id: '2', time: formatShortDTG(new Date(Date.now() - 15 * 60 * 1000)), text: 'Landslide detected at Pass K-4. Road passability dropped to 0%.', type: 'crisis' },
    { id: '3', time: formatShortDTG(new Date(Date.now() - 5 * 60 * 1000)), text: 'Ultrasonic transducer alarm on POL-Tank-03 at FAP Rudra (-120 L/hr).', type: 'crisis' },
  ]);

  const addSimLog = (text: string, type: 'crisis' | 'action' | 'system') => {
    const timeStr = formatShortDTG(new Date());
    setSimulationLogs((prev) => [{ id: Math.random().toString(), time: timeStr, text, type }, ...prev.slice(0, 40)]);
  };

  const playTacticalSound = (type: 'alert' | 'success' | 'beep') => {
    if (isMuted) return;
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === 'alert') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(880, audioCtx.currentTime);
        osc.frequency.setValueAtTime(440, audioCtx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.35);
      } else if (type === 'success') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, audioCtx.currentTime);
        osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
      } else {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1046.5, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.08);
      }
    } catch {
      // AudioContext fallback
    }
  };

  const switchPersona = (personaKey: string) => {
    if (INITIAL_PERSONAS[personaKey]) {
      setCurrentPersona(INITIAL_PERSONAS[personaKey]);
      playTacticalSound('beep');
      addSimLog(`Active user persona switched to ${INITIAL_PERSONAS[personaKey].name} (${INITIAL_PERSONAS[personaKey].role})`, 'system');
    }
  };

  const acknowledgeAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, acknowledged: true } : a))
    );
    playTacticalSound('beep');
    addSimLog(`Alert ${alertId} acknowledged by ${currentPersona.name}`, 'action');
  };

  const rerouteConvoy = (convoyId: string, option: 'OPT-A' | 'OPT-B') => {
    setConvoys((prev) =>
      prev.map((c) => {
        if (c.id === convoyId) {
          const routeName = option === 'OPT-A' ? 'Valley Bypass Route-9' : 'High Ridge Trail';
          return {
            ...c,
            status: 'DIVERTED',
            routeId: routeName,
            eta: option === 'OPT-A' ? '19:30 hrs' : '20:10 hrs',
            coordinates: [34.3950, 76.7200], // Updated waypoint on bypass
          };
        }
        return c;
      })
    );
    playTacticalSound('success');
    addSimLog(
      `Convoy ${convoyId} rerouted via ${option === 'OPT-A' ? 'Valley Bypass Route-9' : 'High Ridge Trail'}. New waypoints uploaded.`,
      'action'
    );
  };

  const authorizeDispatch = (pin: string): boolean => {
    if (!pin || pin.length < 4) return false;
    const sig = `SHA256:${Math.random().toString(36).substring(2, 10).toUpperCase()}-AUTH-${currentPersona.name.replace(/\s+/g, '_').toUpperCase()}`;
    setDispatchProposal((prev) => ({
      ...prev,
      status: 'AUTHORIZED',
      approvedBy: currentPersona.name,
      digitalSignature: sig,
    }));
    playTacticalSound('success');
    addSimLog(
      `Plan #${dispatchProposal.id} AUTHORIZED by ${currentPersona.name}. Digital Signature: ${sig}. Manifest pushed to Depot Garuda loading bay.`,
      'action'
    );
    setIsPinModalOpen(false);
    return true;
  };

  const remedyTankLeak = (action: 'ISOLATE' | 'SIREN' | 'FALSE_ALARM') => {
    if (action === 'ISOLATE') {
      setTank03Isolated(true);
      setTank03Leak(false);
      setTank03Volume(0);
      playTacticalSound('success');
      addSimLog('POL-Tank-03 structurally ISOLATED and marked OFFLINE in logistics ledger.', 'action');
    } else if (action === 'SIREN') {
      playTacticalSound('alert');
      addSimLog('Local emergency siren and HAZMAT crew dispatched at FAP Rudra for Tank-03 breach inspection.', 'action');
    } else {
      setTank03Leak(false);
      setTank03Isolated(false);
      setTank03Volume(RUDRA_TANK_CONFIG.baselineOnHandL);
      playTacticalSound('success');
      addSimLog('POL-Tank-03 marked as sensor calibration glitch. Status restored to nominal.', 'action');
    }
    setIsDiagnosticModalOpen(false);
  };

  const stageForecastToDispatch = () => {
    setActiveTab('dispatch');
    playTacticalSound('beep');
    addSimLog('AI forecast requirement for FP Agni staged into Dispatch Planner.', 'action');
  };

  const triggerScenario = (type: 'BLIZZARD' | 'LANDSLIDE' | 'LEAK' | 'RESET') => {
    if (type === 'BLIZZARD') {
      setFpAgniBlizzard(true);
      setTemperature(-24);
      setTroopCount(140);
      playTacticalSound('alert');
      addSimLog('CRISIS TRIGGERED: Western Disturbance Blizzard at FP Agni. Temps drop to -24°C, burn rate surges.', 'crisis');
    } else if (type === 'LANDSLIDE') {
      setPassK4Blocked(true);
      setConvoys((prev) =>
        prev.map((c) => (c.id === 'CNV-VAJRA-4' ? { ...c, status: 'REROUTE_RECOMMENDED' } : c))
      );
      playTacticalSound('alert');
      addSimLog('CRISIS TRIGGERED: Landslide blocks Pass K-4. Convoy Vajra-4 stranded without bypass.', 'crisis');
    } else if (type === 'LEAK') {
      setTank03Leak(true);
      setTank03Isolated(false);
      setTank03Volume(RUDRA_TANK_CONFIG.baselineOnHandL);
      playTacticalSound('alert');
      addSimLog('CRISIS TRIGGERED: Rapid liquid transducer drop on POL-Tank-03 at FAP Rudra (-120 L/hr).', 'crisis');
    } else {
      // RESET TO NORMAL
      setPassK4Blocked(false);
      setFpAgniBlizzard(false);
      setTank03Leak(false);
      setTank03Isolated(false);
      setTank03Volume(RUDRA_TANK_CONFIG.baselineOnHandL);
      setTemperature(-10);
      setTroopCount(100);
      setConvoys(INITIAL_CONVOYS.map((c) => ({ ...c, status: 'IN_TRANSIT' })));
      setDispatchProposal(INITIAL_DISPATCH_PROPOSAL);
      playTacticalSound('success');
      addSimLog('SIMULATION RESET: All sector nodes, passes, and IoT transducers returned to nominal baseline.', 'system');
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentPersona,
        activeTab,
        nodes,
        convoys,
        alerts,
        inventory,
        dispatchProposal,
        isMuted,
        passK4Blocked,
        fpAgniBlizzard,
        tank03Leak,
        selectedConvoy,
        isPinModalOpen,
        isDiagnosticModalOpen,
        simulationLogs,
        theme,
        isAuthenticated,
        signOut,
        signIn,
        rudraLeakAnalysis,
        agniFuelAnalysis,
        modelMetrics,
        avgDos,
        temperature,
        setTemperature,
        troopCount,
        setTroopCount,
        blizzardDays,
        setBlizzardDays,
        currentDtgClock,
        currentShortDtg,
        setTheme,
        toggleTheme,
        switchPersona,
        setActiveTab,
        setIsMuted,
        acknowledgeAlert,
        rerouteConvoy,
        authorizeDispatch,
        remedyTankLeak,
        triggerScenario,
        setSelectedConvoy,
        setIsPinModalOpen,
        setIsDiagnosticModalOpen,
        playTacticalSound,
        stageForecastToDispatch,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
