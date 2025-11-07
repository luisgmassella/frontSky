export class Usuario {
    id_usuario: number;
    nombre: string;
    email: string;
    // Agregados para corregir errores de compilación en el formulario
    password?: string;
    rol?: string;
    id_rol: number;

    constructor(
        id_usuario: number,
        nombre: string,
        email: string,
        id_rol: number,
        password?: string,
        rol?: string
    ) {
        this.id_usuario = id_usuario;
        this.nombre = nombre;
        this.email = email;
        this.id_rol = id_rol;
        this.password = password;
        this.rol = rol;
    }
}
