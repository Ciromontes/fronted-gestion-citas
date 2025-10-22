// --- file: src/components/Sidebar.tsx ---
// Sidebar dinámico según rol. Muestra menús distintos para CLIENTE, VETERINARIO, RECEPCIONISTA y ADMIN.
// Usa NavLink para activar la opción actual.

/* --- file: src/components/Sidebar.tsx --- */
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {
    Home, PawPrint, CalendarCheck, Receipt, Users,
        Stethoscope, ClipboardList, BarChart3, Package, CreditCard, UserCog, CalendarClock
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
                { to: "/veterinario/citas-hoy", label: "Citas de Hoy", icon: <CalendarClock size={18} /> },
                { to: "/veterinario/citas", label: "Todas las Citas", icon: <CalendarCheck size={18} /> },
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
                { to: "/admin/citas-hoy", label: "Citas de Hoy", icon: <CalendarClock size={18} /> },
                { to: "/admin/citas", label: "Todas las Citas", icon: <CalendarCheck size={18} /> },
                { to: "/admin/mascotas", label: "Mascotas", icon: <PawPrint size={18} /> },
                { to: "/admin/historias", label: "Historias", icon: <ClipboardList size={18} /> },
                { to: "/admin/usuarios", label: "Usuarios", icon: <UserCog size={18} /> },
                // Los siguientes quedan como futuros módulos
                // { to: "/admin/veterinarios", label: "Veterinarios", icon: <Stethoscope size={18} /> },
                // { to: "/admin/inventario", label: "Inventario", icon: <Package size={18} /> },
                // { to: "/admin/pagos", label: "Pagos", icon: <CreditCard size={18} /> },
            ],
        },
    ],
};

const Sidebar: React.FC = () => {
    const { rol, token } = useAuth();
    const roleKey = (rol ?? "").toUpperCase();
    const groups = menuByRole[roleKey] ?? [];

    // Badges: conteo de citas de hoy y total de mascotas (sin tocar backend: lectura rápida y caché corta)
    const [citasHoyCount, setCitasHoyCount] = useState<number | null>(null);
    const [mascotasCount, setMascotasCount] = useState<number | null>(null);

    useEffect(() => {
        if (!token) return;
        const now = Date.now();

        // Helper para caché de sesión (TTL 60s)
        const getCache = (k: string) => {
            try {
                const raw = sessionStorage.getItem(k);
                if (!raw) return null;
                const { ts, val } = JSON.parse(raw);
                if (now - ts > 60000) return null; // expira a 60s
                return val;
            } catch { return null; }
        };
        const setCache = (k: string, val: any) => {
            try { sessionStorage.setItem(k, JSON.stringify({ ts: now, val })); } catch {}
        };

        // Citas de hoy (ADMIN y VETERINARIO)
        if (roleKey === 'ADMIN' || roleKey === 'VETERINARIO') {
            const cached = getCache('badge_citas_hoy');
            if (cached !== null) {
                setCitasHoyCount(cached as number);
            } else {
                fetch('http://localhost:8080/api/citas/hoy', { headers: { Authorization: `Bearer ${token}` } })
                    .then(r => r.ok ? r.json() : [])
                    .then((data: any[]) => {
                        const n = Array.isArray(data) ? data.length : 0;
                        setCitasHoyCount(n);
                        setCache('badge_citas_hoy', n);
                    })
                    .catch(() => setCitasHoyCount(null));
            }
        }

        // Mascotas (ADMIN)
        if (roleKey === 'ADMIN') {
            const cachedM = getCache('badge_mascotas');
            if (cachedM !== null) {
                setMascotasCount(cachedM as number);
            } else {
                fetch('http://localhost:8080/api/mascotas', { headers: { Authorization: `Bearer ${token}` } })
                    .then(r => r.ok ? r.json() : [])
                    .then((data: any[]) => {
                        const n = Array.isArray(data) ? data.length : 0;
                        setMascotasCount(n);
                        setCache('badge_mascotas', n);
                    })
                    .catch(() => setMascotasCount(null));
            }
        }
    }, [roleKey, token]);

    const badgeStyle: React.CSSProperties = {
        marginLeft: 8,
        backgroundColor: '#111827',
        color: '#fff',
        borderRadius: 999,
        fontSize: 11,
        lineHeight: '16px',
        padding: '0 6px',
        minWidth: 16,
        textAlign: 'center'
    };

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
                                {/* Badges contextuales */}
                                {it.label === 'Citas de Hoy' && typeof citasHoyCount === 'number' && (
                                  <span style={badgeStyle}>{citasHoyCount}</span>
                                )}
                                {it.label === 'Mascotas' && typeof mascotasCount === 'number' && (
                                  <span style={badgeStyle}>{mascotasCount}</span>
                                )}
                            </NavLink>
                        ))}
                    </nav>
                </div>
            ))}
        </aside>
    );
};

export default Sidebar;
