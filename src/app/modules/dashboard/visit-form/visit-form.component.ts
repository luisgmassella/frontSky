import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Visita } from '../services/visita.model';
import { AuthService } from '../services/auth.service';
import { UsuarioService } from '../services/usuario.service';

@Component({
  selector: 'app-visit-form',
  templateUrl: './visit-form.component.html',
  styleUrls: ['./visit-form.component.css']
})
export class VisitFormComponent implements OnInit {
  visitForm: FormGroup;
  visitId: number | null = null;
  title: string = 'Registrar Nueva Visita';

  userRol = '';
  tecnicos: Array<{ id: number; nombre: string }> = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private usuarioService: UsuarioService
  ) {
    this.visitForm = this.fb.group({
      idCliente: [null, Validators.required],
      idTecnico: [null, Validators.required],
      fechaPlanificada: [this.formatDate(new Date()), Validators.required],
      estado: ['PENDIENTE', Validators.required],
      reporteVisita: ['', [Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    this.userRol = this.authService.getRol() || 'SIN_ROL';

    // Cargar técnicos solo para supervisor/administrador
    if (this.userRol === 'SUPERVISOR' || this.userRol === 'ADMINISTRADOR') {
      this.usuarioService.getUsuarios().subscribe((usuarios: any[]) => {
        this.tecnicos = usuarios
          .filter(u => (u.rol || '').toUpperCase() === 'TECNICO')
          .map(u => ({ id: u.id, nombre: u.nombre }));
      });
    }

    // Edición
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.visitId = +idParam;
        this.title = `Editar Visita Técnica #${this.visitId}`;
        // TODO: si quieres, carga del detalle real desde el servicio
      }
    });
  }

  private formatDate(date: Date): string {
    const d = new Date(date);
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  }

  saveVisit(): void {
    if (this.visitForm.invalid) {
      this.visitForm.markAllAsTouched();
      return;
    }

    const payload = this.visitForm.value as Partial<Visita>;

    // Aquí llamas a create/update del servicio real.
    // Por ahora, navega al listado.
    this.router.navigate(['/dashboard/visitas']);
  }

  cancel(): void {
    this.router.navigate(['/dashboard/visitas']);
  }
}
