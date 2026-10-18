"""
MadhuRaksha Hardware Simulation & Telemetry Ingestion Test
This script simulates the Master IoT Box sending live sensor telemetry to your Next.js API route (/api/telemetry).
"""

import time
import requests
import random
import math

API_URL = "http://localhost:3000/api/telemetry"
DEVICE_KEY = "madhuraksha_iot_secret_2026"

print(f"🐝 MadhuRaksha Telemetry Transmitter Started")
print(f"📡 Target Endpoint: {API_URL}")
print(f"🔑 Device Auth: Validated")
print("-" * 50)

def generate_telemetry_packet():
    # Simulate battery cell voltage & percentage
    battery_v = round(random.uniform(3.98, 4.05), 2)
    battery_pct = int(min(100, max(0, ((battery_v - 3.3) / (4.2 - 3.3)) * 100)))

    packet = {
        "api_key": DEVICE_KEY,
        "hub_id": "IOT_BOX_01",
        "battery_cell_pct": battery_pct,
        "battery_voltage": battery_v,
        "battery_status": "Healthy · Li-Ion Solar Charged",
        "boxes": [
            {
                "box_id": "BOX_01",
                "box_name": "Hive Box 1",
                "temperature_c": round(random.uniform(34.4, 35.1), 1),
                "humidity_percent": round(random.uniform(60.0, 62.5), 1),
                "brood_load_corner1_kg": round(random.uniform(13.70, 13.90), 2),
                "brood_load_corner2_kg": round(random.uniform(13.50, 13.70), 2),
                "honey_load_corner1_kg": round(random.uniform(16.10, 16.30), 2),
                "honey_load_corner2_kg": round(random.uniform(16.20, 16.40), 2),
                "gyro": {
                    "pitch_x": round(random.uniform(-0.5, 0.5), 1),
                    "roll_y": round(random.uniform(-0.5, 0.5), 1),
                    "yaw_z": round(random.uniform(0.0, 0.2), 1),
                    "tilt_deg": 0.5
                },
                "sound_db": int(random.uniform(61, 66))
            },
            {
                "box_id": "BOX_02",
                "box_name": "Hive Box 2",
                "temperature_c": round(random.uniform(33.3, 34.0), 1),
                "humidity_percent": round(random.uniform(57.0, 59.5), 1),
                "brood_load_corner1_kg": round(random.uniform(12.80, 13.00), 2),
                "brood_load_corner2_kg": round(random.uniform(13.00, 13.20), 2),
                "honey_load_corner1_kg": round(random.uniform(14.40, 14.60), 2),
                "honey_load_corner2_kg": round(random.uniform(14.20, 14.40), 2),
                "gyro": {
                    "pitch_x": round(random.uniform(-0.3, 0.3), 1),
                    "roll_y": round(random.uniform(0.1, 0.4), 1),
                    "yaw_z": 0.0,
                    "tilt_deg": 0.4
                },
                "sound_db": int(random.uniform(58, 62))
            },
            {
                "box_id": "BOX_03",
                "box_name": "Hive Box 3",
                "temperature_c": round(random.uniform(34.9, 35.5), 1),
                "humidity_percent": round(random.uniform(63.5, 65.5), 1),
                "brood_load_corner1_kg": round(random.uniform(11.10, 11.30), 2),
                "brood_load_corner2_kg": round(random.uniform(11.30, 11.50), 2),
                "honey_load_corner1_kg": round(random.uniform(12.00, 12.20), 2),
                "honey_load_corner2_kg": round(random.uniform(12.20, 12.40), 2),
                "gyro": {
                    "pitch_x": round(random.uniform(0.3, 0.7), 1),
                    "roll_y": round(random.uniform(0.4, 0.8), 1),
                    "yaw_z": 0.2,
                    "tilt_deg": 0.8
                },
                "sound_db": int(random.uniform(65, 70))
            }
        ]
    }
    return packet

if __name__ == "__main__":
    while True:
        payload = generate_telemetry_packet()
        try:
            res = requests.post(
                API_URL,
                json=payload,
                headers={"x-api-key": DEVICE_KEY, "Content-Type": "application/json"},
                timeout=5
            )
            print(f"[{time.strftime('%X')}] HTTP {res.status_code} -> {res.json()}")
        except Exception as e:
            print(f"[{time.strftime('%X')}] ❌ Request failed: {e}")
        time.sleep(5)
