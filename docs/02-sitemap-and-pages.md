# RakshaLog — Sitemap & Page Specifications
**System:** AI-Driven Forward Logistics & Supply Chain Command Center  
**Context:** Smart India Hackathon 2026 | Problem Statement ID: 26251  
**Architecture Model:** Single Page Application (SPA) with Deep Linking & Role-Based Navigation  

---

## 1. Global Sitemap Hierarchy

```
[ RakshaLog Web Application ]
  |
  +-- /login (Secure Authentication & Role Switcher for Demo)
  |
  +-- /app (Protected Tactical Layout)
        |-- /overview          [Dashboard Overview - Executive & Operational Command]
        |-- /map               [Map & Routes - GIS Logistics, Convoy Tracking & Weather]
        |-- /forecast          [Demand Forecast - ML Depletion Models & Weather Impact]
        |-- /inventory         [Inventory & Alerts - Real-time Stock, IoT Telemetry & Diagnostics]
        |-- /dispatch          [Dispatch Planner - Multi-Drop Optimizer & Authorization Gate]
        |-- /reports           [Reports & Analytics - Readiness Metrics, Log-Sitreps & Export]
        |-- /sandbox           [Demo Simulation Controller - Hackathon Anomaly & Event Injector]
```

---

## 2. Role-Based Access Matrix (RBAC)

| Page / Module | Route | Logistics Officer (S4) | Commander (Decision Maker) | System / Signals Admin |
| :--- | :--- | :---: | :---: | :---: |
| **Login & Identity** | `/login` | Access | Access | Access |
| **Dashboard Overview** | `/overview` | Full Edit / Action | Read / High-Level View | View / Diagnostics |
| **Map & Routes** | `/map` | Route Planning / Reroute | Situational View / Approval | Sensor Layer Admin |
| **Demand Forecast** | `/forecast` | What-If Modeling / Adjust | High-Level Trend Review | Model Retrain / Drift |
| **Inventory & Alerts** | `/inventory` | Stock Adjustment / Resolve | Alert Ack / Escalation | Sensor Telemetry Calib |
| **Dispatch Planner** | `/dispatch` | Create / Edit Manifest | **Authorize & Sign** | Workflow Debug |
| **Reports & Analytics** | `/reports` | Export / Print Sitrep | Review Readiness KPIs | Data Pipeline Audit |
| **Simulation Sandbox** | `/sandbox` | Read-only | Read-only | **Trigger Injectors** |

---

## 3. Detailed Page Specifications

### 3.1. Authentication & Role Switcher (`/login`)
* **Purpose:** High-security tactical access entry point. For the hackathon demo, it incorporates a **1-Click Persona Switcher** allowing judges to seamlessly evaluate all 3 perspectives.
* **Key Components:**
  * Military-grade styled authentication panel with credential fields and Department Token.
  * *Demo Fast-Track Selector*: Instant buttons for "Logistics Officer (Maj. Rao)", "Commander (Brig. Chauhan)", and "Admin (Capt. Sharma)".
  * System operational status banner (e.g., *Network: Encrypted Tactical Mesh | Sync: Online*).
* **Data Shown:** Active operational sector, security classification banner (Synthetic Prototype), timestamp.
* **Primary Actions:**
  * Standard credentials submit.
  * Instant role switch with pre-loaded mock sessions.

---

### 3.2. Dashboard Overview (`/overview`)
* **Purpose:** The central command pulse. Combines real-time inventory readiness, active weather threats, critical convoy statuses, and pending AI recommendations in a unified view.
* **Key Components:**
  * **Top Metrics Ribbon:** Days of Supply (Sector Avg), Critical Alerts Count, Active Convoys, Depot Utilization %.
  * **Sector Readiness Heatmap / Matrix:** Quick-glance status grid for 7 locations (Base Depot + 6 Forward Outposts).
  * **Active Incident / Alert Feed:** Real-time ticker with severity badges (Critical, Impending, Warning).
  * **Quick-Action AI Recommendation Card:** Most urgent AI proposal (e.g., "Pass K-4 approaching closure in 12h: Pre-dispatch FP Agni").
  * **Mini Tactical Map Preview:** Centered on high-risk sector segments.
* **Data Shown:** Stock readiness indicators, active convoy GPS breadcrumbs, weather threat indicators, supply runway count.
* **Primary Actions:**
  * Click any critical alert to drill down into root-cause diagnostics.
  * One-click "Review & Act" on the primary recommended dispatch.
  * Filter view by supply class (Class I Rations, Class III Fuel, Class V Ammo).

---

### 3.3. Map & Routes (`/map`)
* **Purpose:** Tactical GIS command map linking physical supply locations, road passability, live convoy telemetry, and environmental hazards.
* **Key Components:**
  * **Interactive GIS Canvas (MapLibre / Leaflet):** High-contrast dark topographic/satellite view.
  * **Layer Controls Toggle:** Depots, Forward Posts, IoT Road Weather Sensors, Pass Status (Open/Snowed/Landslide), Active Convoy Tracks.
  * **Convoy Inspector Drawer:** Slides open when clicking a vehicle/convoy icon; displays speed, payload, ETA, driver comms, and fuel reserve.
  * **Route Rerouting Tool & Elevation Profile:** Visual elevation profile for mountain passes with real-time hazard markers.
* **Data Shown:** Node locations (GPS coordinates, altitude, DOS), road segment friction/passability scores, weather hazard polygons, live convoy positions.
* **Primary Actions:**
  * Select a blocked road segment to generate AI alternate routes.
  * Compare Route A vs Route B (distance, safety index, gradient, travel time).
  * Broadcast emergency reroute instruction to active convoy.

---

### 3.4. Demand Forecast (`/forecast`)
* **Purpose:** Deep-dive predictive analytics engine demonstrating how machine learning anticipates supply burn-rates based on troop strength, historical trends, and weather extremes.
* **Key Components:**
  * **Post Selector & Category Filter:** Dropdown to toggle between FP Agni, FP Himmat, etc., and Class I, III, V.
  * **Days of Supply (DOS) Trajectory Chart:** Historical consumption vs. ML predictive burn-rate with 95% confidence intervals and emergency reserve lines.
  * **Predictive Drivers Panel:** Explains *why* the prediction is spiking (e.g., Sub-zero temp: +40% fuel; Troop surge: +25% rations).
  * **"What-If" Simulation Slider:** Interactive slider to adjust temperature (-10°C to -35°C) or troop count to dynamically recalculate the stockout horizon in real time.
* **Data Shown:** Current inventory, daily burn-rate, estimated stockout date/time, ML model confidence (e.g., 94.2%), contributing factors.
* **Primary Actions:**
  * Adjust simulation sliders to demonstrate live AI responsiveness.
  * Export forecast projection into the Dispatch Planner as an automated replenishment requirement.

---

### 3.5. Inventory & Alerts (`/inventory`)
* **Purpose:** Real-time visibility into warehouse/depot and forward bunker stores with IoT sensor health and telemetry verification.
* **Key Components:**
  * **Consolidated Stock Table:** Multi-level filterable table showing Item Code, Category, Location, Quantity on Hand, Reorder Threshold, and Status Badge (Sufficient, Low, Depleted).
  * **IoT Telemetry Stream Panel:** Live data feed from smart liquid tanks (fuel depth, temperature), smart ammo containers (weight, humidity, seal status).
  * **Anomaly Diagnostic Modal:** Triggered on sensor alerts; displays raw sensor graph vs expected burn-rate to distinguish leaks from normal usage.
* **Data Shown:** Bulk fuel levels, ration packs (MRE), cold-weather combat gear count, ammunition crates, IoT sensor battery and signal strength (dBm).
* **Primary Actions:**
  * Acknowledge/Escalate sensor alerts.
  * Mark damaged storage containers out-of-order.
  * Initiate manual emergency replenishment request.

---

### 3.6. Dispatch Planner (`/dispatch`)
* **Purpose:** The core decision-action hub where automated AI replenishment recommendations are bundled into efficient, multi-drop convoy manifests for commander sign-off.
* **Key Components:**
  * **Pending AI Dispatch Recommendations:** Cards showing target posts, urgently needed items, and proposed departure windows.
  * **Convoy Manifest Builder:**
    * Vehicle allocation (e.g., 2x 2.5-Ton Trucks + 1x 5,000L POL Bowser).
    * Weight and volume capacity bar (e.g., "86% capacity utilized - OPTIMAL").
    * Multi-drop waypoint sequencing (Depot Garuda -> FP Agni -> FP Himmat).
  * **Commander Approval & Digital Signature Modal:** Executive summary, risk score, PIN input, and cryptographic stamp.
* **Data Shown:** Payload breakdown, fuel burn estimate, projected risk score, road pass timing, arrival ETAs.
* **Primary Actions:**
  * Reorder drop sequence or adjust truck cargo mix.
  * Run "Auto-Optimize" to re-cluster forward deliveries.
  * **Approve & Dispatch** (Commander role) or **Submit for Authorization** (Logistics Officer).

---

### 3.7. Reports & Analytics (`/reports`)
* **Purpose:** Auditability, operational post-mortems, and standard military reporting (Log-Sitrep export).
* **Key Components:**
  * **Logistics KPI Cards:** Mean Time to Replenish (MTTR), Forecast Accuracy % (MAE), Pass Diversion Frequency, Vehicle Utilization Rate.
  * **Historical Trend Charts:** 30-day stock vs consumption curves across sectors.
  * **Formal Log-Sitrep Generator:** One-click preview of formatted military daily situation reports.
* **Data Shown:** Aggregated logistics metrics, historical incident resolution logs, fuel efficiency analytics.
* **Primary Actions:**
  * Generate and print/download formal PDF/Print-friendly Log-Sitrep.
  * Filter reports by date range and sector.

---

### 3.8. Simulation Sandbox (`/sandbox` — Judge Demo Accelerator)
* **Purpose:** Dedicated demonstration control panel for the 2–3 minute hackathon pitch. Allows the presenter to inject live emergencies and watch the entire dashboard react synchronously.
* **Key Components:**
  * **Scenario Trigger Buttons:**
    1. *Trigger Blizzard Alert at FP Agni* (Simulates sudden temperature plummet).
    2. *Trigger Landslide Closure on Pass K-4* (Blocks active convoy route).
    3. *Trigger Fuel Leak on Tank-03 at FAP Rudra* (Fires ultrasonic IoT sensor alarm).
    4. *Reset to Baseline State* (Clean slate).
  * **Simulation Event Log:** Real-time log showing synthetic event injection and reactive system state updates.
* **Data Shown:** Event status, event timestamp, injected parameters.
* **Primary Actions:** Click-to-inject scenarios in 1 second; zero backend restart required.
