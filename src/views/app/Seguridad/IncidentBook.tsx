// src/views/Security/IncidentBook.jsx
// @ts-nocheck
import { useState } from 'react';
import { 
  FaBook, 
  FaSearch, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaEye,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaUser,
  FaCalendarAlt,
  FaTag,
  FaFileAlt,
  FaFilter,
  // FaPrint,
  // FaFileExport,
  FaBuilding,
  FaMapMarkerAlt,
  FaTimes,
  FaSpinner
} from 'react-icons/fa';

// Componente Card para estadísticas
const StatCard = ({ title, value, icon, color }) => {
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
          <h3 style={{ margin: '8px 0 0', fontSize: '28px', fontWeight: '700', color: '#fff' }}>{value}</h3>
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

const incidentMock = [
  {
    id: 1,
    type: 'Accidente',
    severity: 'Alta',
    date: '2026-06-28',
    time: '14:30',
    location: 'Puerta Principal',
    description: 'Colisión entre vehículo particular y moto en el acceso principal',
    reportedBy: 'Pedro Martínez',
    status: 'En proceso',
    department: 'Seguridad'
  },
  {
    id: 2,
    type: 'Robo',
    severity: 'Alta',
    date: '2026-06-28',
    time: '09:15',
    location: 'Estacionamiento Norte',
    description: 'Sustracción de pertenencias de vehículo estacionado en el área norte',
    reportedBy: 'Ana García',
    status: 'Resuelto',
    department: 'Seguridad'
  },
  {
    id: 3,
    type: 'Incidente',
    severity: 'Media',
    date: '2026-06-27',
    time: '16:45',
    location: 'Recepción',
    description: 'Persona no autorizada intenta ingresar sin identificación',
    reportedBy: 'Carlos Díaz',
    status: 'En proceso',
    department: 'Recepción'
  },
  {
    id: 4,
    type: 'Falla técnica',
    severity: 'Baja',
    date: '2026-06-27',
    time: '11:20',
    location: 'Sala de servidores',
    description: 'Falla en sistema de climatización del cuarto de servidores',
    reportedBy: 'Laura Torres',
    status: 'Pendiente',
    department: 'Sistemas'
  }
];

export default function IncidentBook() {
  const [incidents, setIncidents] = useState(incidentMock);
  const [search, setSearch] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('create');
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showStats, setShowStats] = useState(true);

  const [formData, setFormData] = useState({
    type: 'Accidente',
    severity: 'Media',
    location: '',
    description: '',
    reportedBy: '',
    status: 'Pendiente',
    department: ''
  });

  // Estadísticas
  const total = incidents.length;
  const alta = incidents.filter(i => i.severity === 'Alta').length;
  const media = incidents.filter(i => i.severity === 'Media').length;
  const baja = incidents.filter(i => i.severity === 'Baja').length;
  const resueltos = incidents.filter(i => i.status === 'Resuelto').length;
  const proceso = incidents.filter(i => i.status === 'En proceso').length;

  // Filtros
  const filteredIncidents = incidents.filter(item => {
    const matchSearch = item.description.toLowerCase().includes(search.toLowerCase()) ||
                       item.location.toLowerCase().includes(search.toLowerCase()) ||
                       item.reportedBy.toLowerCase().includes(search.toLowerCase());
    const matchSeverity = filterSeverity === 'all' || item.severity === filterSeverity;
    const matchStatus = filterStatus === 'all' || item.status === filterStatus;
    const matchType = filterType === 'all' || item.type === filterType;
    return matchSearch && matchSeverity && matchStatus && matchType;
  });

  const openModal = (type, item = null) => {
    setModalType(type);
    setSelectedIncident(item);
    if (item) {
      setFormData(item);
    } else {
      setFormData({
        type: 'Accidente',
        severity: 'Media',
        location: '',
        description: '',
        reportedBy: '',
        status: 'Pendiente',
        department: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      if (modalType === 'create') {
        setIncidents([...incidents, {
          id: Date.now(),
          ...formData,
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
        }]);
      } else if (modalType === 'edit') {
        setIncidents(incidents.map(i => 
          i.id === selectedIncident.id ? { ...i, ...formData } : i
        ));
      }
      setLoading(false);
      setIsModalOpen(false);
    }, 500);
  };

  const handleDelete = () => {
    setLoading(true);
    setTimeout(() => {
      setIncidents(incidents.filter(i => i.id !== selectedIncident.id));
      setLoading(false);
      setIsModalOpen(false);
    }, 500);
  };

  const getSeverityBadge = (severity) => {
    const colors = {
      'Alta': '#ef4444',
      'Media': '#f59e0b',
      'Baja': '#3b82f6'
    };
    return colors[severity] || '#6b7280';
  };

  const getSeverityIcon = (severity) => {
    const icons = {
      'Alta': <FaExclamationTriangle />,
      'Media': <FaExclamationTriangle />,
      'Baja': <FaCheckCircle />
    };
    return icons[severity] || null;
  };

  const getStatusBadge = (status) => {
    const colors = {
      'Resuelto': '#22c55e',
      'En proceso': '#f59e0b',
      'Pendiente': '#6b7280'
    };
    return colors[status] || '#6b7280';
  };

  const clearFilters = () => {
    setSearch('');
    setFilterType('all');
    setFilterSeverity('all');
    setFilterStatus('all');
  };

  const hasActiveFilters = search || filterType !== 'all' || filterSeverity !== 'all' || filterStatus !== 'all';

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
            <FaBook style={{ color: '#f59e0b', marginRight: '12px' }} />
            Libro de Concurrencias
          </h1>
          <p style={{ color: '#94a3b8', marginTop: '8px', fontSize: '14px' }}>
            {filteredIncidents.length} incidentes encontrados • {incidents.length} en total
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            style={{
              border: '1px solid rgba(255,255,255,0.08)',
              padding: '12px 20px',
              borderRadius: '12px',
              display: 'flex',
              gap: '8px',
              alignItems: 'center',
              cursor: 'pointer',
              background: 'rgba(255,255,255,0.05)',
              color: '#94a3b8',
              fontWeight: '500',
              fontSize: '14px',
              transition: 'all 0.3s ease'
            }}
            onClick={() => setShowStats(!showStats)}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
            }}
          >
            <FaFilter /> {showStats ? 'Ocultar' : 'Mostrar'} estadísticas
          </button>
          <button
            style={{
              border: 'none',
              padding: '12px 24px',
              borderRadius: '12px',
              display: 'flex',
              gap: '10px',
              alignItems: 'center',
              cursor: 'pointer',
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              color: '#fff',
              fontWeight: 'bold',
              fontSize: '14px',
              transition: 'all 0.3s ease'
            }}
            onClick={() => openModal('create')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(245,158,11,0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <FaPlus /> Nuevo Incidente
          </button>
        </div>
      </div>

      {/* Cards Estadísticas */}
      {showStats && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          <StatCard 
            title="Total Incidentes" 
            value={total} 
            icon={<FaBook size={18} />} 
            color="rgba(59,130,246,0.1)"
          />
          <StatCard 
            title="Alta Prioridad" 
            value={alta} 
            icon={<FaExclamationTriangle size={18} />} 
            color="rgba(239,68,68,0.1)"
          />
          <StatCard 
            title="Media Prioridad" 
            value={media} 
            icon={<FaExclamationTriangle size={18} />} 
            color="rgba(245,158,11,0.1)"
          />
          <StatCard 
            title="Baja Prioridad" 
            value={baja} 
            icon={<FaCheckCircle size={18} />} 
            color="rgba(59,130,246,0.1)"
          />
          <StatCard 
            title="Resueltos" 
            value={resueltos} 
            icon={<FaCheckCircle size={18} />} 
            color="rgba(34,197,94,0.1)"
          />
          <StatCard 
            title="En Proceso" 
            value={proceso} 
            icon={<FaClock size={18} />} 
            color="rgba(245,158,11,0.1)"
          />
        </div>
      )}

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
            placeholder="Buscar por descripción, ubicación o reportante..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer'
              }}
              onClick={() => setSearch('')}
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
            minWidth: '140px',
            fontSize: '14px',
            cursor: 'pointer'
          }}
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">Todos los tipos</option>
          <option value="Accidente">🚗 Accidente</option>
          <option value="Robo">🔒 Robo</option>
          <option value="Incidente">⚠️ Incidente</option>
          <option value="Falla técnica">🔧 Falla técnica</option>
        </select>

        <select
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            color: '#fff',
            padding: '14px 20px',
            outline: 'none',
            minWidth: '140px',
            fontSize: '14px',
            cursor: 'pointer'
          }}
          value={filterSeverity}
          onChange={(e) => setFilterSeverity(e.target.value)}
        >
          <option value="all">Todas las prioridades</option>
          <option value="Alta">🔴 Alta</option>
          <option value="Media">🟡 Media</option>
          <option value="Baja">🔵 Baja</option>
        </select>

        <select
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            color: '#fff',
            padding: '14px 20px',
            outline: 'none',
            minWidth: '140px',
            fontSize: '14px',
            cursor: 'pointer'
          }}
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">Todos los estados</option>
          <option value="Resuelto">✅ Resuelto</option>
          <option value="En proceso">⏳ En proceso</option>
          <option value="Pendiente">⏸️ Pendiente</option>
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
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            minWidth: '1100px'
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
                <th style={{
                  textAlign: 'left',
                  padding: '18px 16px',
                  color: '#94a3b8',
                  fontSize: '12px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  minWidth: '100px'
                }}>
                  Tipo
                </th>
                <th style={{
                  textAlign: 'left',
                  padding: '18px 16px',
                  color: '#94a3b8',
                  fontSize: '12px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  minWidth: '90px'
                }}>
                  Prioridad
                </th>
                <th style={{
                  textAlign: 'left',
                  padding: '18px 16px',
                  color: '#94a3b8',
                  fontSize: '12px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  minWidth: '120px'
                }}>
                  Ubicación
                </th>
                <th style={{
                  textAlign: 'left',
                  padding: '18px 16px',
                  color: '#94a3b8',
                  fontSize: '12px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  minWidth: '180px'
                }}>
                  Descripción
                </th>
                <th style={{
                  textAlign: 'left',
                  padding: '18px 16px',
                  color: '#94a3b8',
                  fontSize: '12px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  minWidth: '120px'
                }}>
                  Reportante
                </th>
                <th style={{
                  textAlign: 'left',
                  padding: '18px 16px',
                  color: '#94a3b8',
                  fontSize: '12px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  minWidth: '120px'
                }}>
                  Fecha/Hora
                </th>
                <th style={{
                  textAlign: 'left',
                  padding: '18px 16px',
                  color: '#94a3b8',
                  fontSize: '12px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  minWidth: '100px'
                }}>
                  Estado
                </th>
                <th style={{
                  textAlign: 'left',
                  padding: '18px 16px',
                  color: '#94a3b8',
                  fontSize: '12px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  minWidth: '110px'
                }}>
                  Departamento
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
              {filteredIncidents.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ textAlign: 'center', padding: '60px 0' }}>
                    <div style={{ color: '#94a3b8' }}>
                      <p style={{ fontSize: '18px', marginBottom: '8px' }}>📖 No se encontraron incidentes</p>
                      <p style={{ fontSize: '14px' }}>Prueba ajustando los filtros o crea un nuevo incidente</p>
                      <button
                        style={{
                          marginTop: '16px',
                          border: 'none',
                          padding: '10px 20px',
                          borderRadius: '10px',
                          background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                          color: '#fff',
                          cursor: 'pointer',
                          fontWeight: '600'
                        }}
                        onClick={() => openModal('create')}
                      >
                        <FaPlus style={{ marginRight: '8px' }} /> Registrar incidente
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredIncidents.map((item, index) => (
                  <tr
                    key={item.id}
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
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '500',
                        background: 'rgba(255,255,255,0.05)',
                        color: '#94a3b8'
                      }}>
                        {item.type}
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '999px',
                        fontSize: '12px',
                        fontWeight: '600',
                        background: `${getSeverityBadge(item.severity)}20`,
                        color: getSeverityBadge(item.severity),
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        {getSeverityIcon(item.severity)} {item.severity}
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '13px' }}>
                        <FaMapMarkerAlt size={12} style={{ opacity: 0.5 }} />
                        {item.location}
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{
                        maxWidth: '180px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        color: '#94a3b8',
                        fontSize: '13px'
                      }} title={item.description}>
                        {item.description}
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '13px' }}>
                        <FaUser size={12} style={{ opacity: 0.5 }} />
                        {item.reportedBy}
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '13px' }}>
                        <FaCalendarAlt size={12} style={{ opacity: 0.5 }} />
                        {item.date} {item.time}
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '999px',
                        fontSize: '12px',
                        fontWeight: '600',
                        background: `${getStatusBadge(item.status)}20`,
                        color: getStatusBadge(item.status)
                      }}>
                        {item.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '13px' }}>
                        <FaBuilding size={12} style={{ opacity: 0.5 }} />
                        {item.department}
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                        <button
                          style={{
                            width: '34px',
                            height: '34px',
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
                          onClick={() => openModal('view', item)}
                          title="Ver detalle"
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
                            width: '34px',
                            height: '34px',
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
                          onClick={() => openModal('edit', item)}
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
                            width: '34px',
                            height: '34px',
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
                          onClick={() => openModal('delete', item)}
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
            maxWidth: '700px',
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
                {modalType === 'create' && '📖 Nuevo Incidente'}
                {modalType === 'edit' && '✏️ Editar Incidente'}
                {modalType === 'view' && '👁️ Detalle del Incidente'}
                {modalType === 'delete' && '⚠️ Confirmar Eliminación'}
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
                onClick={() => setIsModalOpen(false)}
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

            {/* Modal Content */}
            {modalType === 'view' && selectedIncident && (
              <div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '16px'
                }}>
                  <div>
                    <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '4px' }}>
                      <FaTag size={12} style={{ marginRight: '4px' }} /> Tipo
                    </label>
                    <div style={{
                      padding: '10px 14px',
                      background: 'rgba(255,255,255,0.03)',
                      borderRadius: '8px',
                      fontSize: '14px',
                      border: '1px solid rgba(255,255,255,0.06)'
                    }}>
                      {selectedIncident.type}
                    </div>
                  </div>
                  <div>
                    <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '4px' }}>Prioridad</label>
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
                        background: `${getSeverityBadge(selectedIncident.severity)}20`,
                        color: getSeverityBadge(selectedIncident.severity),
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        {getSeverityIcon(selectedIncident.severity)} {selectedIncident.severity}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '16px',
                  marginTop: '12px'
                }}>
                  <div>
                    <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '4px' }}>
                      <FaMapMarkerAlt size={12} style={{ marginRight: '4px' }} /> Ubicación
                    </label>
                    <div style={{
                      padding: '10px 14px',
                      background: 'rgba(255,255,255,0.03)',
                      borderRadius: '8px',
                      fontSize: '14px',
                      border: '1px solid rgba(255,255,255,0.06)'
                    }}>
                      {selectedIncident.location}
                    </div>
                  </div>
                  <div>
                    <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '4px' }}>
                      <FaBuilding size={12} style={{ marginRight: '4px' }} /> Departamento
                    </label>
                    <div style={{
                      padding: '10px 14px',
                      background: 'rgba(255,255,255,0.03)',
                      borderRadius: '8px',
                      fontSize: '14px',
                      border: '1px solid rgba(255,255,255,0.06)'
                    }}>
                      {selectedIncident.department}
                    </div>
                  </div>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '16px',
                  marginTop: '12px'
                }}>
                  <div>
                    <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '4px' }}>
                      <FaUser size={12} style={{ marginRight: '4px' }} /> Reportante
                    </label>
                    <div style={{
                      padding: '10px 14px',
                      background: 'rgba(255,255,255,0.03)',
                      borderRadius: '8px',
                      fontSize: '14px',
                      border: '1px solid rgba(255,255,255,0.06)'
                    }}>
                      {selectedIncident.reportedBy}
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
                        background: `${getStatusBadge(selectedIncident.status)}20`,
                        color: getStatusBadge(selectedIncident.status)
                      }}>
                        {selectedIncident.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '12px' }}>
                  <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '4px' }}>
                    <FaCalendarAlt size={12} style={{ marginRight: '4px' }} /> Fecha y Hora
                  </label>
                  <div style={{
                    padding: '10px 14px',
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: '8px',
                    fontSize: '14px',
                    border: '1px solid rgba(255,255,255,0.06)',
                    color: '#94a3b8'
                  }}>
                    {selectedIncident.date} - {selectedIncident.time}
                  </div>
                </div>

                <div style={{ marginTop: '12px' }}>
                  <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '4px' }}>
                    <FaFileAlt size={12} style={{ marginRight: '4px' }} /> Descripción
                  </label>
                  <div style={{
                    padding: '12px 16px',
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: '8px',
                    fontSize: '14px',
                    border: '1px solid rgba(255,255,255,0.06)',
                    minHeight: '60px',
                    whiteSpace: 'pre-wrap',
                    color: '#e2e8f0'
                  }}>
                    {selectedIncident.description}
                  </div>
                </div>

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
                    fontSize: '15px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => setIsModalOpen(false)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(59,130,246,0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  Cerrar
                </button>
              </div>
            )}

            {modalType === 'delete' && selectedIncident && (
              <div>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'rgba(239,68,68,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px'
                  }}>
                    <FaExclamationTriangle style={{ color: '#ef4444', fontSize: '28px' }} />
                  </div>
                  <h4 style={{ marginBottom: '8px' }}>¿Estás seguro de eliminar este incidente?</h4>
                  <p style={{ color: '#94a3b8', fontSize: '14px' }}>
                    Se eliminará el incidente del día {selectedIncident.date} 
                    <br />Esta acción no se puede deshacer.
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
                    disabled={loading}
                    onMouseEnter={(e) => {
                      if (!loading) {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(239,68,68,0.4)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {loading ? <FaSpinner className="fa-spin" /> : <FaTrash />}
                    {loading ? 'Eliminando...' : 'Eliminar'}
                  </button>
                </div>
              </div>
            )}

            {(modalType === 'create' || modalType === 'edit') && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '4px' }}>
                      <FaTag size={12} style={{ marginRight: '4px' }} /> Tipo *
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
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    >
                      <option value="Accidente">🚗 Accidente</option>
                      <option value="Robo">🔒 Robo</option>
                      <option value="Incidente">⚠️ Incidente</option>
                      <option value="Falla técnica">🔧 Falla técnica</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '4px' }}>
                      <FaExclamationTriangle size={12} style={{ marginRight: '4px' }} /> Prioridad *
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
                      value={formData.severity}
                      onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                    >
                      <option value="Alta">🔴 Alta</option>
                      <option value="Media">🟡 Media</option>
                      <option value="Baja">🔵 Baja</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
                  <div>
                    <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '4px' }}>
                      <FaMapMarkerAlt size={12} style={{ marginRight: '4px' }} /> Ubicación *
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
                      placeholder="Ubicación del incidente"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(245,158,11,0.5)';
                        e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                        e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '4px' }}>
                      <FaBuilding size={12} style={{ marginRight: '4px' }} /> Departamento
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
                      placeholder="Departamento responsable"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(245,158,11,0.5)';
                        e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                        e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
                  <div>
                    <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '4px' }}>
                      <FaUser size={12} style={{ marginRight: '4px' }} /> Reportante *
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
                      placeholder="Nombre del reportante"
                      value={formData.reportedBy}
                      onChange={(e) => setFormData({ ...formData, reportedBy: e.target.value })}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(245,158,11,0.5)';
                        e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                        e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '4px' }}>Estado</label>
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
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="Pendiente">⏸️ Pendiente</option>
                      <option value="En proceso">⏳ En proceso</option>
                      <option value="Resuelto">✅ Resuelto</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginTop: '12px' }}>
                  <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '4px' }}>
                    <FaFileAlt size={12} style={{ marginRight: '4px' }} /> Descripción *
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
                      minHeight: '80px',
                      resize: 'vertical',
                      fontFamily: 'inherit',
                      transition: 'all 0.2s ease'
                    }}
                    placeholder="Descripción detallada del incidente..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(245,158,11,0.5)';
                      e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                      e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
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
                      background: 'linear-gradient(135deg, #f59e0b, #d97706)',
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
                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(245,158,11,0.4)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {loading ? <FaSpinner className="fa-spin" /> : <FaPlus />}
                    {loading ? 'Guardando...' : (modalType === 'create' ? 'Crear' : 'Actualizar')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}