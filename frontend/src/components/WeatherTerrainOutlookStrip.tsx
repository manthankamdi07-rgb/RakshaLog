import React, { useState, useMemo } from 'react';
import {
  CloudSnow,
  ChevronDown,
  ChevronUp,
  Route,
  AlertTriangle,
} from 'lucide-react';
import {
  getWeatherTerrainOutlook,
  WeatherTerrainOutlook,
  DailyWeatherForecast,
  getPassabilityFromRisk,
} from '../utils/logisticsStore';
import { ExpandableText } from './ExpandableText';

interface Props {
  theme: 'light' | 'dark';
  temperature?: number;
  isBlizzardActive?: boolean;
  passK4Blocked?: boolean;
  compact?: boolean;
}

export const WeatherTerrainOutlookStrip: React.FC<Props> = ({
  theme,
  temperature = -18,
  isBlizzardActive = true,
  passK4Blocked = false,
  compact = true,
}) => {
  // Requirement: Collapse the Weather Event panel by default into a single-line summary bar
  const [isExpanded, setIsExpanded] = useState<boolean>(!compact);
  const [selectedPass, setSelectedPass] = useState<'K4' | 'ZOJILA' | 'KHARDUNG'>('K4');

  const outlook: WeatherTerrainOutlook = useMemo(
    () => getWeatherTerrainOutlook(temperature, isBlizzardActive, passK4Blocked),
    [temperature, isBlizzardActive, passK4Blocked]
  );

  // Peak day computation
  const peakDay = outlook.days.find((d) => d.isBlizzardPeak) || outlook.days[2] || outlook.days[0];
  const todayK4Risk = outlook.days[0]?.passK4ClosureRiskPct || (passK4Blocked ? 99 : 82);
  const todayK4Status = getPassabilityFromRisk(todayK4Risk, passK4Blocked);

  return (
    <div className={`rounded-xl border transition-all ${
      outlook.isWeatherEventActive
        ? theme === 'light'
          ? 'bg-blue-50/90 border-blue-200 shadow-sm'
          : 'bg-blue-950/30 border-blue-800/60 shadow-sm'
        : theme === 'light'
        ? 'bg-slate-50 border-slate-200 shadow-sm'
        : 'bg-slate-900/90 border-slate-800 shadow-sm'
    }`}>
      {/* Single-Line Summary Bar (Event name, peak day, K-4 closure %, and expand button) */}
      <div className="px-3.5 py-2 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2.5 min-w-0">
          <div className={`p-1.5 rounded-md shrink-0 ${
            outlook.isWeatherEventActive
              ? 'bg-blue-600 text-white'
              : 'bg-slate-800 text-slate-300'
          }`}>
            <CloudSnow className="w-4 h-4" />
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 min-w-0">
            {/* Event Name */}
            <span className={`font-semibold truncate ${
              theme === 'light' ? 'text-blue-950' : 'text-blue-200'
            }`}>
              {outlook.isWeatherEventActive ? 'Western Disturbance Cat-4 Blizzard' : 'Sector Trishul Weather Outlook'}
            </span>

            {/* Peak Day */}
            <span className="text-[11px] font-mono text-slate-400 flex items-center space-x-1">
              <span className="text-slate-500">Peak:</span>
              <span className="text-amber-400 font-bold">{peakDay.dayLabel} ({peakDay.dateStr.split(' ')[0]} {peakDay.dateStr.split(' ')[1]})</span>
            </span>

            {/* K-4 Closure % & Status */}
            <span className="text-[11px] font-mono flex items-center space-x-1">
              <span className="text-slate-500">K-4 Closure:</span>
              <span className={`font-bold ${
                todayK4Risk >= 95 ? 'text-red-400' : todayK4Risk >= 60 ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {todayK4Risk}% ({todayK4Status.replace('_', ' ')})
              </span>
            </span>
          </div>
        </div>

        {/* Expand / Collapse Button */}
        <div className="flex items-center space-x-2 shrink-0">
          {isExpanded && (
            <div className={`hidden sm:flex items-center space-x-1 p-0.5 rounded-md border text-[10px] font-mono ${
              theme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-950 border-slate-800'
            }`}>
              <button
                onClick={() => setSelectedPass('K4')}
                className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                  selectedPass === 'K4'
                    ? 'bg-red-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Pass K-4
              </button>
              <button
                onClick={() => setSelectedPass('ZOJILA')}
                className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                  selectedPass === 'ZOJILA'
                    ? 'bg-amber-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Zojila
              </button>
              <button
                onClick={() => setSelectedPass('KHARDUNG')}
                className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                  selectedPass === 'KHARDUNG'
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Khardung
              </button>
            </div>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`px-2.5 py-1 rounded-lg border text-xs font-mono flex items-center space-x-1.5 transition-colors cursor-pointer ${
              theme === 'light'
                ? 'bg-white border-slate-200 text-slate-700 hover:text-slate-900'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
            }`}
            title={isExpanded ? 'Collapse 7-Day Outlook' : 'Expand 7-Day Outlook'}
          >
            <span className="hidden sm:inline">{isExpanded ? 'Hide forecast' : '7-Day forecast'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Expanded 7-Day Forecast as a Horizontal Scroll Strip */}
      {isExpanded && (
        <div className="p-3.5 pt-1 space-y-3 font-mono text-xs border-t border-slate-800/40 animate-fade-in">
          {/* Weather Description (Long text wrapped with ExpandableText) */}
          <div className="pt-1 text-slate-400">
            <ExpandableText
              summary={outlook.eventDescription.slice(0, 115) + '...'}
              details={outlook.eventDescription}
              summaryClassName="text-slate-300 font-sans text-xs"
              detailsClassName="text-slate-400 font-sans text-xs mt-1"
            />
          </div>

          {/* Horizontal Scroll Strip */}
          <div className="flex overflow-x-auto gap-2.5 pb-2 scrollbar-thin">
            {outlook.days.map((d: DailyWeatherForecast) => {
              const passRisk =
                selectedPass === 'K4'
                  ? d.passK4ClosureRiskPct
                  : selectedPass === 'ZOJILA'
                  ? d.passZojilaClosureRiskPct
                  : d.khardungClosureRiskPct;

              // Consistent passability rule: >=95% Impassable, 60-94% Chains Mandatory, <60% Clear
              const passStatus = getPassabilityFromRisk(passRisk, selectedPass === 'K4' && passK4Blocked);

              return (
                <div
                  key={d.dayIndex}
                  className={`min-w-[145px] p-2.5 rounded-xl border flex flex-col justify-between shrink-0 transition-all ${
                    d.isBlizzardPeak
                      ? theme === 'light'
                        ? 'bg-red-50/90 border-red-300 ring-1 ring-red-400/50'
                        : 'bg-red-950/40 border-red-600/80 ring-1 ring-red-500/40'
                      : d.condition === 'BLIZZARD'
                      ? theme === 'light'
                        ? 'bg-blue-50/80 border-blue-300'
                        : 'bg-blue-950/30 border-blue-700/70'
                      : theme === 'light'
                      ? 'bg-white border-slate-200'
                      : 'bg-slate-900/90 border-slate-800'
                  }`}
                >
                  {/* Day Header */}
                  <div className="flex items-center justify-between pb-1 border-b border-slate-800/40">
                    <div>
                      <span className={`font-bold block ${theme === 'light' ? 'text-slate-900' : 'text-slate-200'}`}>
                        {d.dayLabel}
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        {d.dateStr.split(' ')[0]} {d.dateStr.split(' ')[1]}
                      </span>
                    </div>

                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                        d.isBlizzardPeak
                          ? 'bg-red-600 text-white animate-pulse'
                          : d.condition === 'BLIZZARD'
                          ? 'bg-blue-600 text-white'
                          : theme === 'light'
                          ? 'bg-slate-100 text-slate-600'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {d.isBlizzardPeak ? 'PEAK' : d.dayIndex === 0 ? 'TODAY' : `+${d.dayIndex}d`}
                    </span>
                  </div>

                  {/* Temperature & Condition */}
                  <div className="my-2 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className={`text-base font-bold ${
                        d.tempC <= -20
                          ? 'text-red-400'
                          : d.tempC <= -15
                          ? 'text-cyan-400'
                          : theme === 'light'
                          ? 'text-slate-800'
                          : 'text-slate-200'
                      }`}>
                        {d.tempC}&deg;C
                      </span>
                      <span className="text-[10px] text-slate-400">{d.snowfallCm} cm</span>
                    </div>
                    <span className="text-[10px] text-slate-400 truncate block">
                      {d.conditionLabel}
                    </span>
                  </div>

                  {/* Pass Closure Risk Meter */}
                  <div className="pt-1.5 border-t border-slate-800/40">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                      <span>Closure Risk:</span>
                      <span className={`font-bold ${
                        passRisk >= 95 ? 'text-red-400' : passRisk >= 60 ? 'text-amber-400' : 'text-emerald-400'
                      }`}>
                        {passRisk}%
                      </span>
                    </div>

                    <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          passRisk >= 95 ? 'bg-red-500' : passRisk >= 60 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${passRisk}%` }}
                      ></div>
                    </div>

                    <div className="mt-1.5 text-center">
                      <span
                        className={`px-1.5 py-0.2 rounded text-[9px] font-bold block ${
                          passStatus === 'IMPASSABLE'
                            ? 'bg-red-950 text-red-300 border border-red-800'
                            : passStatus === 'CHAINS_MANDATORY'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        }`}
                      >
                        {passStatus.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Operational Directives Footer Link */}
          <div className={`p-2.5 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] ${
            theme === 'light' ? 'bg-white border-slate-200 text-slate-700' : 'bg-slate-950 border-slate-800 text-slate-300'
          }`}>
            <div className="flex items-start sm:items-center space-x-2">
              <Route className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5 sm:mt-0" />
              <div className="font-sans">
                <strong>GIS Logistics Directive:</strong>{' '}
                <ExpandableText
                  summary={outlook.recommendedConvoyAction.slice(0, 80) + '...'}
                  details={outlook.recommendedConvoyAction}
                  summaryClassName="inline text-slate-300"
                  detailsClassName="text-slate-400 mt-1"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3 text-[10px] text-slate-400 shrink-0 font-mono">
              <span>
                Risk Score: <strong className={outlook.routeRiskScore > 30 ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>{outlook.routeRiskScore}</strong>
              </span>
              <span>&bull;</span>
              <span>
                Burn Demand: <strong className="text-cyan-400 font-bold">{outlook.forecastModelDemandMultiplier}x</strong>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
