// src/views/app/Produccion/Trazabilidad.tsx
// @ts-nocheck
import { useState, useEffect, useMemo } from 'react';

import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaQrcode, 
  FaEye, 
  FaSearch, 
  FaTimes,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaCalendarAlt,
  FaTag,
  FaSpinner,
  FaSave,
  FaFileAlt,
  // FaImage,
  FaUser,
  FaClock,
  // FaUpload,
  FaStethoscope,
  FaTint,
  FaCut,
  FaLeaf,
  FaBug,
  FaFlask,
  // FaTimesCircle,
  FaPlusCircle,
  // FaCamera,
  FaClipboardList
} from 'react-icons/fa';
import { produccionService } from '../../../services/produccionService';
import type { Planta, PlantaInforme } from '../../../types/produccion.last';

// Componente Card para estadísticas
const StatCard = ({ title, value, icon, color }: { title: string; value: string | number; icon?: React.ReactNode; color?: string }) => {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '16px',
      padding: '20px',
      backdropFilter: 'blur(10px)',
      transition: 'all 0.3s ease'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.3)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'none';
    }}>
      <div className="d-flex justify-content-between align-items-start">
        <div>
          <span style={{ color: '#94a3b8', fontSize: '14px' }}>{title}</span>
          <h3 style={{ margin: '8px 0 0', fontSize: '28px', fontWeight: '700' }}>{value}</h3>
        </div>
        {icon && (
          <div style={{ 
            background: color || 'rgba(59,130,246,0.1)', 
            padding: '10px', 
            borderRadius: '12px',
            color: color ? color.replace('rgba', 'rgb').replace('0.1', '1') : '#3b82f6'
          }}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

// Componente para mostrar informes
const InformesList = ({ informes, onAddInforme, onDeleteInforme, loading }: { 
  informes: PlantaInforme[]; 
  onAddInforme: () => void;
  onDeleteInforme: (id: string) => void;
  loading?: boolean;
}) => {
  const getTipoIcon = (tipo: string) => {
    const icons: Record<string, any> = {
      'CRECIMIENTO': <FaLeaf />,
      'SALUD': <FaStethoscope />,
      'RIEGO': <FaTint />,
      'FERTILIZACION': <FaFlask />,
      'PODA': <FaCut />,
      'COSECHA': <FaCut />,
      'CONTROL_PLAGAS': <FaBug />,
      'GENERAL': <FaClipboardList />
    };
    return icons[tipo] || <FaFileAlt />;
  };

  const getTipoColor = (tipo: string) => {
    const colors: Record<string, string> = {
      'CRECIMIENTO': '#22c55e',
      'SALUD': '#3b82f6',
      'RIEGO': '#06b6d4',
      'FERTILIZACION': '#8b5cf6',
      'PODA': '#f59e0b',
      'COSECHA': '#ef4444',
      'CONTROL_PLAGAS': '#dc2626',
      'GENERAL': '#6b7280'
    };
    return colors[tipo] || '#6b7280';
  };

  const getEstadoLabel = (estado: string) => {
    const labels: Record<string, string> = {
      'BORRADOR': 'Borrador',
      'PUBLICADO': 'Publicado',
      'ARCHIVADO': 'Archivado'
    };
    return labels[estado] || estado;
  };

  const getEstadoColor = (estado: string) => {
    const colors: Record<string, string> = {
      'BORRADOR': '#f59e0b',
      'PUBLICADO': '#22c55e',
      'ARCHIVADO': '#6b7280'
    };
    return colors[estado] || '#6b7280';
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <FaSpinner className="fa-spin" style={{ color: '#3b82f6', fontSize: '24px' }} />
        <p style={{ color: '#94a3b8', marginTop: '12px' }}>Cargando informes...</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '16px',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <h4 style={{ margin: 0, color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FaClipboardList /> Informes de seguimiento ({informes.length})
        </h4>
        <button
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
            color: '#fff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
            fontWeight: '600',
            transition: 'all 0.3s ease'
          }}
          onClick={onAddInforme}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(59,130,246,0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <FaPlusCircle size={12} /> Nuevo Informe
        </button>
      </div>

      {informes.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '30px',
          color: '#94a3b8',
          border: '1px dashed rgba(255,255,255,0.08)',
          borderRadius: '12px'
        }}>
          <FaFileAlt size={32} style={{ opacity: 0.3, marginBottom: '12px' }} />
          <p>No hay informes registrados para esta planta</p>
          <button
            style={{
              marginTop: '8px',
              padding: '6px 16px',
              borderRadius: '6px',
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'transparent',
              color: '#94a3b8',
              cursor: 'pointer',
              fontSize: '13px'
            }}
            onClick={onAddInforme}
          >
            <FaPlus size={10} style={{ marginRight: '4px' }} /> Agregar primer informe
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {informes.map((informe) => (
            <div
              key={informe.id}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '12px',
                padding: '16px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ 
                      color: getTipoColor(informe.tipo),
                      fontSize: '14px'
                    }}>
                      {getTipoIcon(informe.tipo)}
                    </span>
                    <h5 style={{ margin: 0, fontSize: '15px', fontWeight: '600', color: '#e2e8f0' }}>
                      {informe.titulo}
                    </h5>
                    <span style={{
                      padding: '2px 10px',
                      borderRadius: '999px',
                      fontSize: '10px',
                      fontWeight: '600',
                      background: `${getTipoColor(informe.tipo)}20`,
                      color: getTipoColor(informe.tipo)
                    }}>
                      {informe.tipo}
                    </span>
                    <span style={{
                      padding: '2px 10px',
                      borderRadius: '999px',
                      fontSize: '10px',
                      fontWeight: '600',
                      background: `${getEstadoColor(informe.estado)}20`,
                      color: getEstadoColor(informe.estado)
                    }}>
                      {getEstadoLabel(informe.estado)}
                    </span>
                  </div>
                  
                  {informe.descripcion && (
                    <p style={{ 
                      margin: '8px 0 0', 
                      fontSize: '13px', 
                      color: '#94a3b8',
                      lineHeight: '1.5'
                    }}>
                      {informe.descripcion}
                    </p>
                  )}

                  {informe.datos_medicion && Object.keys(informe.datos_medicion).length > 0 && (
                    <div style={{ 
                      display: 'flex', 
                      gap: '16px', 
                      marginTop: '8px',
                      flexWrap: 'wrap'
                    }}>
                      {Object.entries(informe.datos_medicion).map(([key, value]) => (
                        <div key={key} style={{ 
                          background: 'rgba(255,255,255,0.03)',
                          padding: '4px 12px',
                          borderRadius: '6px',
                          fontSize: '12px'
                        }}>
                          <span style={{ color: '#64748b' }}>{key}:</span>
                          <span style={{ color: '#e2e8f0', marginLeft: '4px', fontWeight: '500' }}>
                            {typeof value === 'number' ? value.toFixed(2) : value}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {informe.imagen_url && (
                    <div style={{ marginTop: '8px' }}>
                      <img 
                        src={informe.imagen_url} 
                        alt={informe.titulo}
                        style={{
                          maxWidth: '100%',
                          maxHeight: '150px',
                          borderRadius: '8px',
                          objectFit: 'cover',
                          border: '1px solid rgba(255,255,255,0.06)'
                        }}
                      />
                    </div>
                  )}

                  <div style={{ 
                    display: 'flex', 
                    gap: '16px', 
                    marginTop: '8px',
                    fontSize: '12px',
                    color: '#64748b',
                    flexWrap: 'wrap'
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <FaCalendarAlt size={10} /> {new Date(informe.fecha_informe).toLocaleDateString('es-ES')}
                    </span>
                    {informe.autor && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <FaUser size={10} /> {informe.autor}
                      </span>
                    )}
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <FaClock size={10} /> {new Date(informe.created_at).toLocaleString('es-ES')}
                    </span>
                  </div>
                </div>

                <button
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#ef4444',
                    cursor: 'pointer',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    opacity: 0.5,
                    transition: 'all 0.2s ease'
                  }}
                  onClick={() => onDeleteInforme(informe.id)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '1';
                    e.currentTarget.style.background = 'rgba(239,68,68,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '0.5';
                    e.currentTarget.style.background = 'transparent';
                  }}
                  title="Eliminar informe"
                >
                  <FaTrash size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Componente de formulario para informes
const InformeForm = ({ 
  onSave, 
  onCancel, 
  initialData,
  loading 
}: { 
  onSave: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
  loading?: boolean;
}) => {
  const [formData, setFormData] = useState({
    titulo: initialData?.titulo || '',
    descripcion: initialData?.descripcion || '',
    tipo: initialData?.tipo || 'GENERAL',
    fecha_informe: initialData?.fecha_informe || new Date().toISOString().split('T')[0],
    imagen_url: initialData?.imagen_url || '',
    datos_medicion: initialData?.datos_medicion || {},
    recomendaciones: initialData?.recomendaciones || '',
    estado: initialData?.estado || 'BORRADOR'
  });

  const [mediciones, setMediciones] = useState<{key: string; value: string}[]>(
    initialData?.datos_medicion ? 
      Object.entries(initialData.datos_medicion).map(([key, value]) => ({ key, value: String(value) })) :
      [{ key: '', value: '' }]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const datosMedicion: Record<string, any> = {};
    mediciones.forEach(m => {
      if (m.key && m.value) {
        const numValue = parseFloat(m.value);
        datosMedicion[m.key] = isNaN(numValue) ? m.value : numValue;
      }
    });
    onSave({
      ...formData,
      datos_medicion: datosMedicion
    });
  };

  const addMedicion = () => {
    setMediciones([...mediciones, { key: '', value: '' }]);
  };

  const removeMedicion = (index: number) => {
    setMediciones(mediciones.filter((_, i) => i !== index));
  };

  const updateMedicion = (index: number, field: 'key' | 'value', value: string) => {
    const newMediciones = [...mediciones];
    newMediciones[index][field] = value;
    setMediciones(newMediciones);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: '12px' }}>
        <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '4px' }}>
          Título del informe *
        </label>
        <input
          style={{
            width: '100%',
            padding: '10px 14px',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(255,255,255,0.03)',
            color: '#fff',
            fontSize: '14px',
            outline: 'none',
            transition: 'all 0.2s ease'
          }}
          placeholder="Ej: Control de crecimiento - Semana 4"
          value={formData.titulo}
          onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
          required
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'rgba(59,130,246,0.5)';
            e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
            e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
          }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
        <div>
          <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '4px' }}>
            Tipo de informe
          </label>
          <select
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.03)',
              color: '#fff',
              fontSize: '14px',
              outline: 'none',
              cursor: 'pointer'
            }}
            value={formData.tipo}
            onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
          >
            <option value="CRECIMIENTO">🌱 Crecimiento</option>
            <option value="SALUD">🩺 Salud</option>
            <option value="RIEGO">💧 Riego</option>
            <option value="FERTILIZACION">🧪 Fertilización</option>
            <option value="PODA">✂️ Poda</option>
            <option value="COSECHA">🌾 Cosecha</option>
            <option value="CONTROL_PLAGAS">🐛 Control de plagas</option>
            <option value="GENERAL">📋 General</option>
          </select>
        </div>
        <div>
          <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '4px' }}>
            Fecha del informe
          </label>
          <input
            type="date"
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.03)',
              color: '#fff',
              fontSize: '14px',
              outline: 'none',
              transition: 'all 0.2s ease'
            }}
            value={formData.fecha_informe}
            onChange={(e) => setFormData({ ...formData, fecha_informe: e.target.value })}
            required
          />
        </div>
      </div>

      <div style={{ marginBottom: '12px' }}>
        <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '4px' }}>
          Descripción
        </label>
        <textarea
          style={{
            width: '100%',
            padding: '10px 14px',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(255,255,255,0.03)',
            color: '#fff',
            fontSize: '14px',
            outline: 'none',
            minHeight: '60px',
            resize: 'vertical',
            fontFamily: 'inherit'
          }}
          placeholder="Describe los hallazgos del informe..."
          value={formData.descripcion}
          onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
        />
      </div>

      <div style={{ marginBottom: '12px' }}>
        <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '4px' }}>
          URL de imagen (opcional)
        </label>
        <input
          style={{
            width: '100%',
            padding: '10px 14px',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(255,255,255,0.03)',
            color: '#fff',
            fontSize: '14px',
            outline: 'none'
          }}
          placeholder="https://ejemplo.com/imagen.jpg"
          value={formData.imagen_url}
          onChange={(e) => setFormData({ ...formData, imagen_url: e.target.value })}
        />
      </div>

      <div style={{ marginBottom: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', margin: 0 }}>
            Datos de medición
          </label>
          <button
            type="button"
            style={{
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '6px',
              color: '#94a3b8',
              padding: '4px 12px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
            onClick={addMedicion}
          >
            <FaPlus size={10} style={{ marginRight: '4px' }} /> Agregar
          </button>
        </div>
        {mediciones.map((medicion, index) => (
          <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
            <input
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.03)',
                color: '#fff',
                fontSize: '13px',
                outline: 'none'
              }}
              placeholder="Ej: Altura"
              value={medicion.key}
              onChange={(e) => updateMedicion(index, 'key', e.target.value)}
            />
            <input
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.03)',
                color: '#fff',
                fontSize: '13px',
                outline: 'none'
              }}
              placeholder="Ej: 45.5"
              value={medicion.value}
              onChange={(e) => updateMedicion(index, 'value', e.target.value)}
            />
            {mediciones.length > 1 && (
              <button
                type="button"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#ef4444',
                  cursor: 'pointer',
                  padding: '0 8px'
                }}
                onClick={() => removeMedicion(index)}
              >
                <FaTimes size={12} />
              </button>
            )}
          </div>
        ))}
      </div>

      <div style={{ marginBottom: '12px' }}>
        <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '4px' }}>
          Recomendaciones
        </label>
        <textarea
          style={{
            width: '100%',
            padding: '10px 14px',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(255,255,255,0.03)',
            color: '#fff',
            fontSize: '14px',
            outline: 'none',
            minHeight: '50px',
            resize: 'vertical',
            fontFamily: 'inherit'
          }}
          placeholder="Recomendaciones basadas en el informe..."
          value={formData.recomendaciones}
          onChange={(e) => setFormData({ ...formData, recomendaciones: e.target.value })}
        />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '4px' }}>
          Estado
        </label>
        <select
          style={{
            width: '100%',
            padding: '10px 14px',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(255,255,255,0.03)',
            color: '#fff',
            fontSize: '14px',
            outline: 'none',
            cursor: 'pointer'
          }}
          value={formData.estado}
          onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
        >
          <option value="BORRADOR">📝 Borrador</option>
          <option value="PUBLICADO">✅ Publicado</option>
          <option value="ARCHIVADO">📁 Archivado</option>
        </select>
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          type="button"
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.08)',
            background: 'transparent',
            color: '#94a3b8',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onClick={onCancel}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}
        >
          Cancelar
        </button>
        <button
          type="submit"
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '8px',
            border: 'none',
            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
            color: '#fff',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.3s ease'
          }}
          disabled={loading}
          onMouseEnter={(e) => {
            if (!loading) {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(59,130,246,0.4)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          {loading ? <FaSpinner className="fa-spin" /> : <FaSave />}
          Guardar Informe
        </button>
      </div>
    </form>
  );
};

const Trazabilidad = () => {
  const [plantas, setPlantas] = useState<Planta[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState('');
  const [filterEstado, setFilterEstado] = useState('');
  const [sortField, setSortField] = useState<keyof Planta>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Estados para modales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'edit' | 'view' | 'delete' | 'addInforme'>('create');
  const [selectedPlanta, setSelectedPlanta] = useState<Planta | null>(null);
  const [informes, setInformes] = useState<PlantaInforme[]>([]);
  const [loadingInformes, setLoadingInformes] = useState(false);
  const [editingInforme, setEditingInforme] = useState<PlantaInforme | null>(null);
  
  const [formData, setFormData] = useState<{
    nombre: string;
    codigo_qr: string;
    tipo: 'INDICA' | 'SATIVA' | 'HIBRIDA';
    estado: 'ACTIVO' | 'FINALIZADO' | 'CANCELADO';
    lote: string;
    descripcion: string;
  }>({
    nombre: '',
    codigo_qr: '',
    tipo: 'INDICA',
    estado: 'ACTIVO',
    lote: '',
    descripcion: ''
  });
  // Cargar plantas
  useEffect(() => {
    cargarPlantas();
  }, []);

  // Cargar informes cuando se selecciona una planta
  useEffect(() => {
    if (selectedPlanta && (modalType === 'view' || modalType === 'edit')) {
      cargarInformes(selectedPlanta.id);
    }
  }, [selectedPlanta, modalType]);

  const cargarPlantas = async () => {
    try {
      setLoading(true);
      const data = await produccionService.obtenerPlantas();
      setPlantas(data);
    } catch (error) {
      console.error('Error cargando plantas:', error);
    } finally {
      setLoading(false);
    }
  };

  const cargarInformes = async (plantaId: string) => {
    try {
      setLoadingInformes(true);
      const data = await produccionService.obtenerInformes(plantaId);
      setInformes(data);
    } catch (error) {
      console.error('Error cargando informes:', error);
    } finally {
      setLoadingInformes(false);
    }
  };

  // Abrir modal de crear
  const openCreate = () => {
    setModalType('create');
    setFormData({
      nombre: '',
      codigo_qr: '',
      tipo: 'INDICA',
      estado: 'ACTIVO',
      lote: '',
      descripcion: ''
    });
    setSelectedPlanta(null);
    setInformes([]);
    setIsModalOpen(true);
  };

  // Abrir modal de editar
  const openEdit = (planta: Planta) => {
    setModalType('edit');
    setSelectedPlanta(planta);
    setFormData({
      nombre: planta.nombre,
      codigo_qr: planta.codigo_qr,
      tipo: planta.tipo,
      estado: planta.estado,
      lote: planta.lote || '',
      descripcion: planta.descripcion || ''
    });
    setIsModalOpen(true);
  };

  // Abrir modal de ver
  const openView = (planta: Planta) => {
    setModalType('view');
    setSelectedPlanta(planta);
    setInformes([]);
    setIsModalOpen(true);
  };

  // Abrir modal de eliminar
  const openDelete = (planta: Planta) => {
    setModalType('delete');
    setSelectedPlanta(planta);
    setIsModalOpen(true);
  };

  // Abrir modal de agregar informe
  const openAddInforme = () => {
    setModalType('addInforme');
    setEditingInforme(null);
    setIsModalOpen(true);
  };

  // Guardar planta (crear o editar)
  const handleSave = async () => {
    try {
      if (modalType === 'create') {
        await produccionService.crearPlanta(formData);
      } else if (modalType === 'edit' && selectedPlanta) {
        await produccionService.actualizarPlanta(selectedPlanta.id, formData);
      }
      await cargarPlantas();
      setIsModalOpen(false);
      setSelectedPlanta(null);
    } catch (error) {
      console.error('Error guardando planta:', error);
    }
  };

  // Guardar informe
  const handleSaveInforme = async (informeData: any) => {
    if (!selectedPlanta) return;
    try {
      const newInforme = {
        ...informeData,
        id: editingInforme?.id || `inf_${Date.now()}`,
        planta_id: selectedPlanta.id,
        autor: 'Usuario Actual',
        created_at: editingInforme?.created_at || new Date().toISOString()
      };

      if (editingInforme) {
        await produccionService.actualizarInforme(selectedPlanta.id, editingInforme.id, newInforme);
      } else {
        await produccionService.crearInforme(selectedPlanta.id, newInforme);
      }
      
      await cargarInformes(selectedPlanta.id);
      setIsModalOpen(false);
      setEditingInforme(null);
      // Volver a vista de detalles
      setModalType('view');
    } catch (error) {
      console.error('Error guardando informe:', error);
    }
  };

  // Eliminar informe
  const handleDeleteInforme = async (informeId: string) => {
    if (!selectedPlanta) return;
    if (!confirm('¿Estás seguro de eliminar este informe?')) return;
    try {
      await produccionService.eliminarInforme(selectedPlanta.id, informeId);
      await cargarInformes(selectedPlanta.id);
    } catch (error) {
      console.error('Error eliminando informe:', error);
    }
  };

  // Eliminar planta
  const handleDelete = async () => {
    if (!selectedPlanta) return;
    try {
      await produccionService.eliminarPlanta(selectedPlanta.id);
      await cargarPlantas();
      setIsModalOpen(false);
      setSelectedPlanta(null);
    } catch (error) {
      console.error('Error eliminando planta:', error);
    }
  };

  const handleSort = (field: keyof Planta) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedPlantas = useMemo(() => {
    let result = [...plantas];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(planta =>
        planta.nombre.toLowerCase().includes(term) ||
        planta.codigo_qr.toLowerCase().includes(term) ||
        (planta.lote && planta.lote.toLowerCase().includes(term))
      );
    }

    if (filterTipo) {
      result = result.filter(planta => planta.tipo === filterTipo);
    }

    if (filterEstado) {
      result = result.filter(planta => planta.estado === filterEstado);
    }

    result.sort((a, b) => {
      let aValue = a[sortField] || '';
      let bValue = b[sortField] || '';
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [plantas, searchTerm, filterTipo, filterEstado, sortField, sortDirection]);

  // Estadísticas
  const totalPlantas = plantas.length;
  const activas = plantas.filter(p => p.estado === 'ACTIVO').length;
  const finalizadas = plantas.filter(p => p.estado === 'FINALIZADO').length;
  const indicas = plantas.filter(p => p.tipo === 'INDICA').length;

  const getTipoBadgeClass = (tipo: string): string => {
    const classes: Record<string, string> = {
      'INDICA': 'bg-success',
      'SATIVA': 'bg-warning text-dark',
      'HIBRIDA': 'bg-info'
    };
    return classes[tipo] || 'bg-secondary';
  };

  const getEstadoBadgeClass = (estado: string): string => {
    const classes: Record<string, string> = {
      'ACTIVO': 'bg-success',
      'FINALIZADO': 'bg-primary',
      'CANCELADO': 'bg-danger'
    };
    return classes[estado] || 'bg-secondary';
  };

  const getTipoLabel = (tipo: string): string => {
    const labels: Record<string, string> = {
      'INDICA': 'Indica',
      'SATIVA': 'Sativa',
      'HIBRIDA': 'Híbrida'
    };
    return labels[tipo] || tipo;
  };

  const getEstadoLabel = (estado: string): string => {
    const labels: Record<string, string> = {
      'ACTIVO': 'Activo',
      'FINALIZADO': 'Finalizado',
      'CANCELADO': 'Cancelado'
    };
    return labels[estado] || estado;
  };

  const getSortIcon = (field: keyof Planta) => {
    if (sortField !== field) return <FaSort className="text-secondary opacity-50" size={12} />;
    return sortDirection === 'asc' 
      ? <FaSortUp className="text-primary" size={12} />
      : <FaSortDown className="text-primary" size={12} />;
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterTipo('');
    setFilterEstado('');
  };

  const hasActiveFilters = searchTerm || filterTipo || filterEstado;

  return (
    <div style={{
      padding: '30px',
      minHeight: 'calc(100vh - 120px)',
      background: 'linear-gradient(135deg, #0f172a, #1e293b)',
      color: '#fff'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        flexWrap: 'wrap',
        gap: '15px'
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '32px', fontWeight: '700' }}>
            🌱 Trazabilidad de Plantas
          </h1>
          <p style={{ color: '#94a3b8', marginTop: '8px', fontSize: '14px' }}>
            {filteredAndSortedPlantas.length} plantas encontradas • {plantas.length} en total
          </p>
        </div>
        <button
          style={{
            border: 'none',
            padding: '12px 24px',
            borderRadius: '12px',
            display: 'flex',
            gap: '10px',
            alignItems: 'center',
            cursor: 'pointer',
            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '14px',
            transition: 'all 0.3s ease'
          }}
          onClick={openCreate}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(59,130,246,0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <FaPlus /> Nueva Planta
        </button>
      </div>

      {/* Tarjetas de estadísticas */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <StatCard title="Total Plantas" value={totalPlantas} icon={<FaTag size={18} />} />
        <StatCard title="Activas" value={activas} icon={<FaTag size={18} />} color="rgba(34,197,94,0.1)" />
        <StatCard title="Finalizadas" value={finalizadas} icon={<FaTag size={18} />} color="rgba(59,130,246,0.1)" />
        <StatCard title="Indica" value={indicas} icon={<FaTag size={18} />} color="rgba(139,92,246,0.1)" />
      </div>

      {/* Filtros */}
      <div style={{
        display: 'flex',
        gap: '15px',
        marginBottom: '25px',
        flexWrap: 'wrap'
      }}>
        <div style={{
          flex: 1,
          minWidth: '200px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '12px',
          padding: '0 15px'
        }}>
          <FaSearch color="#94a3b8" />
          <input
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              color: '#fff',
              padding: '14px 0',
              outline: 'none',
              fontSize: '14px'
            }}
            placeholder="Buscar por nombre, código QR o lote..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer'
              }}
              onClick={() => setSearchTerm('')}
            >
              <FaTimes />
            </button>
          )}
        </div>

        <select
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            color: '#fff',
            padding: '14px 20px',
            outline: 'none',
            minWidth: '150px',
            fontSize: '14px',
            cursor: 'pointer'
          }}
          value={filterTipo}
          onChange={(e) => setFilterTipo(e.target.value)}
        >
          <option value="">Todos los tipos</option>
          <option value="INDICA">🌿 Indica</option>
          <option value="SATIVA">🌿 Sativa</option>
          <option value="HIBRIDA">🌿 Híbrida</option>
        </select>

        <select
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            color: '#fff',
            padding: '14px 20px',
            outline: 'none',
            minWidth: '150px',
            fontSize: '14px',
            cursor: 'pointer'
          }}
          value={filterEstado}
          onChange={(e) => setFilterEstado(e.target.value)}
        >
          <option value="">Todos los estados</option>
          <option value="ACTIVO">✅ Activo</option>
          <option value="FINALIZADO">📌 Finalizado</option>
          <option value="CANCELADO">❌ Cancelado</option>
        </select>

        {hasActiveFilters && (
          <button
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              color: '#94a3b8',
              padding: '14px 20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              transition: 'all 0.2s ease'
            }}
            onClick={clearFilters}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
            }}
          >
            <FaTimes size={12} /> Limpiar filtros
          </button>
        )}
      </div>

      {/* Tabla */}
      <div style={{
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '20px',
        overflow: 'hidden',
        backdropFilter: 'blur(10px)'
      }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <FaSpinner style={{ color: '#3b82f6', fontSize: '40px' }} className="fa-spin" />
            <p style={{ color: '#94a3b8', marginTop: '16px' }}>Cargando plantas...</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              minWidth: '800px'
            }}>
              <thead>
                <tr style={{
                  background: 'rgba(255,255,255,0.03)',
                  borderBottom: '1px solid rgba(255,255,255,0.06)'
                }}>
                  <th style={{
                    textAlign: 'left',
                    padding: '18px 16px',
                    color: '#94a3b8',
                    fontSize: '12px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    width: '50px'
                  }}>
                    #
                  </th>
                  <th
                    style={{
                      textAlign: 'left',
                      padding: '18px 16px',
                      color: '#94a3b8',
                      fontSize: '12px',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      cursor: 'pointer',
                      minWidth: '120px'
                    }}
                    onClick={() => handleSort('codigo_qr')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      Código QR {getSortIcon('codigo_qr')}
                    </div>
                  </th>
                  <th
                    style={{
                      textAlign: 'left',
                      padding: '18px 16px',
                      color: '#94a3b8',
                      fontSize: '12px',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      cursor: 'pointer',
                      minWidth: '150px'
                    }}
                    onClick={() => handleSort('nombre')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      Nombre {getSortIcon('nombre')}
                    </div>
                  </th>
                  <th
                    style={{
                      textAlign: 'left',
                      padding: '18px 16px',
                      color: '#94a3b8',
                      fontSize: '12px',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      cursor: 'pointer',
                      minWidth: '100px'
                    }}
                    onClick={() => handleSort('tipo')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      Tipo {getSortIcon('tipo')}
                    </div>
                  </th>
                  <th
                    style={{
                      textAlign: 'left',
                      padding: '18px 16px',
                      color: '#94a3b8',
                      fontSize: '12px',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      cursor: 'pointer',
                      minWidth: '110px'
                    }}
                    onClick={() => handleSort('created_at')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      Fecha {getSortIcon('created_at')}
                    </div>
                  </th>
                  <th
                    style={{
                      textAlign: 'left',
                      padding: '18px 16px',
                      color: '#94a3b8',
                      fontSize: '12px',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      cursor: 'pointer',
                      minWidth: '100px'
                    }}
                    onClick={() => handleSort('estado')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      Estado {getSortIcon('estado')}
                    </div>
                  </th>
                  <th style={{
                    textAlign: 'center',
                    padding: '18px 16px',
                    color: '#94a3b8',
                    fontSize: '12px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    minWidth: '140px'
                  }}>
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedPlantas.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '60px 0' }}>
                      <div style={{ color: '#94a3b8' }}>
                        <p style={{ fontSize: '18px', marginBottom: '8px' }}>🌿 No se encontraron plantas</p>
                        <p style={{ fontSize: '14px' }}>Prueba ajustando los filtros o crea una nueva planta</p>
                        <button
                          style={{
                            marginTop: '16px',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '10px',
                            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                            color: '#fff',
                            cursor: 'pointer',
                            fontWeight: '600'
                          }}
                          onClick={openCreate}
                        >
                          <FaPlus style={{ marginRight: '8px' }} /> Crear primera planta
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredAndSortedPlantas.map((planta, index) => (
                    <tr
                      key={planta.id}
                      style={{
                        borderBottom: '1px solid rgba(255,255,255,0.04)',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <td style={{ padding: '16px', color: '#64748b', fontSize: '14px' }}>
                        {index + 1}
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{
                            padding: '6px',
                            borderRadius: '8px',
                            background: 'rgba(59,130,246,0.1)'
                          }}>
                            <FaQrcode style={{ color: '#3b82f6', fontSize: '14px' }} />
                          </div>
                          <span style={{ color: '#94a3b8', fontFamily: 'monospace', fontSize: '13px' }}>
                            {planta.codigo_qr}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '16px', fontWeight: '500' }}>
                        {planta.nombre}
                      </td>
                      <td style={{ padding: '16px' }}>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '999px',
                          fontSize: '12px',
                          fontWeight: '600',
                          background: getTipoBadgeClass(planta.tipo),
                          color: ['bg-warning', 'bg-info'].includes(getTipoBadgeClass(planta.tipo)) ? '#000' : '#fff'
                        }}>
                          {getTipoLabel(planta.tipo)}
                        </span>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '13px' }}>
                          <FaCalendarAlt size={12} style={{ opacity: 0.5 }} />
                          {new Date(planta.created_at).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                          })}
                        </div>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '999px',
                          fontSize: '12px',
                          fontWeight: '600',
                          background: getEstadoBadgeClass(planta.estado),
                          color: '#fff'
                        }}>
                          {getEstadoLabel(planta.estado)}
                        </span>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <button
                            style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '8px',
                              border: '1px solid rgba(255,255,255,0.08)',
                              background: 'rgba(255,255,255,0.03)',
                              color: '#94a3b8',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.2s ease'
                            }}
                            onClick={() => openView(planta)}
                            title="Ver trazabilidad"
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = 'rgba(59,130,246,0.15)';
                              e.currentTarget.style.color = '#3b82f6';
                              e.currentTarget.style.borderColor = 'rgba(59,130,246,0.2)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                              e.currentTarget.style.color = '#94a3b8';
                              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                            }}
                          >
                            <FaEye size={14} />
                          </button>
                          <button
                            style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '8px',
                              border: '1px solid rgba(255,255,255,0.08)',
                              background: 'rgba(255,255,255,0.03)',
                              color: '#94a3b8',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.2s ease'
                            }}
                            onClick={() => openEdit(planta)}
                            title="Editar"
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = 'rgba(251,191,36,0.15)';
                              e.currentTarget.style.color = '#fbbf24';
                              e.currentTarget.style.borderColor = 'rgba(251,191,36,0.2)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                              e.currentTarget.style.color = '#94a3b8';
                              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                            }}
                          >
                            <FaEdit size={14} />
                          </button>
                          <button
                            style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '8px',
                              border: '1px solid rgba(255,255,255,0.08)',
                              background: 'rgba(255,255,255,0.03)',
                              color: '#94a3b8',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.2s ease'
                            }}
                            onClick={() => openDelete(planta)}
                            title="Eliminar"
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = 'rgba(239,68,68,0.15)';
                              e.currentTarget.style.color = '#ef4444';
                              e.currentTarget.style.borderColor = 'rgba(239,68,68,0.2)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                              e.currentTarget.style.color = '#94a3b8';
                              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                            }}
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 999,
          padding: '20px'
        }}>
          <div style={{
            width: '100%',
            maxWidth: modalType === 'view' ? '700px' : '550px',
            background: '#0f172a',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '20px',
            padding: '32px',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '700' }}>
                {modalType === 'create' && '🌱 Nueva Planta'}
                {modalType === 'edit' && '✏️ Editar Planta'}
                {modalType === 'view' && '👁️ Detalle de Planta'}
                {modalType === 'delete' && '⚠️ Eliminar Planta'}
                {modalType === 'addInforme' && '📝 Nuevo Informe'}
              </h2>
              <button
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#94a3b8',
                  width: '36px',
                  height: '36px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedPlanta(null);
                  setInformes([]);
                  setEditingInforme(null);
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                }}
              >
                <FaTimes size={18} />
              </button>
            </div>

            {/* Modal Content - View */}
            {modalType === 'view' && selectedPlanta && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '4px' }}>
                      <FaQrcode size={12} style={{ marginRight: '4px' }} /> Código QR
                    </label>
                    <div style={{
                      padding: '10px 14px',
                      background: 'rgba(255,255,255,0.03)',
                      borderRadius: '8px',
                      fontFamily: 'monospace',
                      fontSize: '13px',
                      border: '1px solid rgba(255,255,255,0.06)'
                    }}>
                      {selectedPlanta.codigo_qr}
                    </div>
                  </div>
                  <div>
                    <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '4px' }}>
                      <FaTag size={12} style={{ marginRight: '4px' }} /> Nombre
                    </label>
                    <div style={{
                      padding: '10px 14px',
                      background: 'rgba(255,255,255,0.03)',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '500',
                      border: '1px solid rgba(255,255,255,0.06)'
                    }}>
                      {selectedPlanta.nombre}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '12px' }}>
                  <div>
                    <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '4px' }}>Tipo</label>
                    <div style={{
                      padding: '10px 14px',
                      background: 'rgba(255,255,255,0.03)',
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.06)'
                    }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '999px',
                        fontSize: '12px',
                        fontWeight: '600',
                        background: getTipoBadgeClass(selectedPlanta.tipo),
                        color: ['bg-warning', 'bg-info'].includes(getTipoBadgeClass(selectedPlanta.tipo)) ? '#000' : '#fff'
                      }}>
                        {getTipoLabel(selectedPlanta.tipo)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '4px' }}>Estado</label>
                    <div style={{
                      padding: '10px 14px',
                      background: 'rgba(255,255,255,0.03)',
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.06)'
                    }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '999px',
                        fontSize: '12px',
                        fontWeight: '600',
                        background: getEstadoBadgeClass(selectedPlanta.estado),
                        color: '#fff'
                      }}>
                        {getEstadoLabel(selectedPlanta.estado)}
                      </span>
                    </div>
                  </div>
                </div>

                {selectedPlanta.lote && (
                  <div style={{ marginTop: '12px' }}>
                    <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '4px' }}>Lote</label>
                    <div style={{
                      padding: '10px 14px',
                      background: 'rgba(255,255,255,0.03)',
                      borderRadius: '8px',
                      fontSize: '14px',
                      border: '1px solid rgba(255,255,255,0.06)'
                    }}>
                      {selectedPlanta.lote}
                    </div>
                  </div>
                )}

                {selectedPlanta.descripcion && (
                  <div style={{ marginTop: '12px' }}>
                    <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '4px' }}>Descripción</label>
                    <div style={{
                      padding: '10px 14px',
                      background: 'rgba(255,255,255,0.03)',
                      borderRadius: '8px',
                      fontSize: '14px',
                      border: '1px solid rgba(255,255,255,0.06)',
                      minHeight: '40px',
                      whiteSpace: 'pre-wrap'
                    }}>
                      {selectedPlanta.descripcion}
                    </div>
                  </div>
                )}

                <div style={{ marginTop: '12px' }}>
                  <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '4px' }}>
                    <FaCalendarAlt size={12} style={{ marginRight: '4px' }} /> Fecha de creación
                  </label>
                  <div style={{
                    padding: '10px 14px',
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: '8px',
                    fontSize: '13px',
                    border: '1px solid rgba(255,255,255,0.06)',
                    color: '#94a3b8'
                  }}>
                    {new Date(selectedPlanta.created_at).toLocaleString('es-ES', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>

                {/* Sección de Informes */}
                <div style={{ marginTop: '24px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '20px' }}>
                  <InformesList 
                    informes={informes}
                    onAddInforme={openAddInforme}
                    onDeleteInforme={handleDeleteInforme}
                    loading={loadingInformes}
                  />
                </div>
              </div>
            )}

            {/* Modal Content - Delete */}
            {modalType === 'delete' && selectedPlanta && (
              <div>
                <p style={{ fontSize: '16px', marginBottom: '8px' }}>
                  ¿Estás seguro de eliminar la planta <strong>"{selectedPlanta.nombre}"</strong>?
                </p>
                <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '24px' }}>
                  Esta acción eliminará todos los datos asociados a esta planta y no se puede deshacer.
                </p>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '10px',
                      border: '1px solid rgba(255,255,255,0.08)',
                      background: 'transparent',
                      color: '#94a3b8',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onClick={() => setIsModalOpen(false)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '10px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                      color: '#fff',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      transition: 'all 0.3s ease'
                    }}
                    onClick={handleDelete}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(239,68,68,0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <FaTrash /> Eliminar
                  </button>
                </div>
              </div>
            )}

            {/* Modal Content - Create/Edit */}
            {(modalType === 'create' || modalType === 'edit') && (
              <div>
                <input
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    marginBottom: '12px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255,255,255,0.08)',
                    background: 'rgba(255,255,255,0.03)',
                    color: '#fff',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'all 0.2s ease'
                  }}
                  placeholder="Nombre de la planta"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(59,130,246,0.5)';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                  }}
                />
                <input
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    marginBottom: '12px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255,255,255,0.08)',
                    background: 'rgba(255,255,255,0.03)',
                    color: '#fff',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'all 0.2s ease'
                  }}
                  placeholder="Código QR"
                  value={formData.codigo_qr}
                  onChange={(e) => setFormData({ ...formData, codigo_qr: e.target.value })}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(59,130,246,0.5)';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                  }}
                />
                <input
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    marginBottom: '12px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255,255,255,0.08)',
                    background: 'rgba(255,255,255,0.03)',
                    color: '#fff',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'all 0.2s ease'
                  }}
                  placeholder="Lote (opcional)"
                  value={formData.lote}
                  onChange={(e) => setFormData({ ...formData, lote: e.target.value })}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(59,130,246,0.5)';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                  }}
                />
                <textarea
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    marginBottom: '12px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255,255,255,0.08)',
                    background: 'rgba(255,255,255,0.03)',
                    color: '#fff',
                    fontSize: '14px',
                    outline: 'none',
                    minHeight: '80px',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    transition: 'all 0.2s ease'
                  }}
                  placeholder="Descripción (opcional)"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(59,130,246,0.5)';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                  }}
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                  <select
                    style={{
                      padding: '12px 16px',
                      borderRadius: '10px',
                      border: '1px solid rgba(255,255,255,0.08)',
                      background: 'rgba(255,255,255,0.03)',
                      color: '#fff',
                      fontSize: '14px',
                      outline: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    value={formData.tipo}
                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(59,130,246,0.5)';
                      e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                      e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                    }}
                  >
                    <option value="INDICA">🌿 Indica</option>
                    <option value="SATIVA">🌿 Sativa</option>
                    <option value="HIBRIDA">🌿 Híbrida</option>
                  </select>
                  <select
                    style={{
                      padding: '12px 16px',
                      borderRadius: '10px',
                      border: '1px solid rgba(255,255,255,0.08)',
                      background: 'rgba(255,255,255,0.03)',
                      color: '#fff',
                      fontSize: '14px',
                      outline: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    value={formData.estado}
                    onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(59,130,246,0.5)';
                      e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                      e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                    }}
                  >
                    <option value="ACTIVO">✅ Activo</option>
                    <option value="FINALIZADO">📌 Finalizado</option>
                    <option value="CANCELADO">❌ Cancelado</option>
                  </select>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '10px',
                      border: '1px solid rgba(255,255,255,0.08)',
                      background: 'transparent',
                      color: '#94a3b8',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onClick={() => setIsModalOpen(false)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '10px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                      color: '#fff',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      transition: 'all 0.3s ease'
                    }}
                    onClick={handleSave}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(59,130,246,0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <FaSave /> Guardar
                  </button>
                </div>
              </div>
            )}

            {/* Modal Content - Add Informe */}
            {modalType === 'addInforme' && (
              <InformeForm
                onSave={handleSaveInforme}
                onCancel={() => {
                  setIsModalOpen(false);
                  setEditingInforme(null);
                  if (selectedPlanta) {
                    setModalType('view');
                  }
                }}
                initialData={editingInforme || undefined}
                loading={loadingInformes}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Trazabilidad;