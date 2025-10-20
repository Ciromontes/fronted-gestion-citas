// --- file: src/App.tsx ---
// Enrutador principal con rutas protegidas por token y por rol.
// Redirige automáticamente al dashboard adecuado según rol.
// No se tocan endpoints; solo navegación y layout.
import React, { type JSX } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./components/Login";
import Layout from "./components/Layout";
import Citas from "./components/Citas";
import DashboardCliente from "./components/DashboardCliente";
import DashboardVeterinario from "./components/DashboardVeterinario";
import DashboardRecepcionista from "./components/DashboardRecepcionista";
import DashboardAdmin from "./components/DashboardAdmin";
import HistoriasPage from "./components/HistoriasPage";
import TablaUsuarios from "./components/TablaUsuarios";

// Ruta protegida por token
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
    const { token } = useAuth();
    return token ? children : <Navigate to="/login" />;
};

// Ruta restringida por rol
const RoleRoute = ({ allowed, children }: { allowed: string[]; children: JSX.Element }) => {
    const { rol } = useAuth();
    const r = (rol ?? "").toUpperCase();
    return allowed.includes(r) ? children : <Navigate to="/dashboard" />;
};

// Decide dashboard según rol
const ResolveDashboard = () => {
    const { rol } = useAuth();
    const r = (rol ?? "").toUpperCase();
    if (r === "CLIENTE") return <Navigate to="/cliente/mascotas" />;
    if (r === "VETERINARIO") return <Navigate to="/veterinario/agenda" />;
    if (r === "RECEPCIONISTA") return <Navigate to="/recepcionista/citas" />;
    if (r === "ADMIN") return <Navigate to="/admin/dashboard" />;
    return <Navigate to="/login" />;
};

const App: React.FC = () => (
    <AuthProvider>
        <BrowserRouter>
            <Routes>
                {/* Público */}
                <Route path="/login" element={<Login />} />

                {/* Punto de entrada a dashboards por rol */}
                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoute>
                            <ResolveDashboard />
                        </PrivateRoute>
                    }
                />

                {/* CLIENTE */}
                <Route
                    path="/cliente/*"
                    element={
                        <PrivateRoute>
                            <RoleRoute allowed={["CLIENTE"]}>
                                <Layout>
                                    <Routes>
                                        <Route path="mascotas" element={<DashboardCliente />} />
                                        <Route path="citas" element={<Citas />} />
                                        <Route
                                            path="facturacion"
                                            element={
                                                <>
                                                    <h1 className="page__title">Facturación</h1>
                                                    <div className="card"><div className="card__body">Próximamente...</div></div>
                                                </>
                                            }
                                        />
                                        <Route path="*" element={<Navigate to="mascotas" />} />
                                    </Routes>
                                </Layout>
                            </RoleRoute>
                        </PrivateRoute>
                    }
                />

                {/* VETERINARIO */}
                <Route
                    path="/veterinario/*"
                    element={
                        <PrivateRoute>
                            <RoleRoute allowed={["VETERINARIO"]}>
                                <Layout>
                                    <Routes>
                                        <Route path="agenda" element={<DashboardVeterinario />} />
                                        <Route path="historias" element={<HistoriasPage />} />
                                        <Route
                                            path="reportes"
                                            element={
                                                <>
                                                    <h1 className="page__title">Reportes</h1>
                                                    <div className="card"><div className="card__body">Próximamente...</div></div>
                                                </>
                                            }
                                        />
                                        <Route path="*" element={<Navigate to="agenda" />} />
                                    </Routes>
                                </Layout>
                            </RoleRoute>
                        </PrivateRoute>
                    }
                />

                {/* RECEPCIONISTA */}
                <Route
                    path="/recepcionista/*"
                    element={
                        <PrivateRoute>
                            <RoleRoute allowed={["RECEPCIONISTA"]}>
                                <Layout>
                                    <Routes>
                                        <Route path="citas" element={<DashboardRecepcionista />} />
                                        <Route
                                            path="clientes"
                                            element={
                                                <>
                                                    <h1 className="page__title">Clientes</h1>
                                                    <div className="card"><div className="card__body">Próximamente...</div></div>
                                                </>
                                            }
                                        />
                                        <Route path="*" element={<Navigate to="citas" />} />
                                    </Routes>
                                </Layout>
                            </RoleRoute>
                        </PrivateRoute>
                    }
                />

                {/* ADMIN */}
                <Route
                    path="/admin/*"
                    element={
                        <PrivateRoute>
                            <RoleRoute allowed={["ADMIN"]}>
                                <Layout>
                                    <Routes>
                                        <Route path="dashboard" element={<DashboardAdmin />} />
                                        <Route path="usuarios" element={<TablaUsuarios />} />
                                        <Route
                                            path="veterinarios"
                                            element={
                                                <>
                                                    <h1 className="page__title">Veterinarios</h1>
                                                    <div className="card"><div className="card__body">Próximamente...</div></div>
                                                </>
                                            }
                                        />
                                        <Route
                                            path="inventario"
                                            element={
                                                <>
                                                    <h1 className="page__title">Inventario</h1>
                                                    <div className="card"><div className="card__body">
                                                        <table className="table">
                                                            <thead><tr><th>Ítem</th><th>Stock</th><th>Estado</th></tr></thead>
                                                            <tbody>
                                                            <tr><td>Vacuna X</td><td>12</td><td>OK</td></tr>
                                                            <tr><td>Antiparasitario Y</td><td>3</td><td style={{color: "crimson"}}>Bajo</td></tr>
                                                            </tbody>
                                                        </table>
                                                    </div></div>
                                                </>
                                            }
                                        />
                                        <Route
                                            path="pagos"
                                            element={
                                                <>
                                                    <h1 className="page__title">Pagos</h1>
                                                    <div className="card"><div className="card__body">Próximamente...</div></div>
                                                </>
                                            }
                                        />
                                        <Route path="*" element={<Navigate to="dashboard" />} />
                                    </Routes>
                                </Layout>
                            </RoleRoute>
                        </PrivateRoute>
                    }
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </BrowserRouter>
    </AuthProvider>
);

export default App;
