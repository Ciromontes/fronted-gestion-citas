// src/components/DashboardCliente.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MascotaCard from "./MascotaCard";
import AgendarCitaModal from "./AgendarCitaModal";
import HistorialMascotaModal from "./HistorialMascotaModal";

// ✅ Tipo actualizado para coincidir con el backend
interface MascotaBackend {
    idMascota: number;  // ← El backend envía "idMascota"
    nombre: string;
    especie: string;
    raza: string;
    edad: number;
    peso: number;
    color: string;
    sexo: string;
    estado: string;
}

// Tipo para el frontend (si MascotaCard espera diferente formato)
interface Mascota {
    id: number;
    nombre: string;
    especie: string;
    edad: string;
    raza?: string;
    fotoUrl?: string;
}

const DashboardCliente: React.FC = () => {
    const [mascotas, setMascotas] = useState<Mascota[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");
    const [modalOpen, setModalOpen] = useState(false);
    const [mascotaSeleccionada, setMascotaSeleccionada] = useState<number | undefined>(undefined);
    const [historialModal, setHistorialModal] = useState<{ id: number; nombre: string } | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadMisMascotas = async () => {
            try {
                setLoading(true);
                console.log("🔄 Cargando mascotas...");

                const token = localStorage.getItem("token");
                console.log("🔑 Token:", token ? "Presente" : "Faltante");

                if (!token) {
                    setError("No hay sesión activa. Por favor inicia sesión.");
                    setLoading(false);
                    return;
                }

                const response = await axios.get<MascotaBackend[]>(
                    "http://localhost:8080/api/mascotas/mias",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                    }
                );

                console.log("✅ Respuesta raw:", response.data);
                console.log("📊 Tipo de datos:", Array.isArray(response.data) ? "Array" : typeof response.data);

                // ✅ Mapear de formato backend a formato frontend
                if (Array.isArray(response.data)) {
                    const mascotasMapeadas: Mascota[] = response.data.map((m: MascotaBackend) => ({
                        id: m.idMascota,  // ← Convertir idMascota → id
                        nombre: m.nombre,
                        especie: m.especie,
                        edad: `${m.edad} años`,  // ← Convertir número a string
                        raza: m.raza,
                        fotoUrl: undefined  // Agregar foto por defecto si tienes
                    }));

                    console.log("🐕 Mascotas mapeadas:", mascotasMapeadas);
                    setMascotas(mascotasMapeadas);
                    setError("");
                } else {
                    console.warn("⚠️ Formato inesperado de respuesta:", response.data);
                    setMascotas([]);
                    setError("El servidor devolvió un formato inesperado");
                }

            } catch (err: any) {
                console.error("❌ Error cargando mascotas:", err);
                console.error("📄 Respuesta error:", err?.response?.data);
                console.error("📄 Status:", err?.response?.status);

                if (err?.response?.status === 401) {
                    setError("Sesión expirada. Por favor inicia sesión nuevamente.");
                    // Opcional: redirigir al login
                    // navigate('/login');
                } else {
                    const message = err?.response?.data?.message ||
                        err?.response?.data ||
                        err?.message ||
                        "Error desconocido al cargar mascotas";
                    setError(`No se pudieron cargar tus mascotas: ${message}`);
                }

                setMascotas([]);
            } finally {
                setLoading(false);
            }
        };

        loadMisMascotas();
    }, []);

    const handleAgendar = (idMascota: number) => {
        setMascotaSeleccionada(idMascota);
        setModalOpen(true);
    };

    const handleVerHistorial = (idMascota: number, nombreMascota: string) => {
        setHistorialModal({ id: idMascota, nombre: nombreMascota });
    };

    const handleModalClose = () => {
        setModalOpen(false);
        setMascotaSeleccionada(undefined);
    };

    const handleSuccess = () => {
        // Recargar mascotas o redirigir a citas
        navigate("/cliente/citas");
    };

    if (loading) {
        return (
            <div>
                <h1 className="page__title">Mis Mascotas</h1>
                <p>Cargando...</p>
            </div>
        );
    }

    return (
        <>
            <h1 className="page__title">Mis Mascotas</h1>
            <p className="page__subtitle">
                Accede rápidamente a la información y agenda nuevas citas.
            </p>

            {error && (
                <div style={{
                    padding: "1rem",
                    marginBottom: "1rem",
                    backgroundColor: "#fee",
                    color: "#c00",
                    borderRadius: "4px"
                }}>
                    {error}
                </div>
            )}

            <div className="grid grid--cards">
                {mascotas.length > 0 ? (
                    mascotas.map((m) => (
                        <div key={m.id}>
                            <MascotaCard
                                fotoUrl={m.fotoUrl}
                                nombre={m.nombre}
                                especie={m.especie}
                                edad={m.edad}
                                onAgendar={() => handleAgendar(m.id)}
                                onVerHistorial={() => handleVerHistorial(m.id, m.nombre)}
                            />
                        </div>
                    ))
                ) : (
                    <p style={{ gridColumn: "1 / -1", textAlign: "center", color: "#6b7280" }}>
                        No tienes mascotas registradas aún.
                    </p>
                )}
            </div>

            {/* Botón flotante para nueva cita */}
            <div className="fab">
                <button className="btn btn--primary" onClick={() => setModalOpen(true)}>
                    <Plus size={18} />
                    <span> Nueva cita</span>
                </button>
            </div>

            {/* Modal de agendar cita */}
            <AgendarCitaModal
                isOpen={modalOpen}
                onClose={handleModalClose}
                mascotaPreseleccionada={mascotaSeleccionada}
                onSuccess={handleSuccess}
            />

            {/* Modal de historial clínico */}
            {historialModal && (
                <HistorialMascotaModal
                    idMascota={historialModal.id}
                    nombreMascota={historialModal.nombre}
                    onClose={() => setHistorialModal(null)}
                />
            )}
        </>
    );
};

export default DashboardCliente;
