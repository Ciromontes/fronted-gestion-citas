/**
 * Servicio para operaciones relacionadas con el historial clínico de mascotas
 * Endpoint principal: GET /api/historias/mascota/{idMascota}/completo
 */

import type { HistorialCompleto } from '../types/historial';

const API_BASE_URL = 'http://localhost:8080/api';

export const historialService = {
  /**
   * Obtiene el historial clínico completo de una mascota
   * @param idMascota - ID de la mascota
   * @param token - Token JWT del cliente autenticado
   * @returns Historial completo con todas las entradas médicas
   * @throws Error con mensaje específico según el código de respuesta
   */
  async obtenerHistorialCompleto(
    idMascota: number,
    token: string
  ): Promise<HistorialCompleto> {
    console.log(`📡 Solicitando historial completo para mascota ID: ${idMascota}`);

    const response = await fetch(
      `${API_BASE_URL}/historias/mascota/${idMascota}/completo`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log(`📊 Respuesta del servidor: ${response.status} ${response.statusText}`);

    // Manejo de errores específicos
    if (response.status === 403) {
      throw new Error('No tienes permiso para ver el historial de esta mascota');
    }

    if (response.status === 401) {
      throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente');
    }

    if (response.status === 404) {
      throw new Error('Mascota no encontrada');
    }

    if (!response.ok) {
      throw new Error('Error al cargar el historial clínico');
    }

    const data = await response.json();
    console.log(`✅ Historial cargado: ${data.totalEntradas} entradas`);

    return data;
  }
};
