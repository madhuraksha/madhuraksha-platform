"use client";

import React from "react";
import { MasterHub } from "@/types/hive";
import { Cpu, BatteryCharging, Radio, Clock } from "lucide-react";

interface NavbarProps {
  hub: MasterHub;
  lastUpdatedSeconds: number;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  unreadAlertsCount: number;
}

export const NAV_TABS = [
  { id: "command", label: "Command Center", icon: "🎮" },
  { id: "analytics", label: "Analytics", icon: "📈" },
  { id: "map", label: "Fleet Map", icon: "🗺️" },
  { id: "harvest", label: "Honey Yield", icon: "🍯" },
  { id: "tasks", label: "Field Tasks", icon: "📋" },
  { id: "alerts", label: "Alerts Log", icon: "🔔" },
  { id: "overview", label: "Architecture", icon: "✨" },
];

export const Navbar: React.FC<NavbarProps> = ({
  hub,
  lastUpdatedSeconds,
  activeTab,
  setActiveTab,
  unreadAlertsCount,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Branding & Hub Telemetry Row */}
        <div className="flex items-center justify-between h-16 border-b border-slate-100/80">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-xl shadow-sm shadow-amber-500/20">
              🐝
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-slate-900 tracking-tight">MadhuRaksha</span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/60">
                  मधुरक्षा
                </span>
                <span className="hidden sm:inline-flex text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  TRL 7 Prototype
                </span>
              </div>
              <p className="text-xs text-slate-600 hidden sm:block">
                Smart Beehive IoT Monitoring Studio &bull; 1 Hub : 3 Boxes
              </p>
            </div>
          </div>

          {/* Master IoT Box Status & Hub Badges */}
          <div className="flex items-center gap-2 sm:gap-3 text-xs">
            {/* Hub Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200/80 text-slate-700">
              <Cpu className="w-3.5 h-3.5 text-amber-600" />
              <span className="font-mono font-bold text-slate-800">{hub.hub_id}</span>
              <span className="flex items-center gap-1 font-medium text-emerald-600">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live
              </span>
            </div>

            {/* Battery */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200/80 text-slate-600">
              <BatteryCharging className="w-3.5 h-3.5 text-emerald-600" />
              <span className="font-semibold text-slate-800">{hub.battery_pct}%</span>
              <span className="text-slate-600">(Solar)</span>
            </div>

            {/* Cellular RSSI */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200/80 text-slate-600">
              <Radio className="w-3.5 h-3.5 text-sky-600" />
              <span className="font-semibold text-slate-800">{hub.gsm_rssi_dbm} dBm</span>
            </div>

            {/* Last updated ticker */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50/70 border border-amber-200/60 text-amber-800 font-medium">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>{lastUpdatedSeconds === 0 ? "Just now" : `${lastUpdatedSeconds}s ago`}</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <nav className="flex items-center gap-1 overflow-x-auto py-2.5 no-scrollbar">
          {NAV_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 whitespace-nowrap ${
                  isActive
                    ? "text-amber-900 bg-amber-100/80 shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.id === "alerts" && unreadAlertsCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-rose-500 text-white">
                    {unreadAlertsCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
