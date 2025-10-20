// --- file: src/components/DashboardRecepcionista.tsx ---
// Dashboard para RECEPCIONISTA: lista y gestión de citas con CTA "Nueva cita".
// Endpoints: GET /api/citas (NO se modifica).
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Plus } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import CitaCard, {type Cita } from "./CitaCard";

const DashboardRecepcionista: React.FC = () => {
    const { token } = useAuth();
    const [citas, setCitas] = useState<Cita[]>([]);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await axios.get("http://localhost:8080/api/citas", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCitas(res.data);
            } catch {
                setError("No se pudieron cargar las citas");
            }
        };
        fetch();
    }, [token]);

    const nuevaCita = () => {
        // Aquí puedes abrir un modal o navegar a un formulario de creación
        alert("Abrir formulario 'Nueva cita'");
    };

    return (
        <>
            <div className="stack" style={{ justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <div>
                    <h1 className="page__title">Gestión de Citas</h1>
                    <p className="page__subtitle">Administra y programa nuevas citas.</p>
                </div>
                <button className="btn btn--primary" onClick={nuevaCita}>
                    <Plus size={18} />
                    <span>Nueva cita</span>
                </button>
            </div>

            {error && <p style={{ color: "crimson" }}>{error}</p>}

            <div className="grid" style={{ gridTemplateColumns: "1fr", gap: "1rem" }}>
                {citas.map((c) => (
                    <CitaCard key={c.id} cita={c} />
                ))}
            </div>

            {/* FAB para móviles */}
            <div className="fab">
                <button className="btn btn--primary" onClick={nuevaCita}>
                    <Plus size={18} />
                    <span> Nueva cita</span>
                </button>
            </div>
        </>
    );
};

export default DashboardRecepcionista;
