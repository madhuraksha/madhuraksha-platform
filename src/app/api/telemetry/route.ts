import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// Device secret header or payload field to authenticate Master IoT Box
const EXPECTED_DEVICE_KEY = process.env.IOT_DEVICE_SECRET || "madhuraksha_iot_secret_2026";

interface InboundBoxData {
  box_id: string;
  box_name?: string;
  temperature_c: number;
  humidity_percent: number;
  brood_load_corner1_kg: number;
  brood_load_corner2_kg: number;
  honey_load_corner1_kg: number;
  honey_load_corner2_kg: number;
  gyro?: {
    pitch_x?: number;
    roll_y?: number;
    yaw_z?: number;
    tilt_deg?: number;
  };
  sound_db: number;
}

interface InboundTelemetryPayload {
  api_key?: string;
  hub_id?: string;
  battery_cell_pct?: number;
  battery_voltage?: number;
  battery_status?: string;
  boxes?: InboundBoxData[];
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("x-api-key") || req.headers.get("authorization")?.replace("Bearer ", "");
    const body: InboundTelemetryPayload = await req.json();

    const providedKey = authHeader || body.api_key;
    if (providedKey !== EXPECTED_DEVICE_KEY) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid or missing device api_key" },
        { status: 401 }
      );
    }

    const hubId = body.hub_id || "IOT_BOX_01";
    const batteryPct = body.battery_cell_pct ?? 94;
    const batteryVolts = body.battery_voltage ?? 4.02;
    const batteryStatus = body.battery_status || (batteryVolts > 3.7 ? "Healthy · Li-Ion Solar Charged" : "Low Cell Voltage");

    // 1. If Supabase admin client is configured, persist to database
    if (supabaseAdmin) {
      // Update Hub State
      await supabaseAdmin
        .from("iot_hubs")
        .upsert({
          hub_id: hubId,
          name: "Master IoT Box #1",
          location: "Location 1 (Mandya Apiary)",
          battery_cell_pct: batteryPct,
          battery_voltage: batteryVolts,
          battery_status: batteryStatus,
          last_seen: new Date().toISOString(),
        });

      // Update Each Box & Log History
      if (Array.isArray(body.boxes) && body.boxes.length > 0) {
        for (const box of body.boxes) {
          const broodTotal = +(box.brood_load_corner1_kg + box.brood_load_corner2_kg).toFixed(2);
          const honeyTotal = +(box.honey_load_corner1_kg + box.honey_load_corner2_kg).toFixed(2);
          const totalWeight = +(broodTotal + honeyTotal).toFixed(2);

          const pitch = box.gyro?.pitch_x ?? 0.0;
          const roll = box.gyro?.roll_y ?? 0.0;
          const yaw = box.gyro?.yaw_z ?? 0.0;
          const tilt = box.gyro?.tilt_deg ?? +(Math.sqrt(pitch ** 2 + roll ** 2)).toFixed(1);
          const gyroStatus = tilt > 10.0 ? "Tilted / Disturbed" : "Level & Stable";
          const boxStatus = tilt > 10.0 || box.temperature_c > 36.0 ? "CRITICAL" : "HEALTHY";

          // Upsert Live State
          await supabaseAdmin
            .from("hive_boxes")
            .upsert({
              box_id: box.box_id,
              hub_id: hubId,
              box_name: box.box_name || (box.box_id === "BOX_01" ? "Hive Box 1" : box.box_id === "BOX_02" ? "Hive Box 2" : "Hive Box 3"),
              temperature_c: box.temperature_c,
              humidity_percent: box.humidity_percent,
              brood_load_corner1_kg: box.brood_load_corner1_kg,
              brood_load_corner2_kg: box.brood_load_corner2_kg,
              brood_total_kg: broodTotal,
              honey_load_corner1_kg: box.honey_load_corner1_kg,
              honey_load_corner2_kg: box.honey_load_corner2_kg,
              honey_total_kg: honeyTotal,
              total_hive_weight_kg: totalWeight,
              pitch_x: pitch,
              roll_y: roll,
              yaw_z: yaw,
              tilt_deg: tilt,
              gyro_status: gyroStatus,
              sound_db: box.sound_db,
              status: boxStatus,
              updated_at: new Date().toISOString(),
            });

          // Insert into historical time-series log
          await supabaseAdmin
            .from("telemetry_logs")
            .insert({
              hub_id: hubId,
              box_id: box.box_id,
              temperature_c: box.temperature_c,
              humidity_percent: box.humidity_percent,
              brood_total_kg: broodTotal,
              honey_total_kg: honeyTotal,
              total_hive_weight_kg: totalWeight,
              tilt_deg: tilt,
              sound_db: box.sound_db,
              recorded_at: new Date().toISOString(),
            });
        }
      }
    }

    return NextResponse.json({
      success: true,
      hub_id: hubId,
      boxes_processed: body.boxes?.length || 0,
      timestamp: new Date().toISOString(),
      supabase_connected: Boolean(supabaseAdmin),
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: "online",
    endpoint: "/api/telemetry",
    format: "POST JSON with x-api-key header or body.api_key",
    connected_to_supabase: Boolean(supabaseAdmin),
  });
}
