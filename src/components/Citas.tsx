// --- file: src/components/Citas.tsx ---
// Listado de citas genérico con UI moderna reutilizando CitaCard.
// Endpoint: GET /api/citas (NO se modifica).
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Plus } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import CitaCard, {type Cita } from "./CitaCard";
import AgendarCitaModal from "./AgendarCitaModal";

const Citas: React.FC = () => {
    const { token } = useAuth();
    const [citas, setCitas] = useState<Cita[]>([]);
    const [error, setError] = useState("");
    const [modalOpen, setModalOpen] = useState(false);

    // Obtiene las citas usando el token (sin cambiar endpoint)
    useEffect(() => {
        const fetchCitas = async () => {
            try {
                const res = await axios.get("http://localhost:8080/api/citas", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCitas(res.data);
            } catch {
                setError("No se pudieron cargar las citas");
            }
        };
        fetchCitas();
    }, [token]);

    const handleSuccess = () => {
        // Recargar la lista de citas
        const fetchCitas = async () => {
            try {
                const res = await axios.get("http://localhost:8080/api/citas", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCitas(res.data);
            } catch {
                setError("No se pudieron cargar las citas");
            }
        };
        fetchCitas();
    };

    return (
        <>
            <div className="stack" style={{ justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <div>
                    <h1 className="page__title">Mis Citas</h1>
                    <p className="page__subtitle">Consulta y administra tus próximas citas.</p>
                </div>
                <button className="btn btn--primary" onClick={() => setModalOpen(true)}>
                    <Plus size={18} />
                    <span>Nueva cita</span>
                </button>
            </div>

            {error && <p style={{ color: "crimson" }}>{error}</p>}

            {/* Lista de tarjetas de citas */}
            <div className="grid" style={{ gridTemplateColumns: "1fr", gap: "1rem" }}>
                {citas.map((c) => (
                    <CitaCard key={c.id} cita={c} />
                ))}
            </div>

            {/* FAB para móviles */}
            <div className="fab">
                <button className="btn btn--primary" onClick={() => setModalOpen(true)}>
                    <Plus size={18} />
                    <span> Nueva cita</span>
                </button>
            </div>

            {/* Modal de agendar cita */}
            <AgendarCitaModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSuccess={handleSuccess}
            />
        </>
    );
};

export default Citas;
