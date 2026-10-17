"use client";

import React, { useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { HistoricalDataPoint } from "@/types/hive";

interface AnalyticsChartsProps {
  data: HistoricalDataPoint[];
  boxName: string;
  onRangeChange: (hours: number) => void;
}

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({
  data,
  boxName,
  onRangeChange,
}) => {
  const [activeRange, setActiveRange] = useState<number>(24);

  const handleRangeClick = (hours: number) => {
    setActiveRange(hours);
    onRangeChange(hours);
  };

  const chartConfigs = [
    {
      title: "Brood Temperature",
      unit: "°C",
      dataKey: "temperature",
      color: "#ea580c",
      safeHint: "Target: 31.0°C – 35.5°C | Alert > 36.0°C",
      domain: [28, 40],
    },
    {
      title: "Relative Humidity",
      unit: "%",
      dataKey: "humidity",
      color: "#0284c7",
      safeHint: "Safe: 50% – 70% | Alert < 50% / > 70%",
      domain: [40, 80],
    },
    {
      title: "Hive Weight",
      unit: "kg",
      dataKey: "weight",
      color: "#059669",
      safeHint: "HX711 Load Cell | Foraging & Nectar accumulation",
      domain: ["auto", "auto"],
    },
    {
      title: "Acoustic Colony Sound",
      unit: "dB",
      dataKey: "sound",
      color: "#7c3aed",
      safeHint: "Normal: 50 – 65 dB | Alert on ±10 dB spike",
      domain: [45, 85],
    },
    {
      title: "CO₂ Concentration",
      unit: "ppm",
      dataKey: "co2",
      color: "#0891b2",
      safeHint: "Ventilation Monitor | Alert > 3000 ppm",
      domain: [1800, 3600],
    },
    {
      title: "Hive Tilt Angle",
      unit: "°",
      dataKey: "tilt",
      color: "#e11d48",
      safeHint: "MPU6050 Accelerometer | Alert > 10.0°",
      domain: [0, 20],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Filter Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Multi-Sensor Historical Analytics
          </h2>
          <p className="text-xs text-slate-600">
            Time-series telemetry for <strong className="text-amber-800">{boxName}</strong>
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
          {[1, 6, 24].map((hours) => (
            <button
              key={hours}
              onClick={() => handleRangeClick(hours)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                activeRange === hours
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {hours === 1 ? "1 Hour" : `${hours} Hours`}
            </button>
          ))}
        </div>
      </div>

      {/* 6 Grid of Clean Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {chartConfigs.map((cfg) => (
          <div
            key={cfg.dataKey}
            className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between"
          >
            <div className="mb-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-800">
                  {cfg.title}
                </span>
                <span className="text-xs font-mono font-bold text-slate-600">
                  {cfg.unit}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5">{cfg.safeHint}</p>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis
                    dataKey="time"
                    tick={{ fontSize: 10, fill: "#94a3b8" }}
                    axisLine={{ stroke: "#e2e8f0" }}
                    tickLine={false}
                  />
                  <YAxis
                    domain={cfg.domain as [number, number]}
                    tick={{ fontSize: 10, fill: "#94a3b8" }}
                    axisLine={{ stroke: "#e2e8f0" }}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      borderRadius: "12px",
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
                      fontSize: "12px",
                      fontWeight: 600,
                    }}
                    labelStyle={{ color: "#64748b" }}
                  />
                  <Line
                    type="monotone"
                    dataKey={cfg.dataKey}
                    stroke={cfg.color}
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 5, strokeWidth: 0, fill: cfg.color }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
