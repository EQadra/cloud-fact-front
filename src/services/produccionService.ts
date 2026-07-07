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
  PlantaInforme
} from '../types/produccion';

// ============================================
// DATOS EN MEMORIA (LOCAL STORAGE)
// ============================================

const STORAGE_KEY = 'produccion_plantas';
const INFORMES_KEY = 'produccion_informes';
const ETAPAS_KEY = 'produccion_etapas';
const INFORMES_DETALLE_KEY = 'produccion_informes_detalle';

// Inicializar datos si no existen
const initData = () => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    const initialData: Planta[] = [
      {
        id: '1',
        nombre: 'Purple Haze',
        codigo_qr: 'QR-001',
        tipo: 'SATIVA',
        banco_procedencia: 'Seed Bank Amsterdam',
        lote: 'L-2024-001',
        fecha_germinacion: '2024-01-15',
        fecha_clonacion: '2024-02-01',
        descripcion: 'Variedad clásica con alto contenido de THC',
        estado: 'ACTIVO',
        company_id: 'company-1',
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-15T10:00:00Z'
      },
      {
        id: '2',
        nombre: 'Blue Dream',
        codigo_qr: 'QR-002',
        tipo: 'HIBRIDA',
        banco_procedencia: 'California Seed Bank',
        lote: 'L-2024-002',
        fecha_germinacion: '2024-02-10',
        fecha_clonacion: '2024-02-25',
        descripcion: 'Híbrida equilibrada con efectos relajantes',
        estado: 'ACTIVO',
        company_id: 'company-1',
        created_at: '2024-02-10T10:00:00Z',
        updated_at: '2024-02-10T10:00:00Z'
      },
      {
        id: '3',
        nombre: 'Northern Lights',
        codigo_qr: 'QR-003',
        tipo: 'INDICA',
        banco_procedencia: 'Dutch Seed Bank',
        lote: 'L-2024-003',
        fecha_germinacion: '2024-03-01',
        fecha_clonacion: '2024-03-15',
        descripcion: 'Indica pura, excelente para relajación',
        estado: 'FINALIZADO',
        company_id: 'company-1',
        created_at: '2024-03-01T10:00:00Z',
        updated_at: '2024-03-01T10:00:00Z'
      }
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
  }

  if (!localStorage.getItem(INFORMES_KEY)) {
    const initialInformes: Record<string, InformePlanta[]> = {
      '1': [
        {
          id: 'inf-1',
          planta_id: '1',
          titulo: 'Germinación exitosa',
          descripcion: 'Las semillas germinaron en 48 horas',
          fecha: '2024-01-17',
          tipo: 'SIEMBRA',
          created_at: '2024-01-17T10:00:00Z',
          updated_at: '2024-01-17T10:00:00Z'
        },
        {
          id: 'inf-2',
          planta_id: '1',
          titulo: 'Crecimiento vigoroso',
          descripcion: 'La planta muestra un crecimiento acelerado',
          fecha: '2024-02-01',
          tipo: 'CRECIMIENTO',
          created_at: '2024-02-01T10:00:00Z',
          updated_at: '2024-02-01T10:00:00Z'
        }
      ],
      '2': [
        {
          id: 'inf-3',
          planta_id: '2',
          titulo: 'Floración temprana',
          descripcion: 'La planta comenzó a florecer antes de lo esperado',
          fecha: '2024-03-10',
          tipo: 'FLORACION',
          created_at: '2024-03-10T10:00:00Z',
          updated_at: '2024-03-10T10:00:00Z'
        }
      ]
    };
    localStorage.setItem(INFORMES_KEY, JSON.stringify(initialInformes));
  }

  if (!localStorage.getItem(ETAPAS_KEY)) {
    const initialEtapas: Record<string, EtapaTrazabilidad[]> = {
      '1': [
        {
          id: 'etap-1',
          planta_id: '1',
          etapa: 'SIEMBRA',
          estado: 'COMPLETADO',
          fecha_inicio: '2024-01-15T08:00:00Z',
          fecha_fin: '2024-01-20T08:00:00Z',
          responsable_nombre: 'Juan Pérez',
          observaciones: 'Siembra en sustrato orgánico',
          temperatura: 24.5,
          humedad: 65,
          created_at: '2024-01-15T08:00:00Z',
          updated_at: '2024-01-20T08:00:00Z'
        },
        {
          id: 'etap-2',
          planta_id: '1',
          etapa: 'CRECIMIENTO',
          estado: 'COMPLETADO',
          fecha_inicio: '2024-01-20T08:00:00Z',
          fecha_fin: '2024-02-15T08:00:00Z',
          responsable_nombre: 'María García',
          observaciones: 'Crecimiento óptimo, nutrientes balanceados',
          temperatura: 26.0,
          humedad: 60,
          created_at: '2024-01-20T08:00:00Z',
          updated_at: '2024-02-15T08:00:00Z'
        },
        {
          id: 'etap-3',
          planta_id: '1',
          etapa: 'FLORACION',
          estado: 'EN_PROCESO',
          fecha_inicio: '2024-02-15T08:00:00Z',
          responsable_nombre: 'Carlos López',
          observaciones: 'Floración avanzada, cogollos densos',
          temperatura: 22.0,
          humedad: 55,
          created_at: '2024-02-15T08:00:00Z',
          updated_at: '2024-02-15T08:00:00Z'
        }
      ]
    };
    localStorage.setItem(ETAPAS_KEY, JSON.stringify(initialEtapas));
  }
};

// Funciones helper para localStorage
const getPlantas = (): Planta[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

const setPlantas = (plantas: Planta[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plantas));
};

const getInformes = (): Record<string, InformePlanta[]> => {
  const data = localStorage.getItem(INFORMES_KEY);
  return data ? JSON.parse(data) : {};
};

const setInformes = (informes: Record<string, InformePlanta[]>) => {
  localStorage.setItem(INFORMES_KEY, JSON.stringify(informes));
};

const getEtapas = (): Record<string, EtapaTrazabilidad[]> => {
  const data = localStorage.getItem(ETAPAS_KEY);
  return data ? JSON.parse(data) : {};
};

const setEtapas = (etapas: Record<string, EtapaTrazabilidad[]>) => {
  localStorage.setItem(ETAPAS_KEY, JSON.stringify(etapas));
};

// Funciones para informes detallados (nuevos)
const getInformesDetalle = (): Record<string, PlantaInforme[]> => {
  const data = localStorage.getItem(INFORMES_DETALLE_KEY);
  return data ? JSON.parse(data) : {};
};

const setInformesDetalle = (informes: Record<string, PlantaInforme[]>) => {
  localStorage.setItem(INFORMES_DETALLE_KEY, JSON.stringify(informes));
};

// ============================================
// SERVICIO DE PRODUCCIÓN (LOCAL)
// ============================================

// Inicializar datos al cargar
initData();

// Simular delay de API para experiencia realista
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const produccionService = {
  // ============================================
  // MÉTODOS PARA PLANTAS
  // ============================================

  // Obtener todas las plantas
  async obtenerPlantas(): Promise<Planta[]> {
    await delay();
    return [...getPlantas()];
  },

  // Obtener una planta con sus informes (versión antigua)
  async obtenerPlanta(id: string): Promise<PlantaConInformes> {
    await delay();
    const plantas = getPlantas();
    const planta = plantas.find(p => p.id === id);
    if (!planta) {
      throw new Error('Planta no encontrada');
    }
    const informes = getInformes();
    return {
      ...planta,
      informes: informes[id] || []
    };
  },

  // Crear nueva planta
  async crearPlanta(data: CrearPlantaDTO): Promise<Planta> {
    await delay(500);
    const plantas = getPlantas();
    const nuevaPlanta: Planta = {
      id: String(Date.now()),
      nombre: data.nombre,
      codigo_qr: data.codigo_qr || `QR-${String(Date.now()).slice(-4)}`,
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
  },

  // Actualizar planta
  async actualizarPlanta(id: string, data: UpdatePlantaDTO): Promise<Planta> {
    await delay(500);
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
  },

  // Eliminar planta
  async eliminarPlanta(id: string): Promise<void> {
    await delay(500);
    const plantas = getPlantas();
    const index = plantas.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Planta no encontrada');
    }
    plantas.splice(index, 1);
    setPlantas(plantas);
    
    // Eliminar informes asociados (versión antigua)
    const informes = getInformes();
    delete informes[id];
    setInformes(informes);
    
    // Eliminar etapas asociadas
    const etapas = getEtapas();
    delete etapas[id];
    setEtapas(etapas);

    // Eliminar informes detallados (nueva versión)
    const informesDetalle = getInformesDetalle();
    delete informesDetalle[id];
    setInformesDetalle(informesDetalle);
  },

  // ============================================
  // MÉTODOS PARA INFORMES DETALLADOS (NUEVA VERSIÓN)
  // ============================================

  // Obtener informes detallados de una planta
  async obtenerInformes(plantaId: string): Promise<PlantaInforme[]> {
    await delay(200);
    const informes = getInformesDetalle();
    
    // Si no hay informes para esta planta, crear datos de ejemplo
    if (!informes[plantaId] || informes[plantaId].length === 0) {
      const mockInformes: PlantaInforme[] = [
        {
          id: `inf_${Date.now()}_1`,
          planta_id: plantaId,
          titulo: 'Control de crecimiento - Semana 1',
          descripcion: 'La planta muestra un crecimiento saludable con nuevas hojas.',
          tipo: 'CRECIMIENTO',
          fecha_informe: new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0],
          autor: 'Usuario Demo',
          imagen_url: '',
          datos_medicion: { altura: 15.5, hojas: 8 },
          recomendaciones: 'Mantener riego regular y exposición solar adecuada.',
          estado: 'PUBLICADO',
          created_at: new Date(Date.now() - 7 * 86400000).toISOString()
        },
        {
          id: `inf_${Date.now()}_2`,
          planta_id: plantaId,
          titulo: 'Control de riego - Semana 2',
          descripcion: 'Se ajustó el sistema de riego para mantener humedad óptima.',
          tipo: 'RIEGO',
          fecha_informe: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0],
          autor: 'Usuario Demo',
          imagen_url: '',
          datos_medicion: { humedad_suelo: 65, ph: 6.8 },
          recomendaciones: 'Continuar con el esquema de riego actual.',
          estado: 'PUBLICADO',
          created_at: new Date(Date.now() - 3 * 86400000).toISOString()
        },
        {
          id: `inf_${Date.now()}_3`,
          planta_id: plantaId,
          titulo: 'Control de plagas - Semana 3',
          descripcion: 'Se detectaron pequeños ácaros, se aplicó tratamiento orgánico.',
          tipo: 'CONTROL_PLAGAS',
          fecha_informe: new Date().toISOString().split('T')[0],
          autor: 'Usuario Demo',
          imagen_url: '',
          datos_medicion: { nivel_plagas: 'bajo', tratamiento: 'aceite_neem' },
          recomendaciones: 'Aplicar tratamiento preventivo cada 15 días.',
          estado: 'PUBLICADO',
          created_at: new Date().toISOString()
        }
      ];
      informes[plantaId] = mockInformes;
      setInformesDetalle(informes);
      return mockInformes;
    }
    
    return informes[plantaId] || [];
  },

  // Crear nuevo informe detallado
  async crearInforme(plantaId: string, informe: PlantaInforme): Promise<PlantaInforme> {
    await delay(300);
    const informes = getInformesDetalle();
    
    const nuevoInforme = {
      ...informe,
      id: informe.id || `inf_${Date.now()}`,
      planta_id: plantaId,
      created_at: informe.created_at || new Date().toISOString()
    };
    
    if (!informes[plantaId]) {
      informes[plantaId] = [];
    }
    informes[plantaId].push(nuevoInforme);
    setInformesDetalle(informes);
    return nuevoInforme;
  },

  // Actualizar informe detallado
  async actualizarInforme(plantaId: string, informeId: string, informe: PlantaInforme): Promise<PlantaInforme> {
    await delay(300);
    const informes = getInformesDetalle();
    
    if (!informes[plantaId]) {
      throw new Error('No se encontraron informes para esta planta');
    }
    
    const index = informes[plantaId].findIndex(i => i.id === informeId);
    if (index === -1) {
      throw new Error('Informe no encontrado');
    }
    
    informes[plantaId][index] = {
      ...informe,
      updated_at: new Date().toISOString()
    };
    setInformesDetalle(informes);
    return informes[plantaId][index];
  },

  // Eliminar informe detallado
  async eliminarInforme(plantaId: string, informeId: string): Promise<void> {
    await delay(300);
    const informes = getInformesDetalle();
    
    if (!informes[plantaId]) {
      return;
    }
    
    informes[plantaId] = informes[plantaId].filter(i => i.id !== informeId);
    setInformesDetalle(informes);
  },

  // ============================================
  // MÉTODOS PARA INFORMES ANTIGUOS (COMPATIBILIDAD)
  // ============================================

  // Agregar informe (versión antigua)
  async agregarInforme(plantaId: string, data: CrearInformeDTO): Promise<InformePlanta> {
    await delay(300);
    const nuevoInforme: InformePlanta = {
      id: `inf-${Date.now()}`,
      planta_id: plantaId,
      titulo: data.titulo,
      descripcion: data.descripcion,
      fecha: data.fecha,
      tipo: data.tipo,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    const informes = getInformes();
    if (!informes[plantaId]) {
      informes[plantaId] = [];
    }
    informes[plantaId].push(nuevoInforme);
    setInformes(informes);
    return nuevoInforme;
  },

  // Eliminar informe (versión antigua)
  async eliminarInformeOld(informeId: string): Promise<void> {
    await delay(300);
    const informes = getInformes();
    for (const key in informes) {
      const index = informes[key].findIndex(i => i.id === informeId);
      if (index !== -1) {
        informes[key].splice(index, 1);
        setInformes(informes);
        return;
      }
    }
    throw new Error('Informe no encontrado');
  },

  // Obtener trazabilidad completa
  async obtenerTrazabilidadCompleta(id: string): Promise<PlantaConTrazabilidad> {
    await delay(400);
    const plantas = getPlantas();
    const planta = plantas.find(p => p.id === id);
    if (!planta) {
      throw new Error('Planta no encontrada');
    }
    const informes = getInformes();
    const etapas = getEtapas();
    return {
      ...planta,
      informes: informes[id] || [],
      etapas: etapas[id] || []
    };
  },

  // ============================================
  // MÉTODOS PARA ETAPAS DE TRAZABILIDAD
  // ============================================

  // Agregar etapa de trazabilidad
  async agregarEtapa(plantaId: string, data: CrearEtapaDTO): Promise<EtapaTrazabilidad> {
    await delay(300);
    const nuevaEtapa: EtapaTrazabilidad = {
      id: `etap-${Date.now()}`,
      planta_id: plantaId,
      etapa: data.etapa,
      estado: data.estado || 'PENDIENTE',
      fecha_inicio: data.fecha_inicio,
      fecha_fin: data.fecha_fin,
      responsable_id: data.responsable_id,
      responsable_nombre: data.responsable_nombre || 'Responsable',
      observaciones: data.observaciones,
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
  },

  // Actualizar etapa
  async actualizarEtapa(etapaId: string, data: Partial<EtapaTrazabilidad>): Promise<EtapaTrazabilidad> {
    await delay(300);
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
  },

  // Eliminar etapa
  async eliminarEtapa(etapaId: string): Promise<void> {
    await delay(300);
    const etapas = getEtapas();
    for (const key in etapas) {
      const index = etapas[key].findIndex(e => e.id === etapaId);
      if (index !== -1) {
        etapas[key].splice(index, 1);
        setEtapas(etapas);
        return;
      }
    }
    throw new Error('Etapa no encontrada');
  }
};

export default produccionService;