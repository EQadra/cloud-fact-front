// src/views/app/Produccion/Trazabilidad.tsx
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
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
  FaUser,
  FaClock,
  FaStethoscope,
  FaTint,
  FaCut,
  FaLeaf,
  FaBug,
  FaFlask,
  FaPlusCircle,
  FaClipboardList,
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaThermometerHalf,
} from 'react-icons/fa';
import { useProduction } from '../../../context/ProductionContext';
import type { Planta, PlantaInforme, EtapaTrazabilidad } from '../../../types/produccion';

// ============================================
// COMPONENTE STAT CARD
// ============================================

const StatCard = ({ 
  title, 
  value, 
  icon, 
  color = 'rgba(59,130,246,0.1)',
  subtitle 
}: { 
  title: string; 
  value: string | number; 
  icon?: React.ReactNode; 
  color?: string;
  subtitle?: string;
}) => {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '16px',
      padding: '20px',
      backdropFilter: 'blur(10px)',
      transition: 'all 0.3s ease',
      cursor: 'default'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.3)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'none';
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <span style={{ color: '#94a3b8', fontSize: '14px' }}>{title}</span>
          <h3 style={{ margin: '8px 0 0', fontSize: '28px', fontWeight: '700' }}>{value}</h3>
          {subtitle && (
            <span style={{ color: '#64748b', fontSize: '12px', marginTop: '4px', display: 'block' }}>
              {subtitle}
            </span>
          )}
        </div>
        {icon && (
          <div style={{
            background: color,
            padding: '10px',
            borderRadius: '12px',
            color: color.replace('rgba', '').replace('0.1', '').replace(/[(),]/g, '').trim() || '#3b82f6'
          }}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================
// COMPONENTE LISTA DE ETAPAS
// ============================================

const EtapasListComponent = ({ 
  etapas, 
  loading, 
  onAddEtapa, 
  onEditEtapa, 
  onDeleteEtapa 
}: { 
  etapas: EtapaTrazabilidad[]; 
  loading: boolean; 
  onAddEtapa: () => void; 
  onEditEtapa: (etapa: EtapaTrazabilidad) => void; 
  onDeleteEtapa: (id: string) => void; 
}) => {
  const getEtapaIcon = (etapa: string) => {
    const icons: Record<string, string> = {
      'SIEMBRA': '🌱',
      'GERMINACION': '🌿',
      'CRECIMIENTO_VEGETATIVO': '🌳',
      'PRE_FLORA': '🌸',
      'FLORA': '🌺',
      'COSECHA': '✂️',
      'SECADO': '🌾',
      'CURADO': '🏺',
    };
    return icons[etapa] || '📋';
  };

  const getEtapaLabel = (etapa: string): string => {
    const labels: Record<string, string> = {
      'SIEMBRA': 'Siembra',
      'GERMINACION': 'Germinación',
      'CRECIMIENTO_VEGETATIVO': 'Crecimiento Vegetativo',
      'PRE_FLORA': 'Pre-Flora',
      'FLORA': 'Flora',
      'COSECHA': 'Cosecha',
      'SECADO': 'Secado',
      'CURADO': 'Curado',
    };
    return labels[etapa] || etapa;
  };

  const getEstadoStyle = (estado: string): React.CSSProperties => {
    const styles: Record<string, React.CSSProperties> = {
      'PENDIENTE': { background: 'rgba(251,191,36,0.15)', color: '#f59e0b' },
      'EN_PROCESO': { background: 'rgba(59,130,246,0.15)', color: '#3b82f6' },
      'COMPLETADO': { background: 'rgba(34,197,94,0.15)', color: '#22c55e' }
    };
    return styles[estado] || { background: 'rgba(148,163,184,0.15)', color: '#94a3b8' };
  };

  const getEstadoLabel = (estado: string): string => {
    const labels: Record<string, string> = {
      'PENDIENTE': 'Pendiente',
      'EN_PROCESO': 'En Proceso',
      'COMPLETADO': 'Completado'
    };
    return labels[estado] || estado;
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'COMPLETADO': return <FaCheckCircle color="#22c55e" size={14} />;
      case 'EN_PROCESO': return <FaSpinner className="fa-spin" color="#3b82f6" size={14} />;
      case 'PENDIENTE': return <FaClock color="#f59e0b" size={14} />;
      default: return <FaCheckCircle color="#94a3b8" size={14} />;
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '30px' }}>
        <FaSpinner className="fa-spin" style={{ color: '#3b82f6', fontSize: '24px' }} />
        <p style={{ color: '#94a3b8', marginTop: '12px' }}>Cargando etapas...</p>
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
          <FaClipboardList /> Etapas de Trazabilidad ({etapas.length})
        </h4>
        <button
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
            color: '#fff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
            fontWeight: '600',
            transition: 'all 0.3s ease'
          }}
          onClick={onAddEtapa}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(139,92,246,0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <FaPlus size={12} /> Nueva Etapa
        </button>
      </div>

      {etapas.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '30px',
          color: '#94a3b8',
          border: '1px dashed rgba(255,255,255,0.08)',
          borderRadius: '12px'
        }}>
          <FaClipboardList size={32} style={{ opacity: 0.3, marginBottom: '12px' }} />
          <p>No hay etapas registradas para esta planta</p>
          <button
            style={{
              marginTop: '8px',
              padding: '6px 16px',
              borderRadius: '6px',
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'transparent',
              color: '#94a3b8',
              cursor: 'pointer',
              fontSize: '13px',
              transition: 'all 0.2s ease'
            }}
            onClick={onAddEtapa}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <FaPlus size={10} style={{ marginRight: '4px' }} /> Agregar primera etapa
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {etapas.map((etapa) => (
            <div
              key={etapa.id}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '12px',
                padding: '16px',
                transition: 'all 0.2s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
              }}
            >
              <div style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: '4px',
                background: getEstadoStyle(etapa.estado).color || '#94a3b8',
                borderRadius: '4px 0 0 4px'
              }} />

              <div style={{ paddingLeft: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '20px' }}>
                        {getEtapaIcon(etapa.etapa)}
                      </span>
                      <h5 style={{ margin: 0, fontSize: '15px', fontWeight: '600', color: '#e2e8f0' }}>
                        {getEtapaLabel(etapa.etapa)}
                      </h5>
                      <span style={{
                        padding: '2px 10px',
                        borderRadius: '999px',
                        fontSize: '10px',
                        fontWeight: '600',
                        ...getEstadoStyle(etapa.estado)
                      }}>
                        {getEstadoIcon(etapa.estado)} {getEstadoLabel(etapa.estado)}
                      </span>
                    </div>

                    {etapa.observaciones && (
                      <p style={{
                        margin: '8px 0 0',
                        fontSize: '13px',
                        color: '#94a3b8',
                        lineHeight: '1.5'
                      }}>
                        {etapa.observaciones}
                      </p>
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
                        <FaCalendarAlt size={10} /> Inicio: {new Date(etapa.fecha_inicio).toLocaleDateString('es-ES')}
                      </span>
                      {etapa.fecha_fin && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <FaCalendarAlt size={10} /> Fin: {new Date(etapa.fecha_fin).toLocaleDateString('es-ES')}
                        </span>
                      )}
                      {etapa.responsable_nombre && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <FaUser size={10} /> {etapa.responsable_nombre}
                        </span>
                      )}
                      {etapa.temperatura !== undefined && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <FaThermometerHalf size={10} /> {etapa.temperatura}°C
                        </span>
                      )}
                      {etapa.humedad !== undefined && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <FaTint size={10} /> {etapa.humedad}%
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#fbbf24',
                        cursor: 'pointer',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        opacity: 0.5,
                        transition: 'all 0.2s ease'
                      }}
                      onClick={() => onEditEtapa(etapa)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = '1';
                        e.currentTarget.style.background = 'rgba(251,191,36,0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = '0.5';
                        e.currentTarget.style.background = 'transparent';
                      }}
                      title="Editar etapa"
                    >
                      <FaEdit size={12} />
                    </button>
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
                      onClick={() => onDeleteEtapa(etapa.id)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = '1';
                        e.currentTarget.style.background = 'rgba(239,68,68,0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = '0.5';
                        e.currentTarget.style.background = 'transparent';
                      }}
                      title="Eliminar etapa"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================
// COMPONENTE LISTA DE INFORMES
// ============================================

const InformesList = ({ 
  informes, 
  onAddInforme, 
  onDeleteInforme, 
  loading,
  onEditInforme
}: { 
  informes: PlantaInforme[]; 
  onAddInforme: () => void;
  onDeleteInforme: (id: string) => void;
  onEditInforme?: (informe: PlantaInforme) => void;
  loading?: boolean;
}) => {
  const getTipoIcon = (tipo: string) => {
    const icons: Record<string, any> = {
      'CRECIMIENTO': <FaLeaf />,
      'SALUD': <FaStethoscope />,
      'RIEGO': <FaTint />,
      'FERTILIZACION': <FaFlask />,
      'PODA': <FaCut />,
      'COSECHA': <FaCut style={{ transform: 'rotate(180deg)' }} />,
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
              fontSize: '13px',
              transition: 'all 0.2s ease'
            }}
            onClick={onAddInforme}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
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
                    <span style={{ color: getTipoColor(informe.tipo), fontSize: '14px' }}>
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
                            {typeof value === 'number' ? value.toFixed(2) : String(value)}
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

                <div style={{ display: 'flex', gap: '4px' }}>
                  {onEditInforme && (
                    <button
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#fbbf24',
                        cursor: 'pointer',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        opacity: 0.5,
                        transition: 'all 0.2s ease'
                      }}
                      onClick={() => onEditInforme(informe)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = '1';
                        e.currentTarget.style.background = 'rgba(251,191,36,0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = '0.5';
                        e.currentTarget.style.background = 'transparent';
                      }}
                      title="Editar informe"
                    >
                      <FaEdit size={12} />
                    </button>
                  )}
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================
// FORMULARIO DE ETAPA
// ============================================

const EtapaForm = ({ onSave, onCancel, initialData, loading }: any) => {
  const [formData, setFormData] = useState({
    etapa: initialData?.etapa || 'SIEMBRA',
    estado: initialData?.estado || 'PENDIENTE',
    fecha_inicio: initialData?.fecha_inicio || new Date().toISOString().split('T')[0],
    fecha_fin: initialData?.fecha_fin || '',
    responsable_nombre: initialData?.responsable_nombre || '',
    observaciones: initialData?.observaciones || '',
    temperatura: initialData?.temperatura || '',
    humedad: initialData?.humedad || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      temperatura: formData.temperatura ? parseFloat(formData.temperatura) : undefined,
      humedad: formData.humedad ? parseFloat(formData.humedad) : undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
        <div>
          <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '4px' }}>
            Etapa *
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
              cursor: 'pointer',
              boxSizing: 'border-box'
            }}
            value={formData.etapa}
            onChange={(e) => setFormData({ ...formData, etapa: e.target.value })}
            required
          >
            <option value="SIEMBRA">🌱 Siembra</option>
            <option value="GERMINACION">🌿 Germinación</option>
            <option value="CRECIMIENTO_VEGETATIVO">🌳 Crecimiento Vegetativo</option>
            <option value="PRE_FLORA">🌸 Pre-Flora</option>
            <option value="FLORA">🌺 Flora</option>
            <option value="COSECHA">✂️ Cosecha</option>
            <option value="SECADO">🌾 Secado</option>
            <option value="CURADO">🏺 Curado</option>
          </select>
        </div>
        <div>
          <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '4px' }}>
            Estado *
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
              cursor: 'pointer',
              boxSizing: 'border-box'
            }}
            value={formData.estado}
            onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
            required
          >
            <option value="PENDIENTE">⏳ Pendiente</option>
            <option value="EN_PROCESO">🔄 En Proceso</option>
            <option value="COMPLETADO">✅ Completado</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
        <div>
          <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '4px' }}>
            Fecha de inicio *
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
              boxSizing: 'border-box'
            }}
            value={formData.fecha_inicio}
            onChange={(e) => setFormData({ ...formData, fecha_inicio: e.target.value })}
            required
          />
        </div>
        <div>
          <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '4px' }}>
            Fecha de fin (opcional)
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
              boxSizing: 'border-box'
            }}
            value={formData.fecha_fin}
            onChange={(e) => setFormData({ ...formData, fecha_fin: e.target.value })}
          />
        </div>
      </div>

      <div style={{ marginBottom: '12px' }}>
        <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '4px' }}>
          Responsable
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
            boxSizing: 'border-box'
          }}
          placeholder="Nombre del responsable"
          value={formData.responsable_nombre}
          onChange={(e) => setFormData({ ...formData, responsable_nombre: e.target.value })}
        />
      </div>

      <div style={{ marginBottom: '12px' }}>
        <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '4px' }}>
          Observaciones
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
            fontFamily: 'inherit',
            boxSizing: 'border-box'
          }}
          placeholder="Observaciones de la etapa..."
          value={formData.observaciones}
          onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
        <div>
          <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '4px' }}>
            Temperatura (°C)
          </label>
          <input
            type="number"
            step="0.1"
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.03)',
              color: '#fff',
              fontSize: '14px',
              outline: 'none',
              boxSizing: 'border-box'
            }}
            placeholder="Ej: 24.5"
            value={formData.temperatura}
            onChange={(e) => setFormData({ ...formData, temperatura: e.target.value })}
          />
        </div>
        <div>
          <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '4px' }}>
            Humedad (%)
          </label>
          <input
            type="number"
            step="0.1"
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.03)',
              color: '#fff',
              fontSize: '14px',
              outline: 'none',
              boxSizing: 'border-box'
            }}
            placeholder="Ej: 65"
            value={formData.humedad}
            onChange={(e) => setFormData({ ...formData, humedad: e.target.value })}
          />
        </div>
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
            background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
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
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(139,92,246,0.4)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          {loading ? <FaSpinner className="fa-spin" /> : <FaSave />}
          Guardar Etapa
        </button>
      </div>
    </form>
  );
};

// ============================================
// COMPONENTE PRINCIPAL TRAZABILIDAD
// ============================================

const Trazabilidad = () => {
  // ===== HOOKS =====
  const {
    plantas,
    loading,
    estadisticas,
    informes,
    etapas,
    fetchPlantas,
    createPlanta,
    updatePlanta,
    deletePlanta,
    fetchInformes,
    createInforme,
    updateInforme,
    deleteInforme,
    fetchEtapas,
    createEtapa,
    updateEtapa,
    deleteEtapa,
    getEtapasByPlanta,
    getProgresoEtapas,
    error,
    clearError,
  } = useProduction();

  // ===== ESTADOS LOCALES =====
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState('');
  const [filterEstado, setFilterEstado] = useState('');
  const [sortField, setSortField] = useState<keyof Planta>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'edit' | 'view' | 'delete' | 'addInforme' | 'editInforme' | 'addEtapa' | 'editEtapa'>('create');
  const [selectedPlanta, setSelectedPlanta] = useState<Planta | null>(null);
  const [loadingInformes, setLoadingInformes] = useState(false);
  const [loadingEtapas, setLoadingEtapas] = useState(false);
  const [editingInforme, setEditingInforme] = useState<PlantaInforme | null>(null);
  const [editingEtapa, setEditingEtapa] = useState<EtapaTrazabilidad | null>(null);

  // useRef para evitar cargas múltiples
  const isInitialLoadDone = useRef(false);
  const isDetailsLoading = useRef(false);

  const [formData, setFormData] = useState<{
    nombre: string;
    codigo_qr: string;
    tipo: 'INDICA' | 'SATIVA' | 'HIBRIDA';
    estado: 'ACTIVO' | 'FINALIZADO' | 'CANCELADO';
    lote: string;
    descripcion: string;
    banco_procedencia: string;
    fecha_germinacion: string;
    fecha_clonacion: string;
  }>({
    nombre: '',
    codigo_qr: '',
    tipo: 'INDICA',
    estado: 'ACTIVO',
    lote: '',
    descripcion: '',
    banco_procedencia: '',
    fecha_germinacion: '',
    fecha_clonacion: '',
  });

  // ============================================
  // EFECTOS
  // ============================================

  useEffect(() => {
    console.log('🔄 [Trazabilidad] Montando componente...');
    
    if (!isInitialLoadDone.current) {
      console.log('🔄 [Trazabilidad] Cargando datos iniciales...');
      isInitialLoadDone.current = true;
      fetchPlantas();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedPlanta && modalType === 'view' && !isDetailsLoading.current) {
      console.log(`🔄 [Trazabilidad] Cargando detalles de planta: ${selectedPlanta.id}`);
      isDetailsLoading.current = true;
      
      const loadDetails = async () => {
        try {
          await cargarInformes(selectedPlanta.id);
          await cargarEtapas(selectedPlanta.id);
        } catch (error) {
          console.error('Error cargando detalles:', error);
        } finally {
          isDetailsLoading.current = false;
        }
      };
      loadDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPlanta?.id, modalType]);

  // ============================================
  // FUNCIONES
  // ============================================

  const cargarInformes = async (plantaId: string) => {
    try {
      setLoadingInformes(true);
      await fetchInformes(plantaId);
    } catch (error) {
      console.error('Error cargando informes:', error);
    } finally {
      setLoadingInformes(false);
    }
  };

  const cargarEtapas = async (plantaId: string) => {
    try {
      setLoadingEtapas(true);
      await fetchEtapas(plantaId);
    } catch (error) {
      console.error('Error cargando etapas:', error);
    } finally {
      setLoadingEtapas(false);
    }
  };

  const openCreate = () => {
    setModalType('create');
    setFormData({
      nombre: '',
      codigo_qr: '',
      tipo: 'INDICA',
      estado: 'ACTIVO',
      lote: '',
      descripcion: '',
      banco_procedencia: '',
      fecha_germinacion: '',
      fecha_clonacion: '',
    });
    setSelectedPlanta(null);
    setIsModalOpen(true);
  };

  const openEdit = (planta: Planta) => {
    setModalType('edit');
    setSelectedPlanta(planta);
    setFormData({
      nombre: planta.nombre,
      codigo_qr: planta.codigo_qr,
      tipo: planta.tipo,
      estado: planta.estado,
      lote: planta.lote || '',
      descripcion: planta.descripcion || '',
      banco_procedencia: planta.banco_procedencia || '',
      fecha_germinacion: planta.fecha_germinacion || '',
      fecha_clonacion: planta.fecha_clonacion || '',
    });
    setIsModalOpen(true);
  };

  const openView = (planta: Planta) => {
    setModalType('view');
    setSelectedPlanta(planta);
    setIsModalOpen(true);
  };

  const openDelete = (planta: Planta) => {
    setModalType('delete');
    setSelectedPlanta(planta);
    setIsModalOpen(true);
  };

  const openAddInforme = () => {
    setModalType('addInforme');
    setEditingInforme(null);
    setIsModalOpen(true);
  };

  const openEditInforme = (informe: PlantaInforme) => {
    setModalType('editInforme');
    setEditingInforme(informe);
    setIsModalOpen(true);
  };

  const openAddEtapa = () => {
    setModalType('addEtapa');
    setEditingEtapa(null);
    setIsModalOpen(true);
  };

  const openEditEtapa = (etapa: EtapaTrazabilidad) => {
    setModalType('editEtapa');
    setEditingEtapa(etapa);
    setIsModalOpen(true);
  };

const handleSave = async () => {
  try {
    // ✅ Generar código QR automáticamente para nuevas plantas
    const codigo_qr = `PLT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    
    const data = {
      nombre: formData.nombre,
      codigo_qr: modalType === 'create' ? codigo_qr : formData.codigo_qr, // Solo generar en creación
      tipo: formData.tipo,
      lote: formData.lote || undefined,
      descripcion: formData.descripcion || undefined,
      banco_procedencia: formData.banco_procedencia || undefined,
      fecha_germinacion: formData.fecha_germinacion || undefined,
      fecha_clonacion: formData.fecha_clonacion || undefined,
    };

    console.log('📤 Enviando datos:', data);

    if (modalType === 'create') {
      await createPlanta(data);
    } else if (modalType === 'edit' && selectedPlanta) {
      // En edición, no enviamos codigo_qr para no cambiarlo
      const { codigo_qr, ...editData } = data;
      await updatePlanta(selectedPlanta.id, editData);
    }
    
    await fetchPlantas();
    setIsModalOpen(false);
    setSelectedPlanta(null);
  } catch (error) {
    console.error('Error guardando planta:', error);
    // Mostrar el error específico
    if (error.response?.data?.message) {
      toast.error(Array.isArray(error.response.data.message) 
        ? error.response.data.message.join(', ') 
        : error.response.data.message);
    } else {
      toast.error('Error al guardar la planta');
    }
  }
};

  const handleDelete = async () => {
    if (!selectedPlanta) return;
    try {
      await deletePlanta(selectedPlanta.id);
      await fetchPlantas();
      setIsModalOpen(false);
      setSelectedPlanta(null);
    } catch (error) {
      console.error('Error eliminando planta:', error);
    }
  };

  const handleSaveInforme = async (informeData: any) => {
    if (!selectedPlanta) return;
    try {
      if (editingInforme) {
        await updateInforme(selectedPlanta.id, editingInforme.id, informeData);
      } else {
        await createInforme(selectedPlanta.id, {
          titulo: informeData.titulo,
          descripcion: informeData.descripcion || '',
          tipo: informeData.tipo,
          fecha_informe: informeData.fecha_informe,
          imagen_url: informeData.imagen_url || '',
          datos_medicion: informeData.datos_medicion || {},
          recomendaciones: informeData.recomendaciones || '',
          estado: informeData.estado || 'BORRADOR',
        });
      }
      await fetchInformes(selectedPlanta.id);
      setIsModalOpen(false);
      setEditingInforme(null);
      setModalType('view');
    } catch (error) {
      console.error('Error guardando informe:', error);
    }
  };

  const handleDeleteInforme = async (informeId: string) => {
    if (!selectedPlanta) return;
    if (!confirm('¿Estás seguro de eliminar este informe?')) return;
    try {
      await deleteInforme(selectedPlanta.id, informeId);
      await fetchInformes(selectedPlanta.id);
    } catch (error) {
      console.error('Error eliminando informe:', error);
    }
  };

  const handleSaveEtapa = async (etapaData: any) => {
    if (!selectedPlanta) return;
    try {
      if (editingEtapa) {
        await updateEtapa(editingEtapa.id, etapaData);
      } else {
        await createEtapa({
          ...etapaData,
          planta_id: selectedPlanta.id,
        });
      }
      await fetchEtapas(selectedPlanta.id);
      setIsModalOpen(false);
      setEditingEtapa(null);
      setModalType('view');
    } catch (error) {
      console.error('Error guardando etapa:', error);
    }
  };

  const handleDeleteEtapa = async (etapaId: string) => {
    if (!selectedPlanta) return;
    if (!confirm('¿Estás seguro de eliminar esta etapa?')) return;
    try {
      await deleteEtapa(etapaId);
      await fetchEtapas(selectedPlanta.id);
    } catch (error) {
      console.error('Error eliminando etapa:', error);
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

  const clearFilters = () => {
    setSearchTerm('');
    setFilterTipo('');
    setFilterEstado('');
  };

  // ============================================
  // FILTRADO Y ORDENAMIENTO
  // ============================================

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

  const hasActiveFilters = searchTerm || filterTipo || filterEstado;

  // ============================================
  // UTILIDADES DE ESTILOS
  // ============================================

  const getTipoBadgeStyle = (tipo: string): React.CSSProperties => {
    const styles: Record<string, React.CSSProperties> = {
      'INDICA': { background: 'rgba(34,197,94,0.15)', color: '#22c55e' },
      'SATIVA': { background: 'rgba(251,191,36,0.15)', color: '#fbbf24' },
      'HIBRIDA': { background: 'rgba(59,130,246,0.15)', color: '#3b82f6' }
    };
    return styles[tipo] || { background: 'rgba(148,163,184,0.15)', color: '#94a3b8' };
  };

  const getEstadoBadgeStyle = (estado: string): React.CSSProperties => {
    const styles: Record<string, React.CSSProperties> = {
      'ACTIVO': { background: 'rgba(34,197,94,0.15)', color: '#22c55e' },
      'FINALIZADO': { background: 'rgba(59,130,246,0.15)', color: '#3b82f6' },
      'CANCELADO': { background: 'rgba(239,68,68,0.15)', color: '#ef4444' }
    };
    return styles[estado] || { background: 'rgba(148,163,184,0.15)', color: '#94a3b8' };
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
    if (sortField !== field) return <FaSort style={{ color: '#64748b', opacity: 0.5 }} size={12} />;
    return sortDirection === 'asc'
      ? <FaSortUp style={{ color: '#3b82f6' }} size={12} />
      : <FaSortDown style={{ color: '#3b82f6' }} size={12} />;
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div style={{
      padding: '30px',
      minHeight: 'calc(100vh - 120px)',
      background: 'linear-gradient(135deg, #0f172a, #1e293b)',
      color: '#fff'
    }}>
      {/* HEADER */}
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

      {/* ERROR */}
      {error && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 20px',
          marginBottom: '20px',
          borderRadius: '12px',
          background: 'rgba(239,68,68,0.15)',
          border: '1px solid rgba(239,68,68,0.3)',
          color: '#ef4444'
        }}>
          <span><FaExclamationTriangle style={{ marginRight: '10px' }} /> {error}</span>
          <button
            style={{
              background: 'none',
              border: 'none',
              color: '#ef4444',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '0 8px'
            }}
            onClick={clearError}
          >
            ×
          </button>
        </div>
      )}

      {/* ESTADÍSTICAS */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <StatCard
          title="Total Plantas"
          value={estadisticas?.total || 0}
          icon={<FaTag size={18} />}
        />
        <StatCard
          title="Activas"
          value={estadisticas?.activas || 0}
          icon={<FaCheckCircle size={18} />}
          color="rgba(34,197,94,0.1)"
          subtitle={`${estadisticas?.porTipo?.INDICA || 0} Indica, ${estadisticas?.porTipo?.SATIVA || 0} Sativa, ${estadisticas?.porTipo?.HIBRIDA || 0} Híbrida`}
        />
        <StatCard
          title="Finalizadas"
          value={estadisticas?.finalizadas || 0}
          icon={<FaCheckCircle size={18} />}
          color="rgba(59,130,246,0.1)"
        />
        <StatCard
          title="Canceladas"
          value={estadisticas?.canceladas || 0}
          icon={<FaExclamationTriangle size={18} />}
          color="rgba(239,68,68,0.1)"
        />
      </div>

      {/* FILTROS */}
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

      {/* TABLA */}
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
                          ...getTipoBadgeStyle(planta.tipo)
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
                          ...getEstadoBadgeStyle(planta.estado)
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

      {/* ============================================ */}
      {/* ===== MODAL ===== */}
      {/* ============================================ */}
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
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setIsModalOpen(false);
            setSelectedPlanta(null);
            setEditingInforme(null);
            setEditingEtapa(null);
          }
        }}>
          <div style={{
            width: '100%',
            maxWidth: modalType === 'view' ? '800px' : '550px',
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
                {modalType === 'editInforme' && '✏️ Editar Informe'}
                {modalType === 'addEtapa' && '📋 Nueva Etapa'}
                {modalType === 'editEtapa' && '✏️ Editar Etapa'}
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
                  setEditingInforme(null);
                  setEditingEtapa(null);
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

            {/* ===== MODAL VIEW ===== */}
            {modalType === 'view' && selectedPlanta && (
              <div>
                {/* DEPURACIÓN - Ver qué datos llegan */}
                {console.log('🔍 Detalle de planta:', selectedPlanta)}
                {console.log('🔍 Informes:', informes)}
                {console.log('🔍 Etapas:', getEtapasByPlanta(selectedPlanta.id))}
                
                <h3 style={{ color: '#fff', marginBottom: '16px' }}>
                  🌱 {selectedPlanta.nombre}
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  <div>
                    <p style={{ color: '#94a3b8', fontSize: '12px', margin: 0 }}>Código QR</p>
                    <p style={{ color: '#fff', fontSize: '14px', fontFamily: 'monospace' }}>
                      {selectedPlanta.codigo_qr}
                    </p>
                  </div>
                  <div>
                    <p style={{ color: '#94a3b8', fontSize: '12px', margin: 0 }}>Tipo</p>
                    <p style={{ color: '#fff', fontSize: '14px' }}>
                      {getTipoLabel(selectedPlanta.tipo)}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  <div>
                    <p style={{ color: '#94a3b8', fontSize: '12px', margin: 0 }}>Estado</p>
                    <p style={{ color: '#fff', fontSize: '14px' }}>
                      {getEstadoLabel(selectedPlanta.estado)}
                    </p>
                  </div>
                  <div>
                    <p style={{ color: '#94a3b8', fontSize: '12px', margin: 0 }}>Fecha creación</p>
                    <p style={{ color: '#fff', fontSize: '14px' }}>
                      {new Date(selectedPlanta.created_at).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                </div>

                {selectedPlanta.descripcion && (
                  <div style={{ marginBottom: '16px' }}>
                    <p style={{ color: '#94a3b8', fontSize: '12px', margin: 0 }}>Descripción</p>
                    <p style={{ color: '#fff', fontSize: '14px' }}>
                      {selectedPlanta.descripcion}
                    </p>
                  </div>
                )}

                {/* ===== PROGRESO DE ETAPAS ===== */}
                {(() => {
                  const progreso = getProgresoEtapas(selectedPlanta.id);
                  return (
                    <div style={{ 
                      marginTop: '16px', 
                      padding: '16px', 
                      background: 'rgba(255,255,255,0.03)', 
                      borderRadius: '12px' 
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ color: '#94a3b8', fontSize: '13px' }}>
                          <FaClipboardList style={{ marginRight: '6px' }} />
                          Progreso de etapas
                        </span>
                        <span style={{ color: '#e2e8f0', fontSize: '14px', fontWeight: '600' }}>
                          {progreso.completadas}/{progreso.total}
                        </span>
                      </div>
                      <div style={{
                        width: '100%',
                        height: '8px',
                        background: 'rgba(255,255,255,0.08)',
                        borderRadius: '999px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${progreso.porcentaje}%`,
                          height: '100%',
                          background: `linear-gradient(90deg, #3b82f6, ${progreso.porcentaje > 75 ? '#22c55e' : progreso.porcentaje > 50 ? '#f59e0b' : '#ef4444'})`,
                          borderRadius: '999px',
                          transition: 'width 0.5s ease'
                        }} />
                      </div>
                      <div style={{ textAlign: 'center', marginTop: '4px', color: '#94a3b8', fontSize: '12px' }}>
                        {progreso.porcentaje}% completado
                      </div>
                    </div>
                  );
                })()}

                {/* ===== ETAPAS ===== */}
                <div style={{ 
                  marginTop: '20px', 
                  borderTop: '1px solid rgba(255,255,255,0.06)', 
                  paddingTop: '16px' 
                }}>
                  <h4 style={{ color: '#e2e8f0', margin: '0 0 12px 0' }}>
                    📋 Etapas ({getEtapasByPlanta(selectedPlanta.id).length})
                  </h4>
                  
                  {getEtapasByPlanta(selectedPlanta.id).length === 0 ? (
                    <p style={{ color: '#94a3b8', fontSize: '14px' }}>
                      No hay etapas registradas
                    </p>
                  ) : (
                    getEtapasByPlanta(selectedPlanta.id).map((etapa) => (
                      <div key={etapa.id} style={{
                        background: 'rgba(255,255,255,0.03)',
                        padding: '12px',
                        borderRadius: '8px',
                        marginBottom: '8px',
                        border: '1px solid rgba(255,255,255,0.06)'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#fff', fontWeight: '500' }}>
                            {etapa.etapa}
                          </span>
                          <span style={{
                            padding: '2px 10px',
                            borderRadius: '999px',
                            fontSize: '11px',
                            background: etapa.estado === 'COMPLETADO' ? 'rgba(34,197,94,0.15)' : 'rgba(59,130,246,0.15)',
                            color: etapa.estado === 'COMPLETADO' ? '#22c55e' : '#3b82f6'
                          }}>
                            {etapa.estado}
                          </span>
                        </div>
                        {etapa.observaciones && (
                          <p style={{ color: '#94a3b8', fontSize: '13px', margin: '4px 0 0' }}>
                            {etapa.observaciones}
                          </p>
                        )}
                      </div>
                    ))
                  )}
                  
                  <button
                    style={{
                      marginTop: '8px',
                      padding: '6px 16px',
                      borderRadius: '6px',
                      border: '1px solid rgba(255,255,255,0.08)',
                      background: 'transparent',
                      color: '#94a3b8',
                      cursor: 'pointer',
                      fontSize: '13px',
                      transition: 'all 0.2s ease'
                    }}
                    onClick={openAddEtapa}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <FaPlus size={10} style={{ marginRight: '4px' }} /> Agregar etapa
                  </button>
                </div>

                {/* ===== INFORMES ===== */}
                <div style={{ 
                  marginTop: '20px', 
                  borderTop: '1px solid rgba(255,255,255,0.06)', 
                  paddingTop: '16px' 
                }}>
                  <h4 style={{ color: '#e2e8f0', margin: '0 0 12px 0' }}>
                    📋 Informes ({informes.length})
                  </h4>
                  
                  {informes.length === 0 ? (
                    <p style={{ color: '#94a3b8', fontSize: '14px' }}>
                      No hay informes registrados
                    </p>
                  ) : (
                    informes.map((informe) => (
                      <div key={informe.id} style={{
                        background: 'rgba(255,255,255,0.03)',
                        padding: '12px',
                        borderRadius: '8px',
                        marginBottom: '8px',
                        border: '1px solid rgba(255,255,255,0.06)'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#fff', fontWeight: '500' }}>
                            {informe.titulo}
                          </span>
                          <span style={{
                            padding: '2px 10px',
                            borderRadius: '999px',
                            fontSize: '11px',
                            background: 'rgba(59,130,246,0.15)',
                            color: '#3b82f6'
                          }}>
                            {informe.tipo}
                          </span>
                        </div>
                        {informe.descripcion && (
                          <p style={{ color: '#94a3b8', fontSize: '13px', margin: '4px 0 0' }}>
                            {informe.descripcion}
                          </p>
                        )}
                      </div>
                    ))
                  )}
                  
                  <button
                    style={{
                      marginTop: '8px',
                      padding: '6px 16px',
                      borderRadius: '6px',
                      border: '1px solid rgba(255,255,255,0.08)',
                      background: 'transparent',
                      color: '#94a3b8',
                      cursor: 'pointer',
                      fontSize: '13px',
                      transition: 'all 0.2s ease'
                    }}
                    onClick={openAddInforme}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <FaPlus size={10} style={{ marginRight: '4px' }} /> Agregar informe
                  </button>
                </div>

                {/* ===== BOTÓN CERRAR ===== */}
                <button
                  style={{
                    width: '100%',
                    marginTop: '20px',
                    padding: '12px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                    color: '#fff',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                  onClick={() => {
                    setIsModalOpen(false);
                    setSelectedPlanta(null);
                    setInformes([]);
                    setEtapas([]);
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(59,130,246,0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <FaCheckCircle size={16} /> Cerrar
                </button>
              </div>
            )}

            {/* ===== MODAL DELETE ===== */}
            {modalType === 'delete' && selectedPlanta && (
              <div>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <FaExclamationTriangle size={48} color="#ef4444" />
                  <p style={{ fontSize: '18px', marginTop: '12px' }}>
                    ¿Estás seguro de eliminar la planta <strong>"{selectedPlanta.nombre}"</strong>?
                  </p>
                  <p style={{ color: '#94a3b8', fontSize: '14px' }}>
                    Esta acción eliminará todos los datos asociados a esta planta y no se puede deshacer.
                  </p>
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

            {/* ===== MODAL CREATE/EDIT PLANTA ===== */}
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
                    transition: 'all 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Nombre de la planta *"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
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
                    transition: 'all 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Banco de procedencia (opcional)"
                  value={formData.banco_procedencia}
                  onChange={(e) => setFormData({ ...formData, banco_procedencia: e.target.value })}
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
                    transition: 'all 0.2s ease',
                    boxSizing: 'border-box'
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
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                  <input
                    type="date"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      border: '1px solid rgba(255,255,255,0.08)',
                      background: 'rgba(255,255,255,0.03)',
                      color: '#fff',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'all 0.2s ease',
                      boxSizing: 'border-box'
                    }}
                    placeholder="Fecha de germinación"
                    value={formData.fecha_germinacion}
                    onChange={(e) => setFormData({ ...formData, fecha_germinacion: e.target.value })}
                  />
                  <input
                    type="date"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      border: '1px solid rgba(255,255,255,0.08)',
                      background: 'rgba(255,255,255,0.03)',
                      color: '#fff',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'all 0.2s ease',
                      boxSizing: 'border-box'
                    }}
                    placeholder="Fecha de clonación"
                    value={formData.fecha_clonacion}
                    onChange={(e) => setFormData({ ...formData, fecha_clonacion: e.target.value })}
                  />
                </div>
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
                    transition: 'all 0.2s ease',
                    boxSizing: 'border-box'
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
                      transition: 'all 0.2s ease',
                      boxSizing: 'border-box'
                    }}
                    value={formData.tipo}
                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value as 'INDICA' | 'SATIVA' | 'HIBRIDA' })}
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
                      transition: 'all 0.2s ease',
                      boxSizing: 'border-box'
                    }}
                    value={formData.estado}
                    onChange={(e) => setFormData({ ...formData, estado: e.target.value as 'ACTIVO' | 'FINALIZADO' | 'CANCELADO' })}
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
                    disabled={loading}
                    onMouseEnter={(e) => {
                      if (!loading) {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(59,130,246,0.4)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {loading ? <FaSpinner className="fa-spin" /> : <FaSave />}
                    Guardar
                  </button>
                </div>
              </div>
            )}

            {/* ===== MODAL INFORME ===== */}
            {(modalType === 'addInforme' || modalType === 'editInforme') && (
              <div>
                <p style={{ color: '#94a3b8' }}>
                  {modalType === 'addInforme' ? '📝 Nuevo Informe' : '✏️ Editar Informe'}
                </p>
                <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                  <button
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '10px',
                      border: '1px solid rgba(255,255,255,0.08)',
                      background: 'transparent',
                      color: '#94a3b8',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingInforme(null);
                      if (selectedPlanta) {
                        setModalType('view');
                      }
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
                      cursor: 'pointer'
                    }}
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingInforme(null);
                      if (selectedPlanta) {
                        setModalType('view');
                      }
                    }}
                  >
                    <FaSave /> Guardar
                  </button>
                </div>
              </div>
            )}

            {/* ===== MODAL ETAPA ===== */}
            {(modalType === 'addEtapa' || modalType === 'editEtapa') && (
              <EtapaForm
                onSave={handleSaveEtapa}
                onCancel={() => {
                  setIsModalOpen(false);
                  setEditingEtapa(null);
                  if (selectedPlanta) {
                    setModalType('view');
                  }
                }}
                initialData={editingEtapa || undefined}
                loading={loadingEtapas}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Trazabilidad;