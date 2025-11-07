import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { VisitaService } from '../services/visita.service';
import { UsuarioService } from '../services/usuario.service';
import { ClienteService } from '../services/cliente.service';
import { Usuario } from '../services/usuario.model';
import { Cliente } from '../services/cliente.model';

@Component({
  selector: 'app-visit-form',
  templateUrl: './visit-form.component.html',
  styleUrls: ['./visit-form.component.css']
})
export class VisitFormComponent implements OnInit {

  visitaForm!: FormGroup;
  tecnicos: Usuario[] = [];
  clientes: Cliente[] = [];

  constructor(
    private fb: FormBuilder,
    private visitaService: VisitaService,
    private usuarioService: UsuarioService,
    private clienteService: ClienteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // ✅ Crear formulario reactivo
    this.visitaForm = this.fb.group({
      idCliente: ['', Validators.required],
      idTecnico: ['', Validators.required],
      fechaPlanificada: ['', Validators.required],
      estado: ['PENDIENTE'],
      reporteVisita: ['', Validators.required]
    });

    // ✅ Cargar lista de técnicos (filtro por rol)
    this.usuarioService.getUsuarios().subscribe({
      next: (data: Usuario[]) => {
        this.tecnicos = data.filter(u =>
          typeof u.rol === 'string' && u.rol.toUpperCase().includes('TÉCNICO')
        );
      },
      error: err => console.error('Error al cargar técnicos:', err)
    });

    // ✅ Cargar lista de clientes
    this.clienteService.getClientes().subscribe({
      next: (data: Cliente[]) => {
        this.clientes = data;
      },
      error: err => console.error('Error al cargar clientes:', err)
    });
  }

  registrarVisita(): void {
    if (this.visitaForm.valid) {
      const visitaData = this.visitaForm.value;
      console.log('📤 Enviando datos al backend:', visitaData);

      this.visitaService.createVisita(visitaData).subscribe({
        next: () => {
          alert('✅ Visita registrada correctamente');
          this.router.navigate(['/dashboard/visitas']);
        },
        error: (err) => {
          console.error('Error al registrar la visita:', err);
          alert('❌ Ocurrió un error al registrar la visita.');
        }
      });
    } else {
      alert('Por favor complete todos los campos.');
    }
  }
}
