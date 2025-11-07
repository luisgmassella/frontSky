import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UsuarioService } from '../services/usuario.service';
import { Usuario } from '../services/usuario.model';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {

  userForm!: FormGroup;
  isEditMode = false;
  userId!: number;

  // 🔹 Lista fija de roles disponibles
  roles = [
    { id: 1, nombre: 'Administrador' },
    { id: 2, nombre: 'Técnico' },
    { id: 3, nombre: 'Supervisor' }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      id_rol: [null, Validators.required]
    });

    this.route.params.subscribe(p => {
      if (p['id']) {
        this.isEditMode = true;
        this.userId = +p['id'];
        this.cargarUsuario(this.userId);
      } else {
        // En modo crear → contraseña requerida
        this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
        this.userForm.get('password')?.updateValueAndValidity();
      }
    });
  }

  cargarUsuario(id: number): void {
    this.usuarioService.getUsuarioById(id).subscribe({
      next: (u: Usuario) => {
        this.userForm.patchValue({
          nombre: u.nombre,
          email: u.email,
          id_rol: this.mapRolToId(u.rol)
        });
      },
      error: (err) => {
        console.error('Error al cargar usuario:', err);
        Swal.fire('Error', 'No se pudo cargar el usuario.', 'error');
        this.router.navigate(['/dashboard/usuarios']);
      }
    });
  }

  // 🔹 Convierte rol string del backend al ID numérico
  private mapRolToId(rol: string): number {
    const match = this.roles.find(r => r.nombre.toUpperCase() === rol.toUpperCase());
    return match ? match.id : 2; // Por defecto Técnico
  }

  // 🔹 Convierte el ID numérico del form a string para enviar al backend
  private mapIdToRol(id: number): string {
    const match = this.roles.find(r => r.id === id);
    return match ? match.nombre.toUpperCase() : 'TECNICO';
  }

  private buildPayload(): any {
    const raw = this.userForm.getRawValue();

    return {
      nombre: raw.nombre,
      email: raw.email,
      password: raw.password || undefined,
      rol: this.mapIdToRol(raw.id_rol)
    };
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const payload = this.buildPayload();

    if (this.isEditMode) {
      this.usuarioService.updateUsuario(this.userId, payload).subscribe({
        next: () => {
          Swal.fire('Actualizado', 'Usuario actualizado con éxito.', 'success')
            .then(() => this.router.navigate(['/dashboard/usuarios']));
        },
        error: (err) => {
          console.error(err);
          Swal.fire('Error', 'No se pudo actualizar el usuario.', 'error');
        }
      });
    } else {
      this.usuarioService.createUsuario(payload).subscribe({
        next: () => {
          Swal.fire('Creado', 'Usuario registrado con éxito.', 'success')
            .then(() => this.router.navigate(['/dashboard/usuarios']));
        },
        error: (err) => {
          console.error(err);
          Swal.fire('Error', 'No se pudo crear el usuario.', 'error');
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/dashboard/usuarios']);
  }
}
