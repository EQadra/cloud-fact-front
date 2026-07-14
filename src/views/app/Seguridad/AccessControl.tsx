// src/views/Security/AccessControl.jsx
// @ts-nocheck
import { useState, useEffect } from 'react';
import { 
  FaSearch, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaEye,
  FaUserCheck,
  FaUserTimes,
  FaUser,
  FaSignInAlt,
  FaSignOutAlt,
  FaUserTag,
  FaBuilding,
  FaUserClock,
  FaTimes,
  FaSpinner,
  FaCar,
  FaWalking,
  FaFilter,
  FaTruck,
  FaMotorcycle
} from 'react-icons/fa';
import { useSecurity } from '../../../context/SecurityContext';
import { toast } from 'react-hot-toast';

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

export default function AccessControl() {
  const {
    accessRecords,
    accessLoading,
    fetchAccessRecords,
    createAccessRecord,
    updateAccessRecord,
    deleteAccessRecord,
    getPedestrianRecords,
    getVehicleRecords,
  } = useSecurity();

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPersonType, setFilterPersonType] = useState('all');
  const [filterAccessMode, setFilterAccessMode] = useState('all'); // peatonal o vehicular
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('create');
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // all, pedestrian, vehicle
  
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    tipoDocumento: 'DNI',
    numeroDocumento: '',
    tipoAcceso: 'INGRESO',
    zona: '',
    motivo: '',
    registradoPor: '',
    tipoPersona: 'VISITANTE',
    status: 'AUTORIZADO',
    // Vehículo
    vehiculo: '',
    placa: '',
    tipoVehiculo: 'AUTO',
  });

  useEffect(() => {
    fetchAccessRecords();
  }, []);

  // Obtener registros según el filtro
  const pedestrianRecords = getPedestrianRecords();
  const vehicleRecords = getVehicleRecords();
  
  // Seleccionar registros según la pestaña activa
  let currentRecords = accessRecords;
  if (activeTab === 'pedestrian') {
    currentRecords = pedestrianRecords;
  } else if (activeTab === 'vehicle') {
    currentRecords = vehicleRecords;
  }

  // Estadísticas
  const total = currentRecords.length;
  const ingresos = currentRecords.filter(a => a.tipoAcceso === 'INGRESO').length;
  const salidas = currentRecords.filter(a => a.tipoAcceso === 'SALIDA').length;
  const autorizados = currentRecords.filter(a => a.status === 'AUTORIZADO').length;
  const pendientes = currentRecords.filter(a => a.status === 'PENDIENTE').length;
  const denegados = currentRecords.filter(a => a.status === 'DENEGADO').length;
  
  // Estadísticas de tipo de persona (solo para peatonales)
  const empleados = pedestrianRecords.filter(a => a.tipoPersona === 'EMPLEADO').length;
  const visitantes = pedestrianRecords.filter(a => a.tipoPersona === 'VISITANTE').length;
  const proveedores = pedestrianRecords.filter(a => a.tipoPersona === 'PROVEEDOR').length;

  // Filtros
  const filteredAccess = currentRecords.filter(item => {
    const matchSearch = item.nombreCompleto?.toLowerCase().includes(search.toLowerCase()) ||
                       item.numeroDocumento?.includes(search) ||
                       item.zona?.toLowerCase().includes(search.toLowerCase()) ||
                       item.motivo?.toLowerCase().includes(search.toLowerCase()) ||
                       item.vehiculo?.toLowerCase().includes(search.toLowerCase()) ||
                       item.placa?.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === 'all' || item.tipoAcceso === filterType;
    const matchStatus = filterStatus === 'all' || item.status === filterStatus;
    const matchPerson = filterPersonType === 'all' || item.tipoPersona === filterPersonType;
    return matchSearch && matchType && matchStatus && matchPerson;
  });

  const openModal = (type, item = null) => {
    setModalType(type);
    setSelectedItem(item);
    if (item) {
      setFormData({
        nombreCompleto: item.nombreCompleto || '',
        tipoDocumento: item.tipoDocumento || 'DNI',
        numeroDocumento: item.numeroDocumento || '',
        tipoAcceso: item.tipoAcceso || 'INGRESO',
        zona: item.zona || '',
        motivo: item.motivo || '',
        registradoPor: item.registradoPor || '',
        tipoPersona: item.tipoPersona || 'VISITANTE',
        status: item.status || 'AUTORIZADO',
        vehiculo: item.vehiculo || '',
        placa: item.placa || '',
        tipoVehiculo: item.tipoVehiculo || 'AUTO',
      });
    } else {
      setFormData({
        nombreCompleto: '',
        tipoDocumento: 'DNI',
        numeroDocumento: '',
        tipoAcceso: 'INGRESO',
        zona: '',
        motivo: '',
        registradoPor: '',
        tipoPersona: 'VISITANTE',
        status: 'AUTORIZADO',
        vehiculo: '',
        placa: '',
        tipoVehiculo: 'AUTO',
      });
    }
    setIsModalOpen(true);
  };
const handleSave = async () => {
  setLoading(true);
  try {
    const data = {
      nombreCompleto: formData.nombreCompleto || 'Visitante',
      tipoAcceso: formData.tipoAcceso || 'INGRESO',
      tipoPersona: formData.tipoPersona || 'OTRO',
      status: formData.status || 'AUTORIZADO',
    };

    // Agregar campos opcionales solo si tienen valor
    if (formData.tipoDocumento) data.tipoDocumento = formData.tipoDocumento;
    if (formData.numeroDocumento) data.numeroDocumento = formData.numeroDocumento;
    if (formData.zona) data.zona = formData.zona;
    if (formData.motivo) data.motivo = formData.motivo;
    if (formData.vehiculo) data.vehiculo = formData.vehiculo;
    if (formData.placa) data.placa = formData.placa.toUpperCase();
    if (formData.tipoVehiculo) data.tipoVehiculo = formData.tipoVehiculo;
    if (formData.registradoPor) data.registradoPor = formData.registradoPor;

    console.log('📤 Enviando datos:', data);

    if (modalType === 'create') {
      await createAccessRecord(data);
      toast.success('✅ Registro creado exitosamente');
    } else if (modalType === 'edit') {
      await updateAccessRecord(selectedItem.id, data);
      toast.success('✅ Registro actualizado exitosamente');
    }
    setIsModalOpen(false);
    await fetchAccessRecords();
  } catch (error) {
    console.error('❌ Error:', error);
    const msg = error.response?.data?.message;
    if (msg) {
      toast.error(Array.isArray(msg) ? msg.join(', ') : msg);
    } else {
      toast.error('Error al guardar el registro');
    }
  } finally {
    setLoading(false);
  }
};
  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteAccessRecord(selectedItem.id);
      toast.success('✅ Registro eliminado exitosamente');
      setIsModalOpen(false);
    } catch (error) {
      console.error('❌ Error deleting:', error);
      toast.error(error.response?.data?.message || 'Error al eliminar el registro');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'AUTORIZADO': '#22c55e',
      'PENDIENTE': '#f59e0b',
      'DENEGADO': '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  const getStatusLabel = (status) => {
    const labels = {
      'AUTORIZADO': 'Autorizado',
      'PENDIENTE': 'Pendiente',
      'DENEGADO': 'Denegado'
    };
    return labels[status] || status || 'Desconocido';
  };

  const getTypeIcon = (type) => {
    return type === 'INGRESO' ? <FaSignInAlt /> : <FaSignOutAlt />;
  };

  const getTypeColor = (type) => {
    return type === 'INGRESO' ? '#22c55e' : '#f59e0b';
  };

  const getTypeLabel = (type) => {
    return type === 'INGRESO' ? 'Ingreso' : 'Salida';
  };

  const getPersonTypeColor = (type) => {
    const colors = {
      'EMPLEADO': '#3b82f6',
      'VISITANTE': '#8b5cf6',
      'PROVEEDOR': '#22c55e',
      'PACIENTE': '#f59e0b',
      'OTRO': '#6b7280'
    };
    return colors[type] || '#6b7280';
  };

  const getPersonTypeLabel = (type) => {
    const labels = {
      'EMPLEADO': 'Empleado',
      'VISITANTE': 'Visitante',
      'PROVEEDOR': 'Proveedor',
      'PACIENTE': 'Paciente',
      'OTRO': 'Otro'
    };
    return labels[type] || type || 'N/A';
  };

  const getVehicleIcon = (tipo) => {
    const icons = {
      'AUTO': <FaCar />,
      'CAMIONETA': <FaTruck />,
      'MOTO': <FaMotorcycle />,
      'CAMION': <FaTruck />,
      'OTRO': <FaCar />
    };
    return icons[tipo] || <FaCar />;
  };

  const clearFilters = () => {
    setSearch('');
    setFilterType('all');
    setFilterStatus('all');
    setFilterPersonType('all');
  };

  const hasActiveFilters = search || filterType !== 'all' || filterStatus !== 'all' || filterPersonType !== 'all';

  if (accessLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 'calc(100vh - 120px)',
        background: 'linear-gradient(135deg, #0f172a, #1e293b)',
        color: '#fff'
      }}>
        <div style={{ textAlign: 'center' }}>
          <FaSpinner className="fa-spin" size={40} color="#22c55e" />
          <p style={{ marginTop: '16px', color: '#94a3b8' }}>Cargando registros...</p>
        </div>
      </div>
    );
  }

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
            <FaUser style={{ color: '#22c55e', marginRight: '12px' }} />
            Control de Acceso
          </h1>
          <p style={{ color: '#94a3b8', marginTop: '8px', fontSize: '14px' }}>
            {filteredAccess.length} registros encontrados • {total} en total
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
          >
            <FaPlus /> Nuevo Registro
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '4px',
        marginBottom: '25px',
        background: 'rgba(255,255,255,0.03)',
        borderRadius: '12px',
        padding: '4px',
        border: '1px solid rgba(255,255,255,0.06)'
      }}>
        <button
          style={{
            flex: 1,
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'none',
            background: activeTab === 'all' ? 'rgba(34,197,94,0.2)' : 'transparent',
            color: activeTab === 'all' ? '#22c55e' : '#94a3b8',
            cursor: 'pointer',
            fontWeight: activeTab === 'all' ? '600' : '400',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
          onClick={() => setActiveTab('all')}
        >
          <FaUser size={14} /> Todos
        </button>
        <button
          style={{
            flex: 1,
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'none',
            background: activeTab === 'pedestrian' ? 'rgba(59,130,246,0.2)' : 'transparent',
            color: activeTab === 'pedestrian' ? '#3b82f6' : '#94a3b8',
            cursor: 'pointer',
            fontWeight: activeTab === 'pedestrian' ? '600' : '400',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
          onClick={() => setActiveTab('pedestrian')}
        >
          <FaWalking size={14} /> Peatonal
        </button>
        <button
          style={{
            flex: 1,
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'none',
            background: activeTab === 'vehicle' ? 'rgba(245,158,11,0.2)' : 'transparent',
            color: activeTab === 'vehicle' ? '#f59e0b' : '#94a3b8',
            cursor: 'pointer',
            fontWeight: activeTab === 'vehicle' ? '600' : '400',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
          onClick={() => setActiveTab('vehicle')}
        >
          <FaCar size={14} /> Vehicular
        </button>
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '16px',
        marginBottom: '30px'
      }}>
        <StatCard title="Total" value={total} icon={<FaUser size={18} />} />
        <StatCard title="Ingresos" value={ingresos} icon={<FaSignInAlt size={18} />} color="rgba(34,197,94,0.1)" />
        <StatCard title="Salidas" value={salidas} icon={<FaSignOutAlt size={18} />} color="rgba(245,158,11,0.1)" />
        <StatCard title="Autorizados" value={autorizados} icon={<FaUserCheck size={18} />} />
        <StatCard title="Pendientes" value={pendientes} icon={<FaUserClock size={18} />} color="rgba(245,158,11,0.1)" />
        <StatCard title="Denegados" value={denegados} icon={<FaUserTimes size={18} />} color="rgba(239,68,68,0.1)" />
        {activeTab !== 'vehicle' && (
          <>
            <StatCard title="Empleados" value={empleados} icon={<FaUserTag size={18} />} />
            <StatCard title="Visitantes" value={visitantes} icon={<FaUser size={18} />} color="rgba(139,92,246,0.1)" />
            <StatCard title="Proveedores" value={proveedores} icon={<FaBuilding size={18} />} color="rgba(34,197,94,0.1)" />
          </>
        )}
      </div>

      {/* Filters */}
      <div style={{
        display: 'flex',
        gap: '12px',
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
              padding: '12px 0',
              outline: 'none',
              fontSize: '14px'
            }}
            placeholder="Buscar por nombre, documento, zona, placa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }} onClick={() => setSearch('')}>
              <FaTimes />
            </button>
          )}
        </div>

        <select style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', color: '#fff', padding: '12px 16px', outline: 'none', minWidth: '120px', fontSize: '14px', cursor: 'pointer' }} value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="all">Todos los accesos</option>
          <option value="INGRESO">🚪 Ingreso</option>
          <option value="SALIDA">🚪 Salida</option>
        </select>

        <select style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', color: '#fff', padding: '12px 16px', outline: 'none', minWidth: '120px', fontSize: '14px', cursor: 'pointer' }} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="all">Todos los estados</option>
          <option value="AUTORIZADO">✅ Autorizado</option>
          <option value="PENDIENTE">⏳ Pendiente</option>
          <option value="DENEGADO">❌ Denegado</option>
        </select>

        {activeTab !== 'vehicle' && (
          <select style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', color: '#fff', padding: '12px 16px', outline: 'none', minWidth: '120px', fontSize: '14px', cursor: 'pointer' }} value={filterPersonType} onChange={(e) => setFilterPersonType(e.target.value)}>
            <option value="all">Todos los tipos</option>
            <option value="EMPLEADO">👤 Empleado</option>
            <option value="VISITANTE">👤 Visitante</option>
            <option value="PROVEEDOR">🏢 Proveedor</option>
            <option value="PACIENTE">🏥 Paciente</option>
          </select>
        )}

        {hasActiveFilters && (
          <button style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', color: '#94a3b8', padding: '12px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }} onClick={clearFilters}>
            <FaTimes size={12} /> Limpiar
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
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '950px' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <th style={{ textAlign: 'left', padding: '14px 12px', color: '#94a3b8', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase' }}>#</th>
                <th style={{ textAlign: 'left', padding: '14px 12px', color: '#94a3b8', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase' }}>Persona</th>
                <th style={{ textAlign: 'left', padding: '14px 12px', color: '#94a3b8', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase' }}>Documento</th>
                <th style={{ textAlign: 'left', padding: '14px 12px', color: '#94a3b8', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase' }}>Acceso</th>
                <th style={{ textAlign: 'left', padding: '14px 12px', color: '#94a3b8', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase' }}>Tipo</th>
                <th style={{ textAlign: 'left', padding: '14px 12px', color: '#94a3b8', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase' }}>Vehículo</th>
                <th style={{ textAlign: 'left', padding: '14px 12px', color: '#94a3b8', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase' }}>Zona/Motivo</th>
                <th style={{ textAlign: 'left', padding: '14px 12px', color: '#94a3b8', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase' }}>Fecha</th>
                <th style={{ textAlign: 'left', padding: '14px 12px', color: '#94a3b8', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase' }}>Estado</th>
                <th style={{ textAlign: 'center', padding: '14px 12px', color: '#94a3b8', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredAccess.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ textAlign: 'center', padding: '50px 0', color: '#94a3b8' }}>
                    <p style={{ fontSize: '18px' }}>📋 No hay registros</p>
                    <p style={{ fontSize: '14px' }}>Crea un nuevo registro de acceso</p>
                  </td>
                </tr>
              ) : (
                filteredAccess.map((item, index) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '12px', color: '#64748b', fontSize: '13px' }}>{index + 1}</td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(34,197,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22c55e' }}>
                          <FaUser size={12} />
                        </div>
                        <span style={{ fontWeight: '500', fontSize: '14px' }}>{item.nombreCompleto || 'N/A'}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px', color: '#94a3b8', fontSize: '13px' }}>{item.numeroDocumento || 'N/A'}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ padding: '2px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: '600', background: `${getTypeColor(item.tipoAcceso)}20`, color: getTypeColor(item.tipoAcceso), display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        {getTypeIcon(item.tipoAcceso)} {getTypeLabel(item.tipoAcceso)}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ padding: '2px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: '600', background: `${getPersonTypeColor(item.tipoPersona)}20`, color: getPersonTypeColor(item.tipoPersona) }}>
                        {getPersonTypeLabel(item.tipoPersona)}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      {item.vehiculo ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ color: '#f59e0b' }}>{getVehicleIcon(item.tipoVehiculo)}</span>
                          <span style={{ fontSize: '13px', color: '#94a3b8' }}>{item.vehiculo}</span>
                          {item.placa && (
                            <span style={{ fontSize: '11px', color: '#64748b', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px' }}>
                              {item.placa}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span style={{ fontSize: '12px', color: '#64748b' }}>—</span>
                      )}
                    </td>
                    <td style={{ padding: '12px', fontSize: '13px', color: '#94a3b8' }}>
                      <div>{item.zona || 'N/A'}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{item.motivo || ''}</div>
                    </td>
                    <td style={{ padding: '12px', fontSize: '13px', color: '#94a3b8' }}>
                      {item.fechaHora ? new Date(item.fechaHora).toLocaleString() : 'N/A'}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ padding: '2px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: '600', background: `${getStatusColor(item.status)}20`, color: getStatusColor(item.status) }}>
                        {getStatusLabel(item.status)}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                        <button style={{ width: '30px', height: '30px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => openModal('view', item)} title="Ver">
                          <FaEye size={12} />
                        </button>
                        <button style={{ width: '30px', height: '30px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => openModal('edit', item)} title="Editar">
                          <FaEdit size={12} />
                        </button>
                        <button style={{ width: '30px', height: '30px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => openModal('delete', item)} title="Eliminar">
                          <FaTrash size={12} />
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
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 999, padding: '20px' }}>
          <div style={{ width: '100%', maxWidth: '650px', background: '#0f172a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '28px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '700' }}>
                {modalType === 'create' && '📝 Nuevo Registro'}
                {modalType === 'edit' && '✏️ Editar Registro'}
                {modalType === 'view' && '👁️ Detalle'}
                {modalType === 'delete' && '⚠️ Eliminar'}
              </h2>
              <button style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '8px', color: '#94a3b8', width: '32px', height: '32px', cursor: 'pointer' }} onClick={() => setIsModalOpen(false)}>
                <FaTimes size={16} />
              </button>
            </div>

            {modalType === 'view' && selectedItem && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div><label style={{ color: '#94a3b8', fontSize: '12px' }}>Persona</label><div style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', fontSize: '14px' }}>{selectedItem.nombreCompleto || 'N/A'}</div></div>
                  <div><label style={{ color: '#94a3b8', fontSize: '12px' }}>Documento</label><div style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', fontSize: '14px' }}>{selectedItem.numeroDocumento || 'N/A'}</div></div>
                  <div><label style={{ color: '#94a3b8', fontSize: '12px' }}>Tipo Acceso</label><div style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', fontSize: '14px' }}>{getTypeLabel(selectedItem.tipoAcceso)}</div></div>
                  <div><label style={{ color: '#94a3b8', fontSize: '12px' }}>Tipo Persona</label><div style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', fontSize: '14px' }}>{getPersonTypeLabel(selectedItem.tipoPersona)}</div></div>
                  <div><label style={{ color: '#94a3b8', fontSize: '12px' }}>Estado</label><div style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', fontSize: '14px' }}>{getStatusLabel(selectedItem.status)}</div></div>
                  <div><label style={{ color: '#94a3b8', fontSize: '12px' }}>Zona</label><div style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', fontSize: '14px' }}>{selectedItem.zona || 'N/A'}</div></div>
                  <div><label style={{ color: '#94a3b8', fontSize: '12px' }}>Motivo</label><div style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', fontSize: '14px' }}>{selectedItem.motivo || 'N/A'}</div></div>
                  {selectedItem.vehiculo && (
                    <>
                      <div><label style={{ color: '#94a3b8', fontSize: '12px' }}>Vehículo</label><div style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', fontSize: '14px' }}>{selectedItem.vehiculo}</div></div>
                      <div><label style={{ color: '#94a3b8', fontSize: '12px' }}>Placa</label><div style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', fontSize: '14px' }}>{selectedItem.placa || 'N/A'}</div></div>
                    </>
                  )}
                  <div><label style={{ color: '#94a3b8', fontSize: '12px' }}>Registrado por</label><div style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', fontSize: '14px' }}>{selectedItem.registradoPor || 'N/A'}</div></div>
                  <div><label style={{ color: '#94a3b8', fontSize: '12px' }}>Fecha/Hora</label><div style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', fontSize: '14px' }}>{selectedItem.fechaHora ? new Date(selectedItem.fechaHora).toLocaleString() : 'N/A'}</div></div>
                </div>
                <button style={{ width: '100%', marginTop: '16px', padding: '10px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #3b82f6, #2563eb)', color: '#fff', fontWeight: '600', cursor: 'pointer' }} onClick={() => setIsModalOpen(false)}>Cerrar</button>
              </div>
            )}

            {modalType === 'delete' && selectedItem && (
              <div>
                <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                    <FaUserTimes style={{ color: '#ef4444', fontSize: '24px' }} />
                  </div>
                  <h4>¿Eliminar este registro?</h4>
                  <p style={{ color: '#94a3b8', fontSize: '14px' }}>Se eliminará el registro de <strong>{selectedItem.nombreCompleto}</strong></p>
                  {selectedItem.vehiculo && (
                    <p style={{ color: '#94a3b8', fontSize: '12px' }}>Vehículo: {selectedItem.vehiculo} - {selectedItem.placa}</p>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', background: 'transparent', color: '#94a3b8', cursor: 'pointer' }} onClick={() => setIsModalOpen(false)}>Cancelar</button>
                  <button style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #ef4444, #dc2626)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} onClick={handleDelete} disabled={loading}>
                    {loading ? <FaSpinner className="fa-spin" /> : <FaTrash />} {loading ? 'Eliminando...' : 'Eliminar'}
                  </button>
                </div>
              </div>
            )}

            {(modalType === 'create' || modalType === 'edit') && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ color: '#94a3b8', fontSize: '12px', display: 'block', marginBottom: '4px' }}>Nombre *</label>
                    <input style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', color: '#fff', fontSize: '14px', outline: 'none' }} placeholder="Nombre completo" value={formData.nombreCompleto} onChange={(e) => setFormData({ ...formData, nombreCompleto: e.target.value })} />
                  </div>
                  <div>
                    <label style={{ color: '#94a3b8', fontSize: '12px', display: 'block', marginBottom: '4px' }}>Documento *</label>
                    <input style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', color: '#fff', fontSize: '14px', outline: 'none' }} placeholder="Número" value={formData.numeroDocumento} onChange={(e) => setFormData({ ...formData, numeroDocumento: e.target.value })} />
                  </div>
                  <div>
                    <label style={{ color: '#94a3b8', fontSize: '12px', display: 'block', marginBottom: '4px' }}>Tipo Acceso *</label>
                    <select style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', color: '#fff', fontSize: '14px', outline: 'none' }} value={formData.tipoAcceso} onChange={(e) => setFormData({ ...formData, tipoAcceso: e.target.value })}>
                      <option value="INGRESO">Ingreso</option>
                      <option value="SALIDA">Salida</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ color: '#94a3b8', fontSize: '12px', display: 'block', marginBottom: '4px' }}>Tipo Persona *</label>
                    <select style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', color: '#fff', fontSize: '14px', outline: 'none' }} value={formData.tipoPersona} onChange={(e) => setFormData({ ...formData, tipoPersona: e.target.value })}>
                      <option value="EMPLEADO">👤 Empleado</option>
                      <option value="VISITANTE">👤 Visitante</option>
                      <option value="PROVEEDOR">🏢 Proveedor</option>
                      <option value="PACIENTE">🏥 Paciente</option>
                      <option value="OTRO">❓ Otro</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ color: '#94a3b8', fontSize: '12px', display: 'block', marginBottom: '4px' }}>Zona</label>
                    <input style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', color: '#fff', fontSize: '14px', outline: 'none' }} placeholder="Zona" value={formData.zona} onChange={(e) => setFormData({ ...formData, zona: e.target.value })} />
                  </div>
                  <div>
                    <label style={{ color: '#94a3b8', fontSize: '12px', display: 'block', marginBottom: '4px' }}>Motivo</label>
                    <input style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', color: '#fff', fontSize: '14px', outline: 'none' }} placeholder="Motivo" value={formData.motivo} onChange={(e) => setFormData({ ...formData, motivo: e.target.value })} />
                  </div>
                  <div>
                    <label style={{ color: '#94a3b8', fontSize: '12px', display: 'block', marginBottom: '4px' }}>Vehículo</label>
                    <input style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', color: '#fff', fontSize: '14px', outline: 'none' }} placeholder="Ej: Toyota Corolla" value={formData.vehiculo} onChange={(e) => setFormData({ ...formData, vehiculo: e.target.value })} />
                  </div>
                  <div>
                    <label style={{ color: '#94a3b8', fontSize: '12px', display: 'block', marginBottom: '4px' }}>Placa</label>
                    <input style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', color: '#fff', fontSize: '14px', outline: 'none' }} placeholder="Ej: ABC-123" value={formData.placa} onChange={(e) => setFormData({ ...formData, placa: e.target.value })} />
                  </div>
                  <div>
                    <label style={{ color: '#94a3b8', fontSize: '12px', display: 'block', marginBottom: '4px' }}>Tipo Vehículo</label>
                    <select style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', color: '#fff', fontSize: '14px', outline: 'none' }} value={formData.tipoVehiculo} onChange={(e) => setFormData({ ...formData, tipoVehiculo: e.target.value })}>
                      <option value="AUTO">🚗 Auto</option>
                      <option value="CAMIONETA">🚐 Camioneta</option>
                      <option value="MOTO">🏍️ Moto</option>
                      <option value="CAMION">🚛 Camión</option>
                      <option value="OTRO">❓ Otro</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ color: '#94a3b8', fontSize: '12px', display: 'block', marginBottom: '4px' }}>Registrado por</label>
                    <input style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', color: '#fff', fontSize: '14px', outline: 'none' }} placeholder="Registrador" value={formData.registradoPor} onChange={(e) => setFormData({ ...formData, registradoPor: e.target.value })} />
                  </div>
                  <div>
                    <label style={{ color: '#94a3b8', fontSize: '12px', display: 'block', marginBottom: '4px' }}>Estado *</label>
                    <select style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', color: '#fff', fontSize: '14px', outline: 'none' }} value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                      <option value="AUTORIZADO">✅ Autorizado</option>
                      <option value="PENDIENTE">⏳ Pendiente</option>
                      <option value="DENEGADO">❌ Denegado</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                  <button style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', background: 'transparent', color: '#94a3b8', cursor: 'pointer' }} onClick={() => setIsModalOpen(false)}>Cancelar</button>
                  <button style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} onClick={handleSave} disabled={loading}>
                    {loading ? <FaSpinner className="fa-spin" /> : <FaPlus />} {loading ? 'Guardando...' : 'Guardar'}
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