// --- file: src/components/CitasHoyPage.tsx ---
// Página para VETERINARIO: listar y gestionar las citas de HOY.
// Endpoint: GET /api/citas/hoy
// Acción: PUT /api/citas/{id}/estado { estado: 'Completada' }

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import CitasHoyTable from './CitasHoyTable';
import API_CONFIG from '../config/api.config';

interface Cita {
  id: number;
  fechaCita: string;
  horaCita: string;
  motivo: string;
  estadoCita: string;
  idMascota: number;
  idVeterinario: number;
  duracionMinutos?: number;
  observaciones?: string;
}

const CitasHoyPage = () => {
  const { token } = useAuth();
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargar = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(API_CONFIG.ENDPOINTS.CITAS_HOY, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCitas(res.data);
    } catch (err: any) {
      setError(err?.response?.data || 'No se pudieron cargar las citas de hoy');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const onCompletarCita = async (idCita: number) => {
    if (!token) return;
    try {
      await axios.put(
        API_CONFIG.ENDPOINTS.CITAS_ESTADO(idCita),
        { estado: 'Completada' },
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );
      await cargar();
    } catch (err: any) {
      alert(err?.response?.data || 'Error al completar la cita');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-3 mb-2">
          <Calendar className="w-6 h-6 text-green-600" />
          <h1 className="text-2xl font-bold text-gray-900">Citas de Hoy</h1>
        </div>
        <p className="text-gray-600 mb-6">Revisa tus citas programadas para hoy y actúa rápidamente.</p>

        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <p className="mt-2 text-gray-600">Cargando citas...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-800">{error}</p>
            <button onClick={cargar} className="mt-2 text-red-600 hover:text-red-800 font-medium">
              Reintentar
            </button>
          </div>
        )}

        {!loading && !error && citas.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No tienes citas programadas para hoy</p>
          </div>
        )}

        {!loading && !error && citas.length > 0 && (
          <CitasHoyTable citas={citas} onCompletarCita={onCompletarCita} />
        )}
      </div>
    </div>
  );
};

export default CitasHoyPage;

