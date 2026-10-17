"use client";

import React from "react";
import { Play, Pause, Flame, Cloud, Compass, Volume2, Download } from "lucide-react";

interface ControlsPanelProps {
  isRunning: boolean;
  onToggleSim: () => void;
  onTriggerAnomaly: (type: string) => void;
  onExportCSV: () => void;
  boxName: string;
}

export const ControlsPanel: React.FC<ControlsPanelProps> = ({
  isRunning,
  onToggleSim,
  onTriggerAnomaly,
  onExportCSV,
  boxName,
}) => {
  return (
    <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      {/* Left: Simulation State & Triggers */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider mr-1">
          Test Simulation:
        </span>

        {/* Play/Pause */}
        <button
          onClick={onToggleSim}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
            isRunning
              ? "bg-slate-200/80 hover:bg-slate-300 text-slate-800"
              : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="w-3.5 h-3.5" />
              <span>Pause Ticker</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5" />
              <span>Resume Ticker</span>
            </>
          )}
        </button>

        {/* Anomaly triggers */}
        <button
          onClick={() => onTriggerAnomaly("overheat")}
          className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 shadow-2xs flex items-center gap-1 transition-colors"
          title={`Inject >36°C reading in ${boxName}`}
        >
          <Flame className="w-3.5 h-3.5 text-rose-500" />
          <span>Test Heat (&gt;36°C)</span>
        </button>

        <button
          onClick={() => onTriggerAnomaly("co2_spike")}
          className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-white hover:bg-amber-50 text-amber-700 border border-amber-200 shadow-2xs flex items-center gap-1 transition-colors"
          title={`Inject >3000 ppm CO2 in ${boxName}`}
        >
          <Cloud className="w-3.5 h-3.5 text-amber-500" />
          <span>Test CO₂ (&gt;3000ppm)</span>
        </button>

        <button
          onClick={() => onTriggerAnomaly("tilt")}
          className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 shadow-2xs flex items-center gap-1 transition-colors"
          title={`Inject >10° knockover in ${boxName}`}
        >
          <Compass className="w-3.5 h-3.5 text-rose-500" />
          <span>Test Tilt (&gt;10°)</span>
        </button>

        <button
          onClick={() => onTriggerAnomaly("sound")}
          className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-white hover:bg-purple-50 text-purple-700 border border-purple-200 shadow-2xs flex items-center gap-1 transition-colors"
          title={`Inject swarm pitch spike in ${boxName}`}
        >
          <Volume2 className="w-3.5 h-3.5 text-purple-500" />
          <span>Test Swarm Buzz</span>
        </button>
      </div>

      {/* Right: CSV Export */}
      <button
        onClick={onExportCSV}
        className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/90 shadow-2xs flex items-center gap-1.5 transition-colors self-end md:self-auto"
        title="Download CSV log for all 3 boxes"
      >
        <Download className="w-3.5 h-3.5 text-slate-500" />
        <span>Export CSV</span>
      </button>
    </div>
  );
};
