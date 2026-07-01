// src/views/Security/AccessControl.jsx
// @ts-nocheck
import { useState } from 'react';
import { 
  FaSearch, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaEye,
  FaUserCheck,
  // FaUserTimes,
  FaCar,
  // FaPrint,
  // FaFileExport,
  // FaFilter,
  FaUser,
  FaSignInAlt,
  FaSignOutAlt,
  FaTimes,
  FaSpinner,
  FaCalendarAlt,
  FaBuilding,
  FaIdCard
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

const accessMock = [
  {
    id: 1,
    person: 'Juan Pérez',
    document: '12345678',
    vehicle: 'ABC-123',
    type: 'Ingreso',
    date: '2026-06-28',
    time: '08:30',
    status: 'Autorizado',
    company: 'TechCorp S.A.'
  },
  {
    id: 2,
    person: 'María López',
    document: '87654321',
    vehicle: 'DEF-456',
    type: 'Salida',
    date: '2026-06-28',
    time: '17:45',
    status: 'Autorizado',
    company: 'InnovaSoft'
  },
  {
    id: 3,
    person: 'Carlos Díaz',
    document: '45678912',
    vehicle: '-',
    type: 'Ingreso',
    date: '2026-06-27',
    time: '09:15',
    status: 'Pendiente',
    company: 'Consultores Asociados'
  },
  {
    id: 4,
    person: 'Ana Martínez',
    document: '78912345',
    vehicle: 'GHI-789',
    type: 'Salida',
    date: '2026-06-27',
    time: '18:20',
    status: 'Denegado',
    company: 'Servicios Integrales'
  }
];

export default function AccessControl() {
  const [access, setAccess] = useState(accessMock);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('create');
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    person: '',
    document: '',
    vehicle: '',
    type: 'Ingreso',
    status: 'Autorizado',
    company: ''
  });

  // Estadísticas
  const totalRegistros = access.length;
  const ingresos = access.filter(a => a.type === 'Ingreso').length;
  const salidas = access.filter(a => a.type === 'Salida').length;
  const autorizados = access.filter(a => a.status === 'Autorizado').length;

  // Filtros
  const filteredAccess = access.filter(item => {
    const matchSearch = item.person.toLowerCase().includes(search.toLowerCase()) ||
                       item.document.includes(search) ||
                       item.vehicle.toLowerCase().includes(search.toLowerCase()) ||
                       item.company.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === 'all' || item.type === filterType;
    const matchStatus = filterStatus === 'all' || item.status === filterStatus;
    return matchSearch && matchType && matchStatus;
  });

  const openModal = (type, item = null) => {
    setModalType(type);
    setSelectedItem(item);
    if (item) {
      setFormData(item);
    } else {
      setFormData({
        person: '',
        document: '',
        vehicle: '',
        type: 'Ingreso',
        status: 'Autorizado',
        company: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      if (modalType === 'create') {
        setAccess([...access, {
          id: Date.now(),
          ...formData,
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
        }]);
      } else if (modalType === 'edit') {
        setAccess(access.map(a => 
          a.id === selectedItem.id ? { ...a, ...formData } : a
        ));
      }
      setLoading(false);
      setIsModalOpen(false);
    }, 500);
  };

  const handleDelete = () => {
    setLoading(true);
    setTimeout(() => {
      setAccess(access.filter(a => a.id !== selectedItem.id));
      setLoading(false);
      setIsModalOpen(false);
    }, 500);
  };

  const getStatusBadge = (status) => {
    const colors = {
      'Autorizado': 'success',
      'Pendiente': 'warning',
      'Denegado': 'danger'
    };
    return colors[status] || 'secondary';
  };

  const getStatusColor = (status) => {
    const colors = {
      'Autorizado': '#22c55e',
      'Pendiente': '#f59e0b',
      'Denegado': '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  const getTypeIcon = (type) => {
    return type === 'Ingreso' ? <FaSignInAlt /> : <FaSignOutAlt />;
  };

  const getTypeColor = (type) => {
    return type === 'Ingreso' ? '#22c55e' : '#f59e0b';
  };

  const clearFilters = () => {
    setSearch('');
    setFilterType('all');
    setFilterStatus('all');
  };

  const hasActiveFilters = search || filterType !== 'all' || filterStatus !== 'all';

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
            <FaUserCheck style={{ color: '#3b82f6', marginRight: '12px' }} />
            Control de Acceso
          </h1>
          <p style={{ color: '#94a3b8', marginTop: '8px', fontSize: '14px' }}>
            {filteredAccess.length} registros encontrados • {access.length} en total
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
          onClick={() => openModal('create')}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(59,130,246,0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <FaPlus /> Nuevo Registro
        </button>
      </div>

      {/* Cards Estadísticas */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <StatCard 
          title="Total Registros" 
          value={totalRegistros} 
          icon={<FaUserCheck size={18} />} 
          color="rgba(59,130,246,0.1)"
        />
        <StatCard 
          title="Ingresos" 
          value={ingresos} 
          icon={<FaSignInAlt size={18} />} 
          color="rgba(34,197,94,0.1)"
        />
        <StatCard 
          title="Salidas" 
          value={salidas} 
          icon={<FaSignOutAlt size={18} />} 
          color="rgba(245,158,11,0.1)"
        />
        <StatCard 
          title="Autorizados" 
          value={autorizados} 
          icon={<FaUserCheck size={18} />} 
          color="rgba(59,130,246,0.1)"
        />
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
            placeholder="Buscar por persona, documento o vehículo..."
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
            minWidth: '150px',
            fontSize: '14px',
            cursor: 'pointer'
          }}
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">Todos los tipos</option>
          <option value="Ingreso">🚪 Ingreso</option>
          <option value="Salida">🚪 Salida</option>
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
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">Todos los estados</option>
          <option value="Autorizado">✅ Autorizado</option>
          <option value="Pendiente">⏳ Pendiente</option>
          <option value="Denegado">❌ Denegado</option>
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
            minWidth: '900px'
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
                  minWidth: '150px'
                }}>
                  Persona
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
                  Documento
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
                  Vehículo
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
                  minWidth: '130px'
                }}>
                  Empresa
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
              {filteredAccess.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '60px 0' }}>
                    <div style={{ color: '#94a3b8' }}>
                      <p style={{ fontSize: '18px', marginBottom: '8px' }}>🚪 No se encontraron registros</p>
                      <p style={{ fontSize: '14px' }}>Prueba ajustando los filtros o crea un nuevo registro</p>
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
                        onClick={() => openModal('create')}
                      >
                        <FaPlus style={{ marginRight: '8px' }} /> Crear primer registro
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAccess.map((item, index) => (
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          background: 'rgba(59,130,246,0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#3b82f6'
                        }}>
                          <FaUser size={14} />
                        </div>
                        <span style={{ fontWeight: '500' }}>{item.person}</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px', color: '#94a3b8', fontFamily: 'monospace', fontSize: '13px' }}>
                      {item.document}
                    </td>
                    <td style={{ padding: '16px' }}>
                      {item.vehicle !== '-' ? (
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '999px',
                          fontSize: '12px',
                          fontWeight: '600',
                          background: 'rgba(59,130,246,0.1)',
                          color: '#3b82f6',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <FaCar size={12} /> {item.vehicle}
                        </span>
                      ) : (
                        <span style={{ color: '#64748b', fontSize: '13px' }}>—</span>
                      )}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '999px',
                        fontSize: '12px',
                        fontWeight: '600',
                        background: `${getTypeColor(item.type)}20`,
                        color: getTypeColor(item.type),
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        {getTypeIcon(item.type)} {item.type}
                      </span>
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
                        background: `${getStatusColor(item.status)}20`,
                        color: getStatusColor(item.status)
                      }}>
                        {item.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '13px' }}>
                        <FaBuilding size={12} style={{ opacity: 0.5 }} />
                        {item.company}
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
            maxWidth: '600px',
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
                {modalType === 'create' && '🚪 Nuevo Registro de Acceso'}
                {modalType === 'edit' && '✏️ Editar Registro'}
                {modalType === 'view' && '👁️ Detalle del Registro'}
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
            {modalType === 'view' && selectedItem && (
              <div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '16px'
                }}>
                  <div>
                    <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '4px' }}>
                      <FaUser size={12} style={{ marginRight: '4px' }} /> Persona
                    </label>
                    <div style={{
                      padding: '10px 14px',
                      background: 'rgba(255,255,255,0.03)',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '500',
                      border: '1px solid rgba(255,255,255,0.06)'
                    }}>
                      {selectedItem.person}
                    </div>
                  </div>
                  <div>
                    <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '4px' }}>
                      <FaIdCard size={12} style={{ marginRight: '4px' }} /> Documento
                    </label>
                    <div style={{
                      padding: '10px 14px',
                      background: 'rgba(255,255,255,0.03)',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontFamily: 'monospace',
                      border: '1px solid rgba(255,255,255,0.06)'
                    }}>
                      {selectedItem.document}
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
                      <FaCar size={12} style={{ marginRight: '4px' }} /> Vehículo
                    </label>
                    <div style={{
                      padding: '10px 14px',
                      background: 'rgba(255,255,255,0.03)',
                      borderRadius: '8px',
                      fontSize: '14px',
                      border: '1px solid rgba(255,255,255,0.06)'
                    }}>
                      {selectedItem.vehicle !== '-' ? selectedItem.vehicle : '—'}
                    </div>
                  </div>
                  <div>
                    <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '4px' }}>
                      <FaBuilding size={12} style={{ marginRight: '4px' }} /> Empresa
                    </label>
                    <div style={{
                      padding: '10px 14px',
                      background: 'rgba(255,255,255,0.03)',
                      borderRadius: '8px',
                      fontSize: '14px',
                      border: '1px solid rgba(255,255,255,0.06)'
                    }}>
                      {selectedItem.company}
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
                        background: `${getTypeColor(selectedItem.type)}20`,
                        color: getTypeColor(selectedItem.type)
                      }}>
                        {getTypeIcon(selectedItem.type)} {selectedItem.type}
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
                        background: `${getStatusColor(selectedItem.status)}20`,
                        color: getStatusColor(selectedItem.status)
                      }}>
                        {selectedItem.status}
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
                    {selectedItem.date} - {selectedItem.time}
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

            {modalType === 'delete' && selectedItem && (
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
                    <FaTrash style={{ color: '#ef4444', fontSize: '28px' }} />
                  </div>
                  <h4 style={{ marginBottom: '8px' }}>¿Estás seguro de eliminar este registro?</h4>
                  <p style={{ color: '#94a3b8', fontSize: '14px' }}>
                    Se eliminará el registro de <strong>{selectedItem.person}</strong> del día {selectedItem.date}.
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
                      Persona *
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
                      placeholder="Nombre completo"
                      value={formData.person}
                      onChange={(e) => setFormData({ ...formData, person: e.target.value })}
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
                  <div>
                    <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '4px' }}>
                      Documento
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
                      placeholder="Número de documento"
                      value={formData.document}
                      onChange={(e) => setFormData({ ...formData, document: e.target.value })}
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
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
                  <div>
                    <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '4px' }}>
                      <FaCar size={12} style={{ marginRight: '4px' }} /> Vehículo
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
                      placeholder="Placa del vehículo"
                      value={formData.vehicle}
                      onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
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
                  <div>
                    <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '4px' }}>
                      <FaBuilding size={12} style={{ marginRight: '4px' }} /> Empresa
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
                      placeholder="Empresa"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
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
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
                  <div>
                    <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '4px' }}>Tipo</label>
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
                      <option value="Ingreso">🚪 Ingreso</option>
                      <option value="Salida">🚪 Salida</option>
                    </select>
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
                      <option value="Autorizado">✅ Autorizado</option>
                      <option value="Pendiente">⏳ Pendiente</option>
                      <option value="Denegado">❌ Denegado</option>
                    </select>
                  </div>
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