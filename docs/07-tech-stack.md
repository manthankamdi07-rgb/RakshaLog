# RakshaLog — Technology Stack Architecture & Rationale
**System:** AI-Driven Forward Logistics & Supply Chain Command Center  
**Context:** Smart India Hackathon 2026 | Problem Statement ID: 26251  
**Evaluation:** Alignment with Hackathon Speed, Visual Polish & Reliability  

---

## 1. Executive Summary & Stack Endorsement

Your proposed stack is **outstanding** for this hackathon problem statement. It provides the optimal balance of developer velocity, rock-solid stability during live judge evaluations, and high-impact visual aesthetics.

We strongly endorse your baseline choices with focused, tactical enhancements for mapping, state management, and real-time synchronization:

```
[ FRONTEND LAYER ]
React 18/19 (Vite) + TypeScript + Tailwind CSS + shadcn/ui (Radix UI)
    ├── Maps: MapLibre GL JS (Tactical Vector Canvas) or Leaflet (DarkMatter)
    ├── Charts: Recharts (Depletion curves & confidence bands)
    ├── Icons: Lucide React (Military / Logistics / Telemetry icons)
    └── State: Zustand (Global simulation state & role-switching)

[ BACKEND LAYER ]
Python 3.11+ / FastAPI
    ├── Validation: Pydantic v2 (Strict type contracts matching frontend)
    ├── Real-Time: FastAPI WebSockets (Live telemetry & event broadcast)
    ├── ML / Analytics: Scikit-learn / NumPy / Pandas (Synthetic burn-rate & route models)
    └── Server: Uvicorn (High-concurrency ASGI)
```

---

## 2. Component-by-Component Justification & Recommendations

### 2.1. Frontend Core: React (Vite) + TypeScript
* **Recommendation:** **Adopted (Zero changes)**
* **Why it wins:**
  * Sub-second Hot Module Replacement (HMR) allows instant styling adjustments.
  * Fast, lightweight production build that runs reliably on local laptop demo environments without cloud dependencies.
  * TypeScript enforces strict compliance with `docs/06-api-contract.md`, eliminating runtime `undefined` errors during presentations.

---

### 2.2. Styling & Design System: Tailwind CSS + shadcn/ui
* **Recommendation:** **Adopted (Zero changes)**
* **Why it wins:**
  * **shadcn/ui** gives us copy-paste ownership over Accessible Radix primitives (Dialogs, Selectors, Tabs, Drawers, Badges) styled in dark mode.
  * Seamless customization to our military command center palette (`#0B0F19` obsidian background, `#10B981` green, `#EF4444` danger pulse).
  * No heavy external UI framework lock-in; bundle size remains featherlight.

---

### 2.3. GIS Mapping: MapLibre GL JS vs. Leaflet
* **Recommendation:** **MapLibre GL JS (Recommended Primary)** with Leaflet as a quick fallback.
* **Comparison & Rationale:**
  * **Why MapLibre GL JS is superior for this specific military prototype:**
    1. **Vector Rendering Performance:** Renders continuous animated convoy tracks, hazard polygons, and route ribbons at a silky 60 FPS using WebGL.
    2. **Tactical Dark Cartography:** Direct support for dark basemaps (e.g., CARTO Dark Matter or MapLibre Demo Tiles) with custom glow layers (`line-blur`, `line-glow` for routes).
    3. **Pitch & Bearing (3D Mountain Pass Feel):** Allows subtle terrain tilting ($35^\circ$ pitch) to vividly convey high-altitude Himalayan passes (Zoji-La / Trishul Sector) to the judges.
  * *Contingency Note:* If offline tile caching without internet access is an issue during the physical hackathon venue, Leaflet with local cached OpenStreetMap/Dark tiles can be swapped with zero architectural changes.

---

### 2.4. Data Visualization: Recharts
* **Recommendation:** **Adopted (Zero changes)**
* **Why it wins:**
  * Declarative React components (`<ResponsiveContainer>`, `<AreaChart>`, `<ReferenceLine>`, `<Tooltip>`).
  * Seamlessly renders Days of Supply (DOS) depletion curves with shaded upper/lower confidence bands (essential for proving "AI Explainability" to DSSC judges).
  * Built-in smooth SVG transitions when adjusting "What-if" weather and troop sliders.

---

### 2.5. Client State Management: Zustand + TanStack Query
* **Recommendation:** **Zustand (Global Client State) + TanStack Query v5 (Server State)**
* **Why it wins:**
  * **Zustand** is just 1 KB with zero boilerplate. It is ideal for storing:
    * Current active Persona (`Maj. Rao` vs `Brig. Chauhan`).
    * Simulation Sandbox state (e.g., toggled blizzard or landslide flags).
    * Global alert drawer state and unread notifications count.
  * **TanStack Query** handles background caching, automated refetching, and graceful fallbacks if network connectivity wavers.

---

### 2.6. Backend Engine: FastAPI (Python)
* **Recommendation:** **Adopted (Zero changes)**
* **Why it wins:**
  * **Native ML Synergy:** The Problem Statement (PS 26251) emphasizes *AI/ML demand forecasting* and *integrated logistics*. Python is the undisputed standard for forecasting models (Exponential Smoothing, ARIMA, XGBoost, or Scikit-learn regressors). Keeping the API in Python eliminates cross-language serialization friction.
  * **Async WebSockets:** FastAPI provides clean, first-class WebSockets for broadcasting real-time IoT sensor telemetry and live convoy movement coordinates.
  * **Automated Swagger/OpenAPI:** Automatic interactive docs at `/docs` allow judges or teammates to inspect the live backend contract directly.

---

## 3. Directory Structure for Phase 2 Implementation

When approved for Phase 2, this is the clean, modular layout we will use:

```
rakshalog/
├── docs/                        # Complete Phase 1 Design & Architecture Specs
│   ├── 01-users-and-scenarios.md
│   ├── 02-sitemap-and-pages.md
│   ├── 03-user-flows.md
│   ├── 04-wireframes.md
│   ├── 05-ui-direction.md
│   ├── 06-api-contract.md
│   └── 07-tech-stack.md
│
├── frontend/                    # React (Vite) + Tailwind + shadcn/ui
│   ├── src/
│   │   ├── components/          # Reusable tactical UI (TopBar, Nav, MetricCards, Badges)
│   │   ├── modules/
│   │   │   ├── overview/        # Dashboard overview & readiness matrix
│   │   │   ├── map/             # MapLibre GIS tactical canvas & convoy inspector
│   │   │   ├── forecast/        # Recharts burn-rate & what-if simulator
│   │   │   ├── inventory/       # Stock tables & IoT sensor diagnostics
│   │   │   ├── dispatch/        # Multi-drop route optimizer & commander PIN modal
│   │   │   ├── reports/         # Sitrep preview & PDF export
│   │   │   └── sandbox/         # Hackathon 1-click scenario injectors
│   │   ├── stores/              # Zustand state (useAuthStore, useSimulationStore)
│   │   ├── lib/                 # Map configs, API client, color tokens
│   │   └── types/               # TypeScript interfaces matching docs/06-api-contract.md
│   ├── package.json
│   └── vite.config.ts
│
└── backend/                     # FastAPI Python Server
    ├── app/
    │   ├── api/                 # Endpoint routers (auth, overview, gis, forecast, dispatch)
    │   ├── ml/                  # Demand forecasting & anomaly detection algorithms
    │   ├── simulation/          # Synthetic scenario state engine & WebSocket broadcaster
    │   └── models/              # Pydantic data schemas
    ├── main.py
    └── requirements.txt
```

---

## 4. Hackathon Readiness & Demo Resilience Checklist

| Requirement | Strategy |
| :--- | :--- |
| **Zero-Internet Fallback** | Pre-bundled synthetic GeoJSON datasets & offline mock fallbacks in case venue WiFi drops. |
| **Pitch Speed (2–3 mins)** | Dedicated `/sandbox` accelerator triggers visual emergencies in 1 click without manual data entry. |
| **AI Explainability** | Recharts visualizes explicit breakdown of burn-rate drivers (temperature drop + troop count). |
| **Tamper-Evident Authority** | Simulated SHA-256 digital signature stamp on commander dispatch approvals. |
