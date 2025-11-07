import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { VisitaService } from '../services/visita.service';
import { UsuarioService } from '../services/usuario.service';
import { AuthService } from '../services/auth.service';
import { Visita } from '../services/visita.model';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-visita-list',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe, NgClass],
  templateUrl: './visit-list.component.html',
  styleUrls: ['./visit-list.component.css']
})
export class VisitaListComponent implements OnInit {
  visitas: Visita[] = [];
  isLoading = true;
  userRol = '';
  userEmail = '';
  userId: number | null = null;

  constructor(
    private visitaService: VisitaService,
    private usuarioService: UsuarioService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userRol = this.authService.getRol() || 'SIN_ROL';
    this.userEmail = this.authService.getEmail() || '';

    // 1) Resolvemos el ID del usuario por email
    this.usuarioService.getUsuarios().subscribe((usuarios: any[]) => {
      const me = usuarios.find(u => (u.email || '').toLowerCase() === this.userEmail);
      this.userId = me?.id ?? null;

      // 2) Cargamos visitas y aplicamos filtros por rol
      this.cargarVisitas();
    });
  }

  cargarVisitas(): void {
    this.isLoading = true;
    this.visitaService.getVisitas().subscribe({
      next: (resp: Visita[]) => {
        let data = [...resp];

        // TECNICO: solo sus visitas del día
        if (this.userRol === 'TECNICO' && this.userId != null) {
          const hoy = new Date().toDateString();
          data = data.filter(v =>
            v.idTecnico === this.userId &&
            new Date(v.fechaPlanificada).toDateString() === hoy
          );
        }

        // SUPERVISOR/ADMIN: sin filtro extra (si quieres puedes filtrar por equipo)

        this.visitas = data;
        this.isLoading = false;
      },
      error: () => (this.isLoading = false)
    });
  }

  // Google Maps URL con lat/lon (si no hay datos, no abre)
  mapsUrl(v: Visita): string | null {
    const lat = v.latitudIngreso ?? v.latitudEgreso;
    const lon = v.longitudIngreso ?? v.longitudEgreso;
    if (lat == null || lon == null) return null;
    return `https://www.google.com/maps?q=${lat},${lon}`;
  }

  generarPDF(v: Visita) {
    const pdf = new jsPDF();
    pdf.text(`Reporte de Visita #${v.id}`, 10, 10);
    pdf.text(`Cliente: ${v.nombreCliente || ''}`, 10, 20);
    pdf.text(`Técnico: ${v.nombreTecnico || ''}`, 10, 30);
    pdf.text(`Estado: ${v.estado}`, 10, 40);
    pdf.text(`Fecha: ${v.fechaPlanificada}`, 10, 50);
    pdf.save(`visita_${v.id}.pdf`);
  }

  actualizarEstado(id: number, nuevoEstado: string): void {
    this.visitaService.updateEstadoVisita(id, nuevoEstado).subscribe({
      next: () => this.cargarVisitas(),
      error: () => {}
    });
  }
}
