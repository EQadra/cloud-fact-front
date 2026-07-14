// src/context/ProductionContext.tsx
import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { produccionService } from '../services/produccionService';
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
} from '../types/produccion';
import { useAuth } from './AuthContext';

// =============================================
// INTERFACES DEL CONTEXTO
// =============================================

interface ProductionContextType {
  // Estado
  plantas: Planta[];
  plantaSeleccionada: Planta | null;
  informes: PlantaInforme[];
  etapas: EtapaTrazabilidad[];
  loading: boolean;
  error: string | null;
  
  // Estadísticas
  estadisticas: {
    total: number;
    activas: number;
    finalizadas: number;
    canceladas: number;
    porTipo: Record<string, number>;
  } | null;
  
  // Plantas
  fetchPlantas: () => Promise<void>;
  fetchPlanta: (id: string) => Promise<PlantaConInformes>;
  createPlanta: (data: CrearPlantaDTO) => Promise<Planta>;
  updatePlanta: (id: string, data: UpdatePlantaDTO) => Promise<Planta>;
  deletePlanta: (id: string) => Promise<void>;
  setPlantaSeleccionada: (planta: Planta | null) => void;
  fetchPlantasPorEstado: (estado: EstadoPlanta) => Promise<Planta[]>;
  fetchPlantasPorTipo: (tipo: TipoPlanta) => Promise<Planta[]>;
  fetchEstadisticas: () => Promise<void>;
  
  // Informes
  fetchInformes: (plantaId: string) => Promise<PlantaInforme[]>;
  createInforme: (plantaId: string, data: Omit<CrearInformeDTO, 'planta_id'>) => Promise<PlantaInforme>;
  updateInforme: (plantaId: string, informeId: string, data: Partial<PlantaInforme>) => Promise<PlantaInforme>;
  deleteInforme: (plantaId: string, informeId: string) => Promise<void>;
  
  // Etapas de Trazabilidad
  fetchEtapas: (plantaId: string) => Promise<EtapaTrazabilidad[]>;
  createEtapa: (data: CrearEtapaDTO) => Promise<EtapaTrazabilidad>;
  updateEtapa: (etapaId: string, data: Partial<CrearEtapaDTO>) => Promise<EtapaTrazabilidad>;
  deleteEtapa: (etapaId: string) => Promise<void>;
  getEtapasByPlanta: (plantaId: string) => EtapaTrazabilidad[];
  getEtapaActual: (plantaId: string) => EtapaTrazabilidad | undefined;
  getProgresoEtapas: (plantaId: string) => { completadas: number; total: number; porcentaje: number };
  
  // Reportes combinados
  getPlantaConInformes: (id: string) => Promise<PlantaConInformes>;
  getPlantaConTrazabilidad: (id: string) => Promise<PlantaConTrazabilidad>;
  
  // Utilidades
  clearError: () => void;
  resetState: () => void;
}

// =============================================
// CONTEXTO
// =============================================

const ProductionContext = createContext<ProductionContextType | undefined>(undefined);

// =============================================
// HOOK
// =============================================

export const useProduction = (): ProductionContextType => {
  const context = useContext(ProductionContext);
  if (!context) {
    throw new Error('useProduction must be used within a ProductionProvider');
  }
  return context;
};

// =============================================
// PROVIDER
// =============================================

export const ProductionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, token } = useAuth();
  
  // ===== ESTADOS =====
  const [plantas, setPlantas] = useState<Planta[]>([]);
  const [plantaSeleccionada, setPlantaSeleccionada] = useState<Planta | null>(null);
  const [informes, setInformes] = useState<PlantaInforme[]>([]);
  const [etapas, setEtapas] = useState<EtapaTrazabilidad[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [estadisticas, setEstadisticas] = useState<ProductionContextType['estadisticas']>(null);
  
  // ✅ useRef para controlar carga - EVITA BUCLES INFINITOS
  const initialLoadDone = useRef(false);
  const isFetching = useRef(false);

  // ============================================
  // LIMPIAR ERROR
  // ============================================

  const clearError = useCallback(() => setError(null), []);

  // ============================================
  // RESET ESTADO
  // ============================================

  const resetState = useCallback(() => {
    setPlantas([]);
    setPlantaSeleccionada(null);
    setInformes([]);
    setEtapas([]);
    setError(null);
    setEstadisticas(null);
    initialLoadDone.current = false;
    isFetching.current = false;
  }, []);

  // ============================================
  // ESTADÍSTICAS
  // ============================================

  const fetchEstadisticas = useCallback(async () => {
    try {
      const data = await produccionService.obtenerEstadisticas();
      setEstadisticas(data);
    } catch (err: any) {
      console.error('Error fetching estadisticas:', err);
    }
  }, []);

  // ============================================
  // ✅ PLANTAS - CON VERIFICACIÓN DE AUTENTICACIÓN
  // ============================================

  const fetchPlantas = useCallback(async () => {
    // ✅ No cargar si no está autenticado
    if (!isAuthenticated || !token) {
      console.log('⏳ [fetchPlantas] Usuario no autenticado, omitiendo carga...');
      return;
    }
    
    // ✅ Evitar ejecución concurrente
    if (isFetching.current) {
      console.log('⏳ [fetchPlantas] Ya hay una carga en progreso, omitiendo...');
      return;
    }
    
    try {
      isFetching.current = true;
      setLoading(true);
      setError(null);
      
      console.log('🌱 [ProductionContext] Obteniendo plantas...');
      const data = await produccionService.obtenerPlantas();
      console.log(`🌱 [ProductionContext] ${data.length} plantas obtenidas`);
      
      setPlantas(data);
      
      const total = data.length;
      const activas = data.filter(p => p.estado === 'ACTIVO').length;
      const finalizadas = data.filter(p => p.estado === 'FINALIZADO').length;
      const canceladas = data.filter(p => p.estado === 'CANCELADO').length;
      
      const porTipo: Record<string, number> = {};
      data.forEach(p => {
        porTipo[p.tipo] = (porTipo[p.tipo] || 0) + 1;
      });
      
      setEstadisticas({ total, activas, finalizadas, canceladas, porTipo });
      initialLoadDone.current = true;
    } catch (err: any) {
      // ✅ Si es error 401, no mostrar como error grave
      if (err.response?.status === 401) {
        console.log('🔒 [fetchPlantas] No autorizado, esperando autenticación...');
        setError(null);
      } else {
        setError(err.response?.data?.message || 'Error al cargar las plantas');
        console.error('Error fetching plantas:', err);
      }
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  }, [isAuthenticated, token]); // ✅ Depende de autenticación

  // ============================================
  // ✅ EFECTO CORREGIDO - CARGA CUANDO EL USUARIO SE AUTENTICA
  // ============================================

  useEffect(() => {
    console.log('🔄 [ProductionContext] useEffect - Verificando autenticación...');
    console.log(`🔄 [ProductionContext] isAuthenticated: ${isAuthenticated}`);
    console.log(`🔄 [ProductionContext] token: ${token ? '✅ Si' : '❌ No'}`);
    console.log(`🔄 [ProductionContext] initialLoadDone: ${initialLoadDone.current}`);
    
    // ✅ Solo cargar si está autenticado y no se ha cargado antes
    if (isAuthenticated && token && !initialLoadDone.current && !isFetching.current) {
      console.log('🔄 [ProductionContext] Usuario autenticado, cargando datos...');
      fetchPlantas();
    }
    
    // ✅ Si no está autenticado, limpiar datos
    if (!isAuthenticated && initialLoadDone.current) {
      console.log('🔄 [ProductionContext] Usuario desautenticado, limpiando datos...');
      setPlantas([]);
      setEstadisticas(null);
      initialLoadDone.current = false;
    }
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, token]); // ✅ Solo se ejecuta cuando cambia la autenticación

  // ============================================
  // RESTO DE FUNCIONES
  // ============================================

  const fetchPlanta = useCallback(async (id: string): Promise<PlantaConInformes> => {
    try {
      setLoading(true);
      setError(null);
      const data = await produccionService.obtenerPlanta(id);
      setPlantaSeleccionada(data);
      return data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar la planta');
      console.error('Error fetching planta:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createPlanta = useCallback(async (data: CrearPlantaDTO): Promise<Planta> => {
    try {
      setLoading(true);
      setError(null);
      
      const nuevaPlanta = await produccionService.crearPlanta({
        ...data,
        company_id: user?.companyId || 'company-1',
      });
      
      setPlantas(prev => [nuevaPlanta, ...prev]);
      await fetchEstadisticas();
      
      return nuevaPlanta;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear la planta');
      console.error('Error creating planta:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user, fetchEstadisticas]);

  const updatePlanta = useCallback(async (id: string, data: UpdatePlantaDTO): Promise<Planta> => {
    try {
      setLoading(true);
      setError(null);
      const plantaActualizada = await produccionService.actualizarPlanta(id, data);
      setPlantas(prev => prev.map(p => p.id === id ? plantaActualizada : p));
      if (plantaSeleccionada?.id === id) {
        setPlantaSeleccionada(plantaActualizada);
      }
      await fetchEstadisticas();
      return plantaActualizada;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al actualizar la planta');
      console.error('Error updating planta:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [plantaSeleccionada, fetchEstadisticas]);

  const deletePlanta = useCallback(async (id: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await produccionService.eliminarPlanta(id);
      setPlantas(prev => prev.filter(p => p.id !== id));
      if (plantaSeleccionada?.id === id) {
        setPlantaSeleccionada(null);
        setInformes([]);
        setEtapas([]);
      }
      await fetchEstadisticas();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al eliminar la planta');
      console.error('Error deleting planta:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [plantaSeleccionada, fetchEstadisticas]);

  const fetchPlantasPorEstado = useCallback(async (estado: EstadoPlanta): Promise<Planta[]> => {
    try {
      const data = await produccionService.obtenerPlantasPorEstado(estado);
      return data;
    } catch (err: any) {
      console.error('Error fetching plantas by estado:', err);
      throw err;
    }
  }, []);

  const fetchPlantasPorTipo = useCallback(async (tipo: TipoPlanta): Promise<Planta[]> => {
    try {
      const data = await produccionService.obtenerPlantasPorTipo(tipo);
      return data;
    } catch (err: any) {
      console.error('Error fetching plantas by tipo:', err);
      throw err;
    }
  }, []);

  const fetchInformes = useCallback(async (plantaId: string): Promise<PlantaInforme[]> => {
    try {
      setLoading(true);
      setError(null);
      const data = await produccionService.obtenerInformes(plantaId);
      setInformes(data);
      return data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar los informes');
      console.error('Error fetching informes:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createInforme = useCallback(async (plantaId: string, data: Omit<CrearInformeDTO, 'planta_id'>): Promise<PlantaInforme> => {
    try {
      setLoading(true);
      setError(null);
      
      const nuevoInforme: PlantaInforme = {
        id: `inf_${Date.now()}`,
        planta_id: plantaId,
        ...data,
        autor: user?.nombre || 'Usuario',
        created_at: new Date().toISOString(),
        estado: data.estado || 'BORRADOR',
      };
      
      const resultado = await produccionService.crearInforme(plantaId, nuevoInforme);
      setInformes(prev => [resultado, ...prev]);
      return resultado;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear el informe');
      console.error('Error creating informe:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const updateInforme = useCallback(async (plantaId: string, informeId: string, data: Partial<PlantaInforme>): Promise<PlantaInforme> => {
    try {
      setLoading(true);
      setError(null);
      const informeActualizado = await produccionService.actualizarInforme(plantaId, informeId, data);
      setInformes(prev => prev.map(i => i.id === informeId ? informeActualizado : i));
      return informeActualizado;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al actualizar el informe');
      console.error('Error updating informe:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteInforme = useCallback(async (plantaId: string, informeId: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await produccionService.eliminarInforme(plantaId, informeId);
      setInformes(prev => prev.filter(i => i.id !== informeId));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al eliminar el informe');
      console.error('Error deleting informe:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchEtapas = useCallback(async (plantaId: string): Promise<EtapaTrazabilidad[]> => {
    try {
      setLoading(true);
      setError(null);
      const etapasData = await produccionService.obtenerEtapas(plantaId);
      setEtapas(etapasData);
      return etapasData;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar las etapas');
      console.error('Error fetching etapas:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createEtapa = useCallback(async (data: CrearEtapaDTO): Promise<EtapaTrazabilidad> => {
    try {
      setLoading(true);
      setError(null);
      const nuevaEtapa = await produccionService.agregarEtapa(data.planta_id, data);
      setEtapas(prev => [...prev, nuevaEtapa]);
      return nuevaEtapa;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear la etapa');
      console.error('Error creating etapa:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateEtapa = useCallback(async (etapaId: string, data: Partial<CrearEtapaDTO>): Promise<EtapaTrazabilidad> => {
    try {
      setLoading(true);
      setError(null);
      const etapaActualizada = await produccionService.actualizarEtapa(etapaId, data);
      setEtapas(prev => prev.map(e => e.id === etapaId ? etapaActualizada : e));
      return etapaActualizada;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al actualizar la etapa');
      console.error('Error updating etapa:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteEtapa = useCallback(async (etapaId: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await produccionService.eliminarEtapa(etapaId);
      setEtapas(prev => prev.filter(e => e.id !== etapaId));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al eliminar la etapa');
      console.error('Error deleting etapa:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getEtapasByPlanta = useCallback((plantaId: string): EtapaTrazabilidad[] => {
    return etapas.filter(e => e.planta_id === plantaId);
  }, [etapas]);

  const getEtapaActual = useCallback((plantaId: string): EtapaTrazabilidad | undefined => {
    const etapasPlanta = etapas.filter(e => e.planta_id === plantaId);
    return etapasPlanta
      .filter(e => e.estado === 'EN_PROCESO' || e.estado === 'PENDIENTE')
      .sort((a, b) => new Date(b.fecha_inicio).getTime() - new Date(a.fecha_inicio).getTime())[0];
  }, [etapas]);

  const getProgresoEtapas = useCallback((plantaId: string): { completadas: number; total: number; porcentaje: number } => {
    const etapasPlanta = etapas.filter(e => e.planta_id === plantaId);
    const total = etapasPlanta.length;
    const completadas = etapasPlanta.filter(e => e.estado === 'COMPLETADO').length;
    const porcentaje = total > 0 ? Math.round((completadas / total) * 100) : 0;
    return { completadas, total, porcentaje };
  }, [etapas]);

  const getPlantaConInformes = useCallback(async (id: string): Promise<PlantaConInformes> => {
    try {
      const data = await produccionService.obtenerPlanta(id);
      return data;
    } catch (err: any) {
      console.error('Error getting planta con informes:', err);
      throw err;
    }
  }, []);

  const getPlantaConTrazabilidad = useCallback(async (id: string): Promise<PlantaConTrazabilidad> => {
    try {
      const data = await produccionService.obtenerTrazabilidadCompleta(id);
      return data;
    } catch (err: any) {
      console.error('Error getting planta con trazabilidad:', err);
      throw err;
    }
  }, []);

  // ============================================
  // VALUE DEL CONTEXTO
  // ============================================

  const value: ProductionContextType = {
    plantas,
    plantaSeleccionada,
    informes,
    etapas,
    loading,
    error,
    estadisticas,
    fetchPlantas,
    fetchPlanta,
    createPlanta,
    updatePlanta,
    deletePlanta,
    setPlantaSeleccionada,
    fetchPlantasPorEstado,
    fetchPlantasPorTipo,
    fetchEstadisticas,
    fetchInformes,
    createInforme,
    updateInforme,
    deleteInforme,
    fetchEtapas,
    createEtapa,
    updateEtapa,
    deleteEtapa,
    getEtapasByPlanta,
    getEtapaActual,
    getProgresoEtapas,
    getPlantaConInformes,
    getPlantaConTrazabilidad,
    clearError,
    resetState,
  };

  return (
    <ProductionContext.Provider value={value}>
      {children}
    </ProductionContext.Provider>
  );
};