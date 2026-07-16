// src/services/produccionService.ts
import api from './api';
import { generateLotCode, isValidLotCode } from '../utils/qrGenerator';
import type {
  Planta,
  PlantaInforme,
  EtapaTrazabilidad,
  CrearPlantaDTO,
  UpdatePlantaDTO,
  CrearInformeDTO,
  CrearEtapaDTO,
  PlantaConInformes,
  PlantaConTrazabilidad,
  EstadoPlanta,
  TipoPlanta,
  LotEstado,
} from '../types/produccion';

// ============================================
// ✅ USAR UN PRODUCTO ID REAL DE LA BD
// ============================================
// PROD-001: 77e4d19e-b709-47b0-8361-ae297c6a49d8
// PROD-002: f878ab38-254b-4551-a57d-fa418bc5cbf9
// PROD-003: 8f34daa6-9ed0-4648-81ed-d2163d57f6ae
// PROD-004: 0ffde6c9-3034-4dc9-a805-067121c51b0f

const DEFAULT_PRODUCT_ID = '77e4d19e-b709-47b0-8361-ae297c6a49d8'; // PROD-001

// ============================================
// TIPOS PARA NESTJS
// ============================================

interface NestLot {
  id: string;
  codigo: string;
  nombre: string;
  descripcion?: string;
  productoId: string;
  cantidadInicial: number;
  cantidadActual: number;
  fechaProduccion: string;
  fechaVencimiento?: string;
  estado: LotEstado;
  usuarioId?: string;
  notas?: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// SERVICIO DE PRODUCCIÓN - COMPLETO
// ============================================

export const produccionService = {
  // ============================================
  // 🏷️ PLANTAS (LOTS) - NESTJS ENDPOINTS
  // ============================================
  
  obtenerPlantas: async (): Promise<Planta[]> => {
    try {
      const response = await api.get('/production/lots');
      const lots: NestLot[] = response.data;
      
      console.log('📦 Plantas obtenidas:', lots.length);
      
      return lots.map((lot: NestLot) => ({
        id: lot.id,
        nombre: lot.nombre || lot.descripcion || 'Sin nombre',
        codigo_qr: lot.codigo,
        tipo: 'HIBRIDA' as TipoPlanta,
        banco_procedencia: lot.notas || '',
        lote: lot.codigo,
        fecha_germinacion: lot.fechaProduccion || '',
        fecha_clonacion: lot.fechaVencimiento || '',
        descripcion: lot.descripcion || '',
        estado: (lot.estado === 'COMPLETADO' ? 'FINALIZADO' : 
                 lot.estado === 'CANCELADO' ? 'CANCELADO' : 'ACTIVO') as EstadoPlanta,
        company_id: lot.companyId || 'company-1',
        created_at: lot.createdAt,
        updated_at: lot.updatedAt,
      }));
    } catch (error) {
      console.error('❌ Error obteniendo plantas:', error);
      throw error;
    }
  },

  obtenerPlanta: async (id: string): Promise<PlantaConInformes> => {
    try {
      const response = await api.get(`/production/lots/${id}`);
      const lot: NestLot = response.data;
      
      const planta: Planta = {
        id: lot.id,
        nombre: lot.nombre || lot.descripcion || 'Sin nombre',
        codigo_qr: lot.codigo,
        tipo: 'HIBRIDA' as TipoPlanta,
        banco_procedencia: lot.notas || '',
        lote: lot.codigo,
        fecha_germinacion: lot.fechaProduccion || '',
        fecha_clonacion: lot.fechaVencimiento || '',
        descripcion: lot.descripcion || '',
        estado: (lot.estado === 'COMPLETADO' ? 'FINALIZADO' : 
                 lot.estado === 'CANCELADO' ? 'CANCELADO' : 'ACTIVO') as EstadoPlanta,
        company_id: lot.companyId || 'company-1',
        created_at: lot.createdAt,
        updated_at: lot.updatedAt,
      };
      
      // Obtener tracking para informes
      const trackingResponse = await api.get(`/production/tracking/lot/${id}`);
      const trackings = trackingResponse.data || [];
      
      const informes: PlantaInforme[] = trackings
        .filter((t: any) => t.etapa === 'INFORME' || t.referencia?.includes('Informe'))
        .map((t: any) => ({
          id: t.id,
          planta_id: t.productionLotId || id,
          titulo: t.referencia || 'Informe',
          descripcion: '',
          tipo: 'GENERAL' as any,
          fecha_informe: t.fecha || t.createdAt || new Date().toISOString(),
          autor: '',
          imagen_url: '',
          datos_medicion: {
            temperatura: t.temperatura,
            humedad: t.humedad,
          },
          recomendaciones: '',
          estado: 'PUBLICADO',
          created_at: t.createdAt || new Date().toISOString(),
          updated_at: t.updatedAt || new Date().toISOString(),
        }));
      
      return {
        ...planta,
        informes: informes.map(i => ({
          id: i.id,
          planta_id: i.planta_id,
          titulo: i.titulo,
          descripcion: i.descripcion,
          fecha: i.fecha_informe,
          tipo: 'GENERAL' as any,
          created_at: i.created_at,
          updated_at: i.updated_at || i.created_at,
        })),
      };
    } catch (error) {
      console.error('❌ Error obteniendo planta:', error);
      throw error;
    }
  },

  obtenerPlantaPorCodigo: async (codigo: string): Promise<Planta> => {
    try {
      const response = await api.get(`/production/lots/code/${codigo}`);
      const lot: NestLot = response.data;
      
      return {
        id: lot.id,
        nombre: lot.nombre || lot.descripcion || 'Sin nombre',
        codigo_qr: lot.codigo,
        tipo: 'HIBRIDA' as TipoPlanta,
        banco_procedencia: lot.notas || '',
        lote: lot.codigo,
        fecha_germinacion: lot.fechaProduccion || '',
        fecha_clonacion: lot.fechaVencimiento || '',
        descripcion: lot.descripcion || '',
        estado: (lot.estado === 'COMPLETADO' ? 'FINALIZADO' : 
                 lot.estado === 'CANCELADO' ? 'CANCELADO' : 'ACTIVO') as EstadoPlanta,
        company_id: lot.companyId || 'company-1',
        created_at: lot.createdAt,
        updated_at: lot.updatedAt,
      };
    } catch (error) {
      console.error('❌ Error obteniendo planta por código:', error);
      throw error;
    }
  },

  crearPlanta: async (data: CrearPlantaDTO): Promise<Planta> => {
    try {
      const codigoQR = data.codigo_qr || generateLotCode();
      
      console.log('📦 Creando lote con datos:', {
        productoId: DEFAULT_PRODUCT_ID,
        codigo: codigoQR,
        nombre: data.nombre,
        cantidadInicial: 1,
        fechaProduccion: data.fecha_germinacion || new Date().toISOString(),
      });

      const payload = {
        productoId: DEFAULT_PRODUCT_ID,
        codigo: codigoQR,
        nombre: data.nombre,
        descripcion: data.descripcion || '',
        cantidadInicial: 1,
        cantidadActual: 1,
        fechaProduccion: data.fecha_germinacion || new Date().toISOString(),
      };

      console.log('📤 Enviando payload a NestJS:', payload);

      const response = await api.post('/production/lots', payload);
      const lot: NestLot = response.data;
      
      console.log('✅ Lote creado:', lot);

      return {
        id: lot.id,
        nombre: lot.nombre || lot.descripcion || 'Sin nombre',
        codigo_qr: lot.codigo,
        tipo: (data.tipo as TipoPlanta) || 'HIBRIDA',
        banco_procedencia: lot.notas || '',
        lote: lot.codigo,
        fecha_germinacion: lot.fechaProduccion || '',
        fecha_clonacion: lot.fechaVencimiento || '',
        descripcion: lot.descripcion || '',
        estado: 'ACTIVO',
        company_id: lot.companyId || 'company-1',
        created_at: lot.createdAt,
        updated_at: lot.updatedAt,
      };
    } catch (error: any) {
      console.error('❌ Error creando planta:', error.response?.data || error);
      throw error;
    }
  },

  actualizarPlanta: async (id: string, data: UpdatePlantaDTO): Promise<Planta> => {
    try {
      const payload: any = {};
      
      if (data.nombre) payload.nombre = data.nombre;
      if (data.descripcion) payload.descripcion = data.descripcion;
      if (data.fecha_germinacion) payload.fechaProduccion = data.fecha_germinacion;
      if (data.fecha_clonacion) payload.fechaVencimiento = data.fecha_clonacion;
      if (data.banco_procedencia) payload.notas = data.banco_procedencia;
      
      if (data.estado) {
        const estadoMap: Record<string, string> = {
          'ACTIVO': 'ACTIVO',
          'FINALIZADO': 'COMPLETADO',
          'CANCELADO': 'CANCELADO'
        };
        payload.estado = estadoMap[data.estado] || 'ACTIVO';
      }

      console.log('📤 Actualizando lote:', { id, payload });

      const response = await api.patch(`/production/lots/${id}`, payload);
      const lot: NestLot = response.data;
      
      return {
        id: lot.id,
        nombre: lot.nombre || lot.descripcion || 'Sin nombre',
        codigo_qr: lot.codigo,
        tipo: (data.tipo as TipoPlanta) || 'HIBRIDA',
        banco_procedencia: lot.notas || '',
        lote: lot.codigo,
        fecha_germinacion: lot.fechaProduccion || '',
        fecha_clonacion: lot.fechaVencimiento || '',
        descripcion: lot.descripcion || '',
        estado: (lot.estado === 'COMPLETADO' ? 'FINALIZADO' : 
                 lot.estado === 'CANCELADO' ? 'CANCELADO' : 'ACTIVO') as EstadoPlanta,
        company_id: lot.companyId || 'company-1',
        created_at: lot.createdAt,
        updated_at: lot.updatedAt,
      };
    } catch (error) {
      console.error('❌ Error actualizando planta:', error);
      throw error;
    }
  },

  actualizarEstadoPlanta: async (id: string, estado: string): Promise<Planta> => {
    try {
      const estadoMap: Record<string, string> = {
        'ACTIVO': 'ACTIVO',
        'FINALIZADO': 'COMPLETADO',
        'CANCELADO': 'CANCELADO'
      };
      
      const backendEstado = estadoMap[estado] || estado;
      
      const response = await api.patch(`/production/lots/${id}/status`, { estado: backendEstado });
      const lot: NestLot = response.data;
      
      return {
        id: lot.id,
        nombre: lot.nombre || lot.descripcion || 'Sin nombre',
        codigo_qr: lot.codigo,
        tipo: 'HIBRIDA',
        banco_procedencia: lot.notas || '',
        lote: lot.codigo,
        fecha_germinacion: lot.fechaProduccion || '',
        fecha_clonacion: lot.fechaVencimiento || '',
        descripcion: lot.descripcion || '',
        estado: (lot.estado === 'COMPLETADO' ? 'FINALIZADO' : 
                 lot.estado === 'CANCELADO' ? 'CANCELADO' : 'ACTIVO') as EstadoPlanta,
        company_id: lot.companyId || 'company-1',
        created_at: lot.createdAt,
        updated_at: lot.updatedAt,
      };
    } catch (error) {
      console.error('❌ Error actualizando estado de planta:', error);
      throw error;
    }
  },

  eliminarPlanta: async (id: string): Promise<void> => {
    try {
      await api.delete(`/production/lots/${id}`);
      console.log('🗑️ Planta eliminada:', id);
    } catch (error) {
      console.error('❌ Error eliminando planta:', error);
      throw error;
    }
  },

  obtenerPlantasPorEstado: async (estado: EstadoPlanta): Promise<Planta[]> => {
    const plantas = await produccionService.obtenerPlantas();
    return plantas.filter(p => p.estado === estado);
  },

  obtenerPlantasPorTipo: async (tipo: TipoPlanta): Promise<Planta[]> => {
    const plantas = await produccionService.obtenerPlantas();
    return plantas.filter(p => p.tipo === tipo);
  },

  obtenerEstadisticas: async () => {
    const plantas = await produccionService.obtenerPlantas();
    const total = plantas.length;
    const activas = plantas.filter(p => p.estado === 'ACTIVO').length;
    const finalizadas = plantas.filter(p => p.estado === 'FINALIZADO').length;
    const canceladas = plantas.filter(p => p.estado === 'CANCELADO').length;
    
    const porTipo: Record<string, number> = {};
    plantas.forEach(p => {
      porTipo[p.tipo] = (porTipo[p.tipo] || 0) + 1;
    });
    
    return { total, activas, finalizadas, canceladas, porTipo };
  },

  // ============================================
  // 📋 ETAPAS - CORREGIDO
  // ============================================

  agregarEtapa: async (plantaId: string, data: any): Promise<EtapaTrazabilidad> => {
    try {
      // Obtener el lote para saber el stock actual
      const lotResponse = await api.get(`/production/lots/${plantaId}`);
      const lot = lotResponse.data;
      
      const stockActual = lot.cantidadActual || 0;
      
      // Payload EXACTO para NestJS (solo campos permitidos)
      const payload = {
        productionLotId: plantaId,
        cantidad: 0,
        stockAnterior: stockActual,
        stockNuevo: stockActual,
        referencia: data.etapa || 'SIEMBRA',
        etapa: 'PROCESO',
        temperatura: data.temperatura ? Number(data.temperatura) : undefined,
        humedad: data.humedad ? Number(data.humedad) : undefined,
        fecha: data.fecha_inicio ? new Date(data.fecha_inicio) : new Date(),
      };

      console.log('📤 Enviando etapa a NestJS:', payload);

      const response = await api.post('/production/tracking', payload);
      const t = response.data;
      
      console.log('✅ Etapa creada:', t);

      return {
        id: t.id,
        planta_id: t.productionLotId || plantaId,
        etapa: t.referencia || data.etapa || 'SIEMBRA',
        estado: 'PENDIENTE' as any,
        fecha_inicio: t.fecha || t.createdAt || new Date().toISOString(),
        fecha_fin: '',
        responsable_nombre: '',
        observaciones: data.observaciones || '',
        temperatura: t.temperatura,
        humedad: t.humedad,
        created_at: t.createdAt || new Date().toISOString(),
        updated_at: t.updatedAt || new Date().toISOString(),
      };
    } catch (error: any) {
      console.error('❌ Error creando etapa:', error.response?.data || error);
      throw error;
    }
  },

  actualizarEtapa: async (etapaId: string, data: any): Promise<EtapaTrazabilidad> => {
    try {
      // Primero obtener el tracking existente
      const trackingResponse = await api.get(`/production/tracking/${etapaId}`);
      const existing = trackingResponse.data;
      
      // Obtener el lote para el stock
      const lotResponse = await api.get(`/production/lots/${existing.productionLotId}`);
      const lot = lotResponse.data;
      const stockActual = lot.cantidadActual || 0;
      
      // Payload para actualizar (solo campos permitidos)
      const payload: any = {
        cantidad: 0,
        stockAnterior: stockActual,
        stockNuevo: stockActual,
      };
      
      if (data.etapa) payload.referencia = data.etapa;
      if (data.temperatura !== undefined) payload.temperatura = Number(data.temperatura);
      if (data.humedad !== undefined) payload.humedad = Number(data.humedad);
      if (data.fecha_inicio) payload.fecha = new Date(data.fecha_inicio);
      
      console.log('📤 Actualizando etapa en NestJS:', payload);

      const response = await api.patch(`/production/tracking/${etapaId}`, payload);
      const t = response.data;
      
      return {
        id: t.id,
        planta_id: t.productionLotId,
        etapa: t.referencia || data.etapa || 'SIEMBRA',
        estado: 'PENDIENTE' as any,
        fecha_inicio: t.fecha || t.createdAt || new Date().toISOString(),
        fecha_fin: '',
        responsable_nombre: '',
        observaciones: data.observaciones || '',
        temperatura: t.temperatura,
        humedad: t.humedad,
        created_at: t.createdAt || new Date().toISOString(),
        updated_at: t.updatedAt || new Date().toISOString(),
      };
    } catch (error: any) {
      console.error('❌ Error actualizando etapa:', error.response?.data || error);
      throw error;
    }
  },

  eliminarEtapa: async (etapaId: string): Promise<void> => {
    try {
      await api.delete(`/production/tracking/${etapaId}`);
      console.log('🗑️ Etapa eliminada:', etapaId);
    } catch (error) {
      console.error('❌ Error eliminando etapa:', error);
      throw error;
    }
  },



// src/services/produccionService.ts

// src/services/produccionService.ts

crearInforme: async (plantaId: string, data: any): Promise<PlantaInforme> => {
  try {
    const lotResponse = await api.get(`/production/lots/${plantaId}`);
    const lot = lotResponse.data;
    const stockActual = lot.cantidadActual || 0;
    
    const payload = {
      productionLotId: plantaId,
      cantidad: 0,
      stockAnterior: stockActual,
      stockNuevo: stockActual,
      referencia: data.titulo || 'Informe',
      tipoMovimiento: 'INFORME',        // ✅ Usar esto en lugar de etapa
      // etapa: 'INFORME',             // ❌ Comentar o eliminar
      temperatura: data.datos_medicion?.temperatura ? Number(data.datos_medicion.temperatura) : undefined,
      humedad: data.datos_medicion?.humedad ? Number(data.datos_medicion.humedad) : undefined,
      fecha: data.fecha_informe ? new Date(data.fecha_informe) : new Date(),
    };

    console.log('📤 Enviando informe a NestJS - PAYLOAD COMPLETO:', JSON.stringify(payload, null, 2));

    const response = await api.post('/production/tracking', payload);
    const t = response.data;
    
    return {
      id: t.id,
      planta_id: t.productionLotId || plantaId,
      titulo: t.referencia || data.titulo || 'Informe',
      descripcion: data.descripcion || '',
      tipo: data.tipo || 'GENERAL',
      fecha_informe: t.fecha || t.createdAt || new Date().toISOString(),
      autor: '',
      imagen_url: data.imagen_url || '',
      datos_medicion: {
        temperatura: t.temperatura,
        humedad: t.humedad,
        ...(data.datos_medicion || {}),
      },
      recomendaciones: data.recomendaciones || '',
      estado: data.estado || 'PUBLICADO',
      created_at: t.createdAt || new Date().toISOString(),
      updated_at: t.updatedAt || new Date().toISOString(),
    };
  } catch (error: any) {
    console.error('❌ Error creando informe:', error.response?.data || error);
    throw error;
  }
},


  actualizarInforme: async (plantaId: string, informeId: string, data: any): Promise<PlantaInforme> => {
    try {
      // Primero obtener el tracking existente
      const trackingResponse = await api.get(`/production/tracking/${informeId}`);
      const existing = trackingResponse.data;
      
      // Obtener el lote para el stock
      const lotResponse = await api.get(`/production/lots/${existing.productionLotId}`);
      const lot = lotResponse.data;
      const stockActual = lot.cantidadActual || 0;
      
      const payload: any = {
        cantidad: 0,
        stockAnterior: stockActual,
        stockNuevo: stockActual,
      };
      
      if (data.titulo) payload.referencia = data.titulo;
      if (data.datos_medicion?.temperatura !== undefined) payload.temperatura = Number(data.datos_medicion.temperatura);
      if (data.datos_medicion?.humedad !== undefined) payload.humedad = Number(data.datos_medicion.humedad);
      if (data.fecha_informe) payload.fecha = new Date(data.fecha_informe);
      
      const response = await api.patch(`/production/tracking/${informeId}`, payload);
      const t = response.data;
      
      return {
        id: t.id,
        planta_id: t.productionLotId || plantaId,
        titulo: t.referencia || data.titulo || 'Informe',
        descripcion: data.descripcion || '',
        tipo: 'GENERAL' as any,
        fecha_informe: t.fecha || t.createdAt || new Date().toISOString(),
        autor: '',
        imagen_url: '',
        datos_medicion: {
          temperatura: t.temperatura,
          humedad: t.humedad,
        },
        recomendaciones: '',
        estado: 'PUBLICADO',
        created_at: t.createdAt || new Date().toISOString(),
        updated_at: t.updatedAt || new Date().toISOString(),
      };
    } catch (error: any) {
      console.error('❌ Error actualizando informe:', error.response?.data || error);
      throw error;
    }
  },

  eliminarInforme: async (plantaId: string, informeId: string): Promise<void> => {
    try {
      await api.delete(`/production/tracking/${informeId}`);
      console.log('🗑️ Informe eliminado:', informeId);
    } catch (error) {
      console.error('❌ Error eliminando informe:', error);
      throw error;
    }
  },
// src/services/produccionService.ts

// ✅ obtenerEtapas - Solo registros que NO son informes
obtenerEtapas: async (plantaId: string): Promise<EtapaTrazabilidad[]> => {
  try {
    const response = await api.get(`/production/tracking/lot/${plantaId}`);
    const trackings = response.data || [];
    
    return trackings
      .filter((t: any) => t.etapa !== 'INFORME' && t.tipoMovimiento !== 'INFORME')
      .map((t: any) => ({
        id: t.id,
        planta_id: t.productionLotId || plantaId,
        etapa: t.referencia || t.etapa || 'SIEMBRA',
        estado: (t.estado as any) || 'PENDIENTE',
        fecha_inicio: t.fecha || t.createdAt || new Date().toISOString(),
        fecha_fin: '',
        responsable_nombre: '',
        observaciones: t.observaciones || '',
        temperatura: t.temperatura,
        humedad: t.humedad,
        created_at: t.createdAt || new Date().toISOString(),
        updated_at: t.updatedAt || new Date().toISOString(),
      }));
  } catch (error) {
    console.error('Error obteniendo etapas:', error);
    return [];
  }
},

// ✅ obtenerInformes - Solo registros que SON informes
obtenerInformes: async (plantaId: string): Promise<PlantaInforme[]> => {
  try {
    const response = await api.get(`/production/tracking/lot/${plantaId}`);
    const trackings = response.data || [];
    
    return trackings
      .filter((t: any) => t.etapa === 'INFORME' || t.tipoMovimiento === 'INFORME')
      .map((t: any) => ({
        id: t.id,
        planta_id: t.productionLotId || plantaId,
        titulo: t.referencia || 'Informe',
        descripcion: t.observaciones || '',
        tipo: 'GENERAL' as any,
        fecha_informe: t.fecha || t.createdAt || new Date().toISOString(),
        autor: '',
        imagen_url: '',
        datos_medicion: {
          temperatura: t.temperatura,
          humedad: t.humedad,
        },
        recomendaciones: '',
        estado: 'PUBLICADO',
        created_at: t.createdAt || new Date().toISOString(),
        updated_at: t.updatedAt || new Date().toISOString(),
      }));
  } catch (error) {
    console.error('Error obteniendo informes:', error);
    return [];
  }
},
 

  // ============================================
  // 🔬 PATHOLOGIES (PATOLOGÍAS)
  // ============================================
  
  obtenerPatologias: async (): Promise<any[]> => {
    try {
      const response = await api.get('/production/pathologies');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo patologías:', error);
      return [];
    }
  },

  obtenerPatologiaPorId: async (id: string): Promise<any> => {
    try {
      const response = await api.get(`/production/pathologies/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo patología:', error);
      throw error;
    }
  },

  obtenerPatologiaPorCodigo: async (codigo: string): Promise<any> => {
    try {
      const response = await api.get(`/production/pathologies/code/${codigo}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo patología por código:', error);
      throw error;
    }
  },

  crearPatologia: async (data: any): Promise<any> => {
    try {
      const response = await api.post('/production/pathologies', data);
      return response.data;
    } catch (error) {
      console.error('Error creando patología:', error);
      throw error;
    }
  },

  actualizarPatologia: async (id: string, data: any): Promise<any> => {
    try {
      const response = await api.patch(`/production/pathologies/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error actualizando patología:', error);
      throw error;
    }
  },

  eliminarPatologia: async (id: string): Promise<void> => {
    try {
      await api.delete(`/production/pathologies/${id}`);
      console.log('🗑️ Patología eliminada:', id);
    } catch (error) {
      console.error('Error eliminando patología:', error);
      throw error;
    }
  },

  // ============================================
  // 🧩 TRAZABILIDAD COMPLETA
  // ============================================
  
  obtenerTrazabilidadCompleta: async (id: string): Promise<PlantaConTrazabilidad> => {
    const [planta, informes, etapas] = await Promise.all([
      produccionService.obtenerPlanta(id),
      produccionService.obtenerInformes(id),
      produccionService.obtenerEtapas(id),
    ]);
    
    return {
      ...planta,
      informes: informes.map(i => ({
        id: i.id,
        planta_id: i.planta_id,
        titulo: i.titulo,
        descripcion: i.descripcion,
        fecha: i.fecha_informe,
        tipo: 'GENERAL' as any,
        created_at: i.created_at,
        updated_at: i.updated_at || i.created_at,
      })),
      etapas,
    };
  },

  // ============================================
  // 🛠️ UTILIDADES
  // ============================================
  
  validarCodigoQR: async (codigo: string): Promise<boolean> => {
    try {
      await produccionService.obtenerPlantaPorCodigo(codigo);
      return true;
    } catch (error) {
      return false;
    }
  },

  generarCodigoQR: (): string => {
    return generateLotCode();
  },

  esCodigoQRValido: (codigo: string): boolean => {
    return isValidLotCode(codigo);
  },

  obtenerProductoPorDefecto: async (): Promise<string> => {
    try {
      const response = await api.get('/products');
      const products = response.data;
      
      if (products && products.length > 0) {
        return products[0].id;
      }
      
      return DEFAULT_PRODUCT_ID;
    } catch (error) {
      console.warn('⚠️ No se pudieron obtener productos, usando ID por defecto');
      return DEFAULT_PRODUCT_ID;
    }
  },
};