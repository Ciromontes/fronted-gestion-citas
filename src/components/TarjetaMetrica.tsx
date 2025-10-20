import type { LucideIcon } from "lucide-react"

interface TarjetaMetricaProps {
  titulo: string
  valor: number | string
  icono: LucideIcon
  colorIcono?: string
  colorFondo?: string
}

/**
 * Componente reutilizable para mostrar métricas del dashboard admin
 * Muestra un título, valor numérico y un icono con colores personalizables
 */
const TarjetaMetrica = ({
  titulo,
  valor,
  icono: Icono,
  colorIcono = "text-blue-600",
  colorFondo = "bg-blue-50",
}: TarjetaMetricaProps) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">{titulo}</p>
          <p className="text-2xl font-bold text-gray-900">{valor}</p>
        </div>
        <div className={`${colorFondo} p-3 rounded-lg`}>
          <Icono className={`w-6 h-6 ${colorIcono}`} />
        </div>
      </div>
    </div>
  )
}

export default TarjetaMetrica
