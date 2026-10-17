"use client";

import React, { useState } from "react";

export const FleetMap: React.FC = () => {
  const [selectedStation, setSelectedStation] = useState<string>("mandya");

  const stations = [
    {
      id: "mandya",
      name: "Mandya Apiary Alpha",
      hubId: "IOT_HUB_01",
      boxes: 3,
      status: "Active (3 Boxes Linked)",
      region: "Mandya District · Sugar Cane & Floral Belt",
      avgTemp: "34.2°C",
      totalYield: "81.7 kg",
      isLive: true,
      weather: "Sunny (32°C)",
    },
    {
      id: "ramanagara",
      name: "Ramanagara Apiary Beta",
      hubId: "IOT_HUB_02",
      boxes: 3,
      status: "Active (3 Boxes Linked)",
      region: "Ramanagara · Mulberry & Eucalyptus Belt",
      avgTemp: "33.8°C",
      totalYield: "46.0 kg",
      isLive: false,
      weather: "Partly Cloudy (30°C)",
    },
    {
      id: "madikeri",
      name: "Madikeri Apiary Gamma",
      hubId: "IOT_HUB_03",
      boxes: 3,
      status: "High Rainfall (3 Boxes Linked)",
      region: "Coorg Highlands · Coffee Blossom & Forest",
      avgTemp: "29.5°C",
      totalYield: "18.5 kg",
      isLive: false,
      weather: "Moderate Rain (24°C)",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 tracking-tight">
          Apiary Fleet Geographic Network
        </h2>
        <p className="text-xs text-slate-600 mt-0.5">
          Karnataka Agro-Climatic Belt &bull; Multi-Hub Distributed Deployment
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Canvas Visualizer */}
        <div className="lg:col-span-2 bg-slate-900 rounded-2xl p-6 relative overflow-hidden min-h-[380px] flex flex-col justify-between shadow-xs">
          {/* Subtle grid pattern */}
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage:
                "linear-gradient(#475569 1px, transparent 1px), linear-gradient(90deg, #475569 1px, transparent 1px)",
              backgroundSize: "36px 36px",
            }}
          />

          <div className="relative z-10 flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono">REGION: SOUTH KARNATAKA</span>
            <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-bold">
              3 Stations &bull; 9 Total Hive Boxes
            </span>
          </div>

          {/* Map Pins */}
          <div className="relative z-10 my-auto py-12 flex flex-col items-center gap-10">
            {/* Station Pin: Mandya */}
            <button
              onClick={() => setSelectedStation("mandya")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                selectedStation === "mandya"
                  ? "bg-amber-500 text-white shadow-lg shadow-amber-500/30 scale-105"
                  : "bg-slate-800/90 text-slate-200 hover:bg-slate-700"
              }`}
            >
              <span className="text-base">🐝</span>
              <div className="text-left">
                <div className="text-xs font-bold leading-tight">Mandya Apiary Alpha (Active Hub #1)</div>
                <div className="text-[10px] opacity-80">3 Standard Boxes (~1m apart)</div>
              </div>
            </button>

            {/* Station Pin: Ramanagara */}
            <button
              onClick={() => setSelectedStation("ramanagara")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                selectedStation === "ramanagara"
                  ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 scale-105"
                  : "bg-slate-800/90 text-slate-200 hover:bg-slate-700"
              }`}
            >
              <span className="text-base">🌿</span>
              <div className="text-left">
                <div className="text-xs font-bold leading-tight">Ramanagara Apiary Beta (Hub #2)</div>
                <div className="text-[10px] opacity-80">3 Standard Boxes</div>
              </div>
            </button>

            {/* Station Pin: Madikeri */}
            <button
              onClick={() => setSelectedStation("madikeri")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                selectedStation === "madikeri"
                  ? "bg-sky-500 text-white shadow-lg shadow-sky-500/30 scale-105"
                  : "bg-slate-800/90 text-slate-200 hover:bg-slate-700"
              }`}
            >
              <span className="text-base">☕</span>
              <div className="text-left">
                <div className="text-xs font-bold leading-tight">Madikeri Apiary Gamma (Hub #3)</div>
                <div className="text-[10px] opacity-80">Coorg Highlands</div>
              </div>
            </button>
          </div>

          <div className="relative z-10 text-[11px] text-slate-400 text-center">
            Click any apiary station pin to inspect node telemetry
          </div>
        </div>

        {/* Sidebar Station Cards */}
        <div className="space-y-4">
          {stations.map((s) => {
            const isSelected = selectedStation === s.id;
            return (
              <div
                key={s.id}
                onClick={() => setSelectedStation(s.id)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-amber-50/70 border-amber-300 shadow-sm ring-1 ring-amber-300"
                    : "bg-white border-slate-200/80 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-sm font-bold text-slate-900">{s.name}</h3>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      s.isLive ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {s.boxes} Boxes
                  </span>
                </div>

                <p className="text-xs text-slate-600 mb-3">{s.region}</p>

                <div className="pt-2.5 border-t border-slate-200/60 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[11px] text-slate-600 block">Avg Brood Temp</span>
                    <span className="font-bold text-slate-800 font-mono">{s.avgTemp}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-600 block">Combined Yield</span>
                    <span className="font-bold text-amber-800 font-mono">{s.totalYield}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
