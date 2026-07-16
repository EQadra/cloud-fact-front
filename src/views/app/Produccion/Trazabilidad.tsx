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
  FaRegCopy,
  FaFilePdf,
} from 'react-icons/fa';
import { useProduction } from '../../../context/ProductionContext';
import type { Planta, PlantaInforme, EtapaTrazabilidad } from '../../../types/produccion';
import Swal from 'sweetalert2';
import { generateLotCode, isValidLotCode } from '../../../utils/qrGenerator';
import { InformeForm } from '../../../components/InformeForm';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
// COMPONENTE TABLA DE ETAPAS (con PDF)
// ============================================

const EtapasTable = ({ 
  etapas, 
  plantaNombre,
  plantaCodigo,
}: { 
  etapas: EtapaTrazabilidad[];
  plantaNombre: string;
  plantaCodigo: string;
}) => {
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

  const getEstadoLabel = (estado: string): string => {
    const labels: Record<string, string> = {
      'PENDIENTE': 'Pendiente',
      'EN_PROCESO': 'En Proceso',
      'COMPLETADO': 'Completado'
    };
    return labels[estado] || estado;
  };

  const getEstadoColor = (estado: string): string => {
    const colors: Record<string, string> = {
      'PENDIENTE': '#f59e0b',
      'EN_PROCESO': '#3b82f6',
      'COMPLETADO': '#22c55e'
    };
    return colors[estado] || '#94a3b8';
  };

  const generatePDF = () => {
    if (etapas.length === 0) {
      Swal.fire({
        icon: 'info',
        title: 'Sin etapas',
        text: 'No hay etapas para generar el PDF',
        confirmButtonColor: '#3498db'
      });
      return;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFontSize(18);
    doc.setTextColor(30, 58, 138);
    doc.text('Reporte de Trazabilidad - Etapas', pageWidth / 2, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.setTextColor(100, 116, 139);
    doc.text(`Planta: ${plantaNombre}`, 14, 35);
    doc.text(`Código QR: ${plantaCodigo}`, 14, 43);
    doc.text(`Fecha de generación: ${new Date().toLocaleDateString('es-ES')}`, 14, 51);

    const tableData = etapas.map((etapa) => [
      getEtapaLabel(etapa.etapa),
      getEstadoLabel(etapa.estado),
      new Date(etapa.fecha_inicio).toLocaleDateString('es-ES'),
      etapa.fecha_fin ? new Date(etapa.fecha_fin).toLocaleDateString('es-ES') : '-',
      etapa.temperatura !== undefined ? `${etapa.temperatura}°C` : '-',
      etapa.humedad !== undefined ? `${etapa.humedad}%` : '-',
      etapa.observaciones || '-'
    ]);

    autoTable(doc, {
      head: [['Etapa', 'Estado', 'Fecha Inicio', 'Fecha Fin', 'Temperatura', 'Humedad', 'Observaciones']],
      body: tableData,
      startY: 58,
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [59, 130, 246], textColor: [255, 255, 255], fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [240, 244, 248] },
    });

    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Página ${i} de ${pageCount} - Sistema de Trazabilidad`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );
    }

    doc.save(`trazabilidad_${plantaNombre.replace(/\s/g, '_')}.pdf`);
  };

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
            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
            color: '#fff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            opacity: etapas.length === 0 ? 0.5 : 1
          }}
          onClick={generatePDF}
          disabled={etapas.length === 0}
          onMouseEnter={(e) => {
            if (etapas.length > 0) {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(239,68,68,0.3)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <FaFilePdf size={14} /> PDF
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
          <p>No hay etapas registradas</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '13px',
            minWidth: '700px'
          }}>
            <thead>
              <tr style={{
                background: 'rgba(255,255,255,0.05)',
                borderBottom: '2px solid rgba(255,255,255,0.1)'
              }}>
                <th style={{ padding: '10px 12px', textAlign: 'left', color: '#94a3b8', fontWeight: '600' }}>Etapa</th>
                <th style={{ padding: '10px 12px', textAlign: 'left', color: '#94a3b8', fontWeight: '600' }}>Estado</th>
                <th style={{ padding: '10px 12px', textAlign: 'left', color: '#94a3b8', fontWeight: '600' }}>Fecha Inicio</th>
                <th style={{ padding: '10px 12px', textAlign: 'left', color: '#94a3b8', fontWeight: '600' }}>Fecha Fin</th>
                <th style={{ padding: '10px 12px', textAlign: 'left', color: '#94a3b8', fontWeight: '600' }}>Temperatura</th>
                <th style={{ padding: '10px 12px', textAlign: 'left', color: '#94a3b8', fontWeight: '600' }}>Humedad</th>
                <th style={{ padding: '10px 12px', textAlign: 'left', color: '#94a3b8', fontWeight: '600' }}>Observaciones</th>
              </tr>
            </thead>
            <tbody>
              {etapas.map((etapa, index) => (
                <tr
                  key={etapa.id}
                  style={{
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    background: index % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                    transition: 'background 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = index % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent';
                  }}
                >
                  <td style={{ padding: '10px 12px', color: '#e2e8f0' }}>
                    {getEtapaLabel(etapa.etapa)}
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <span style={{
                      padding: '2px 10px',
                      borderRadius: '999px',
                      fontSize: '11px',
                      fontWeight: '600',
                      background: `${getEstadoColor(etapa.estado)}20`,
                      color: getEstadoColor(etapa.estado)
                    }}>
                      {getEstadoLabel(etapa.estado)}
                    </span>
                  </td>
                  <td style={{ padding: '10px 12px', color: '#94a3b8' }}>
                    {new Date(etapa.fecha_inicio).toLocaleDateString('es-ES')}
                  </td>
                  <td style={{ padding: '10px 12px', color: '#94a3b8' }}>
                    {etapa.fecha_fin ? new Date(etapa.fecha_fin).toLocaleDateString('es-ES') : '-'}
                  </td>
                  <td style={{ padding: '10px 12px', color: '#94a3b8' }}>
                    {etapa.temperatura !== undefined ? `${etapa.temperatura}°C` : '-'}
                  </td>
                  <td style={{ padding: '10px 12px', color: '#94a3b8' }}>
                    {etapa.humedad !== undefined ? `${etapa.humedad}%` : '-'}
                  </td>
                  <td style={{ padding: '10px 12px', color: '#94a3b8', maxWidth: '150px', wordBreak: 'break-word' }}>
                    {etapa.observaciones || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// ============================================
// COMPONENTE TABLA DE INFORMES (con PDF y acciones)
// ============================================

const InformesTable = ({
  informes,
  plantaNombre,
  plantaCodigo,
  onEditInforme,
  onDeleteInforme,
}: {
  informes: PlantaInforme[];
  plantaNombre: string;
  plantaCodigo: string;
  onEditInforme: (informe: PlantaInforme) => void;
  onDeleteInforme: (id: string) => void;
}) => {
  const getTipoLabel = (tipo: string) => {
    const labels: Record<string, string> = {
      'CRECIMIENTO': 'Crecimiento',
      'SALUD': 'Salud',
      'RIEGO': 'Riego',
      'FERTILIZACION': 'Fertilización',
      'PODA': 'Poda',
      'COSECHA': 'Cosecha',
      'CONTROL_PLAGAS': 'Control Plagas',
      'GENERAL': 'General'
    };
    return labels[tipo] || tipo;
  };

  const getTipoColor = (tipo: string): string => {
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

  const generatePDF = () => {
    if (informes.length === 0) {
      Swal.fire({
        icon: 'info',
        title: 'Sin informes',
        text: 'No hay informes para generar el PDF',
        confirmButtonColor: '#3498db'
      });
      return;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFontSize(18);
    doc.setTextColor(30, 58, 138);
    doc.text('Reporte de Informes de Seguimiento', pageWidth / 2, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.setTextColor(100, 116, 139);
    doc.text(`Planta: ${plantaNombre}`, 14, 35);
    doc.text(`Código QR: ${plantaCodigo}`, 14, 43);
    doc.text(`Fecha de generación: ${new Date().toLocaleDateString('es-ES')}`, 14, 51);

    const tableData = informes.map((informe) => [
      informe.titulo,
      getTipoLabel(informe.tipo),
      getEstadoLabel(informe.estado),
      new Date(informe.fecha_informe).toLocaleDateString('es-ES'),
      informe.autor || '-'
    ]);

    autoTable(doc, {
      head: [['Título', 'Tipo', 'Estado', 'Fecha', 'Autor']],
      body: tableData,
      startY: 58,
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [59, 130, 246], textColor: [255, 255, 255], fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [240, 244, 248] },
    });

    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Página ${i} de ${pageCount} - Sistema de Trazabilidad`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );
    }

    doc.save(`informes_${plantaNombre.replace(/\s/g, '_')}.pdf`);
  };

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
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              opacity: informes.length === 0 ? 0.5 : 1
            }}
            onClick={generatePDF}
            disabled={informes.length === 0}
            onMouseEnter={(e) => {
              if (informes.length > 0) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(239,68,68,0.3)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <FaFilePdf size={14} /> PDF
          </button>
        </div>
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
          <p>No hay informes registrados</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '13px',
            minWidth: '600px'
          }}>
            <thead>
              <tr style={{
                background: 'rgba(255,255,255,0.05)',
                borderBottom: '2px solid rgba(255,255,255,0.1)'
              }}>
                <th style={{ padding: '10px 12px', textAlign: 'left', color: '#94a3b8', fontWeight: '600' }}>Título</th>
                <th style={{ padding: '10px 12px', textAlign: 'left', color: '#94a3b8', fontWeight: '600' }}>Tipo</th>
                <th style={{ padding: '10px 12px', textAlign: 'left', color: '#94a3b8', fontWeight: '600' }}>Estado</th>
                <th style={{ padding: '10px 12px', textAlign: 'left', color: '#94a3b8', fontWeight: '600' }}>Fecha</th>
                <th style={{ padding: '10px 12px', textAlign: 'left', color: '#94a3b8', fontWeight: '600' }}>Autor</th>
                <th style={{ padding: '10px 12px', textAlign: 'center', color: '#94a3b8', fontWeight: '600', width: '80px' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {informes.map((informe, index) => (
                <tr
                  key={informe.id}
                  style={{
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    background: index % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                    transition: 'background 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = index % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent';
                  }}
                >
                  <td style={{ padding: '10px 12px', color: '#e2e8f0' }}>
                    {informe.titulo}
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <span style={{
                      padding: '2px 10px',
                      borderRadius: '999px',
                      fontSize: '11px',
                      fontWeight: '600',
                      background: `${getTipoColor(informe.tipo)}20`,
                      color: getTipoColor(informe.tipo)
                    }}>
                      {getTipoLabel(informe.tipo)}
                    </span>
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <span style={{
                      padding: '2px 10px',
                      borderRadius: '999px',
                      fontSize: '11px',
                      fontWeight: '600',
                      background: `${getEstadoColor(informe.estado)}20`,
                      color: getEstadoColor(informe.estado)
                    }}>
                      {getEstadoLabel(informe.estado)}
                    </span>
                  </td>
                  <td style={{ padding: '10px 12px', color: '#94a3b8' }}>
                    {new Date(informe.fecha_informe).toLocaleDateString('es-ES')}
                  </td>
                  <td style={{ padding: '10px 12px', color: '#94a3b8' }}>
                    {informe.autor || '-'}
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                      <button
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#fbbf24',
                          cursor: 'pointer',
                          padding: '4px 6px',
                          borderRadius: '4px',
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
                        title="Editar"
                      >
                        <FaEdit size={12} />
                      </button>
                      <button
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#ef4444',
                          cursor: 'pointer',
                          padding: '4px 6px',
                          borderRadius: '4px',
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
                        title="Eliminar"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
    error,
    clearError,
    generarCodigoQR,
    generarCodigoQRConPrefijo,
    validarCodigoQR,
    regenerarCodigoQR,
    validarCodigoQRUnico,
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
    codigo_qr: generateLotCode(),
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
    if (!isInitialLoadDone.current) {
      isInitialLoadDone.current = true;
      fetchPlantas();
    }
  }, [fetchPlantas]);

  useEffect(() => {
    if (selectedPlanta && modalType === 'view' && !isDetailsLoading.current) {
      isDetailsLoading.current = true;
      const loadDetails = async () => {
        try {
          setLoadingInformes(true);
          await fetchInformes(selectedPlanta.id);
          setLoadingInformes(false);
          setLoadingEtapas(true);
          await fetchEtapas(selectedPlanta.id);
          setLoadingEtapas(false);
        } catch (error) {
          console.error('Error cargando detalles:', error);
        } finally {
          isDetailsLoading.current = false;
        }
      };
      loadDetails();
    }
  }, [selectedPlanta?.id, modalType, fetchInformes, fetchEtapas]);

  // ============================================
  // FUNCIONES DEL MODAL (CRUD)
  // ============================================

  const generarNuevoQR = () => {
    const nuevoQR = generarCodigoQR();
    setFormData(prev => ({ ...prev, codigo_qr: nuevoQR }));
    Swal.fire({
      icon: 'success',
      title: 'Código QR generado',
      text: `Nuevo código: ${nuevoQR}`,
      timer: 2000,
      showConfirmButton: false
    });
  };

  const copiarQR = (codigo: string) => {
    navigator.clipboard.writeText(codigo);
    Swal.fire({
      icon: 'success',
      title: '¡Copiado!',
      text: 'Código QR copiado al portapapeles',
      timer: 1500,
      showConfirmButton: false
    });
  };

  const openCreate = () => {
    setModalType('create');
    setFormData({
      nombre: '',
      codigo_qr: generarCodigoQR(),
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
      if (!validarCodigoQR(formData.codigo_qr)) {
        const result = await Swal.fire({
          icon: 'warning',
          title: 'Código QR no válido',
          text: 'El formato del código QR no es estándar. ¿Deseas continuar?',
          showCancelButton: true,
          confirmButtonColor: '#3498db',
          cancelButtonColor: '#dc3545',
          confirmButtonText: 'Sí, continuar',
          cancelButtonText: 'Cancelar'
        });
        if (!result.isConfirmed) return;
      }

      if (modalType === 'create') {
        const esUnico = await validarCodigoQRUnico(formData.codigo_qr);
        if (!esUnico) {
          await Swal.fire({
            icon: 'error',
            title: 'Código QR duplicado',
            text: 'Este código QR ya está en uso. Se generará uno nuevo automáticamente.',
            confirmButtonColor: '#dc3545'
          });
          setFormData(prev => ({ ...prev, codigo_qr: generarCodigoQR() }));
          return;
        }
      }
      
      const data = {
        nombre: formData.nombre,
        codigo_qr: formData.codigo_qr,
        tipo: formData.tipo,
        lote: formData.lote || undefined,
        descripcion: formData.descripcion || undefined,
        banco_procedencia: formData.banco_procedencia || undefined,
        fecha_germinacion: formData.fecha_germinacion || undefined,
        fecha_clonacion: formData.fecha_clonacion || undefined,
      };

      if (modalType === 'create') {
        await createPlanta(data);
        await Swal.fire({
          icon: 'success',
          title: '¡Creada!',
          text: 'La planta se creó correctamente',
          timer: 2000,
          showConfirmButton: false
        });
      } else if (modalType === 'edit' && selectedPlanta) {
        await updatePlanta(selectedPlanta.id, data);
        await Swal.fire({
          icon: 'success',
          title: '¡Actualizada!',
          text: 'La planta se actualizó correctamente',
          timer: 2000,
          showConfirmButton: false
        });
      }
      
      await fetchPlantas();
      setIsModalOpen(false);
      setSelectedPlanta(null);
    } catch (error: any) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Error al guardar la planta',
        confirmButtonColor: '#dc3545'
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedPlanta) return;
    const result = await Swal.fire({
      title: '¿Eliminar planta?',
      html: `¿Estás seguro de eliminar <strong>"${selectedPlanta.nombre}"</strong>?<br>Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (result.isConfirmed) {
      await deletePlanta(selectedPlanta.id);
      await fetchPlantas();
      setIsModalOpen(false);
      setSelectedPlanta(null);
      await Swal.fire({
        icon: 'success',
        title: '¡Eliminada!',
        text: 'La planta se eliminó correctamente',
        timer: 2000,
        showConfirmButton: false
      });
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
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al guardar el informe',
        confirmButtonColor: '#dc3545'
      });
    }
  };

  const handleDeleteInforme = async (informeId: string) => {
    if (!selectedPlanta) return;
    const result = await Swal.fire({
      title: '¿Eliminar informe?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (!result.isConfirmed) return;
    await deleteInforme(selectedPlanta.id, informeId);
    await fetchInformes(selectedPlanta.id);
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
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al guardar la etapa',
        confirmButtonColor: '#dc3545'
      });
    }
  };

  const handleDeleteEtapa = async (etapaId: string) => {
    if (!selectedPlanta) return;
    const result = await Swal.fire({
      title: '¿Eliminar etapa?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (!result.isConfirmed) return;
    await deleteEtapa(etapaId);
    await fetchEtapas(selectedPlanta.id);
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
  // ESTILOS
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
          <h1 style={{ margin: 0, fontSize: '32px', fontWeight: '700' }}>🌱 Trazabilidad de Plantas</h1>
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
        <StatCard title="Total Plantas" value={estadisticas?.total || 0} icon={<FaTag size={18} />} />
        <StatCard
          title="Activas"
          value={estadisticas?.activas || 0}
          icon={<FaCheckCircle size={18} />}
          color="rgba(34,197,94,0.1)"
          subtitle={`${estadisticas?.porTipo?.INDICA || 0} Indica, ${estadisticas?.porTipo?.SATIVA || 0} Sativa, ${estadisticas?.porTipo?.HIBRIDA || 0} Híbrida`}
        />
        <StatCard title="Finalizadas" value={estadisticas?.finalizadas || 0} icon={<FaCheckCircle size={18} />} color="rgba(59,130,246,0.1)" />
        <StatCard title="Canceladas" value={estadisticas?.canceladas || 0} icon={<FaExclamationTriangle size={18} />} color="rgba(239,68,68,0.1)" />
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

      {/* TABLA DE PLANTAS */}
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
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <th style={{ textAlign: 'left', padding: '18px 16px', color: '#94a3b8', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', width: '50px' }}>#</th>
                  <th style={{ textAlign: 'left', padding: '18px 16px', color: '#94a3b8', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', cursor: 'pointer', minWidth: '120px' }} onClick={() => handleSort('codigo_qr')}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>Código QR {getSortIcon('codigo_qr')}</div>
                  </th>
                  <th style={{ textAlign: 'left', padding: '18px 16px', color: '#94a3b8', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', cursor: 'pointer', minWidth: '150px' }} onClick={() => handleSort('nombre')}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>Nombre {getSortIcon('nombre')}</div>
                  </th>
                  <th style={{ textAlign: 'left', padding: '18px 16px', color: '#94a3b8', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', cursor: 'pointer', minWidth: '100px' }} onClick={() => handleSort('tipo')}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>Tipo {getSortIcon('tipo')}</div>
                  </th>
                  <th style={{ textAlign: 'left', padding: '18px 16px', color: '#94a3b8', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', cursor: 'pointer', minWidth: '110px' }} onClick={() => handleSort('created_at')}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>Fecha {getSortIcon('created_at')}</div>
                  </th>
                  <th style={{ textAlign: 'left', padding: '18px 16px', color: '#94a3b8', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', cursor: 'pointer', minWidth: '100px' }} onClick={() => handleSort('estado')}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>Estado {getSortIcon('estado')}</div>
                  </th>
                  <th style={{ textAlign: 'center', padding: '18px 16px', color: '#94a3b8', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', minWidth: '140px' }}>Acciones</th>
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
                      <td style={{ padding: '16px', color: '#64748b', fontSize: '14px' }}>{index + 1}</td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ padding: '6px', borderRadius: '8px', background: 'rgba(59,130,246,0.1)' }}>
                            <FaQrcode style={{ color: '#3b82f6', fontSize: '14px' }} />
                          </div>
                          <span style={{ color: '#94a3b8', fontFamily: 'monospace', fontSize: '13px' }}>{planta.codigo_qr}</span>
                          <button
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#64748b',
                              cursor: 'pointer',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontSize: '12px',
                              transition: 'all 0.2s ease'
                            }}
                            onClick={() => copiarQR(planta.codigo_qr)}
                            title="Copiar código QR"
                            onMouseEnter={(e) => {
                              e.currentTarget.style.color = '#3b82f6';
                              e.currentTarget.style.background = 'rgba(59,130,246,0.1)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.color = '#64748b';
                              e.currentTarget.style.background = 'transparent';
                            }}
                          >
                            <FaRegCopy size={12} />
                          </button>
                        </div>
                      </td>
                      <td style={{ padding: '16px', fontWeight: '500' }}>{planta.nombre}</td>
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
                          {new Date(planta.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}
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
            maxWidth: modalType === 'view' ? '900px' : '550px',
            background: '#0f172a',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '20px',
            padding: '32px',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
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
                <h3 style={{ color: '#fff', marginBottom: '16px' }}>🌱 {selectedPlanta.nombre}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  <div>
                    <p style={{ color: '#94a3b8', fontSize: '12px', margin: 0 }}>Código QR</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <p style={{ color: '#fff', fontSize: '14px', fontFamily: 'monospace', margin: '4px 0 0' }}>
                        {selectedPlanta.codigo_qr}
                      </p>
                      <button
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#64748b',
                          cursor: 'pointer',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          transition: 'all 0.2s ease'
                        }}
                        onClick={() => copiarQR(selectedPlanta.codigo_qr)}
                        title="Copiar código QR"
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = '#3b82f6';
                          e.currentTarget.style.background = 'rgba(59,130,246,0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = '#64748b';
                          e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        <FaRegCopy size={12} />
                      </button>
                    </div>
                  </div>
                  <div>
                    <p style={{ color: '#94a3b8', fontSize: '12px', margin: 0 }}>Tipo</p>
                    <p style={{ color: '#fff', fontSize: '14px' }}>{getTipoLabel(selectedPlanta.tipo)}</p>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  <div>
                    <p style={{ color: '#94a3b8', fontSize: '12px', margin: 0 }}>Estado</p>
                    <p style={{ color: '#fff', fontSize: '14px' }}>{getEstadoLabel(selectedPlanta.estado)}</p>
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
                    <p style={{ color: '#fff', fontSize: '14px' }}>{selectedPlanta.descripcion}</p>
                  </div>
                )}

                {/* --- TABLA DE ETAPAS --- */}
                <div style={{ marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px' }}>
                  <EtapasTable 
                    etapas={getEtapasByPlanta(selectedPlanta.id)}
                    plantaNombre={selectedPlanta.nombre}
                    plantaCodigo={selectedPlanta.codigo_qr}
                  />
                  <button
                    style={{
                      marginTop: '12px',
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

                {/* --- TABLA DE INFORMES --- */}
                <div style={{ marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px' }}>
                  <InformesTable
                    informes={informes}
                    plantaNombre={selectedPlanta.nombre}
                    plantaCodigo={selectedPlanta.codigo_qr}
                    onEditInforme={openEditInforme}
                    onDeleteInforme={handleDeleteInforme}
                  />
                  <button
                    style={{
                      marginTop: '12px',
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

                {/* Botón Cerrar */}
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
                {/* Nombre */}
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '4px' }}>Nombre de la planta *</label>
                  <input
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
                    placeholder="Ej: Planta Medicinal #1"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    required
                  />
                </div>

                {/* Código QR */}
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '4px' }}>Código QR *</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      style={{
                        flex: 1,
                        padding: '12px 16px',
                        borderRadius: '10px',
                        border: '1px solid rgba(255,255,255,0.08)',
                        background: 'rgba(255,255,255,0.03)',
                        color: '#fff',
                        fontSize: '14px',
                        outline: 'none',
                        transition: 'all 0.2s ease',
                        boxSizing: 'border-box',
                        fontFamily: 'monospace'
                      }}
                      placeholder="Código QR"
                      value={formData.codigo_qr}
                      onChange={(e) => setFormData({ ...formData, codigo_qr: e.target.value.toUpperCase() })}
                    />
                    <button
                      type="button"
                      style={{
                        padding: '10px 16px',
                        borderRadius: '10px',
                        border: '1px solid rgba(255,255,255,0.08)',
                        background: 'rgba(59,130,246,0.1)',
                        color: '#3b82f6',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '13px',
                        whiteSpace: 'nowrap'
                      }}
                      onClick={generarNuevoQR}
                    >
                      <FaQrcode size={14} /> Generar
                    </button>
                    <button
                      type="button"
                      style={{
                        padding: '10px 14px',
                        borderRadius: '10px',
                        border: '1px solid rgba(255,255,255,0.08)',
                        background: 'rgba(255,255,255,0.03)',
                        color: '#94a3b8',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      onClick={() => copiarQR(formData.codigo_qr)}
                      title="Copiar código"
                    >
                      <FaRegCopy size={14} />
                    </button>
                  </div>
                  <div style={{ marginTop: '4px', fontSize: '11px', color: '#64748b' }}>
                    {validarCodigoQR(formData.codigo_qr) ? '✅ Formato válido' : '⚠️ Formato no estándar'}
                  </div>
                </div>

                {/* Banco de procedencia */}
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
                />

                {/* Lote */}
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
                />

                {/* Fechas */}
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

                {/* Descripción */}
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
                />

                {/* Tipo y Estado */}
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
                  >
                    <option value="ACTIVO">✅ Activo</option>
                    <option value="FINALIZADO">📌 Finalizado</option>
                    <option value="CANCELADO">❌ Cancelado</option>
                  </select>
                </div>

                {/* Botones */}
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    type="button"
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
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
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
              <InformeForm
                initialData={editingInforme || undefined}
                onSave={handleSaveInforme}
                onCancel={() => {
                  setIsModalOpen(false);
                  setEditingInforme(null);
                  if (selectedPlanta) {
                    setModalType('view');
                  }
                }}
                loading={loading}
              />
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