// src/context/SecurityContext.tsx
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import api from '../services/api';
import type {
  AccessRecord,
  CrearAccessRecordDTO,
  UpdateAccessRecordDTO,
  PedestrianRecord,
  CrearPedestrianRecordDTO,
  UpdatePedestrianRecordDTO,
  IncidentRecord,
  CrearIncidentDTO,
  UpdateIncidentDTO,
  Camera,
  Recording,
  SecurityEvent,
  SecurityLog,
  AccessControl,
  PaginatedResponse,
  PaginationParams,
  AccessRecordFilters,
  PedestrianRecordFilters,
  IncidentFilters,
  AccessStatistics,
  PedestrianStatistics,
  IncidentStatistics,
  DashboardSecurityData,
  SecurityAlert,
  TipoCamera,
  CalidadGrabacion,
  TipoGrabacion,
  EstadoGrabacion,
  TipoAcceso,
  NivelRiesgo,
  CategoriaLog,
  TipoEvento,
} from '../types/index';
// ... resto del código

interface SecurityContextType {
  // Access Control Vehicular
  accessRecords: AccessRecord[];
  accessLoading: boolean;
  fetchAccessRecords: () => Promise<void>;
  createAccessRecord: (data: CrearAccessRecordDTO) => Promise<AccessRecord>;
  updateAccessRecord: (id: string, data: UpdateAccessRecordDTO) => Promise<AccessRecord>;
  deleteAccessRecord: (id: string) => Promise<void>;

  // Access Control Peatonal
  pedestrianRecords: PedestrianRecord[];
  pedestrianLoading: boolean;
  fetchPedestrianRecords: () => Promise<void>;
  createPedestrianRecord: (data: CrearPedestrianRecordDTO) => Promise<PedestrianRecord>;
  updatePedestrianRecord: (id: string, data: UpdatePedestrianRecordDTO) => Promise<PedestrianRecord>;
  deletePedestrianRecord: (id: string) => Promise<void>;

  // Incidentes
  incidents: IncidentRecord[];
  incidentLoading: boolean;
  fetchIncidents: () => Promise<void>;
  createIncident: (data: CrearIncidentDTO) => Promise<IncidentRecord>;
  updateIncident: (id: string, data: UpdateIncidentDTO) => Promise<IncidentRecord>;
  deleteIncident: (id: string) => Promise<void>;
  resolveIncident: (id: string) => Promise<IncidentRecord>;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export const SecurityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Access Control Vehicular
  const [accessRecords, setAccessRecords] = useState<AccessRecord[]>([]);
  const [accessLoading, setAccessLoading] = useState(false);

  // Access Control Peatonal
  const [pedestrianRecords, setPedestrianRecords] = useState<PedestrianRecord[]>([]);
  const [pedestrianLoading, setPedestrianLoading] = useState(false);

  // Incidentes
  const [incidents, setIncidents] = useState<IncidentRecord[]>([]);
  const [incidentLoading, setIncidentLoading] = useState(false);

  // ============================================
  // ACCESS CONTROL VEHICULAR
  // ============================================

  const fetchAccessRecords = useCallback(async () => {
    setAccessLoading(true);
    try {
      const response = await api.get('/security/access-vehicular');
      setAccessRecords(response.data);
    } catch (error) {
      console.error('Error fetching access records:', error);
      throw error;
    } finally {
      setAccessLoading(false);
    }
  }, []);

  const createAccessRecord = useCallback(async (data: CrearAccessRecordDTO): Promise<AccessRecord> => {
    try {
      const response = await api.post('/security/access-vehicular', data);
      setAccessRecords(prev => [response.data, ...prev]);
      return response.data;
    } catch (error) {
      console.error('Error creating access record:', error);
      throw error;
    }
  }, []);

  const updateAccessRecord = useCallback(async (id: string, data: UpdateAccessRecordDTO): Promise<AccessRecord> => {
    try {
      const response = await api.patch(`/security/access-vehicular/${id}`, data);
      setAccessRecords(prev => prev.map(r => r.id === id ? response.data : r));
      return response.data;
    } catch (error) {
      console.error('Error updating access record:', error);
      throw error;
    }
  }, []);

  const deleteAccessRecord = useCallback(async (id: string): Promise<void> => {
    try {
      await api.delete(`/security/access-vehicular/${id}`);
      setAccessRecords(prev => prev.filter(r => r.id !== id));
    } catch (error) {
      console.error('Error deleting access record:', error);
      throw error;
    }
  }, []);

  // ============================================
  // ACCESS CONTROL PEATONAL
  // ============================================

  const fetchPedestrianRecords = useCallback(async () => {
    setPedestrianLoading(true);
    try {
      const response = await api.get('/security/access-peatonal');
      setPedestrianRecords(response.data);
    } catch (error) {
      console.error('Error fetching pedestrian records:', error);
      throw error;
    } finally {
      setPedestrianLoading(false);
    }
  }, []);

  const createPedestrianRecord = useCallback(async (data: CrearPedestrianRecordDTO): Promise<PedestrianRecord> => {
    try {
      const response = await api.post('/security/access-peatonal', data);
      setPedestrianRecords(prev => [response.data, ...prev]);
      return response.data;
    } catch (error) {
      console.error('Error creating pedestrian record:', error);
      throw error;
    }
  }, []);

  const updatePedestrianRecord = useCallback(async (id: string, data: UpdatePedestrianRecordDTO): Promise<PedestrianRecord> => {
    try {
      const response = await api.patch(`/security/access-peatonal/${id}`, data);
      setPedestrianRecords(prev => prev.map(r => r.id === id ? response.data : r));
      return response.data;
    } catch (error) {
      console.error('Error updating pedestrian record:', error);
      throw error;
    }
  }, []);

  const deletePedestrianRecord = useCallback(async (id: string): Promise<void> => {
    try {
      await api.delete(`/security/access-peatonal/${id}`);
      setPedestrianRecords(prev => prev.filter(r => r.id !== id));
    } catch (error) {
      console.error('Error deleting pedestrian record:', error);
      throw error;
    }
  }, []);

  // ============================================
  // INCIDENTES
  // ============================================

  const fetchIncidents = useCallback(async () => {
    setIncidentLoading(true);
    try {
      const response = await api.get('/security/incidentes');
      setIncidents(response.data);
    } catch (error) {
      console.error('Error fetching incidents:', error);
      throw error;
    } finally {
      setIncidentLoading(false);
    }
  }, []);

  const createIncident = useCallback(async (data: CrearIncidentDTO): Promise<IncidentRecord> => {
    try {
      const response = await api.post('/security/incidentes', data);
      setIncidents(prev => [response.data, ...prev]);
      return response.data;
    } catch (error) {
      console.error('Error creating incident:', error);
      throw error;
    }
  }, []);

  const updateIncident = useCallback(async (id: string, data: UpdateIncidentDTO): Promise<IncidentRecord> => {
    try {
      const response = await api.patch(`/security/incidentes/${id}`, data);
      setIncidents(prev => prev.map(i => i.id === id ? response.data : i));
      return response.data;
    } catch (error) {
      console.error('Error updating incident:', error);
      throw error;
    }
  }, []);

  const deleteIncident = useCallback(async (id: string): Promise<void> => {
    try {
      await api.delete(`/security/incidentes/${id}`);
      setIncidents(prev => prev.filter(i => i.id !== id));
    } catch (error) {
      console.error('Error deleting incident:', error);
      throw error;
    }
  }, []);

  const resolveIncident = useCallback(async (id: string): Promise<IncidentRecord> => {
    try {
      const response = await api.patch(`/security/incidentes/${id}/resolver`);
      setIncidents(prev => prev.map(i => i.id === id ? response.data : i));
      return response.data;
    } catch (error) {
      console.error('Error resolving incident:', error);
      throw error;
    }
  }, []);

  const value: SecurityContextType = {
    accessRecords,
    accessLoading,
    fetchAccessRecords,
    createAccessRecord,
    updateAccessRecord,
    deleteAccessRecord,
    pedestrianRecords,
    pedestrianLoading,
    fetchPedestrianRecords,
    createPedestrianRecord,
    updatePedestrianRecord,
    deletePedestrianRecord,
    incidents,
    incidentLoading,
    fetchIncidents,
    createIncident,
    updateIncident,
    deleteIncident,
    resolveIncident,
  };

  return (
    <SecurityContext.Provider value={value}>
      {children}
    </SecurityContext.Provider>
  );
};

export const useSecurity = (): SecurityContextType => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
};