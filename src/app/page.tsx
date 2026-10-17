"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MASTER_IOT_HUB,
  INITIAL_BOXES,
  INITIAL_ALERTS,
  simulateTick,
  generateHistoricalDataset,
} from "@/lib/data-sim";
import { HiveBox, HiveAlert, HistoricalDataPoint } from "@/types/hive";
import { Navbar } from "@/components/Navbar";
import { BoxSelector } from "@/components/BoxSelector";
import { SensorCard } from "@/components/SensorCard";
import { AudioStreamer } from "@/components/AudioStreamer";
import { DigitalTwin } from "@/components/DigitalTwin";
import { AnalyticsCharts } from "@/components/AnalyticsCharts";
import { AlertsTable } from "@/components/AlertsTable";
import { FleetMap } from "@/components/FleetMap";
import { HarvestTracker } from "@/components/HarvestTracker";
import { FieldTasks } from "@/components/FieldTasks";
import { ProjectOverview } from "@/components/ProjectOverview";
import { ControlsPanel } from "@/components/ControlsPanel";
import {
  Thermometer,
  Droplets,
  Scale,
  Volume2,
  Compass,
  HardDrive,
  AlertCircle,
  X,
} from "lucide-react";

export default function DashboardPage() {
  const [hub] = useState(MASTER_IOT_HUB);
  const [boxes, setBoxes] = useState<Record<string, HiveBox>>(INITIAL_BOXES);
  const [activeBoxId, setActiveBoxId] = useState<string>("BOX_01");
  const [activeTab, setActiveTab] = useState<string>("command");
  const [alerts, setAlerts] = useState<HiveAlert[]>(INITIAL_ALERTS);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [lastUpdatedSeconds, setLastUpdatedSeconds] = useState<number>(0);
  const [pendingAnomaly, setPendingAnomaly] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "info" | "warning" | "critical" } | null>(null);

  const activeBox = boxes[activeBoxId] || boxes["BOX_01"];

  // Historical chart data for the active box
  const [historicalData, setHistoricalData] = useState<HistoricalDataPoint[]>([]);

  useEffect(() => {
    setHistoricalData(generateHistoricalDataset(activeBox, 24, 20));
  }, [activeBoxId, activeBox]);

  // Show Toast Helper
  const showToast = (message: string, type: "info" | "warning" | "critical" = "info") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // 1-second elapsed time ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setLastUpdatedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 4-second Simulation loop
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setBoxes((prevBoxes) => {
        const { updatedBoxes, newAlert } = simulateTick(prevBoxes, activeBoxId, pendingAnomaly);

        if (newAlert) {
          setAlerts((prevAlerts) => [newAlert, ...prevAlerts.slice(0, 19)]);
          showToast(`🚨 ${newAlert.sensor}: ${newAlert.reading} (${newAlert.status})`, newAlert.severity.toLowerCase() as "critical" | "warning");
        }

        if (pendingAnomaly) {
          setPendingAnomaly(null);
        }

        return updatedBoxes;
      });

      setLastUpdatedSeconds(0);
    }, 4000);

    return () => clearInterval(interval);
  }, [isRunning, activeBoxId, pendingAnomaly]);

  // Handler for range toggle in charts
  const handleRangeChange = (hours: number) => {
    const count = hours === 1 ? 12 : hours === 6 ? 18 : 24;
    setHistoricalData(generateHistoricalDataset(activeBox, hours, count));
    showToast(`Showing past ${hours}h analytics for ${activeBox.box_name}`, "info");
  };

  // CSV Telemetry Export
  const handleExportCSV = () => {
    const headers = [
      "Timestamp",
      "Hub_ID",
      "Box_ID",
      "Box_Name",
      "Temperature_C",
      "Humidity_Pct",
      "Weight_Kg",
      "Sound_dB",
      "Tilt_Deg",
      "CO2_ppm",
    ];
    const rows = Object.values(boxes).map((b) => [
      new Date().toISOString(),
      hub.hub_id,
      b.box_id,
      b.box_name,
      b.temperature_c,
      b.humidity_percent,
      b.weight_kg,
      b.sound_db,
      b.tilt_deg,
      b.co2_ppm,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `MadhuRaksha_Hub01_3Boxes_Telemetry.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    showToast("Exported multi-box telemetry log to CSV", "info");
  };

  // Trigger test anomaly
  const handleTriggerAnomaly = (type: string) => {
    setPendingAnomaly(type);
    showToast(`Injected test event into ${activeBox.box_name}...`, "warning");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased font-sans">
      {/* Toast Notification Container */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            className={`fixed bottom-6 right-6 z-50 max-w-sm p-4 rounded-xl shadow-lg border text-xs font-semibold flex items-center justify-between gap-3 ${
              toast.type === "critical"
                ? "bg-rose-50 border-rose-300 text-rose-900 shadow-rose-500/10"
                : toast.type === "warning"
                ? "bg-amber-50 border-amber-300 text-amber-900 shadow-amber-500/10"
                : "bg-white border-slate-200 text-slate-800 shadow-slate-500/10"
            }`}
          >
            <div className="flex items-center gap-2">
              <AlertCircle className={`w-4 h-4 ${toast.type === "critical" ? "text-rose-600" : toast.type === "warning" ? "text-amber-600" : "text-sky-600"}`} />
              <span>{toast.message}</span>
            </div>
            <button onClick={() => setToast(null)} className="text-slate-600 hover:text-slate-900">
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Top Navigation */}
      <Navbar
        hub={hub}
        lastUpdatedSeconds={lastUpdatedSeconds}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        unreadAlertsCount={alerts.length}
      />

      {/* Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <AnimatePresence mode="wait">
          {activeTab === "command" && (
            <motion.div
              key="command"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Single, Clean Segmented Box Selector */}
              <BoxSelector
                boxes={boxes}
                activeBoxId={activeBoxId}
                onSelectBox={(id) => {
                  setActiveBoxId(id);
                  showToast(`Switched active view to ${boxes[id]?.box_name}`, "info");
                }}
              />

              {/* Live Colony Acoustic Mic Streamer & Oscilloscope */}
              <AudioStreamer
                soundDb={activeBox.sound_db}
                boxName={activeBox.box_name}
                onTriggerSwarmBuzz={() => handleTriggerAnomaly("sound")}
              />

              {/* The 5 Primary Sensor Cards + SD Card Status in Spacious Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {/* 1. Brood Temperature */}
                <SensorCard
                  title="Brood Temperature"
                  value={activeBox.temperature_c.toFixed(1)}
                  unit="°C"
                  icon={<Thermometer className="w-5 h-5" />}
                  iconBgColor="bg-amber-100 text-amber-700"
                  targetRange="Healthy Nest: 31.0°C – 35.5°C"
                  statusBadge={
                    activeBox.temperature_c > 36.0
                      ? { label: "Overheat (>36°C)", variant: "critical" }
                      : activeBox.temperature_c < 30.0
                      ? { label: "Chilling (<30°C)", variant: "warning" }
                      : { label: "Optimal Brood", variant: "normal" }
                  }
                  trend="+0.1°C"
                  subtitle="Core comb incubation stability"
                />

                {/* 2. Relative Humidity */}
                <SensorCard
                  title="Relative Humidity"
                  value={activeBox.humidity_percent.toFixed(1)}
                  unit="%"
                  icon={<Droplets className="w-5 h-5" />}
                  iconBgColor="bg-sky-100 text-sky-700"
                  targetRange="Safe Target: 50% – 70%"
                  statusBadge={
                    activeBox.humidity_percent > 70.0
                      ? { label: "Mold Risk (>70%)", variant: "warning" }
                      : activeBox.humidity_percent < 50.0
                      ? { label: "Desiccation (<50%)", variant: "warning" }
                      : { label: "Healthy Comb", variant: "normal" }
                  }
                  trend="-0.2%"
                  subtitle="Comb moisture & egg viability"
                />

                {/* 3. Hive Weight */}
                <SensorCard
                  title="Total Hive Weight"
                  value={activeBox.weight_kg.toFixed(2)}
                  unit="kg"
                  icon={<Scale className="w-5 h-5" />}
                  iconBgColor="bg-emerald-100 text-emerald-700"
                  targetRange="HX711 Load Cell Monitoring"
                  statusBadge={{ label: "Honey Inflow Active", variant: "normal" }}
                  trend="+0.02 kg"
                  subtitle="Nectar accumulation & foraging flux"
                />

                {/* 4. Colony Sound */}
                <SensorCard
                  title="Acoustic Colony Sound"
                  value={activeBox.sound_db}
                  unit="dB"
                  icon={<Volume2 className="w-5 h-5" />}
                  iconBgColor="bg-purple-100 text-purple-700"
                  targetRange="Normal Colony Hum: 50 – 65 dB"
                  statusBadge={
                    activeBox.sound_db >= 75
                      ? { label: "Swarm Agitation", variant: "critical" }
                      : { label: "Normal Worker Hum", variant: "normal" }
                  }
                  trend="0 dB"
                  subtitle="Wingbeat acoustic frequency sensor"
                />

                {/* 5. Tilt Angle */}
                <SensorCard
                  title="Hive Tilt Angle"
                  value={activeBox.tilt_deg.toFixed(1)}
                  unit="°"
                  icon={<Compass className="w-5 h-5" />}
                  iconBgColor="bg-rose-100 text-rose-700"
                  targetRange="MPU6050 Accelerometer / Gyro"
                  statusBadge={
                    activeBox.tilt_deg > 10.0
                      ? { label: "Knocked Over (>10°)", variant: "critical" }
                      : { label: "Level & Stable", variant: "normal" }
                  }
                  trend="0.0°"
                  subtitle="Physical foundation security"
                />

                {/* 6. MicroSD Data Logger */}
                <SensorCard
                  title="SD Card Data Logger"
                  value="UNAVAILABLE"
                  icon={<HardDrive className="w-5 h-5" />}
                  iconBgColor="bg-slate-100 text-slate-500"
                  targetRange="Offline SPI Flash Buffer"
                  statusBadge={{ label: "Pending Firmware", variant: "neutral" }}
                  subtitle="Offline packets will sync automatically once MicroPython SPI driver is active."
                />
              </div>

              {/* 2D Digital Twin Section */}
              <DigitalTwin box={activeBox} />

              {/* Simulation Test Controls (Kept tidy at bottom) */}
              <ControlsPanel
                isRunning={isRunning}
                onToggleSim={() => {
                  setIsRunning((prev) => !prev);
                  showToast(isRunning ? "Simulation paused" : "Simulation resumed", "info");
                }}
                onTriggerAnomaly={handleTriggerAnomaly}
                onExportCSV={handleExportCSV}
                boxName={activeBox.box_name}
              />
            </motion.div>
          )}

          {activeTab === "analytics" && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <AnalyticsCharts
                data={historicalData}
                boxName={activeBox.box_name}
                onRangeChange={handleRangeChange}
              />
            </motion.div>
          )}

          {activeTab === "map" && (
            <motion.div
              key="map"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <FleetMap />
            </motion.div>
          )}

          {activeTab === "harvest" && (
            <motion.div
              key="harvest"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <HarvestTracker />
            </motion.div>
          )}

          {activeTab === "tasks" && (
            <motion.div
              key="tasks"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <FieldTasks />
            </motion.div>
          )}

          {activeTab === "alerts" && (
            <motion.div
              key="alerts"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <AlertsTable
                alerts={alerts}
                onClearAlerts={() => {
                  setAlerts([]);
                  showToast("Alerts log cleared", "info");
                }}
              />
            </motion.div>
          )}

          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <ProjectOverview />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Clean Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-6 mt-16 text-center text-xs text-slate-600">
        <p className="max-w-xl mx-auto">
          <strong>MadhuRaksha (मधुरक्षा)</strong> &bull; Smart Beehive IoT Command Studio<br />
          1 Master IoT Hub multiplexing 3 identical standard beehive boxes (~1m apart) in Karnataka
        </p>
      </footer>
    </div>
  );
}
