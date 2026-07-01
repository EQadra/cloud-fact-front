// src/types/seguridad.ts

// ============================================
// CONTROL DE ACCESO VEHICULAR
// ============================================

export interface AccessRecord {
  id: number;
  person: string;
  document: string;
  vehicle: string;
  type: 'Ingreso' | 'Salida';
  date: string;
  time: string;
  status: 'Autorizado' | 'Pendiente' | 'Denegado';
  company: string;
}

export interface CrearAccessRecordDTO {
  person: string;
  document: string;
  vehicle: string;
  type: 'Ingreso' | 'Salida';
  status: 'Autorizado' | 'Pendiente' | 'Denegado';
  company: string;
}

export interface UpdateAccessRecordDTO extends Partial<CrearAccessRecordDTO> {
  id: number;
}

// ============================================
// CONTROL DE ACCESO PEATONAL
// ============================================

export interface PedestrianRecord {
  id: number;
  person: string;
  document: string;
  type: 'Ingreso' | 'Salida';
  date: string;
  time: string;
  status: 'Autorizado' | 'Pendiente' | 'Denegado';
  department: string;
  position: string;
  visitorType: 'Empleado' | 'Visitante' | 'Proveedor';
  reason: string;
  registerBy: string;
}

export interface CrearPedestrianRecordDTO {
  person: string;
  document: string;
  type: 'Ingreso' | 'Salida';
  status: 'Autorizado' | 'Pendiente' | 'Denegado';
  department: string;
  position: string;
  visitorType: 'Empleado' | 'Visitante' | 'Proveedor';
  reason: string;
  registerBy: string;
}

export interface UpdatePedestrianRecordDTO extends Partial<CrearPedestrianRecordDTO> {
  id: number;
}

// ============================================
// LIBRO DE INCIDENTES
// ============================================

export interface IncidentRecord {
  id: number;
  type: string;
  severity: 'Alta' | 'Media' | 'Baja';
  date: string;
  time: string;
  location: string;
  description: string;
  reportedBy: string;
  status: 'Resuelto' | 'En proceso' | 'Pendiente';
  department: string;
}

export interface CrearIncidentDTO {
  type: string;
  severity: 'Alta' | 'Media' | 'Baja';
  location: string;
  description: string;
  reportedBy: string;
  status: 'Resuelto' | 'En proceso' | 'Pendiente';
  department: string;
}

export interface UpdateIncidentDTO extends Partial<CrearIncidentDTO> {
  id: number;
}

// ============================================
// CONSTANTES
// ============================================

export const STATUS_COLORS = {
  'Autorizado': '#22c55e',
  'Pendiente': '#f59e0b',
  'Denegado': '#ef4444',
  'Resuelto': '#22c55e',
  'En proceso': '#f59e0b'
} as const;

export const SEVERITY_COLORS = {
  'Alta': '#ef4444',
  'Media': '#f59e0b',
  'Baja': '#3b82f6'
} as const;

export const SEVERITY_LABELS = {
  'Alta': '🔴 Alta',
  'Media': '🟡 Media',
  'Baja': '🔵 Baja'
} as const;

export const VISITOR_TYPE_LABELS = {
  'Empleado': '👤 Empleado',
  'Visitante': '👤 Visitante',
  'Proveedor': '🏢 Proveedor'
} as const;

export const INCIDENT_TYPE_LABELS = {
  'Accidente': '🚗 Accidente',
  'Robo': '🔒 Robo',
  'Incidente': '⚠️ Incidente',
  'Falla técnica': '🔧 Falla técnica'
} as const;

export const INCIDENT_STATUS_LABELS = {
  'Resuelto': '✅ Resuelto',
  'En proceso': '⏳ En proceso',
  'Pendiente': '⏸️ Pendiente'
} as const;