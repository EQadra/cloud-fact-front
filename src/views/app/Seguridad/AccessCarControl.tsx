// src/views/app/Seguridad/VehicleAccess.jsx
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
  FaCar,
  FaFilter,
  FaUser,
  FaSignInAlt,
  FaSignOutAlt,
  FaIdCard,
  FaBuilding,
  FaClock,
  FaCalendarAlt,
  FaUserClock,
  FaTimes,
  FaSpinner,
  FaTruck,
  FaMotorcycle
} from 'react-icons/fa';
import { useSecurity } from '../../../context/SecurityContext';
import { toast } from 'react-hot-toast';

// Componente Card para estadísticas
const StatCard = ({ title, value, icon, color }) => (
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

export default function VehicleAccess() {
  const {
    accessRecords,
    accessLoading,
    fetchAccessRecords,
    createAccessRecord,
    updateAccessRecord,
    deleteAccessRecord,
  } = useSecurity();

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterVehicleType, setFilterVehicleType] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('create');
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Estado del formulario - AHORA CON LOS CAMPOS CORRECTOS
  const [formData, setFormData] = useState({
    vehiculo: '',
    placa: '',
    tipoVehiculo: 'AUTO',
    nombreCompleto: '',
    tipoDocumento: 'DNI',
    numeroDocumento: '',
    tipoAcceso: 'INGRESO',
    zona: '',
    motivo: '',
    registradoPor: '',
    status: 'PENDIENTE',
    acompanantes: '',
  });

  useEffect(() => {
    fetchAccessRecords();
  }, []);

  // Filtrar solo registros vehiculares (con vehículo)
  const vehicleRecords = accessRecords.filter(record => record.vehiculo && record.vehiculo !== '');

  // Estadísticas
  const total = vehicleRecords.length;
  const ingresos = vehicleRecords.filter(a => a.tipoAcceso === 'INGRESO').length;
  const salidas = vehicleRecords.filter(a => a.tipoAcceso === 'SALIDA').length;
  const autorizados = vehicleRecords.filter(a => a.status === 'AUTORIZADO').length;
  const pendientes = vehicleRecords.filter(a => a.status === 'PENDIENTE').length;
  const denegados = vehicleRecords.filter(a => a.status === 'DENEGADO').length;
  const autos = vehicleRecords.filter(a => a.tipoVehiculo === 'AUTO').length;
  const camionetas = vehicleRecords.filter(a => a.tipoVehiculo === 'CAMIONETA').length;
  const motos = vehicleRecords.filter(a => a.tipoVehiculo === 'MOTO').length;
  const camiones = vehicleRecords.filter(a => a.tipoVehiculo === 'CAMION').length;

  // Filtros
  const filteredAccess = vehicleRecords.filter(item => {
    const matchSearch = item.nombreCompleto?.toLowerCase().includes(search.toLowerCase()) ||
                       item.placa?.toLowerCase().includes(search.toLowerCase()) ||
                       item.vehiculo?.toLowerCase().includes(search.toLowerCase()) ||
                       item.zona?.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === 'all' || item.tipoAcceso === filterType;
    const matchStatus = filterStatus === 'all' || item.status === filterStatus;
    const matchVehicle = filterVehicleType === 'all' || item.tipoVehiculo === filterVehicleType;
    return matchSearch && matchType && matchStatus && matchVehicle;
  });

  const openModal = (type, item = null) => {
    setModalType(type);
    setSelectedItem(item);
    if (item) {
      setFormData({
        vehiculo: item.vehiculo || '',
        placa: item.placa || '',
        tipoVehiculo: item.tipoVehiculo || 'AUTO',
        nombreCompleto: item.nombreCompleto || '',
        tipoDocumento: item.tipoDocumento || 'DNI',
        numeroDocumento: item.numeroDocumento || '',
        tipoAcceso: item.tipoAcceso || 'INGRESO',
        zona: item.zona || '',
        motivo: item.motivo || '',
        registradoPor: item.registradoPor || '',
        status: item.status || 'PENDIENTE',
        acompanantes: item.acompanantes || '',
      });
    } else {
      setFormData({
        vehiculo: '',
        placa: '',
        tipoVehiculo: 'AUTO',
        nombreCompleto: '',
        tipoDocumento: 'DNI',
        numeroDocumento: '',
        tipoAcceso: 'INGRESO',
        zona: '',
        motivo: '',
        registradoPor: '',
        status: 'PENDIENTE',
        acompanantes: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    // Validar campos obligatorios
    if (!formData.vehiculo || !formData.placa || !formData.nombreCompleto) {
      toast.error('Los campos Vehículo, Placa y Conductor son obligatorios');
      return;
    }

    setLoading(true);
    try {
      // ✅ Crear el objeto con los campos exactos del DTO
      const data = {
        vehiculo: formData.vehiculo,
        placa: formData.placa.toUpperCase(),
        tipoVehiculo: formData.tipoVehiculo,
        nombreCompleto: formData.nombreCompleto,
        tipoAcceso: formData.tipoAcceso,
        tipoDocumento: formData.tipoDocumento || undefined,
        numeroDocumento: formData.numeroDocumento || undefined,
        zona: formData.zona || undefined,
        motivo: formData.motivo || undefined,
        registradoPor: formData.registradoPor || undefined,
        status: formData.status || 'PENDIENTE',
        acompanantes: formData.acompanantes || undefined,
      };

      console.log('📤 Enviando datos al backend:', data);

      if (modalType === 'create') {
        await createAccessRecord(data);
        toast.success('✅ Registro vehicular creado exitosamente');
      } else if (modalType === 'edit') {
        await updateAccessRecord(selectedItem.id, data);
        toast.success('✅ Registro vehicular actualizado exitosamente');
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('❌ Error completo:', error);
      console.error('❌ Response data:', error.response?.data);
      
      if (error.response?.data?.message) {
        const messages = Array.isArray(error.response.data.message) 
          ? error.response.data.message 
          : [error.response.data.message];
        toast.error(messages.join(', '));
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

  // Helper functions
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

  const getTypeColor = (type) => type === 'INGRESO' ? '#22c55e' : '#f59e0b';
  const getTypeLabel = (type) => type === 'INGRESO' ? 'Ingreso' : 'Salida';
  const getTypeIcon = (type) => type === 'INGRESO' ? <FaSignInAlt /> : <FaSignOutAlt />;

  const getVehicleIcon = (type) => {
    const icons = {
      'AUTO': <FaCar />,
      'CAMIONETA': <FaTruck />,
      'MOTO': <FaMotorcycle />,
      'CAMION': <FaTruck />,
      'OTRO': <FaCar />
    };
    return icons[type] || <FaCar />;
  };

  const getVehicleLabel = (type) => {
    const labels = {
      'AUTO': 'Auto',
      'CAMIONETA': 'Camioneta',
      'MOTO': 'Moto',
      'CAMION': 'Camión',
      'OTRO': 'Otro'
    };
    return labels[type] || type;
  };

  const getVehicleColor = (type) => {
    const colors = {
      'AUTO': '#3b82f6',
      'CAMIONETA': '#8b5cf6',
      'MOTO': '#f59e0b',
      'CAMION': '#ef4444',
      'OTRO': '#6b7280'
    };
    return colors[type] || '#6b7280';
  };

  const clearFilters = () => {
    setSearch('');
    setFilterType('all');
    setFilterStatus('all');
    setFilterVehicleType('all');
  };

  const hasActiveFilters = search || filterType !== 'all' || filterStatus !== 'all' || filterVehicleType !== 'all';

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
          <FaSpinner className="fa-spin" size={40} color="#3b82f6" />
          <p style={{ marginTop: '16px', color: '#94a3b8' }}>Cargando registros vehiculares...</p>
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
            <FaCar style={{ color: '#3b82f6', marginRight: '12px' }} />
            Control de Acceso Vehicular
          </h1>
          <p style={{ color: '#94a3b8', marginTop: '8px', fontSize: '14px' }}>
            {filteredAccess.length} registros encontrados • {vehicleRecords.length} en total
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
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              color: '#fff',
              fontWeight: 'bold',
              fontSize: '14px',
              transition: 'all 0.3s ease'
            }}
            onClick={() => openModal('create')}
          >
            <FaPlus /> Nuevo Vehículo
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '16px',
        marginBottom: '30px'
      }}>
        <StatCard title="Total" value={total} icon={<FaCar size={18} />} />
        <StatCard title="Ingresos" value={ingresos} icon={<FaSignInAlt size={18} />} color="rgba(34,197,94,0.1)" />
        <StatCard title="Salidas" value={salidas} icon={<FaSignOutAlt size={18} />} color="rgba(245,158,11,0.1)" />
        <StatCard title="Autorizados" value={autorizados} icon={<FaUserCheck size={18} />} />
        <StatCard title="Pendientes" value={pendientes} icon={<FaUserClock size={18} />} color="rgba(245,158,11,0.1)" />
        <StatCard title="Denegados" value={denegados} icon={<FaUserTimes size={18} />} color="rgba(239,68,68,0.1)" />
        <StatCard title="Autos" value={autos} icon={<FaCar size={18} />} />
        <StatCard title="Camionetas" value={camionetas} icon={<FaTruck size={18} />} color="rgba(139,92,246,0.1)" />
        <StatCard title="Motos" value={motos} icon={<FaMotorcycle size={18} />} color="rgba(245,158,11,0.1)" />
        <StatCard title="Camiones" value={camiones} icon={<FaTruck size={18} />} color="rgba(239,68,68,0.1)" />
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
            placeholder="Buscar por placa, conductor, zona..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
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
            padding: '12px 16px',
            outline: 'none',
            minWidth: '120px',
            fontSize: '14px',
            cursor: 'pointer'
          }}
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">Todos</option>
          <option value="INGRESO">🚪 Ingreso</option>
          <option value="SALIDA">🚪 Salida</option>
        </select>

        <select
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            color: '#fff',
            padding: '12px 16px',
            outline: 'none',
            minWidth: '120px',
            fontSize: '14px',
            cursor: 'pointer'
          }}
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">Estados</option>
          <option value="AUTORIZADO">✅ Autorizado</option>
          <option value="PENDIENTE">⏳ Pendiente</option>
          <option value="DENEGADO">❌ Denegado</option>
        </select>

        <select
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            color: '#fff',
            padding: '12px 16px',
            outline: 'none',
            minWidth: '120px',
            fontSize: '14px',
            cursor: 'pointer'
          }}
          value={filterVehicleType}
          onChange={(e) => setFilterVehicleType(e.target.value)}
        >
          <option value="all">Vehículos</option>
          <option value="AUTO">🚗 Auto</option>
          <option value="CAMIONETA">🚙 Camioneta</option>
          <option value="MOTO">🏍️ Moto</option>
          <option value="CAMION">🚛 Camión</option>
        </select>

        {hasActiveFilters && (
          <button
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              color: '#94a3b8',
              padding: '12px 16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px'
            }}
            onClick={clearFilters}
          >
            <FaTimes size={12} /> Limpiar
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
                <FaBuilding size={12} style={{ marginRight: '4px' }} /> Zona
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
                <option value="">Todas</option>
                <option value="Estacionamiento Norte">Estacionamiento Norte</option>
                <option value="Estacionamiento Sur">Estacionamiento Sur</option>
                <option value="Estacionamiento Este">Estacionamiento Este</option>
                <option value="Estacionamiento Oeste">Estacionamiento Oeste</option>
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
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '950px' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <th style={{ textAlign: 'left', padding: '14px 12px', color: '#94a3b8', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase' }}>#</th>
                <th style={{ textAlign: 'left', padding: '14px 12px', color: '#94a3b8', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase' }}>Vehículo / Placa</th>
                <th style={{ textAlign: 'left', padding: '14px 12px', color: '#94a3b8', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase' }}>Conductor</th>
                <th style={{ textAlign: 'left', padding: '14px 12px', color: '#94a3b8', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase' }}>Tipo</th>
                <th style={{ textAlign: 'left', padding: '14px 12px', color: '#94a3b8', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase' }}>Zona / Motivo</th>
                <th style={{ textAlign: 'left', padding: '14px 12px', color: '#94a3b8', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase' }}>Fecha / Hora</th>
                <th style={{ textAlign: 'left', padding: '14px 12px', color: '#94a3b8', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase' }}>Estado</th>
                <th style={{ textAlign: 'center', padding: '14px 12px', color: '#94a3b8', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredAccess.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '50px 0', color: '#94a3b8' }}>
                    <p style={{ fontSize: '18px' }}>🚗 No hay registros vehiculares</p>
                    <p style={{ fontSize: '14px' }}>Registra el ingreso o salida de un vehículo</p>
                  </td>
                </tr>
              ) : (
                filteredAccess.map((item, index) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '12px', color: '#64748b', fontSize: '13px' }}>{index + 1}</td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '6px',
                          background: `${getVehicleColor(item.tipoVehiculo)}20`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: getVehicleColor(item.tipoVehiculo)
                        }}>
                          {getVehicleIcon(item.tipoVehiculo)}
                        </div>
                        <div>
                          <div style={{ fontWeight: '500', fontSize: '14px' }}>{item.vehiculo || 'N/A'}</div>
                          <div style={{ fontSize: '12px', color: '#94a3b8' }}>Placa: {item.placa || 'N/A'}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px', fontSize: '14px' }}>{item.nombreCompleto || 'N/A'}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '2px 10px',
                        borderRadius: '999px',
                        fontSize: '11px',
                        fontWeight: '600',
                        background: `${getTypeColor(item.tipoAcceso)}20`,
                        color: getTypeColor(item.tipoAcceso),
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        {getTypeIcon(item.tipoAcceso)} {getTypeLabel(item.tipoAcceso)}
                      </span>
                    </td>
                    <td style={{ padding: '12px', fontSize: '13px', color: '#94a3b8' }}>
                      <div>{item.zona || 'N/A'}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{item.motivo || ''}</div>
                    </td>
                    <td style={{ padding: '12px', fontSize: '13px', color: '#94a3b8' }}>
                      {item.fechaHora ? new Date(item.fechaHora).toLocaleString() : 'N/A'}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '2px 10px',
                        borderRadius: '999px',
                        fontSize: '11px',
                        fontWeight: '600',
                        background: `${getStatusColor(item.status)}20`,
                        color: getStatusColor(item.status)
                      }}>
                        {getStatusLabel(item.status)}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                        <button
                          style={{
                            width: '30px',
                            height: '30px',
                            borderRadius: '6px',
                            border: '1px solid rgba(255,255,255,0.08)',
                            background: 'rgba(255,255,255,0.03)',
                            color: '#94a3b8',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          onClick={() => openModal('view', item)}
                          title="Ver"
                        >
                          <FaEye size={12} />
                        </button>
                        <button
                          style={{
                            width: '30px',
                            height: '30px',
                            borderRadius: '6px',
                            border: '1px solid rgba(255,255,255,0.08)',
                            background: 'rgba(255,255,255,0.03)',
                            color: '#94a3b8',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          onClick={() => openModal('edit', item)}
                          title="Editar"
                        >
                          <FaEdit size={12} />
                        </button>
                        <button
                          style={{
                            width: '30px',
                            height: '30px',
                            borderRadius: '6px',
                            border: '1px solid rgba(255,255,255,0.08)',
                            background: 'rgba(255,255,255,0.03)',
                            color: '#94a3b8',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          onClick={() => openModal('delete', item)}
                          title="Eliminar"
                        >
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
            padding: '28px',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '700' }}>
                {modalType === 'create' && '🚗 Nuevo Registro Vehicular'}
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
                  width: '32px',
                  height: '32px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onClick={() => setIsModalOpen(false)}
              >
                <FaTimes size={16} />
              </button>
            </div>

            {/* Modal View */}
            {modalType === 'view' && selectedItem && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ color: '#94a3b8', fontSize: '12px', display: 'block', marginBottom: '4px' }}>Vehículo</label>
                    <div style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', fontSize: '14px' }}>
                      {selectedItem.vehiculo || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <label style={{ color: '#94a3b8', fontSize: '12px', display: 'block', marginBottom: '4px' }}>Placa</label>
                    <div style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', fontSize: '14px', fontFamily: 'monospace' }}>
                      {selectedItem.placa || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <label style={{ color: '#94a3b8', fontSize: '12px', display: 'block', marginBottom: '4px' }}>Tipo Vehículo</label>
                    <div style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', fontSize: '14px' }}>
                      {getVehicleLabel(selectedItem.tipoVehiculo)}
                    </div>
                  </div>
                  <div>
                    <label style={{ color: '#94a3b8', fontSize: '12px', display: 'block', marginBottom: '4px' }}>Conductor</label>
                    <div style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', fontSize: '14px' }}>
                      {selectedItem.nombreCompleto || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <label style={{ color: '#94a3b8', fontSize: '12px', display: 'block', marginBottom: '4px' }}>Tipo Acceso</label>
                    <div style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', fontSize: '14px' }}>
                      {getTypeLabel(selectedItem.tipoAcceso)}
                    </div>
                  </div>
                  <div>
                    <label style={{ color: '#94a3b8', fontSize: '12px', display: 'block', marginBottom: '4px' }}>Estado</label>
                    <div style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', fontSize: '14px' }}>
                      {getStatusLabel(selectedItem.status)}
                    </div>
                  </div>
                  <div>
                    <label style={{ color: '#94a3b8', fontSize: '12px', display: 'block', marginBottom: '4px' }}>Zona</label>
                    <div style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', fontSize: '14px' }}>
                      {selectedItem.zona || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <label style={{ color: '#94a3b8', fontSize: '12px', display: 'block', marginBottom: '4px' }}>Motivo</label>
                    <div style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', fontSize: '14px' }}>
                      {selectedItem.motivo || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <label style={{ color: '#94a3b8', fontSize: '12px', display: 'block', marginBottom: '4px' }}>Registrado por</label>
                    <div style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', fontSize: '14px' }}>
                      {selectedItem.registradoPor || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <label style={{ color: '#94a3b8', fontSize: '12px', display: 'block', marginBottom: '4px' }}>Acompañantes</label>
                    <div style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', fontSize: '14px' }}>
                      {selectedItem.acompanantes || '0'}
                    </div>
                  </div>
                </div>
                <button
                  style={{
                    width: '100%',
                    marginTop: '16px',
                    padding: '10px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                    color: '#fff',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                  onClick={() => setIsModalOpen(false)}
                >
                  Cerrar
                </button>
              </div>
            )}

            {/* Modal Delete */}
            {modalType === 'delete' && selectedItem && (
              <div>
                <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: 'rgba(239,68,68,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px'
                  }}>
                    <FaUserTimes style={{ color: '#ef4444', fontSize: '24px' }} />
                  </div>
                  <h4>¿Eliminar este registro vehicular?</h4>
                  <p style={{ color: '#94a3b8', fontSize: '14px' }}>
                    Se eliminará el vehículo <strong>{selectedItem.vehiculo}</strong> placa <strong>{selectedItem.placa}</strong>
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    style={{
                      flex: 1,
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.08)',
                      background: 'transparent',
                      color: '#94a3b8',
                      cursor: 'pointer'
                    }}
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    style={{
                      flex: 1,
                      padding: '10px',
                      borderRadius: '8px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                      color: '#fff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                    onClick={handleDelete}
                    disabled={loading}
                  >
                    {loading ? <FaSpinner className="fa-spin" /> : <FaTrash />}
                    {loading ? 'Eliminando...' : 'Eliminar'}
                  </button>
                </div>
              </div>
            )}

            {/* Modal Create/Edit */}
            {(modalType === 'create' || modalType === 'edit') && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {/* Vehículo */}
                  <div>
                    <label style={{ color: '#94a3b8', fontSize: '12px', display: 'block', marginBottom: '4px' }}>
                      Vehículo *
                    </label>
                    <input
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1px solid rgba(255,255,255,0.08)',
                        background: 'rgba(255,255,255,0.03)',
                        color: '#fff',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                      placeholder="Ej: Toyota Corolla"
                      value={formData.vehiculo}
                      onChange={(e) => setFormData({ ...formData, vehiculo: e.target.value })}
                    />
                  </div>

                  {/* Placa */}
                  <div>
                    <label style={{ color: '#94a3b8', fontSize: '12px', display: 'block', marginBottom: '4px' }}>
                      Placa *
                    </label>
                    <input
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1px solid rgba(255,255,255,0.08)',
                        background: 'rgba(255,255,255,0.03)',
                        color: '#fff',
                        fontSize: '14px',
                        outline: 'none',
                        textTransform: 'uppercase'
                      }}
                      placeholder="ABC-123"
                      value={formData.placa}
                      onChange={(e) => setFormData({ ...formData, placa: e.target.value.toUpperCase() })}
                    />
                  </div>

                  {/* Tipo Vehículo */}
                  <div>
                    <label style={{ color: '#94a3b8', fontSize: '12px', display: 'block', marginBottom: '4px' }}>
                      Tipo Vehículo *
                    </label>
                    <select
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1px solid rgba(255,255,255,0.08)',
                        background: 'rgba(255,255,255,0.03)',
                        color: '#fff',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                      value={formData.tipoVehiculo}
                      onChange={(e) => setFormData({ ...formData, tipoVehiculo: e.target.value })}
                    >
                      <option value="AUTO">🚗 Auto</option>
                      <option value="CAMIONETA">🚙 Camioneta</option>
                      <option value="MOTO">🏍️ Moto</option>
                      <option value="CAMION">🚛 Camión</option>
                      <option value="OTRO">🚗 Otro</option>
                    </select>
                  </div>

                  {/* Conductor */}
                  <div>
                    <label style={{ color: '#94a3b8', fontSize: '12px', display: 'block', marginBottom: '4px' }}>
                      Conductor *
                    </label>
                    <input
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1px solid rgba(255,255,255,0.08)',
                        background: 'rgba(255,255,255,0.03)',
                        color: '#fff',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                      placeholder="Nombre del conductor"
                      value={formData.nombreCompleto}
                      onChange={(e) => setFormData({ ...formData, nombreCompleto: e.target.value })}
                    />
                  </div>

                  {/* Tipo Documento */}
                  <div>
                    <label style={{ color: '#94a3b8', fontSize: '12px', display: 'block', marginBottom: '4px' }}>
                      Tipo Documento
                    </label>
                    <select
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1px solid rgba(255,255,255,0.08)',
                        background: 'rgba(255,255,255,0.03)',
                        color: '#fff',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                      value={formData.tipoDocumento}
                      onChange={(e) => setFormData({ ...formData, tipoDocumento: e.target.value })}
                    >
                      <option value="DNI">DNI</option>
                      <option value="CE">CE</option>
                      <option value="PASAPORTE">Pasaporte</option>
                    </select>
                  </div>

                  {/* Número Documento */}
                  <div>
                    <label style={{ color: '#94a3b8', fontSize: '12px', display: 'block', marginBottom: '4px' }}>
                      Número Documento
                    </label>
                    <input
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1px solid rgba(255,255,255,0.08)',
                        background: 'rgba(255,255,255,0.03)',
                        color: '#fff',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                      placeholder="Número de documento"
                      value={formData.numeroDocumento}
                      onChange={(e) => setFormData({ ...formData, numeroDocumento: e.target.value })}
                    />
                  </div>

                  {/* Tipo Acceso */}
                  <div>
                    <label style={{ color: '#94a3b8', fontSize: '12px', display: 'block', marginBottom: '4px' }}>
                      Tipo Acceso *
                    </label>
                    <select
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1px solid rgba(255,255,255,0.08)',
                        background: 'rgba(255,255,255,0.03)',
                        color: '#fff',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                      value={formData.tipoAcceso}
                      onChange={(e) => setFormData({ ...formData, tipoAcceso: e.target.value })}
                    >
                      <option value="INGRESO">🚪 Ingreso</option>
                      <option value="SALIDA">🚪 Salida</option>
                    </select>
                  </div>

                  {/* Estado */}
                  <div>
                    <label style={{ color: '#94a3b8', fontSize: '12px', display: 'block', marginBottom: '4px' }}>
                      Estado *
                    </label>
                    <select
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1px solid rgba(255,255,255,0.08)',
                        background: 'rgba(255,255,255,0.03)',
                        color: '#fff',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="AUTORIZADO">✅ Autorizado</option>
                      <option value="PENDIENTE">⏳ Pendiente</option>
                      <option value="DENEGADO">❌ Denegado</option>
                    </select>
                  </div>

                  {/* Zona */}
                  <div>
                    <label style={{ color: '#94a3b8', fontSize: '12px', display: 'block', marginBottom: '4px' }}>
                      Zona
                    </label>
                    <input
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1px solid rgba(255,255,255,0.08)',
                        background: 'rgba(255,255,255,0.03)',
                        color: '#fff',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                      placeholder="Ej: Estacionamiento Norte"
                      value={formData.zona}
                      onChange={(e) => setFormData({ ...formData, zona: e.target.value })}
                    />
                  </div>

                  {/* Motivo */}
                  <div>
                    <label style={{ color: '#94a3b8', fontSize: '12px', display: 'block', marginBottom: '4px' }}>
                      Motivo
                    </label>
                    <input
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1px solid rgba(255,255,255,0.08)',
                        background: 'rgba(255,255,255,0.03)',
                        color: '#fff',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                      placeholder="Motivo del ingreso/salida"
                      value={formData.motivo}
                      onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
                    />
                  </div>

                  {/* Registrado por */}
                  <div>
                    <label style={{ color: '#94a3b8', fontSize: '12px', display: 'block', marginBottom: '4px' }}>
                      Registrado por
                    </label>
                    <input
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1px solid rgba(255,255,255,0.08)',
                        background: 'rgba(255,255,255,0.03)',
                        color: '#fff',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                      placeholder="Nombre del registrador"
                      value={formData.registradoPor}
                      onChange={(e) => setFormData({ ...formData, registradoPor: e.target.value })}
                    />
                  </div>

                  {/* Acompañantes */}
                  <div>
                    <label style={{ color: '#94a3b8', fontSize: '12px', display: 'block', marginBottom: '4px' }}>
                      Acompañantes
                    </label>
                    <input
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1px solid rgba(255,255,255,0.08)',
                        background: 'rgba(255,255,255,0.03)',
                        color: '#fff',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                      placeholder="Número de acompañantes"
                      value={formData.acompanantes}
                      onChange={(e) => setFormData({ ...formData, acompanantes: e.target.value })}
                    />
                  </div>
                </div>

                {/* Botones */}
                <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                  <button
                    style={{
                      flex: 1,
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.08)',
                      background: 'transparent',
                      color: '#94a3b8',
                      cursor: 'pointer'
                    }}
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    style={{
                      flex: 1,
                      padding: '10px',
                      borderRadius: '8px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                      color: '#fff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      opacity: (!formData.vehiculo || !formData.placa || !formData.nombreCompleto) ? 0.5 : 1
                    }}
                    onClick={handleSave}
                    disabled={loading || !formData.vehiculo || !formData.placa || !formData.nombreCompleto}
                  >
                    {loading ? <FaSpinner className="fa-spin" /> : <FaPlus />}
                    {loading ? 'Guardando...' : 'Guardar'}
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