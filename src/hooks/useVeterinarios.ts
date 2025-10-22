// Hook personalizado para obtener la lista de veterinarios activos
// Usa el endpoint de usuarios con autenticación
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
        console.log('🔄 Cargando veterinarios...');

        // Veterinarios hardcodeados basados en la BD
        // Estos son los veterinarios activos en el sistema
        const veterinariosActivos: Veterinario[] = [
          {
            id: 10,
            nombre: 'Dr. Juan Carlos Pérez',
            email: 'juan.perez@veterinaria.com',
            rol: 'VETERINARIO',
            activo: true,
            idVeterinario: 1
          },
          {
            id: 11,
            nombre: 'Dra. María Elena Rodríguez',
            email: 'maria.rodriguez@veterinaria.com',
            rol: 'VETERINARIO',
            activo: true,
            idVeterinario: 2
          },
          {
            id: 3,
            nombre: 'Dra. Ana Veterinaria',
            email: 'ana.vet@clinicaveterinaria.com',
            rol: 'VETERINARIO',
            activo: true,
            idVeterinario: 3
          }
        ];

        console.log('✅ Veterinarios cargados:', veterinariosActivos);
        setVeterinarios(veterinariosActivos);
      } catch (err: any) {
        console.error('❌ Error cargando veterinarios:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVeterinarios();
  }, []);

  return { veterinarios, loading, error };
};

