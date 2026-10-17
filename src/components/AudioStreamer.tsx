"use client";

import React, { useEffect, useRef, useState } from "react";
import { HiveAudioStreamer } from "@/lib/audio";
import { Volume2, VolumeX, Mic, Activity, Zap } from "lucide-react";

interface AudioStreamerProps {
  soundDb: number;
  boxName: string;
  onTriggerSwarmBuzz: () => void;
}

export const AudioStreamer: React.FC<AudioStreamerProps> = ({
  soundDb,
  boxName,
  onTriggerSwarmBuzz,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioStreamerRef = useRef<HiveAudioStreamer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [currentFreq, setCurrentFreq] = useState(220);

  useEffect(() => {
    audioStreamerRef.current = new HiveAudioStreamer();
    return () => {
      audioStreamerRef.current?.stopBuzz();
    };
  }, []);

  // Update live frequency when soundDb changes while playing
  useEffect(() => {
    if (audioStreamerRef.current?.isPlaying) {
      audioStreamerRef.current.updateLiveSound(soundDb);
      const freq = Math.round(audioStreamerRef.current.calculateFrequencyFromDb(soundDb));
      setCurrentFreq(freq);
    }
  }, [soundDb]);

  const togglePlayback = () => {
    if (!audioStreamerRef.current) return;

    if (isPlaying) {
      audioStreamerRef.current.stopBuzz();
      setIsPlaying(false);
    } else {
      const freq = audioStreamerRef.current.startBuzz(soundDb, canvasRef.current);
      setCurrentFreq(Math.round(freq));
      setIsPlaying(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    audioStreamerRef.current?.setVolume(val);
  };

  const getActivityState = (db: number) => {
    if (db >= 75) return { label: "Swarming Agitation!", color: "text-rose-600 bg-rose-50 border-rose-200" };
    if (db >= 66) return { label: "Elevated Foraging", color: "text-amber-700 bg-amber-50 border-amber-200" };
    return { label: "Calm Worker Hum", color: "text-emerald-700 bg-emerald-50 border-emerald-200" };
  };

  const activity = getActivityState(soundDb);

  return (
    <div className="bg-gradient-to-br from-white to-amber-50/40 rounded-2xl p-5 sm:p-6 border border-amber-200/80 shadow-xs">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-5">
        {/* Left Column: Info */}
        <div className="w-full lg:w-72 shrink-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-100/90 text-rose-800 border border-rose-200/60">
              <Mic className="w-3 h-3 text-rose-600 animate-pulse" />
              Live Microphone
            </span>
            <span className="text-[11px] font-semibold text-slate-600">
              {isPlaying ? "● STREAMING" : "○ IDLE"}
            </span>
          </div>

          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Colony Acoustic Stream
          </h3>
          <p className="text-xs text-slate-600 mt-0.5">
            Listening from: <strong className="text-amber-800">{boxName}</strong>
          </p>

          <div className="mt-3 flex items-center gap-2">
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${activity.color}`}>
              {activity.label}
            </span>
            <span className="text-xs font-mono font-bold text-slate-700">{soundDb} dB</span>
          </div>
        </div>

        {/* Center: Live Waveform Oscilloscope Canvas */}
        <div className="w-full flex-1 flex flex-col items-center">
          <div className="w-full h-14 bg-white rounded-xl border border-slate-200 shadow-inner overflow-hidden flex items-center justify-center">
            <canvas
              ref={canvasRef}
              width={420}
              height={56}
              className="w-full h-full block"
            />
          </div>
          <div className="text-[11px] text-slate-600 font-medium mt-1.5 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-amber-600" />
            <span>
              Fundamental frequency:{" "}
              <strong className="text-slate-800 font-mono">
                {isPlaying ? `~${currentFreq} Hz` : "Offline (Click Listen to stream)"}
              </strong>
            </span>
          </div>
        </div>

        {/* Right: Audio Action Controls */}
        <div className="w-full lg:w-auto shrink-0 flex flex-wrap sm:flex-nowrap items-center justify-end gap-3">
          {/* Listen Button */}
          <button
            onClick={togglePlayback}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-sm ${
              isPlaying
                ? "bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20"
                : "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-amber-500/25"
            }`}
          >
            {isPlaying ? (
              <>
                <VolumeX className="w-4 h-4" />
                <span>Stop Audio</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4" />
                <span>Listen Live Buzz</span>
              </>
            )}
          </button>

          {/* Test Swarm Spike Button */}
          <button
            onClick={onTriggerSwarmBuzz}
            className="px-3.5 py-2.5 rounded-xl text-xs font-bold bg-white hover:bg-amber-50 text-amber-800 border border-amber-300 shadow-2xs flex items-center gap-1.5 transition-colors"
            title="Injects sudden swarm pitch spike (+19 dB)"
          >
            <Zap className="w-3.5 h-3.5 text-amber-600" />
            <span>Test Swarm (+19dB)</span>
          </button>

          {/* Volume Slider */}
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200/80">
            <Volume2 className="w-3.5 h-3.5 text-slate-600" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={handleVolumeChange}
              className="w-16 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
              title="Volume"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
