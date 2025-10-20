// Servicio centralizado para operaciones relacionadas con citas
// Incluye validaciones y manejo de errores consistente

const BASE_URL = 'http://localhost:8080/api';

// Interfaz del formulario de cita
export interface FormCita {
  idMascota: number;
  idVeterinario: number;
  fechaCita: string; // Formato: YYYY-MM-DD
  horaCita: string;  // Formato: HH:MM:SS
  duracionMinutos: number;
  motivo: string;
  observaciones?: string;
  estadoCita: 'Programada'; // Valor fijo
}

// Validaciones del formulario antes de enviar
export const validarFormCita = (form: FormCita): string | null => {
  // 1. Validar campos obligatorios
  if (!form.idMascota) return 'Debes seleccionar una mascota';
  if (!form.idVeterinario) return 'Debes seleccionar un veterinario';
  if (!form.fechaCita) return 'Debes seleccionar una fecha';
  if (!form.horaCita) return 'Debes seleccionar una hora';
  if (!form.motivo || form.motivo.trim().length < 10) {
    return 'El motivo debe tener al menos 10 caracteres';
  }

  // 2. Validar que la fecha no sea anterior a hoy
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const fechaSeleccionada = new Date(form.fechaCita);
  if (fechaSeleccionada < hoy) {
    return 'No puedes agendar citas en fechas pasadas';
  }

  // 3. Validar hora dentro del horario laboral (08:00 - 18:00)
  const [horas, minutos] = form.horaCita.split(':').map(Number);
  if (horas < 8 || horas >= 18) {
    return 'La hora debe estar entre 08:00 y 18:00';
  }

  // 4. Validar duración
  if (form.duracionMinutos < 15 || form.duracionMinutos > 120) {
    return 'La duración debe estar entre 15 y 120 minutos';
  }

  return null; // Todo válido
};

// Crear nueva cita
export const crearCita = async (form: FormCita, token: string): Promise<{ success: boolean; message: string; data?: any }> => {
  try {
    const response = await fetch(`${BASE_URL}/citas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(form)
    });

    if (response.ok) {
      const data = await response.json();
      return {
        success: true,
        message: '✅ Cita agendada exitosamente. Recibirás confirmación por correo.',
        data
      };
    } else if (response.status === 400) {
      return {
        success: false,
        message: '❌ No puedes agendar citas para mascotas que no son tuyas.'
      };
    } else if (response.status === 401) {
      return {
        success: false,
        message: '❌ Sesión expirada. Por favor, inicia sesión nuevamente.'
      };
    } else {
      return {
        success: false,
        message: '❌ Error del servidor. Intenta nuevamente más tarde.'
      };
    }
  } catch (error) {
    return {
      success: false,
      message: '❌ Error de conexión. Verifica tu red e intenta nuevamente.'
    };
  }
};

// Obtener citas del usuario autenticado
export const obtenerMisCitas = async (token: string) => {
  const response = await fetch(`${BASE_URL}/citas`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error('Error al cargar citas');
  return response.json();
};

