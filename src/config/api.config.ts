// Configuración centralizada de la API
// En producción Azure: https://vetclinic-backend-2025.azurewebsites.net
// En Docker: /api (nginx hace proxy al backend)
// En desarrollo local: http://localhost:8080

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://vetclinic-backend-2025.azurewebsites.net';

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  ENDPOINTS: {
    // Auth
    LOGIN: `${API_BASE_URL}/api/auth/login`,

    // Citas
    CITAS: `${API_BASE_URL}/api/citas`,
    CITAS_MIS_CITAS: `${API_BASE_URL}/api/citas/mis-citas`,
    CITAS_HOY: `${API_BASE_URL}/api/citas/hoy`,
    CITAS_AGENDAR: `${API_BASE_URL}/api/citas/agendar`,
    CITAS_ESTADO: (id: number) => `${API_BASE_URL}/api/citas/${id}/estado`,

    // Mascotas
    MASCOTAS: `${API_BASE_URL}/api/mascotas`,
    MASCOTAS_MIAS: `${API_BASE_URL}/api/mascotas/mias`,

    // Historias
    HISTORIAS_MASCOTA: (id: number) => `${API_BASE_URL}/api/historias/mascota/${id}`,
    HISTORIAS_COMPLETO: (id: number) => `${API_BASE_URL}/api/historias/mascota/${id}/completo`,
    HISTORIAS_ENTRADA: (id: number) => `${API_BASE_URL}/api/historias/${id}/entrada`,
    HISTORIAS_ENTRADAS: (id: number) => `${API_BASE_URL}/api/historias/${id}/entradas`,

    // Usuarios
    USUARIOS: `${API_BASE_URL}/api/usuarios`,
    USUARIOS_VETERINARIOS_ACTIVOS: `${API_BASE_URL}/api/usuarios/veterinarios/activos`,
    USUARIOS_ESTADO: (id: number) => `${API_BASE_URL}/api/usuarios/${id}/estado`,

    // Admin
    ADMIN_METRICAS: `${API_BASE_URL}/api/admin/metricas`,
  }
};

export default API_CONFIG;

