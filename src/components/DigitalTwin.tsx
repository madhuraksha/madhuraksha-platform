"use client";

import React from "react";
import { motion } from "framer-motion";
import { HiveBox } from "@/types/hive";

interface DigitalTwinProps {
  box: HiveBox;
}

export const DigitalTwin: React.FC<DigitalTwinProps> = ({ box }) => {
  // Thermal coloring based on temperature
  const getBroodColor = () => {
    if (box.temperature_c > 36.0) return "bg-rose-500 text-white";
    if (box.temperature_c < 30.0) return "bg-sky-500 text-white";
    return "bg-amber-500 text-white";
  };

  const getStatusPill = () => {
    if (box.temperature_c > 36.0) return { label: "CRITICAL: OVERHEATING", color: "bg-rose-500 text-white" };
    if (box.tilt_deg > 10.0) return { label: "CRITICAL: TILT BREACH", color: "bg-rose-500 text-white" };
    if (box.temperature_c < 30.0) return { label: "WARNING: CHILLING", color: "bg-sky-500 text-white" };
    return { label: "HEALTHY COLONY", color: "bg-emerald-600 text-white" };
  };

  const status = getStatusPill();

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs relative overflow-hidden flex flex-col justify-between">
      {/* Animated Floating Bees in background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-80">
        <motion.span
          animate={{ x: [0, 20, -15, 0], y: [0, -18, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute text-sm top-8 left-12"
        >
          🐝
        </motion.span>
        <motion.span
          animate={{ x: [0, -25, 10, 0], y: [0, -12, 15, 0] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute text-sm top-20 right-14"
        >
          🐝
        </motion.span>
        <motion.span
          animate={{ x: [0, 18, -20, 0], y: [0, -22, 8, 0] }}
          transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute text-sm bottom-16 left-20"
        >
          🐝
        </motion.span>
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-start justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              2D Digital Twin
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${status.color}`}>
              {status.label}
            </span>
          </div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight mt-0.5">
            {box.box_name} Thermal Model
          </h3>
          <p className="text-xs text-slate-600">
            Internal micro-climate &amp; physical enclosure
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs font-mono font-bold text-slate-700">
            {box.sound_db} dB &bull; {box.bee_count_per_min} bees/min
          </span>
        </div>
      </div>

      {/* Virtual Hive Chamber Graphic */}
      <div className="relative z-10 max-w-xs mx-auto w-full my-4 flex flex-col items-center">
        {/* Telescoping Roof */}
        <div className="w-56 h-6 bg-amber-800 rounded-t-lg shadow-sm border border-amber-900/40 relative flex items-center justify-center">
          <span className="text-[10px] font-bold text-amber-100 uppercase tracking-wider">
            Telescoping Outer Roof
          </span>
        </div>

        {/* Honey Super */}
        <div className="w-52 h-14 bg-amber-100 border-x-2 border-b-2 border-amber-300 flex items-center justify-center text-xs font-bold text-amber-900 shadow-inner">
          <span>HONEY SUPER ({box.weight_kg.toFixed(1)} kg)</span>
        </div>

        {/* Brood Nest Chamber (Thermal Monitored) */}
        <motion.div
          animate={{ scale: [1, 1.01, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className={`w-52 h-20 border-x-2 border-b-2 border-slate-700 flex flex-col items-center justify-center transition-colors duration-500 shadow-md ${getBroodColor()}`}
        >
          <span className="text-[11px] font-extrabold uppercase tracking-wider opacity-90">
            BROOD NEST CHAMBER
          </span>
          <span className="text-sm font-extrabold font-mono mt-0.5 bg-black/20 px-2.5 py-0.5 rounded-full">
            {box.temperature_c.toFixed(1)}°C Brood Heat
          </span>
        </motion.div>

        {/* Entrance Floor Board */}
        <div className="w-56 h-5 bg-amber-900 rounded-b-md relative flex items-center justify-center">
          <div className="w-16 h-1 bg-slate-950 rounded-full" title="Entrance Reducer Slit" />
        </div>
      </div>

      {/* Footer Metrics */}
      <div className="relative z-10 pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
        <div>
          <span className="text-slate-600 block text-[11px]">CO₂ Level</span>
          <span className="font-bold text-slate-800 font-mono">{box.co2_ppm} ppm</span>
        </div>
        <div>
          <span className="text-slate-600 block text-[11px]">Ambient Light</span>
          <span className="font-bold text-slate-800 font-mono">{box.light_lux.toLocaleString()} lx</span>
        </div>
        <div>
          <span className="text-slate-600 block text-[11px]">Colony Flight</span>
          <span className="font-bold text-slate-800 font-mono">{box.bee_count_per_min}/min</span>
        </div>
      </div>
    </div>
  );
};
