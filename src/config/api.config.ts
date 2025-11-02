// Configuración centralizada de la API
// En Docker, nginx hace proxy de /api/* al backend
// En desarrollo local, usar http://localhost:8080/api

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  ENDPOINTS: {
    // Auth
    LOGIN: `${API_BASE_URL}/auth/login`,

    // Citas
    CITAS: `${API_BASE_URL}/citas`,
    CITAS_MIS_CITAS: `${API_BASE_URL}/citas/mis-citas`,
    CITAS_HOY: `${API_BASE_URL}/citas/hoy`,
    CITAS_AGENDAR: `${API_BASE_URL}/citas/agendar`,
    CITAS_ESTADO: (id: number) => `${API_BASE_URL}/citas/${id}/estado`,

    // Mascotas
    MASCOTAS: `${API_BASE_URL}/mascotas`,
    MASCOTAS_MIAS: `${API_BASE_URL}/mascotas/mias`,

    // Historias
    HISTORIAS_MASCOTA: (id: number) => `${API_BASE_URL}/historias/mascota/${id}`,
    HISTORIAS_COMPLETO: (id: number) => `${API_BASE_URL}/historias/mascota/${id}/completo`,
    HISTORIAS_ENTRADA: (id: number) => `${API_BASE_URL}/historias/${id}/entrada`,
    HISTORIAS_ENTRADAS: (id: number) => `${API_BASE_URL}/historias/${id}/entradas`,

    // Usuarios
    USUARIOS: `${API_BASE_URL}/usuarios`,
    USUARIOS_VETERINARIOS_ACTIVOS: `${API_BASE_URL}/usuarios/veterinarios/activos`,
    USUARIOS_ESTADO: (id: number) => `${API_BASE_URL}/usuarios/${id}/estado`,

    // Admin
    ADMIN_METRICAS: `${API_BASE_URL}/admin/metricas`,
  }
};

export default API_CONFIG;

