import { HiveBox, MasterHub, HiveAlert } from "@/types/hive";

export const MASTER_IOT_HUB: MasterHub = {
  hub_id: "IOT_BOX_01",
  hub_name: "Master IoT Box #1",
  location: "Apiary Location #1 (Mandya, Karnataka)",
  battery_cell_pct: 94,
  battery_voltage: 4.02,
  battery_status: "Healthy · Li-Ion Solar Charged"
};

// 3 Honeybee boxes connected to this single Master IoT Box in Location #1
export const INITIAL_BOXES: Record<string, HiveBox> = {
  "BOX_01": {
    box_id: "BOX_01",
    box_name: "Hive Box 1",
    temperature_c: 34.8,
    humidity_percent: 61.2,
    brood_load_corner1_kg: 13.80,
    brood_load_corner2_kg: 13.60,
    brood_total_kg: 27.40,
    honey_load_corner1_kg: 16.20,
    honey_load_corner2_kg: 16.30,
    honey_total_kg: 32.50,
    total_hive_weight_kg: 59.90,
    gyro: {
      pitch_x: 0.3,
      roll_y: -0.4,
      yaw_z: 0.1,
      tilt_deg: 0.5,
      status: "Level & Stable"
    },
    sound_db: 63,
    status: "HEALTHY"
  },
  "BOX_02": {
    box_id: "BOX_02",
    box_name: "Hive Box 2",
    temperature_c: 33.6,
    humidity_percent: 58.0,
    brood_load_corner1_kg: 12.90,
    brood_load_corner2_kg: 13.10,
    brood_total_kg: 26.00,
    honey_load_corner1_kg: 14.50,
    honey_load_corner2_kg: 14.30,
    honey_total_kg: 28.80,
    total_hive_weight_kg: 54.80,
    gyro: {
      pitch_x: -0.2,
      roll_y: 0.3,
      yaw_z: 0.0,
      tilt_deg: 0.4,
      status: "Level & Stable"
    },
    sound_db: 59,
    status: "HEALTHY"
  },
  "BOX_03": {
    box_id: "BOX_03",
    box_name: "Hive Box 3",
    temperature_c: 35.2,
    humidity_percent: 64.5,
    brood_load_corner1_kg: 11.20,
    brood_load_corner2_kg: 11.40,
    brood_total_kg: 22.60,
    honey_load_corner1_kg: 12.10,
    honey_load_corner2_kg: 12.30,
    honey_total_kg: 24.40,
    total_hive_weight_kg: 47.00,
    gyro: {
      pitch_x: 0.5,
      roll_y: 0.6,
      yaw_z: 0.2,
      tilt_deg: 0.8,
      status: "Level & Stable"
    },
    sound_db: 67,
    status: "HEALTHY"
  }
};

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
        box.temperature_c = +(37.5 + Math.random() * 0.5).toFixed(1);
        box.humidity_percent = +(48.0 + Math.random() * 1.0).toFixed(1);
        box.status = "CRITICAL";
        newAlert = {
          id: `ALT-${Date.now().toString().slice(-4)}`,
          box_id: box.box_id,
          time: timeFormatted,
          sensor: "Temperature / Humidity Sensor",
          reading: `${box.temperature_c}°C / ${box.humidity_percent}%`,
          severity: "CRITICAL"
        };
      } else if (anomalyType === "tilt") {
        box.gyro.pitch_x = 12.4;
        box.gyro.roll_y = 11.8;
        box.gyro.tilt_deg = 17.1;
        box.gyro.status = "Tilted / Disturbed";
        box.status = "CRITICAL";
        newAlert = {
          id: `ALT-${Date.now().toString().slice(-4)}`,
          box_id: box.box_id,
          time: timeFormatted,
          sensor: "MPU6050 Gyroscope",
          reading: `17.1° Tilt (Displaced)`,
          severity: "CRITICAL"
        };
      } else if (anomalyType === "sound") {
        box.sound_db = +(82 + Math.random() * 3).toFixed(0);
        box.status = "WARNING";
        newAlert = {
          id: `ALT-${Date.now().toString().slice(-4)}`,
          box_id: box.box_id,
          time: timeFormatted,
          sensor: "Microphone (Sound)",
          reading: `${box.sound_db} dB (High Frequency Buzz)`,
          severity: "WARNING"
        };
      }
    } else {
      // Natural living hive micro-drift
      const tempDrift = (Math.random() * 0.14) - 0.07;
      const humDrift = (Math.random() * 0.3) - 0.15;
      const loadDrift1 = (Math.random() * 0.02) - 0.01;
      const loadDrift2 = (Math.random() * 0.02) - 0.01;
      const honeyDrift1 = (Math.random() * 0.03) - 0.015;
      const honeyDrift2 = (Math.random() * 0.03) - 0.015;
      const soundDrift = (Math.random() * 1.6) - 0.8;

      box.temperature_c = +(Math.max(31.0, Math.min(35.8, box.temperature_c + tempDrift))).toFixed(1);
      box.humidity_percent = +(Math.max(52.0, Math.min(68.0, box.humidity_percent + humDrift))).toFixed(1);

      box.brood_load_corner1_kg = +(Math.max(8.0, box.brood_load_corner1_kg + loadDrift1)).toFixed(2);
      box.brood_load_corner2_kg = +(Math.max(8.0, box.brood_load_corner2_kg + loadDrift2)).toFixed(2);
      box.brood_total_kg = +(box.brood_load_corner1_kg + box.brood_load_corner2_kg).toFixed(2);

      box.honey_load_corner1_kg = +(Math.max(10.0, box.honey_load_corner1_kg + honeyDrift1)).toFixed(2);
      box.honey_load_corner2_kg = +(Math.max(10.0, box.honey_load_corner2_kg + honeyDrift2)).toFixed(2);
      box.honey_total_kg = +(box.honey_load_corner1_kg + box.honey_load_corner2_kg).toFixed(2);

      box.total_hive_weight_kg = +(box.brood_total_kg + box.honey_total_kg).toFixed(2);

      box.gyro.pitch_x = +(box.gyro.pitch_x + (Math.random() * 0.04 - 0.02)).toFixed(1);
      box.gyro.roll_y = +(box.gyro.roll_y + (Math.random() * 0.04 - 0.02)).toFixed(1);
      box.gyro.tilt_deg = +(Math.sqrt(box.gyro.pitch_x ** 2 + box.gyro.roll_y ** 2)).toFixed(1);
      box.gyro.status = box.gyro.tilt_deg > 10.0 ? "Tilted / Disturbed" : "Level & Stable";

      box.sound_db = +(Math.max(54, Math.min(70, box.sound_db + soundDrift))).toFixed(0);
      box.status = box.gyro.tilt_deg > 10.0 || box.temperature_c > 36.0 ? "CRITICAL" : "HEALTHY";
    }

    box.timestamp = timeFormatted;
    updated[boxId] = box;
  }

  return { updatedBoxes: updated, newAlert };
}
