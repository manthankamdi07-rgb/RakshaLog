import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  AreaChart,
  BarChart,
  Area,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  ReferenceDot,
  CartesianGrid,
  Legend,
} from 'recharts';
import {
  Activity,
  Calendar,
  Thermometer,
  Users,
  Mountain,
  Zap,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  ShieldCheck,
  Scale,
  Sparkles,
  Info,
  Clock,
  CheckCircle2,
  AlertOctagon,
} from 'lucide-react';
import {
  getHistorical90DayConsumption,
  getPostConsumptionStats,
  getDriverCorrelations,
  getWeeklySeasonalPattern,
  getMonthlySeasonalPattern,
  SupplyClass,
} from '../utils/logisticsStore';

interface Props {
  theme: 'light' | 'dark';
}

export const ConsumptionAnalyticsSection: React.FC<Props> = ({ theme }) => {
  const [selectedPost, setSelectedPost] = useState<string>('FP Agni');
  const [selectedSupplyClass, setSelectedSupplyClass] = useState<SupplyClass>('classIII');
  const [seasonalMode, setSeasonalMode] = useState<'weekly' | 'monthly'>('weekly');

  const history90Days = useMemo(
    () => getHistorical90DayConsumption(selectedPost, selectedSupplyClass),
    [selectedPost, selectedSupplyClass]
  );

  const postStats = useMemo(() => getPostConsumptionStats(), []);
  const driverCorrelations = useMemo(() => getDriverCorrelations(selectedPost), [selectedPost]);
  const weeklySeasonal = useMemo(() => getWeeklySeasonalPattern(selectedSupplyClass), [selectedSupplyClass]);
  const monthlySeasonal = useMemo(() => getMonthlySeasonalPattern(selectedSupplyClass), [selectedSupplyClass]);

  // Extract anomaly markers from the 90-day time series
  const anomalies = useMemo(() => history90Days.filter((h) => h.anomaly !== null), [history90Days]);

  const classKey =
    selectedSupplyClass === 'classIII'
      ? 'classIII_pol'
      : selectedSupplyClass === 'classI'
      ? 'classI_rations'
      : selectedSupplyClass === 'classV'
      ? 'classV_ammo'
      : 'medical_kits';

  const classUnit =
    selectedSupplyClass === 'classIII'
      ? 'L'
      : selectedSupplyClass === 'classI'
      ? 'packs'
      : selectedSupplyClass === 'classV'
      ? 'rds'
      : 'kits';

  const classLabel =
    selectedSupplyClass === 'classIII'
      ? 'Class III: Arctic POL Fuel (Litres)'
      : selectedSupplyClass === 'classI'
      ? 'Class I: High-Altitude Rations (Packs)'
      : selectedSupplyClass === 'classV'
      ? 'Class V: Ammunition (Rounds)'
      : 'Medical & Trauma Cold-Weather Kits';

  // Compute 90-day aggregates
  const totalBurn = history90Days.reduce((acc, h) => acc + (h[classKey] as number), 0);
  const avgBurn = Math.round(totalBurn / history90Days.length);
  const peakBurn = Math.max(...history90Days.map((h) => h[classKey] as number));
  const minBurn = Math.min(...history90Days.map((h) => h[classKey] as number));

  return (
    <div className="space-y-6">
      {/* 1. Header & Filters */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 ${theme === 'light' ? 'border-slate-200' : 'border-slate-800'}`}>
        <div>
          <h2 className={`font-display font-bold text-lg tracking-wide ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
            90-DAY HISTORICAL CONSUMPTION & DRIVER CORRELATIONS
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Longitudinal telemetry analytics across 4 supply classes, environmental covariates, and outpost tempos
          </p>
        </div>

        {/* Post & Supply Class Selectors */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedPost}
            onChange={(e) => setSelectedPost(e.target.value)}
            className={`border text-xs font-mono rounded-lg px-3 py-1.5 focus:outline-none focus:border-cyan-500 ${
              theme === 'light'
                ? 'bg-white border-slate-300 text-slate-800'
                : 'bg-slate-900 border-slate-700 text-slate-200'
            }`}
          >
            <option value="FP Agni">FP Agni (13,800 ft)</option>
            <option value="FP Himmat">FP Himmat (12,500 ft)</option>
            <option value="FAP Rudra">FAP Rudra (11,400 ft)</option>
            <option value="Base Depot Garuda">Base Depot Garuda (10,200 ft)</option>
            <option value="FP Vajra">FP Vajra (14,200 ft)</option>
          </select>

          <select
            value={selectedSupplyClass}
            onChange={(e) => setSelectedSupplyClass(e.target.value as SupplyClass)}
            className={`border text-xs font-mono rounded-lg px-3 py-1.5 focus:outline-none focus:border-cyan-500 ${
              theme === 'light'
                ? 'bg-white border-slate-300 text-slate-800'
                : 'bg-slate-900 border-slate-700 text-slate-200'
            }`}
          >
            <option value="classIII">Class III: Arctic POL Fuel (Litres)</option>
            <option value="classI">Class I: High-Altitude Rations (Packs)</option>
            <option value="classV">Class V: Ammunition (Rounds)</option>
            <option value="medical">Medical & Trauma Cold Kits</option>
          </select>
        </div>
      </div>

      {/* Aggregate Metric Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <span className="text-[10px] font-mono uppercase text-slate-400">90-Day Cumulative Draw</span>
          <p className={`text-2xl font-mono font-bold mt-1 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
            {totalBurn.toLocaleString()} <span className="text-xs font-normal text-slate-400">{classUnit}</span>
          </p>
          <span className="text-[10px] font-mono text-cyan-400 flex items-center mt-1">
            {selectedPost} &bull; {selectedSupplyClass.toUpperCase()}
          </span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <span className="text-[10px] font-mono uppercase text-slate-400">Average Daily Burn Rate</span>
          <p className={`text-2xl font-mono font-bold mt-1 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
            {avgBurn.toLocaleString()} <span className="text-xs font-normal text-slate-400">{classUnit}/day</span>
          </p>
          <span className="text-[10px] font-mono text-emerald-400 flex items-center mt-1">
            <CheckCircle2 className="w-3 h-3 mr-1" /> Verified Historical Baseline
          </span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <span className="text-[10px] font-mono uppercase text-slate-400">Peak Single-Day Draw</span>
          <p className={`text-2xl font-mono font-bold mt-1 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
            {peakBurn.toLocaleString()} <span className="text-xs font-normal text-slate-400">{classUnit}</span>
          </p>
          <span className="text-[10px] font-mono text-amber-400 flex items-center mt-1">
            <TrendingUp className="w-3 h-3 mr-1" /> Cold wave & surge spikes
          </span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <span className="text-[10px] font-mono uppercase text-slate-400">Logged Anomaly Events</span>
          <p className={`text-2xl font-mono font-bold mt-1 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
            {anomalies.length} <span className="text-xs font-normal text-slate-400">Detected</span>
          </p>
          <span className="text-[10px] font-mono text-purple-400 flex items-center mt-1">
            Spikes, Drills & Transducer Leaks
          </span>
        </div>
      </div>

      {/* 2. Historical Consumption Chart (Last 90 Days) with Anomaly Markers */}
      <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h3 className={`font-display font-bold text-sm flex items-center space-x-2 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
              <span>90-DAY TIME SERIES: {classLabel.toUpperCase()}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                20 JUL 2026 &mdash; 18 OCT 2026
              </span>
            </h3>
            <p className="text-[11px] font-mono text-slate-400">
              Telemetry series correlating temperature progression, troop tempo shifts, and outlier events
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono">
            <span className="flex items-center space-x-1 text-cyan-400">
              <span className="w-2.5 h-0.5 bg-cyan-400"></span>
              <span>Daily Consumption</span>
            </span>
            <span className="flex items-center space-x-1 text-blue-400">
              <span className="w-2.5 h-0.5 border-t border-dashed border-blue-400"></span>
              <span>Ambient Temp (°C)</span>
            </span>
            <span className="flex items-center space-x-1 text-red-400">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              <span>Anomaly Event Flag</span>
            </span>
          </div>
        </div>

        {/* 90-Day Composed Chart */}
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={history90Days} margin={{ top: 10, right: 10, left: -5, bottom: 0 }}>
              <defs>
                <linearGradient id="historyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={theme === 'light' ? '#E2E8F0' : '#1F2937'} vertical={false} />
              <XAxis dataKey="dateStr" stroke={theme === 'light' ? '#64748B' : '#6B7280'} tick={{ fontSize: 10, fontFamily: 'monospace' }} interval={6} />
              <YAxis yAxisId="left" stroke={theme === 'light' ? '#64748B' : '#6B7280'} tick={{ fontSize: 10, fontFamily: 'monospace' }} unit={classUnit} />
              <YAxis yAxisId="right" orientation="right" stroke="#3B82F6" tick={{ fontSize: 10, fontFamily: 'monospace' }} unit="°C" domain={[-30, 10]} />
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
              <Legend wrapperStyle={{ fontSize: 11, fontFamily: 'monospace', paddingTop: '6px' }} />
              {/* Daily Consumption Area */}
              <Area yAxisId="left" type="monotone" dataKey={classKey} name={`Daily Consumption (${classUnit})`} stroke="#06B6D4" strokeWidth={2} fill="url(#historyGrad)" />
              {/* Temperature Correlation Line */}
              <Line yAxisId="right" type="monotone" dataKey="temperatureC" name="Ambient Temp (°C)" stroke="#3B82F6" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />

              {/* Requirement 5: Anomaly Markers rendered directly on chart points */}
              {anomalies.map((anom) => (
                <ReferenceDot
                  key={anom.dayIndex}
                  yAxisId="left"
                  x={anom.dateStr}
                  y={anom[classKey] as number}
                  r={6}
                  fill="#EF4444"
                  stroke="#FFFFFF"
                  strokeWidth={2}
                />
              ))}
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Anomaly Event Cards Row */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <span className="text-[11px] font-mono font-bold text-slate-300 flex items-center space-x-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>DETECTED ANOMALY MARKERS & EVENT ATTRIBUTIONS (90 DAYS):</span>
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {anomalies.map((anom, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg border font-mono text-xs space-y-1 ${
                  theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-red-500 font-bold flex items-center space-x-1 text-[11px]">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                    <span>{anom.anomaly?.label}</span>
                  </span>
                  <span className="text-[10px] text-slate-400">{anom.dateStr} ({anom.label})</span>
                </div>
                <p className={`text-[10px] leading-relaxed ${theme === 'light' ? 'text-slate-600' : 'text-slate-300'}`}>
                  {anom.anomaly?.impactDescription}
                </p>
                <div className={`flex justify-between text-[10px] pt-1 text-slate-400 border-t ${theme === 'light' ? 'border-slate-200' : 'border-slate-800/80'}`}>
                  <span>Burn: <strong className={theme === 'light' ? 'text-cyan-700 font-bold' : 'text-cyan-300'}>{(anom[classKey] as number).toLocaleString()} {classUnit}</strong></span>
                  <span>Temp: <strong className={theme === 'light' ? 'text-blue-700 font-bold' : 'text-blue-300'}>{anom.temperatureC}°C</strong></span>
                  <span>Tempo: <strong className="text-amber-500 font-bold">{anom.operationalTempo}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Driver Correlations Breakdown & Seasonal Pattern View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Driver Breakdown (Requirement 2) */}
        <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center space-x-2">
              <Scale className="w-4 h-4 text-cyan-400" />
              <h3 className={`font-display font-bold text-sm ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                CONSUMPTION DRIVER CORRELATION MATRIX
              </h3>
            </div>
            <span className="text-[10px] font-mono text-cyan-400">STATISTICAL ELASTICITY</span>
          </div>

          <p className="text-[11px] text-slate-400 font-mono">
            Empirical correlation coefficients ($r$) quantifying demand sensitivity to tactical and weather covariates at {selectedPost}:
          </p>

          <div className="space-y-3 font-mono text-xs">
            {driverCorrelations.map((dc, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg border space-y-1 ${
                  theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`font-bold ${theme === 'light' ? 'text-slate-900' : 'text-slate-200'}`}>{dc.driver}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                      dc.status === 'STRONG_NEGATIVE'
                        ? 'bg-red-950 text-red-300 border border-red-800'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}
                  >
                    {dc.metric}
                  </span>
                </div>
                <p className={`text-[11px] leading-relaxed ${theme === 'light' ? 'text-slate-600' : 'text-slate-300'}`}>
                  {dc.elasticityDescription}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Seasonal Pattern View (Requirement 3: Weekly & Monthly) */}
        <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-amber-400" />
              <h3 className={`font-display font-bold text-sm ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                SEASONAL CYCLICALITY & DEMAND PATTERNS
              </h3>
            </div>

            {/* Toggle Weekly vs Monthly */}
            <div className={`flex items-center space-x-1 p-0.5 rounded-lg border text-[10px] font-mono ${
              theme === 'light' ? 'bg-slate-100 border-slate-200' : 'bg-slate-900 border-slate-800'
            }`}>
              <button
                onClick={() => setSeasonalMode('weekly')}
                className={`px-2 py-1 rounded transition-colors ${
                  seasonalMode === 'weekly'
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : theme === 'light'
                    ? 'text-slate-600 hover:text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Weekly Cycle
              </button>
              <button
                onClick={() => setSeasonalMode('monthly')}
                className={`px-2 py-1 rounded transition-colors ${
                  seasonalMode === 'monthly'
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : theme === 'light'
                    ? 'text-slate-600 hover:text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Monthly Trend (90d)
              </button>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 font-mono">
            {seasonalMode === 'weekly'
              ? 'Operational weekly schedule: Mon restock to weekend live perimeter drills'
              : 'Seasonal progression: July summer mild baseline to October blizzard onset'}
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={seasonalMode === 'weekly' ? weeklySeasonal : monthlySeasonal} margin={{ top: 10, right: 10, left: -5, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'light' ? '#E2E8F0' : '#1F2937'} vertical={false} />
                <XAxis dataKey="period" stroke={theme === 'light' ? '#64748B' : '#6B7280'} tick={{ fontSize: 10, fontFamily: 'monospace' }} />
                <YAxis stroke={theme === 'light' ? '#64748B' : '#6B7280'} tick={{ fontSize: 10, fontFamily: 'monospace' }} unit={classUnit} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme === 'light' ? '#FFFFFF' : '#111827',
                    border: theme === 'light' ? '1px solid #CBD5E1' : '1px solid #374151',
                    borderRadius: '8px',
                    fontFamily: 'monospace',
                    fontSize: '11px',
                  }}
                  itemStyle={{ color: theme === 'light' ? '#0F172A' : '#F9FAFB' }}
                />
                <Legend wrapperStyle={{ fontSize: 11, fontFamily: 'monospace', paddingTop: '4px' }} />
                <Bar dataKey="avgBurn" name={`Average Draw (${classUnit})`} fill="#06B6D4" radius={[4, 4, 0, 0]} />
                <Bar dataKey="peakBurn" name={`Peak Peak Draw (${classUnit})`} fill="#F59E0B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-400 space-y-0.5">
            <span className="text-amber-400 font-bold block">Operational Takeaway:</span>
            <span>
              {seasonalMode === 'weekly'
                ? 'Saturdays show +26% peak draw due to weekly defense readiness perimeter heating & weapons tests.'
                : 'October blizzard wave forces +147% surge in Class III fuel compared to July summer baseline.'}
            </span>
          </div>
        </div>
      </div>

      {/* 4. Consumption Rate Table Per Post (Requirement 4) */}
      <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
          <div className="flex items-center space-x-2">
            <Mountain className="w-4 h-4 text-emerald-400" />
            <h3 className={`font-display font-bold text-sm ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
              FORWARD FORMATION CONSUMPTION RATE & VARIANCE DIRECTORY
            </h3>
          </div>
          <span className="text-[10px] text-slate-400">90-Day Empirical Synthesis (PS-26251)</span>
        </div>

        <p className="text-[11px] text-slate-400">
          Average daily burn, peak burn spikes, and volumetric standard deviation across forward outposts:
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] text-slate-400 uppercase border-b border-slate-800">
                <th className="py-2.5 px-3">Post & Elevation</th>
                <th className="py-2.5 px-3">Supply Stream Class</th>
                <th className="py-2.5 px-3 text-right">Avg Daily Burn</th>
                <th className="py-2.5 px-3 text-right">Peak Daily Burn</th>
                <th className="py-2.5 px-3 text-right">Variance (&sigma;)</th>
                <th className="py-2.5 px-3 text-right">Current Stock</th>
                <th className="py-2.5 px-3 text-right">Runway</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-[11px]">
              {postStats.map((stat, idx) => {
                const isCrit = stat.status === 'CRITICAL';
                const isSurg = stat.status === 'SURGING';

                return (
                  <tr
                    key={idx}
                    className={`transition-colors ${
                      theme === 'light' ? 'hover:bg-slate-50/80' : 'hover:bg-slate-900/40'
                    }`}
                  >
                    <td className="py-2.5 px-3">
                      <span className={`font-bold block ${theme === 'light' ? 'text-slate-900' : 'text-slate-200'}`}>
                        {stat.postName}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">{stat.elevationFt.toLocaleString()} ft ASL</span>
                    </td>
                    <td className={`py-2.5 px-3 ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                      {stat.category}
                    </td>
                    <td className={`py-2.5 px-3 text-right font-semibold ${theme === 'light' ? 'text-slate-900' : 'text-slate-200'}`}>
                      {stat.avgDailyBurn.toLocaleString()} <span className="text-[10px] text-slate-500">{stat.unit.split('/')[0]}</span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-semibold text-amber-500">
                      {stat.peakDailyBurn.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-400 font-mono">
                      &plusmn;{stat.varianceStdDev}
                    </td>
                    <td className={`py-2.5 px-3 text-right font-semibold ${theme === 'light' ? 'text-cyan-700' : 'text-cyan-300'}`}>
                      {stat.currentStock.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] ${
                          stat.daysOfSupply < 1.0
                            ? 'bg-red-950 text-red-300 border border-red-800 animate-pulse'
                            : stat.daysOfSupply < 5.0
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        }`}
                      >
                        {stat.daysOfSupply.toFixed(1)}d
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isCrit
                            ? 'bg-red-950 text-red-300 border border-red-800 animate-pulse'
                            : isSurg
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        }`}
                      >
                        {stat.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500">
          <span>SOURCE: 90-DAY EMPIRICAL TIME-SERIES (logisticsStore.ts)</span>
          <span className="text-emerald-400 font-bold">UNIFIED GROUND TRUTH ACTIVE</span>
        </div>
      </div>
    </div>
  );
};
