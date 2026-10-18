# RakshaLog — Users & Operational Scenarios
**System:** AI-Driven Forward Logistics & Supply Chain Command Center  
**Context:** Smart India Hackathon 2026 | Problem Statement ID: 26251  
**Classification:** Prototype / Synthetic Data Only (Unclassified)

---

## 1. User Personas & Roles

### Persona 1: Logistics & Supply Operations Officer (Brigade S4 / DADOS)
* **Designation:** Maj. Vikram Rao, Brigade Logistics Officer
* **Operational Scope:** Responsible for day-to-day inventory balance, depot readiness, convoy scheduling, and consumable burn-rates across 1 Base Depot and 6 Forward Operating Posts (FOPs).
* **Primary Goals:**
  * Prevent stockouts of mission-critical Class I (Rations), Class III (POL - Petroleum, Oil & Lubricants), and Class V (Ammunition) items.
  * Plan, bundle, and dispatch forward convoys with maximum payload utilization and minimal turnaround time.
  * Rapidly resolve stock mismatches and sensor anomalies before they escalate to operational vulnerabilities.
* **Key Pain Points:**
  * Fragmented visibility: Weather, road passability, consumption trends, and fleet availability are managed in separate spreadsheets or verbal radio sitreps.
  * Reactive firefighting: Learning about fuel or winter-ration depletion only after posts enter emergency reserve status.
  * High manual overhead in compiling daily logistics state reports (Log-Sitreps).

---

### Persona 2: Formation Commander / Operational Decision-Maker
* **Designation:** Brig. R. S. Chauhan, Sector / Brigade Commander
* **Operational Scope:** Tactical command across Sector Trishul; operational readiness, troop sustainment, risk posture, and emergency asset allocations.
* **Primary Goals:**
  * Instant, high-level overview of combat readiness and sustainability days (Days of Supply - DOS) across all tactical units.
  * Rapid validation and one-click authorization of AI-generated dispatch plans, high-risk convoy movements, and alternate-route diversions.
  * Zero surprise stockouts during operational build-ups or adverse weather lockdowns.
* **Key Pain Points:**
  * Information overload: Flooded with granular logistics data when only actionable risk assessments and decision gates are needed.
  * Lagged decision cycles: By the time paper/radio dispatch manifests reach approval, mountain weather windows have already closed.
  * Lack of confidence in black-box recommendations without clear "why" explanations (e.g., weather forecast confidence vs. consumption variance).

---

### Persona 3: Systems, Telemetry & Cyber Admin
* **Designation:** Capt. Neha Sharma, Logistics Technical & Signals Officer
* **Operational Scope:** Manages the IoT sensor mesh (smart fuel tank transducers, RFID container monitors, gateway repeaters), ML pipeline health, and synthetic simulation parameters for hackathon testing.
* **Primary Goals:**
  * Ensure 99.9% telemetry uptime across dispersed IoT nodes and tactical edge gateways.
  * Monitor AI/ML demand forecasting model drift, confidence intervals, and synthetic data injection.
  * Manage role-based access control (RBAC), offline data synchronization state, and tamper/fail-safe alert triggers.
* **Key Pain Points:**
  * High packet drop and intermittent latency over tactical line-of-sight and satellite uplinks.
  * Sensor false positives (e.g., fuel level sloshing during vehicle movement misread as rapid drainage).
  * Need for intuitive controls to demo "what-if" operational scenarios (e.g., trigger simulated landslide or sensor fault during pitch).

---

## 2. Core Operational Scenarios (Demo-Focused)

The core principle guiding every scenario is the **Command Decision Triad**:  
$$\text{See Problem (Alert/Map)} \longrightarrow \text{Understand Prediction (AI Forecast)} \longrightarrow \text{Approve Action (Dispatch/Reroute)}$$

```
+---------------------+     +--------------------------+     +------------------------+
| 1. SEE PROBLEM      | --> | 2. UNDERSTAND PREDICTION | --> | 3. APPROVE ACTION      |
| Telemetry / Weather |     | AI ML Burn-rate & Route  |     | One-click dispatch /   |
| anomaly detected    |     | impact projected in DOS  |     | digital convoy orders  |
+---------------------+     +--------------------------+     +------------------------+
```

---

### Scenario A: Predicting a Stock Shortage at a Forward Post
* **Location:** Forward Post (FP) Agni (Altitude: 13,800 ft, snowbound sector)
* **Trigger:** Weather telemetry indicates an intense Western Disturbance blizzard arriving in 72 hours, which will close local access routes for 7–10 days.
* **Narrative:**
  1. **See:** Maj. Vikram Rao opens the **RakshaLog Command Overview**. An amber predictive warning flashes: *FP Agni: Class III (Special Winter Diesel - Arctic Grade) Stockout Alert projected in 96 hours*.
  2. **Understand:** Maj. Rao drills into the **Demand Forecast** view. The ML model combines 3 data streams:
     * Current storage: 4,200 Litres (nominally safe for 6 days under average conditions).
     * Temperature drop forecast (-18°C): increases Arctic generator burn-rate by 38%.
     * Expected road block: 8-day access cutoff.
     * The model plots the depletion curve: stock will hit critical zero on Day 4 of the blizzard.
  3. **Act:** The system automatically drafts a pre-emptive replenishment recommendation: *Dispatch 6,000L POL via 2x 4x4 Heavy Mobility Vehicles from Base Depot Garuda within next 18 hours*. Maj. Rao reviews the plan and queues it for the Commander's authorization.

---

### Scenario B: Rerouting an Active Convoy Due to Sudden Pass Closure
* **Location:** Route Trishul-North (Connecting Depot Garuda to Post Himmat via pass "Pass K-4")
* **Trigger:** Mountain IoT geotechnical sensor and Border Roads telemetry detect early-stage landslide activity and severe avalanche risk at Pass K-4.
* **Narrative:**
  1. **See:** On the **Map & Routes** page, Route Segment K-4 turns pulsing red. Convoy *Vajra-4* (3 trucks carrying rations & medical kits) is currently 32 km from the danger zone.
  2. **Understand:** The GIS Logistics engine marks Pass K-4 as impassable (estimated clearance: 36 hours). The system automatically evaluates 2 alternate corridors:
     * *Option A (Valley Bypass Route-9):* +22 km, +45 mins travel time, 94% road stability rating, all bridges rated for Class 40 loads.
     * *Option B (High Ridge Pass):* +14 km, high crosswind risk, unpaved.
     * The AI highlights Option A as the recommended contingency route.
  3. **Act:** Maj. Rao selects Option A. The system issues a reroute order with updated waypoint GPS coordinates and automated cryptographic situational notification to Convoy Commander *Vajra-4*. The map dynamically updates the route ribbon to verified green.

---

### Scenario C: Instant Critical Alert from an IoT Storage Sensor
* **Location:** Base Forward Ammunition Point (FAP) Rudra
* **Trigger:** Ultrasonic liquid level transducer on bulk storage tank POL-Tank-03 reports an uncharacteristic drop rate of 120 Litres/hour with zero authorized fuel pump dispensing activity.
* **Narrative:**
  1. **See:** A high-priority audible and red visual banner interrupts the dashboard: *CRITICAL ANOMALY: POL-Tank-03 Rapid Depletion / Suspected Structural Breach at FAP Rudra*.
  2. **Understand:** The **Inventory & Alerts** panel correlates the IoT sensor telemetry with the digital dispensing gate log. Zero gate valves are open, ruling out scheduled consumption. The anomaly detection model flags an 89% probability of physical tank puncture or valve seal failure.
  3. **Act:** Maj. Rao taps *Acknowledge & Escalate*. The system triggers a local siren at FAP Rudra's guard post, provides the exact geo-coordinates of Tank-03, and prompts the quick isolation valve protocol. Simultaneously, the system automatically marks Tank-03 offline in the inventory ledger to prevent scheduling future dispatches from this damaged node.

---

### Scenario D: High-Level Approval of Consolidated Multi-Drop Dispatch Plan
* **Location:** Sector Headquarters (Brigade Ops Room)
* **Trigger:** 18:00 hrs Daily Automated Logistics Optimization Run.
* **Narrative:**
  1. **See:** Brig. R. S. Chauhan logs into the **Commander Dashboard** on a secure tablet. A consolidated notification appears: *Pending Authorization: 48-Hour Replenishment Plan #DP-2026-108*.
  2. **Understand:** Brig. Chauhan inspects the **Dispatch Planner** summary view:
     * 3 Forward Outposts (FP Agni, FP Himmat, Patrol Base Trishul) bundled into a single multi-drop convoy *Vajra-Express*.
     * Asset efficiency: 88% vehicle weight utilization (compared to 52% with ad-hoc dispatches).
     * Total distance optimized: Saves 64 km and ₹1.4L in fuel burn.
     * All forward outposts projected to stay above 15 Days of Supply (DOS) through the upcoming week.
  3. **Act:** Brig. Chauhan notes the AI rationale breakdown, inputs his digital authorization PIN, and clicks **Approve & Dispatch**. The order is stamped with a cryptographic hash, locked against tampering, and pushed directly to Depot Garuda's loading bay manifest system.
