"use client";

import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Droplet, Award, Sparkles, CheckCircle2 } from "lucide-react";

export const HarvestTracker: React.FC = () => {
  const harvestData = [
    { month: "May", yieldKg: 18.5, targetKg: 20 },
    { month: "Jun", yieldKg: 24.0, targetKg: 25 },
    { month: "Jul", yieldKg: 29.2, targetKg: 30 },
    { month: "Aug", yieldKg: 34.8, targetKg: 35 },
    { month: "Sep", yieldKg: 36.0, targetKg: 40 },
    { month: "Oct", yieldKg: 41.5, targetKg: 50 },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 tracking-tight">
          Honey Yield &amp; Quality Analysis
        </h2>
        <p className="text-xs text-slate-600 mt-0.5">
          Production milestones across all 3 hive boxes &bull; Standard optical grading
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Monthly Honey Production (kg)</h3>
              <p className="text-xs text-slate-600">Actual harvest vs forecast target</p>
            </div>
            <span className="text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              Season Total: 184.0 kg
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={harvestData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={{ stroke: "#e2e8f0" }} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={{ stroke: "#e2e8f0" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                />
                <Bar dataKey="yieldKg" name="Actual Yield" fill="#d97706" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Quality Index Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-5">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Quality &amp; Moisture Index</h3>
            <p className="text-xs text-slate-600">Laboratory grade sensory audit</p>
          </div>

          {/* Progress to season goal */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-slate-600 font-medium">Target Progress</span>
              <span className="font-bold text-amber-800">184 / 200 kg (92%)</span>
            </div>
            <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full w-[92%]" />
            </div>
          </div>

          {/* Quality Attributes List */}
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 border border-slate-100">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                <Droplet className="w-4 h-4 text-sky-600" />
                Honey Moisture
              </span>
              <span className="font-mono font-bold text-emerald-700">18.2% (Grade A Floral)</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 border border-slate-100">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-600" />
                Sugar Brix Index
              </span>
              <span className="font-mono font-bold text-emerald-700">81.5° Brix</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 border border-slate-100">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-600" />
                Pollen Diversity
              </span>
              <span className="font-bold text-amber-800">High Multi-Floral</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 border border-slate-100">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Extraction Method
              </span>
              <span className="font-bold text-slate-800">Centrifugal Cold Extract</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
