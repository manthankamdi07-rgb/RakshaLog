# RakshaLog — UI Design Direction & Design System
**System:** AI-Driven Forward Logistics & Supply Chain Command Center  
**Context:** Smart India Hackathon 2026 | Problem Statement ID: 26251  
**Aesthetic Style:** Tactical Dark Command Center (High Contrast, Data-Dense, Clean & Mission-Focused)

---

## 1. Visual Theme & Philosophy
RakshaLog embodies the aesthetic of an advanced Joint Operations Command (JOC) room:
* **Dark, High-Contrast Surface:** Reduces eye fatigue during continuous monitoring and makes critical alerts instantly unmissable.
* **Information Density with Breathing Room:** Compact tabular data and telemetry gauges balanced with standard 8px grid spacing.
* **Strict Color Semantics:** Color is never decorative; every tint conveys operational readiness, urgency, or classification.
* **Tactical Precision:** Crisp borders, subtle glassmorphism (translucent backdrops for map overlays), and monospaced figures for telemetry.

---

## 2. Color Palette & Design Tokens

### 2.1. Surface & Neutral Tones
* **Background Deep Canvas (`--bg-canvas`):** `#0B0F19` (Deep Obsidian / Pitch Night)
* **Surface Card (`--bg-surface`):** `#111827` (Tactical Dark Slate)
* **Surface Raised / Modals (`--bg-raised`):** `#1F2937` (Milled Metal Slate)
* **Border Subtle (`--border-subtle`):** `#374151` (1px clean outlines)
* **Border Highlight (`--border-active`):** `#4B5563`
* **Text Primary (`--text-primary`):** `#F9FAFB` (High contrast pure white-slate)
* **Text Secondary (`--text-secondary`):** `#9CA3AF` (Muted silver)
* **Text Dimmed (`--text-tertiary`):** `#6B7280` (Labels & timestamps)

### 2.2. Tactical Status System (Operational Semantics)
* **Operational / Safe (`--status-green`):**
  * Hex: `#10B981` (Emerald 500) | Dark bg: `#064E3B` | Border: `#059669`
  * Meaning: Sufficient Days of Supply (> 10 DOS), Route Clear, IoT Telemetry Healthy.
* **Advisory / Impending (`--status-amber`):**
  * Hex: `#F59E0B` (Amber 500) | Dark bg: `#78350F` | Border: `#D97706`
  * Meaning: Impending Weather Hazard, Approving Horizon, Low Stock Warning (5–10 DOS).
* **Critical Threat / Stockout (`--status-red`):**
  * Hex: `#EF4444` (Red 500) | Dark bg: `#7F1D1D` | Border: `#DC2626`
  * Meaning: Severe Anomaly (Tank Leak), Road Closed (Landslide), Stockout Projected (< 5 DOS).
* **Tactical Accent / Active Systems (`--accent-cyan`):**
  * Hex: `#06B6D4` (Cyan 500) | Dark bg: `#164E63` | Border: `#0891B2`
  * Meaning: Active GPS Convoys, ML Prediction Line, GIS Route Ribbon.
* **Military Gold / Command Authority (`--accent-gold`):**
  * Hex: `#EAB308` (Gold 500)
  * Meaning: Commander Authorization Gate, Official Seal, Digital Signatures.

---

## 3. Typography Hierarchy

Fonts loaded via Google Fonts:
1. **Primary UI Font:** `Inter` (San-Serif for maximum readability and clean labels)
2. **Telemetry & Coordinates Font:** `JetBrains Mono` (Monospaced for numbers, coordinates, DTG timestamps, and sensor values so data columns align perfectly without jittering)
3. **Headings & Branding:** `Space Grotesk` or `Inter Display` (Crisp geometric tech styling)

### Type Scale
* **Display / Top Stats:** `28px` / `Font-Bold` / Monospace / Line-Height: 1.1
* **Page Title / H1:** `20px` / `Font-Semibold` / Space Grotesk / Tracking-wide
* **Section Header / H2:** `15px` / `Font-Semibold` / Inter / Uppercase / Tracking-wider (`text-xs font-semibold uppercase tracking-wider text-muted`)
* **Standard Body Text:** `14px` / `Font-Normal` / Inter
* **Data Cells & Table Values:** `13px` / `Font-Medium` / JetBrains Mono
* **Metadata & Badges:** `11px` / `Font-Semibold` / Inter / Uppercase

---

## 4. Reusable UI Component Library

### 4.1. Top Navigation Bar (`TopBar`)
* Height: 56px, fixed at the top with `backdrop-blur-md bg-opacity-90`.
* Left: Logo with glowing tactical reticle, Sector indicator, Security Classification chip (`SYNTHETIC DEMO`).
* Center: System health heartbeat (`● Mesh 99.8% Online`), Tactical Date Time Group (`DTG: 181650H OCT 26`).
* Right: Global audio-visual alert bell (with pulse ring), Persona profile badge with role switcher dropdown.

### 4.2. Tactical Metric Cards (`MetricCard`)
* Dark card with subtle 1px border.
* Top row: Metric title in uppercase muted text + category icon.
* Middle: Large bold number (e.g. `14.2 Days`) + delta indicator (`▲ +1.4% vs last week`).
* Bottom: Micro-sparkline or status progress bar.

### 4.3. Status Badges & Alert Chips (`StatusBadge`)
* Variants: `Critical` (pulsing red dot + text), `Warning` (amber), `Optimal` (green), `Offline` (slate).
* Monospace font, pill shape with 1px border matching accent color.

### 4.4. Tactical Data Tables (`DataTable`)
* Compact row height (36px).
* Hover highlight on rows (`hover:bg-slate-800/50`).
* Right-aligned numeric columns using `JetBrains Mono`.
* Inline sparklines showing 7-day burn-rate in table cells.

### 4.5. Map Markers & Route Vectors
* **Base Depot Marker:** Solid cyan hexagon with military warehouse icon.
* **Forward Post (FP) Marker:** Circular node colored dynamically by lowest DOS (Green/Amber/Red).
* **Active Convoy Marker:** Animated directional chevron moving along route path.
* **Hazard Marker:** Pulsing danger diamond over blocked mountain passes.
* **Route Lines:** Dashed translucent lines for proposed routes, bold glowing cyan for active routes, pulsing red for blocked segments.

### 4.6. Chart Components (Recharts)
* **Area/Line Chart for Forecasts:**
  * Background: Transparent.
  * Grid: Subtle dashed lines (`stroke="#374151" strokeDasharray="3 3"`).
  * Safe Inventory Area: Shaded green/blue gradient.
  * Critical Threshold Line: Red dashed horizontal reference line.
  * Tooltip: Custom dark glassmorphism card displaying exact litres/packs, date, and ML confidence.

### 4.7. Commander Authorization Modal
* Dark overlay backdrop (`bg-black/80`).
* High-impact gold border with security seal icon.
* Summary breakdown of cargo, vehicle utilization %, and route safety clearance.
* Secure PIN entry box with tactile feedback and 1-click confirmation.

---

## 5. Micro-Interactions & Animation Rules
* **Critical Alert Pulse:** `@keyframes pulse-danger` (subtle red glow ring every 1.5s).
* **Data Refresh Transition:** Subtle 200ms opacity fade when toggling "What-if" sliders to give a fluid real-time feel without UI jank.
* **Convoy Tracking:** Smooth SVG path interpolation for moving vehicle icons.
* **No Unnecessary Fluff:** Avoid whimsical consumer bounces or slow fade-ins; military interfaces feel instant, crisp, and deterministic.
