export interface HiveBox {
  box_id: string;
  box_name: string;
  // 1. Combined Temperature & Humidity Sensor
  temperature_c: number;
  humidity_percent: number;
  
  // 2. Load Sensors (2 in Brood Box, 2 in Honey Box - corners of frame)
  brood_load_corner1_kg: number;
  brood_load_corner2_kg: number;
  brood_total_kg: number;

  honey_load_corner1_kg: number;
  honey_load_corner2_kg: number;
  honey_total_kg: number;

  total_hive_weight_kg: number;

  // 3. Gyroscope / Accelerometer Sensor (MPU6050)
  gyro: {
    pitch_x: number;
    roll_y: number;
    yaw_z: number;
    tilt_deg: number;
    status: "Level & Stable" | "Tilted / Disturbed";
  };

  // 4. Microphone (Colony Sound)
  sound_db: number;

  status: "HEALTHY" | "WARNING" | "CRITICAL";
  timestamp?: string;

  // Legacy compatibility fields for archived dashboard components
  weight_kg?: number;
  tilt_deg?: number;
  co2_ppm?: number;
  light_lux?: number;
  bee_count_per_min?: number;
  forcedAnomaly?: string | null;
  iso_timestamp?: string;
}

export interface MasterHub {
  hub_id: string;
  hub_name: string;
  location: string;
  battery_cell_pct: number;
  battery_voltage: number;
  battery_status: string;
  firmware?: string;
  battery_pct?: number;
  solar_active?: boolean;
  gsm_rssi_dbm?: number;
  sd_status?: string;
}

export interface HiveAlert {
  id: string;
  hub_id?: string;
  box_id: string;
  time: string;
  sensor: string;
  reading: string;
  threshold?: string;
  action?: string;
  severity: "CRITICAL" | "WARNING" | "INFO";
  status?: string;
}

export interface HistoricalDataPoint {
  time: string;
  temperature: number;
  humidity: number;
  weight: number;
  sound: number;
  tilt: number;
  co2?: number;
}

