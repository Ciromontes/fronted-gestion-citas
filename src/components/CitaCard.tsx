// --- file: src/components/CitaCard.tsx ---
// Tarjeta de Cita reutilizable con chips de estado y acciones.
// No toca endpoints: solo representa datos recibidos.
import React from "react";
import { CalendarClock, MessageSquare, PlayCircle } from "lucide-react";

export interface Cita {
    id: number;
    fechaCita: string;  // Fecha de la cita (texto o ISO)
    horaCita: string;   // Hora "HH:mm"
    motivo: string;     // Motivo de la cita
    estadoCita: string; // Programada | En curso | Completada | Cancelada
}

interface Props {
    cita: Cita;
    onPrimaryAction?: (cita: Cita) => void;   // Acción principal (p.ej., iniciar consulta)
    onSecondaryAction?: (cita: Cita) => void; // Acción secundaria (p.ej., agregar notas)
    primaryLabel?: string;                    // Texto botón principal
    secondaryLabel?: string;                  // Texto botón secundario
}

// Mapea texto de estado a clase CSS para color
const estadoToClass = (estado: string) => {
    const k = estado.trim().toLowerCase();
    if (k.includes("program")) return "pill--programada";
    if (k.includes("curso")) return "pill--en-curso";
    if (k.includes("complet")) return "pill--completada";
    if (k.includes("cancel")) return "pill--cancelada";
    return "pill--programada";
};

const CitaCard: React.FC<Props> = ({
                                       cita,
                                       onPrimaryAction,
                                       onSecondaryAction,
                                       primaryLabel = "Acción",
                                       secondaryLabel = "Secundaria",
                                   }) => {
    return (
        <div className="card">
            <div className="card__body">
                {/* Encabezado con fecha y estado visual */}
                <div className="stack" style={{ justifyContent: "space-between" }}>
                    <div className="stack">
                        <CalendarClock size={18} />
                        <strong>{cita.fechaCita}</strong>
                        <span className="muted">• {cita.horaCita}</span>
                    </div>
                    <span className={`pill ${estadoToClass(cita.estadoCita)}`}>
            {cita.estadoCita}
          </span>
                </div>

                <div className="separator" />

                {/* Motivo o detalle de la cita */}
                <p style={{ margin: 0 }}>
                    <span className="muted">Motivo:</span> {cita.motivo}
                </p>

                {/* Acciones opcionales */}
                <div className="stack" style={{ marginTop: "0.75rem" }}>
                    {onPrimaryAction && (
                        <button className="btn btn--primary" onClick={() => onPrimaryAction(cita)}>
                            <PlayCircle size={18} />
                            <span>{primaryLabel}</span>
                        </button>
                    )}
                    {onSecondaryAction && (
                        <button className="btn btn--ghost" onClick={() => onSecondaryAction(cita)}>
                            <MessageSquare size={18} />
                            <span>{secondaryLabel}</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CitaCard;
