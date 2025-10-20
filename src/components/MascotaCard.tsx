// --- file: src/components/MascotaCard.tsx ---
// Tarjeta para mostrar una mascota con foto, especie y edad, y acciones rápidas.
// Solo UI, no llama endpoints.
import React from "react";
import { CalendarPlus, FileText } from "lucide-react";

interface Props {
    fotoUrl?: string;   // URL de foto (opcional)
    nombre: string;     // Nombre de la mascota
    especie: string;    // Especie
    edad: string;       // Edad legible (p.ej., "3 años")
    onVerHistorial?: () => void; // Acción para ver historial
    onAgendar?: () => void;      // Acción para agendar cita
}

const MascotaCard: React.FC<Props> = ({
                                          fotoUrl,
                                          nombre,
                                          especie,
                                          edad,
                                          onVerHistorial,
                                          onAgendar
                                      }) => {
    return (
        <div className="card">
            <div className="card__body" style={{ display: "grid", gridTemplateColumns: "64px 1fr", gap: "0.75rem" }}>
                {/* Avatar de la mascota */}
                <img
                    src={fotoUrl || "https://placehold.co/128x128?text=🐾"}
                    alt={`Foto de ${nombre}`}
                    width={64}
                    height={64}
                    style={{ borderRadius: 12, objectFit: "cover" }}
                />

                {/* Datos y acciones */}
                <div>
                    <h3 className="card__title">{nombre}</h3>
                    <p className="card__subtitle">{especie} • {edad}</p>

                    <div className="stack" style={{ marginTop: "0.6rem" }}>
                        <button className="btn btn--primary" onClick={onAgendar}>
                            <CalendarPlus size={18} />
                            <span>Agendar cita</span>
                        </button>
                        <button className="btn btn--ghost" onClick={onVerHistorial}>
                            <FileText size={18} />
                            <span>Ver historial</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MascotaCard;
