"use client";

import React, { useState } from "react";
import { HiveAlert } from "@/types/hive";
import { Trash2, CheckCircle2 } from "lucide-react";

interface AlertsTableProps {
  alerts: HiveAlert[];
  onClearAlerts: () => void;
}

export const AlertsTable: React.FC<AlertsTableProps> = ({ alerts, onClearAlerts }) => {
  const [filter, setFilter] = useState<string>("ALL");

  const filtered = alerts.filter((a) => {
    if (filter === "ALL") return true;
    return a.severity === filter;
  });

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case "CRITICAL":
        return "bg-rose-100 text-rose-800 border-rose-200/80";
      case "WARNING":
        return "bg-amber-100 text-amber-800 border-amber-200/80";
      default:
        return "bg-sky-100 text-sky-800 border-sky-200/80";
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Threshold Alerts &amp; SMS Dispatch History
            </h2>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {alerts.length} Records
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            Real-time threshold breaches &bull; Automated SIM800L GSM dispatches
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Severity Filter */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl text-xs font-semibold">
            {["ALL", "CRITICAL", "WARNING"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  filter === f
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Clear Button */}
          {alerts.length > 0 && (
            <button
              onClick={onClearAlerts}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200/80 flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/80 text-slate-600 uppercase tracking-wider font-bold border-b border-slate-100">
            <tr>
              <th className="py-3 px-5">Alert ID</th>
              <th className="py-3 px-4">Time</th>
              <th className="py-3 px-4">Target Box</th>
              <th className="py-3 px-4">Sensor Trigger</th>
              <th className="py-3 px-4">Reading</th>
              <th className="py-3 px-4">Threshold</th>
              <th className="py-3 px-4">Severity</th>
              <th className="py-3 px-5">Dispatch Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-600">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                  <p className="font-semibold text-slate-800">No threshold alerts recorded</p>
                  <p className="text-[11px] mt-0.5">All 3 hive boxes are within normal physiological bounds.</p>
                </td>
              </tr>
            ) : (
              filtered.map((alert) => (
                <tr key={alert.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-5 font-mono font-bold text-slate-900">{alert.id}</td>
                  <td className="py-3.5 px-4 text-slate-600">{alert.time}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-800">{alert.box_id}</td>
                  <td className="py-3.5 px-4 font-medium">{alert.sensor}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{alert.reading}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">{alert.threshold}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full font-bold text-[10px] border ${getSeverityBadge(
                        alert.severity
                      )}`}
                    >
                      {alert.severity}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-slate-600">
                    <span className="font-medium bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                      📱 {alert.action}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
