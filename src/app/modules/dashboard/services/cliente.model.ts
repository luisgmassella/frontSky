// src/app/models/cliente.model.ts

/**
 * Modelo que representa al cliente según el DTO del backend (ClienteDto).
 *
 * Estructura esperada desde la API:
 * {
 *   "id": 1,
 *   "nombreEmpresa": "Tech Solutions",
 *   "contacto": "Juan Pérez",
 *   "telefono": "555-1234",
 *   "email": "juan@tech.com",
 *   "latitud": 123456789,
 *   "longitud": 987654321
 * }
 */

export interface Cliente {
  id: number;                // Identificador del cliente
  nombreEmpresa: string;     // Nombre de la empresa
  contacto: string;          // Persona de contacto
  telefono: string;          // Teléfono del cliente
  email: string;             // Correo electrónico
  latitud?: number;          // Coordenadas opcionales (se pueden omitir en el formulario)
  longitud?: number;         // Coordenadas opcionales
}
