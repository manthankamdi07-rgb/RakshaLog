# RakshaLog — UI Wireframes & Layout Architecture
**System:** AI-Driven Forward Logistics & Supply Chain Command Center  
**Context:** Smart India Hackathon 2026 | Problem Statement ID: 26251  
**Design Target:** Desktop/Laptop (1440px+ primary), with Tablet (768px - 1024px) adaptive layouts.

---

## 1. Global Shell Layout (Standard across all authenticated pages)

```
+---------------------------------------------------------------------------------------------------+
|  [LOGO] RAKSHALOG  |  SECTOR: TRISHUL (NORTH)  |  STATUS: ENCRYPTED MESH [● 99.8%]  |  18-OCT-2026 16:50  |
|  [CRITICAL ALERT BANNER: Pass K-4 Closed Due to Landslide | 1 Convoy Affected]              [DISMISS]  |
+---------------------+-----------------------------------------------------------------------------+
| [COLLAPSIBLE NAV]   | BREADCRUMBS: Sector Trishul > Command Overview             [Maj. Vikram Rao ▼] |
|                     +-----------------------------------------------------------------------------+
| [⊞] Overview        |                                                                             |
| [🗺] Map & Routes    |                                                                             |
| [📈] Demand Forecast |                         MAIN APPLICATION VIEW AREA                          |
| [📦] Inventory & IoT |                                                                             |
| [🚛] Dispatch Plan   |                                                                             |
| [📋] Log Reports    |                                                                             |
|                     |                                                                             |
| ------------------- |                                                                             |
| [⚡] Demo Sandbox    |                                                                             |
| [⚙] Settings        |                                                                             |
+---------------------+-----------------------------------------------------------------------------+
| [◀ Collapse]        | SYSTEM CLASSIFICATION: PROTOTYPE DEMO / SYNTHETIC DATA ONLY                 |
+---------------------+-----------------------------------------------------------------------------+
```

---

## 2. Authentication & Role Switcher (`/login`)

```
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|                                       +-----------------------------------+                       |
|                                       |           [LOGO] RAKSHALOG        |                       |
|                                       |    Tactical Logistics Command     |                       |
|                                       +-----------------------------------+                       |
|                                       | USERNAME: [ admin_s4            ] |                       |
|                                       | PASSWORD: [ •••••••••••••••     ] |                       |
|                                       | TOKEN:    [ SEC-9942            ] |                       |
|                                       |                                   |                       |
|                                       | [      AUTHENTICATE & ENTER     ] |                       |
|                                       +-----------------------------------+                       |
|                                       | --- FAST-TRACK DEMO PERSONAS ---  |                       |
|                                       | [👤 Maj. Rao (Logistics Officer)] |                       |
|                                       | [🎖 Brig. Chauhan (Commander)   ] |                       |
|                                       | [⚡ Capt. Sharma (Admin / IoT)   ] |                       |
|                                       +-----------------------------------+                       |
|                                       | System Status: Synthetic Testbed  |                       |
|                                       +-----------------------------------+                       |
|                                                                                                   |
+---------------------------------------------------------------------------------------------------+
```

---

## 3. Dashboard Overview (`/overview`)

```
+---------------------------------------------------------------------------------------------------+
| METRICS RIBBON                                                                                    |
| +-------------------+  +-------------------+  +-------------------+  +--------------------------+ |
| | AVG DAYS SUPPLY   |  | CRITICAL ALERTS   |  | ACTIVE CONVOYS    |  | BASE DEPOT UTILIZATION   | |
| |   14.2 Days [▲]   |  |   2 Urgent [!]    |  |   3 En Route      |  |   84% (Adequate)         | |
| +-------------------+  +-------------------+  +-------------------+  +--------------------------+ |
|                                                                                                   |
| +-----------------------------------------------------+  +--------------------------------------+ |
| | SECTOR READINESS HEATMAP (Days of Supply)           |  | ACTIVE INCIDENTS & SENSOR ALERTS     | |
| | Node          Class I (Rat) Class III (POL) Class V |  | [CRIT] POL-Tank-03 Rapid Drop (FAP)  | |
| | Base Garuda   [  28d  ]     [  24d  ]       [  45d] |  |        Leak detected. Action needed. | |
| | FP Agni       [  12d  ]     [   3d !]       [  18d] |  | [WARN] Pass K-4 Blizzard Warning     | |
| | FP Himmat     [   8d  ]     [  11d  ]       [  22d] |  |        Access risk in next 18 hrs.   | |
| | FAP Rudra     [  14d  ]     [   2d !]       [  30d] |  | [INFO] Convoy Vajra-2 Arrived FP-3   | |
| | Patrol North  [  19d  ]     [  16d  ]       [  25d] |  +--------------------------------------+ |
| +-----------------------------------------------------+  | AI RECOMMENDED ACTION (NEXT 6 HRS)   | |
|                                                          | [!] Pre-dispatch 6,000L Arctic Fuel  | |
| +-----------------------------------------------------+  |     to FP Agni before blizzard cut.  | |
| | MINI TACTICAL MAP PREVIEW                           |  |     Confidence: 94% | Impact: High   | |
| | [ Interactive Map with red alert beacon on Pass K4] |  |                                      | |
| |                                                     |  | [ REVIEW & STAGE DISPATCH PLAN -> ]  | |
| +-----------------------------------------------------+  +--------------------------------------+ |
+---------------------------------------------------------------------------------------------------+
```

---

## 4. Map & Routes (`/map`)

```
+---------------------------------------------------------------------------------------------------+
| [FILTER LAYERS: [x] Depots  [x] Forward Posts  [x] Convoys  [x] Weather/Passes  [ ] Topo Contours ]|
+-------------------------------------------------------------+-------------------------------------+
|                                                             | CONVOY INSPECTOR: VAJRA-4           |
|                                                             +-------------------------------------+
|                   [FP Agni]                                 | Status: IN TRANSIT                  |
|                      ▲                                      | Cargo: 4.8T Rations, Med Kits       |
|                     /                                       | Current Speed: 34 km/h              |
|        (Pass K-4) [X] (BLOCKED - Landslide)                 | ETA Destination: 18:45 hrs          |
|                   /  \                                      | Driver: Hav. Kuldeep Singh          |
|    [Bypass Route]    \                                      +-------------------------------------+
|           .           [Convoy Vajra-4]                      | ALTERNATE ROUTE RECOMMENDATION      |
|          .                                                  | Pass K-4 is BLOCKED (Rockfall)      |
|    [Depot Garuda]===================[FP Himmat]             |                                     |
|                                                             | [x] OPTION A: Valley Bypass Route-9 |
|                                                             |     +22 km | +40 min | Safety: 94%  |
|                                                             | [ ] OPTION B: High Ridge Trail      |
|                                                             |     +14 km | +65 min | Safety: 61%  |
|                                                             |                                     |
|                                                             | [  TRANSMIT REROUTE ORDER (PIN)  ]  |
|                                                             +-------------------------------------+
|                                                             | ELEVATION PROFILE: ROUTE TRISHUL    |
|                                                             | 14k ft |     /\                     |
|                                                             | 10k ft | ___/  \__/\___             |
+-------------------------------------------------------------+-------------------------------------+
```

---

## 5. Demand Forecast (`/forecast`)

```
+---------------------------------------------------------------------------------------------------+
| LOCATION: [ Forward Post Agni ▼ ]   SUPPLY CATEGORY: [ Class III: Arctic Fuel ▼ ]   TIMELINE: [ 14D ] |
+-------------------------------------------------------------------+-------------------------------+
| INVENTORY RUNWAY & PREDICTIVE BURN-RATE                           | ML PREDICTION DRIVERS         |
| Litres                                                            | Primary Driver Breakdown:     |
| 6,000 |-------------------------------\ (Nominal Burn Rate)       | • Temp drop to -18°C:   +38%  |
| 4,500 | [Current Level: 4,200L]       \                           | • Auxiliary Gen runtime: +18% |
| 3,000 |                                \                          | • Combat Alert Stance:   +10% |
| 1,500 |================== (Emergency Reserve: 1,500L)             |                               |
|     0 +------+------+------+------+------+------+------+          | Model Confidence: 94.2%       |
|      Day 1  Day 2  Day 3  Day 4  Day 5  Day 6  Day 7              | Projected Stockout: In 96 hrs |
|                            ▲ [STOCKOUT POINT WITHOUT INTERVENTION]|                               |
+-------------------------------------------------------------------+-------------------------------+
| WHAT-IF SCENARIO SIMULATOR (ADJUST ML COEFFICIENTS LIVE)                                          |
| Temperature Range:       [-18°C]  <======O============>  (-35°C to 0°C)                           |
| Stationed Troops:        [120]    <=========O=========>  (80 to 250 personnel)                    |
| Expected Blizzard Delay: [8 Days] <============O======>  (2 to 14 days road closure)              |
|                                                                                                   |
| RESULT: Projected Stockout shifts to: DAY 3 (-24 hrs faster)                                      |
| [ AUTO-GENERATE PRE-STOCKING REQUISITION TO DISPATCH PLANNER ]                                     |
+---------------------------------------------------------------------------------------------------+
```

---

## 6. Inventory & Alerts (`/inventory`)

```
+---------------------------------------------------------------------------------------------------+
| SEARCH ITEMS: [ search by code, name, post... ]  FILTER: [ All Categories ▼ ]  STATUS: [ Anomaly ▼]
+---------------------------------------------------------------------------------------------------+
| CONSOLIDATED INVENTORY LEDGER                                                                     |
| Item Code   Description       Location       On-Hand     Min-Safe    DOS     Status     Sensor    |
| POL-D-01    Arctic Diesel     FP Agni        4,200 L     4,000 L     3.2d    [CRITICAL] [IoT: OK] |
| POL-D-03    Bulk Tank Fuel    FAP Rudra      1,150 L     5,000 L     1.8d    [LEAK-ALRT][IoT: ERR]|
| RAT-MRE-A   High-Altitude MRE FP Himmat      1,850 pk    1,200 pk    14.0d   [NORMAL]   [RFID: OK]|
| AMM-762-B   7.62mm Linked Bel Base Garuda    85,000 rd   20,000 rd   45.0d   [OPTIMAL]  [RFID: OK]|
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
| [ MODAL OVERLAY: SENSOR ANOMALY DIAGNOSTIC - TANK POL-D-03 ]                                      |
| +-----------------------------------------------------------------------------------------------+ |
| | Sensor ID: US-TANK-03 | Location: FAP Rudra | Last Telemetry Ping: 20 sec ago                 | |
| | Reading: 120 L/hr rapid drop detected without registered pump activity.                       | |
| |                                                                                               | |
| | Graph: [ Real-time steep downward curve vs Flat expected curve ]                              | |
| |                                                                                               | |
| | Suggested Causes: 1. Structural Tank Rupture (89%)  2. Valve Leak (9%)  3. Sensor Fault (2%)   | |
| |                                                                                               | |
| | ACTIONS:                                                                                      | |
| | [ 🚨 TRIGGER LOCAL ALARM AT FAP RUDRA ]   [ 🚫 MARK TANK OFFLINE ]   [ FALSE ALARM / CLEAR ]  | |
| +-----------------------------------------------------------------------------------------------+ |
+---------------------------------------------------------------------------------------------------+
```

---

## 7. Dispatch Planner (`/dispatch`)

```
+---------------------------------------------------------------------------------------------------+
| PENDING REQUISITIONS (3)  |  OPTIMIZED CONVOY DRAFTS (1 PENDING APPROVAL)                         |
+---------------------------------------------------------------------------------------------------+
| DISPATCH PROPOSAL: #DP-2026-108 (Target: Sector Trishul North Outposts)                           |
| Multi-Drop Plan: Base Depot Garuda  -->  FP Agni (Drop 1)  -->  FP Himmat (Drop 2)                |
|                                                                                                   |
| CARGO & VEHICLE PACKING OPTIMIZATION:                                                             |
| Vehicle 1 (4x4 2.5-Ton):  [████████████████░░░░] 84% Weight | 4.2T (Class I Rations + Med Kits)   |
| Vehicle 2 (5,000L Bowser): [██████████████████░░] 92% Volume | 4,600L Arctic Grade Fuel            |
|                                                                                                   |
| CONVOY TIMELINE & WAYPOINTS:                                                                      |
| [Depot Garuda: 06:00] ----(3.5 hrs)----> [FP Agni: 09:30] ----(2.0 hrs)----> [FP Himmat: 12:30]   |
|                                                                                                   |
| EFFICIENCY GAINS:                                                                                 |
| • Consolidated 2 single trips into 1 multi-drop run                                               |
| • Saved: 68 km total convoy movement | Fuel saved: 140 L                                          |
| • Route Weather Clearance: Pass K-4 bypassed; 100% green corridor verified                        |
|                                                                                                   |
| AUTHORIZATION GATE (Commander Role):                                                              |
| Enter Commander Authorization PIN: [ • • • • ]                                                    |
| [  AUTHORIZED & DISPATCH CONVOY  ]         [  REQUEST S4 REVISION  ]                              |
+---------------------------------------------------------------------------------------------------+
```

---

## 8. Reports & Analytics (`/reports`)

```
+---------------------------------------------------------------------------------------------------+
| TIME RANGE: [ Last 30 Days ▼ ]   SECTOR: [ Trishul Sector (North) ▼ ]   [ EXPORT SITREP (PDF) ]   |
+---------------------------------------------------------------------------------------------------+
| LOGISTICS RESILIENCY SCORECARDS                                                                   |
| +---------------------+ +---------------------+ +---------------------+ +-----------------------+ |
| | FORECAST ACCURACY   | | MEAN REPLENISH TIME | | PASS REROUTE TIME   | | ASSET UTILIZATION     | |
| |   94.6% (+3.2%)     | |   14.2 Hours        | |   18 Min (Decided)  | |   87.4% Pack Ratio    | |
| +---------------------+ +---------------------+ +---------------------+ +-----------------------+ |
|                                                                                                   |
| FORMAL LOG-SITREP PREVIEW (MILITARY STANDARD FORMAT)                                              |
| +-----------------------------------------------------------------------------------------------+ |
| | CONFIDENTIAL - INTERNAL USE ONLY                                                              | |
| | DAILY LOGISTICS SITUATION REPORT (LOG-SITREP) - SECTOR TRISHUL                                | |
| | DTG: 181650H OCT 2026                                                                         | |
| | 1. OVERALL SUSTAINABILITY STATE: SATISFACTORY (AVERAGE 14.2 DOS)                               | |
| | 2. CRITICAL DEFICIENCIES: FP AGNI POL DEFICIT MITIGATED BY DISPATCH #DP-108.                  | |
| | 3. ROUTE STATUS: PASS K-4 IMPASSABLE DUE TO LANDSLIDE. DIVERSION 9 ACTIVE.                    | |
| | 4. INVENTORY INTEGRITY: FAP RUDRA POL TANK-03 ISOLATED DUE TO INTEGRITY BREACH.               | |
| +-----------------------------------------------------------------------------------------------+ |
+---------------------------------------------------------------------------------------------------+
```

---

## 9. Simulation Sandbox (`/sandbox` — Hackathon Pitch Accelerator)

```
+---------------------------------------------------------------------------------------------------+
| HACKATHON LIVE DEMO EVENT INJECTOR (Single-Click Anomaly Simulation)                              |
+---------------------------------------------------------------------------------------------------+
| Click any scenario button below to instantly trigger state changes across all dashboard pages:   |
|                                                                                                   |
| [ ⚡ 1. TRIGGER BLIZZARD ALERT (FP AGNI) ]   --> Spikes burn rate, drops DOS from 12d to 3d       |
| [ ⚡ 2. TRIGGER LANDSLIDE AT PASS K-4    ]   --> Blocks route, triggers live convoy reroute alert |
| [ ⚡ 3. TRIGGER FUEL TANK LEAK (RUDRA)   ]   --> Fires ultrasonic IoT sensor rapid drop alarm     |
| [ ⚡ 4. AUTO-STABILIZE / RESET TO NORMAL ]   --> Restores clean nominal operational baseline      |
|                                                                                                   |
| LIVE EVENT LOG STREAM:                                                                            |
| [16:50:12] INJECTOR: Initialized baseline synthetic dataset (7 nodes, 3 convoys, 18 sensors).     |
| [16:50:45] EVENT: Landslide triggered on Node PASS-K4. Status changed from OPEN to IMPASSABLE.    |
| [16:50:46] SYSTEM: Route Engine recomputed 2 alternate paths for Convoy Vajra-4.                  |
+---------------------------------------------------------------------------------------------------+
```

---

## 10. Tablet Breakpoint Layout (768px – 1024px)
* **Sidebar:** Collapses to an icon-only rail or top sliding hamburger drawer.
* **Metrics Ribbon:** 4 cards wrap to a $2 \times 2$ grid.
* **Dashboard Overview:** Sector Readiness Heatmap and Alert feed stack vertically rather than side-by-side.
* **Map View:** Convoy Inspector panel becomes a collapsible bottom sheet drawer instead of a wide right sidebar.
* **Touch Targets:** Minimum 44px $\times$ 44px hit-areas for all primary authorization and filter buttons.
