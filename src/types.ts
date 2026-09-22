export type PriorityMode = 'energy-weighted' | 'crop-weighted' | 'recovery mode';

export interface AgriPvSite {
  id: string;
  name: string;
  location: string;
  totalHectares: number;
  installedPVPowermWp: number;
  primaryCrops: string[];
  pvStructureType: 'Elevated Agrivoltaic Trackers (4.2m clearance)' | 'East-West Vertical Bifacial' | 'Fixed High-Clearance Canopy';
  trackerRowCount: number;
  activeSensorsCount: number;
}

export interface EnergyTelemetry {
  liveKw: number;
  ratedCapacityKw: number;
  dailyYieldMWh: number;
  gridExportRateDollars: number;
  hourlyTrend: { hour: string; generationKw: number; solarIrradianceGHI: number }[];
}

export interface MicroclimateMetric {
  current: number;
  unit: string;
  historical24h: { time: string; value: number }[];
  status: 'optimal' | 'warning' | 'critical';
}

export interface ZoneMicroclimate {
  zoneId: string;
  zoneName: string;
  crop: string;
  cropStage: string;
  soilMoisture: MicroclimateMetric; // %
  temperature: MicroclimateMetric; // °C
  humidity: MicroclimateMetric; // %
  lightLevelPAR: MicroclimateMetric; // µmol/m²/s
  waterUsageLitersPerM2: number;
  waterSavingsVsBaselinePercent: number;
  panelTiltAngle: number; // in degrees (-45 to +45)
  targetTiltAngle: number;
  shadingPercentage: number;
}

export interface PanelTiltStatus {
  currentAngle: number;
  targetAngle: number;
  mode: 'Dual-Objective Agro-Tracking' | 'Max Solar Irradiance' | 'Canopy Heat Protection' | 'Hail/Wind Stow';
  trackerHealth: 'All 32 Rows Aligned' | '1 Row Motor Calibration Needed';
  windSpeedMs: number;
  maxSafeWindSpeedMs: number;
  isStowActive: boolean;
}

export interface WaterTelemetry {
  liveFlowRateLpm: number;
  dailyTotalM3: number;
  moisturePercent: number;
  efficiencyGainPercent: number;
  isWateringActive: boolean;
  isSnoozed: boolean;
}

export interface CvDetectedIssue {
  id: string;
  type: 'disease' | 'pest' | 'nutrient-deficiency';
  name: string;
  crop: string;
  confidencePercent: number;
  zone: string;
  timestamp: string;
  imageUrl: string;
  symptoms: string;
  suggestedMitigation: string;
  status: 'active' | 'investigating' | 'treated';
}

export interface DeviceSensor {
  id: string;
  name: string;
  category: 'Inverter' | 'Single-Axis Tracker' | 'Pyranometer / PAR' | 'Multi-Depth Soil Probe' | 'LoRaWAN Gateway';
  model: string;
  firmwareVersion: string;
  connectorVersion: string;
  status: 'online' | 'offline' | 'warning';
  zone: string;
  batteryOrSignal: string;
  lastHeartbeat: string;
}

export type RecommendationUrgency = 'High' | 'Moderate' | 'Low';
export type RecommendationStatus = 'pending' | 'approved' | 'rejected' | 'auto-executed';

export interface AutonomousRecommendation {
  id: string;
  title: string;
  whatToDo: string;
  whyReasoning: string;
  urgency: RecommendationUrgency;
  status: RecommendationStatus;
  category: 'Panel Tilt' | 'Irrigation' | 'Crop Protection' | 'Energy Grid';
  zone: string;
  createdTime: string;
  expectedOutcome: string;
}

export interface ActionHistoryItem {
  id: string;
  recommendationId: string;
  title: string;
  actionTaken: 'Approved' | 'Rejected' | 'Modified' | 'Auto-Executed';
  executedBy: string;
  timestamp: string;
  outcome: string;
}

export type AlertSeverity = 'critical' | 'warning' | 'info';
export type AlertCategory = 'equipment_fault' | 'abnormal_reading' | 'disease_detection';

export interface FarmAlert {
  id: string;
  title: string;
  description: string;
  category: AlertCategory;
  severity: AlertSeverity;
  zone: string;
  timestamp: string;
  isAcknowledged: boolean;
  isResolved: boolean;
}

export interface SeasonComparison {
  metric: string;
  agriPvAdaptive: string;
  openFieldBaseline: string;
  variance: string;
  isPositive: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  role: 'Agronomist Lead' | 'Chief Solar Engineer' | 'Operations Director' | 'Field Automation Agent';
  email: string;
  accessLevel: 'Full Admin' | 'Agronomy Specialist' | 'PV Technician' | 'Autonomous AI';
  status: 'active' | 'on-shift';
}

export interface AutonomySettings {
  autoExecuteHighConfidence: boolean;
  confidenceThresholdPercent: number;
  heatStressShadeThresholdC: number;
  windStowThresholdMs: number;
  criticalMoistureThresholdPercent: number;
  notificationPreferences: {
    inverterFaults: boolean;
    cropStressAlerts: boolean;
    weatherStowWarnings: boolean;
    autoExecutionSummaries: boolean;
  };
}
