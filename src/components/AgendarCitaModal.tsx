// Modal completo para agendar citas
// Incluye selección de mascota, veterinario, fecha/hora y validaciones
import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, Stethoscope, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useVeterinarios } from '../hooks/useVeterinarios';
import { crearCita, validarFormCita, type FormCita } from '../services/citaService';
import axios from 'axios';

interface Mascota {
  id: number;
  nombre: string;
  especie: string;
  raza: string;
  edad: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  mascotaPreseleccionada?: number; // ID de mascota si viene desde tarjeta
  onSuccess?: () => void; // Callback al agendar exitosamente
}

const AgendarCitaModal: React.FC<Props> = ({ isOpen, onClose, mascotaPreseleccionada, onSuccess }) => {
  const { token } = useAuth();
  const { veterinarios, loading: loadingVets } = useVeterinarios();

  // Estado del formulario
  const [form, setForm] = useState<FormCita>({
    idMascota: mascotaPreseleccionada || 0,
    idVeterinario: 0,
    fechaCita: '',
    horaCita: '',
    duracionMinutos: 30,
    motivo: '',
    observaciones: '',
    estadoCita: 'Programada'
  });

  // Estado de UI
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Cargar mascotas del cliente al abrir modal
  useEffect(() => {
    if (isOpen && token) {
      const fetchMascotas = async () => {
        try {
          const res = await axios.get('http://localhost:8080/api/mascotas/mias', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setMascotas(res.data);
          // Si hay mascota preseleccionada, setearla
          if (mascotaPreseleccionada) {
            setForm(prev => ({ ...prev, idMascota: mascotaPreseleccionada }));
          }
        } catch {
          setError('No se pudieron cargar tus mascotas');
        }
      };
      fetchMascotas();
    }
  }, [isOpen, token, mascotaPreseleccionada]);

  // Manejo de cambios en el formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name === 'duracionMinutos' || name === 'idMascota' || name === 'idVeterinario' ? Number(value) : value }));
  };

  // Envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validaciones frontend
    const errorValidacion = validarFormCita(form);
    if (errorValidacion) {
      setError(errorValidacion);
      return;
    }

    setLoading(true);
    const resultado = await crearCita(form, token!);
    setLoading(false);

    if (resultado.success) {
      setSuccess(resultado.message);
      // Esperar 2s y cerrar modal
      setTimeout(() => {
        onClose();
        if (onSuccess) onSuccess();
      }, 2000);
    } else {
      setError(resultado.message);
    }
  };

  // Generar opciones de hora (08:00 a 18:00 cada 30 min)
  const generarOpcionesHora = () => {
    const opciones = [];
    for (let h = 8; h < 18; h++) {
      opciones.push(`${h.toString().padStart(2, '0')}:00:00`);
      opciones.push(`${h.toString().padStart(2, '0')}:30:00`);
    }
    return opciones;
  };

  // Fecha mínima (hoy) y máxima (+3 meses)
  const today = new Date().toISOString().split('T')[0];
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  if (!isOpen) return null;

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={24} color="#2ecc71" />
            Agendar Nueva Cita
          </h2>
          <button onClick={onClose} style={closeButtonStyle} aria-label="Cerrar">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} style={formStyle}>
          {/* Seleccionar Mascota */}
          <div style={fieldStyle}>
            <label style={labelStyle}>
              <User size={18} /> Selecciona tu mascota *
            </label>
            <select name="idMascota" value={form.idMascota} onChange={handleChange} required style={inputStyle}>
              <option value={0}>-- Elige una mascota --</option>
              {mascotas.map(m => (
                <option key={m.id} value={m.id}>
                  {m.nombre} ({m.especie} - {m.raza})
                </option>
              ))}
            </select>
          </div>

          {/* Seleccionar Veterinario */}
          <div style={fieldStyle}>
            <label style={labelStyle}>
              <Stethoscope size={18} /> Elige un veterinario *
            </label>
            <select name="idVeterinario" value={form.idVeterinario} onChange={handleChange} required style={inputStyle} disabled={loadingVets}>
              <option value={0}>{loadingVets ? 'Cargando...' : '-- Elige un veterinario --'}</option>
              {veterinarios.map(v => (
                <option key={v.id} value={v.idVeterinario}>
                  {v.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Fecha y Hora (grid 2 columnas) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={fieldStyle}>
              <label style={labelStyle}>
                <Calendar size={18} /> Fecha de la cita *
              </label>
              <input type="date" name="fechaCita" value={form.fechaCita} onChange={handleChange} min={today} max={maxDateStr} required style={inputStyle} />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>
                <Clock size={18} /> Hora *
              </label>
              <select name="horaCita" value={form.horaCita} onChange={handleChange} required style={inputStyle}>
                <option value="">-- Selecciona hora --</option>
                {generarOpcionesHora().map(h => (
                  <option key={h} value={h}>{h.substring(0, 5)}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Duración */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Duración (minutos) *</label>
            <input type="number" name="duracionMinutos" value={form.duracionMinutos} onChange={handleChange} min={15} max={120} required style={inputStyle} />
          </div>

          {/* Motivo */}
          <div style={fieldStyle}>
            <label style={labelStyle}>
              <FileText size={18} /> Motivo de la consulta *
            </label>
            <textarea name="motivo" value={form.motivo} onChange={handleChange} placeholder="Ej: Vacunación, control general, seguimiento..." required minLength={10} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
          </div>

          {/* Observaciones */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Observaciones (opcional)</label>
            <textarea name="observaciones" value={form.observaciones || ''} onChange={handleChange} placeholder="Información adicional..." rows={2} style={{ ...inputStyle, resize: 'vertical' }} />
          </div>

          {/* Mensajes */}
          {error && <div style={errorStyle}>{error}</div>}
          {success && <div style={successStyle}>{success}</div>}

          {/* Botones */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} style={cancelButtonStyle} disabled={loading}>
              Cancelar
            </button>
            <button type="submit" style={submitButtonStyle} disabled={loading}>
              {loading ? 'Agendando...' : 'Agendar Cita'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Estilos inline (para no depender de CSS externo en el modal)
const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  padding: '1rem'
};

const modalStyle: React.CSSProperties = {
  backgroundColor: '#fff',
  borderRadius: '12px',
  maxWidth: '600px',
  width: '100%',
  maxHeight: '90vh',
  overflow: 'auto',
  boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '1.25rem',
  borderBottom: '1px solid #e5e7eb'
};

const closeButtonStyle: React.CSSProperties = {
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  padding: '0.25rem',
  borderRadius: '6px'
};

const formStyle: React.CSSProperties = {
  padding: '1.25rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem'
};

const fieldStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.4rem'
};

const labelStyle: React.CSSProperties = {
  fontWeight: 600,
  fontSize: '0.9rem',
  color: '#374151',
  display: 'flex',
  alignItems: 'center',
  gap: '0.4rem'
};

const inputStyle: React.CSSProperties = {
  padding: '0.6rem',
  border: '1px solid #d1d5db',
  borderRadius: '8px',
  fontSize: '0.95rem'
};

const errorStyle: React.CSSProperties = {
  padding: '0.75rem',
  backgroundColor: '#fee',
  color: '#c00',
  borderRadius: '8px',
  fontSize: '0.9rem'
};

const successStyle: React.CSSProperties = {
  padding: '0.75rem',
  backgroundColor: '#d1fae5',
  color: '#065f46',
  borderRadius: '8px',
  fontSize: '0.9rem'
};

const cancelButtonStyle: React.CSSProperties = {
  padding: '0.6rem 1.2rem',
  border: '1px solid #d1d5db',
  borderRadius: '8px',
  backgroundColor: '#f9fafb',
  cursor: 'pointer',
  fontWeight: 600
};

const submitButtonStyle: React.CSSProperties = {
  padding: '0.6rem 1.2rem',
  border: 'none',
  borderRadius: '8px',
  backgroundColor: '#2ecc71',
  color: '#fff',
  cursor: 'pointer',
  fontWeight: 600
};

export default AgendarCitaModal;

