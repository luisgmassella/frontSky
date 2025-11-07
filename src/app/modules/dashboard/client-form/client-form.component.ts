import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClienteService } from '../services/cliente.service';
import { Cliente } from '../services/cliente.model';

@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.css']
})
export class ClientFormComponent implements OnInit {

  clienteForm!: FormGroup;
  isEditMode = false;
  clienteId!: number;

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Inicializar formulario
    this.clienteForm = this.fb.group({
      nombreEmpresa: ['', Validators.required],
      contacto: ['', Validators.required],
      telefono: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      latitud: [''],
      longitud: ['']
    });

    // Detectar si estamos en modo edición
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.clienteId = +params['id'];
        this.cargarCliente(this.clienteId);
      }
    });
  }

  // Cargar datos si se está editando
  cargarCliente(id: number): void {
    this.clienteService.getClienteById(id).subscribe({
      next: (data: Cliente) => {
        // Asegurar compatibilidad con el modelo
        this.clienteForm.patchValue({
          nombreEmpresa: data.nombreEmpresa,
          contacto: data.contacto,
          telefono: data.telefono,
          email: data.email,
          latitud: data.latitud,
          longitud: data.longitud
        });
      },
      error: err => {
        console.error('Error al cargar cliente:', err);
        alert('Error al cargar datos del cliente');
      }
    });
  }

  // Guardar cliente (crear o actualizar)
  onSubmit(): void {
    if (this.clienteForm.invalid) {
      alert('Por favor completa todos los campos obligatorios.');
      return;
    }

    const clienteData: Cliente = {
      id: this.clienteId || 0,
      ...this.clienteForm.value
    };

    if (this.isEditMode) {
      // Modo edición (PUT)
      this.clienteService.updateCliente(this.clienteId, clienteData).subscribe({
        next: () => {
          alert('✅ Cliente actualizado correctamente');
          this.router.navigate(['/dashboard/clientes']);
        },
        error: (err) => {
          console.error('Error al actualizar cliente:', err);
          alert('❌ Error al actualizar cliente');
        }
      });
    } else {
      // Modo creación (POST)
      this.clienteService.createCliente(clienteData).subscribe({
        next: () => {
          alert('✅ Cliente creado correctamente');
          this.router.navigate(['/dashboard/clientes']);
        },
        error: (err) => {
          console.error('Error al crear cliente:', err);
          alert('❌ Error al crear cliente');
        }
      });
    }
  }
}
