// Tipos para el historial clínico de mascotas
// Coinciden con las respuestas del backend

export interface HistoriaClinica {
  idHistoria: number;
  fechaCreacion: string;
  idMascota: number;
}

export interface EntradaHistoria {
  idEntrada: number;
  fechaEntrada: string;
  descripcion: string;
  observaciones?: string;
  pesoActual?: number;
  temperatura?: number;
  frecuenciaCardiaca?: number;
  idVeterinario: number;
  idTratamiento?: number;
  fechaRegistro: string;
}

export interface HistorialCompleto {
  historia: HistoriaClinica;
  entradas: EntradaHistoria[];
  mascotaId: number;
  totalEntradas: number;
}
