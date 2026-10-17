# MadhuRaksha (मधुरक्षा) — Smart Beehive Monitoring & Control Command Studio

![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-11.11-FF0055?style=for-the-badge&logo=framer)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)

A modern, production-grade IoT command dashboard for smart beehive monitoring, engineered for beekeepers and apiary research teams in Karnataka, India.

---

## 🐝 System Architecture: 1 Master IoT Box $\rightarrow$ 3 Bee Boxes

The system monitors **1 Master IoT Hub (ESP32)** multiplexing analog and digital telemetry lines from **3 identical standard beehive boxes** placed approximately **1 meter apart** in the same apiary:

| Box ID | Name | Specification | Sensors Monitored |
| :--- | :--- | :--- | :--- |
| **`BOX_01`** | **Hive Box 1** | Standard 10-Frame Langstroth | Temperature, Humidity, Load Cell (HX711), Acoustic Mic, MPU6050 Accelerometer |
| **`BOX_02`** | **Hive Box 2** | Standard 10-Frame Langstroth | Temperature, Humidity, Load Cell (HX711), Acoustic Mic, MPU6050 Accelerometer |
| **`BOX_03`** | **Hive Box 3** | Standard 10-Frame Langstroth | Temperature, Humidity, Load Cell (HX711), Acoustic Mic, MPU6050 Accelerometer |

---

## 🌟 Key Features

1. **Sleek Animated Segmented Controller:**
   - Single, fluid pill selector powered by Framer Motion (`layoutId="activeBoxPill"`). Switch seamlessly between Hive Box 1, 2, and 3 without visual clutter or repetitive tables.
2. **Live Colony Acoustic Mic Streamer & Oscilloscope:**
   - Synthesizes realistic 220 Hz honeybee wingbeat sound using the browser's native **Web Audio API** (`AudioContext`).
   - Dynamic fundamental pitch scaling with turbulence air modulation.
   - 60 FPS HTML5 Canvas oscilloscope waveform visualizer.
3. **Primary 5 Sensor Metrics + SPI SD Card Status:**
   - 🌡️ **Brood Temperature (°C):** Incubator nest monitoring ($31.0^\circ\text{C} - 35.5^\circ\text{C}$ safe range).
   - 💧 **Relative Humidity (%):** Safe target $50\% - 70\%$.
   - ⚖️ **Hive Weight (kg):** Load cell tracking nectar flow and honey stores.
   - 🔊 **Colony Sound (dB):** Acoustic frequency sensor.
   - 📐 **MPU6050 Tilt Angle (°):** Knockover and theft disturbance detector.
   - 💾 **MicroSD Data Logger:** Clearly flagged *Pending MicroPython SPI Firmware Integration*.
4. **2D Virtual Hive Digital Twin:**
   - Live visual model with dynamic brood chamber heat coloring (amber for healthy, crimson for overheat, sky-blue for chilling) and animated floating worker bees.
5. **Interactive Historical Analytics:**
   - Responsive **Recharts** time-series graphs for all 6 telemetry metrics with 1H, 6H, and 24H range filters.
6. **Fleet Map & Community Network:**
   - Geographic distribution across Karnataka (Mandya, Ramanagara, Madikeri) and Madhu Sakhi women beekeeper support network.
7. **Threshold Alert Logging & CSV Export:**
   - Automatic alert recording when thresholds are breached, detailing simulated SIM800L GSM SMS dispatches, plus a one-click CSV telemetry export.

---

## 🚀 Getting Started Locally

```bash
# Clone the repository
git clone https://github.com/gouravpd26-cmyk/Honey-bee.git

# Navigate to project directory
cd Honey-bee

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ☁️ Deploying to Vercel

The easiest way to deploy this Next.js app to production:

1. Go to [Vercel](https://vercel.com) and sign in with GitHub.
2. Click **Add New...** $\rightarrow$ **Project**.
3. Select the **`Honey-bee`** repository and click **Import**.
4. Click **Deploy**. Vercel will automatically build and publish your live dashboard!
