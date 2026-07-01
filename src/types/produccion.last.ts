// src/types/produccion.ts

// ============================================
// TIPOS PRINCIPALES - PLANTAS
// ============================================

export interface Planta {
  id: string;
  nombre: string;
  codigo_qr: string;
  tipo: TipoPlanta;
  banco_procedencia?: string;
  lote?: string;
  fecha_germinacion?: string;
  fecha_clonacion?: string;
  descripcion?: string;
  estado: EstadoPlanta;
  company_id: string;
  created_at: string;
  updated_at: string;
}

export type TipoPlanta = 'INDICA' | 'SATIVA' | 'HIBRIDA';
export type EstadoPlanta = 'ACTIVO' | 'FINALIZADO' | 'CANCELADO';

// ============================================
// INFORMES DE PLANTA (VERSIÓN ANTIGUA - COMPATIBILIDAD)
// ============================================

export interface InformePlanta {
  id: string;
  planta_id: string;
  titulo: string;
  descripcion: string;
  fecha: string;
  tipo: TipoInforme;
  created_at: string;
  updated_at: string;
}

export type TipoInforme = 
  | 'SIEMBRA'
  | 'CRECIMIENTO'
  | 'FLORACION'
  | 'COSECHA'
  | 'SECADO'
  | 'CURADO'
  | 'EXTRACCION'
  | 'PROCESAMIENTO'
  | 'ENVASADO'
  | 'CONTROL_CALIDAD'
  | 'ALMACENAMIENTO'
  | 'GENERAL';

// ============================================
// INFORMES DETALLADOS (NUEVA VERSIÓN)
// ============================================

export interface PlantaInforme {
  id: string;
  planta_id: string;
  titulo: string;
  descripcion?: string;
  tipo: 'CRECIMIENTO' | 'SALUD' | 'RIEGO' | 'FERTILIZACION' | 'PODA' | 'COSECHA' | 'CONTROL_PLAGAS' | 'GENERAL';
  fecha_informe: string;
  autor?: string;
  imagen_url?: string;
  imagen_public_id?: string;
  datos_medicion?: Record<string, any>;
  recomendaciones?: string;
  estado: 'BORRADOR' | 'PUBLICADO' | 'ARCHIVADO';
  created_at: string;
  updated_at?: string;
}

// ============================================
// ETAPAS DE TRAZABILIDAD
// ============================================

export interface EtapaTrazabilidad {
  id: string;
  planta_id: string;
  etapa: EtapaProduccion;
  estado: EstadoEtapa;
  fecha_inicio: string;
  fecha_fin?: string;
  responsable_id?: string;
  responsable_nombre?: string;
  observaciones?: string;
  temperatura?: number;
  humedad?: number;
  created_at: string;
  updated_at: string;
}

export type EtapaProduccion = 
  | 'SIEMBRA'
  | 'CRECIMIENTO'
  | 'FLORACION'
  | 'COSECHA'
  | 'SECADO'
  | 'CURADO'
  | 'EXTRACCION'
  | 'PROCESAMIENTO'
  | 'ENVASADO'
  | 'CONTROL_CALIDAD'
  | 'ALMACENAMIENTO';

export type EstadoEtapa = 'PENDIENTE' | 'EN_PROCESO' | 'COMPLETADO';

// ============================================
// DTOs (Data Transfer Objects)
// ============================================

export interface CrearPlantaDTO {
  nombre: string;
  codigo_qr?: string;
  tipo?: TipoPlanta;
  banco_procedencia?: string;
  lote?: string;
  fecha_germinacion?: string;
  fecha_clonacion?: string;
  descripcion?: string;
  estado?: EstadoPlanta;
  company_id?: string;
}

export interface UpdatePlantaDTO {
  nombre?: string;
  codigo_qr?: string;
  tipo?: TipoPlanta;
  banco_procedencia?: string;
  lote?: string;
  fecha_germinacion?: string;
  fecha_clonacion?: string;
  descripcion?: string;
  estado?: EstadoPlanta;
}

export interface CrearInformeDTO {
  planta_id: string;
  titulo: string;
  descripcion: string;
  fecha: string;
  tipo: TipoInforme;
}

export interface CrearEtapaDTO {
  planta_id: string;
  etapa: EtapaProduccion;
  fecha_inicio: string;
  fecha_fin?: string;
  responsable_id?: string;
  responsable_nombre?: string;
  observaciones?: string;
  temperatura?: number;
  humedad?: number;
  estado?: EstadoEtapa;
}

// ============================================
// RESPONSES DE API
// ============================================

export interface PlantaConInformes extends Planta {
  informes: InformePlanta[];
}

export interface PlantaConTrazabilidad extends Planta {
  informes: InformePlanta[];
  etapas: EtapaTrazabilidad[];
}

// ============================================
// CONSTANTES
// ============================================

export const TIPO_PLANTA_LABELS = {
  'INDICA': 'Indica',
  'SATIVA': 'Sativa',
  'HIBRIDA': 'Híbrida'
} as const;

export const ESTADO_PLANTA_LABELS = {
  'ACTIVO': 'Activo',
  'FINALIZADO': 'Finalizado',
  'CANCELADO': 'Cancelado'
} as const;

export const ESTADO_ETAPA_LABELS = {
  'PENDIENTE': 'Pendiente',
  'EN_PROCESO': 'En Proceso',
  'COMPLETADO': 'Completado'
} as const;

export const ETAPA_LABELS = {
  'SIEMBRA': '🌱 Siembra',
  'CRECIMIENTO': '🌿 Crecimiento',
  'FLORACION': '🌸 Floración',
  'COSECHA': '✂️ Cosecha',
  'SECADO': '🌾 Secado',
  'CURADO': '🏺 Curado',
  'EXTRACCION': '🧪 Extracción',
  'PROCESAMIENTO': '⚙️ Procesamiento',
  'ENVASADO': '📦 Envasado',
  'CONTROL_CALIDAD': '✅ Control Calidad',
  'ALMACENAMIENTO': '🏪 Almacenamiento'
} as const;

export const TIPO_INFORME_LABELS = {
  'CRECIMIENTO': '🌱 Crecimiento',
  'SALUD': '🩺 Salud',
  'RIEGO': '💧 Riego',
  'FERTILIZACION': '🧪 Fertilización',
  'PODA': '✂️ Poda',
  'COSECHA': '🌾 Cosecha',
  'CONTROL_PLAGAS': '🐛 Control de plagas',
  'GENERAL': '📋 General'
} as const;