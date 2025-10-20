// --- file: src/components/Layout.tsx ---
// Layout general: compone Navbar + Sidebar + área de contenido.
// Envuelve cada dashboard o página protegida para consistencia visual.


/* --- file: src/components/Layout.tsx --- */
import React from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
    // Compone la vista con navbar fija, sidebar contextual por rol y el contenido.
    return (
        <>
            <Navbar />
            <div className="layout">
                <Sidebar />
                <main className="content">
                    {children}
                </main>
            </div>
        </>
    );
};

export default Layout;
