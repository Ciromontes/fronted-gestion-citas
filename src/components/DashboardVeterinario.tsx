// --- file: src/components/DashboardVeterinario.tsx ---
// Dashboard para VETERINARIO: "Agenda de Hoy" con acciones rápidas.
// Endpoints: GET /api/citas/hoy (NO se modifica).
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import CitasHoyTable from './CitasHoyTable';
import BuscadorHistorias from './BuscadorHistorias';
import { Calendar, FileText, BarChart3 } from 'lucide-react';

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

const DashboardVeterinario = () => {
    const { token } = useAuth();
    const [vistaActual, setVistaActual] = useState<'agendas' | 'historias' | 'reportes'>('agendas');
    const [citasHoy, setCitasHoy] = useState<Cita[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (vistaActual === 'agendas') {
            cargarCitasHoy();
        }
    }, [vistaActual, token]);

    const cargarCitasHoy = async () => {
        console.log('Cargando citas del día...');
        console.log('Token:', token ? 'Presente' : 'Ausente');

        setLoading(true);
        setError(null);

        try {
            const response = await axios.get('http://localhost:8080/api/citas/hoy', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log('Citas cargadas:', response.data);
            setCitasHoy(response.data);
        } catch (err: any) {
            console.error('Error cargando citas:', err);
            console.error('Respuesta error:', err.response?.data);
            console.error('Status:', err.response?.status);
            setError(err.response?.data || 'Error al cargar las citas del día');
        } finally {
            setLoading(false);
        }
    };

    const handleCompletarCita = async (idCita: number) => {
        console.log('Completando cita ID:', idCita);

        try {
            await axios.put(
                `http://localhost:8080/api/citas/${idCita}/estado`,
                { estado: 'Completada' },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('Cita completada exitosamente');
            cargarCitasHoy();
        } catch (err: any) {
            console.error('Error al completar cita:', err);
            alert(err.response?.data || 'Error al completar la cita');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <h1 className="text-3xl font-bold text-gray-900">Panel Veterinario</h1>
                    <p className="mt-2 text-gray-600">Gestiona tus citas y consultas médicas</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex space-x-4 mb-6">
                    <button
                        onClick={() => setVistaActual('agendas')}
                        className={`flex items-center px-6 py-3 rounded-lg font-medium transition ${
                            vistaActual === 'agendas'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        <Calendar className="w-5 h-5 mr-2" />
                        Agendas
                    </button>
                    <button
                        onClick={() => setVistaActual('historias')}
                        className={`flex items-center px-6 py-3 rounded-lg font-medium transition ${
                            vistaActual === 'historias'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        <FileText className="w-5 h-5 mr-2" />
                        Historias
                    </button>
                    <button
                        onClick={() => setVistaActual('reportes')}
                        className={`flex items-center px-6 py-3 rounded-lg font-medium transition ${
                            vistaActual === 'reportes'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        <BarChart3 className="w-5 h-5 mr-2" />
                        Reportes
                    </button>
                </div>

                {vistaActual === 'agendas' && (
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Agenda de Hoy</h2>
                        <p className="text-gray-600 mb-6">Revisa tus citas y actúa rápidamente.</p>

                        {loading && (
                            <div className="text-center py-8">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                <p className="mt-2 text-gray-600">Cargando citas...</p>
                            </div>
                        )}

                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                                <p className="text-red-800">{error}</p>
                                <button
                                    onClick={cargarCitasHoy}
                                    className="mt-2 text-red-600 hover:text-red-800 font-medium"
                                >
                                    Reintentar
                                </button>
                            </div>
                        )}

                        {!loading && !error && citasHoy.length === 0 && (
                            <div className="text-center py-12 bg-gray-50 rounded-lg">
                                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-600 text-lg">No tienes citas programadas para hoy</p>
                            </div>
                        )}

                        {!loading && !error && citasHoy.length > 0 && (
                            <CitasHoyTable
                                citas={citasHoy}
                                onCompletarCita={handleCompletarCita}
                            />
                        )}
                    </div>
                )}

                {vistaActual === 'historias' && (
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Historias Clínicas</h2>
                        <p className="text-gray-600 mb-6">Busca y consulta el historial médico de las mascotas.</p>
                        <BuscadorHistorias />
                    </div>
                )}

                {vistaActual === 'reportes' && (
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Reportes</h2>
                        <p className="text-gray-600">Próximamente...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardVeterinario;
