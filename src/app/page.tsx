"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MASTER_IOT_HUB, INITIAL_BOXES, simulateTick } from "@/lib/data-sim";
import { HiveBox, HiveAlert } from "@/types/hive";
import { HiveAudioStreamer } from "@/lib/audio";
import {
  Thermometer,
  Droplets,
  Scale,
  Compass,
  Mic,
  BatteryCharging,
  MapPin,
  Cpu,
  Layers,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Flame,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Database,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function PrototypeDisplayPage() {
  const [hub, setHub] = useState(MASTER_IOT_HUB);
  const [boxes, setBoxes] = useState<Record<string, HiveBox>>(INITIAL_BOXES);
  const [activeBoxId, setActiveBoxId] = useState<string>("BOX_01");
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<number>(0);
  const [pendingAnomaly, setPendingAnomaly] = useState<string | null>(null);
  const [activeAlert, setActiveAlert] = useState<HiveAlert | null>(null);
  const [dataSource, setDataSource] = useState<"supabase" | "simulator">("supabase");
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(false);

  // Audio mic streaming state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioStreamerRef = useRef<HiveAudioStreamer | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [audioVolume, setAudioVolume] = useState<number>(0.5);
  const [audioFreq, setAudioFreq] = useState<number>(220);

  const activeBox = boxes[activeBoxId] || boxes["BOX_01"];

  // Initialize Audio
  useEffect(() => {
    audioStreamerRef.current = new HiveAudioStreamer();
    return () => {
      audioStreamerRef.current?.stopBuzz();
    };
  }, []);

  // Update audio frequency if actively playing
  useEffect(() => {
    if (audioStreamerRef.current?.isPlaying) {
      audioStreamerRef.current.updateLiveSound(activeBox.sound_db);
      const freq = Math.round(audioStreamerRef.current.calculateFrequencyFromDb(activeBox.sound_db));
      setAudioFreq(freq);
    }
  }, [activeBox.sound_db]);

  const toggleAudio = () => {
    if (!audioStreamerRef.current) return;

    if (isAudioPlaying) {
      audioStreamerRef.current.stopBuzz();
      setIsAudioPlaying(false);
    } else {
      const freq = audioStreamerRef.current.startBuzz(activeBox.sound_db, canvasRef.current);
      setAudioFreq(Math.round(freq));
      setIsAudioPlaying(true);
    }
  };

  // 1-second ticker for elapsed time
  useEffect(() => {
    const timer = setInterval(() => {
      setLastUpdated((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Supabase Cloud Realtime synchronization hook
  useEffect(() => {
    const client = supabase;
    if (!client) return;

    // 1. Initial Fetch of Live State from Supabase Cloud
    const fetchLiveState = async () => {
      try {
        const { data: hubData } = await client
          .from("iot_hubs")
          .select("*")
          .eq("hub_id", "IOT_BOX_01")
          .single();

        if (hubData) {
          setHub({
            hub_id: hubData.hub_id,
            hub_name: hubData.name,
            location: hubData.location,
            battery_cell_pct: Number(hubData.battery_cell_pct),
            battery_voltage: Number(hubData.battery_voltage),
            battery_status: hubData.battery_status,
          });
        }

        const { data: boxesData } = await client.from("hive_boxes").select("*");
        if (boxesData && boxesData.length > 0) {
          setBoxes((prev) => {
            const next = { ...prev };
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            boxesData.forEach((row: any) => {
              if (next[row.box_id]) {
                next[row.box_id] = {
                  ...next[row.box_id],
                  temperature_c: Number(row.temperature_c),
                  humidity_percent: Number(row.humidity_percent),
                  brood_load_corner1_kg: Number(row.brood_load_corner1_kg),
                  brood_load_corner2_kg: Number(row.brood_load_corner2_kg),
                  brood_total_kg: Number(row.brood_total_kg),
                  honey_load_corner1_kg: Number(row.honey_load_corner1_kg),
                  honey_load_corner2_kg: Number(row.honey_load_corner2_kg),
                  honey_total_kg: Number(row.honey_total_kg),
                  total_hive_weight_kg: Number(row.total_hive_weight_kg),
                  gyro: {
                    pitch_x: Number(row.pitch_x || 0),
                    roll_y: Number(row.roll_y || 0),
                    yaw_z: Number(row.yaw_z || 0),
                    tilt_deg: Number(row.tilt_deg || 0),
                    status: (row.gyro_status as "Level & Stable" | "Tilted / Disturbed") || "Level & Stable",
                  },
                  sound_db: Number(row.sound_db),
                  status: (row.status as "HEALTHY" | "WARNING" | "CRITICAL") || "HEALTHY",
                };
              }
            });
            return next;
          });
          setIsSupabaseConnected(true);
        }
      } catch (e) {
        console.warn("Supabase fetch fallback:", e);
      }
    };

    fetchLiveState();

    // 2. Realtime Subscription on PostgreSQL Changes
    const channel = client
      .channel("hive-realtime-stream")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "hive_boxes" },
        (payload) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const row = payload.new as any;
          setBoxes((prev) => {
            if (!prev[row.box_id]) return prev;
            return {
              ...prev,
              [row.box_id]: {
                ...prev[row.box_id],
                temperature_c: Number(row.temperature_c),
                humidity_percent: Number(row.humidity_percent),
                brood_load_corner1_kg: Number(row.brood_load_corner1_kg),
                brood_load_corner2_kg: Number(row.brood_load_corner2_kg),
                brood_total_kg: Number(row.brood_total_kg),
                honey_load_corner1_kg: Number(row.honey_load_corner1_kg),
                honey_load_corner2_kg: Number(row.honey_load_corner2_kg),
                honey_total_kg: Number(row.honey_total_kg),
                total_hive_weight_kg: Number(row.total_hive_weight_kg),
                gyro: {
                  pitch_x: Number(row.pitch_x || 0),
                  roll_y: Number(row.roll_y || 0),
                  yaw_z: Number(row.yaw_z || 0),
                  tilt_deg: Number(row.tilt_deg || 0),
                  status: (row.gyro_status as "Level & Stable" | "Tilted / Disturbed") || "Level & Stable",
                },
                sound_db: Number(row.sound_db),
                status: (row.status as "HEALTHY" | "WARNING" | "CRITICAL") || "HEALTHY",
              },
            };
          });
          setLastUpdated(0);
          setIsSupabaseConnected(true);
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "iot_hubs" },
        (payload) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const row = payload.new as any;
          setHub({
            hub_id: row.hub_id,
            hub_name: row.name,
            location: row.location,
            battery_cell_pct: Number(row.battery_cell_pct),
            battery_voltage: Number(row.battery_voltage),
            battery_status: row.battery_status,
          });
          setLastUpdated(0);
          setIsSupabaseConnected(true);
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          setIsSupabaseConnected(true);
        }
      });

    return () => {
      client.removeChannel(channel);
    };
  }, []);

  // 4-second Simulation loop (active when in simulator mode or anomaly is injected)
  useEffect(() => {
    if (!isRunning || (dataSource === "supabase" && isSupabaseConnected && !pendingAnomaly)) return;

    const interval = setInterval(() => {
      setBoxes((prev) => {
        const { updatedBoxes, newAlert } = simulateTick(prev, activeBoxId, pendingAnomaly);
        if (newAlert) {
          setActiveAlert(newAlert);
        }
        if (pendingAnomaly) {
          setPendingAnomaly(null);
        }
        return updatedBoxes;
      });
      setLastUpdated(0);
    }, 4000);

    return () => clearInterval(interval);
  }, [isRunning, activeBoxId, pendingAnomaly, dataSource, isSupabaseConnected]);

  const boxKeys = ["BOX_01", "BOX_02", "BOX_03"];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased pb-16">
      
      {/* ========================================================
          1. TOP BAR: LOCATION FILTER + IOT BOX + BATTERY CELL
          ======================================================== */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          {/* Brand + First Filter: 1 IoT Box in 1 Location */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-xl shadow-xs shadow-amber-500/20">
              🐝
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight">
                  MadhuRaksha
                </span>
                {isSupabaseConnected ? (
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5 shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping inline-block" />
                    Supabase Live
                  </span>
                ) : (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                    <Database className="w-3 h-3 text-amber-600" />
                    Connecting Cloud...
                  </span>
                )}
              </div>
              
              {/* Filter Tab: One Location -> Master IoT Box */}
              <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span className="font-semibold text-slate-800">Location 1 (Mandya Apiary)</span>
                <span>&bull;</span>
                <Cpu className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="font-mono font-bold text-slate-700">IoT Box #1</span>
                <span>(3 linked hives)</span>
              </div>
            </div>
          </div>

          {/* Battery Percentage Display of the Cell */}
          <div className="flex items-center gap-3 self-end sm:self-auto">
            {/* Battery Cell Card */}
            <div className="flex items-center gap-3 px-3.5 py-1.5 rounded-xl bg-emerald-50/80 border border-emerald-200/90 text-emerald-950">
              <div className="relative">
                <BatteryCharging className="w-5 h-5 text-emerald-600 animate-pulse" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-emerald-800">Battery Cell</span>
                  <span className="text-sm font-extrabold font-mono text-emerald-950">
                    {hub.battery_cell_pct}%
                  </span>
                </div>
                <div className="text-[10px] text-emerald-700 font-medium">
                  {hub.battery_voltage}V &bull; Li-Ion Solar Cell
                </div>
              </div>
            </div>

            {/* Live Ticker */}
            <div className="text-[11px] text-slate-600 font-mono bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200/80 hidden md:block">
              {lastUpdated === 0 ? "Tick: now" : `Tick: ${lastUpdated}s ago`}
            </div>
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 space-y-6">

        {/* Anomaly Alert Notification Banner */}
        <AnimatePresence>
          {activeAlert && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`p-4 rounded-xl border flex items-center justify-between gap-3 shadow-2xs ${
                activeAlert.severity === "CRITICAL"
                  ? "bg-rose-50 border-rose-200 text-rose-900"
                  : "bg-amber-50 border-amber-200 text-amber-900"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                <div className="text-xs">
                  <span className="font-bold">{activeAlert.box_id}:</span> {activeAlert.sensor} anomaly detected ({activeAlert.reading}).
                </div>
              </div>
              <button
                onClick={() => setActiveAlert(null)}
                className="px-2.5 py-1 text-xs font-bold rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 flex items-center gap-1 shadow-2xs transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Dismiss
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ========================================================
            2. THE 3 BOXES TABS SWITCHER
            ======================================================== */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-600" />
              <h2 className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                Select Beehive Box
              </h2>
            </div>
            <span className="text-xs text-slate-600">
              Click a box to inspect its live sensors
            </span>
          </div>

          {/* 3 Box Tabs */}
          <div className="grid grid-cols-3 gap-2.5 p-1.5 bg-slate-100/90 rounded-xl">
            {boxKeys.map((key, idx) => {
              const b = boxes[key];
              const isSelected = activeBoxId === key;

              return (
                <button
                  key={key}
                  onClick={() => {
                    setActiveBoxId(key);
                    if (isAudioPlaying && audioStreamerRef.current) {
                      audioStreamerRef.current.updateLiveSound(b.sound_db);
                    }
                  }}
                  className="relative p-3 rounded-lg text-left transition-all focus:outline-none"
                >
                  {isSelected && (
                    <motion.div
                      layoutId="activePrototypeBoxPill"
                      className="absolute inset-0 bg-white rounded-lg shadow-sm border border-slate-200"
                      transition={{ type: "spring", stiffness: 450, damping: 35 }}
                    />
                  )}

                  <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold ${
                        isSelected ? "bg-amber-500 text-white" : "bg-slate-200 text-slate-600"
                      }`}>
                        {idx + 1}
                      </span>
                      <span className={`text-sm font-bold ${isSelected ? "text-slate-900" : "text-slate-700"}`}>
                        {b.box_name}
                      </span>
                    </div>

                    <div className="text-right text-xs font-mono font-bold text-slate-600 hidden sm:block">
                      {b.temperature_c.toFixed(1)}°C &bull; {b.total_hive_weight_kg.toFixed(1)}kg
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Box Banner */}
        <div className="flex items-center justify-between px-2 text-xs text-slate-600">
          <div>
            Showing live parameters for: <strong className="text-amber-700 text-sm">{activeBox.box_name}</strong>
          </div>
          <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
            activeBox.status === "CRITICAL"
              ? "bg-rose-100 text-rose-800 border border-rose-200"
              : "bg-emerald-100 text-emerald-800 border border-emerald-200"
          }`}>
            {activeBox.status === "CRITICAL" ? "Alert Detected" : "Normal Hive State"}
          </span>
        </div>

        {/* ========================================================
            3. PARAMETERS DISPLAY GRID (EXACT AGENDA LIST)
            ======================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* ------------------------------------------------------
              PARAMETER 1: COMBINED TEMPERATURE & HUMIDITY SENSOR
              ------------------------------------------------------ */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Parameter 1 &bull; Climate Sensor
                </span>
                <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
                  <Thermometer className="w-5 h-5" />
                </div>
              </div>

              <h3 className="text-base font-bold text-slate-900">
                Temperature &amp; Humidity (Combined Sensor)
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Single digital probe monitoring core brood incubation climate
              </p>
            </div>

            {/* Values Side-by-Side */}
            <div className="grid grid-cols-2 gap-4 my-6 p-4 rounded-xl bg-slate-50 border border-slate-100">
              {/* Temperature */}
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 mb-1">
                  <Thermometer className="w-4 h-4 text-amber-600" />
                  <span>Brood Temp</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold font-mono text-slate-900">
                    {activeBox.temperature_c.toFixed(1)}
                  </span>
                  <span className="text-sm font-bold text-slate-600">°C</span>
                </div>
                <div className="text-[11px] text-slate-600 mt-1">
                  Target: 31.0°C – 35.5°C
                </div>
              </div>

              {/* Humidity */}
              <div className="border-l border-slate-200/80 pl-4">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 mb-1">
                  <Droplets className="w-4 h-4 text-sky-600" />
                  <span>Relative Humidity</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold font-mono text-slate-900">
                    {activeBox.humidity_percent.toFixed(1)}
                  </span>
                  <span className="text-sm font-bold text-slate-600">%</span>
                </div>
                <div className="text-[11px] text-slate-600 mt-1">
                  Safe: 50% – 70%
                </div>
              </div>
            </div>

            {/* Bottom Status */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-600">Sensor Health:</span>
              <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Incubation Optimal
              </span>
            </div>
          </div>


          {/* ------------------------------------------------------
              PARAMETER 2: LOAD SENSORS (BROOD & HONEY SEPARATELY)
              ------------------------------------------------------ */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Parameter 2 &bull; Weight Loads
                </span>
                <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                  <Scale className="w-5 h-5" />
                </div>
              </div>

              <h3 className="text-base font-bold text-slate-900">
                Load Cells (2 Corners Brood + 2 Corners Honey Box)
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Load cells at two corners of each frame section give separate summed weights
              </p>
            </div>

            {/* Compartment Load Cards */}
            <div className="space-y-3 my-4">
              
              {/* Honey Box (Top Super) */}
              <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-extrabold text-amber-900">
                    🍯 Honey Box (Top Chamber)
                  </span>
                  <span className="font-bold font-mono text-amber-900 text-sm">
                    {activeBox.honey_total_kg.toFixed(2)} kg
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-amber-800 bg-white/70 p-2 rounded-lg border border-amber-200/50">
                  <div>
                    <span className="text-slate-600 block">Corner 1:</span>
                    <strong className="font-mono">{activeBox.honey_load_corner1_kg.toFixed(2)} kg</strong>
                  </div>
                  <div>
                    <span className="text-slate-600 block">Corner 2:</span>
                    <strong className="font-mono">{activeBox.honey_load_corner2_kg.toFixed(2)} kg</strong>
                  </div>
                </div>
              </div>

              {/* Brood Box (Bottom Chamber) */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-extrabold text-slate-800">
                    🐝 Brood Box (Bottom Chamber)
                  </span>
                  <span className="font-bold font-mono text-slate-900 text-sm">
                    {activeBox.brood_total_kg.toFixed(2)} kg
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-700 bg-white p-2 rounded-lg border border-slate-200/60">
                  <div>
                    <span className="text-slate-600 block">Corner 1:</span>
                    <strong className="font-mono">{activeBox.brood_load_corner1_kg.toFixed(2)} kg</strong>
                  </div>
                  <div>
                    <span className="text-slate-600 block">Corner 2:</span>
                    <strong className="font-mono">{activeBox.brood_load_corner2_kg.toFixed(2)} kg</strong>
                  </div>
                </div>
              </div>

            </div>

            {/* Total Combined Weight */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-600">Total Combined Hive Weight:</span>
              <span className="font-extrabold font-mono text-sm text-slate-900">
                {activeBox.total_hive_weight_kg.toFixed(2)} kg
              </span>
            </div>
          </div>


          {/* ------------------------------------------------------
              PARAMETER 3: GYROSCOPE DISPLAY (MPU6050)
              ------------------------------------------------------ */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Parameter 3 &bull; Inertial Tilt
                </span>
                <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700">
                  <Compass className="w-5 h-5" />
                </div>
              </div>

              <h3 className="text-base font-bold text-slate-900">
                Gyroscope &amp; Accelerometer (MPU6050)
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Physical stability, balance, and knockover detection
              </p>
            </div>

            {/* Gyro Readings Card */}
            <div className="my-5 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-700">Combined Tilt Angle</span>
                <div className="flex items-baseline gap-1">
                  <span className={`text-3xl font-extrabold font-mono ${
                    activeBox.gyro.tilt_deg > 10.0 ? "text-rose-600" : "text-slate-900"
                  }`}>
                    {activeBox.gyro.tilt_deg.toFixed(1)}
                  </span>
                  <span className="text-sm font-bold text-slate-600">°</span>
                </div>
              </div>

              {/* 3 Axes Details */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs pt-3 border-t border-slate-200/60">
                <div>
                  <span className="text-[11px] text-slate-600 block">Pitch (X)</span>
                  <span className="font-mono font-bold text-slate-800">
                    {activeBox.gyro.pitch_x > 0 ? `+${activeBox.gyro.pitch_x}` : activeBox.gyro.pitch_x}°
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-600 block">Roll (Y)</span>
                  <span className="font-mono font-bold text-slate-800">
                    {activeBox.gyro.roll_y > 0 ? `+${activeBox.gyro.roll_y}` : activeBox.gyro.roll_y}°
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-600 block">Yaw (Z)</span>
                  <span className="font-mono font-bold text-slate-800">
                    {activeBox.gyro.yaw_z}°
                  </span>
                </div>
              </div>
            </div>

            {/* Stability Status Pill */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-600">Hive Orientation:</span>
              <span className={`font-bold px-2.5 py-0.5 rounded-full border text-[11px] ${
                activeBox.gyro.tilt_deg > 10.0
                  ? "bg-rose-100 text-rose-800 border-rose-300"
                  : "bg-emerald-50 text-emerald-800 border-emerald-200"
              }`}>
                {activeBox.gyro.status}
              </span>
            </div>
          </div>


          {/* ------------------------------------------------------
              PARAMETER 4: MICROPHONE (SOUND SENSOR)
              ------------------------------------------------------ */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Parameter 4 &bull; Acoustics
                </span>
                <div className="w-9 h-9 rounded-xl bg-rose-100 flex items-center justify-center text-rose-700">
                  <Mic className="w-5 h-5" />
                </div>
              </div>

              <h3 className="text-base font-bold text-slate-900">
                Microphone (Colony Acoustic Sound)
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Internal audio microphone with live buzzing synthesizer
              </p>
            </div>

            {/* Sound Decibel & Oscilloscope */}
            <div className="my-4 space-y-3">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <div>
                  <span className="text-xs text-slate-600 font-semibold block">Acoustic Sound Level</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-3xl font-extrabold font-mono text-slate-900">
                      {activeBox.sound_db}
                    </span>
                    <span className="text-sm font-bold text-slate-600">dB</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                    activeBox.sound_db >= 75
                      ? "bg-rose-100 text-rose-800 border-rose-300"
                      : "bg-amber-100 text-amber-800 border-amber-300"
                  }`}>
                    {activeBox.sound_db >= 75 ? "Swarming / Loud" : "Normal Colony Hum"}
                  </span>
                  <div className="text-[11px] text-slate-600 mt-1 font-mono">
                    {isAudioPlaying ? `~${audioFreq} Hz Tone` : "Audio stream idle"}
                  </div>
                </div>
              </div>

              {/* Real-time Oscilloscope Canvas */}
              <div className="h-14 bg-white rounded-xl border border-slate-200 shadow-inner overflow-hidden flex items-center justify-center">
                <canvas ref={canvasRef} width={400} height={56} className="w-full h-full block" />
              </div>
            </div>

            {/* Audio Controls */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3 text-xs">
              <button
                onClick={toggleAudio}
                className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all shadow-xs ${
                  isAudioPlaying
                    ? "bg-rose-600 hover:bg-rose-700 text-white"
                    : "bg-amber-500 hover:bg-amber-600 text-white"
                }`}
              >
                {isAudioPlaying ? (
                  <>
                    <VolumeX className="w-4 h-4" />
                    <span>Stop Mic Buzz</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4" />
                    <span>🔊 Listen Live Buzz</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-600">Vol:</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={audioVolume}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value);
                    setAudioVolume(v);
                    audioStreamerRef.current?.setVolume(v);
                  }}
                  className="w-16 h-1.5 bg-slate-200 rounded appearance-none cursor-pointer accent-amber-600"
                />
              </div>
            </div>
          </div>

        </div>

        {/* ========================================================
            4. LIVE TEST CONTROLS (QUICK DEMONSTRATION TOOLBAR)
            ======================================================== */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <span>Test Sensor Anomalies on {activeBox.box_name}:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Stream Mode Toggle */}
            <button
              onClick={() => setDataSource(dataSource === "supabase" ? "simulator" : "supabase")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border flex items-center gap-1.5 transition-colors ${
                dataSource === "supabase"
                  ? "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
                  : "bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100"
              }`}
              title="Toggle between live Supabase cloud stream and demo simulation"
            >
              <Database className="w-3.5 h-3.5" />
              <span>{dataSource === "supabase" ? "Source: Supabase Cloud" : "Source: Local Sim"}</span>
            </button>

            {/* Play/Pause */}
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center gap-1.5"
            >
              {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isRunning ? "Pause Stream" : "Resume Stream"}</span>
            </button>

            {/* Test Overheat */}
            <button
              onClick={() => setPendingAnomaly("overheat")}
              className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1"
            >
              <Flame className="w-3.5 h-3.5 text-rose-600" />
              <span>Test Overheat (&gt;36°C)</span>
            </button>

            {/* Test Tilt */}
            <button
              onClick={() => setPendingAnomaly("tilt")}
              className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 flex items-center gap-1"
            >
              <Compass className="w-3.5 h-3.5 text-purple-600" />
              <span>Test Tilt Knockover (&gt;10°)</span>
            </button>

            {/* Test Sound */}
            <button
              onClick={() => setPendingAnomaly("sound")}
              className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1"
            >
              <Volume2 className="w-3.5 h-3.5 text-amber-600" />
              <span>Test Swarm Buzz</span>
            </button>

            {/* Reset */}
            <button
              onClick={() => {
                setPendingAnomaly(null);
                setActiveAlert(null);
              }}
              className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

      </main>

      {/* Clean Bottom Footer */}
      <footer className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 text-center text-xs text-slate-600">
        <p>
          <strong>MadhuRaksha (मधुरक्षा)</strong> &bull; Prototype Display Screen for Today&apos;s Demo<br />
          Location 1 &bull; 1 Master IoT Box &bull; 3 Standard Beehive Boxes
        </p>
      </footer>

    </div>
  );
}
