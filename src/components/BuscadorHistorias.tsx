import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import HistorialMascota from './HistorialMascota';
import { Search, X, FileText, PawPrint, Calendar } from 'lucide-react';

interface HistoriaClinica {
    idHistoria: number;
    idMascota: number;
    fechaCreacion: string;
}

interface MascotaConHistoria {
    idMascota: number;
    nombreMascota?: string;
    idHistoria: number;
    fechaCreacion: string;
}

const BuscadorHistorias = () => {
    const { token } = useAuth();
    const [idMascota, setIdMascota] = useState('');
    const [historia, setHistoria] = useState<HistoriaClinica | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [vistaActual, setVistaActual] = useState<'lista' | 'busqueda'>('lista');
    const [mascotas, setMascotas] = useState<number[]>([]);
    const [loadingMascotas, setLoadingMascotas] = useState(false);

    // Cargar lista de IDs de mascotas con historias al montar el componente
    useEffect(() => {
        cargarMascotasConHistorias();
    }, []);

    /**
     * Carga la lista de mascotas que tienen historias clínicas
     * Intenta obtenerlas del veterinario actual o muestra las disponibles
     */
    const cargarMascotasConHistorias = async () => {
        setLoadingMascotas(true);
        try {
            // Intentar obtener todas las historias y extraer los IDs únicos de mascotas
            // Como no hay un endpoint específico, simulamos con IDs comunes
            // En producción, esto debería ser un endpoint como: /api/historias/veterinario/mascotas
            const idsComunes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // IDs típicos en el sistema
            setMascotas(idsComunes);
        } catch (err) {
            console.error('Error cargando mascotas:', err);
        } finally {
            setLoadingMascotas(false);
        }
    };

    const buscarHistoria = async (id?: string) => {
        const mascotaId = id || idMascota;

        if (!mascotaId || isNaN(Number(mascotaId))) {
            setError('Por favor selecciona o ingresa un ID de mascota válido');
            return;
        }

        console.log('Buscando historia para mascota ID:', mascotaId);
        setLoading(true);
        setError(null);
        setHistoria(null);

        try {
            const response = await axios.get(
                `http://localhost:8080/api/historias/mascota/${mascotaId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            console.log('Historia encontrada:', response.data);
            setHistoria(response.data);
            setIdMascota(mascotaId);
        } catch (err: unknown) {
            console.error('Error buscando historia:', err);
            const error = err as { response?: { data?: string } };
            setError(error.response?.data || 'No se encontró historia clínica para esta mascota');
        } finally {
            setLoading(false);
        }
    };

    const limpiarBusqueda = () => {
        setHistoria(null);
        setIdMascota('');
        setError(null);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            buscarHistoria();
        }
    };

    return (
        <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh', padding: '20px' }}>
            {/* Selector de vista */}
            {!historia && (
                <div className="flex gap-3 mb-6">
                    <button
                        onClick={() => setVistaActual('lista')}
                        className={`flex items-center px-5 py-2.5 rounded-lg font-medium transition ${
                            vistaActual === 'lista'
                                ? 'bg-green-600 text-white shadow-md'
                                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                        }`}
                    >
                        <PawPrint className="w-5 h-5 mr-2" />
                        Ver Mascotas
                    </button>
                    <button
                        onClick={() => setVistaActual('busqueda')}
                        className={`flex items-center px-5 py-2.5 rounded-lg font-medium transition ${
                            vistaActual === 'busqueda'
                                ? 'bg-green-600 text-white shadow-md'
                                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                        }`}
                    >
                        <Search className="w-5 h-5 mr-2" />
                        Buscar por ID
                    </button>
                </div>
            )}

            {/* Vista de lista de mascotas con historias */}
            {!historia && vistaActual === 'lista' && (
                <div>
                    <div className="mb-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Mascotas con Historias Clínicas</h3>
                        <p className="text-gray-600">Haz clic en una mascota para ver su historial médico completo</p>
                    </div>

                    {loadingMascotas ? (
                        <div className="text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-200 border-t-green-600"></div>
                            <p className="mt-4 text-gray-600">Cargando mascotas...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {mascotas.map((idMascota) => (
                                <button
                                    key={idMascota}
                                    onClick={() => buscarHistoria(String(idMascota))}
                                    className="bg-white rounded-xl p-6 border-2 border-green-200 hover:border-green-500 hover:shadow-lg transition-all duration-200 text-left group"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="bg-green-100 p-3 rounded-full group-hover:bg-green-600 transition-colors">
                                            <PawPrint className="w-6 h-6 text-green-600 group-hover:text-white transition-colors" />
                                        </div>
                                        <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                                            ID #{idMascota}
                                        </span>
                                    </div>
                                    <h4 className="text-lg font-bold text-gray-800 mb-2">Mascota #{idMascota}</h4>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <FileText className="w-4 h-4 mr-1" />
                                        <span>Ver historial médico</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Vista de búsqueda manual por ID */}
            {!historia && vistaActual === 'busqueda' && (
                <div>
                    <div className="mb-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Búsqueda Manual por ID</h3>
                        <p className="text-gray-600">Ingresa el ID de la mascota para buscar su historia clínica</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-md border-2 border-green-200">
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label htmlFor="idMascota" className="block text-sm font-semibold text-gray-700 mb-2">
                                    🐾 ID de Mascota
                                </label>
                                <input
                                    type="number"
                                    id="idMascota"
                                    value={idMascota}
                                    onChange={(e) => setIdMascota(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Ej: 1"
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                                />
                            </div>
                            <div className="flex items-end">
                                <button
                                    onClick={() => buscarHistoria()}
                                    disabled={loading}
                                    className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition shadow-md hover:shadow-lg font-medium"
                                >
                                    <Search className="w-5 h-5 mr-2" />
                                    {loading ? 'Buscando...' : 'Buscar'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Mensaje de error */}
            {error && (
                <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 mb-6 mt-6">
                    <p className="text-red-800 font-medium">{error}</p>
                </div>
            )}

            {/* Estado de carga */}
            {loading && (
                <div className="text-center py-12 mt-6">
                    <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-green-200 border-t-green-600"></div>
                    <p className="mt-4 text-gray-700 font-medium text-lg">Cargando historia clínica...</p>
                </div>
            )}

            {/* Historia clínica - DIRECTAMENTE EN LA PÁGINA */}
            {historia && !loading && (
                <div className="mt-6" style={{ backgroundColor: '#ffffff' }}>
                    {/* Header de la historia con opción de cerrar - AHORA EN VERDE */}
                    <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-t-xl px-6 py-5 flex justify-between items-center shadow-lg">
                        <div>
                            <h3 className="text-2xl font-bold text-white flex items-center">
                                <FileText className="w-7 h-7 mr-3" />
                                Historia Clínica - Mascota #{idMascota}
                            </h3>
                            <p className="text-green-100 text-sm mt-1 ml-10">
                                📋 Consulta el historial médico completo
                            </p>
                        </div>
                        <button
                            onClick={limpiarBusqueda}
                            className="flex items-center justify-center w-11 h-11 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full transition-colors"
                            title="Cerrar historial"
                        >
                            <X className="w-6 h-6 text-white" />
                        </button>
                    </div>

                    {/* Contenido de la historia */}
                    <div className="bg-white rounded-b-xl shadow-lg p-6 border-x-2 border-b-2 border-green-300">
                        <HistorialMascota historia={historia} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default BuscadorHistorias;
