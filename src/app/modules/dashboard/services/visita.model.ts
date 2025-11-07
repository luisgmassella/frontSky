export interface Visita {
  id: number;
  idCliente: number;
  nombreCliente: string;
  idTecnico: number;
  nombreTecnico: string;
  fechaPlanificada: string;
  estado: string;
  reporteVisita?: string;
  fechaInicioReal?: string;
  fechaFinReal?: string;
  latitudIngreso?: number;
  longitudIngreso?: number;
  latitudEgreso?: number;
  longitudEgreso?: number;
}
