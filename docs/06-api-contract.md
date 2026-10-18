# RakshaLog — API Contract & Data Schema Specification
**System:** AI-Driven Forward Logistics & Supply Chain Command Center  
**Context:** Smart India Hackathon 2026 | Problem Statement ID: 26251  
**Protocol:** RESTful JSON APIs + Real-Time WebSocket (`/ws/telemetry`)  
**Base URL:** `/api/v1`

---

## 1. Authentication & Role Switcher

### 1.1. Login / Fast-Track Role Switch
* **Endpoint:** `POST /api/v1/auth/session`
* **Purpose:** Authenticate or fast-track switch persona for judge demo.
* **Request Body:**
```json
{
  "role": "LOGISTICS_OFFICER", // "LOGISTICS_OFFICER" | "COMMANDER" | "ADMIN"
  "persona_id": "maj_vikram_rao",
  "demo_mode": true
}
```
* **Response (200 OK):**
```json
{
  "token": "eyJhGciOiJIUzI1NiIsIn...",
  "user": {
    "id": "USR-S4-01",
    "name": "Maj. Vikram Rao",
    "designation": "Brigade Logistics Officer (S4)",
    "role": "LOGISTICS_OFFICER",
    "permissions": ["VIEW_ALL", "DISPATCH_CREATE", "REROUTE_CONFIRM"],
    "sector": "Sector Trishul (North)"
  }
}
```

---

## 2. Overview & Real-Time Alerts

### 2.1. Sector Summary & Top Metrics
* **Endpoint:** `GET /api/v1/overview/metrics`
* **Response (200 OK):**
```json
{
  "sector_id": "SEC-TRISHUL-N",
  "timestamp": "2026-10-18T16:50:00Z",
  "average_days_of_supply": 14.2,
  "critical_alerts_count": 2,
  "active_convoys_count": 3,
  "depot_capacity_pct": 84.0,
  "nodes_status": [
    {
      "node_id": "NODE-DEPOT-GARUDA",
      "name": "Base Depot Garuda",
      "type": "BASE_DEPOT",
      "dos_class_i": 28.0,
      "dos_class_iii": 24.5,
      "dos_class_v": 45.0,
      "status": "OPTIMAL"
    },
    {
      "node_id": "NODE-FP-AGNI",
      "name": "Forward Post Agni",
      "type": "FORWARD_OUTPOST",
      "dos_class_i": 12.0,
      "dos_class_iii": 3.2,
      "dos_class_v": 18.0,
      "status": "CRITICAL"
    }
  ]
}
```

### 2.2. Alerts Feed
* **Endpoint:** `GET /api/v1/alerts`
* **Response (200 OK):**
```json
{
  "alerts": [
    {
      "id": "ALT-9041",
      "severity": "CRITICAL",
      "category": "IOT_LEAK",
      "source_node": "FAP Rudra",
      "target_asset": "POL-Tank-03",
      "headline": "Rapid Liquid Drop Detected without Gate Dispense",
      "detail": "Ultrasonic sensor US-03 reports -120 L/hr. Probability of rupture: 89%.",
      "timestamp": "2026-10-18T16:42:10Z",
      "acknowledged": false
    },
    {
      "id": "ALT-9042",
      "severity": "WARNING",
      "category": "WEATHER_TERRAIN",
      "source_node": "Pass K-4",
      "target_asset": "Route Trishul-North",
      "headline": "Western Disturbance Blizzard & Rockfall Risk",
      "detail": "Road passability index degraded to 12%. Pass closure impending.",
      "timestamp": "2026-10-18T16:30:00Z",
      "acknowledged": true
    }
  ]
}
```

---

## 3. GIS, Convoys & Route Rerouting

### 3.1. Get Tactical Map Layers
* **Endpoint:** `GET /api/v1/gis/tactical-state`
* **Response (200 OK):**
```json
{
  "nodes": [
    {
      "id": "NODE-FP-AGNI",
      "name": "Forward Post Agni",
      "coordinates": [34.5218, 76.9842],
      "elevation_ft": 13800,
      "status": "CRITICAL"
    }
  ],
  "routes": [
    {
      "id": "ROUTE-TRISHUL-MAIN",
      "name": "Route Trishul Main (via Pass K-4)",
      "status": "IMPASSABLE",
      "hazard_type": "LANDSLIDE",
      "coordinates": [
        [34.3120, 76.5120],
        [34.4100, 76.7200],
        [34.5218, 76.9842]
      ]
    }
  ],
  "convoys": [
    {
      "id": "CNV-VAJRA-4",
      "callsign": "Convoy Vajra-4",
      "driver": "Hav. Kuldeep Singh",
      "origin": "Base Depot Garuda",
      "destination": "FP Agni",
      "current_coordinates": [34.3820, 76.6100],
      "speed_kmh": 34,
      "payload_tonnes": 4.8,
      "cargo_summary": "Class I Rations & Winter Med Kits",
      "route_id": "ROUTE-TRISHUL-MAIN",
      "status": "REROUTE_REQUIRED"
    }
  ]
}
```

### 3.2. Calculate / Request Alternate Route
* **Endpoint:** `POST /api/v1/gis/reroute/compute`
* **Request Body:**
```json
{
  "convoy_id": "CNV-VAJRA-4",
  "avoid_hazard_id": "HAZ-LANDSLIDE-PASS-K4"
}
```
* **Response (200 OK):**
```json
{
  "convoy_id": "CNV-VAJRA-4",
  "recommended_route_id": "OPT-A",
  "options": [
    {
      "option_id": "OPT-A",
      "name": "Valley Bypass Corridor 9",
      "distance_delta_km": +22.4,
      "time_delta_mins": +45,
      "safety_rating_pct": 94.0,
      "max_elevation_ft": 10500,
      "road_grade_class": "Class 40 All-Weather",
      "coordinates": [[34.3820, 76.6100], [34.3950, 76.7500], [34.5218, 76.9842]]
    },
    {
      "option_id": "OPT-B",
      "name": "High Ridge Snow Trail",
      "distance_delta_km": +14.1,
      "time_delta_mins": +70,
      "safety_rating_pct": 61.2,
      "max_elevation_ft": 14200,
      "road_grade_class": "Class 10 Unpaved High Crosswinds",
      "coordinates": [[34.3820, 76.6100], [34.4600, 76.8100], [34.5218, 76.9842]]
    }
  ]
}
```

### 3.3. Transmit Official Reroute Order
* **Endpoint:** `POST /api/v1/gis/reroute/transmit`
* **Request Body:**
```json
{
  "convoy_id": "CNV-VAJRA-4",
  "chosen_route_id": "OPT-A",
  "authorized_by": "USR-S4-01"
}
```
* **Response (200 OK):**
```json
{
  "status": "TRANSMITTED",
  "dispatch_ack_id": "ACK-REROUTE-994",
  "timestamp": "2026-10-18T16:52:00Z",
  "convoy_status": "DIVERTING"
}
```

---

## 4. Demand Forecasting & What-If Simulation

### 4.1. Get Node Forecast Depletion Curve
* **Endpoint:** `GET /api/v1/forecast/:node_id?item_category=CLASS_III_POL&days=14`
* **Response (200 OK):**
```json
{
  "node_id": "NODE-FP-AGNI",
  "item_category": "CLASS_III_POL",
  "current_stock_litres": 4200,
  "emergency_threshold_litres": 1500,
  "model_confidence_pct": 94.2,
  "projected_stockout_hours": 96,
  "primary_drivers": [
    { "factor": "Sub-zero temperature drop (-18°C)", "impact_pct": 38.0 },
    { "factor": "Auxiliary heater runtime increase", "impact_pct": 18.5 },
    { "factor": "Road cutoff pre-allocation buffer", "impact_pct": 12.0 }
  ],
  "timeseries": [
    { "day": 1, "predicted_stock": 3850, "lower_bound": 3700, "upper_bound": 4000 },
    { "day": 2, "predicted_stock": 3100, "lower_bound": 2900, "upper_bound": 3300 },
    { "day": 3, "predicted_stock": 2100, "lower_bound": 1850, "upper_bound": 2350 },
    { "day": 4, "predicted_stock": 900,  "lower_bound": 600,  "upper_bound": 1200 },
    { "day": 5, "predicted_stock": 0,    "lower_bound": 0,    "upper_bound": 200 }
  ]
}
```

### 4.2. Run What-If Simulation
* **Endpoint:** `POST /api/v1/forecast/simulate`
* **Request Body:**
```json
{
  "node_id": "NODE-FP-AGNI",
  "temp_celsius": -25.0,
  "troop_count": 140,
  "road_closure_days": 10
}
```
* **Response (200 OK):**
```json
{
  "new_stockout_hours": 68,
  "delta_hours": -28,
  "urgency_level": "CRITICAL_IMMEDIATE",
  "suggested_dispatch_volume_litres": 6500
}
```

---

## 5. Inventory & IoT Telemetry Diagnostics

### 5.1. Get Inventory Items Ledger
* **Endpoint:** `GET /api/v1/inventory/items`
* **Response (200 OK):**
```json
{
  "items": [
    {
      "item_code": "POL-D-01",
      "name": "Arctic Grade High Pour Point Diesel",
      "category": "CLASS_III_POL",
      "location": "FP Agni",
      "quantity": 4200,
      "unit": "Litres",
      "dos": 3.2,
      "status": "CRITICAL",
      "sensor_id": "US-TANK-01",
      "sensor_health": "HEALTHY"
    },
    {
      "item_code": "POL-D-03",
      "name": "Bulk Strategic Reserve Fuel",
      "category": "CLASS_III_POL",
      "location": "FAP Rudra",
      "quantity": 1150,
      "unit": "Litres",
      "dos": 1.8,
      "status": "LEAK_ANOMALY",
      "sensor_id": "US-TANK-03",
      "sensor_health": "ALARM"
    }
  ]
}
```

### 5.2. IoT Anomaly Remediation Action
* **Endpoint:** `POST /api/v1/inventory/sensors/action`
* **Request Body:**
```json
{
  "sensor_id": "US-TANK-03",
  "action": "ISOLATE_TANK_OFFLINE", // "ISOLATE_TANK_OFFLINE" | "TRIGGER_LOCAL_SIREN" | "CLEAR_FALSE_ALARM"
  "reason": "Probable seal breach detected by ultrasonic telemetry drop"
}
```
* **Response (200 OK):**
```json
{
  "status": "SUCCESS",
  "tank_state": "OFFLINE",
  "inventory_adjusted": true,
  "message": "Tank POL-D-03 removed from active dispatch pool."
}
```

---

## 6. Dispatch Optimization & Authorization

### 6.1. Get Proposed Dispatch Plans
* **Endpoint:** `GET /api/v1/dispatch/proposals`
* **Response (200 OK):**
```json
{
  "proposals": [
    {
      "plan_id": "DP-2026-108",
      "status": "PENDING_AUTHORIZATION",
      "created_at": "2026-10-18T16:00:00Z",
      "origin": "Base Depot Garuda",
      "stops": [
        { "step": 1, "node": "FP Agni", "drop_items": "4,600L Fuel, 1.2T MRE" },
        { "step": 2, "node": "FP Himmat", "drop_items": "2.8T Rations & Medical" }
      ],
      "vehicles": [
        { "vehicle_type": "4x4 2.5-Ton Heavy Truck", "count": 1, "weight_capacity_pct": 84.0 },
        { "vehicle_type": "5,000L Arctic POL Bowser", "count": 1, "volume_capacity_pct": 92.0 }
      ],
      "efficiency": {
        "distance_saved_km": 68,
        "fuel_saved_litres": 140,
        "payload_utilization_pct": 88.0
      },
      "risk_score": 14.5
    }
  ]
}
```

### 6.2. Commander Authorization Gate
* **Endpoint:** `POST /api/v1/dispatch/:plan_id/authorize`
* **Request Body:**
```json
{
  "commander_id": "USR-CMDR-01",
  "pin_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "operational_directive": "EXECUTE_IMMEDIATE"
}
```
* **Response (200 OK):**
```json
{
  "plan_id": "DP-2026-108",
  "status": "AUTHORIZED",
  "authorization_signature": "SHA256:7a9f82d1c5e...STAMPED_BRIG_CHAUHAN",
  "timestamp": "2026-10-18T16:53:00Z",
  "manifest_url": "/api/v1/dispatch/DP-2026-108/manifest.pdf"
}
```

---

## 7. Demo Simulation Sandbox Controls

### 7.1. Inject Scenario Event
* **Endpoint:** `POST /api/v1/sandbox/inject`
* **Request Body:**
```json
{
  "scenario_type": "LANDSLIDE_PASS_K4" // "BLIZZARD_FP_AGNI" | "LANDSLIDE_PASS_K4" | "FUEL_LEAK_RUDRA" | "RESET_BASELINE"
}
```
* **Response (200 OK):**
```json
{
  "event_id": "SIM-EVT-04",
  "scenario": "LANDSLIDE_PASS_K4",
  "affected_nodes": ["NODE-PASS-K4", "CNV-VAJRA-4"],
  "state_broadcasted_to_ws": true
}
```

---

## 8. Real-Time WebSocket Channel (`/ws/telemetry`)
* **Connection URL:** `ws://localhost:8000/ws/telemetry`
* **Message Format:** JSON frames with event typing:
```json
{
  "event": "TELEMETRY_UPDATE",
  "payload": {
    "convoy_telemetry": [
      { "convoy_id": "CNV-VAJRA-4", "lat": 34.3855, "lng": 76.6145, "speed": 32 }
    ],
    "sensor_stream": [
      { "sensor_id": "US-TANK-03", "current_value": 1130, "unit": "Litres", "delta_1h": -120 }
    ]
  }
}
```
