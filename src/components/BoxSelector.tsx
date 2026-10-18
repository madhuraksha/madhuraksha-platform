"use client";

import React from "react";
import { motion } from "framer-motion";
import { HiveBox } from "@/types/hive";
import { Box, Layers } from "lucide-react";

interface BoxSelectorProps {
  boxes: Record<string, HiveBox>;
  activeBoxId: string;
  onSelectBox: (boxId: string) => void;
}

export const BoxSelector: React.FC<BoxSelectorProps> = ({
  boxes,
  activeBoxId,
  onSelectBox,
}) => {
  const boxKeys = Object.keys(boxes);

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">
              Select Active Hive Box
            </h2>
            <p className="text-xs text-slate-600">
              Master IoT Hub #1 monitors 3 identical standard beehive boxes (~1m apart)
            </p>
          </div>
        </div>

        <div className="text-xs text-slate-600 font-medium bg-slate-50 px-3 py-1 rounded-full border border-slate-200/60 self-start sm:self-auto">
          Currently inspecting: <strong className="text-amber-700">{boxes[activeBoxId]?.box_name}</strong>
        </div>
      </div>

      {/* Segmented Controller with Framer Motion LayoutId */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-1.5 bg-slate-100/80 rounded-xl">
        {boxKeys.map((key) => {
          const box = boxes[key];
          const isActive = activeBoxId === key;

          return (
            <button
              key={key}
              onClick={() => onSelectBox(key)}
              className="relative p-3 rounded-lg text-left transition-colors duration-200 focus:outline-none"
            >
              {isActive && (
                <motion.div
                  layoutId="activeBoxPill"
                  className="absolute inset-0 bg-white rounded-lg shadow-sm border border-slate-200/90"
                  transition={{ type: "spring", stiffness: 450, damping: 35 }}
                />
              )}

              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-7 h-7 rounded-md flex items-center justify-center text-sm ${
                      isActive ? "bg-amber-500 text-white shadow-xs" : "bg-slate-200/80 text-slate-600"
                    }`}
                  >
                    <Box className="w-4 h-4" />
                  </div>
                  <div>
                    <div className={`text-sm font-bold ${isActive ? "text-slate-900" : "text-slate-700"}`}>
                      {box.box_name}
                    </div>
                    <div className="text-[11px] text-slate-600 font-medium">
                      Standard Langstroth
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-slate-800 font-mono">
                    {box.temperature_c.toFixed(1)}°C
                  </span>
                  <div className="text-[11px] text-slate-600 font-mono">
                    {(box.weight_kg ?? box.total_hive_weight_kg ?? 0).toFixed(1)} kg
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
