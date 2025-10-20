  "use client"

// --- file: src/components/DashboardAdmin.tsx ---
// Dashboard para ADMIN: métricas en tiempo real del sistema.
// Endpoints: GET /api/admin/metricas
import { useEffect, useState } from "react"
import axios from "axios"
import { Calendar, Heart, Package, AlertTriangle, TrendingUp, Users } from "lucide-react"
import { useAuth } from "../context/AuthContext"
import TarjetaMetrica from "./TarjetaMetrica"

interface Metricas {
  citasMes: number
  mascotasActivas: number
  productosMinimos: number
}

/**
 * Dashboard para ADMIN: métricas en tiempo real del sistema
 * Consume el endpoint GET /api/admin/metricas
 */
const DashboardAdmin = () => {
  const { token } = useAuth()
  const [metricas, setMetricas] = useState<Metricas | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    cargarMetricas()
  }, [token])

  /**
   * Carga las métricas del dashboard desde el backend
   */
  const cargarMetricas = async () => {
    console.log("📊 Cargando métricas del dashboard admin...")
    setLoading(true)
    setError(null)

    try {
      const response = await axios.get("http://localhost:8080/api/admin/metricas", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      console.log("✅ Métricas cargadas:", response.data)
      setMetricas(response.data)
    } catch (err: unknown) {
      console.error("❌ Error cargando métricas:", err)
      const error = err as { response?: { data?: string } }
      setError(error.response?.data || "No se pudieron cargar las métricas del sistema")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <div className="bg-emerald-100 p-2 rounded-lg">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
              Panel de Control
            </h1>
            <p className="mt-1 text-sm text-gray-600">Visión general del funcionamiento de la clínica</p>
          </div>
          <button
            onClick={cargarMetricas}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <span className={loading ? "animate-spin" : ""}>🔄</span>
            Actualizar
          </button>
        </div>
      </div>

      {/* Estado de carga */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-emerald-100 border-t-emerald-600"></div>
          <p className="mt-4 text-gray-600 text-sm font-medium">Cargando métricas...</p>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-red-900 font-semibold text-sm">Error al cargar métricas</p>
              <p className="text-red-700 text-sm mt-1">{error}</p>
              <button
                onClick={cargarMetricas}
                className="mt-3 px-3 py-1.5 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
              >
                Reintentar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Métricas - Grid de tarjetas */}
      {metricas && !loading && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Métricas del Sistema</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <TarjetaMetrica
                titulo="Citas este mes"
                valor={metricas.citasMes}
                icono={Calendar}
                colorIcono="text-blue-600"
                colorFondo="bg-blue-50"
              />

              <TarjetaMetrica
                titulo="Mascotas activas"
                valor={metricas.mascotasActivas}
                icono={Heart}
                colorIcono="text-emerald-600"
                colorFondo="bg-emerald-50"
              />

              <TarjetaMetrica
                titulo="Productos con stock bajo"
                valor={metricas.productosMinimos}
                icono={Package}
                colorIcono="text-amber-600"
                colorFondo="bg-amber-50"
              />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-600" />
              Accesos Rápidos
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <a
                href="/admin/veterinarios"
                className="flex items-center gap-3 px-4 py-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors border border-blue-100 hover:border-blue-200"
              >
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">Veterinarios</p>
                  <p className="text-xs text-gray-600">Gestionar personal</p>
                </div>
              </a>

              <a
                href="/admin/inventario"
                className="flex items-center gap-3 px-4 py-3 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors border border-emerald-100 hover:border-emerald-200"
              >
                <div className="bg-emerald-600 p-2 rounded-lg">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">Inventario</p>
                  <p className="text-xs text-gray-600">Control de stock</p>
                </div>
              </a>

              <a
                href="/admin/pagos"
                className="flex items-center gap-3 px-4 py-3 bg-violet-50 rounded-lg hover:bg-violet-100 transition-colors border border-violet-100 hover:border-violet-200"
              >
                <div className="bg-violet-600 p-2 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">Pagos</p>
                  <p className="text-xs text-gray-600">Gestión financiera</p>
                </div>
              </a>
            </div>
          </div>

          {metricas.productosMinimos > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-amber-900 mb-1">Stock Bajo en Inventario</h4>
                  <p className="text-amber-800 text-sm mb-3">
                    Hay <strong>{metricas.productosMinimos}</strong> producto(s) con stock mínimo que requieren
                    reposición.
                  </p>
                  <a
                    href="/admin/inventario"
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-600 text-white text-sm font-medium rounded-md hover:bg-amber-700 transition-colors"
                  >
                    <Package className="w-4 h-4" />
                    Ver Inventario
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default DashboardAdmin
