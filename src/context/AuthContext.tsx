import { createContext, useState, useContext, type ReactNode } from "react";

interface AuthContextType {
    token: string | null;
    rol: string | null;
    login: (token: string, rol: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
    const [rol, setRol] = useState<string | null>(localStorage.getItem("rol"));

    // Guarda token y rol en localStorage y estado
    const login = (token: string, rol: string) => {
        setToken(token);
        setRol(rol);
        localStorage.setItem("token", token);
        localStorage.setItem("rol", rol);
    };

    // Elimina token y rol
    const logout = () => {
        setToken(null);
        setRol(null);
        localStorage.removeItem("token");
        localStorage.removeItem("rol");
    };

    return (
        <AuthContext.Provider value={{ token, rol, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook para usar el contexto
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
    return context;
};