export type UserRole = 'LOGISTICS_OFFICER' | 'COMMANDER' | 'ADMIN';

export interface UserPersona {
  id: string;
  name: string;
  rank: string;
  role: UserRole;
  title: string;
  avatarInitials: string;
  sector: string;
}

export type SupplyCategory = 'CLASS_I_RATIONS' | 'CLASS_III_POL' | 'CLASS_V_AMMO' | 'CLASS_II_WINTER_GEAR' | 'CLASS_VIII_MEDICAL';

export type NodeStatus = 'OPTIMAL' | 'ADEQUATE' | 'CRITICAL' | 'ISOLATED';

export interface TacticalNode {
  id: string;
  name: string;
  type: 'BASE_DEPOT' | 'FORWARD_OUTPOST' | 'AMMUNITION_POINT' | 'PATROL_BASE';
  coordinates: [number, number]; // [lat, lng]
  elevationFt: number;
  dosClassI: number;
  dosClassIII: number;
  dosClassV: number;
  status: NodeStatus;
  threatLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  accessPass: string;
}

export interface Convoy {
  id: string;
  callsign: string;
  driver: string;
  originId: string;
  destinationId: string;
  coordinates: [number, number];
  speedKmh: number;
  payloadTonnes: number;
  cargoSummary: string;
  routeId: string;
  status: 'IN_TRANSIT' | 'REROUTE_RECOMMENDED' | 'DIVERTED' | 'ARRIVED';
  assignedVehicles: string;
  eta: string;
}

export interface AlertItem {
  id: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  category: 'IOT_LEAK' | 'WEATHER_TERRAIN' | 'PREDICTIVE_DEPLETION' | 'CONVOY';
  sourceNode: string;
  targetAsset: string;
  headline: string;
  detail: string;
  timestamp: string;
  acknowledged: boolean;
  actionRequired: boolean;
}

export interface ForecastPoint {
  day: number;
  label: string;
  normalBurnStock: number;
  predictedStock: number;
  lowerConfidence: number;
  upperConfidence: number;
  emergencyThreshold: number;
}

export interface InventoryItem {
  id: string;
  itemCode: string;
  name: string;
  category: SupplyCategory;
  locationNodeId: string;
  locationName: string;
  quantityOnHand: number;
  unit: string;
  reorderThreshold: number;
  dos: number;
  status: 'OPTIMAL' | 'ADEQUATE' | 'CRITICAL' | 'LEAK_ANOMALY';
  sensorId?: string;
  sensorHealth?: 'HEALTHY' | 'ANOMALY_ALARM' | 'OFFLINE';
  lastPing?: string;
}

export interface DispatchProposal {
  id: string;
  targetSector: string;
  status: 'PENDING_AUTHORIZATION' | 'AUTHORIZED' | 'IN_TRANSIT' | 'REVISION_REQUESTED';
  createdAt: string;
  departureWindow: string;
  stops: {
    sequence: number;
    nodeName: string;
    nodeId: string;
    dropCargo: string;
    etaHours: number;
  }[];
  vehicles: {
    type: string;
    count: number;
    weightCapacityPct: number;
    volumeCapacityPct: number;
  }[];
  efficiency: {
    distanceSavedKm: number;
    fuelSavedL: number;
    payloadUtilizationPct: number;
  };
  rationale: string;
  approvedBy?: string;
  digitalSignature?: string;
}
