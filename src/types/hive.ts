export interface HiveBox {
  box_id: string;
  box_name: string;
  temperature_c: number;
  humidity_percent: number;
  co2_ppm: number;
  weight_kg: number;
  sound_db: number;
  light_lux: number;
  bee_count_per_min: number;
  tilt_deg: number;
  status: "HEALTHY" | "WARNING" | "CRITICAL";
  forcedAnomaly?: string | null;
  timestamp?: string;
  iso_timestamp?: string;
}

export interface MasterHub {
  hub_id: string;
  hub_name: string;
  firmware: string;
  battery_pct: number;
  solar_active: boolean;
  gsm_rssi_dbm: number;
  sd_status: string;
}

export interface HiveAlert {
  id: string;
  hub_id: string;
  box_id: string;
  time: string;
  sensor: string;
  reading: string;
  threshold: string;
  severity: "CRITICAL" | "WARNING" | "INFO";
  action: string;
  status: string;
}

export interface HistoricalDataPoint {
  time: string;
  temperature: number;
  humidity: number;
  weight: number;
  sound: number;
  tilt: number;
  co2: number;
}
