// src/context/SecurityContext.tsx
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import api from '../services/api';
import {
  AccessRecord,
  CrearAccessRecordDTO,
  UpdateAccessRecordDTO,
  PedestrianRecord,
  CrearPedestrianRecordDTO,
  UpdatePedestrianRecordDTO,
  IncidentRecord,
  CrearIncidentDTO,
  UpdateIncidentDTO,
} from '../types/seguridad';

interface SecurityContextType {
  // Access Control Vehicular
  accessRecords: AccessRecord[];
  accessLoading: boolean;
  fetchAccessRecords: () => Promise<void>;
  createAccessRecord: (data: CrearAccessRecordDTO) => Promise<AccessRecord>;
  updateAccessRecord: (data: UpdateAccessRecordDTO) => Promise<AccessRecord>;
  deleteAccessRecord: (id: number) => Promise<void>;

  // Access Control Peatonal
  pedestrianRecords: PedestrianRecord[];
  pedestrianLoading: boolean;
  fetchPedestrianRecords: () => Promise<void>;
  createPedestrianRecord: (data: CrearPedestrianRecordDTO) => Promise<PedestrianRecord>;
  updatePedestrianRecord: (data: UpdatePedestrianRecordDTO) => Promise<PedestrianRecord>;
  deletePedestrianRecord: (id: number) => Promise<void>;

  // Incidentes
  incidents: IncidentRecord[];
  incidentLoading: boolean;
  fetchIncidents: () => Promise<void>;
  createIncident: (data: CrearIncidentDTO) => Promise<IncidentRecord>;
  updateIncident: (data: UpdateIncidentDTO) => Promise<IncidentRecord>;
  deleteIncident: (id: number) => Promise<void>;
  resolveIncident: (id: number) => Promise<IncidentRecord>;
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
    const response = await api.post('/security/access-vehicular', data);
    setAccessRecords(prev => [response.data, ...prev]);
    return response.data;
  }, []);

  const updateAccessRecord = useCallback(async (data: UpdateAccessRecordDTO): Promise<AccessRecord> => {
    const response = await api.patch(`/security/access-vehicular/${data.id}`, data);
    setAccessRecords(prev => prev.map(r => r.id === data.id ? response.data : r));
    return response.data;
  }, []);

  const deleteAccessRecord = useCallback(async (id: number): Promise<void> => {
    await api.delete(`/security/access-vehicular/${id}`);
    setAccessRecords(prev => prev.filter(r => r.id !== id));
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
    const response = await api.post('/security/access-peatonal', data);
    setPedestrianRecords(prev => [response.data, ...prev]);
    return response.data;
  }, []);

  const updatePedestrianRecord = useCallback(async (data: UpdatePedestrianRecordDTO): Promise<PedestrianRecord> => {
    const response = await api.patch(`/security/access-peatonal/${data.id}`, data);
    setPedestrianRecords(prev => prev.map(r => r.id === data.id ? response.data : r));
    return response.data;
  }, []);

  const deletePedestrianRecord = useCallback(async (id: number): Promise<void> => {
    await api.delete(`/security/access-peatonal/${id}`);
    setPedestrianRecords(prev => prev.filter(r => r.id !== id));
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
    const response = await api.post('/security/incidentes', data);
    setIncidents(prev => [response.data, ...prev]);
    return response.data;
  }, []);

  const updateIncident = useCallback(async (data: UpdateIncidentDTO): Promise<IncidentRecord> => {
    const response = await api.patch(`/security/incidentes/${data.id}`, data);
    setIncidents(prev => prev.map(i => i.id === data.id ? response.data : i));
    return response.data;
  }, []);

  const deleteIncident = useCallback(async (id: number): Promise<void> => {
    await api.delete(`/security/incidentes/${id}`);
    setIncidents(prev => prev.filter(i => i.id !== id));
  }, []);

  const resolveIncident = useCallback(async (id: number): Promise<IncidentRecord> => {
    const response = await api.patch(`/security/incidentes/${id}/resolver`);
    setIncidents(prev => prev.map(i => i.id === id ? response.data : i));
    return response.data;
  }, []);

  return (
    <SecurityContext.Provider
      value={{
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
      }}
    >
      {children}
    </SecurityContext.Provider>
  );
};

export const useSecurity = () => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
};