// --- file: src/components/Citas.tsx ---
// Listado de citas con endpoints diferenciados por rol
// CLIENTE: GET /api/citas/mis-citas (solo sus citas)
// ADMIN/VETERINARIO: GET /api/citas (todas las citas)
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Plus } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import CitaCard, {type Cita } from "./CitaCard";
import AgendarCitaModal from "./AgendarCitaModal";

const Citas: React.FC = () => {
    const { token, rol } = useAuth();
    const [citas, setCitas] = useState<Cita[]>([]);
    const [error, setError] = useState("");
    const [modalOpen, setModalOpen] = useState(false);

    // Determinar endpoint según el rol
    const getEndpoint = () => {
        if (rol === 'CLIENTE') {
            return "http://localhost:8080/api/citas/mis-citas";
        }
        return "http://localhost:8080/api/citas";
    };

    const titulo = rol === 'CLIENTE' ? 'Mis Citas' : 'Todas las Citas';
    const subtitulo = rol === 'CLIENTE'
        ? 'Consulta y administra tus próximas citas.'
        : (rol === 'VETERINARIO' ? 'Coordinación de agenda del consultorio.' : 'Supervisión y coordinación del sistema.');

    // Obtiene las citas usando el endpoint correcto según rol
    useEffect(() => {
        const fetchCitas = async () => {
            try {
                const res = await axios.get(getEndpoint(), {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCitas(res.data);
            } catch {
                setError("No se pudieron cargar las citas");
            }
        };
        fetchCitas();
    }, [token, rol]);

    const handleSuccess = () => {
        // Recargar la lista de citas
        const fetchCitas = async () => {
            try {
                const res = await axios.get(getEndpoint(), {
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
                    <h1 className="page__title">{titulo}</h1>
                    <p className="page__subtitle">{subtitulo}</p>
                </div>
                {rol === 'CLIENTE' && (
                  <button className="btn btn--primary" onClick={() => setModalOpen(true)}>
                      <Plus size={18} />
                      <span>Nueva cita</span>
                  </button>
                )}
            </div>

            {error && <p style={{ color: "crimson" }}>{error}</p>}

            {/* Lista de tarjetas de citas */}
            <div className="grid" style={{ gridTemplateColumns: "1fr", gap: "1rem" }}>
                {citas.map((c) => (
                    <CitaCard key={c.id} cita={c} />
                ))}
            </div>

            {/* FAB para móviles (solo cliente) */}
            {rol === 'CLIENTE' && (
              <div className="fab">
                  <button className="btn btn--primary" onClick={() => setModalOpen(true)}>
                      <Plus size={18} />
                      <span> Nueva cita</span>
                  </button>
              </div>
            )}

            {/* Modal de agendar cita */}
            {rol === 'CLIENTE' && (
              <AgendarCitaModal
                  isOpen={modalOpen}
                  onClose={() => setModalOpen(false)}
                  onSuccess={handleSuccess}
              />
            )}
        </>
    );
};

export default Citas;
