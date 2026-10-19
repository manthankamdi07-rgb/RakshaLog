import React, { useState, useMemo } from 'react';
import {
  Truck,
  Users,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  AlertOctagon,
  Gauge,
  Fuel,
  Compass,
  MapPin,
  Clock,
  Layers,
  ArrowRight,
  TrendingUp,
  Sliders,
  Sparkles,
  Info,
  Route,
  Activity,
  Check,
} from 'lucide-react';
import {
  getSectorFleetVehicles,
  getSectorDrivers,
  getFleetConstraintsSummary,
  getCapacityShortfallAnalysis,
  FleetVehicle,
  FleetDriver,
} from '../utils/logisticsStore';

import { ExpandableText } from './ExpandableText';

interface Props {
  theme: 'light' | 'dark';
  fuelReorderLitres?: number;
}

export const FleetCapacityPanel: React.FC<Props> = ({
  theme,
  fuelReorderLitres = 4600,
}) => {
  const [vehicleFilter, setVehicleFilter] = useState<'ALL' | 'ASSIGNED' | 'AVAILABLE' | 'MAINTENANCE'>('ALL');
  const [driverFilter, setDriverFilter] = useState<'ALL' | 'COMPLIANT' | 'FLAGGED'>('ALL');
  const [simulateShortfall, setSimulateShortfall] = useState<boolean>(false);

  const vehicles = useMemo(() => getSectorFleetVehicles(fuelReorderLitres), [fuelReorderLitres]);
  const drivers = useMemo(() => getSectorDrivers(), []);
  const constraints = useMemo(() => getFleetConstraintsSummary(fuelReorderLitres), [fuelReorderLitres]);
  const shortfall = useMemo(
    () => getCapacityShortfallAnalysis(simulateShortfall, 7200),
    [simulateShortfall]
  );

  const filteredVehicles = useMemo(() => {
    if (vehicleFilter === 'ALL') return vehicles;
    return vehicles.filter((v) => v.status === vehicleFilter);
  }, [vehicles, vehicleFilter]);

  const filteredDrivers = useMemo(() => {
    if (driverFilter === 'ALL') return drivers;
    if (driverFilter === 'COMPLIANT') return drivers.filter((d) => d.status === 'COMPLIANT');
    return drivers.filter((d) => d.isFlagged);
  }, [drivers, driverFilter]);

  return (
    <div className="space-y-6">
      {/* 1. Header & Shortfall Simulator Switch */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 ${theme === 'light' ? 'border-slate-200' : 'border-slate-800'}`}>
        <div>
          <h2 className={`font-display font-bold text-lg tracking-wide flex items-center space-x-2 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
            <Truck className="w-5 h-5 text-cyan-400" />
            <span>FLEET CAPACITY & OPERATIONAL CONSTRAINTS MATRIX</span>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
              PLAN DP-2026-108
            </span>
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Motor Transport (MT) asset availability, high-altitude driver rest compliance, and road passability rules
          </p>
        </div>

        {/* Shortfall State Toggle (Requirement 5) - Secondary button styling */}
        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-mono text-slate-400">Stress Test:</span>
          <button
            onClick={() => setSimulateShortfall(!simulateShortfall)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
              simulateShortfall
                ? 'bg-red-950/80 text-red-200 border border-red-700 shadow-md shadow-red-950/30'
                : theme === 'light'
                ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300'
                : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-700'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>{simulateShortfall ? 'CAPACITY DEFICIT SIMULATED' : 'SIMULATE CAPACITY SHORTFALL'}</span>
          </button>
        </div>
      </div>

      {/* 4. Optimizer Rationale / Constraint Audit Line (Requirement 4) */}
      <div className={`p-5 rounded-xl border font-mono text-xs space-y-2 ${
        theme === 'light'
          ? 'bg-cyan-50/80 border-cyan-200 text-cyan-950'
          : 'glass-panel border-cyan-900/60 text-cyan-200'
      }`}>
        <div className="flex items-center space-x-2 text-cyan-400 font-bold">
          <Compass className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="tracking-wide uppercase text-[11px]">DISPATCH OPTIMIZER CONSTRAINT RESOLUTION AUDIT (DP-2026-108)</span>
        </div>
        <ExpandableText
          summary="Autonomous solver generated multi-drop manifest DP-2026-108 resolving 3-tiered constraints: blizzard fuel urgency at FP Agni, axle weight clearance on High Ridge, and driver rest compliance."
          details={constraints.optimizerConstraintAudit}
          expandLabel="View full audit"
          collapseLabel="Collapse audit"
          summaryClassName={theme === 'light' ? 'text-slate-700 text-xs' : 'text-slate-300 text-xs'}
          detailsClassName={theme === 'light' ? 'text-slate-600 text-[11px]' : 'text-slate-400 text-[11px]'}
        />
        <div className="flex flex-wrap items-center gap-3 pt-1 text-[10px] text-slate-400">
          <span className="flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>High Ridge Snow Trail Restricted: <strong>Wheeled Access Denied</strong></span>
          </span>
          <span className="flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>Valley Bypass Route 9: <strong>Primary Heavy Convoy Cleared</strong></span>
          </span>
          <span className="flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>Driver Rest Rules: <strong>100% Compliant</strong></span>
          </span>
        </div>
      </div>

      {/* 5. Warning States / Capacity Shortfall Alert & Automated Alternative (Requirement 5) */}
      {shortfall.isShortfall && (
        <div className={`p-4 rounded-xl border space-y-3 font-mono text-xs ${
          theme === 'light' ? 'bg-red-50 border-red-300' : 'bg-red-950/40 border-red-700'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-red-400 font-bold">
              <AlertOctagon className="w-5 h-5 text-red-500 animate-bounce" />
              <span className="text-sm">{shortfall.alertHeadline}</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] bg-red-900 text-red-200 border border-red-700 font-bold">
              SURGE STRESS WARNING
            </span>
          </div>

          <p className={`text-xs leading-relaxed ${theme === 'light' ? 'text-red-900' : 'text-red-200'}`}>
            {shortfall.alertDetail}
          </p>

          <div className={`p-3 rounded-lg border space-y-2 ${
            theme === 'light' ? 'bg-white border-red-200 text-slate-800' : 'bg-slate-950 border-red-800/80 text-slate-200'
          }`}>
            <div className="flex items-center justify-between border-b border-red-800/50 pb-1.5">
              <span className="text-amber-400 font-bold flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{shortfall.recommendedAlternative.title}</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-bold">
                {shortfall.recommendedAlternative.etaImpact}
              </span>
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed">
              <strong>Contingency Action:</strong> {shortfall.recommendedAlternative.actionPlan}
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[10px] text-slate-400">Reallocated Assets:</span>
              {shortfall.recommendedAlternative.reallocatedAssets.map((asset, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded bg-slate-900 text-cyan-300 border border-slate-700 text-[10px]"
                >
                  {asset}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. Constraints Summary KPI Ribbon (Requirement 3) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Available Fleet */}
        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1 font-mono">
          <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase">
            <span>Sector MT Fleet</span>
            <Truck className="w-4 h-4 text-cyan-400" />
          </div>
          <p className={`text-2xl font-bold ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
            {constraints.availableCount} <span className="text-xs font-normal text-slate-400">Available / {constraints.totalFleetCount} Total</span>
          </p>
          <div className="flex justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800">
            <span className="text-cyan-400 font-semibold">{constraints.assignedCount} Assigned (DP-108)</span>
            <span className="text-amber-400">{constraints.maintenanceCount} in Workshop</span>
          </div>
        </div>

        {/* Liquid POL Fuel Capacity */}
        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1 font-mono">
          <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase">
            <span>POL Tanker Capacity</span>
            <Fuel className="w-4 h-4 text-emerald-400" />
          </div>
          <p className={`text-2xl font-bold ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
            {constraints.totalLiquidFuelCapacityL.toLocaleString()} <span className="text-xs font-normal text-slate-400">Litres</span>
          </p>
          <div className="flex justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800">
            <span className="text-emerald-400 font-semibold">Allocated: {constraints.activePlanFuelL.toLocaleString()}L ({constraints.fuelUtilizationPct}%)</span>
            <span>Reserve: 5,000L</span>
          </div>
        </div>

        {/* Dry Cargo Payload */}
        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1 font-mono">
          <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase">
            <span>Max Cargo Payload</span>
            <Layers className="w-4 h-4 text-amber-400" />
          </div>
          <p className={`text-2xl font-bold ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
            {(constraints.totalDryCargoCapacityKg / 1000).toFixed(1)} <span className="text-xs font-normal text-slate-400">Tons (2 Trucks)</span>
          </p>
          <div className="flex justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800">
            <span className="text-cyan-400 font-semibold">Packed: 2.1T (84% Utilization)</span>
            <span>Rations + Med</span>
          </div>
        </div>

        {/* Convoy Packing Efficiency (Linked to DispatchView) */}
        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1 font-mono">
          <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase">
            <span>Packing Efficiency</span>
            <Gauge className="w-4 h-4 text-purple-400" />
          </div>
          <p className={`text-2xl font-bold text-emerald-400`}>
            88.0% <span className="text-xs font-normal text-slate-400">Composite</span>
          </p>
          <div className="flex justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800">
            <span className="text-emerald-400 font-bold">+68 km Saved</span>
            <span className="text-cyan-400">+140 L Fuel Saved</span>
          </div>
        </div>
      </div>

      {/* 1. Fleet Asset Directory Table (Requirement 1) */}
      <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
          <div className="flex items-center space-x-2">
            <Truck className="w-4 h-4 text-cyan-400" />
            <h3 className={`font-display font-bold text-sm ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
              SECTOR FLEET ASSET DIRECTORY & LIVE PAYLOAD ALLOCATION
            </h3>
          </div>

          {/* Vehicle Status Filter */}
          <div className="flex items-center space-x-1 text-[10px]">
            {(['ALL', 'ASSIGNED', 'AVAILABLE', 'MAINTENANCE'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setVehicleFilter(filter)}
                className={`px-2 py-0.5 rounded transition-all ${
                  vehicleFilter === filter
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : theme === 'light'
                    ? 'bg-slate-100 text-slate-600 hover:text-slate-950'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <p className="text-[11px] text-slate-400">
          Tracking all Northern Command logistical transports, capacity ratings, fuel reserves, and plan allocations:
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] text-slate-400 uppercase border-b border-slate-800">
                <th className="py-2.5 px-3">Vehicle ID & Type</th>
                <th className="py-2.5 px-3">Capacity Specs</th>
                <th className="py-2.5 px-3">Current Location</th>
                <th className="py-2.5 px-3">Fuel Level</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3">Packing Ratio (DP-108)</th>
                <th className="py-2.5 px-3">Road Restrictions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-[11px]">
              {filteredVehicles.map((v) => {
                const isAssigned = v.status === 'ASSIGNED';
                const isMaint = v.status === 'MAINTENANCE';

                return (
                  <tr
                    key={v.id}
                    className={`transition-colors ${
                      isAssigned
                        ? theme === 'light'
                          ? 'bg-cyan-50/60 font-semibold'
                          : 'bg-cyan-950/20 font-semibold'
                        : theme === 'light'
                        ? 'hover:bg-slate-50'
                        : 'hover:bg-slate-900/40'
                    }`}
                  >
                    <td className="py-2.5 px-3">
                      <div className="flex items-center space-x-2">
                        <span className={`font-bold ${isAssigned ? 'text-cyan-400' : theme === 'light' ? 'text-slate-900' : 'text-slate-200'}`}>
                          {v.id}
                        </span>
                        {isAssigned && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-900 text-cyan-200 border border-cyan-700">
                            PLAN DP-108
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 block">{v.type}</span>
                    </td>

                    <td className="py-2.5 px-3 text-slate-300">
                      <span className="font-semibold block">{v.capacityDisplay}</span>
                      <span className="text-[10px] text-slate-500">Max Payload: {v.capacityPayloadKg.toLocaleString()} kg</span>
                    </td>

                    <td className="py-2.5 px-3">
                      <span className="flex items-center space-x-1 text-slate-300">
                        <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                        <span>{v.currentLocation}</span>
                      </span>
                    </td>

                    {/* Fuel Level */}
                    <td className="py-2.5 px-3">
                      <div className="space-y-1 w-24">
                        <div className="flex justify-between text-[10px]">
                          <span className={v.fuelLevelPct < 50 ? 'text-amber-400' : 'text-emerald-400'}>
                            {v.fuelLevelPct}%
                          </span>
                          <span className="text-slate-500">{v.rangeKm}km</span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              v.fuelLevelPct < 50 ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${v.fuelLevelPct}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isAssigned
                            ? 'bg-cyan-950 text-cyan-300 border border-cyan-700 animate-pulse'
                            : isMaint
                            ? 'bg-red-950 text-red-300 border border-red-800'
                            : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        }`}
                      >
                        {v.status === 'ASSIGNED' ? 'ASSIGNED (DP-108)' : v.status}
                      </span>
                    </td>

                    {/* Packing Efficiency Link (Requirement 1 & 6) */}
                    <td className="py-2.5 px-3">
                      {isAssigned ? (
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px]">
                            <span className="text-cyan-400 font-bold">{v.packingWeightPct}% Packed</span>
                            <span className="text-slate-400">
                              {v.category === 'FUEL' ? `${v.volumeLoadedL?.toLocaleString()}L` : `${v.payloadLoadedKg}kg`}
                            </span>
                          </div>
                          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-cyan-400 h-full rounded-full"
                              style={{ width: `${v.packingWeightPct}%` }}
                            ></div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-500 text-[10px] italic">Standby Reserve</span>
                      )}
                    </td>

                    {/* Road Restrictions */}
                    <td className="py-2.5 px-3 text-[10px] text-slate-400">
                      {v.roadRestrictions[0]}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Driver Availability & Rest-Hours Compliance Matrix (Requirement 2) */}
      <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-indigo-400" />
            <h3 className={`font-display font-bold text-sm ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
              DRIVER ROSTER, DUTY HOURS & REST-HOURS SAFETY RULE
            </h3>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-[10px] text-slate-400">Rule: Max 8h Continuous Duty &bull; Min 6h Rest/24h</span>
            <div className="flex items-center space-x-1 text-[10px]">
              {(['ALL', 'COMPLIANT', 'FLAGGED'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setDriverFilter(filter)}
                  className={`px-2 py-0.5 rounded transition-all ${
                    driverFilter === filter
                      ? 'bg-indigo-600 text-white font-bold'
                      : theme === 'light'
                      ? 'bg-slate-100 text-slate-600 hover:text-slate-950'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-[11px] text-slate-400">
          Enforcing strict Northern Command military driver safety thresholds for high-altitude blackout mountain operations:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredDrivers.map((d) => {
            const isAssigned = d.assignedPlanId === 'DP-2026-108';
            const isViolation = d.status === 'REST_VIOLATION';
            const isWarning = d.status === 'WARNING_DUTY_LIMIT';

            return (
              <div
                key={d.id}
                className={`p-3.5 rounded-xl border space-y-2 font-mono transition-all ${
                  isViolation
                    ? theme === 'light'
                      ? 'bg-red-50 border-red-300'
                      : 'bg-red-950/30 border-red-800'
                    : isWarning
                    ? theme === 'light'
                      ? 'bg-amber-50 border-amber-300'
                      : 'bg-amber-950/20 border-amber-800'
                    : isAssigned
                    ? theme === 'light'
                      ? 'bg-cyan-50/50 border-cyan-300'
                      : 'bg-cyan-950/20 border-cyan-700'
                    : theme === 'light'
                    ? 'bg-slate-50 border-slate-200'
                    : 'bg-slate-900 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className={`font-bold text-xs ${theme === 'light' ? 'text-slate-900' : 'text-slate-200'}`}>
                      {d.name}
                    </span>
                    <span className="text-[10px] text-slate-500 block">{d.rank} &bull; {d.serviceNo}</span>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      isViolation
                        ? 'bg-red-900 text-red-200 border border-red-700 animate-pulse'
                        : isWarning
                        ? 'bg-amber-900 text-amber-200 border border-amber-700'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}
                  >
                    {isViolation ? 'REST VIOLATION' : isWarning ? 'LIMIT WARNING' : 'COMPLIANT'}
                  </span>
                </div>

                {/* Duty & Rest Progress Bars */}
                <div className="space-y-1.5 pt-1 border-t border-slate-800/80 text-[10px]">
                  <div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Duty Remaining:</span>
                      <span className={`font-bold ${d.dutyHoursRemaining < 2 ? 'text-red-400' : 'text-emerald-400'}`}>
                        {d.dutyHoursRemaining}h / 8.0h cap
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-0.5">
                      <div
                        className={`h-full rounded-full ${
                          d.dutyHoursRemaining < 2 ? 'bg-red-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${(d.dutyHoursRemaining / 8.0) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Rest Last 24h:</span>
                      <span className={`font-bold ${d.restHoursLast24h < 6.0 ? 'text-red-400' : 'text-emerald-400'}`}>
                        {d.restHoursLast24h}h (Min 6.0h req.)
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-0.5">
                      <div
                        className={`h-full rounded-full ${
                          d.restHoursLast24h < 6.0 ? 'bg-red-500' : 'bg-indigo-500'
                        }`}
                        style={{ width: `${Math.min(100, (d.restHoursLast24h / 8.0) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Flag Alert or Assignment Note */}
                {d.isFlagged ? (
                  <div className="p-2 rounded bg-red-950/60 border border-red-800 text-[10px] text-red-200 leading-tight flex items-start space-x-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                    <span>{d.flagDescription}</span>
                  </div>
                ) : (
                  <div className="flex justify-between items-center text-[10px] pt-1 text-slate-400">
                    <span>Assigned Vehicle: <strong className="text-cyan-400">{d.vehicleAssignedId}</strong></span>
                    {isAssigned && (
                      <span className="text-cyan-400 font-bold flex items-center space-x-0.5">
                        <Check className="w-3 h-3 text-cyan-400" />
                        <span>Plan DP-108</span>
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Road Restrictions Directory (Requirement 3) */}
      <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
          <Route className="w-4 h-4 text-amber-400" />
          <h3 className={`font-display font-bold text-sm ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
            SECTOR ROAD CLASS RESTRICTIONS BY VEHICLE TYPE
          </h3>
        </div>

        <p className="text-[11px] text-slate-400">
          Geographic and engineering passage limits governing tactical vehicle dispatch:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {constraints.roadRestrictions.map((rr, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border space-y-2 ${
                theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`font-bold text-xs ${theme === 'light' ? 'text-slate-900' : 'text-slate-200'}`}>
                  {rr.routeName}
                </span>
                <span className="text-[10px] text-amber-400 font-bold">Max {rr.maxGradientPct}% Grade</span>
              </div>

              <div className="space-y-1 text-[11px]">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Prohibited Vehicles:</span>
                  <span className="text-red-400 font-semibold">{rr.restrictedVehicleTypes.join(', ')}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Terrain Condition:</span>
                  <span className="text-slate-300">{rr.condition}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Routing Rule:</span>
                  <span className="text-emerald-400 font-semibold">{rr.allowedAlternatives}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
