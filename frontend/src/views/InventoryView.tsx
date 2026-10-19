import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  AlertTriangle,
  Radio,
  ShieldAlert,
  Info,
} from 'lucide-react';
import type { InventoryItem } from '../types';

export const InventoryView: React.FC = () => {
  const { inventory, setIsDiagnosticModalOpen, rudraLeakAnalysis, agniFuelAnalysis, temperature, theme } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [hoveredItem, setHoveredItem] = useState<InventoryItem | null>(null);

  const filteredItems = inventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.itemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.locationName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 ${
        theme === 'light' ? 'border-slate-200' : 'border-slate-800'
      }`}>
        <div>
          <h1 className={`font-display font-bold text-xl tracking-wide ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
            FORWARD INVENTORY & IOT TELEMETRY LEDGER
          </h1>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Real-time edge stock tracking and transducer anomaly diagnostics
          </p>
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search code, item, outpost..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`border text-xs font-mono rounded-lg pl-8 pr-3 py-1.5 focus:outline-none focus:border-cyan-500 w-56 ${
                theme === 'light'
                  ? 'bg-white border-slate-300 text-slate-800'
                  : 'bg-slate-900 border-slate-700 text-slate-200'
              }`}
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className={`border text-xs font-mono rounded-lg px-3 py-1.5 focus:outline-none focus:border-cyan-500 ${
              theme === 'light'
                ? 'bg-white border-slate-300 text-slate-800'
                : 'bg-slate-900 border-slate-700 text-slate-200'
            }`}
          >
            <option value="ALL">All Categories</option>
            <option value="CLASS_III_POL">Class III (Fuel & POL)</option>
            <option value="CLASS_I_RATIONS">Class I (Rations & MRE)</option>
            <option value="CLASS_V_AMMO">Class V (Ammunition)</option>
            <option value="CLASS_VIII_MEDICAL">Class VIII (Medical)</option>
            <option value="CLASS_II_WINTER_GEAR">Class II (Winter Gear)</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Clean Table (Left 2 cols) + IoT Transducer Feeds (Right col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Clean Table with row hover details & critical row highlights */}
        <div className="lg:col-span-2 glass-panel p-5 rounded-xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div>
              <h2 className={`font-display font-bold text-sm ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                CONSOLIDATED LOGISTICS LEDGER ({filteredItems.length} ITEMS)
              </h2>
              <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                Hover over any row for transducer sensor IDs and live telemetry health
              </p>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              Auto-synced via edge mesh
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className={`border-b ${theme === 'light' ? 'border-slate-200 text-slate-600' : 'border-slate-800 text-slate-400'} font-mono text-[11px]`}>
                  <th className="py-2.5 px-3">ITEM & LOCATION</th>
                  <th className="py-2.5 px-3 text-right">ON-HAND</th>
                  <th className="py-2.5 px-3 text-center">DAYS SUPPLY</th>
                  <th className="py-2.5 px-3 text-right">STATUS</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${theme === 'light' ? 'divide-slate-200' : 'divide-slate-800/60'} font-mono`}>
                {filteredItems.map((item) => {
                  const isAnomaly = item.status === 'LEAK_ANOMALY';
                  const isCritical = item.status === 'CRITICAL' || item.dos < 5;

                  return (
                    <tr
                      key={item.id}
                      onMouseEnter={() => setHoveredItem(item)}
                      onClick={() => {
                        if (isAnomaly) setIsDiagnosticModalOpen(true);
                      }}
                      className={`transition-colors cursor-pointer ${
                        isAnomaly
                          ? 'bg-red-950/30 border-l-2 border-red-500 hover:bg-red-950/40'
                          : isCritical
                          ? 'bg-red-950/15 border-l-2 border-red-500/70 hover:bg-red-950/25'
                          : theme === 'light'
                          ? 'hover:bg-slate-100/80'
                          : 'hover:bg-slate-800/40'
                      }`}
                    >
                      {/* 1. Item & Location */}
                      <td className="py-3 px-3">
                        <div className="flex items-center space-x-2">
                          <span className={`font-mono font-bold ${
                            isAnomaly ? 'text-red-300' : isCritical ? 'text-red-400' : theme === 'light' ? 'text-slate-900' : 'text-slate-200'
                          }`}>
                            {item.itemCode}
                          </span>
                          <span className="text-[11px] text-slate-500 font-sans truncate">
                            &bull; {item.locationName}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 block font-sans truncate max-w-sm mt-0.5">
                          {item.name}
                        </span>
                      </td>

                      {/* 2. On-Hand */}
                      <td className="py-3 px-3 text-right">
                        <span className={`font-bold ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>
                          {item.quantityOnHand.toLocaleString()}
                        </span>{' '}
                        <span className="text-[10px] text-slate-500 font-sans">{item.unit}</span>
                      </td>

                      {/* 3. Days Supply (Clean number; highlighted only if critical) */}
                      <td className="py-3 px-3 text-center">
                        <span className={`font-bold ${
                          isAnomaly || isCritical
                            ? 'text-red-400'
                            : item.dos < 10
                            ? 'text-amber-400'
                            : 'text-slate-300'
                        }`}>
                          {item.dos.toFixed(1)}d
                        </span>
                      </td>

                      {/* 4. Status & Action */}
                      <td className="py-3 px-3 text-right">
                        {isAnomaly ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsDiagnosticModalOpen(true);
                            }}
                            className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-600 text-[10px] animate-pulse font-bold cursor-pointer"
                          >
                            <AlertTriangle className="w-3 h-3 text-red-400" />
                            <span>LEAK ANOMALY</span>
                          </button>
                        ) : isCritical ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-800">
                            CRITICAL
                          </span>
                        ) : item.dos < 10 ? (
                          <span className="text-[10px] text-slate-400">
                            Monitor
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400">
                            Nominal
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Row Hover Details Strip (Requirement: row hover details) */}
          <div className={`p-2.5 rounded-lg border text-xs font-mono flex items-center justify-between ${
            theme === 'light' ? 'bg-slate-50 border-slate-200 text-slate-600' : 'bg-slate-950 border-slate-800 text-slate-400'
          }`}>
            {hoveredItem ? (
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 w-full justify-between">
                <span className="flex items-center space-x-1.5">
                  <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="text-slate-200 font-bold">{hoveredItem.itemCode}</span>
                  <span className="text-slate-400 font-sans truncate">({hoveredItem.name})</span>
                </span>
                <span className="text-slate-300">
                  Sensor: <span className="text-cyan-400 font-bold">{hoveredItem.sensorId}</span> ({hoveredItem.sensorHealth?.replace('_', ' ') || 'ACTIVE'})
                </span>
                <span className="text-slate-400 text-[11px]">
                  Threshold: 5.0d buffer &bull; Sync: Active
                </span>
              </div>
            ) : (
              <span className="text-slate-500 text-[11px] font-sans">
                Hover over any inventory record to inspect sensor transducer telemetry and buffer thresholds.
              </span>
            )}
          </div>
        </div>

        {/* Right Col: Live IoT Transducers Feed */}
        <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
              <h2 className={`font-display font-bold text-sm ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                IOT TELEMETRY STREAM
              </h2>
            </div>
            <span className="text-[11px] font-mono text-emerald-400">20s Latency</span>
          </div>

          <div className="space-y-3">
            {/* Sensor 1: FAP Rudra Tank 03 (Anomaly) */}
            <div
              onClick={() => setIsDiagnosticModalOpen(true)}
              className="p-4 rounded-xl border border-red-700/80 bg-red-950/20 hover:bg-red-950/40 cursor-pointer transition-colors space-y-1.5"
            >
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-red-400 font-bold flex items-center space-x-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>US-TANK-03 (POL Bulk)</span>
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-900 text-red-200 animate-pulse font-bold">
                  RAPID DROP
                </span>
              </div>
              <p className="text-xs text-slate-300 font-sans">Location: FAP Rudra (Forward Fuel Reserve)</p>
              <div className="flex justify-between text-xs font-mono pt-1 text-slate-400">
                <span>Reading: {rudraLeakAnalysis.volumeRemainingLitres.toLocaleString()} L ({rudraLeakAnalysis.formattedDays})</span>
                <span className="text-red-400 font-bold">{rudraLeakAnalysis.leakRateHourly} L/hr</span>
              </div>
              <p className="text-[11px] font-mono text-cyan-400 underline pt-0.5">
                Runway: {rudraLeakAnalysis.formattedHours} &bull; Click to inspect waveform & isolate &rarr;
              </p>
            </div>

            {/* Sensor 2: FP Agni Tank 01 */}
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/80 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-200 font-semibold">US-AGNI-TANK1 (Arctic Diesel)</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-bold">
                  LOW RUNWAY
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans">Location: FP Agni (13.8k ft bunker)</p>
              <div className="flex justify-between text-xs font-mono pt-1 text-slate-400">
                <span>Reading: {agniFuelAnalysis.quantityOnHand.toLocaleString()} L ({agniFuelAnalysis.formattedDays})</span>
                <span className="text-slate-200 font-mono">Temp: {temperature}&deg;C</span>
              </div>
            </div>

            {/* Sensor 3: RFID Smart Container G9 */}
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/80 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-200 font-semibold">RFID-CONTAINER-G9 (7.62mm)</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                  SEALED
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans">Location: Base Depot Garuda Armory</p>
              <div className="flex justify-between text-xs font-mono pt-1 text-slate-400">
                <span>Tamper Seal: INTACT</span>
                <span className="text-slate-200 font-mono">84,000 rds</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
