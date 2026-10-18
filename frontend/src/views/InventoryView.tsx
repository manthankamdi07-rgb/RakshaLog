import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Package,
  Search,
  Filter,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Radio,
  SlidersHorizontal,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

export const InventoryView: React.FC = () => {
  const { inventory, setIsDiagnosticModalOpen } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const filteredItems = inventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.itemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.locationName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h1 className="font-display font-bold text-xl text-white tracking-wide flex items-center space-x-2">
            <span>FORWARD INVENTORY & IOT TELEMETRY LEDGER</span>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
              SMART SENSORS ONLINE
            </span>
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Real-Time Edge Stock Tracking & Transducer Anomaly Diagnostics (PS-26251)
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
              className="bg-slate-900 border border-slate-700 text-xs font-mono rounded-lg pl-8 pr-3 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500 w-56"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-xs font-mono rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500"
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

      {/* Main Grid: Inventory Table (Left 2 cols) + IoT Transducer Feeds (Right col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Table */}
        <div className="lg:col-span-2 glass-panel p-5 rounded-xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="font-display font-bold text-sm text-white">
              CONSOLIDATED LOGISTICS LEDGER ({filteredItems.length} ITEMS)
            </h2>
            <span className="text-[10px] font-mono text-slate-400">
              Auto-synced with depot RFID & ultrasonic tank mesh
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                  <th className="py-2.5 px-3">CODE / ITEM</th>
                  <th className="py-2.5 px-3">LOCATION</th>
                  <th className="py-2.5 px-3 text-right">ON-HAND</th>
                  <th className="py-2.5 px-3 text-center">DAYS SUPPLY</th>
                  <th className="py-2.5 px-3 text-center">SENSOR HEALTH</th>
                  <th className="py-2.5 px-3 text-right">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {filteredItems.map((item) => {
                  const isAnomaly = item.status === 'LEAK_ANOMALY';
                  const isCritical = item.status === 'CRITICAL';

                  return (
                    <tr
                      key={item.id}
                      onClick={() => {
                        if (isAnomaly) setIsDiagnosticModalOpen(true);
                      }}
                      className={`hover:bg-slate-800/40 transition-colors ${
                        isAnomaly ? 'bg-red-950/20 cursor-pointer border-l-2 border-red-500' : ''
                      }`}
                    >
                      <td className="py-3 px-3">
                        <span className="font-bold text-slate-200 block">{item.itemCode}</span>
                        <span className="text-[11px] text-slate-400 truncate max-w-xs block font-sans">
                          {item.name}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <span className="text-slate-300 font-semibold">{item.locationName}</span>
                      </td>

                      <td className="py-3 px-3 text-right">
                        <span className="font-bold text-slate-100">
                          {item.quantityOnHand.toLocaleString()}
                        </span>{' '}
                        <span className="text-[10px] text-slate-500">{item.unit}</span>
                      </td>

                      <td className="py-3 px-3 text-center">
                        <div className="inline-flex flex-col items-center">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                              item.dos < 5
                                ? 'bg-red-950 text-red-300 border border-red-800'
                                : item.dos < 10
                                ? 'bg-amber-950 text-amber-300 border border-amber-800'
                                : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            }`}
                          >
                            {item.dos.toFixed(1)}d
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-3 text-center">
                        {item.sensorHealth === 'ANOMALY_ALARM' ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsDiagnosticModalOpen(true);
                            }}
                            className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-600 text-[10px] animate-pulse font-bold"
                          >
                            <AlertTriangle className="w-3 h-3" />
                            <span>LEAK ALARM</span>
                          </button>
                        ) : item.sensorHealth === 'OFFLINE' ? (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px]">
                            <span>OFFLINE</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/80 text-[10px]">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                            <span>{item.sensorId}</span>
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-3 text-right">
                        {isAnomaly ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-700 animate-pulse">
                            DIAGNOSE 🚨
                          </span>
                        ) : isCritical ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-800">
                            LOW STOCK
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                            OPTIMAL
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Col: Live IoT Transducers Feed */}
        <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
              <h2 className="font-display font-bold text-sm text-white">IOT TELEMETRY STREAM</h2>
            </div>
            <span className="text-[10px] font-mono text-emerald-400">20s LATENCY</span>
          </div>

          <div className="space-y-3">
            {/* Sensor 1: FAP Rudra Tank 03 (Anomaly) */}
            <div
              onClick={() => setIsDiagnosticModalOpen(true)}
              className="p-3.5 rounded-lg border border-red-700/80 bg-red-950/20 hover:bg-red-950/40 cursor-pointer transition-colors space-y-1.5"
            >
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-red-400 font-bold flex items-center space-x-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>US-TANK-03 (POL Bulk)</span>
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-900 text-red-200 animate-pulse">
                  RAPID DROP
                </span>
              </div>
              <p className="text-[11px] text-slate-300">Location: FAP Rudra (Forward Fuel Reserve)</p>
              <div className="flex justify-between text-xs font-mono pt-1 text-slate-400">
                <span>Reading: 1,150 Litres</span>
                <span className="text-red-400 font-bold">-120 L/hr</span>
              </div>
              <p className="text-[10px] font-mono text-cyan-400 underline pt-0.5">
                Click to inspect waveform & isolate tank &rarr;
              </p>
            </div>

            {/* Sensor 2: FP Agni Tank 01 */}
            <div className="p-3.5 rounded-lg border border-slate-800 bg-slate-900 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-200 font-semibold">US-AGNI-TANK1 (Arctic Diesel)</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  HEALTHY
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Location: FP Agni (13.8k ft bunker)</p>
              <div className="flex justify-between text-xs font-mono pt-1 text-slate-400">
                <span>Reading: 4,200 Litres</span>
                <span className="text-slate-200">Temp: -18°C</span>
              </div>
            </div>

            {/* Sensor 3: RFID Smart Container G9 */}
            <div className="p-3.5 rounded-lg border border-slate-800 bg-slate-900 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-200 font-semibold">RFID-CONTAINER-G9 (7.62mm)</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  SEALED
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Location: Base Depot Garuda Armory</p>
              <div className="flex justify-between text-xs font-mono pt-1 text-slate-400">
                <span>Tamper Seal: INTACT</span>
                <span className="text-slate-200">84,000 rds</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
