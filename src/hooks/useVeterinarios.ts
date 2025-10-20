// Hook personalizado para obtener la lista de veterinarios activos
// No requiere autenticación (endpoint público)
import { useState, useEffect } from 'react';

// Interfaz del veterinario según respuesta del backend
interface Veterinario {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  activo: boolean;
  idVeterinario: number;
}

export const useVeterinarios = () => {
  const [veterinarios, setVeterinarios] = useState<Veterinario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVeterinarios = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/usuarios/veterinarios/activos');
        if (!response.ok) throw new Error('Error al cargar veterinarios');
        const data = await response.json();
        setVeterinarios(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVeterinarios();
  }, []);

  return { veterinarios, loading, error };
};

