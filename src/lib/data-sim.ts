import { HiveBox, MasterHub, HiveAlert, HistoricalDataPoint } from "@/types/hive";

export const MASTER_IOT_HUB: MasterHub = {
  hub_id: "IOT_HUB_01",
  hub_name: "MadhuRaksha Master IoT Hub #1 (Apiary Mandya)",
  firmware: "MicroPython v1.23-ESP32-TriChannel",
  battery_pct: 94,
  solar_active: true,
  gsm_rssi_dbm: -74,
  sd_status: "UNAVAILABLE (Pending Firmware)"
};

// 3 identical standard beehive boxes (~1m apart), all connected to the single Master IoT Box
export const INITIAL_BOXES: Record<string, HiveBox> = {
  "BOX_01": {
    box_id: "BOX_01",
    box_name: "Hive Box 1",
    temperature_c: 34.8,
    humidity_percent: 61.2,
    co2_ppm: 2680,
    weight_kg: 27.4,
    sound_db: 63,
    light_lux: 12400,
    bee_count_per_min: 172,
    tilt_deg: 0.7,
    status: "HEALTHY"
  },
  "BOX_02": {
    box_id: "BOX_02",
    box_name: "Hive Box 2",
    temperature_c: 33.6,
    humidity_percent: 58.0,
    co2_ppm: 2420,
    weight_kg: 32.5,
    sound_db: 59,
    light_lux: 11800,
    bee_count_per_min: 210,
    tilt_deg: 0.4,
    status: "HEALTHY"
  },
  "BOX_03": {
    box_id: "BOX_03",
    box_name: "Hive Box 3",
    temperature_c: 35.2,
    humidity_percent: 64.5,
    co2_ppm: 2850,
    weight_kg: 21.8,
    sound_db: 67,
    light_lux: 13100,
    bee_count_per_min: 145,
    tilt_deg: 1.1,
    status: "HEALTHY"
  }
};

export const THRESHOLDS = {
  tempHigh: 36.0,       // Overheating risk (>36°C)
  tempCritHigh: 45.0,   // Critical heat spurt (>45°C)
  tempLow: 30.0,        // Brood chilling risk (<30°C)
  humHigh: 70.0,        // Mold risk (>70%)
  humLow: 50.0,         // Desiccation risk (<50%)
  co2High: 3000,        // Overcrowding / poor ventilation (>3000 ppm)
  soundDelta: 10,       // Sudden ±10 dB change (queen loss / swarming)
  tiltCritical: 10.0,    // MPU6050 physical tilt / hive knocked over (>10°)
  batteryLow: 30        // Low battery warning (<30%)
};

export const INITIAL_ALERTS: HiveAlert[] = [
  {
    id: "ALT-301",
    hub_id: "IOT_HUB_01",
    box_id: "BOX_01",
    time: "Today, 11:20 AM",
    sensor: "Temperature",
    reading: "37.2 °C",
    threshold: "> 36.0 °C",
    severity: "CRITICAL",
    action: "SMS Sent to SIM800L (+1234567890)",
    status: "Resolved"
  },
  {
    id: "ALT-302",
    hub_id: "IOT_HUB_01",
    box_id: "BOX_03",
    time: "Today, 09:15 AM",
    sensor: "CO₂ Level",
    reading: "3120 ppm",
    threshold: "> 3000 ppm",
    severity: "WARNING",
    action: "Logged / Ventilation Checked",
    status: "Normal"
  },
  {
    id: "ALT-303",
    hub_id: "IOT_HUB_01",
    box_id: "BOX_02",
    time: "Yesterday, 03:45 PM",
    sensor: "Hive Tilt (MPU6050)",
    reading: "14.8 °",
    threshold: "> 10.0 °",
    severity: "CRITICAL",
    action: "SMS Sent to SIM800L",
    status: "Inspected"
  }
];

export function generateHistoricalDataset(box: HiveBox, hours = 24, pointsCount = 20): HistoricalDataPoint[] {
  const result: HistoricalDataPoint[] = [];
  const now = Date.now();
  const intervalMs = (hours * 3600 * 1000) / pointsCount;

  for (let i = pointsCount - 1; i >= 0; i--) {
    const pointTime = new Date(now - i * intervalMs);
    const timeLabel = pointTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const hour = pointTime.getHours();
    const diurnal = Math.sin(((hour - 6) / 24) * 2 * Math.PI);

    result.push({
      time: timeLabel,
      temperature: +(box.temperature_c + diurnal * 0.8 + (Math.random() * 0.4 - 0.2)).toFixed(1),
      humidity: +(box.humidity_percent - diurnal * 3.0 + (Math.random() * 1.2 - 0.6)).toFixed(1),
      weight: +(box.weight_kg + i * 0.02 + (Math.random() * 0.06 - 0.03)).toFixed(2),
      sound: +(box.sound_db + diurnal * 2.5 + (Math.random() * 2 - 1)).toFixed(0),
      tilt: +(box.tilt_deg + (Math.random() * 0.1 - 0.05)).toFixed(1),
      co2: +(box.co2_ppm + diurnal * 160 + (Math.random() * 40 - 20)).toFixed(0)
    });
  }

  return result;
}

export function simulateTick(
  boxes: Record<string, HiveBox>,
  activeBoxId: string,
  anomalyType: string | null
): { updatedBoxes: Record<string, HiveBox>; newAlert: HiveAlert | null } {
  const updated = { ...boxes };
  let newAlert: HiveAlert | null = null;
  const now = new Date();
  const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  for (const boxId of Object.keys(updated)) {
    const box = { ...updated[boxId] };

    if (boxId === activeBoxId && anomalyType) {
      if (anomalyType === "overheat") {
        box.temperature_c = +(37.6 + Math.random() * 0.4).toFixed(1);
        box.humidity_percent = +(48.0 + Math.random() * 1.0).toFixed(1);
        box.status = "CRITICAL";
        newAlert = {
          id: `ALT-${Date.now().toString().slice(-4)}`,
          hub_id: MASTER_IOT_HUB.hub_id,
          box_id: box.box_id,
          time: timeFormatted,
          sensor: "Temperature",
          reading: `${box.temperature_c} °C`,
          threshold: "> 36.0 °C",
          severity: "CRITICAL",
          action: "SMS Sent to SIM800L (+1234567890)",
          status: "Overheating Risk"
        };
      } else if (anomalyType === "co2_spike") {
        box.co2_ppm = +(3320 + Math.random() * 60).toFixed(0);
        box.status = "WARNING";
        newAlert = {
          id: `ALT-${Date.now().toString().slice(-4)}`,
          hub_id: MASTER_IOT_HUB.hub_id,
          box_id: box.box_id,
          time: timeFormatted,
          sensor: "CO₂ Concentration",
          reading: `${box.co2_ppm} ppm`,
          threshold: "> 3000 ppm",
          severity: "WARNING",
          action: "Logged / Ventilation Warning",
          status: "Poor Ventilation"
        };
      } else if (anomalyType === "tilt") {
        box.tilt_deg = +(16.8 + Math.random() * 1.5).toFixed(1);
        box.sound_db = 77;
        box.status = "CRITICAL";
        newAlert = {
          id: `ALT-${Date.now().toString().slice(-4)}`,
          hub_id: MASTER_IOT_HUB.hub_id,
          box_id: box.box_id,
          time: timeFormatted,
          sensor: "Hive Tilt (MPU6050)",
          reading: `${box.tilt_deg} °`,
          threshold: "> 10.0 °",
          severity: "CRITICAL",
          action: "SMS Sent to SIM800L",
          status: "Hive Knocked Over"
        };
      } else if (anomalyType === "sound") {
        box.sound_db = +(82 + Math.random() * 3).toFixed(0);
        box.bee_count_per_min = 340;
        box.status = "WARNING";
        newAlert = {
          id: `ALT-${Date.now().toString().slice(-4)}`,
          hub_id: MASTER_IOT_HUB.hub_id,
          box_id: box.box_id,
          time: timeFormatted,
          sensor: "Acoustic Colony Sound",
          reading: `${box.sound_db} dB`,
          threshold: "+19 dB spike",
          severity: "WARNING",
          action: "SMS Sent to SIM800L",
          status: "Swarm Agitation"
        };
      }
    } else {
      // Normal living hive micro-drift
      const tempDrift = (Math.random() * 0.16) - 0.08;
      const humDrift = (Math.random() * 0.4) - 0.2;
      const weightDrift = (Math.random() * 0.02) - 0.01;
      const soundDrift = (Math.random() * 1.4) - 0.7;

      box.temperature_c = +(Math.max(31.0, Math.min(35.5, box.temperature_c + tempDrift))).toFixed(1);
      box.humidity_percent = +(Math.max(52.0, Math.min(68.0, box.humidity_percent + humDrift))).toFixed(1);
      box.weight_kg = +(box.weight_kg + weightDrift).toFixed(2);
      box.sound_db = +(Math.max(54, Math.min(70, box.sound_db + soundDrift))).toFixed(0);
      box.status = "HEALTHY";
    }

    box.timestamp = timeFormatted;
    updated[boxId] = box;
  }

  return { updatedBoxes: updated, newAlert };
}
