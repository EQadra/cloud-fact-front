// src/services/produccionService.ts
import type {
  Planta,
  PlantaConInformes,
  PlantaConTrazabilidad,
  CrearPlantaDTO,
  UpdatePlantaDTO,
  CrearInformeDTO,
  CrearEtapaDTO,
  InformePlanta,
  EtapaTrazabilidad,
  PlantaInforme,
  EstadoPlanta,
  TipoPlanta,
} from '../types/produccion';
import api from './api';

// ============================================
// CLAVES DE LOCAL STORAGE (para datos de prueba)
// ============================================

const STORAGE_KEY = 'produccion_plantas';
const INFORMES_KEY = 'produccion_informes';
const ETAPAS_KEY = 'produccion_etapas';
const INFORMES_DETALLE_KEY = 'produccion_informes_detalle';

// ============================================
// FUNCIONES HELPER PARA LOCAL STORAGE (MODO PRUEBA)
// ============================================

const getPlantas = (): Planta[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

const setPlantas = (plantas: Planta[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plantas));
};

const getInformesDetalle = (): Record<string, PlantaInforme[]> => {
  const data = localStorage.getItem(INFORMES_DETALLE_KEY);
  return data ? JSON.parse(data) : {};
};

const setInformesDetalle = (informes: Record<string, PlantaInforme[]>) => {
  localStorage.setItem(INFORMES_DETALLE_KEY, JSON.stringify(informes));
};

const getEtapas = (): Record<string, EtapaTrazabilidad[]> => {
  const data = localStorage.getItem(ETAPAS_KEY);
  return data ? JSON.parse(data) : {};
};

const setEtapas = (etapas: Record<string, EtapaTrazabilidad[]>) => {
  localStorage.setItem(ETAPAS_KEY, JSON.stringify(etapas));
};

const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

const generarCodigoQR = (nombre: string): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const shortName = nombre.substring(0, 4).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${shortName}-${timestamp}-${random}`;
};

// ============================================
// INICIALIZAR DATOS POR DEFECTO (MODO PRUEBA)
// ============================================

const initData = () => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    const initialData: Planta[] = [
      {
        id: '1',
        nombre: 'Purple Haze',
        codigo_qr: 'PH-2024-001',
        tipo: 'SATIVA',
        banco_procedencia: 'Seed Bank Amsterdam',
        lote: 'L-2024-001',
        fecha_germinacion: '2024-01-15',
        fecha_clonacion: '2024-02-01',
        descripcion: 'Variedad clásica con alto contenido de THC',
        estado: 'ACTIVO',
        company_id: 'company-1',
        created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
        updated_at: new Date(Date.now() - 30 * 86400000).toISOString()
      },
      {
        id: '2',
        nombre: 'Blue Dream',
        codigo_qr: 'BD-2024-002',
        tipo: 'HIBRIDA',
        banco_procedencia: 'California Seed Bank',
        lote: 'L-2024-002',
        fecha_germinacion: '2024-02-10',
        fecha_clonacion: '2024-02-25',
        descripcion: 'Híbrida equilibrada con efectos relajantes',
        estado: 'ACTIVO',
        company_id: 'company-1',
        created_at: new Date(Date.now() - 20 * 86400000).toISOString(),
        updated_at: new Date(Date.now() - 20 * 86400000).toISOString()
      },
      {
        id: '3',
        nombre: 'Northern Lights',
        codigo_qr: 'NL-2024-003',
        tipo: 'INDICA',
        banco_procedencia: 'Dutch Seed Bank',
        lote: 'L-2024-003',
        fecha_germinacion: '2024-03-01',
        fecha_clonacion: '2024-03-15',
        descripcion: 'Indica pura, excelente para relajación',
        estado: 'FINALIZADO',
        company_id: 'company-1',
        created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
        updated_at: new Date(Date.now() - 10 * 86400000).toISOString()
      }
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
  }

  if (!localStorage.getItem(INFORMES_DETALLE_KEY)) {
    const initialInformesDetalle: Record<string, PlantaInforme[]> = {
      '1': [
        {
          id: 'inf_1',
          planta_id: '1',
          titulo: 'Control de crecimiento - Semana 1',
          descripcion: 'La planta muestra un crecimiento saludable con nuevas hojas.',
          tipo: 'CRECIMIENTO',
          fecha_informe: new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0],
          autor: 'Juan Pérez',
          imagen_url: '',
          datos_medicion: { altura: 15.5, hojas: 8 },
          recomendaciones: 'Mantener riego regular y exposición solar adecuada.',
          estado: 'PUBLICADO',
          created_at: new Date(Date.now() - 7 * 86400000).toISOString()
        },
        {
          id: 'inf_2',
          planta_id: '1',
          titulo: 'Control de riego - Semana 2',
          descripcion: 'Se ajustó el sistema de riego para mantener humedad óptima.',
          tipo: 'RIEGO',
          fecha_informe: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0],
          autor: 'María García',
          imagen_url: '',
          datos_medicion: { humedad_suelo: 65, ph: 6.8 },
          recomendaciones: 'Continuar con el esquema de riego actual.',
          estado: 'PUBLICADO',
          created_at: new Date(Date.now() - 3 * 86400000).toISOString()
        }
      ],
      '2': [
        {
          id: 'inf_4',
          planta_id: '2',
          titulo: 'Inicio de floración',
          descripcion: 'La planta ha comenzado a mostrar signos de floración.',
          tipo: 'CRECIMIENTO',
          fecha_informe: new Date(Date.now() - 5 * 86400000).toISOString().split('T')[0],
          autor: 'Juan Pérez',
          imagen_url: '',
          datos_medicion: { altura: 45, ramas: 12 },
          recomendaciones: 'Aumentar nutrientes de floración.',
          estado: 'PUBLICADO',
          created_at: new Date(Date.now() - 5 * 86400000).toISOString()
        }
      ]
    };
    localStorage.setItem(INFORMES_DETALLE_KEY, JSON.stringify(initialInformesDetalle));
  }

  if (!localStorage.getItem(ETAPAS_KEY)) {
    const initialEtapas: Record<string, EtapaTrazabilidad[]> = {
      '1': [
        {
          id: 'etap-1',
          planta_id: '1',
          etapa: 'SIEMBRA',
          estado: 'COMPLETADO',
          fecha_inicio: new Date(Date.now() - 30 * 86400000).toISOString(),
          fecha_fin: new Date(Date.now() - 25 * 86400000).toISOString(),
          responsable_nombre: 'Juan Pérez',
          observaciones: 'Siembra en sustrato orgánico',
          temperatura: 24.5,
          humedad: 65,
          created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
          updated_at: new Date(Date.now() - 25 * 86400000).toISOString()
        },
        {
          id: 'etap-2',
          planta_id: '1',
          etapa: 'CRECIMIENTO',
          estado: 'COMPLETADO',
          fecha_inicio: new Date(Date.now() - 25 * 86400000).toISOString(),
          fecha_fin: new Date(Date.now() - 10 * 86400000).toISOString(),
          responsable_nombre: 'María García',
          observaciones: 'Crecimiento óptimo, nutrientes balanceados',
          temperatura: 26.0,
          humedad: 60,
          created_at: new Date(Date.now() - 25 * 86400000).toISOString(),
          updated_at: new Date(Date.now() - 10 * 86400000).toISOString()
        },
        {
          id: 'etap-3',
          planta_id: '1',
          etapa: 'FLORACION',
          estado: 'EN_PROCESO',
          fecha_inicio: new Date(Date.now() - 10 * 86400000).toISOString(),
          responsable_nombre: 'Carlos López',
          observaciones: 'Floración avanzada, cogollos densos',
          temperatura: 22.0,
          humedad: 55,
          created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
          updated_at: new Date(Date.now() - 10 * 86400000).toISOString()
        }
      ]
    };
    localStorage.setItem(ETAPAS_KEY, JSON.stringify(initialEtapas));
  }
};

initData();

// ============================================
// SERVICIO DE PRODUCCIÓN - CON RUTAS REALES DEL BACKEND
// ============================================

export const produccionService = {
  // ============================================
  // PLANTAS - Usando las rutas reales del backend
  // ============================================

  async obtenerPlantas(): Promise<Planta[]> {
    try {
      // Intentar obtener del backend real
      const response = await api.get('/production/lots');
      // Mapear la respuesta del backend a nuestro formato Planta
      const data = response.data;
      if (Array.isArray(data)) {
        return data.map((item: any) => ({
          id: item.id,
          nombre: item.nombre || item.productoId || 'Planta sin nombre',
          codigo_qr: item.codigoLote || item.codigo_qr || `QR-${item.id}`,
          tipo: item.tipo || 'INDICA',
          banco_procedencia: item.banco_procedencia || '',
          lote: item.codigoLote || item.lote || '',
          descripcion: item.descripcion || '',
          estado: item.estado === 'ACTIVO' ? 'ACTIVO' : item.estado === 'FINALIZADO' ? 'FINALIZADO' : 'ACTIVO',
          company_id: item.companyId || 'company-1',
          created_at: item.createdAt || item.created_at || new Date().toISOString(),
          updated_at: item.updatedAt || item.updated_at || new Date().toISOString()
        }));
      }
      // Fallback a datos locales
      return getPlantas();
    } catch (error) {
      console.warn('⚠️ Error al obtener plantas del backend, usando datos locales:', error);
      return getPlantas();
    }
  },

  async obtenerPlanta(id: string): Promise<PlantaConInformes> {
    try {
      const response = await api.get(`/production/lots/${id}`);
      const item = response.data;
      const planta: Planta = {
        id: item.id,
        nombre: item.nombre || item.productoId || 'Planta sin nombre',
        codigo_qr: item.codigoLote || item.codigo_qr || `QR-${item.id}`,
        tipo: item.tipo || 'INDICA',
        banco_procedencia: item.banco_procedencia || '',
        lote: item.codigoLote || item.lote || '',
        descripcion: item.descripcion || '',
        estado: item.estado === 'ACTIVO' ? 'ACTIVO' : item.estado === 'FINALIZADO' ? 'FINALIZADO' : 'ACTIVO',
        company_id: item.companyId || 'company-1',
        created_at: item.createdAt || item.created_at || new Date().toISOString(),
        updated_at: item.updatedAt || item.updated_at || new Date().toISOString()
      };
      return {
        ...planta,
        informes: []
      };
    } catch (error) {
      console.warn('⚠️ Error al obtener planta del backend, usando datos locales:', error);
      const plantas = getPlantas();
      const planta = plantas.find(p => p.id === id);
      if (!planta) {
        throw new Error('Planta no encontrada');
      }
      const informes = getInformesDetalle();
      return {
        ...planta,
        informes: informes[id] || []
      };
    }
  },

  async crearPlanta(data: CrearPlantaDTO): Promise<Planta> {
    try {
      // Intentar crear en el backend real
      const payload = {
        nombre: data.nombre,
        productoId: data.nombre,
        codigoLote: data.lote || generarCodigoQR(data.nombre),
        tipo: data.tipo || 'INDICA',
        descripcion: data.descripcion || '',
        banco_procedencia: data.banco_procedencia || '',
        fechaProduccion: data.fecha_germinacion || new Date().toISOString(),
        estado: data.estado || 'ACTIVO',
        companyId: data.company_id || 'company-1'
      };
      const response = await api.post('/production/lots', payload);
      const item = response.data;
      return {
        id: item.id,
        nombre: item.nombre || item.productoId || data.nombre,
        codigo_qr: item.codigoLote || item.codigo_qr || generarCodigoQR(data.nombre),
        tipo: data.tipo || 'INDICA',
        banco_procedencia: data.banco_procedencia || '',
        lote: item.codigoLote || data.lote || '',
        descripcion: data.descripcion || '',
        estado: data.estado || 'ACTIVO',
        company_id: data.company_id || 'company-1',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    } catch (error) {
      console.warn('⚠️ Error al crear planta en backend, usando datos locales:', error);
      // Fallback a localStorage
      const plantas = getPlantas();
      const codigo_qr = data.codigo_qr || generarCodigoQR(data.nombre);
      const nuevaPlanta: Planta = {
        id: String(Date.now()),
        nombre: data.nombre,
        codigo_qr,
        tipo: data.tipo || 'INDICA',
        banco_procedencia: data.banco_procedencia || '',
        lote: data.lote || '',
        fecha_germinacion: data.fecha_germinacion || '',
        fecha_clonacion: data.fecha_clonacion || '',
        descripcion: data.descripcion || '',
        estado: data.estado || 'ACTIVO',
        company_id: data.company_id || 'company-1',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      plantas.push(nuevaPlanta);
      setPlantas(plantas);
      return nuevaPlanta;
    }
  },

  async actualizarPlanta(id: string, data: UpdatePlantaDTO): Promise<Planta> {
    try {
      const payload = {
        nombre: data.nombre,
        descripcion: data.descripcion,
        estado: data.estado,
        tipo: data.tipo
      };
      const response = await api.patch(`/production/lots/${id}`, payload);
      const item = response.data;
      return {
        id: item.id,
        nombre: item.nombre || item.productoId || '',
        codigo_qr: item.codigoLote || item.codigo_qr || '',
        tipo: data.tipo || 'INDICA',
        banco_procedencia: data.banco_procedencia || '',
        lote: item.codigoLote || data.lote || '',
        descripcion: data.descripcion || '',
        estado: data.estado || 'ACTIVO',
        company_id: item.companyId || 'company-1',
        created_at: item.createdAt || new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    } catch (error) {
      console.warn('⚠️ Error al actualizar planta en backend, usando datos locales:', error);
      const plantas = getPlantas();
      const index = plantas.findIndex(p => p.id === id);
      if (index === -1) {
        throw new Error('Planta no encontrada');
      }
      plantas[index] = {
        ...plantas[index],
        ...data,
        updated_at: new Date().toISOString()
      };
      setPlantas(plantas);
      return plantas[index];
    }
  },

  async eliminarPlanta(id: string): Promise<void> {
    try {
      await api.delete(`/production/lots/${id}`);
    } catch (error) {
      console.warn('⚠️ Error al eliminar planta en backend, usando datos locales:', error);
      const plantas = getPlantas();
      const index = plantas.findIndex(p => p.id === id);
      if (index === -1) {
        throw new Error('Planta no encontrada');
      }
      plantas.splice(index, 1);
      setPlantas(plantas);
      
      const informes = getInformesDetalle();
      delete informes[id];
      setInformesDetalle(informes);
      
      const etapas = getEtapas();
      delete etapas[id];
      setEtapas(etapas);
    }
  },

  // ============================================
  // INFORMES
  // ============================================

  async obtenerInformes(plantaId: string): Promise<PlantaInforme[]> {
    try {
      const response = await api.get(`/production/tracking/lot/${plantaId}`);
      const data = response.data;
      if (Array.isArray(data)) {
        return data.map((item: any) => ({
          id: item.id,
          planta_id: item.lotId || plantaId,
          titulo: item.etapa || 'Seguimiento',
          descripcion: item.observaciones || '',
          tipo: 'GENERAL',
          fecha_informe: item.fechaHora || new Date().toISOString().split('T')[0],
          autor: item.responsableId || 'Sistema',
          imagen_url: '',
          datos_medicion: {
            temperatura: item.temperatura,
            humedad: item.humedad
          },
          recomendaciones: '',
          estado: 'PUBLICADO',
          created_at: item.createdAt || new Date().toISOString()
        }));
      }
      return getInformesDetalle()[plantaId] || [];
    } catch (error) {
      console.warn('⚠️ Error al obtener informes del backend, usando datos locales:', error);
      return getInformesDetalle()[plantaId] || [];
    }
  },

  async crearInforme(plantaId: string, informe: PlantaInforme): Promise<PlantaInforme> {
    try {
      const payload = {
        lotId: plantaId,
        etapa: informe.tipo || 'GENERAL',
        responsableId: informe.autor || 'Sistema',
        observaciones: informe.descripcion || '',
        temperatura: informe.datos_medicion?.temperatura || 0,
        humedad: informe.datos_medicion?.humedad || 0,
        fechaHora: informe.fecha_informe || new Date().toISOString()
      };
      const response = await api.post('/production/tracking', payload);
      const item = response.data;
      return {
        id: item.id || `inf_${Date.now()}`,
        planta_id: plantaId,
        titulo: informe.titulo || item.etapa || 'Seguimiento',
        descripcion: informe.descripcion || item.observaciones || '',
        tipo: informe.tipo || 'GENERAL',
        fecha_informe: informe.fecha_informe || new Date().toISOString().split('T')[0],
        autor: informe.autor || item.responsableId || 'Sistema',
        imagen_url: informe.imagen_url || '',
        datos_medicion: {
          temperatura: item.temperatura || informe.datos_medicion?.temperatura,
          humedad: item.humedad || informe.datos_medicion?.humedad
        },
        recomendaciones: informe.recomendaciones || '',
        estado: informe.estado || 'PUBLICADO',
        created_at: item.createdAt || new Date().toISOString()
      };
    } catch (error) {
      console.warn('⚠️ Error al crear informe en backend, usando datos locales:', error);
      const informes = getInformesDetalle();
      const nuevoInforme = {
        ...informe,
        id: informe.id || `inf_${Date.now()}`,
        planta_id: plantaId,
        created_at: informe.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      if (!informes[plantaId]) {
        informes[plantaId] = [];
      }
      informes[plantaId].unshift(nuevoInforme);
      setInformesDetalle(informes);
      return nuevoInforme;
    }
  },

  async actualizarInforme(plantaId: string, informeId: string, data: Partial<PlantaInforme>): Promise<PlantaInforme> {
    try {
      const payload = {
        etapa: data.tipo,
        observaciones: data.descripcion,
        temperatura: data.datos_medicion?.temperatura,
        humedad: data.datos_medicion?.humedad
      };
      const response = await api.patch(`/production/tracking/${informeId}`, payload);
      const item = response.data;
      return {
        id: item.id || informeId,
        planta_id: plantaId,
        titulo: data.titulo || 'Seguimiento',
        descripcion: data.descripcion || item.observaciones || '',
        tipo: data.tipo || 'GENERAL',
        fecha_informe: data.fecha_informe || new Date().toISOString().split('T')[0],
        autor: data.autor || 'Sistema',
        imagen_url: data.imagen_url || '',
        datos_medicion: data.datos_medicion || {},
        recomendaciones: data.recomendaciones || '',
        estado: data.estado || 'PUBLICADO',
        created_at: data.created_at || new Date().toISOString()
      };
    } catch (error) {
      console.warn('⚠️ Error al actualizar informe en backend, usando datos locales:', error);
      const informes = getInformesDetalle();
      if (!informes[plantaId]) {
        throw new Error('No se encontraron informes para esta planta');
      }
      const index = informes[plantaId].findIndex(i => i.id === informeId);
      if (index === -1) {
        throw new Error('Informe no encontrado');
      }
      informes[plantaId][index] = {
        ...informes[plantaId][index],
        ...data,
        updated_at: new Date().toISOString()
      };
      setInformesDetalle(informes);
      return informes[plantaId][index];
    }
  },

  async eliminarInforme(plantaId: string, informeId: string): Promise<void> {
    try {
      await api.delete(`/production/tracking/${informeId}`);
    } catch (error) {
      console.warn('⚠️ Error al eliminar informe en backend, usando datos locales:', error);
      const informes = getInformesDetalle();
      if (!informes[plantaId]) {
        return;
      }
      informes[plantaId] = informes[plantaId].filter(i => i.id !== informeId);
      setInformesDetalle(informes);
    }
  },

  // ============================================
  // ETAPAS
  // ============================================

  async obtenerEtapas(plantaId: string): Promise<EtapaTrazabilidad[]> {
    try {
      const response = await api.get(`/production/tracking/lot/${plantaId}`);
      const data = response.data;
      if (Array.isArray(data)) {
        return data.map((item: any) => ({
          id: item.id,
          planta_id: item.lotId || plantaId,
          etapa: item.etapa || 'CRECIMIENTO',
          estado: item.estado === 'COMPLETADO' ? 'COMPLETADO' : 'EN_PROCESO',
          fecha_inicio: item.fechaHora || new Date().toISOString(),
          fecha_fin: item.fechaFin || undefined,
          responsable_nombre: item.responsableId || 'Sistema',
          observaciones: item.observaciones || '',
          temperatura: item.temperatura,
          humedad: item.humedad,
          created_at: item.createdAt || new Date().toISOString(),
          updated_at: item.updatedAt || new Date().toISOString()
        }));
      }
      return getEtapas()[plantaId] || [];
    } catch (error) {
      console.warn('⚠️ Error al obtener etapas del backend, usando datos locales:', error);
      return getEtapas()[plantaId] || [];
    }
  },

  async agregarEtapa(plantaId: string, data: CrearEtapaDTO): Promise<EtapaTrazabilidad> {
    try {
      const payload = {
        lotId: plantaId,
        etapa: data.etapa || 'CRECIMIENTO',
        responsableId: data.responsable_nombre || 'Sistema',
        observaciones: data.observaciones || '',
        temperatura: data.temperatura || 0,
        humedad: data.humedad || 0,
        fechaHora: data.fecha_inicio || new Date().toISOString()
      };
      const response = await api.post('/production/tracking', payload);
      const item = response.data;
      return {
        id: item.id || `etap-${Date.now()}`,
        planta_id: plantaId,
        etapa: data.etapa || 'CRECIMIENTO',
        estado: data.estado || 'EN_PROCESO',
        fecha_inicio: data.fecha_inicio || new Date().toISOString(),
        fecha_fin: data.fecha_fin,
        responsable_nombre: data.responsable_nombre || 'Sistema',
        observaciones: data.observaciones || '',
        temperatura: data.temperatura,
        humedad: data.humedad,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    } catch (error) {
      console.warn('⚠️ Error al crear etapa en backend, usando datos locales:', error);
      const nuevaEtapa: EtapaTrazabilidad = {
        id: `etap-${Date.now()}`,
        planta_id: plantaId,
        etapa: data.etapa,
        estado: data.estado || 'PENDIENTE',
        fecha_inicio: data.fecha_inicio,
        fecha_fin: data.fecha_fin || undefined,
        responsable_id: data.responsable_id,
        responsable_nombre: data.responsable_nombre || 'Sistema',
        observaciones: data.observaciones || '',
        temperatura: data.temperatura,
        humedad: data.humedad,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      const etapas = getEtapas();
      if (!etapas[plantaId]) {
        etapas[plantaId] = [];
      }
      etapas[plantaId].push(nuevaEtapa);
      setEtapas(etapas);
      return nuevaEtapa;
    }
  },

  async actualizarEtapa(etapaId: string, data: Partial<CrearEtapaDTO>): Promise<EtapaTrazabilidad> {
    try {
      const payload = {
        etapa: data.etapa,
        observaciones: data.observaciones,
        temperatura: data.temperatura,
        humedad: data.humedad,
        estado: data.estado
      };
      const response = await api.patch(`/production/tracking/${etapaId}`, payload);
      const item = response.data;
      return {
        id: item.id || etapaId,
        planta_id: item.lotId || '',
        etapa: data.etapa || 'CRECIMIENTO',
        estado: data.estado || 'EN_PROCESO',
        fecha_inicio: data.fecha_inicio || new Date().toISOString(),
        fecha_fin: data.fecha_fin,
        responsable_nombre: data.responsable_nombre || 'Sistema',
        observaciones: data.observaciones || '',
        temperatura: data.temperatura,
        humedad: data.humedad,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    } catch (error) {
      console.warn('⚠️ Error al actualizar etapa en backend, usando datos locales:', error);
      const etapas = getEtapas();
      for (const key in etapas) {
        const index = etapas[key].findIndex(e => e.id === etapaId);
        if (index !== -1) {
          etapas[key][index] = {
            ...etapas[key][index],
            ...data,
            updated_at: new Date().toISOString()
          };
          setEtapas(etapas);
          return etapas[key][index];
        }
      }
      throw new Error('Etapa no encontrada');
    }
  },

  async eliminarEtapa(etapaId: string): Promise<void> {
    try {
      await api.delete(`/production/tracking/${etapaId}`);
    } catch (error) {
      console.warn('⚠️ Error al eliminar etapa en backend, usando datos locales:', error);
      const etapas = getEtapas();
      for (const key in etapas) {
        const index = etapas[key].findIndex(e => e.id === etapaId);
        if (index !== -1) {
          etapas[key].splice(index, 1);
          setEtapas(etapas);
          return;
        }
      }
    }
  },

  // ============================================
  // ESTADÍSTICAS Y REPORTES
  // ============================================

  async obtenerEstadisticas(): Promise<{
    total: number;
    activas: number;
    finalizadas: number;
    canceladas: number;
    porTipo: Record<string, number>;
  }> {
    try {
      const response = await api.get('/production/lots');
      const data = response.data;
      if (Array.isArray(data)) {
        const total = data.length;
        const activas = data.filter((p: any) => p.estado === 'ACTIVO' || p.estado === 'EN_PROCESO').length;
        const finalizadas = data.filter((p: any) => p.estado === 'FINALIZADO' || p.estado === 'COMPLETADO').length;
        const canceladas = data.filter((p: any) => p.estado === 'CANCELADO').length;
        const porTipo: Record<string, number> = {
          'INDICA': data.filter((p: any) => p.tipo === 'INDICA').length,
          'SATIVA': data.filter((p: any) => p.tipo === 'SATIVA').length,
          'HIBRIDA': data.filter((p: any) => p.tipo === 'HIBRIDA').length
        };
        return { total, activas, finalizadas, canceladas, porTipo };
      }
      // Fallback
      const plantas = getPlantas();
      const total = plantas.length;
      const activas = plantas.filter(p => p.estado === 'ACTIVO').length;
      const finalizadas = plantas.filter(p => p.estado === 'FINALIZADO').length;
      const canceladas = plantas.filter(p => p.estado === 'CANCELADO').length;
      const porTipo: Record<string, number> = {};
      plantas.forEach(p => {
        porTipo[p.tipo] = (porTipo[p.tipo] || 0) + 1;
      });
      return { total, activas, finalizadas, canceladas, porTipo };
    } catch (error) {
      console.warn('⚠️ Error al obtener estadísticas del backend, usando datos locales:', error);
      const plantas = getPlantas();
      const total = plantas.length;
      const activas = plantas.filter(p => p.estado === 'ACTIVO').length;
      const finalizadas = plantas.filter(p => p.estado === 'FINALIZADO').length;
      const canceladas = plantas.filter(p => p.estado === 'CANCELADO').length;
      const porTipo: Record<string, number> = {};
      plantas.forEach(p => {
        porTipo[p.tipo] = (porTipo[p.tipo] || 0) + 1;
      });
      return { total, activas, finalizadas, canceladas, porTipo };
    }
  },

  async obtenerTrazabilidadCompleta(id: string): Promise<PlantaConTrazabilidad> {
    const planta = await this.obtenerPlanta(id);
    const informes = await this.obtenerInformes(id);
    const etapas = await this.obtenerEtapas(id);
    return {
      ...planta,
      informes: [],
      etapas
    };
  },

  async obtenerPlantasPorEstado(estado: EstadoPlanta): Promise<Planta[]> {
    const plantas = await this.obtenerPlantas();
    return plantas.filter(p => p.estado === estado);
  },

  async obtenerPlantasPorTipo(tipo: TipoPlanta): Promise<Planta[]> {
    const plantas = await this.obtenerPlantas();
    return plantas.filter(p => p.tipo === tipo);
  },

  async generarCodigoQR(nombre: string): Promise<string> {
    return generarCodigoQR(nombre);
  },

  async limpiarDatos(): Promise<void> {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(INFORMES_DETALLE_KEY);
    localStorage.removeItem(ETAPAS_KEY);
    initData();
  }
};

export default produccionService;