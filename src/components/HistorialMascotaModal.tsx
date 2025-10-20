/**
 * Modal que muestra el historial clínico completo de una mascota
 * Incluye: historia clínica, entradas médicas, signos vitales, observaciones
 */

import React, { useEffect, useState } from 'react';
import { X, Activity, Calendar, Thermometer, Heart, Weight, FileText, ClipboardList } from 'lucide-react';
import type { HistorialCompleto, EntradaHistoria } from '../types/historial';
import { historialService } from '../services/historialService';

interface Props {
  idMascota: number;
  nombreMascota: string;
  onClose: () => void;
}

const HistorialMascotaModal: React.FC<Props> = ({
  idMascota,
  nombreMascota,
  onClose
}) => {
  const [historial, setHistorial] = useState<HistorialCompleto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarHistorial = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');

        if (!token) {
          throw new Error('No hay sesión activa');
        }

        const data = await historialService.obtenerHistorialCompleto(
          idMascota,
          token
        );
        setHistorial(data);
        setError(null);
      } catch (err: any) {
        console.error('❌ Error cargando historial:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    cargarHistorial();
  }, [idMascota]);

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Cerrar modal al presionar ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-5 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold flex items-center">
              <Activity className="w-7 h-7 mr-3" />
              Historial Clínico - {nombreMascota}
            </h2>
            <p className="text-green-100 text-sm mt-1">
              Registro completo de consultas veterinarias
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
            title="Cerrar (ESC)"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Loading */}
          {loading && (
            <div className="flex flex-col justify-center items-center py-16">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-200 border-t-green-600"></div>
              <p className="mt-4 text-gray-600 font-medium">Cargando historial clínico...</p>
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 text-center">
              <div className="text-red-600 text-5xl mb-3">❌</div>
              <p className="font-semibold text-red-800 text-lg mb-2">Error al cargar historial</p>
              <p className="text-red-700">{error}</p>
              <button
                onClick={onClose}
                className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Cerrar
              </button>
            </div>
          )}

          {/* Contenido */}
          {!loading && !error && historial && (
            <>
              {/* Info de la historia */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-5 mb-6 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-blue-600" />
                      Información General
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-700">
                        <span className="font-semibold">📋 Historia Clínica N°:</span>{' '}
                        <span className="text-blue-600 font-bold">#{historial.historia.idHistoria}</span>
                      </p>
                      <p className="text-gray-700">
                        <span className="font-semibold">📅 Fecha de creación:</span>{' '}
                        <span className="font-medium">{formatearFecha(historial.historia.fechaCreacion)}</span>
                      </p>
                      <p className="text-gray-700">
                        <span className="font-semibold">🐾 ID Mascota:</span>{' '}
                        <span className="font-medium">#{historial.mascotaId}</span>
                      </p>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg px-4 py-3 shadow-sm border-2 border-blue-300">
                    <p className="text-xs text-gray-600 font-semibold">Total de consultas</p>
                    <p className="text-3xl font-bold text-blue-600 text-center">
                      {historial.totalEntradas}
                    </p>
                  </div>
                </div>
              </div>

              {/* Entradas médicas */}
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <ClipboardList className="w-6 h-6 mr-2 text-green-600" />
                  Entradas Médicas
                </h3>

                {historial.entradas.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                    <div className="text-6xl mb-4">📋</div>
                    <p className="text-lg font-semibold text-gray-700 mb-2">
                      Sin consultas registradas
                    </p>
                    <p className="text-sm text-gray-500">
                      Las visitas veterinarias aparecerán aquí automáticamente
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {historial.entradas
                      .sort((a, b) => new Date(b.fechaEntrada).getTime() - new Date(a.fechaEntrada).getTime())
                      .map((entrada, index) => (
                        <EntradaMedicaCard
                          key={entrada.idEntrada}
                          entrada={entrada}
                          isRecent={index === 0}
                        />
                      ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-medium"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Tarjeta individual de entrada médica
 */
const EntradaMedicaCard: React.FC<{ entrada: EntradaHistoria; isRecent: boolean }> = ({
  entrada,
  isRecent
}) => {
  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatearFechaHora = (fechaHora: string) => {
    return new Date(fechaHora).toLocaleString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`border-2 rounded-xl p-5 bg-white shadow-md hover:shadow-lg transition-all ${
      isRecent ? 'border-green-400 bg-green-50' : 'border-gray-200'
    }`}>
      {/* Header de la entrada */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Calendar className="w-5 h-5 text-green-600 mr-2" />
          <span className="text-lg font-bold text-gray-900">
            {formatearFecha(entrada.fechaEntrada)}
          </span>
          {isRecent && (
            <span className="ml-3 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full">
              MÁS RECIENTE
            </span>
          )}
        </div>
        <span className="text-xs text-gray-500">
          Registrado: {formatearFechaHora(entrada.fechaRegistro)}
        </span>
      </div>

      {/* Signos vitales */}
      {(entrada.pesoActual || entrada.temperatura || entrada.frecuenciaCardiaca) && (
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-lg p-4 mb-4">
          <p className="text-sm font-bold text-gray-700 mb-3 flex items-center">
            <Activity className="w-4 h-4 mr-2 text-blue-600" />
            Signos Vitales
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {entrada.pesoActual && (
              <div className="flex items-center bg-white rounded-lg p-3 shadow-sm">
                <Weight className="w-5 h-5 text-purple-600 mr-3" />
                <div>
                  <p className="text-xs text-gray-500">Peso</p>
                  <p className="text-lg font-bold text-gray-900">{entrada.pesoActual} kg</p>
                </div>
              </div>
            )}
            {entrada.temperatura && (
              <div className="flex items-center bg-white rounded-lg p-3 shadow-sm">
                <Thermometer className="w-5 h-5 text-red-600 mr-3" />
                <div>
                  <p className="text-xs text-gray-500">Temperatura</p>
                  <p className="text-lg font-bold text-gray-900">{entrada.temperatura}°C</p>
                </div>
              </div>
            )}
            {entrada.frecuenciaCardiaca && (
              <div className="flex items-center bg-white rounded-lg p-3 shadow-sm">
                <Heart className="w-5 h-5 text-pink-600 mr-3" />
                <div>
                  <p className="text-xs text-gray-500">Frecuencia Cardíaca</p>
                  <p className="text-lg font-bold text-gray-900">{entrada.frecuenciaCardiaca} lpm</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Descripción */}
      <div className="mb-4">
        <p className="text-sm font-bold text-gray-700 mb-2 flex items-center">
          <FileText className="w-4 h-4 mr-2 text-gray-600" />
          Descripción de la Consulta
        </p>
        <p className="text-gray-800 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-200">
          {entrada.descripcion}
        </p>
      </div>

      {/* Observaciones */}
      {entrada.observaciones && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
          <p className="text-sm font-bold text-yellow-800 mb-2">
            📌 Observaciones Importantes
          </p>
          <p className="text-sm text-yellow-900 leading-relaxed">
            {entrada.observaciones}
          </p>
        </div>
      )}

      {/* Footer con IDs */}
      <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between text-xs text-gray-500">
        <span>ID Entrada: #{entrada.idEntrada}</span>
        <span>Veterinario ID: #{entrada.idVeterinario}</span>
        {entrada.idTratamiento && <span>Tratamiento ID: #{entrada.idTratamiento}</span>}
      </div>
    </div>
  );
};

export default HistorialMascotaModal;
