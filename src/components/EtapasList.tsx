// src/views/app/Produccion/components/EtapasList.tsx
import React from 'react';
import {
  FaCheckCircle,
  FaClock,
  FaSpinner,
  FaPlus,
  FaEdit,
  FaTrash,
  FaCalendarAlt,
  FaUser,
  FaThermometerHalf,
  FaTint,
  FaClipboardList,
  FaCircle,
} from 'react-icons/fa';
import type { EtapaTrazabilidad } from '../../../../types/produccion';

interface EtapasListProps {
  etapas: EtapaTrazabilidad[];
  loading: boolean;
  onAddEtapa: () => void;
  onEditEtapa: (etapa: EtapaTrazabilidad) => void;
  onDeleteEtapa: (id: string) => void;
}

const EtapasList: React.FC<EtapasListProps> = ({
  etapas,
  loading,
  onAddEtapa,
  onEditEtapa,
  onDeleteEtapa,
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
      default: return <FaCircle color="#94a3b8" size={14} />;
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
          {etapas.map((etapa, index) => (
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
              {/* Barra de progreso lateral */}
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
                      {index === 0 && (
                        <span style={{
                          padding: '2px 10px',
                          borderRadius: '999px',
                          fontSize: '10px',
                          fontWeight: '600',
                          background: 'rgba(139,92,246,0.15)',
                          color: '#8b5cf6'
                        }}>
                          ⭐ Actual
                        </span>
                      )}
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

export default EtapasList;