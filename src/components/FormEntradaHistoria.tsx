import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { X } from 'lucide-react';

interface FormEntradaHistoriaProps {
    idHistoria: number;
    onEntradaAgregada: () => void;
    onCancelar: () => void;
}

/**
 * Formulario para agregar una nueva entrada médica a una historia clínica.
 * Incluye campos para descripción general, signos vitales y observaciones.
 */
const FormEntradaHistoria = ({ idHistoria, onEntradaAgregada, onCancelar }: FormEntradaHistoriaProps) => {
    const { token } = useAuth();

    // Estados para cada campo del formulario
    const [descripcion, setDescripcion] = useState('');
    const [observaciones, setObservaciones] = useState('');
    const [pesoActual, setPesoActual] = useState('');
    const [temperatura, setTemperatura] = useState('');
    const [frecuenciaCardiaca, setFrecuenciaCardiaca] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Maneja el envío del formulario
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validación: descripción es obligatoria
        if (!descripcion.trim()) {
            setError('La descripción es obligatoria');
            return;
        }

        console.log('📝 Agregando entrada a historia ID:', idHistoria);
        setLoading(true);
        setError(null);

        try {
            // Construir el objeto con los datos de la entrada
            const entradaData: any = {
                descripcion: descripcion.trim(),
                observaciones: observaciones.trim() || null
            };

            // Agregar signos vitales solo si se proporcionaron
            if (pesoActual) {
                entradaData.pesoActual = parseFloat(pesoActual);
            }
            if (temperatura) {
                entradaData.temperatura = parseFloat(temperatura);
            }
            if (frecuenciaCardiaca) {
                entradaData.frecuenciaCardiaca = parseInt(frecuenciaCardiaca);
            }

            console.log('📤 Datos a enviar:', entradaData);

            const response = await axios.post(
                `http://localhost:8080/api/historias/${idHistoria}/entrada`,
                entradaData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('✅ Entrada agregada exitosamente:', response.data);
            onEntradaAgregada(); // Notificar al componente padre
        } catch (err: any) {
            console.error('❌ Error agregando entrada:', err);
            setError(err.response?.data || 'Error al agregar la entrada médica');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white border border-gray-300 rounded-lg p-6 mb-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold text-gray-900">Nueva Entrada Médica</h4>
                <button
                    onClick={onCancelar}
                    className="text-gray-400 hover:text-gray-600"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                    <p className="text-red-800 text-sm">{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Descripción general (obligatorio) */}
                <div>
                    <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
                        Descripción General *
                    </label>
                    <textarea
                        id="descripcion"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        rows={4}
                        placeholder="Describe el motivo de consulta, diagnóstico y hallazgos principales..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                    />
                </div>

                {/* Signos vitales */}
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="peso" className="block text-sm font-medium text-gray-700 mb-1">
                            Peso (kg)
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            id="peso"
                            value={pesoActual}
                            onChange={(e) => setPesoActual(e.target.value)}
                            placeholder="25.50"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label htmlFor="temperatura" className="block text-sm font-medium text-gray-700 mb-1">
                            Temperatura (°C)
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            id="temperatura"
                            value={temperatura}
                            onChange={(e) => setTemperatura(e.target.value)}
                            placeholder="38.50"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label htmlFor="frecuencia" className="block text-sm font-medium text-gray-700 mb-1">
                            Frecuencia Cardíaca (lpm)
                        </label>
                        <input
                            type="number"
                            id="frecuencia"
                            value={frecuenciaCardiaca}
                            onChange={(e) => setFrecuenciaCardiaca(e.target.value)}
                            placeholder="120"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Observaciones adicionales */}
                <div>
                    <label htmlFor="observaciones" className="block text-sm font-medium text-gray-700 mb-1">
                        Observaciones y Tratamiento (opcional)
                    </label>
                    <textarea
                        id="observaciones"
                        value={observaciones}
                        onChange={(e) => setObservaciones(e.target.value)}
                        rows={3}
                        placeholder="Tratamiento prescrito, recomendaciones, próxima cita..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                {/* Botones de acción */}
                <div className="flex gap-3 pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                    >
                        {loading ? 'Guardando...' : 'Guardar Entrada'}
                    </button>
                    <button
                        type="button"
                        onClick={onCancelar}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FormEntradaHistoria;
