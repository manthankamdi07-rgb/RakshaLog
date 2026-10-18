# RakshaLog — User Flows & Operational Sequence Diagrams
**System:** AI-Driven Forward Logistics & Supply Chain Command Center  
**Context:** Smart India Hackathon 2026 | Problem Statement ID: 26251  

---

## 1. High-Level System Architecture & Event Flow

This diagram illustrates how IoT sensor data, weather feeds, GIS terrain data, and AI/ML models combine to drive user decision-making across the platform.

```mermaid
graph TD
    subgraph Data Feeds & IoT Layer
        S1[IoT Storage Transducers<br/>Tank Levels / Ammo RFID] --> Ingest[Telemetry Ingestion Engine]
        S2[Road Geotechnical Sensors<br/>Pass K-4 Landslide Detectors] --> Ingest
        S3[Tactical Weather API<br/>Temp, Blizzard & Snowpack] --> Ingest
        S4[Convoy GPS & Telematics<br/>Speed, Location, Fuel] --> Ingest
    end

    subgraph AI & Analytics Core
        Ingest --> ML1[Demand Forecasting Model<br/>Burn-rate & Days of Supply]
        Ingest --> ML2[Anomaly Detection Engine<br/>Leak / Theft / Sensor Fault]
        Ingest --> GIS[GIS Logistics Routing Engine<br/>Terrain, Pass Status, Slope]
        ML1 --> Opt[Dispatch Optimizer<br/>Vehicle Packing & Multi-Drop]
    end

    subgraph Command Center Frontend
        ML1 --> UI_Forecast[Demand Forecast View]
        ML2 --> UI_Alerts[Inventory & Alerts Panel]
        GIS --> UI_Map[Tactical GIS Map]
        Opt --> UI_Dispatch[Dispatch Planner]
        
        UI_Alerts --> LogOff[Logistics Officer Maj. Rao]
        UI_Forecast --> LogOff
        UI_Map --> LogOff
        UI_Dispatch --> Cmdr[Commander Brig. Chauhan]
        
        LogOff -->|Review & Stage Plan| UI_Dispatch
        Cmdr -->|1-Click Authorize| Exec[Cryptographic Order Stamped]
    end
```

---

## 2. Scenario A Flow: Predicting a Forward Stock Shortage

```mermaid
flowchart TD
    Start([Weather Feed: Western Disturbance Blizzard Detected]) --> Ingest[System Correlates Temp Drop & Route Freeze Window]
    Ingest --> ML[ML Engine Calculates Burn-rate at FP Agni<br/>Heater Fuel Demand +38%]
    ML --> Threshold{Days of Supply <br/>DOS < 5 Days?}
    
    Threshold -- Yes --> Alert[Trigger Predictive Alert in Dashboard<br/>FP Agni: Fuel Stockout in 96 Hours]
    Alert --> LogOfficer[Logistics Officer Sees Alert on Overview]
    
    LogOfficer --> DrillDown[Navigates to /forecast Page]
    DrillDown --> Inspect[Examines Depletion Curve & Confidence Band]
    Inspect --> Simulate[Toggles 'What-If' Weather Slider<br/>Validates 8-Day Isolation Scenario]
    
    Simulate --> AutoPlan[Click: Generate Pre-Stocking Requirement]
    AutoPlan --> DispatchStaging[Plan Sent to /dispatch as Pending Draft<br/>6,000L Arctic Diesel / 2 Heavy Trucks]
    DispatchStaging --> End([Ready for Commander Authorization])
```

---

## 3. Scenario B Flow: Rerouting an Active Convoy Due to Pass Closure

```mermaid
flowchart TD
    SensorTrigger([IoT Geotechnical Sensor: Rockfall at Pass K-4]) --> GISUpdate[GIS Engine flags Pass K-4 as IMPASSABLE]
    GISUpdate --> ConvoyCheck{Active Convoys <br/>on Route?}
    
    ConvoyCheck -- Convoy Vajra-4 In Transit --> PulseAlert[Map Interface Pulses Red Hazard Beacon]
    PulseAlert --> OfficerMap[Logistics Officer views /map]
    
    OfficerMap --> SelectConvoy[Click Convoy Vajra-4 Marker]
    SelectConvoy --> ComputeRoutes[GIS Engine Calculates 2 Alternate Corridors]
    
    ComputeRoutes --> Compare[System Displays Side-by-Side Comparison<br/>Option A: Valley Bypass 94% Safety, +22km<br/>Option B: High Ridge Pass 61% Safety, +14km]
    
    Compare --> PickOption[Officer selects Recommended Option A]
    PickOption --> ConfirmReroute[Click: Transmit Reroute Order]
    
    ConfirmReroute --> CommsDispatch[Tactical Data Link pushes new waypoints to Convoy]
    CommsDispatch --> MapGreen[Route line updates to Green Active on Map]
    MapGreen --> EndB([Convoy safely diverts via Valley Bypass])
```

---

## 4. Scenario C Flow: IoT Sensor Alert & Leak Isolation

```mermaid
flowchart TD
    IoT([Ultrasonic Sensor on POL-Tank-03: Sudden Drop 120L/hr]) --> Telemetry[Data Ingested by Alert Engine]
    Telemetry --> PumpGateCheck{Digital Dispense Gate <br/>Valves Open?}
    
    PumpGateCheck -- No Dispense Active --> Anomaly[Anomaly Detected: 89% Probability Puncture/Leak]
    PumpGateCheck -- Yes Dispense Active --> Normal[Legitimate Burn Recorded]
    
    Anomaly --> Banner[Audio-Visual Red Flash on Top Bar<br/>CRITICAL: POL Tank-03 Anomaly at FAP Rudra]
    Banner --> ClickAlert[Logistics Officer Clicks Alert Banner]
    
    ClickAlert --> Modal[Anomaly Diagnostic Modal Opens]
    Modal --> ViewGraph[Officer Views Sensor Trace vs Normal Baseline]
    ViewGraph --> ActionChoice{Select Operational Action}
    
    ActionChoice -- Emergency Isolation --> TriggerSiren[Send Alert to FAP Rudra Local Guard Post]
    ActionChoice -- Quarantine Storage --> OfflineTank[Mark Tank-03 OFFLINE in System Ledger]
    
    TriggerSiren --> UpdateLedger[Ledger updates available fuel capacity immediately]
    OfflineTank --> UpdateLedger
    UpdateLedger --> EndC([Prevent downstream dispatches from corrupted tank])
```

---

## 5. Scenario D Flow: Commander Approval of Consolidated Dispatch Plan

```mermaid
flowchart TD
    ScheduleTrigger([18:00 hrs Daily Automated Optimization Run]) --> Cluster[ML Optimizer Clusters 3 Forward Outposts<br/>FP Agni + FP Himmat + Patrol Base Trishul]
    Cluster --> VehiclePack[Optimizer Packs 2x 2.5-Ton Trucks<br/>Weight: 88% Vol: 82%]
    VehiclePack --> CreateProposal[Dispatch Proposal #DP-2026-108 Generated]
    
    CreateProposal --> CmdrLogin[Brig. Chauhan logs in with Commander Role]
    CmdrLogin --> Badge[Review Banner: 1 Consolidated Plan Pending]
    
    Badge --> OpenDispatch[Navigates to /dispatch Planner]
    OpenDispatch --> ReviewKPI[Reviews Route Safety, Turnaround & Saved Fuel]
    ReviewKPI --> InspectDrops[Inspects Multi-Drop Sequence & Cargo Manifest]
    
    InspectDrops --> Decision{Commander Decision}
    Decision -- Request Revision --> AddComment[Send Back to S4 with notes]
    Decision -- Approve --> EnterPIN[Input Commander Authorization PIN]
    
    EnterPIN --> Stamp[System Generates Cryptographic Hash Signature]
    Stamp --> LockPlan[Plan Status: AUTHORIZED & LOCKED]
    LockPlan --> PushDepot[Digital Manifest Pushed to Depot Garuda Loading Bay]
    PushDepot --> EndD([Convoy Loading Begins According to Optimized Schedule])
```
