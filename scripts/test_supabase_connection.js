const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

// Read .env.local manually without external dotenv
const envFile = fs.readFileSync(path.join(__dirname, "..", ".env.local"), "utf8");
const env = {};
envFile.split("\n").forEach((line) => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith("#")) {
    const idx = trimmed.indexOf("=");
    if (idx !== -1) {
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim();
      env[key] = val;
    }
  }
});

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

console.log("Testing Supabase Connection...");
console.log("URL:", url);
console.log("Anon Key:", anonKey ? anonKey.slice(0, 15) + "..." : "Missing");
console.log("Service Key:", serviceKey ? serviceKey.slice(0, 15) + "..." : "Missing");

const supabase = createClient(url, serviceKey || anonKey);

async function test() {
  try {
    const { data: hubs, error: hubErr } = await supabase.from("iot_hubs").select("*").limit(5);
    if (hubErr) {
      console.error("Hub Query Error:", hubErr.message);
    } else {
      console.log("✅ Successfully connected to Supabase!");
      console.log("Hubs in DB:", hubs);
    }

    const { data: boxes, error: boxErr } = await supabase.from("hive_boxes").select("box_id, box_name, total_hive_weight_kg, temperature_c, humidity_percent");
    if (boxErr) {
      console.error("Boxes Query Error:", boxErr.message);
    } else {
      console.log("Boxes in DB:", boxes);
    }
  } catch (err) {
    console.error("Failed to connect:", err.message);
  }
}

test();
