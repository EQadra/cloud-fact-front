// src/types/index.ts

// =============================================
// TIPOS BASE Y COMUNES
// =============================================

export interface BaseEntity {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Company {
  id: string;
  ruc: string;
  razonSocial: string;
  nombreComercial?: string;
  direccion?: string;
  ubigeo?: string;
  telefono?: string;
  correo?: string;
  logo?: string;
  tipoEmpresa: 'EMPRESA' | 'ASOCIACION';
  estado: boolean;
  createdAt?: string;
  updatedAt?: string;
  branches?: Branch[];
}

export interface Branch {
  id: string;
  companyId: string;
  nombre: string;
  direccion?: string;
  telefono?: string;
  encargado?: string;
  estado: boolean;
  createdAt?: string;
  company?: Company;
}

// =============================================
// TIPOS DE AUTENTICACIÓN Y USUARIOS
// =============================================

export interface User extends BaseEntity {
  email: string;
  nombre: string;
  roleId: string;
  companyId?: string;
  telefono?: string;
  estado?: boolean;
  ultimoAcceso?: string;
  role?: Role;
  company?: Company;
  permissions?: string[];
}

export interface Role extends BaseEntity {
  nombre: string;
  descripcion?: string;
  nivel: number;
  permissions?: RolePermission[];
}

export interface Permission extends BaseEntity {
  nombre: string;
  descripcion?: string;
  modulo?: string;
}

export interface RolePermission {
  roleId: string;
  permissionId: string;
  permission: Permission;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface CreateUserDto {
  email: string;
  password: string;
  nombre: string;
  roleId?: string;
  companyId?: string;
  telefono?: string;
}

export interface UpdateUserDto {
  email?: string;
  password?: string;
  nombre?: string;
  roleId?: string;
  telefono?: string;
  estado?: boolean;
}

export interface CreateRoleDto {
  nombre: string;
  descripcion?: string;
  nivel?: number;
}

export interface UpdateRoleDto {
  nombre?: string;
  descripcion?: string;
  nivel?: number;
}

export interface CreatePermissionDto {
  nombre: string;
  descripcion?: string;
  modulo?: string;
}

// =============================================
// TIPOS DE PERSONAS
// =============================================

export interface Person extends BaseEntity {
  companyId: string;
  tipoDocumento: '1' | '4' | '6' | '7'; // DNI, CE, etc.
  numeroDocumento: string;
  nombre?: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  direccion?: string;
  correo?: string;
  telefono?: string;
  fechaNacimiento?: string;
  genero?: 'M' | 'F' | 'O';
  tipo: 'CLIENTE' | 'PROVEEDOR' | 'PACIENTE' | 'EMPLEADO' | 'VISITANTE';
  estado: boolean;
  company?: Company;
}

// =============================================
// TIPOS DE CATÁLOGO
// =============================================

export interface Category extends BaseEntity {
  companyId: string;
  nombre: string;
  descripcion?: string;
  padreId?: string;
  estado: boolean;
  company?: Company;
  padre?: Category;
  subcategories?: Category[];
  products?: Product[];
}

export interface Unit extends BaseEntity {
  codigo: string;
  descripcion: string;
  simbolo: string;
}

export interface Product extends BaseEntity {
  companyId: string;
  codigo: string;
  nombre: string;
  descripcion?: string;
  categoriaId?: string;
  unidadId?: string;
  precioVenta: number;
  precioCompra: number;
  precioMayor: number;
  stockMinimo: number;
  stockMaximo: number;
  stockActual: number;
  igvTipo?: '10' | '11' | '12' | '13' | '14' | '15' | '16' | '17' | '20';
  esMedicamento: boolean;
  requiereReceta: boolean;
  activo: boolean;
  company?: Company;
  categoria?: Category;
  unidad?: Unit;
}

// =============================================
// TIPOS DE PRODUCCIÓN
// =============================================

export type LotEstado = 
  | 'EN_PLANIFICACION' 
  | 'EN_PRODUCCION' 
  | 'TERMINADO' 
  | 'CUALIFICADO' 
  | 'LIBERADO' 
  | 'RECHAZADO' 
  | 'VENCIDO';

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

export interface ProductionLot extends BaseEntity {
  companyId: string;
  productoId: string;
  codigoLote: string;
  descripcion?: string;
  fechaProduccion?: string;
  fechaCaducidad?: string;
  cantidadProducida: number;
  cantidadActual?: number;
  estado: LotEstado;
  responsableId?: string;
  notas?: string;
  company?: Company;
  producto?: Product;
  responsable?: User;
  tracking?: LotTracking[];
}

export interface LotTracking extends BaseEntity {
  lotId: string;
  etapa: EtapaProduccion;
  responsableId?: string;
  fechaHora?: string;
  temperatura?: number;
  humedad?: number;
  observaciones?: string;
  lot?: ProductionLot;
  responsable?: User;
}

export interface Pathology extends BaseEntity {
  codigo: string;
  nombre: string;
  descripcion?: string;
  categoria?: string;
}

export interface CreateLotDto {
  productoId: string;
  codigoLote: string;
  descripcion?: string;
  fechaProduccion?: string;
  fechaCaducidad?: string;
  cantidadProducida: number;
  responsableId?: string;
  notas?: string;
}

export interface UpdateLotDto {
  codigoLote?: string;
  descripcion?: string;
  fechaProduccion?: string;
  fechaCaducidad?: string;
  cantidadProducida?: number;
  estado?: LotEstado;
  notas?: string;
}

export interface CreateLotTrackingDto {
  lotId: string;
  etapa: EtapaProduccion;
  responsableId?: string;
  temperatura?: number;
  humedad?: number;
  observaciones?: string;
}

// =============================================
// TIPOS DE MÓDULO MÉDICO
// =============================================

export type TipoVisita = 'PRIMERA_VEZ' | 'CONTROL' | 'URGENCIA' | 'SEGUIMIENTO';
export type EstadoPrescripcion = 'ACTIVA' | 'COMPLETADA' | 'CANCELADA' | 'VENCIDA';
export type EstadoPatologia = 'ACTIVO' | 'INACTIVO' | 'TRATAMIENTO' | 'REMISION' | 'RECUPERADO';

export interface Patient extends BaseEntity {
  personId: string;
  codigoPaciente: string;
  grupoSanguineo?: string;
  alergias?: string;
  medicamentosHabituales?: string;
  contactoEmergencia?: string;
  telefonoEmergencia?: string;
  person?: Person;
  visits?: MedicalVisit[];
  pathologies?: PatientPathology[];
}

export interface MedicalVisit extends BaseEntity {
  patientId: string;
  medicoId: string;
  fechaVisita: string;
  tipoVisita: TipoVisita;
  motivoConsulta?: string;
  diagnostico?: string;
  planTratamiento?: string;
  notasEvolucion?: string;
  peso?: number;
  altura?: number;
  presionArterial?: string;
  frecuenciaCardiaca?: number;
  temperatura?: number;
  patient?: Patient;
  medico?: User;
  prescriptions?: Prescription[];
}

export interface Prescription extends BaseEntity {
  medicalVisitId: string;
  productoId: string;
  dosisIndicada: string;
  frecuencia: string;
  duracionDias?: number;
  viaAdministracion?: string;
  indicacionesEspeciales?: string;
  estado: EstadoPrescripcion;
  medicalVisit?: MedicalVisit;
  producto?: Product;
}

export interface PatientPathology extends BaseEntity {
  patientId: string;
  pathologyId: string;
  fechaDiagnostico?: string;
  estado: EstadoPatologia;
  notas?: string;
  patient?: Patient;
  pathology?: Pathology;
}

export interface CreatePatientDto {
  personId: string;
  codigoPaciente: string;
  grupoSanguineo?: string;
  alergias?: string;
  medicamentosHabituales?: string;
  contactoEmergencia?: string;
  telefonoEmergencia?: string;
}

export interface CreateMedicalVisitDto {
  patientId: string;
  medicoId: string;
  fechaVisita: string;
  tipoVisita: TipoVisita;
  motivoConsulta?: string;
  diagnostico?: string;
  planTratamiento?: string;
  notasEvolucion?: string;
  peso?: number;
  altura?: number;
  presionArterial?: string;
  frecuenciaCardiaca?: number;
  temperatura?: number;
}

export interface CreatePrescriptionDto {
  medicalVisitId: string;
  productoId: string;
  dosisIndicada: string;
  frecuencia: string;
  duracionDias?: number;
  viaAdministracion?: string;
  indicacionesEspeciales?: string;
  estado: EstadoPrescripcion;
}

// =============================================
// TIPOS DE SEGURIDAD
// =============================================

export type TipoCamera = 'FIJA' | 'PTZ' | 'DOME' | 'BULLET' | 'PANORAMICA';
export type CalidadGrabacion = 'BAJA' | 'MEDIA' | 'ALTA' | 'FULL_HD' | '4K';
export type TipoGrabacion = 'MANUAL' | 'PROGRAMADA' | 'DETECCION_MOVIMIENTO' | 'CONTINUA' | 'EVENTO';
export type EstadoGrabacion = 'GRABANDO' | 'COMPLETADA' | 'ERROR' | 'CORRUPTA' | 'PROCESANDO';
export type TipoAcceso = 'INGRESO' | 'SALIDA';
export type NivelRiesgo = 'BAJO' | 'MEDIO' | 'ALTO' | 'CRITICO';
export type CategoriaLog = 'ALARMA' | 'ACCESO' | 'INCIDENTE' | 'MANTENIMIENTO' | 'PROCEDIMIENTO';
export type TipoEvento = 'MOVIMIENTO' | 'SONIDO' | 'ALARMA' | 'ACCESO_NO_AUTORIZADO' | 'PERSONA_DETECTADA' | 'OBJETO_DETECTADO' | 'MANUAL';

export interface Camera extends BaseEntity {
  companyId: string;
  branchId?: string;
  nombre: string;
  descripcion?: string;
  ubicacion?: string;
  zona?: string;
  ipAddress?: string;
  puerto?: number;
  rutaRtsp?: string;
  marca?: string;
  modelo?: string;
  tipo: TipoCamera;
  resolucion?: string;
  fps?: number;
  anguloVision?: number;
  estado: boolean;
  creadoPor?: string;
  company?: Company;
  branch?: Branch;
  creador?: User;
  recordings?: Recording[];
  schedules?: CameraSchedule[];
}

export interface Recording extends BaseEntity {
  cameraId: string;
  usuarioInicio?: string;
  usuarioFin?: string;
  fechaInicio: string;
  fechaFin?: string;
  duracion?: number;
  tamanioMb?: number;
  rutaArchivo: string;
  formato?: string;
  calidad: CalidadGrabacion;
  tipoGrabacion: TipoGrabacion;
  estado: EstadoGrabacion;
  notas?: string;
  camera?: Camera;
  usuarioInicioData?: User;
  usuarioFinData?: User;
  events?: SecurityEvent[];
}

export interface CameraSchedule extends BaseEntity {
  cameraId: string;
  diaSemana: number; // 1-7
  horaInicio: string;
  horaFin: string;
  activo: boolean;
  camera?: Camera;
}

export interface AccessControl extends BaseEntity {
  companyId: string;
  personaId?: string;
  tipoDocumento?: string;
  numeroDocumento?: string;
  nombreCompleto?: string;
  tipoAcceso: TipoAcceso;
  zona?: string;
  motivo?: string;
  fechaHora?: string;
  registradoPor?: string;
  company?: Company;
  persona?: Person;
  registrador?: User;
}

export interface SecurityLog extends BaseEntity {
  companyId: string;
  evento: string;
  descripcion?: string;
  nivelRiesgo: NivelRiesgo;
  categoria: CategoriaLog;
  ubicacion?: string;
  fechaHora?: string;
  registradoPor?: string;
  company?: Company;
  registrador?: User;
}

export interface SecurityEvent extends BaseEntity {
  cameraId: string;
  recordingId?: string;
  tipoEvento: TipoEvento;
  descripcion?: string;
  nivelRiesgo: NivelRiesgo;
  fechaDeteccion?: string;
  imagenCapturada?: string;
  videoAdjunto?: string;
  procesado: boolean;
  procesadoPor?: string;
  notas?: string;
  camera?: Camera;
  recording?: Recording;
  procesador?: User;
}

export interface CreateCameraDto {
  companyId: string;
  branchId?: string;
  nombre: string;
  descripcion?: string;
  ubicacion?: string;
  zona?: string;
  ipAddress?: string;
  puerto?: number;
  rutaRtsp?: string;
  marca?: string;
  modelo?: string;
  tipo: TipoCamera;
  resolucion?: string;
  fps?: number;
  anguloVision?: number;
  creadoPor?: string;
}

export interface CreateRecordingDto {
  cameraId: string;
  usuarioInicio: string;
  fechaInicio: string;
  rutaArchivo: string;
  calidad: CalidadGrabacion;
  tipoGrabacion: TipoGrabacion;
  formato?: string;
}

export interface CreateAccessControlDto {
  companyId: string;
  personaId?: string;
  tipoDocumento?: string;
  numeroDocumento?: string;
  nombreCompleto?: string;
  tipoAcceso: TipoAcceso;
  zona?: string;
  motivo?: string;
  registradoPor?: string;
}

export interface CreateSecurityLogDto {
  companyId: string;
  evento: string;
  descripcion?: string;
  nivelRiesgo: NivelRiesgo;
  categoria: CategoriaLog;
  ubicacion?: string;
  registradoPor?: string;
}

// =============================================
// TIPOS DE MÓDULO COMERCIAL (NUBEFACT)
// =============================================

export type TipoComprobante = '01' | '03' | '07' | '08';
export type EstadoVenta = 'BORRADOR' | 'EMITIDO' | 'PAGADO' | 'ANULADO' | 'ENVIADO_SUNAT';
export type EstadoSunat = 'PENDIENTE' | 'ACEPTADO' | 'RECHAZADO' | 'OBSERVADO' | 'BAJA';
export type MetodoPago = 'EFECTIVO' | 'TARJETA_CREDITO' | 'TARJETA_DEBITO' | 'YAPE' | 'PLIN' | 'TRANSFERENCIA' | 'OTRO';
export type EstadoCompra = 'BORRADOR' | 'REGISTRADO' | 'PAGADO' | 'ANULADO';
export type TipoMovimientoKardex = 'ENTRADA' | 'SALIDA' | 'AJUSTE_INVENTARIO' | 'DEVOLUCION' | 'TRANSFERENCIA';

export interface Series extends BaseEntity {
  companyId: string;
  branchId?: string;
  tipoComprobante: TipoComprobante;
  serie: string;
  correlativo: number;
  estado: boolean;
  company?: Company;
  branch?: Branch;
}

export interface Sale extends BaseEntity {
  companyId: string;
  branchId?: string;
  customerId?: string;
  tipoComprobante: TipoComprobante;
  serie: string;
  numero: number;
  fechaEmision: string;
  moneda: string;
  tipoCambio: number;
  subtotal: number;
  igv: number;
  descuento: number;
  total: number;
  estado: EstadoVenta;
  sunatEstado?: EstadoSunat;
  sunatMensaje?: string;
  hash?: string;
  xmlPath?: string;
  pdfPath?: string;
  cdrPath?: string;
  observaciones?: string;
  company?: Company;
  branch?: Branch;
  customer?: Person;
  items?: SaleItem[];
  payments?: Payment[];
}

export interface SaleItem extends BaseEntity {
  saleId: string;
  productId: string;
  lotId?: string;
  cantidad: number;
  precioUnitario: number;
  descuento: number;
  subtotal: number;
  igv: number;
  total: number;
  sale?: Sale;
  product?: Product;
  lot?: ProductionLot;
}

export interface Payment extends BaseEntity {
  saleId: string;
  metodoPago: MetodoPago;
  monto: number;
  referencia?: string;
  fechaPago: string;
  sale?: Sale;
}

export interface Purchase extends BaseEntity {
  companyId: string;
  supplierId?: string;
  tipoComprobante: TipoComprobante;
  serie: string;
  numero: number;
  fechaEmision: string;
  moneda: string;
  subtotal: number;
  igv: number;
  total: number;
  estado: EstadoCompra;
  observaciones?: string;
  company?: Company;
  supplier?: Person;
  items?: PurchaseItem[];
}

export interface PurchaseItem extends BaseEntity {
  purchaseId: string;
  productId: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  igv: number;
  total: number;
  purchase?: Purchase;
  product?: Product;
}

export interface Kardex extends BaseEntity {
  companyId: string;
  productId: string;
  lotId?: string;
  tipoMovimiento: TipoMovimientoKardex;
  cantidad: number;
  stockAnterior: number;
  stockNuevo: number;
  referencia?: string;
  documentoReferencia?: string;
  usuarioId?: string;
  fecha: string;
  company?: Company;
  product?: Product;
  lot?: ProductionLot;
  usuario?: User;
}

export interface CreateSaleDto {
  companyId: string;
  branchId?: string;
  customerId?: string;
  tipoComprobante: TipoComprobante;
  serie: string;
  fechaEmision?: string;
  moneda?: string;
  tipoCambio?: number;
  descuento?: number;
  observaciones?: string;
  items: CreateSaleItemDto[];
}

export interface CreateSaleItemDto {
  productId: string;
  lotId?: string;
  cantidad: number;
  precioUnitario: number;
  descuento?: number;
}

export interface CreatePurchaseDto {
  companyId: string;
  supplierId?: string;
  tipoComprobante: TipoComprobante;
  serie: string;
  fechaEmision?: string;
  moneda?: string;
  observaciones?: string;
  items: CreatePurchaseItemDto[];
}

export interface CreatePurchaseItemDto {
  productId: string;
  cantidad: number;
  precioUnitario: number;
}

// =============================================
// TIPOS DE CATÁLOGOS MAESTROS
// =============================================

export interface TipoComprobanteCatalogo {
  codigo: TipoComprobante;
  descripcion: string;
  activo: boolean;
}

export interface TipoAfectacionIgv {
  codigo: string;
  descripcion: string;
  activo: boolean;
}

export interface Moneda {
  codigo: string;
  descripcion: string;
  simbolo: string;
  activo: boolean;
}

// =============================================
// TIPOS DE AUDITORÍA
// =============================================

export interface AuditLog extends BaseEntity {
  userId?: string;
  accion: string;
  tabla: string;
  registroId?: string;
  datosAnteriores?: Record<string, any>;
  datosNuevos?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  fecha: string;
  user?: User;
}

// =============================================
// TIPOS DE PAGINACIÓN Y FILTROS
// =============================================

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// =============================================
// TIPOS DE ESTADOS Y DASHBOARD
// =============================================

export interface DashboardStats {
  totalUsers: number;
  totalPatients: number;
  totalProducts: number;
  totalSales: number;
  totalLots: number;
  activeCameras: number;
  recentSales: Sale[];
  pendingTasks: number;
  alerts: SecurityEvent[];
}

// =============================================
// UTILITY TYPES
// =============================================

export type OmitTimestamps<T> = Omit<T, 'createdAt' | 'updatedAt'>;
export type CreateDto<T> = OmitTimestamps<T>;
export type UpdateDto<T> = Partial<OmitTimestamps<T>>;

// Helper para valores enumerados
export type ValueOf<T> = T[keyof T];