import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UsuarioService } from '../services/usuario.service';
import { Usuario } from '../services/usuario.model';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  listaUsuarios: Usuario[] = [];
  isLoading = true;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.isLoading = true;
    this.usuarioService.getUsuarios().subscribe({
      next: (usuarios) => {
        this.listaUsuarios = usuarios ?? [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
        this.isLoading = false;
        Swal.fire('Error', 'No se pudo cargar la lista de usuarios.', 'error');
      }
    });
  }

  irCrear(): void {
    this.router.navigate(['/dashboard/usuarios/crear']);
  }

  editarUsuario(usuario: Usuario): void {
    this.router.navigate(['/dashboard/usuarios/editar', usuario.id]);
  }

 eliminarUsuario(usuario: Usuario): void {
  Swal.fire({
    title: '¿Estás seguro?',
    text: `Eliminarás al usuario "${usuario.nombre}". Esta acción no se puede deshacer.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      const id = usuario.id;

      if (!id) {
        Swal.fire('Error', 'No se encontró el ID del usuario.', 'error');
        return;
      }

      this.usuarioService.eliminarUsuario(id).subscribe({
        next: () => {
          // ✅ Mostrar éxito aunque la respuesta venga vacía
          Swal.fire('Eliminado', `${usuario.nombre} ha sido eliminado correctamente.`, 'success');
          this.cargarUsuarios(); // 🔁 Actualiza tabla
        },
        error: (err) => {
          console.error('Error al eliminar usuario:', err);
          // ⚙️ Si el backend devuelve 204, también consideramos éxito
          if (err.status === 200 || err.status === 204) {
            Swal.fire('Eliminado', `${usuario.nombre} ha sido eliminado correctamente.`, 'success');
            this.cargarUsuarios();
          } else {
            Swal.fire('Error', 'No se pudo eliminar el usuario.', 'error');
          }
        }
      });
    }
  });
}
}
