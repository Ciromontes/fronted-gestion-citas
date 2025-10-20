// --- file: src/components/Sidebar.tsx ---
// Sidebar dinámico según rol. Muestra menús distintos para CLIENTE, VETERINARIO, RECEPCIONISTA y ADMIN.
// Usa NavLink para activar la opción actual.

/* --- file: src/components/Sidebar.tsx --- */
import React from "react";
import { NavLink } from "react-router-dom";
import {
    Home, PawPrint, CalendarCheck, Receipt, Users,
    Stethoscope, ClipboardList, BarChart3, Package, CreditCard, UserCog
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

type MenuItem = { to: string; label: string; icon: React.ReactNode };
type MenuGroup = { title: string; items: MenuItem[] };
const menuByRole: Record<string, MenuGroup[]> = {
    CLIENTE: [
        {
            title: "Mi cuenta",
            items: [
                { to: "/cliente/mascotas", label: "Mascotas", icon: <PawPrint size={18} /> },
                { to: "/cliente/citas", label: "Citas", icon: <CalendarCheck size={18} /> },
                { to: "/cliente/facturacion", label: "Facturación", icon: <Receipt size={18} /> },
            ],
        },
    ],
    VETERINARIO: [
        {
            title: "Consultorio",
            items: [
                { to: "/veterinario/agenda", label: "Agenda", icon: <CalendarCheck size={18} /> },
                { to: "/veterinario/historias", label: "Historias", icon: <ClipboardList size={18} /> },
                { to: "/veterinario/reportes", label: "Reportes", icon: <BarChart3 size={18} /> },
            ],
        },
    ],
    RECEPCIONISTA: [
        {
            title: "Recepción",
            items: [
                { to: "/recepcionista/citas", label: "Citas", icon: <CalendarCheck size={18} /> },
                { to: "/recepcionista/clientes", label: "Clientes", icon: <Users size={18} /> },
            ],
        },
    ],
    ADMIN: [
        {
            title: "Administración",
            items: [
                { to: "/admin/dashboard", label: "Dashboard", icon: <Home size={18} /> },
                { to: "/admin/usuarios", label: "Usuarios", icon: <UserCog size={18} /> },
                { to: "/admin/veterinarios", label: "Veterinarios", icon: <Stethoscope size={18} /> },
                { to: "/admin/inventario", label: "Inventario", icon: <Package size={18} /> },
                { to: "/admin/pagos", label: "Pagos", icon: <CreditCard size={18} /> },
            ],
        },
    ],
};

const Sidebar: React.FC = () => {
    const { rol } = useAuth();
    const roleKey = (rol ?? "").toUpperCase();
    const groups = menuByRole[roleKey] ?? [];

    return (
        <aside className="sidebar">
            {groups.map((g) => (
                <div className="sidebar__group" key={g.title}>
                    <h4 className="sidebar__title">{g.title}</h4>
                    <nav className="sidebar__nav">
                        {g.items.map((it) => (
                            <NavLink
                                key={it.to}
                                to={it.to}
                                className={({ isActive }) =>
                                    `sidebar__link${isActive ? " sidebar__link--active" : ""}`
                                }
                            >
                                {it.icon}
                                <span>{it.label}</span>
                            </NavLink>
                        ))}
                    </nav>
                </div>
            ))}
        </aside>
    );
};

export default Sidebar;
