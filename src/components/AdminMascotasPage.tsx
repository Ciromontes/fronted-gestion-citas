// --- file: src/components/AdminMascotasPage.tsx ---
// Página de ADMIN: listar todas las mascotas y ver historial clínico.

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import MascotaCard from './MascotaCard';
import HistorialMascotaModal from './HistorialMascotaModal';

interface MascotaBackend {
  idMascota?: number;
  ID_Mascota?: number;
  nombre: string;
  especie: string;
  raza?: string;
  edad?: number;
}

interface MascotaUi {
  id: number;
  nombre: string;
  especie: string;
  edad: string;
  raza?: string;
}

const AdminMascotasPage = () => {
  const { token } = useAuth();
  const [mascotas, setMascotas] = useState<MascotaUi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [historial, setHistorial] = useState<{ id: number; nombre: string } | null>(null);

  const cargar = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get<MascotaBackend[]>(`http://localhost:8080/api/mascotas`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = Array.isArray(res.data) ? res.data : [];
      const mapped: MascotaUi[] = data.map((m) => ({
        id: (m.idMascota ?? m.ID_Mascota) as number,
        nombre: m.nombre,
        especie: m.especie,
        raza: m.raza,
        edad: `${m.edad ?? ''}${m.edad ? ' años' : ''}`,
      })).filter(m => !!m.id);
      setMascotas(mapped);
    } catch (err: any) {
      setError(err?.response?.data || 'No se pudieron cargar las mascotas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="stack" style={{ justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <div>
          <h1 className="page__title">Mascotas</h1>
          <p className="page__subtitle">Listado completo de mascotas del sistema.</p>
        </div>
      </div>

      {loading && <p>Cargando mascotas...</p>}
      {error && <p style={{ color: 'crimson' }}>{error}</p>}

      {!loading && !error && (
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {mascotas.map((m) => (
            <MascotaCard
              key={m.id}
              nombre={m.nombre}
              especie={m.especie}
              edad={m.edad}
              onVerHistorial={() => setHistorial({ id: m.id, nombre: m.nombre })}
              onAgendar={undefined}
            />
          ))}
        </div>
      )}

      {historial && (
        <HistorialMascotaModal
          idMascota={historial.id}
          nombreMascota={historial.nombre}
          onClose={() => setHistorial(null)}
        />
      )}
    </div>
  );
};

export default AdminMascotasPage;

