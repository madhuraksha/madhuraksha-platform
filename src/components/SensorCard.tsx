"use client";

import React from "react";
import { motion } from "framer-motion";

interface SensorCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: React.ReactNode;
  iconBgColor?: string;
  targetRange: string;
  statusBadge: {
    label: string;
    variant: "normal" | "warning" | "critical" | "neutral";
  };
  trend?: string;
  subtitle?: string;
}

export const SensorCard: React.FC<SensorCardProps> = ({
  title,
  value,
  unit,
  icon,
  iconBgColor = "bg-amber-100 text-amber-700",
  targetRange,
  statusBadge,
  trend,
  subtitle,
}) => {
  const getBadgeStyle = (variant: string) => {
    switch (variant) {
      case "normal":
        return "bg-emerald-50 text-emerald-800 border-emerald-200/80";
      case "warning":
        return "bg-amber-50 text-amber-800 border-amber-200/80";
      case "critical":
        return "bg-rose-50 text-rose-800 border-rose-200/80 animate-pulse";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <motion.div
      whileHover={{ y: -3, transition: { duration: 0.18 } }}
      className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow duration-200 flex flex-col justify-between"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
            {title}
          </span>
          <p className="text-[11px] text-slate-600 mt-0.5">{targetRange}</p>
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBgColor}`}>
          {icon}
        </div>
      </div>

      {/* Main Metric Value */}
      <div className="my-2">
        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-mono">
            {value}
          </span>
          {unit && <span className="text-sm font-bold text-slate-600">{unit}</span>}
        </div>
        {subtitle && <p className="text-xs text-slate-600 mt-1 leading-snug">{subtitle}</p>}
      </div>

      {/* Footer Status Pill & Trend */}
      <div className="pt-3.5 mt-2 border-t border-slate-100 flex items-center justify-between text-xs">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-bold border text-[11px] ${getBadgeStyle(
            statusBadge.variant
          )}`}
        >
          {statusBadge.label}
        </span>
        {trend && (
          <span className="text-slate-600 font-mono font-medium">
            {trend}
          </span>
        )}
      </div>
    </motion.div>
  );
};
