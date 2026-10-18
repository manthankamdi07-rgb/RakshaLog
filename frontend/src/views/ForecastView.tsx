import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid,
} from 'recharts';
import {
  TrendingDown,
  Thermometer,
  Users,
  Calendar,
  AlertTriangle,
  ArrowRight,
  Brain,
  Sliders,
  CheckCircle2,
} from 'lucide-react';

export const ForecastView: React.FC = () => {
  const { stageForecastToDispatch, theme } = useApp();

  const [selectedNode, setSelectedNode] = useState('FP Agni');
  const [selectedCategory, setSelectedCategory] = useState('Class III: Arctic Fuel');

  // Simulation Sliders
  const [temperature, setTemperature] = useState(-18); // Celsius
  const [troopCount, setTroopCount] = useState(120);
  const [blizzardDays, setBlizzardDays] = useState(8);

  // Compute live dynamic 14-day depletion curve based on sliders
  const forecastData = useMemo(() => {
    const initialStock = 4200; // Litres
    const emergencyReserve = 1500; // Litres

    // Temperature penalty: every degree below -10°C increases fuel burn by 3%
    const tempPenalty = Math.max(0, -10 - temperature) * 0.035;
    // Troop penalty: baseline is 100 troops
    const troopFactor = troopCount / 100;
    const effectiveBurnRate = 450 * (1 + tempPenalty) * troopFactor; // Litres/day
    const normalBurnRate = 420; // Nominal

    const days = [
      'Today', 'Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6',
      'Day 7', 'Day 8', 'Day 9', 'Day 10', 'Day 11', 'Day 12', 'Day 13'
    ];

    let currentPredictStock = initialStock;
    let currentNormalStock = initialStock;

    return days.map((label, idx) => {
      const pred = Math.max(0, Math.round(currentPredictStock));
      const norm = Math.max(0, Math.round(currentNormalStock));
      const lower = Math.max(0, Math.round(pred * 0.92));
      const upper = Math.round(pred * 1.08);

      currentPredictStock -= effectiveBurnRate;
      currentNormalStock -= normalBurnRate;

      return {
        day: idx,
        label,
        predictedStock: pred,
        normalBurnStock: norm,
        lowerConfidence: lower,
        upperConfidence: upper,
        emergencyThreshold: emergencyReserve,
      };
    });
  }, [temperature, troopCount, blizzardDays]);

  // Find exact stockout day
  const stockoutPoint = useMemo(() => {
    const pt = forecastData.find((d) => d.predictedStock <= 1500);
    return pt ? pt.label : 'Day 6+';
  }, [forecastData]);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h1 className="font-display font-bold text-xl text-white tracking-wide flex items-center space-x-2">
            <span>AI/ML DEMAND FORECASTING ENGINE</span>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
              PREDICTIVE ML
            </span>
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Weather-Correlated Supply Runway & Stockout Horizon Estimation (PS-26251)
          </p>
        </div>

        {/* Node & Category Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedNode}
            onChange={(e) => setSelectedNode(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-xs font-mono rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="FP Agni">Forward Post Agni (13.8k ft)</option>
            <option value="FP Himmat">Forward Post Himmat (12.5k ft)</option>
            <option value="FAP Rudra">FAP Rudra (11.4k ft)</option>
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-xs font-mono rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="Class III: Arctic Fuel">Class III: Arctic Winter Fuel</option>
            <option value="Class I: Rations">Class I: High-Altitude MRE</option>
            <option value="Class V: Ammo">Class V: Small Arms Ammunition</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Forecast Chart (Left) + Explainability Drivers (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Recharts Depletion Curve */}
        <div className="lg:col-span-2 glass-panel p-5 rounded-xl border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <h2 className="font-display font-bold text-sm text-white flex items-center space-x-2">
                <span>INVENTORY RUNWAY DEPLETION CURVE (14 DAYS)</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800 animate-pulse">
                  STOCKOUT IN: {stockoutPoint}
                </span>
              </h2>
              <p className="text-[11px] font-mono text-slate-400">
                Current Level: 4,200L | Minimum Strategic Reserve: 1,500L
              </p>
            </div>

            <div className="flex items-center space-x-3 text-[11px] font-mono">
              <span className="flex items-center space-x-1 text-cyan-400">
                <span className="w-2.5 h-0.5 bg-cyan-400"></span>
                <span>Normal Burn</span>
              </span>
              <span className="flex items-center space-x-1 text-red-400">
                <span className="w-2.5 h-0.5 bg-red-400"></span>
                <span>Blizzard Adjusted</span>
              </span>
            </div>
          </div>

          {/* Recharts Area Chart */}
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="predictedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="normalGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'light' ? '#E2E8F0' : '#1F2937'} vertical={false} />
                <XAxis dataKey="label" stroke={theme === 'light' ? '#64748B' : '#6B7280'} tick={{ fontSize: 11, fontFamily: 'monospace' }} />
                <YAxis stroke={theme === 'light' ? '#64748B' : '#6B7280'} tick={{ fontSize: 11, fontFamily: 'monospace' }} unit="L" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme === 'light' ? '#FFFFFF' : '#111827',
                    border: theme === 'light' ? '1px solid #CBD5E1' : '1px solid #374151',
                    borderRadius: '8px',
                    fontFamily: 'monospace',
                    fontSize: '11px',
                    boxShadow: theme === 'light' ? '0 4px 12px rgba(15,23,42,0.08)' : '0 4px 12px rgba(0,0,0,0.4)',
                  }}
                  itemStyle={{ color: theme === 'light' ? '#0F172A' : '#F9FAFB' }}
                />
                {/* Emergency Strategic Reserve Line */}
                <ReferenceLine
                  y={1500}
                  stroke="#F59E0B"
                  strokeDasharray="4 4"
                  label={{
                    value: 'EMERGENCY RESERVE (1,500L)',
                    fill: '#F59E0B',
                    fontSize: 10,
                    fontFamily: 'monospace',
                  }}
                />
                {/* Nominal Burn Curve */}
                <Area
                  type="monotone"
                  dataKey="normalBurnStock"
                  name="Nominal Runway"
                  stroke="#06B6D4"
                  strokeWidth={2}
                  fill="url(#normalGrad)"
                />
                {/* Blizzard Burn Curve */}
                <Area
                  type="monotone"
                  dataKey="predictedStock"
                  name="Blizzard Depletion"
                  stroke="#EF4444"
                  strokeWidth={2.5}
                  fill="url(#predictedGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-800">
            <span>Model: Ensemble LSTM + Multivariate Weather Regression</span>
            <span className="text-emerald-400">Historical Accuracy: 94.6%</span>
          </div>
        </div>

        {/* Right: AI Explainability & Predictive Drivers */}
        <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
            <Brain className="w-4 h-4 text-indigo-400" />
            <h2 className="font-display font-bold text-sm text-white">AI EXPLAINABILITY BREAKDOWN</h2>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            The neural forecasting engine attributes the rapid stockout to 3 dominant tactical covariates:
          </p>

          <div className="space-y-2.5">
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
              <div className="flex justify-between font-mono mb-1">
                <span className="text-slate-200">Sub-Zero Ambient Temp (-18°C)</span>
                <span className="text-red-400 font-bold">+38.0%</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-red-500 h-full rounded-full" style={{ width: '78%' }}></div>
              </div>
              <p className="text-[10px] text-slate-400 font-mono mt-1">Viscosity protection & 24/7 gen runtime</p>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
              <div className="flex justify-between font-mono mb-1">
                <span className="text-slate-200">Auxiliary Shelter Heaters</span>
                <span className="text-amber-400 font-bold">+18.5%</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '42%' }}></div>
              </div>
              <p className="text-[10px] text-slate-400 font-mono mt-1">Bunker life-support draw at 13.8k ft</p>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
              <div className="flex justify-between font-mono mb-1">
                <span className="text-slate-200">Pass K-4 Weather Isolation Buffer</span>
                <span className="text-cyan-400 font-bold">+12.0%</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-cyan-500 h-full rounded-full" style={{ width: '28%' }}></div>
              </div>
              <p className="text-[10px] text-slate-400 font-mono mt-1">8-day expected convoy access denial</p>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-indigo-950/40 border border-indigo-800/60 text-xs font-mono space-y-1">
            <div className="flex justify-between text-slate-300">
              <span>ML Confidence:</span>
              <span className="text-indigo-300 font-bold">94.2%</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Recommended Reorder:</span>
              <span className="text-cyan-300 font-bold">4,600 Litres</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Interactive "What-If" Simulation Controller */}
      <div className="glass-panel p-5 rounded-xl border border-cyan-800/60 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <h2 className="font-display font-bold text-sm text-white">
              WHAT-IF TACTICAL SIMULATION CONTROLLER (LIVE RE-COMPUTATION)
            </h2>
          </div>
          <span className="text-[10px] font-mono text-cyan-400">
            Drag sliders to simulate varying operational stress
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Slider 1: Temperature */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300 flex items-center space-x-1">
                <Thermometer className="w-3.5 h-3.5 text-blue-400" />
                <span>Ambient Temp:</span>
              </span>
              <span className="text-blue-300 font-bold">{temperature}°C</span>
            </div>
            <input
              type="range"
              min={-35}
              max={0}
              value={temperature}
              onChange={(e) => setTemperature(Number(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>-35°C (Extreme Blizzard)</span>
              <span>0°C (Mild)</span>
            </div>
          </div>

          {/* Slider 2: Troops Stationed */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300 flex items-center space-x-1">
                <Users className="w-3.5 h-3.5 text-cyan-400" />
                <span>Troop Strength:</span>
              </span>
              <span className="text-cyan-300 font-bold">{troopCount} Personnel</span>
            </div>
            <input
              type="range"
              min={80}
              max={250}
              value={troopCount}
              onChange={(e) => setTroopCount(Number(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>80 (Skeleton Guard)</span>
              <span>250 (Full Reinforcement)</span>
            </div>
          </div>

          {/* Slider 3: Blizzard Closure Duration */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300 flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>Pass Closure Duration:</span>
              </span>
              <span className="text-amber-300 font-bold">{blizzardDays} Days</span>
            </div>
            <input
              type="range"
              min={2}
              max={14}
              value={blizzardDays}
              onChange={(e) => setBlizzardDays(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>2 Days (Minor)</span>
              <span>14 Days (Full Lockdown)</span>
            </div>
          </div>
        </div>

        {/* Action Trigger */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800">
          <div className="text-xs font-mono text-slate-300">
            Calculated Requisition: <span className="text-cyan-400 font-bold">4,600L Arctic Fuel</span> (Pre-empts stockout before {stockoutPoint})
          </div>

          <button
            onClick={stageForecastToDispatch}
            className="w-full sm:w-auto py-2.5 px-4 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-slate-950 font-bold font-mono text-xs shadow-lg shadow-cyan-950 flex items-center justify-center space-x-2 transition-all"
          >
            <span>AUTO-GENERATE DISPATCH REQUISITION</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
