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

  // Utilidades locales (evitar parsing UTC de 'YYYY-MM-DD')
  const toLocalDate = (yyyyMMdd: string) => {
    const [y, m, d] = yyyyMMdd.split('-').map(Number);
    return new Date(y, (m || 1) - 1, d || 1); // fecha local a medianoche
  };
  const now = new Date();
  const todayLocal = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // 2. Validar que la fecha no sea anterior a hoy (comparación local)
  const fechaSeleccionada = toLocalDate(form.fechaCita);
  if (fechaSeleccionada < todayLocal) {
    return 'No puedes agendar citas en fechas pasadas';
  }

  // 3. Validar hora dentro del horario laboral (08:00 - 18:00)
  const [horasStr, minutosStr] = form.horaCita.split(':');
  const horas = Number(horasStr);
  const minutos = Number(minutosStr);
  if (Number.isNaN(horas) || Number.isNaN(minutos)) {
    return 'La hora seleccionada no es válida';
  }
  if (horas < 8 || horas >= 18) {
    return 'La hora debe estar entre 08:00 y 18:00';
  }

  // 4. Si la fecha es hoy, la hora debe ser >= a la hora actual
  const sameDay = fechaSeleccionada.getTime() === todayLocal.getTime();
  if (sameDay) {
    const nowMins = now.getHours() * 60 + now.getMinutes();
    const selMins = horas * 60 + minutos;
    if (selMins < nowMins) {
      return 'Para hoy, la hora debe ser posterior a la hora actual';
    }
  }

  // 5. Validar duración
  if (form.duracionMinutos < 15 || form.duracionMinutos > 120) {
    return 'La duración debe estar entre 15 y 120 minutos';
  }

  return null; // Todo válido
};

// Crear nueva cita
export const crearCita = async (form: FormCita, token: string): Promise<{ success: boolean; message: string; data?: any }> => {
  try {
    const response = await fetch(`${BASE_URL}/citas/agendar`, {
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

// Obtener citas del usuario autenticado (CLIENTE usa /mis-citas)
export const obtenerMisCitas = async (token: string) => {
  const response = await fetch(`${BASE_URL}/citas/mis-citas`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error('Error al cargar citas');
  return response.json();
};

// Obtener TODAS las citas (solo para ADMIN y VETERINARIO)
export const obtenerTodasLasCitas = async (token: string) => {
  const response = await fetch(`${BASE_URL}/citas`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error('Error al cargar citas');
  return response.json();
};
