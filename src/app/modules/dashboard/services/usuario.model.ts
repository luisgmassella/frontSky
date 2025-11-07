// Archivo: src/app/models/usuario.model.ts

/**
 * Modelo que representa al usuario según el DTO del backend (UsuarioDto).
 *
 * Estructura esperada desde la API:
 * {
 *   "id": 1,
 *   "nombre": "Luis",
 *   "email": "luis@gmail.com",
 *   "password": "123",
 *   "rol": "ADMINISTRADOR"
 * }
 */



export interface Usuario {
  id: number;            // ID del usuario (lo devuelve tu backend)
  nombre: string;
  email: string;
  password?: string;     // opcional al editar
  rol: string;           // nombre del rol que devuelve tu API
  // Si tu API recibe el ID del rol para crear/editar:
  idRol?: number;        // <- lo usaremos al enviar (map desde id_rol del form)
}

