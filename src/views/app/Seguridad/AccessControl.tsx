// src/views/Security/PedestrianAccess.jsx
// @ts-nocheck
import { useState } from 'react';
import { 
  FaSearch, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaEye,
  FaUserCheck,
  FaUserTimes,
  FaWalking,
  // FaPrint,
  // FaFileExport,
  FaFilter,
  FaUser,
  FaSignInAlt,
  FaSignOutAlt,
  FaIdCard,
  FaUserTag,
  FaBuilding,
  FaClock,
  FaCalendarAlt,
  FaUserClock,
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

const pedestrianMock = [
  {
    id: 1,
    person: 'Juan Pérez',
    document: '12345678',
    type: 'Ingreso',
    date: '2026-06-28',
    time: '08:30',
    status: 'Autorizado',
    department: 'Administración',
    position: 'Gerente',
    visitorType: 'Empleado',
    reason: 'Trabajo',
    registerBy: 'Seguridad - Carlos'
  },
  {
    id: 2,
    person: 'María López',
    document: '87654321',
    type: 'Salida',
    date: '2026-06-28',
    time: '17:45',
    status: 'Autorizado',
    department: 'Ventas',
    position: 'Vendedor',
    visitorType: 'Empleado',
    reason: 'Fin de jornada',
    registerBy: 'Seguridad - Ana'
  },
  {
    id: 3,
    person: 'Carlos Díaz',
    document: '45678912',
    type: 'Ingreso',
    date: '2026-06-28',
    time: '09:15',
    status: 'Pendiente',
    department: 'Visitante',
    position: 'Consultor',
    visitorType: 'Visitante',
    reason: 'Reunión con directiva',
    registerBy: 'Recepcion - Laura'
  },
  {
    id: 4,
    person: 'Ana Martínez',
    document: '78912345',
    type: 'Salida',
    date: '2026-06-27',
    time: '18:20',
    status: 'Denegado',
    department: 'Visitante',
    position: 'Proveedor',
    visitorType: 'Proveedor',
    reason: 'Entrega de documentos',
    registerBy: 'Seguridad - Pedro'
  },
  {
    id: 5,
    person: 'Roberto Sánchez',
    document: '32165498',
    type: 'Ingreso',
    date: '2026-06-28',
    time: '07:45',
    status: 'Autorizado',
    department: 'TI',
    position: 'Técnico',
    visitorType: 'Empleado',
    reason: 'Mantenimiento',
    registerBy: 'Seguridad - Carlos'
  },
  {
    id: 6,
    person: 'Patricia Gómez',
    document: '98765432',
    type: 'Ingreso',
    date: '2026-06-28',
    time: '10:00',
    status: 'Autorizado',
    department: 'Visitante',
    position: 'Cliente',
    visitorType: 'Visitante',
    reason: 'Reunión comercial',
    registerBy: 'Recepcion - Laura'
  }
];

export default function PedestrianAccess() {
  const [access, setAccess] = useState(pedestrianMock);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterVisitorType, setFilterVisitorType] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('create');
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const [formData, setFormData] = useState({
    person: '',
    document: '',
    type: 'Ingreso',
    status: 'Autorizado',
    department: '',
    position: '',
    visitorType: 'Empleado',
    reason: '',
    registerBy: ''
  });

  // Estadísticas
  const totalRegistros = access.length;
  const ingresos = access.filter(a => a.type === 'Ingreso').length;
  const salidas = access.filter(a => a.type === 'Salida').length;
  const autorizados = access.filter(a => a.status === 'Autorizado').length;
  const empleados = access.filter(a => a.visitorType === 'Empleado').length;
  const visitantes = access.filter(a => a.visitorType === 'Visitante').length;
  const proveedores = access.filter(a => a.visitorType === 'Proveedor').length;

  // Filtros
  const filteredAccess = access.filter(item => {
    const matchSearch = item.person.toLowerCase().includes(search.toLowerCase()) ||
                       item.document.includes(search) ||
                       item.department.toLowerCase().includes(search.toLowerCase()) ||
                       item.position.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === 'all' || item.type === filterType;
    const matchStatus = filterStatus === 'all' || item.status === filterStatus;
    const matchVisitor = filterVisitorType === 'all' || item.visitorType === filterVisitorType;
    return matchSearch && matchType && matchStatus && matchVisitor;
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
        type: 'Ingreso',
        status: 'Autorizado',
        department: '',
        position: '',
        visitorType: 'Empleado',
        reason: '',
        registerBy: ''
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

  const getVisitorTypeBadge = (type) => {
    const colors = {
      'Empleado': '#3b82f6',
      'Visitante': '#8b5cf6',
      'Proveedor': '#22c55e'
    };
    return colors[type] || '#6b7280';
  };

  const getVisitorTypeIcon = (type) => {
    const icons = {
      'Empleado': <FaUserTag />,
      'Visitante': <FaUser />,
      'Proveedor': <FaBuilding />
    };
    return icons[type] || null;
  };

  const clearFilters = () => {
    setSearch('');
    setFilterType('all');
    setFilterStatus('all');
    setFilterVisitorType('all');
  };

  const hasActiveFilters = search || filterType !== 'all' || filterStatus !== 'all' || filterVisitorType !== 'all';

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
            <FaWalking style={{ color: '#22c55e', marginRight: '12px' }} />
            Control de Acceso Peatonal
          </h1>
          <p style={{ color: '#94a3b8', marginTop: '8px', fontSize: '14px' }}>
            {filteredAccess.length} registros encontrados • {access.length} en total
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
            onClick={() => setShowAdvanced(!showAdvanced)}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
            }}
          >
            <FaFilter /> {showAdvanced ? 'Ocultar filtros' : 'Filtros avanzados'}
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
              background: 'linear-gradient(135deg, #22c55e, #16a34a)',
              color: '#fff',
              fontWeight: 'bold',
              fontSize: '14px',
              transition: 'all 0.3s ease'
            }}
            onClick={() => openModal('create')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(34,197,94,0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <FaPlus /> Nuevo Registro
          </button>
        </div>
      </div>

      {/* Cards Estadísticas */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <StatCard 
          title="Total Personas" 
          value={totalRegistros} 
          icon={<FaWalking size={18} />} 
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
        <StatCard 
          title="Empleados" 
          value={empleados} 
          icon={<FaUserTag size={18} />} 
          color="rgba(59,130,246,0.1)"
        />
        <StatCard 
          title="Visitantes" 
          value={visitantes} 
          icon={<FaUser size={18} />} 
          color="rgba(139,92,246,0.1)"
        />
        <StatCard 
          title="Proveedores" 
          value={proveedores} 
          icon={<FaBuilding size={18} />} 
          color="rgba(34,197,94,0.1)"
        />
        <StatCard 
          title="Denegados" 
          value={access.filter(a => a.status === 'Denegado').length} 
          icon={<FaUserTimes size={18} />} 
          color="rgba(239,68,68,0.1)"
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
            placeholder="Buscar por persona, documento, departamento..."
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
            minWidth: '140px',
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
          value={filterVisitorType}
          onChange={(e) => setFilterVisitorType(e.target.value)}
        >
          <option value="all">Todos los tipos</option>
          <option value="Empleado">👤 Empleado</option>
          <option value="Visitante">👤 Visitante</option>
          <option value="Proveedor">🏢 Proveedor</option>
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

      {/* Filtros Avanzados */}
      {showAdvanced && (
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '25px'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px'
          }}>
            <div>
              <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '4px' }}>
                <FaCalendarAlt size={12} style={{ marginRight: '4px' }} /> Fecha desde
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
                  outline: 'none'
                }}
              />
            </div>
            <div>
              <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '4px' }}>
                <FaCalendarAlt size={12} style={{ marginRight: '4px' }} /> Fecha hasta
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
                  outline: 'none'
                }}
              />
            </div>
            <div>
              <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '4px' }}>
                <FaBuilding size={12} style={{ marginRight: '4px' }} /> Departamento
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
              >
                <option value="">Todos</option>
                <option value="Administración">Administración</option>
                <option value="Ventas">Ventas</option>
                <option value="TI">TI</option>
                <option value="Visitante">Visitante</option>
              </select>
            </div>
            <div>
              <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '4px' }}>
                <FaUserClock size={12} style={{ marginRight: '4px' }} /> Registrado por
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
              >
                <option value="">Todos</option>
                <option value="Seguridad">Seguridad</option>
                <option value="Recepcion">Recepción</option>
              </select>
            </div>
          </div>
        </div>
      )}

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
                  minWidth: '110px'
                }}>
                  Visitante
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
                  Departamento
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
                  Cargo
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
                  Registrado por
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
                  <td colSpan={11} style={{ textAlign: 'center', padding: '60px 0' }}>
                    <div style={{ color: '#94a3b8' }}>
                      <p style={{ fontSize: '18px', marginBottom: '8px' }}>🚶 No se encontraron registros</p>
                      <p style={{ fontSize: '14px' }}>Prueba ajustando los filtros o crea un nuevo registro</p>
                      <button
                        style={{
                          marginTop: '16px',
                          border: 'none',
                          padding: '10px 20px',
                          borderRadius: '10px',
                          background: 'linear-gradient(135deg, #22c55e, #16a34a)',
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
                          background: 'rgba(34,197,94,0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#22c55e'
                        }}>
                          <FaUser size={14} />
                        </div>
                        <span style={{ fontWeight: '500' }}>{item.person}</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        background: 'rgba(255,255,255,0.05)',
                        color: '#94a3b8',
                        fontFamily: 'monospace'
                      }}>
                        <FaIdCard size={10} style={{ marginRight: '4px' }} />
                        {item.document}
                      </span>
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
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '999px',
                        fontSize: '12px',
                        fontWeight: '600',
                        background: `${getVisitorTypeBadge(item.visitorType)}20`,
                        color: getVisitorTypeBadge(item.visitorType),
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        {getVisitorTypeIcon(item.visitorType)} {item.visitorType}
                      </span>
                    </td>
                    <td style={{ padding: '16px', color: '#94a3b8', fontSize: '13px' }}>
                      <FaBuilding size={12} style={{ opacity: 0.5, marginRight: '4px' }} />
                      {item.department}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        background: 'rgba(255,255,255,0.05)',
                        color: '#94a3b8'
                      }}>
                        {item.position}
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '13px' }}>
                        <FaCalendarAlt size={12} style={{ opacity: 0.5 }} />
                        {item.date}
                        <FaClock size={11} style={{ opacity: 0.5, marginLeft: '4px' }} />
                        {item.time}
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#94a3b8', fontSize: '13px' }}>
                        <FaUserClock size={12} style={{ opacity: 0.5 }} />
                        {item.registerBy}
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
                {modalType === 'create' && '🚶 Nuevo Registro Peatonal'}
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
                    <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '4px' }}>Tipo Movimiento</label>
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

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '16px',
                  marginTop: '12px'
                }}>
                  <div>
                    <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '4px' }}>
                      <FaUserTag size={12} style={{ marginRight: '4px' }} /> Tipo Visitante
                    </label>
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
                        background: `${getVisitorTypeBadge(selectedItem.visitorType)}20`,
                        color: getVisitorTypeBadge(selectedItem.visitorType)
                      }}>
                        {getVisitorTypeIcon(selectedItem.visitorType)} {selectedItem.visitorType}
                      </span>
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
                      {selectedItem.department}
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
                    <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '4px' }}>Cargo</label>
                    <div style={{
                      padding: '10px 14px',
                      background: 'rgba(255,255,255,0.03)',
                      borderRadius: '8px',
                      fontSize: '14px',
                      border: '1px solid rgba(255,255,255,0.06)'
                    }}>
                      {selectedItem.position}
                    </div>
                  </div>
                  <div>
                    <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '4px' }}>Motivo</label>
                    <div style={{
                      padding: '10px 14px',
                      background: 'rgba(255,255,255,0.03)',
                      borderRadius: '8px',
                      fontSize: '14px',
                      border: '1px solid rgba(255,255,255,0.06)'
                    }}>
                      {selectedItem.reason}
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
                      <FaUserClock size={12} style={{ marginRight: '4px' }} /> Registrado por
                    </label>
                    <div style={{
                      padding: '10px 14px',
                      background: 'rgba(255,255,255,0.03)',
                      borderRadius: '8px',
                      fontSize: '14px',
                      border: '1px solid rgba(255,255,255,0.06)',
                      color: '#94a3b8'
                    }}>
                      {selectedItem.registerBy}
                    </div>
                  </div>
                  <div>
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
                    <FaUserTimes style={{ color: '#ef4444', fontSize: '28px' }} />
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
                        e.currentTarget.style.borderColor = 'rgba(34,197,94,0.5)';
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
                      Documento *
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
                        e.currentTarget.style.borderColor = 'rgba(34,197,94,0.5)';
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
                      <FaUserTag size={12} style={{ marginRight: '4px' }} /> Tipo Visitante *
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
                      value={formData.visitorType}
                      onChange={(e) => setFormData({ ...formData, visitorType: e.target.value })}
                    >
                      <option value="Empleado">👤 Empleado</option>
                      <option value="Visitante">👤 Visitante</option>
                      <option value="Proveedor">🏢 Proveedor</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '4px' }}>
                      <FaSignInAlt size={12} style={{ marginRight: '4px' }} /> Tipo Movimiento *
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
                      <option value="Ingreso">🚪 Ingreso</option>
                      <option value="Salida">🚪 Salida</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
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
                      placeholder="Departamento"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(34,197,94,0.5)';
                        e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                        e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '4px' }}>Cargo</label>
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
                      placeholder="Cargo"
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(34,197,94,0.5)';
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
                    <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '4px' }}>Motivo</label>
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
                      placeholder="Motivo del ingreso/salida"
                      value={formData.reason}
                      onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(34,197,94,0.5)';
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
                      <FaUserClock size={12} style={{ marginRight: '4px' }} /> Registrado por
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
                      placeholder="Nombre del registrador"
                      value={formData.registerBy}
                      onChange={(e) => setFormData({ ...formData, registerBy: e.target.value })}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(34,197,94,0.5)';
                        e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                        e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginTop: '12px' }}>
                  <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '4px' }}>Estado *</label>
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
                      background: 'linear-gradient(135deg, #22c55e, #16a34a)',
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
                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(34,197,94,0.4)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {loading ? <FaSpinner className="fa-spin" /> : <FaPlus />}
                    {loading ? 'Guardando...' : (modalType === 'create' ? 'Registrar' : 'Actualizar')}
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