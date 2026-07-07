// src/context/ProductionContext.tsx
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import api from '../services/api';
import type {
  ProductionLot,
  LotTracking,
  CreateLotDto,
  UpdateLotDto,
  CreateLotTrackingDto,
  Product,
  User,
  Company,
  PaginatedResponse,
  PaginationParams,
  LotEstado,
  EtapaProduccion,
} from '../types/index';
// ... resto del código

interface ProductionContextType {
  plantas: Planta[];
  plantaSeleccionada: Planta | null;
  informes: PlantaInforme[];
  etapas: EtapaTrazabilidad[];
  loading: boolean;
  
  // Plantas
  fetchPlantas: () => Promise<void>;
  fetchPlanta: (id: string) => Promise<Planta>;
  createPlanta: (data: CrearPlantaDTO) => Promise<Planta>;
  updatePlanta: (id: string, data: UpdatePlantaDTO) => Promise<Planta>;
  deletePlanta: (id: string) => Promise<void>;
  setPlantaSeleccionada: (planta: Planta | null) => void;
  
  // Informes
  fetchInformes: (plantaId: string) => Promise<PlantaInforme[]>;
  createInforme: (data: CrearInformeDTO) => Promise<PlantaInforme>;
  updateInforme: (id: string, data: Partial<CrearInformeDTO>) => Promise<PlantaInforme>;
  deleteInforme: (id: string) => Promise<void>;
  
  // Trazabilidad
  fetchEtapas: (plantaId: string) => Promise<EtapaTrazabilidad[]>;
  createEtapa: (data: CrearEtapaDTO) => Promise<EtapaTrazabilidad>;
  updateEtapa: (id: string, data: Partial<CrearEtapaDTO>) => Promise<EtapaTrazabilidad>;
  deleteEtapa: (id: string) => Promise<void>;
  
  // Reportes
  getPlantaConInformes: (id: string) => Promise<PlantaConInformes>;
  getPlantaConTrazabilidad: (id: string) => Promise<PlantaConTrazabilidad>;
}

const ProductionContext = createContext<ProductionContextType | undefined>(undefined);

export const ProductionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [plantas, setPlantas] = useState<Planta[]>([]);
  const [plantaSeleccionada, setPlantaSeleccionada] = useState<Planta | null>(null);
  const [informes, setInformes] = useState<PlantaInforme[]>([]);
  const [etapas, setEtapas] = useState<EtapaTrazabilidad[]>([]);
  const [loading, setLoading] = useState(false);

  // ============================================
  // PLANTAS
  // ============================================

  const fetchPlantas = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/production/plantas');
      setPlantas(response.data);
    } catch (error) {
      console.error('Error fetching plantas:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPlanta = useCallback(async (id: string): Promise<Planta> => {
    const response = await api.get(`/production/plantas/${id}`);
    return response.data;
  }, []);

  const createPlanta = useCallback(async (data: CrearPlantaDTO): Promise<Planta> => {
    const response = await api.post('/production/plantas', data);
    setPlantas(prev => [response.data, ...prev]);
    return response.data;
  }, []);

  const updatePlanta = useCallback(async (id: string, data: UpdatePlantaDTO): Promise<Planta> => {
    const response = await api.patch(`/production/plantas/${id}`, data);
    setPlantas(prev => prev.map(p => p.id === id ? response.data : p));
    if (plantaSeleccionada?.id === id) {
      setPlantaSeleccionada(response.data);
    }
    return response.data;
  }, [plantaSeleccionada]);

  const deletePlanta = useCallback(async (id: string): Promise<void> => {
    await api.delete(`/production/plantas/${id}`);
    setPlantas(prev => prev.filter(p => p.id !== id));
    if (plantaSeleccionada?.id === id) {
      setPlantaSeleccionada(null);
    }
  }, [plantaSeleccionada]);

  // ============================================
  // INFORMES
  // ============================================

  const fetchInformes = useCallback(async (plantaId: string): Promise<PlantaInforme[]> => {
    const response = await api.get(`/production/plantas/${plantaId}/informes`);
    setInformes(response.data);
    return response.data;
  }, []);

  const createInforme = useCallback(async (data: CrearInformeDTO): Promise<PlantaInforme> => {
    const response = await api.post('/production/informes', data);
    setInformes(prev => [response.data, ...prev]);
    return response.data;
  }, []);

  const updateInforme = useCallback(async (id: string, data: Partial<CrearInformeDTO>): Promise<PlantaInforme> => {
    const response = await api.patch(`/production/informes/${id}`, data);
    setInformes(prev => prev.map(i => i.id === id ? response.data : i));
    return response.data;
  }, []);

  const deleteInforme = useCallback(async (id: string): Promise<void> => {
    await api.delete(`/production/informes/${id}`);
    setInformes(prev => prev.filter(i => i.id !== id));
  }, []);

  // ============================================
  // TRAZABILIDAD
  // ============================================

  const fetchEtapas = useCallback(async (plantaId: string): Promise<EtapaTrazabilidad[]> => {
    const response = await api.get(`/production/plantas/${plantaId}/etapas`);
    setEtapas(response.data);
    return response.data;
  }, []);

  const createEtapa = useCallback(async (data: CrearEtapaDTO): Promise<EtapaTrazabilidad> => {
    const response = await api.post('/production/etapas', data);
    setEtapas(prev => [response.data, ...prev]);
    return response.data;
  }, []);

  const updateEtapa = useCallback(async (id: string, data: Partial<CrearEtapaDTO>): Promise<EtapaTrazabilidad> => {
    const response = await api.patch(`/production/etapas/${id}`, data);
    setEtapas(prev => prev.map(e => e.id === id ? response.data : e));
    return response.data;
  }, []);

  const deleteEtapa = useCallback(async (id: string): Promise<void> => {
    await api.delete(`/production/etapas/${id}`);
    setEtapas(prev => prev.filter(e => e.id !== id));
  }, []);

  // ============================================
  // REPORTES COMBINADOS
  // ============================================

  const getPlantaConInformes = useCallback(async (id: string): Promise<PlantaConInformes> => {
    const response = await api.get(`/production/plantas/${id}/con-informes`);
    return response.data;
  }, []);

  const getPlantaConTrazabilidad = useCallback(async (id: string): Promise<PlantaConTrazabilidad> => {
    const response = await api.get(`/production/plantas/${id}/con-trazabilidad`);
    return response.data;
  }, []);

  return (
    <ProductionContext.Provider
      value={{
        plantas,
        plantaSeleccionada,
        informes,
        etapas,
        loading,
        fetchPlantas,
        fetchPlanta,
        createPlanta,
        updatePlanta,
        deletePlanta,
        setPlantaSeleccionada,
        fetchInformes,
        createInforme,
        updateInforme,
        deleteInforme,
        fetchEtapas,
        createEtapa,
        updateEtapa,
        deleteEtapa,
        getPlantaConInformes,
        getPlantaConTrazabilidad,
      }}
    >
      {children}
    </ProductionContext.Provider>
  );
};

export const useProduction = () => {
  const context = useContext(ProductionContext);
  if (!context) {
    throw new Error('useProduction must be used within a ProductionProvider');
  }
  return context;
};