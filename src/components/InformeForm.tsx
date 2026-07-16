// src/components/Produccion/InformeForm.tsx
import React, { useState, useEffect } from 'react';
import { FaSave, FaTimes, FaSpinner, FaPlus, FaTrash } from 'react-icons/fa';
import type { PlantaInforme } from '../../types/produccion';

interface InformeFormProps {
  initialData?: Partial<PlantaInforme>;
  onSave: (data: any) => void;
  onCancel: () => void;
  loading?: boolean;
}

export const InformeForm: React.FC<InformeFormProps> = ({
  initialData,
  onSave,
  onCancel,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    titulo: initialData?.titulo || '',
    descripcion: initialData?.descripcion || '',
    tipo: initialData?.tipo || 'GENERAL',
    fecha_informe: initialData?.fecha_informe || new Date().toISOString().split('T')[0],
    imagen_url: initialData?.imagen_url || '',
    recomendaciones: initialData?.recomendaciones || '',
    estado: initialData?.estado || 'BORRADOR',
    datos_medicion: initialData?.datos_medicion || {},
  });

  const [mediciones, setMediciones] = useState<{ key: string; value: string }[]>(
    Object.entries(formData.datos_medicion).map(([key, value]) => ({ 
      key, 
      value: String(value) 
    }))
  );

  // Sincronizar mediciones cuando cambia initialData
  useEffect(() => {
    if (initialData?.datos_medicion) {
      const newMediciones = Object.entries(initialData.datos_medicion).map(([key, value]) => ({
        key,
        value: String(value)
      }));
      setMediciones(newMediciones);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convertir mediciones a objeto
    const datos_medicion: Record<string, number | string> = {};
    mediciones.forEach(({ key, value }) => {
      if (key.trim()) {
        const numValue = parseFloat(value);
        datos_medicion[key.trim()] = isNaN(numValue) ? value : numValue;
      }
    });

    onSave({
      ...formData,
      datos_medicion,
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
      {/* Título */}
      <div style={{ marginBottom: '12px' }}>
        <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '4px' }}>
          Título *
        </label>
        <input
          type="text"
          style={{
            width: '100%',
            padding: '10px 14px',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(255,255,255,0.03)',
            color: '#fff',
            fontSize: '14px',
            outline: 'none',
            boxSizing: 'border-box',
            transition: 'all 0.2s ease'
          }}
          placeholder="Título del informe"
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

      {/* Descripción */}
      <div style={{ marginBottom: '12px' }}>
        <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '4px' }}>
          Descripción *
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
            boxSizing: 'border-box',
            transition: 'all 0.2s ease'
          }}
          placeholder="Descripción detallada del informe"
          value={formData.descripcion}
          onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
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

      {/* Tipo y Fecha */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
        <div>
          <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '4px' }}>
            Tipo *
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
              boxSizing: 'border-box',
              transition: 'all 0.2s ease'
            }}
            value={formData.tipo}
            onChange={(e) => setFormData({ ...formData, tipo: e.target.value as any })}
            required
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'rgba(59,130,246,0.5)';
              e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
              e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
            }}
          >
            <option value="CRECIMIENTO">🌱 Crecimiento</option>
            <option value="SALUD">❤️ Salud</option>
            <option value="RIEGO">💧 Riego</option>
            <option value="FERTILIZACION">🧪 Fertilización</option>
            <option value="PODA">✂️ Poda</option>
            <option value="COSECHA">🌾 Cosecha</option>
            <option value="CONTROL_PLAGAS">🐛 Control de Plagas</option>
            <option value="GENERAL">📋 General</option>
          </select>
        </div>
        <div>
          <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '4px' }}>
            Fecha *
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
              boxSizing: 'border-box',
              transition: 'all 0.2s ease'
            }}
            value={formData.fecha_informe}
            onChange={(e) => setFormData({ ...formData, fecha_informe: e.target.value })}
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
      </div>

      {/* Estado */}
      <div style={{ marginBottom: '12px' }}>
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
            cursor: 'pointer',
            boxSizing: 'border-box',
            transition: 'all 0.2s ease'
          }}
          value={formData.estado}
          onChange={(e) => setFormData({ ...formData, estado: e.target.value as any })}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'rgba(59,130,246,0.5)';
            e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
            e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
          }}
        >
          <option value="BORRADOR">📝 Borrador</option>
          <option value="PUBLICADO">✅ Publicado</option>
          <option value="ARCHIVADO">📦 Archivado</option>
        </select>
      </div>

      {/* Imagen URL */}
      <div style={{ marginBottom: '12px' }}>
        <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '4px' }}>
          URL de imagen (opcional)
        </label>
        <input
          type="url"
          style={{
            width: '100%',
            padding: '10px 14px',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(255,255,255,0.03)',
            color: '#fff',
            fontSize: '14px',
            outline: 'none',
            boxSizing: 'border-box',
            transition: 'all 0.2s ease'
          }}
          placeholder="https://ejemplo.com/imagen.jpg"
          value={formData.imagen_url}
          onChange={(e) => setFormData({ ...formData, imagen_url: e.target.value })}
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

      {/* Recomendaciones */}
      <div style={{ marginBottom: '12px' }}>
        <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '4px' }}>
          Recomendaciones (opcional)
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
            fontFamily: 'inherit',
            boxSizing: 'border-box',
            transition: 'all 0.2s ease'
          }}
          placeholder="Recomendaciones basadas en el informe..."
          value={formData.recomendaciones}
          onChange={(e) => setFormData({ ...formData, recomendaciones: e.target.value })}
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

      {/* Mediciones */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <label style={{ color: '#94a3b8', fontSize: '13px' }}>
            Mediciones (opcional)
          </label>
          <button
            type="button"
            style={{
              padding: '4px 12px',
              borderRadius: '6px',
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'transparent',
              color: '#94a3b8',
              cursor: 'pointer',
              fontSize: '12px',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
            onClick={addMedicion}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <FaPlus size={10} /> Agregar
          </button>
        </div>
        
        {mediciones.map((medicion, index) => (
          <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '6px', alignItems: 'center' }}>
            <input
              type="text"
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.03)',
                color: '#fff',
                fontSize: '13px',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'all 0.2s ease'
              }}
              placeholder="Ej: pH"
              value={medicion.key}
              onChange={(e) => updateMedicion(index, 'key', e.target.value)}
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
              type="text"
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.03)',
                color: '#fff',
                fontSize: '13px',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'all 0.2s ease'
              }}
              placeholder="Ej: 6.5"
              value={medicion.value}
              onChange={(e) => updateMedicion(index, 'value', e.target.value)}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'rgba(59,130,246,0.5)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
              }}
            />
            <button
              type="button"
              style={{
                padding: '8px 10px',
                borderRadius: '6px',
                border: 'none',
                background: 'rgba(239,68,68,0.15)',
                color: '#ef4444',
                cursor: 'pointer',
                fontSize: '13px',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onClick={() => removeMedicion(index)}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(239,68,68,0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(239,68,68,0.15)';
              }}
            >
              <FaTrash size={12} />
            </button>
          </div>
        ))}
      </div>

      {/* Botones */}
      <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
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