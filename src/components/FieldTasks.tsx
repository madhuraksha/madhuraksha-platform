"use client";

import React from "react";
import { Calendar, Users, Wrench } from "lucide-react";

export const FieldTasks: React.FC = () => {
  const tasks = [
    {
      id: "TSK-01",
      title: "Hive Box 1 Brood Chamber Audit",
      desc: "Mandya Apiary · Clean bottom board, inspect solid concentric comb pattern, verify adequate ventilation.",
      status: "COMPLETED",
      due: "Yesterday",
    },
    {
      id: "TSK-02",
      title: "Hive Box 2 Frame Inspection",
      desc: "Mandya Apiary · Hive weight reached 32.5 kg. Inspect nectar capping in upper frames.",
      status: "DUE_SOON",
      due: "Due in 2 days",
    },
    {
      id: "TSK-03",
      title: "Hive Box 3 Flight Activity Check",
      desc: "Mandya Apiary · Sound baseline at 67 dB. Check entrance traffic and optical gate sensor alignment.",
      status: "SCHEDULED",
      due: "Next week",
    },
    {
      id: "TSK-04",
      title: "Master IoT Hub Solar Panel Cleaning",
      desc: "Wipe down solar panel surface and check SIM800L antenna tight fitting.",
      status: "SCHEDULED",
      due: "Preventive",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 tracking-tight">
          Field Tasks &amp; Apiary Inspections
        </h2>
        <p className="text-xs text-slate-600 mt-0.5">
          Non-invasive digital inspection schedule &bull; Madhu Sakhi Community Beekeeping
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task List */}
        <div className="lg:col-span-2 space-y-3">
          {tasks.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-start justify-between gap-4"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0 mt-0.5">
                  <Wrench className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{t.title}</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{t.desc}</p>
                  <div className="flex items-center gap-2 mt-2.5 text-[11px] text-slate-600 font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{t.due}</span>
                  </div>
                </div>
              </div>

              <span
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full shrink-0 border ${
                  t.status === "COMPLETED"
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                    : t.status === "DUE_SOON"
                    ? "bg-amber-50 text-amber-800 border-amber-200"
                    : "bg-slate-100 text-slate-700 border-slate-200"
                }`}
              >
                {t.status === "COMPLETED" ? "Completed" : t.status === "DUE_SOON" ? "Due in 2 days" : "Scheduled"}
              </span>
            </div>
          ))}
        </div>

        {/* Community Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-amber-700">
            <Users className="w-5 h-5" />
            <h3 className="text-sm font-bold text-slate-900">Madhu Sakhi Field Network</h3>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Empowering women beekeepers (Madhu Sakhis) across Karnataka with remote digital telemetry,
            reducing invasive hive openings while maximizing colony survival and honey harvest.
          </p>

          <div className="pt-3 border-t border-slate-100 space-y-2.5 text-xs">
            <div className="flex justify-between py-1">
              <span className="text-slate-600">Hub Architecture:</span>
              <span className="font-bold text-amber-800">1 IoT Hub : 3 Boxes</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-600">Hive Specification:</span>
              <span className="font-bold text-slate-800">BIS 10-Frame Langstroth</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-600">Box Spacing:</span>
              <span className="font-bold text-emerald-700">~1.0 Meter Apart</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-600">Next Scheduled Audit:</span>
              <span className="font-bold text-slate-800">October 24, 2026</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
