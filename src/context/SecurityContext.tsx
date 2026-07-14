// src/context/SecurityContext.tsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import api from '../services/api';

// ============================================
// TYPES
// ============================================

export interface AccessRecord {
  id: string;
  companyId: string | null;
  personaId: string | null;
  tipoDocumento: string | null;
  numeroDocumento: string | null;
  nombreCompleto: string | null;
  tipoAcceso: 'INGRESO' | 'SALIDA';
  tipoPersona: 'EMPLEADO' | 'VISITANTE' | 'PROVEEDOR' | 'PACIENTE' | 'OTRO' | null;
  zona: string | null;
  motivo: string | null;
  fechaHora: string;
  registradoPor: string | null;
  createdAt: string;
  // Para vehículos
  vehiculo: string | null;
  placa: string | null;
  tipoVehiculo: 'AUTO' | 'CAMIONETA' | 'MOTO' | 'CAMION' | 'OTRO' | null;
  status?: 'AUTORIZADO' | 'PENDIENTE' | 'DENEGADO' | null;
}

export interface CrearAccessRecordDTO {
  personaId?: string;
  tipoDocumento?: string;
  numeroDocumento?: string;
  nombreCompleto?: string;
  tipoAcceso: 'INGRESO' | 'SALIDA';
  zona?: string;
  motivo?: string;
  registradoPor?: string;
  fechaHora?: string;
  // Vehículos
  vehiculo?: string;
  placa?: string;
  tipoVehiculo?: 'AUTO' | 'CAMIONETA' | 'MOTO' | 'CAMION' | 'OTRO';
  // Personas
  tipoPersona?: 'EMPLEADO' | 'VISITANTE' | 'PROVEEDOR' | 'PACIENTE' | 'OTRO';
  status?: 'AUTORIZADO' | 'PENDIENTE' | 'DENEGADO';
}

export interface UpdateAccessRecordDTO extends Partial<CrearAccessRecordDTO> {}

// ============================================
// CONTEXT INTERFACE
// ============================================

interface SecurityContextType {
  accessRecords: AccessRecord[];
  accessLoading: boolean;
  fetchAccessRecords: () => Promise<void>;
  createAccessRecord: (data: CrearAccessRecordDTO) => Promise<AccessRecord>;
  updateAccessRecord: (id: string, data: UpdateAccessRecordDTO) => Promise<AccessRecord>;
  deleteAccessRecord: (id: string) => Promise<void>;
  // Filtros predefinidos
  getPedestrianRecords: () => AccessRecord[];
  getVehicleRecords: () => AccessRecord[];
}

// ============================================
// CONTEXT PROVIDER
// ============================================

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export const SecurityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [accessRecords, setAccessRecords] = useState<AccessRecord[]>([]);
  const [accessLoading, setAccessLoading] = useState(false);

  // ============================================
  // FETCH - OBTENER TODOS LOS REGISTROS
  // ============================================

  const fetchAccessRecords = useCallback(async () => {
    setAccessLoading(true);
    try {
      console.log('📤 Fetching access records...');
      const response = await api.get('/security/access');
      console.log('✅ Access records fetched:', response.data.length);
      setAccessRecords(response.data);
    } catch (error) {
      console.error('❌ Error fetching access records:', error);
      throw error;
    } finally {
      setAccessLoading(false);
    }
  }, []);

  // ============================================
  // CREATE - CREAR REGISTRO
  // ============================================

  const createAccessRecord = useCallback(async (data: CrearAccessRecordDTO): Promise<AccessRecord> => {
    try {
      const payload = {
        ...data,
        tipoPersona: data.tipoPersona || 'OTRO',
      };
      
      console.log('📤 Enviando a API (create):', payload);
      const response = await api.post('/security/access', payload);
      setAccessRecords(prev => [response.data, ...prev]);
      return response.data;
    } catch (error) {
      console.error('❌ Error creating access record:', error);
      throw error;
    }
  }, []);

  // ============================================
  // UPDATE - ACTUALIZAR REGISTRO
  // ============================================

  const updateAccessRecord = useCallback(async (id: string, data: UpdateAccessRecordDTO): Promise<AccessRecord> => {
    try {
      const payload = {
        ...data,
        tipoPersona: data.tipoPersona || 'OTRO',
      };
      
      console.log('📤 Enviando a API (update):', payload);
      const response = await api.patch(`/security/access/${id}`, payload);
      setAccessRecords(prev => prev.map(r => r.id === id ? response.data : r));
      return response.data;
    } catch (error) {
      console.error('❌ Error updating access record:', error);
      throw error;
    }
  }, []);

  // ============================================
  // DELETE - ELIMINAR REGISTRO
  // ============================================

  const deleteAccessRecord = useCallback(async (id: string): Promise<void> => {
    try {
      await api.delete(`/security/access/${id}`);
      setAccessRecords(prev => prev.filter(r => r.id !== id));
    } catch (error) {
      console.error('❌ Error deleting access record:', error);
      throw error;
    }
  }, []);

  // ============================================
  // FILTROS
  // ============================================

  const getPedestrianRecords = useCallback(() => {
    return accessRecords.filter(record => !record.vehiculo || record.vehiculo === '' || record.vehiculo === null);
  }, [accessRecords]);

  const getVehicleRecords = useCallback(() => {
    return accessRecords.filter(record => record.vehiculo && record.vehiculo !== '');
  }, [accessRecords]);

  // ============================================
  // CONTEXT VALUE
  // ============================================

  const value: SecurityContextType = {
    accessRecords,
    accessLoading,
    fetchAccessRecords,
    createAccessRecord,
    updateAccessRecord,
    deleteAccessRecord,
    getPedestrianRecords,
    getVehicleRecords,
  };

  return (
    <SecurityContext.Provider value={value}>
      {children}
    </SecurityContext.Provider>
  );
};

// ============================================
// HOOK
// ============================================

export const useSecurity = (): SecurityContextType => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
};