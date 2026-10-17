"use client";

import React from "react";
import { Cpu, Cloud, ShieldCheck } from "lucide-react";

export const ProjectOverview: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-amber-500 to-amber-700 rounded-2xl p-6 sm:p-8 text-white shadow-sm">
        <span className="text-xs font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-white/20 backdrop-blur-md">
          MADHURAKSHA &bull; SMART HIVE ARCHITECTURE
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-3">
          Know Every Hive, Before It Needs You
        </h2>
        <p className="text-sm text-amber-100 max-w-2xl mt-2 leading-relaxed">
          1 Master IoT Hub multiplexes readings from 3 identical standard beehive boxes placed 1 meter apart,
          delivering real-time acoustic stream analysis, thermal modeling, and threshold alerts.
        </p>
      </div>

      {/* 3-Layer Architecture Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 mb-4">
              <Cpu className="w-5 h-5" />
            </div>
            <span className="text-xs font-extrabold text-amber-700 uppercase tracking-wider block mb-1">
              Layer 01 &bull; Edge Hardware
            </span>
            <h3 className="text-base font-bold text-slate-900 mb-2">Tri-Box Master IoT Hub</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              A single ESP32 microcontroller multiplexes analog and digital lines from 3 identical standard beehive boxes
              (temperature, humidity, HX711 load cells, microphones, and MPU6050 accelerometer), keeping per-hive deployment costs minimal.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center text-sky-700 mb-4">
              <Cloud className="w-5 h-5" />
            </div>
            <span className="text-xs font-extrabold text-sky-700 uppercase tracking-wider block mb-1">
              Layer 02 &bull; Cloud Broker
            </span>
            <h3 className="text-base font-bold text-slate-900 mb-2">AWS IoT Core &amp; Storage</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              MQTT over TLS with X.509 device certificates. Telemetry is parsed by AWS IoT Rules Engine,
              stored in Amazon Timestream/DynamoDB, and emergency alerts dispatch SMS through SIM800L / AWS SNS.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-wider block mb-1">
              Layer 03 &bull; Application
            </span>
            <h3 className="text-base font-bold text-slate-900 mb-2">Command Center &amp; Audio</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Full-stack Next.js web application with Web Audio API colony synthesizer, HTML5 canvas visualizer,
              dynamic thermal Digital Twin, and historical multi-sensor graphs.
            </p>
          </div>
        </div>
      </div>

      {/* Integration Roadmap Table */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-3">Hardware to Cloud Roadmap</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-bold border-b border-slate-100">
              <tr>
                <th className="py-2.5 px-4">Layer</th>
                <th className="py-2.5 px-4">Component</th>
                <th className="py-2.5 px-4">Current Status</th>
                <th className="py-2.5 px-4">Next Step</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="py-3 px-4 font-bold">Edge Microcontroller</td>
                <td className="py-3 px-4">ESP32 + Sensors (DHT, HX711, MPU6050, Mic)</td>
                <td className="py-3 px-4 text-amber-700 font-semibold">MicroPython Simulation</td>
                <td className="py-3 px-4">Wire physical sensor lines to GPIO/ADC</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold">Local Storage</td>
                <td className="py-3 px-4">MicroSD SPI Buffer Module</td>
                <td className="py-3 px-4 text-slate-600 font-semibold">Unavailable (Pending Firmware)</td>
                <td className="py-3 px-4">Implement SPI buffer writing in MicroPython</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold">Cellular Gateway</td>
                <td className="py-3 px-4">SIM800L GSM Module</td>
                <td className="py-3 px-4 text-emerald-700 font-semibold">Working AT SMS Logic</td>
                <td className="py-3 px-4">Enable GPRS TCP/IP socket connection</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold">Cloud Broker</td>
                <td className="py-3 px-4">AWS IoT Core MQTT over TLS</td>
                <td className="py-3 px-4 text-sky-700 font-semibold">Ready for Provisioning</td>
                <td className="py-3 px-4">Generate X.509 device certificate</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold">Web Frontend</td>
                <td className="py-3 px-4">Next.js App Router + Tailwind + Framer Motion</td>
                <td className="py-3 px-4 text-emerald-700 font-semibold">Production Ready</td>
                <td className="py-3 px-4">Connect WebSocket / REST endpoint</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
