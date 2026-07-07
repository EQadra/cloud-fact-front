// src/context/MedicalContext.tsx
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import api from '../services/api';
import type {
  Patient,
  MedicalVisit,
  Prescription,
  PatientPathology,
  CreatePatientDto,
  CreateMedicalVisitDto,
  CreatePrescriptionDto,
  Person,
  User,
  Product,
  Pathology,
  PaginatedResponse,
  PaginationParams,
  PatientFilters,
  MedicalVisitFilters,
  PrescriptionFilters,
  MedicalStatistics,
  PatientMedicalHistory,
  TipoVisita,
  EstadoPrescripcion,
  EstadoPatologia,
} from '../types/index';
// ... resto del código
// =============================================
// INTERFACES DEL CONTEXTO
// =============================================

interface MedicalContextType {
  // ===== PACIENTES =====
  patients: Patient[];
  selectedPatient: Patient | null;
  patientsLoading: boolean;
  patientsPagination: { page: number; limit: number; total: number; totalPages: number };
  fetchPatients: (params?: PaginationParams & PatientFilters) => Promise<void>;
  fetchPatientById: (id: string) => Promise<Patient>;
  createPatient: (data: CreatePatientDto) => Promise<Patient>;
  updatePatient: (id: string, data: Partial<CreatePatientDto>) => Promise<Patient>;
  deletePatient: (id: string) => Promise<void>;
  getPatientMedicalHistory: (patientId: string) => Promise<PatientMedicalHistory>;
  
  // ===== VISITAS MÉDICAS =====
  visits: MedicalVisit[];
  selectedVisit: MedicalVisit | null;
  visitsLoading: boolean;
  visitsPagination: { page: number; limit: number; total: number; totalPages: number };
  fetchVisits: (params?: PaginationParams & MedicalVisitFilters) => Promise<void>;
  fetchVisitById: (id: string) => Promise<MedicalVisit>;
  createVisit: (data: CreateMedicalVisitDto) => Promise<MedicalVisit>;
  updateVisit: (id: string, data: Partial<CreateMedicalVisitDto>) => Promise<MedicalVisit>;
  deleteVisit: (id: string) => Promise<void>;
  
  // ===== PRESCRIPCIONES =====
  prescriptions: Prescription[];
  selectedPrescription: Prescription | null;
  prescriptionsLoading: boolean;
  prescriptionsPagination: { page: number; limit: number; total: number; totalPages: number };
  fetchPrescriptions: (params?: PaginationParams & PrescriptionFilters) => Promise<void>;
  fetchPrescriptionById: (id: string) => Promise<Prescription>;
  createPrescription: (data: CreatePrescriptionDto) => Promise<Prescription>;
  updatePrescription: (id: string, data: Partial<CreatePrescriptionDto>) => Promise<Prescription>;
  deletePrescription: (id: string) => Promise<void>;
  completePrescription: (id: string) => Promise<Prescription>;
  cancelPrescription: (id: string) => Promise<Prescription>;
  
  // ===== PATOLOGÍAS =====
  pathologies: Pathology[];
  pathologiesLoading: boolean;
  fetchPathologies: (params?: PaginationParams) => Promise<void>;
  createPathology: (data: { codigo: string; nombre: string; descripcion?: string; categoria?: string }) => Promise<Pathology>;
  updatePathology: (id: string, data: Partial<Pathology>) => Promise<Pathology>;
  deletePathology: (id: string) => Promise<void>;
  
  // ===== PATOLOGÍAS DEL PACIENTE =====
  patientPathologies: PatientPathology[];
  fetchPatientPathologies: (patientId: string) => Promise<PatientPathology[]>;
  assignPathologyToPatient: (data: { patientId: string; pathologyId: string; notas?: string }) => Promise<PatientPathology>;
  updatePatientPathology: (id: string, data: { estado?: EstadoPatologia; notas?: string }) => Promise<PatientPathology>;
  removePathologyFromPatient: (id: string) => Promise<void>;
  
  // ===== MÉDICOS =====
  doctors: User[];
  doctorsLoading: boolean;
  fetchDoctors: (params?: PaginationParams) => Promise<void>;
  
  // ===== MEDICAMENTOS =====
  medicines: Product[];
  medicinesLoading: boolean;
  fetchMedicines: (params?: PaginationParams) => Promise<void>;
  searchMedicines: (query: string) => Promise<Product[]>;
  
  // ===== PERSONAS (para búsqueda) =====
  searchPersons: (query: string, tipo?: string) => Promise<Person[]>;
  
  // ===== ESTADÍSTICAS =====
  getMedicalStatistics: (filters?: { startDate?: string; endDate?: string }) => Promise<MedicalStatistics>;
  
  // ===== UTILITARIOS =====
  getVisitsByPatient: (patientId: string) => MedicalVisit[];
  getPrescriptionsByPatient: (patientId: string) => Prescription[];
  getActivePrescriptionsByPatient: (patientId: string) => Prescription[];
  getPathologiesByPatient: (patientId: string) => PatientPathology[];
}

// =============================================
// CONTEXTO
// =============================================

const MedicalContext = createContext<MedicalContextType | undefined>(undefined);

// =============================================
// PROVIDER
// =============================================

export const MedicalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // ===== ESTADOS - PACIENTES =====
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patientsLoading, setPatientsLoading] = useState(false);
  const [patientsPagination, setPatientsPagination] = useState({
    page: 1, limit: 10, total: 0, totalPages: 0,
  });

  // ===== ESTADOS - VISITAS =====
  const [visits, setVisits] = useState<MedicalVisit[]>([]);
  const [selectedVisit, setSelectedVisit] = useState<MedicalVisit | null>(null);
  const [visitsLoading, setVisitsLoading] = useState(false);
  const [visitsPagination, setVisitsPagination] = useState({
    page: 1, limit: 10, total: 0, totalPages: 0,
  });

  // ===== ESTADOS - PRESCRIPCIONES =====
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [prescriptionsLoading, setPrescriptionsLoading] = useState(false);
  const [prescriptionsPagination, setPrescriptionsPagination] = useState({
    page: 1, limit: 10, total: 0, totalPages: 0,
  });

  // ===== ESTADOS - PATOLOGÍAS =====
  const [pathologies, setPathologies] = useState<Pathology[]>([]);
  const [pathologiesLoading, setPathologiesLoading] = useState(false);

  // ===== ESTADOS - PATOLOGÍAS DEL PACIENTE =====
  const [patientPathologies, setPatientPathologies] = useState<PatientPathology[]>([]);

  // ===== ESTADOS - MÉDICOS =====
  const [doctors, setDoctors] = useState<User[]>([]);
  const [doctorsLoading, setDoctorsLoading] = useState(false);

  // ===== ESTADOS - MEDICAMENTOS =====
  const [medicines, setMedicines] = useState<Product[]>([]);
  const [medicinesLoading, setMedicinesLoading] = useState(false);

  // =============================================
  // FUNCIONES - PACIENTES
  // =============================================

  const fetchPatients = useCallback(async (params?: PaginationParams & PatientFilters) => {
    setPatientsLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.search) queryParams.append('search', params.search);
      if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);
      if (params?.tipoDocumento) queryParams.append('tipoDocumento', params.tipoDocumento);
      if (params?.genero) queryParams.append('genero', params.genero);
      if (params?.estado !== undefined) queryParams.append('estado', String(params.estado));

      const response = await api.get<PaginatedResponse<Patient>>(`/patients?${queryParams.toString()}`);
      setPatients(response.data.data);
      setPatientsPagination({
        page: response.data.meta.page,
        limit: response.data.meta.limit,
        total: response.data.meta.total,
        totalPages: response.data.meta.totalPages,
      });
    } catch (error) {
      console.error('Error fetching patients:', error);
      throw error;
    } finally {
      setPatientsLoading(false);
    }
  }, []);

  const fetchPatientById = useCallback(async (id: string): Promise<Patient> => {
    setPatientsLoading(true);
    try {
      const response = await api.get<Patient>(`/patients/${id}`);
      setSelectedPatient(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching patient:', error);
      throw error;
    } finally {
      setPatientsLoading(false);
    }
  }, []);

  const createPatient = useCallback(async (data: CreatePatientDto): Promise<Patient> => {
    setPatientsLoading(true);
    try {
      const response = await api.post<Patient>('/patients', data);
      setPatients(prev => [response.data, ...prev]);
      return response.data;
    } catch (error) {
      console.error('Error creating patient:', error);
      throw error;
    } finally {
      setPatientsLoading(false);
    }
  }, []);

  const updatePatient = useCallback(async (id: string, data: Partial<CreatePatientDto>): Promise<Patient> => {
    setPatientsLoading(true);
    try {
      const response = await api.patch<Patient>(`/patients/${id}`, data);
      setPatients(prev => prev.map(p => p.id === id ? response.data : p));
      if (selectedPatient?.id === id) setSelectedPatient(response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating patient:', error);
      throw error;
    } finally {
      setPatientsLoading(false);
    }
  }, [selectedPatient]);

  const deletePatient = useCallback(async (id: string): Promise<void> => {
    setPatientsLoading(true);
    try {
      await api.delete(`/patients/${id}`);
      setPatients(prev => prev.filter(p => p.id !== id));
      if (selectedPatient?.id === id) setSelectedPatient(null);
    } catch (error) {
      console.error('Error deleting patient:', error);
      throw error;
    } finally {
      setPatientsLoading(false);
    }
  }, [selectedPatient]);

  const getPatientMedicalHistory = useCallback(async (patientId: string): Promise<PatientMedicalHistory> => {
    try {
      const response = await api.get<PatientMedicalHistory>(`/patients/${patientId}/medical-history`);
      return response.data;
    } catch (error) {
      console.error('Error getting patient medical history:', error);
      throw error;
    }
  }, []);

  // =============================================
  // FUNCIONES - VISITAS MÉDICAS
  // =============================================

  const fetchVisits = useCallback(async (params?: PaginationParams & MedicalVisitFilters) => {
    setVisitsLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.search) queryParams.append('search', params.search);
      if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);
      if (params?.patientId) queryParams.append('patientId', params.patientId);
      if (params?.medicoId) queryParams.append('medicoId', params.medicoId);
      if (params?.tipoVisita) queryParams.append('tipoVisita', params.tipoVisita);
      if (params?.startDate) queryParams.append('startDate', params.startDate);
      if (params?.endDate) queryParams.append('endDate', params.endDate);

      const response = await api.get<PaginatedResponse<MedicalVisit>>(`/medical-visits?${queryParams.toString()}`);
      setVisits(response.data.data);
      setVisitsPagination({
        page: response.data.meta.page,
        limit: response.data.meta.limit,
        total: response.data.meta.total,
        totalPages: response.data.meta.totalPages,
      });
    } catch (error) {
      console.error('Error fetching visits:', error);
      throw error;
    } finally {
      setVisitsLoading(false);
    }
  }, []);

  const fetchVisitById = useCallback(async (id: string): Promise<MedicalVisit> => {
    setVisitsLoading(true);
    try {
      const response = await api.get<MedicalVisit>(`/medical-visits/${id}`);
      setSelectedVisit(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching visit:', error);
      throw error;
    } finally {
      setVisitsLoading(false);
    }
  }, []);

  const createVisit = useCallback(async (data: CreateMedicalVisitDto): Promise<MedicalVisit> => {
    setVisitsLoading(true);
    try {
      const response = await api.post<MedicalVisit>('/medical-visits', data);
      setVisits(prev => [response.data, ...prev]);
      return response.data;
    } catch (error) {
      console.error('Error creating visit:', error);
      throw error;
    } finally {
      setVisitsLoading(false);
    }
  }, []);

  const updateVisit = useCallback(async (id: string, data: Partial<CreateMedicalVisitDto>): Promise<MedicalVisit> => {
    setVisitsLoading(true);
    try {
      const response = await api.patch<MedicalVisit>(`/medical-visits/${id}`, data);
      setVisits(prev => prev.map(v => v.id === id ? response.data : v));
      if (selectedVisit?.id === id) setSelectedVisit(response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating visit:', error);
      throw error;
    } finally {
      setVisitsLoading(false);
    }
  }, [selectedVisit]);

  const deleteVisit = useCallback(async (id: string): Promise<void> => {
    setVisitsLoading(true);
    try {
      await api.delete(`/medical-visits/${id}`);
      setVisits(prev => prev.filter(v => v.id !== id));
      if (selectedVisit?.id === id) setSelectedVisit(null);
    } catch (error) {
      console.error('Error deleting visit:', error);
      throw error;
    } finally {
      setVisitsLoading(false);
    }
  }, [selectedVisit]);

  // =============================================
  // FUNCIONES - PRESCRIPCIONES
  // =============================================

  const fetchPrescriptions = useCallback(async (params?: PaginationParams & PrescriptionFilters) => {
    setPrescriptionsLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.search) queryParams.append('search', params.search);
      if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);
      if (params?.patientId) queryParams.append('patientId', params.patientId);
      if (params?.medicalVisitId) queryParams.append('medicalVisitId', params.medicalVisitId);
      if (params?.productoId) queryParams.append('productoId', params.productoId);
      if (params?.estado) queryParams.append('estado', params.estado);
      if (params?.startDate) queryParams.append('startDate', params.startDate);
      if (params?.endDate) queryParams.append('endDate', params.endDate);

      const response = await api.get<PaginatedResponse<Prescription>>(`/prescriptions?${queryParams.toString()}`);
      setPrescriptions(response.data.data);
      setPrescriptionsPagination({
        page: response.data.meta.page,
        limit: response.data.meta.limit,
        total: response.data.meta.total,
        totalPages: response.data.meta.totalPages,
      });
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      throw error;
    } finally {
      setPrescriptionsLoading(false);
    }
  }, []);

  const fetchPrescriptionById = useCallback(async (id: string): Promise<Prescription> => {
    setPrescriptionsLoading(true);
    try {
      const response = await api.get<Prescription>(`/prescriptions/${id}`);
      setSelectedPrescription(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching prescription:', error);
      throw error;
    } finally {
      setPrescriptionsLoading(false);
    }
  }, []);

  const createPrescription = useCallback(async (data: CreatePrescriptionDto): Promise<Prescription> => {
    setPrescriptionsLoading(true);
    try {
      const response = await api.post<Prescription>('/prescriptions', data);
      setPrescriptions(prev => [response.data, ...prev]);
      return response.data;
    } catch (error) {
      console.error('Error creating prescription:', error);
      throw error;
    } finally {
      setPrescriptionsLoading(false);
    }
  }, []);

  const updatePrescription = useCallback(async (id: string, data: Partial<CreatePrescriptionDto>): Promise<Prescription> => {
    setPrescriptionsLoading(true);
    try {
      const response = await api.patch<Prescription>(`/prescriptions/${id}`, data);
      setPrescriptions(prev => prev.map(p => p.id === id ? response.data : p));
      if (selectedPrescription?.id === id) setSelectedPrescription(response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating prescription:', error);
      throw error;
    } finally {
      setPrescriptionsLoading(false);
    }
  }, [selectedPrescription]);

  const deletePrescription = useCallback(async (id: string): Promise<void> => {
    setPrescriptionsLoading(true);
    try {
      await api.delete(`/prescriptions/${id}`);
      setPrescriptions(prev => prev.filter(p => p.id !== id));
      if (selectedPrescription?.id === id) setSelectedPrescription(null);
    } catch (error) {
      console.error('Error deleting prescription:', error);
      throw error;
    } finally {
      setPrescriptionsLoading(false);
    }
  }, [selectedPrescription]);

  const completePrescription = useCallback(async (id: string): Promise<Prescription> => {
    setPrescriptionsLoading(true);
    try {
      const response = await api.patch<Prescription>(`/prescriptions/${id}/complete`);
      setPrescriptions(prev => prev.map(p => p.id === id ? response.data : p));
      if (selectedPrescription?.id === id) setSelectedPrescription(response.data);
      return response.data;
    } catch (error) {
      console.error('Error completing prescription:', error);
      throw error;
    } finally {
      setPrescriptionsLoading(false);
    }
  }, [selectedPrescription]);

  const cancelPrescription = useCallback(async (id: string): Promise<Prescription> => {
    setPrescriptionsLoading(true);
    try {
      const response = await api.patch<Prescription>(`/prescriptions/${id}/cancel`);
      setPrescriptions(prev => prev.map(p => p.id === id ? response.data : p));
      if (selectedPrescription?.id === id) setSelectedPrescription(response.data);
      return response.data;
    } catch (error) {
      console.error('Error cancelling prescription:', error);
      throw error;
    } finally {
      setPrescriptionsLoading(false);
    }
  }, [selectedPrescription]);

  // =============================================
  // FUNCIONES - PATOLOGÍAS
  // =============================================

  const fetchPathologies = useCallback(async (params?: PaginationParams) => {
    setPathologiesLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (params?.search) queryParams.append('search', params.search || '');
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());

      const response = await api.get<PaginatedResponse<Pathology>>(`/pathologies?${queryParams.toString()}`);
      setPathologies(response.data.data);
    } catch (error) {
      console.error('Error fetching pathologies:', error);
      throw error;
    } finally {
      setPathologiesLoading(false);
    }
  }, []);

  const createPathology = useCallback(async (data: { codigo: string; nombre: string; descripcion?: string; categoria?: string }): Promise<Pathology> => {
    setPathologiesLoading(true);
    try {
      const response = await api.post<Pathology>('/pathologies', data);
      setPathologies(prev => [response.data, ...prev]);
      return response.data;
    } catch (error) {
      console.error('Error creating pathology:', error);
      throw error;
    } finally {
      setPathologiesLoading(false);
    }
  }, []);

  const updatePathology = useCallback(async (id: string, data: Partial<Pathology>): Promise<Pathology> => {
    setPathologiesLoading(true);
    try {
      const response = await api.patch<Pathology>(`/pathologies/${id}`, data);
      setPathologies(prev => prev.map(p => p.id === id ? response.data : p));
      return response.data;
    } catch (error) {
      console.error('Error updating pathology:', error);
      throw error;
    } finally {
      setPathologiesLoading(false);
    }
  }, []);

  const deletePathology = useCallback(async (id: string): Promise<void> => {
    setPathologiesLoading(true);
    try {
      await api.delete(`/pathologies/${id}`);
      setPathologies(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting pathology:', error);
      throw error;
    } finally {
      setPathologiesLoading(false);
    }
  }, []);

  // =============================================
  // FUNCIONES - PATOLOGÍAS DEL PACIENTE
  // =============================================

  const fetchPatientPathologies = useCallback(async (patientId: string): Promise<PatientPathology[]> => {
    try {
      const response = await api.get<PatientPathology[]>(`/patients/${patientId}/pathologies`);
      setPatientPathologies(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching patient pathologies:', error);
      throw error;
    }
  }, []);

  const assignPathologyToPatient = useCallback(async (data: { patientId: string; pathologyId: string; notas?: string }): Promise<PatientPathology> => {
    try {
      const response = await api.post<PatientPathology>('/patient-pathologies', data);
      setPatientPathologies(prev => [response.data, ...prev]);
      return response.data;
    } catch (error) {
      console.error('Error assigning pathology to patient:', error);
      throw error;
    }
  }, []);

  const updatePatientPathology = useCallback(async (id: string, data: { estado?: EstadoPatologia; notas?: string }): Promise<PatientPathology> => {
    try {
      const response = await api.patch<PatientPathology>(`/patient-pathologies/${id}`, data);
      setPatientPathologies(prev => prev.map(p => p.id === id ? response.data : p));
      return response.data;
    } catch (error) {
      console.error('Error updating patient pathology:', error);
      throw error;
    }
  }, []);

  const removePathologyFromPatient = useCallback(async (id: string): Promise<void> => {
    try {
      await api.delete(`/patient-pathologies/${id}`);
      setPatientPathologies(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error removing pathology from patient:', error);
      throw error;
    }
  }, []);

  // =============================================
  // FUNCIONES - MÉDICOS
  // =============================================

  const fetchDoctors = useCallback(async (params?: PaginationParams) => {
    setDoctorsLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (params?.search) queryParams.append('search', params.search || '');
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());

      const response = await api.get<PaginatedResponse<User>>(`/users/doctors?${queryParams.toString()}`);
      setDoctors(response.data.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      throw error;
    } finally {
      setDoctorsLoading(false);
    }
  }, []);

  // =============================================
  // FUNCIONES - MEDICAMENTOS
  // =============================================

  const fetchMedicines = useCallback(async (params?: PaginationParams) => {
    setMedicinesLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (params?.search) queryParams.append('search', params.search || '');
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      queryParams.append('esMedicamento', 'true');

      const response = await api.get<PaginatedResponse<Product>>(`/products?${queryParams.toString()}`);
      setMedicines(response.data.data);
    } catch (error) {
      console.error('Error fetching medicines:', error);
      throw error;
    } finally {
      setMedicinesLoading(false);
    }
  }, []);

  const searchMedicines = useCallback(async (query: string): Promise<Product[]> => {
    try {
      const response = await api.get<Product[]>(`/products/search?esMedicamento=true&q=${query}`);
      return response.data;
    } catch (error) {
      console.error('Error searching medicines:', error);
      throw error;
    }
  }, []);

  // =============================================
  // FUNCIONES - PERSONAS (búsqueda general)
  // =============================================

  const searchPersons = useCallback(async (query: string, tipo?: string): Promise<Person[]> => {
    try {
      const url = `/persons/search?q=${query}${tipo ? `&tipo=${tipo}` : ''}`;
      const response = await api.get<Person[]>(url);
      return response.data;
    } catch (error) {
      console.error('Error searching persons:', error);
      throw error;
    }
  }, []);

  // =============================================
  // FUNCIONES - ESTADÍSTICAS
  // =============================================

  const getMedicalStatistics = useCallback(async (filters?: { startDate?: string; endDate?: string }): Promise<MedicalStatistics> => {
    try {
      const queryParams = new URLSearchParams();
      if (filters?.startDate) queryParams.append('startDate', filters.startDate);
      if (filters?.endDate) queryParams.append('endDate', filters.endDate);

      const response = await api.get<MedicalStatistics>(`/medical/statistics?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error getting medical statistics:', error);
      throw error;
    }
  }, []);

  // =============================================
  // FUNCIONES UTILITARIAS
  // =============================================

  const getVisitsByPatient = useCallback((patientId: string): MedicalVisit[] => {
    return visits.filter(v => v.patientId === patientId);
  }, [visits]);

  const getPrescriptionsByPatient = useCallback((patientId: string): Prescription[] => {
    const patientVisits = visits.filter(v => v.patientId === patientId);
    const visitIds = patientVisits.map(v => v.id);
    return prescriptions.filter(p => visitIds.includes(p.medicalVisitId));
  }, [visits, prescriptions]);

  const getActivePrescriptionsByPatient = useCallback((patientId: string): Prescription[] => {
    return getPrescriptionsByPatient(patientId).filter(p => p.estado === 'ACTIVA');
  }, [getPrescriptionsByPatient]);

  const getPathologiesByPatient = useCallback((patientId: string): PatientPathology[] => {
    return patientPathologies.filter(pp => pp.patientId === patientId);
  }, [patientPathologies]);

  // =============================================
  // EFECTOS
  // =============================================

  useEffect(() => {
    fetchPatients();
    fetchVisits();
    fetchPrescriptions();
    fetchPathologies();
    fetchDoctors();
    fetchMedicines();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // =============================================
  // VALUE DEL CONTEXTO
  // =============================================

  const value: MedicalContextType = {
    // Pacientes
    patients,
    selectedPatient,
    patientsLoading,
    patientsPagination,
    fetchPatients,
    fetchPatientById,
    createPatient,
    updatePatient,
    deletePatient,
    getPatientMedicalHistory,

    // Visitas
    visits,
    selectedVisit,
    visitsLoading,
    visitsPagination,
    fetchVisits,
    fetchVisitById,
    createVisit,
    updateVisit,
    deleteVisit,

    // Prescripciones
    prescriptions,
    selectedPrescription,
    prescriptionsLoading,
    prescriptionsPagination,
    fetchPrescriptions,
    fetchPrescriptionById,
    createPrescription,
    updatePrescription,
    deletePrescription,
    completePrescription,
    cancelPrescription,

    // Patologías
    pathologies,
    pathologiesLoading,
    fetchPathologies,
    createPathology,
    updatePathology,
    deletePathology,

    // Patologías del paciente
    patientPathologies,
    fetchPatientPathologies,
    assignPathologyToPatient,
    updatePatientPathology,
    removePathologyFromPatient,

    // Médicos
    doctors,
    doctorsLoading,
    fetchDoctors,

    // Medicamentos
    medicines,
    medicinesLoading,
    fetchMedicines,
    searchMedicines,

    // Personas
    searchPersons,

    // Estadísticas
    getMedicalStatistics,

    // Utilitarios
    getVisitsByPatient,
    getPrescriptionsByPatient,
    getActivePrescriptionsByPatient,
    getPathologiesByPatient,
  };

  return (
    <MedicalContext.Provider value={value}>
      {children}
    </MedicalContext.Provider>
  );
};

// =============================================
// HOOK PERSONALIZADO
// =============================================

export const useMedical = (): MedicalContextType => {
  const context = useContext(MedicalContext);
  if (!context) {
    throw new Error('useMedical must be used within a MedicalProvider');
  }
  return context;
};