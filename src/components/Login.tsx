// --- file: src/components/Login.tsx ---
// Pantalla de login: conserva endpoint POST /api/auth/login (NO se modifica).
// Tras login exitoso, guarda token/rol y navega a /dashboard para resolver por rol.
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
    const [email, setEmail] = useState("");     // Email del usuario
    const [password, setPassword] = useState(""); // Contraseña
    const [error, setError] = useState("");     // Mensaje de error
    const { login } = useAuth();                // Función del contexto para guardar token/rol
    const navigate = useNavigate();             // Hook para navegación

    // Maneja envío del formulario
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            // Llamada al endpoint de autenticación (sin cambios)
            const res = await axios.post("http://localhost:8080/api/auth/login", {
                email,
                password,
            });
            // Guarda token y rol
            login(res.data.token, res.data.rol);
            // Redirige a /dashboard para resolver el destino por rol
            navigate("/dashboard");
        } catch {
            setError("Credenciales incorrectas");
        }
    };

    return (
        <div style={{ maxWidth: 420, margin: "6vh auto", padding: 20 }}>
            <h2 className="page__title">Iniciar sesión</h2>
            <p className="page__subtitle">Accede a tu cuenta para continuar.</p>
            <form onSubmit={handleSubmit} className="card" style={{ padding: 16 }}>
                <input
                    type="email"
                    placeholder="Correo"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    style={{ width: "100%", marginBottom: 10, padding: 10, borderRadius: 10, border: "1px solid #e5e7eb" }}
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    style={{ width: "100%", marginBottom: 10, padding: 10, borderRadius: 10, border: "1px solid #e5e7eb" }}
                />
                <button type="submit" className="btn btn--primary" style={{ width: "100%", justifyContent: "center" }}>
                    Entrar
                </button>
                {error && <p style={{ color: "crimson", marginTop: 8 }}>{error}</p>}
            </form>
        </div>
    );
};

export default Login;
