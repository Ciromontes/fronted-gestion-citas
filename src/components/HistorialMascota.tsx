import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import FormEntradaHistoria from './FormEntradaHistoria';
import { Calendar, User, FileText, Plus, Activity, Thermometer, Weight } from 'lucide-react';

interface HistoriaClinica {
    idHistoria: number;
    idMascota: number;
    fechaCreacion: string;
}

interface EntradaHistoria {
    idEntrada: number;
    fechaEntrada: string; // LocalDate en backend
    descripcion: string;
    observaciones: string;
    pesoActual: number;
    temperatura: number;
    frecuenciaCardiaca: number;
    idVeterinario: number;
}

interface HistorialMascotaProps {
    historia: HistoriaClinica;
}

/**
 * Componente que muestra el historial médico completo de una mascota
 * y permite agregar nuevas entradas.
 */
const HistorialMascota = ({ historia }: HistorialMascotaProps) => {
    const { token } = useAuth();
    const [entradas, setEntradas] = useState<EntradaHistoria[]>([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        cargarEntradas();
    }, [historia.idHistoria]);

    /**
     * Carga todas las entradas médicas de la historia clínica
     */
    const cargarEntradas = async () => {
        console.log('📂 Cargando entradas para historia ID:', historia.idHistoria);
        setLoading(true);

        try {
            const response = await axios.get(
                `http://localhost:8080/api/historias/${historia.idHistoria}/entradas`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            console.log('✅ Entradas cargadas:', response.data);
            setEntradas(response.data);
        } catch (err: any) {
            console.error('❌ Error cargando entradas:', err);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Formatea una fecha LocalDate de Java (YYYY-MM-DD) a formato legible
     */
    const formatearFecha = (fecha: string) => {
        return new Date(fecha + 'T00:00:00').toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    /**
     * Callback cuando se agrega una entrada exitosamente
     */
    const handleEntradaAgregada = () => {
        setShowForm(false);
        cargarEntradas();
    };

    return (
        <div className="mt-6">
            {/* Cabecera de la historia clínica - Mejorada para mejor visibilidad en modal */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-xl p-5 mb-6 shadow-sm">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Historia Clínica</h3>
                        <div className="text-sm text-gray-700 space-y-1">
                            <p className="font-medium">📋 ID Historia: <span className="text-blue-700">#{historia.idHistoria}</span></p>
                            <p className="font-medium">🐾 Mascota ID: <span className="text-blue-700">#{historia.idMascota}</span></p>
                            <p className="font-medium">📅 Creada: <span className="text-gray-900">{new Date(historia.fechaCreacion).toLocaleDateString('es-ES')}</span></p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="flex items-center px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-md hover:shadow-lg font-medium"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        {showForm ? 'Cancelar' : 'Nueva Entrada'}
                    </button>
                </div>
            </div>

            {/* Formulario de nueva entrada (condicional) - Con mejor contraste */}
            {showForm && (
                <div className="mb-6">
                    <FormEntradaHistoria
                        idHistoria={historia.idHistoria}
                        onEntradaAgregada={handleEntradaAgregada}
                        onCancelar={() => setShowForm(false)}
                    />
                </div>
            )}

            {/* Estado de carga */}
            {loading && (
                <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
                    <p className="mt-4 text-gray-700 font-medium text-lg">Cargando entradas médicas...</p>
                </div>
            )}

            {/* Estado vacío - Mejorado */}
            {!loading && entradas.length === 0 && (
                <div className="text-center py-16 bg-white rounded-xl shadow-sm border-2 border-dashed border-gray-300">
                    <FileText className="w-20 h-20 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-700 text-xl font-semibold">No hay entradas médicas registradas</p>
                    <p className="text-gray-600 text-base mt-2">Agrega la primera entrada usando el botón superior</p>
                </div>
            )}

            {/* Lista de entradas - Con mejor contraste y espaciado */}
            {!loading && entradas.length > 0 && (
                <div className="space-y-5">
                    <div className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                        <h4 className="text-xl font-bold text-gray-900">
                            📝 Entradas Médicas
                        </h4>
                        <span className="px-4 py-1.5 bg-blue-600 text-white rounded-full font-semibold text-sm">
                            {entradas.length} {entradas.length === 1 ? 'Registro' : 'Registros'}
                        </span>
                    </div>

                    {entradas.map((entrada, index) => (
                        <div key={entrada.idEntrada} className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                            {/* Encabezado de la entrada - Mejorado */}
                            <div className="flex justify-between items-start mb-5 pb-4 border-b-2 border-gray-100">
                                <div className="flex items-center bg-blue-50 px-4 py-2 rounded-lg">
                                    <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                                    <span className="font-bold text-gray-900">{formatearFecha(entrada.fechaEntrada)}</span>
                                </div>
                                <div className="flex items-center bg-purple-50 px-4 py-2 rounded-lg">
                                    <User className="w-5 h-5 mr-2 text-purple-600" />
                                    <span className="font-semibold text-gray-900">Dr. Vet #{entrada.idVeterinario}</span>
                                </div>
                            </div>

                            {/* Número de entrada */}
                            <div className="mb-4">
                                <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold">
                                    Entrada #{entradas.length - index}
                                </span>
                            </div>

                            {/* Signos vitales (si existen) - Con mejor visualización */}
                            {(entrada.pesoActual || entrada.temperatura || entrada.frecuenciaCardiaca) && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border-2 border-blue-200">
                                    {entrada.pesoActual && (
                                        <div className="flex items-center bg-white p-3 rounded-lg shadow-sm">
                                            <div className="bg-blue-100 p-2 rounded-full mr-3">
                                                <Weight className="w-6 h-6 text-blue-700" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-600 font-medium uppercase">Peso</p>
                                                <p className="font-bold text-gray-900 text-lg">{entrada.pesoActual} kg</p>
                                            </div>
                                        </div>
                                    )}
                                    {entrada.temperatura && (
                                        <div className="flex items-center bg-white p-3 rounded-lg shadow-sm">
                                            <div className="bg-red-100 p-2 rounded-full mr-3">
                                                <Thermometer className="w-6 h-6 text-red-700" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-600 font-medium uppercase">Temperatura</p>
                                                <p className="font-bold text-gray-900 text-lg">{entrada.temperatura} °C</p>
                                            </div>
                                        </div>
                                    )}
                                    {entrada.frecuenciaCardiaca && (
                                        <div className="flex items-center bg-white p-3 rounded-lg shadow-sm">
                                            <div className="bg-green-100 p-2 rounded-full mr-3">
                                                <Activity className="w-6 h-6 text-green-700" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-600 font-medium uppercase">Frec. Cardíaca</p>
                                                <p className="font-bold text-gray-900 text-lg">{entrada.frecuenciaCardiaca} lpm</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Descripción médica - Con mejor tipografía */}
                            <div className="space-y-4">
                                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
                                    <h5 className="font-bold text-gray-900 mb-2 text-base flex items-center">
                                        <span className="bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2">!</span>
                                        Descripción Médica:
                                    </h5>
                                    <p className="text-gray-800 whitespace-pre-line leading-relaxed text-base">{entrada.descripcion}</p>
                                </div>

                                {/* Observaciones (opcional) - Con mejor contraste */}
                                {entrada.observaciones && (
                                    <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                                        <h5 className="font-bold text-gray-900 mb-2 text-base flex items-center">
                                            <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2">✓</span>
                                            Observaciones y Tratamiento:
                                        </h5>
                                        <p className="text-gray-800 whitespace-pre-line leading-relaxed text-base">{entrada.observaciones}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HistorialMascota;
