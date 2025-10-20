import { CheckCircle, Clock } from 'lucide-react';

interface Cita {
    id: number;
    fechaCita: string;
    horaCita: string;
    motivo: string;
    estadoCita: string;
    idMascota: number;
    duracionMinutos?: number;
    observaciones?: string;
}

interface CitasHoyTableProps {
    citas: Cita[];
    onCompletarCita: (idCita: number) => void;
}

const CitasHoyTable = ({ citas, onCompletarCita }: CitasHoyTableProps) => {
    const formatearHora = (hora: string) => {
        // Formato: "10:30:00" -> "10:30"
        return hora.substring(0, 5);
    };

    const getEstadoColor = (estado: string) => {
        switch (estado) {
            case 'Programada':
                return 'bg-yellow-100 text-yellow-800';
            case 'Completada':
                return 'bg-green-100 text-green-800';
            case 'Cancelada':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hora
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mascota ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Motivo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Duración
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                    </th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {citas.map((cita) => (
                    <tr key={cita.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                                <Clock className="w-4 h-4 text-gray-400 mr-2" />
                                <span className="text-sm font-medium text-gray-900">
                    {formatearHora(cita.horaCita)}
                  </span>
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-900">#{cita.idMascota}</span>
                        </td>
                        <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">{cita.motivo}</div>
                            {cita.observaciones && (
                                <div className="text-sm text-gray-500">{cita.observaciones}</div>
                            )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm text-gray-500">
                  {cita.duracionMinutos || 30} min
                </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getEstadoColor(cita.estadoCita)}`}>
                  {cita.estadoCita}
                </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {cita.estadoCita === 'Programada' && (
                                <button
                                    onClick={() => onCompletarCita(cita.id)}
                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                >
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    Completar
                                </button>
                            )}
                            {cita.estadoCita === 'Completada' && (
                                <span className="text-green-600 font-medium">✓ Completada</span>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default CitasHoyTable;
