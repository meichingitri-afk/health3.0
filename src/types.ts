export type UrgencyLevel = 'EMERGENCY' | 'URGENT_TODAY' | 'ROUTINE';

export interface UserContext {
  name?: string;
  city: string;
  district: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  quickReplies?: string[];
  isRedFlagWarning?: boolean;
}

export interface DepartmentRecommendation {
  name: string;
  code: string;
  matchScore: number; // 0 - 100
  reason: string;
  iconName?: string;
}

export interface RadarMetrics {
  primarySymptomIntensity: number; // 0 - 100
  accompanyingRiskRatio: number;   // 0 - 100
  timeSensitivity: number;         // 0 - 100
  departmentRelevance: number;     // 0 - 100
  careComplexity: number;          // 0 - 100
}

export interface TriageReportData {
  urgency: UrgencyLevel;
  urgencyTitle: string;
  urgencyDescription: string;
  departments: DepartmentRecommendation[];
  radarScores: RadarMetrics;
  riskFactors: string[];
  redFlagDetected: boolean;
  emergencyGuide?: {
    title: string;
    warning: string;
    actionSteps: string[];
  };
  homeCareTips: string[];
  preliminaryDoctorChecks: string[];
  summaryNote: string;
}

export interface ClinicShift {
  days: number[]; // 0=Sun, 1=Mon, ..., 6=Sat
  morning?: { start: string; end: string };   // e.g. "08:30" - "12:00"
  afternoon?: { start: string; end: string }; // e.g. "14:00" - "17:30"
  evening?: { start: string; end: string };   // e.g. "18:00" - "21:30"
}

export interface ClinicItem {
  id: string;
  name: string;
  departmentCodes: string[];
  departmentNames: string[];
  city: string;
  district: string;
  address: string;
  phone: string;
  distanceKm: number;
  isEmergencyHospital?: boolean;
  hoursDescription: string;
  shifts: ClinicShift;
  latitude: number;
  longitude: number;
  tags?: string[];
}

export type ClinicOpenStatus = 
  | { status: 'OPEN'; label: string; closesAt: string }
  | { status: 'OPENING_SOON'; label: string; opensAt: string }
  | { status: 'CLOSED'; label: string; nextOpen?: string };
